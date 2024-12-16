import React, { useState } from "react";
import jwtDecode from "jwt-decode";

export default function Button() {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("Token not found");
        return null;
    }
    const userId = jwtDecode(token).id;
    const [chartData, setChartData] = useState({
        datasets: [{ data: [] }]
    });

    const updateChart = async () => {
        try {
            const response = await fetch(`http://localhost:3000/dashboard-data/${userId}`);
            const data = await response.json();
            if (response.ok) {
                setChartData((prevData) => ({
                    ...prevData,
                    datasets: [
                        {
                            ...prevData.datasets[0],
                            data: [data.completedProjects, ...prevData.datasets[0].data.slice(1)],
                        },
                    ],
                }));
            } else {
                console.error(data.error);
            }
        } catch (err) {
            console.error("Error fetching chart data:", err);
        }
    };

    const handleCompleted = async () => {
        try {
            const response = await fetch("http://localhost:3000/updateCompletedProj", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId })
            });
            const data = await response.json();
            if (response.ok) {
                console.log(data.message);
                updateChart();
            } else {
                console.error(data.error);
            }
        } catch (err) {
            console.error("Error updating completed projects:", err);
        }
    };

    return (
        <button style={{ height: "40px", marginLeft: "23rem" }} onClick={handleCompleted}>
            Completed
        </button>
    );
}
