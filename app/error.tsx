"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h2 className="text-3xl font-bold">Something went wrong!</h2>
        <Button
          onClick={() => reset()}
          variant="outline"
        >
          Try again
        </Button>
      </div>
    </div>
  )
} 