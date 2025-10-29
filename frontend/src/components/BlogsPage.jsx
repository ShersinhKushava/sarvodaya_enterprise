import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const BlogsPage = () => {
  const { id } = useParams();
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    if (blogs.length > 0 && id) {
      const blog = blogs.find(b => b._id === id);
      setSelectedBlog(blog);
    } else if (blogs.length > 0 && !id) {
      // If no specific blog ID, show the first blog
      setSelectedBlog(blogs[0]);
    }
  }, [blogs, id]);

  const fetchBlogs = async () => {
    try {
      const response = await fetch('https://sarvodaya-enterprise.onrender.com/api/blogs');
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



  if (loading) {
    return (
      <div className="container py-5">
        <div className="row">
          <div className="col-12 text-center">
            <p>Loading blogs...</p>
          </div>
        </div>
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="container py-5">
        <div className="row">
          <div className="col-12 text-center">
            <p>No blogs available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row">
        {/* Main Blog Content */}
        <div className="col-lg-8">
          {selectedBlog && (
            <article className="blog-post">
              <header className="mb-4">
                <h1 className="display-4">{selectedBlog.title}</h1>
                <div className="post-meta d-flex text-uppercase gap-3 my-3 align-items-center">
                  <div className="meta-date">
                    <svg width={16} height={16}><use xlinkHref="#calendar" /></svg>
                    {new Date(selectedBlog.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  <div className="meta-categories">
                    <svg width={16} height={16}><use xlinkHref="#category" /></svg>
                    {selectedBlog.category}
                  </div>
                  <div className="meta-author">
                    <svg width={16} height={16}><use xlinkHref="#user" /></svg>
                    {selectedBlog.author}
                  </div>
                </div>
              </header>

              {/* Blog Image */}
              {selectedBlog.image && (
                <div className="blog-image mb-4">
                  {(() => {
                    const getImageStyle = (position) => {
                      const baseStyle = { maxWidth: '100%', height: 'auto', marginBottom: '20px' };

                      switch (position) {
                        case 'left':
                          return { ...baseStyle, float: 'left', marginRight: '20px', marginBottom: '10px', maxWidth: '300px' };
                        case 'right':
                          return { ...baseStyle, float: 'right', marginLeft: '20px', marginBottom: '10px', maxWidth: '300px' };
                        case 'center':
                          return { ...baseStyle, display: 'block', margin: '20px auto', maxWidth: '500px' };
                        case 'full-width':
                          return { ...baseStyle, width: '100%', margin: '20px 0' };
                        default:
                          return { ...baseStyle, display: 'block', margin: '20px auto', maxWidth: '500px' };
                      }
                    };

                    return (
                      <img
                        src={`https://sarvodaya-enterprise.onrender.com/uploads/${selectedBlog.image.url}`}
                        alt={selectedBlog.image.alt || selectedBlog.title}
                        className="img-fluid mb-3"
                        style={getImageStyle(selectedBlog.image.position)}
                      />
                    );
                  })()}
                </div>
              )}

              {/* Blog Content */}
              <div className="blog-content">
                <div dangerouslySetInnerHTML={{ __html: selectedBlog.content.replace(/\n/g, '<br>') }} />
              </div>
            </article>
          )}
        </div>

        {/* Sidebar with Blog List */}
        <div className="col-lg-4">
          <div className="sidebar">
            <h3 className="mb-4">All Blogs</h3>
            <div className="blog-list">
              {blogs.map((blog) => (
                <Link
                  key={blog._id}
                  to={`/blogs/${blog._id}`}
                  className={`blog-item mb-3 p-3 border rounded text-decoration-none ${
                    selectedBlog && selectedBlog._id === blog._id ? 'bg-light border-primary' : ''
                  }`}
                  style={{ cursor: 'pointer', display: 'block' }}
                >
                  <h5 className="mb-2 text-dark">{blog.title}</h5>
                  <div className="blog-meta small text-muted mb-2">
                    <span>{new Date(blog.createdAt).toLocaleDateString()}</span> •
                    <span className="ms-1">{blog.category}</span>
                  </div>
                  <p className="small mb-0 text-muted">
                    {blog.excerpt || blog.content.substring(0, 100) + '...'}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogsPage;
