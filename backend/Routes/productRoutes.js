const express = require('express');
const router = express.Router();
const upload = require('../Middleware/uploadMiddleware');
const productController = require('../Controllers/productController');

// Max 5 images
router.post('/', upload.array('images', 5), productController.createProduct);
router.get('/', productController.getProducts);
router.put('/:id', upload.array('images', 5), productController.updateProduct);
router.delete('/:id', productController.deleteProduct);


// New route: get single product
router.get("/products/:id", productController.getProductById);

module.exports = router;
