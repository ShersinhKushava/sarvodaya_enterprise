import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Form } from 'react-bootstrap';

const OrderStatus = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [user, setUser] = useState(() => {
    const userData = localStorage.getItem("userData");
    return userData ? JSON.parse(userData) : null;
  });

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleDownloadUploadedInvoice = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://sarvodaya-enterprise.onrender.com/api/order/download-invoice/${orderId}`, {
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
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`https://sarvodaya-enterprise.onrender.com/api/order/user-completed-orders?userId=${user.id}&userEmail=${user.email}`, {
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
  }, [user]);

  if (!user) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <h2>Please login to view your order status</h2>
          <button className="btn btn-primary" onClick={() => navigate('/')}>Go to Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-12">
          <h2 className="mb-4">Order Status</h2>
          <div className="table-responsive">
            <table className="table table-striped table-bordered">
              <thead className="table-dark">
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                  <th>Invoice</th>
                  <th>Tracking Link</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center">Loading orders...</td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center">No completed orders found</td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order._id}>
                      <td>{order.orderId}</td>
                      <td>{new Date(order.dispatchedAt).toLocaleDateString()}</td>
                      <td>Rs. {order.totalSum}</td>
                      <td>
                        <span className="badge bg-success">{order.status}</span>
                      </td>
                      <td>{order.invoice || 'N/A'}</td>
                      <td>
                        {order.trackingLink ? (
                          <a href={order.trackingLink} target="_blank" rel="noopener noreferrer">
                            Track Order
                          </a>
                        ) : 'N/A'}
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-info me-2"
                          onClick={() => handleViewDetails(order)}
                        >
                          View Details
                        </button>
                        {order.invoiceFile && (
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => handleDownloadUploadedInvoice(order.orderId)}
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
          {selectedOrder && selectedOrder.invoiceFile && (
            <Button variant="success" onClick={() => handleDownloadUploadedInvoice(selectedOrder.orderId)}>
              Download Invoice
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default OrderStatus;
