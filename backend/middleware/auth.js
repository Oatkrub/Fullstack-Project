const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect Routes (Authentication)
exports.protect = async (req, res, next) => {
  let token;

  if (req.cookies.token) {
    token = req.cookies.token || req.headers.authorization?.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, error: 'Not authorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Not authorized' });
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