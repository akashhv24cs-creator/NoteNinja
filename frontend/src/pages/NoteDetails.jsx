import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Eye, Calendar, User, FileText, Book, Tag, Hash, Building2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import Sidebar from '../components/Sidebar';

const NoteDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchNoteDetails = async () => {
      try {
        const res = await api.get(`/engineering-notes/${id}`);
        setNote(res.data.note);
      } catch (error) {
        console.error('Error fetching note details:', error);
        toast.error('Note not found or deleted');
        navigate('/explore');
      } finally {
        setLoading(false);
      }
    };

    fetchNoteDetails();
  }, [id, navigate]);

  const handleDownload = async () => {
    try {
      const response = await api.get(`/engineering-notes/download/${note._id}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', note.originalName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      setNote(prev => ({ ...prev, downloads: prev.downloads + 1 }));
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download file');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this note? This cannot be undone.')) {
      try {
        await api.delete(`/engineering-notes/${note._id}`);
        toast.success('Note deleted successfully');
        navigate('/explore');
      } catch (error) {
        console.error('Error deleting note:', error);
        toast.error('Failed to delete note');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#0b0f19]">
        <Sidebar />
        <main className="flex-1 md:ml-[280px] p-6 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </main>
      </div>
    );
  }

  if (!note) return null;

  return (
    <div className="flex min-h-screen bg-[#0b0f19]">
      <Sidebar />
      <main className="flex-1 md:ml-[280px] p-6 lg:p-10">
        
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Notes</span>
        </button>

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Metadata & Details */}
            <div className="lg:col-span-1 space-y-6">
              
              <div className="glass-panel rounded-3xl p-6 border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-3xl rounded-full pointer-events-none" />
                
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white leading-tight">Details</h2>
                    <p className="text-xs text-gray-400">{(note.fileSize / (1024 * 1024)).toFixed(2)} MB • PDF</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400 flex items-center gap-2"><Building2 className="w-4 h-4" /> Branch</span>
                    <span className="text-white font-medium bg-white/5 px-2 py-1 rounded">{note.branch}</span>
                  </div>
                  {note.semester && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400 flex items-center gap-2"><Hash className="w-4 h-4" /> Semester</span>
                      <span className="text-white font-medium bg-white/5 px-2 py-1 rounded">{note.semester}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400 flex items-center gap-2"><Book className="w-4 h-4" /> Subject</span>
                    <span className="text-white font-medium truncate max-w-[120px]" title={note.subject}>{note.subject}</span>
                  </div>
                  {note.moduleNumber && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400 flex items-center gap-2"><Book className="w-4 h-4" /> Module</span>
                      <span className="text-white font-medium">Module {note.moduleNumber}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400 flex items-center gap-2"><Calendar className="w-4 h-4" /> Uploaded</span>
                    <span className="text-white font-medium">{new Date(note.uploadDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400 flex items-center gap-2"><User className="w-4 h-4" /> By</span>
                    <span className="text-white font-medium">{note.userId?.name || 'Student'}</span>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 flex gap-4">
                  <div className="flex-1 flex flex-col items-center justify-center bg-white/5 rounded-xl py-3 border border-white/5">
                    <Eye className="w-5 h-5 text-gray-400 mb-1" />
                    <span className="text-white font-bold">{note.views || 0}</span>
                    <span className="text-xs text-gray-500">Views</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center justify-center bg-white/5 rounded-xl py-3 border border-white/5">
                    <Download className="w-5 h-5 text-gray-400 mb-1" />
                    <span className="text-white font-bold">{note.downloads || 0}</span>
                    <span className="text-xs text-gray-500">Downloads</span>
                  </div>
                </div>
              </div>

              {note.tags && note.tags.length > 0 && (
                <div className="glass-panel rounded-3xl p-6 border border-white/10">
                  <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-purple-400" /> Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {note.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-purple-500/10 text-purple-300 rounded-full text-sm border border-purple-500/20">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Right Column: Title, Description & Actions */}
            <div className="lg:col-span-2 space-y-6">
              
              <div className="glass-panel rounded-3xl p-8 border border-white/10">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-4 leading-tight">{note.title}</h1>
                    <p className="text-gray-300 leading-relaxed text-lg">
                      {note.description || "No detailed description provided for this note."}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-white/10">
                  <button 
                    onClick={handleDownload}
                    className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:opacity-90 transition-opacity shadow-lg shadow-purple-600/25 flex items-center gap-3"
                  >
                    <Download className="w-5 h-5" />
                    Download PDF
                  </button>

                  {/* Note Owner Actions */}
                  {note.userId?._id === currentUser.id && (
                    <button 
                      onClick={handleDelete}
                      className="px-6 py-3.5 rounded-xl bg-rose-500/10 text-rose-400 font-medium hover:bg-rose-500/20 transition-colors flex items-center gap-2 border border-rose-500/20"
                    >
                      <Trash2 className="w-5 h-5" />
                      Delete Note
                    </button>
                  )}
                </div>
              </div>

              {/* PDF Preview Placeholder (Actual preview requires PDF.js or similar, so we use a stylized prompt) */}
              <div className="glass-panel rounded-3xl p-8 border border-white/10 text-center flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/10">
                  <FileText className="w-12 h-12 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">PDF Ready to Download</h3>
                <p className="text-gray-400 max-w-md mx-auto mb-8">
                  This document is securely stored in NoteNinja's GridFS vaults. Download it directly to your device to view the complete contents.
                </p>
                <button 
                  onClick={handleDownload}
                  className="px-6 py-2.5 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-colors flex items-center gap-2 border border-white/10"
                >
                  <Download className="w-4 h-4" />
                  Download to View
                </button>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NoteDetails;
