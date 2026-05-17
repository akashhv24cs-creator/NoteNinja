import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, UploadCloud, BookOpen, FileText, ArrowRight, Activity } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import NoteCard from '../components/NoteCard';
import FileCard from '../components/FileCard';
import NoteModal from '../components/NoteModal';
import UploadModal from '../components/UploadModal';
import LoadingSkeleton from '../components/LoadingSkeleton';
import toast from 'react-hot-toast';
import api from '../services/api';

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [notesRes, filesRes] = await Promise.all([
        api.get('/notes'),
        api.get('/files')
      ]);
      // Just take the first 3 for dashboard
      setNotes(notesRes.data.notes.slice(0, 3));
      setFiles(filesRes.data.files.slice(0, 3));
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveNote = async (noteData) => {
    try {
      await api.post('/notes', noteData);
      toast.success('Note created successfully!');
      setIsNoteModalOpen(false);
      fetchDashboardData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create note');
    }
  };

  const handleDeleteNote = async (id) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    try {
      await api.delete(`/notes/${id}`);
      toast.success('Note deleted!');
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to delete note');
    }
  };

  const handleUploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      await api.post('/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('File uploaded successfully!');
      setIsUploadModalOpen(false);
      fetchDashboardData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload file');
    }
  };

  const handleDeleteFile = async (id) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return;
    try {
      await api.delete(`/files/${id}`);
      toast.success('File deleted!');
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to delete file');
    }
  };

  const handleDownloadFile = async (file) => {
    try {
      const res = await api.get(`/files/download/${file.fileId}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', file.originalName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast.error('Failed to download file');
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white flex">
      <Sidebar />
      
      <main className="flex-1 md:ml-[280px] p-6 lg:p-10 transition-all duration-300">
        <div className="max-w-6xl mx-auto space-y-10">
          
          {/* Header */}
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back, {user.username}! 👋</h1>
              <p className="text-gray-400">Here's what's happening with your study materials today.</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setIsUploadModalOpen(true)}
                className="px-5 py-2.5 rounded-xl glass-card text-white hover:bg-white/10 transition-colors flex items-center gap-2 font-medium"
              >
                <UploadCloud className="w-5 h-5" />
                Upload
              </button>
              <button 
                onClick={() => setIsNoteModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:opacity-90 shadow-lg shadow-purple-600/25 flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                New Note
              </button>
            </div>
          </header>

          {/* Quick Stats or Welcome Banner */}
          <div className="glass-panel border-white/10 rounded-3xl p-8 relative overflow-hidden flex items-center justify-between">
            <div className="absolute top-[-50%] right-[-10%] w-[50%] h-[200%] bg-gradient-to-l from-purple-600/20 to-transparent blur-[50px] pointer-events-none" />
            <div className="relative z-10 max-w-xl">
              <div className="flex items-center gap-2 text-purple-400 mb-4">
                <Activity className="w-5 h-5" />
                <span className="font-semibold tracking-wide uppercase text-sm">Pro Tip</span>
              </div>
              <h2 className="text-2xl font-bold mb-2 text-white">Organize like a Ninja</h2>
              <p className="text-gray-300 leading-relaxed">
                Use tags to quickly filter your notes. Group related study materials by creating specific categories. 
                Everything is instantly searchable.
              </p>
            </div>
          </div>

          {/* Recent Notes */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold">Recent Notes</h2>
              </div>
              <Link to="/notes" className="text-sm font-medium text-gray-400 hover:text-white flex items-center gap-1 group">
                View all <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                <LoadingSkeleton type="card" count={3} />
              ) : notes.length > 0 ? (
                notes.map(note => (
                  <NoteCard 
                    key={note._id} 
                    note={note} 
                    onEdit={() => {}} // Usually you'd open modal with this data, handled fully in Notes.jsx
                    onDelete={handleDeleteNote} 
                  />
                ))
              ) : (
                <div className="col-span-full glass-card border-dashed border-white/20 rounded-2xl p-10 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 text-gray-400">
                    <BookOpen className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">No notes yet</h3>
                  <p className="text-gray-400 max-w-sm">Start building your knowledge base by creating your first note.</p>
                </div>
              )}
            </div>
          </section>

          {/* Recent Files */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-pink-500/20 text-pink-400">
                  <FileText className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold">Recent Documents</h2>
              </div>
              <Link to="/files" className="text-sm font-medium text-gray-400 hover:text-white flex items-center gap-1 group">
                View all <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                <LoadingSkeleton type="file" count={3} />
              ) : files.length > 0 ? (
                files.map(file => (
                  <FileCard 
                    key={file.fileId} 
                    file={file} 
                    onDelete={handleDeleteFile}
                    onDownload={handleDownloadFile}
                  />
                ))
              ) : (
                <div className="col-span-full glass-card border-dashed border-white/20 rounded-2xl p-10 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 text-gray-400">
                    <UploadCloud className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">No files uploaded</h3>
                  <p className="text-gray-400 max-w-sm">Securely store your PDFs and study materials in the cloud.</p>
                </div>
              )}
            </div>
          </section>

        </div>
      </main>

      <NoteModal 
        isOpen={isNoteModalOpen} 
        onClose={() => setIsNoteModalOpen(false)} 
        onSave={handleSaveNote} 
      />
      <UploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)} 
        onUpload={handleUploadFile} 
      />
    </div>
  );
};

export default Dashboard;
