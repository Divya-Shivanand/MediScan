const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { getDiseaseInfo } = require('../utils/gemini');
const { DISEASE_DATABASE } = require('../utils/diseaseData');
const Post = require('../models/Post');

const RESPIRATORY_DISEASES = ['Pneumonia', 'Tuberculosis', 'COPD', 'Asthma'];

// Get all disease summaries
router.get('/diseases', (req, res) => {
  const summary = RESPIRATORY_DISEASES.map(name => ({
    name,
    severity:  DISEASE_DATABASE[name].severity,
    overview:  DISEASE_DATABASE[name].overview,
    confidence: DISEASE_DATABASE[name].baseConfidence,
    symptomCount: DISEASE_DATABASE[name].keySymptoms.length
  }));
  res.json(summary);
});

// Get detailed disease info (from local DB — no AI call needed)
router.get('/disease/:name', protect, (req, res) => {
  try {
    const info = getDiseaseInfo(req.params.name);
    res.json(info);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

// Get community posts by disease
router.get('/posts/:disease', protect, async (req, res) => {
  try {
    const posts = await Post.find({ disease: req.params.disease })
      .populate('author', 'name role')
      .populate('comments.author', 'name role')
      .sort('-createdAt')
      .limit(50);
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create community post
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

// Like / unlike post
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

// Add comment
router.post('/posts/:id/comment', protect, async (req, res) => {
  try {
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