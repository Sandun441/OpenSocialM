const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please add a first name']
  },
  lastName: {
    type: String,
    required: [true, 'Please add a last name']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please add a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  registrationNumber: {
    type: String,
    required: [true, 'Please add your OUSL registration number'],
    unique: true
  },
  faculty: {
    type: String,
    required: [true, 'Please select your faculty'],
    enum: [
      'Engineering',
      'Natural Sciences',
      'Health Sciences',
      'Humanities and Social Sciences',
      'Education',
      'Management Studies'
    ]
  },
  degreeProgram: {
    type: String,
    required: [true, 'Please select your degree program']
  },
  batch: {
    type: Number,
    required: [true, 'Please add your batch year']
  },
  role: {
    type: String,
    enum: ['student', 'lecturer', 'admin'],
    default: 'student'
  },
  bio: { type: String, default: '' },

  avatar: { type: String, default: '' },
  
  coverImage: { type: String, default: '' },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);