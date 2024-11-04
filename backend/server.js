const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/user.js");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const port = 3000;
main().then((res)=>{
    console.log("Connected to DB.");
})
.catch(err =>{
    console.log(err);
})

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/freelync");
}

app.post("/register",async (req,res)=>{
    const {firstname,lastname,email,address,password,usertype} = req.body;
    try{
        const checkUser = await User.findOne({email});
        if(checkUser){
            return res.status(400).json({error: "User already exist"});
        }
        const newUser = new User({firstname,lastname,email,address,password,usertype});
        await newUser.save();
        res.status(201).json({message: "User registered successfully"});
    }
    catch(err){
        console.error("Error registering user",err);
        res.status(500).json({error: "Server error"});
    }
})

app.post("/signIn",async(req,res)=>{
    const {email,password} = req.body;
    try{
        const checkUser = await User.findOne({email});
        if(!checkUser){
            res.status(401).json({error: "Incorrect email"});
        }
        const checkMatch = await bcrypt.compare(password,checkUser.password);
        if(!checkMatch){
            res.status(401).json({error: "Incorrect password"});
        }
        const token = jwt.sign(
            {id: checkUser._id, email: checkUser.email},
            process.env.JWT_SECRET,
            {expiresIn: "1hr"}
        )
        res.status(200).json({message: "Successfull",token});
    }
    catch(err){
        console.error("Error:",err);
        res.status(500).json({error: "Server error"});
    }
    

})

// app.get("/",(req,res)=>{
//     res.send("Hello");
// })

app.listen(port,()=>{
    console.log(`Server started on ${port}`);
})