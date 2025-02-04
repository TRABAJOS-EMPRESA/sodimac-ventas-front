"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import esLocale from "@fullcalendar/core/locales/es";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, {
  Draggable,
  EventDragStopArg,
  EventReceiveArg,
} from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useEffect, useRef, useState } from "react";

import ROUTES_EXECUTIVE from "@/constants/routes";
import { toast } from "@/hooks/use-toast";
import { EventDropArg } from "@fullcalendar/core/index.js";
import { useRouter } from "next/navigation";
import { CoverageFormDialog } from "../forms/tasks/CoverageFormDialog";
import { formatDateIsoToString } from "@/utils/formatDate";
// import { Task, TaskResponse } from "@/interfaces/task/task.interface";
// import { dataTasks } from "@/constants/data-tasks";
import TaskCard from "./components/TaskCard";
import { Task } from "@/interfaces/task/task.interface";

// AUXILIAR OARA VER SI LAS FECHAS ESTAN DENTRO DEL MSS

const isInCurrentMonth = (dateStr: string): boolean => {
  // console.log("incurrent month auxiliar fecha del arrastre-> ", dateStr);

  if (!dateStr) return false;

  // DIVIDO LA FECHA EN DISTINTOS COMPONENTES
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const now = new Date();

  const currentDate = new Date(now.getFullYear(), now.getMonth());
  const targetDate = new Date(date.getFullYear(), date.getMonth());

  // console.log("Fecha actual:", currentDate);
  // console.log("Fecha objetivo:", targetDate);
  // console.log("Son iguales:", currentDate.getTime() === targetDate.getTime());

  return currentDate.getTime() === targetDate.getTime();
};


interface Props {

  taskCalendar: Task[]
}

export default function TaskCalendar(props: Props) {

  const {taskCalendar} = props
  interface CoverageDialogProps {
    open: boolean;
    id?: string;
    datePlanned?: string;
  }

  const router = useRouter();
  const unplannedContainerRef = useRef<HTMLDivElement | null>(null);
  const [coverageDialogForm, setCoverageDialogForm] =
    useState<CoverageDialogProps>({ open: false, id: "", datePlanned: "" });
  // DEFINI LAS PLANIFICADAS O NO BAJO UN CAMPO PLANNED TRUE O FALSE
  // ASI MUESTRO EN EL CALENDARIO LAS PLANIFICADAS Y EN LA LISTA LAS NO PLANIFICADAS
  const [tasks, setTasks] = useState<Task[]>(taskCalendar);

  // // Datos temporales para crear nueva tarea
  // const [newTask, setNewTask] = useState<NewTask>({
  //   title: "",
  //   client: "",
  //   documentId: "",
  //   type: "cobertura",
  // });

  // inicio de draggable en el contenedor de tareas sin planificar
  useEffect(() => {
    if (unplannedContainerRef.current) {
      new Draggable(unplannedContainerRef.current, {
        itemSelector: ".fc-event",
        eventData: (eventEl) => {
          const dataStr = eventEl.getAttribute("data-event");
          if (!dataStr) return {};
          return JSON.parse(dataStr);
        },
      });
    }
  }, []);

  // Función auxiliar para validar el rango de fechas
  const isWithinDateRange = (
    targetDate: string,
    start: string,
    end: string
  ): boolean => {
    const date = new Date(targetDate);
    const startDate = new Date(start);
    const endDate = new Date(end);

    return date >= startDate && date <= endDate;
  };

  // Función modificada para validar la fecha según el tipo de tarea
  const isValidTaskDate = (task: Task, targetDate: string): boolean => {
    // Si es cobertura, solo validamos que sea el mes actual
    if (task.type.name === "Cobertura") {
      return isInCurrentMonth(targetDate);
    }

    // Para otros tipos, validamos que esté dentro del rango start-end
    return isWithinDateRange(targetDate, task.startDate.toLocaleString(), task.endDate.toLocaleString());
  };

  const plannedTasks = tasks
    .filter((t) => t.planned)
    .map((task) => ({
      id: task.id,
      taskName: task.taskName,
      startDate: task.startDate,
      color: task.color,
    }));
  const unplannedTasks = tasks.filter((t) => !t.planned);

  // Modificar handleEventReceive
  const handleEventReceive = (info: EventReceiveArg) => {
    const dataStr = info.draggedEl.getAttribute("data-event");
    if (!dataStr) return;

    const droppedTask = JSON.parse(dataStr) as Task;
    const targetDate = info.event.startStr;

    // Validación según tipo de tarea
    if (!isValidTaskDate(droppedTask, targetDate)) {
      info.revert();
      toast({
        variant: "destructive",
        title: "Error al planificar",
        description:
          droppedTask.type.name === "Cobertura"
            ? "Las tareas de cobertura solo pueden planificarse para el mes actual"
            : `Esta tarea solo puede planificarse entre ${formatDateIsoToString(
                droppedTask.startDate.toLocaleString()
              )} y ${formatDateIsoToString(droppedTask.endDate.toLocaleString())}`,
      });
      return;
    }

    // Actualizamos datePlanned en lugar de start
    setTasks((prev) =>
      prev.map((t) =>
        t.id === droppedTask.id
          ? { ...t, planned: true, datePlanned: targetDate }
          : t
      )
    );

    info.event.setProp("taskName", droppedTask.taskName);
    info.event.setProp("plannedAT", droppedTask.planned);
    info.event.setProp("id", droppedTask.id);
    info.event.setProp("color", droppedTask.color);
  };

  const handleEventDragStop = (info: EventDragStopArg) => {
    if (isOverUnplannedContainer(info.jsEvent)) {
      const eventId = info.event.id;

      // AQUI GUARDO LA FECHA ANTES DE GUARADAR EL OBJETO

      info.event.remove();

      // LE PASO LA FECHA  A LA TAREA ENCONTRADA
      setTasks((prev) =>
        prev.map((t) =>
          t.id === eventId
            ? {
                ...t,
                planned: false,
                datePlanned: "", // Limpiamos datePlanned
              }
            : t
        )
      );
    }
  };

  // chequear si el mouse esta dentro o fuera del contenedor de tareas sin planificar
  const isOverUnplannedContainer = (e: MouseEvent): boolean => {
    if (!unplannedContainerRef.current) return false;
    const rect = unplannedContainerRef.current.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    return (
      x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
    );
  };

  const handleCloseCoverageFormDialog = () => {
    setCoverageDialogForm({ open: false });
  };

  const handleEventDrop = (info: EventDropArg) => {
    const newDate = info.event.startStr;
    const eventId = info.event.id;

    const task = tasks.find((t) => t.id === eventId);
    if (!task) return;

    // Validación según tipo de tarea
    if (!isValidTaskDate(task, newDate)) {
      info.revert();
      toast({
        variant: "destructive",
        title: "Error al planificar",
        description:
          task.type.name === "Cobertura"
            ? "Las tareas de cobertura solo pueden planificarse para el mes actual"
            : `Esta tarea solo puede planificarse entre ${task.startDate} y ${task.endDate}`,
      });
      return;
    }

    // Actualizamos datePlanned y mantenemos planned en true
    setTasks((prev) =>
      prev.map((t) =>
        t.id === eventId
          ? {
              ...t,
              datePlanned: newDate,
              planned: true, // Aseguramos que se mantenga como planificada
            }
          : t
      )
    );
  };
  return (
    <div className="min-h-screen bg-background">
      <div className="pl-16">
        <header className="flex h-16 items-center justify-between border-b px-4">
          <h1 className="text-2xl font-bold">Mis Tareas</h1>
          <Button
            onClick={() => router.push(ROUTES_EXECUTIVE.DESK_EXECUTIVE)}
            className="w-1/5 border-2 border-blue-500 text-blue-500 rounded-full font-bold bg-white shadow-md hover:shadow-lg active:shadow-sm active:translate-y-1 active:border-blue-700 transition-all duration-150 ease-in-out"
          >
            Volver a Dashboard
          </Button>
        </header>
        <div className="flex gap-4 p-4">
          {/* CALENDARIO */}
          <div className="flex-1">
            <div className="rounded-lg border bg-card">
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                locale={esLocale}
                dayCellContent={(args) => {
                  return args.dayNumberText.replace("2024-", "");
                }}
                eventTimeFormat={{
                  hour: "2-digit",
                  minute: "2-digit",
                  meridiem: false,
                }}
                dayHeaderFormat={{
                  weekday: "short",
                  day: "2-digit",
                  month: "2-digit",
                }}
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "dayGridMonth,timeGridWeek,timeGridDay",
                }}
                editable={true}
                droppable={true}
                eventDrop={handleEventDrop}
                eventReceive={handleEventReceive}
                eventDragStop={handleEventDragStop}
                events={plannedTasks}
                height="auto"
                // Añadir el manejador de eventos para clicks
                eventClick={(info) => {
                  // Verificar si el evento es de tipo cobertura

                  // console.log("click");

                  const task = tasks.find((t) => t.id === info.event.id);
                  if (task?.type.name === "Cobertura") {
                    setCoverageDialogForm({
                      open: true,
                      id: task.id,
                      datePlanned: task.plannedAt!,
                    });
                  }
                }}
              />
            </div>
          </div>

          {coverageDialogForm.open && (
            <CoverageFormDialog
              id={coverageDialogForm.id!}
              datePlanned={coverageDialogForm.datePlanned!}
              onClose={handleCloseCoverageFormDialog}
            />
          )}

          {/* COLUMNA LATERAL DERECHA */}
          <div className="w-80">
            <Card>
              <CardHeader>
                <CardTitle>Mis tareas sin planificar</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]" ref={unplannedContainerRef}>
                  <div className="space-y-4">
                    {unplannedTasks.map((task) => (
                      <div
                        key={task.id}
                        className="fc-event"
                        // data-event para FullCalendar pasadaa a json
                        data-event={JSON.stringify(task)}
                        draggable
                      >
                        <TaskCard task={task} />
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
