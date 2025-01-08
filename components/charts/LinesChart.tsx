import React from "react";
import {
  Chart as ChartJS,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(LineElement, LinearScale, CategoryScale, PointElement, Tooltip);

const LineChart: React.FC = () => {
  const data = {
    labels: ["Ene", "Feb", "Mar", "Abr", "May"],
    datasets: [
      {
        label: "Progreso",
        data: [30, 50, 20, 70, 90],
        borderColor: "#4F46E5", 
        borderWidth: 2,
        tension: 0.4, 
        pointRadius: 0, 
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false, 
      },
    },
    scales: {
      x: {
        display: false, 
      },
      y: {
        display: false, 
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default LineChart;
