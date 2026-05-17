import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen, Shield, Zap, Search, HardDrive, Layers, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';

const Landing = () => {
  return (
    <div className="min-h-screen bg-[#0b0f19] text-white overflow-hidden relative">
      {/* Background Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-pink-600/20 blur-[120px] pointer-events-none animate-pulse-glow" style={{ animationDelay: '2s' }} />

      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20 relative z-10">
        {/* Hero Section */}
        <section className="flex flex-col items-center text-center mt-20 mb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border-purple-500/30 text-purple-300 text-sm font-medium mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            Introducing NoteNinja Premium
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-6xl md:text-8xl font-bold tracking-tight mb-8 leading-tight"
          >
            The Future of <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
              Student Organization
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-400 max-w-2xl mb-12 leading-relaxed"
          >
            Store your notes, upload PDFs, and manage your study materials in a beautiful, premium, and lightning-fast workspace.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <Link to="/signup" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg hover:opacity-90 transition-opacity shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 group">
              Start for free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/login" className="w-full sm:w-auto px-8 py-4 rounded-xl glass-card text-gray-300 font-bold text-lg hover:text-white transition-colors flex items-center justify-center gap-2">
              Sign In
            </Link>
          </motion.div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Everything you need to succeed</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">A powerful suite of tools designed specifically for students to organize their academic life.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard 
              icon={<BookOpen className="w-8 h-8 text-purple-400" />}
              title="Rich Notes"
              desc="Create, edit, and organize beautiful notes with categories and tags."
            />
            <FeatureCard 
              icon={<HardDrive className="w-8 h-8 text-pink-400" />}
              title="GridFS Storage"
              desc="Securely upload and store your PDFs and documents in the cloud."
            />
            <FeatureCard 
              icon={<Search className="w-8 h-8 text-blue-400" />}
              title="Instant Search"
              desc="Find any note or document instantly with our real-time search engine."
            />
            <FeatureCard 
              icon={<Shield className="w-8 h-8 text-emerald-400" />}
              title="Secure Access"
              desc="Your data is protected with enterprise-grade JWT authentication."
            />
            <FeatureCard 
              icon={<Layers className="w-8 h-8 text-amber-400" />}
              title="Smart Organization"
              desc="Keep everything tidy with our intuitive category and tagging system."
            />
            <FeatureCard 
              icon={<Zap className="w-8 h-8 text-rose-400" />}
              title="Lightning Fast"
              desc="Built on modern tech stack for instantaneous load times and smooth animations."
            />
          </div>
        </section>

      </main>
      
      <footer className="border-t border-white/10 py-8 text-center text-gray-500 text-sm glass-panel relative z-10">
        <p>&copy; 2026 NoteNinja Premium. Built for students.</p>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="glass-card p-8 rounded-3xl border border-white/5"
  >
    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
    <p className="text-gray-400 leading-relaxed">{desc}</p>
  </motion.div>
);

export default Landing;
