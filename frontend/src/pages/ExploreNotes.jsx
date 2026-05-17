import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Book, Download, Eye, Calendar, User, FileText, Loader2, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Sidebar from '../components/Sidebar';

const ExploreNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filters
  const [branchFilter, setBranchFilter] = useState('');
  const [semFilter, setSemFilter] = useState('');
  const [sortOption, setSortOption] = useState('recent'); // recent, downloads

  const branches = ['CSE', 'ISE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'AIML'];
  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

  const fetchNotes = async () => {
    setLoading(true);
    try {
      let url = `/engineering-notes?sort=${sortOption}`;
      if (searchQuery) url += `&q=${encodeURIComponent(searchQuery)}`;
      if (branchFilter) url += `&branch=${branchFilter}`;
      if (semFilter) url += `&semester=${semFilter}`;

      const res = await api.get(url);
      setNotes(res.data.notes || []);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchNotes();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, branchFilter, semFilter, sortOption]);

  const handleDownload = async (noteId, filename) => {
    try {
      const response = await api.get(`/engineering-notes/download/${noteId}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      // Refresh to update download count locally (optional, but good for UX)
      setNotes(notes.map(n => n._id === noteId ? { ...n, downloads: n.downloads + 1 } : n));
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0b0f19]">
      <Sidebar />
      <main className="flex-1 md:ml-[280px] p-6 lg:p-10 transition-all">
        
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Explore Notes</h1>
            <p className="text-gray-400">Find the best engineering notes shared by your peers.</p>
          </div>
          
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by title, subject, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-gray-500 shadow-inner shadow-black/20"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-300 font-medium">Filters:</span>
          </div>

          <select 
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="bg-[#0f1423] border border-white/10 rounded-xl py-2 px-4 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-all appearance-none cursor-pointer"
          >
            <option value="">All Branches</option>
            {branches.map(b => <option key={b} value={b}>{b}</option>)}
          </select>

          <select 
            value={semFilter}
            onChange={(e) => setSemFilter(e.target.value)}
            className="bg-[#0f1423] border border-white/10 rounded-xl py-2 px-4 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-all appearance-none cursor-pointer"
          >
            <option value="">All Semesters</option>
            {semesters.map(s => <option key={s} value={s}>Semester {s}</option>)}
          </select>

          <select 
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="bg-[#0f1423] border border-white/10 rounded-xl py-2 px-4 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-all appearance-none cursor-pointer ml-auto"
          >
            <option value="recent">Recently Uploaded</option>
            <option value="downloads">Most Downloaded</option>
          </select>
        </div>

        {/* Notes Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-purple-500 animate-spin mb-4" />
            <p className="text-gray-400">Searching notes...</p>
          </div>
        ) : notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center glass-panel rounded-3xl border border-white/5">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
              <BookOpen className="w-10 h-10 text-gray-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No notes found</h3>
            <p className="text-gray-400 max-w-md">We couldn't find any notes matching your search criteria. Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {notes.map((note, index) => (
              <motion.div 
                key={note._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="glass-card rounded-2xl p-6 border border-white/5 flex flex-col group hover:border-purple-500/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-purple-500/20 text-purple-400 text-xs font-bold tracking-wide">
                      {note.branch}
                    </span>
                    {note.semester && (
                      <span className="px-2.5 py-1 rounded-md bg-blue-500/20 text-blue-400 text-xs font-bold tracking-wide">
                        SEM {note.semester}
                      </span>
                    )}
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-purple-500/10 group-hover:text-purple-400 transition-colors">
                    <FileText className="w-5 h-5" />
                  </div>
                </div>

                <Link to={`/note/${note._id}`} className="mb-2 hover:text-purple-400 transition-colors">
                  <h3 className="text-lg font-bold text-white line-clamp-2 leading-tight">
                    {note.title}
                  </h3>
                </Link>

                <p className="text-sm text-gray-400 mb-4 font-medium flex items-center gap-2">
                  <Book className="w-4 h-4" />
                  {note.subject} {note.moduleNumber && <span className="opacity-60">| Mod {note.moduleNumber}</span>}
                </p>

                <p className="text-sm text-gray-500 line-clamp-2 mb-6 flex-1">
                  {note.description || "No description provided."}
                </p>

                <div className="mt-auto">
                  {note.tags && note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {note.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-[10px] px-2 py-1 bg-white/5 text-gray-400 rounded-full border border-white/5">
                          #{tag}
                        </span>
                      ))}
                      {note.tags.length > 3 && (
                        <span className="text-[10px] px-2 py-1 bg-white/5 text-gray-400 rounded-full border border-white/5">
                          +{note.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {note.views || 0}</span>
                      <span className="flex items-center gap-1"><Download className="w-3.5 h-3.5" /> {note.downloads || 0}</span>
                    </div>
                    <button 
                      onClick={(e) => { e.preventDefault(); handleDownload(note._id, note.originalName); }}
                      className="p-2 rounded-lg bg-white/5 text-white hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-purple-500/25"
                      title="Download PDF"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ExploreNotes;
