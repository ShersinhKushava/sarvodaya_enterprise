import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const token = localStorage.getItem('Admintoken');
        const response = await fetch('https://sarvodaya-enterprise.onrender.com/api/admin/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setAdmin(data);
        } else {
          console.error('Failed to fetch admin profile');
        }
      } catch (error) {
        console.error('Error fetching admin profile:', error);
      }
    };

    fetchAdminProfile();
  }, []);

  return (
    <div className={`sidebar pe-4 pb-3 ${isOpen ? 'open' : ''}`}>
      <nav className="navbar bg-light navbar-light">
        <a href="index.html" className="navbar-brand mx-4 mb-3">
          <h3 className="text-primary"><i className="fa fa-hashtag me-2"></i>S..E..</h3>
        </a>
        <div className="d-flex align-items-center ms-4 mb-4">
          <div className="position-relative">
            <img className="rounded-circle" src={admin?.image ? `https://sarvodaya-enterprise.onrender.com/uploads/${admin.image}` : "img/user.jpg"} alt="" style={{width: '40px', height: '40px'}} />
            <div className="bg-success rounded-circle border border-2 border-white position-absolute end-0 bottom-0 p-1"></div>
          </div>
          <div className="ms-3">
            <h6 className="mb-0">{admin?.name || 'Admin'}</h6>
            <span>Admin</span>
          </div>
        </div>
        <div className="navbar-nav w-100">
          <a href="#" onClick={() => navigate('/')} className={`nav-item nav-link ${location.pathname === '/' ? 'active' : ''}`}><i className="fa fa-tachometer-alt me-2"></i>Dashboard</a>
          <a href="#" onClick={() => navigate('/recent-sales')} className={`nav-item nav-link ${location.pathname === '/recent-sales' ? 'active' : ''}`}><i className="fa fa-shopping-cart me-2"></i>Recent Sales</a>
          <a href="#" onClick={() => navigate('/completed-sales')} className={`nav-item nav-link ${location.pathname === '/completed-sales' ? 'active' : ''}`}><i className="fa fa-check-circle me-2"></i>Completed Sales</a>
          <a href="#" onClick={() => navigate('/add-blog')} className={`nav-item nav-link ${location.pathname === '/add-blog' ? 'active' : ''}`}><i className="fa fa-blog me-2"></i>Add Blog</a>
          <a href="#" onClick={() => navigate('/manage-blogs')} className={`nav-item nav-link ${location.pathname === '/manage-blogs' ? 'active' : ''}`}><i className="fa fa-edit me-2"></i>Manage Blogs</a>
          <a href="#" onClick={() => navigate('/manage-admins')} className={`nav-item nav-link ${location.pathname === '/manage-admins' ? 'active' : ''}`}><i className="fa fa-users me-2"></i>Admin Management</a>
          <a href="#" onClick={() => navigate('/add-category')} className={`nav-item nav-link ${location.pathname === '/add-category' ? 'active' : ''}`}><i className="fa fa-plus me-2"></i>Add Category</a>
          <a href="#" onClick={() => navigate('/add-product')} className={`nav-item nav-link ${location.pathname === '/add-product' ? 'active' : ''}`}><i className="fa fa-plus-circle me-2"></i>Add Product</a>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
