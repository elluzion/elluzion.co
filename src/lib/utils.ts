import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

//#region Tailwind
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
//#endregion

//#region Dates
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
    "December",
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
//#endregion

//#region String modification
export const pascalCase = (input: string) =>
  input[0].toUpperCase() + input.slice(1);

export function toUrlSafeString(input: string) {
  input = input
    .toLowerCase()
    .normalize("NFD") // normalize string
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[^a-zA-Z0-9 ]/g, ""); // remove all characters except letters, numbers and whitespace
  return cleanWhitespace(input, "-");
}

export function cleanWhitespace(input: string, filler?: string) {
  return input.replace(/\s+/g, filler || " ").trim();
}
//#endregion
