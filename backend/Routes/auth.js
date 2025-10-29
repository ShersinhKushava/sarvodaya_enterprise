// routes/auth.js (Node/Express)
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin'); // Mongoose model for admin
// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ error: 'Invalid credentials' });
    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });
    // Sign JWT with admin ID (and optionally role or email)
    const token = jwt.sign(
      { adminId: admin._id, email: admin.email },
      process.env.JWT_SECRET,   // keep secret in .env
      { expiresIn: '1h' }       // e.g. 1 hour expiration
    );
    return res.json({ token });
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
});
module.exports = router;
