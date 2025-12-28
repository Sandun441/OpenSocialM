// backend/models/Event.js
const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  start: {
    // This matches 'date' from your frontend form
    type: Date,
    required: true,
  },
  category: {
    type: String,
    enum: ['Academic', 'Exam', 'Batch', 'General'],
    default: 'Academic',
  },
  // We can derive color on frontend, or store it here.
  // Storing it allows custom colors later.
  backgroundColor: {
    type: String,
  },
  user: {
    // Link to the user who created it
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('event', EventSchema);
