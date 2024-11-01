const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/user.js");
const cors = require("cors");

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
        const newUser = new User({firstname,lastname,email,address,password,usertype});
        await newUser.save();
        res.status(201).json({message: "User registered successfully"});
    }
    catch(err){
        console.error("Error registering user",err);
        res.status(500).json({error: "Server error"});
    }
})

// app.get("/",(req,res)=>{
//     res.send("Hello");
// })

app.listen(port,()=>{
    console.log(`Server started on ${port}`);
})