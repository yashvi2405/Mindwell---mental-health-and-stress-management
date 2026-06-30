import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Sparkles, Heart, Globe, Award, Users, AlertTriangle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  const teamMembers = [
    {
      name: "Dr. Sarah Patel",
      role: "Clinical Psychologist",
      bio: "Focuses on evidence-based mental wellness and cognitive harmony.",
      color: "bg-serene-100/70",
      textColor: "text-serene-800"
    },
    {
      name: "Yashvi Muchhala",
      role: "Lead Designer",
      bio: "Crafting digital sanctuaries that prioritize calm and accessibility.",
      color: "bg-serene-100/80",
      textColor: "text-serene-700"
    },
    {
      name: "Dr. Emily Watson",
      role: "Research lead",
      bio: "Bridging clinical research with intuitive mindfulness practices.",
      color: "bg-serene-200/50",
      textColor: "text-serene-850"
    },
    {
      name: "Tanish Tare",
      role: "AI Ethics",
      bio: "Ensuring compassionate and safe AI support for all users.",
      color: "bg-serene-200/70",
      textColor: "text-serene-900"
    }
  ];

  const values = [
    {
      icon: Shield,
      title: "Radical Privacy",
      description: "Your inner thoughts are yours alone. We encrypt everything by default."
    },
    {
      icon: Award,
      title: "Scientific Calm",
      description: "Rooted in clinical psychology and validated mindfulness techniques."
    },
    {
      icon: Globe,
      title: "Universal Access",
      description: "Wellness shouldn't be a luxury. Our core tools are free for everyone."
    },
    {
      icon: Heart,
      title: "Empathy First",
      description: "Designed with deep compassion for the human experience."
    }
  ];

  return (
    <div className="pt-16 bg-serene-50 overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-serene-200/40 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-serene-300/30 rounded-full blur-[100px]" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-6xl md:text-8xl font-serif font-bold text-serene-900 mb-8"
          >
            The Heart of <br />
            <span className="text-serene-700 italic">Mindwell.</span>
          </motion.h1>
          <p className="text-xl md:text-2xl text-serene-750 max-w-3xl mx-auto leading-relaxed font-light">
            We are a group of designers, engineers, and clinicians dedicated to building the world's most serene digital sanctuary for mental wellness.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-white rounded-[4rem] shadow-sm relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <span className="text-serene-700 font-bold uppercase tracking-widest text-xs mb-4 inline-block">The Vision</span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-serene-900 mb-8 leading-tight">
                Democratizing <br /> Tranquility for All.
              </h2>
              <p className="text-lg text-serene-600 leading-relaxed mb-10">
                Mental health care should be accessible to everyone, yet barriers like cost, stigma, and availability prevent millions from getting the support they need. Mindwell bridges this gap with organic tools.
              </p>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h4 className="text-4xl font-serif font-bold text-serene-800 mb-2">50K+</h4>
                  <p className="text-xs text-serene-400 font-bold uppercase tracking-widest">Lives Touched</p>
                </div>
                <div>
                  <h4 className="text-4xl font-serif font-bold text-serene-800 mb-2">100%</h4>
                  <p className="text-xs text-serene-400 font-bold uppercase tracking-widest">Encrypted</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-[4rem] overflow-hidden shadow-2xl relative z-10 border border-serene-200/30">
                <img 
                  src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1000" 
                  alt="Aesthetic spa wellness room" 
                  className="w-full h-[400px] object-cover grayscale-[10%] hover:grayscale-0 transition-all duration-700"
                />
              </div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-serene-700 rounded-full flex items-center justify-center p-8 text-white z-20 shadow-2xl">
                <p className="text-[10px] font-bold leading-tight uppercase tracking-widest text-center">Boutique <br /> Wellness <br /> Lab.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-32 bg-serene-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-serene-900 mb-6 font-serif">Our Guardians</h2>
          <p className="text-serene-600 max-w-2xl mx-auto">The humans behind the sanctuary, blending technology with deep empathy.</p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
            {teamMembers.map((member, index) => (
              <motion.div 
                key={index}
                whileHover={{ y: -10 }}
                className="bg-white rounded-[3rem] p-10 text-center shadow-xl shadow-serene-900/5 group flex flex-col h-full border border-serene-100"
              >
                <div className={`w-24 h-24 ${member.color} rounded-full flex items-center justify-center mx-auto mb-8 transition-transform group-hover:scale-110 shadow-inner`}>
                  <Users size={36} className={member.textColor} />
                </div>
                <h3 className="text-xl font-serif font-bold text-serene-900 mb-1">{member.name}</h3>
                <p className="text-serene-400 font-bold text-[10px] uppercase tracking-[0.2em] mb-6">{member.role}</p>
                <p className="text-serene-600 text-sm leading-relaxed italic">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-32 bg-white rounded-t-[4rem]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 items-stretch">
            {values.map((v, idx) => (
              <div key={idx} className="flex flex-col h-full">
                <div className="w-12 h-12 bg-serene-50 rounded-xl flex items-center justify-center text-serene-700 mb-6">
                  <v.icon size={24} />
                </div>
                <h3 className="text-xl font-serif font-bold text-serene-900 mb-4">{v.title}</h3>
                <p className="text-serene-600 leading-relaxed text-sm flex-grow">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer Section */}
      <section className="py-24 bg-serene-900 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <div className="bg-white/10 backdrop-blur-md rounded-[3rem] p-12 border border-white/10 text-center shadow-2xl">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={32} className="text-cream-200" />
            </div>
            <h3 className="text-2xl font-serif font-bold mb-6">A Note from Our Clinicians</h3>
            <p className="text-lg text-serene-100/80 leading-relaxed mb-8 italic">
              Mindwell is designed to support mental wellness and provide tools for self-care. 
              However, it is <strong>not a substitute for professional medical advice, diagnosis, or treatment</strong>.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-10 py-4 bg-white text-serene-900 rounded-full font-bold hover:scale-105 transition-all shadow-lg text-sm">
                Emergency Resources
              </button>
              <button className="px-10 py-4 glass text-white rounded-full font-bold border border-white/20 hover:bg-white/10 transition-all text-sm">
                Crisis Helplines
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 text-center bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-5xl font-serif font-bold text-serene-900 mb-8 leading-tight font-serif">Begin your transformation.</h2>
          <Link
            to="/mood-tracker"
            className="inline-flex items-center space-x-3 px-12 py-6 bg-serene-700 text-white rounded-full font-bold shadow-2xl hover:bg-serene-800 transition-all group active:scale-95"
          >
            <span>Start Your Journey</span>
            <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;