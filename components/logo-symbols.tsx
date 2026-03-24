"use client"

import { useEffect, useState } from "react"
import { SYMBOL_COLORS, SYMBOL_META, type SymbolKey } from "@/lib/constants/symbols"

interface LogoSymbolsProps {
  animate?: boolean
  size?: "sm" | "md" | "lg"
  className?: string
  direction?: "row" | "column"
}

const SYMBOLS: SymbolKey[] = ["●", "▼", "▲", "◼"]

export function LogoSymbols({ 
  animate = false, 
  size = "md", 
  className = "",
  direction = "column" 
}: LogoSymbolsProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  // Uniform sizing for all symbols
  const sizeClasses = {
    sm: { container: direction === "row" ? "gap-2" : "gap-1", symbol: "text-sm" },      // 14px uniform
    md: { container: direction === "row" ? "gap-3" : "gap-2", symbol: "text-base" },    // 16px uniform
    lg: { container: direction === "row" ? "gap-4" : "gap-3", symbol: "text-xl" },      // 20px uniform
  }

  useEffect(() => {
    if (!animate) return

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % SYMBOLS.length)
    }, 600)

    return () => clearInterval(interval)
  }, [animate])

  const { container, symbol: symbolSize } = sizeClasses[size]

  return (
    <div className={`flex ${direction === "row" ? "flex-row" : "flex-col"} items-center ${container} ${className}`}>
      {SYMBOLS.map((symbol, index) => (
        <span
          key={symbol}
          className={`${symbolSize} transition-all duration-300`}
          style={{
            color: animate && index === activeIndex ? SYMBOL_COLORS[symbol] : SYMBOL_COLORS[symbol],
            opacity: animate ? (index === activeIndex ? 1 : 0.3) : 0.6,
            transform: animate && index === activeIndex ? "scale(1.1)" : "scale(1)",
          }}
        >
          {symbol}
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
