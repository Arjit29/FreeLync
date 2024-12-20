const mongoose = require('mongoose');
const User = require("./user")

const ProjectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId, ref: "User"
    },
    acceptedBy: {
        type: mongoose.Schema.Types.ObjectId, ref: "User"
    },
    status: {
        type: String,
        default: "open"
    }
})

const Project = mongoose.model("Project",ProjectSchema);
module.exports = Project;