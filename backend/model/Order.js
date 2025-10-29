const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userEmail: { type: String, required: true },
  userDetails: {
    name: String,
    phone: String,
    email: String,
    address: String,
  },
  shippingDetails: {
    name: String,
    address: String,
    phone: String,
  },
  products: [{
    productId: String,
    name: String,
    price: Number,
    afterDiscountPrice: Number,
    description: String,
    category: String,
    images: [String],
    quantity: Number,
  }],
  totalSum: { type: Number, required: true },
  orderId: { type: String, unique: true },
  status: { type: String, default: "pending" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);
