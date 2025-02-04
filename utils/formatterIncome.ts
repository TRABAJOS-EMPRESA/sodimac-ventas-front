export function formatterIncome(valor: string) {
    const texto = String(valor);
    
    const indiceComa = texto.indexOf(',');
  
    if (indiceComa !== -1) {
      return texto.slice(0, indiceComa);
    }
  
    return texto;
  }