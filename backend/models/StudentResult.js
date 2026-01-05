const mongoose = require('mongoose');

const StudentResultSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  grade: { 
    type: String, 
    required: true,
    enum: ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'E'] // 
  },
  semester: { type: String } // e.g., "2024/25"
});

module.exports = mongoose.model('StudentResult', StudentResultSchema);