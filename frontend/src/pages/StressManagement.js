// pages/StressManagement.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, Music, BookOpen, Play, Pause, Timer, Sparkles, Send, LogIn, CloudRain, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';

const rawApiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const API_URL = rawApiUrl.endsWith('/') ? rawApiUrl.slice(0, -1) : rawApiUrl;

const StressManagement = () => {
  const { user, isLoggedIn } = useAuth();
  const [activeTab, setActiveTab] = useState('meditation');
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState('breatheIn'); // breatheIn, hold, breatheOut
  const [timer, setTimer] = useState(0);
  const [journalEntry, setJournalEntry] = useState('');
  const [savedEntries, setSavedEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [playingSound, setPlayingSound] = useState(null);
  const audioRef = useRef(null);

  // Stop sound on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // Meditation Timer
  useEffect(() => {
    let interval;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  // Breathing Logic (4-4-6 pattern)
  useEffect(() => {
    let interval;
    if (breathingActive) {
      interval = setInterval(() => {
        setTimer(prev => {
          if (breathPhase === 'breatheIn' && prev >= 4) {
            setBreathPhase('hold');
            return 0;
          }
          if (breathPhase === 'hold' && prev >= 4) {
            setBreathPhase('breatheOut');
            return 0;
          }
          if (breathPhase === 'breatheOut' && prev >= 6) {
            setBreathPhase('breatheIn');
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      setTimer(0);
      setBreathPhase('breatheIn');
    }
    return () => clearInterval(interval);
  }, [breathingActive, breathPhase]);

  const loadJournalEntries = useCallback(async () => {
    try {
      setLoading(true);
      if (isLoggedIn) {
        const response = await axios.get(`${API_URL}/api/journal`, {
          params: { user: user._id },
          withCredentials: true
        });
        setSavedEntries(response.data);
      } else {
        const local = JSON.parse(localStorage.getItem('mindwell_journals') || '[]');
        setSavedEntries(local);
      }
    } catch (err) {
      setError('Failed to load journals');
    } finally {
      setLoading(false);
    }
  }, [user, isLoggedIn]);

  useEffect(() => {
    if (activeTab === 'journal') loadJournalEntries();
  }, [activeTab, loadJournalEntries]);

  const saveJournal = async () => {
    if (!journalEntry.trim()) return;
    try {
      setLoading(true);
      const newEntry = {
        _id: `local_${Date.now()}`,
        content: journalEntry,
        date: new Date().toISOString()
      };
      if (isLoggedIn) {
        const response = await axios.post(`${API_URL}/api/journal`, { content: journalEntry, user: user._id }, { withCredentials: true });
        setSavedEntries([response.data, ...savedEntries]);
      } else {
        const updated = [newEntry, ...savedEntries];
        localStorage.setItem('mindwell_journals', JSON.stringify(updated));
        setSavedEntries(updated);
      }
      setJournalEntry('');
    } catch (err) {
      setError('Failed to save journal');
    } finally {
      setLoading(false);
    }
  };

  const toggleSound = (sound) => {
    if (playingSound === sound.name) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setPlayingSound(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const audio = new Audio(sound.audioUrl);
      audio.loop = true;
      audio.play().catch(err => console.error('Audio playback failed:', err));
      audioRef.current = audio;
      setPlayingSound(sound.name);
    }
  };

  const soothingSounds = [
    { name: 'Rain', icon: CloudRain, color: 'bg-serene-300', audioUrl: 'https://orangefreesounds.com/wp-content/uploads/2023/01/White-noise-heavy-rain.mp3' },
    { name: 'Forest', icon: Sun, color: 'bg-emerald-300', audioUrl: 'https://orangefreesounds.com/wp-content/uploads/2022/02/Forest-stream-sounds.mp3' },
    { name: 'Ocean', icon: Wind, color: 'bg-serene-100', audioUrl: 'https://www.orangefreesounds.com/wp-content/uploads/2017/10/Sea-noises.mp3' },
    { name: 'Fire', icon: Sparkles, color: 'bg-cream-300', audioUrl: 'https://www.orangefreesounds.com/wp-content/uploads/2015/10/Fire-crackling.mp3' },
  ];

  return (
    <div className="min-h-screen bg-serene-50 pt-28 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-serif font-bold text-serene-900 mb-4 tracking-tight">Decompress.</h1>
          <p className="text-serene-600 text-lg">Choose a modality to return to your center.</p>
          {!isLoggedIn && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="mt-4 flex items-center justify-center space-x-2 text-sm text-serene-500 bg-white inline-flex px-4 py-2 rounded-full border border-serene-100"
            >
              <LogIn size={14} />
              <span>Guest Mode. <Link to="/login" className="text-serene-800 font-bold hover:underline">Log in</Link> to preserve your notes.</span>
            </motion.div>
          )}
        </header>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex glass p-1.5 rounded-full shadow-lg">
            {[
              { id: 'meditation', name: 'Sounds', icon: Music },
              { id: 'breathing', name: 'Breathing', icon: Wind },
              { id: 'journal', name: 'Journal', icon: BookOpen },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-8 py-3 rounded-full text-sm font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-serene-700 text-white shadow-md'
                    : 'text-serene-500 hover:text-serene-800'
                }`}
              >
                <tab.icon size={18} />
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-serene-900/5 border border-serene-100 min-h-[500px]"
          >
            {activeTab === 'meditation' && (
              <div className="space-y-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <h2 className="text-3xl font-serif font-bold text-serene-900">Ambient Mixer</h2>
                    <p className="text-serene-600 leading-relaxed text-sm">Layer high-fidelity nature sounds to create your ideal sanctuary.</p>
                    <div className="grid grid-cols-2 gap-4 items-stretch">
                      {soothingSounds.map((sound) => (
                        <button
                          key={sound.name}
                          onClick={() => toggleSound(sound)}
                          className={`p-6 rounded-[2.5rem] border-2 transition-all text-left flex flex-col h-full group ${
                            playingSound === sound.name 
                            ? 'border-serene-400 bg-serene-50 shadow-inner' 
                            : 'border-serene-50 hover:border-serene-200 hover:bg-white'
                          }`}
                        >
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-6 shadow-sm ${sound.color}`}>
                            {playingSound === sound.name ? <Pause size={24} /> : <sound.icon size={24} />}
                          </div>
                          <p className="font-serif font-bold text-serene-900 group-hover:text-serene-700 transition-colors">{sound.name}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-serene-50/50 rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-serene-700 rounded-full flex items-center justify-center text-white mb-6 animate-float">
                      <Timer size={32} />
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-serene-900 mb-2">Meditation Timer</h3>
                    <div className="text-6xl font-sans font-bold text-serene-900 mb-8 border-b-2 border-serene-200 pb-2">
                      {timeLeft > 0 ? `${Math.floor(timeLeft/60)}:${(timeLeft%60).toString().padStart(2,'0')}` : "00:00"}
                    </div>
                    <div className="flex space-x-3 w-full">
                      {[5, 10, 20].map(m => (
                        <button 
                          key={m}
                          onClick={() => { setTimeLeft(m*60); setIsRunning(true); }}
                          className="flex-1 py-4 glass border border-serene-200 rounded-2xl text-sm font-bold text-serene-800 hover:bg-white hover:shadow-md transition-all active:scale-95"
                        >
                          {m}m
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'breathing' && (
              <div className="flex flex-col items-center text-center space-y-12 py-10">
                <div className="relative">
                  <motion.div 
                    animate={{
                      scale: breathPhase === 'breatheIn' ? 1.5 : breathPhase === 'hold' ? 1.5 : 1,
                      boxShadow: breathPhase === 'breatheIn' 
                        ? "0 0 120px rgba(124, 144, 112, 0.4)" 
                        : "0 0 40px rgba(124, 144, 112, 0.1)"
                    }}
                    transition={{ 
                      duration: breathPhase === 'breatheIn' ? 4 : breathPhase === 'breatheOut' ? 6 : 4, 
                      ease: "easeInOut" 
                    }}
                    className="w-64 h-64 bg-gradient-to-br from-serene-500 to-serene-700 rounded-full relative flex items-center justify-center"
                  >
                    <div className="absolute inset-2 border-2 border-white/20 rounded-full animate-pulse" />
                    <div className="z-10 text-white">
                      <div className="text-5xl font-bold font-sans mb-1">{timer}s</div>
                      <div className="text-xs font-bold uppercase tracking-widest opacity-80">
                        {breathPhase === 'breatheIn' ? 'Inhale' : breathPhase === 'hold' ? 'Hold' : 'Exhale'}
                      </div>
                    </div>
                  </motion.div>
                  <div className="absolute -inset-20 bg-serene-500/10 blur-3xl rounded-full -z-10" />
                </div>

                <div className="max-w-md">
                  <h3 className="text-3xl font-serif font-bold text-serene-900 mb-4">4-4-6 Rhythm</h3>
                  <p className="text-serene-600 leading-relaxed mb-8 italic text-sm">
                    A timeless practice to reset your nervous system. Inhale deeply, hold with gentle awareness, and release slowly.
                  </p>
                  <button
                    onClick={() => setBreathingActive(!breathingActive)}
                    className={`px-16 py-5 rounded-full font-bold shadow-xl transition-all active:scale-95 ${
                      breathingActive 
                      ? 'bg-red-50 text-red-500 border-2 border-red-100' 
                      : 'bg-serene-700 text-white hover:bg-serene-850'
                    }`}
                  >
                    {breathingActive ? 'Stop Practice' : 'Begin Breathing'}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'journal' && (
              <div className="space-y-12">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-serif font-bold text-serene-900">Unload Your Thoughts</h2>
                    <Sparkles size={24} className="text-serene-300" />
                  </div>
                  <div className="relative group">
                    <textarea
                      value={journalEntry}
                      onChange={(e) => setJournalEntry(e.target.value)}
                      placeholder="What is the color of your mind right now?"
                      className="w-full p-10 bg-serene-50/50 border-none rounded-[3rem] focus:ring-4 focus:ring-serene-500/10 min-h-[350px] text-serene-800 placeholder-serene-300 transition-all text-xl italic leading-relaxed"
                    />
                    <button
                      onClick={saveJournal}
                      disabled={!journalEntry.trim() || loading}
                      className="absolute bottom-8 right-8 p-5 bg-serene-700 text-white rounded-[1.5rem] hover:bg-serene-850 shadow-2xl transition-all active:scale-90 disabled:bg-serene-200"
                    >
                      <Send size={28} />
                    </button>
                  </div>
                </div>

                <div className="space-y-8">
                  <h3 className="text-2xl font-serif font-bold text-serene-900">Deep Reflections</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <AnimatePresence>
                      {savedEntries.length === 0 ? (
                        <div className="col-span-2 text-center py-10 text-serene-400 italic">No entries reflected yet.</div>
                      ) : (
                        savedEntries.map((e) => (
                          <motion.div
                            key={e._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="p-8 bg-serene-50/30 rounded-[2.5rem] border border-serene-100 hover:bg-white transition-all shadow-sm group hover:shadow-md"
                          >
                            <p className="text-serene-700 leading-relaxed italic mb-6 line-clamp-4">{e.content}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-serene-400 uppercase tracking-widest">
                                {new Date(e.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                              </span>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default StressManagement;