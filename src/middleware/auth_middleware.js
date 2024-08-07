const jwt = require('jsonwebtoken');
const User = require('../models/user.model'); // Adjust path as necessary
const ApiError = require('../utils/ApiError'); // Adjust path as necessary
const asyncHandler = require('../utils/asyncHandler'); // Adjust path as necessary

const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        // Retrieve token from cookies or headers
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        // Check if token exists
        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }

        // Verify the token
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // Find user associated with the token
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        // Check if user exists
        if (!user) {
            throw new ApiError(401, "Invalid Access Token");
        }

        // Attach user to request object
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token");
    }
});

module.exports = { verifyJWT };
