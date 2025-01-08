'use client'

import DoughnutChart from "@/components/charts/DonnutsChart";
import LineChart from "@/components/charts/LinesChart";
import React from "react";

function DeskExecutivePage() {
  return (
      <div className="w-full flex flex-col items-center justify-center h-screen space-y-7">
        <div className="flex items-start justify-start text-left w-full">
          <h1 className="text-2xl font-bold">Oportunidades de mi cartera</h1>
        </div>

        <div className="grid grid-cols-4 gap-8">
      <div className="w-64 h-40 flex flex-col bg-white rounded-xl p-4 justify-between">
        <h3>Oportunidades creadas 2024</h3>
        <span className="font-bold text-2xl">120</span>
        <LineChart />
        <span className="text-green-500">+12%</span>
      </div>
      <div className="w-64 h-40 flex flex-col bg-white rounded-xl p-4 justify-between">
        <h3>Oportunidades disponibles</h3>
        <span className="font-bold text-2xl">90%</span>
        <DoughnutChart />
        <span className="text-green-500">+30%</span>
      </div>
    </div>
      </div>
  );
}

export default DeskExecutivePage;
