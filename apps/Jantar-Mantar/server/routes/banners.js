const express = require('express');
const Banner = require('../models/Banner');
const { protect } = require('../middleware/authMiddleware');
const { isAdminRequest } = require('../middleware/isAdminRequest');
const router = express.Router();

// Public — active banners sorted by displayOrder (admin sees all with ?all=true).
router.get('/', async (req, res) => {
  try {
    const admin = await isAdminRequest(req);
    const all = req.query.all === 'true' && admin;
    const filter = all ? {} : { status: 'active' };
    const banners = await Banner.find(filter).sort({ displayOrder: 1, createdAt: 1 });
    res.json(banners);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', protect, async (req, res) => {
  try {
    const banner = await Banner.create(req.body);
    res.status(201).json(banner);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!banner) return res.status(404).json({ message: 'Banner not found' });
    res.json(banner);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    await Banner.findByIdAndDelete(req.params.id);
    res.json({ message: 'Banner deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
