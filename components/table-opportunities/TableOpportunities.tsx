"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Settings2, FileDown, FilterX, X, Eye } from "lucide-react";
import { getOpportunitiesAll } from "@/actions/opportunities/get-opportunities-all.action";
import { Skeleton } from "../ui/skeleton";
import DialogTableOpportunityForm from "./dialogs-table-oportunities/DialogTableOpportunityForm";

export interface Opportunity {
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

export interface ColumnConfig {
  key: keyof Opportunity;
  label: string;
  visible: boolean;
}

function TableOpportunities() {
  const searchParams = useSearchParams();
  const stateFilter = searchParams.get("state");

  const [columns, setColumns] = useState<ColumnConfig[]>([
    { key: "estado", label: "Estado", visible: true },
    { key: "oportunidadPadre", label: "Oportunidad Padre", visible: true },
    { key: "oportunidadHija", label: "Oportunidad Hija", visible: true },
    { key: "tipoProyecto", label: "Tipo de proyecto", visible: true },
    { key: "nombreCliente", label: "Nombre cliente", visible: true },
    { key: "rut", label: "RUT", visible: true },
    { key: "ingresos", label: "Ingresos", visible: true },
    { key: "fechaInicio", label: "Fecha inicio", visible: true },
    { key: "fechaCierre", label: "Fecha cierre", visible: true },
  ]);

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
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getOpportunitiesAll();

        if (Array.isArray(response)) {
          const mappedData = response.map((opportunity) => ({
            id: opportunity.id,
            estado: opportunity.status.status,
            oportunidadPadre: opportunity.opportunityName,
            oportunidadHija: opportunity.opportunityName,
            tipoProyecto: opportunity.projectType,
            nombreCliente: opportunity.client.name,
            rut: opportunity.client.rut || "",
            ingresos: opportunity.availableBudget,
            fechaInicio: new Date(opportunity.startDate).toLocaleDateString(),
            fechaCierre: new Date(opportunity.endDate).toLocaleDateString(),
          }));

          if (stateFilter) {
            const filtered = mappedData.filter((opportunity) =>
              opportunity.estado
                .toLowerCase()
                .includes(stateFilter.toLowerCase())
            );
            setFilteredData(filtered);
          } else {
            setFilteredData(mappedData);
          }
          setData(mappedData);
        }
      } catch (error) {
        console.error("Error al cargar oportunidades:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [stateFilter]);

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
  };

  const resetColumns = () => {
    setColumns(columns.map((col) => ({ ...col, visible: true })));
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

  return (
    <div className="">
      <div className="w-full flex items-center gap-2 bg-gray-100 py-4 pl-2 border-t-[1px] border-l-[1px] border-r-[1px] border-gray-200">
        <Button
          className="border-2 border-blue-500 text-blue-500 rounded-full font-bold cursor-pointer"
          onClick={resetColumns}
        >
          <FilterX className="mr-2 h-4 w-4" />
          Borrar filtros
        </Button>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="border-2 border-blue-500 text-blue-500 rounded-full font-bold cursor-pointer">
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
          </DialogContent>
        </Dialog>

        <Button className="border-2 border-blue-500 text-blue-500 rounded-full font-bold">
          <FileDown className="mr-2 h-4 w-4" />
          Exportar como PDF
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-gray-100">
            <TableRow>
              {columns.map((column) =>
                column.visible ? (
                  <TableHead key={column.key}>
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
              ? Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    {Array.from({ length: columns.length }).map((_, idx) => (
                      <TableCell key={idx}>
                        <Skeleton className="h-9 min-w-full rounded bg-gray-200 animate-pulse" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : paginatedFilteredData.map((row) => (
                  <TableRow key={row.id}>
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
                        variant="ghost"
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
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        >
          Anterior
        </Button>
        <span>
          Página {currentPage} de {totalPages}
        </span>
        <Button
          disabled={currentPage === totalPages}
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
        >
          Siguiente
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
