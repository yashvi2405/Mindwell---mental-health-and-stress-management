// components/Navbar.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';
import { Menu, X, User, LogOut, Heart, Activity, Wind, BarChart3, MessageCircle, Info, Users, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      logout();
      navigate('/login');
    }
  };

  const navLinks = [
    { path: '/', name: 'Home', icon: Heart },
    { path: '/assessment', name: 'Assessment', icon: Activity },
    { path: '/stress-management', name: 'Stress', icon: Wind },
    { path: '/mood-tracker', name: 'Mood', icon: BarChart3 },
    { path: '/community', name: 'Community', icon: Users },
    { path: '/contact', name: 'Therapist', icon: Phone },
    { path: '/chatbot', name: 'Chat', icon: MessageCircle },
    { path: '/about', name: 'About', icon: Info },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'glass py-2 shadow-sm' : 'bg-transparent py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 bg-serene-700 rounded-xl flex items-center justify-center text-white shadow-lg transition-transform duration-500 group-hover:rotate-12">
                <Heart size={22} fill="currentColor" />
              </div>
              <span className="text-2xl font-serif font-bold text-serene-900 tracking-tight flex items-center">
                Mindwell
              </span>
            </Link>
          </div>

          {/* Desktop Nav - styled like the inspo mockup */}
          <div className="hidden md:flex items-center space-x-1.5 bg-serene-100/40 p-1.5 rounded-full border border-serene-200/20 backdrop-blur-md">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-xs font-semibold uppercase tracking-wider transition-all duration-300 flex items-center space-x-1.5 px-4 py-2 rounded-full ${
                  location.pathname === link.path 
                    ? 'bg-serene-700 text-white shadow-sm' 
                    : 'text-serene-800 hover:text-serene-950 hover:bg-serene-150/50'
                }`}
              >
                <link.icon size={13} />
                <span>{link.name}</span>
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile" className="flex items-center space-x-2 text-serene-850 hover:text-serene-700 transition-colors">
                  <div className="w-8 h-8 bg-serene-100 rounded-full flex items-center justify-center border border-serene-200">
                    <User size={16} className="text-serene-600" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider">{user?.name?.split(' ')[0]}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-serene-700 hover:text-red-500 transition-colors"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-serene-800 text-white px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-serene-900 transition-all shadow-md hover:shadow-lg active:scale-95"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-serene-800 hover:text-serene-500 transition-colors"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-serene-100 overflow-hidden"
          >
            <div className="px-4 pt-4 pb-6 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                    location.pathname === link.path 
                      ? 'bg-serene-500 text-white shadow-md' 
                      : 'text-serene-800 hover:bg-serene-50'
                  }`}
                >
                  <link.icon size={20} />
                  <span>{link.name}</span>
                </Link>
              ))}
              
              <div className="pt-4 border-t border-serene-100 mt-4">
                {isLoggedIn ? (
                  <div className="space-y-2">
                    <Link
                      to="/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 rounded-xl text-serene-800 hover:bg-serene-50"
                    >
                      <User size={20} />
                      <span>Profile</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 w-full text-left"
                    >
                      <LogOut size={20} />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center px-4 py-3 rounded-xl bg-serene-800 text-white font-medium"
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;