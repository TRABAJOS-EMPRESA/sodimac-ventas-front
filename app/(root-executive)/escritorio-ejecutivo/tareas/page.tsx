import React from "react";
import {
  getCalendarGrayTaskSVG,
  getClipTaskSVG,
  getIconTask1SVG,
} from "@/utils/icons-svg-data";

function TasksPage() {
  return (
    <section className="flex flex-col w-full h-full items-center">
      <div className="grid grid-cols-4 gap-5">
        <div className="col-span-1 w-[300px] flex flex-col items-center justify-center space-y-3 p-7"></div>
        <div className="col-span-1 w-[300px]   flex flex-col  space-y-3 p-2 shadow-lg border border-gray-100 rounded-xl">
          <h1 className="text-[20px] font-bold">Tareas en inicio</h1>

          {/* CARD */}
          <div className="flex flex-col space-y-7 p-2 border border-gray-200 rounded-xl">
            <div className="flex flex-col">
              <div className="flex flex-row justify-center items-center gap-2 ">
                {getIconTask1SVG()}
                <div className="flex flex-col w-full">
                  <h1 className="font-bold text-[13px]">
                    COBERTURA - LOS TILOS
                  </h1>
                  <h1 className="text-[13px] text-gray-500">NOMBRE CLIENTE</h1>
                </div>
              </div>
              <div className="bg-gray-200 flex rounded-2xl justify-center p-1 w-[120px] ">
                <p className="text-gray-600 font-bold">Institucional</p>
              </div>
            </div>

            <div className="flex flex-row items-center justify-between gap-4 w-full">
              {getClipTaskSVG()}
              <div className="flex items-center">
                {getCalendarGrayTaskSVG()}
                <span className="text-gray-500 text-[15px]">12/08/2025</span>
              </div>
              <div className="text-gray-500  font-bold text-[15px]">
                <span>$22.000.000</span>
              </div>
            </div>
          </div>
          {/* CARD */}
          <div className="flex flex-col space-y-7 p-2 border border-gray-200 rounded-xl">
            <div className="flex flex-col">
              <div className="flex flex-row justify-center items-center gap-2 ">
                {getIconTask1SVG()}
                <div className="flex flex-col w-full">
                  <h1 className="font-bold text-[13px]">
                    COBERTURA - LOS TILOS
                  </h1>
                  <h1 className="text-[13px] text-gray-500">NOMBRE CLIENTE</h1>
                </div>
              </div>
              <div className="bg-gray-200 flex rounded-2xl justify-center p-1 w-[120px] ">
                <p className="text-gray-600 font-bold">Institucional</p>
              </div>
            </div>

            <div className="flex flex-row items-center justify-between gap-4 w-full">
              {getClipTaskSVG()}
              <div className="flex items-center">
                {getCalendarGrayTaskSVG()}
                <span className="text-gray-500 text-[15px]">12/08/2025</span>
              </div>
              <div className="text-gray-500  font-bold text-[15px]">
                <span>$22.000.000</span>
              </div>
            </div>
          </div>
        </div>

        {/* SEGUNDA COLUMNA */}
        <div className="col-span-1 w-[300px]   flex flex-col  space-y-3 p-2 shadow-lg border border-gray-100 rounded-xl">
          <h1 className="text-[20px] font-bold">Tareas en progreso</h1>

          {/* CARD */}
          <div className="flex flex-col space-y-7 p-2 border border-gray-200 rounded-xl">
            <div className="flex flex-col">
              <div className="flex flex-row justify-center items-center gap-2 ">
                {getIconTask1SVG()}
                <div className="flex flex-col w-full">
                  <h1 className="font-bold text-[13px]">
                    COBERTURA - LOS TILOS
                  </h1>
                  <h1 className="text-[13px] text-gray-500">NOMBRE CLIENTE</h1>
                </div>
              </div>
              <div className="bg-gray-200 flex rounded-2xl justify-center p-1 w-[120px] ">
                <p className="text-gray-600 font-bold">Institucional</p>
              </div>
            </div>

            <div className="flex flex-row items-center justify-between gap-4 w-full">
              {getClipTaskSVG()}
              <div className="flex items-center">
                {getCalendarGrayTaskSVG()}
                <span className="text-gray-500 text-[15px]">12/08/2025</span>
              </div>
              <div className="text-gray-500  font-bold text-[15px]">
                <span>$22.000.000</span>
              </div>
            </div>
          </div>
          {/* CARD */}
          <div className="flex flex-col space-y-7 p-2 border border-gray-200 rounded-xl">
            <div className="flex flex-col">
              <div className="flex flex-row justify-center items-center gap-2 ">
                {getIconTask1SVG()}
                <div className="flex flex-col w-full">
                  <h1 className="font-bold text-[13px]">
                    COBERTURA - LOS TILOS
                  </h1>
                  <h1 className="text-[13px] text-gray-500">NOMBRE CLIENTE</h1>
                </div>
              </div>
              <div className="bg-gray-200 flex rounded-2xl justify-center p-1 w-[120px] ">
                <p className="text-gray-600 font-bold">Institucional</p>
              </div>
            </div>

            <div className="flex flex-row items-center justify-between gap-4 w-full">
              {getClipTaskSVG()}
              <div className="flex items-center">
                {getCalendarGrayTaskSVG()}
                <span className="text-gray-500 text-[15px]">12/08/2025</span>
              </div>
              <div className="text-gray-500  font-bold text-[15px]">
                <span>$22.000.000</span>
              </div>
            </div>
          </div>
        </div>

        {/* TERCERA COLUMNA */}
        <div className="col-span-1 w-[300px]   flex flex-col  space-y-3 p-2 shadow-lg border border-gray-100 rounded-xl">
          <h1 className="text-[20px] font-bold">Tareas finalizadas</h1>

          {/* CARD */}
          <div className="flex flex-col space-y-7 p-2 border border-gray-200 rounded-xl">
            <div className="flex flex-col">
              <div className="flex flex-row justify-center items-center gap-2 ">
                {getIconTask1SVG()}
                <div className="flex flex-col w-full">
                  <h1 className="font-bold text-[13px]">
                    COBERTURA - LOS TILOS
                  </h1>
                  <h1 className="text-[13px] text-gray-500">NOMBRE CLIENTE</h1>
                </div>
              </div>
              <div className="bg-gray-200 flex rounded-2xl justify-center p-1 w-[120px] ">
                <p className="text-gray-600 font-bold">Institucional</p>
              </div>
            </div>

            <div className="flex flex-row items-center justify-between gap-4 w-full">
              {getClipTaskSVG()}
              <div className="flex items-center">
                {getCalendarGrayTaskSVG()}
                <span className="text-gray-500 text-[15px]">12/08/2025</span>
              </div>
              <div className="text-gray-500  font-bold text-[15px]">
                <span>$22.000.000</span>
              </div>
            </div>
          </div>
          {/* CARD */}
          <div className="flex flex-col space-y-7 p-2 border border-gray-200 rounded-xl">
            <div className="flex flex-col">
              <div className="flex flex-row justify-center items-center gap-2 ">
                {getIconTask1SVG()}
                <div className="flex flex-col w-full">
                  <h1 className="font-bold text-[13px]">
                    COBERTURA - LOS TILOS
                  </h1>
                  <h1 className="text-[13px] text-gray-500">NOMBRE CLIENTE</h1>
                </div>
              </div>
              <div className="bg-gray-200 flex rounded-2xl justify-center p-1 w-[120px] ">
                <p className="text-gray-600 font-bold">Institucional</p>
              </div>
            </div>

            <div className="flex flex-row items-center justify-between gap-4 w-full">
              {getClipTaskSVG()}
              <div className="flex items-center">
                {getCalendarGrayTaskSVG()}
                <span className="text-gray-500 text-[15px]">12/08/2025</span>
              </div>
              <div className="text-gray-500  font-bold text-[15px]">
                <span>$22.000.000</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TasksPage;
