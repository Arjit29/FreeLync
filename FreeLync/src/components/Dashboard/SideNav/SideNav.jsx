import React from "react";
import "./SideNav.css"
import SideLink from "./SideLink";

export default function SideNav(){
    return (
        <>
        <div className="navcontainer">
            <div className="navLogo">
                <div className="navlogoImg">

                </div>
            </div>
            <div className="navLinks">
                <SideLink linkname="Profile"/>
                <SideLink linkname="Dashboard"/>
                <SideLink linkname="Explore"/>
                <SideLink linkname="Messages"/>
                <SideLink linkname="Projects"/>
                <SideLink linkname="Logout"/>
            </div>
            
        </div>
        </>
    )
}