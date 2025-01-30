export interface FilterState {
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
    nombreCliente: string;
    oportunidadPadre: string;
  }