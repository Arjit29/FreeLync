import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import Input from "./Input";
import "./Projform.css";

export default function Projform(){
    const [projFormData,setProjFormData] = useState({
        title: "",
        description: "",
        price: "",
    })
    const token = localStorage.getItem("token");
    const userId = JSON.parse(atob(token.split('.')[1])).id;
    const [err,setErr] = useState("");
    const [success,setSuccess] = useState("");
    const navigate = useNavigate();
    const handleChange= (field,value)=>{
        setProjFormData((prevData)=>({...prevData,[field]:value}))
    }
        
    const handleSubmit = async()=>{
        if(!projFormData.title || !projFormData.description || !projFormData.price){
            setErr("Please fill all the fields");
            return;
        }
        setErr("");
        setSuccess("");
        // console.log(title);
        // console.log(description);
        // console.log(price);
        console.log(userId);
        const payload = {
            userId: userId, 
            title: projFormData.title,
            description: projFormData.description,
            price: projFormData.price,
          };
        
        try{
            const response = await fetch("http://localhost:3000/create-project",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify( payload ),
            });
            const data = await response.json();
            console.log(data);
            if(response.ok){
                setSuccess(data.message);
                // fetchProjects();
                console.log("Project-Form submitted: ",projFormData);
                navigate("/hirer-projects");
            }
            else{
                setErr(data.error);
            }
        }
        catch(err){
            console.error("Error: ",err);
            setErr("Error posting job, Please try again");
        }
        
    }
    return (
        <>
            <div className="projForm">
                <div className="projformcontainer">
                    <h1 className="formText">Post new Project</h1>

                    <Input
                    placeholder="Work you want to get done" 
                    labelName="What's your Project is on about??" 
                    type="text" 
                    value={projFormData.title} 
                    onChange={(e)=>handleChange("title",e.target.value)}
                    />

                    <Input
                    placeholder="Description of your job" 
                    labelName="Describe your job to the world!!" 
                    type="text" 
                    value={projFormData.description} 
                    onChange={(e)=>handleChange("description",e.target.value)}
                    />

                    <Input 
                    placeholder="How much you pay" 
                    labelName="Payment/Stipend" 
                    type="number" 
                    value={projFormData.price} 
                    onChange={(e)=>handleChange("price",e.target.value)}
                    />

                    <div className="submitProj">
                        <button className="submitButton" onClick={handleSubmit} style={{backgroundColor: "grey", height: "2rem", width: "6rem"}}>Post your Job</button>

                    </div>

                    {err && <p style={{color: "red", display: "flex", justifyContent: "center", alignItems: "center", paddingTop:"1rem"}}>{err}</p>}
                    {success && <p style={{color: "green", display: "flex", justifyContent: "center", alignItems: "center", paddingTop:"1rem"}}>{success}</p>}
                            
                    
                </div>
            </div>    
        </>
    )
}