const express = require('express');
const Enquiry = require('../models/Enquiry');
const router = express.Router();

// GET all enquiries
router.get('/', async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.json({ data: enquiries });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new enquiry
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, product, message } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const enquiry = await Enquiry.create({
      name,
      email,
      phone,
      product: product || 'Not specified',
      message,
      status: 'New'
    });

    res.json({ success: true, enquiry });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH enquiry status
router.patch('/:id/status', async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(enquiry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE enquiry
router.delete('/:id', async (req, res) => {
  try {
    await Enquiry.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;