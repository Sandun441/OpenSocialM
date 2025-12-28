// backend/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Support both 'id' and '_id' formats to be safe
    const userId = decoded.id || decoded._id || decoded.user?.id;

    if (!userId) {
      return res.status(401).json({ msg: 'Token invalid: No user ID found' });
    }

    req.user = await User.findById(userId).select('-password');
    if (!req.user) {
      return res.status(401).json({ msg: 'User not found' });
    }

    next();
  } catch (err) {
    console.error('Auth Error:', err.message);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// EXPORT IT AS AN OBJECT
module.exports = { protect };
