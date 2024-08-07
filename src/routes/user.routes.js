const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller'); // Adjust path if necessary

// Define the route with a leading slash
router.route('/register').post(userController.registerUser);

module.exports = router;
