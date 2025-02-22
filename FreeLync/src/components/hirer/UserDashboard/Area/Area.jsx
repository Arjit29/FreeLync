import React from "react";
import './Area.css'
import StatCards from "./StatCards";
import { Link } from "react-router-dom";

export default function Area(){
    return(
        <>
        <div className="mainarea">
            <div className="top-dash">
                <div className="left-top-dash">
                    <div className="welcome">
                        Welcome back user
                    </div>
                    <div className="intro">
                    Head over to your profile to view and update your details, track progress, and showcase your achievements. Make your profile truly yours!
                    </div>
                    <Link to="/hirer-profile"><button className="btn-dash">Go now!!</button></Link> 
                </div>
                <div className="right-top-dash">

                </div>
            </div>
            
            <StatCards/>
            
        </div>
            
        </>
    )
}