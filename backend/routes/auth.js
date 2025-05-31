const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth'); // Ensure this is properly imported

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', [
  check('firstName', 'First name is required').not().isEmpty(),
  check('lastName', 'Last name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 6+ characters').isLength({ min: 6 }),
  check('registrationNumber', 'Registration number is required').not().isEmpty(),
  check('faculty', 'Faculty is required').not().isEmpty(),
  check('degreeProgram', 'Degree program is required').not().isEmpty(),
  check('batch', 'Batch year is required').isNumeric()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { firstName, lastName, email, password, registrationNumber, faculty, degreeProgram, batch } = req.body;

  try {
    let user = await User.findOne({
      $or: [{ email }, { registrationNumber }]
    });

    if (user) {
      return res.status(400).json({
        msg: user.email === email ? 'User already exists' : 'Registration number already in use'
      });
    }

    user = new User({
      firstName,
      lastName,
      email,
      password,
      registrationNumber,
      faculty,
      degreeProgram,
      batch
    });

    await user.save();

    const token = user.getSignedJwtToken();
    res.json({ token });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({
      error: 'Registration failed',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const token = user.getSignedJwtToken();
    res.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({
      error: 'Login failed',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// @route   GET api/auth/user
// @desc    Get logged in user data
// @access  Private (using authMiddleware)
router.get('/user', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error('Error in GET /api/auth/user:', err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
