import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, BookOpen, FolderOpen, LogOut, ChevronLeft, ChevronRight, Zap, HardDrive, Search, UploadCloud } from 'lucide-react';
import api from '../services/api';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [storageStats, setStorageStats] = useState(0); // in bytes
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchStorageStats();
  }, []);

  const fetchStorageStats = async () => {
    try {
      const res = await api.get('/files');
      if (res.data && res.data.totalStorageBytes !== undefined) {
        setStorageStats(res.data.totalStorageBytes);
      }
    } catch (error) {
      console.error('Error fetching storage stats:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const maxStorage = 500 * 1024 * 1024; // 500MB allowance for students
  const storagePercentage = Math.min(Math.round((storageStats / maxStorage) * 100), 100);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Search, label: 'Explore Notes', path: '/explore' },
    { icon: UploadCloud, label: 'Upload Note', path: '/upload-note' },
    { icon: BookOpen, label: 'My Notes', path: '/notes' },
    { icon: FolderOpen, label: 'Documents & PDFs', path: '/files' },
  ];

  return (
    <motion.aside 
      initial={false}
      animate={{ width: isCollapsed ? '80px' : '280px' }}
      transition={{ duration: 0.3, cubicBezier: [0.4, 0, 0.2, 1] }}
      className="hidden md:flex flex-col fixed top-0 left-0 bottom-0 z-40 glass-panel border-r border-white/10 select-none"
    >
      {/* App Logo */}
      <div className="flex items-center justify-between p-6 border-b border-white/5">
        {!isCollapsed && (
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-300 bg-clip-text text-transparent tracking-tight">
              NoteNinja
            </span>
          </Link>
        )}
        {isCollapsed && (
          <Link to="/dashboard" className="mx-auto">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
          </Link>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname.startsWith(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-xl font-medium transition-all duration-200 ${
                isActive 
                  ? 'bg-gradient-to-r from-purple-600/80 to-pink-600/80 text-white shadow-lg shadow-purple-500/20 border border-purple-500/30' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </div>

      {/* Storage Usage Widget */}
      {!isCollapsed && (
        <div className="p-4 mx-4 mb-4 rounded-2xl bg-gradient-to-b from-white/5 to-white/[0.02] border border-white/5 space-y-3">
          <div className="flex items-center justify-between text-xs text-gray-400 font-medium">
            <span className="flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5 text-purple-400" />
              Storage Used
            </span>
            <span>{storagePercentage}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
              style={{ width: `${storagePercentage}%` }}
            />
          </div>
          <div className="text-[11px] text-gray-500 flex justify-between">
            <span>{formatBytes(storageStats)}</span>
            <span>500 MB</span>
          </div>
        </div>
      )}

      {/* User Profile & Logout */}
      <div className="p-4 border-t border-white/5 flex items-center justify-between gap-3 bg-white/[0.02]">
        {!isCollapsed && (
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center font-bold text-purple-300">
              {user?.username?.charAt(0)?.toUpperCase() || 'N'}
            </div>
            <div className="overflow-hidden">
              <h4 className="text-sm font-semibold text-white truncate">{user?.username || 'Student'}</h4>
              <p className="text-xs text-gray-400 truncate">{user?.email || 'student@noteninja.com'}</p>
            </div>
          </div>
        )}
        <button 
          onClick={handleLogout}
          title="Logout"
          className={`p-2.5 rounded-xl text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors ${isCollapsed ? 'mx-auto' : ''}`}
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
