const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  author:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  title:    String,
  body:     String,
  likes:    [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{
    author:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text:    String,
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);