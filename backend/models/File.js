const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  fileId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fileType: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  // --- Engineering Notes Metadata ---
  title: { type: String, trim: true },
  description: { type: String, trim: true },
  branch: { type: String, trim: true },
  semester: { type: Number },
  subject: { type: String, trim: true },
  moduleNumber: { type: Number },
  tags: [{ type: String, trim: true }],
  downloads: { type: Number, default: 0 },
  views: { type: Number, default: 0 }
});

// Text index for fast searching
fileSchema.index({ title: 'text', subject: 'text', tags: 'text', branch: 'text' });

module.exports = mongoose.model('File', fileSchema);
