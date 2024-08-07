const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const { uploadOnCloudinary } = require('../utils/cloudinary'); // Ensure correct import
const User = require('../models/user.model');
const bcrypt = require('bcryptjs'); // Use 'bcryptjs' instead of 'bcrypt' for consistency

const registerUser = asyncHandler(async (req, res) => {
    try {
        const { fullname, email, username, password } = req.body;

        // Check if all required fields are provided
        if ([fullname, email, username, password].some(field => field?.trim() === "")) {
            throw new ApiError(400, "All fields are required");
        }

        // Check if user with email or username already exists
        const existedUser = await User.findOne({
            $or: [{ username }, { email }]
        });

        if (existedUser) {
            throw new ApiError(409, "User with email or username already exists");
        }

        // Handle file uploads
        const avatarLocalPath = req.files?.avatar?.[0]?.path;
        // const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

        if (!avatarLocalPath) {
            throw new ApiError(400, "Avatar file is required");
        }

        // Upload files to Cloudinary
        const avatar = await uploadOnCloudinary(avatarLocalPath);
        // const coverImage = coverImageLocalPath ? await uploadOnCloudinary(coverImageLocalPath) : null;

        if (!avatar) {
            throw new ApiError(400, "Error uploading avatar file");
        }

        // Hash the password before saving the user
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const user = new User({
            fullname,
            avatar: avatar.url,
            // coverImage: coverImage?.url || "",
            username: username.toLowerCase(),
            password: hashedPassword,
            email  // Make sure email is included
        });

        await user.save();

        // Exclude sensitive fields from the response
        const createdUser = await User.findById(user._id).select("-password -refreshToken");

        if (!createdUser) {
            throw new ApiError(500, "Something went wrong registering user");
        }

        return res.status(201).json(
            new ApiResponse(200, createdUser, "User registered successfully")
        );
    } catch (error) {
        console.error("Error in registerUser:", error); // Log the error
        return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message || "Internal Server Error"));
    }
});



module.exports = { registerUser };
