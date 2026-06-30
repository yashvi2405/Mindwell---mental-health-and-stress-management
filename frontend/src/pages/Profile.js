import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Shield, Check, AlertCircle, Save, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, updateUser, logout } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

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
