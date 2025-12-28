import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';
import axios from '../../utils/api';

const Post = ({ post, deletePost }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const [likes, setLikes] = useState(post.likes || []);
  const [comments, setComments] = useState(post.comments || []);
  const [commentText, setCommentText] = useState('');

  const handleLike = async () => {
    try {
      const res = await axios.put(`/api/posts/like/${post._id}`);
      setLikes(res.data);
    } catch (err) {
      console.error(err.response?.data?.msg || 'Error liking post');
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const res = await axios.post(`/api/posts/comment/${post._id}`, {
        text: commentText
      });
      setComments(res.data);
      setCommentText('');
    } catch (err) {
      console.error(err.response?.data?.msg || 'Error adding comment');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg mb-4">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to={`/profile/${post.user}`} className="flex items-center">
              <img
                className="h-10 w-10 rounded-full"
                src={post.avatar || 'https://via.placeholder.com/40'}
                alt=""
              />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{post.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(post.date).toLocaleDateString()}
                </p>
              </div>
            </Link>
          </div>
          {user && user._id === post.user && (
            <button
              onClick={() => deletePost(post._id)}
              className="text-red-600 hover:text-red-800"
            >
              Delete
            </button>
          )}
        </div>
        <div className="mt-4">
          <p className="text-gray-900 dark:text-white">{post.text}</p>
        </div>
        <div className="mt-4 flex items-center space-x-4">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-1 ${
              likes.includes(user?._id) ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <svg
              className="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                clipRule="evenodd"
              />
            </svg>
            <span>{likes.length}</span>
          </button>
          <button className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
            <svg
              className="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                clipRule="evenodd"
              />
            </svg>
            <span>{comments.length}</span>
          </button>
        </div>
        <div className="mt-4">
          <form onSubmit={handleComment} className="flex space-x-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Comment
            </button>
          </form>
        </div>
        {comments.length > 0 && (
          <div className="mt-4 space-y-4">
            {comments.map((comment) => (
              <div key={comment._id} className="flex space-x-3">
                <img
                  className="h-8 w-8 rounded-full"
                  src={comment.avatar || 'https://via.placeholder.com/32'}
                  alt=""
                />
                <div className="flex-1 bg-gray-50 dark:bg-gray-700 rounded-lg px-4 py-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {comment.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(comment.date).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{comment.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Post; 