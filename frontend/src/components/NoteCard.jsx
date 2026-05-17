import React from 'react';
import { motion } from 'framer-motion';
import { Edit2, Trash2, Tag, Calendar, Folder } from 'lucide-react';

const NoteCard = ({ note, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getCategoryColor = (cat) => {
    switch(cat) {
      case 'Study': return 'from-blue-500/20 to-cyan-500/20 text-blue-300 border-blue-500/30';
      case 'Personal': return 'from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/30';
      case 'Work': return 'from-amber-500/20 to-orange-500/20 text-amber-300 border-amber-500/30';
      case 'Ideas': return 'from-emerald-500/20 to-teal-500/20 text-emerald-300 border-emerald-500/30';
      default: return 'from-gray-500/20 to-slate-500/20 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="glass-card rounded-2xl p-6 flex flex-col justify-between group relative overflow-hidden h-[280px]"
    >
      {/* Top Bar: Category & Actions */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r border ${getCategoryColor(note.category)} flex items-center gap-1.5`}>
            <Folder className="w-3.5 h-3.5" />
            {note.category}
          </span>
          <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={() => onEdit(note)} 
              title="Edit Note"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button 
              onClick={() => onDelete(note._id)} 
              title="Delete Note"
              className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-gray-300 hover:text-rose-400 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-purple-300 transition-colors">
          {note.title}
        </h3>

        {/* Content Snippet */}
        <p className="text-gray-400 text-sm line-clamp-4 leading-relaxed">
          {note.content}
        </p>
      </div>

      {/* Bottom Bar: Tags & Date */}
      <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-2 mt-4">
        <div className="flex items-center gap-1.5 overflow-hidden">
          {note.tags && note.tags.length > 0 ? (
            note.tags.slice(0, 2).map((tag, idx) => (
              <span key={idx} className="px-2.5 py-1 rounded-lg bg-white/5 text-[11px] text-gray-300 font-medium flex items-center gap-1 truncate max-w-[80px]">
                <Tag className="w-3 h-3 text-purple-400 flex-shrink-0" />
                <span className="truncate">{tag}</span>
              </span>
            ))
          ) : (
            <span className="text-xs text-gray-500 italic">No tags</span>
          )}
          {note.tags && note.tags.length > 2 && (
            <span className="text-[11px] text-gray-400 font-medium">+{note.tags.length - 2}</span>
          )}
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500 flex-shrink-0">
          <Calendar className="w-3.5 h-3.5" />
          <span>{formatDate(note.createdAt)}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default NoteCard;
