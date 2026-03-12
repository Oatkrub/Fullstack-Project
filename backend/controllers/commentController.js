const Comment = require('../models/Comment');

// @desc    Add a comment
exports.addComment = async (req, res) => {
  try {
    req.body.contentId = req.params.contentId;
    req.body.author = req.user.id;

    const comment = await Comment.create(req.body);
    res.status(201).json({ success: true, data: comment });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get comments for a post
exports.getPostComments = async (req, res) => {
  try {
    const comments = await Comment.find({ contentId: req.params.contentId })
      .populate('author', 'username')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: comments.length, data: comments });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Update a comment (Owner Only)
exports.updateComment = async (req, res) => {
  try {
    let comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ success: false, error: 'Comment not found' });
    }

    // Ownership Check: Only the person who wrote the comment can edit it
    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Not authorized to edit this comment' });
    }

    // Update the text and set the isEdited flag
    comment = await Comment.findByIdAndUpdate(
      req.params.id, 
      { 
        text: req.body.text, 
        isEdited: true 
      }, 
      { 
        new: true, 
        runValidators: true 
      }
    );

    res.status(200).json({ success: true, data: comment });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Delete comment (Owner or Admin)
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    if (comment.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await comment.deleteOne();
    res.status(200).json({ success: true, message: 'Comment removed' });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};