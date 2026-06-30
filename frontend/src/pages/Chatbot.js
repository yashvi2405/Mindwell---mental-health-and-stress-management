// pages/Chatbot.js
import React, { useState, useRef, useEffect } from 'react';
import { chatAPI } from '../utils/chatApi';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, Sparkles, Shield, Clock, Heart, AlertTriangle, X } from 'lucide-react';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your Mindwell Companion. I'm here to listen, hold space for your thoughts, and help you find peace. How are you feeling right now?",
      sender: 'bot'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const suggestedPrompts = [
    "I'm feeling very anxious right now",
    "How can I manage work stress?",
    "I need a short breathing exercise",
    "I feel lonely today",
    "Help me reflect on my day"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      text: input,
      sender: 'user'
    };

    setMessages([...messages, userMessage]);
    const currentInput = input;
    setInput('');
    setLoading(true);

    try {
      const data = await chatAPI.sendMessage(currentInput);
      const botMessage = {
        id: Date.now() + 1,
        text: data.response,
        sender: 'bot'
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        text: "I'm having a quiet moment to myself. Please try again in a few seconds.",
        sender: 'bot'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-serene-50 pt-28 pb-10 px-4 relative overflow-hidden flex flex-col">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-serene-200/20 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-serene-300/10 rounded-full blur-[100px] -z-10" />

      <div className="max-w-5xl mx-auto w-full flex-grow flex flex-col lg:flex-row gap-8">
        {/* Left Side: Info & Context */}
        <div className="lg:w-1/3 flex flex-col space-y-6">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="bg-white rounded-[3rem] p-8 shadow-xl shadow-serene-900/5 border border-serene-100"
          >
            <div className="w-14 h-14 bg-serene-700 rounded-2xl flex items-center justify-center text-white mb-6">
              <MessageCircle size={28} />
            </div>
            <h1 className="text-3xl font-serif font-bold text-serene-900 mb-4 tracking-tight">Mindwell AI <span className="text-serene-700 italic">Companion</span></h1>
            <p className="text-serene-600 text-sm leading-relaxed mb-6 italic">
              Your 24/7 empathetic listener. Share your burdens, discover coping tools, or just talk through your day.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-serene-500 text-xs font-bold uppercase tracking-widest">
                <Shield size={16} />
                <span>100% Confidential</span>
              </div>
              <div className="flex items-center space-x-3 text-serene-500 text-xs font-bold uppercase tracking-widest">
                <Clock size={16} />
                <span>Available 24/7</span>
              </div>
              <div className="flex items-center space-x-3 text-serene-500 text-xs font-bold uppercase tracking-widest">
                <Heart size={16} />
                <span>Judgment-Free</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-amber-50 rounded-[2.5rem] p-8 border border-amber-100/50"
          >
            <div className="flex items-center space-x-2 text-amber-700 font-bold text-xs uppercase tracking-tighter mb-4">
                <AlertTriangle size={16} />
                <span>Safety Note</span>
            </div>
            <p className="text-[11px] text-amber-800/70 leading-relaxed font-medium">
              Mindwell AI is for emotional support. If you are in immediate danger or experiencing a crisis, please contact your local emergency services (e.g., 911 or 988) immediately.
            </p>
          </motion.div>
        </div>

        {/* Right Side: Chat Interface */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="lg:w-2/3 flex flex-col bg-white rounded-[3rem] shadow-2xl shadow-serene-900/10 border border-serene-100 overflow-hidden min-h-[600px] lg:h-[750px]"
        >
          {/* Chat Header */}
          <div className="px-8 py-6 glass border-b border-serene-50 flex items-center justify-between z-10">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-serene-100 rounded-2xl flex items-center justify-center text-serene-600">
                    <Sparkles size={24} />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
              </div>
              <div>
                <h3 className="font-bold text-serene-900">Support Companion</h3>
                <p className="text-[10px] text-serene-400 font-bold uppercase tracking-widest">Active & Listening</p>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-grow overflow-y-auto p-8 space-y-6 bg-serene-50/30">
            <AnimatePresence mode="popLayout">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] md:max-w-[75%] p-5 rounded-[2rem] text-sm leading-relaxed shadow-sm ${
                      message.sender === 'user'
                        ? 'bg-serene-700 text-white rounded-tr-none shadow-serene-750/10'
                        : 'bg-white text-serene-850 border border-serene-50 rounded-tl-none italic'
                    }`}
                  >
                    {message.text}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {loading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-white border border-serene-50 p-4 rounded-3xl rounded-tl-none">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-serene-300 rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-serene-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1.5 h-1.5 bg-serene-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-6 bg-white border-t border-serene-50">
            {messages.length <= 1 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {suggestedPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInput(prompt)}
                    className="text-[10px] font-bold uppercase tracking-tight px-4 py-2 bg-serene-50 text-serene-600 rounded-full hover:bg-serene-700 hover:text-white transition-all border border-serene-100"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}
            <form onSubmit={handleSend} className="flex items-center space-x-3 bg-serene-50 rounded-[2rem] px-6 py-1 border border-serene-100 focus-within:ring-4 focus-within:ring-serene-500/10 transition-all">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
                placeholder={loading ? "Thinking..." : "Share what's on your mind..."}
                className="flex-1 bg-transparent border-none py-4 text-serene-900 placeholder-serene-300 focus:ring-0 text-sm italic"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="w-10 h-10 bg-serene-700 text-white rounded-xl flex items-center justify-center hover:bg-serene-850 disabled:bg-serene-200 transition-all shadow-lg active:scale-90 shrink-0"
              >
                <Send size={20} />
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Chatbot;