"use client";

import LineChart from "./charts-child/LinesChart";
import DoughnutChart from "./charts-child/DonnutsChart";
import ROUTES_EXECUTIVE from "@/constants/routes";

import Link from "next/link";

interface ChartsDeskData {
  opportunitiesStart: {
    id: string;
    state: string;
    labels: string[];
    data: number[];
    percentage: string;
    numberOpportunities: string;
  };
  ongoingOpportunity: {
    id: string;
    state: string;
    labels: string[];
    data: number[];
    percentage: string;
    numberOpportunities: string;
  };
  opportunitiesToEnd: {
    id: string;
    state: string;
    labels: string[];
    percentage: string;
    numberOpportunities: string;
  };
}

function Charts(props: ChartsDeskData) {
  const { opportunitiesStart, ongoingOpportunity, opportunitiesToEnd } = props;

  const chartsDesk = [
    {
      id: opportunitiesStart?.id,
      state: opportunitiesStart?.state,
      chart: (
        <LineChart
          labels={opportunitiesStart?.labels || []}
          dataLineChart={opportunitiesStart?.data || []}
        />
      ),
      title: "Op. hijas iniciadas",
      percentage: opportunitiesStart?.percentage || "0%",
      numberOpportunities: opportunitiesStart?.numberOpportunities || "0",
    },
    {
      id: ongoingOpportunity?.id,
      state: ongoingOpportunity?.state,
      chart: (
        <LineChart
          labels={ongoingOpportunity?.labels || []}
          dataLineChart={ongoingOpportunity?.data || []}
        />
      ),
      title: "Op. hijas cotizadas",
      percentage: ongoingOpportunity?.percentage || "0%",
      numberOpportunities: ongoingOpportunity?.numberOpportunities || "0",
    },
    {
      id: opportunitiesToEnd?.id,
      state: opportunitiesToEnd?.state,
      chart: (
        <DoughnutChart percentage={opportunitiesToEnd?.percentage || "0%"} />
      ),
      title: "Op. hijas por vencer",
      percentage: opportunitiesToEnd?.percentage || "0%",
      numberOpportunities: opportunitiesToEnd?.numberOpportunities || "0",
    },
  ];

  return (
    <>
      {chartsDesk.map((chart, index) => (
        <div
          key={chart.id || index}
          className="w-64 h-48 flex flex-col bg-white rounded-xl p-4 justify-between shadow-lg"
        >
          <h3 className="font-bold">{chart.title}</h3>
          <div className="flex justify-between">
            <div className="flex flex-col">
              <span className="font-bold text-2xl">
                {chart.numberOpportunities}
              </span>
              <span className="text-green-500">{chart.percentage}</span>
            </div>
            {chart.chart}
          </div>
          <Link
            // /\s+/g
            href={`${
              ROUTES_EXECUTIVE.OPORTUNITIES_CHILD
            }?state=${chart.state.replace(" ", "_")}`}
            className="text-primary-white flex items-center justify-center w-full text-center rounded-full hover:bg-blue-600 cursor-pointer bg-primary-blue py-2 px-3"
          >
            Ver
          </Link>
        </div>
      ))}
    </>
  );
}

export default Charts;
