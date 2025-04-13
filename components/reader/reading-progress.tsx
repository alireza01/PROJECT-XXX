import { motion } from 'framer-motion';
import { ReadingProgressProps } from '@/types';

export function ReadingProgress({ currentPage, totalPages }: ReadingProgressProps) {
  const progress = (currentPage / totalPages) * 100;

  return (
    <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-800">
      <motion.div
        className="h-full bg-blue-500"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.3 }}
      />
      <div className="absolute top-2 right-4 text-sm text-gray-600 dark:text-gray-400">
        صفحه {currentPage} از {totalPages}
      </div>
    </div>
  );
} 