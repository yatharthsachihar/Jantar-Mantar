const rateLimit = require('express-rate-limit');

// Strict limiter for credential-guessing surfaces (admin/user login, register).
// skipSuccessfulRequests: a successful login (2xx) does NOT count toward the
// limit, so only failed attempts accrue — this is what protects against
// brute force while never locking out someone who eventually types the right
// password. Limit is 20 failed tries / 15 min, which is plenty of headroom
// for honest typos but still stops automated guessing.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  limit: 20,
  skipSuccessfulRequests: true,
  message: { message: 'Too many login attempts. Please wait a few minutes and try again.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Looser limiter for spam/abuse-prone but legitimate-traffic endpoints
// (enquiry form, coupon validation, file upload).
const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  message: { message: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { authLimiter, formLimiter };
