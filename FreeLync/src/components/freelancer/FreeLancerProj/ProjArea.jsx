import React from "react";
import "./ProjArea.css";
import { useEffect,useState } from "react";

export default function ProjArea() {
    
    const [ongoingProject,setOngoingProject] = useState([]);
    const token = localStorage.getItem("token");
    const userId = JSON.parse(atob(token.split('.')[1])).id;
    
    useEffect(()=>{
        fetchOngoingProjects();
    },[])
    const fetchOngoingProjects = async()=>{
        try{
            const response = await fetch("http://localhost:3000/freelancer-explore-project");
            const data = await response.json();
            const ongoing = data.filter(project => project.status === "ongoing" && project.acceptedBy === userId);
            setOngoingProject(ongoing);
        }
        catch(err){
            console.error("Error fetching projects",err);
        }
    };
    return (
        <div className="projarea">
            <div className="projtitle">
                <h2 className="projhead">My Works</h2>
            </div>
            <div className="projsub">
                <p>
                    Take a moment to reflect on the projects you’ve embraced—the passion, effort, and vision you’ve poured into them. Each one is a chance to prove not just your skills but your resilience and determination to make a mark. Let your work tell a story of growth, dedication, and the courage to chase excellence.
                </p>
            </div>
            <div className="projtype">
                <h3>Ongoing</h3>
                {ongoingProject.length > 0 ? (
                    ongoingProject.map((project) => (
                        <div key={project._id} className="ongoingprojectCard">
                            <h3 style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>{project.title}</h3>
                            <p style={{ marginBottom: "1.5rem" }}>{project.description}</p>
                            <p style={{ marginBottom: "1rem" }}><strong>WorkPay:</strong> {project.price}</p>
                            <p className="statusTab">{project.status}</p>
                        </div>
                    ))
                ) : (
                    <p>No projects available</p>
                )}
            </div>
        </div>
    );
}
