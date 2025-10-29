
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Login from "./Login";
import SignUp from "./Signup";

const Headerq = () => {
  const user = JSON.parse(localStorage.getItem("userData"));
  const token = localStorage.getItem("token"); // your auth token
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);

  const UserData = JSON.parse(localStorage.getItem("userData"));

  const openSignUpFromLogin = () => {
    setShowLogin(false);
    setShowSignUp(true);
  };

  const switchSignUpToLogin = () => {
    setShowSignUp(false);
    setShowLogin(true);
  };

  useEffect(() => {
    const fetchCart = async () => {
      if (!UserData || !token) return;

      try {
        const response = await axios.get("https://sarvodaya-enterprise.onrender.com/api/cart", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // send token, backend identifies user
          },
        });

        if (!response.ok) throw new Error("Failed to fetch cart");

        const data = await response.json();
        setCartItems(data.items || []);

        const total = data.items?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;
        setCartTotal(total);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    fetchCart();
  }, [user, token]);

  const handleCartClick = () => {
    if (!user) {
      alert("Please login to view your cart");
      setShowLogin(true);
    }
  };

  return (
    <>
      <Login show={showLogin} handleClose={() => setShowLogin(false)} switchToSignUp={openSignUpFromLogin} />
      <SignUp show={showSignUp} handleClose={() => setShowSignUp(false)} openlogin={switchSignUpToLogin} />

      <header>
        <div className="container-fluid">
          <div className="row py-3 border-bottom align-items-center">
            <div className="col-sm-4 col-lg-3 text-center text-sm-start">
              <Link to="/">
                <img src="/images/se.png" alt="logo" style={{ height: "110px", width: "250px" }} />
              </Link>
            </div>

            <div className="col-sm-8 col-lg-4 d-flex justify-content-end gap-3 align-items-center">
              <button
                onClick={handleCartClick}
                className="border-0 bg-transparent d-flex flex-column align-items-end"
                data-bs-toggle={user ? "offcanvas" : ""}
                data-bs-target="#offcanvasCart"
              >
                <span>Your Cart</span>
                <span>Rs.{cartTotal}</span>
              </button>

              <a onClick={() => setShowLogin(true)} className="rounded-circle bg-light p-2">
                <svg width={24} height={24} viewBox="0 0 24 24">
                  <use xlinkHref="#user" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Cart Offcanvas */}
        <div className="offcanvas offcanvas-end" id="offcanvasCart">
          <div className="offcanvas-header justify-content-center">
            <button type="button" className="btn-close" data-bs-dismiss="offcanvas" />
          </div>
          <div className="offcanvas-body">
            <ul className="list-group mb-3">
              {cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <li key={item.id} className="list-group-item d-flex justify-content-between">
                    <div>
                      <h6>{item.name}</h6>
                      <small>{item.description}</small>
                    </div>
                    <span>Rs.{item.price * item.quantity}</span>
                  </li>
                ))
              ) : (
                <li className="list-group-item text-center">Your cart is empty</li>
              )}

              {cartItems.length > 0 && (
                <li className="list-group-item d-flex justify-content-between">
                  <strong>Total</strong>
                  <strong>Rs.{cartTotal}</strong>
                </li>
              )}
            </ul>

            {cartItems.length > 0 && <button className="w-100 btn btn-primary">Continue to checkout</button>}
          </div>
        </div>
      </header>
    </>
  );
};

export default Headerq;
