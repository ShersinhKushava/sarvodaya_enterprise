import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddBlog = ({ toggleSidebar, isOpen }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    author: '',
    published: true
  });
  const [image, setImage] = useState(null);
  const [imagePosition, setImagePosition] = useState('center');
  const [imageAlt, setImageAlt] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('Admintoken');
      const formDataToSend = new FormData();

      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });

      if (image) {
        formDataToSend.append('images', image);
      }

      // Send image position and alt
      formDataToSend.append('imagePosition', imagePosition);
      formDataToSend.append('imageAlt', imageAlt);

      const response = await fetch('https://sarvodaya-enterprise.onrender.com/api/blogs', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      if (response.ok) {
        alert('Blog created successfully!');
        navigate('/manage-blogs');
      } else {
        const errorData = await response.json();
        alert(`Failed to create blog: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error creating blog:', error);
      alert('Error creating blog. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`content ${isOpen ? 'open' : ''}`}>
        {/* Add Blog Form */}
        <div className="container-fluid pt-4 px-4">
          <div className="row g-4">
            <div className="col-sm-12 col-xl-12">
              <div className="bg-light rounded h-100 p-4">
                <h6 className="mb-4">Add New Blog</h6>
                <form onSubmit={handleSubmit}>
                  <div className="row mb-3">
                    <label htmlFor="title" className="col-sm-2 col-form-label">Title</label>
                    <div className="col-sm-10">
                      <input
                        type="text"
                        className="form-control"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <label htmlFor="excerpt" className="col-sm-2 col-form-label">Excerpt</label>
                    <div className="col-sm-10">
                      <input
                        type="text"
                        className="form-control"
                        id="excerpt"
                        name="excerpt"
                        value={formData.excerpt}
                        onChange={handleInputChange}
                        placeholder="Short description (optional)"
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <label htmlFor="category" className="col-sm-2 col-form-label">Category</label>
                    <div className="col-sm-10">
                      <input
                        type="text"
                        className="form-control"
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <label htmlFor="author" className="col-sm-2 col-form-label">Author</label>
                    <div className="col-sm-10">
                      <input
                        type="text"
                        className="form-control"
                        id="author"
                        name="author"
                        value={formData.author}
                        onChange={handleInputChange}
                        placeholder="Admin (optional)"
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <label htmlFor="content" className="col-sm-2 col-form-label">Content</label>
                    <div className="col-sm-10">
                      <textarea
                        className="form-control"
                        id="content"
                        name="content"
                        rows="10"
                        value={formData.content}
                        onChange={handleInputChange}
                        required
                      ></textarea>
                    </div>
                  </div>
                  <div className="row mb-3">
                    <label htmlFor="image" className="col-sm-2 col-form-label">Image</label>
                    <div className="col-sm-10">
                      <input
                        type="file"
                        className="form-control"
                        id="image"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                      <small className="form-text text-muted">Upload a single image (optional)</small>
                      {image && (
                        <div className="mt-2 p-2 border rounded">
                          <div className="row">
                            <div className="col-md-4">
                              <img src={URL.createObjectURL(image)} alt="Preview" className="img-thumbnail" style={{width: '100px', height: '100px'}} />
                            </div>
                            <div className="col-md-4">
                              <label>Position:</label>
                              <select
                                className="form-control"
                                value={imagePosition}
                                onChange={(e) => setImagePosition(e.target.value)}
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
                                value={imageAlt}
                                onChange={(e) => setImageAlt(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-sm-10 offset-sm-2">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="published"
                          name="published"
                          checked={formData.published}
                          onChange={handleInputChange}
                        />
                        <label className="form-check-label" htmlFor="published">
                          Publish immediately
                        </label>
                      </div>
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Blog'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    
  );
};

export default AddBlog;
