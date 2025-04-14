"use client"

import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface WordTooltipProps {
  word: string
  position: { x: number; y: number }
  onClose: () => void
  className?: string
}

export function WordTooltip({
  word,
  position,
  onClose,
  className
}: WordTooltipProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "fixed z-50",
          className
        )}
        style={{
          left: `${position.x}px`,
          top: `${position.y + 20}px`,
          transform: "translateX(-50%)"
        }}
      >
        <Card className="shadow-lg border-2">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold">{word}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Click to see translation and examples
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
} 