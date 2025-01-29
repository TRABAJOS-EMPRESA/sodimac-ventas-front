"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ColumnConfig, Opportunity } from "@/constants/column-config.constant";
import { GetOpportunitiesByIDExecutive } from "@/interfaces/opportunities/get-opportunities-by-executiveId.interface";
import { exportToPDF } from "@/utils/exportToPDF";
import { FileDown } from "lucide-react";

interface Props {
  opportunitiesResp: GetOpportunitiesByIDExecutive[];
  paginatedFilteredData: Opportunity[];
  columns: ColumnConfig[];
  currentPage: number;
  nameExecutive: string;
  onClose: () => void;
}

function DialogTableExportPdf(props: Props) {
  const {
    opportunitiesResp,
    paginatedFilteredData,
    columns,
    onClose,
    currentPage,
    nameExecutive,
  } = props;

  const [orientation, setOrientation] = useState<"portrait" | "landscape">(
    "portrait"
  );
  const [allData, setAllData] = useState<boolean>(true);

  const handleExport = () => {
    exportToPDF(
      opportunitiesResp,
      paginatedFilteredData,
      columns,
      orientation,
      allData,
      nameExecutive
    );
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogTrigger asChild>
        <Button className="border-2 border-blue-500 text-blue-500 rounded-full font-bold bg-white shadow-md hover:shadow-lg active:shadow-sm active:translate-y-1 active:border-blue-700 transition-all duration-150 ease-in-out">
          <FileDown className="mr-2 h-4 w-4" />
          Exportar como PDF
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Exportar a PDF</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Selección de Orientación */}
          <div className="space-y-2">
            <Label>Orientación</Label>
            <Select
              value={orientation}
              onValueChange={(value: "portrait" | "landscape") =>
                setOrientation(value)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona la orientación" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="portrait">Vertical (Portrait)</SelectItem>
                <SelectItem value="landscape">
                  Horizontal (Landscape)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Selección de Datos a Exportar */}
          <div className="space-y-2">
            <Label>Datos a Exportar</Label>
            <RadioGroup
              value={allData ? "all" : "visible"}
              onValueChange={(value) => setAllData(value === "all")}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all">
                  Exportar <span className="font-bold">todas las páginas</span>{" "}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="visible" id="visible" />
                <Label htmlFor="visible">
                  Exportar la{" "}
                  <span className="font-bold">página {currentPage}</span>{" "}
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Botón de Exportar */}
          <Button
            onClick={handleExport}
            className="w-full border-2 border-blue-500 text-blue-500 rounded-full font-bold bg-white shadow-md hover:shadow-lg active:shadow-sm active:translate-y-1 active:border-blue-700 transition-all duration-150 ease-in-out"
          >
            Exportar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default DialogTableExportPdf;
