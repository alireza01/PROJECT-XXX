import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Filter, MoreVertical } from 'lucide-react'

const books = [
  {
    id: 1,
    title: 'کتاب اول',
    author: 'نویسنده اول',
    level: 'متوسط',
    status: 'فعال',
    addedDate: '1402/01/15',
  },
  {
    id: 2,
    title: 'کتاب دوم',
    author: 'نویسنده دوم',
    level: 'پیشرفته',
    status: 'غیرفعال',
    addedDate: '1402/01/20',
  },
  // Add more books as needed
]

export default function BooksPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          مدیریت کتاب‌ها
        </h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5 ml-2" />
          افزودن کتاب جدید
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="relative w-64">
            <input
              type="text"
              placeholder="جستجوی کتاب..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          </div>
          <button className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Filter className="w-5 h-5 ml-2" />
            فیلترها
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-right border-b border-gray-200 dark:border-gray-700">
                <th className="py-3 px-4">عملیات</th>
                <th className="py-3 px-4">تاریخ افزودن</th>
                <th className="py-3 px-4">وضعیت</th>
                <th className="py-3 px-4">سطح</th>
                <th className="py-3 px-4">نویسنده</th>
                <th className="py-3 px-4">عنوان</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <motion.tr
                  key={book.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="py-3 px-4">
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                  <td className="py-3 px-4">{book.addedDate}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        book.status === 'فعال'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                      }`}
                    >
                      {book.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">{book.level}</td>
                  <td className="py-3 px-4">{book.author}</td>
                  <td className="py-3 px-4 font-medium">{book.title}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Book Modal */}
      {showAddModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md"
          >
            <h2 className="text-xl font-bold mb-4">افزودن کتاب جدید</h2>
            {/* Add book form here */}
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                انصراف
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                ذخیره
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
} 