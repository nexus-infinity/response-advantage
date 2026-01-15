"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"

export default function GeometricEntrance() {
  const [observed, setObserved] = useState(false)
  const [activeSymbol, setActiveSymbol] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)

  // The five glyphs from your logo: cycle → triangle → infinity → hourglass → A
  const glyphs = [
    { symbol: "↻", name: "cycle", meaning: "return" },
    { symbol: "△", name: "triangle", meaning: "ground" },
    { symbol: "∞", name: "infinity", meaning: "pattern" },
    { symbol: "⧗", name: "hourglass", meaning: "time" },
    { symbol: "A", name: "apex", meaning: "action" },
  ]

  useEffect(() => {
    if (observed) {
      // Animate through symbols when space is observed
      const sequence = async () => {
        for (let i = 0; i < glyphs.length; i++) {
          setActiveSymbol(i)
          await new Promise((r) => setTimeout(r, 800))
        }
        setActiveSymbol(-1)
      }
      sequence()
    }
  }, [observed, glyphs.length])

  return (
    <main
      ref={containerRef}
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: "var(--background)" }}
    >
      {/* Minimal grid - geometry substrate */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.02,
          backgroundImage:
            "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* The constructor space */}
      <div className="relative z-10 flex flex-col items-center gap-16">
        {/* Logo - the seed form */}
        <div
          className="relative cursor-pointer transition-all duration-1000"
          onClick={() => setObserved(true)}
          style={{
            transform: observed ? "scale(0.8)" : "scale(1)",
            opacity: observed ? 0.6 : 1,
          }}
        >
          <div className="w-40 h-40 relative">
            <Image src="/logo-recognition.png" alt="re-cognition" fill className="object-contain" priority />
          </div>
        </div>

        {/* Glyph progression - emerges on observation */}
        <div
          className="flex items-center gap-8 transition-all duration-1000"
          style={{
            opacity: observed ? 1 : 0,
            transform: observed ? "translateY(0)" : "translateY(20px)",
          }}
        >
          {glyphs.map((glyph, idx) => (
            <div
              key={glyph.name}
              className="flex flex-col items-center gap-2 transition-all duration-500"
              style={{
                opacity: activeSymbol === -1 ? 0.4 : activeSymbol === idx ? 1 : 0.15,
                transform: activeSymbol === idx ? "scale(1.3)" : "scale(1)",
              }}
            >
              <span
                className="text-4xl font-light transition-all duration-500"
                style={{
                  color: "var(--foreground)",
                  textShadow: activeSymbol === idx ? "0 0 30px var(--foreground)" : "none",
                }}
              >
                {glyph.symbol}
              </span>
            </div>
          ))}
        </div>

        {/* The word - appears after observation */}
        <div
          className="text-center transition-all duration-1000 delay-500"
          style={{
            opacity: observed ? 1 : 0,
            transform: observed ? "translateY(0)" : "translateY(10px)",
          }}
        >
          <h1 className="text-2xl font-light tracking-[0.3em] text-foreground/80">re-cognition</h1>
        </div>

        {/* Entrance - the circle invites */}
        <Link
          href="/start"
          className="group relative transition-all duration-700"
          style={{
            opacity: observed ? 1 : 0.3,
            transform: observed ? "scale(1)" : "scale(0.9)",
          }}
        >
          <div
            className="w-24 h-24 rounded-full border-2 flex items-center justify-center transition-all duration-500 group-hover:border-foreground"
            style={{ borderColor: "var(--foreground)", opacity: 0.4 }}
          >
            <span
              className="text-5xl transition-all duration-500 group-hover:opacity-100"
              style={{ color: "var(--foreground)", opacity: 0.5 }}
            >
              ●
            </span>
          </div>
          <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-mono text-foreground/40 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            enter observation
          </span>
        </Link>

        {/* Instruction - only if not yet observed */}
        {!observed && <p className="text-xs text-foreground/30 font-mono animate-pulse">observe</p>}
      </div>
    </main>
  )
}
