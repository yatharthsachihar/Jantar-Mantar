const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Non-throwing check: does this request carry a valid admin token? Used on
// public GET routes that accept admin-only overrides (?all=true) so they
// never leak inactive content to unauthenticated callers.
async function isAdminRequest(req) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return false;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return !!(await Admin.findById(decoded.id).select('_id'));
  } catch { return false; }
}

module.exports = { isAdminRequest };
