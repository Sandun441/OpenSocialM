import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import PostForm from '../components/posts/PostForm';
import PostItem from '../components/posts/PostItem';
import { AuthContext } from '../context/authContext';
import { GraduationCap, Users, Info } from 'lucide-react'; // Make sure you have lucide-react installed

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
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      
      {/* 1. PROFESSIONAL BANNER SECTION */}
      <div className="relative bg-gradient-to-r from-indigo-600 to-blue-500 h-48 sm:h-64 w-full">
        <div className="absolute inset-0 bg-black/20"></div> {/* Dark overlay for text contrast */}
        <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-gray-50 dark:from-gray-900 to-transparent"></div>
      </div>

      <main className="flex-grow container mx-auto px-4 -mt-20 sm:-mt-24 relative z-10 pb-12">
        <div className="max-w-3xl mx-auto">

          {/* 2. FACULTY HEADER CARD */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8 border border-gray-100 dark:border-gray-700 backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
              <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl">
                <GraduationCap className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                  {facultyName}
                </h1>
                <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">
                  Official Faculty Hub • {posts.length} {posts.length === 1 ? 'Post' : 'Posts'}
                </p>
                <div className="mt-3 flex flex-wrap justify-center sm:justify-start gap-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                    <Users className="w-3 h-3 mr-1" /> Student Community
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                    <Info className="w-3 h-3 mr-1" /> Academic Updates
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. INPUT SECTION */}
          <div className="mb-8">
             {user && user.faculty === facultyName ? (
                <div className="transform transition-all hover:scale-[1.01]">
                   <PostForm faculty={facultyName} addPost={addPost} />
                </div>
             ) : (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm text-center border border-dashed border-gray-300 dark:border-gray-700">
                  <p className="text-gray-500 dark:text-gray-400 font-medium italic">
                    You are currently viewing the {facultyName} feed as a guest.
                  </p>
                </div>
             )}
          </div>

          <div className="space-y-6">
            {loading ? (
              <>
                <SkeletonPost />
                <SkeletonPost />
                <SkeletonPost />
              </>
            ) : posts.length > 0 ? (
              posts.map(post => (
                <div key={post._id} className="animate-fade-in-up">
                   <PostItem post={post} deletePost={deletePost} />
                </div>
              ))
            ) : (
              <div className="bg-white dark:bg-gray-800 py-16 px-6 rounded-2xl shadow-sm text-center border border-gray-100 dark:border-gray-700">
                <div className="mx-auto w-24 h-24 bg-gray-50 dark:bg-gray-700/50 rounded-full flex items-center justify-center mb-4">
                  <span className="text-4xl">💬</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  No discussions yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                  This feed is quiet. Be the first to ask a question or share an update with the {facultyName} faculty!
                </p>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
};

const SkeletonPost = () => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 animate-pulse">
    <div className="flex items-center space-x-4 mb-4">
      <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-10 w-10"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/6"></div>
      </div>
    </div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
    </div>
  </div>
);

export default Faculty;