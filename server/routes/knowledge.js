const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { getDiseaseInfo } = require('../utils/gemini');
const { DISEASE_DATABASE } = require('../utils/diseaseData');
const { DISEASE_STATS } = require('../utils/sampleData');
const Post = require('../models/Post');

const RESPIRATORY_DISEASES = ['Pneumonia', 'Tuberculosis', 'COPD', 'Asthma'];

// Get all 4 disease summaries with stats
router.get('/diseases', (req, res) => {
  const summary = RESPIRATORY_DISEASES.map(name => ({
    name,
    severity:     DISEASE_DATABASE[name].severity,
    overview:     DISEASE_DATABASE[name].overview,
    confidence:   DISEASE_DATABASE[name].baseConfidence,
    keySymptoms:  DISEASE_DATABASE[name].keySymptoms.slice(0, 4),
    hallmarks:    DISEASE_DATABASE[name].xrayHallmarks.slice(0, 3),
    stats:        DISEASE_STATS[name],
    riskFactors:  DISEASE_DATABASE[name].riskFactors.slice(0, 3)
  }));
  res.json(summary);
});

// Get full disease info by name
router.get('/disease/:name', protect, (req, res) => {
  try {
    const info = getDiseaseInfo(req.params.name);
    const stats = DISEASE_STATS[req.params.name] || {};
    res.json({ ...info, stats });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

// Get community posts by disease
router.get('/posts/:disease', protect, async (req, res) => {
  try {
    const filter = req.params.disease === 'all'
      ? {}
      : { disease: req.params.disease };

    const posts = await Post.find(filter)
      .populate('author', 'name role')
      .populate('comments.author', 'name role')
      .sort('-createdAt')
      .limit(50);
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create post
router.post('/posts', protect, async (req, res) => {
  try {
    const { disease, title, body } = req.body;
    if (!title || !body)
      return res.status(400).json({ message: 'Title and body required' });
    const post = await Post.create({
      author: req.user._id,
      disease: disease || 'General',
      title,
      body
    });
    res.json(await post.populate('author', 'name role'));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Like post
router.post('/posts/:id/like', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    const liked = post.likes.includes(req.user._id);
    if (liked) post.likes.pull(req.user._id);
    else post.likes.push(req.user._id);
    await post.save();
    res.json({ likes: post.likes.length, liked: !liked });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Comment
router.post('/posts/:id/comment', protect, async (req, res) => {
  try {
    if (!req.body.text)
      return res.status(400).json({ message: 'Comment text required' });
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $push: { comments: { author: req.user._id, text: req.body.text } } },
      { new: true }
    ).populate('comments.author', 'name role');
    res.json(post.comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;