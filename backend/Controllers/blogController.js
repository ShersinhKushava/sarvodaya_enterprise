const Blog = require('../model/Blog');
const path = require('path');
const fs = require('fs');

// Create blog
exports.createBlog = async (req, res) => {
  try {
    const { title, content, excerpt, category, author, published, imagePosition, imageAlt } = req.body;
    let image = {};

    if (req.files && req.files.length > 0) {
      image = {
        url: req.files[0].filename,
        position: imagePosition || 'center',
        alt: imageAlt || ''
      };
    }

    const blog = new Blog({
      title,
      content,
      excerpt,
      category,
      image,
      author: author || 'Admin',
      published: published !== undefined ? published : true
    });

    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all blogs
exports.getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ published: true }).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single blog by ID
exports.getBlogById = async (req, res) => {
  try {
    const blogId = req.params.id;
    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update blog
exports.updateBlog = async (req, res) => {
  try {
    const { title, content, excerpt, category, author, published, imagePosition, imageAlt } = req.body;
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });

    // Delete old image if new image uploaded
    if (req.files && req.files.length > 0) {
      if (blog.image && blog.image.url) {
        const filePath = path.join(__dirname, '../uploads', blog.image.url);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }

      // Set new image
      blog.image = {
        url: req.files[0].filename,
        position: imagePosition || 'center',
        alt: imageAlt || ''
      };
    }

    blog.title = title;
    blog.content = content;
    blog.excerpt = excerpt;
    blog.category = category;
    blog.author = author || blog.author;
    blog.published = published !== undefined ? published : blog.published;

    await blog.save();
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete blog
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });

    if (blog.image && blog.image.url) {
      const filePath = path.join(__dirname, '../uploads', blog.image.url);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: 'Blog deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
