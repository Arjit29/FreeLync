import React from "react";
import SideNav from "./SideNav/SideNav.jsx";

export default function Dashboard(){
    return(
        <>
        <div className="dashboard" style={{display: "flex"}}>
            <SideNav/>
        </div>
        </>
    )
}