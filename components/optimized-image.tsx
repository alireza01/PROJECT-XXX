"use client"

import * as React from "react"
import Image, { ImageProps } from "next/image"
import { cn } from "@/lib/utils"

interface OptimizedImageProps extends Omit<ImageProps, "alt"> {
  alt: string
  fallback?: string
  aspectRatio?: number
  className?: string
}

export function OptimizedImage({
  src,
  alt,
  fallback = "/images/placeholder.jpg",
  aspectRatio = 16 / 9,
  className,
  ...props
}: OptimizedImageProps) {
  const [error, setError] = React.useState(false)
  const [loaded, setLoaded] = React.useState(false)

  const handleError = () => {
    setError(true)
    setLoaded(true)
  }

  const handleLoad = () => {
    setLoaded(true)
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-muted",
        !loaded && "animate-pulse",
        className
      )}
      style={{ paddingBottom: `${(1 / aspectRatio) * 100}%` }}
    >
      <Image
        src={error ? fallback : src}
        alt={alt}
        fill
        className={cn(
          "object-cover transition-opacity duration-300",
          loaded ? "opacity-100" : "opacity-0"
        )}
        onError={handleError}
        onLoad={handleLoad}
        {...props}
      />
    </div>
  )
} 