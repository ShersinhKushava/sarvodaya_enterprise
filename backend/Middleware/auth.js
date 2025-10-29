// middleware/auth.js
const jwt = require('jsonwebtoken');
module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization; // expects "Bearer <token>"
  if (!authHeader) return res.status(401).json({ error: 'Token missing' });
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.adminId = payload.adminId; // attach admin info to request
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token invalid' });
  }
};
