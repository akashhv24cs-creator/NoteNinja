import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Menu, X, Shield, Zap } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const isDashboardRoute = location.pathname.startsWith('/dashboard') || 
                           location.pathname.startsWith('/notes') || 
                           location.pathname.startsWith('/files') ||
                           location.pathname.startsWith('/explore') ||
                           location.pathname.startsWith('/upload-note') ||
                           location.pathname.startsWith('/note');

  // If on dashboard routes, we use Sidebar instead of top Navbar, or we can show a minimal top bar
  if (isDashboardRoute) return null;

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto glass-panel rounded-2xl px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-105 transition-transform">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-300 bg-clip-text text-transparent tracking-tight">
            NoteNinja
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Features</a>
          <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">How it Works</a>
          <a href="#pricing" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Premium</a>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          {token ? (
            <>
              <Link 
                to="/dashboard" 
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:opacity-90 transition-opacity shadow-lg shadow-purple-600/25 flex items-center gap-2 text-sm"
              >
                <Zap className="w-4 h-4" />
                Dashboard
              </Link>
              <button 
                onClick={handleLogout} 
                className="px-5 py-2.5 rounded-xl glass-card text-gray-300 hover:text-white transition-colors text-sm font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="px-5 py-2.5 rounded-xl text-gray-300 hover:text-white transition-colors text-sm font-medium"
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:opacity-90 transition-opacity shadow-lg shadow-purple-600/25 flex items-center gap-2 text-sm"
              >
                <Shield className="w-4 h-4" />
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="md:hidden p-2 rounded-xl glass-card text-gray-300 hover:text-white"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden mt-4 glass-panel rounded-2xl p-6 flex flex-col gap-4"
          >
            <a href="#features" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white py-2 font-medium">Features</a>
            <a href="#how-it-works" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white py-2 font-medium">How it Works</a>
            <a href="#pricing" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white py-2 font-medium">Premium</a>
            
            <div className="h-[1px] bg-white/10 my-2" />
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400 font-medium">Theme</span>
              <ThemeToggle />
            </div>

            {token ? (
              <div className="flex flex-col gap-3">
                <Link 
                  to="/dashboard" 
                  onClick={() => setIsOpen(false)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium text-center shadow-lg shadow-purple-600/25 flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  Dashboard
                </Link>
                <button 
                  onClick={() => { setIsOpen(false); handleLogout(); }} 
                  className="w-full py-3 rounded-xl glass-card text-gray-300 hover:text-white font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link 
                  to="/login" 
                  onClick={() => setIsOpen(false)}
                  className="w-full py-3 rounded-xl glass-card text-gray-300 hover:text-white font-medium text-center"
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  onClick={() => setIsOpen(false)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium text-center shadow-lg shadow-purple-600/25 flex items-center justify-center gap-2"
                >
                  <Shield className="w-4 h-4" />
                  Get Started
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
