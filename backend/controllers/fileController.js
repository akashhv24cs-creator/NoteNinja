const mongoose = require('mongoose');
const File = require('../models/File');
const { Readable } = require('stream');

// @desc    Upload PDF/Document file to GridFS
// @route   POST /api/files/upload
exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a file' });
    }

    const db = mongoose.connection.db;
    const bucket = new mongoose.mongo.GridFSBucket(db, {
      bucketName: 'uploads'
    });

    const uploadStream = bucket.openUploadStream(req.file.originalname, {
      contentType: req.file.mimetype,
      metadata: { userId: req.user.id }
    });

    const readablePhotoStream = Readable.from(req.file.buffer);
    readablePhotoStream.pipe(uploadStream);

    uploadStream.on('error', (error) => {
      console.error('GridFS Upload Error:', error);
      return res.status(500).json({ success: false, message: 'Error storing file in GridFS' });
    });

    uploadStream.on('finish', async () => {
      try {
        // Save metadata to File collection
        const fileDoc = await File.create({
          filename: req.file.originalname,
          originalName: req.file.originalname,
          fileId: uploadStream.id,
          userId: req.user.id,
          fileType: req.file.mimetype,
          fileSize: req.file.size
        });

        res.status(201).json({
          success: true,
          message: 'File uploaded successfully',
          file: fileDoc
        });
      } catch (err) {
        console.error('File Model Save Error:', err);
        res.status(500).json({ success: false, message: 'Error saving file metadata' });
      }
    });

  } catch (error) {
    console.error('Upload Controller Error:', error);
    res.status(500).json({ success: false, message: 'Server error during upload' });
  }
};

// @desc    Get all files for logged in user (with optional search & storage stats)
// @route   GET /api/files
exports.getFiles = async (req, res) => {
  try {
    const { search } = req.query;
    let query = { userId: req.user.id };

    if (search) {
      query.originalName = { $regex: search, $options: 'i' };
    }

    const files = await File.find(query).sort({ uploadDate: -1 });

    // Calculate total storage used
    const totalStorageBytes = files.reduce((acc, file) => acc + file.fileSize, 0);

    res.status(200).json({
      success: true,
      count: files.length,
      totalStorageBytes,
      files
    });
  } catch (error) {
    console.error('Get Files Error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching files' });
  }
};

// @desc    Download / Preview file from GridFS
// @route   GET /api/files/download/:fileId
exports.downloadFile = async (req, res) => {
  try {
    const fileDoc = await File.findOne({ fileId: req.params.fileId, userId: req.user.id });
    if (!fileDoc) {
      return res.status(404).json({ success: false, message: 'File not found or unauthorized' });
    }

    const db = mongoose.connection.db;
    const bucket = new mongoose.mongo.GridFSBucket(db, {
      bucketName: 'uploads'
    });

    res.set('Content-Type', fileDoc.fileType);
    res.set('Content-Disposition', `inline; filename="${fileDoc.originalName}"`);

    const downloadStream = bucket.openDownloadStream(new mongoose.Types.ObjectId(req.params.fileId));

    downloadStream.on('error', (error) => {
      console.error('GridFS Download Stream Error:', error);
      res.status(404).json({ success: false, message: 'Error streaming file' });
    });

    downloadStream.pipe(res);
  } catch (error) {
    console.error('Download Controller Error:', error);
    res.status(500).json({ success: false, message: 'Server error during download' });
  }
};

// @desc    Delete file from GridFS and File collection
// @route   DELETE /api/files/:fileId
exports.deleteFile = async (req, res) => {
  try {
    const fileDoc = await File.findOneAndDelete({ fileId: req.params.fileId, userId: req.user.id });
    if (!fileDoc) {
      return res.status(404).json({ success: false, message: 'File not found or unauthorized' });
    }

    const db = mongoose.connection.db;
    const bucket = new mongoose.mongo.GridFSBucket(db, {
      bucketName: 'uploads'
    });

    await bucket.delete(new mongoose.Types.ObjectId(req.params.fileId));

    res.status(200).json({ success: true, message: 'File deleted successfully' });
  } catch (error) {
    console.error('Delete File Controller Error:', error);
    res.status(500).json({ success: false, message: 'Server error deleting file' });
  }
};
