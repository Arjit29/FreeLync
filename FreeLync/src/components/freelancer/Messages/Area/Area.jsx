import React from "react";
import "./Area.css";
import UserCards from "./UserCards";

export default function Area(){
    return (
        <>
        <div className="mainarea">
            <div className="top-msg">
                 <div className="left-top-msg">
                     <div className="chatmsg">
                     Instantly connect with like-minded freelancers and your next big opportunity—all in real time!
                     </div>
                 </div>
                 <div className="right-top-msg">
 
                 </div>
             </div>
             
             <UserCards/>
             
             
        </div>           
        </>
    )
}