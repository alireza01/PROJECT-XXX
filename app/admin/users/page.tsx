import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, MoreVertical, UserPlus, Mail, Shield } from 'lucide-react'

const users = [
  {
    id: 1,
    name: 'کاربر اول',
    email: 'user1@example.com',
    role: 'کاربر عادی',
    status: 'فعال',
    lastLogin: '1402/01/15 14:30',
  },
  {
    id: 2,
    name: 'کاربر دوم',
    email: 'user2@example.com',
    role: 'مدیر',
    status: 'غیرفعال',
    lastLogin: '1402/01/10 09:15',
  },
  // Add more users as needed
]

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUser, setSelectedUser] = useState<number | null>(null)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          مدیریت کاربران
        </h1>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <UserPlus className="w-5 h-5 ml-2" />
          افزودن کاربر
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="relative w-64">
            <input
              type="text"
              placeholder="جستجوی کاربر..."
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
                <th className="py-3 px-4">آخرین ورود</th>
                <th className="py-3 px-4">وضعیت</th>
                <th className="py-3 px-4">نقش</th>
                <th className="py-3 px-4">ایمیل</th>
                <th className="py-3 px-4">نام</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="py-3 px-4">
                    <div className="relative">
                      <button
                        onClick={() => setSelectedUser(user.id)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                      {selectedUser === user.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden z-10"
                        >
                          <button className="flex items-center w-full px-4 py-2 text-right hover:bg-gray-50 dark:hover:bg-gray-700">
                            <Mail className="w-4 h-4 ml-2" />
                            ارسال ایمیل
                          </button>
                          <button className="flex items-center w-full px-4 py-2 text-right hover:bg-gray-50 dark:hover:bg-gray-700">
                            <Shield className="w-4 h-4 ml-2" />
                            تغییر نقش
                          </button>
                        </motion.div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">{user.lastLogin}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        user.status === 'فعال'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">{user.role}</td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4 font-medium">{user.name}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 