// pages/Community.js
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageSquare, Send, Trash2, Plus, Sparkles, LogIn, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const rawApiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const API_URL = rawApiUrl.endsWith('/') ? rawApiUrl.slice(0, -1) : rawApiUrl;

const Community = () => {
  const { user, isLoggedIn } = useAuth();
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' or 'therapist'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [expandedCommentsPostId, setExpandedCommentsPostId] = useState(null);
  const [newCommentContent, setNewCommentContent] = useState('');

  const loadPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`${API_URL}/api/posts`);
      setPosts(response.data);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load community logs.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    try {
      setLoading(true);
      const postData = {
        content: newPostContent,
        userName: user.name,
        role: user.role || 'user'
      };

      const response = await axios.post(`${API_URL}/api/posts`, postData, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' }
      });

      setPosts([response.data, ...posts]);
      setNewPostContent('');
      setSuccess('Thought shared successfully.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to post message.');
    } finally {
      setLoading(false);
    }
  };

  const handleLikePost = async (postId) => {
    if (!isLoggedIn) {
      alert('Please log in to like thoughts.');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/posts/${postId}/like`, {}, { withCredentials: true });
      setPosts(posts.map(p => p._id === postId ? response.data : p));
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleAddComment = async (e, postId) => {
    e.preventDefault();
    if (!newCommentContent.trim()) return;

    try {
      const response = await axios.post(
        `${API_URL}/api/posts/${postId}/comment`, 
        { content: newCommentContent }, 
        { withCredentials: true }
      );
      setPosts(posts.map(p => p._id === postId ? response.data : p));
      setNewCommentContent('');
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to remove this post?')) return;

    try {
      await axios.delete(`${API_URL}/api/posts/${postId}`, { withCredentials: true });
      setPosts(posts.filter(p => p._id !== postId));
      setSuccess('Post removed.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete post.');
    }
  };

  const filteredPosts = posts.filter(p => {
    if (activeFilter === 'therapist') {
      return p.role === 'therapist' || p.role === 'admin';
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-serene-50 pt-28 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-serif font-bold text-serene-900 mb-4 tracking-tight">Community Sanctuary.</h1>
          <p className="text-serene-600 text-lg">A judgment-free space to connect, support, and seek professional guidance.</p>
          {!isLoggedIn && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="mt-4 flex items-center justify-center space-x-2 text-sm text-serene-500 bg-white inline-flex px-4 py-2 rounded-full border border-serene-100 shadow-sm"
            >
              <LogIn size={14} />
              <span>Guest Mode. <Link to="/login" className="text-serene-800 font-bold hover:underline">Log in</Link> to share and reply.</span>
            </motion.div>
          )}
        </header>

        {/* Filter Navigation */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-white border border-serene-100 p-1.5 rounded-full shadow-md">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all ${
                activeFilter === 'all'
                  ? 'bg-serene-700 text-white shadow-sm'
                  : 'text-serene-500 hover:text-serene-800'
              }`}
            >
              All Shared Thoughts
            </button>
            <button
              onClick={() => setActiveFilter('therapist')}
              className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeFilter === 'therapist'
                  ? 'bg-serene-700 text-white shadow-sm'
                  : 'text-serene-500 hover:text-serene-800'
              }`}
            >
              <Award size={14} />
              <span>Therapist Columns</span>
            </button>
          </div>
        </div>

        {/* Main Grid: Create Post & Feed */}
        <div className="grid grid-cols-1 gap-8">
          {/* Create Post Card */}
          {isLoggedIn && (
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-serene-900/5 border border-serene-100"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-serene-50 rounded-xl flex items-center justify-center text-serene-700">
                  <Plus size={20} />
                </div>
                <h3 className="font-serif font-bold text-serene-900 text-lg">Share a Reflection</h3>
              </div>

              <form onSubmit={handleCreatePost} className="space-y-4">
                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="Share a thought, advice, or asking for support... (strictly non-toxic space)"
                  className="w-full p-6 bg-serene-50/50 border-none rounded-3xl focus:ring-4 focus:ring-serene-500/10 min-h-[120px] text-serene-850 placeholder-serene-300 transition-all resize-none text-sm leading-relaxed"
                />
                <div className="flex justify-between items-center">
                  <span className="text-xs text-serene-400">Keep it respectful. Therapists frequently review columns.</span>
                  <button
                    type="submit"
                    disabled={loading || !newPostContent.trim()}
                    className="px-6 py-3 bg-serene-700 hover:bg-serene-850 text-white rounded-2xl text-xs font-bold shadow-md transition-all active:scale-95 disabled:bg-serene-200 flex items-center space-x-2"
                  >
                    <Send size={14} />
                    <span>Post Thought</span>
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Feedback alerts */}
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 bg-red-50 text-red-500 rounded-2xl text-xs font-bold">
                {error}
              </motion.div>
            )}
            {success && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 bg-serene-500/10 text-serene-700 rounded-2xl text-xs font-bold">
                {success}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Feed List */}
          <div className="space-y-6">
            <AnimatePresence mode="popLayout">
              {filteredPosts.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-[2.5rem] border border-serene-100 shadow-md">
                  <p className="text-serene-400 italic text-sm">No reflections in this tab yet. Be the first to share!</p>
                </div>
              ) : (
                filteredPosts.map((post) => {
                  const isTherapist = post.role === 'therapist' || post.role === 'admin';
                  const isUserPostOwner = isLoggedIn && post.user.toString() === user._id.toString();
                  const isAuthorizedDelete = isUserPostOwner || (isLoggedIn && (user.role === 'therapist' || user.role === 'admin'));
                  const hasLiked = isLoggedIn && post.likes.includes(user._id);

                  return (
                    <motion.div
                      key={post._id}
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      className="bg-white rounded-[2.5rem] p-8 shadow-md border border-serene-100 hover:shadow-lg transition-all"
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between mb-4 pb-4 border-b border-serene-50">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                            isTherapist ? 'bg-serene-700 text-white' : 'bg-serene-50 text-serene-700'
                          }`}>
                            {post.userName ? post.userName[0].toUpperCase() : 'M'}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-serif font-bold text-serene-900 text-sm">{post.userName}</span>
                              {isTherapist && (
                                <span className="flex items-center space-x-0.5 px-2.5 py-0.5 bg-serene-100 text-serene-800 rounded-full text-[9px] font-bold uppercase tracking-wider">
                                  <Award size={10} className="mr-0.5" />
                                  Therapist
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-serene-400">
                              {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>

                        {isAuthorizedDelete && (
                          <button
                            onClick={() => handleDeletePost(post._id)}
                            className="p-2 text-serene-200 hover:text-red-500 transition-colors"
                            title="Remove Post"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>

                      {/* Content */}
                      <p className="text-serene-800 text-sm leading-relaxed mb-6 whitespace-pre-wrap">{post.content}</p>

                      {/* Interaction Bar */}
                      <div className="flex items-center space-x-6 text-xs font-bold text-serene-500">
                        <button
                          onClick={() => handleLikePost(post._id)}
                          className={`flex items-center space-x-1.5 transition-colors ${
                            hasLiked ? 'text-red-500' : 'hover:text-red-400'
                          }`}
                        >
                          <Heart size={16} fill={hasLiked ? 'currentColor' : 'none'} />
                          <span>{post.likes.length} Likes</span>
                        </button>

                        <button
                          onClick={() => setExpandedCommentsPostId(expandedCommentsPostId === post._id ? null : post._id)}
                          className="flex items-center space-x-1.5 hover:text-serene-800 transition-colors"
                        >
                          <MessageSquare size={16} />
                          <span>{post.comments.length} Comments</span>
                        </button>
                      </div>

                      {/* Comments Section */}
                      {expandedCommentsPostId === post._id && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-6 pt-6 border-t border-serene-50 space-y-4"
                        >
                          <h4 className="text-[10px] font-bold uppercase tracking-widest text-serene-400 mb-2">Replies</h4>

                          {/* Write Comment Form */}
                          {isLoggedIn ? (
                            <form onSubmit={(e) => handleAddComment(e, post._id)} className="flex space-x-2">
                              <input
                                type="text"
                                placeholder="Write a supportive reply..."
                                value={newCommentContent}
                                onChange={(e) => setNewCommentContent(e.target.value)}
                                className="flex-1 px-4 py-2.5 bg-serene-50 border border-serene-100 rounded-xl text-xs focus:ring-4 focus:ring-serene-500/10 text-serene-850"
                              />
                              <button
                                type="submit"
                                disabled={!newCommentContent.trim()}
                                className="p-2.5 bg-serene-750 text-white rounded-xl hover:bg-serene-850 transition-colors disabled:bg-serene-100 flex items-center justify-center"
                              >
                                <Send size={12} />
                              </button>
                            </form>
                          ) : (
                            <p className="text-[10px] text-serene-400 italic">Please log in to write replies.</p>
                          )}

                          {/* Comments List */}
                          <div className="space-y-3 mt-4">
                            {post.comments.length === 0 ? (
                              <p className="text-xs text-serene-400 italic">No replies yet. Spread positivity!</p>
                            ) : (
                              post.comments.map((comment) => (
                                <div key={comment._id} className="p-4 bg-serene-50/50 rounded-2xl border border-serene-100/50">
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="font-bold text-xs text-serene-900">{comment.userName}</span>
                                    <span className="text-[9px] text-serene-400">
                                      {new Date(comment.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                  </div>
                                  <p className="text-xs text-serene-700 leading-relaxed">{comment.content}</p>
                                </div>
                              ))
                            )}
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
