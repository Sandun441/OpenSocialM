const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// ⚠️ CHECK: Ensure this matches your actual folder name (usually 'models')
const Post = require('../model/Post'); 
const User = require('../models/User');

// @route   GET api/posts
// @desc    Get ALL posts
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 }).populate('user', ['firstName', 'lastName']);
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/posts/faculty/:facultyName
// @desc    Get posts ONLY for the logged-in user's faculty
// @access  Private
router.get('/faculty/:facultyName', protect, async (req, res) => {
  try {
    const posts = await Post.find({ 
      faculty: req.params.facultyName, 
      isDeleted: { $ne: true } // "Not Equal to true"
    })
    .sort({ date: -1 })
    .populate('user', ['firstName', 'lastName', 'avatar']);
    
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
// @route   POST api/posts
// @desc    Create a new post
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    const newPost = new Post({
      text: req.body.text,
      user: req.user.id,
      faculty: user.faculty,
      degreeProgram: user.degreeProgram,
      batch: user.batch
    });

    const post = await newPost.save();

    // ✅ FIX: Populate the user details immediately after saving!
    // This attaches the name and ID so the frontend can display it.
    await post.populate('user', ['firstName', 'lastName', 'avatar']);

    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
// @route   PUT api/posts/like/:id
// @desc    Like a post
// @access  Private
router.put('/like/:id', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Check if already liked
    if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
      return res.status(400).json({ msg: 'Post already liked' });
    }

    post.likes.unshift({ user: req.user.id });
    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/posts/comment/:id
// @desc    Comment on a post
// @access  Private
router.post('/comment/:id', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const user = await User.findById(req.user.id).select('-password'); // Get user info for comment

    const newComment = {
      text: req.body.text,
      user: req.user.id,
      name: user.firstName, // Optional: useful to save name directly in comment
      avatar: user.avatar   // Optional
    };

    post.comments.unshift(newComment);
    await post.save();
    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// ---------------------------------------------------------
//  DELETE ROUTES
// ---------------------------------------------------------

// @route   DELETE api/posts/:id
// @desc    Soft Delete a Post
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ msg: 'Post not found' });

    // Check user
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    // ✅ Soft Delete Logic
    post.isDeleted = true;
    await post.save();

    res.json({ msg: 'Post removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Post not found' });
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    Delete a specific comment
// @access  Private
router.delete('/comment/:id/:comment_id', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Pull out comment
    const comment = post.comments.find(c => c.id === req.params.comment_id);

    if (!comment) return res.status(404).json({ msg: 'Comment does not exist' });

    // Check user: Allow deletion if user owns the COMMENT or owns the POST
    if (comment.user.toString() !== req.user.id && post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    // Get remove index
    const removeIndex = post.comments.map(c => c.id).indexOf(req.params.comment_id);
    post.comments.splice(removeIndex, 1);

    await post.save();
    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;