const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const DiscussionPost = require('../models/DiscussionPost');

// @route   GET api/discussion
// @desc    Get posts (Scrub deleted content)
router.get('/', protect, async (req, res) => {
  try {
    // 1. Fetch ALL data (including deleted stuff) from DB
    const posts = await DiscussionPost.find({ isDeleted: false }) // Don't even fetch deleted posts
      .populate('user', 'firstName lastName')
      .populate('comments.user', 'firstName lastName')
      .populate('comments.replies.user', 'firstName lastName')
      .sort({ createdAt: -1 });

    // 2. SCRUB deleted comments/replies before sending to frontend
    // We map over the data to protect the "bad words" from reaching the browser
    const safePosts = posts.map(post => {
      const postObj = post.toObject(); // Convert to plain JS object

      postObj.comments = postObj.comments.map(comment => {
        if (comment.isDeleted) {
          comment.text = "[This comment has been deleted]"; // Hide original text
          comment.user = null; // Hide author
        }
        
        comment.replies = comment.replies.map(reply => {
          if (reply.isDeleted) {
            reply.text = "[This reply has been deleted]"; // Hide original text
            reply.user = null; // Hide author
          }
          return reply;
        });
        
        return comment;
      });

      return postObj;
    });

    res.json(safePosts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/discussion (Create Post - Same as before)
router.post('/', protect, async (req, res) => { /* ... Keep existing code ... */ 
    try {
        const newPost = new DiscussionPost({
          title: req.body.title,
          content: req.body.content,
          category: req.body.category,
          user: req.user.id
        });
        const post = await newPost.save();
        const populatedPost = await DiscussionPost.findById(post._id).populate('user', 'firstName lastName');
        res.json(populatedPost);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/discussion/:id
// @desc    Soft delete a post
router.delete('/:id', protect, async (req, res) => {
  try {
    const post = await DiscussionPost.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });

    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    // ✅ SOFT DELETE: Mark as deleted, do NOT remove
    post.isDeleted = true;
    await post.save();
    
    res.json({ msg: 'Post removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/discussion/like/:id (Same as before)
router.put('/like/:id', protect, async (req, res) => { /* ... Keep existing code ... */ 
    try {
        const post = await DiscussionPost.findById(req.params.id);
        const likeIndex = post.likes.findIndex(like => like.user.toString() === req.user.id);
        if (likeIndex > -1) post.likes.splice(likeIndex, 1);
        else post.likes.unshift({ user: req.user.id });
        await post.save();
        res.json(post.likes);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// --- COMMENT ROUTES ---

// Post Comment (Same as before)
router.post('/comment/:id', protect, async (req, res) => { /* ... Keep existing code ... */ 
    try {
        const post = await DiscussionPost.findById(req.params.id);
        const newComment = { user: req.user.id, text: req.body.text };
        post.comments.unshift(newComment);
        await post.save();
        const updatedPost = await DiscussionPost.findById(req.params.id)
          .populate('user', 'firstName lastName')
          .populate('comments.user', 'firstName lastName')
          .populate('comments.replies.user', 'firstName lastName');
        res.json(updatedPost.comments);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/discussion/comment/:id/:comment_id
// @desc    Soft delete a comment
router.delete('/comment/:id/:comment_id', protect, async (req, res) => {
  try {
    const post = await DiscussionPost.findById(req.params.id);
    const comment = post.comments.find(c => c.id === req.params.comment_id);
    if (!comment) return res.status(404).json({ msg: 'Comment not found' });

    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    // ✅ SOFT DELETE
    comment.isDeleted = true;
    await post.save();
    
    // Return the safe version immediately so UI updates correctly
    // (We manually scrub here because we aren't calling the main GET route)
    const scrubbedComments = post.comments.map(c => {
        if (c.isDeleted) { c.text = "[This comment has been deleted]"; c.user = null; }
        return c;
    });

    res.json(scrubbedComments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// --- REPLY ROUTES ---

// Post Reply (Same as before)
router.post('/comment/:id/:comment_id/reply', protect, async (req, res) => { /* ... Keep existing code ... */ 
    try {
        const post = await DiscussionPost.findById(req.params.id);
        const comment = post.comments.find(c => c.id === req.params.comment_id);
        const newReply = { user: req.user.id, text: req.body.text };
        comment.replies.push(newReply);
        await post.save();
        const updatedPost = await DiscussionPost.findById(req.params.id)
          .populate('user', 'firstName lastName')
          .populate('comments.user', 'firstName lastName')
          .populate('comments.replies.user', 'firstName lastName');
        res.json(updatedPost.comments);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/discussion/comment/:id/:comment_id/reply/:reply_id
// @desc    Soft delete a reply
router.delete('/comment/:id/:comment_id/reply/:reply_id', protect, async (req, res) => {
  try {
    const post = await DiscussionPost.findById(req.params.id);
    const comment = post.comments.find(c => c.id === req.params.comment_id);
    const reply = comment.replies.find(r => r.id === req.params.reply_id);

    if (reply.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    // ✅ SOFT DELETE
    reply.isDeleted = true;
    await post.save();
    
    // Manual scrub for response
    const scrubbedComments = post.comments.map(c => {
        c.replies = c.replies.map(r => {
            if(r.isDeleted) { r.text = "[This reply has been deleted]"; r.user = null; }
            return r;
        });
        return c;
    });

    res.json(scrubbedComments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;