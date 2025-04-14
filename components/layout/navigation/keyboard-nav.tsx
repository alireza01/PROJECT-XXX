"use client"

import * as React from "react"

interface KeyboardNavProps {
  children: React.ReactNode
  className?: string
  onKeyDown?: (event: React.KeyboardEvent) => void
  onKeyUp?: (event: React.KeyboardEvent) => void
  focusFirst?: boolean
  loop?: boolean
  vertical?: boolean
  horizontal?: boolean
}

export function KeyboardNav({
  children,
  className,
  onKeyDown,
  onKeyUp,
  focusFirst = false,
  loop = true,
  vertical = true,
  horizontal = true,
}: KeyboardNavProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [focusIndex, setFocusIndex] = React.useState(-1)

  const getFocusableElements = () => {
    if (!containerRef.current) return []
    return Array.from(
      containerRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    )
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    onKeyDown?.(event)

    const elements = getFocusableElements()
    if (!elements.length) return

    const currentIndex = focusIndex === -1 ? 0 : focusIndex
    let nextIndex = currentIndex

    switch (event.key) {
      case "ArrowDown":
        if (!vertical) break
        event.preventDefault()
        nextIndex = currentIndex + 1
        break
      case "ArrowUp":
        if (!vertical) break
        event.preventDefault()
        nextIndex = currentIndex - 1
        break
      case "ArrowRight":
        if (!horizontal) break
        event.preventDefault()
        nextIndex = currentIndex + 1
        break
      case "ArrowLeft":
        if (!horizontal) break
        event.preventDefault()
        nextIndex = currentIndex - 1
        break
      case "Home":
        event.preventDefault()
        nextIndex = 0
        break
      case "End":
        event.preventDefault()
        nextIndex = elements.length - 1
        break
    }

    if (loop) {
      if (nextIndex < 0) nextIndex = elements.length - 1
      if (nextIndex >= elements.length) nextIndex = 0
    } else {
      if (nextIndex < 0) nextIndex = 0
      if (nextIndex >= elements.length) nextIndex = elements.length - 1
    }

    if (nextIndex !== currentIndex) {
      setFocusIndex(nextIndex)
      ;(elements[nextIndex] as HTMLElement).focus()
    }
  }

  React.useEffect(() => {
    if (focusFirst) {
      const elements = getFocusableElements()
      if (elements.length) {
        setFocusIndex(0)
        ;(elements[0] as HTMLElement).focus()
      }
    }
  }, [focusFirst])

  return (
    <div
      ref={containerRef}
      className={className}
      onKeyDown={handleKeyDown}
      onKeyUp={onKeyUp}
      role="navigation"
    >
      {children}
    </div>
  )
} 