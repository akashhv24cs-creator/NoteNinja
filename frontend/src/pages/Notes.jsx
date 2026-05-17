import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, BookOpen, Filter } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import NoteCard from '../components/NoteCard';
import NoteModal from '../components/NoteModal';
import LoadingSkeleton from '../components/LoadingSkeleton';
import toast from 'react-hot-toast';
import api from '../services/api';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'General', 'Study', 'Personal', 'Work', 'Ideas'];

  useEffect(() => {
    // Implement debounce for search
    const timer = setTimeout(() => {
      fetchNotes();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory]);

  const fetchNotes = async () => {
    setIsLoading(true);
    try {
      let url = '/notes?';
      if (searchQuery) url += `search=${encodeURIComponent(searchQuery)}&`;
      if (selectedCategory !== 'All') url += `category=${encodeURIComponent(selectedCategory)}&`;
      
      const res = await api.get(url);
      setNotes(res.data.notes);
    } catch (error) {
      toast.error('Failed to load notes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveNote = async (noteData) => {
    try {
      if (editingNote) {
        await api.put(`/notes/${editingNote._id}`, noteData);
        toast.success('Note updated!');
      } else {
        await api.post('/notes', noteData);
        toast.success('Note created!');
      }
      setIsModalOpen(false);
      setEditingNote(null);
      fetchNotes();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save note');
    }
  };

  const handleDeleteNote = async (id) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    try {
      await api.delete(`/notes/${id}`);
      toast.success('Note deleted!');
      fetchNotes();
    } catch (error) {
      toast.error('Failed to delete note');
    }
  };

  const openEditModal = (note) => {
    setEditingNote(note);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingNote(null);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white flex">
      <Sidebar />
      
      <main className="flex-1 md:ml-[280px] p-6 lg:p-10">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">My Notes</h1>
                <p className="text-gray-400 mt-1">Manage and organize your knowledge.</p>
              </div>
            </div>
            
            <button 
              onClick={openCreateModal}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:opacity-90 shadow-lg shadow-purple-600/25 flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Note
            </button>
          </header>

          <div className="glass-panel border-white/10 rounded-2xl p-2 flex flex-col md:flex-row gap-2">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border-transparent focus:bg-white/10 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all text-white placeholder-gray-500"
                placeholder="Search notes by title or content..."
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
              <div className="px-3 py-2 text-gray-400 hidden md:flex items-center gap-2">
                <Filter className="w-4 h-4" /> Filter:
              </div>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl whitespace-nowrap text-sm font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-transparent'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {isLoading ? (
              <LoadingSkeleton type="card" count={8} />
            ) : notes.length > 0 ? (
              notes.map(note => (
                <NoteCard 
                  key={note._id} 
                  note={note} 
                  onEdit={openEditModal} 
                  onDelete={handleDeleteNote} 
                />
              ))
            ) : (
              <div className="col-span-full glass-card border-dashed border-white/20 rounded-2xl p-16 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 text-gray-400">
                  <BookOpen className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No notes found</h3>
                <p className="text-gray-400 max-w-sm mb-6">
                  {searchQuery || selectedCategory !== 'All' 
                    ? "Try adjusting your search query or filters."
                    : "You haven't created any notes yet. Click the button below to get started."}
                </p>
                {!(searchQuery || selectedCategory !== 'All') && (
                  <button 
                    onClick={openCreateModal}
                    className="px-6 py-3 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Create First Note
                  </button>
                )}
              </div>
            )}
          </div>

        </div>
      </main>

      <NoteModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setEditingNote(null); }} 
        onSave={handleSaveNote}
        initialData={editingNote}
      />
    </div>
  );
};

export default Notes;
