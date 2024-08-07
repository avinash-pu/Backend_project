const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const { uploadOnCloudinary } = require('../utils/cloudinary');
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');

// Register User Function
const registerUser = asyncHandler(async (req, res) => {
    try {
        const { fullname, email, username, password } = req.body;

        if ([fullname, email, username, password].some(field => !field.trim())) {
            throw new ApiError(400, "All fields are required");
        }

        const existedUser = await User.findOne({ $or: [{ username }, { email }] });

        if (existedUser) {
            throw new ApiError(409, "User with email or username already exists");
        }

        const avatarLocalPath = req.files?.avatar?.[0]?.path;

        if (!avatarLocalPath) {
            throw new ApiError(400, "Avatar file is required");
        }

        const avatar = await uploadOnCloudinary(avatarLocalPath);

        if (!avatar) {
            throw new ApiError(400, "Error uploading avatar file");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            fullname,
            avatar: avatar.url,
            username: username.toLowerCase(),
            password: hashedPassword,
            email
        });

        await user.save();

        const createdUser = await User.findById(user._id).select("-password -refreshToken");

        if (!createdUser) {
            throw new ApiError(500, "Something went wrong registering user");
        }

        return res.status(201).json(
            new ApiResponse(200, createdUser, "User registered successfully")
        );
    } catch (error) {
        console.error("Error in registerUser:", error);
        return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message || "Internal Server Error"));
    }
});

// Login User Function
const loginUser = asyncHandler(async (req, res) => {
    try {
        const { email, username, password } = req.body;

        if (!email && !username || !password) {
            throw new ApiError(400, "Email/username and password are required");
        }

        const user = await User.findOne({ $or: [{ email }, { username }] });

        if (!user) {
            throw new ApiError(404, "Invalid email or username");
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            throw new ApiError(401, "Invalid email or password");
        }

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save();

        return res.status(200).json(
            new ApiResponse(200, {
                user: {
                    _id: user._id,
                    fullname: user.fullname,
                    email: user.email,
                    avatar: user.avatar,
                    username: user.username
                },
                accessToken,
                refreshToken
            }, "User logged in successfully")
        );
    } catch (error) {
        console.error("Error in loginUser:", error);
        return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message || "Internal Server Error"));
    }
});

// Logout User Function
const logoutUser = asyncHandler(async (req, res) => {
    try {
        await User.findByIdAndUpdate(
            req.user._id,
            { $unset: { refreshToken: 1 } },
            { new: true }
        );

        return res.status(200).clearCookie("accessToken").clearCookie("refreshToken")
            .json(new ApiResponse(200, {}, "User logged out successfully"));
    } catch (error) {
        console.error("Error in logoutUser:", error);
        return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message || "Internal Server Error"));
    }
});

module.exports = { registerUser, loginUser, logoutUser };
