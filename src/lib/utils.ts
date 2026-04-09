import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Position } from "./types/position.type";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getLevel(position: Position): number {
  let level = 0;
  let current = position.parent;

  while (current) {
    level++;
    current = current.parent;
  }

  return level;
}

export default function toIDDate(date: Date) {
  // Format date for US English in a long style
  const formattedID = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);

  return formattedID;
}
