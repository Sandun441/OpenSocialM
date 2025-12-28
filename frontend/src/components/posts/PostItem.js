import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/authContext';

const PostItem = ({ post, deletePost }) => {
  const { user } = useContext(AuthContext);
  const [likes, setLikes] = useState(post.likes || []);
  const [comments, setComments] = useState(post.comments || []);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');

  // Handle Like
  const handleLike = async () => {
    try {
      const config = { headers: { 'x-auth-token': localStorage.getItem('token') } };
      const res = await axios.put(`/api/posts/like/${post._id}`, {}, config);
      setLikes(res.data);
    } catch (err) {
      console.error("Error liking post", err);
    }
  };

  // Handle Delete
  const handleDelete = async () => {
    if (!window.confirm("Are you sure?")) return;
    try {
      const config = { headers: { 'x-auth-token': localStorage.getItem('token') } };
      await axios.delete(`/api/posts/${post._id}`, config);
      deletePost(post._id);
    } catch (err) {
      console.error("Error deleting", err);
    }
  };

  // Handle Comment
  const handleComment = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { 'x-auth-token': localStorage.getItem('token') } };
      const res = await axios.post(`/api/posts/comment/${post._id}`, { text: commentText }, config);
      setComments(res.data);
      setCommentText('');
    } catch (err) {
      console.error("Error commenting", err);
    }
  };

  return (
    // ✅ CORRECT: The outer wrapper is a DIV, not a button
    <div className="bg-white p-5 rounded-lg shadow mb-4 border border-gray-200">
      
      {/* Header Section */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
            {post.user && post.user.firstName ? post.user.firstName[0] : 'U'}
          </div>
          <div>
            <h4 className="font-bold text-gray-800">
               {post.user ? `${post.user.firstName} ${post.user.lastName}` : 'Unknown'}
            </h4>
            <p className="text-xs text-gray-500">{new Date(post.date).toLocaleDateString()}</p>
          </div>
        </div>

        {/* 🗑️ DELETE BUTTON 
            Only renders if you are the owner.
            We use a button here, which is fine because the parent is a div. 
        */}
        {user && post.user && user._id === post.user._id && (
           <button 
             onClick={handleDelete} 
             className="text-red-500 hover:text-red-700 font-bold text-sm bg-red-50 px-3 py-1 rounded"
           >
             DELETE
           </button>
        )}
      </div>

      {/* Post Text */}
      <p className="text-gray-800 mt-4 mb-4 whitespace-pre-wrap">{post.text}</p>

      {/* Action Buttons */}
      <div className="flex items-center gap-4 border-t pt-3">
        <button onClick={handleLike} className="flex items-center gap-1 text-gray-600 hover:text-blue-600">
          <span>👍</span> {likes.length} Likes
        </button>
        <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-1 text-gray-600 hover:text-blue-600">
          <span>💬</span> {comments.length} Comments
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 bg-gray-50 p-3 rounded">
          {comments.map((comment, index) => (
            <div key={index} className="mb-2 border-b pb-2 last:border-0">
               <span className="font-bold text-xs">{comment.name || "User"}: </span>
               <span className="text-sm">{comment.text}</span>
            </div>
          ))}
          <form onSubmit={handleComment} className="flex gap-2 mt-3">
            <input
              type="text"
              className="border p-2 rounded w-full text-sm"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button type="submit" className="bg-indigo-600 text-white px-3 py-1 rounded text-sm">Reply</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PostItem;