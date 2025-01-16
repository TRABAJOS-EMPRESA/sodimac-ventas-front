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

ChartJS.register(
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement,
  Tooltip
);

interface LineChartProps {
  labels: string[];
  dataLineChart: number[];
}

const LineChart: React.FC<LineChartProps> = (props) => {
  const { labels, dataLineChart } = props;

  const getTrendColor = (data: number[]) => {
    const start = data[0];
    const end = data[data.length - 1];
    // SI LA VENTA VA BIEN
    if (end > start) return "#4F46E5";

    // SI LA VENTA MAL
    if (end < start) return "red";

    // SI ES ESTABLE
    return "gray";
  };

  const trendColor = getTrendColor(dataLineChart);

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Progreso",
        data: dataLineChart,
        borderColor: trendColor,
        borderWidth: 1,
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
        display: true,
      },
      y: {
        display: true,
      },
    },
  };

  return (
    <div className="w-36 h-24">
      <Line data={data} options={options} />
    </div>
  );
};

export default LineChart;
