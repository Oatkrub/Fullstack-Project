const express = require('express');
const router = express.Router();
const { 
  getPosts, 
  getPost,
  createPost, 
  updatePost, 
  deletePost 
} = require('../controllers/contentController');

const { protect, authorize } = require('../middleware/auth');

// 1. Read: Everyone
router.get('/', getPosts);
router.get('/:id', getPost);

// 2. Create: Everyone that login (Note: if no 'protect', req.user will be null)
router.post('/',protect, createPost); 

// 3. Update: Owner Only (Logic handled inside controller)
router.put('/:id', protect, updatePost);

// 4. Delete: Owner or Admin (Logic handled inside controller)
router.delete('/:id', protect, authorize('user', 'premium', 'admin'), deletePost);

module.exports = router;