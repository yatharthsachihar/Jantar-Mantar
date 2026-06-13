const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  description: { type: String, default: '' },
  shortDescription: { type: String, default: '' },
  images: [{ type: String }],
  price: { type: Number, default: 0 },
  stock: { type: Number, default: 0 },
  unit: { type: String, default: 'kg' },
  specifications: [{ key: String, value: String }],
  // Visibility flags — admin controls these
  visibleInB2B: { type: Boolean, default: true },
  visibleInB2C: { type: Boolean, default: true },
  // Homepage feature flags — admin toggles these
  isFeatured: { type: Boolean, default: false },
  isTopProduct: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false },
  isBestSeller: { type: Boolean, default: false },
  isTrending: { type: Boolean, default: false },
  isSeasonal: { type: Boolean, default: false },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  badge: { type: String, default: '' },
  brand: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
