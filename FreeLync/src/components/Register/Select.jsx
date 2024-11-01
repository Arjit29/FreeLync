import React from "react";

export default function Select({options,label}){
    return(
        <div style={{ display: "flex", flexDirection: "column",alignItems: "center",justifyContent: "center", marginTop: "1.5rem" }}>
            <label style={{ marginBottom: "0.8rem" }}>{label}</label>
            <select style={{ width: "16rem", height: "2.5rem", padding: "0.3rem" }}>
                {options.map((option, index) => (
                    <option key={index} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    )
}