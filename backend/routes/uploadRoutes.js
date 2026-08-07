const express = require('express');
const router = express.Router();
const { upload } = require('../middleware/uploadMiddleware');
const { uploadSingleFile, uploadBatchFiles } = require('../controllers/uploadController');

// POST single image/pdf file
router.post('/image', upload.single('file'), uploadSingleFile);

// POST batch image files
router.post('/batch', upload.array('files', 10), uploadBatchFiles);

module.exports = router;
