// components/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-serene-900 text-serene-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-serene-500 rounded-lg flex items-center justify-center text-white">
                <Heart size={20} fill="currentColor" />
              </div>
              <span className="text-xl font-serif font-bold text-white tracking-tight">
                Mindwell
              </span>
            </Link>
            <p className="text-serene-300 max-w-xs leading-relaxed">
              Your serene companion for mental wellness. Tracking moods, managing stress, and nurturing your mind, one day at a time.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-serif font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm text-serene-400">
              <li><Link to="/assessment" className="hover:text-serene-200 transition-colors">Assessment</Link></li>
              <li><Link to="/stress-management" className="hover:text-serene-200 transition-colors">Stress Management</Link></li>
              <li><Link to="/mood-tracker" className="hover:text-serene-200 transition-colors">Mood Tracker</Link></li>
              <li><Link to="/chatbot" className="hover:text-serene-200 transition-colors">Support Chatbot</Link></li>
            </ul>
          </div>

          {/* Social & Contact */}
          <div>
            <h4 className="text-white font-serif font-semibold mb-4">Connect</h4>
            <div className="flex space-x-4 mb-6">
              <a href="#" className="p-2 bg-serene-800 rounded-lg hover:bg-serene-700 transition-colors text-serene-300 hover:text-white" aria-label="Instagram">
                <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>
              <a href="#" className="p-2 bg-serene-800 rounded-lg hover:bg-serene-700 transition-colors text-serene-300 hover:text-white" aria-label="Twitter">
                <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
                </svg>
              </a>
              <a href="#" className="p-2 bg-serene-800 rounded-lg hover:bg-serene-700 transition-colors text-serene-300 hover:text-white" aria-label="Github">
                <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
                  <path d="M9 18c-4.51 2-5-2-7-2"/>
                </svg>
              </a>
            </div>
            <a href="mailto:support@mindwell.com" className="flex items-center space-x-2 text-sm text-serene-400 hover:text-serene-200 transition-colors">
              <Mail size={16} />
              <span>support@mindwell.com</span>
            </a>
          </div>
        </div>

        <div className="pt-12 mt-12 border-t border-serene-800 text-center text-sm text-serene-500">
          <p>© {currentYear} Mindwell. All rights reserved. Designed with care for your wellbeing.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

