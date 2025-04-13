"use client"

import * as React from "react"

interface ScreenReaderProps {
  children: React.ReactNode
  as?: keyof JSX.IntrinsicElements
  role?: string
  "aria-label"?: string
  "aria-live"?: "off" | "polite" | "assertive"
  "aria-atomic"?: boolean
  className?: string
}

export function ScreenReader({
  children,
  as: Component = "div",
  role = "status",
  "aria-label": ariaLabel,
  "aria-live": ariaLive = "polite",
  "aria-atomic": ariaAtomic = true,
  className = "sr-only",
}: ScreenReaderProps) {
  return React.createElement(
    Component,
    {
      role,
      "aria-label": ariaLabel,
      "aria-live": ariaLive,
      "aria-atomic": ariaAtomic,
      className,
    },
    children
  )
} 