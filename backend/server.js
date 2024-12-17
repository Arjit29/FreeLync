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
    console.log(usertype);
    try{
        const checkUser = await User.findOne({email});
        if(checkUser){
            return res.status(400).json({error: "User already exist"});
        }
        const newUser = new User({firstname,lastname,email,address,password,usertype});
        if(newUser){
            await newUser.save();
            const token = jwt.sign(
                {
                id: newUser._id, email: newUser.email,usertype: newUser.usertype
                },
                process.env.JWT_SECRET,
                {expiresIn: "1hr"}
            )
            res.status(201).json({message: "User registered successfully",token});
        }
        
        
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
            {id: checkUser._id, email: checkUser.email,usertype: checkUser.usertype},
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

app.post("/updateCompletedProj",async(req,res)=>{
    const {userId} = req.body;
    try{
        const user = await User.findById(userId);
        if(!user){
            res.status(404).json({error: "User not found"});
        }
        if(user.ongoingProjects > 0){
            user.ongoingProjects -= 1;
        }
        user.completedProjects += 1;
        await user.save();
        res.status(200).json({
            message: "Updated completedcount successfully",
            completedProjects: user.completedProjects,
            ongoingProjects: user.ongoingProjects
        }) 
    }catch(err){
        console.error("Error updating user");
        res.status(500).json({error: "Backend error in updating user"});
    }
})

app.get("/dashboard-data/:userId", async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({
            completedProjects: user.completedProjects,
            ongoingProjects: user.ongoingProjects
        })
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get("/projects-data/:userId", async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({
            ongoing: user.ongoingProjects,
            completed: user.completedProjects,
            completedByMonth: user.compByMonth || {},
            earnByMonth: user.earningByMonth || {},
            review: user.rev || {}
        });
    } catch (error) {
        console.error("Error fetching projects data:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


// app.get("/",(req,res)=>{
//     res.send("Hello");
// })

app.listen(port,()=>{
    console.log(`Server started on ${port}`);
})