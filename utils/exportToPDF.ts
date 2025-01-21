import { ColumnConfig, Opportunity } from "@/constants/column-config.constant";
import { toast } from "@/hooks/use-toast";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import logoMiRadar from "@/public/img/mi-radar.png";
import { getImageAsBase64 } from "./getImgToBase64";

export const exportToPDF = async (
  paginatedFilteredData: Opportunity[],
  columns: ColumnConfig[]
) => {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const today = new Date();
  const formattedDate = today.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  doc.setFontSize(12);
  doc.text(`Tabla de Oportunidades - ${formattedDate}`, 14, 15);

  try {
    const headers = columns
      .filter((col: ColumnConfig) => col.visible)
      .map((col: ColumnConfig) => col.label);

    const rows = paginatedFilteredData.map((row: Opportunity) =>
      columns
        .filter((col: ColumnConfig) => col.visible)
        .map((col: ColumnConfig) => row[col.key] || "")
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

    const logoBase64 = await getImageAsBase64(logoMiRadar.src);

    if (logoBase64) {
      
      const imageWidth = 40; // ANHCO DE IMG
      const imageHeight = 20; // ALTO
      const pageWidth = 297; // ANCHO DE DOC HORIZONTAL
      const x = pageWidth - imageWidth - 10; // MARGIN A LA DERECHA
      const y = 10; // MARGEN TOP

      doc.addImage(logoBase64, "PNG", x, y, imageWidth, imageHeight);
    }

    doc.save(`tabla-oportunidades-${formattedDate.replace(/\s+/g, "_")}.pdf`);

    toast({
      className: "bg-primary-blue text-primary-white",
      title: "Exportación exitosa",
      description: "La tabla de oportunidades se ha exportado correctamente.",
    });
  } catch (error) {
    console.error("Error al exportar tabla de oportunidades:", error);

    toast({
      variant: "destructive",
      title: "Error al exportar",
      description: "Ocurrió un error al exportar la tabla de oportunidades.",
    });
  }
};
