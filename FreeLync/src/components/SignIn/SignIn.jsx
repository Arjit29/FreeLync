import React, { useState } from "react";
import "./SignIn.css";
import Input from "./Input.jsx";
import { useNavigate } from "react-router-dom";

export default function SignIn(){
    const [formData,setFormData] = useState({
        email: "",
        password: ""
    })
    const [err,setErr] = useState("");
    const [success,setSuccess] = useState("");
    const navigate = useNavigate();
    const handleChange = (field,value)=>{
        setFormData((prevData)=>({...prevData,[field]: value}));
    }
    const handleSubmit = async(e)=>{
        e.preventDefault();
        setErr("");
        setSuccess("");
        try{
            const response = await fetch("http://localhost:3000/signIn",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if(response.ok){
                localStorage.setItem("token",data.token);
                setSuccess(data.message);
                navigate("/dashboard");
            }
            else{
                setErr(data.error);
            }

        }
        catch(err){
            console.log("Error Occured: ",err);
            setErr("Error Signing in user, Please try again");
        }
        console.log(formData);
    }
    return (
        <div className="signInBackground">
            <div className="signInContainer">
                <div className="signInHead">
                    <div className="signInlogoImg">

                    </div>
                    <div className="signInTitle">
                        SignIn
                    </div>
                </div>

                <Input labelName="Email" type="text" placeholder="E.g abc@gmail.com" value={formData.email} onChange={handleChange} />
                <Input labelName="Password" type="password" placeholder="Password" value={formData.password} onChange={handleChange}/>

                <div className="signInButtonContainer">
                    <button className="signInButton" onClick={handleSubmit} style={{height: "2rem", width: "5rem", fontSize: "large",border: "none", borderRadius: "5px"}}>SignIn</button>
                </div>
                
                {err && <p style={{color: "red", display: "flex", justifyContent: "center", alignItems: "center", paddingTop:"1rem"}}>{err}</p>}
                {success && <p style={{color: "green", display: "flex", justifyContent: "center", alignItems: "center", paddingTop:"1rem"}}>{success}</p>}
            </div>
        </div>
    )
}