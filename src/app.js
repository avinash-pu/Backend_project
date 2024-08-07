require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN
}));

app.use(express.json({ limit: "160kb" }));
app.use(express.urlencoded({ extended: true })); // Fixed typo
app.use(express.static("filename"));

app.use(cookieParser());

// Router

const userRoutes = require('./routes/user.routes');
app.use('/api', userRoutes);

module.exports = app; // Fixed export
