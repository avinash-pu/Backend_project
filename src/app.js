require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser')


const app = express();

// Middleware
 app.use(cors({
    origin: process.env.CORS_ORIGIN
 }));


 app.use(express.json({limit:"16kb"}));
 app.use(express.unlencoded({extended: true}))
 app.use(express.static("filename"))

app.use(cookieParser())

exports = app