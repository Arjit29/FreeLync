import React from "react";
import "./Button.css";

export default function Button({buttontype}){
    return(
        <>
            <button className="button-style">{buttontype}</button>
        </>
    )
}