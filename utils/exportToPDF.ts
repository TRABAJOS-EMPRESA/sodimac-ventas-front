import { ColumnConfig, Opportunity } from "@/constants/column-config.constant";
import { toast } from "@/hooks/use-toast";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import logoMiRadar from "@/public/img/mi-radar.png";
import { getImageAsBase64 } from "./getImgToBase64";
import { GetOpportunitiesByIDExecutive } from "@/interfaces/opportunities/get-opportunities-by-executiveId.interface";



export const exportToPDF = async (
  opportunitiesResp: GetOpportunitiesByIDExecutive[],
  paginatedFilteredData: Opportunity[],
  columns: ColumnConfig[],
  orientation: "p" | "portrait" | "l" | "landscape",
  allData: boolean,
  nameExecutive: string
) => {
  const doc = new jsPDF({
    orientation: orientation,
    unit: "mm",
    format: "a4",
  });

  const today = new Date();
  const toHours = today.getHours();
  const toMinutes = today.getMinutes();
  const toSeconds = today.getSeconds();
  const formattedDate = today.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

 

 

  const formattedHours = `${toHours < 10 ? "0" : ""}${toHours}`;

  const formattedMinutes = `${toMinutes < 10 ? "0" : ""}${toMinutes}`;

  const formmatedSeconds = `${toSeconds < 10 ? "0" : ""}${toSeconds}`;
  

  doc.setFontSize(12);
  doc.text(`Oportunidades del ${formattedDate} - ${formattedHours}:${formattedMinutes}hrs.`, 14, 15);
  doc.text(`Ejecutivo ${nameExecutive}`, 14, 19);

  try {
    const visibleColumns = columns.filter((col) => col.visible);

    const headers = visibleColumns.map((col) => col.label);

    const rows = allData
      ? opportunitiesResp.flatMap((opportunity) =>
          opportunity.childs.map((child) =>
            visibleColumns.map((col) => {
              switch (col.key) {
                case "estado":
                  return child.status?.status || "Sin estado";
                case "oportunidadPadre":
                  return opportunity.opportunityName || "Sin nombre";
                case "oportunidadHija":
                  return child.productLine.name || "Sin línea";
                case "tipoProyecto":
                  return opportunity.projectType.name || "Sin tipo";
                case "nombreCliente":
                  return opportunity.client?.name || "Cliente desconocido";
                case "rut":
                  return opportunity.client?.rut || "Sin RUT";
                case "ingresos":
                  return child.availableBudget || 0;
                case "fechaInicio":
                  return child.startDate
                    ? new Date(child.startDate).toLocaleDateString()
                    : "Sin fecha";
                case "fechaCierre":
                  return child.endDate
                    ? new Date(child.endDate).toLocaleDateString()
                    : "Sin fecha";
                default:
                  return "";
              }
            })
          )
        )
      : paginatedFilteredData.map((row) =>
          visibleColumns.map((col) => row[col.key] || "")
        );

    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: 35,
      margin: { top: 50, left: 10, right: 10 },
      theme: "striped",
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [52, 73, 94],
        textColor: [255, 255, 255],
        fontSize: 10,
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    });

    // Añadir el logo
    const logoBase64 = await getImageAsBase64(logoMiRadar.src);

    if (logoBase64) {
      const imageWidth = 40; // Ancho de la imagen
      const imageHeight = 20; // Alto de la imagen
      const pageWidth = orientation === "landscape" ? 297 : 210; // Ancho de la página
      const x = pageWidth - imageWidth - 10; // Margen derecho
      const y = 10; // Margen superior

      doc.addImage(logoBase64, "PNG", x, y, imageWidth, imageHeight);
    }

    doc.save(`Oportunidades-${formattedDate.replace(/\s+/g, "_")} - Ejecutivo (${nameExecutive.toUpperCase()}) Hora (${formattedHours}:${formattedMinutes}:${formmatedSeconds} hrs).pdf`);

    toast({
      className: "bg-primary-blue text-primary-white",
      title: "Exportación exitosa",
      description: "La tabla de oportunidades se ha exportado correctamente.",
    });
  } catch (error) {
    console.error("Error al exportar tabla de oportunidades:", error);

    // Mostrar notificación de error
    toast({
      variant: "destructive",
      title: "Error al exportar",
      description: "Ocurrió un error al exportar la tabla de oportunidades.",
    });
  }
};
