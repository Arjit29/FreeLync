import React, { useState } from "react";
import "./Area.css"

export default function Area(){
    const [profilePhoto,setProfilePhoto] = useState("/images/profileempty.png");
    const token = localStorage.getItem("token");
    const userId = JSON.parse(atob(token.split('.')[1])).id;
    console.log(userId);

    const handleFileChange = async(event)=>{
        const file = event.target.files[0];
        
        if(file){
            const formData = new FormData();
            formData.append("profilePhoto",file);

            try{
                const response = await fetch(`http://localhost:3000/upload-profile-photo/${userId}`,{
                    method: "POST",
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
            </div>
        </>
    )
}