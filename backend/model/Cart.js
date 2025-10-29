const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userName: String,
  userPhone: String,
  userEmail: String,
  userAddress: String,
  productId: { type: String, required: true },
  name: String,
  price: Number,
  afterDiscountPrice: Number,
  description: String,
  category: String,
  images: [String],
  quantity: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Cart", cartSchema);
