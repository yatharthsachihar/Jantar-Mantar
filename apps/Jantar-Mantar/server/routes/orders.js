const express = require('express');
const Order = require('../models/Order');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Public — create an order (COD / manual checkout).
router.post('/', async (req, res) => {
  try {
    const { items, totalAmount, customerName, customerPhone, address } = req.body;
    if (!Array.isArray(items) || items.length === 0)
      return res.status(400).json({ message: 'Order has no items' });
    if (!customerName || !customerPhone || !address)
      return res.status(400).json({ message: 'Name, phone and address are required' });
    if (typeof totalAmount !== 'number' || totalAmount <= 0)
      return res.status(400).json({ message: 'Invalid total amount' });
    const order = await Order.create(req.body);
    res.status(201).json(order);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// Admin — list all orders.
router.get('/', protect, async (req, res) => {
  try {
    const orders = await Order.find({ deletedAt: null }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Admin — update status / payment.
router.put('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

module.exports = router;
