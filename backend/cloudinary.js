const cloudinary = require("cloudinary").v2;
const {CloudinaryStorage} = require("multer-storage-cloudinary");
require("dotenv").config();

cloudinary.config(
    {
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET 
    }
)

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "freelync", 
        allowed_formats: ["jpeg", "png", "jpg"], 
    },
});

console.log("Cloudinary Config:", {
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = require("multer")({ storage });

module.exports = { cloudinary, upload };