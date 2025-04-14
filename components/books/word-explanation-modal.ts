"use client"

import React from 'react'
import { Word } from '@prisma/client'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { VolumeUp } from 'lucide-react'

interface WordExplanationModalProps {
  word: string
  explanation: {
    persianMeaning: string
    englishMeaning?: string
    example?: string
  }
  onClose: () => void
}

export function WordExplanationModal({
  word,
  explanation,
  onClose,
}: WordExplanationModalProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="text-2xl font-bold">{word}</span>
            <button
              onClick={() => {
                // Implement text-to-speech here
              }}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <VolumeUp className="h-5 w-5" />
            </button>
          </DialogTitle>
          {explanation.englishMeaning && (
            <DialogDescription className="text-sm text-muted-foreground">
              {explanation.englishMeaning}
            </DialogDescription>
          )}
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold text-primary">معنی:</h3>
            <p className="text-lg">{explanation.persianMeaning}</p>
          </div>
          
          {explanation.example && (
            <div>
              <h3 className="text-lg font-semibold text-primary">مثال:</h3>
              <p dir="ltr" className="bg-gray-50 dark:bg-gray-900 p-3 rounded">
                {explanation.example}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
