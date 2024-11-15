import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
};

export function formatDuration(durationInMilliseconds: number): string {
  const totalSeconds = Math.floor(durationInMilliseconds / 1000); // Use Math.floor to round down
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}.${seconds < 10 ? '0' : ''}${seconds}`;
}

