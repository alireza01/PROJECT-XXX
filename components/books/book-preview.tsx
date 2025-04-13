"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Settings, Moon, Sun, Type } from "lucide-react"
import { Slider } from "@/components/ui/slider"

interface BookPreviewProps {
  id: string
}

export function BookPreview({ id }: BookPreviewProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [fontSize, setFontSize] = useState(16)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  // Mock data for the book preview
  const totalPages = 20 // Free preview pages
  const bookContent = `
    <p>Many <span class="word beginner" data-word="years">years</span> later, as he faced the <span class="word advanced" data-word="firing">firing</span> squad, Colonel Aureliano Buendía was to <span class="word intermediate" data-word="remember">remember</span> that distant afternoon when his father took him to <span class="word beginner" data-word="discover">discover</span> ice.</p>
    <p>It was a <span class="word beginner" data-word="pleasure">pleasure</span> to burn. It was a <span class="word intermediate" data-word="special">special</span> pleasure to see things eaten, to see things <span class="word advanced" data-word="blackened">blackened</span> and changed.</p>
    <p>The most <span class="word intermediate" data-word="merciful">merciful</span> thing in the world, I think, is the <span class="word advanced" data-word="inability">inability</span> of the human mind to <span class="word intermediate" data-word="correlate">correlate</span> all its contents.</p>
  `

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1)
    }
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  return (
    <section className="py-12 px-4 bg-white dark:bg-gray-900">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-2xl md:text-3xl font-bold mb-4"
          >
            پیش‌نمایش رایگان
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
          >
            ۲۰ صفحه اول کتاب را به صورت رایگان مطالعه کنید
          </motion.p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 md:p-12 ${isDarkMode ? "reader-dark" : ""}`}
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={handlePrevPage} disabled={currentPage === 1}>
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                  <span className="text-sm">
                    صفحه {currentPage} از {totalPages}
                  </span>
                  <Button variant="ghost" size="icon" onClick={handleNextPage} disabled={currentPage === totalPages}>
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={() => setIsSettingsOpen(!isSettingsOpen)}>
                    <Settings className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
                    {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                  </Button>
                </div>
              </div>

              {isSettingsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-6"
                >
                  <div className="flex items-center gap-4">
                    <Type className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm">اندازه متن:</span>
                    <Slider
                      defaultValue={[fontSize]}
                      max={24}
                      min={12}
                      step={1}
                      onValueChange={(value) => setFontSize(value[0])}
                      className="flex-1"
                    />
                    <span className="text-sm w-8 text-center">{fontSize}</span>
                  </div>
                </motion.div>
              )}

              <div
                className="prose prose-lg dark:prose-invert max-w-none"
                style={{ fontSize: `${fontSize}px`, direction: "ltr" }}
                dangerouslySetInnerHTML={{ __html: bookContent }}
              />

              {currentPage === totalPages && (
                <div className="mt-8 p-6 bg-[#F5F3FF] dark:bg-[#6949FF]/20 rounded-lg text-center">
                  <h3 className="text-xl font-bold mb-2">برای ادامه مطالعه، نسخه کامل را خریداری کنید</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    با خرید نسخه کامل، به تمام صفحات کتاب دسترسی خواهید داشت
                  </p>
                  <Button className="bg-[#6949FF] hover:bg-[#5A3FD6]">خرید نسخه کامل</Button>
                </div>
              )}
            </div>

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${index === (currentPage % 5) ? "bg-[#6949FF]" : "bg-gray-300 dark:bg-gray-700"}`}
                />
              ))}
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <Button className="bg-[#6949FF] hover:bg-[#5A3FD6]">خرید نسخه کامل</Button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .word {
          position: relative;
          cursor: pointer;
          border-radius: 2px;
          padding: 0 2px;
        }
        
        .word.beginner {
          background-color: rgba(74, 222, 128, 0.2);
          border-bottom: 2px solid rgba(74, 222, 128, 0.8);
        }
        
        .word.intermediate {
          background-color: rgba(59, 130, 246, 0.2);
          border-bottom: 2px solid rgba(59, 130, 246, 0.8);
        }
        
        .word.advanced {
          background-color: rgba(168, 85, 247, 0.2);
          border-bottom: 2px solid rgba(168, 85, 247, 0.8);
        }
        
        .reader-dark .word.beginner {
          background-color: rgba(74, 222, 128, 0.3);
        }
        
        .reader-dark .word.intermediate {
          background-color: rgba(59, 130, 246, 0.3);
        }
        
        .reader-dark .word.advanced {
          background-color: rgba(168, 85, 247, 0.3);
        }
      `}</style>
    </section>
  )
}
