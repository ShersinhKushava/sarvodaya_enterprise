const Product = require('../model/Product');
const path = require('path');
const fs = require('fs');

// Create product
exports.createProduct = async (req, res) => {
  try {
    const { name, price, afterDiscountPrice, description, category } = req.body;
    const images = req.files ? req.files.map(file => file.filename) : [];

    const product = new Product({ name, price, afterDiscountPrice, description, category, images });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// New: Get single product by ID
exports.getProductById = async (req, res) => {
  try {
    const productId = req.params.id; // get id from URL
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const { name, price, afterDiscountPrice, description, category } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    // Delete old images if new images uploaded
    if (req.files && req.files.length > 0) {
      product.images.forEach(img => {
        const filePath = path.join(__dirname, '../uploads', img);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      });
      product.images = req.files.map(file => file.filename);
    }

    product.name = name;
    product.price = price;
    product.afterDiscountPrice = afterDiscountPrice;
    product.description = description;
    product.category = category;

    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    product.images.forEach(img => {
      const filePath = path.join(__dirname, '../uploads', img);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    });

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
