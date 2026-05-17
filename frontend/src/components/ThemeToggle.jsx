import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <motion.button
      onClick={toggleTheme}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      className={`relative w-14 h-7 rounded-full border transition-colors duration-300 flex items-center px-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${
        isDark
          ? 'bg-purple-500/20 border-purple-500/40'
          : 'bg-amber-100 border-amber-300'
      } ${className}`}
      whileTap={{ scale: 0.95 }}
    >
      {/* Track Icons */}
      <span className="absolute left-1.5 text-amber-400 opacity-70">
        <Sun className="w-3.5 h-3.5" />
      </span>
      <span className="absolute right-1.5 text-purple-300 opacity-70">
        <Moon className="w-3.5 h-3.5" />
      </span>

      {/* Thumb */}
      <motion.span
        className={`w-5 h-5 rounded-full shadow-md z-10 flex items-center justify-center text-white ${
          isDark ? 'bg-purple-500' : 'bg-amber-400'
        }`}
        animate={{ x: isDark ? 28 : 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      >
        {isDark ? (
          <Moon className="w-3 h-3" />
        ) : (
          <Sun className="w-3 h-3" />
        )}
      </motion.span>
    </motion.button>
  );
};

export default ThemeToggle;
