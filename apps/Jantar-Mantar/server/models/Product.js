const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },

  shortDescription: { type: String, default: '' },
  description: { type: String, default: '' },
  images: [{ type: String }],

  // Pricing
  price: { type: Number, default: 0 },              // selling price
  compareAtPrice: { type: Number, default: 0 },     // MRP / strikethrough
  discount: { type: Number, default: 0 },           // percent — derived if 0

  // Social proof
  rating: { type: Number, default: 0 },
  reviewsCount: { type: Number, default: 0 },

  // Inventory
  sku: { type: String, default: '' },
  stock: { type: Number, default: 0 },
  unit: { type: String, default: 'pack' },

  // Variants (weights)
  hasVariations: { type: Boolean, default: false },
  variations: [{
    weight: { type: String, required: true },       // "250g", "500g", "1kg"
    price: { type: Number, required: true },
    compareAtPrice: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    sku: { type: String, default: '' },
  }],

  // Display
  badges: [{ type: String }],                       // free-form pills e.g. "Organic"

  // Homepage collection flags
  isBestSeller: { type: Boolean, default: false },
  isTrending: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },

  status: { type: String, enum: ['active', 'inactive'], default: 'active' },

  deletedAt: { type: Date, default: null },
  deletedBy: { type: String, default: null },
  deleteReason: { type: String, default: null },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
