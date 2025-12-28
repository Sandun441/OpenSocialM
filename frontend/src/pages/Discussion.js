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
      author: 'You', 
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

  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'Academic':
        return 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300';
      case 'Events':
        return 'bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-300';
      case 'General':
        return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    // FULL PAGE WRAPPER
    <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900 transition-colors duration-200 p-6">
      <div className="container mx-auto max-w-5xl">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Discussion Forum</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Ask questions and help others in the community.
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 dark:bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 text-white px-6 py-2 rounded-full shadow-lg transition transform hover:-translate-y-1 font-medium flex items-center gap-2"
          >
            <span>✍️</span> Ask Question
          </button>
        </div>

        {/* --- CONTROLS --- */}
        <div className="flex flex-wrap gap-4 mb-6">
          <select
            className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white transition-colors"
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
              className="w-full border border-gray-300 dark:border-gray-600 p-2 pl-10 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500">🔍</span>
          </div>
        </div>

        {/* --- FEED --- */}
        <div className="space-y-4">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md dark:hover:shadow-lg transition-all"
              >
                <div className="flex gap-4">
                  {/* VOTE SECTION */}
                  <div className="flex flex-col items-center gap-1 min-w-[50px]">
                    <button
                      onClick={() => toggleLike(post.id)}
                      className={`p-2 rounded-full transition ${
                        post.isLiked
                          ? 'bg-orange-100 dark:bg-orange-900/40 text-orange-500 dark:text-orange-400'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 dark:text-gray-500'
                      }`}
                    >
                      ▲
                    </button>
                    <span
                      className={`font-bold ${
                        post.isLiked ? 'text-orange-500 dark:text-orange-400' : 'text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {post.likes}
                    </span>
                  </div>

                  {/* CONTENT SECTION */}
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                      <span className="font-semibold text-gray-800 dark:text-white">
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

                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                      {post.content}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <button className="flex items-center gap-1 hover:text-blue-500 dark:hover:text-blue-400 transition">
                        💬 {post.replies} Replies
                      </button>
                      <button className="hover:text-gray-700 dark:hover:text-gray-300 transition">
                        Share
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-gray-400 dark:text-gray-500">
              <p className="text-lg">
                No discussions found matching your search.
              </p>
            </div>
          )}
        </div>

        {/* --- MODAL: ASK QUESTION --- */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 dark:bg-black/80 flex justify-center items-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up border border-gray-200 dark:border-gray-700">
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                  Ask a Question
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-xl"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleAddPost} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    placeholder="What's on your mind?"
                    required
                    className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    value={newPost.title}
                    onChange={(e) =>
                      setNewPost({ ...newPost, title: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category
                  </label>
                  <select
                    className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Details
                  </label>
                  <textarea
                    rows="4"
                    placeholder="Describe your question in detail..."
                    required
                    className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                    className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-700 font-medium shadow-md transition-colors"
                  >
                    Post Question
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Discussion;