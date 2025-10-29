import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Chart from 'chart.js/auto';
import axios from 'axios';

const Content = ({ toggleSidebar, isOpen }) => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [invoice, setInvoice] = useState('');
  const [trackingLink, setTrackingLink] = useState('');
  const [admin, setAdmin] = useState(null);
  const [todos, setTodos] = useState([]);
  const [newTask, setNewTask] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('Admintoken');
    navigate('/login');
  };

  const handleDispatchClick = (order) => {
    setSelectedOrder(order);
    setInvoice('');
    setTrackingLink('');
    setShowModal(true);
  };

  const handleDispatchSubmit = async () => {
    if (!selectedOrder || !invoice || !trackingLink) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const token = localStorage.getItem('Admintoken');
      const response = await fetch('https://sarvodaya-enterprise.onrender.com/api/order/update-status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderId: selectedOrder.orderId,
          status: 'dispatched',
          invoice,
          trackingLink,
        }),
      });

      if (response.ok) {
        // Refresh orders
        const fetchOrders = async () => {
          try {
            const token = localStorage.getItem('Admintoken');
            const response = await fetch('https://sarvodaya-enterprise.onrender.com/api/order/all-orders', {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            });
            if (response.ok) {
              const data = await response.json();
              setOrders(data);
            }
          } catch (error) {
            console.error('Error fetching orders:', error);
          }
        };
        fetchOrders();
        setShowModal(false);
        alert('Order dispatched successfully!');
      } else {
        const errorData = await response.json();
        alert(`Failed to dispatch order: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error dispatching order:', error);
      alert('Error dispatching order');
    }
  };

  const handleDownloadInvoice = async (orderId) => {
    try {
      const token = localStorage.getItem('Admintoken');
      const response = await fetch(`https://sarvodaya-enterprise.onrender.com/api/order/generate-invoice/${orderId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Create a blob from the response
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice-${orderId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('Failed to download invoice');
      }
    } catch (error) {
      console.error('Error downloading invoice:', error);
      alert('Error downloading invoice');
    }
  };

  const handleAddTodo = async () => {
    if (!newTask.trim()) return;
    try {
      const token = localStorage.getItem('Admintoken');
      await axios.post('https://sarvodaya-enterprise.onrender.com/api/admin/todos', { task: newTask }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setNewTask('');
      // Refetch todos
      const response = await axios.get('https://sarvodaya-enterprise.onrender.com/api/admin/todos', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setTodos(response.data);
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      const token = localStorage.getItem('Admintoken');
      await axios.delete(`https://sarvodaya-enterprise.onrender.com/api/admin/todos/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      // Refetch todos
      const response = await axios.get('https://sarvodaya-enterprise.onrender.com/api/admin/todos', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setTodos(response.data);
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const handleToggleTodo = async (id) => {
    try {
      const token = localStorage.getItem('Admintoken');
      await axios.put(`https://sarvodaya-enterprise.onrender.com/api/admin/todos/${id}/toggle`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      // Refetch todos
      const response = await axios.get('https://sarvodaya-enterprise.onrender.com/api/admin/todos', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setTodos(response.data);
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('Admintoken');
        const response = await fetch('https://sarvodaya-enterprise.onrender.com/api/order/all-orders', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        } else {
          console.error('Failed to fetch orders');
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

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

    const fetchTodos = async () => {
      try {
        const token = localStorage.getItem('Admintoken');
        const response = await axios.get('https://sarvodaya-enterprise.onrender.com/api/admin/todos', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setTodos(response.data);
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    };

    fetchOrders();
    fetchAdminProfile();
    fetchTodos();

    // Initialize charts after component mounts
    const initCharts = () => {
      // Sales & Revenue Chart
      const salesRevenueCtx = document.getElementById('salse-revenue');
      if (salesRevenueCtx) {
        new Chart(salesRevenueCtx, {
          type: 'bar',
          data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
              label: 'Sales',
              data: [12, 19, 3, 5, 2, 3],
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false
          }
        });
      }
    };

    // Delay chart initialization to ensure DOM is ready
    setTimeout(initCharts, 100);
  }, []);

  return (
    <div className={`content ${isOpen ? "open" : ""}`}>
      {/* Navbar Start */}
      <nav className="navbar navbar-expand bg-light navbar-light sticky-top px-4 py-0">
        <a href="index.html" className="navbar-brand d-flex d-lg-none me-4">
          <h2 className="text-primary mb-0">
            <i className="fa fa-hashtag"></i>
          </h2>
        </a>
        <a
          href="#"
          className="sidebar-toggler flex-shrink-0"
          onClick={toggleSidebar}
        >
          <i className="fa fa-bars"></i>
        </a>
        <form className="d-none d-md-flex ms-4">
          <input
            className="form-control border-0"
            type="search"
            placeholder="Search"
          />
        </form>
        <div className="navbar-nav align-items-center ms-auto">
          
          <div className="nav-item dropdown">
            <a
              href="#"
              className="nav-link dropdown-toggle"
              data-bs-toggle="dropdown"
            >
              <i className="fa fa-bell me-lg-2"></i>
              <span className="d-none d-lg-inline-flex">Notificatin</span>
            </a>
            <div className="dropdown-menu dropdown-menu-end bg-light border-0 rounded-0 rounded-bottom m-0">
              <a href="#" className="dropdown-item">
                <h6 className="fw-normal mb-0">Profile updated</h6>
                <small>15 minutes ago</small>
              </a>
              <hr className="dropdown-divider" />
              <a href="#" className="dropdown-item">
                <h6 className="fw-normal mb-0">New user added</h6>
                <small>15 minutes ago</small>
              </a>
              <hr className="dropdown-divider" />
              <a href="#" className="dropdown-item">
                <h6 className="fw-normal mb-0">Password changed</h6>
                <small>15 minutes ago</small>
              </a>
              <hr className="dropdown-divider" />
              <a href="#" className="dropdown-item text-center">
                See all notifications
              </a>
            </div>
          </div>
          <div className="nav-item dropdown">
            <a
              href="#"
              className="nav-link dropdown-toggle"
              data-bs-toggle="dropdown"
            >
              {/* image of admin */}
              <img
                className="rounded-circle me-lg-2"
                src={
                  admin?.image
                    ? `https://sarvodaya-enterprise.onrender.com/uploads/${admin.image}`
                    : "img/user.jpg"
                }
                alt=""
                style={{ width: "40px", height: "40px" }}
              />
              <span className="d-none d-lg-inline-flex">
                {admin?.name || "Admin"}
              </span>
            </a>
            <div className="dropdown-menu dropdown-menu-end bg-light border-0 rounded-0 rounded-bottom m-0">
              <a href="#" className="dropdown-item">
                My Profile
              </a>
              <a href="#" className="dropdown-item">
                Settings
              </a>
              <a href="" className="dropdown-item" onClick={handleLogout}>
                Log Out
              </a>
            </div>
          </div>
        </div>
      </nav>
      {/* Navbar End */}

      {/* Sale & Revenue Start */}
      <div className="container-fluid pt-4 px-4">
        <div className="row g-4">
          <div className="col-sm-6 col-xl-3">
            <div className="bg-light rounded d-flex align-items-center justify-content-between p-4">
              <i className="fa fa-chart-line fa-3x text-primary"></i>
              <div className="ms-3">
                <p className="mb-2">Today Sale</p>
                <h6 className="mb-0">$1234</h6>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-xl-3">
            <div className="bg-light rounded d-flex align-items-center justify-content-between p-4">
              <i className="fa fa-chart-bar fa-3x text-primary"></i>
              <div className="ms-3">
                <p className="mb-2">Total Sale</p>
                <h6 className="mb-0">$1234</h6>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-xl-3">
            <div className="bg-light rounded d-flex align-items-center justify-content-between p-4">
              <i className="fa fa-chart-area fa-3x text-primary"></i>
              <div className="ms-3">
                <p className="mb-2">Today Revenue</p>
                <h6 className="mb-0">$1234</h6>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-xl-3">
            <div className="bg-light rounded d-flex align-items-center justify-content-between p-4">
              <i className="fa fa-chart-pie fa-3x text-primary"></i>
              <div className="ms-3">
                <p className="mb-2">Total Revenue</p>
                <h6 className="mb-0">$1234</h6>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Sale & Revenue End */}

      {/* Recent Sales Start */}
      <div className="container-fluid pt-4 px-4">
        <div className="bg-light text-center rounded p-4">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <h6 className="mb-0">Recent Salse</h6>
            <div>
              <a
                href="#"
                onClick={() => navigate("/recent-sales")}
                className="me-3"
              >
                Show All
              </a>
              <a href="#" onClick={() => navigate("/completed-sales")}>
                Completed Sales
              </a>
            </div>
          </div>
          <div className="table-responsive">
            <table className="table text-start align-middle table-bordered table-hover mb-0">
              <thead>
                <tr className="text-dark">
                  <th scope="col">
                    <input className="form-check-input" type="checkbox" />
                  </th>
                  <th scope="col">Date</th>
                  <th scope="col">Invoice</th>
                  <th scope="col">Customer</th>
                  <th scope="col">Products</th>
                  <th scope="col">Amount</th>
                  <th scope="col">Status</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" className="text-center">
                      Loading orders...
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  orders.slice(0, 10).map((order) => (
                    <tr key={order._id}>
                      <td>
                        <input className="form-check-input" type="checkbox" />
                      </td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td>{order.orderId}</td>
                      <td>{order.userDetails?.name || "N/A"}</td>
                      <td>
                        {order.products.map((product, index) => (
                          <div key={index}>
                            {product.name} (Rs. {product.price})
                          </div>
                        ))}
                      </td>
                      <td>Rs. {order.totalSum}</td>
                      <td>
                        <span
                          className={`badge ${
                            order.status === "pending"
                              ? "bg-warning"
                              : order.status === "completed"
                              ? "bg-success"
                              : "bg-secondary"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td>
                        {order.status === "pending" && (
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => handleDispatchClick(order)}
                          >
                            Dispatch
                          </button>
                        )}
                        {order.status === "dispatched" && (
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => handleDownloadInvoice(order.orderId)}
                          >
                            Download Invoice
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Recent Sales End */}

      {/* Widgets Start */}
      <div className="container-fluid pt-4 px-4">
        <div className="row g-4">
          <div className="col-sm-12 col-md-6 col-xl-4">
            <div className="h-100 bg-light rounded p-4">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <h6 className="mb-0">To Do List</h6>
                <a href="">Show All</a>
              </div>
              <div className="d-flex mb-2">
                <input
                  className="form-control bg-transparent"
                  type="text"
                  placeholder="Enter task"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                />
                <button type="button" className="btn btn-primary ms-2" onClick={handleAddTodo}>
                  Add
                </button>
              </div>
              {todos.map((todo, index) => (
                <div key={todo._id} className={`d-flex align-items-center ${index < todos.length - 1 ? 'border-bottom' : 'pt-2'} py-2`}>
                  <input
                    className="form-check-input m-0"
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggleTodo(todo._id)}
                  />
                  <div className="w-100 ms-3">
                    <div className="d-flex w-100 align-items-center justify-content-between">
                      <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
                        {todo.task}
                      </span>
                      <button className="btn btn-sm" onClick={() => handleDeleteTodo(todo._id)}>
                        <i className="fa fa-times"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Widgets End */}

      {/* Footer Start */}
      <div className="container-fluid pt-4 px-4">
        <div className="bg-light rounded-top p-4">
          <div className="row">
            <div className="col-12 col-sm-6 text-center text-sm-start">
              &copy; <a href="#">Your Site Name</a>, All Right Reserved.
            </div>
            <div className="col-12 col-sm-6 text-center text-sm-end">
              Designed By <a href="https://htmlcodex.com">HTML Codex</a>
              <br />
              Distributed By{" "}
              <a
                className="border-bottom"
                href="https://themewagon.com"
                target="_blank"
              >
                ThemeWagon
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* Footer End */}

      {/* Dispatch Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Dispatch Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Invoice</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter invoice number"
                value={invoice}
                onChange={(e) => setInvoice(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tracking Link</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter tracking link"
                value={trackingLink}
                onChange={(e) => setTrackingLink(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleDispatchSubmit}>
            Dispatch
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Content;
