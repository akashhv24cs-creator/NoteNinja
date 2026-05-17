import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, UploadCloud, FolderOpen } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import FileCard from '../components/FileCard';
import UploadModal from '../components/UploadModal';
import LoadingSkeleton from '../components/LoadingSkeleton';
import toast from 'react-hot-toast';
import api from '../services/api';

const Files = () => {
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchFiles();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchFiles = async () => {
    setIsLoading(true);
    try {
      let url = '/files?';
      if (searchQuery) url += `search=${encodeURIComponent(searchQuery)}&`;
      
      const res = await api.get(url);
      setFiles(res.data.files);
    } catch (error) {
      toast.error('Failed to load files');
    } finally {
      setIsLoading(false);
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
      fetchFiles();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload file');
    }
  };

  const handleDeleteFile = async (id) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return;
    try {
      await api.delete(`/files/${id}`);
      toast.success('File deleted!');
      fetchFiles();
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
      
      <main className="flex-1 md:ml-[280px] p-6 lg:p-10">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-pink-500/20 text-pink-400">
                <FolderOpen className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Documents & PDFs</h1>
                <p className="text-gray-400 mt-1">Your cloud storage for study materials.</p>
              </div>
            </div>
            
            <button 
              onClick={() => setIsUploadModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:opacity-90 shadow-lg shadow-purple-600/25 flex items-center justify-center gap-2"
            >
              <UploadCloud className="w-5 h-5" />
              Upload File
            </button>
          </header>

          <div className="glass-panel border-white/10 rounded-2xl p-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border-transparent focus:bg-white/10 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all text-white placeholder-gray-500"
                placeholder="Search files by name..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {isLoading ? (
              <LoadingSkeleton type="file" count={8} />
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
              <div className="col-span-full glass-card border-dashed border-white/20 rounded-2xl p-16 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 text-gray-400">
                  <FolderOpen className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No files found</h3>
                <p className="text-gray-400 max-w-sm mb-6">
                  {searchQuery 
                    ? "Try adjusting your search query."
                    : "You haven't uploaded any documents yet. Keep your study materials safe in the cloud."}
                </p>
                {!searchQuery && (
                  <button 
                    onClick={() => setIsUploadModalOpen(true)}
                    className="px-6 py-3 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-colors flex items-center gap-2"
                  >
                    <UploadCloud className="w-5 h-5" />
                    Upload First File
                  </button>
                )}
              </div>
            )}
          </div>

        </div>
      </main>

      <UploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)} 
        onUpload={handleUploadFile} 
      />
    </div>
  );
};

export default Files;
