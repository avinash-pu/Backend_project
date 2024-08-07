// config/multer.middleware.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Define the upload directory
const uploadDir = 'public/temp';

// Ensure the directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

// Initialize multer with the configured storage
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
  fileFilter: function (req, file, cb) {
    // Optionally filter file types
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']; // Allowed mime types
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'), false);
    }
  }
});

module.exports = upload;
