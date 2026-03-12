const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  contentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Content', required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true, maxlength: 1000 },
  isEdited: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Comment', CommentSchema);