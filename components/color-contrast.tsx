"use client"

import * as React from "react"

interface ColorContrastProps {
  foreground: string
  background: string
  children: React.ReactNode
  className?: string
}

function calculateContrastRatio(foreground: string, background: string): number {
  // Convert hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null
  }

  // Calculate relative luminance
  const calculateLuminance = (r: number, g: number, b: number) => {
    const [rs, gs, bs] = [r / 255, g / 255, b / 255].map((val) => {
      return val <= 0.03928
        ? val / 12.92
        : Math.pow((val + 0.055) / 1.055, 2.4)
    })
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
  }

  const fg = hexToRgb(foreground)
  const bg = hexToRgb(background)

  if (!fg || !bg) return 1

  const l1 = calculateLuminance(fg.r, fg.g, fg.b)
  const l2 = calculateLuminance(bg.r, bg.g, bg.b)

  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
  return Math.round(ratio * 100) / 100
}

function getContrastLevel(ratio: number): {
  level: "AAA" | "AA" | "Fail"
  message: string
} {
  if (ratio >= 7) {
    return {
      level: "AAA",
      message: "ممتاز - مناسب برای همه متن‌ها",
    }
  } else if (ratio >= 4.5) {
    return {
      level: "AA",
      message: "خوب - مناسب برای اکثر متن‌ها",
    }
  } else {
    return {
      level: "Fail",
      message: "ضعیف - نیاز به بهبود",
    }
  }
}

export function ColorContrast({
  foreground,
  background,
  children,
  className,
}: ColorContrastProps) {
  const ratio = calculateContrastRatio(foreground, background)
  const { level, message } = getContrastLevel(ratio)

  return (
    <div
      className={className}
      style={{ color: foreground, backgroundColor: background }}
      role="status"
      aria-live="polite"
    >
      {children}
      <div className="mt-2 text-sm">
        <p>نسبت کنتراست: {ratio}:1</p>
        <p>
          سطح WCAG: {level} - {message}
        </p>
      </div>
    </div>
  )
} 