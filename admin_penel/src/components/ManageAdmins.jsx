import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const ManageAdmins = ({ toggleSidebar, isOpen }) => {
  const navigate = useNavigate();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'admin',
    image: null
  });
  const [passwordFormData, setPasswordFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleLogout = () => {
    localStorage.removeItem('Admintoken');
    navigate('/login');
  };

  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem('Admintoken');
      const response = await fetch('https://sarvodaya-enterprise.onrender.com/api/admin/all', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setAdmins(data);
      } else {
        console.error('Failed to fetch admins');
      }
    } catch (error) {
      console.error('Error fetching admins:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('Admintoken');
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('role', formData.role);
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      const response = await fetch('https://sarvodaya-enterprise.onrender.com/api/admin/add', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (response.ok) {
        setShowAddModal(false);
        setFormData({ name: '', email: '', password: '', role: 'admin', image: null });
        fetchAdmins();
        alert('Admin added successfully!');
      } else {
        const errorData = await response.json();
        alert(`Failed to add admin: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error adding admin:', error);
      alert('Error adding admin');
    }
  };

  const handleEditAdmin = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('Admintoken');
      const response = await fetch(`https://sarvodaya-enterprise.onrender.com/api/admin/update/${selectedAdmin._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowEditModal(false);
        setSelectedAdmin(null);
        setFormData({ name: '', email: '', password: '', role: 'admin', image: '' });
        fetchAdmins();
        alert('Admin updated successfully!');
      } else {
        const errorData = await response.json();
        alert(`Failed to update admin: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating admin:', error);
      alert('Error updating admin');
    }
  };

  const handleDeleteAdmin = async (adminId) => {
    if (!window.confirm('Are you sure you want to delete this admin?')) return;

    try {
      const token = localStorage.getItem('Admintoken');
      const response = await fetch(`https://sarvodaya-enterprise.onrender.com/api/admin/delete/${adminId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchAdmins();
        alert('Admin deleted successfully!');
      } else {
        const errorData = await response.json();
        alert(`Failed to delete admin: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting admin:', error);
      alert('Error deleting admin');
    }
  };

  const openEditModal = (admin) => {
    setSelectedAdmin(admin);
    setFormData({
      name: admin.name,
      email: admin.email,
      password: '', // Don't pre-fill password for security
      role: admin.role,
      image: admin.image
    });
    setShowEditModal(true);
  };

  const openAddModal = () => {
    setFormData({ name: '', email: '', password: '', role: 'admin', image: '' });
    setShowAddModal(true);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    try {
      const token = localStorage.getItem('Admintoken');
      const response = await fetch('https://sarvodaya-enterprise.onrender.com/api/admin/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordFormData.currentPassword,
          newPassword: passwordFormData.newPassword,
        }),
      });

      if (response.ok) {
        setShowChangePasswordModal(false);
        setPasswordFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        alert('Password changed successfully!');
      } else {
        const errorData = await response.json();
        alert(`Failed to change password: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Error changing password');
    }
  };

  const openChangePasswordModal = () => {
    setPasswordFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setShowChangePasswordModal(true);
  };

  return (
    <div className={`content ${isOpen ? 'open' : ''}`}>
        {/* Main Content */}
        <div className="container-fluid pt-4 px-4">
          <div className="row g-4">
            <div className="col-12">
              <div className="bg-light rounded h-100 p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h6 className="mb-0">Admin Management</h6>
                  <button className="btn btn-primary" onClick={openAddModal}>
                    <i className="fa fa-plus me-2"></i>Add Admin
                  </button>
                </div>

                <div className="table-responsive">
                  <table className="table text-start align-middle table-bordered table-hover mb-0">
                    <thead>
                      <tr className="text-dark">
                        <th scope="col">Image</th>
                        <th scope="col">Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Role</th>
                        <th scope="col">Created</th>
                        <th scope="col">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="6" className="text-center">Loading admins...</td>
                        </tr>
                      ) : admins.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="text-center">No admins found</td>
                        </tr>
                      ) : (
                        admins.map((admin) => (
                          <tr key={admin._id}>
                            <td>
                              <img
                                className="rounded-circle"
                                src={admin.image ? `https://sarvodaya-enterprise.onrender.com/uploads/${admin.image}` : "img/user.jpg"}
                                alt=""
                                style={{width: '40px', height: '40px'}}
                              />
                            </td>
                            <td>{admin.name}</td>
                            <td>{admin.email}</td>
                            <td>
                              <span className={`badge ${admin.role === 'super-admin' ? 'bg-danger' : 'bg-primary'}`}>
                                {admin.role}
                              </span>
                            </td>
                            <td>{new Date(admin.createdAt).toLocaleDateString()}</td>
                            <td>
                              <button
                                className="btn btn-sm btn-warning me-2"
                                onClick={() => openEditModal(admin)}
                              >
                                <i className="fa fa-edit"></i>
                              </button>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDeleteAdmin(admin._id)}
                                disabled={admins.length <= 1}
                              >
                                <i className="fa fa-trash"></i>
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add Admin Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Admin</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddAdmin}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
              >
                <option value="admin">Admin</option>
                <option value="super-admin">Super Admin</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Image (optional)</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => setFormData({...formData, image: e.target.files[0]})}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Add Admin
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Edit Admin Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Admin</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleEditAdmin}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password (leave empty to keep current)</Form.Label>
              <Form.Control
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="Enter new password"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
              >
                <option value="admin">Admin</option>
                <option value="super-admin">Super Admin</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Image URL (optional)</Form.Label>
              <Form.Control
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({...formData, image: e.target.value})}
                placeholder="Enter image URL"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Update Admin
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Change Password Modal */}
      <Modal show={showChangePasswordModal} onHide={() => setShowChangePasswordModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleChangePassword}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Current Password</Form.Label>
              <Form.Control
                type="password"
                value={passwordFormData.currentPassword}
                onChange={(e) => setPasswordFormData({...passwordFormData, currentPassword: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                value={passwordFormData.newPassword}
                onChange={(e) => setPasswordFormData({...passwordFormData, newPassword: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                type="password"
                value={passwordFormData.confirmPassword}
                onChange={(e) => setPasswordFormData({...passwordFormData, confirmPassword: e.target.value})}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowChangePasswordModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Change Password
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageAdmins;
