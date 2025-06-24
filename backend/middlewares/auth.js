const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', async (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });
    
    try {
      const user = await User.findById(decoded.userId).select('-password');
      if (!user) return res.status(404).json({ message: 'User not found' });
      
      req.user = user;
      next();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

module.exports = { authenticateToken, isAdmin };