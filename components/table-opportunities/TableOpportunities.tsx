"use client";

import React, { useState, useEffect, useMemo } from "react";
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
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Settings2, FileDown, FilterX, X } from "lucide-react";

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

interface ColumnConfig {
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

  const data: Opportunity[] = useMemo(
    () => [
      {
        id: "1",
        estado: "POR INICIAR",
        oportunidadPadre: "LAS BRISAS DE LAMPA",
        oportunidadHija: "PUERTAS",
        tipoProyecto: "INSTITUCIONAL",
        nombreCliente: "EURO INMOBILIA",
        rut: "11.111.111-1",
        ingresos: 290000000,
        fechaInicio: "01/01/2024",
        fechaCierre: "01/01/2026",
      },
      {
        id: "2",
        estado: "EN CURSO",
        oportunidadPadre: "LAS BRISAS DE LAMPA",
        oportunidadHija: "PUERTAS",
        tipoProyecto: "INSTITUCIONAL",
        nombreCliente: "EURO INMOBILIA",
        rut: "11.111.111-1",
        ingresos: 290000000,
        fechaInicio: "01/01/2024",
        fechaCierre: "01/01/2026",
      },
      {
        id: "3",
        estado: "POR INICIAR",
        oportunidadPadre: "LAS BRISAS DE LAMPA",
        oportunidadHija: "PUERTAS",
        tipoProyecto: "INSTITUCIONAL",
        nombreCliente: "EURO INMOBILIA",
        rut: "11.111.111-1",
        ingresos: 290000000,
        fechaInicio: "01/01/2024",
        fechaCierre: "01/01/2026",
      },
      {
        id: "4",
        estado: "POR INICIAR",
        oportunidadPadre: "LAS BRISAS DE LAMPA",
        oportunidadHija: "PUERTAS",
        tipoProyecto: "INSTITUCIONAL",
        nombreCliente: "EURO INMOBILIA",
        rut: "11.111.111-1",
        ingresos: 290000000,
        fechaInicio: "01/01/2024",
        fechaCierre: "01/01/2026",
      },
      {
        id: "5",
        estado: "POR VENCER",
        oportunidadPadre: "LAS BRISAS DE LAMPA",
        oportunidadHija: "PUERTAS",
        tipoProyecto: "INSTITUCIONAL",
        nombreCliente: "EURO INMOBILIA",
        rut: "11.111.111-1",
        ingresos: 290000000,
        fechaInicio: "01/01/2024",
        fechaCierre: "01/01/2026",
      },
      {
        id: "6",
        estado: "EN CURSO",
        oportunidadPadre: "LAS BRISAS DE LAMPA",
        oportunidadHija: "PUERTAS",
        tipoProyecto: "INSTITUCIONAL",
        nombreCliente: "EURO INMOBILIA",
        rut: "11.111.111-1",
        ingresos: 290000000,
        fechaInicio: "01/01/2024",
        fechaCierre: "01/01/2026",
      },
      {
        id: "7",
        estado: "EN CURSO",
        oportunidadPadre: "LAS BRISAS DE LAMPA",
        oportunidadHija: "PUERTAS",
        tipoProyecto: "INSTITUCIONAL",
        nombreCliente: "EURO INMOBILIA",
        rut: "11.111.111-1",
        ingresos: 290000000,
        fechaInicio: "01/01/2024",
        fechaCierre: "01/01/2026",
      },
      {
        id: "8",
        estado: "POR VENCER",
        oportunidadPadre: "LAS BRISAS DE LAMPA",
        oportunidadHija: "PUERTAS",
        tipoProyecto: "INSTITUCIONAL",
        nombreCliente: "EURO INMOBILIA",
        rut: "11.111.111-1",
        ingresos: 290000000,
        fechaInicio: "01/01/2024",
        fechaCierre: "01/01/2026",
      },
      {
        id: "9",
        estado: "POR VENCER",
        oportunidadPadre: "LAS BRISAS DE LAMPA",
        oportunidadHija: "PUERTAS",
        tipoProyecto: "INSTITUCIONAL",
        nombreCliente: "EURO INMOBILIA",
        rut: "11.111.111-1",
        ingresos: 290000000,
        fechaInicio: "01/01/2024",
        fechaCierre: "01/01/2026",
      },
      {
        id: "10",
        estado: "POR VENCER",
        oportunidadPadre: "LAS BRISAS DE LAMPA",
        oportunidadHija: "PUERTAS",
        tipoProyecto: "INSTITUCIONAL",
        nombreCliente: "EURO INMOBILIA",
        rut: "11.111.111-1",
        ingresos: 290000000,
        fechaInicio: "01/01/2024",
        fechaCierre: "01/01/2026",
      },
    
    ],
    []
  );

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [filteredData, setFilteredData] = useState(data);
  const [activeFilter, setActiveFilter] = useState<keyof Opportunity | null>(
    null
  );

  // Filtro inicial basado en el query param "state"
  useEffect(() => {
    if (stateFilter) {
      setFilteredData(
        data.filter((row) =>
          row.estado.toLowerCase().includes(stateFilter.toLowerCase().trim().replace('_', ' '))
        )
      );
    } else {
      setFilteredData(data);
    }
    setCurrentPage(1); // Reiniciar a la primera página al aplicar el filtro
  }, [stateFilter, data]);

  const handleFilterChange = (key: keyof Opportunity, value: string) => {
    if (value.trim() === "") {
      setFilteredData(data);
    } else {
      setFilteredData(
        data.filter((row) =>
          String(row[key]).toLowerCase().includes(value.toLowerCase())
        )
      );
    }
    setCurrentPage(1); // Reiniciar a la primera página al filtrar
  };

  const clearFilter = () => {
    setActiveFilter(null);
    setFilteredData(data);
    setCurrentPage(1); // Reiniciar a la primera página
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

  // Calcular paginado en base a los datos filtrados
  const paginatedFilteredData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className="">
      {/* Configuración de la tabla */}
      <div className="flex items-center gap-2 bg-gray-100 py-4 pl-2 border-t-[1px] border-l-[1px] border-r-[1px] border-gray-200">
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
          <DialogContent className="sm:max-w-[800px]">
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
            <div className="flex w-full flex-row items-end justify-end mt-4 gap-3 ">
              <Button
                className="bg-gray-500 rounded-full text-primary-white cursor-pointer"
                onClick={() => resetColumns()}
              >
                Cancelar
              </Button>

              <DialogClose className=" cursor-pointer bg-primary-blue rounded-full text-primary-white py-[6px] px-3">
                Guardar Cambios
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>

        <Button className="border-2 border-blue-500 text-blue-500 rounded-full font-bold">
          <FileDown className="mr-2 h-4 w-4" />
          Exportar como PDF
        </Button>
      </div>

      {/* Tabla con datos */}
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-gray-100">
            <TableRow>
              {columns.map((column) =>
                column.visible ? (
                  <TableHead key={column.key}>
                    <div className="flex items-center">
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
          <TableBody>
          {paginatedFilteredData.map((row) => (
  <TableRow key={row.id}>
    {columns
      .filter((col) => col.visible)
      .map((column) => (
        <TableCell key={column.key}>
          {column.key === "estado" ? (
            <Badge
              className={
                {
                  "POR INICIAR": "bg-orange-500 text-white",
                  "POR VENCER": "bg-red-500 text-white",
                  "EN CURSO": "bg-blue-500 text-white",
                  "TERMINADA": "bg-green-500 text-white",
                }[row.estado] || "bg-gray-300 text-black" // Color por defecto
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
  </TableRow>
))}

          </TableBody>
        </Table>
      </div>

      {/* Controles de paginación */}
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
    </div>
  );
}

export default TableOpportunities;
