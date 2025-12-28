import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import PostForm from '../components/posts/PostForm';
import PostItem from '../components/posts/PostItem';
import { AuthContext } from '../context/authContext';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

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

  // ✅ 1. ADD THIS FUNCTION
  // This removes the post from the screen immediately after the API deletes it
  const deletePost = (id) => {
    setPosts(posts.filter(post => post._id !== id));
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">{facultyName} Faculty Hub</h1>
          <p className="text-gray-600">Connect with your batch mates and lecturers.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
             {user && user.faculty === facultyName ? (
                <PostForm faculty={facultyName} addPost={addPost} />
             ) : (
                <div className="bg-white p-4 rounded shadow text-center text-gray-500">
                  You are viewing the {facultyName} feed.
                </div>
             )}
          </div>

          <div className="lg:col-span-2">
            {loading ? (
              <p>Loading posts...</p>
            ) : posts.length > 0 ? (
              posts.map(post => (
                <PostItem 
                  key={post._id} 
                  post={post} 
                  deletePost={deletePost} // ✅ 2. PASS THE PROP HERE
                />
              ))
            ) : (
              <p className="text-center text-gray-500">No posts found. Be the first to post!</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Faculty;