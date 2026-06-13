const jwt  = require('jsonwebtoken');
const User = require('../models/User');

const protectUser = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token, unauthorized' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Accept user tokens (type: 'user') only
    if (decoded.type && decoded.type !== 'user')
      return res.status(403).json({ message: 'Not a user token' });
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ message: 'User not found' });
    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = { protectUser };
