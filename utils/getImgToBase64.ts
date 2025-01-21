export const getImageAsBase64 = async (imagePath: string): Promise<string> => {
  const response = await fetch(imagePath); 
  const blob = await response.blob();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      // Retorna la cadena Base64
      if (reader.result) {
        resolve(reader.result as string); 
      } else {
        reject("Error al leer la imagen como Base64");
      }
    };
    reader.readAsDataURL(blob);
  });
};
