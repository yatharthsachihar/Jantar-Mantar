const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const protect = async (req, res, next) => {
  let token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token, unauthorized' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = await Admin.findById(decoded.id).select('-password');
    if (!req.admin) return res.status(401).json({ message: 'Admin not found, unauthorized' });
    
    // Dynamic RBAC Strict Enforcement
    if (req.admin.role !== 'super_admin' && req.method !== 'GET') {
      const RolePermission = require('../models/RolePermission');
      const url = req.originalUrl || '';
      let moduleKey = null;
      
      if (url.includes('/banners')) moduleKey = 'banners';
      else if (url.includes('/settings')) moduleKey = 'settings';
      else if (url.includes('/auth/users')) moduleKey = 'users';
      else if (url.includes('/products')) moduleKey = 'products';
      else if (url.includes('/categories')) moduleKey = 'categories';
      else if (url.includes('/orders')) moduleKey = 'orders';
      else if (url.includes('/customers')) moduleKey = 'customers';
      else if (url.includes('/blogs')) moduleKey = 'blog';
      else if (url.includes('/pages')) moduleKey = 'pages';
      else if (url.includes('/coupons')) moduleKey = 'coupons';
      else if (url.includes('/enquiries')) moduleKey = 'enquiries';
      else if (url.includes('/media')) moduleKey = 'media';
      else if (url.includes('/seo')) moduleKey = 'seo';
      else if (url.includes('/website')) moduleKey = 'website_builder';
      else if (url.includes('/theme')) moduleKey = 'theme_builder';
      
      if (moduleKey) {
        const rp = await RolePermission.findOne();
        if (rp && rp.matrix) {
          const mod = rp.matrix.find(m => m.key === moduleKey);
          if (mod) {
            const level = mod.permissions[req.admin.role] || 'none';
            if (level !== 'full') {
              return res.status(403).json({ message: 'Read-only mode. Your role lacks full access to modify this module.' });
            }
          }
        }
      }
    }

    next();
  } catch (err) {
    console.error("Auth Middleware Error:", err);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = { protect };
