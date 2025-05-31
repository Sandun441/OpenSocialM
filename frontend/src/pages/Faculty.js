import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import PostForm from '../components/posts/PostForm';
import PostItem from '../components/posts/PostItem';
import { AuthContext } from '../context/authContext';

const Faculty = () => {
  const { facultyName } = useParams();
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`/api/posts/faculty/${facultyName}`);
        setPosts(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err.message);
        setLoading(false);
      }
    };

    fetchPosts();
  }, [facultyName]);

  const addPost = post => {
    setPosts([post, ...posts]);
  };

  const deletePost = id => {
    setPosts(posts.filter(post => post._id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{facultyName} Faculty</h1>
        <p className="mt-2 text-lg text-gray-600">
          Connect with students and lecturers from your faculty
        </p>
      </div>

      {user && user.faculty === facultyName && (
        <div className="mb-8">
          <PostForm faculty={facultyName} addPost={addPost} />
        </div>
      )}

      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : posts.length > 0 ? (
        <div className="space-y-6">
          {posts.map(post => (
            <PostItem 
              key={post._id} 
              post={post} 
              deletePost={deletePost} 
              showActions={user && user.faculty === facultyName}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900">No posts yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Be the first to share something with your faculty!
          </p>
        </div>
      )}
    </div>
  );
};

export default Faculty;