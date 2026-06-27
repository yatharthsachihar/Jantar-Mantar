const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Non-throwing check for "does this request carry a valid admin token?" —
// used on public GET routes that accept admin-only query overrides
// (?all=true, ?status=draft) so they don't leak unpublished content to
// unauthenticated callers while still working for the admin panel.
async function isAdminRequest(req) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return false;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return !!(await Admin.findById(decoded.id).select('_id'));
  } catch { return false; }
}

module.exports = { isAdminRequest };
