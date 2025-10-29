const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  afterDiscountPrice: { type: Number, required: true },
  description: { type: String },
  category: { type: String, required: true },
  images: [{ type: String }] // Array for multiple images
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
