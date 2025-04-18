import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface SwipeGestureProps {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  threshold?: number
  children: React.ReactNode
  className?: string
  disabled?: boolean
  preventDefault?: boolean
  stopPropagation?: boolean
}

export function SwipeGesture({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50,
  children,
  className,
  disabled = false,
  preventDefault = true,
  stopPropagation = true,
}: SwipeGestureProps) {
  const [touchStart, setTouchStart] = useState<{ x: number | null; y: number | null }>({ x: null, y: null })
  const [touchEnd, setTouchEnd] = useState<{ x: number | null; y: number | null }>({ x: null, y: null })
  const containerRef = useRef<HTMLDivElement>(null)

  const onTouchStart = (e: React.TouchEvent) => {
    if (disabled) return
    
    if (preventDefault) e.preventDefault()
    if (stopPropagation) e.stopPropagation()
    
    setTouchEnd({ x: null, y: null })
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    })
  }

  const onTouchMove = (e: React.TouchEvent) => {
    if (disabled) return
    
    if (preventDefault) e.preventDefault()
    if (stopPropagation) e.stopPropagation()
    
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    })
  }

  const onTouchEnd = () => {
    if (disabled) return
    
    if (!touchStart.x || !touchEnd.x || !touchStart.y || !touchEnd.y) return

    const distanceX = touchStart.x - touchEnd.x
    const distanceY = touchStart.y - touchEnd.y
    
    // Determine if the swipe is more horizontal or vertical
    const isHorizontalSwipe = Math.abs(distanceX) > Math.abs(distanceY)
    
    if (isHorizontalSwipe) {
      const isLeftSwipe = distanceX > threshold
      const isRightSwipe = distanceX < -threshold

      if (isLeftSwipe && onSwipeLeft) {
        onSwipeLeft()
      }
      if (isRightSwipe && onSwipeRight) {
        onSwipeRight()
      }
    } else {
      const isUpSwipe = distanceY > threshold
      const isDownSwipe = distanceY < -threshold

      if (isUpSwipe && onSwipeUp) {
        onSwipeUp()
      }
      if (isDownSwipe && onSwipeDown) {
        onSwipeDown()
      }
    }
  }

  // Add keyboard support for accessibility
  useEffect(() => {
    if (disabled) return
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && onSwipeLeft) {
        onSwipeLeft()
      } else if (e.key === 'ArrowRight' && onSwipeRight) {
        onSwipeRight()
      } else if (e.key === 'ArrowUp' && onSwipeUp) {
        onSwipeUp()
      } else if (e.key === 'ArrowDown' && onSwipeDown) {
        onSwipeDown()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [disabled, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown])

  return (
    <div
      ref={containerRef}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className={cn("w-full h-full", className)}
      role="region"
      aria-label="Swipeable area"
    >
      {children}
    </div>
  )
} 