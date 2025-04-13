"use client"

import * as React from "react"
import { useDropzone } from "react-dropzone"
import { UploadCloud } from "lucide-react"

import { cn } from "@/lib/utils"

interface DragAndDropProps extends React.HTMLAttributes<HTMLDivElement> {
  onDrop: (acceptedFiles: File[]) => void
  accept?: Record<string, string[]>
  maxSize?: number
  maxFiles?: number
  disabled?: boolean
}

export function DragAndDrop({
  onDrop,
  accept,
  maxSize,
  maxFiles = 1,
  disabled = false,
  className,
  ...props
}: DragAndDropProps) {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    accept,
    maxSize,
    maxFiles,
    disabled,
  })

  return (
    <div
      {...getRootProps()}
      className={cn(
        "flex h-64 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600",
        {
          "border-primary": isDragAccept,
          "border-destructive": isDragReject,
          "cursor-not-allowed opacity-50": disabled,
        },
        className
      )}
      {...props}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center pt-5 pb-6">
        <UploadCloud className="mb-3 h-10 w-10 text-gray-400" />
        {isDragActive ? (
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
            فایل را اینجا رها کنید...
          </p>
        ) : (
          <>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">کلیک کنید</span> یا فایل را به
              اینجا بکشید
            </p>
            {accept && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {Object.keys(accept).join(", ")}
              </p>
            )}
            {maxSize && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                حداکثر حجم: {Math.round(maxSize / 1024 / 1024)} مگابایت
              </p>
            )}
          </>
        )}
      </div>
    </div>
  )
} 