const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller'); // Adjust path if necessary
const upload = require('../middleware/multer.middleware'); // Adjust the path to your upload middleware

// Handle file uploads and user registration
router.post('/register',
    upload.fields([
        { name: 'avatar', maxCount: 1 },
        { name: 'coverImage', maxCount: 1 }
    ]),
    userController.registerUser
);

module.exports = router;
