const express = require('express');
const router = express.Router();
const multer = require('multer');
const { 
  uploadEngineeringNote, 
  getEngineeringNotes, 
  getEngineeringNote, 
  downloadEngineeringNote, 
  deleteEngineeringNote 
} = require('../controllers/engineeringNoteController');
const auth = require('../middleware/auth');

const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// GET /api/engineering-notes
router.get('/', auth, getEngineeringNotes);

// POST /api/engineering-notes/upload (must be before /:id)
router.post('/upload', auth, upload.single('file'), uploadEngineeringNote);

// GET /api/engineering-notes/download/:id (must be before /:id)
router.get('/download/:id', auth, downloadEngineeringNote);

// GET /api/engineering-notes/:id
router.get('/:id', auth, getEngineeringNote);

// DELETE /api/engineering-notes/:id
router.delete('/:id', auth, deleteEngineeringNote);

module.exports = router;
