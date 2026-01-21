"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"

// Symbol colors - the geometric language
const SYMBOL_COLORS = {
  "●": "#9370DB", // Observe - purple (OBI-WAN)
  "▼": "#FF8C00", // Ground - orange (TATA)
  "▲": "#FFD700", // Recognise - gold (ATLAS)
  "◼": "#0066CC", // Act - blue (DOJO)
}

// The narrative engine - each symbol DOES what it represents
const NARRATIVE_STAGES = [
  {
    symbol: "●",
    title: "OBSERVE",
    verb: "Document",
    description: "Evidence captured, location witnessed",
    // The demo shows actual observation happening
    demoLines: [
      { type: "input", text: "Email from TZV dated 14 Jan 2026..." },
      { type: "extract", text: "Timeline: 10 Jan → 13 Jan → 14 Jan" },
      { type: "extract", text: "Entities: TZV, Victoria Police, Anonymous Caller" },
      { type: "extract", text: "Location: Your residential address" },
    ],
    insight: "Your chaos, now structured.",
  },
  {
    symbol: "▼",
    title: "GROUND",
    verb: "Reference",
    description: "Laws and rights surface automatically",
    demoLines: [
      { type: "law", text: "FOI Act 1982 (Vic) s.33" },
      { type: "right", text: "Right to access personal information" },
      { type: "law", text: "TZV Act 2020 s.29(2)" },
      { type: "right", text: "Subject of call may access recording" },
    ],
    insight: "The law is on your side.",
  },
  {
    symbol: "▲",
    title: "RECOGNISE",
    verb: "Reveal",
    description: "Contradictions and patterns exposed",
    demoLines: [
      { type: "claim", text: '"Investigation revealed it was not a neighbour"' },
      { type: "contradiction", text: "Yet: No phone number, only first name, untraceable" },
      { type: "claim", text: '"Privacy considerations for the caller"' },
      { type: "contradiction", text: "Yet: Caller made claims about YOU" },
    ],
    insight: "You're not crazy. This doesn't add up.",
  },
  {
    symbol: "◼",
    title: "ACT",
    verb: "Manifest",
    description: "Ready documents generated instantly",
    demoLines: [
      { type: "action", text: "FOI Request — ready to send" },
      { type: "action", text: "Formal Response — legally grounded" },
      { type: "action", text: "Case Record — permanent, witnessed" },
      { type: "action", text: "Ombudsman Referral — if blocked" },
    ],
    insight: "From confusion to action in 30 seconds.",
  },
]

// Line type styling
const LINE_STYLES: Record<string, { prefix: string; color: string }> = {
  input: { prefix: "→", color: "text-white/50" },
  extract: { prefix: "●", color: "text-purple-400" },
  law: { prefix: "▼", color: "text-orange-400" },
  right: { prefix: "  ", color: "text-orange-300/70" },
  claim: { prefix: "▲", color: "text-red-400/70" },
  contradiction: { prefix: "  ↳", color: "text-emerald-400" },
  action: { prefix: "◼", color: "text-blue-400" },
}

const NARRATIVE_STAGES = NARRATIVE_STAGES; // Declare NARRATIVE_STAGES variable

export default function LandingPage() {
  const [activeStage, setActiveStage] = useState(0)
  const [isAnimating, setIsAnimating] = useState(true)
  const [visibleLines, setVisibleLines] = useState(0)
  const [showInsight, setShowInsight] = useState(false)

  // Auto-cycle through stages
  useEffect(() => {
    if (!isAnimating) return
    const interval = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % NARRATIVE_STAGES.length)
      setVisibleLines(0)
      setShowInsight(false)
    }, 5000)
    return () => clearInterval(interval)
  }, [isAnimating])

  // Animate lines appearing within each stage
  useEffect(() => {
    setVisibleLines(0)
    setShowInsight(false)
    
    const stage = NARRATIVE_STAGES[activeStage]
    const lineCount = stage.demoLines.length
    
    // Reveal lines one by one
    const lineInterval = setInterval(() => {
      setVisibleLines((prev) => {
        if (prev >= lineCount) {
          clearInterval(lineInterval)
          return prev
        }
        return prev + 1
      })
    }, 400)

    // Show insight after lines
    const insightTimeout = setTimeout(() => {
      setShowInsight(true)
    }, lineCount * 400 + 500)

    return () => {
      clearInterval(lineInterval)
      clearTimeout(insightTimeout)
    }
  }, [activeStage])

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center relative px-4 py-12">
        {/* Subtle grid background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Main content */}
        <div className="relative z-10 w-full max-w-5xl mx-auto">
          {/* Logo and Title - unified */}
          <div className="flex flex-col items-center mb-12 md:mb-16">
            <div className="relative w-32 h-32 md:w-44 md:h-44 mb-6">
              <Image
                src="/logo-recognition.png"
                alt="re-cognition"
                fill
                className="object-contain"
                priority
              />
              {/* Subtle glow behind logo */}
              <div
                className="absolute inset-0 -z-10 blur-3xl opacity-20"
                style={{
                  background: `radial-gradient(circle, ${SYMBOL_COLORS["●"]} 0%, transparent 70%)`,
                }}
              />
            </div>
            <h1 className="text-2xl md:text-3xl font-light tracking-[0.25em] text-white/90 mb-3">
              re-cognition
            </h1>
            <p className="text-white/40 text-sm md:text-base text-center max-w-md">
              Transform institutional chaos into actionable clarity
            </p>
          </div>

          {/* Symbol progression bar */}
          <div className="flex items-center justify-center gap-2 md:gap-4 mb-8">
            {NARRATIVE_STAGES.map((stage, idx) => (
              <button
                key={stage.symbol}
                onClick={() => {
                  setActiveStage(idx)
                  setIsAnimating(false)
                }}
                className="flex items-center gap-2 group"
              >
                <span
                  className={`text-2xl md:text-3xl transition-all duration-500 ${
                    activeStage === idx ? "scale-125" : "scale-100 opacity-40"
                  }`}
                  style={{
                    color: SYMBOL_COLORS[stage.symbol as keyof typeof SYMBOL_COLORS],
                    textShadow:
                      activeStage === idx
                        ? `0 0 20px ${SYMBOL_COLORS[stage.symbol as keyof typeof SYMBOL_COLORS]}`
                        : "none",
                  }}
                >
                  {stage.symbol}
                </span>
                {idx < NARRATIVE_STAGES.length - 1 && (
                  <span
                    className={`w-8 md:w-16 h-px transition-all duration-500 ${
                      activeStage > idx ? "bg-white/40" : "bg-white/10"
                    }`}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Demo card - shows current stage */}
          <div
            className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8 mb-12 mx-auto max-w-2xl transition-all duration-500"
            style={{
              borderColor: `${SYMBOL_COLORS[NARRATIVE_STAGES[activeStage].symbol as keyof typeof SYMBOL_COLORS]}40`,
            }}
          >
            {/* Stage indicator */}
            <div className="flex items-center gap-4 mb-4">
              <span
                className="text-4xl md:text-5xl"
                style={{
                  color: SYMBOL_COLORS[NARRATIVE_STAGES[activeStage].symbol as keyof typeof SYMBOL_COLORS],
                }}
              >
                {NARRATIVE_STAGES[activeStage].symbol}
              </span>
              <div>
                <h3
                  className="text-xl md:text-2xl font-medium"
                  style={{
                    color: SYMBOL_COLORS[NARRATIVE_STAGES[activeStage].symbol as keyof typeof SYMBOL_COLORS],
                  }}
                >
                  {NARRATIVE_STAGES[activeStage].title}
                </h3>
                <p className="text-white/50 text-sm">{NARRATIVE_STAGES[activeStage].description}</p>
              </div>
            </div>

            {/* Example content - lines appear one by one with proper styling */}
            <div className="bg-black/40 rounded-lg p-4 font-mono text-sm min-h-[120px]">
              {NARRATIVE_STAGES[activeStage].demoLines.slice(0, visibleLines).map((line, lineIdx) => {
                const style = LINE_STYLES[line.type] || LINE_STYLES.input
                return (
                  <div 
                    key={lineIdx} 
                    className={`mb-2 flex items-start gap-2 animate-in fade-in slide-in-from-left-2 duration-300 ${style.color}`}
                  >
                    <span className="opacity-60 w-4 shrink-0">{style.prefix}</span>
                    <span>{line.text}</span>
                  </div>
                )
              })}
              {/* Insight appears after all lines */}
              {showInsight && (
                <div className="mt-4 pt-3 border-t border-white/10 text-white/80 italic animate-in fade-in duration-500">
                  {NARRATIVE_STAGES[activeStage].insight}
                </div>
              )}
            </div>

            {/* Progress dots */}
            <div className="flex justify-center gap-2 mt-6">
              {NARRATIVE_STAGES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveStage(idx)
                    setIsAnimating(false)
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    activeStage === idx ? "bg-white scale-125" : "bg-white/30 hover:bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex flex-col items-center gap-4">
            <Link
              href="/start"
              className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full transition-all duration-300 hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${SYMBOL_COLORS["●"]}40, ${SYMBOL_COLORS["◼"]}40)`,
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              <span
                className="text-2xl transition-transform group-hover:scale-110"
                style={{ color: SYMBOL_COLORS["●"] }}
              >
                ●
              </span>
              <span className="text-white font-medium">Begin Your Case</span>
            </Link>

            <p className="text-white/30 text-xs">
              No account required. Your data stays with you.
            </p>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-white/30 text-xs">See how it works</span>
          <svg
            className="w-5 h-5 text-white/30"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* How it works section */}
      <section className="py-20 px-4 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-center text-white/50 text-sm tracking-widest mb-12">
            THE JOURNEY
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {NARRATIVE_STAGES.map((stage, idx) => (
              <div
                key={stage.symbol}
                className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-4">
                  <span
                    className="text-3xl"
                    style={{ color: SYMBOL_COLORS[stage.symbol as keyof typeof SYMBOL_COLORS] }}
                  >
                    {stage.symbol}
                  </span>
                  <div>
                    <span className="text-white/40 text-xs font-mono">STEP {idx + 1}</span>
                    <h3 className="text-lg font-medium text-white">{stage.title}</h3>
                  </div>
                </div>
                <p className="text-white/60 text-sm leading-relaxed mb-4">
                  {stage.description}
                </p>
                <div className="bg-black/30 rounded px-3 py-2 text-xs font-mono">
                  {stage.demoLines.map((line, lineIdx) => {
                    const style = LINE_STYLES[line.type] || LINE_STYLES.input
                    return (
                      <div key={lineIdx} className={`mb-1.5 flex items-start gap-2 ${style.color}`}>
                        <span className="opacity-60 w-3 shrink-0 text-[10px]">{style.prefix}</span>
                        <span>{line.text}</span>
                      </div>
                    )
                  })}
                </div>
                <p className="text-white/50 text-xs mt-3 italic">
                  {stage.insight}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 border-t border-white/10">
        <div className="max-w-xl mx-auto text-center">
          <div className="flex justify-center gap-2 mb-6">
            {Object.entries(SYMBOL_COLORS).map(([symbol, color]) => (
              <span key={symbol} className="text-2xl" style={{ color }}>
                {symbol}
              </span>
            ))}
          </div>
          <h2 className="text-2xl md:text-3xl font-light text-white mb-4">
            Knowledge should not be the privilege of the few
          </h2>
          <p className="text-white/50 mb-8">
            Transform confusion into clarity. Document, ground, recognise, act.
          </p>
          <Link
            href="/start"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-colors"
          >
            <span style={{ color: SYMBOL_COLORS["●"] }}>●</span>
            Start Now
          </Link>
        </div>
      </section>
    </main>
  )
}
