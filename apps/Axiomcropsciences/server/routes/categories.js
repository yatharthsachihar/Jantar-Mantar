const express  = require('express');
const Category = require('../models/Category');
const Product  = require('../models/Product');
const { protect } = require('../middleware/authMiddleware');
const { isAdminRequest } = require('../middleware/isAdminRequest');
const router = express.Router();

// Public — all active categories with product count
router.get('/', async (req, res) => {
  try {
    const admin = await isAdminRequest(req);

    // ?deleted=true (admin trash view) is mutually exclusive with the normal
    // live listing — never mixed together.
    if (req.query.deleted === 'true' && admin) {
      const trashed = await Category.find({ deletedAt: { $ne: null } }).sort({ deletedAt: -1 });
      return res.json(trashed);
    }

    // ?all=true (inactive categories included) only honored for admin auth.
    const all = req.query.all === 'true' && admin;
    const filter = all ? { deletedAt: null } : { status: 'active', deletedAt: null };
    const categories = await Category.find(filter).sort({ displayOrder: 1 });

    // Attach product count to each category
    const withCount = await Promise.all(
      categories.map(async (cat) => {
        const count = await Product.countDocuments({ category: cat._id, status: 'active', deletedAt: null });
        return { ...cat.toObject(), productCount: count };
      })
    );
    res.json(withCount);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Admin — GET one category
router.get('/:id', async (req, res) => {
  try {
    const cat = await Category.findById(req.params.id);
    if (!cat || cat.deletedAt) return res.status(404).json({ message: 'Not found' });
    res.json(cat);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Admin — CREATE
router.post('/', protect, async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// Admin — UPDATE
router.put('/:id', protect, async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(category);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// Admin — soft DELETE. Blocked if active products still reference this
// category unless ?force=true is passed (the products would otherwise be
// left pointing at a vanished category).
router.delete('/:id', protect, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category || category.deletedAt) return res.status(404).json({ message: 'Category not found' });

    const force = req.query.force === 'true';
    const activeProductCount = await Product.countDocuments({ category: category._id, deletedAt: null, status: 'active' });
    if (activeProductCount > 0 && !force) {
      return res.status(409).json({
        message: `${activeProductCount} active product(s) still use this category. Reassign them or pass force=true to delete anyway.`,
        activeProductCount,
      });
    }

    category.deletedAt = new Date();
    category.deletedBy = req.admin.email;
    category.deleteReason = req.body?.reason || null;
    await category.save();

    res.json({ message: 'Category moved to trash' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Admin — restore a soft-deleted category
router.patch('/:id/restore', protect, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category || !category.deletedAt) return res.status(404).json({ message: 'Category not found in trash' });

    category.deletedAt = null;
    category.deletedBy = null;
    category.deleteReason = null;
    await category.save();

    res.json(category);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
