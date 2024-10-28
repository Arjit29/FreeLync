import React from "react";
import Input from "./Input";

export default function InputContainer({placeholder1,labelName1,placeholder2,labelName2,type}){
    return (
        <>
            <div style={{marginTop: "4rem",display: "flex",justifyContent: "center",alignItems: "center",gap: "5rem"}}>
                <Input placeholder={placeholder1} labelName={labelName1} type={type}/>
                <Input placeholder={placeholder2} labelName={labelName2} type={type}/>
            </div>
        </>
    )
}