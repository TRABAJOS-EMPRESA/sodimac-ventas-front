import React from "react";
// import { getIconTask1SVG } from "@/utils/icons-svg-data";
// import HeaderPages from "@/components/header-pages/HeaderPages";
// import ROUTES_EXECUTIVE from "@/constants/routes";
// import TaskCard from "@/components/tasks/TaskCard";
import TaskCalendar from "@/components/tasks/TaskCalendar";
import { getTaskByIdExecutive } from "@/actions/tasks/get-task-by-executive.action";

// export interface Task {
//   id: string;
//   idOpportunity: string;
//   opportunityName: string;
//   icon: () => JSX.Element;
//   opportunityDate: string;
//   mountOpportunitie: string;
//   clientName: string;
//   statusOpportunity: string;
//   projectType: string;
// }

// const tasks: Task[] = [
//   {
//     id: "1",
//     idOpportunity: "Op-1",
//     opportunityName: "Nueva Propuesta de Negocio",
//     icon: () => getIconTask1SVG(),
//     opportunityDate: "2025-01-15",
//     mountOpportunitie: "$10,000",
//     clientName: "Empresa XYZ",
//     statusOpportunity: "inicio",
//     projectType: "institucional",
//   },
//   {
//     id: "2",
//     idOpportunity: "Op-2",
//     opportunityName: "Seguimiento de Propuesta",
//     icon: () => getIconTask1SVG(),
//     opportunityDate: "2025-01-10",
//     mountOpportunitie: "$5,000",
//     clientName: "Cliente ABC",
//     statusOpportunity: "en progreso",
//     projectType: "institucional",
//   },
//   {
//     id: "3",
//     idOpportunity: "Op-3",
//     opportunityName: "Revisión de Contrato",
//     icon: () => getIconTask1SVG(),
//     opportunityDate: "2025-01-12",
//     mountOpportunitie: "$8,500",
//     clientName: "Grupo LMN",
//     statusOpportunity: "finalizada",
//     projectType: "institucional",
//   },
//   {
//     id: "4",
//     idOpportunity: "Op-4",
//     opportunityName: "Propuesta Aprobada",
//     icon: () => getIconTask1SVG(),
//     opportunityDate: "2025-01-05",
//     mountOpportunitie: "$15,000",
//     clientName: "Corporación DEF",
//     statusOpportunity: "finalizada",
//     projectType: "recreacional",
//   },
//   {
//     id: "5",
//     idOpportunity: "Op-5",
//     opportunityName: "Negociación de Contrato",
//     icon: () => getIconTask1SVG(),
//     opportunityDate: "2025-01-20",
//     mountOpportunitie: "$20,000",
//     clientName: "Startup GHI",
//     statusOpportunity: "inicio",
//     projectType: "recreacional",
//   },
//   {
//     id: "6",
//     idOpportunity: "Op-6",
//     opportunityName: "Estrategia de Marketing",
//     icon: () => getIconTask1SVG(),
//     opportunityDate: "2025-01-18",
//     mountOpportunitie: "$7,000",
//     clientName: "Agencia PQR",
//     statusOpportunity: "en progreso",
//     projectType: "recreacional",
//   },
//   {
//     id: "7",
//     idOpportunity: "Op-7",
//     opportunityName: "Lanzamiento de Producto",
//     icon: () => getIconTask1SVG(),
//     opportunityDate: "2025-01-22",
//     mountOpportunitie: "$25,000",
//     clientName: "Tech Solutions",
//     statusOpportunity: "inicio",
//     projectType: "recreacional",
//   },
//   {
//     id: "8",
//     idOpportunity: "Op-8",
//     opportunityName: "Capacitación de Personal",
//     icon: () => getIconTask1SVG(),
//     opportunityDate: "2025-01-30",
//     mountOpportunitie: "$3,500",
//     clientName: "EduCorp",
//     statusOpportunity: "finalizada",
//     projectType: "institucional",
//   },
//   {
//     id: "9",
//     idOpportunity: "Op-9",
//     opportunityName: "Expansión Internacional",
//     icon: () => getIconTask1SVG(),
//     opportunityDate: "2025-01-25",
//     mountOpportunitie: "$50,000",
//     clientName: "Global Ventures",
//     statusOpportunity: "en progreso",
//     projectType: "institucional",
//   },
//   {
//     id: "10",
//     idOpportunity: "Op-10",
//     opportunityName: "Auditoría Interna",
//     icon: () => getIconTask1SVG(),
//     opportunityDate: "2025-02-01",
//     mountOpportunitie: "$12,000",
//     clientName: "FinancePro",
//     statusOpportunity: "inicio",
//     projectType: "institucional",
//   },
//   {
//     id: "11",
//     idOpportunity: "Op-11",
//     opportunityName: "Optimización de Procesos",
//     icon: () => getIconTask1SVG(),
//     opportunityDate: "2025-02-05",
//     mountOpportunitie: "$6,000",
//     clientName: "ProcessFlow Inc.",
//     statusOpportunity: "en progreso",
//     projectType: "institucional",
//   },
//   {
//     id: "12",
//     idOpportunity: "Op-12",
//     opportunityName: "Consultoría Estratégica",
//     icon: () => getIconTask1SVG(),
//     opportunityDate: "2025-02-08",
//     mountOpportunitie: "$18,000",
//     clientName: "Strategy Hub",
//     statusOpportunity: "finalizada",
//     projectType: "recreacional",
//   },
//   {
//     id: "13",
//     idOpportunity: "Op-13",
//     opportunityName: "Planificación Financiera",
//     icon: () => getIconTask1SVG(),
//     opportunityDate: "2025-02-10",
//     mountOpportunitie: "$9,000",
//     clientName: "BudgetSmart",
//     statusOpportunity: "inicio",
//     projectType: "recreacional",
//   },
//   {
//     id: "14",
//     idOpportunity: "Op-14",
//     opportunityName: "Desarrollo de Software",
//     icon: () => getIconTask1SVG(),
//     opportunityDate: "2025-02-15",
//     mountOpportunitie: "$30,000",
//     clientName: "CodeCraft",
//     statusOpportunity: "en progreso",
//     projectType: "recreacional",
//   },
//   {
//     id: "15",
//     idOpportunity: "Op-15",
//     opportunityName: "Análisis de Mercado",
//     icon: () => getIconTask1SVG(),
//     opportunityDate: "2025-02-20",
//     mountOpportunitie: "$4,500",
//     clientName: "MarketScope",
//     statusOpportunity: "en progreso",
//     projectType: "recreacional",
//   },
// ];

// // AQUI LO QUE HAY QUE HACER ES USAR REACT QUERY TRAERSE LA DATA
// // FILTRARLA Y MOSTRARLA EN COLUMNAS, SI EL USUARIO CAMBIA UNA TAREA DE COLUMNA CAMBIARLE
// // EL ESTADO AUTOMATICAMENTE Y DEJAR SIN EFECTO EL CACHE DE LA LLAMADA QUE TRAE A TODAS LAS TAREAS
// // PARA PROVOCAR EL EFECTO DE TOMAR UNA TAREA E INSERTARLA EN OTRA TABLA

// const iniciadas: Task[] = tasks.filter(
//   (t: Task) => t.statusOpportunity === "inicio"
// );
// const enProgreso: Task[] = tasks.filter(
//   (t: Task) => t.statusOpportunity === "en progreso"
// );
// const finalizadas: Task[] = tasks.filter(
//   (t: Task) => t.statusOpportunity === "finalizada"
// );

async function TasksPage() {
  const tasks = await getTaskByIdExecutive();

  console.log("tasks ->", tasks);

  return (
    // <section className="flex flex-col w-full h-full items-center">
    //   <HeaderPages
    //     buttonDrawer={false}
    //     buttonLink={true}
    //     w={"w-[200px]"}
    //     titleHeader="Mis Tareas"
    //     route={ROUTES_EXECUTIVE.DESK_EXECUTIVE}
    //     routeTitle="Dashboard"
    //   />
    //   <div className="grid grid-cols-4 gap-5">
    //     <div className="col-span-1 w-[300px] flex flex-col items-center justify-center space-y-3 p-7">

    //     </div>

    //     {/* PRIMERA COLUMNA INICIADAS */}

    //     <div className="flex flex-col shadow-lg border border-gray-100 rounded-xl p-2">
    //       <h1 className="text-[20px] font-bold">Tareas en inicio</h1>
    //       <div className="col-span-1 w-[300px]  flex flex-col  space-y-3 p-2 h-[550px] overflow-y-auto">
    //         {/* CARD */}
    //         <TaskCard tasks={iniciadas} />
    //       </div>
    //     </div>

    //     {/* SEGUNDA COLUMNA EN PROGRESO */}
    //     <div className="flex flex-col shadow-lg border border-gray-100 rounded-xl p-2">
    //       <h1 className="text-[20px] font-bold">Tareas en progreso</h1>
    //       <div className="col-span-1 w-[300px]  flex flex-col  space-y-3 p-2 h-[550px] overflow-y-auto">
    //         {/* CARD */}
    //         <TaskCard tasks={enProgreso} />
    //       </div>
    //     </div>

    //     {/* TERCERA COLUMNA FINALIZADAS*/}
    //     <div className="flex flex-col shadow-lg border border-gray-100 rounded-xl p-2">
    //       <h1 className="text-[20px] font-bold">Tareas finalizadas</h1>
    //       <div className="col-span-1 w-[300px]  flex flex-col  space-y-3 p-2 h-[550px] overflow-y-auto">
    //         {/* CARD */}
    //         <TaskCard tasks={finalizadas} />
    //       </div>
    //     </div>
    //   </div>
    // </section>

    <TaskCalendar taskCalendar={Array.isArray(tasks) ? tasks : []} />
  );
}

export default TasksPage;
