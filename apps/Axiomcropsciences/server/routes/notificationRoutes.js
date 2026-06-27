const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const Admin = require('../models/Admin');
const { protect } = require('../middleware/authMiddleware');
const {
  streamNotifications,
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearNotifications
} = require('../controllers/notificationController');

// All notification routes require admin privileges. Native EventSource can't
// set custom headers, so /stream takes the admin token as a query param
// instead of an Authorization header (the client appends ?token=...).
const protectStream = async (req, res, next) => {
  try {
    const token = req.query.token;
    if (!token) return res.status(401).json({ message: 'No token, unauthorized' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id).select('-password');
    if (!admin) return res.status(401).json({ message: 'Admin not found, unauthorized' });
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};
router.get('/stream', protectStream, streamNotifications);

router.use(protect);

router.get('/', getNotifications);
router.put('/read-all', markAllAsRead);
router.put('/:id/read', markAsRead);
router.delete('/clear', clearNotifications);
router.delete('/:id', deleteNotification);

module.exports = router;
