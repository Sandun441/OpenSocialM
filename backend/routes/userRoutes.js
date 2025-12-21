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


// GET http://localhost:5000/api/users (with optional filters)
// GET http://localhost:5000/api/users (Find Peers)
router.get('/', protect, async (req, res) => {
  try {
    // 1. Destructure based on your new Batch.js filter names
    const { faculty, batch, degreeProgram } = req.query;
    
    // 2. Build the query object
    let query = {};
    
    // Logic: Only filter if a value is actually provided
    if (faculty) {
      query.faculty = faculty;
    }

    if (batch) {
      // We use the batch field from your Register form
      query.batch = batch; 
    }
    
    if (degreeProgram) {
      // Matches the 'degreeProgram' field in your User Model
      query.degreeProgram = degreeProgram;
    }

    // 3. Fetch users
    // - $ne: req.user.id ensures you don't see yourself in the list
    // - .select('-password') prevents security leaks
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

module.exports = router;