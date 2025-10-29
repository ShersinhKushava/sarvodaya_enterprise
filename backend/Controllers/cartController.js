const Cart = require("../model/Cart");

// Add product to cart
const addToCart = async (req, res) => {
  try {
    const { userId, userName, userPhone, userEmail, userAddress, productId, name, price, afterDiscountPrice, description, category, images, quantity } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "User not logged in" });
    }

    // Check if this product already exists for the user
    const existingItem = await Cart.findOne({ userId, productId });
    if (existingItem) {
      existingItem.quantity += quantity || 1;
      const updatedItem = await existingItem.save();
      return res.status(200).json(updatedItem);
    }

    // Create new cart item
    const cartItem = new Cart({
      userId,
      userName,
      userPhone,
      userEmail,
      userAddress,
      productId,
      name,
      price,
      afterDiscountPrice,
      description,
      category,
      images,
      quantity: quantity || 1
    });

    const savedItem = await cartItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get cart items for a user
const getCart = async (req, res) => {
  try {
    const { userId, userEmail } = req.query;

    if (!userId || !userEmail) {
      return res.status(401).json({ message: "User not logged in" });
    }

    // Fetch cart items for the user
    const cartItems = await Cart.find({ userId, userEmail });

    res.status(200).json(cartItems);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update cart item quantity
const updateCartQuantity = async (req, res) => {
  try {
    const { userId, userEmail, productId, quantity } = req.body;

    if (!userId || !userEmail) {
      return res.status(401).json({ message: "User not logged in" });
    }

    if (quantity <= 0) {
      return res.status(400).json({ message: "Quantity must be greater than 0" });
    }

    // Find and update the cart item
    const updatedItem = await Cart.findOneAndUpdate(
      { userId, userEmail, productId },
      { quantity },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.status(200).json(updatedItem);
  } catch (error) {
    console.error("Error updating cart quantity:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete cart item
const deleteCartItem = async (req, res) => {
  try {
    const { userId, userEmail, productId } = req.body;

    if (!userId || !userEmail) {
      return res.status(401).json({ message: "User not logged in" });
    }

    // Find and delete the cart item
    const deletedItem = await Cart.findOneAndDelete({ userId, userEmail, productId });

    if (!deletedItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.status(200).json({ message: "Item removed from cart" });
  } catch (error) {
    console.error("Error deleting cart item:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { addToCart, getCart, updateCartQuantity, deleteCartItem };
