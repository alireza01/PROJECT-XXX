import { motion } from 'framer-motion';
import { PageControlsProps } from '@/types';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function PageControls({
  currentPage,
  totalPages,
  onPageChange,
}: PageControlsProps) {
  const canGoBack = currentPage > 1;
  const canGoForward = currentPage < totalPages;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-4">
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="ghost"
            size="icon"
            disabled={!canGoBack}
            onClick={() => onPageChange(currentPage - 1)}
            className="rounded-full"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </motion.div>

        <div className="flex-1 mx-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="h-0.5 w-full bg-gray-200 dark:bg-gray-800" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-white dark:bg-gray-900 text-sm text-gray-600 dark:text-gray-400">
                صفحه {currentPage} از {totalPages}
              </span>
            </div>
          </div>
        </div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="ghost"
            size="icon"
            disabled={!canGoForward}
            onClick={() => onPageChange(currentPage + 1)}
            className="rounded-full"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
} 