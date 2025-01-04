import React from "react";
import './Card.css';
import PieChart from "./PieChart";
import LineChart from "./LineChart";
import LineChartEarn from "./LineChartExpense";
import BarChart from "./BarChart";

export default function Card({name,content}){
    return (
        <>
            <div className="each-card">
                <div className="card-head">
                    {name}
                </div>
                <div className="card-chart">
                    {content === "active" && <PieChart />}
                    {content === "compByMonth" && <LineChart />}
                    {content === "earnByMonth" && <LineChartEarn />}
                    {/* {content === "review" && <BarChart />} */}
                </div>
                
            </div>
        </>
    )
}