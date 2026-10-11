const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  description: { type: String, default: '', trim: true, maxlength: 1200 },
  url: { type: String, required: true, trim: true, maxlength: 2048 },
  image: { type: String, default: '', trim: true, maxlength: 2048 },
  category: { type: String, default: 'Website', trim: true, maxlength: 80 },
  displayOrder: { type: Number, default: 0 },
  active: { type: Boolean, default: true }
}, { timestamps: true });
productSchema.index({ active: 1, displayOrder: 1, createdAt: -1 });
module.exports = mongoose.model('Product', productSchema);
