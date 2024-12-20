import React from "react";
import "./SideNav.css"
import SideLink from "./SideLink";
import { Link, useNavigate } from "react-router-dom";

export default function SideNav(){
    const navigate = useNavigate();
    const handleLogOut = ()=>{
        localStorage.removeItem("token");
        navigate("/signIn");
    }
    return (
        <>
        <div className="navcontainer">
            <div className="navLogo">
                <div className="navlogoImg">

                </div>
                <div className="logo-text" style={{marginLeft: "3rem", fontSize: "1.5rem", paddingTop: "1rem"}}>
                    FreeLync
                </div>
            </div>
            <div className="navLinks">
                <Link to="/freelancer-profile" style={{textDecoration: "none"}}> <SideLink linkname="Profile"/> </Link>
                <Link to="/freelancer-dashboard" style={{textDecoration: "none"}}> <SideLink linkname="Dashboard"/> </Link>
                <Link to="/freelancer-explore" style={{textDecoration: "none"}}> <SideLink linkname="Explore"/> </Link>
                <Link to="/freelancer-messages" style={{textDecoration: "none"}}> <SideLink linkname="Messages"/> </Link>
                <Link to="/freelancer-projects" style={{textDecoration: "none"}}> <SideLink linkname="Projects"/> </Link>
                <span onClick={handleLogOut}><SideLink linkname="Logout"/></span>
            </div>
            
        </div>
        </>
    )
}