import { GetOpportunitiesByIDExecutive } from "@/interfaces/opportunities/get-opportunities-by-executiveId.interface";

export const getOpportunitiesByMonth = (opportunitiesResp: GetOpportunitiesByIDExecutive[]) => {
    const monthCountMap = new Map<string, number>();
    
    // Obtener el mes actual
    const currentDate = new Date();
    
    // Inicializar los 6 meses anteriores (incluyendo el actual)
    for (let i = 4; i >= 0; i--) {
      const date = new Date();
      date.setMonth(currentDate.getMonth() - i); // Restamos meses para ir hacia atrás
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthCountMap.set(monthKey, 0);
    }
  
    // Contar oportunidades por mes
    opportunitiesResp.forEach(opportunity => {
      opportunity.childs.forEach(child => {
        if (child.status?.status?.toLowerCase() === "inicio" && child.startDate) {
          const oppDate = new Date(child.startDate);
          const monthKey = `${oppDate.getFullYear()}-${String(oppDate.getMonth() + 1).padStart(2, '0')}`;
          
          // Solo contar si está en los últimos 6 meses
          const sixMonthsAgo = new Date();
          sixMonthsAgo.setMonth(currentDate.getMonth() - 5);
          sixMonthsAgo.setDate(1); // Primer día del mes
          
          if (oppDate >= sixMonthsAgo && oppDate <= currentDate) {
            if (monthCountMap.has(monthKey)) {
              monthCountMap.set(monthKey, (monthCountMap.get(monthKey) || 0) + 1);
            }
          }
        }
      });
    });
  
    // Convertir a arrays para labels y data
    const sortedMonths = Array.from(monthCountMap.keys()).sort();
    const data = sortedMonths.map(month => monthCountMap.get(month) || 0);
    
   // Generar labels en español
const labels = sortedMonths.map(month => {
  const [year, monthNum] = month.split('-');
  const date = new Date(parseInt(year), parseInt(monthNum) - 1);

  // Obtiene la abreviatura en español (por defecto suele venir con punto, ej. "sept.")
  const shortMonth = date.toLocaleString('es-ES', { month: 'short' });

  // Capitaliza la primera letra
  let label = shortMonth.charAt(0).toUpperCase() + shortMonth.slice(1);

  // Si se detecta "sept", forzar a "Sep"
  if (label.toLowerCase().includes('sept')) {
    label = 'Sep';
  }

  return label;
});
    // // Debug logs
    // console.log('Fecha actual:', currentDate.toISOString());
    // console.log('Meses ordenados:', sortedMonths);
    // console.log('Labels:', labels);
    // console.log('Conteos:', data);
    // console.log('Mapa de conteos:', Object.fromEntries(monthCountMap));

    // console.log('labels', labels);
    // console.log('data', data);
    
  
    return { labels, data };
  };