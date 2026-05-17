import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Loader2, BookOpen, Sparkles, GraduationCap, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import NoteNinjaLogo from '../components/NoteNinjaLogo';

/* Floating particle background */
const Particle = ({ style }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={style}
    animate={{ y: [0, -30, 0], opacity: [0.3, 0.8, 0.3] }}
    transition={{ duration: 4 + Math.random() * 4, repeat: Infinity, ease: 'easeInOut', delay: Math.random() * 3 }}
  />
);

const floatingIcons = [
  { icon: BookOpen,      top: '12%', left: '8%',  size: 32, delay: 0   },
  { icon: GraduationCap, top: '20%', right: '7%', size: 28, delay: 0.8 },
  { icon: FileText,      bottom: '25%', left: '6%', size: 26, delay: 1.4 },
  { icon: Sparkles,      bottom: '18%', right: '9%', size: 24, delay: 0.4 },
  { icon: BookOpen,      top: '55%',  left: '4%',  size: 20, delay: 2   },
  { icon: FileText,      top: '40%', right: '5%', size: 22, delay: 1.8 },
];

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [focused, setFocused] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return toast.error('Please fill in all fields');
    }
    setIsLoading(true);
    try {
      const res = await api.post('/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      toast.success('Welcome back! 🎉');
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden" style={{ background: 'var(--bg-primary)' }}>

      {/* ── LEFT PANEL (decorative, hidden on mobile) ── */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] relative overflow-hidden p-12"
        style={{ background: 'linear-gradient(135deg, #2e1065 0%, #4c1d95 40%, #831843 100%)' }}>

        {/* Mesh orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-pink-500/30 rounded-full blur-[100px]" />
        <div className="absolute top-[40%] left-[30%] w-[200px] h-[200px] bg-violet-400/20 rounded-full blur-[80px]" />

        {/* Floating icons */}
        {floatingIcons.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={i}
              className="absolute text-white/20"
              style={{ top: item.top, left: item.left, right: item.right, bottom: item.bottom }}
              animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0] }}
              transition={{ duration: 5 + i, repeat: Infinity, ease: 'easeInOut', delay: item.delay }}
            >
              <Icon style={{ width: item.size, height: item.size }} />
            </motion.div>
          );
        })}

        {/* Top logo */}
        <div className="relative z-10">
          <Link to="/">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center border border-white/20">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-extrabold text-white tracking-tight">NoteNinja</span>
            </div>
          </Link>
        </div>

        {/* Center tagline */}
        <div className="relative z-10 space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <h1 className="text-5xl font-black text-white leading-tight">
              Study<br />
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(90deg, #f9a8d4, #c4b5fd)' }}>
                Smarter.
              </span>
            </h1>
            <p className="text-lg text-purple-200/80 mt-4 leading-relaxed max-w-xs">
              Access thousands of engineering notes shared by students, for students.
            </p>
          </motion.div>

          {/* Stats strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="flex gap-6"
          >
            {[['500+', 'Notes'], ['7', 'Branches'], ['8', 'Semesters']].map(([num, label]) => (
              <div key={label} className="text-center">
                <p className="text-2xl font-black text-white">{num}</p>
                <p className="text-xs text-purple-300/80 font-medium">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Bottom quote */}
        <div className="relative z-10">
          <p className="text-sm text-purple-300/60 italic">"Knowledge shared is knowledge multiplied."</p>
        </div>
      </div>

      {/* ── RIGHT PANEL (login form) ── */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-16 relative">

        {/* Mobile background orbs */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden lg:hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[350px] h-[350px] bg-purple-600/15 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[300px] h-[300px] bg-pink-600/15 rounded-full blur-[90px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full max-w-md relative z-10"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Link to="/"><NoteNinjaLogo size="md" /></Link>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-3xl font-black text-white mb-2">Welcome back 👋</h2>
            <p className="text-gray-400 text-base">Sign in to continue your learning journey.</p>
          </div>

          {/* Form card */}
          <div className="glass-panel rounded-3xl p-8 border border-white/10 shadow-2xl shadow-black/30 relative overflow-hidden">
            {/* Card accent glow */}
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">

              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-gray-300">Email Address</label>
                <motion.div
                  animate={{ scale: focused === 'email' ? 1.01 : 1 }}
                  transition={{ duration: 0.15 }}
                  className="relative"
                >
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className={`w-5 h-5 transition-colors duration-200 ${focused === 'email' ? 'text-purple-400' : 'text-gray-500'}`} />
                  </div>
                  <input
                    type="email"
                    value={formData.email}
                    onFocus={() => setFocused('email')}
                    onBlur={() => setFocused('')}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl glass-input border-white/10 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all text-white placeholder-gray-500"
                    placeholder="student@example.com"
                  />
                </motion.div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-gray-300">Password</label>
                <motion.div
                  animate={{ scale: focused === 'password' ? 1.01 : 1 }}
                  transition={{ duration: 0.15 }}
                  className="relative"
                >
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className={`w-5 h-5 transition-colors duration-200 ${focused === 'password' ? 'text-purple-400' : 'text-gray-500'}`} />
                  </div>
                  <input
                    type="password"
                    value={formData.password}
                    onFocus={() => setFocused('password')}
                    onBlur={() => setFocused('')}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl glass-input border-white/10 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all text-white placeholder-gray-500"
                    placeholder="••••••••"
                  />
                </motion.div>
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                className="w-full py-4 rounded-xl font-bold text-base text-white flex items-center justify-center gap-2 mt-4 disabled:opacity-60 disabled:cursor-not-allowed relative overflow-hidden group"
                style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #ec4899 100%)' }}
              >
                {/* Shimmer effect */}
                <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                <span className="relative flex items-center gap-2">
                  {isLoading ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Signing in...</>
                  ) : (
                    <><span>Sign In</span><ArrowRight className="w-5 h-5" /></>
                  )}
                </span>
                {/* Bottom glow */}
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-6 bg-purple-500/40 blur-xl rounded-full pointer-events-none" />
              </motion.button>

            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs text-gray-500 font-medium">or</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <p className="text-center text-gray-400 text-sm">
              Don't have an account?{' '}
              <Link to="/signup" className="text-purple-400 font-bold hover:text-purple-300 transition-colors underline underline-offset-2">
                Create one free →
              </Link>
            </p>
          </div>

          {/* Trust badge */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center text-xs text-gray-500 mt-6 flex items-center justify-center gap-1.5"
          >
            <span className="text-green-400">🔒</span>
            Secure login · No spam · Free forever
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
