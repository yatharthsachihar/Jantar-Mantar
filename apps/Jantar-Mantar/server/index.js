require('dotenv').config();
const express   = require('express');
const cors      = require('cors');
const path      = require('path');
const connectDB = require('./config/db');

const app = express();
connectDB();

// Restrict CORS to known frontend origins. Set ALLOWED_ORIGINS in .env as a
// comma-separated list for production. Local dev defaults cover both
// "localhost" and "127.0.0.1" on the common Vite ports.
const DEFAULT_DEV_ORIGINS = [5173, 5174, 5175, 5176].flatMap((p) => [
  `http://localhost:${p}`, `http://127.0.0.1:${p}`,
]);
const allowedOrigins = (process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim()).filter(Boolean)
  : DEFAULT_DEV_ORIGINS);
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(null, false);
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Safe route loader — prevents one bad file from killing the server ──
function mount(app, routePath, routeFile) {
  try {
    const router = require(routeFile);
    app.use(routePath, router);
    console.log(`✅ Mounted ${routePath}`);
  } catch (err) {
    console.error(`❌ Failed to mount ${routePath}:`, err.message);
  }
}

// Routes
mount(app, '/api/auth',       './routes/auth');
mount(app, '/api/categories', './routes/categories');
mount(app, '/api/products',   './routes/products');
mount(app, '/api/banners',    './routes/banners');
mount(app, '/api/orders',     './routes/orders');
mount(app, '/api/settings',   './routes/settings');
mount(app, '/api/media',      './routes/media');
mount(app, '/api/roles',      './routes/roles');

// Health check
app.get('/', (req, res) => res.json({ message: 'Jantar-Mantar API running ✅', time: new Date() }));

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ message: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`\n🚀 Jantar-Mantar server on port ${PORT}\n`));
