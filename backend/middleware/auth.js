const jwt = require('jsonwebtoken');

// Hardcoded admin credentials
const ADMIN_EMAIL = 'admin@primewearwholesale.com';
const ADMIN_PASSWORD = 'ac123@newprimeadmin';

// Protect routes - verify JWT token
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'primewear_secret_key_2024');

      // Check if it's the admin user
      if (decoded.id === 'admin-user') {
        req.user = {
          _id: 'admin-user',
          username: 'Admin',
          email: ADMIN_EMAIL,
          role: 'admin'
        };
        next();
      } else {
        return res.status(401).json({ message: 'Not authorized, invalid token' });
      }
    } catch (error) {
      console.error('Auth middleware error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Admin role check
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }
};

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'primewear_secret_key_2024', {
    expiresIn: '30d'
  });
};

module.exports = { protect, adminOnly, generateToken };
