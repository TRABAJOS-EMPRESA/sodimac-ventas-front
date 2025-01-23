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
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  Eye,
  FileDown,
  FilterX,
  Loader2,
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
import { Input } from "../ui/input";
import { editSettingsTable } from "@/actions/settings-table/edit-settings-table.action";
import { toast } from "@/hooks/use-toast";

interface Props {
  opportunitiesResp: GetOpportunitiesByIDExecutive[] | ErrorResp | [];
  settingsTable: ColumnConfig[] | ErrorResp;
}

function TableOpportunities(props: Props) {
  const { opportunitiesResp, settingsTable } = props;
  const searchParams = useSearchParams();
  const stateFilter = searchParams.get("state");

  // TODO como respondo un error o la config debo preguntar si es array
  const [columns, setColumns] = useState<ColumnConfig[]>(
    Array.isArray(settingsTable) ? settingsTable : []
  );
  const initialColumnOrder = [...columnConfig];
  const [data, setData] = useState<Opportunity[]>([]);
  const [filteredData, setFilteredData] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingSaveConfig, setLoadingSaveConfig] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [activeFilter, setActiveFilter] = useState<keyof Opportunity | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDialogConfigOpen, setIsDialogConfigOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] =
    useState<Opportunity | null>(null);
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda

  useEffect(() => {
    const mapData = async () => {
      setLoading(true);
      try {
        if (Array.isArray(opportunitiesResp)) {
          const mappedData = opportunitiesResp.flatMap((opportunity) =>
            opportunity.childs.map((child) => ({
              id: child.id,
              estado: child.status?.status || "Sin estado",
              oportunidadPadre: opportunity.opportunityName || "Sin nombre",
              oportunidadHija: String(child.productLine.name) || "Sin línea",
              tipoProyecto: String(opportunity.projectType.name) || "Sin tipo",
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
  }, [opportunitiesResp, stateFilter]);

  const handleCardClick = (id: string) => {
    setExpandedCardId(expandedCardId === id ? null : id);
  };

  const paginatedFilteredData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (newPage: number) => {
    setLoading(true);
    setTimeout(() => {
      setCurrentPage(newPage);
      setLoading(false);
    }, 500);
  };

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

  const saveConfig = async () => {
    setLoadingSaveConfig(true);
    try {
      const respEditSettings = await editSettingsTable(columns);
      console.log("editSettings", respEditSettings);

      toast({
        title: "Configuración guardada",
        description:
          "La configuración de la tabla se ha guardado correctamente",
        className: "bg-primary-blue text-primary-white",
        duration: 5000,
      });

      setIsDialogConfigOpen(false);
    } catch (error) {
      console.log("error", error);

      toast({
        title: "Error",
        description: "No se pudo guardar la configuración",
        variant: "destructive",
        duration: 2000,
      });
    } finally {
      setLoadingSaveConfig(false);
    }
  };
  return (
    <div>
      {/* Vista de Escritorio */}
      <div className="hidden md:block">
        <div className="min-w-[1200px] max-w-[1200px]">
          <div className="w-full flex items-center gap-2 bg-gray-100 py-4 pl-2 border-t-[1px] border-l-[1px] border-r-[1px] border-gray-200">
            <Button
              className="border-2 border-blue-500 text-blue-500 rounded-full font-bold bg-white shadow-md hover:shadow-lg active:shadow-sm active:translate-y-1 active:border-blue-700 transition-all duration-150 ease-in-out"
              onClick={clearFilter}
            >
              <FilterX className="mr-2 h-4 w-4" />
              Reestablecer Tabla
            </Button>

            <Dialog
              open={isDialogConfigOpen}
              onOpenChange={setIsDialogConfigOpen}
            >
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
                    En esta sección podrá marcar las columnas que desee
                    visualizar.
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
                    className="w-1/3 border-2 border-blue-500 text-blue-500 rounded-full font-bold bg-white shadow-md hover:shadow-lg active:shadow-sm active:translate-y-1 active:border-blue-700 transition-all duration-150 ease-in-out"
                    onClick={() => saveConfig()}
                  >
                    {loadingSaveConfig ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      "Guardar configuración"
                    )}
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
                        <div className="flex items-center fade-in">
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
              <TableBody className="fade-in">
                {loading
                  ? Array.from({ length: 10 }).map((_, index) => (
                      <TableRow key={index}>
                        {Array.from({ length: columns.length }).map(
                          (_, idx) => (
                            <TableCell key={idx}>
                              <Skeleton className="h-9 min-w-full rounded bg-gray-200 animate-pulse" />
                            </TableCell>
                          )
                        )}
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
                            className="text-blue-500 rounded-full font-bold bg-white shadow-md hover:shadow-lg active:shadow-sm active:translate-y-1 active:border-blue-700 transition-all duration-150 ease-in-out"
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

          {filteredData.length > 0 && (
            <div className="flex justify-between items-center py-4">
              <Button
                disabled={currentPage === 1}
                className="text-blue-500 rounded-full font-bold bg-white shadow-md hover:shadow-lg active:shadow-sm active:translate-y-1 active:border-blue-700 transition-all duration-150 ease-in-out"
                onClick={() => handlePageChange(currentPage - 1)}
              >
                <ChevronLeftIcon /> Anterior
              </Button>
              <span>
                Página {currentPage} de {totalPages}
              </span>
              <Button
                disabled={currentPage === totalPages}
                className="text-blue-500 rounded-full font-bold bg-white shadow-md hover:shadow-lg active:shadow-sm active:translate-y-1 active:border-blue-700 transition-all duration-150 ease-in-out"
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Siguiente <ChevronRightIcon />
              </Button>
            </div>
          )}

          {isDialogOpen && selectedOpportunity && (
            <DialogTableOpportunityForm
              opportunity={selectedOpportunity!}
              onClose={handleCloseDialog}
            />
          )}
        </div>
      </div>

      {/* Vista Móvil */}
      <div className="block md:hidden">
        <div className="w-full p-2">
          <div className="w-full flex flex-wrap justify-center gap-2 bg-gray-100 py-4 px-2 border-t-[1px] border-l-[1px] border-r-[1px] border-gray-200">
            {/* Input de búsqueda version mobil */}
            <Input
              type="text"
              placeholder="Buscar..."
              className="w-full p-2 border-[1px] border-primary-blue rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                handleFilterChange("oportunidadPadre", e.target.value); // Reutilizamos handleFilterChange
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
              onClick={() => exportToPDF(paginatedFilteredData, columns)}
            >
              <FileDown className="mr-2 h-4 w-4" />
              Exportar PDF
            </Button>
          </div>

          <div className="space-y-2 p-2">
            {loading
              ? Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="p-4 bg-white shadow rounded-lg">
                    <Skeleton className="h-6 w-full rounded bg-gray-200 animate-pulse" />
                  </div>
                ))
              : paginatedFilteredData.map((row) => (
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
                          <strong>Oportunidad Hija:</strong>{" "}
                          {row.oportunidadHija}
                        </p>
                        <p>
                          <strong>Tipo de Proyecto:</strong> {row.tipoProyecto}
                        </p>
                        <p>
                          <strong>RUT:</strong> {row.rut}
                        </p>
                        <p>
                          <strong>Ingresos:</strong> $
                          {row.ingresos.toLocaleString()}
                        </p>
                        <p>
                          <strong>Fecha Inicio:</strong> {row.fechaInicio}
                        </p>
                        <p>
                          <strong>Fecha Cierre:</strong> {row.fechaCierre}
                        </p>
                        <Button
                          className="mt-2 text-blue-500 rounded-full font-bold bg-white shadow-md hover:shadow-lg active:shadow-sm active:translate-y-1 active:border-blue-700 transition-all duration-150 ease-in-out"
                          onClick={() => handleOpenDialog(row)}
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
                ))}
          </div>

          {filteredData.length > 0 && (
            <div className="flex justify-between items-center py-4 px-2">
              <Button
                disabled={currentPage === 1}
                className="text-blue-500 rounded-full font-bold bg-white shadow-md hover:shadow-lg active:shadow-sm active:translate-y-1 active:border-blue-700 transition-all duration-150 ease-in-out"
                onClick={() => handlePageChange(currentPage - 1)}
                tabIndex={0}
              >
                <ChevronLeftIcon /> Anterior
              </Button>
              <span>
                <span className="block sm:hidden">Página</span> {currentPage} de{" "}
                {totalPages}
              </span>
              <Button
                disabled={currentPage === totalPages}
                tabIndex={0}
                className="text-blue-500 rounded-full font-bold bg-white shadow-md hover:shadow-lg active:shadow-sm active:translate-y-1 active:border-blue-700 transition-all duration-150 ease-in-out"
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Siguiente <ChevronRightIcon />
              </Button>
            </div>
          )}

          {isDialogOpen && selectedOpportunity && (
            <DialogTableOpportunityForm
              opportunity={selectedOpportunity!}
              onClose={handleCloseDialog}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default TableOpportunities;
