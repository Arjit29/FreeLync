import React from "react";
import { Pie } from "react-chartjs-2";
import { useState, useEffect } from "react";

export default function PieChart() {
    const [chartData, setChartData] = useState(null);
    const token = localStorage.getItem("token");

    if (!token) {
        console.error("Token not found in localStorage");
        return null;
    }

    const userId = JSON.parse(atob(token.split('.')[1])).id;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:3000/active-projects-data/${userId}`);
                const data = await response.json();
                if (response.ok) {
                    setChartData({
                        labels: ["Ongoing", "Completed"],
                        datasets: [
                            {
                                data: [data.ongoing || 0, data.completed || 0],
                                backgroundColor: ["#36A2EB", "#FF6384"],
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

    if (!chartData) {
        return <p>Loading...</p>;
    }

    return <Pie data={chartData} />;
}
