
import { Task, TaskType } from "@/interfaces/task/task.interface";
import { formatDateIsoToString } from "@/utils/formatDate";


// ICONO SEGUN TIPO
function getIconByType(type: TaskType) {
  switch (type.name) {
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
  switch (type.name) {
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

interface Props {
  task: Task;
}

/** Tarjeta con el diseño e íconos para las tareas */
function TaskCard(props: Props) {
  const { task } = props;
  const icon = getIconByType(task.type.name as unknown as TaskType);
  const typeLabel = getTypeLabel(task.type.name as unknown as TaskType);
  const dateLabel = task.plannedAt
    ? formatDateIsoToString(task.plannedAt)
    : "Sin fecha";

  return (
    <div className="fade-in relative rounded-lg border border-gray-200 bg-white p-3 shadow text-sm text-gray-800">
      {/* Barra de color en el lado izquierdo */}
      <div
        className="absolute inset-y-0 left-0 w-2 rounded-tl-lg rounded-bl-lg"
        style={{ backgroundColor: task.color }}
      />
      {/* Ícono en la esquina superior derecha */}
      <div className="absolute top-2 right-2 text-xl">{icon}</div>

      <h2 className="font-bold text-sm mb-1">{typeLabel as string}</h2>
      <p className="text-xs text-gray-700">
        <strong>{task.childOpportunity.parentOpportunity.client.name}</strong>
      </p>
      <p className="text-xs text-gray-700 mb-1">{task.childOpportunity.parentOpportunity.client.rut}</p>
      <p className="text-xs text-gray-800 mb-2">{task.taskName}</p>

      <div className="flex flex-col">
        <span>Fecha inicio: {formatDateIsoToString(task.startDate)}</span>
        <span>Fecha fin: {formatDateIsoToString(task.endDate)}</span>
        <span>Fecha de planificación: {dateLabel}</span>
      </div>
    </div>
  );
}

export default TaskCard;
