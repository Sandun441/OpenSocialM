const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// @route   GET api/posts
// @desc    Get all posts
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    res.json({ msg: 'Posts route working' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router; 