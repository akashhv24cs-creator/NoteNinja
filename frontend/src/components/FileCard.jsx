import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Trash2, Calendar, HardDrive, Image as ImageIcon, FileArchive, FileCode2 } from 'lucide-react';
import api from '../services/api';

const FileCard = ({ file, onDelete, onDownload }) => {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type) => {
    if (type.includes('pdf')) return <FileText className="w-8 h-8 text-rose-400" />;
    if (type.includes('image')) return <ImageIcon className="w-8 h-8 text-emerald-400" />;
    if (type.includes('zip') || type.includes('rar')) return <FileArchive className="w-8 h-8 text-amber-400" />;
    if (type.includes('json') || type.includes('javascript') || type.includes('html')) return <FileCode2 className="w-8 h-8 text-blue-400" />;
    return <FileText className="w-8 h-8 text-purple-400" />;
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="glass-card rounded-2xl p-5 flex flex-col justify-between group relative overflow-hidden h-[200px]"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-white/10 transition-colors">
          {getFileIcon(file.fileType)}
        </div>
        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => onDownload(file)} 
            title="Download File"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
          >
            <Download className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onDelete(file.fileId)} 
            title="Delete File"
            className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-gray-300 hover:text-rose-400 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1">
        <h3 className="text-sm font-bold text-white mb-1 line-clamp-2 group-hover:text-purple-300 transition-colors" title={file.originalName}>
          {file.originalName}
        </h3>
      </div>

      <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2 mt-auto">
        <div className="flex items-center gap-1.5 text-xs text-gray-400 bg-white/5 px-2 py-1 rounded-md">
          <HardDrive className="w-3 h-3" />
          <span>{formatBytes(file.fileSize)}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Calendar className="w-3 h-3" />
          <span>{formatDate(file.uploadDate)}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default FileCard;
