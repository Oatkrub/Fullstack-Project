const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Helper to create token and send as cookie
const sendTokenResponse = (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });

  const options = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    httpOnly: true, // Prevents JS from accessing the cookie
    secure: true, // Only send over HTTPS in production
  };

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    user: { _id: user._id, username: user.username, role: user.role }
  });
};

// @desc    Register user
exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role
    });

    sendTokenResponse(user, 201, res);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Login user
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Please provide email and password' });
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

  sendTokenResponse(user, 200, res);
};  

// @desc    Logout / Clear Cookie
exports.logout = (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ success: true, data: {} });
};

exports.getMe = async (req, res) => {
  // req.user is populated by your 'protect' middleware
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user
  });
};