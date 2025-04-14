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
  const ComponentElement = Component as unknown as React.ComponentType<React.HTMLAttributes<HTMLElement>>
  
  return (
    <ComponentElement
      role={role}
      aria-label={ariaLabel}
      aria-live={ariaLive}
      aria-atomic={ariaAtomic}
      className={className}
      {...props}
    >
      {children}
    </ComponentElement>
  )
} 