import React,{useState} from "react";
import './Register.css';
import InputBox from "./InputBox.jsx";
import Select from "./Select.jsx";

export default function Register(){
    const [formData,setFormData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        address: "",
        password: "",
        confirmpassword: "",
        usertype: "FreeLancer"
    })
    const [err,setErr] = useState("");
    const [success,setSuccess] = useState("");
    const handleChange= (field,value)=>{
        setFormData((prevData)=>({...prevData,[field]:value}))
    }
    
    const handleSubmit = async()=>{
        setErr("");
        setSuccess("");
        if(formData.password !== formData.confirmpassword ){
            setErr("Password not matched to confirm");
            return ;
        }
        try{
            const response = await fetch("http://localhost:3000/register",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if(response.ok){
                setSuccess(data.message);
            }
            else{
                setErr(data.error);
            }
        }
        catch(err){
            console.error("Error: ",err);
            setErr("Error registering user, Please try again");
        }
        console.log("Form submitted: ",formData);
    }
    return(
        <div className="registerContainer">
            <div className="logoImg">

            </div>
            <div className="registerForm">
                <h1 className="registerText">Create An Account</h1>

                <InputBox formData={formData} onChange={handleChange}/>
                <Select label="Account Type" options={["FreeLancer","Want to Hire"]} value={formData.usertype} onChange={(e)=>handleChange("usertype",e.target.value)}/>

                <div className="registerButtonContainer">
                    <button className="registerButton" onClick={handleSubmit} style={{backgroundColor: "rgb(80,200,120)", height: "2rem", width: "6rem"}}>Register</button>

                </div>

                {err && <p style={{color: "red", display: "flex", justifyContent: "center", alignItems: "center", paddingTop:"1rem"}}>{err}</p>}
                {success && <p style={{color: "green", display: "flex", justifyContent: "center", alignItems: "center", paddingTop:"1rem"}}>{success}</p>}
                
            </div>

            
        </div>
    )
}