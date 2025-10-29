const express = require("express");
const router = express.Router();
const { addToCart, getCart, updateCartQuantity, deleteCartItem } = require("../Controllers/cartController");

// POST /api/cart
router.post("/", addToCart);

// GET /api/cart?userId=...&userEmail=...
router.get("/", getCart);

// PUT /api/cart/quantity
router.put("/quantity", updateCartQuantity);

// DELETE /api/cart
router.delete("/", deleteCartItem);

module.exports = router;
