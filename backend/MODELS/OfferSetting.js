const mongoose = require('mongoose');
const offerSettingSchema = new mongoose.Schema({
  key: { type: String, unique: true, default: 'public-offer' },
  enabled: { type: Boolean, default: true },
  title: { type: String, default: 'Get Your Website for Free!' },
  description: { type: String, default: 'Limited-time website development offer for the first 10 eligible clients.' },
  durationDays: { type: Number, default: 30 },
  maxClients: { type: Number, default: 10 },
  terms: { type: String, default: 'Free offer covers website development only. Domain, hosting, paid plugins, third-party services, maintenance and renewals are not included unless explicitly agreed in writing. Offer is limited to eligible clients and subject to availability. Final scope and delivery timeline will be confirmed before work begins.' }
}, { timestamps: true });
module.exports = mongoose.model('OfferSetting', offerSettingSchema);
