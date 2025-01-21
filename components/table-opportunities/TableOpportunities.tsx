"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  Eye,
  FileDown,
  FilterX,
  Settings2,
  X,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import DialogTableOpportunityForm from "./dialogs-table-oportunities/DialogTableOpportunityForm";
import {
  columnConfig,
  ColumnConfig,
  Opportunity,
} from "@/constants/column-config.constant";
import { GetOpportunitiesByIDExecutive } from "@/interfaces/opportunities/get-opportunities-by-executiveId.interface";
import { ErrorResp } from "@/interfaces/error-resp/get-roles-error.interface";
import { exportToPDF } from "@/utils/exportToPDF";

interface Props {
  response: GetOpportunitiesByIDExecutive[] | ErrorResp | [];
}

function TableOpportunities(props: Props) {
  const { response } = props;
  const searchParams = useSearchParams();
  const stateFilter = searchParams.get("state");

  const [columns, setColumns] = useState<ColumnConfig[]>(columnConfig);
  const initialColumnOrder = [...columnConfig];
  const [data, setData] = useState<Opportunity[]>([]);
  const [filteredData, setFilteredData] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [activeFilter, setActiveFilter] = useState<keyof Opportunity | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] =
    useState<Opportunity | null>(null);

  useEffect(() => {
    const mapData = async () => {
      setLoading(true);
      try {
        if (Array.isArray(response)) {
          const mappedData = response.flatMap((opportunity) =>
            opportunity.childs.map((child) => ({
              id: child.id,
              estado: child.status?.status || "Sin estado",
              oportunidadPadre: opportunity.opportunityName || "Sin nombre",
              oportunidadHija: String(child.productLine.name) || "Sin línea", // Conversión explícita a string
              tipoProyecto: String(opportunity.projectType.name) || "Sin tipo", // Conversión explícita a string
              nombreCliente: opportunity.client?.name || "Cliente desconocido",
              rut: opportunity.client?.rut || "Sin RUT",
              ingresos: child.availableBudget || 0,
              fechaInicio: child.startDate
                ? new Date(child.startDate).toLocaleDateString()
                : "Sin fecha",
              fechaCierre: child.endDate
                ? new Date(child.endDate).toLocaleDateString()
                : "Sin fecha",
            }))
          );

          const filteredData = stateFilter
            ? mappedData.filter((opportunity) =>
                opportunity.estado
                  .toLowerCase()
                  .includes(stateFilter.toLowerCase())
              )
            : mappedData;

          setFilteredData(filteredData);
          setData(mappedData as Opportunity[]);
        }
      } catch (error) {
        console.error("Error al cargar oportunidades:", error);
      } finally {
        setLoading(false);
      }
    };

    mapData();
  }, [response, stateFilter]);

  const handleFilterChange = (key: keyof Opportunity, value: string) => {
    const sourceData = stateFilter
      ? data.filter((row) =>
          row.estado.toLowerCase().includes(stateFilter.toLowerCase())
        )
      : data;

    if (value.trim() === "") {
      setFilteredData(sourceData);
    } else {
      const filtered = sourceData.filter((row) =>
        String(row[key]).toLowerCase().includes(value.toLowerCase())
      );
      setFilteredData(filtered);
    }

    setCurrentPage(1);
  };

  const clearFilter = () => {
    setActiveFilter(null);

    const resetData = stateFilter
      ? data.filter((row) =>
          row.estado.toLowerCase().includes(stateFilter.toLowerCase())
        )
      : data;

    setFilteredData(resetData);
    setCurrentPage(1);

    setColumns(initialColumnOrder.map((col) => ({ ...col })));
  };

  const toggleColumn = (key: keyof Opportunity) => {
    setColumns(
      columns.map((col) =>
        col.key === key ? { ...col, visible: !col.visible } : col
      )
    );
  };

  const paginatedFilteredData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleOpenDialog = (
    opportunity: React.SetStateAction<Opportunity | null>
  ) => {
    setSelectedOpportunity(opportunity);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedOpportunity(null);
    setIsDialogOpen(false);
  };

  const handlePageChange = (newPage: number) => {
    setLoading(true);
    setTimeout(() => {
      setCurrentPage(newPage);
      setLoading(false);
    }, 500);
  };

  const handleDragStart = (
    event: React.DragEvent<HTMLTableCellElement>,
    index: number
  ) => {
    event.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragOver = (event: React.DragEvent<HTMLTableCellElement>) => {
    event.preventDefault();
  };

  const handleDrop = (
    event: React.DragEvent<HTMLTableCellElement>,
    targetIndex: number
  ) => {
    event.preventDefault();
    const sourceIndex = parseInt(event.dataTransfer.getData("text/plain"), 10);
    const updatedColumns = [...columns];

    const [removedColumn] = updatedColumns.splice(sourceIndex, 1);
    updatedColumns.splice(targetIndex, 0, removedColumn);

    setColumns(updatedColumns);
  };

  const saveConfig = () => {
    console.log(columns);
  };

  return (
    <div className="min-w-[1200px] max-w-[1200px] ">
      <div className="w-full flex items-center gap-2 bg-gray-100 py-4 pl-2 border-t-[1px] border-l-[1px] border-r-[1px] border-gray-200">
        <Button
          className="border-2 border-blue-500 text-blue-500 rounded-full font-bold bg-white shadow-md hover:shadow-lg active:shadow-sm active:translate-y-1 active:border-blue-700 transition-all duration-150 ease-in-out"
          onClick={clearFilter}
        >
          <FilterX className="mr-2 h-4 w-4" />
          Reestablecer Tabla
        </Button>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="border-2 border-blue-500 text-blue-500 rounded-full font-bold bg-white shadow-md hover:shadow-lg active:shadow-sm active:translate-y-1 active:border-blue-700 transition-all duration-150 ease-in-out">
              <Settings2 className="mr-2 h-4 w-4" />
              Configurar tabla
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px] fade-in">
            <DialogHeader>
              <DialogTitle>Columnas tabla de oportunidades</DialogTitle>
              <DialogDescription>
                En esta sección podrá marcar las columnas que desee visualizar.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-3 gap-4 py-4">
              {columns.map((column) => (
                <div
                  key={column.key}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm">{column.label}</span>
                  <Switch
                    checked={column.visible}
                    className="bg-blue-600"
                    onCheckedChange={() => toggleColumn(column.key)}
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <Button
                className="border-2 border-blue-500 text-blue-500 rounded-full font-bold bg-white shadow-md hover:shadow-lg active:shadow-sm active:translate-y-1 active:border-blue-700 transition-all duration-150 ease-in-out"
                onClick={() => saveConfig()}
              >
                Guardar Configuración
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Button
          className="border-2 border-blue-500 text-blue-500 rounded-full font-bold bg-white shadow-md hover:shadow-lg active:shadow-sm active:translate-y-1 active:border-blue-700 transition-all duration-150 ease-in-out"
          onClick={() => exportToPDF(paginatedFilteredData, columns)}
        >
          <FileDown className="mr-2 h-4 w-4" />
          Exportar como PDF
        </Button>
      </div>

      <div className="border">
        <Table>
          <TableHeader className="bg-gray-100">
            <TableRow>
              {columns.map((column, index) =>
                column.visible ? (
                  <TableHead
                    key={column.key}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                  >
                    <div className="flex items-center  fade-in">
                      {activeFilter === column.key ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            className="border rounded px-2 py-1 text-sm"
                            placeholder={`Filtrar por ${column.label}`}
                            onChange={(e) =>
                              handleFilterChange(column.key, e.target.value)
                            }
                          />
                          <X
                            className="cursor-pointer text-red-500"
                            onClick={clearFilter}
                          />
                        </div>
                      ) : (
                        <span
                          className="cursor-pointer font-bold"
                          onClick={() => setActiveFilter(column.key)}
                        >
                          {column.label}
                        </span>
                      )}
                    </div>
                  </TableHead>
                ) : null
              )}
              <TableHead>Acción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className=" fade-in">
            {loading
              ? Array.from({ length: 10 }).map((_, index) => (
                  <TableRow key={index}>
                    {Array.from({ length: columns.length }).map((_, idx) => (
                      <TableCell key={idx}>
                        <Skeleton className="h-9 min-w-full rounded bg-gray-200 animate-pulse " />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : paginatedFilteredData.map((row) => (
                  <TableRow key={row.id} className="fade-in">
                    {columns
                      .filter((col) => col.visible)
                      .map((column) => (
                        <TableCell key={column.key}>
                          {column.key === "estado" ? (
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
                          ) : column.key === "ingresos" ? (
                            `$${row[column.key].toLocaleString()}`
                          ) : (
                            row[column.key]
                          )}
                        </TableCell>
                      ))}
                    <TableCell>
                      <Button
                        className=" text-blue-500 rounded-full font-bold bg-white shadow-md hover:shadow-lg active:shadow-sm active:translate-y-1 active:border-blue-700 transition-all duration-150 ease-in-out"
                        onClick={() => handleOpenDialog(row)}
                      >
                        <Eye className="h-4 w-4 text-blue-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-center py-4">
        <Button
          disabled={currentPage === 1}
          className=" text-blue-500 rounded-full font-bold bg-white shadow-md hover:shadow-lg active:shadow-sm active:translate-y-1 active:border-blue-700 transition-all duration-150 ease-in-out"
          onClick={() => handlePageChange(currentPage - 1)}
        >
          <ChevronLeftIcon /> Anterior
        </Button>
        <span>
          Página {currentPage} de {totalPages}
        </span>
        <Button
          disabled={currentPage === totalPages}
          className=" text-blue-500 rounded-full font-bold bg-white shadow-md hover:shadow-lg active:shadow-sm active:translate-y-1 active:border-blue-700 transition-all duration-150 ease-in-out"
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Siguiente <ChevronRightIcon />
        </Button>
      </div>
      {isDialogOpen && selectedOpportunity && (
        <DialogTableOpportunityForm
          opportunity={selectedOpportunity!}
          onClose={handleCloseDialog}
        />
      )}
    </div>
  );
}

export default TableOpportunities;
