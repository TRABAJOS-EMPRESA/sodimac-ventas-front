import Charts from "@/components/charts/Charts";
import DrawerOpportunities from "@/components/drawer-opportunity/DrawerOpportunities";
import Image from "next/image";
import { auth } from "@/utils/auth";
import ChartsTasks from "@/components/charts/ChartsTasks";
import ButtonDashboardCustom from "@/components/button-table-opportunities/ButtonTableOpportunities";
import ROUTES_EXECUTIVE from "@/constants/routes";

// recibir data de endpoint

async function DeskExecutivePage() {
  const session = await auth();

  return (
    <div className="w-full flex flex-col items-center justify-center h-full space-y-7 " >
      <div className="flex items-start justify-start text-left w-full">
        <h1 className="text-2xl font-bold" >Oportunidades de mi cartera</h1>
      </div>
      <div className="flex items-center w-full">
        <Image
          src={"/img/icons/calendar.png"}
          alt="calendar"
          width={20}
          height={20}
          
        />

        <span className="text-gray-400 text-sm ml-2" >
          Periodo del 01 de Enero - 31 de Enero del {new Date().getFullYear()}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 w-full">
        <Charts
          opportunitiesStart={{
            id: "1",
            state: "inicio",
            labels: ["Ago", "Sep", "Oct", "Nov", "Dic"],
            data: [12, 19, 3, 5, 2, 3],
            numberOpportunities: "120",
            percentage: "+12%",
          }}
          ongoingOpportunity={{
            id: "2",
            state: "cotizada",
            labels: ["Ago", "Sep", "Oct", "Nov", "Dic"],
            data: [10, 23, 35, 42, 13, 12],
            numberOpportunities: "5",
            percentage: "+12%",
          }}
          opportunitiesToEnd={{
            state: "por vencer ",
            id: "3",
            labels: [""],
            percentage: "100%",
            numberOpportunities: "19000",
          }}
        />

        <div className="w-full flex flex-col items-center justify-center space-y-3">
          <DrawerOpportunities w={"w-full"} session={session!} />
            <ButtonDashboardCustom
              tabIndex={1}
              title="Ver tabla de oportunidades"
              route={ROUTES_EXECUTIVE.OPORTUNITIES_CHILD}
            />
        </div>
      </div>

      <div className="flex items-start justify-start text-left w-full">
        <h1 className="text-2xl font-bold">Mis tareas</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 w-full">
        <ChartsTasks
          taskStart={{
            id: "1",
            state: "inicio",
            labels: ["Ago", "Sep", "Oct", "Nov", "Dic"],
            data: [12, 19, 3, 5, 2, 3],
            numberTask: "200",
            percentage: "+20%",
          }}
          ongoingTask={{
            id: "2",
            state: "en_progreso",
            labels: ["Ago", "Sep", "Oct", "Nov", "Dic"],
            data: [10, 23, 35, 42, 13, 12],
            numberTask: "5",
            percentage: "+5%",
          }}
          taskToEnd={{
            state: "finalizadas",
            id: "3",
            labels: [""],
            percentage: "10%",
            numberTask: "10",
          }}
        />
        <div className="w-full flex flex-col items-center justify-center space-y-3">

          
          <ButtonDashboardCustom
            tabIndex={1}
            title="Ver tareas"
            route={ROUTES_EXECUTIVE.TASKS}
          />
        </div>
      </div>
    </div>
  );
}

export default DeskExecutivePage;
