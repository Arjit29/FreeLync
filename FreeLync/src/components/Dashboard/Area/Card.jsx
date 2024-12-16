import React from "react";
import './Card.css';
import PieChart from "./PieChart";

export default function Card({name,content}){
    return (
        <>
            <div className="each-card">
                <div className="card-head">
                    {name}
                </div>
                <div className="card-chart">
                    {content === "active" && <PieChart />}
                </div>
                
            </div>
        </>
    )
}