// pages/Login.js
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, ArrowRight, Heart, Sparkles, AlertCircle } from 'lucide-react';

const Login = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, isLoggedIn } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let userData;
      if (isSignUp) {
        userData = await authAPI.register(name, email, password);
      } else {
        userData = await authAPI.login(email, password);
      }
      
      login(userData);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center bg-serene-50 px-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-serene-200/30 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-serene-300/20 rounded-full blur-[100px] -z-10" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full"
      >
        <div className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-serene-900/5 border border-serene-100">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-serene-700 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl">
              <Heart size={32} fill="currentColor" />
            </div>
            <h2 className="text-3xl font-serif font-bold text-serene-900 mb-2">
              {isSignUp ? 'Join the Sanctuary' : 'Welcome Back'}
            </h2>
            <p className="text-serene-500 text-sm italic">
              {isSignUp ? 'Create your space for inner peace.' : 'Continue your journey to tranquility.'}
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl flex items-center space-x-3 text-sm"
                >
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-4">
              {isSignUp && (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-serene-300">
                    <User size={20} />
                  </div>
                  <input
                    type="text"
                    required
                    className="w-full pl-12 pr-4 py-4 bg-serene-50 border-none rounded-2xl focus:ring-4 focus:ring-serene-500/10 transition-all text-serene-900 placeholder-serene-300"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              )}
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-serene-300">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-serene-50 border-none rounded-2xl focus:ring-4 focus:ring-serene-500/10 transition-all text-serene-900 placeholder-serene-300"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-serene-300">
                  <Lock size={20} />
                </div>
                <input
                  type="password"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-serene-50 border-none rounded-2xl focus:ring-4 focus:ring-serene-500/10 transition-all text-serene-900 placeholder-serene-300"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-serene-700 text-white rounded-full font-bold shadow-xl shadow-serene-750/10 hover:bg-serene-850 disabled:bg-serene-200 transition-all flex items-center justify-center space-x-2 group"
            >
              <span>{loading ? 'Entering Sanctuary...' : (isSignUp ? 'Create Account' : 'Sign In')}</span>
              {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <div className="mt-10 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm font-medium text-serene-500 hover:text-serene-700 transition-colors flex items-center justify-center space-x-1 mx-auto"
            >
              <Sparkles size={16} />
              <span>
                {isSignUp ? 'Already have an account? Sign in' : "New here? Create safe space"}
              </span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;