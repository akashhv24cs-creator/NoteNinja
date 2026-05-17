const mongoose = require('mongoose');
const File = require('../models/File');
const { Readable } = require('stream');

// @desc    Upload an engineering note (PDF + metadata)
// @route   POST /api/engineering-notes/upload
exports.uploadEngineeringNote = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a PDF file' });
    }

    const { title, description, branch, semester, subject, moduleNumber, tags } = req.body;
    
    let parsedTags = [];
    if (tags) {
        try {
            parsedTags = JSON.parse(tags);
        } catch(e) {
            if(typeof tags === 'string') parsedTags = tags.split(',').map(t => t.trim());
        }
    }

    const db = mongoose.connection.db;
    const bucket = new mongoose.mongo.GridFSBucket(db, {
      bucketName: 'uploads'
    });

    const uploadStream = bucket.openUploadStream(req.file.originalname, {
      contentType: req.file.mimetype,
      metadata: { userId: req.user.id }
    });

    const readableStream = Readable.from(req.file.buffer);
    readableStream.pipe(uploadStream);

    uploadStream.on('error', (error) => {
      console.error('GridFS Upload Error:', error);
      return res.status(500).json({ success: false, message: 'Error storing PDF in GridFS' });
    });

    uploadStream.on('finish', async () => {
      try {
        const fileDoc = await File.create({
          filename: req.file.originalname,
          originalName: req.file.originalname,
          fileId: uploadStream.id,
          userId: req.user.id,
          fileType: req.file.mimetype,
          fileSize: req.file.size,
          // Metadata
          title: title || req.file.originalname,
          description,
          branch,
          semester: semester ? Number(semester) : undefined,
          subject,
          moduleNumber: moduleNumber ? Number(moduleNumber) : undefined,
          tags: parsedTags
        });

        res.status(201).json({
          success: true,
          message: 'Engineering note uploaded successfully',
          file: fileDoc
        });
      } catch (err) {
        console.error('File Model Save Error:', err);
        res.status(500).json({ success: false, message: 'Error saving note metadata' });
      }
    });

  } catch (error) {
    console.error('Upload Engineering Note Error:', error);
    res.status(500).json({ success: false, message: 'Server error during upload' });
  }
};

// @desc    Get all engineering notes (with search and filters)
// @route   GET /api/engineering-notes
exports.getEngineeringNotes = async (req, res) => {
  try {
    const { q, branch, semester, subject, sort } = req.query;
    
    let query = { title: { $exists: true } }; // Ensure we only get engineering notes

    // Text search
    if (q) {
      query.$text = { $search: q };
    }

    // Filters
    if (branch) query.branch = { $regex: new RegExp(`^${branch}$`, 'i') };
    if (semester) query.semester = Number(semester);
    if (subject) query.subject = { $regex: new RegExp(subject, 'i') };

    let sortOption = { uploadDate: -1 }; // default recently uploaded
    if (sort === 'downloads') {
      sortOption = { downloads: -1 };
    } else if (q) {
        // if text search, sort by text score optionally, but let's stick to simple date for now unless specified
        sortOption = { score: { $meta: "textScore" } };
    }

    const notes = await File.find(query, q ? { score: { $meta: "textScore" } } : {})
                            .sort(sortOption)
                            .populate('userId', 'name email');

    res.status(200).json({
      success: true,
      count: notes.length,
      notes
    });
  } catch (error) {
    console.error('Get Engineering Notes Error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching notes' });
  }
};

// @desc    Get single note by ID
// @route   GET /api/engineering-notes/:id
exports.getEngineeringNote = async (req, res) => {
  try {
    const note = await File.findById(req.params.id).populate('userId', 'name email');
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    // Increment view count
    note.views += 1;
    await note.save();

    res.status(200).json({ success: true, note });
  } catch (error) {
    console.error('Get Note Error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching note' });
  }
};

// @desc    Download an engineering note PDF
// @route   GET /api/engineering-notes/download/:id
exports.downloadEngineeringNote = async (req, res) => {
  try {
    const note = await File.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    // Increment downloads count
    note.downloads += 1;
    await note.save();

    const db = mongoose.connection.db;
    const bucket = new mongoose.mongo.GridFSBucket(db, {
      bucketName: 'uploads'
    });

    res.set('Content-Type', note.fileType);
    res.set('Content-Disposition', `inline; filename="${note.originalName}"`);

    const downloadStream = bucket.openDownloadStream(new mongoose.Types.ObjectId(note.fileId));

    downloadStream.on('error', (error) => {
      console.error('GridFS Download Stream Error:', error);
      res.status(404).json({ success: false, message: 'Error streaming PDF' });
    });

    downloadStream.pipe(res);
  } catch (error) {
    console.error('Download Engineering Note Error:', error);
    res.status(500).json({ success: false, message: 'Server error during download' });
  }
};

// @desc    Delete an engineering note
// @route   DELETE /api/engineering-notes/:id
exports.deleteEngineeringNote = async (req, res) => {
  try {
    const note = await File.findOne({ _id: req.params.id });
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    // Only allow owner to delete
    if (note.userId.toString() !== req.user.id) {
       return res.status(403).json({ success: false, message: 'Not authorized to delete this note' });
    }

    const db = mongoose.connection.db;
    const bucket = new mongoose.mongo.GridFSBucket(db, {
      bucketName: 'uploads'
    });

    await bucket.delete(new mongoose.Types.ObjectId(note.fileId));
    await File.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: 'Engineering note deleted' });
  } catch (error) {
    console.error('Delete Engineering Note Error:', error);
    res.status(500).json({ success: false, message: 'Server error deleting note' });
  }
};
