import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Gets the current season based on the current date
 * For soccer: returns season in format "YYYY-YYYY" (e.g., "2024-2025")
 * For other sports: returns current year (e.g., "2024")
 */
export function getCurrentSeason(sportType: 'Soccer' | 'Basketball' | 'Tennis'): string {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-indexed (0 = January)
  
  if (sportType === 'Soccer') {
    // Soccer seasons typically run from August to May
    // If we're before August (month < 7), we're still in the previous season
    if (currentMonth < 7) {
      return `${currentYear - 1}-${currentYear}`;
    } else {
      return `${currentYear}-${currentYear + 1}`;
    }
  } else {
    // For Basketball and Tennis, use current year
    return currentYear.toString();
  }
}