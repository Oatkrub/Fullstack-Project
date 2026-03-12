const mongoose = require('mongoose');

const ContentSchema = new mongoose.Schema({
  header: { type: String, required: true, trim: true },
  slug: { type: String, unique: true, lowercase: true },
  subHeader: { type: String, trim: true },
  content: { type: String, required: true },
  coverImage: { type: String },
  tags: [{ type: String }],
  visibility: { 
    type: String, 
    enum: ['public', 'private'], 
    default: 'public' 
  },
  readingTime: { type: Number },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // NEW FIELDS: Arrays of User IDs
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  bookmarkedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

// Pre-save logic remains the same
ContentSchema.pre('save', function(next) {
  if (this.isModified('header')) {
    this.slug = this.header.toLowerCase().split(' ').join('-');
  }
  if (this.content) {
    const wordsPerMinute = 200;
    const noOfWords = this.content.split(/\s+/).length;
    this.readingTime = Math.ceil(noOfWords / wordsPerMinute);
  }
});

module.exports = mongoose.model('Content', ContentSchema);