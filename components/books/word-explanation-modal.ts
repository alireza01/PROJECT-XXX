"use client"

import { Word } from '@prisma/client'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { VolumeUp } from 'lucide-react'

interface WordExplanationModalProps {
  word: Word
  explanation: {
    id: string
    persianMeaning: string
    explanation: string | null
    example: string | null
  }
  isOpen: boolean
  onClose: () => void
}

export function WordExplanationModal({ word, explanation, isOpen, onClose }: WordExplanationModalProps) {
  // Function to speak the word using browser's speech synthesis
  const speakWord = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word.word)
      utterance.lang = 'en-US'
      window.speechSynthesis.speak(utterance)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="text-2xl font-bold">{word.word}</span>
            <button onClick={speakWord} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <VolumeUp className="h-5 w-5" />
            </button>
          </DialogTitle>
          {word.pronunciation && (
            <DialogDescription className="text-sm text-muted-foreground">
              {word.pronunciation}
            </DialogDescription>
          )}
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Persian meaning */}
          <div>
            <h3 className="text-xl font-semibold text-primary">معنی:</h3>
            <p className="text-lg">{explanation.persianMeaning}</p>
          </div>
          
          {/* Additional explanation if available */}
          {explanation.explanation && (
            <div>
              <h3 className="text-lg font-semibold text-primary">توضیح:</h3>
              <p>{explanation.explanation}</p>
            </div>
          )}
          
          {/* Example sentence if available */}
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
