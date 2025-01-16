import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

interface DoughnutChartProps {
  percentage: string; 
}

const DoughnutChart: React.FC<DoughnutChartProps> = ({ percentage }) => {
  const progress = parseInt(percentage.replace("%", ""), 10);
  const remaining = 100 - progress;

  const data = {
    labels: ["Progreso", "Restante"],
    datasets: [
      {
        data: [progress, remaining],
        backgroundColor: ["#4F46E5", "#E5E7EB"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    cutout: "70%",
    plugins: {
      legend: {
        display: false, 
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  return (
    <div className="relative w-24 h-24 flex justify-center items-center">
      <Doughnut data={data} options={options} />
      <div className="absolute text-center">
        <p className="text-[14px] font-semibold text-gray-800">{percentage}</p>
      </div>
    </div>
  );
};

export default DoughnutChart;
