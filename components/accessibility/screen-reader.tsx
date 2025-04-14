"use client"

import * as React from "react"

interface ScreenReaderProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
  as?: keyof JSX.IntrinsicElements
  role?: string
  "aria-label"?: string
  "aria-live"?: "off" | "polite" | "assertive"
  "aria-atomic"?: boolean
}

export function ScreenReader({
  children,
  as: Component = "div",
  role = "status",
  "aria-label": ariaLabel,
  "aria-live": ariaLive = "polite",
  "aria-atomic": ariaAtomic = true,
  className = "sr-only",
  ...props
}: ScreenReaderProps) {
  return React.createElement(
    Component,
    {
      role: typeof role === 'string' ? role : 'status',
      "aria-label": ariaLabel,
      "aria-live": ariaLive,
      "aria-atomic": ariaAtomic,
      className,
      ...props
    },
    children
  )
} 