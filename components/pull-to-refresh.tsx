"use client"

import * as React from "react"
import { ArrowDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Spinner } from "@/components/ui/spinner"

interface PullToRefreshProps {
  onRefresh: () => Promise<void>
  children: React.ReactNode
  className?: string
}

export function PullToRefresh({
  onRefresh,
  children,
  className,
}: PullToRefreshProps) {
  const [isPulling, setIsPulling] = React.useState(false)
  const [isRefreshing, setIsRefreshing] = React.useState(false)
  const pullStartY = React.useRef(0)
  const pullMoveY = React.useRef(0)
  const distanceThreshold = 100
  const resistance = 2.5

  const handleTouchStart = (e: React.TouchEvent) => {
    const { scrollTop } = e.currentTarget
    if (scrollTop <= 0) {
      pullStartY.current = e.touches[0].clientY
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    const { scrollTop } = e.currentTarget
    if (scrollTop > 0 || isRefreshing) return

    pullMoveY.current = e.touches[0].clientY
    const distance = pullMoveY.current - pullStartY.current

    if (distance > 0) {
      e.preventDefault()
      setIsPulling(true)
      const pullDistance = Math.min(distance / resistance, distanceThreshold)
      e.currentTarget.style.transform = `translateY(${pullDistance}px)`
    }
  }

  const handleTouchEnd = async (e: React.TouchEvent) => {
    if (!isPulling) return

    const distance = pullMoveY.current - pullStartY.current
    e.currentTarget.style.transform = ""
    setIsPulling(false)

    if (distance > distanceThreshold) {
      setIsRefreshing(true)
      try {
        await onRefresh()
      } finally {
        setIsRefreshing(false)
      }
    }
  }

  return (
    <div
      className={cn("relative touch-none", className)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className={cn(
          "pointer-events-none absolute left-0 right-0 top-0 flex items-center justify-center p-4 opacity-0 transition-opacity",
          (isPulling || isRefreshing) && "opacity-100"
        )}
      >
        {isRefreshing ? (
          <Spinner className="h-6 w-6" />
        ) : (
          <ArrowDown
            className={cn(
              "h-6 w-6 transition-transform",
              isPulling && "rotate-180"
            )}
          />
        )}
      </div>
      {children}
    </div>
  )
} 