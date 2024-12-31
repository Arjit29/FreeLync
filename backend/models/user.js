const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
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
    intro: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        require: true,
        unique: true
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
    },
    profileLink: {
        type: String,
        default: "/images/profileempty.png"
    },
    ongoingProjects: {
        type: Number,
        default: 0
    },
    openProjects: {
        type: Number,
        default: 0
    },
    completedProjects: {
        type: Number,
        default: 0
    },
    compByMonth: {
        type: Map,
        of: Number,
        default: {}
    },
    rev: {
        type: Map,
        of: Number,
        default: {}
    },
    earningByMonth: {
        type: Map,
        of: Number,
        default: {}
    },
    expenseByMonth: {
        type: Map,
        of: Number,
        default: {}
    },
    projectPosted: [{
        type: mongoose.Schema.Types.ObjectId, ref: "Project"
    }],
    projectAccepted: [{
        type: mongoose.Schema.Types.ObjectId, ref: "Project"
    }]
})

userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        return next();
    }
    const rounds = 10; // Default bcrypt rounds
    const isHashed = this.password.startsWith("$2b$" + rounds.toString().padStart(2, "0"));
    if (isHashed) {
        return next();
    }
    this.password = await bcrypt.hash(this.password,10);
    next();
})

const User = mongoose.model("User",userSchema);
module.exports = User;