import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto"; // Auto-imports chart.js settings

export default function BarChart() {
    const [reviewData, setReviewData] = useState(null);
    const token = localStorage.getItem("token");

    if (!token) {
        console.error("Token not found in local storage");
        return null;
    }

    const userId = JSON.parse(atob(token.split(".")[1])).id;

    useEffect(() => {
        const fetchReviewData = async () => {
            try {
                const response = await fetch(`http://localhost:3000/projects-data/${userId}`,
                    {headers: {
                        Authorization: `Bearer ${token}` 
                        }
                    }
                );
                const data = await response.json();
                const rating = data.review || {}; // Adjust key to your backend data

                if (response.ok) {
                    const labels = Object.keys(rating);
                    const values = Object.values(rating);

                    setReviewData({
                        labels,
                        datasets: [
                            {
                                label: "Ratings Distribution",
                                data: values,
                                backgroundColor: [
                                    "#FF6384",
                                    "#36A2EB",
                                    "#FFCE56",
                                    "#4BC0C0",
                                    "#008000",
                                ],
                                borderColor: "#876FD4",
                                borderWidth: 1,
                            },
                        ],
                    });
                }
            } catch (error) {
                console.error("Error fetching review data:", error);
            }
        };

        fetchReviewData();
    }, [userId]);

    if (!reviewData) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            
            <Bar
                data={reviewData}
                // options={{
                //     responsive: true,
                //     plugins: {
                //         legend: {
                //             position: "top",
                //         },
                //         tooltip: {
                //             callbacks: {
                //                 label: function (tooltipItem) {
                //                     return `Count: ${tooltipItem.raw}`;
                //                 },
                //             },
                //         },
                //     },
                //     scales: {
                //         x: {
                //             title: {
                //                 display: true,
                //                 text: "Ratings",
                //             },
                //         },
                //         y: {
                //             title: {
                //                 display: true,
                //                 text: "Number of Reviews",
                //             },
                //             beginAtZero: true,
                //         },
                //     },
                // }}
            />
        </div>
    );
}
