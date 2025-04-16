"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { hoverScale, hoverLift, hoverGlow } from "@/lib/animations"

interface InteractiveCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  scale?: boolean
  lift?: boolean
  glow?: boolean
}

export function InteractiveCard({
  children,
  className,
  scale = true,
  lift = true,
  glow = true,
  ...props
}: InteractiveCardProps) {
  return (
    <motion.div
      className={cn(
        "relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-all",
        className
      )}
      whileHover={scale ? hoverScale : undefined}
      animate={lift ? hoverLift : undefined}
      style={glow ? hoverGlow : undefined}
      {...props}
    >
      {children}
    </motion.div>
  )
} 