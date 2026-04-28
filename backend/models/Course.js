const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  credits: { type: Number, required: true },
  category: { type: String, required: true },
  level: { type: Number, required: true },
  semester: { type: Number },
  isCompulsory: { type: Boolean, default: false } 
});

module.exports = mongoose.model('Course', CourseSchema);