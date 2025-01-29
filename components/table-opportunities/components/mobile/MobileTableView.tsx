import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  Eye,
  FileDown,
  FilterX,
} from "lucide-react";
import PaginationTable from "../paginacion/PaginationTable";

interface Opportunity {
  id: string;
  estado: string;
  oportunidadPadre: string;
  oportunidadHija: string;
  tipoProyecto: string;
  nombreCliente: string;
  rut: string;
  ingresos: number;
  fechaInicio: string;
  fechaCierre: string;
}

interface Props {
  loading?: boolean;
  paginatedFilteredData?: Opportunity[];
  expandedCardId?: string | null;
  handleCardClick?: (id: string) => void;
  handleOpenDialog?: (opportunity: Opportunity) => void;
  handleOpenPdfDialog?: () => void;
  clearFilter?: () => void;
  handleFilterChange?: (key: keyof Opportunity, value: string) => void;
  currentPage?: number;
  totalPages?: number;
  handlePageChange?: (page: number) => void;
  searchTerm?: string;
  setSearchTerm?: (value: string) => void;
  filteredData?: Opportunity[];
}

const MobileTableView = (props: Props) => {
  const {
    loading = false,
    paginatedFilteredData = [],
    expandedCardId = null,
    handleCardClick = () => {},
    handleOpenDialog = () => {},
    handleOpenPdfDialog = () => {},
    clearFilter = () => {},
    handleFilterChange = () => {},
    currentPage = 1,
    totalPages = 1,
    handlePageChange = () => {},
    searchTerm = "",
    setSearchTerm = () => {},
    filteredData = [],
  } = props;
  return (
    <div className="w-full p-2">
      <div className="w-full flex flex-wrap justify-center gap-2 bg-gray-100 py-4 px-2 border-t-[1px] border-l-[1px] border-r-[1px] border-gray-200">
        <Input
          type="text"
          placeholder="Buscar..."
          className="w-full p-2 border-[1px] border-primary-blue rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            handleFilterChange("oportunidadPadre", e.target.value);
          }}
        />

        <Button
          className="border-2 border-blue-500 text-blue-500 rounded-full font-bold bg-white shadow-md hover:shadow-lg active:shadow-sm active:translate-y-1 active:border-blue-700 transition-all duration-150 ease-in-out"
          onClick={clearFilter}
        >
          <FilterX className="mr-2 h-4 w-4" />
          Reestablecer
        </Button>

        <Button
          className="border-2 border-blue-500 text-blue-500 rounded-full font-bold bg-white shadow-md hover:shadow-lg active:shadow-sm active:translate-y-1 active:border-blue-700 transition-all duration-150 ease-in-out"
          onClick={handleOpenPdfDialog}
        >
          <FileDown className="mr-2 h-4 w-4" />
          Exportar PDF
        </Button>
      </div>

      <div className="space-y-2 p-2">
        {loading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="p-4 bg-white shadow rounded-lg">
              <Skeleton className="h-6 w-full rounded bg-gray-200 animate-pulse" />
            </div>
          ))
        ) : paginatedFilteredData && paginatedFilteredData.length > 0 ? (
          paginatedFilteredData.map((row) => (
            <div
              key={row.id}
              className="p-4 bg-white shadow rounded-lg cursor-pointer"
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
                    <Eye className="h-4 w-4 text-blue-500" />
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
          ))
        ) : (
          <div className="text-center p-4">No hay datos disponibles</div>
        )}
      </div>

      {filteredData && filteredData.length > 0 && (
     <PaginationTable currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange }     
     />
      )}
    </div>
  );
};

export default MobileTableView;
