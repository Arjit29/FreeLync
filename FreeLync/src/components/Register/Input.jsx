import React from "react";

export default function Input({placeholder,labelName,type,value,onChange}){
    return(
        <div style={{display: "flex", flexDirection: "column"}}>
            <label style={{marginBottom: "0.8rem"}}>{labelName}</label>
            <input type={type} placeholder={placeholder} value={value} onChange={onChange} style={{width: "15rem", height: "2rem", paddingTop: "0.3rem", paddingLeft: "0.3rem"}}/>
        </div>
    )
}