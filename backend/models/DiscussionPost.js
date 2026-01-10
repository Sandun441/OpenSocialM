const mongoose = require('mongoose');

const DiscussionPostSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, enum: ['General', 'Academic', 'Events'], default: 'General' },
  likes: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } }],
  
  // ✅ NEW: Soft Delete Flag for Post
  isDeleted: { type: Boolean, default: false },

  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      text: { type: String, required: true },
      date: { type: Date, default: Date.now },
      // ✅ NEW: Soft Delete Flag for Comment
      isDeleted: { type: Boolean, default: false },
      
      replies: [
        {
          user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
          text: { type: String, required: true },
          date: { type: Date, default: Date.now },
          // ✅ NEW: Soft Delete Flag for Reply
          isDeleted: { type: Boolean, default: false }
        }
      ]
    }
  ],
  
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DiscussionPost', DiscussionPostSchema);