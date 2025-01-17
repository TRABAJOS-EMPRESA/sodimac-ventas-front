export interface ColumnConfig {
    key: keyof Opportunity;
    label: string;
    visible: boolean;
  }

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
  
  

export const columnConfig: ColumnConfig[] = [
    { key: "estado", label: "Estado", visible: true },
    { key: "oportunidadPadre", label: "Oportunidad Padre", visible: true },
    { key: "oportunidadHija", label: "Oportunidad Hija", visible: true },
    { key: "tipoProyecto", label: "Tipo de proyecto", visible: true },
    { key: "nombreCliente", label: "Nombre cliente", visible: true },
    { key: "rut", label: "RUT", visible: true },
    { key: "ingresos", label: "Ingresos", visible: true },
    { key: "fechaInicio", label: "Fecha inicio", visible: true },
    { key: "fechaCierre", label: "Fecha cierre", visible: true },
  ]