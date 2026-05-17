const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadFile, getFiles, downloadFile, deleteFile } = require('../controllers/fileController');
const auth = require('../middleware/auth');

const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

router.use(auth); // Protect all file routes

router.route('/')
  .get(getFiles);

router.post('/upload', upload.single('file'), uploadFile);

router.route('/download/:fileId')
  .get(downloadFile);

router.route('/:fileId')
  .delete(deleteFile);

module.exports = router;
