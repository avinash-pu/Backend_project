// config/cloudinary.js
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
const fs = require('fs');

// Load environment variables from .env file
dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto"
    });
    
    console.log("File uploaded to Cloudinary:", response.url);
    // Remove the local file after successful upload
    fs.unlinkSync(localFilePath);
    return response;

  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    // Remove the local file in case of an error
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    return null;
  }
}

module.exports = { cloudinary, uploadOnCloudinary };
