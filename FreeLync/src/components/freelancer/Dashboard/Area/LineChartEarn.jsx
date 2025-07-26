import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";

export default function LineChartEarn() {
    const [earnData, setEarnData] = useState(null);
    const token = localStorage.getItem("token");

    if (!token) {
        console.error("Token not found in local storage");
        return <p>Error: Authentication token missing.</p>;
    }

    const userId = JSON.parse(atob(token.split(".")[1])).id;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:3000/projects-data/${userId}`,
                    {headers: {
                        Authorization: `Bearer ${token}` 
                        }
                    }
                );
                if (!response.ok) {
                    throw new Error("Failed to fetch earnings data.");
                }

                const data = await response.json();
                const earning = data.earnByMonth || {};

                // Ensure months are in chronological order
                const monthsOrder = [
                    "January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"
                ];
                const sortedEarnings = monthsOrder.map((month) => earning[month] || 0);

                setEarnData({
                    labels: monthsOrder,
                    datasets: [
                        {
                            label: "Earning",
                            data: sortedEarnings,
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
    }, [userId]);

    if (!earnData) {
        return <p>Loading...</p>;
    }

    return <Line data={earnData} />;
}
