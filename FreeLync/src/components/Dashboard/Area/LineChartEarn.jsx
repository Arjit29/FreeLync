import React, { useState, useEffect, useRef } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto"; // Import Chart.js auto settings

export default function LineChartEarn() {
    const [earnData, setEarnData] = useState(null);
    const earnRef = useRef(null); // Reference for the chart
    const token = localStorage.getItem("token");

    if (!token) {
        console.error("Token not found in local storage");
        return null;
    }

    const userId = JSON.parse(atob(token.split('.')[1])).id;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:3000/projects-data/${userId}`);
                const data = await response.json();
                const earning = data.earnByMonth || {}

                if (response.ok) {
                    const labels = Object.keys(earning);
                    const values = Object.values(earning);
                    console.log(labels)
                    console.log(values)

                    setEarnData({
                        labels,
                        datasets: [
                            {
                                label: "Earning",
                                data: values,
                                borderColor: "#876FD4",
                                backgroundColor: "#F2F2F2",
                                fill: true,
                                tension: 0.2,
                            },
                        ],
                    });
                }
            } catch (error) {
                console.error("Error fetching chart data:", error);
            }
        };

        fetchData();

        // Cleanup function
        return () => {
            if (earnRef.current) {
                // Destroy the existing chart instance
                const chartInstance = earnRef.current.chartInstance;
                if (chartInstance) {
                    chartInstance.destroy();
                }
            }
        };
    }, [userId]);

    if (!earnData) {
        return <p>Loading...</p>;
    }

    return (
            <Line data={earnData} ref={earnRef} />
    );
}
