import {React, useEffect, useState} from "react";
import SideNav from "../SideNav/SideNav";
import "./Explore.css";
import PieChart from "../Dashboard/Area/PieChart";
// import ProjArea from "../FreeLancerProj/ProjArea";

export default function Explore(){
    const [projectData,setProjectData] = useState([]);
    // const [ongoingProject,setOngoingProject] = useState([]);
    // const [chartData, setChartData] = useState(null);
    const token = localStorage.getItem("token");
    const userId = JSON.parse(atob(token.split('.')[1])).id;

    useEffect(()=>{
        fetchProjects();
    },[])
    const fetchProjects = async()=>{
        try{
            const response = await fetch("http://localhost:3000/freelancer-explore-project");
            const data = await response.json();
            // const ongoing = data.filter(project => project.status === "ongoing" && project.acceptedBy === userId);
            const explore = data.filter(project => project.status !== "ongoing");
            setProjectData(explore);
            // setOngoingProject(ongoing);
        }
        catch(err){
            console.error("Error fetching projects",err);
        }
    };
    const seizeProject = async (projectId) => {
        try {
            const response = await fetch(`http://localhost:3000/freelancer-seize-project/${projectId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId }),
            });
            if (response.ok) {
                fetchProjects(); 
                // setChartData((prevData) => ({
                //     labels: [`Ongoing: ${data.user.ongoingProjects}`, `Completed: ${prevData?.datasets[0]?.data[1]}`],
                //     datasets: [
                //         {
                //             data: [data.user.ongoingProjects, prevData?.datasets[0]?.data[1]],
                //             backgroundColor: ["#F6A417", "#EB5F1A"],
                //         },
                //     ],
                // }));
                // const seizedProject = projectData.find(project => project._id === projectId);
                // setOngoingProject([...ongoingProject, { ...seizedProject, status: "ongoing" }]);
                // setProjectData(projectData.filter(project => project._id !== projectId));
            } else {
                console.error("Failed to seize project");
            }
        } catch (err) {
            console.error("Error seizing project", err);
        }
    };
    return (
        <>
            <SideNav/>
            <div className="freelancerProjectArea">

                <div className="top-explore">
                    <div className="left-top-explore">
                        <div className="intro-explore">
                        Dive into thrilling projects that blend creativity and innovation! Craft seamless UI/UX designs, build dynamic web and app solutions, or unleash your imagination with cartoon character creation and quirky caricatures. Explore, create, and let your ideas shine!
                        </div>
                    </div>
                    <div className="right-top-explore">

                    </div>
                </div>

                {/* <div className="exploreCartoon">
                    <div className="cart">
                    Explore exciting new projects across diverse domains! Dive into the creative world of UI/UX design, crafting intuitive and engaging user experiences. Build cutting-edge web and app development projects that solve real-world problems. Let your imagination run wild with cartoon character creation and bring ideas to life with caricature artistry. Whether technical or creative, there's a project waiting for you to shine!
                    </div>
                    <div className="cartoonImg">

                    </div>
                </div> */}
                        
            
                <div className="ExploreprojectsList">
                    {projectData.map((project) => (
                        <div key={project._id} className="projectCard" style={{backgroundColor: "white", boxShadow: "8px 8px 5px rgba(0, 0, 0, 0.234)", marginBottom: "2rem", height: "350px"}}>
                            <h3 style={{display: "flex", justifyContent: "center", marginBottom: "1.5rem", color: "#EB4E00"}}>{project.title}</h3>
                                <p style={{marginBottom: "1.5rem"}}>{project.description}</p>
                                <p style={{marginBottom: "1rem"}}><strong>Work Pay:</strong> {project.price}</p>
                                <p><strong>Posted By:</strong> {project.postedBy?.firstname} {project.postedBy?.lastname}</p>
                                <p className="statusTab" style={{marginBottom: "1rem"}}>Status: {project.status}</p>
                                <button className="siezeBtn" onClick={()=>{seizeProject(project._id)}}>Sieze</button>
                        </div>
                    ))}
                </div>
            </div>

            {/* <ProjArea ongoingProjects={ongoingProject} showProjArea={false} /> */}
            
        </>
    )
}