import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";

const Login = ({ show, handleClose, switchToSignUp }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  // Check if user is already logged in (1 month)
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    const tokenExpiry = localStorage.getItem("tokenExpiry");
    const now = new Date().getTime();

    if (storedData && tokenExpiry && now < tokenExpiry) {
      setIsLoggedIn(true);
      setUserData(storedData);
    } else {
      // Token expired, clear localStorage
      localStorage.removeItem("userData");
      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpiry");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://sarvodaya-enterprise.onrender.com/api/User/LoginUser", form);
      
      const token = res.data.token;
      const user = res.data.user; // assuming backend returns user data as 'user'
      const expiry = new Date().getTime() + 30 * 24 * 60 * 60 * 1000; // 1 month

      localStorage.setItem("token", token);
      localStorage.setItem("userData", JSON.stringify(user));
      localStorage.setItem("tokenExpiry", expiry);

      setUserData(user);
      setIsLoggedIn(true);
      alert("Login successful");
      handleClose();
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    localStorage.removeItem("tokenExpiry");
    setIsLoggedIn(false);
    setUserData(null);
    alert("Logged out successfully");
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title style={{ color: "red" }}>
          {isLoggedIn ? `Welcome, ${userData?.name || "User"}!` : "Login Here"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!isLoggedIn ? (
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label style={{ color: "black" }}>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="name@example.com"
                autoFocus
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="password">
              <Form.Label style={{ color: "black" }}>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              Login
            </Button>
          </Form>
        ) : (
          <div style={{ textAlign: "center" }}>
            <p>You are logged in!</p>
            <Button variant="danger" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        )}
        {!isLoggedIn && (
          <p className="mt-3" style={{ color: "black" }}>
            Don't have an account?{" "}
            <span
              onClick={switchToSignUp}
              style={{
                color: "blue",
                cursor: "pointer",
                borderBottom: "2px solid blue",
              }}
            >
              Sign Up
            </span>
          </p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Login;
