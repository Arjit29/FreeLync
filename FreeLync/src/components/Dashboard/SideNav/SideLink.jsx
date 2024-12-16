import React from "react";
import { Link } from "react-router-dom";

export default function SideLink({linkname,linkto}){
    return(
        <>
            
                <div className="link-text">
                    <p className="innertext">{linkname}</p>
                </div>
            
        </>
    )
}