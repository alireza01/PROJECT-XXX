"use client"

import React from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Settings,
  Moon,
  Sun,
  Type,
  List,
  Heart,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface PageControlsProps {
  currentPage: number
  totalPages: number
  onPrevPage: () => void
  onNextPage: () => void
  isBookmarked: boolean
  onBookmark: () => void
  isLiked: boolean
  onLike: () => void
  isDarkMode: boolean
  onToggleDarkMode: () => void
  fontSize: number
  onFontSizeChange: (size: number) => void
  lineHeight: number
  onLineHeightChange: (height: number) => void
  chapters: { title: string; page: number }[]
  onChapterSelect: (page: number) => void
}

export function PageControls({
  currentPage,
  totalPages,
  onPrevPage,
  onNextPage,
  isBookmarked,
  onBookmark,
  isLiked,
  onLike,
  isDarkMode,
  onToggleDarkMode,
  fontSize,
  onFontSizeChange,
  lineHeight,
  onLineHeightChange,
  chapters,
  onChapterSelect,
}: PageControlsProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Navigation Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onPrevPage}
              disabled={currentPage <= 1}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <span className="text-sm">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={onNextPage}
              disabled={currentPage >= totalPages}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBookmark}
              className={cn(isBookmarked && "text-primary")}
            >
              <Bookmark className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onLike}
              className={cn(isLiked && "text-primary")}
            >
              <Heart className="h-5 w-5" />
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Reading Settings</SheetTitle>
                </SheetHeader>
                <div className="space-y-6 py-4">
                  {/* Font Size Control */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Font Size</label>
                      <span className="text-sm text-muted-foreground">{fontSize}px</span>
                    </div>
                    <Slider
                      value={[fontSize]}
                      onValueChange={([value]) => onFontSizeChange(value)}
                      min={12}
                      max={24}
                      step={1}
                    />
                  </div>

                  {/* Line Height Control */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Line Height</label>
                      <span className="text-sm text-muted-foreground">{lineHeight}</span>
                    </div>
                    <Slider
                      value={[lineHeight]}
                      onValueChange={([value]) => onLineHeightChange(value)}
                      min={1.2}
                      max={2}
                      step={0.1}
                    />
                  </div>

                  {/* Theme Toggle */}
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={onToggleDarkMode}
                  >
                    {isDarkMode ? (
                      <>
                        <Sun className="h-4 w-4 mr-2" />
                        Light Mode
                      </>
                    ) : (
                      <>
                        <Moon className="h-4 w-4 mr-2" />
                        Dark Mode
                      </>
                    )}
                  </Button>

                  {/* Chapters List */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Chapters</label>
                    <div className="max-h-[200px] overflow-y-auto space-y-1">
                      {chapters.map((chapter) => (
                        <Button
                          key={chapter.page}
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => onChapterSelect(chapter.page)}
                        >
                          <List className="h-4 w-4 mr-2" />
                          {chapter.title}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </div>
  )
} 