"use client"

import React from 'react'
import { useState } from 'react'
import { Volume } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Database } from '@/types/supabase'

type Word = Database['public']['Tables']['vocabulary']['Row']

interface WordExplanationModalProps {
  word: Word;
  onClose: () => void;
}

export function WordExplanationModal({ word, onClose }: WordExplanationModalProps) {
  const [isSpeaking, setIsSpeaking] = useState(false)
  
  const speakWord = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word.word)
      utterance.lang = 'en-US'
      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      window.speechSynthesis.speak(utterance)
    }
  }
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{word.word}</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={speakWord}
            disabled={isSpeaking}
          >
            <Volume className={`h-5 w-5 ${isSpeaking ? 'text-primary' : ''}`} />
          </Button>
        </div>
        
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">تعریف</h4>
            <p className="mt-1">{word.meaning}</p>
          </div>
          
          {word.explanation && (
            <div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">توضیحات</h4>
              <p className="mt-1">{word.explanation}</p>
            </div>
          )}
        </div>
        
        <div className="mt-6 flex justify-end">
          <Button variant="outline" onClick={onClose}>
            بستن
          </Button>
        </div>
      </div>
    </div>
  )
} 