// components/mobile/MobileCard.tsx
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon, ChevronUpIcon, Eye } from "lucide-react";
import { Opportunity } from "@/constants/column-config.constant";

interface Props {
  row: Opportunity;
  expandedCardId: string | null;
  handleCardClick: (id: string) => void;
  handleOpenDialog: (opportunity: Opportunity) => void;
}

export const MobileCard = (props: Props) => {
  const { row, expandedCardId, handleCardClick, handleOpenDialog } = props;
  return (
    <div
      key={row.id}
      className="p-4 bg-white shadow rounded-lg"
      onClick={() => handleCardClick(row.id)}
    >
      <div className="flex justify-between items-center">
        <div>
          <p className="font-bold">{row.oportunidadPadre}</p>
          <p>{row.nombreCliente}</p>
        </div>
        <Badge
          className={
            {
              inicio: "bg-orange-500 text-white",
              "POR VENCER": "bg-red-500 text-white",
              cotizada: "bg-blue-500 text-white",
              TERMINADA: "bg-green-500 text-white",
            }[row.estado] || "bg-gray-300 text-black"
          }
        >
          {row.estado}
        </Badge>
      </div>
      {expandedCardId === row.id && (
        <div className="mt-4 space-y-2 fade-in">
          <p>
            <strong>Oportunidad Hija:</strong> {row.oportunidadHija}
          </p>
          <p>
            <strong>Tipo de Proyecto:</strong> {row.tipoProyecto}
          </p>
          <p>
            <strong>RUT:</strong> {row.rut}
          </p>
          <p>
            <strong>Ingresos:</strong> ${row.ingresos.toLocaleString()}
          </p>
          <p>
            <strong>Fecha Inicio:</strong> {row.fechaInicio}
          </p>
          <p>
            <strong>Fecha Cierre:</strong> {row.fechaCierre}
          </p>
          <Button
            className="mt-2 text-blue-500 rounded-full font-bold bg-white shadow-md hover:shadow-lg active:shadow-sm active:translate-y-1 active:border-blue-700 transition-all duration-150 ease-in-out"
            onClick={(e) => {
              e.stopPropagation();
              handleOpenDialog(row);
            }}
          >
            <Eye className="h-4 w-4 text-blue-500 mr-2" />
            Ver Detalles
          </Button>
        </div>
      )}

      <div className="flex justify-center items-center mt-2">
        {expandedCardId === row.id ? (
          <ChevronUpIcon className="h-5 w-5 text-gray-600" />
        ) : (
          <ChevronDownIcon className="h-5 w-5 text-gray-600" />
        )}
      </div>
    </div>
  );
};
