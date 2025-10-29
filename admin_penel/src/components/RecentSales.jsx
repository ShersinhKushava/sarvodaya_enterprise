import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const RecentSales = ({ toggleSidebar, isOpen }) => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [invoice, setInvoice] = useState('');
  const [trackingLink, setTrackingLink] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('Admintoken');
    navigate('/login');
  };

  const handleDispatchClick = (order) => {
    setSelectedOrder(order);
    setInvoice('');
    setTrackingLink('');
    setSelectedFile(null);
    setShowModal(true);
  };

  const handleDispatchSubmit = async () => {
    if (!selectedOrder || !invoice || !trackingLink) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const token = localStorage.getItem('Admintoken');
      let body;
      let headers = {
        'Authorization': `Bearer ${token}`,
      };

      if (selectedFile) {
        body = new FormData();
        body.append('orderId', selectedOrder.orderId);
        body.append('status', 'dispatched');
        body.append('invoice', invoice);
        body.append('trackingLink', trackingLink);
        body.append('invoiceFile', selectedFile);
      } else {
        headers['Content-Type'] = 'application/json';
        body = JSON.stringify({
          orderId: selectedOrder.orderId,
          status: 'dispatched',
          invoice,
          trackingLink,
        });
      }

      const response = await fetch('http://localhost:8080/api/order/update-status', {
        method: 'PUT',
        headers,
        body,
      });

      if (response.ok) {
        // Refresh orders
        const fetchOrders = async () => {
          try {
            const token = localStorage.getItem('Admintoken');
            const response = await fetch('http://localhost:8080/api/order/all-orders', {
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
      const response = await fetch(`http://localhost:8080/api/order/generate-invoice/${orderId}`, {
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

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('Admintoken');
        const response = await fetch('http://localhost:8080/api/order/all-orders', {
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

    fetchOrders();
  }, []);

  return (
    <div className={`content ${isOpen ? 'open' : ''}`}>
      {/* Navbar Start */}
      <nav className="navbar navbar-expand bg-light navbar-light sticky-top px-4 py-0">
        <a href="index.html" className="navbar-brand d-flex d-lg-none me-4">
          <h2 className="text-primary mb-0"><i className="fa fa-hashtag"></i></h2>
        </a>
        <a href="#" className="sidebar-toggler flex-shrink-0" onClick={toggleSidebar}>
          <i className="fa fa-bars"></i>
        </a>
        
        <div className="navbar-nav align-items-center ms-auto">
          
          <div className="nav-item dropdown">
            <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">
              <img className="rounded-circle me-lg-2" src="img/user.jpg" alt="" style={{width: '40px', height: '40px'}} />
              <span className="d-none d-lg-inline-flex">John Doe</span>
            </a>
            <div className="dropdown-menu dropdown-menu-end bg-light border-0 rounded-0 rounded-bottom m-0">
              <a href="#" className="dropdown-item">My Profile</a>
              <a href="#" className="dropdown-item">Settings</a>
              <a href="" className="dropdown-item" onClick={handleLogout}>Log Out</a>
            </div>
          </div>
        </div>
      </nav>
      {/* Navbar End */}

      {/* Recent Sales Start */}
      <div className="container-fluid pt-4 px-4">
        <div className="bg-light text-center rounded p-4">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <h6 className="mb-0">All Recent Sales</h6>
            <a href="#" onClick={() => navigate('/')}>Back to Dashboard</a>
          </div>
          <div className="table-responsive">
            <table className="table text-start align-middle table-bordered table-hover mb-0">
              <thead>
                <tr className="text-dark">
                  <th scope="col"><input className="form-check-input" type="checkbox" /></th>
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
                    <td colSpan="8" className="text-center">Loading orders...</td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center">No orders found</td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order._id}>
                      <td><input className="form-check-input" type="checkbox" /></td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td>{order.orderId}</td>
                      <td>{order.userDetails?.name || 'N/A'}</td>
                      <td>
                        {order.products.map((product, index) => (
                          <div key={index}>
                            {product.name} (Rs. {product.price})
                          </div>
                        ))}
                      </td>
                      <td>Rs. {order.totalSum}</td>
                      <td>
                        <span className={`badge ${order.status === 'pending' ? 'bg-warning' : order.status === 'completed' ? 'bg-success' : 'bg-secondary'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>
                        {order.status === 'pending' && (
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => handleDispatchClick(order)}
                          >
                            Dispatch
                          </button>
                        )}
                        {order.status === 'dispatched' && (
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
              Distributed By <a className="border-bottom" href="https://themewagon.com" target="_blank">ThemeWagon</a>
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
            <Form.Group className="mb-3">
              <Form.Label>Upload Invoice (Optional)</Form.Label>
              <Form.Control
                type="file"
                accept=".pdf"
                onChange={(e) => setSelectedFile(e.target.files[0])}
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

export default RecentSales;
