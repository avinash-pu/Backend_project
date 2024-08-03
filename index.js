require('dotenv').config(); 
const express = require('express');
c//onst cors = require('cors');
const connectDB = require('./src/db/db');

const app = express();

// Middleware
// app.use(cors());
// app.use(express.json());

connectDB();

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
