const express = require('express');
const router = express.Router();
const upload = require('../Middleware/uploadMiddleware');
const blogController = require('../Controllers/blogController');

// Max 5 images per blog
router.post('/', upload.array('images', 5), blogController.createBlog);
router.get('/', blogController.getBlogs);
router.get('/:id', blogController.getBlogById);
router.put('/:id', upload.array('images', 5), blogController.updateBlog);
router.delete('/:id', blogController.deleteBlog);

module.exports = router;
