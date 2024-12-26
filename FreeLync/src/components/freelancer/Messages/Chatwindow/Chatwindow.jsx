import React, { useState, useEffect } from "react";
import "./Chatwindow.css"
import SideNav from "../../SideNav/SideNav";

export default function ChatWindow({ chatId, userId }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    useEffect(() => {
        const fetchChat = async () => {
            try {
                const response = await fetch(`http://localhost:3000/chat/${chatId}`);
                const data = await response.json();
                setMessages(data.messages);
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
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ senderId: userId, text: newMessage })
            });
            const updatedChat = await response.json();
            setMessages(updatedChat.messages);
            setNewMessage("");
        } catch (error) {
            console.error("Error sending message", error);
        }
    };

    return (
        <>

        <div style={{display: "flex"}}>
            
            <SideNav/>

            <div className="chat-window">

                <div className="messages">
                    {Array.isArray(messages) && messages.length > 0 ? (
                    messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`message ${
                                msg.sender._id === userId ? "sent" : "received"
                            }`}
                        >
                            <span>{msg.text}</span>
                            <small>{msg.sender.firstname}</small>
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
        

        </>
    );
    
}
