import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const pascalCase = (input: string) =>
  input[0].toUpperCase() + input.slice(1);

export function formatDate(date: Date, shorten: boolean): string {
  const day = date.getDate();
  const ordinalSuffix: string = getOrdinalSuffix(day);
  const monthNames: string[] = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "Dezember",
  ];
  let monthName = monthNames[date.getMonth()];
  let year = date.getFullYear().toString();

  if (shorten) {
    if (monthName.length > 5) {
      monthName = monthName.slice(0, 3) + ".";
    }
    year = year.slice(2);
  }

  return `${day}${ordinalSuffix} ${monthName} ${year}`;
}

function getOrdinalSuffix(day: number): string {
  if (day >= 11 && day <= 13) {
    return "th";
  } else {
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  }
}
