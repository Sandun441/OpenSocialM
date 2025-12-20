const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth'); // Make sure this path is correct

// This handles: PUT http://localhost:5000/api/users/profile
router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (req.body.avatar) user.avatar = req.body.avatar;
    if (req.body.coverImage) user.coverImage = req.body.coverImage;
    if (!user) return res.status(404).json({ msg: 'User not found' });

    // Update the fields from the frontend request
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.bio = req.body.bio || user.bio;
    user.degreeProgram = req.body.degreeProgram || user.degreeProgram;
    user.avatar = req.body.avatar || user.avatar;
    user.coverImage = req.body.coverImage || user.coverImage;

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;