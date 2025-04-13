"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { InteractiveCard } from "@/components/ui/interactive-card"
import { cn } from "@/lib/utils"
import { listItem } from "@/lib/animations"

interface BookCardProps {
  id: string
  title: string
  author: string
  coverImage: string
  className?: string
}

export function BookCard({ id, title, author, coverImage, className }: BookCardProps) {
  return (
    <motion.div variants={listItem}>
      <Link href={`/books/${id}`}>
        <InteractiveCard className={cn("group", className)}>
          <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
            <Image
              src={coverImage}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="mt-4 space-y-1">
            <h3 className="font-medium text-gold-800 dark:text-gold-200">{title}</h3>
            <p className="text-sm text-gold-600 dark:text-gold-300">{author}</p>
          </div>
        </InteractiveCard>
      </Link>
    </motion.div>
  )
} 