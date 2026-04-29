const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  author:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  disease:  {
    type: String,
    enum: ['Pneumonia', 'Tuberculosis', 'COPD', 'Asthma', 'General'],
    default: 'General'
  },
  title:    { type: String, required: true },
  body:     { type: String, required: true },
  likes:    [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{
    author:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text:      { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);