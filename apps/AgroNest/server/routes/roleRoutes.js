const express = require('express');
const router  = express.Router();
const RolePermission = require('../models/RolePermission');
const { protect }    = require('../middleware/authMiddleware');

const DEFAULT_MATRIX = [
  { label:'Dashboard',         key:'dashboard',      permissions:{ super_admin:'full', admin:'full', editor:'view', support:'view',  viewer:'view' } },
  { label:'Products',          key:'products',       permissions:{ super_admin:'full', admin:'full', editor:'full', support:'view',  viewer:'view' } },
  { label:'Categories',        key:'categories',     permissions:{ super_admin:'full', admin:'full', editor:'full', support:'view',  viewer:'view' } },
  { label:'Orders',            key:'orders',         permissions:{ super_admin:'full', admin:'full', editor:'view', support:'full',  viewer:'view' } },
  { label:'Enquiries',         key:'enquiries',      permissions:{ super_admin:'full', admin:'full', editor:'view', support:'full',  viewer:'view' } },
  { label:'Customers',         key:'customers',      permissions:{ super_admin:'full', admin:'full', editor:'none', support:'full',  viewer:'view' } },
  { label:'Banners',           key:'banners',        permissions:{ super_admin:'full', admin:'full', editor:'full', support:'none',  viewer:'view' } },
  { label:'Blog',              key:'blog',           permissions:{ super_admin:'full', admin:'full', editor:'full', support:'none',  viewer:'view' } },
  { label:'Pages / CMS',       key:'pages',          permissions:{ super_admin:'full', admin:'full', editor:'full', support:'none',  viewer:'view' } },
  { label:'Media Library',     key:'media',          permissions:{ super_admin:'full', admin:'full', editor:'full', support:'none',  viewer:'view' } },
  { label:'Coupons',           key:'coupons',        permissions:{ super_admin:'full', admin:'full', editor:'none', support:'none',  viewer:'view' } },
  { label:'Analytics',         key:'analytics',      permissions:{ super_admin:'full', admin:'full', editor:'view', support:'view',  viewer:'view' } },
  { label:'Website Builder',   key:'website_builder',permissions:{ super_admin:'full', admin:'full', editor:'full', support:'none',  viewer:'view' } },
  { label:'Theme Builder',     key:'theme_builder',  permissions:{ super_admin:'full', admin:'full', editor:'none', support:'none',  viewer:'view' } },
  { label:'SEO',               key:'seo',            permissions:{ super_admin:'full', admin:'full', editor:'full', support:'none',  viewer:'view' } },
  { label:'Settings',          key:'settings',       permissions:{ super_admin:'full', admin:'full', editor:'none', support:'none',  viewer:'view' } },
  { label:'Users (Admin Team)',key:'users',           permissions:{ super_admin:'full', admin:'view', editor:'none', support:'none',  viewer:'none' } },
  { label:'Roles & Permissions',key:'roles',         permissions:{ super_admin:'full', admin:'view', editor:'none', support:'none',  viewer:'none' } },
  { label:'Activity Logs',     key:'logs',           permissions:{ super_admin:'full', admin:'full', editor:'none', support:'none',  viewer:'view' } },
];

// GET /api/roles/matrix — any authenticated admin can read
router.get('/matrix', protect, async (req, res) => {
  try {
    let doc = await RolePermission.findOne();
    if (!doc || !doc.matrix?.length) {
      doc = await RolePermission.create({ matrix: DEFAULT_MATRIX });
    }
    res.json(doc.matrix);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/roles/matrix — only super_admin can save
router.put('/matrix', protect, async (req, res) => {
  try {
    if (req.admin.role !== 'super_admin') {
      return res.status(403).json({ message: 'Only Super Admins can modify the permission matrix.' });
    }

    // Body is the array directly
    const incoming = Array.isArray(req.body) ? req.body : null;
    if (!incoming || !incoming.length) {
      return res.status(400).json({ message: 'Invalid matrix data — expected an array.' });
    }

    // Protect super_admin — always full on everything
    const sanitised = incoming.map(mod => ({
      ...mod,
      permissions: {
        ...mod.permissions,
        super_admin: 'full', // never allow modifying super_admin
      },
    }));

    let doc = await RolePermission.findOne();
    if (!doc) {
      doc = new RolePermission({ matrix: sanitised });
    } else {
      doc.matrix = sanitised;
      doc.markModified('matrix');
    }

    await doc.save();
    res.json(doc.matrix);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST /api/roles/reset — super_admin only, resets to defaults
router.post('/reset', protect, async (req, res) => {
  try {
    if (req.admin.role !== 'super_admin') {
      return res.status(403).json({ message: 'Only Super Admins can reset permissions.' });
    }
    let doc = await RolePermission.findOne();
    if (!doc) {
      doc = new RolePermission({ matrix: DEFAULT_MATRIX });
    } else {
      doc.matrix = DEFAULT_MATRIX;
      doc.markModified('matrix');
    }
    await doc.save();
    res.json(doc.matrix);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
