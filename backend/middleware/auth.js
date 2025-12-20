const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Check if header exists and starts with Bearer
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    // Split "Bearer <token>" into an array and take the second part
    token = req.headers.authorization.split(' ')[1];
  }

  // If token is literally the string "null" or "undefined"
  if (!token || token === 'null' || token === 'undefined') {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. THE SMART FIX: Try to find the user using 'id' OR '_id'
    // This prevents the "ruined project" because it works with any token format
    const userId = decoded.id || decoded._id || decoded.user?.id;

    if (!userId) {
      console.error("Token decoded but no ID found in payload:", decoded);
      return res.status(401).json({ msg: 'Token payload invalid' });
    }

    req.user = await User.findById(userId).select('-password');
    
    if (!req.user) {
      return res.status(401).json({ msg: 'User no longer exists' });
    }

    next();
  } catch (err) {
    console.log("Auth Middleware Error:", err.message); // This is where "jwt malformed" comes from
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = { protect };