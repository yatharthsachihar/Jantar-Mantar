const express = require('express');
const Settings = require('../models/Settings');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Defaults applied when the settings document is first created. Gives the
// storefront sensible Sagat-style nav and homepage sections out of the box.
const DEFAULTS = {
  navItems: [
    { label: 'Home', to: '/' },
    { label: 'Shop', to: '/shop' },
    { label: 'About', to: '/about' },
    { label: 'Contact', to: '/contact' },
    { label: 'Track Order', to: '/track-order' },
  ],
  homeSections: [
    { key: 'bestSellers', title: 'Best Sellers', subtitle: 'Our most-loved picks', source: 'isBestSeller', visible: true, order: 0 },
    { key: 'trending',    title: 'Trending Now', subtitle: 'What everyone is buying', source: 'isTrending', visible: true, order: 1 },
    { key: 'newArrivals', title: 'New Arrivals', subtitle: 'Fresh on the shelves', source: 'isNewArrival', visible: true, order: 2 },
  ],
};

async function getOrCreate() {
  let settings = await Settings.findOne();
  if (!settings) settings = await Settings.create(DEFAULTS);
  return settings;
}

// Public — read settings.
router.get('/', async (_req, res) => {
  try {
    const settings = await getOrCreate();
    res.json(settings);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Admin — update settings.
router.put('/', protect, async (req, res) => {
  try {
    const settings = await getOrCreate();
    Object.assign(settings, req.body);
    await settings.save();
    res.json(settings);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

module.exports = router;
