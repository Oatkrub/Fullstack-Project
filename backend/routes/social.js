const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { toggleInteraction ,getBookmarkedPosts} = require('../controllers/interactionController');

const { addComment, getPostComments, deleteComment , updateComment} = require('../controllers/commentController');

router.post('/toggle/:contentId', protect, toggleInteraction);

// Comment Routes
router.get('/comments/:contentId', getPostComments);
router.post('/comments/:contentId', protect, addComment);
router.delete('/comments/:id', protect, deleteComment);
router.put('/comments/:id', protect, updateComment);
router.get('/bookmarks', protect, getBookmarkedPosts);
module.exports = router;