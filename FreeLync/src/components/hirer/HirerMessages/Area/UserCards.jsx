import React from "react";
import { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UserCards(){
    const [profilePhoto,setProfilePhoto] = useState("/images/profileempty.png");
    const [userData,setUserData] = useState([]);
    const navigate = useNavigate();
    // const [currentChat, setCurrentChat] = useState(null);
    const token = localStorage.getItem("token");
    const userId = JSON.parse(atob(token.split('.')[1])).id;

    useEffect(() => {
        const fetchUsers = async () => {
            try{
                const response = await fetch(`http://localhost:3000/getusers/${userId}`);
                const data = await response.json();
                setUserData(data);
            }
            catch(error){
                console.error("Error fetching users",error);
            }
            
        };
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
                    }
                } else {
                    console.error("Failed to fetch user profile");
                }
            } catch (error) {
                console.error("Error fetching user profile:", error);
            }
        };
    
        fetchUsers();
        fetchUserProfile();
    }, [userId]);

    const openChat = async (receiverId) => {
        try {
            const response = await fetch(`http://localhost:3000/getchats/${userId}/${receiverId}`);
            const chat = await response.json();
            console.log(chat);
            navigate(`/hirer-chatwindow`, { state: { chatId: chat._id, userId: userId } });
        } catch (error) {
            console.error("Error opening chat", error);
        }
    };
    
    return (
        <>
            <div className="user-cards">
                    {userData.map((user) => (
                        <div key={user._id} className="user-card">
                            <div className="profile-photo-msg" style={{ backgroundImage: `url(${profilePhoto})` }}>

                            </div>
                            <div className="card-head">
                                {user.firstname} {user.lastname}
                            </div>
                            <p>{user.usertype}</p>
                            <button onClick={() => openChat(user._id)}>
                                Message 
                            </button> 
                        </div>
                    ))
                // )}
                }
            </div>
        </>
    )
}