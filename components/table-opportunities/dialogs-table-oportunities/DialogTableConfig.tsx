import React from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Settings2, Loader2 } from "lucide-react";
import { Opportunity } from "@/constants/column-config.constant";

interface Column {
  key: keyof Opportunity;
  label: string;
  visible: boolean;
}

interface Props {
  columns: Column[];
  onToggleColumn: (key: keyof Opportunity) => void;
  clearFilter: () => void;
  saveConfig: () => Promise<void>;
  loadingSaveConfig: boolean;
  isDialogConfigOpen: boolean;
  setIsDialogConfigOpen: (open: boolean) => void;
}
const TableConfigDialog = (props: Props) => {
  const {
    columns,
    onToggleColumn,
    clearFilter,
    saveConfig,
    loadingSaveConfig,
    isDialogConfigOpen,
    setIsDialogConfigOpen,
  } = props;
  return (
    <Dialog open={isDialogConfigOpen} onOpenChange={setIsDialogConfigOpen}>
      <DialogTrigger asChild>
        <Button
          className="border-2 border-blue-500 text-blue-500 rounded-full font-bold bg-white shadow-md 
                   hover:shadow-lg active:shadow-sm active:translate-y-1 active:border-blue-700 
                   transition-all duration-150 ease-in-out"
        >
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
            <div key={column.key} className="flex items-center justify-between">
              <span className="text-sm">{column.label}</span>
              <Switch
                checked={column.visible}
                className="bg-blue-600"
                disabled={column.key === "oportunidadHija"}
                onCheckedChange={() => onToggleColumn(column.key)}
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2">
          <Button
            className="w-1/4 border-2 border-gray-600 bg-gray-600 rounded-full font-bold text-white 
                     shadow-md hover:shadow-lg active:shadow-sm active:translate-y-1 
                     active:border-blue-700 transition-all duration-150 ease-in-out"
            onClick={() => {
              clearFilter();
              setIsDialogConfigOpen(false);
            }}
          >
            Cancelar
          </Button>

          <Button
            className="w-1/4 border-2 border-blue-500 text-blue-500 rounded-full font-bold bg-white 
                     shadow-md hover:shadow-lg active:shadow-sm active:translate-y-1 
                     active:border-blue-700 transition-all duration-150 ease-in-out"
            onClick={saveConfig}
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
  );
};

export default TableConfigDialog;
