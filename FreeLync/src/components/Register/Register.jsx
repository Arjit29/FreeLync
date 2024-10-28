import React from "react";
import './Register.css';
import InputBox from "./InputBox.jsx";

export default function Register(){
    return(
        <div className="registerContainer">
            <div className="logoImg">

            </div>
            <div className="registerForm">
                <h1 className="registerText">Create An Account</h1>

                <InputBox/>
            </div>

            
        </div>
    )
}