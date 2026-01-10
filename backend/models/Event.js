const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  description: { type: String },
  faculty: { type: String, required: true },
  degree: { type: String, required: true },
  type: { type: String, default: 'General' },
  
  // ✅ MUST BE 'createdBy' to match the Route and Frontend
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', // Must match 'User' in User.js
    required: true 
  },
  
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Event', EventSchema);