require('dotenv').config(); 
// const express = require('express');
const connectDB = require('./src/database/db');
const app = require('./src/app');


// const app = express();



connectDB();

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
