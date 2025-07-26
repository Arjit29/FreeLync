import React, { useState, useEffect } from "react";
import "./Area.css"

export default function Area(){
    const [profilePhoto,setProfilePhoto] = useState("/images/profileempty.png");
    const [firstName,setFirstName] = useState("");
    const [lastName,setLastName] = useState("");
    const [intro,setIntro] = useState("");
    const [currentPassword,setCurrentPassword] = useState("");
    const [newPassword,setNewPassword] = useState("");
    const token = localStorage.getItem("token");
    const userId = JSON.parse(atob(token.split('.')[1])).id;
    console.log(userId);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await fetch(`http://localhost:3000/get-user-profile/${userId}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`, 
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    if (data.profileLink) {
                        setProfilePhoto(data.profileLink);
                        setFirstName(data.firstName);
                        setLastName(data.lastName);
                        setIntro(data.intro || "");
                        setCurrentPassword(data.currentPassword);
                    }
                } else {
                    console.error("Failed to fetch user profile");
                }
            } catch (error) {
                console.error("Error fetching user profile:", error);
            }
        };

        fetchUserProfile();
    }, [userId, token]);

    const handleFileChange = async(event)=>{
        const file = event.target.files[0];
        
        if(file){
            const formData = new FormData();
            formData.append("profilePhoto",file);

            try{
                const response = await fetch(`http://localhost:3000/upload-profile-photo/${userId}`,{
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    body: formData
                })
                if(response.ok){
                    const data = await response.json();
                    setProfilePhoto(data.profileLink);
                }
                else{
                    console.error("Failed to update photo");
                }
            }
            catch(error){
                console.error("Error updating",error);
            }
        }
    }

    const handleProfilePhotoClick = () => {
        document.getElementById("profilePhotoInput").click();
    };

    const handleUpdate = async()=>{
        try{
            const response = await fetch(`http://localhost:3000/update-change/${userId}`,{
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ firstName, lastName, intro, currentPassword, newPassword }),
            })
            if(!response.ok){
                console.error("Failed to update changes");
            }
        }
        catch(err){
            console.error("Error updating chnages",err);
        }
    };

    return (
        <>
            <div className="whole-content">
                <div className="top-profile">

                </div>
                <div
                    className="profile-photo"
                    style={{ backgroundImage: `url(${profilePhoto})` }}
                    onClick={handleProfilePhotoClick} 
                >

                    <input type="file" accept="image/*" id="profilePhotoInput" style={{display: "none"}} onChange={handleFileChange} />
                    
                </div>

                <div className="inputform">
                    <div className="contain" style={{display: "flex", flexDirection: "column"}}>
                        <label style={{marginBottom: "0.8rem"}}>First Name</label>
                        <input
                            type="text"
                            placeholder="First Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="update"
                        />
                    </div>

                    <div className="contain" style={{display: "flex", flexDirection: "column"}}>
                        <label style={{marginBottom: "0.8rem"}}>Last Name</label>
                        <input
                            type="text"
                            placeholder="Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="update"
                        />
                    </div>
                </div>

                <div className="inputformintro">
                    <div className="contain" style={{display: "flex", flexDirection: "column"}}>
                        <label style={{marginBottom: "0.8rem"}}>Intro</label>
                            <textarea
                                placeholder="Add an intro"
                                value={intro}
                                onChange={(e) => setIntro(e.target.value)}
                                className="update"
                            />
                    </div>
                </div>

                <div className="inputform" style={{marginBottom: "3rem"}}>
                    <div className="contain" style={{display: "flex", flexDirection: "column"}}>
                        <label style={{marginBottom: "0.8rem"}}>Current Password</label>
                        <input
                            type="password"
                            placeholder="Current Password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="update"
                        />
                    </div>
                    <div className="contain" style={{display: "flex", flexDirection: "column"}}>
                        <label style={{marginBottom: "0.8rem"}}>New Password</label>
                        <input
                            type="password"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="update"
                        />
                    </div>      
                </div>

                <button onClick={handleUpdate} className="updatebtn">Update</button>

                
            </div>
        </>
    )
}