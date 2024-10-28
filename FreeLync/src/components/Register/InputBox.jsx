import React from "react";
import InputContainer from "./InputContainer.jsx";

export default function InputBox(){
    return (
        <>
            <InputContainer placeholder1="First Name" labelName1="First Name" placeholder2="Last Name" labelName2="Last Name" type="text"/>
            <InputContainer placeholder1="e.g. abc@gmail.com" labelName1="E-mail" placeholder2="Plot No., Street, Locality" labelName2="Address" type="text"/>
            <InputContainer placeholder1="Strong Password" labelName1="Password" placeholder2="" labelName2="Last Name" type="password"/>
        </>
    )
}