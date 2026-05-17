import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, Loader2, Book, Tag, Hash, Building2, Map, Type } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';
import Sidebar from '../components/Sidebar';

const UploadNote = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    branch: '',
    semester: '',
    subject: '',
    moduleNumber: '',
    tags: ''
  });

  const branches = ['CSE', 'ISE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'AIML'];
  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select a PDF file to upload');
      return;
    }
    
    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are allowed');
      return;
    }

    if (!formData.title || !formData.branch || !formData.semester || !formData.subject) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsUploading(true);
    const data = new FormData();
    data.append('file', file);
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('branch', formData.branch);
    data.append('semester', formData.semester);
    data.append('subject', formData.subject);
    data.append('moduleNumber', formData.moduleNumber);
    
    // Process tags
    const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    data.append('tags', JSON.stringify(tagsArray));

    try {
      await api.post('/engineering-notes/upload', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('Note uploaded successfully!');
      navigate('/explore');
    } catch (error) {
      console.error('Upload Error:', error);
      toast.error(error.response?.data?.message || 'Error uploading note');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 md:ml-[280px] p-6 lg:p-10 transition-all">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Upload Engineering Notes</h1>
            <p className="text-gray-400">Share your class notes and help other students succeed.</p>
          </div>

          <div className="glass-panel rounded-3xl p-6 lg:p-10 border border-white/10">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* File Upload Zone */}
              <div 
                className="w-full h-64 border-2 border-dashed border-purple-500/30 rounded-3xl flex flex-col items-center justify-center bg-purple-500/5 hover:bg-purple-500/10 transition-colors cursor-pointer relative overflow-hidden group"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => document.getElementById('pdf-upload').click()}
              >
                <input 
                  type="file" 
                  id="pdf-upload" 
                  accept="application/pdf" 
                  className="hidden" 
                  onChange={(e) => setFile(e.target.files[0])}
                />
                
                {file ? (
                  <div className="flex flex-col items-center gap-3 z-10">
                    <div className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                      <Book className="w-8 h-8" />
                    </div>
                    <div className="text-center">
                      <p className="text-white font-medium max-w-xs truncate px-4">{file.name}</p>
                      <p className="text-sm text-gray-400">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                    <button 
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setFile(null); }}
                      className="mt-2 px-4 py-1.5 rounded-full bg-rose-500/20 text-rose-400 text-sm hover:bg-rose-500/30 transition-colors"
                    >
                      Remove File
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 z-10">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Upload className="w-8 h-8 text-gray-400 group-hover:text-purple-400 transition-colors" />
                    </div>
                    <div className="text-center">
                      <p className="text-white font-medium">Click to upload or drag and drop</p>
                      <p className="text-sm text-gray-400 mt-1">Only PDF files are supported (Max 50MB)</p>
                    </div>
                  </div>
                )}
                
                {/* Decorative blob */}
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-colors duration-500" />
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-300">Title <span className="text-rose-400">*</span></label>
                  <div className="relative">
                    <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input 
                      type="text" 
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g. Data Structures & Algorithms - Complete Notes"
                      className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Branch <span className="text-rose-400">*</span></label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <select 
                      name="branch"
                      value={formData.branch}
                      onChange={handleChange}
                      className="w-full bg-[#0f1423] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all appearance-none"
                      required
                    >
                      <option value="" disabled>Select Branch</option>
                      {branches.map(branch => (
                        <option key={branch} value={branch}>{branch}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Semester <span className="text-rose-400">*</span></label>
                  <div className="relative">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <select 
                      name="semester"
                      value={formData.semester}
                      onChange={handleChange}
                      className="w-full bg-[#0f1423] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all appearance-none"
                      required
                    >
                      <option value="" disabled>Select Semester</option>
                      {semesters.map(sem => (
                        <option key={sem} value={sem}>Semester {sem}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Subject Name <span className="text-rose-400">*</span></label>
                  <div className="relative">
                    <Book className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input 
                      type="text" 
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="e.g. Operating Systems"
                      className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Module Number</label>
                  <div className="relative">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input 
                      type="number" 
                      name="moduleNumber"
                      value={formData.moduleNumber}
                      onChange={handleChange}
                      min="1" max="10"
                      placeholder="e.g. 1"
                      className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-300">Description</label>
                  <textarea 
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Provide a brief overview of what these notes cover..."
                    rows="3"
                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all resize-none"
                  ></textarea>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-300">Tags (Comma separated)</label>
                  <div className="relative">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input 
                      type="text" 
                      name="tags"
                      value={formData.tags}
                      onChange={handleChange}
                      placeholder="e.g. Arrays, LinkedList, Trees, Hand-written"
                      className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                    />
                  </div>
                </div>

              </div>

              <div className="pt-4 flex justify-end">
                <button 
                  type="submit" 
                  disabled={isUploading}
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:opacity-90 transition-opacity shadow-lg shadow-purple-600/25 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      Publish Notes
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default UploadNote;
