"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Plus, BookOpen, Languages, Edit2 } from 'lucide-react'

const contentItems = [
  {
    id: 1,
    title: 'کتاب اول',
    type: 'کتاب',
    language: 'انگلیسی',
    status: 'در حال ترجمه',
    lastUpdate: '1402/01/15 14:30',
  },
  {
    id: 2,
    title: 'کتاب دوم',
    type: 'کتاب',
    language: 'فارسی',
    status: 'تکمیل شده',
    lastUpdate: '1402/01/10 09:15',
  },
  // Add more content items as needed
]

export default function ContentPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedContent, setSelectedContent] = useState<number | null>(null)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          مدیریت محتوا
        </h1>
        <div className="flex space-x-4">
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-5 h-5 ml-2" />
            افزودن محتوا
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="relative w-64">
            <input
              type="text"
              placeholder="جستجوی محتوا..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          </div>
          <div className="flex space-x-4">
            <button className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Filter className="w-5 h-5 ml-2" />
              فیلترها
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contentItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <BookOpen className="w-5 h-5 text-blue-500 ml-2" />
                  <h3 className="text-lg font-medium">{item.title}</h3>
                </div>
                <button
                  onClick={() => setSelectedContent(item.id)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                    نوع:
                  </span>
                  <span className="text-sm font-medium">{item.type}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                    زبان:
                  </span>
                  <span className="text-sm font-medium">{item.language}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                    وضعیت:
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      item.status === 'تکمیل شده'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                    آخرین بروزرسانی:
                  </span>
                  <span className="text-sm">{item.lastUpdate}</span>
                </div>
              </div>

              <div className="mt-6 flex space-x-4">
                <button className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <Languages className="w-5 h-5 ml-2" />
                  ترجمه
                </button>
                <button className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  ویرایش
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
} 