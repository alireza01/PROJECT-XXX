"use client"

import { useEffect } from "react"
import { useHotkeys } from "react-hotkeys-hook"
import { useTheme } from "next-themes"

export function KeyboardShortcuts() {
  const { setTheme, theme } = useTheme()

  // Theme toggle
  useHotkeys('ctrl+t', (e: KeyboardEvent) => {
    e.preventDefault()
    setTheme(theme === 'dark' ? 'light' : 'dark')
  })

  // Navigation shortcuts
  useHotkeys("ctrl+shift+h", () => {
    window.location.href = "/"
  })

  useHotkeys("ctrl+shift+b", () => {
    window.location.href = "/books"
  })

  useHotkeys("ctrl+shift+p", () => {
    window.location.href = "/profile"
  })

  // Search shortcut
  useHotkeys('ctrl+k', (e: KeyboardEvent) => {
    e.preventDefault()
    document.querySelector<HTMLButtonElement>("[data-search-trigger]")?.click()
  })

  // Help dialog
  useHotkeys("ctrl+shift+/", (e: KeyboardEvent) => {
    e.preventDefault()
    document.querySelector<HTMLButtonElement>("[data-help-trigger]")?.click()
  })

  return null
} 