import React from "react";
import "./SideNav.css"
import SideLink from "./SideLink";
import { Link } from "react-router-dom";

export default function SideNav(){
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
                <Link to="/freelancer-profile"> <SideLink linkname="Profile"/> </Link>
                <Link to="/freelancer-dashboard"> <SideLink linkname="Dashboard"/> </Link>
                <Link to="/freelancer-explore"> <SideLink linkname="Explore"/> </Link>
                <Link to="/freelancer-messages"> <SideLink linkname="Messages"/> </Link>
                <Link to="/freelancer-projects"> <SideLink linkname="Projects"/> </Link>
                <Link to="/freelancer-logout"> <SideLink linkname="Logout"/> </Link>
            </div>
            
        </div>
        </>
    )
}