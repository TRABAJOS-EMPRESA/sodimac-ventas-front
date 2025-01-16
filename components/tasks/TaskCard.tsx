import { Task } from "@/app/(root-executive)/escritorio-ejecutivo/tareas/page";
import { getCalendarGrayTaskSVG, getClipTaskSVG } from "@/utils/icons-svg-data";
import React from "react";

interface Props {
  tasks: Task[];
}

function TaskCard(props: Props) {
  const { tasks } = props;

  return tasks.map((t) => (
    <div
      key={t.id}
      className="flex flex-col space-y-7 p-2 border border-gray-200 rounded-xl"
    >
      <div className="flex flex-col">
        <div className="flex flex-row justify-center items-center gap-2 ">
          {t.icon()}
          <div className="flex flex-col w-full">
            <h1 className="font-bold text-[13px]">{t.opportunityName}</h1>
            <h1 className="text-[13px] text-gray-500">{t.clientName}</h1>
          </div>
        </div>
        <div className="bg-gray-200 flex rounded-2xl justify-center p-1 w-[120px] ">
          <p className="text-gray-600 font-bold">{t.projectType}</p>
        </div>
      </div>

      <div className="flex flex-row items-center justify-between gap-4 w-full">
        {getClipTaskSVG()}
        <div className="flex items-center">
          {getCalendarGrayTaskSVG()}
          <span className="text-gray-500 text-[15px]">12/08/2025</span>
        </div>
        <div className="text-gray-500  font-bold text-[15px]">
          <span>{t.mountOpportunitie}</span>
        </div>
      </div>
    </div>
  ));
}
export default TaskCard;
