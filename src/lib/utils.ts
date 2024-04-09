import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const pascalCase = (input: string) =>
  input[0].toUpperCase() + input.slice(1);

export const formatDate = (date: Date) => date.toISOString().split("T")[0];
