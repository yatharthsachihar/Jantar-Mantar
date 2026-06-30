const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Settings = require('../models/Settings');
const { MODULES } = require('../utils/permissionDefaults');

const WRITE_LEVELS = new Set(['full', 'edit', 'write']);

// Cache the permission matrix briefly so RBAC checks don't hit Mongo on every
// request. The authoritative matrix lives on the Settings document; we fall
// back to the hardcoded defaults when it's empty.
let _matrixCache = { matrix: null, at: 0 };
const MATRIX_TTL_MS = 30 * 1000;
async function getPermissionMatrix() {
  const now = Date.now();
  if (_matrixCache.matrix && now - _matrixCache.at < MATRIX_TTL_MS) return _matrixCache.matrix;
  const settings = await Settings.findOne().lean();
  const matrix = (settings?.permissionMatrix?.length) ? settings.permissionMatrix : MODULES;
  _matrixCache = { matrix, at: now };
  return matrix;
}

// Map a request URL to the RBAC module key it belongs to.
function moduleForUrl(url = '') {
  if (url.includes('/banners'))    return 'banners';
  if (url.includes('/settings'))   return 'settings';
  if (url.includes('/roles'))      return 'users';
  if (url.includes('/auth/users')) return 'users';
  if (url.includes('/products'))   return 'products';
  if (url.includes('/categories')) return 'categories';
  if (url.includes('/orders'))     return 'orders';
  if (url.includes('/media'))      return 'media';
  return null;
}

const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token, unauthorized' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.type && decoded.type !== 'admin') {
      return res.status(401).json({ message: 'Not an admin token' });
    }
    req.admin = await Admin.findById(decoded.id).select('-password');
    if (!req.admin) return res.status(401).json({ message: 'Admin not found, unauthorized' });
    if (req.admin.isActive === false) {
      return res.status(403).json({ message: 'This admin account has been deactivated' });
    }

    // RBAC enforcement on writes (super_admin bypasses).
    if (req.admin.role !== 'super_admin' && req.method !== 'GET') {
      const moduleKey = moduleForUrl(req.originalUrl || '');
      if (moduleKey) {
        const matrix = await getPermissionMatrix();
        const mod = Array.isArray(matrix) && matrix.find(m => m.key === moduleKey);
        if (mod && mod.permissions) {
          const level = mod.permissions[req.admin.role] || 'none';
          if (!WRITE_LEVELS.has(level)) {
            return res.status(403).json({ message: 'Read-only access. Your role cannot modify this module.' });
          }
        }
      }
    }

    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

function clearPermissionMatrixCache() {
  _matrixCache = { matrix: null, at: 0 };
}

module.exports = { protect, clearPermissionMatrixCache };
