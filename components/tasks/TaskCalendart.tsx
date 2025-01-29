"use client";

import { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, {
  Draggable,
  EventReceiveArg,
  EventDragStopArg,
} from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

import ROUTES_EXECUTIVE from "@/constants/routes";
import { useRouter } from "next/navigation";
import { CoverageFormDialog } from "../forms/tasks/CoverageFormDialog";
import { EventDropArg } from "@fullcalendar/core/index.js";
import { toast } from "@/hooks/use-toast";

type TaskType =
  | "cobertura"
  | "linea-credito"
  | "cotizacion"
  | "seguimiento-cotizacion";

interface Task {
  id: string;
  planned: boolean;
  title: string;
  start: string;
  end?: string;
  client: string;
  documentId: string;
  type: TaskType;
  color?: string;
}

// ICONO SEGUN TIPO
function getIconByType(type: TaskType) {
  switch (type) {
    case "cobertura":
      return "⚠️";
    case "linea-credito":
      return "❗";
    case "cotizacion":
      return "📄";
    case "seguimiento-cotizacion":
      return "📑";
    default:
      return "📌";
  }
}
// LABEL DEL TIPO
function getTypeLabel(type: TaskType) {
  switch (type) {
    case "cobertura":
      return "Cobertura";
    case "linea-credito":
      return "Línea de crédito";
    case "cotizacion":
      return "Cotización";
    case "seguimiento-cotizacion":
      return "Seguimiento cotización";
    default:
      return type;
  }
}

/** Tarjeta con el diseño e íconos para las tareas */
function TaskCard({ task }: { task: Task }) {
  const icon = getIconByType(task.type);
  const typeLabel = getTypeLabel(task.type);
  const dateLabel = task.start || "Sin fecha";

  return (
    <div className="fade-in relative rounded-lg border border-gray-200 bg-white p-3 shadow text-sm text-gray-800">
      {/* Barra de color en el lado izquierdo */}
      <div
        className="absolute inset-y-0 left-0 w-2 rounded-tl-lg rounded-bl-lg"
        style={{ backgroundColor: task.color }}
      />
      {/* Ícono en la esquina superior derecha */}
      <div className="absolute top-2 right-2 text-xl">{icon}</div>

      <h2 className="font-bold text-sm mb-1">{typeLabel}</h2>
      <p className="text-xs text-gray-700">
        <strong>{task.client}</strong>
      </p>
      <p className="text-xs text-gray-700 mb-1">{task.documentId}</p>
      <p className="text-xs text-gray-800 mb-2">{task.title}</p>
      <p className="text-xs text-gray-600">
        <strong>Fecha:</strong> {dateLabel}
      </p>
    </div>
  );
}

// AUXILIAR OARA VER SI LAS FECHAS ESTAN DENTRO DEL MSS

const isInCurrentMonth = (dateStr: string): boolean => {
  console.log("incurrent month auxiliar fecha del arrastre-> ", dateStr);

  if (!dateStr) return false;

  // DIVIDO LA FECHA EN DISTINTOS COMPONENTES
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const now = new Date();

  const currentDate = new Date(now.getFullYear(), now.getMonth());
  const targetDate = new Date(date.getFullYear(), date.getMonth());

  // console.log("Fecha actual:", currentDate);
  // console.log("Fecha objetivo:", targetDate);
  console.log("Son iguales:", currentDate.getTime() === targetDate.getTime());

  return currentDate.getTime() === targetDate.getTime();
};

export default function TaskCalendar() {
  interface CoverageDialogProps {
    open: boolean;
    id?: string;
  }

  const router = useRouter();
  const unplannedContainerRef = useRef<HTMLDivElement | null>(null);
  const [coverageDialogForm, setCoverageDialogForm] =
    useState<CoverageDialogProps>({ open: false, id: "" });
  // DEFINI LAS PLANIFICADAS O NO BAJO UN CAMPO PLANNED TRUE O FALSE
  // ASI MUESTRO EN EL CALENDARIO LAS PLANIFICADAS Y EN LA LISTA LAS NO PLANIFICADAS
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      planned: false,
      title: "Cobertura - Cliente 1",
      start: "2024-01-08",
      client: "Nombre cliente",
      documentId: "11.111.111-1",
      type: "cobertura",
      color: "#3b82f6",
    },
    {
      id: "2",
      planned: false,
      title: "Línea de crédito - Cliente 2",
      start: "2024-01-15",
      client: "Nombre cliente",
      documentId: "11.111.111-1",
      type: "linea-credito",
      color: "#14b8a6",
    },
    {
      id: "3",
      planned: false,
      title: "Cotización - Cliente 3",
      start: "2024-01-16",
      client: "Nombre cliente",
      documentId: "11.111.111-1",
      type: "cotizacion",
      color: "#f59e0b",
    },
    {
      id: "4",
      planned: false,
      title: "Seguimiento Cotización - Cliente 4",
      start: "2024-01-17",
      client: "Nombre cliente",
      documentId: "11.111.111-1",
      type: "seguimiento-cotizacion",
      color: "#8B5CF6",
    },
    {
      id: "5",
      planned: false,
      title: "Cobertura - Cliente 5",
      start: "2024-01-08",
      client: "Nombre cliente",
      documentId: "11.111.111-1",
      type: "cobertura",
      color: "#3b82f6",
    },
  ]);

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

  const plannedTasks = tasks.filter((t) => t.planned);
  const unplannedTasks = tasks.filter((t) => !t.planned);

  // const handleAddTask = () => {
  //   if (!newTask.title) return;

  //   const isPlanned = Boolean(newTask.start);
  //   const newId = Date.now().toString();

  //   const finalTask: Task = {
  //     id: newId,
  //     planned: isPlanned,
  //     title: newTask.title,
  //     start: newTask.start || "",
  //     client: newTask.client || "",
  //     documentId: newTask.documentId || "",
  //     type: newTask.type || "cobertura",
  //     color:
  //       newTask.type === "cobertura"
  //         ? "#3b82f6"
  //         : newTask.type === "linea-credito"
  //         ? "#14b8a6"
  //         : newTask.type === "cotizacion"
  //         ? "#f59e0b"
  //         : "#8b5cf6",
  //   };

  //   setTasks((prev) => [...prev, finalTask]);
  //   setNewTask({ title: "", client: "", documentId: "", type: "cobertura" });
  // };

  // ARRASTRO Y OBTENGO LA DATA
  const handleEventReceive = (info: EventReceiveArg) => {
    const dataStr = info.draggedEl.getAttribute("data-event");

    console.log("dataStr", dataStr);

    if (!dataStr) return;

    const droppedTask = JSON.parse(dataStr) as Task;
    const targetDate = info.event.startStr;

    // AQUI HAGO LA VALIDACION DEL MES
    if (!isInCurrentMonth(targetDate)) {
      // SI NO REVIERTO LA ACCION DEL DRAG AN DROP
      info.revert();
      toast({
        variant: "destructive",
        title: "Error al planificar",
        description: "Solo se pueden planificar tareas para el mes actual",
      });
      return;
    }

    // Y SI LA FECHA ES VALIDA ENVIAR EL EVENTO
    setTasks((prev) =>
      prev.map((t) =>
        t.id === droppedTask.id ? { ...t, planned: true, start: targetDate } : t
      )
    );

    info.event.setProp("title", droppedTask.title);
    info.event.setProp("id", droppedTask.id);
    info.event.setProp("color", droppedTask.color);
  };

  const handleEventDragStop = (info: EventDragStopArg) => {
    if (isOverUnplannedContainer(info.jsEvent)) {
      const eventId = info.event.id;

      // AQUI GUARDO LA FECHA ANTES DE GUARADAR EL OBJETO
      const currentDate = info.event.startStr;

      info.event.remove();

      // LE PASO LA FECHA  A LA TAREA ENCONTRADA
      setTasks((prev) =>
        prev.map((t) =>
          t.id === eventId
            ? {
                ...t,
                planned: false,
                start: currentDate,
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

    // Validar si la fecha de la tarea es del mes actual
    if (!isInCurrentMonth(newDate)) {
      info.revert();
      toast({
        variant: "destructive",
        title: "Error al planificar",
        description: "Solo se pueden planificar tareas para el mes actual",
      });
      return;
    }

    // Actualizar la fecha de la tarea cuando se mueve dentro del calendario
    const eventId = info.event.id;
    setTasks((prev) =>
      prev.map((t) => (t.id === eventId ? { ...t, start: newDate } : t))
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

                  console.log("click");

                  const task = tasks.find((t) => t.id === info.event.id);
                  if (task?.type === "cobertura") {
                    setCoverageDialogForm({ open: true, id: task.id });
                  }
                }}
              />
            </div>
          </div>

          {coverageDialogForm.open && (
            <CoverageFormDialog
              id={coverageDialogForm.id!}
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
