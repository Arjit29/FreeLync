import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";

export default function LineChart() {
    const [lineData, setLineData] = useState(null);
    const token = localStorage.getItem("token");

    if (!token) {
        console.error("Token not found in local storage");
        return <p>Error: Authentication token missing.</p>;
    }

    const userId = JSON.parse(atob(token.split(".")[1])).id;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:3000/projects-data/${userId}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch chart data.");
                }

                const data = await response.json();
                const completedByMonth = data.completedByMonth || {};

                // Ensure months are in chronological order
                const monthsOrder = [
                    "January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"
                ];
                const sortedData = monthsOrder.map((month) => completedByMonth[month] || 0);

                setLineData({
                    labels: monthsOrder,
                    datasets: [
                        {
                            label: "Completed Projects",
                            data: sortedData,
                            borderColor: "#876FD4",
                            backgroundColor: "#F2F2F2",
                            fill: true,
                            tension: 0.2,
                        },
                    ],
                });
            } catch (error) {
                console.error("Error fetching chart data:", error);
            }
        };

        fetchData();
    }, [userId, token]);

    if (!lineData) {
        return <p>Loading...</p>;
    }

    return <Line data={lineData} />;
}
