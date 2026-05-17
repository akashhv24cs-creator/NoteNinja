import React from 'react';
import { useTheme } from '../context/ThemeContext';

/* Custom shuriken-notebook SVG icon */
const NinjaIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="4" width="18" height="22" rx="3" fill="white" fillOpacity="0.95" />
    <rect x="6" y="4" width="3" height="22" rx="1.5" fill="white" fillOpacity="0.5" />
    <line x1="12" y1="11" x2="21" y2="11" stroke="#a855f7" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="12" y1="15" x2="21" y2="15" stroke="#a855f7" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="12" y1="19" x2="18" y2="19" stroke="#ec4899" strokeWidth="1.5" strokeLinecap="round" />
    <g transform="translate(19, 5) rotate(15 6 6)">
      <polygon points="6,1 7.5,4.5 11,4.5 8.5,7 9.5,10.5 6,8.5 2.5,10.5 3.5,7 1,4.5 4.5,4.5" fill="url(#ninjaStar)" />
    </g>
    <defs>
      <linearGradient id="ninjaStar" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#a855f7" />
        <stop offset="100%" stopColor="#ec4899" />
      </linearGradient>
    </defs>
  </svg>
);

const NoteNinjaLogo = ({ size = 'md', showText = true }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const sizeMap = {
    sm: { box: 36, icon: 20, text: 'text-lg' },
    md: { box: 40, icon: 24, text: 'text-2xl' },
    lg: { box: 44, icon: 28, text: 'text-3xl' },
  };

  const { box, icon, text } = sizeMap[size] || sizeMap.md;

  return (
    <div className="flex items-center gap-3 group">
      {/* Icon Box */}
      <div
        className="rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-105 transition-transform duration-200 shrink-0"
        style={{
          width: box,
          height: box,
          background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #ec4899 100%)',
        }}
      >
        <NinjaIcon size={icon} />
      </div>

      {/* Brand Text — using a single plain color avoids background-clip issues */}
      {showText && (
        <span
          className={`${text} font-extrabold tracking-tight`}
          style={{
            color: isDark ? '#e9d5ff' : '#3b0764',
            textShadow: isDark ? '0 0 30px rgba(168,85,247,0.4)' : 'none',
            letterSpacing: '-0.02em',
          }}
        >
          Note<span style={{ color: isDark ? '#f9a8d4' : '#7c3aed' }}>Ninja</span>
        </span>
      )}
    </div>
  );
};

export default NoteNinjaLogo;

