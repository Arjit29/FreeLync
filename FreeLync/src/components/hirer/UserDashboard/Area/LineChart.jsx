import React, { useState, useEffect, useRef } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto"; // Import Chart.js auto settings

export default function LineChart() {
    const [hirerLineData, setHirerLineData] = useState(null);
    const chartRef = useRef(null); // Reference for the chart
    const token = localStorage.getItem("token");

    if (!token) {
        console.error("Token not found in local storage");
        return null;
    }

    const userId = JSON.parse(atob(token.split('.')[1])).id;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:3000/hirer-projects-data/${userId}`);
                const data = await response.json();
                const completedByMonth = data.completedByMonth || {};

                if (response.ok) {
                    const labels = Object.keys(completedByMonth);
                    const values = Object.values(completedByMonth);

                    setHirerLineData({
                        labels,
                        datasets: [
                            {
                                label: "Completed Projects",
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
            if (chartRef.current) {
                // Destroy the existing chart instance
                const chartInstance = chartRef.current.chartInstance;
                if (chartInstance) {
                    chartInstance.destroy();
                }
            }
        };
    }, [userId]);

    if (!hirerLineData) {
        return <p>Loading...</p>;
    }

    return (
            <Line data={hirerLineData} ref={chartRef} />
    );
}
