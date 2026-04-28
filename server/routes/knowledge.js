const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { getDiseaseInfo } = require('../utils/gemini');
const Post = require('../models/Post');

const DISEASE_CATEGORIES = {
  respiratory:    ['Pneumonia', 'Tuberculosis', 'COPD', 'Asthma', 'COVID-19'],
  cardiac:        ['Heart Disease', 'Hypertension', 'Arrhythmia', 'Heart Failure'],
  neurological:   ['Stroke', "Alzheimer's", "Parkinson's", 'Epilepsy', 'Migraine'],
  metabolic:      ['Diabetes Type 1', 'Diabetes Type 2', 'Obesity', 'Thyroid Disorders'],
  oncological:    ['Lung Cancer', 'Breast Cancer', 'Colon Cancer', 'Skin Cancer'],
  musculoskeletal:['Arthritis', 'Osteoporosis', 'Fractures', 'Scoliosis']
};

// Get all categories + diseases
router.get('/categories', (req, res) => res.json(DISEASE_CATEGORIES));

// Get AI info on a disease
router.get('/disease/:name', protect, async (req, res) => {
  try {
    const info = await getDiseaseInfo(req.params.name);
    res.json(info);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Community posts by category
router.get('/posts/:category', protect, async (req, res) => {
  const posts = await Post.find({ category: req.params.category })
    .populate('author', 'name role')
    .populate('comments.author', 'name role')
    .sort('-createdAt');
  res.json(posts);
});

// Create post
router.post('/posts', protect, async (req, res) => {
  const post = await Post.create({
    author:   req.user._id,
    category: req.body.category,
    title:    req.body.title,
    body:     req.body.body
  });
  res.json(await post.populate('author', 'name role'));
});

// Like post
router.post('/posts/:id/like', protect, async (req, res) => {
  const post = await Post.findById(req.params.id);
  const liked = post.likes.includes(req.user._id);
  if (liked) post.likes.pull(req.user._id);
  else post.likes.push(req.user._id);
  await post.save();
  res.json({ likes: post.likes.length, liked: !liked });
});

// Add comment
router.post('/posts/:id/comment', protect, async (req, res) => {
  const post = await Post.findByIdAndUpdate(
    req.params.id,
    { $push: { comments: { author: req.user._id, text: req.body.text } } },
    { new: true }
  ).populate('comments.author', 'name role');
  res.json(post.comments);
});

module.exports = router;