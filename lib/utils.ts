import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function processVocabulary(text: string, level: 'beginner' | 'intermediate' | 'advanced'): string[] {
  const words = text.match(/\b\w+\b/g) || []
  const filteredWords = words.filter(word => {
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

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
} 