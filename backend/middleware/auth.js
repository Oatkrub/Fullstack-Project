const jwt = require('jsonwebtoken');
const User = require('../models/User');
 
// Protect Routes (Authentication)
// Supports BOTH cookie-based auth (Next.js web) AND Bearer token auth (Expo mobile)
exports.protect = async (req, res, next) => {
  let token;
 
  // 1. Check for Bearer token in Authorization header (used by Expo/mobile)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }
  // 2. Fall back to cookie (used by Next.js web app)
  else if (req.cookies.token) {
    token = req.cookies.token;
  }
 
  if (!token) {
    return res.status(401).json({ success: false, error: 'Not authorized, no token' });
  }
 
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'User no longer exists' });
    }
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Not authorized, token invalid' });
  }
};
 
// Authorize Roles (Permissions)
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(500).json({ success: false, error: 'Auth middleware order error' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `User role '${req.user.role}' is not authorized to access this route`
      });
    }
    next();
  };
};
 