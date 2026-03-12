const Content = require('../models/Content');
const Interaction = require('../models/Interaction');
// @desc    Get all posts (Public)
exports.getPosts = async (req, res) => {
  try {
    let query = req.user 
      ? { $or: [{ visibility: 'public' }, { author: req.user.id }] }
      : { visibility: 'public' };

    const posts = await Content.find(query)
      .populate('author', 'username')
      .sort({ createdAt: -1 });
      // We don't need to .map() anymore because we're sending the raw arrays

    res.status(200).json({ success: true, count: posts.length, data: posts });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get single post
exports.getPost = async (req, res) => {
  try {
    const post = await Content.findOne({
      $or: [
        { _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null }, 
        { slug: req.params.id }
      ]
    }).populate('author', 'username');

    if (!post) return res.status(404).json({ success: false, error: 'Post not found' });

    res.status(200).json({ success: true, data: post });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
// @desc    Create new post (Private)
exports.createPost = async (req, res) => {
    try {
        // Safety check: ensure protect middleware successfully found a user
        if (!req.user) {
        return res.status(401).json({ success: false, error: 'User not found in request' });
        }

        // Link the post to the logged-in user
        req.body.author = req.user.id;

        const post = await Content.create(req.body);
        res.status(201).json({ success: true, data: post });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Update post (Private/Author Only)
exports.updatePost = async (req, res) => {
  let post = await Content.findById(req.params.id);

  if (!post) return res.status(404).json({ error: 'Not found' });

  // Ownership Check: ONLY the creator
  if (post.author.toString() !== req.user.id) {
    return res.status(403).json({ error: 'Only the author can edit this' });
  }

  post = await Content.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).json({ success: true, data: post });
};

// @desc    Delete post (Private/Author Only)
exports.deletePost = async (req, res) => {
  const post = await Content.findById(req.params.id);

  if (!post) return res.status(404).json({ error: 'Not found' });

  // Permission Check: Author OR Admin
  const isAuthor = post.author.toString() === req.user.id;
  const isAdmin = req.user.role === 'admin';

  if (!isAuthor && !isAdmin) {
    return res.status(403).json({ error: 'Not authorized to delete this' });
  }

  await post.deleteOne();
  res.status(200).json({ success: true, message: 'Post deleted' });
};