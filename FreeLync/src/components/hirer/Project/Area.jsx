import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Area.css";

export default function Area() {
    const [projectData,setProjectData] = useState([]);
    const token = localStorage.getItem("token");
    const userId = JSON.parse(atob(token.split('.')[1])).id;
    console.log(userId);
    useEffect(()=>{
        fetchProjects();
    },[])
    const fetchProjects = async()=>{
        try{
            const response = await fetch(`http://localhost:3000/hirer-explore-project/${userId}`,
                {headers: {
                        Authorization: `Bearer ${token}` 
                        }
                    }
            );
            const data = await response.json();
            setProjectData(data);
        }
        catch(err){
            console.error("Error fetching projects",err);
        }
    }
    const handleStarClick = async (projectId, stars) => {
        try {
            const response = await fetch(`http://localhost:3000/rate-freelancer`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ projectId, stars }),
            });
            if (response.ok) {
                alert("Rating submitted successfully!");
            } else {
                console.error("Failed to submit rating.");
            }
        } catch (err) {
            console.error("Error submitting rating:", err);
        }
    };
    
    return (
        <div className="projectArea">
            <div className="newproj">
                <Link to="/postnewjob"> <button className="projbtn">Create New Project</button> </Link>
            </div>

            <div className="projectsList">
                {projectData.length > 0 ? (
                    projectData.map((project) => (
                        <div key={project._id} className="projectCard">
                            <h3 style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>{project.title}</h3>
                            <p style={{ marginBottom: "1.5rem" }}>{project.description}</p>
                            <p style={{ marginBottom: "1rem" }}><strong>WorkPay:</strong> {project.price}</p>
                            <p className="statusTab">{project.status}</p>
                            {project.status === "completed" && (
                                <div className="starRating">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <span
                                            key={star}
                                            className="star"
                                            onClick={() => handleStarClick(project._id, star)}
                                        >
                                            ⭐
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p>No projects available</p>
                )}
            </div>

        </div>
    );
}
