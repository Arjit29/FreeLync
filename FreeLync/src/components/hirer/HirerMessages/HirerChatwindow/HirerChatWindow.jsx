import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./Chatwindow.css"
import SideNav from "../../SideNav/SideNav";

export default function HirerChatWindow() {
    const location = useLocation();
    const { chatId, userId } = location.state;
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchChat = async () => {
            try {
                console.log(chatId);
                const response = await fetch(`http://localhost:3000/chat/${chatId}`,
                    {headers: {
                        Authorization: `Bearer ${token}` 
                        }
                    }
                );
                const data = await response.json();
                setMessages(data.messages || []);
            } catch (error) {
                console.error("Error fetching chat", error);
            }
        };

        fetchChat();
    }, [chatId]);

    const sendMessage = async () => {
        if (newMessage.trim() === "") return;

        try {
            const response = await fetch(`http://localhost:3000/chat/${chatId}/message`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"

                },
                body: JSON.stringify({ senderId: userId, text: newMessage })
            });
            const updatedChat = await response.json();
            setMessages(updatedChat.messages || []);
            setNewMessage("");
        } catch (error) {
            console.error("Error sending message", error);
        }
    };

    return (
        <>

        <div style={{display: "flex"}}>
            
            <SideNav/>

                <div className="chat-container">
                    <div className="chat-window">
                        <div className="messages">
                            {messages.length > 0 ? (
                                messages.map((msg, index) => (
                                    <div
                                        key={index}
                                        className={`message ${
                                            msg.sender._id === userId ? "sent" : "received"
                                        }`}
                                    >
                                        <span>{msg.text}</span>
                                        <small>{msg.sender.firstname}</small>
                                        <small className="timestamp">
                                            {new Date(msg.timestamp).toLocaleString()}
                                        </small>
                                    </div>
                                ))
                                ) : (
                                    <p>No messages yet.</p>
                                )}
                        </div>

                        <div className="message-input">
                            <input
                                type="text"
                                placeholder="Type a message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                            />
                            <button onClick={sendMessage}>Send</button>
                        </div>
                    </div>          
                </div>
        </div>
        </>
    );
    
}
