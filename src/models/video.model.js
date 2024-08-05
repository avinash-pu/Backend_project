const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-aggregate-paginate-v2');

// Define the Video schema
const videoSchema = new Schema({
    videoFile: {
        type: String,
        required: true, // URL to the video file
    },
    thumbnail: {
        type: String,
        trim: true // URL to the video thumbnail image
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        trim: true
    },
    views: {
        type: Number, // Changed from String to Number
        default: 0
    },
    isPublished: { // Fixed typo in field name
        type: Boolean,
        default: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

// Add pagination plugin
videoSchema.plugin(mongoosePaginate);

// Create a model based on the schema
const Video = mongoose.model('Video', videoSchema);

module.exports = Video;
