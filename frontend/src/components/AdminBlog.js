import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from './Layout';
import AdminLogin from './AdminLogin';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Calendar, User, Search, Edit, Trash2, Eye, Video, Youtube, Save, X, LogOut } from 'lucide-react';
import YouTube from 'react-youtube';
import axios from 'axios';

const AdminBlog = ({ onNavigate }) => {
  const { isAuthenticated, adminUser, logout, getAuthHeaders } = useAuth();
  const [showLogin, setShowLogin] = useState(!isAuthenticated);
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [newPost, setNewPost] = useState({
    title: '',
    summary: '',
    content: '',
    youtube_url: '',
    published: false
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetchBlogPosts();
      setShowLogin(false);
    }
  }, [isAuthenticated]);

  const handleLogin = (token) => {
    setShowLogin(false);
    fetchBlogPosts();
  };

  const handleLogout = () => {
    logout();
    setShowLogin(true);
    setBlogPosts([]);
  };

  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      const backendUrl = process.env.REACT_APP_BACKEND_URL;
      
      // Use admin endpoint with real authentication
      const response = await axios.get(`${backendUrl}/api/admin/blog/posts`, {
        headers: getAuthHeaders()
      });
      
      setBlogPosts(response.data);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      setError('Failed to fetch blog posts');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL;
      
      const response = await axios.post(`${backendUrl}/api/admin/blog/posts`, newPost, {
        headers: getAuthHeaders()
      });
      
      setBlogPosts([response.data, ...blogPosts]);
      setNewPost({ title: '', summary: '', content: '', youtube_url: '', published: false });
      setShowCreateForm(false);
      
    } catch (error) {
      console.error('Error creating blog post:', error);
      setError('Failed to create blog post');
    }
  };

  const handleUpdatePost = async (e) => {
    e.preventDefault();
    if (!editingPost) return;
    
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL;
      
      const response = await axios.put(
        `${backendUrl}/api/admin/blog/posts/${editingPost.id}`, 
        newPost,
        {
          headers: getAuthHeaders()
        }
      );
      
      setBlogPosts(blogPosts.map(post => 
        post.id === editingPost.id ? response.data : post
      ));
      
      setEditingPost(null);
      setNewPost({ title: '', summary: '', content: '', youtube_url: '', published: false });
      
    } catch (error) {
      console.error('Error updating blog post:', error);
      setError('Failed to update blog post');
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL;
      
      await axios.delete(`${backendUrl}/api/admin/blog/posts/${postId}`, {
        headers: getAuthHeaders()
      });
      
      setBlogPosts(blogPosts.filter(post => post.id !== postId));
      
    } catch (error) {
      console.error('Error deleting blog post:', error);
      setError('Failed to delete blog post');
    }
  };

  const startEditing = (post) => {
    setEditingPost(post);
    setNewPost({
      title: post.title,
      summary: post.summary || '',
      content: post.content,
      youtube_url: post.youtube_url || '',
      published: post.published
    });
    setShowCreateForm(true);
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

  if (showLogin) {
    return <AdminLogin onLogin={handleLogin} onCancel={() => onNavigate('home')} />;
  }

  if (!isAuthenticated) {
    return (
      <Layout currentPage="blog" onNavigate={onNavigate}>
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h1>
          <p className="text-gray-600">You need admin privileges to access this page.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout currentPage="blog" onNavigate={onNavigate}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6 h-full overflow-y-auto mobile-scroll"
      >
        {/* Header Section */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent mb-2">
              ADYC Blog Admin
            </h1>
            <p className="text-gray-600">
              Manage blog posts with YouTube video integration
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateForm(true)}
            className="bg-gradient-to-r from-orange-600 to-green-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Create Post</span>
          </motion.button>
        </motion.div>

        {/* Search Bar */}
        <motion.div variants={itemVariants} className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search blog posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
          />
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
          >
            {error}
          </motion.div>
        )}

        {/* Blog Posts Grid */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading blog posts...</p>
          </div>
        ) : (
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <motion.div
                key={post.id}
                layout
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all"
              >
                {/* YouTube Video Preview */}
                {post.youtube_url && (
                  <div className="aspect-video bg-gray-100">
                    <YouTube
                      videoId={extractYouTubeId(post.youtube_url)}
                      opts={{
                        width: '100%',
                        height: '100%',
                        playerVars: {
                          autoplay: 0,
                          modestbranding: 1,
                        },
                      }}
                      className="w-full h-full"
                    />
                  </div>
                )}
                
                {!post.youtube_url && (
                  <div className="aspect-video bg-gradient-to-br from-orange-100 to-green-100 flex items-center justify-center">
                    <Video className="w-12 h-12 text-gray-400" />
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      post.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedPost(post)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => startEditing(post)}
                        className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-bold text-gray-800 mb-2 line-clamp-2">{post.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{post.summary || post.content}</p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <User className="w-3 h-3" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(post.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Create/Edit Post Modal */}
        <AnimatePresence>
          {showCreateForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {editingPost ? 'Edit Post' : 'Create New Post'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowCreateForm(false);
                      setEditingPost(null);
                      setNewPost({ title: '', summary: '', content: '', youtube_url: '', published: false });
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={editingPost ? handleUpdatePost : handleCreatePost} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <input
                      type="text"
                      value={newPost.title}
                      onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                      placeholder="Enter post title..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Summary</label>
                    <textarea
                      value={newPost.summary}
                      onChange={(e) => setNewPost({ ...newPost, summary: e.target.value })}
                      rows="2"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 resize-none"
                      placeholder="Brief summary of the post..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Youtube className="w-4 h-4 inline mr-2" />
                      YouTube Video URL
                    </label>
                    <input
                      type="url"
                      value={newPost.youtube_url}
                      onChange={(e) => setNewPost({ ...newPost, youtube_url: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                      placeholder="https://youtube.com/watch?v=..."
                    />
                    {newPost.youtube_url && (
                      <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600">Video ID: {extractYouTubeId(newPost.youtube_url) || 'Invalid URL'}</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                    <textarea
                      value={newPost.content}
                      onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                      rows="8"
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 resize-none"
                      placeholder="Write your blog post content here..."
                    />
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="published"
                      checked={newPost.published}
                      onChange={(e) => setNewPost({ ...newPost, published: e.target.checked })}
                      className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <label htmlFor="published" className="text-sm font-medium text-gray-700">
                      Publish immediately
                    </label>
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-orange-600 to-green-600 text-white font-semibold py-3 px-6 rounded-lg hover:shadow-lg transition-all flex items-center justify-center space-x-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>{editingPost ? 'Update Post' : 'Create Post'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCreateForm(false);
                        setEditingPost(null);
                        setNewPost({ title: '', summary: '', content: '', youtube_url: '', published: false });
                      }}
                      className="flex-1 bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Post Preview Modal */}
        <AnimatePresence>
          {selectedPost && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">{selectedPost.title}</h2>
                  <button
                    onClick={() => setSelectedPost(null)}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {selectedPost.youtube_url && (
                  <div className="aspect-video mb-6 rounded-lg overflow-hidden">
                    <YouTube
                      videoId={extractYouTubeId(selectedPost.youtube_url)}
                      opts={{
                        width: '100%',
                        height: '100%',
                        playerVars: {
                          autoplay: 0,
                          modestbranding: 1,
                        },
                      }}
                      className="w-full h-full"
                    />
                  </div>
                )}

                <div className="prose max-w-none">
                  {selectedPost.summary && (
                    <p className="text-lg text-gray-600 mb-4 italic">{selectedPost.summary}</p>
                  )}
                  <div className="whitespace-pre-wrap text-gray-800">{selectedPost.content}</div>
                </div>

                <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 text-sm text-gray-500">
                  <div>By {selectedPost.author}</div>
                  <div>{new Date(selectedPost.created_at).toLocaleDateString()}</div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Layout>
  );
};

export default AdminBlog;