const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        require: true
    },
    address: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    usertype: {
        type: String,
        enum: ["FreeLancer","Want to Hire"],
        required: true
    }
})

const User = mongoose.model("User",userSchema);
module.exports = User;