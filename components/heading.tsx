"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level: 1 | 2 | 3 | 4 | 5 | 6
  children: React.ReactNode
}

const headingStyles = {
  1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
  2: "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
  3: "scroll-m-20 text-2xl font-semibold tracking-tight",
  4: "scroll-m-20 text-xl font-semibold tracking-tight",
  5: "scroll-m-20 text-lg font-semibold tracking-tight",
  6: "scroll-m-20 text-base font-semibold tracking-tight",
}

export function Heading({ level, children, className, ...props }: HeadingProps) {
  const Component = `h${level}` as keyof JSX.IntrinsicElements
  const defaultStyles = headingStyles[level]

  return React.createElement(
    Component,
    {
      className: cn(defaultStyles, className),
      ...props,
    },
    children
  )
}

export function HeadingContext({
  children,
}: {
  children: React.ReactNode
}) {
  const [level, setLevel] = React.useState(1)

  const increaseLevel = React.useCallback(() => {
    setLevel((prev) => Math.min(prev + 1, 6))
  }, [])

  const decreaseLevel = React.useCallback(() => {
    setLevel((prev) => Math.max(prev - 1, 1))
  }, [])

  return (
    <HeadingLevelContext.Provider
      value={{ level, increaseLevel, decreaseLevel }}
    >
      {children}
    </HeadingLevelContext.Provider>
  )
}

interface HeadingLevelContextType {
  level: number
  increaseLevel: () => void
  decreaseLevel: () => void
}

const HeadingLevelContext = React.createContext<HeadingLevelContextType>({
  level: 1,
  increaseLevel: () => {},
  decreaseLevel: () => {},
})

export function useHeadingLevel() {
  return React.useContext(HeadingLevelContext)
}

export function Section({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const { increaseLevel, decreaseLevel } = useHeadingLevel()

  React.useEffect(() => {
    increaseLevel()
    return () => decreaseLevel()
  }, [increaseLevel, decreaseLevel])

  return (
    <section className={className} {...props}>
      {children}
    </section>
  )
} 