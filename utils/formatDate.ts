export const formatDateIsoToString = (dateString: string): string => {
  console.log("date string", dateString);

  if (!dateString) return "";

  const newDateString = dateString.split("T")[0];

  const año = newDateString.split("-")[0];
  const mes = newDateString.split("-")[1];
  const dia = newDateString.split("-")[2];
 
  const finalDate = `${dia}/${mes}/${año}`;

  return finalDate;
};
