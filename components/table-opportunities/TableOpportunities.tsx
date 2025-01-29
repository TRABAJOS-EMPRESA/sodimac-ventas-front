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
  Eye,
  FileDown,
  Filter,
  FilterX,
  Loader2,
  Settings2,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import DialogTableOpportunityForm from "./dialogs-table-oportunities/DialogTableOpportunityForm";
import {
  columnConfig,
  ColumnConfig,
  Opportunity,
} from "@/constants/column-config.constant";
import { GetOpportunitiesByIDExecutive } from "@/interfaces/opportunities/get-opportunities-by-executiveId.interface";
import { ErrorResp } from "@/interfaces/error-resp/get-roles-error.interface";
import { editSettingsTable } from "@/actions/settings-table/edit-settings-table.action";
import { toast } from "@/hooks/use-toast";
import DialogTableExportPdf from "./dialogs-table-oportunities/DialogTableExportPdf";
import { Session } from "next-auth";

import {
  DateRangeFilter,
  PopoverState,
} from "./components/filters/DateRangeFilter";
import { RangeFilter } from "./components/filters/RangeFilter";
import { MultiSelectFilter } from "./components/filters/MultiSelectFilter";
import MobileTableView from "./components/mobile/MobileTableView";
import PaginationTable from "./components/paginacion/PaginationTable";

interface Props {
  opportunitiesResp: GetOpportunitiesByIDExecutive[] | ErrorResp | [];
  settingsTable: ColumnConfig[] | ErrorResp;
  session: Session;
}

interface FilterState {
  estado: string[];
  tipoProyecto: string[];
  ingresos: {
    min: number | null;
    max: number | null;
  };
  fechaInicio: {
    start: Date | null;
    end: Date | null;
  };
  fechaCierre: {
    start: Date | null;
    end: Date | null;
  };
  oportunidadHija: string;
  rut: string;
}

function TableOpportunities(props: Props) {
  const { opportunitiesResp, settingsTable, session } = props;
  const searchParams = useSearchParams();
  const stateFilter = searchParams.get("state");

  const [columns, setColumns] = useState<ColumnConfig[]>(() => {
    const desiredOrder = [
      "estado",
      "oportunidadPadre",
      "oportunidadHija",
      "tipoProyecto",
      "nombreCliente",
      "rut",
      "ingresos",
      "fechaInicio",
      "fechaCierre",
    ];

    if (!Array.isArray(settingsTable)) {
      return [];
    }

    return desiredOrder
      .map((key) => settingsTable.find((col) => col.key === key))
      .filter((col): col is ColumnConfig => col !== undefined);
  });
  const initialColumnOrder = [...columnConfig];
  const [data, setData] = useState<Opportunity[]>([]);
  const [filteredData, setFilteredData] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingSaveConfig, setLoadingSaveConfig] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [inputOppHija, setInputOppHija] = useState(false);
  const [inputRut, setInputRut] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDialogConfigOpen, setIsDialogConfigOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] =
    useState<Opportunity | null>(null);
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpenPdfDialog, setOpenPdfDialog] = useState(false);
  const [openPopover, setOpenPopover] = useState<PopoverState>({});

  const [filterState, setFilterState] = useState<FilterState>({
    estado: [],
    tipoProyecto: [],
    ingresos: { min: null, max: null },
    fechaInicio: { start: null, end: null },
    fechaCierre: { start: null, end: null },
    oportunidadHija: "",
    rut: "",
  });

  // Obtener valores únicos para los filtros de selección
  const uniqueStates = useMemo(
    () => Array.from(new Set(data.map((item) => item.estado))),
    [data]
  );

  const uniqueProjectTypes = useMemo(
    () => Array.from(new Set(data.map((item) => item.tipoProyecto))),
    [data]
  );

  const handleMultiFilter = useCallback(() => {
    let filteredResults = [...data];

    // Filtro por estado
    if (filterState.estado.length > 0) {
      filteredResults = filteredResults.filter((item) =>
        filterState.estado.includes(item.estado)
      );
    }

    // FILTRO POR TIPO DE PROUECTO
    if (filterState.tipoProyecto.length > 0) {
      filteredResults = filteredResults.filter((item) =>
        filterState.tipoProyecto.includes(item.tipoProyecto)
      );
    }

    // ILTRO POR INGRESOS
    if (
      filterState.ingresos.min !== null ||
      filterState.ingresos.max !== null
    ) {
      filteredResults = filteredResults.filter((item) => {
        const value =
          typeof item.ingresos === "string"
            ? Number(
                (item.ingresos as string).replace(/\./g, "").replace(",", ".")
              )
            : item.ingresos;

        if (
          filterState.ingresos.min !== null &&
          filterState.ingresos.max !== null
        ) {
          return (
            value >= filterState.ingresos.min &&
            value <= filterState.ingresos.max
          );
        }
        if (filterState.ingresos.min !== null) {
          return value >= filterState.ingresos.min;
        }
        if (filterState.ingresos.max !== null) {
          return value <= filterState.ingresos.max;
        }
        return true;
      });
    }

    // FILTRO POR FECHA E INICIO
    if (filterState.fechaInicio.start || filterState.fechaInicio.end) {
      filteredResults = filteredResults.filter((item) => {
        if (item.fechaInicio === "Sin fecha") return false;

        // CONVERTIR LA FECHA A STRING
        const [day, month, year] = item.fechaInicio.split("/").map(Number);
        const itemDate = new Date(year, month - 1, day);
        itemDate.setHours(0, 0, 0, 0); // Normalizar la hora

        if (filterState.fechaInicio.start && filterState.fechaInicio.end) {
          const start = new Date(filterState.fechaInicio.start);
          const end = new Date(filterState.fechaInicio.end);
          start.setHours(0, 0, 0, 0);
          end.setHours(23, 59, 59, 999);
          return itemDate >= start && itemDate <= end;
        }
        if (filterState.fechaInicio.start) {
          const start = new Date(filterState.fechaInicio.start);
          start.setHours(0, 0, 0, 0);
          return itemDate >= start;
        }
        if (filterState.fechaInicio.end) {
          const end = new Date(filterState.fechaInicio.end);
          end.setHours(23, 59, 59, 999);
          return itemDate <= end;
        }
        return true;
      });
    }
    // FILTRO POR FECHA DE CIERRE
    if (filterState.fechaCierre.start || filterState.fechaCierre.end) {
      filteredResults = filteredResults.filter((item) => {
        if (item.fechaCierre === "Sin fecha") return false;
        const [day, month, year] = item.fechaCierre.split("/").map(Number);
        const date = new Date(year, month - 1, day);

        if (filterState.fechaCierre.start && filterState.fechaCierre.end) {
          return (
            date >= filterState.fechaCierre.start &&
            date <= filterState.fechaCierre.end
          );
        }
        if (filterState.fechaCierre.start) {
          return date >= filterState.fechaCierre.start;
        }
        if (filterState.fechaCierre.end) {
          return date <= filterState.fechaCierre.end;
        }
        return true;
      });
    }

    // FILTRO POR OPORTUNIDAD HIJA
    if (filterState.oportunidadHija.trim() !== "") {
      filteredResults = filteredResults.filter((item) =>
        item.oportunidadHija
          .toLowerCase()
          .includes(filterState.oportunidadHija.toLowerCase())
      );
    }

    // FILTRO POR RUT
    if (filterState.rut.trim() !== "") {
      filteredResults = filteredResults.filter((item) =>
        item.rut.toLowerCase().includes(filterState.rut.toLowerCase())
      );
    }

    setFilteredData(filteredResults);
    setCurrentPage(1);
  }, [data, filterState]);

  // USSEFFETCT PARA MANEJAR LO FILTROS
  useEffect(() => {
    handleMultiFilter();
  }, [filterState, handleMultiFilter]);

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

  const handleOpenPdfDialog = () => {
    console.log("ejtro a pdf");

    setOpenPdfDialog(true);
  };

  const handleClosePdfDialog = () => {
    setOpenPdfDialog(false);
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
      {/* VISTA ESCRITORIO */}
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
                        disabled={column.key === "oportunidadHija"}
                        onCheckedChange={() => toggleColumn(column.key)}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    className="w-1/4 border-2 border-gray-600 bg-gray-600 rounded-full font-bold text-primary-white shadow-md hover:shadow-lg active:shadow-sm active:translate-y-1 active:border-blue-700 transition-all duration-150 ease-in-out"
                    onClick={() => {
                      clearFilter();
                      setIsDialogConfigOpen(false);
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    className="w-1/4 border-2 border-blue-500 text-blue-500 rounded-full font-bold bg-white shadow-md hover:shadow-lg active:shadow-sm active:translate-y-1 active:border-blue-700 transition-all duration-150 ease-in-out"
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
              onClick={() => handleOpenPdfDialog()}
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
                        <div className="flex items-center justify-between fade-in">
                          <span className="font-bold text-[12px]">
                            {column.label === "Oportunidad Hija"
                              ? column.label === "Oportunidad Hija" &&
                                inputOppHija
                                ? ""
                                : column.label
                              : column.label === "RUT"
                              ? column.label === "RUT" && inputRut
                                ? ""
                                : column.label
                              : column.label}
                          </span>

                          {/* MULTISELECT COMPONENTE FILTER TIPO DE PROYECTO */}

                          {column.key === "estado" && (
                            <MultiSelectFilter
                              column={column.key}
                              options={uniqueStates}
                              values={filterState.estado}
                              onChange={(values) => {
                                setFilterState((prev) => ({
                                  ...prev,
                                  estado: values,
                                }));
                              }}
                              openPopover={openPopover}
                              setOpenPopover={setOpenPopover}
                            />
                          )}
                          {/* MULTISELECT COMPONENTE FILTER TIPO DE PROYECTO */}
                          {column.key === "tipoProyecto" && (
                            <MultiSelectFilter
                              column={column.key}
                              options={uniqueProjectTypes}
                              values={filterState.tipoProyecto}
                              onChange={(values) => {
                                setFilterState((prev) => ({
                                  ...prev,
                                  tipoProyecto: values,
                                }));
                              }}
                              openPopover={openPopover}
                              setOpenPopover={setOpenPopover}
                            />
                          )}

                          {/* FILTRO DE INGRESOS RANGE FILTER */}

                          {column.key === "ingresos" && (
                            <RangeFilter
                              column={column.key}
                              min={filterState.ingresos.min}
                              max={filterState.ingresos.max}
                              openPopover={openPopover}
                              setOpenPopover={setOpenPopover}
                              onChange={(min, max) => {
                                setFilterState((prev) => ({
                                  ...prev,
                                  ingresos: { min, max },
                                }));
                                handleMultiFilter();
                              }}
                            />
                          )}

                          {/* FECHA DE INICIO COMPONENTE DATERANGE FILTER */}
                          {column.key === "fechaInicio" && (
                            <DateRangeFilter
                              column={column.key}
                              startDate={filterState.fechaInicio.start}
                              endDate={filterState.fechaInicio.end}
                              onChange={(start, end) => {
                                setFilterState((prev) => ({
                                  ...prev,
                                  fechaInicio: { start, end },
                                }));
                              }}
                              title="Fecha de Inicio"
                              openPopover={openPopover}
                              setOpenPopover={setOpenPopover}
                            />
                          )}

                          {/* FILTRO POR NOMBRE DE OPP HIJA */}
                          {column.key === "oportunidadHija" &&
                            (inputOppHija ? (
                              <div className="relative flex items-center gap-2 justify-center">
                                <input
                                  type="text"
                                  className="border rounded px-2 py-1 text-sm pr-8 w-[143px] fade-in"
                                  placeholder="Op. Hija"
                                  value={filterState.oportunidadHija}
                                  onChange={(e) =>
                                    setFilterState((prev) => ({
                                      ...prev,
                                      oportunidadHija: e.target.value,
                                    }))
                                  }
                                />

                                <button
                                  className="absolute right-2 text-gray-500 hover:text-gray-800"
                                  onClick={() => {
                                    setFilterState((prev) => ({
                                      ...prev,
                                      oportunidadHija: "",
                                    }));
                                    setInputOppHija(false);
                                  }}
                                >
                                  X
                                </button>
                              </div>
                            ) : (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setInputOppHija(true)}
                              >
                                <Filter className={"text-muted-foreground"} />
                              </Button>
                            ))}

                          {/* FILTRO POR RUT */}
                          {column.key === "rut" &&
                            (inputRut ? (
                              <div className="relative flex items-center gap-2">
                                <input
                                  type="text"
                                  className="border rounded px-2 py-1 text-sm pr-8 ml-2 w-[100px] fade-in"
                                  placeholder="Buscar RUT"
                                  value={filterState.rut}
                                  onChange={(e) =>
                                    setFilterState((prev) => ({
                                      ...prev,
                                      rut: e.target.value,
                                    }))
                                  }
                                />
                                <button
                                  className="absolute right-2 text-gray-500 hover:text-gray-800"
                                  onClick={() => {
                                    setFilterState((prev) => ({
                                      ...prev,
                                      rut: "",
                                    }));
                                    setInputRut(false);
                                  }}
                                >
                                  X
                                </button>
                              </div>
                            ) : (
                              // ícono de filtro, botón, etc.
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setInputRut(true)}
                              >
                                <Filter className="text-muted-foreground" />
                              </Button>
                            ))}

                          {/* FECHA DE CIERRE COMPONENTE DATERANGE FILTER */}

                          {column.key === "fechaCierre" && (
                            <DateRangeFilter
                              column={column.key}
                              startDate={filterState.fechaCierre.start}
                              endDate={filterState.fechaCierre.end}
                              onChange={(start, end) => {
                                setFilterState((prev) => ({
                                  ...prev,
                                  fechaCierre: { start, end },
                                }));
                              }}
                              title="Fecha de Cierre"
                              openPopover={openPopover}
                              setOpenPopover={setOpenPopover}
                            />
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

          {/* PAGINACION */}

          {filteredData.length > 0 && (
            <PaginationTable
              currentPage={currentPage}
              totalPages={totalPages}
              handlePageChange={handlePageChange}
            />
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
          <MobileTableView
            loading={loading}
            paginatedFilteredData={paginatedFilteredData}
            expandedCardId={expandedCardId}
            handleCardClick={handleCardClick}
            handleOpenDialog={handleOpenDialog}
            handleOpenPdfDialog={handleOpenPdfDialog}
            clearFilter={clearFilter}
            handleFilterChange={handleFilterChange}
            currentPage={currentPage}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filteredData={filteredData}
          />

          {isDialogOpen && selectedOpportunity && (
            <DialogTableOpportunityForm
              opportunity={selectedOpportunity!}
              onClose={handleCloseDialog}
            />
          )}

          {isOpenPdfDialog && (
            <DialogTableExportPdf
              opportunitiesResp={
                Array.isArray(opportunitiesResp) ? opportunitiesResp : []
              }
              nameExecutive={session.user?.name || ""}
              currentPage={currentPage}
              paginatedFilteredData={paginatedFilteredData}
              columns={columns}
              onClose={handleClosePdfDialog}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default TableOpportunities;
