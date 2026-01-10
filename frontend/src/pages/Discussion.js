import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/authContext';
import { MessageCircle, Heart, Share2, Trash2, Send, CornerDownRight, MoreHorizontal } from 'lucide-react';

const Discussion = () => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'General' });

  // --- FETCH ---
  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { 'x-auth-token': token } };
      const res = await axios.get('http://localhost:5000/api/discussion', config);
      setPosts(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  // --- ACTIONS ---
  const handleAddPost = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { 'x-auth-token': token } };
      const res = await axios.post('http://localhost:5000/api/discussion', newPost, config);
      setPosts([res.data, ...posts]);
      setShowModal(false);
      setNewPost({ title: '', content: '', category: 'General' });
    } catch (err) { alert("Failed to post"); }
  };

  const handleDeletePost = async (id) => {
    if(!window.confirm("Delete this post?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/discussion/${id}`, { headers: { 'x-auth-token': token } });
      setPosts(posts.filter(p => p._id !== id));
    } catch (err) { alert("Failed to delete"); }
  };

  // --- FILTERING ---
  const filteredPosts = posts.filter(post => {
    const matchesCategory = filter === 'All' || post.category === filter;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          post.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="container mx-auto max-w-4xl">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">University Forum</h1>
            <p className="text-gray-500 dark:text-gray-400">Join the conversation with students and staff.</p>
          </div>
          <button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full shadow-lg font-medium transition flex items-center gap-2">
             <span>✍️</span> Start Discussion
          </button>
        </div>

        {/* CONTROLS */}
        <div className="flex gap-4 mb-6">
          <select className="border border-gray-300 dark:border-gray-700 p-2 rounded-lg bg-white dark:bg-gray-800 dark:text-white outline-none"
            value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="All">All Topics</option>
            <option value="Academic">Academic</option>
            <option value="Events">Events</option>
            <option value="General">General</option>
          </select>
          <input type="text" placeholder="Search..." className="flex-1 border border-gray-300 dark:border-gray-700 p-2 rounded-lg bg-white dark:bg-gray-800 dark:text-white outline-none"
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>

        {/* FEED */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading discussions...</p>
            </div>
          ) : filteredPosts.length > 0 ? (
            filteredPosts.map(post => (
              <PostItem key={post._id} post={post} currentUser={user} onDelete={handleDeletePost} />
            ))
          ) : (
            /* --- ✅ NEW: EMPTY STATE --- */
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                💬
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                No discussions found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-6">
                {searchTerm 
                  ? `We couldn't find any posts matching "${searchTerm}".` 
                  : "It's quiet here! Be the first to ask a question or start a conversation."}
              </p>
              {!searchTerm && (
                <button 
                  onClick={() => setShowModal(true)} 
                  className="px-6 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full font-bold hover:bg-blue-200 dark:hover:bg-blue-900/50 transition"
                >
                  Start a Discussion
                </button>
              )}
            </div>
          )}
        </div>

        {/* ADD MODAL */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">New Discussion</h3>
              <form onSubmit={handleAddPost} className="space-y-4">
                <input type="text" placeholder="Title" required className="w-full border p-2 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={newPost.title} onChange={e => setNewPost({...newPost, title: e.target.value})} />
                <select className="w-full border p-2 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={newPost.category} onChange={e => setNewPost({...newPost, category: e.target.value})}>
                  <option>General</option><option>Academic</option><option>Events</option>
                </select>
                <textarea rows="4" placeholder="Content..." required className="w-full border p-2 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={newPost.content} onChange={e => setNewPost({...newPost, content: e.target.value})} />
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-500">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Post</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- SUB-COMPONENT: Individual Post ---
const PostItem = ({ post, currentUser, onDelete }) => {
  const [likes, setLikes] = useState(post.likes || []);
  const [comments, setComments] = useState(post.comments || []);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');

  const isLiked = likes.some(l => l.user === currentUser?._id);
  const isOwner = post.user?._id === currentUser?._id;

  const handleLike = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`http://localhost:5000/api/discussion/like/${post._id}`, {}, { headers: { 'x-auth-token': token } });
      setLikes(res.data);
    } catch (err) { console.error(err); }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if(!commentText.trim()) return;
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`http://localhost:5000/api/discussion/comment/${post._id}`, { text: commentText }, { headers: { 'x-auth-token': token } });
      setComments(res.data);
      setCommentText('');
    } catch (err) { console.error(err); }
  };

  const handleDeleteComment = async (commentId) => {
    if(!window.confirm("Delete comment?")) return;
    try {
        const token = localStorage.getItem('token');
        const res = await axios.delete(`http://localhost:5000/api/discussion/comment/${post._id}/${commentId}`, { headers: { 'x-auth-token': token } });
        setComments(res.data);
    } catch (err) { console.error(err); }
  };

  // Helper to update state from child component (replies)
  const refreshComments = (newComments) => setComments(newComments);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-6">
        {/* Author Info */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 font-bold">
              {post.user?.firstName?.[0]}
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white text-sm">{post.user ? `${post.user.firstName} ${post.user.lastName}` : 'Unknown'}</h4>
              <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
             <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded-md text-gray-500">{post.category}</span>
             {isOwner && (
               <button onClick={() => onDelete(post._id)} className="text-gray-400 hover:text-red-500 transition"><Trash2 size={16}/></button>
             )}
          </div>
        </div>

        {/* Content */}
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{post.title}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6 whitespace-pre-wrap">{post.content}</p>

        {/* Actions Bar */}
        <div className="flex items-center gap-6 pt-4 border-t border-gray-100 dark:border-gray-700">
          <button onClick={handleLike} className={`flex items-center gap-2 text-sm font-medium transition ${isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}>
            <Heart size={18} fill={isLiked ? "currentColor" : "none"} /> {likes.length} Likes
          </button>
          <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-500 transition">
            <MessageCircle size={18} /> {comments.length} Comments
          </button>
        </div>
      </div>

      {/* COMMENTS SECTION */}
      {showComments && (
        <div className="bg-gray-50 dark:bg-gray-900/50 p-4 border-t border-gray-100 dark:border-gray-700">
          {/* Comment Input */}
          <form onSubmit={handleAddComment} className="flex gap-2 mb-6">
            <input 
              type="text" placeholder="Write a comment..." 
              className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-sm outline-none dark:bg-gray-800 dark:text-white"
              value={commentText} onChange={(e) => setCommentText(e.target.value)}
            />
            <button type="submit" className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition"><Send size={18}/></button>
          </form>

          {/* Comment List */}
          <div className="space-y-4">
            {comments.map(comment => (
              <CommentItem 
                key={comment._id} 
                comment={comment} 
                postId={post._id} 
                currentUser={currentUser} 
                onDelete={handleDeleteComment}
                onReplySuccess={refreshComments}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// --- SUB-COMPONENT: Single Comment with Replies ---
const CommentItem = ({ comment, postId, currentUser, onDelete, onReplySuccess }) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState('');
  
  // Check ownership (Safe check: user might be null if deleted)
  const isOwner = comment.user?._id && currentUser?._id && comment.user._id === currentUser._id;
  
  // Check if deleted
  const isDeleted = comment.text === "[This comment has been deleted]";

  const handleAddReply = async (e) => {
    e.preventDefault();
    if(!replyText.trim()) return;
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`http://localhost:5000/api/discussion/comment/${postId}/${comment._id}/reply`, { text: replyText }, { headers: { 'x-auth-token': token } });
      onReplySuccess(res.data);
      setReplyText('');
      setShowReplyInput(false);
    } catch (err) { console.error(err); }
  };

  const handleDeleteReply = async (replyId) => {
    if(!window.confirm("Delete reply?")) return;
    try {
      const token = localStorage.getItem('token');
      const res = await axios.delete(`http://localhost:5000/api/discussion/comment/${postId}/${comment._id}/reply/${replyId}`, { headers: { 'x-auth-token': token } });
      onReplySuccess(res.data);
    } catch (err) { console.error(err); }
  };

  return (
    <div className="flex gap-3 group">
      {/* Avatar (Show generic 'X' if deleted) */}
      <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${isDeleted ? 'bg-gray-100 text-gray-400' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
        {isDeleted ? '✕' : comment.user?.firstName?.[0]}
      </div>

      <div className="flex-1">
        <div className={`p-3 rounded-2xl rounded-tl-none inline-block min-w-[200px] ${isDeleted ? 'bg-gray-50 border border-gray-100 text-gray-400 italic' : 'bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700'}`}>
          {!isDeleted && (
            <div className="flex justify-between items-center gap-4 mb-1">
               <h5 className="text-sm font-bold text-gray-900 dark:text-white">{comment.user ? `${comment.user.firstName} ${comment.user.lastName}` : 'Unknown'}</h5>
               <span className="text-xs text-gray-400">{new Date(comment.date).toLocaleDateString()}</span>
            </div>
          )}
          <p className="text-sm">{comment.text}</p>
        </div>
        
        {/* Actions (Hidden if deleted) */}
        {!isDeleted && (
          <div className="flex items-center gap-4 mt-1 ml-2">
            <button onClick={() => setShowReplyInput(!showReplyInput)} className="text-xs font-semibold text-gray-500 hover:text-blue-500">Reply</button>
            {isOwner && (
              <button onClick={() => onDelete(comment._id)} className="text-xs font-semibold text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition">Delete</button>
            )}
          </div>
        )}

        {/* Reply Input */}
        {showReplyInput && !isDeleted && (
          <form onSubmit={handleAddReply} className="flex gap-2 mt-2 max-w-sm">
            <input 
              type="text" autoFocus placeholder="Write a reply..." 
              className="flex-1 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1.5 text-xs outline-none dark:bg-gray-800 dark:text-white"
              value={replyText} onChange={(e) => setReplyText(e.target.value)}
            />
            <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded-md text-xs hover:bg-blue-700">Reply</button>
          </form>
        )}

        {/* Nested Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-2 space-y-2">
            {comment.replies.map(reply => {
               const isReplyDeleted = reply.text === "[This reply has been deleted]";
               return (
                <div key={reply._id} className="flex gap-3 ml-2 relative">
                  <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold ${isReplyDeleted ? 'bg-gray-100 text-gray-400' : 'bg-gray-200 dark:bg-gray-700'}`}>
                    {isReplyDeleted ? '✕' : reply.user?.firstName?.[0]}
                  </div>
                  <div className="group/reply">
                    <div className={`px-3 py-2 rounded-xl rounded-tl-none inline-block ${isReplyDeleted ? 'bg-gray-50 text-gray-400 italic text-xs' : 'bg-gray-100 dark:bg-gray-700/50'}`}>
                       {!isReplyDeleted && <span className="font-bold text-xs text-gray-900 dark:text-white mr-2">{reply.user ? `${reply.user.firstName} ${reply.user.lastName}` : 'Unknown'}</span>}
                       <span className="text-sm text-gray-700 dark:text-gray-300">{reply.text}</span>
                    </div>
                    {/* Delete button for reply */}
                    {!isReplyDeleted && reply.user?._id === currentUser?._id && (
                      <button onClick={() => handleDeleteReply(reply._id)} className="ml-2 text-[10px] text-gray-400 hover:text-red-500 opacity-0 group-hover/reply:opacity-100">Delete</button>
                    )}
                  </div>
                </div>
               );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Discussion;