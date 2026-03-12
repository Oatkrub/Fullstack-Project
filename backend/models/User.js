const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please add a username'],
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false // This prevents the password from being returned in queries by default
  },
  role: {
    type: String,
    enum: ['user', 'premium', 'admin'],
    default: 'user'
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);