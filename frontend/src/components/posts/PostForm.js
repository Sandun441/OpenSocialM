import { useState, useContext } from 'react';
import { AuthContext } from '../../context/authContext';
import axios from '../../utils/api';

const PostForm = ({ faculty, addPost }) => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post('/api/posts', {
        text,
        faculty
      });

      addPost(res.data);
      setText('');
    } catch (err) {
      console.error(err.response?.data?.msg || 'Error creating post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Create a Post</h3>
        <div className="mt-2 max-w-xl text-sm text-gray-500">
          <p>Share something with your faculty members.</p>
        </div>
        <form onSubmit={handleSubmit} className="mt-5">
          <div>
            <label htmlFor="text" className="sr-only">
              Post content
            </label>
            <textarea
              id="text"
              name="text"
              rows={3}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="What's on your mind?"
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
            />
          </div>
          <div className="mt-3">
            <button
              type="submit"
              disabled={loading || !text.trim()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostForm;







