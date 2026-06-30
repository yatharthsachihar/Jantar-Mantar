const express = require('express');
const Category = require('../models/Category');
const Product = require('../models/Product');
const { protect } = require('../middleware/authMiddleware');
const { isAdminRequest } = require('../middleware/isAdminRequest');
const { slugify } = require('../utils/slugify');
const router = express.Router();

// Public — active categories (admin can pass ?all=true for inactive too).
router.get('/', async (req, res) => {
  try {
    const admin = await isAdminRequest(req);
    const all = req.query.all === 'true' && admin;
    const filter = all ? { deletedAt: null } : { status: 'active', deletedAt: null };
    const categories = await Category.find(filter).sort({ displayOrder: 1, createdAt: 1 });
    const withCount = await Promise.all(categories.map(async (cat) => {
      const count = await Product.countDocuments({ category: cat._id, status: 'active', deletedAt: null });
      return { ...cat.toObject(), productCount: count };
    }));
    res.json(withCount);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const cat = await Category.findById(req.params.id);
    if (!cat || cat.deletedAt) return res.status(404).json({ message: 'Not found' });
    res.json(cat);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', protect, async (req, res) => {
  try {
    const body = { ...req.body };
    if (!body.slug && body.name) body.slug = slugify(body.name);
    const category = await Category.create(body);
    res.status(201).json(category);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(category);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category || category.deletedAt) return res.status(404).json({ message: 'Category not found' });
    category.deletedAt = new Date();
    category.deletedBy = req.admin.email;
    await category.save();
    res.json({ message: 'Category deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
