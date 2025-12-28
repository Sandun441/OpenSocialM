// backend/routes/events.js
const express = require('express');
const router = express.Router();
// IMPORT PROTECT CORRECTLY
const { protect } = require('../middleware/auth');
const Event = require('../models/Event');

// @route   GET api/events
router.get('/', protect, async (req, res) => {
  try {
    const events = await Event.find().sort({ start: 1 });
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/events
router.post('/', protect, async (req, res) => {
  const { title, date, category } = req.body;

  if (!title || !date) {
    return res.status(400).json({ msg: 'Please enter title and date' });
  }

  try {
    const newEvent = new Event({
      title,
      start: date,
      category,
      backgroundColor: category === 'Exam' ? '#ef4444' : '#3b82f6', // Simple color logic
      user: req.user.id,
    });

    const event = await newEvent.save();
    res.json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/events/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ msg: 'Event not found' });

    await event.deleteOne();
    res.json({ msg: 'Event removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
