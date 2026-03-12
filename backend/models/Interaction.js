const mongoose = require('mongoose');

const InteractionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: mongoose.Schema.Types.ObjectId, ref: 'Content', required: true },
  type: { type: String, enum: ['like', 'bookmark'], default: 'like' }
}, { timestamps: true });

module.exports = mongoose.model('Interaction', InteractionSchema);