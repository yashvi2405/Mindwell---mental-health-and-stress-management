import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Cloud, CloudRain, CloudLightning, Moon, Send, History, Trash2, Edit3, X, LogIn, Calendar, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

const rawApiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const API_URL = rawApiUrl.endsWith('/') ? rawApiUrl.slice(0, -1) : rawApiUrl;

const MoodTracker = () => {
  const { user, isLoggedIn } = useAuth();
  const [selectedMood, setSelectedMood] = useState('');
  const [note, setNote] = useState('');
  const [entries, setEntries] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [viewMode, setViewMode] = useState('calendar');
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedCalendarEntry, setSelectedCalendarEntry] = useState(null);
  const [editingEntry, setEditingEntry] = useState(null);

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedCalendarEntry(null);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedCalendarEntry(null);
  };

  const getMoodInsight = () => {
    if (entries.length === 0) {
      return {
        title: "Awaiting Your Input",
        text: "Log a few daily moods so Mindwell can begin mapping your emotional frequencies and offering specialized wellness guidance."
      };
    }
    
    const moodCounts = entries.reduce((acc, curr) => {
      acc[curr.mood] = (acc[curr.mood] || 0) + 1;
      return acc;
    }, {});
    
    let dominantMood = 'okay';
    let maxCount = 0;
    Object.entries(moodCounts).forEach(([mood, count]) => {
      if (count > maxCount) {
        maxCount = count;
        dominantMood = mood;
      }
    });

    const total = entries.length;
    const positiveCount = (moodCounts.excellent || 0) + (moodCounts.good || 0);
    const positiveRatio = positiveCount / total;

    if (dominantMood === 'excellent' || dominantMood === 'good') {
      return {
        title: "Vibrant & Centered",
        text: `Your dominant energy this month is "${dominantMood.toUpperCase()}". You are maintaining a highly resilient foundation. Remember to anchor these moments of peace to carry you through future tides.`
      };
    } else if (dominantMood === 'okay') {
      return {
        title: "Balanced & Restorative",
        text: "Your dominant energy is \"OKAY\". You are in a steady state of recovery. Consider adding brief deep breathing pauses to expand your energy and bring more clarity to your day."
      };
    } else {
      return {
        title: "Mindful Support Needed",
        text: `You have logged "${dominantMood.toUpperCase()}" most frequently recently (representing ${Math.round((maxCount/total)*100)}% of entries). This indicates heightened stress. We highly recommend using the 4-4-6 Breathing Guide or taking a restorative nature sound bath.`
      };
    }
  };

  const insight = getMoodInsight();

  const renderCalendarCells = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const cells = [];

    // Blank cells
    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`blank-${i}`} className="h-14 border border-serene-50/50 bg-serene-50/10 rounded-xl" />);
    }

    // Day cells
    for (let day = 1; day <= daysInMonth; day++) {
      const dayEntry = entries.find(e => {
        const d = new Date(e.date);
        return d.getDate() === day && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      });

      const moodInfo = dayEntry ? moods.find(m => m.value === dayEntry.mood) : null;

      cells.push(
        <button
          key={`day-${day}`}
          type="button"
          onClick={() => dayEntry && setSelectedCalendarEntry(dayEntry)}
          className={`h-14 border rounded-xl flex flex-col items-center justify-between p-1.5 transition-all text-xs relative ${
            moodInfo 
              ? `bg-gradient-to-br ${moodInfo.color} text-white shadow-sm border-transparent hover:scale-105` 
              : 'border-serene-100 hover:border-serene-200 text-serene-600 bg-white'
          }`}
        >
          <span className={`font-sans font-bold leading-none ${moodInfo ? 'text-white' : 'text-serene-400'}`}>{day}</span>
          {moodInfo && <moodInfo.icon size={14} className="opacity-90" />}
        </button>
      );
    }

    return cells;
  };

  const moods = [
    { value: 'excellent', label: 'Excellent', icon: Sun, color: 'from-amber-300 to-orange-400', shadow: 'shadow-amber-200' },
    { value: 'good', label: 'Good', icon: Cloud, color: 'from-emerald-300 to-teal-400', shadow: 'shadow-emerald-205' },
    { value: 'okay', label: 'Okay', icon: Moon, color: 'from-serene-200 to-serene-300', shadow: 'shadow-serene-200' },
    { value: 'bad', label: 'Bad', icon: CloudRain, color: 'from-serene-400 to-serene-600', shadow: 'shadow-serene-300' },
    { value: 'terrible', label: 'Terrible', icon: CloudLightning, color: 'from-serene-700 to-serene-900', shadow: 'shadow-serene-400' },
  ];

  const loadMoodData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      if (isLoggedIn) {
        const params = { limit: 50, user: user._id };
        const statsParams = { days: 30, user: user._id };

        const [entriesResponse, statsResponse] = await Promise.all([
          axios.get(`${API_URL}/api/mood`, { params, withCredentials: true }),
          axios.get(`${API_URL}/api/mood/stats`, { params: statsParams, withCredentials: true })
        ]);
        setEntries(entriesResponse.data);
        setStats(statsResponse.data);
      } else {
        // Load from localStorage for guests
        const localEntries = JSON.parse(localStorage.getItem('mindwell_moods') || '[]');
        setEntries(localEntries.sort((a, b) => new Date(b.date) - new Date(a.date)));
        
        // Simple stats for local
        const counts = localEntries.reduce((acc, curr) => {
          acc[curr.mood] = (acc[curr.mood] || 0) + 1;
          return acc;
        }, {});
        setStats({ totalEntries: localEntries.length, moodCounts: counts });
      }
    } catch (err) {
      console.error('Error loading mood data:', err);
      setError('Failed to load mood data.');
    } finally {
      setLoading(false);
    }
  }, [user, isLoggedIn]);

  useEffect(() => {
    loadMoodData();
  }, [loadMoodData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMood) return;

    try {
      setLoading(true);
      const moodData = {
        mood: selectedMood,
        note: note.trim(),
        date: new Date().toISOString(),
        _id: `local_${Date.now()}`
      };

      if (isLoggedIn) {
        moodData.user = user._id;
        const response = await axios.post(`${API_URL}/api/mood`, moodData, {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' }
        });
        setEntries([response.data, ...entries]);
      } else {
        const localEntries = [moodData, ...entries];
        localStorage.setItem('mindwell_moods', JSON.stringify(localEntries));
        setEntries(localEntries);
      }

      setSuccess('Mood logged beautifully');
      setSelectedMood('');
      setNote('');
      setTimeout(() => setSuccess(''), 3000);
      loadMoodData();
    } catch (err) {
      setError('Failed to log mood');
    } finally {
      setLoading(false);
    }
  };

  const deleteEntry = async (id) => {
    if (!window.confirm('Delete this memory?')) return;
    try {
      if (isLoggedIn && !id.toString().startsWith('local_')) {
        await axios.delete(`${API_URL}/api/mood/${id}`, { withCredentials: true });
      } else {
        const updatedEntries = entries.filter(e => e._id !== id);
        localStorage.setItem('mindwell_moods', JSON.stringify(updatedEntries));
      }
      setEntries(entries.filter(e => e._id !== id));
      loadMoodData();
    } catch (err) {
      setError('Failed to delete');
    }
  };

  return (
    <div className="min-h-screen bg-serene-50 pt-28 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-16">
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl font-serif font-bold text-serene-900 mb-4"
          >
            How is your aura today?
          </motion.h1>
          <p className="text-serene-600 text-lg">Select the energy that matches your current state.</p>
          {!isLoggedIn && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="mt-4 flex items-center justify-center space-x-2 text-sm text-serene-500 bg-white inline-flex px-4 py-2 rounded-full border border-serene-100"
            >
              <LogIn size={14} />
              <span>You're in Guest view. <Link to="/login" className="text-serene-700 font-bold hover:underline">Log in</Link> to sync history.</span>
            </motion.div>
          )}
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Mood Selector Sidebar */}
          <div className="lg:col-span-12 xl:col-span-4">
            <motion.div 
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="bg-white rounded-[3rem] p-8 shadow-xl shadow-serene-900/5 border border-serene-100"
            >
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-5 sm:grid-cols-5 gap-4 mb-8">
                  {moods.map((mood) => (
                    <button
                      key={mood.value}
                      type="button"
                      onClick={() => setSelectedMood(mood.value)}
                      className="group relative flex flex-col items-center"
                    >
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                        selectedMood === mood.value 
                        ? `bg-gradient-to-br ${mood.color} text-white scale-110 shadow-lg ${mood.shadow}` 
                        : 'bg-serene-50 text-serene-400 hover:bg-serene-100'
                      }`}>
                        <mood.icon size={28} />
                      </div>
                      <span className={`text-[10px] mt-2 font-bold uppercase tracking-tighter transition-colors ${
                        selectedMood === mood.value ? 'text-serene-900' : 'text-serene-300'
                      }`}>
                        {mood.label}
                      </span>
                      {selectedMood === mood.value && (
                        <motion.div layoutId="activeMood" className="absolute -inset-2 border-2 border-serene-700/20 rounded-3xl -z-0" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="mb-6">
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Reflect on your energy..."
                    className="w-full p-6 bg-serene-50 border-none rounded-[2rem] focus:ring-4 focus:ring-serene-500/10 transition-all resize-none min-h-[150px] text-serene-850 placeholder-serene-300"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !selectedMood}
                  className="w-full py-5 bg-serene-700 text-white rounded-full font-bold shadow-xl hover:bg-serene-850 disabled:bg-serene-200 transition-all flex items-center justify-center space-x-2"
                >
                  <Send size={18} />
                  <span>{loading ? 'Archiving...' : 'Log Energy'}</span>
                </button>
              </form>
            </motion.div>

            {/* Sanctuary Insight Card */}
            <motion.div 
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="bg-white rounded-[3rem] p-8 shadow-xl shadow-serene-900/5 border border-serene-100 mt-6"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2.5 bg-serene-50 rounded-xl text-serene-700">
                  <Sparkles size={20} />
                </div>
                <h4 className="font-serif font-bold text-serene-900 text-lg">Sanctuary Insight</h4>
              </div>
              <h5 className="font-bold text-sm tracking-wider uppercase text-serene-850 mb-2">{insight.title}</h5>
              <p className="text-xs leading-relaxed text-serene-600 italic">{insight.text}</p>
            </motion.div>
          </div>

          {/* History & Stats Content */}
          <div className="lg:col-span-12 xl:col-span-8 flex flex-col space-y-8">
            {/* Stats Bar */}
            {stats && (
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="grid grid-cols-2 md:grid-cols-5 gap-4 items-stretch"
              >
                {moods.map(m => {
                  const count = stats.moodCounts[m.value] || 0;
                  const percentage = stats.totalEntries > 0 ? (count / stats.totalEntries) * 100 : 0;
                  return (
                    <div key={m.value} className="bg-white p-6 rounded-[2rem] border border-serene-100 shadow-sm flex flex-col items-center text-center justify-between h-full">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${m.color} text-white flex items-center justify-center mb-4 shadow-md`}>
                        <m.icon size={18} />
                      </div>
                      <div className="w-full">
                        <p className="text-xl font-serif font-bold text-serene-900 leading-none">{count}</p>
                        <p className="text-[10px] font-bold text-serene-300 uppercase tracking-widest mt-1 mb-3">{m.label}</p>
                        <div className="w-full h-1 bg-serene-50 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            className="h-full bg-serene-700" 
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            )}

            {/* History & Calendar Card */}
            <div className="bg-white rounded-[3rem] p-8 shadow-xl shadow-serene-900/5 border border-serene-100 min-h-[550px] flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-8 border-b border-serene-100 pb-4">
                  <h3 className="text-2xl font-serif font-bold text-serene-900">
                    {viewMode === 'calendar' ? 'Monthly Aura Grid' : 'Atmosphere History'}
                  </h3>
                  <div className="flex space-x-2 bg-serene-50 p-1 rounded-xl">
                    <button
                      onClick={() => setViewMode('list')}
                      className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow text-serene-850' : 'text-serene-400 hover:text-serene-700'}`}
                    >
                      <History size={16} className="inline mr-1" /> List
                    </button>
                    <button
                      onClick={() => setViewMode('calendar')}
                      className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${viewMode === 'calendar' ? 'bg-white shadow text-serene-850' : 'text-serene-400 hover:text-serene-700'}`}
                    >
                      <Calendar size={16} className="inline mr-1" /> Calendar
                    </button>
                  </div>
                </div>

                {viewMode === 'list' ? (
                  <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                      {entries.length === 0 ? (
                        <div className="text-center py-20">
                          <div className="w-20 h-20 bg-serene-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-serene-200">
                            <Moon size={40} />
                          </div>
                          <p className="text-serene-400 italic">No energy logged yet.</p>
                        </div>
                      ) : (
                        entries.map((entry) => {
                          const moodInfo = moods.find(m => m.value === entry.mood) || moods[2];
                          return (
                            <motion.div
                              key={entry._id}
                              initial={{ scale: 0.9, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0.8, opacity: 0 }}
                              className="group p-6 bg-serene-50/50 rounded-[2rem] border border-serene-100 hover:bg-white hover:shadow-lg transition-all"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-6">
                                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${moodInfo.color} text-white flex items-center justify-center shadow-lg`}>
                                    <moodInfo.icon size={24} />
                                  </div>
                                  <div>
                                    <div className="flex items-center space-x-3 mb-2">
                                      <span className="text-sm font-bold text-serene-900 uppercase tracking-widest">{entry.mood}</span>
                                      <span className="text-xs text-serene-400">
                                        {new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                      </span>
                                    </div>
                                    <p className="text-serene-700 leading-relaxed italic">{entry.note || "No reflection added."}</p>
                                  </div>
                                </div>
                                <button 
                                  onClick={() => deleteEntry(entry._id)}
                                  className="p-2 text-serene-200 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </motion.div>
                          );
                        })
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                      <button onClick={handlePrevMonth} className="p-2 text-serene-500 hover:text-serene-850 hover:bg-serene-50 rounded-xl transition-all">
                        <ChevronLeft size={20} />
                      </button>
                      <h4 className="font-serif font-bold text-serene-900 text-lg">
                        {monthNames[currentMonth]} {currentYear}
                      </h4>
                      <button onClick={handleNextMonth} className="p-2 text-serene-500 hover:text-serene-850 hover:bg-serene-50 rounded-xl transition-all">
                        <ChevronRight size={20} />
                      </button>
                    </div>

                    <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-bold text-serene-300 uppercase tracking-wider mb-2">
                      {daysOfWeek.map(d => <div key={d}>{d}</div>)}
                    </div>

                    <div className="grid grid-cols-7 gap-2">
                      {renderCalendarCells()}
                    </div>

                    {selectedCalendarEntry && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 p-6 bg-serene-50/50 border border-serene-100 rounded-3xl"
                      >
                        <div className="flex justify-between items-center mb-2 border-b border-serene-100 pb-2">
                          <span className="text-[10px] font-bold text-serene-800 uppercase tracking-widest">
                            {selectedCalendarEntry.mood} energy on {new Date(selectedCalendarEntry.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                          </span>
                          <button onClick={() => setSelectedCalendarEntry(null)} className="text-[10px] font-bold text-red-400 hover:text-red-600">Close</button>
                        </div>
                        <p className="text-xs italic text-serene-700 leading-relaxed">"{selectedCalendarEntry.note || "No reflection added."}"</p>
                      </motion.div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Aesthetic Background Shapes */}
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-serene-200/20 rounded-full blur-[100px] -z-10" />
      <div className="fixed top-0 left-0 w-[300px] h-[300px] bg-serene-300/10 rounded-full blur-[80px] -z-10" />
    </div>
  );
};

export default MoodTracker;
