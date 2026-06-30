// pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Activity, Wind, BarChart3, MessageCircle, ArrowRight, Shield, Globe, Award } from 'lucide-react';

const Home = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const features = [
    {
      title: "Self-Reflective Assessment",
      description: "Understand your current mental state through evidence-based observation tools.",
      icon: Activity,
      path: "/assessment",
      color: "bg-serene-100/80",
      textColor: "text-serene-700"
    },
    {
      title: "Stress Sanctuary",
      description: "Recalibrate your nervous system with organic breathing and ambient layers.",
      icon: Wind,
      path: "/stress-management",
      color: "bg-serene-100/80",
      textColor: "text-serene-700"
    },
    {
      title: "Aura Tracking",
      description: "Identify emotional gradients and patterns with a minimalist, private system.",
      icon: BarChart3,
      path: "/mood-tracker",
      color: "bg-serene-100/80",
      textColor: "text-serene-705"
    },
    {
      title: "Companion AI",
      description: "A judgment-free space to speak your truth and receive mindful support.",
      icon: MessageCircle,
      path: "/chatbot",
      color: "bg-serene-100/80",
      textColor: "text-serene-700"
    }
  ];

  return (
    <div className="overflow-x-hidden pt-16">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-serene-50 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-serene-200 rounded-full blur-[100px] opacity-40 animate-float" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-serene-400 rounded-full blur-[120px] opacity-20" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block px-4 py-1.5 bg-serene-700/10 text-serene-750 rounded-full text-xs font-bold tracking-wider mb-6 uppercase">
                Your Sanctuary Awaits
              </span>
              <h1 className="text-6xl md:text-7xl font-serif font-bold text-serene-900 leading-tight mb-8">
                Nurture Your Mind, <br />
                <span className="text-serene-700 italic">Find Your Peace.</span>
              </h1>
              <p className="text-lg text-serene-750 leading-relaxed mb-10 max-w-lg">
                Mindwell is a serene space designed to help you track emotional patterns, manage daily stress, and discover a more balanced version of yourself.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/mood-tracker"
                  className="px-8 py-4 bg-serene-700 text-white rounded-full font-bold shadow-xl shadow-serene-750/20 hover:bg-serene-850 transition-all flex items-center justify-center space-x-2 group"
                >
                  <span>Start Exploring Free</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/about"
                  className="px-8 py-4 border-2 border-serene-200 text-serene-800 rounded-full font-bold hover:bg-white transition-all flex items-center justify-center"
                >
                  Our Philosophy
                </Link>
              </div>
            </motion.div>

            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl skew-y-1 border border-serene-200/30">
                <img 
                  src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1000" 
                  alt="Serene white orchids and zen stones" 
                  className="w-full h-[450px] object-cover grayscale-[10%] hover:grayscale-0 transition-all duration-700"
                />
              </div>
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white glass rounded-3xl p-6 shadow-xl animate-float -z-0">
                <div className="w-12 h-12 bg-serene-100 rounded-full flex items-center justify-center text-serene-700 mb-4">
                  <Wind size={24} />
                </div>
                <p className="text-[10px] font-bold text-serene-400 uppercase tracking-widest">Breath Mode</p>
                <p className="text-sm font-serif font-bold text-serene-850">Calming Active</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-32 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-serene-900 mb-6">Built for Tranquility</h2>
            <p className="text-lg text-serene-600 max-w-2xl mx-auto">
              Everything you need to support your mental health journey, accessible instantly, without any barriers.
            </p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch"
          >
            {features.map((feature, idx) => (
              <motion.div 
                key={idx}
                variants={itemVariants}
                className="group p-8 rounded-[2.5rem] bg-serene-50/50 border border-serene-100 hover:bg-white hover:shadow-2xl hover:shadow-serene-500/10 transition-all duration-500 cursor-pointer flex flex-col h-full"
              >
                <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center ${feature.textColor} mb-8 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}>
                  <feature.icon size={28} />
                </div>
                <h3 className="text-xl font-serif font-bold text-serene-900 mb-4">{feature.title}</h3>
                <p className="text-serene-600 mb-8 leading-relaxed text-sm">
                  {feature.description}
                </p>
                <Link to={feature.path} className="flex items-center space-x-2 text-xs font-bold text-serene-800 uppercase tracking-widest group-hover:text-serene-700 transition-colors">
                  <span>Explore Tool</span>
                  <ArrowRight size={14} />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Trust & Ethics Section */}
      <section className="py-24 bg-serene-50/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-serene-100/50">
                <Shield size={24} className="text-serene-700" />
              </div>
              <h4 className="text-lg font-serif font-bold text-serene-900 mb-2">Private by Design</h4>
              <p className="text-sm text-serene-600">Your logs are your own. We prioritize encryption and anonymity.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-serene-100/50">
                <Award size={24} className="text-serene-700" />
              </div>
              <h4 className="text-lg font-serif font-bold text-serene-900 mb-2">Evidence Based</h4>
              <p className="text-sm text-serene-600">Tools grounded in psychological research and mindfulness practices.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-serene-100/50">
                <Globe size={24} className="text-serene-700" />
              </div>
              <h4 className="text-lg font-serif font-bold text-serene-900 mb-2">Open Access</h4>
              <p className="text-sm text-serene-600">Mental health tools for everyone, available free of cost.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 z-0 scale-105">
          <img 
            src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=2000" 
            alt="Soft fresh botanical green leaves" 
            className="w-full h-full object-cover blur-[2px] brightness-75"
          />
        </div>
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center text-white">
          <h2 className="text-5xl font-serif font-bold mb-8 leading-tight">Start Your Journey <br /> to Inner Calm Today</h2>
          <p className="text-xl text-white/80 mb-12 max-w-xl mx-auto">
            Join thousands who use Mindwell to navigate life's challenges with more awareness and grace.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/mood-tracker"
              className="px-10 py-5 bg-white text-serene-900 rounded-full font-bold shadow-2xl hover:scale-105 active:scale-95 transition-all"
            >
              Track Your First Mood
            </Link>
            <Link
              to="/login"
              className="px-10 py-5 glass text-white rounded-full font-bold hover:bg-white/20 transition-all border border-white/30"
            >
              Sign Up for History
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;