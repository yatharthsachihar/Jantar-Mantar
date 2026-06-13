const Product = require('./models/Product');
const dotenv = require('dotenv');
const connectDB = require('./db.js');

dotenv.config();

const products = [
  {
    name: 'Lavender Essential Oil',
    category: 'Oils',
    price: 299,
    image: 'https://m.media-amazon.com/images/I/5127pwc1zBL._SY300_SX300_QL70_FMwebp_.jpg',
    shortDesc: 'Pure lavender essential oil for relaxation',
    fullDesc: 'Premium 100% pure lavender oil extracted from French lavender plants. Perfect for aromatherapy and skincare routines.',
    quantity: 10
  },
  {
    name: 'Premium Yoga Mat',
    category: 'Meditation',
    price: 499,
    image: 'https://m.media-amazon.com/images/I/81q-gtF5lNL._SX679_.jpg',
    shortDesc: 'Premium Yoga mat for daily session of meditating.',
    fullDesc: 'Premium Yoga mat with guided alignment lines printed directly onto the mat for easy positioning and proper alignment during yoga practice.',
    quantity: 10
  },
  {
    name: 'Ashwagandha Capsules',
    category: 'Supplements',
    price: 599,
    image: 'https://m.media-amazon.com/images/I/71XBUfBC64L._SX679_.jpg',
    shortDesc: 'Stress relief adaptogen supplement',
    fullDesc: 'Organic ashwagandha with 500mg per capsule. Supports stress management and overall wellness.',
    quantity: 10,
  },
  {
    name: 'Green Tea Face Mask',
    category: 'Skincare',
    price: 349,
    image: 'https://m.media-amazon.com/images/I/41Wb3-5UhAL._SY679_.jpg',
    shortDesc: 'Antioxidant-rich face treatment',
    fullDesc: 'Matcha green tea powder mask detoxifies and brightens. 100g per jar.',
    quantity: 10,
  },
  {
    name: 'Turmeric Glow Serum',
    category: 'Skincare',
    price: 799,
    image: 'https://m.media-amazon.com/images/I/51zZo49wleL._SX522_.jpg',
    shortDesc: 'Anti-inflammatory brightening serum',
    fullDesc: 'Golden turmeric + vitamin C serum. Reduces inflammation and evens skin tone. 30ml bottle.',
    quantity: 10
  },
  {
    name: 'Chamomile Sleep Tea',
    category: 'Tea',
    price: 249,
    image: 'https://m.media-amazon.com/images/I/81yOr42tDXL._SX679_PIbundle-25,TopRight,0,0_AA679SH20_.jpg',
    shortDesc: 'Calming herbal tea blend',
    fullDesc: 'Organic chamomile, passionflower, and valerian root. Promotes restful sleep. 20 tea bags.',
    quantity: 10
  },
  {
    name: 'Meditation cushion',
    category: 'Meditation',
    price: 749,
    image: 'https://m.media-amazon.com/images/I/81rWOMweClL._SX679_.jpg',
    shortDesc: 'Cushion specifically for meditation',
    fullDesc: 'Meditation cusion which is good for muscle relaxation with healing properties',
    quantity: 10
  }

];

(async () => {
  try {
    await connectDB();
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log('✓ Seeded 6 products');
    process.exit(0);
  } catch (err) {
    console.error('✗ Seed error:', err.message);
    process.exit(1);
  }
})();