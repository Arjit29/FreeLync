import React from "react";
import Card from "./Card";

export default function StatCards(){
    return (
        <>
            <div className="statcards" style={{marginLeft: "22rem", marginTop: "3rem"}}>
                <div className="top-cards" style={{display: "flex", gap: "4rem"}}>
                    <Card name="Active Projects" content="active"/>
                    <Card name="Completed Projects" content="compByMonth"/>
                </div>
                <div className="bottom-cards" style={{display: "flex",gap: "4rem",marginTop: "2rem"}}>
                    <Card name="Earnings" content="earnByMonth"/>
                    <Card name="Reviews" content="review"/>
                </div>
            </div>
        </>
    )
}