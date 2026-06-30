const express = require('express');
const Settings = require('../models/Settings');
const { protect, clearPermissionMatrixCache } = require('../middleware/authMiddleware');
const { MODULES } = require('../utils/permissionDefaults');
const router = express.Router();

// Admin — read the permission matrix (falls back to defaults).
router.get('/', protect, async (_req, res) => {
  try {
    const settings = await Settings.findOne().lean();
    const matrix = settings?.permissionMatrix?.length ? settings.permissionMatrix : MODULES;
    res.json(matrix);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Admin (super_admin only) — replace the permission matrix.
router.put('/', protect, async (req, res) => {
  try {
    if (req.admin.role !== 'super_admin')
      return res.status(403).json({ message: 'Only super_admin can edit roles.' });
    const { matrix } = req.body;
    if (!Array.isArray(matrix)) return res.status(400).json({ message: 'matrix must be an array' });
    let settings = await Settings.findOne();
    if (!settings) settings = await Settings.create({});
    settings.permissionMatrix = matrix;
    await settings.save();
    clearPermissionMatrixCache();
    res.json(settings.permissionMatrix);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

module.exports = router;
