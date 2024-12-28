import React from "react";
import { Pie } from "react-chartjs-2";
import { useState, useEffect } from "react";

export default function PieChart() {
    const [hirerChartData, setHirerChartData] = useState(null);
    const token = localStorage.getItem("token");

    if (!token) {
        console.error("Token not found in localStorage");
        return null;
    }

    const userId = JSON.parse(atob(token.split('.')[1])).id;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:3000/hirer-projects-data/${userId}`);
                const data = await response.json();
                if (response.ok) {
                    setHirerChartData({
                        labels: [`Ongoing: ${data.ongoing}`, `Active: ${data.open}`],
                        datasets: [
                            {
                                data: [data.ongoing || 0, data.open || 0],
                                backgroundColor: ["#F6A417", "#EB5F1A"],
                            },
                        ],
                    });
                }
            } catch (error) {
                console.error("Error fetching project data:", error);
            }
        };
        fetchData();
    }, [userId]);

    if (!hirerChartData) {
        return <p>Loading...</p>;
    }

    return <Pie data={hirerChartData} />;
}
