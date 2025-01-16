import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

interface DoughnutChartProps {
  percentage: string; // Ejemplo: "50%"
}

const DoughnutChart: React.FC<DoughnutChartProps> = ({ percentage }) => {
  // Convierte el porcentaje en número y calcula las secciones
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
    cutout: "70%", // Define el tamaño del hueco del gráfico
    plugins: {
      legend: {
        display: false, // Oculta la leyenda
      },
      tooltip: {
        enabled: true, // Muestra el tooltip al pasar el mouse
      },
    },
  };

  return (
    <div className="relative w-24 h-24 flex justify-center items-center">
      {/* Renderiza el gráfico */}
      <Doughnut data={data} options={options} />
      {/* Muestra el porcentaje centrado */}
      <div className="absolute text-center">
        <p className="text-[14px] font-semibold text-gray-800">{percentage}</p>
      </div>
    </div>
  );
};

export default DoughnutChart;
