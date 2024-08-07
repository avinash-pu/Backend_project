const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller'); // Adjust path if necessary
const upload = require('../middleware/multer.middleware'); // Adjust the path to your upload middleware

router.route('/register').post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    userController.registerUser
);

module.exports = router;
