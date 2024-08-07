// config/multer.middleware.js
const multer = require('multer');
const path = require('path');

// Configure storage for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'publice/temp');
  },
  filename: function (req, file, cb) {
    cb(null,file.originalname)

  }
    
  
});
exportconst upload=multer({
    storage,
})


module.exports = upload;
