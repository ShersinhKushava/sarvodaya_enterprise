const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  excerpt: { type: String },
  category: { type: String, required: true },
  image: {
    url: { type: String },
    position: { type: String, enum: ['left', 'right', 'center', 'full-width'], default: 'center' },
    alt: { type: String, default: '' }
  },
  author: { type: String, default: 'Admin' },
  published: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);
