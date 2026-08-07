const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const { hasCloudinary } = require('../middleware/uploadMiddleware');

// Configure Cloudinary if environment variables exist
if (hasCloudinary) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

/**
 * Helper to upload buffer to Cloudinary via Base64 Data URI (Guarantees valid SDK signature)
 */
const uploadBufferToCloudinary = async (fileBuffer, mimeType = 'image/jpeg', folder = 'vendorhub_uploads') => {
  const base64Data = fileBuffer.toString('base64');
  const dataUri = `data:${mimeType || 'image/jpeg'};base64,${base64Data}`;
  return await cloudinary.uploader.upload(dataUri, {
    folder: folder,
    resource_type: 'auto'
  });
};

/**
 * @desc    Upload single file (Image or PDF)
 * @route   POST /api/upload/image
 * @access  Public / Authorized
 */
const uploadSingleFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    let fileUrl = '';

    if (hasCloudinary && req.file.buffer) {
      // Upload via Cloudinary Base64 Data URI
      const result = await uploadBufferToCloudinary(req.file.buffer, req.file.mimetype);
      fileUrl = result.secure_url;
    } else {
      // Local Disk Storage URL
      const host = req.get('host');
      const protocol = req.protocol;
      fileUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
    }

    res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      url: fileUrl,
      fileName: req.file.originalname,
      size: req.file.size
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Upload batch of files (Images)
 * @route   POST /api/upload/batch
 * @access  Public / Authorized
 */
const uploadBatchFiles = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }

    const host = req.get('host');
    const protocol = req.protocol;
    const urls = [];

    for (const file of req.files) {
      if (hasCloudinary && file.buffer) {
        const result = await uploadBufferToCloudinary(file.buffer, file.mimetype);
        urls.push(result.secure_url);
      } else {
        urls.push(`${protocol}://${host}/uploads/${file.filename}`);
      }
    }

    res.status(200).json({
      success: true,
      count: urls.length,
      urls: urls
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  uploadSingleFile,
  uploadBatchFiles
};
