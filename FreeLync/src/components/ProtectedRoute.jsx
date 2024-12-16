import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({children}){
    const token = localStorage.getItem("token");
    if (!token) {
        return <Navigate to="/signIn" replace />;
    }
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    // if (allowedUsertype && decodedToken.usertype !== allowedUsertype) {
    //     return <Navigate to="/signIn" replace />;
    // }

    return children;
    // return token ? children : <Navigate to="/signIn" replace/>;
}