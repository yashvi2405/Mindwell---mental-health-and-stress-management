import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Shield, Check, AlertCircle, Save, LogOut, Sparkles, Heart, BookOpen, Award, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const rawApiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const API_URL = rawApiUrl.endsWith('/') ? rawApiUrl.slice(0, -1) : rawApiUrl;

const Profile = () => {
  const { user, isLoggedIn, updateUser, logout } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [moodCount, setMoodCount] = useState(0);
  const [journalCount, setJournalCount] = useState(0);
  const [completedGoalsCount, setCompletedGoalsCount] = useState(0);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        let mc = 0;
        let jc = 0;

        if (isLoggedIn && user) {
          const params = { user: user._id };
          const [moodsRes, journalsRes] = await Promise.all([
            axios.get(`${API_URL}/api/mood`, { params, withCredentials: true }),
            axios.get(`${API_URL}/api/journal`, { params, withCredentials: true })
          ]);
          mc = moodsRes.data.length;
          jc = journalsRes.data.length;
        } else {
          const moodsLocal = JSON.parse(localStorage.getItem('mindwell_moods') || '[]');
          const journalsLocal = JSON.parse(localStorage.getItem('mindwell_journals') || '[]');
          mc = moodsLocal.length;
          jc = journalsLocal.length;
        }

        const goalsLocal = JSON.parse(localStorage.getItem('mindwell_goals') || '[]');
        const cgc = goalsLocal.filter(g => g.completed).length;

        setMoodCount(mc);
        setJournalCount(jc);
        setCompletedGoalsCount(cgc);
      } catch (err) {
        console.error('Error fetching data for badges:', err);
      }
    };

    fetchUserData();
  }, [isLoggedIn, user]);

  const badgesList = [
    {
      id: 'first_mood',
      name: 'First Light',
      description: 'Log your first daily energy state.',
      icon: Sparkles,
      unlocked: moodCount >= 1,
      requirement: '1 Mood Entry'
    },
    {
      id: 'five_moods',
      name: 'Inner Awareness',
      description: 'Observe patterns across 5 logs.',
      icon: Heart,
      unlocked: moodCount >= 5,
      requirement: '5 Mood Entries'
    },
    {
      id: 'first_journal',
      name: 'Reflection Explorer',
      description: 'Write your first journal reflection.',
      icon: BookOpen,
      unlocked: journalCount >= 1,
      requirement: '1 Journal Entry'
    },
    {
      id: 'five_journals',
      name: 'Focus Anchor',
      description: 'Commit your thoughts to 5 entries.',
      icon: Shield,
      unlocked: journalCount >= 5,
      requirement: '5 Journal Entries'
    },
    {
      id: 'three_goals',
      name: 'Focused Intent',
      description: 'Complete 3 daily mindful tasks.',
      icon: Award,
      unlocked: completedGoalsCount >= 3,
      requirement: '3 Mindful Goals'
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const updateData = { name, email };
      if (password) updateData.password = password;

      const updatedUser = await authAPI.updateProfile(updateData);
      updateUser(updatedUser);
      setSuccess('Sanctuary settings updated.');
      setPassword('');
      setConfirmPassword('');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen pt-32 pb-20 bg-serene-50 px-4">
      <div className="max-w-2xl mx-auto">
        <header className="mb-12 text-center md:text-left md:flex md:items-end md:justify-between">
          <div>
            <h1 className="text-5xl font-serif font-bold text-serene-900 mb-2 italic">Profile Settings</h1>
            <p className="text-serene-600">Nurture your identity and personal space.</p>
          </div>
          <button 
            onClick={handleLogout}
            className="mt-6 md:mt-0 flex items-center space-x-2 text-red-500 font-bold text-sm uppercase tracking-widest hover:text-red-700 transition-colors"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </header>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-serene-900/5 border border-serene-100"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-red-50 text-red-600 p-6 rounded-3xl flex items-center space-x-4 text-sm font-medium"
                >
                  <AlertCircle size={20} />
                  <span>{error}</span>
                </motion.div>
              )}
              {success && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-serene-500/10 text-serene-600 p-6 rounded-3xl flex items-center space-x-4 text-sm font-bold"
                >
                  <Check size={20} />
                  <span>{success}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-serene-400 ml-4">Full Identity</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-serene-300">
                    <User size={20} />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-16 pr-6 py-5 bg-serene-50 border-none rounded-3xl focus:ring-4 focus:ring-serene-500/10 transition-all text-serene-900 font-medium"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-serene-400 ml-4">Email Channel</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-serene-300">
                    <Mail size={20} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-16 pr-6 py-5 bg-serene-50 border-none rounded-3xl focus:ring-4 focus:ring-serene-500/10 transition-all text-serene-900 font-medium"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-serene-100">
              <h3 className="text-xl font-serif font-bold text-serene-900 mb-6 flex items-center space-x-2">
                <Shield size={20} className="text-serene-400" />
                <span>Security Update</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-serene-400 ml-4">New Key</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-6 py-5 bg-serene-50 border-none rounded-3xl focus:ring-4 focus:ring-serene-500/10 transition-all placeholder-serene-300"
                    placeholder="Leave blank to keep current"
                  />
                </div>

                {password && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-2"
                  >
                    <label className="text-xs font-bold uppercase tracking-widest text-serene-400 ml-4">Confirm Key</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-6 py-5 bg-serene-50 border-none rounded-3xl focus:ring-4 focus:ring-serene-500/10 transition-all placeholder-serene-300 shadow-inner"
                      placeholder="Verify new key"
                      required
                    />
                  </motion.div>
                )}
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto px-12 py-5 bg-serene-700 text-white rounded-full font-bold shadow-xl shadow-serene-750/10 hover:bg-serene-850 disabled:bg-serene-200 transition-all flex items-center justify-center space-x-3 group"
              >
                <Save size={20} />
                <span>{loading ? 'Preserving...' : 'Save Sanctuary Settings'}</span>
              </button>
            </div>
          </form>
        </motion.div>

        {/* Milestones & Badges section */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-serene-900/5 border border-serene-100 mt-8"
        >
          <div className="mb-8">
            <h2 className="text-3xl font-serif font-bold text-serene-900 mb-2">Tranquility Milestones</h2>
            <p className="text-serene-600 text-sm">Your unlocked mindfulness certifications and wellness markers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {badgesList.map((badge) => (
              <div 
                key={badge.id}
                className={`p-6 rounded-[2rem] border transition-all duration-300 relative overflow-hidden flex flex-col items-center text-center ${
                  badge.unlocked 
                    ? 'bg-serene-50/50 border-serene-200/60 shadow-md shadow-serene-100/50 scale-100'
                    : 'bg-white border-serene-100 opacity-60'
                }`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow-sm ${
                  badge.unlocked 
                    ? 'bg-serene-700 text-white' 
                    : 'bg-serene-50 text-serene-300'
                }`}>
                  {badge.unlocked ? <badge.icon size={26} /> : <Lock size={22} />}
                </div>

                <h4 className="font-serif font-bold text-serene-900 mb-1">{badge.name}</h4>
                <p className="text-xs text-serene-500 leading-relaxed mb-4">{badge.description}</p>
                
                <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
                  badge.unlocked 
                    ? 'bg-serene-200/50 text-serene-800' 
                    : 'bg-serene-50 text-serene-400'
                }`}>
                  {badge.unlocked ? 'Unlocked' : badge.requirement}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Support Link */}
        <div className="mt-12 text-center">
            <p className="text-sm text-serene-400">
                Need to archive your data? <button className="text-serene-700 font-bold hover:underline">Contact Support</button>
            </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
