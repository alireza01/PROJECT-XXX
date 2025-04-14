"use client"

import * as React from "react"
import { useDropzone, DropzoneOptions } from "react-dropzone"
import { UploadCloud } from "lucide-react"

import { cn } from "@/lib/utils"

interface DragAndDropProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onDrop'> {
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
  } as DropzoneOptions)

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
      <UploadCloud className="mb-2 h-8 w-8 text-gray-400" />
      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
        <span className="font-semibold">Click to upload</span> or drag and drop
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        {accept ? Object.keys(accept).join(", ") : "Any file type"} up to {maxSize ? `${maxSize / 1024 / 1024}MB` : "any size"}
      </p>
    </div>
  )
} 