"use";

import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

interface DoughnutChartProps {
  dataDoughnut: number[];
  percentage: string;
}

const DoughnutChart: React.FC<DoughnutChartProps> = (
  props: DoughnutChartProps
) => {
  const { dataDoughnut, percentage } = props;
  const data = {
    labels: ["Progreso", "Faltante"],
    datasets: [
      {
        data: dataDoughnut,
        backgroundColor: ["#4F46E5", "#E5E7EB"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    cutout: percentage,
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
    <div className="w-24 h-24 flex justify-center items-center pb-1">
      <Doughnut data={data} options={options} />
      <div className="absolute text-center ">
        <p className="text-[14px] font-semibold text-gray-800">{options.cutout}</p>
      </div>
    </div>
  );
};

export default DoughnutChart;
