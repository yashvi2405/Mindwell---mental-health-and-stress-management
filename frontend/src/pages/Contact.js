import { authAPI } from '../utils/api';

// pages/Contact.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, MessageSquare, Calendar, CheckCircle } from 'lucide-react';

const Contact = () => {
  const [therapistsList, setTherapistsList] = useState([]);
  const [loadingTherapists, setLoadingTherapists] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    therapist: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTherapists = async () => {
      try {
        const data = await authAPI.getTherapists();
        setTherapistsList(data || []);
        if (data && data.length > 0) {
          setFormData(prev => ({ ...prev, therapist: data[0].name }));
        }
      } catch (err) {
        console.error('Error fetching therapists:', err);
      } finally {
        setLoadingTherapists(false);
      }
    };
    fetchTherapists();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setLoading(true);
    // Simulate API callback
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      therapist: therapistsList[0]?.name || '',
      message: ''
    });
    setSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-serene-50 pt-28 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-serene-700/10 text-serene-750 rounded-full text-xs font-bold tracking-wider mb-4 uppercase">
            Therapist Connection
          </span>
          <h1 className="text-5xl font-serif font-bold text-serene-900 mb-4">Connect with Experts.</h1>
          <p className="text-serene-600 text-lg max-w-2xl mx-auto">
            Schedule a supportive counseling session or seek customized guidance from certified mental health professionals.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Therapist Directory Card */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-2xl font-serif font-bold text-serene-900 mb-6">Verified Specialists</h3>
            
            {loadingTherapists ? (
              <div className="text-center py-10">
                <p className="text-serene-400 text-sm">Loading certified specialists...</p>
              </div>
            ) : therapistsList.length > 0 ? (
              therapistsList.map((t) => (
                <motion.div
                  key={t._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-[2.5rem] p-6 shadow-md border border-serene-100 flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6 hover:shadow-lg transition-all"
                >
                  <img
                    src={t.photo || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300'}
                    alt={t.name}
                    className="w-24 h-24 md:w-28 md:h-28 rounded-2xl object-cover object-center border border-serene-50/50 shadow-inner flex-shrink-0"
                  />
                  <div className="flex-1">
                    <h4 className="font-serif font-bold text-serene-900 text-lg mb-1">{t.name}</h4>
                    <p className="text-xs text-serene-700 font-bold mb-3">{t.title}</p>
                    <p className="text-xs text-serene-500 leading-relaxed mb-4">{t.bio}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {t.specialties && t.specialties.map(s => (
                        <span key={s} className="px-2.5 py-1 bg-serene-50 text-[10px] text-serene-750 font-bold rounded-full">
                          {s}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center text-[10px] font-bold text-serene-400">
                      <Calendar size={12} className="mr-1" />
                      <span>Availability: {t.availability}</span>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="bg-white rounded-[2.5rem] p-10 text-center border border-serene-100 shadow-md">
                <p className="text-serene-600 font-light leading-relaxed text-sm">
                  No verified specialists are currently registered in our database directory. <br />
                  If you are a certified therapist, please register an account to join our sanctuary directory.
                </p>
              </div>
            )}
          </div>

          {/* Callback Request Form Card */}
          <div className="lg:col-span-5 bg-white rounded-[2.5rem] p-8 shadow-xl shadow-serene-900/5 border border-serene-100 min-h-[500px]">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-serene-50 rounded-xl flex items-center justify-center text-serene-700">
                <Calendar size={20} />
              </div>
              <h3 className="font-serif font-bold text-serene-900 text-xl">Schedule Inquiry</h3>
            </div>

            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <p className="text-xs text-serene-500 leading-relaxed">
                    Leave your contact details and message below. The selected counselor will reach out to you within 24 hours.
                  </p>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-serene-400">Your Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-serene-300">
                        <User size={16} />
                      </div>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full pl-12 pr-4 py-3.5 bg-serene-50/50 border border-serene-100 rounded-2xl text-xs focus:ring-4 focus:ring-serene-500/10 text-serene-850"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-serene-400">Email Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-serene-300">
                        <Mail size={16} />
                      </div>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-12 pr-4 py-3.5 bg-serene-50/50 border border-serene-100 rounded-2xl text-xs focus:ring-4 focus:ring-serene-500/10 text-serene-850"
                        placeholder="johndoe@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-serene-400">Select Specialist</label>
                    <select
                      value={formData.therapist}
                      onChange={(e) => setFormData({ ...formData, therapist: e.target.value })}
                      className="w-full px-4 py-3.5 bg-serene-50/50 border border-serene-100 rounded-2xl text-xs focus:ring-4 focus:ring-serene-500/10 text-serene-750"
                    >
                      {therapistsList.length > 0 ? (
                        therapistsList.map(t => (
                          <option key={t.name} value={t.name}>{t.name}</option>
                        ))
                      ) : (
                        <option value="">No specialists registered</option>
                      )}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-serene-400">Message / Inquiry</label>
                    <div className="relative">
                      <div className="absolute top-4 left-4 text-serene-300">
                        <MessageSquare size={16} />
                      </div>
                      <textarea
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full pl-12 pr-4 py-3.5 bg-serene-50/50 border border-serene-100 rounded-2xl text-xs focus:ring-4 focus:ring-serene-500/10 text-serene-850 min-h-[100px] resize-none leading-relaxed"
                        placeholder="Detail your request or inquiry..."
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-serene-700 text-white rounded-full font-bold shadow-md hover:bg-serene-850 disabled:bg-serene-200 transition-all flex items-center justify-center space-x-2 text-xs uppercase tracking-widest"
                  >
                    <span>{loading ? 'Submitting...' : 'Request Callback'}</span>
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="py-12 text-center space-y-6"
                >
                  <div className="w-16 h-16 bg-serene-500/10 rounded-full flex items-center justify-center mx-auto text-serene-700">
                    <CheckCircle size={32} />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-serene-900 text-lg mb-2">Request Transmitted</h4>
                    <p className="text-xs text-serene-500 leading-relaxed px-4">
                      Your inquiry has been secured. **{formData.therapist}** will review your request and contact you at **{formData.email}** within 24 hours.
                    </p>
                  </div>
                  <button
                    onClick={handleReset}
                    className="px-6 py-2.5 border border-serene-200 hover:bg-serene-50 text-serene-800 text-[10px] uppercase tracking-wider font-bold rounded-xl transition-all"
                  >
                    New Inquiry
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
