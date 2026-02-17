const { generateToken } = require('../middleware/auth');

// Hardcoded admin credentials
const ADMIN_EMAIL = 'admin@primewearwholesale.com';
const ADMIN_PASSWORD = 'ac123@newprimeadmin';

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Only allow the hardcoded admin user
    if (email !== ADMIN_EMAIL) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (password !== ADMIN_PASSWORD) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token for admin
    const token = generateToken('admin-user');

    res.json({
      _id: 'admin-user',
      username: 'Admin',
      email: ADMIN_EMAIL,
      role: 'admin',
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  login
};
