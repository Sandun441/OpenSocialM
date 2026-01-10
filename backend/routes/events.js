const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Event = require('../models/Event');
const User = require('../models/User'); 

// @route   GET api/events
router.get('/', protect, async (req, res) => {
  try {
    const { faculty, degree } = req.query;
    let query = {};

    if (faculty && faculty !== 'All') query.faculty = faculty;
    if (degree && degree !== 'All') query.degree = degree;

    // ✅ FIXED: Changed 'user' to 'createdBy'
    const events = await Event.find(query)
      .populate('createdBy', 'firstName lastName') 
      .sort({ date: 1 });

    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/events
router.post('/', protect, async (req, res) => {
  // Read fields from request
  const { title, date, start, faculty, degree, type, description } = req.body;

  try {
    const newEvent = new Event({
      title,
      // Handle both date/start to be safe
      date: date || start, 
      faculty,
      degree,
      type,
      description,
      // ✅ FIXED: Changed 'user' to 'createdBy'
      createdBy: req.user.id 
    });

    const event = await newEvent.save();
    
    // ✅ FIXED: Populate 'createdBy' immediately
    const populatedEvent = await Event.findById(event._id)
       .populate('createdBy', 'firstName lastName');
    
    res.json(populatedEvent);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// backend/routes/events.js
// ... (imports remain the same)

// @route   DELETE api/events/:id
// @desc    Delete event (Checks both 'createdBy' and 'user' fields)
router.delete('/:id', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    // ✅ ROBUST CHECK: Look for owner in 'createdBy' OR 'user'
    const ownerId = event.createdBy || event.user;

    // If for some reason neither exists, we can't verify ownership
    if (!ownerId) {
       return res.status(500).json({ msg: 'Event data corrupted: No owner record found.' });
    }

    // Check if the logged-in user matches the owner
    if (ownerId.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Permission denied: You can only delete your own events.' });
    }

    await event.deleteOne();
    res.json({ msg: 'Event deleted successfully.' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;

module.exports = router;