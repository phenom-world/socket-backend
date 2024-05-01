const mongoose = require('mongoose');

const LampPostSchema = new mongoose.Schema({
  post_id: { type: String, required: true },
  led_unit: { type: Number, required: true },
  average_intensity: { type: Number, required: true },
  forcing_intensity: { type: Number, required: true },
  theoretical_energy_consumption: { type: Number, required: true },
  average_energy_consumption: { type: Number, required: true },
  uptime: { type: Number, required: true },
});

const LampPostModel = mongoose.model('LampPost', LampPostSchema);

module.exports = { LampPostModel };
