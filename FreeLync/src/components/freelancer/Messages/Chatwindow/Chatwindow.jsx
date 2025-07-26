import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
// import {io} from "socket.io-client";
import "./Chatwindow.css"
import SideNav from "../../SideNav/SideNav";

// const socket = io("http://localhost:3000");

export default function ChatWindow() {
    const location = useLocation();
    const { chatId, userId } = location.state;
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const token = localStorage.getItem("token");

    useEffect(() => {
        // socket.emit("join_chat", chatId);

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

        // socket.on("receive_message", (message) => {
        //     setMessages((prevMessages) => [...prevMessages, message]);
        // });

        // return () => {
        //     socket.off("receive_message"); // Clean up listener
        //     socket.disconnect(); // Disconnect on component unmount
        // };
    }, [chatId]);

    const sendMessage = async () => {
        if (newMessage.trim() === "") return;

        // socket.emit("send_message", { chatId, senderId: userId, text: newMessage });

        try {
            const response = await fetch(`http://localhost:3000/chat/${chatId}/message`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}` ,
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
