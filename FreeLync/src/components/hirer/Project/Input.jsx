import React from "react";

export default function Input({placeholder,labelName,type,value,onChange}){
    return(
        <div style={{display: "flex", flexDirection: "column"}}>
            <label style={{marginBottom: "0.8rem",marginLeft: "3rem"}}>{labelName}</label>
            <input type={type} placeholder={placeholder} value={value} onChange={onChange} style={{width: "70%", height: "2rem", paddingTop: "0.3rem", paddingLeft: "0.3rem",marginLeft: "3rem",marginBottom: "2rem"}}/>
        </div>
    )
}