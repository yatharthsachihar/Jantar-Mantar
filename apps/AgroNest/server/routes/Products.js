const express  = require('express');
const mongoose = require('mongoose');
const Product  = require('../models/Product');
const jwt      = require('jsonwebtoken');
const router   = express.Router();

// ── Soft auth: attach admin info if token present, don't block if missing ──
const softAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    try {
      req.admin = jwt.verify(token, process.env.JWT_SECRET);
    } catch { /* invalid token — treat as public */ }
  }
  next();
};

const { protect } = require('../middleware/authMiddleware');

// ─────────────────────────────────────────────────
// GET /api/products  — public browse + admin list
// ─────────────────────────────────────────────────
router.get('/', softAuth, async (req, res) => {
  try {
    const {
      mode, category, featured, bestseller, newarrival,
      trending, topselling, seasonal, search,
      status, page, limit = 20,
    } = req.query;

    let filter = {};
    const isAdmin = !!req.admin;

    // Status filter
    if (status) {
      filter.status = status;             // explicit status (admin passing "inactive")
    } else if (!isAdmin) {
      filter.status = 'active';           // public: only active
      // if admin but no status param → show all statuses
    }

    // Mode visibility (public browsing)
    if (mode === 'b2b') filter.visibleInB2B = true;
    if (mode === 'b2c') filter.visibleInB2C = true;

    // Category
    if (category) filter.category = category;

    // Feature flags
    if (featured   === 'true') filter.isFeatured   = true;
    if (bestseller === 'true') filter.isBestSeller  = true;
    if (newarrival === 'true') filter.isNewArrival   = true;
    if (trending   === 'true') filter.isTrending    = true;
    if (topselling === 'true') filter.isTopProduct  = true;
    if (seasonal   === 'true') filter.isSeasonal    = true;

    // Search
    if (search) filter.name = { $regex: search, $options: 'i' };

    const pageNum   = Math.max(1, Number(page) || 1);
    const limitNum  = Math.min(100, Number(limit));
    const skip      = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('category', 'name slug')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Product.countDocuments(filter),
    ]);

    // Always return paginated object (admin needs meta; public pages use .products)
    if (page || isAdmin) {
      return res.json({ products, total, page: pageNum, limit: limitNum });
    }

    // Legacy public array format (HomeSections uses this)
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─────────────────────────────────────────────────
// GET /api/products/:slugOrId  — single product
// ─────────────────────────────────────────────────
router.get('/:slugOrId', async (req, res) => {
  try {
    const id = req.params.slugOrId;
    const query = mongoose.Types.ObjectId.isValid(id)
      ? { _id: id }
      : { slug: id };

    const product = await Product.findOne(query).populate('category', 'name slug');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─────────────────────────────────────────────────
// POST /api/products — create (admin only)
// ─────────────────────────────────────────────────
router.post('/bulk-delete', protect, async (req, res) => {
  try {
    await Product.deleteMany({ _id: { $in: req.body.ids } });
    res.json({ message: 'Products deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ─────────────────────────────────────────────────
// PUT /api/products/:id — update (admin only)
// ─────────────────────────────────────────────────
router.put('/:id', protect, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('category', 'name slug');

    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ─────────────────────────────────────────────────
// DELETE /api/products/:id — delete (admin only)
// ─────────────────────────────────────────────────
router.delete('/:id', protect, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
