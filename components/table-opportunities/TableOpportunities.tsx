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
  // ASI OBTENGO LOS QUERYPARAMS
  const searchParams = useSearchParams();

  // ASI OBTENGO EL QUERY PARAM ESPECIFICO QUE NEICESTO
  const stateFilter = searchParams.get("state");

  // DATA FAKE PARA LA TABLA
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

  // USE MEMO POR QUE NO QUEREMOS QUE SE VUELVA A CALCULAR
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

  // VALOS INICIAL PARA LA PAGINACION DE CUANTAS OP SE MOSTRARAN POR CADA PAG
  const itemsPerPage = 5;

  const [filteredData, setFilteredData] = useState(data);

  // FILTRO ACTIVO PARA LA TABLA EN BASE A LA COLUMNA QUE SE ESTA FILTRANDO POR ESO KEYOF OPORTUNITY
  // QUE ES BASICAMENTE CADA VALOR DE LA INTERFACE DE OPORTUNITY
  const [activeFilter, setActiveFilter] = useState<keyof Opportunity | null>(
    null
  );

  // FILTRAMOS PRIMERAMENTE POR ELQ UERY PARAMS STATE
  useEffect(() => {
    if (stateFilter) {
      // PASAMOS EL FILTRO INICIAL A LA TABLA EN ETE CASO SI ES POR INICIAR ESAS MOSTRARA
      setFilteredData(
        data.filter((row) =>
          row.estado
            .toLowerCase()
            .includes(stateFilter.toLowerCase().trim().replace("_", " "))
        )
      );
    } else {
      // SI NO HAY FILTRO MUESTRA LA DATA DE TODAS LAS OPP
      setFilteredData(data);
    }
    setCurrentPage(1);
  }, [stateFilter, data]);

  const handleFilterChange = (key: keyof Opportunity, value: string) => {
    // SI EL VALOR DEL FILTRO ESTA VACIO, MOSTRAMOS TODOS LOS DATOS
    if (value.trim() === "") {
      setFilteredData(data);
    } else {
      // SI NO LO QUE CONTENDRA EL STATE ES EL FILTRO QUE SE ESTA REALIZANDO
      setFilteredData(
        data.filter((row) =>
          String(row[key]).toLowerCase().includes(value.toLowerCase())
        )
      );
    }
    setCurrentPage(1);
  };

  // BORRAMOS LOS FILTROS
  const clearFilter = () => {
    setActiveFilter(null);
    setFilteredData(data);
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

  // AQUI CALLCUAMOS EL PAGINADO SEGUN EL FILTRO REALIZADO
  const paginatedFilteredData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className="">
      {/* AUI CONFIGURAMOS LA TABLA SEGUN LAS CONFIG QUE NOS DIGAN */}
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
                      {/* ASI ACTIVO EL INPUT 
                      SI EL ACTIVEFILTER ES IGUAL A LA COLUMNA QUE ESTOY RECORRIENDO
                      ENTONCES MUESTRO EL INPUT PARA FILTRAR */}
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

                          {/* AQUI CIERRO LOS FLTROS */}
                          <X
                            className="cursor-pointer text-red-500"
                            onClick={clearFilter}
                          />
                        </div>
                      ) : (
                        <span
                          className="cursor-pointer font-bold"
                          // AQUI ACTIVO EL FILTRO Y ESO QUIERE DECIR QUE SI HAGO CLICK EN UNA COLUMNA
                          // SE ACTIVA EL FILTRO Y SE MUESTRA EL INPUT PARA FILTRAR
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
                              TERMINADA: "bg-green-500 text-white",
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
