import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "swiper/css";
import axios from "axios";
import Login from "./Login";
import SignUp from "./Signup";
import { useCategory } from "../CategoryContext";

const Header = () => {
  const navigate = useNavigate();
  const { categories } = useCategory();
  const [user, setUser] = useState(() => {
    const userData = localStorage.getItem("userData");
    return userData ? JSON.parse(userData) : null;
  });
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  

  const openSignUpFromLogin = () => {
    setShowLogin(false);
    setShowSignUp(true);
  };

  const switchSignUpToLogin = () => {
    setShowSignUp(false);
    setShowLogin(true);
  };

  // Fetch cart items
  const fetchCart = async () => {
    if (!user) {
      setCartItems([]);
      setCartTotal(0);
      return;
    }

    try {
      const res = await axios.get(`http://localhost:8080/api/cart?userId=${user.id}&userEmail=${user.email}`);
      setCartItems(res.data);
      const total = res.data.reduce((sum, item) => sum + (item.afterDiscountPrice * item.quantity), 0);
      setCartTotal(total);
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCartItems([]);
      setCartTotal(0);
    }
  };

  // Update cart item quantity
  const updateQuantity = async (productId, newQuantity) => {
    if (!user || newQuantity < 1) return;

    try {
      await axios.put("http://localhost:8080/api/cart/quantity", {
        userId: user.id,
        userEmail: user.email,
        productId,
        quantity: newQuantity
      });
      fetchCart(); // Refresh cart after update
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  // Delete cart item
  const deleteItem = async (productId) => {
    if (!user) return;

    try {
      await axios.delete("http://localhost:8080/api/cart", {
        data: {
          userId: user.id,
          userEmail: user.email,
          productId
        }
      });
      fetchCart(); // Refresh cart after delete
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  useEffect(() => {
    fetchCart();

    // Listen for cart update events
    const handleCartUpdate = () => {
      fetchCart();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, [user]);

  return (
    <>
      {/* SVG Icons */}
      <svg xmlns="http://www.w3.org/2000/svg" style={{ display: "none" }}>
        <defs>
          {/* Example icons */}
          <symbol id="user" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M15.71 12.71a6 6 0 1 0-7.42 0a10 10 0 0 0-6.22 8.18a1 1 0 0 0 2 .22a8 8 0 0 1 15.9 0a1 1 0 0 0 1 .89h.11a1 1 0 0 0 .88-1.1a10 10 0 0 0-6.25-8.19ZM12 12a4 4 0 1 1 4-4a4 4 0 0 1-4 4Z"
            />
          </symbol>
          <symbol id="cart" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M8.5 19a1.5 1.5 0 1 0 1.5 1.5A1.5 1.5 0 0 0 8.5 19Z M16.5 19a1.5 1.5 0 1 0 1.5 1.5a1.5 1.5 0 0 0-1.5-1.5Z"
            />
          </symbol>
          <symbol id="search" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M21.71 20.29L18 16.61A9 9 0 1 0 16.61 18l3.68 3.68a1 1 0 0 0 1.42 0a1 1 0 0 0 0-1.39ZM11 18a7 7 0 1 1 7-7a7 7 0 0 1-7 7Z"
            />
          </symbol>
        </defs>
      </svg>

      {/* Offcanvas Cart */}
      <div
        className="offcanvas offcanvas-end"
        data-bs-scroll="true"
        tabIndex={-1}
        id="offcanvasCart"
        aria-labelledby="My Cart"
      >
        <div className="offcanvas-header justify-content-center">
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close" />
        </div>
        <div className="offcanvas-body">
          <div className="order-md-last">
            <h4 className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-primary">Your cart</span>
              <span className="badge bg-primary rounded-pill">{cartItems.length}</span>
            </h4>
            {user ? (
              <>
                <ul className="list-group mb-3">
                  {cartItems.length > 0 ? (
                    cartItems.map((item, index) => (
                      <li key={index} className="list-group-item d-flex justify-content-between lh-sm">
                        <div className="flex-grow-1">
                          <h6 className="my-0">{item.name}</h6>
                          <small className="text-body-secondary">{item.description}</small>
                          <div className="d-flex align-items-center mt-2">
                            <button
                              className="btn btn-sm btn-outline-secondary me-2"
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              -
                            </button>
                            <span className="fw-bold">Qty: {item.quantity}</span>
                            <button
                              className="btn btn-sm btn-outline-secondary ms-2"
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            >
                              +
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger ms-3"
                              onClick={() => deleteItem(item.productId)}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                        <span className="text-body-secondary">Rs.{item.afterDiscountPrice * item.quantity}</span>
                      </li>
                    ))
                  ) : (
                    <li className="list-group-item">Your cart is empty.</li>
                  )}
                  <li className="list-group-item d-flex justify-content-between">
                    <span>Total</span>
                    <strong>Rs.{cartTotal.toFixed(2)}</strong>
                  </li>
                </ul>
                <button
                  className="btn btn-primary btn-lg w-100"
                  data-bs-dismiss="offcanvas"
                  onClick={() => navigate("/checkout")}
                >
                  Continue to checkout
                </button>
              </>
            ) : (
              <div className="text-center">
                <p>Please log in to view your cart.</p>
                <button className="btn btn-primary" onClick={() => setShowLogin(true)}>Login</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Offcanvas Search */}
      <div
        className="offcanvas offcanvas-end"
        data-bs-scroll="true"
        tabIndex={-1}
        id="offcanvasSearch"
        aria-labelledby="Search"
      >
        <div className="offcanvas-header justify-content-center">
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close" />
        </div>
        <div className="offcanvas-body">
          <div className="order-md-last">
            <h4 className="text-primary mb-3">Search</h4>
            <form role="search" action="index.html" method="get" className="d-flex mt-3 gap-0">
              <input
                className="form-control rounded-start rounded-0 bg-light"
                type="text"
                placeholder="What are you looking for?"
                aria-label="What are you looking for?"
              />
              <button className="btn btn-dark rounded-end rounded-0" type="submit">
                Search
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header>
        <div className="container-fluid">
          {/* Top Row */}
          <div className="row py-3 border-bottom align-items-center">
            <div className="col-sm-4 col-lg-3 text-center text-sm-start">
              <Link to="/" className="d-inline-block">
                <img
                  src="/images/se.png"
                  alt="logo"
                  className="img-fluid"
                  style={{ height: "110px", width: "250px", objectFit: "cover" }}
                />
              </Link>
            </div>

            <div className="col-sm-6 offset-sm-2 offset-md-0 col-lg-5 d-none d-lg-block">
              <div className="search-bar row bg-light p-2 my-2 rounded-4">
                <div className="col-md-4 d-none d-md-block">
                  <select className="form-select border-0 bg-transparent">
                    <option>All Categories</option>
                    <option>Groceries</option>
                    <option>Drinks</option>
                    <option>Chocolates</option>
                  </select>
                </div>
                <div className="col-11 col-md-7">
                  <form id="search-form" className="text-center" onSubmit={(e) => e.preventDefault()}>
                    <input
                      type="text"
                      className="form-control border-0 bg-transparent"
                      placeholder="Search for more than 20,000 products"
                    />
                  </form>
                </div>
                <div className="col-1 d-flex align-items-center">
                  <svg width={24} height={24} viewBox="0 0 24 24">
                    <use xlinkHref="#search" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="col-sm-8 col-lg-4 d-flex justify-content-end gap-5 align-items-center mt-4 mt-sm-0">
              <div className="support-box text-end d-none d-xl-block">
                <span className="fs-6 text-muted">For Support?</span>
                <h5 className="mb-0">+91 93277 78516</h5>
              </div>

              <ul className="d-flex justify-content-end list-unstyled m-0">
                <li>
                  <a onClick={() => setShowLogin(true)} className="rounded-circle bg-light p-2 mx-1">
                    <svg width={24} height={24} viewBox="0 0 24 24">
                      <use xlinkHref="#user" />
                    </svg>
                  </a>
                </li>
                <li className="d-lg-none">
                  <a
                    href="#"
                    className="rounded-circle bg-light p-2 mx-1"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasCart"
                  >
                    <svg width={24} height={24} viewBox="0 0 24 24">
                      <use xlinkHref="#cart" />
                    </svg>
                  </a>
                </li>
                <li className="d-lg-none">
                  <a
                    href="#"
                    className="rounded-circle bg-light p-2 mx-1"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasSearch"
                  >
                    <svg width={24} height={24} viewBox="0 0 24 24">
                      <use xlinkHref="#search" />
                    </svg>
                  </a>
                </li>
              </ul>

              {/* Modals */}
              <Login show={showLogin} handleClose={() => setShowLogin(false)} switchToSignUp={openSignUpFromLogin} />
              <SignUp show={showSignUp} handleClose={() => setShowSignUp(false)} openlogin={switchSignUpToLogin} />

              {/* Desktop Cart */}
              <div className="cart text-end d-none d-lg-block dropdown">
                <button
                  className="border-0 bg-transparent d-flex flex-column gap-2 lh-1"
                  type="button"
                  data-bs-toggle="offcanvas"
                  data-bs-target="#offcanvasCart"
                >
                  <span className="fs-6 text-muted dropdown-toggle">Your Cart</span>
                  <span className="cart-total fs-5 fw-bold">Rs.{cartTotal.toFixed(2)}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Row */}
          <div className="row py-3">
            <div className="d-flex justify-content-center justify-content-sm-between align-items-center">
              <nav className="main-menu d-flex navbar navbar-expand-lg w-100">
                <button
                  className="navbar-toggler"
                  type="button"
                  data-bs-toggle="offcanvas"
                  data-bs-target="#offcanvasNavbar"
                >
                  <span className="navbar-toggler-icon" />
                </button>

                <div className="offcanvas offcanvas-end" tabIndex={-1} id="offcanvasNavbar">
                  <div className="offcanvas-header justify-content-center">
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" />
                  </div>
                  <div className="offcanvas-body">
                    <ul className="navbar-nav justify-content-end menu-list list-unstyled d-flex gap-md-3 mb-0">
                      {/* {categories.map((category, index) => (
                        <li key={category._id || index} className="nav-item">
                          <a href="#" className="nav-link">{category.name}</a>
                        </li>
                      ))} */}
                     <li className="nav-item"><Link to="/" className="nav-link">Home</Link></li>
                     <li className="nav-item"><Link to="/About-Us" className="nav-link">About Us</Link></li>
                     <li className="nav-item"><Link to="/contact-us" className="nav-link">Contact Us</Link></li>
                      <li className="nav-item"><Link to="/" className="nav-link">Sale</Link></li>
                      <li className="nav-item"><Link to="/blogs" className="nav-link">Blog</Link></li>
                      <li className="nav-item"><Link to="/order-status" className="nav-link">Order Status</Link></li>
                    </ul>
                  </div>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
