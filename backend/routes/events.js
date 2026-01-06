const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Event = require('../models/Event');
const User = require('../models/User'); // Import User to ensure population works

// @route   GET api/events
// @desc    Get events with optional filters (faculty, degree)
router.get('/', protect, async (req, res) => {
  try {
    const { faculty, degree } = req.query;
    let query = {};

    // Apply Filters if they exist and aren't "All"
    if (faculty && faculty !== 'All') query.faculty = faculty;
    if (degree && degree !== 'All') query.degree = degree;

    // Fetch and Populate the 'createdBy' field to get the user's name
    const events = await Event.find(query)
      .populate('createdBy', 'name') 
      .sort({ date: 1 });

    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/events
// @desc    Create a new event
router.post('/', protect, async (req, res) => {
  const { title, date, faculty, degree, type, description } = req.body;

  try {
    const newEvent = new Event({
      title,
      date,
      faculty,
      degree,
      type,
      description,
      createdBy: req.user.id // Link to logged in user
    });

    const event = await newEvent.save();
    
    // Return the event with the user populated so the UI updates instantly
    const populatedEvent = await Event.findById(event._id).populate('createdBy', 'name');
    
    res.json(populatedEvent);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/events/:id
// @desc    Delete event (Only by creator)
router.delete('/:id', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ msg: 'Event not found' });

    // Check if user owns the event
    if (event.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await event.deleteOne();
    res.json({ msg: 'Event removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;