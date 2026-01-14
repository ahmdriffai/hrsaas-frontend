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
