const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/user.js");
const Project = require("./models/project.js");
const Chat = require("./models/chat.js");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const moment = require("moment");
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

app.post("/create-project",async(req,res)=>{
    const {userId, title, description, price} = req.body;
    try{
        console.log(title);
        console.log(description);
        console.log(price);
        console.log(userId);
        if (!title || !description || !price || !userId) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const user = await User.findById(userId);
        if (!user || user.usertype !== "Want to Hire") {
            return res.status(403).json({ error: "User not authorized to post" });
        }
        const project = new Project({
            title: title,
            description: description,
            price: price,
            postedBy: userId
        })
        await project.save();
        user.projectPosted.push(project._id);
        await user.save();
        res.status(200).json({message: "Project posted successfully",project});
    }
    catch(error){
        res.status(500).json({error: "Server error while posting project"});
    }
})

app.get("/hirer-explore-project/:userId",async(req,res)=>{
    const {userId} = req.params;
    try{
        const project = await Project.find({postedBy: userId}).populate("postedBy","firstname lastname");
        res.status(200).json(project);
    }
    catch(error){
        res.status(500).json({error: "Server error in fetching projects"});
    }
})

app.get("/freelancer-explore-project",async(req,res)=>{
    try{
        const project = await Project.find().populate("postedBy","firstname lastname");
        res.status(200).json(project);
    }
    catch(error){
        res.status(500).json({error: "Server error in fetching projects"});
    }
})

app.patch("/freelancer-seize-project/:projectId",async(req,res)=>{
    const {projectId} = req.params;
    const {userId} = req.body;
    try{
        const updateProj = await Project.findByIdAndUpdate(projectId,{
            status: "ongoing",
            acceptedBy: userId
        })
        if(!updateProj){
            return res.status(400).json({error: "Project not updated in Schema"});
        }
        const updateUser = await User.findByIdAndUpdate(userId, {
            $inc: {ongoingProjects: 1},
            $push: { projectAccepted: projectId },
        })
        if(!updateUser){
            return res.status(400).json({error: "User not updated in Schema"});
        }
        res.status(200).json({
            project: updateProj,
            user: {
                ongoingProjects: updateUser.ongoingProjects,
            },
        });
    } 
    catch(error){
        res.status(500).json({error: "Error updating project"});
    }
})

app.patch("/freelancer-complete-project/:projectId", async (req, res) => {
    const { projectId } = req.params;
    const { userId } = req.body;

    console.log("Received Project ID:", projectId);
    console.log("Received User ID:", userId);

    try {
        const project = await Project.findById(projectId);
        if (!project) {
            console.error("Project not found");
            return res.status(404).json({ error: "Project not found" });
        }
        console.log("Found Project:", project);

        const projectPrice = project.price;
        const currentMonth = moment().format("MMMM");
        const updateProj = await Project.findByIdAndUpdate(projectId, {
            status: "completed",
        });
        if (!updateProj) {
            console.error("Failed to update project");
            return res.status(400).json({ error: "Project not updated in Schema" });
        }
        console.log("Updated Project:", updateProj);

        const updateUser = await User.findByIdAndUpdate(userId, {
            $inc: {
                completedProjects: 1,
                [`earningByMonth.${currentMonth}`]: projectPrice,
            },
            $set: {
                [`compByMonth.${currentMonth}`]:
                    ((await User.findById(userId)).compByMonth?.[currentMonth] || 0) + 1,
            },
        });
        if (!updateUser) {
            console.error("Failed to update user");
            return res.status(400).json({ error: "User not updated in Schema" });
        }
        console.log("Updated User:", updateUser);

        res.status(200).json({
            project: updateProj,
            user: {
                completedProjects: updateUser.completedProjects,
                earningByMonth: updateUser.earningByMonth,
                compByMonth: updateUser.compByMonth,
            },
        });
    } catch (error) {
        console.error("Error in server:", error); // Log the actual error
        res.status(500).json({ error: "Error updating project" });
    }
});

app.get("/getusers/:userId",async(req,res)=>{
    const {userId} = req.params;
    try{
        const users = await User.find({_id:{$ne: userId}},"_id firstname lastname usertype");
        res.status(200).json(users);
    }
    catch(error){
        res.status(500).json({error: 'Server Error fetching users'});
    }
})

app.get("/getchats/:userId/:receiverId",async(req,res)=>{
    const {userId,receiverId} = req.params;
    try{
        const chat = await Chat.findOne({
            participants: {$all: [userId,receiverId]}
        }).populate("messages.sender","firstname lastname");
    
        if(!chat){
            chat = new Chat({
                paricipants: [userId,receiverId],
                messages: []
            });
            await chat.save();
        }
        res.status(200).json(chat);
    }
    catch(error){
        res.status(500).json({error: "Error fetching Chat"});
    }

})

app.get("/chat/:chatId",async(req,res)=>{
    const {chatId} = req.params;
    try{
        const chat = await Chat.findById(chatId).populate("messages.sender","firstname lastname");
        if(!chat){
            return res.status(404).json({error: "Chat not found"});
        }
        res.status(200).json(chat);
    } catch (error) {
        res.status(500).json({ error: "Error fetching chat" });
    }
})

app.post("/chat/:chatId/message", async (req, res) => {
    const { chatId } = req.params;
    const { senderId, text } = req.body;

    try {
        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({ error: "Chat not found" });
        }

        chat.messages.push({ sender: senderId, text });
        await chat.save();

        res.status(200).json(chat);
    } catch (error) {
        res.status(500).json({ error: "Error sending message" });
    }
});



// app.get("/",(req,res)=>{
//     res.send("Hello");
// })

app.listen(port,()=>{
    console.log(`Server started on ${port}`);
})