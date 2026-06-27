const express  = require('express');
const Media    = require('../models/Media');
const Product  = require('../models/Product');
const Category = require('../models/Category');
const Banner   = require('../models/Banner');
const Blog     = require('../models/Blog');
const Settings = require('../models/Settings');
const { upload } = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');
const { formLimiter } = require('../middleware/rateLimiters');

const router = express.Router();

// Checks every place a media URL can be referenced from. Used to block
// deletion of a file that's still actively used somewhere on the site.
const SETTINGS_IMAGE_FIELDS = ['storeLogo', 'aboutHeroImage', 'ogImage', 'schemaOrgLogo'];
async function findMediaReferences(url) {
  const [productCount, categoryCount, bannerCount, blogCount, settingsDoc] = await Promise.all([
    Product.countDocuments({ images: url, deletedAt: null }),
    Category.countDocuments({ image: url, deletedAt: null }),
    Banner.countDocuments({ image: url }),
    Blog.countDocuments({ featuredImage: url }),
    Settings.findOne().lean(),
  ]);
  const settingsHit = !!settingsDoc && SETTINGS_IMAGE_FIELDS.some((f) => settingsDoc[f] === url);
  return { productCount, categoryCount, bannerCount, blogCount, settingsHit,
    total: productCount + categoryCount + bannerCount + blogCount + (settingsHit ? 1 : 0) };
}

// GET /api/media — list all media, optional ?folder= filter, ?deleted=true for trash
// (admin only — media library)
router.get('/', protect, async (req, res) => {
  try {
    const filter = req.query.deleted === 'true' ? { deletedAt: { $ne: null } } : { deletedAt: null };
    if (req.query.folder) filter.folder = req.query.folder;
    const items = await Media.find(filter).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/media/upload — multipart, field name "file"
// Multer 2 + Express 5: use next(err) pattern, not try/catch around upload()
router.post('/upload', protect, formLimiter, (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      // MulterError or our custom fileFilter error
      return res.status(err.status || 400).json({ message: err.message });
    }
    next();
  });
}, async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file received' });

    const media = await Media.create({
      filename:     req.file.filename,
      originalName: req.file.originalname,
      url:          `/uploads/media/${req.file.filename}`,
      mimeType:     req.file.mimetype,
      size:         req.file.size,
      folder:       req.body.folder || 'general',
    });

    res.status(201).json(media);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/media/:id — soft delete. The file stays on disk; only the
// Media record is marked deleted. Blocked if still referenced anywhere
// unless ?force=true.
router.delete('/:id', protect, async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media || media.deletedAt) return res.status(404).json({ message: 'Not found' });

    const force = req.query.force === 'true';
    const refs = await findMediaReferences(media.url);
    if (refs.total > 0 && !force) {
      return res.status(409).json({
        message: 'This file is still in use. Remove it from those places first, or pass force=true to delete anyway.',
        references: refs,
      });
    }

    media.deletedAt = new Date();
    media.deletedBy = req.admin.email;
    media.deleteReason = req.body?.reason || null;
    await media.save();

    res.json({ message: 'Media moved to trash (file kept on disk)' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/media/:id/restore — restore a soft-deleted media record
router.patch('/:id/restore', protect, async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media || !media.deletedAt) return res.status(404).json({ message: 'Not found in trash' });

    media.deletedAt = null;
    media.deletedBy = null;
    media.deleteReason = null;
    await media.save();

    res.json(media);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
