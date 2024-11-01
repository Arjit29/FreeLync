import React from "react";
import Input from "./Input";

export default function InputContainer({placeholder1,labelName1,placeholder2,labelName2,type,value1,value2,onChange1,onChange2}){
    return (
        <>
            <div style={{marginTop: "4rem",display: "flex",justifyContent: "center",alignItems: "center",gap: "5rem"}}>
                <Input 
                placeholder={placeholder1} 
                labelName={labelName1} 
                type={type}
                value={value1}
                onChange={onChange1}
                />
                <Input
                placeholder={placeholder2} 
                labelName={labelName2} 
                type={type}
                value={value2}
                onChange={onChange2}
                />
            </div>
        </>
    )
}