import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart: React.FC = () => {
  const data = {
    labels: ["Progreso", "Faltante"],
    datasets: [
      {
        data: [90, 10], 
        backgroundColor: ["#4F46E5", "#E5E7EB"], 
        borderWidth: 0, 
      },
    ],
  };

  const options = {
    responsive: true,
    cutout: "80%", 
    plugins: {
      legend: {
        display: false, 
      },
      tooltip: {
        enabled: false, 
      },
    },
  };

  return <Doughnut data={data} options={options} />;
};

export default DoughnutChart;
