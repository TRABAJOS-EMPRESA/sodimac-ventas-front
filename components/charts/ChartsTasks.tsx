"use client";

import React from "react";
import DoughnutChart from "./charts-child/DonnutsChart";
import LineChart from "./charts-child/LinesChart";

interface ChartsTaskDeskData {
  taskStart: {
    id: string;
    state: string;
    labels: string[];
    data: number[];
    percentage: string;
    numberTask: string;
  };
  ongoingTask: {
    id: string;
    state: string;
    labels: string[];
    data: number[];
    percentage: string;
    numberTask: string;
  };
  taskToEnd: {
    id: string;
    state: string;
    labels: string[];
    percentage: string;
    numberTask: string;
  };
}

function ChartsTasks(props: ChartsTaskDeskData) {
  const { taskStart, ongoingTask, taskToEnd } = props;

  const chartsTaskDesk = [
    {
      id: taskStart?.id,
      state: taskStart?.state,
      chart: (
        <LineChart
          labels={taskStart?.labels || []}
          dataLineChart={taskStart?.data || []}
        />
      ),
      title: "Iniciadas",
      percentage: taskStart?.percentage || "0%",
      numbertask: taskStart?.numberTask || "0",
    },
    {
      id: ongoingTask?.id,
      state: ongoingTask?.state,
      chart: (
        <LineChart
          labels={ongoingTask?.labels || []}
          dataLineChart={ongoingTask?.data || []}
        />
      ),
      title: "En progreso",
      percentage: ongoingTask?.percentage || "0%",
      numbertask: ongoingTask?.numberTask || "0",
    },
    {
      id: taskToEnd?.id,
      state: taskToEnd?.state,
      chart: <DoughnutChart percentage={taskToEnd?.percentage || "0%"} />,
      title: "Finalizadas",
      percentage: taskToEnd?.percentage || "0%",
      numbertask: taskToEnd?.numberTask || "0",
    },
  ];
  return (
    <>
      {chartsTaskDesk.map((chart, index) => (
        <div
          key={chart.id || index}
          className="w-full md:w-64 h-48 flex flex-col bg-white rounded-xl p-4 justify-between shadow-lg"
        >
          <h3 className="font-bold">{chart.title}</h3>
          <div className="flex justify-between">
            <div className="flex flex-col">
              <span className="font-bold text-2xl">{chart.numbertask}</span>
              <span className="text-green-500">{chart.percentage}</span>
            </div>
            {chart.chart}
          </div>
        </div>
      ))}
    </>
  );
}

export default ChartsTasks;
