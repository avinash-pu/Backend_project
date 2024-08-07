const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller'); // Adjust path if necessary
const upload = require('../middleware/multer.middleware'); // Adjust path if necessary
const { verifyJWT } = require('../middleware/auth_middleware'); // Adjust path if necessary

// Handle file uploads and user registration
router.post('/register',
    upload.fields([
        { name: 'avatar', maxCount: 1 },
        { name: 'coverImage', maxCount: 1 }
    ]),
    userController.registerUser
);

// Login route
router.post('/login', userController.loginUser);



module.exports = router;
