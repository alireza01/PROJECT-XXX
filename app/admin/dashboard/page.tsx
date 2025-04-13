import { motion } from 'framer-motion'
import { Users, BookOpen, MessageSquare, BarChart2 } from 'lucide-react'

const stats = [
  { title: 'کاربران فعال', value: '1,234', icon: Users, change: '+12%' },
  { title: 'کتاب‌های موجود', value: '456', icon: BookOpen, change: '+5%' },
  { title: 'نظرات جدید', value: '89', icon: MessageSquare, change: '+23%' },
  { title: 'بازدید روزانه', value: '3,456', icon: BarChart2, change: '+8%' },
]

const recentBooks = [
  { id: 1, title: 'کتاب اول', author: 'نویسنده اول', date: '2 روز پیش' },
  { id: 2, title: 'کتاب دوم', author: 'نویسنده دوم', date: '3 روز پیش' },
  { id: 3, title: 'کتاب سوم', author: 'نویسنده سوم', date: '5 روز پیش' },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {stat.title}
                </p>
                <p className="text-2xl font-semibold mt-1">{stat.value}</p>
                <p className="text-sm text-green-500 mt-1">{stat.change}</p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <stat.icon className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold mb-4">آخرین کتاب‌های اضافه شده</h3>
          <div className="space-y-4">
            {recentBooks.map((book) => (
              <div
                key={book.id}
                className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
              >
                <div>
                  <p className="font-medium">{book.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {book.author}
                  </p>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {book.date}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold mb-4">آمار بازدید</h3>
          <div className="h-64 flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">
              نمودار آمار بازدید در اینجا نمایش داده می‌شود
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 