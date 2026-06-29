const express = require('express');
const crypto = require('crypto');
const Otp = require('../models/Otp');
const { sendOtp, isConfigured } = require('../services/swiftzap');
const { formLimiter } = require('../middleware/rateLimiters');

const router = express.Router();

const OTP_TTL_MS = 5 * 60 * 1000;   // OTP valid for 5 minutes
const MAX_ATTEMPTS = 5;             // failed verifications before a code is burned
const isProd = process.env.NODE_ENV === 'production';

// Hash the OTP with the phone as salt so a DB leak never exposes usable codes.
const hashOtp = (phone, code) =>
  crypto.createHash('sha256').update(`${phone}:${code}`).digest('hex');

// Normalize "+91" + "9876543210" → "+919876543210". Accepts code already
// merged into the number too.
function normalizePhone(countryCode, mobile) {
  const cc = String(countryCode || '').replace(/[^\d+]/g, '');
  const num = String(mobile || '').replace(/\D/g, '');
  if (!num) return '';
  const prefix = cc.startsWith('+') ? cc : (cc ? `+${cc}` : '');
  return `${prefix}${num}`;
}

// POST /api/otp/send  { countryCode, mobile, purpose? }
router.post('/send', formLimiter, async (req, res) => {
  try {
    const phone = normalizePhone(req.body.countryCode, req.body.mobile);
    if (!phone || phone.replace(/\D/g, '').length < 8) {
      return res.status(400).json({ message: 'A valid mobile number with country code is required.' });
    }

    const code = String(crypto.randomInt(100000, 1000000)); // 6-digit
    const otpHash = hashOtp(phone, code);
    const expiresAt = new Date(Date.now() + OTP_TTL_MS);

    // One active OTP per phone — replace any previous one.
    await Otp.findOneAndUpdate(
      { phone, purpose: req.body.purpose || 'auth' },
      { phone, otpHash, purpose: req.body.purpose || 'auth', attempts: 0, verified: false, expiresAt },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    const { devMode } = await sendOtp(phone, code);

    res.json({
      message: devMode ? 'OTP generated (dev mode — SMS not sent).' : 'OTP sent to your mobile.',
      // Only ever leak the code outside production / in dev mode, for testing.
      ...((!isProd || devMode) ? { devOtp: code } : {}),
      configured: isConfigured(),
    });
  } catch (err) {
    console.error('OTP send error:', err.message);
    res.status(500).json({ message: 'Could not send OTP. Please try again.' });
  }
});

// POST /api/otp/verify  { countryCode, mobile, otp, purpose? }
router.post('/verify', formLimiter, async (req, res) => {
  try {
    const phone = normalizePhone(req.body.countryCode, req.body.mobile);
    const code = String(req.body.otp || '').replace(/\D/g, '');
    if (!phone || !code) {
      return res.status(400).json({ message: 'Mobile number and OTP are required.' });
    }

    const record = await Otp.findOne({ phone, purpose: req.body.purpose || 'auth' });
    if (!record || record.expiresAt < new Date()) {
      return res.status(400).json({ message: 'OTP expired or not found. Please request a new one.' });
    }
    if (record.attempts >= MAX_ATTEMPTS) {
      return res.status(429).json({ message: 'Too many incorrect attempts. Please request a new OTP.' });
    }

    if (record.otpHash !== hashOtp(phone, code)) {
      record.attempts += 1;
      await record.save();
      return res.status(400).json({ message: 'Incorrect OTP. Please try again.' });
    }

    record.verified = true;
    await record.save();
    res.json({ verified: true, message: 'Mobile number verified.' });
  } catch (err) {
    console.error('OTP verify error:', err.message);
    res.status(500).json({ message: 'Could not verify OTP. Please try again.' });
  }
});

module.exports = router;
