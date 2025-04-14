import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { createDebouncedFunction } from "./debounce"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function processVocabulary(text: string, level: 'beginner' | 'intermediate' | 'advanced'): string[] {
  const words: string[] = text.match(/\b\w+\b/g) || []
  const filteredWords = words.filter((word: string) => {
    const length = word.length
    switch (level) {
      case 'beginner':
        return length <= 5
      case 'intermediate':
        return length > 5 && length <= 8
      case 'advanced':
        return length > 8
      default:
        return true
    }
  })
  return Array.from(new Set(filteredWords))
}

export function formatPageNumber(page: number): string {
  return page.toString().padStart(3, '0')
}

// Re-export the debounce function with a simpler interface
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void => {
  return createDebouncedFunction(func, wait);
};

export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d)
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat().format(num)
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price)
} 