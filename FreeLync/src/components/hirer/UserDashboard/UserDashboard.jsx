import React from "react";
import SideNav from "../SideNav/SideNav";
// import Area from "./Area/Area.jsx";

export default function Dashboard(){
    return(
        <>
        <div className="dashboard" style={{display: "flex"}}>
            <SideNav/>
            {/* <Area/> */}
        </div>
        </>
    )
}