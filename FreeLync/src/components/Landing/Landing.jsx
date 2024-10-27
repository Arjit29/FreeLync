import React from "react";
import Container from "./Container.jsx";
import Button from "./Button.jsx";
import { Link } from "react-router-dom";

export default function Landing(){
    return (
        <>
            <Container
            backgroundColor= "rgb(229, 244, 227)"
            height="50vh"
            width="100%"
            imageURL="/images/freelancer.jpg"
            imageHeight="80vh"
            imageWidth="45%"
            text="Show the World what you are!!"
            marginTop="0"
            isLeft= {true}
            >
                <Link to="/signIn"><Button buttontype="SignIn"/></Link>  
                <Link to="/register"><Button buttontype="Register"/></Link>
            </Container>
            <Container
            backgroundColor= "rgb(17, 17, 17)"
            height="50vh"
            width="100%"
            imageURL="/images/freedom.jpg"
            imageHeight="60vh"
            imageWidth="45%"
            text="Chance to utilize your creative freedom"
            marginTop="0"
            isLeft= {false}
            />
            <Container
            backgroundColor= "rgb(229, 244, 227)"
            height="40vh"
            width="100%"
            imageURL="/images/hire.jpg"
            imageHeight="50vh"
            imageWidth="45%"
            text="Hire the Best"
            marginTop="-14vh"
            isLeft={true}
            />
        </>
    )
}