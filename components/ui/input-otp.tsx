"use client"

import * as React from "react"
import { Dot } from "lucide-react"
import { cn } from "@/lib/utils"

interface OTPInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  length?: number
  value: string
  onChange: (value: string) => void
  containerClassName?: string
}

const OTPInput = React.forwardRef<HTMLInputElement, OTPInputProps>(
  ({ className, containerClassName, length = 6, value, onChange, ...props }, ref) => {
    const inputRefs = React.useRef<(HTMLInputElement | null)[]>([])
    const [activeIndex, setActiveIndex] = React.useState<number>(-1)

    React.useEffect(() => {
      inputRefs.current = inputRefs.current.slice(0, length)
    }, [length])

    const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      if (newValue.length > 1) {
        e.target.value = newValue[0]
      }
      
      const newOTP = value.split('')
      newOTP[index] = newValue
      onChange(newOTP.join(''))

      if (newValue && index < length - 1) {
        inputRefs.current[index + 1]?.focus()
      }
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace' && !value[index] && index > 0) {
        inputRefs.current[index - 1]?.focus()
      }
    }

    const setRef = React.useCallback((el: HTMLInputElement | null, index: number) => {
      inputRefs.current[index] = el
      if (typeof ref === 'function') {
        ref(el)
      } else if (ref) {
        ref.current = el
      }
    }, [ref])

    return (
      <div className={cn("flex items-center gap-2", containerClassName)}>
        {Array.from({ length }).map((_, index) => (
          <input
            key={index}
            ref={(el) => setRef(el, index)}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={value[index] || ''}
            onChange={(e) => handleChange(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onFocus={() => setActiveIndex(index)}
            onBlur={() => setActiveIndex(-1)}
            className={cn(
              "h-10 w-10 rounded-md border border-input bg-background text-center text-sm transition-all",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              activeIndex === index && "ring-2 ring-ring ring-offset-2",
              className
            )}
            {...props}
          />
        ))}
      </div>
    )
  }
)
OTPInput.displayName = "OTPInput"

const InputOTPGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center", className)} {...props} />
))
InputOTPGroup.displayName = "InputOTPGroup"

const InputOTPSlot = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { index: number }
>(({ index, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "relative flex h-10 w-10 items-center justify-center border-y border-r border-input text-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md",
        className
      )}
      {...props}
    />
  )
})
InputOTPSlot.displayName = "InputOTPSlot"

export { OTPInput as InputOTP, InputOTPGroup, InputOTPSlot }
