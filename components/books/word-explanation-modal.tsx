"use client"

import React, { useState, useEffect } from 'react'
import { Volume, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Database } from '@/types/supabase'
import { motion, AnimatePresence } from 'framer-motion'

type Word = Database['public']['Tables']['vocabulary']['Row']

interface WordExplanationModalProps {
  word: Word;
  onClose: () => void;
  isOpen: boolean;
}

export function WordExplanationModal({ word, onClose, isOpen }: WordExplanationModalProps) {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)
  
  useEffect(() => {
    // Cleanup speech synthesis on unmount
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  const speakWord = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word.word)
      utterance.lang = 'en-US'
      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.volume = 1
      
      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)
      
      window.speechSynthesis.cancel() // Cancel any ongoing speech
      window.speechSynthesis.speak(utterance)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            onKeyDown={handleKeyDown}
            role="dialog"
            aria-modal="true"
            aria-labelledby="word-title"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 id="word-title" className="text-xl font-semibold text-gray-900 dark:text-white">
                {word.word}
              </h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={speakWord}
                  disabled={isSpeaking}
                  className="hover:bg-gray-100 dark:hover:bg-gray-800"
                  aria-label={isSpeaking ? "Speaking..." : "Speak word"}
                >
                  <Volume className={`h-5 w-5 ${isSpeaking ? 'text-primary animate-pulse' : ''}`} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="hover:bg-gray-100 dark:hover:bg-gray-800"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Definition
                </h4>
                <p className="text-gray-900 dark:text-white">{word.meaning}</p>
              </div>
              
              {word.explanation && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Additional Information
                  </h4>
                  <p className="text-gray-900 dark:text-white">{word.explanation}</p>
                </div>
              )}
            </div>
            
            <div className="mt-6 flex justify-end">
              <Button 
                variant="outline" 
                onClick={onClose}
                className="hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Close
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 