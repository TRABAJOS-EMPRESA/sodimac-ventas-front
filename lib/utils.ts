import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



export function convertToExcelDate(date: Date): number {
  const excelBaseDate = new Date(1900, 0, 1);
  
  const diffInTime = date.getTime() - excelBaseDate.getTime();
  const diffInDays = Math.floor(diffInTime / (1000 * 60 * 60 * 24)) + 2; 

  return diffInDays;
}