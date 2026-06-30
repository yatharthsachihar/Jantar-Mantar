const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  icon: { type: String, default: '' },          // emoji or icon name shown in pill/category row
  image: { type: String, default: '' },
  description: { type: String, default: '' },
  displayOrder: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  deletedAt: { type: Date, default: null },
  deletedBy: { type: String, default: null },
  deleteReason: { type: String, default: null },
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
