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
        const config = { headers: { 'x-auth-token': localStorage.getItem('token') } };
        const res = await axios.get(`http://localhost:5000/api/posts/faculty/${facultyName}`, config);
        setPosts(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchPosts();
  }, [facultyName]);

  const addPost = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  const deletePost = (id) => {
    setPosts(posts.filter(post => post._id !== id));
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <main className="flex-grow container mx-auto px-4 py-8">
        
        {/* CENTERED COLUMN (Max width matches typical social feeds) */}
        <div className="max-w-2xl mx-auto">
          
          {/* HEADER SECTION */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white tracking-tight">
              {facultyName} Faculty Hub
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Connect with your batch mates and lecturers.
            </p>
          </div>

          {/* 1. INPUT SECTION (TOP) */}
          <div className="mb-8">
             {user && user.faculty === facultyName ? (
                <PostForm faculty={facultyName} addPost={addPost} />
             ) : (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center border border-gray-100 dark:border-gray-700">
                  <p className="text-gray-500 dark:text-gray-400 font-medium">
                    You are viewing the {facultyName} feed.
                  </p>
                </div>
             )}
          </div>

          {/* 2. POSTS FEED (BELOW) */}
          <div className="space-y-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-10 space-y-4">
                <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-blue-600"></div>
                <p className="text-gray-600 dark:text-gray-300 font-medium">Loading feed...</p>
              </div>
            ) : posts.length > 0 ? (
              posts.map(post => (
                <PostItem 
                  key={post._id} 
                  post={post} 
                  deletePost={deletePost} 
                />
              ))
            ) : (
              <div className="bg-white dark:bg-gray-800 p-10 rounded-xl shadow-sm text-center border border-dashed border-gray-300 dark:border-gray-700">
                <p className="text-xl mb-2">📭</p>
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  No posts yet. Be the first to say hello!
                </p>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
};

export default Faculty;