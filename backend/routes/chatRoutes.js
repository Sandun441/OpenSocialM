const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { protect } = require('../middleware/auth');

// POST a new message
router.post('/', protect, async (req, res) => {
  try {
    const { receiverId, text } = req.body;
    const newMessage = new Message({
      sender: req.user.id,
      receiver: receiverId,
      text: text
    });
    await newMessage.save();
    res.json(newMessage);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// GET history between logged-in user and another user
router.get('/:userId', protect, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user.id, receiver: req.params.userId },
        { sender: req.params.userId, receiver: req.user.id }
      ]
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;