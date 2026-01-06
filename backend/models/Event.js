const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  description: { type: String },
  faculty: { type: String, required: true }, // e.g., "Engineering"
  degree: { type: String, required: true },  // e.g., "Software Engineering"
  type: { type: String, default: 'General' }, // e.g., Exam, Lecture, Activity
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'users', // Must match your User model name (check user.js export)
    required: true 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Event', EventSchema);