import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/blogs');
      if (response.ok) {
        const data = await response.json();
        // Get only the first 3 blogs for home page
        setBlogs(data.slice(0, 3));
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section id="latest-blog" className="py-5">
        <div className="container-fluid">
          <div className="row">
            <div className="section-header d-flex align-items-center justify-content-between my-5">
              <h2 className="section-title">Our Recent Blog</h2>
              <div className="btn-wrap align-right">
                <Link to="/blogs" className="d-flex align-items-center nav-link">Read All Articles <svg width={24} height={24}><use xlinkHref="#arrow-right" /></svg></Link>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12 text-center">
              <p>Loading blogs...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section id="latest-blog" className="py-5">
        <div className="container-fluid">
          <div className="row">
            <div className="section-header d-flex align-items-center justify-content-between my-5">
              <h2 className="section-title">Our Recent Blog</h2>
              <div className="btn-wrap align-right">
                <Link to="/blogs" className="d-flex align-items-center nav-link">Read All Articles <svg width={24} height={24}><use xlinkHref="#arrow-right" /></svg></Link>
              </div>
            </div>
          </div>
          <div className="row">
            {blogs.length === 0 ? (
              <div className="col-12 text-center">
                <p>No blogs available</p>
              </div>
            ) : (
              blogs.map((blog) => (
                <div className="col-12 col-sm-6 col-md-4" key={blog._id}>
                  <article className="post-item card border-0 shadow-sm p-3">
                    <div className="image-holder zoom-effect" style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '1px solid #ddd', borderRadius: '8px', padding: '10px', backgroundColor: '#f8f9fa' }}>
                      <Link to={`/blogs/${blog._id}`}>
                        <img
                          src={blog.image ? `http://localhost:8080/uploads/${blog.image.url}` : "images/post-thumb-1.jpg"}
                          alt={blog.image ? blog.image.alt || blog.title : "post"}
                          className="card-img-top"
                          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '4px' }}
                        />
                      </Link>
                    </div>
                    <div className="card-body">
                      <div className="post-meta d-flex text-uppercase gap-3 my-2 align-items-center">
                        <div className="meta-date">
                          <svg width={16} height={16}><use xlinkHref="#calendar" /></svg>
                          {new Date(blog.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                        <div className="meta-categories">
                          <svg width={16} height={16}><use xlinkHref="#category" /></svg>
                          {blog.category}
                        </div>
                      </div>
                      <div className="post-header">
                        <h3 className="post-title">
                          <Link to={`/blogs/${blog._id}`} className="text-decoration-none">
                            {blog.title}
                          </Link>
                        </h3>
                        <p>{blog.excerpt || blog.content.substring(0, 150) + '...'}</p>
                      </div>
                    </div>
                  </article>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Blogs;
