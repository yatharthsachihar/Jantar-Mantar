require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Admin = require('./models/Admin');
const Category = require('./models/Category');
const Product = require('./models/Product');
const Banner = require('./models/Banner');
const Settings = require('./models/Settings');

// Bootstrap seed only — creates the admin account and an empty Settings
// document (nav + homepage section skeleton). No demo categories, products,
// banners or content: all storefront content is added through the admin panel.
// Re-running this wipes any catalogue/banner data for a clean slate.
async function run() {
  await connectDB();

  await Promise.all([
    Category.deleteMany({}), Product.deleteMany({}), Banner.deleteMany({}),
  ]);
  console.log('🧹 Cleared categories, products, banners');

  const adminEmail = 'admin@jantar-mantar.com';
  if (!(await Admin.findOne({ email: adminEmail }))) {
    await Admin.create({ name: 'Super Admin', email: adminEmail, password: 'admin123', role: 'super_admin' });
    console.log(`✅ Admin created: ${adminEmail} / admin123`);
  } else {
    console.log('ℹ️  Admin already exists, skipping');
  }

  // Ensure a Settings document exists with the default nav + section skeleton.
  // Section definitions stay (so the homepage has structure); they render
  // nothing until you flag products in the admin panel.
  if (!(await Settings.findOne())) {
    await Settings.create({
      navItems: [
        { label: 'Home', to: '/' }, { label: 'Shop', to: '/shop' },
        { label: 'About', to: '/about' }, { label: 'Contact', to: '/contact' },
        { label: 'Track Order', to: '/track-order' },
      ],
      homeSections: [
        { key: 'bestSellers', title: 'Best Sellers', subtitle: 'Our most-loved picks', source: 'isBestSeller', visible: true, order: 0 },
        { key: 'trending', title: 'Trending Now', subtitle: 'What everyone is buying', source: 'isTrending', visible: true, order: 1 },
        { key: 'newArrivals', title: 'New Arrivals', subtitle: 'Fresh on the shelves', source: 'isNewArrival', visible: true, order: 2 },
      ],
    });
    console.log('✅ Empty settings created (nav + section skeleton)');
  } else {
    console.log('ℹ️  Settings already exist, leaving as-is');
  }

  await mongoose.disconnect();
  console.log('\n🌱 Bootstrap complete. Add your content via /admin.\n');
  process.exit(0);
}

run().catch((err) => { console.error(err); process.exit(1); });
