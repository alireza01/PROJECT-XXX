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
  const variants = {
    ...(scale && hoverScale),
    ...(lift && hoverLift),
    ...(glow && hoverGlow),
  }

  return (
    <motion.div
      variants={variants}
      className={cn(
        "rounded-lg border border-gold-200 bg-white p-4 shadow-sm transition-colors dark:border-gray-800 dark:bg-gray-900",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  )
} 