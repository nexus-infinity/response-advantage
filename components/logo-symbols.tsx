"use client"

import { useEffect, useState } from "react"

interface LogoSymbolsProps {
  animate?: boolean
  size?: "sm" | "md" | "lg"
  className?: string
}

export function LogoSymbols({ animate = false, size = "md", className = "" }: LogoSymbolsProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  const symbols = [
    { char: "●", label: "Evidence", color: "var(--evidence)" },
    { char: "▼", label: "Law", color: "var(--law)" },
    { char: "▲", label: "Pattern", color: "var(--pattern)" },
    { char: "◼", label: "Action", color: "var(--action)" },
  ]

  const sizeClasses = {
    sm: "text-xl gap-1",
    md: "text-3xl gap-2",
    lg: "text-5xl gap-3",
  }

  useEffect(() => {
    if (!animate) return

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % symbols.length)
    }, 600)

    return () => clearInterval(interval)
  }, [animate, symbols.length])

  return (
    <div className={`flex flex-col items-center ${sizeClasses[size]} ${className}`}>
      {symbols.map((symbol, index) => (
        <span
          key={index}
          className="transition-all duration-300"
          style={{
            color: animate && index === activeIndex ? symbol.color : "var(--muted-foreground)",
            opacity: animate ? (index === activeIndex ? 1 : 0.2) : 0.6,
            transform: animate && index === activeIndex ? "scale(1.1)" : "scale(1)",
          }}
        >
          {symbol.char}
        </span>
      ))}
    </div>
  )
}

export function SymbolSpinner({ size = "md" }: { size?: "sm" | "md" }) {
  return <LogoSymbols animate size={size} className="inline-flex" />
}

export function ProcessingSymbols() {
  return (
    <div className="flex items-center justify-center py-8">
      <LogoSymbols animate size="lg" />
    </div>
  )
}
