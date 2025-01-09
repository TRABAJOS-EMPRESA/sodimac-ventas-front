import ButtonTableOpportunities from "@/components/button-table-opportunities/ButtonTableOpportunities";
import Charts from "@/components/charts/Charts";
import DrawerOpportunitie from "@/components/drawer-opportunity/DrawerOpportunitie";
import Image from "next/image";

// recibir data de endpoint

function DeskExecutivePage() {
  return (
    <div className="w-full flex flex-col items-center justify-center h-screen space-y-7">
      <div className="flex items-start justify-start text-left w-full">
        <h1 className="text-2xl font-bold">Oportunidades de mi cartera</h1>
      </div>
      <div className="flex items-center w-full">
        <Image
          src={"/img/icons/calendar.png"}
          alt="calendar"
          width={20}
          height={20}
        />

        <span className="text-gray-400 text-sm ml-2">
          Periodo del 01 de Enero - 31 de Enero del {new Date().getFullYear()}
        </span>
      </div>

      <div className="grid grid-cols-4 gap-5">
        <Charts
          opportunitiesStart={{
            id: "1",
            state: "por iniciar",
            labels: ["Ago", "Sep", "Oct", "Nov", "Dic"],
            data: [12, 19, 3, 5, 2, 3],
            numberOpportunities: "120",
            percentage: "+12%",
          }}
          ongoingOpportunity={{
            id: "2",
            state: "en curso",
            labels: ["Ago", "Sep", "Oct", "Nov", "Dic"],
            data: [10, 23, 35, 42, 13, 12],
            numberOpportunities: "5",
            percentage: "+12%",
          }}
          opportunitiesToEnd={{
            state: "por vencer ",
            id: "3",
            data: [50, 50],
            labels: [""],
            percentage: "50%",
            numberOpportunities: "19000",
          }}
        />

        <div className="w-full flex flex-col items-center justify-center space-y-3">

          <DrawerOpportunitie />
          <ButtonTableOpportunities />
        </div>
      </div>
    </div>
  );
}

export default DeskExecutivePage;
