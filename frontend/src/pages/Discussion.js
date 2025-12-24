// src/pages/Discussion.js
import React, { useState, useEffect } from 'react';

const Discussion = () => {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: 'General',
  });

  // 1. Mock Data
  useEffect(() => {
    const mockPosts = [
      {
        id: 1,
        title: 'Best resources for Data Structures?',
        author: 'Sarah J.',
        date: '2 hours ago',
        category: 'Academic',
        content:
          "I'm struggling with Trees and Graphs. Any good YouTube channels?",
        likes: 12,
        replies: 4,
        isLiked: false,
      },
      {
        id: 2,
        title: 'Lost ID Card near Canteen',
        author: 'Mike R.',
        date: '5 hours ago',
        category: 'General',
        content: 'Found a blue wallet with an ID. Left it at security office.',
        likes: 24,
        replies: 8,
        isLiked: true,
      },
      {
        id: 3,
        title: 'Hackathon Team Registration',
        author: 'Tech Club',
        date: '1 day ago',
        category: 'Events',
        content: 'Looking for a backend developer for the upcoming hackathon!',
        likes: 8,
        replies: 2,
        isLiked: false,
      },
    ];
    setPosts(mockPosts);
  }, []);

  // 2. Filter & Search Logic
  const getFilteredPosts = () => {
    return posts.filter((post) => {
      const matchesCategory = filter === 'All' || post.category === filter;
      const matchesSearch =
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  };

  // 3. Handle Add Post
  const handleAddPost = (e) => {
    e.preventDefault();
    if (!newPost.title || !newPost.content) return;

    const savedPost = {
      id: Date.now(),
      title: newPost.title,
      content: newPost.content,
      category: newPost.category,
      author: 'You', // Placeholder for logged-in user
      date: 'Just now',
      likes: 0,
      replies: 0,
      isLiked: false,
    };

    setPosts([savedPost, ...posts]);
    setShowModal(false);
    setNewPost({ title: '', content: '', category: 'General' });
  };

  // 4. Handle Like
  const toggleLike = (id) => {
    setPosts(
      posts.map((post) => {
        if (post.id === id) {
          return {
            ...post,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            isLiked: !post.isLiked,
          };
        }
        return post;
      })
    );
  };

  const filteredPosts = getFilteredPosts();

  // Helper for category colors
  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'Academic':
        return 'bg-blue-100 text-blue-600';
      case 'Events':
        return 'bg-purple-100 text-purple-600';
      case 'General':
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Discussion Forum</h1>
          <p className="text-gray-600 mt-1">
            Ask questions and help others in the community.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full shadow-lg transition transform hover:-translate-y-1 font-medium flex items-center gap-2"
        >
          <span>✍️</span> Ask Question
        </button>
      </div>

      {/* --- CONTROLS --- */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          className="border p-2 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All Topics</option>
          <option value="Academic">Academic</option>
          <option value="Events">Events</option>
          <option value="General">General</option>
        </select>

        <div className="flex-grow relative">
          <input
            type="text"
            placeholder="Search discussions..."
            className="w-full border p-2 pl-10 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
        </div>
      </div>

      {/* --- FEED --- */}
      <div className="space-y-4">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition"
            >
              <div className="flex gap-4">
                {/* VOTE SECTION */}
                <div className="flex flex-col items-center gap-1 min-w-[50px]">
                  <button
                    onClick={() => toggleLike(post.id)}
                    className={`p-2 rounded-full transition ${
                      post.isLiked
                        ? 'bg-orange-100 text-orange-500'
                        : 'hover:bg-gray-100 text-gray-400'
                    }`}
                  >
                    ▲
                  </button>
                  <span
                    className={`font-bold ${
                      post.isLiked ? 'text-orange-500' : 'text-gray-600'
                    }`}
                  >
                    {post.likes}
                  </span>
                </div>

                {/* CONTENT SECTION */}
                <div className="flex-grow">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <span className="font-semibold text-gray-800">
                      {post.author}
                    </span>
                    <span>•</span>
                    <span>{post.date}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(
                        post.category
                      )}`}
                    >
                      {post.category}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-800 mb-2 hover:text-blue-600 cursor-pointer">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {post.content}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <button className="flex items-center gap-1 hover:text-blue-500 transition">
                      💬 {post.replies} Replies
                    </button>
                    <button className="hover:text-gray-700 transition">
                      Share
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-gray-400">
            <p className="text-lg">
              No discussions found matching your search.
            </p>
          </div>
        )}
      </div>

      {/* --- MODAL: ASK QUESTION --- */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up">
            <div className="bg-gray-50 p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800">
                Ask a Question
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddPost} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  placeholder="What's on your mind?"
                  required
                  className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newPost.title}
                  onChange={(e) =>
                    setNewPost({ ...newPost, title: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newPost.category}
                  onChange={(e) =>
                    setNewPost({ ...newPost, category: e.target.value })
                  }
                >
                  <option value="General">General</option>
                  <option value="Academic">Academic</option>
                  <option value="Events">Events</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Details
                </label>
                <textarea
                  rows="4"
                  placeholder="Describe your question in detail..."
                  required
                  className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  value={newPost.content}
                  onChange={(e) =>
                    setNewPost({ ...newPost, content: e.target.value })
                  }
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-md"
                >
                  Post Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Discussion;
