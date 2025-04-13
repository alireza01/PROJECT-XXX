import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Cell {
  value: string;
  isEditing: boolean;
}

interface SpreadlyGridProps {
  initialData?: Cell[][];
  rows?: number;
  columns?: number;
  className?: string;
}

export const SpreadlyGrid: React.FC<SpreadlyGridProps> = ({
  initialData,
  rows = 10,
  columns = 10,
  className,
}) => {
  const [data, setData] = useState<Cell[][]>(
    initialData ||
      Array(rows)
        .fill(null)
        .map(() =>
          Array(columns)
            .fill(null)
            .map(() => ({ value: '', isEditing: false }))
        )
  );

  const handleCellChange = useCallback(
    (rowIndex: number, colIndex: number, value: string) => {
      setData((prev) => {
        const newData = [...prev];
        newData[rowIndex] = [...newData[rowIndex]];
        newData[rowIndex][colIndex] = { ...newData[rowIndex][colIndex], value };
        return newData;
      });
    },
    []
  );

  const handleCellClick = useCallback((rowIndex: number, colIndex: number) => {
    setData((prev) => {
      const newData = [...prev];
      newData[rowIndex] = [...newData[rowIndex]];
      newData[rowIndex][colIndex] = {
        ...newData[rowIndex][colIndex],
        isEditing: true,
      };
      return newData;
    });
  }, []);

  const handleCellBlur = useCallback((rowIndex: number, colIndex: number) => {
    setData((prev) => {
      const newData = [...prev];
      newData[rowIndex] = [...newData[rowIndex]];
      newData[rowIndex][colIndex] = {
        ...newData[rowIndex][colIndex],
        isEditing: false,
      };
      return newData;
    });
  }, []);

  return (
    <div
      className={cn(
        'w-full overflow-auto rounded-lg border border-gray-200 bg-white shadow-sm',
        className
      )}
    >
      <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-1 p-2">
        {data.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <motion.div
              key={`${rowIndex}-${colIndex}`}
              className={cn(
                'relative h-10 rounded-md border border-gray-200 p-1 transition-colors hover:border-gray-300',
                cell.isEditing && 'border-blue-500 ring-1 ring-blue-500'
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {cell.isEditing ? (
                <input
                  type="text"
                  value={cell.value}
                  onChange={(e) =>
                    handleCellChange(rowIndex, colIndex, e.target.value)
                  }
                  onBlur={() => handleCellBlur(rowIndex, colIndex)}
                  className="h-full w-full rounded-md border-none bg-transparent p-1 outline-none"
                  autoFocus
                />
              ) : (
                <div
                  className="flex h-full items-center p-1"
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                >
                  {cell.value}
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}; 