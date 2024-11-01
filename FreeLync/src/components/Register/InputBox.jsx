import React from "react";
import InputContainer from "./InputContainer.jsx";

export default function InputBox({formData, onChange}){
    return (
        <>
            <InputContainer 
            placeholder1="First Name"
            labelName1="First Name" 
            placeholder2="Last Name" 
            labelName2="Last Name" 
            type="text" 
            value1={formData.firstname} 
            value2={formData.lastname} 
            onChange1={(e)=>onChange("firstname",e.target.value)} 
            onChange2={(e)=>onChange("lastname",e.target.value)}
            />
            <InputContainer 
            placeholder1="e.g. abc@gmail.com" 
            labelName1="E-mail" 
            placeholder2="Plot No., Street, Locality" 
            labelName2="Address" 
            type="text" 
            value1={formData.email} 
            value2={formData.address} 
            onChange1={(e)=>onChange("email",e.target.value)} 
            onChange2={(e)=>onChange("address",e.target.value)}
            />
            <InputContainer 
            placeholder1="Strong Password" 
            labelName1="Password" 
            placeholder2="Confirm" 
            labelName2="Confirm Password" 
            type="password" 
            value1={formData.password} 
            value2={formData.confirmpassword || ""} 
            onChange1={(e)=>onChange("password",e.target.value)} 
            onChange2={(e)=>onChange("confirmpassword",e.target.value)}
            />
        </>
    )
}