const Content = require('../models/Content');

exports.toggleInteraction = async (req, res) => {
  try {
    const { type } = req.body; // 'like' or 'bookmark'
    const field = type === 'like' ? 'likedBy' : 'bookmarkedBy';
    const userId = req.user.id;
    const contentId = req.params.contentId;

    // 1. Find the post
    const post = await Content.findById(contentId);
    if (!post) return res.status(404).json({ success: false, error: 'Not found' });

    // 2. Check if user already in the array
    const isIncluded = post[field].includes(userId);
    
    // 3. Toggle using atomic operators
    const update = isIncluded 
      ? { $pull: { [field]: userId } } 
      : { $addToSet: { [field]: userId } };

    const updatedPost = await Content.findByIdAndUpdate(
      contentId, 
      update, 
      { new: true } 
    ).populate('author', 'username'); // MUST populate author again or the UI will crash/show blank

    // CRITICAL: Return the post object inside the 'data' key
    res.status(200).json({ 
      success: true, 
      data: updatedPost 
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
exports.getBookmarkedPosts = async (req, res) => {
  try {
    // Find posts where bookmarkedBy array contains the user ID
    const posts = await Content.find({ bookmarkedBy: req.user.id })
      .populate('author', 'username')
      .lean();

    res.status(200).json({ success: true, data: posts });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};