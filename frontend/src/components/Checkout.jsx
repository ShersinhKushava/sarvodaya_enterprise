import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Checkout = () => {
  const user = useMemo(() => JSON.parse(localStorage.getItem("userData")), []);
  const navigate = useNavigate();
  const UserData = useMemo(() => JSON.parse(localStorage.getItem("userData")), []);
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch cart items
  const fetchCart = async () => {
    if (!user) {
      navigate("/");
      return;
    }
    try {
      const res = await axios.get(
        `http://localhost:8080/api/cart?userId=${user.id}&userEmail=${user.email}`
      );
      setCartItems(res.data);
      const total = res.data.reduce(
        (sum, item) => sum + item.afterDiscountPrice * item.quantity,
        0
      );
      setCartTotal(total);
    } catch (error) {
      console.error("Error fetching cart:", error);
      setError("Failed to load cart items");
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user, navigate]);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    // Combine all data in one object and display in console
    const orderData = {
      totalSum: cartTotal,
      products: cartItems,
      userDetails: UserData
    };
    console.log("Order Data:", orderData);

    if (!user) {
      setError("Please log in to place an order");
      return;
    }

    if (cartItems.length === 0) {
      setError("Your cart is empty");
      return;
    }

    // Validate shipping details
    if (!UserData.name || !UserData.address || !UserData.mobile) {
      setError("Shipping details are incomplete. Please update your profile.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:8080/api/order/place-order",
        {
          userId: user.id,
          userEmail: user.email,
          shippingDetails: {
            name: UserData.userName,
            address: UserData.userAddress,
            phone: UserData.userPhone,
          },
          userDetails: UserData,
          products: cartItems,
          totalSum: cartTotal,
        }
      );

      // Save order details to localStorage for confirmation page
      localStorage.setItem("lastOrder", JSON.stringify(response.data.order));

      alert(`Order placed successfully! Order ID: ${response.data.orderId}`);
      // Dispatch custom event to update cart in header
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      navigate("/"); // Redirect to home or order confirmation page
    } catch (error) {
      console.error("Error placing order:", error);
      setError(error.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="container my-5">
        <div className="text-center">
          <h2>Please log in to proceed to checkout</h2>
          <button className="btn btn-primary" onClick={() => navigate("/")}>
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-lg-8">
          <h2 className="mb-4">Checkout</h2>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {/* Product List Section */}
          <div className="card mb-4">
            <div className="card-header">
              <h5>Your Products</h5>
            </div>
            <div className="card-body">
              {cartItems.length > 0 ? (
                <div className="row">
                  {cartItems.map((item, index) => (
                    <div key={index} className="col-12 mb-3">
                      <div className="card h-100">
                        <div className="row g-0">
                          <div className="col-3">
                            <img
                              src={`http://localhost:8080/uploads/${item.images[0]}`}
                              className="img-fluid rounded-start h-100 object-fit-cover"
                              alt={item.name}
                            />
                          </div>
                          <div className="col-9">
                            <div className="card-body">
                              <h6 className="card-title">{item.name}</h6>
                              <p className="card-text small text-muted">{item.description}</p>
                              <p className="card-text">
                                <small className="text-muted">Qty: {item.quantity}</small>
                                <br />
                                <strong>Rs.{item.afterDiscountPrice * item.quantity}</strong>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted">No products in cart</p>
              )}
            </div>
          </div>

                  </div>

        <div className="col-lg-4">
          {/* User Details Section */}
          <div className="card mb-4">
            <div className="card-header">
              <h5>User Details</h5>
            </div>
            <div className="card-body">
              <div className="mb-2">
                <strong>Name:</strong> {UserData.name}
              </div>
              <div className="mb-2">
                <strong>Email:</strong> {UserData.email}
              </div>
              <div className="mb-2">
                <strong>Mobile:</strong> {UserData.mobile}
              </div>
              <div className="mb-2">
                <strong>Address:</strong> {UserData.address}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h5>Order Summary</h5>
            </div>
            <div className="card-body">
              <ul className="list-group list-group-flush">
                {cartItems.map((item, index) => (
                  <li
                    key={index}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <h6 className="my-0">{item.name}</h6>
                      <small className="text-muted">
                        Qty: {item.quantity} | Rs.{item.afterDiscountPrice} each
                      </small>
                    </div>
                    <span>Rs.{item.afterDiscountPrice * item.quantity}</span>
                  </li>
                ))}
                <li className="list-group-item d-flex justify-content-between">
                  <strong>Total</strong>
                  <strong>Rs.{cartTotal.toFixed(2)}</strong>
                </li>
              </ul>

              <button
                type="button"
                className="btn btn-primary w-100 mt-3"
                onClick={handlePlaceOrder}
                disabled={loading || cartItems.length === 0}
              >
                {loading ? "Placing Order..." : "Place Order"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
