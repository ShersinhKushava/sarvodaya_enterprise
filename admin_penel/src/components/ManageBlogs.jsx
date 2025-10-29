import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const ManageBlogs = ({ toggleSidebar, isOpen }) => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    author: '',
    published: true
  });
  const [editImage, setEditImage] = useState(null);
  const [editImagePosition, setEditImagePosition] = useState('center');
  const [editImageAlt, setEditImageAlt] = useState('');

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const token = localStorage.getItem('Admintoken');
      const response = await fetch('http://localhost:8080/api/blogs', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setBlogs(data);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setEditFormData({
      title: blog.title,
      content: blog.content,
      excerpt: blog.excerpt || '',
      category: blog.category,
      author: blog.author,
      published: blog.published
    });
    setEditImage(null);
    setEditImagePosition(blog.image ? blog.image.position : 'center');
    setEditImageAlt(blog.image ? blog.image.alt : '');
    setShowEditModal(true);
  };

  const handleEditInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleEditImageChange = (e) => {
    setEditImage(e.target.files[0]);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('Admintoken');
      const formDataToSend = new FormData();

      Object.keys(editFormData).forEach(key => {
        formDataToSend.append(key, editFormData[key]);
      });

      if (editImage) {
        formDataToSend.append('images', editImage);
      }

      // Send image position and alt
      formDataToSend.append('imagePosition', editImagePosition);
      formDataToSend.append('imageAlt', editImageAlt);

      const response = await fetch(`http://localhost:8080/api/blogs/${editingBlog._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      if (response.ok) {
        alert('Blog updated successfully!');
        setShowEditModal(false);
        fetchBlogs();
      } else {
        const errorData = await response.json();
        alert(`Failed to update blog: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating blog:', error);
      alert('Error updating blog. Please try again.');
    }
  };

  const handleDelete = async (blogId) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;

    try {
      const token = localStorage.getItem('Admintoken');
      const response = await fetch(`http://localhost:8080/api/blogs/${blogId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('Blog deleted successfully!');
        fetchBlogs();
      } else {
        const errorData = await response.json();
        alert(`Failed to delete blog: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
      alert('Error deleting blog. Please try again.');
    }
  };

  return (
    <div className={`content ${isOpen ? 'open' : ''}`}>
        {/* Manage Blogs Table */}
        <div className="container-fluid pt-4 px-4">
          <div className="row g-4">
            <div className="col-12">
              <div className="bg-light rounded h-100 p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h6 className="mb-0">Manage Blogs</h6>
                  <button className="btn btn-primary" onClick={() => navigate('/add-blog')}>
                    Add New Blog
                  </button>
                </div>

                {loading ? (
                  <div className="text-center">
                    <p>Loading blogs...</p>
                  </div>
                ) : blogs.length === 0 ? (
                  <div className="text-center">
                    <p>No blogs found</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Category</th>
                          <th>Author</th>
                          <th>Published</th>
                          <th>Date</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {blogs.map((blog) => (
                          <tr key={blog._id}>
                            <td>{blog.title}</td>
                            <td>{blog.category}</td>
                            <td>{blog.author}</td>
                            <td>
                              <span className={`badge ${blog.published ? 'bg-success' : 'bg-warning'}`}>
                                {blog.published ? 'Published' : 'Draft'}
                              </span>
                            </td>
                            <td>{new Date(blog.createdAt).toLocaleDateString()}</td>
                            <td>
                              <button
                                className="btn btn-sm btn-primary me-2"
                                onClick={() => handleEdit(blog)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDelete(blog._id)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Blog</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={editFormData.title}
                onChange={handleEditInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Excerpt</Form.Label>
              <Form.Control
                type="text"
                name="excerpt"
                value={editFormData.excerpt}
                onChange={handleEditInputChange}
                placeholder="Short description (optional)"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                name="category"
                value={editFormData.category}
                onChange={handleEditInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Author</Form.Label>
              <Form.Control
                type="text"
                name="author"
                value={editFormData.author}
                onChange={handleEditInputChange}
                placeholder="Admin (optional)"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={10}
                name="content"
                value={editFormData.content}
                onChange={handleEditInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Image (optional - will replace existing image)</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleEditImageChange}
              />
              <Form.Text className="text-muted">
                Upload a single image. Leave empty to keep existing image.
              </Form.Text>
              {editImage && (
                <div className="mt-2 p-2 border rounded">
                  <div className="row">
                    <div className="col-md-4">
                      <img src={URL.createObjectURL(editImage)} alt="Preview" className="img-thumbnail" style={{width: '100px', height: '100px'}} />
                    </div>
                    <div className="col-md-4">
                      <label>Position:</label>
                      <select
                        className="form-control"
                        value={editImagePosition}
                        onChange={(e) => setEditImagePosition(e.target.value)}
                      >
                        <option value="left">Left</option>
                        <option value="center">Center</option>
                        <option value="right">Right</option>
                        <option value="full-width">Full Width</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label>Alt Text:</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Alt text for image"
                        value={editImageAlt}
                        onChange={(e) => setEditImageAlt(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Published"
                name="published"
                checked={editFormData.published}
                onChange={handleEditInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleEditSubmit}>
            Update Blog
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManageBlogs;
