import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import PostForm from '../components/posts/PostForm';
import PostItem from '../components/posts/PostItem';
import { AuthContext } from '../context/authContext';
import { GraduationCap, Users, Info } from 'lucide-react'; 

const Faculty = () => {
  const { facultyName } = useParams();
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const config = { headers: { 'x-auth-token': localStorage.getItem('token') } };
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/posts/faculty/${facultyName}`, config);
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
    // 1. BACKGROUND & FONT: Soft background with Lato font
    <div className="flex flex-col min-h-screen bg-[#F5F7FA] dark:bg-slate-900 transition-colors duration-300 font-['Lato']">
      
      {/* 2. PROFESSIONAL BANNER SECTION (Matches Login/Register Gradient) */}
      <div className="relative bg-gradient-to-br from-[#1A237E] to-[#3949AB] dark:from-indigo-900 dark:to-slate-900 h-56 sm:h-72 w-full overflow-hidden">
        {/* Abstract circles decoration */}
        <div className="absolute top-[-50px] left-[-50px] w-40 h-40 rounded-full bg-white opacity-5 animate-pulse"></div>
        <div className="absolute bottom-[-20px] right-[-20px] w-60 h-60 rounded-full bg-white opacity-5"></div>
        
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#F5F7FA] dark:from-slate-900 to-transparent"></div>
      </div>

      <main className="flex-grow container mx-auto px-4 -mt-24 sm:-mt-32 relative z-10 pb-12">
        <div className="max-w-3xl mx-auto">

          {/* 3. FACULTY HEADER CARD */}
          <div className="bg-white dark:bg-slate-800 rounded-[24px] shadow-sm hover:shadow-xl transition-all duration-300 p-8 mb-8 border border-slate-100 dark:border-slate-700">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
              <div className="p-5 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl shadow-inner">
                <GraduationCap className="w-12 h-12 text-[#1A237E] dark:text-indigo-400" />
              </div>
              <div className="flex-1">
                {/* Elegant Font Applied Here */}
                <h1 className="text-3xl sm:text-4xl font-bold font-['Playfair_Display'] text-[#1A237E] dark:text-white tracking-tight mb-2">
                  {facultyName}
                </h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-sm tracking-wide uppercase">
                  Official Faculty Hub • {posts.length} {posts.length === 1 ? 'Post' : 'Posts'}
                </p>
                <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-3">
                  <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold tracking-wide bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-100 dark:border-blue-800/50">
                    <Users className="w-3.5 h-3.5 mr-1.5" /> Student Community
                  </span>
                  <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold tracking-wide bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800/50">
                    <Info className="w-3.5 h-3.5 mr-1.5" /> Academic Updates
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 4. INPUT SECTION */}
          <div className="mb-8">
             {user && user.faculty === facultyName ? (
                <div className="transform transition-all hover:scale-[1.01]">
                   <PostForm faculty={facultyName} addPost={addPost} />
                </div>
             ) : (
                <div className="bg-white dark:bg-slate-800 p-8 rounded-[24px] shadow-sm text-center border border-dashed border-slate-300 dark:border-slate-700">
                  <p className="text-slate-500 dark:text-slate-400 font-medium">
                    You are currently viewing the <span className="font-bold text-[#1A237E] dark:text-indigo-400">{facultyName}</span> feed as a guest.
                  </p>
                </div>
             )}
          </div>

          {/* 5. FEED SECTION */}
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
              <div className="bg-white dark:bg-slate-800 py-16 px-6 rounded-[24px] shadow-sm text-center border border-slate-100 dark:border-slate-700">
                <div className="mx-auto w-24 h-24 bg-slate-50 dark:bg-slate-700/50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                  <span className="text-4xl">💬</span>
                </div>
                <h3 className="text-2xl font-bold font-['Playfair_Display'] text-slate-900 dark:text-white mb-3 tracking-tight">
                  No discussions yet
                </h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto font-medium leading-relaxed">
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

// --- ELEGANTE SKELETON LOADER ---
const SkeletonPost = () => (
  <div className="bg-white dark:bg-slate-800 p-8 rounded-[24px] shadow-sm border border-slate-100 dark:border-slate-700 animate-pulse">
    <div className="flex items-center space-x-4 mb-6">
      <div className="rounded-full bg-slate-200 dark:bg-slate-700 h-12 w-12"></div>
      <div className="flex-1 space-y-3">
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-md w-1/4"></div>
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-md w-1/6"></div>
      </div>
    </div>
    <div className="space-y-4">
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-md w-3/4"></div>
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-md w-full"></div>
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-md w-5/6"></div>
    </div>
  </div>
);

export default Faculty;