const express = require('express');
const fs = require('fs');
const path = require('path');
const Media = require('../models/Media');
const { protect } = require('../middleware/authMiddleware');
const { upload, UPLOAD_DIR } = require('../middleware/uploadMiddleware');
const router = express.Router();

// Admin — list uploaded media (newest first).
router.get('/', protect, async (_req, res) => {
  try {
    const media = await Media.find().sort({ createdAt: -1 });
    res.json(media);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Admin — upload an image. Returns a usable /uploads/... URL.
router.post('/', protect, (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) return res.status(err.status || 400).json({ message: err.message });
    next();
  });
}, async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded (field name must be "file")' });
    const url = `/uploads/media/${req.file.filename}`;
    const media = await Media.create({
      url,
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      uploadedBy: req.admin.email,
    });
    res.status(201).json(media);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Admin — delete a media record and its file.
router.delete('/:id', protect, async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) return res.status(404).json({ message: 'Media not found' });
    const filePath = path.join(UPLOAD_DIR, media.filename);
    fs.unlink(filePath, () => {});
    await media.deleteOne();
    res.json({ message: 'Media deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
