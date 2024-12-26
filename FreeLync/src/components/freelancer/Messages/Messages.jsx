import React from "react";
import SideNav from "../SideNav/SideNav";
import Area from "./Area/Area";

export default function Messages(){
    return(
        <>
            <div style={{display: "flex"}}>
                    <SideNav/>
                    <Area/>
            </div>
        </>
    )
}