'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  isDarkMode: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('system')
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    // Get initial theme from localStorage or system preference
    const savedTheme = localStorage.getItem('theme') as Theme
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    if (savedTheme) {
      setTheme(savedTheme)
      setIsDarkMode(savedTheme === 'dark' || (savedTheme === 'system' && systemPrefersDark))
    } else {
      setTheme('system')
      setIsDarkMode(systemPrefersDark)
    }
  }, [])

  useEffect(() => {
    // Update theme when it changes
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const shouldBeDark = theme === 'dark' || (theme === 'system' && systemPrefersDark)

    setIsDarkMode(shouldBeDark)
    document.documentElement.classList.toggle('dark', shouldBeDark)
    localStorage.setItem('theme', theme)
  }, [theme])

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      if (theme === 'system') {
        setIsDarkMode(mediaQuery.matches)
        document.documentElement.classList.toggle('dark', mediaQuery.matches)
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDarkMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
} 