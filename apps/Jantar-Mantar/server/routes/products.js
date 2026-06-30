const express = require('express');
const mongoose = require('mongoose');
const Product = require('../models/Product');
const jwt = require('jsonwebtoken');
const { protect } = require('../middleware/authMiddleware');
const { slugify } = require('../utils/slugify');
const router = express.Router();

// Soft auth — attach admin if a valid token is present, never block.
const softAuth = (req, _res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    try { req.admin = jwt.verify(token, process.env.JWT_SECRET); } catch { /* public */ }
  }
  next();
};

const FLAG_QUERY = {
  isBestSeller: 'isBestSeller',
  isTrending: 'isTrending',
  isNewArrival: 'isNewArrival',
  isFeatured: 'isFeatured',
};

// GET /api/products — public browse + admin list
router.get('/', softAuth, async (req, res) => {
  try {
    const { search, category, sort = 'createdAt', order = 'desc', page, limit = 20, status } = req.query;
    const isAdmin = !!req.admin;
    const filter = {};

    if (isAdmin && req.query.deleted === 'true') filter.deletedAt = { $ne: null };
    else filter.deletedAt = null;

    if (status) filter.status = status;
    else if (!isAdmin) filter.status = 'active';

    if (category) {
      // accept category id or slug-less id only; client passes id
      if (mongoose.Types.ObjectId.isValid(category)) filter.category = category;
    }
    if (search) filter.name = { $regex: search, $options: 'i' };

    for (const [q, field] of Object.entries(FLAG_QUERY)) {
      if (req.query[q] === 'true') filter[field] = true;
    }

    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.min(100, Number(limit) || 20);
    const skip = (pageNum - 1) * limitNum;
    const sortDir = order === 'asc' ? 1 : -1;
    const sortObj = { [sort]: sortDir };

    const [products, total] = await Promise.all([
      Product.find(filter).populate('category', 'name slug').sort(sortObj).skip(skip).limit(limitNum),
      Product.countDocuments(filter),
    ]);

    if (page || isAdmin) return res.json({ products, total, page: pageNum, limit: limitNum });
    res.json(products);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/products/:slugOrId
router.get('/:slugOrId', async (req, res) => {
  try {
    const id = req.params.slugOrId;
    const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { slug: id };
    const product = await Product.findOne(query).populate('category', 'name slug');
    if (!product || product.deletedAt || product.status !== 'active') {
      // allow admins to fetch inactive by id
      if (!product || product.deletedAt) return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/products
router.post('/', protect, async (req, res) => {
  try {
    const body = { ...req.body };
    if (!body.slug && body.name) body.slug = slugify(body.name);
    if (Array.isArray(body.variations) && body.variations.length) body.hasVariations = true;
    const product = await Product.create(body);
    res.status(201).json(product);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// PUT /api/products/:id
router.put('/:id', protect, async (req, res) => {
  try {
    const body = { ...req.body };
    body.hasVariations = Array.isArray(body.variations) && body.variations.length > 0;
    if (!body.hasVariations) body.variations = [];
    const product = await Product.findByIdAndUpdate(req.params.id, body, { new: true, runValidators: true })
      .populate('category', 'name slug');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// PATCH /api/products/:id/flags — toggle homepage collection flags
const FLAG_KEYS = ['isBestSeller', 'isTrending', 'isNewArrival', 'isFeatured'];
router.patch('/:id/flags', protect, async (req, res) => {
  try {
    const update = {};
    for (const k of FLAG_KEYS) if (req.body[k] !== undefined) update[k] = !!req.body[k];
    if (!Object.keys(update).length) return res.status(400).json({ message: 'No flags provided' });
    const product = await Product.findByIdAndUpdate(req.params.id, update, { new: true }).populate('category', 'name slug');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// DELETE /api/products/:id — soft delete
router.delete('/:id', protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product || product.deletedAt) return res.status(404).json({ message: 'Product not found' });
    product.deletedAt = new Date();
    product.deletedBy = req.admin.email;
    await product.save();
    res.json({ message: 'Product deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
