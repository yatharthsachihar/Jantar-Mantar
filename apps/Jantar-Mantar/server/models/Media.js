const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  url: { type: String, required: true },
  filename: { type: String, default: '' },
  originalName: { type: String, default: '' },
  mimeType: { type: String, default: '' },
  size: { type: Number, default: 0 },
  uploadedBy: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Media', mediaSchema);
