"use client"

import { motion } from "framer-motion"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const variants = {
  hidden: { opacity: 0, x: -20, y: 0 },
  enter: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 0, x: 20, y: 0 }
}

interface PageTransitionProps {
  children: React.ReactNode
  className?: string
}

export function PageTransition({ children, className }: PageTransitionProps) {
  const pathname = usePathname()

  return (
    <motion.div
      key={pathname}
      initial="hidden"
      animate="enter"
      exit="exit"
      variants={variants}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={cn("transition-all duration-300", className)}
    >
      {children}
    </motion.div>
  )
} 