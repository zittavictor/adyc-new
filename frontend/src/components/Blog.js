import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from './Layout';
import { Plus, Calendar, User, Search, Filter, Edit, Trash2, Eye, Video, Youtube, ExternalLink } from 'lucide-react';
import YouTube from 'react-youtube';
import axios from 'axios';

const Blog = ({ onNavigate }) => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      const backendUrl = process.env.REACT_APP_BACKEND_URL;
      const response = await axios.get(`${backendUrl}/api/blog/posts`);
      setBlogPosts(response.data);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      setError('Failed to fetch blog posts');
    } finally {
      setLoading(false);
    }
  };

  const extractYouTubeId = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
  };

  const filteredPosts = blogPosts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreatePost = (e) => {
    e.preventDefault();
    const newBlogPost = {
      id: blogPosts.length + 1,
      ...newPost,
      date: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      author: 'ADYC Admin',
      slug: newPost.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
      image: newPost.image || 'https://customer-assets.emergentagent.com/job_08188fa5-14cb-4a99-bccc-7b97522397cf/artifacts/d1lwxqiv_ENCLUSI_001.jpg'
    };
    
    setBlogPosts([newBlogPost, ...blogPosts]);
    setNewPost({ title: '', summary: '', content: '', category: 'Leadership', image: null });
    setShowCreateForm(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewPost({ ...newPost, image: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <Layout currentPage="blog" onNavigate={onNavigate}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6 h-full overflow-y-auto mobile-scroll"
      >
        {/* HEADER SECTION */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-2">
              ADYC Blog
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Stay updated with our latest news, events, and insights
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateForm(true)}
            className="neumorphic-button bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center space-x-2 mobile-button"
          >
            <Plus className="w-5 h-5" />
            <span>Create Post</span>
          </motion.button>
        </motion.div>

        {/* SEARCH AND FILTER SECTION */}
        <motion.div variants={itemVariants} className="floating-card p-6">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            {/* SEARCH BAR */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search blog posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 neumorphic-inset bg-neutral-50/50 dark:bg-neutral-700/50 rounded-xl border-0 text-neutral-800 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none"
              />
            </div>

            {/* CATEGORY FILTER */}
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-neutral-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="neumorphic-inset bg-neutral-50/50 dark:bg-neutral-700/50 rounded-xl border-0 text-neutral-800 dark:text-white py-3 px-4 focus:outline-none"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* BLOG POSTS GRID */}
        <motion.div variants={itemVariants}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -5 }}
                className="floating-card p-4 group cursor-pointer"
                onClick={() => setSelectedPost(post)}
              >
                <div className="relative overflow-hidden rounded-lg mb-4">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105" 
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 bg-primary-500 text-white text-xs font-medium rounded-full">
                      {post.category}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex space-x-2">
                      <button className="p-2 bg-white/90 dark:bg-neutral-800/90 rounded-full text-neutral-600 dark:text-neutral-400 hover:text-primary-600 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-white/90 dark:bg-neutral-800/90 rounded-full text-neutral-600 dark:text-neutral-400 hover:text-primary-600 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center text-xs text-neutral-500 dark:text-neutral-400 mb-2">
                  <Calendar className="w-3 h-3 mr-1" />
                  <span>{post.date}</span>
                  <span className="mx-2">•</span>
                  <User className="w-3 h-3 mr-1" />
                  <span>{post.author}</span>
                </div>

                <h3 className="font-semibold text-lg text-neutral-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3 line-clamp-3">
                  {post.summary}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-primary-600 dark:text-primary-400 text-sm font-medium group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors">
                    Read More →
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CREATE POST MODAL */}
        <AnimatePresence>
          {showCreateForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowCreateForm(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white dark:bg-neutral-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-2xl font-bold text-neutral-800 dark:text-white mb-6">Create New Blog Post</h2>
                
                <form onSubmit={handleCreatePost} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Post Title
                    </label>
                    <input
                      type="text"
                      required
                      value={newPost.title}
                      onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                      className="w-full neumorphic-input px-4 py-3 rounded-lg text-neutral-800 dark:text-white bg-neutral-50 dark:bg-neutral-700/50"
                      placeholder="Enter post title..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Category
                    </label>
                    <select
                      value={newPost.category}
                      onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                      className="w-full neumorphic-input px-4 py-3 rounded-lg text-neutral-800 dark:text-white bg-neutral-50 dark:bg-neutral-700/50"
                    >
                      {categories.filter(cat => cat !== 'all').map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Featured Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="w-full neumorphic-input px-4 py-3 rounded-lg text-neutral-800 dark:text-white bg-neutral-50 dark:bg-neutral-700/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Summary
                    </label>
                    <textarea
                      required
                      value={newPost.summary}
                      onChange={(e) => setNewPost({ ...newPost, summary: e.target.value })}
                      rows="3"
                      className="w-full neumorphic-input px-4 py-3 rounded-lg text-neutral-800 dark:text-white bg-neutral-50 dark:bg-neutral-700/50"
                      placeholder="Brief summary of the post..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Content
                    </label>
                    <textarea
                      required
                      value={newPost.content}
                      onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                      rows="6"
                      className="w-full neumorphic-input px-4 py-3 rounded-lg text-neutral-800 dark:text-white bg-neutral-50 dark:bg-neutral-700/50"
                      placeholder="Write your post content..."
                    />
                  </div>

                  <div className="flex space-x-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="flex-1 neumorphic-button bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-semibold py-3 px-6 rounded-xl mobile-button"
                    >
                      Publish Post
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => setShowCreateForm(false)}
                      className="flex-1 neumorphic-button bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-semibold py-3 px-6 rounded-xl mobile-button"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* POST DETAIL MODAL */}
        <AnimatePresence>
          {selectedPost && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedPost(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white dark:bg-neutral-800 rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <img 
                  src={selectedPost.image} 
                  alt={selectedPost.title} 
                  className="w-full h-64 object-cover rounded-lg mb-6" 
                />
                
                <div className="flex items-center text-sm text-neutral-500 dark:text-neutral-400 mb-4">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{selectedPost.date}</span>
                  <span className="mx-3">•</span>
                  <User className="w-4 h-4 mr-2" />
                  <span>{selectedPost.author}</span>
                  <span className="mx-3">•</span>
                  <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full text-xs">
                    {selectedPost.category}
                  </span>
                </div>

                <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">
                  {selectedPost.title}
                </h1>
                
                <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-6 italic">
                  {selectedPost.summary}
                </p>
                
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    {selectedPost.content}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-700">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedPost(null)}
                    className="neumorphic-button bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-semibold py-3 px-6 rounded-xl mobile-button"
                  >
                    Close
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Layout>
  );
};

export default Blog;