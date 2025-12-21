const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// 1. UPDATE PROFILE
// PUT http://localhost:5000/api/users/profile
router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    // Update fields from the frontend request
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.bio = req.body.bio || user.bio;
    user.degreeProgram = req.body.degreeProgram || user.degreeProgram;
    user.faculty = req.body.faculty || user.faculty; // Added faculty update
    user.batch = req.body.batch || user.batch;       // Added batch update
    
    // Handle Images
    if (req.body.avatar) user.avatar = req.body.avatar;
    if (req.body.coverImage) user.coverImage = req.body.coverImage;

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// 2. GET ALL USERS (With Filters for Batch Page)
// GET http://localhost:5000/api/users
router.get('/', protect, async (req, res) => {
  try {
    const { faculty, batch, degreeProgram } = req.query;
    let query = {};
    
    if (faculty) query.faculty = faculty;
    if (batch) query.batch = batch;
    if (degreeProgram) query.degreeProgram = degreeProgram;

    // Fetch users excluding current user and passwords
    const users = await User.find({ 
      ...query, 
      _id: { $ne: req.user.id } 
    }).select('-password');

    res.json(users);
  } catch (err) {
    console.error("Fetch Users Error:", err.message);
    res.status(500).send('Server Error');
  }
});

// 3. GET SINGLE USER BY ID (For Chat Header)
// GET http://localhost:5000/api/users/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    // If the ID is not a valid MongoDB ObjectId, it throws a 'CastError'
    if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'User not found' });
    res.status(500).send('Server Error');
  }
});

module.exports = router;