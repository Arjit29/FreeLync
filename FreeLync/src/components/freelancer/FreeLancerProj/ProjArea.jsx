import React from "react";
import "./ProjArea.css";
import { useEffect,useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

export default function ProjArea() {
    
    const [ongoingProject,setOngoingProject] = useState([]);
    const [completedProject,setCompletedProject] = useState([]);
    const token = localStorage.getItem("token");
    const userId = JSON.parse(atob(token.split('.')[1])).id;
    
    useEffect(()=>{
        fetchOngoingProjects();
        fetchCompletedProjects();
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
    const fetchCompletedProjects = async()=>{
        try{
            const response = await fetch("http://localhost:3000/freelancer-explore-project");
            const data = await response.json();
            const completed = data.filter(project => project.status === "completed" && project.acceptedBy === userId);
            setCompletedProject(completed);
        }
        catch(err){
            console.error("Error fetching projects",err);
        }
    };
    const completeProject = async (projectId) => {
        console.log("Completing project with ID:", projectId);
        try {
            const response = await fetch(`http://localhost:3000/freelancer-complete-project/${projectId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId }),
            });
            if (response.ok) {
                fetchOngoingProjects();
                fetchCompletedProjects(); 
            } else {
                console.error("Failed to mark project completed");
                }
            } catch (err) {
                console.error("Error marking project completed", err);
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
            <h3 style={{marginTop: "2rem"}}>Ongoing</h3>
            <div className="projtype">
                
                {ongoingProject.length > 0 ? (
                    ongoingProject.map((project) => (
                        <div key={project._id} className="ongoingprojectCard">
                            <button onClick={()=>{completeProject(project._id)}}><FontAwesomeIcon icon={faCheckCircle} className="check-icon" /></button>
                            <h3 style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem", marginTop: "1rem"}}>{project.title}</h3>
                            <p style={{ marginBottom: "1.5rem" }}>{project.description}</p>
                            <p style={{ marginBottom: "1rem" }}><strong>WorkPay:</strong> {project.price}</p>
                            <p className="statusTab">{project.status}</p>
                        </div>
                    ))
                ) : (
                    <p style={{marginBottom: "2rem"}}>No projects available</p>
                )}
            </div>
            <h3>Completed</h3>
            <div className="projtype">
                
                {completedProject.length > 0 ? (
                    completedProject.map((project) => (
                        <div key={project._id} className="completedprojectCard">
                            <h3 style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem", marginTop: "1rem"}}>{project.title}</h3>
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
