import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const CompletedSales = ({ toggleSidebar, isOpen }) => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('Admintoken');
    navigate('/login');
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
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

  const handleDownloadUploadedInvoice = async (orderId) => {
    try {
      const token = localStorage.getItem('Admintoken');
      const response = await fetch(`http://localhost:8080/api/order/download-invoice/${orderId}`, {
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
        a.download = `uploaded-invoice-${orderId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('Failed to download uploaded invoice');
      }
    } catch (error) {
      console.error('Error downloading uploaded invoice:', error);
      alert('Error downloading uploaded invoice');
    }
  };

  useEffect(() => {
    const fetchCompletedOrders = async () => {
      try {
        const token = localStorage.getItem('Admintoken');
        const response = await fetch('http://localhost:8080/api/order/all-completed-orders', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        } else {
          console.error('Failed to fetch completed orders');
        }
      } catch (error) {
        console.error('Error fetching completed orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedOrders();
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

      {/* Completed Sales Start */}
      <div className="container-fluid pt-4 px-4">
        <div className="bg-light text-center rounded p-4">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <h6 className="mb-0">Completed Sales</h6>
            <a href="#" onClick={() => navigate('/')}>Back to Dashboard</a>
          </div>
          <div className="table-responsive">
            <table className="table text-start align-middle table-bordered table-hover mb-0">
              <thead>
                <tr className="text-dark">
                  <th scope="col">Date</th>
                  <th scope="col">Order ID</th>
                  <th scope="col">Customer Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Phone</th>
                  <th scope="col">Total Amount</th>
                  <th scope="col">Invoice</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" className="text-center">Loading completed orders...</td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center">No completed orders found</td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order._id}>
                      <td>{new Date(order.dispatchedAt).toLocaleDateString()}</td>
                      <td>{order.orderId}</td>
                      <td>{order.userDetails?.name || 'N/A'}</td>
                      <td>{order.userEmail}</td>
                      <td>{order.userDetails?.phone || 'N/A'}</td>
                      <td>Rs. {order.totalSum}</td>
                      <td>{order.invoice || 'N/A'}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-info me-2"
                          onClick={() => handleViewDetails(order)}
                        >
                          View Details
                        </button>
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => handleDownloadInvoice(order.orderId)}
                        >
                          Download Invoice
                        </button>
                        {order.invoiceFile && (
                          <button
                            className="btn btn-sm btn-info ms-2"
                            onClick={() => handleDownloadUploadedInvoice(order.orderId)}
                          >
                            Download Uploaded Invoice
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
      {/* Completed Sales End */}

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

      {/* Order Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Order Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <div>
              <h5>Order ID: {selectedOrder.orderId}</h5>
              <p><strong>Customer Name:</strong> {selectedOrder.userDetails?.name || 'N/A'}</p>
              <p><strong>Email:</strong> {selectedOrder.userEmail}</p>
              <p><strong>Phone:</strong> {selectedOrder.userDetails?.phone || 'N/A'}</p>
              <p><strong>Address:</strong> {selectedOrder.userDetails?.address || 'N/A'}</p>
              <p><strong>Total Amount:</strong> Rs. {selectedOrder.totalSum}</p>
              <p><strong>Invoice:</strong> {selectedOrder.invoice || 'N/A'}</p>
              <p><strong>Tracking Link:</strong> {selectedOrder.trackingLink ? <a href={selectedOrder.trackingLink} target="_blank" rel="noopener noreferrer">{selectedOrder.trackingLink}</a> : 'N/A'}</p>
              <p><strong>Dispatched At:</strong> {new Date(selectedOrder.dispatchedAt).toLocaleString()}</p>
              <h6>Products:</h6>
              <ul>
                {selectedOrder.products.map((product, index) => (
                  <li key={index}>
                    {product.name} - Quantity: {product.quantity} - Original Price: Rs. {product.price} - After Discount: Rs. {product.afterDiscountPrice}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          {selectedOrder && (
            <Button variant="success" onClick={() => handleDownloadInvoice(selectedOrder.orderId)}>
              Download Invoice
            </Button>
          )}
        </Modal.Footer>
      </Modal>


    </div>
  );
};

export default CompletedSales;
