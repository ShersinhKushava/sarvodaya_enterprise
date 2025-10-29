let mongoose = require('mongoose');
let Schema = mongoose.Schema;

const cartSchema = new Schema({
  _id: String,
  name: String,
  price: Number,
  afterDiscountPrice: Number,
  description: String,
  category: String,
  images: [String],
  email: String,
  address: String,
  mobile: String,
});

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
