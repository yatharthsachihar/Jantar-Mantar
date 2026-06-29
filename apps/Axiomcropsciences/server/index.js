require('dotenv').config();
const express   = require('express');
const cors      = require('cors');
const path      = require('path');
const connectDB = require('./config/db');

const { activityLogger } = require('./middleware/activityLogger');

const app = express();
connectDB();

// Restrict CORS to known frontend origins. Set ALLOWED_ORIGINS in .env as a
// comma-separated list for production (e.g. "https://axiomseeds.in,https://www.axiomseeds.in").
// Local dev defaults cover both "localhost" and "127.0.0.1" on the common
// Vite ports — they are different CORS origins even though they resolve to
// the same machine, and Vite falls back to 5174/5175/etc if 5173 is busy.
const DEFAULT_DEV_ORIGINS = [5173, 5174, 5175, 5176].flatMap((p) => [
  `http://localhost:${p}`, `http://127.0.0.1:${p}`,
]);
const allowedOrigins = (process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim()).filter(Boolean)
  : DEFAULT_DEV_ORIGINS);
app.use(cors({
  origin: (origin, callback) => {
    // No origin = same-origin/server-to-server/curl — allow.
    // Unknown origin = callback(null, false), NOT an Error — cors() just
    // omits the CORS headers so the browser cleanly blocks the response,
    // instead of throwing into Express's generic handler and returning an
    // opaque 500 for every request (including legitimate ones, if anything
    // upstream double-fires this).
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(null, false);
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Global activity logger — intercepts all /api mutations after auth
app.use('/api', activityLogger);

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Safe route loader — prevents one bad file from killing the server ──
function mount(app, path, routeFile) {
  try {
    const router = require(routeFile);
    app.use(path, router);
    console.log(`✅ Mounted ${path}`);
  } catch (err) {
    console.error(`❌ Failed to mount ${path}:`, err.message);
  }
}

// Auth
mount(app, '/api/auth',       './routes/auth');
mount(app, '/api/roles',      './routes/roleRoutes');

// Users (site customers)
mount(app, '/api/users',      './routes/userRoutes');

// Catalog
mount(app, '/api/products',   './routes/Products');
mount(app, '/api/categories', './routes/categories');

// Sales
mount(app, '/api/orders',     './routes/orders');
mount(app, '/api/enquiries',  './routes/enquiries');
mount(app, '/api/coupons',    './routes/couponRoutes');

// Payments
mount(app, '/api/razorpay',   './routes/razorpayRoutes');

// Content
mount(app, '/api/banners',    './routes/banners');
mount(app, '/api/blogs',      './routes/blogRoutes');
mount(app, '/api/pages',      './routes/pageRoutes');
mount(app, '/api/media',      './routes/mediaRoutes');

// Marketing / SEO
mount(app, '/api/seo',        './routes/seoRoutes');

// System
mount(app, '/api/settings',   './routes/settingsRoutes');
mount(app, '/api/logs',       './routes/logsRoute');
mount(app, '/api/notifications', './routes/notificationRoutes');
mount(app, '/api/otp',          './routes/otpRoutes');

// Health check
app.get('/', (req, res) => res.json({ message: 'Axiom Seeds API running ✅', time: new Date() }));

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ message: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`\n🚀 Axiom Seeds server on port ${PORT}\n`));
