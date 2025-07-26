const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/user.js");
const Project = require("./models/project.js");
const Chat = require("./models/chat.js");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const moment = require("moment");
const {upload} = require("./cloudinary.js");
const http = require("http");
const {Server} = require("socket.io");
const authenticateToken = require('./auth.js');
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());
const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("call_user", ({ to, offer }) => {
        io.to(to).emit("incoming_call", { from: socket.id, offer });
    });

    socket.on("answer_call", ({ to, answer }) => {
        io.to(to).emit("call_answered", { from: socket.id, answer });
    });

    socket.on("ice_candidate", ({ to, candidate }) => {
        io.to(to).emit("ice_candidate", { from: socket.id, candidate });
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
    });
});

// const io = new Server(server, {
//     cors: {
//         origin: "http://localhost:3000", // Allow requests from client
//         methods: ["GET", "POST"],
//     },
// });

// io.on("connection", (socket) => {
//     console.log("A user connected:", socket.id);

//     // Join a chat room (chatId)
//     socket.on("join_chat", (chatId) => {
//         socket.join(chatId);
//         console.log(`User ${socket.id} joined chat ${chatId}`);
//     });

//     // Handle new messages
//     socket.on("send_message", async ({ chatId, senderId, text }) => {
//         const chat = await Chat.findById(chatId);
//         if (chat) {
//             const message = { sender: senderId, text: text, timestamp: new Date() };
//             chat.messages.push(message);
//             await chat.save();

//             const populatedMessage = {
//                 sender: await User.findById(senderId).select("firstname lastname"),
//                 text,
//                 timestamp: message.timestamp,
//             };

//             // Broadcast the message to other users in the chat room
//             io.to(chatId).emit("receive_message", populatedMessage);
//         }
//     });

//     socket.on("disconnect", () => {
//         console.log("A user disconnected:", socket.id);
//     });
// });

const port = process.env.PORT || 3000;

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
        console.log(checkUser.password);
        const checkMatch = await bcrypt.compare(password,checkUser.password);
        console.log("Password Match:", checkMatch);
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

app.post("/updateCompletedProj",authenticateToken,async(req,res)=>{
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

app.get("/dashboard-data/:userId",authenticateToken ,async (req, res) => {
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

app.get("/projects-data/:userId",authenticateToken ,async (req, res) => {
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

app.post("/create-project",authenticateToken,async(req,res)=>{
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
            postedBy: userId,
        })
        await project.save();
        user.projectPosted.push(project._id);
        const updatedUser = await User.findByIdAndUpdate(userId,{
            $inc: {openProjects: 1}
        })
        await updatedUser.save();
        await user.save();
        res.status(200).json({message: "Project posted successfully",project});
    }
    catch(error){
        res.status(500).json({error: "Server error while posting project"});
    }
})

app.get("/hirer-explore-project/:userId",authenticateToken,async(req,res)=>{
    const {userId} = req.params;
    try{
        const project = await Project.find({postedBy: userId}).populate("postedBy","firstname lastname");
        res.status(200).json(project);
    }
    catch(error){
        res.status(500).json({error: "Server error in fetching projects"});
    }
})

app.get("/freelancer-explore-project",authenticateToken,async(req,res)=>{
    try{
        const project = await Project.find().populate("postedBy","firstname lastname");
        res.status(200).json(project);
    }
    catch(error){
        res.status(500).json({error: "Server error in fetching projects"});
    }
})

app.patch("/freelancer-seize-project/:projectId",authenticateToken,async(req,res)=>{
    const {projectId} = req.params;
    const {userId} = req.body;
    try{
        const proj = await Project.findById(projectId);
        const ownerId = proj.postedBy;
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
        const updateOwner = await User.findByIdAndUpdate(ownerId, {
            $inc: { openProjects: -1 , ongoingProjects: 1},
        });
        if (!updateOwner) {
            return res.status(400).json({ error: "Owner not updated in Schema" });
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

app.patch("/freelancer-complete-project/:projectId", authenticateToken,async (req, res) => {
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
        const ownerId = project.postedBy;

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
                ongoingProjects: -1,
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

        const updateOwner = await User.findByIdAndUpdate(ownerId, {
            $inc: { completedProjects: 1 , ongoingProjects: -1, [`expenseByMonth.${currentMonth}`]: projectPrice},
            $set: {
                [`compByMonth.${currentMonth}`]:
                    ((await User.findById(ownerId)).compByMonth?.[currentMonth] || 0) + 1,
            },
        });
        if (!updateOwner) {
            return res.status(400).json({ error: "Owner not updated in Schema" });
        }

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

app.get("/getusers/:userId",authenticateToken,async(req,res)=>{
    const {userId} = req.params;
    try{
        const users = await User.find({_id:{$ne: userId}},"_id firstname lastname usertype intro profileLink");
        res.status(200).json(users);
    }
    catch(error){
        res.status(500).json({error: 'Server Error fetching users'});
    }
})

app.get("/getchats/:userId/:receiverId",authenticateToken,async(req,res)=>{
    const {userId,receiverId} = req.params;
    console.log(receiverId);
    try{
        let chat = await Chat.findOne({
            participants: {$all: [userId,receiverId]}
        }).populate("messages.sender","firstname lastname");
        console.log(chat);
        if(!chat){
            chat = new Chat({
                participants: [userId,receiverId],
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

app.get("/chat/:chatId",authenticateToken,async(req,res)=>{
    const {chatId} = req.params;
    // console.log(chatId);
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

app.post("/chat/:chatId/message",authenticateToken ,async (req, res) => {
    const { chatId } = req.params;
    const { senderId, text } = req.body;

    try {
        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({ error: "Chat not found" });
        }

        chat.messages.push({ sender: senderId, text: text, timestamp: new Date() });
        await chat.save();

        const updatedChat = await Chat.findById(chatId).populate(
            "messages.sender",
            "firstname lastname"
        );

        res.status(200).json(updatedChat);
    } catch (error) {
        res.status(500).json({ error: "Error sending message" });
    }
});

app.get("/hirer-projects-data/:userId",authenticateToken ,async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({
            open: user.openProjects,
            ongoing: user.ongoingProjects,
            completed: user.completedProjects,
            completedByMonth: user.compByMonth || {},
            expenseByMonth: user.expenseByMonth || {},
            review: user.rev || {}
        });
    } catch (error) {
        console.error("Error fetching projects data:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.post("/upload-profile-photo/:userId",authenticateToken,upload.single("profilePhoto"),async(req,res)=>{
    try{
        const {userId} = req.params;
        const user = await User.findById(userId);
        console.log(user);
        // console.log("Cloudinary Config:", {
        //     name: process.env.CLOUDINARY_NAME,
        //     apiKey: process.env.CLOUDINARY_API_KEY,
        //     apiSecret: process.env.CLOUDINARY_API_SECRET,
        // });
        if(!user){
            res.status(404).json({error: "User not found"});
        }
        user.profileLink = req.file.path;
        await user.save();
        res.status(200).json({message: "Profile photo updated", profileLink: user.profileLink});
    }
    catch(err){
        res.status(500).json({error: "Error updating profile photo",err});
    }
})

app.get("/get-user-profile/:userId", authenticateToken,async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({ profileLink: user.profileLink, firstName: user.firstname, lastName: user.lastname, intro: user.intro, currentPassword: user.password });
    } catch (error) {
        res.status(500).json({ error: "Error fetching user profile", error });
    }
});

app.put("/update-change/:userId",authenticateToken,async(req,res)=>{
    try{
        const {userId} = req.params;
        const {firstName, lastName, intro, currentPassword, newPassword} = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        user.firstname = firstName || user.firstname;
        user.lastname = lastName || user.lastname;
        user.intro = intro || user.intro;

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Current password is incorrect" });
        }

        user.password = await bcrypt.hash(newPassword, 10);

        await user.save();
        res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error updating user details", error });
    }
})

app.post("/rate-freelancer", authenticateToken,async (req, res) => {
    const { projectId, stars } = req.body;

    try {
        // Find the project by ID
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found." });
        }

        // Check if the project has an accepted freelancer
        const freelancerId = project.acceptedBy;
        if (!freelancerId) {
            return res.status(400).json({ message: "No freelancer assigned to this project." });
        }

        // Find the freelancer by their ID
        const freelancer = await User.findById(freelancerId);
        if (!freelancer) {
            return res.status(404).json({ message: "Freelancer not found." });
        }

        // Update the star ratings in the freelancer's `rev` field
        const currentRating = freelancer.rev.get(`${stars}star`) || 0;
        freelancer.rev.set(`${stars}star`, currentRating + 1);

        await freelancer.save();

        res.status(200).json({ message: "Rating submitted successfully." });
    } catch (error) {
        console.error("Error rating freelancer:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});


// app.get("/",(req,res)=>{
//     res.send("Hello");
// })

app.listen(port,()=>{
    console.log(`Server started on ${port}`);
})