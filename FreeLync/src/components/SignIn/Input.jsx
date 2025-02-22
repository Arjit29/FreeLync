import React from "react";

export default function Input({placeholder,labelName,type,value,onChange}){
    return(
        <div style={{display: "flex", flexDirection: "column",marginBottom: "2rem", marginLeft: "4rem"}}>
            <label style={{marginBottom: "0.8rem"}}>{labelName}</label>
            <input type={type} placeholder={placeholder} value={value} onChange={(e)=>onChange(labelName.toLowerCase(),e.target.value)} style={{width: "80%", height: "2rem", paddingTop: "0.3rem", paddingLeft: "0.3rem",border: "none" ,borderRadius: "5px"}}/>
        </div>
    )
}