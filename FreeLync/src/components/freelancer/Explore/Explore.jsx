import {React, useEffect, useState} from "react";
import SideNav from "../SideNav/SideNav";
import "./Explore.css";

export default function Explore(){
    const [projectData,setProjectData] = useState([]);
        useEffect(()=>{
            fetchProjects();
        },[])
        const fetchProjects = async()=>{
            try{
                const response = await fetch("http://localhost:3000/freelancer-explore-project");
                const data = await response.json();
                setProjectData(data);
            }
            catch(err){
                console.error("Error fetching projects",err);
            }
        }
    return (
        <>
            <SideNav/>
            <div className="projectArea">
                        
            
                <div className="ExploreprojectsList">
                    {projectData.map((project) => (
                        <div key={project._id} className="projectCard">
                            <h3 style={{display: "flex", justifyContent: "center", marginBottom: "1.5rem"}}>{project.title}</h3>
                                <p style={{marginBottom: "1.5rem"}}>{project.description}</p>
                                <p style={{marginBottom: "1rem"}}><strong>Price:</strong> {project.price}</p>
                                <p><strong>Posted By:</strong> {project.postedBy?.firstname} {project.postedBy?.lastname}</p>
                                <p className="statusTab">{project.status}</p>
                        </div>
                    ))}
                </div>
            </div>
            
        </>
    )
}