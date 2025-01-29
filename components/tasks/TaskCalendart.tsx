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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ROUTES_EXECUTIVE from "@/constants/routes";
import { useRouter } from "next/navigation";

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

interface NewTask extends Partial<Task> {
  type: Task["type"];
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

export default function TaskCalendar() {
  const router = useRouter();
  const unplannedContainerRef = useRef<HTMLDivElement | null>(null);

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
      start: "",
      client: "Nombre cliente",
      documentId: "11.111.111-1",
      type: "cotizacion",
      color: "#f59e0b",
    },
    {
      id: "4",
      planned: false,
      title: "Seguimiento Cotización - Cliente 4",
      start: "",
      client: "Nombre cliente",
      documentId: "11.111.111-1",
      type: "seguimiento-cotizacion",
      color: "#8B5CF6",
    },
  ]);

  // Datos temporales para crear nueva tarea
  const [newTask, setNewTask] = useState<NewTask>({
    title: "",
    client: "",
    documentId: "",
    type: "cobertura",
  });

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

  const handleAddTask = () => {
    if (!newTask.title) return;

    const isPlanned = Boolean(newTask.start);
    const newId = Date.now().toString();

    const finalTask: Task = {
      id: newId,
      planned: isPlanned,
      title: newTask.title,
      start: newTask.start || "",
      client: newTask.client || "",
      documentId: newTask.documentId || "",
      type: newTask.type || "cobertura",
      color:
        newTask.type === "cobertura"
          ? "#3b82f6"
          : newTask.type === "linea-credito"
          ? "#14b8a6"
          : newTask.type === "cotizacion"
          ? "#f59e0b"
          : "#8b5cf6",
    };

    setTasks((prev) => [...prev, finalTask]);
    setNewTask({ title: "", client: "", documentId: "", type: "cobertura" });
  };

  // arrastrar para cambiar de estado y fecha
  const handleEventReceive = (info: EventReceiveArg) => {
    const dataStr = info.draggedEl.getAttribute("data-event");
    if (!dataStr) return;

    const droppedTask = JSON.parse(dataStr) as Task;

    // Pasamos esa tarea a planned=true, con la fecha
    setTasks((prev) =>
      prev.map((t) =>
        t.id === droppedTask.id
          ? { ...t, planned: true, start: info.event.startStr }
          : t
      )
    );

    // propiedades que se veran de la tarea en el calendario
    info.event.setProp("title", droppedTask.title);
    info.event.setProp("id", droppedTask.id);
    info.event.setProp("color", droppedTask.color);
  };

  // arrastrar y cambiar el estado hablar con Jean para cmapo planned
  const handleEventDragStop = (info: EventDragStopArg) => {
    if (isOverUnplannedContainer(info.jsEvent)) {
      console.log("Se arrastró el evento al contenedor sin planificar");
      info.event.remove();

      const eventId = info.event.id;
      setTasks((prev) =>
        prev.map((t) =>
          t.id === eventId ? { ...t, planned: false, start: "" } : t
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
                eventReceive={handleEventReceive}
                eventDragStop={handleEventDragStop}
                events={plannedTasks}
                height="auto"
              />
            </div>
          </div>

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

            {/* Modal: Crear nueva tarea consultar si el ejecutivo puede crear tareaas */}
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full mt-4">Agregar nueva tarea</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Agregar nueva tarea</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  {/* Título */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">
                      Título
                    </Label>
                    <Input
                      id="title"
                      value={newTask.title}
                      onChange={(e) =>
                        setNewTask({ ...newTask, title: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>
                  {/* Cliente */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="client" className="text-right">
                      Cliente
                    </Label>
                    <Input
                      id="client"
                      value={newTask.client}
                      onChange={(e) =>
                        setNewTask({ ...newTask, client: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>
                  {/* Documento */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="documentId" className="text-right">
                      ID Documento
                    </Label>
                    <Input
                      id="documentId"
                      value={newTask.documentId}
                      onChange={(e) =>
                        setNewTask({ ...newTask, documentId: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>
                  {/* Tipo de tarea */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="type" className="text-right">
                      Tipo
                    </Label>
                    <select
                      id="type"
                      value={newTask.type}
                      onChange={(e) =>
                        setNewTask({
                          ...newTask,
                          type: e.target.value as Task["type"],
                        })
                      }
                      className="col-span-3"
                    >
                      <option value="cobertura">Cobertura</option>
                      <option value="linea-credito">Línea de crédito</option>
                      <option value="cotizacion">Cotización</option>
                      <option value="seguimiento-cotizacion">
                        Seguimiento cotización
                      </option>
                    </select>
                  </div>
                  {/* Fecha (opcional). Si Pongo la fecha => planned=true */}
                  {/* <Input type="date" .../> */}
                </div>
                <Button onClick={handleAddTask}>Agregar tarea</Button>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}
