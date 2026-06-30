const mongoose = require('mongoose');

// Single-document settings — drives the storefront's dynamic chrome and the
// homepage builder. A section descriptor controls one homepage product strip.
const sectionSchema = new mongoose.Schema({
  key:     { type: String, required: true },   // 'bestSellers' | 'trending' | 'newArrivals' | 'featured'
  title:   { type: String, default: '' },
  subtitle:{ type: String, default: '' },
  source:  { type: String, default: 'isBestSeller' }, // product flag/query driving the strip
  visible: { type: Boolean, default: true },
  order:   { type: Number, default: 0 },
}, { _id: false });

const navItemSchema = new mongoose.Schema({
  label: { type: String, required: true },
  to:    { type: String, default: '/' },
}, { _id: false });

const settingsSchema = new mongoose.Schema({
  // Store identity
  storeName: { type: String, default: 'Jantar-Mantar' },
  tagline:   { type: String, default: 'Pure spices, dry fruits & herbal goodness' },
  storeLogo: { type: String, default: '' },
  currency:  { type: String, default: 'INR' },

  // Contact
  storeEmail:   { type: String, default: '' },
  storePhone:   { type: String, default: '' },
  storeAddress: { type: String, default: '' },

  // Theme — admin-editable via the Theme Builder. These drive the storefront's
  // CSS variables and fonts at runtime (see client ThemeProvider).
  colorPrimary:     { type: String, default: '#1f9d55' },  // green CTA
  colorPrimaryDark: { type: String, default: '#178045' },  // hover / pressed
  colorText:        { type: String, default: '#0f1c33' },  // navy text
  colorBg:          { type: String, default: '#ffffff' },
  colorSurface:     { type: String, default: '#f6f8fb' },
  colorBorder:      { type: String, default: '#e6eaf0' },
  colorAccent:      { type: String, default: '#e3342f' },  // sale/badge red
  fontBody:         { type: String, default: 'Inter' },
  fontHeading:      { type: String, default: 'Inter' },
  radius:           { type: String, default: '14px' },     // card/control radius
  buttonRadius:     { type: String, default: '14px' },

  // Announcement bar
  announcementBar:    { type: String, default: 'Free shipping on orders above ₹499' },
  announcementActive: { type: Boolean, default: true },

  // Header navigation
  navItems: { type: [navItemSchema], default: [] },

  // Homepage builder
  showCategoryRow:   { type: Boolean, default: true },
  showTopCategories: { type: Boolean, default: true },
  homeSections: { type: [sectionSchema], default: [] },

  // Footer
  footerText:      { type: String, default: '© Jantar-Mantar. All rights reserved.' },
  footerAbout:     { type: String, default: 'Bringing you pure, authentic spices and dry fruits sourced directly from farms.' },
  footerQuickLinks: { type: Array, default: [] },

  // Social links
  socialLinks: {
    facebook:  { type: String, default: '' },
    instagram: { type: String, default: '' },
    whatsapp:  { type: String, default: '' },
    youtube:   { type: String, default: '' },
  },

  // Permission matrix (editable by super_admin)
  permissionMatrix: { type: Array, default: [] },
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
