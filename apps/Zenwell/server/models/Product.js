const mongoose = require('mongoose');
const { Schema } = mongoose;


const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  shortDesc: { type: String, required: true },
  fullDesc: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  quantity: {type: Number, default: 50, required: true}
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;