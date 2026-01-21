"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"

// Symbol colors - the four vertices of the recognition system
const SYMBOL_COLORS = {
  "●": "#9370DB", // OBI-WAN - Observer/Evidence - purple
  "▼": "#FF8C00", // TATA - Law/Grounding - orange
  "▲": "#FFD700", // ATLAS - Pattern/Intelligence - gold
  "◼": "#0066CC", // DOJO - Action/Manifestation - blue
}

// Demo flow stages with richer content
const DEMO_STAGES = [
  {
    symbol: "●",
    title: "Observe",
    subtitle: "Document the chaos",
    description: "Drop your evidence. The system captures location, time, entities, and extracts the narrative thread from institutional confusion.",
    example: {
      input: "Confusing email from TZV about a 000 call...",
      output: "Timeline extracted. 4 entities identified. 6 events mapped.",
    },
  },
  {
    symbol: "▼",
    title: "Ground",
    subtitle: "Surface your rights",
    description: "Laws and precedents emerge automatically. What they told you versus what the legislation actually says.",
    example: {
      input: '"Privacy considerations apply..."',
      output: "FOI Act s.33 | TZV Act s.29(2) - Subject access provisions",
    },
  },
  {
    symbol: "▲",
    title: "Recognise",
    subtitle: "See the pattern",
    description: "Contradictions become visible. The narrative's internal logic is tested. Questions surface that illuminate what doesn't add up.",
    example: {
      input: '"Investigation revealed it was not your neighbours"',
      output: "Yet: No phone number, only first name, cannot contact caller",
    },
  },
  {
    symbol: "◼",
    title: "Act",
    subtitle: "Manifest your response",
    description: "Ready-to-send documents generated. FOI requests, formal responses, case records. Knowledge made actionable.",
    example: {
      input: "What can I do?",
      output: "FOI Request ready | TZV Response drafted | Case page live",
    },
  },
]

export default function LandingPage() {
  const [activeStage, setActiveStage] = useState(0)
  const [isAnimating, setIsAnimating] = useState(true)
  const [orbitAngle, setOrbitAngle] = useState(0)
  const heroRef = useRef<HTMLDivElement>(null)

  // Auto-cycle through demo stages
  useEffect(() => {
    if (!isAnimating) return
    const interval = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % DEMO_STAGES.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [isAnimating])

  // Orbital animation for symbols
  useEffect(() => {
    const animate = () => {
      setOrbitAngle((prev) => (prev + 0.3) % 360)
    }
    const interval = setInterval(animate, 50)
    return () => clearInterval(interval)
  }, [])

  // Get symbol position in orbit
  const getOrbitPosition = (index: number, radius: number) => {
    const baseAngle = (index * 90) + orbitAngle // 4 symbols, 90 degrees apart
    const rad = (baseAngle * Math.PI) / 180
    return {
      x: Math.cos(rad) * radius,
      y: Math.sin(rad) * radius * 0.3, // Flatten for perspective
    }
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* Hero Section */}
      <section ref={heroRef} className="min-h-screen flex flex-col items-center justify-center relative px-4 py-12">
        {/* Dynamic background - responds to active stage */}
        <div
          className="absolute inset-0 pointer-events-none transition-all duration-1000"
          style={{
            background: `
              radial-gradient(ellipse at 50% 30%, ${SYMBOL_COLORS[DEMO_STAGES[activeStage].symbol as keyof typeof SYMBOL_COLORS]}10 0%, transparent 50%),
              radial-gradient(ellipse at 30% 70%, ${SYMBOL_COLORS["●"]}05 0%, transparent 40%),
              radial-gradient(ellipse at 70% 60%, ${SYMBOL_COLORS["◼"]}05 0%, transparent 40%)
            `,
          }}
        />

        {/* Geometric grid substrate */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
          }}
        />

        {/* Main content */}
        <div className="relative z-10 w-full max-w-6xl mx-auto">
          {/* Central Logo with Orbiting Symbols */}
          <div className="flex flex-col items-center mb-8 md:mb-12">
            {/* Orbital system container */}
            <div className="relative w-64 h-64 md:w-80 md:h-80 mb-6">
              {/* Central logo */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-28 h-28 md:w-36 md:h-36">
                  <Image
                    src="/logo-recognition.png"
                    alt="re-cognition"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>

              {/* Orbital ring - faint */}
              <svg className="absolute inset-0 w-full h-full" viewBox="-150 -150 300 300">
                <ellipse
                  cx="0"
                  cy="0"
                  rx="120"
                  ry="40"
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="1"
                  strokeDasharray="4,4"
                />
              </svg>

              {/* Orbiting symbols */}
              {DEMO_STAGES.map((stage, idx) => {
                const pos = getOrbitPosition(idx, 120)
                const isActive = activeStage === idx
                return (
                  <button
                    key={stage.symbol}
                    onClick={() => {
                      setActiveStage(idx)
                      setIsAnimating(false)
                    }}
                    className="absolute transition-all duration-300"
                    style={{
                      left: `calc(50% + ${pos.x}px)`,
                      top: `calc(50% + ${pos.y}px)`,
                      transform: "translate(-50%, -50%)",
                      zIndex: pos.y > 0 ? 10 : 30, // Behind when at back of orbit
                    }}
                  >
                    <span
                      className={`block text-3xl md:text-4xl transition-all duration-500 ${
                        isActive ? "scale-150" : "scale-100"
                      }`}
                      style={{
                        color: SYMBOL_COLORS[stage.symbol as keyof typeof SYMBOL_COLORS],
                        textShadow: isActive
                          ? `0 0 30px ${SYMBOL_COLORS[stage.symbol as keyof typeof SYMBOL_COLORS]}, 0 0 60px ${SYMBOL_COLORS[stage.symbol as keyof typeof SYMBOL_COLORS]}50`
                          : `0 0 10px ${SYMBOL_COLORS[stage.symbol as keyof typeof SYMBOL_COLORS]}50`,
                        opacity: isActive ? 1 : 0.6,
                      }}
                    >
                      {stage.symbol}
                    </span>
                  </button>
                )
              })}

              {/* Connection lines to active symbol */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="-150 -150 300 300">
                {DEMO_STAGES.map((stage, idx) => {
                  const pos = getOrbitPosition(idx, 120)
                  const isActive = activeStage === idx
                  return (
                    <line
                      key={`line-${stage.symbol}`}
                      x1="0"
                      y1="0"
                      x2={pos.x}
                      y2={pos.y}
                      stroke={SYMBOL_COLORS[stage.symbol as keyof typeof SYMBOL_COLORS]}
                      strokeWidth={isActive ? 2 : 0.5}
                      strokeOpacity={isActive ? 0.6 : 0.1}
                      className="transition-all duration-500"
                    />
                  )
                })}
              </svg>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-light tracking-[0.3em] text-white/90 mb-2">
              re-cognition
            </h1>
            <p className="text-white/40 text-sm md:text-base text-center max-w-lg">
              Transform institutional chaos into actionable clarity
            </p>
          </div>

          {/* Demo Flow Card - Enhanced */}
          <div className="relative max-w-3xl mx-auto mb-10">
            {/* Stage progress bar */}
            <div className="flex items-center justify-center gap-1 mb-6">
              {DEMO_STAGES.map((stage, idx) => (
                <div key={stage.symbol} className="flex items-center">
                  <button
                    onClick={() => {
                      setActiveStage(idx)
                      setIsAnimating(false)
                    }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      activeStage === idx
                        ? "scale-110"
                        : activeStage > idx
                          ? "opacity-60"
                          : "opacity-30"
                    }`}
                    style={{
                      backgroundColor:
                        activeStage >= idx
                          ? `${SYMBOL_COLORS[stage.symbol as keyof typeof SYMBOL_COLORS]}20`
                          : "transparent",
                      border: `2px solid ${
                        activeStage >= idx
                          ? SYMBOL_COLORS[stage.symbol as keyof typeof SYMBOL_COLORS]
                          : "rgba(255,255,255,0.1)"
                      }`,
                    }}
                  >
                    <span
                      style={{
                        color:
                          activeStage >= idx
                            ? SYMBOL_COLORS[stage.symbol as keyof typeof SYMBOL_COLORS]
                            : "rgba(255,255,255,0.3)",
                      }}
                    >
                      {stage.symbol}
                    </span>
                  </button>
                  {idx < DEMO_STAGES.length - 1 && (
                    <div
                      className="w-8 md:w-16 h-0.5 mx-1 transition-all duration-500"
                      style={{
                        backgroundColor:
                          activeStage > idx
                            ? SYMBOL_COLORS[DEMO_STAGES[idx + 1].symbol as keyof typeof SYMBOL_COLORS]
                            : "rgba(255,255,255,0.1)",
                      }}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Main demo card */}
            <div
              className="relative bg-black/40 backdrop-blur-xl border rounded-2xl overflow-hidden transition-all duration-500"
              style={{
                borderColor: `${SYMBOL_COLORS[DEMO_STAGES[activeStage].symbol as keyof typeof SYMBOL_COLORS]}40`,
                boxShadow: `0 0 60px ${SYMBOL_COLORS[DEMO_STAGES[activeStage].symbol as keyof typeof SYMBOL_COLORS]}10`,
              }}
            >
              {/* Header */}
              <div
                className="px-6 py-4 border-b flex items-center gap-4"
                style={{
                  borderColor: `${SYMBOL_COLORS[DEMO_STAGES[activeStage].symbol as keyof typeof SYMBOL_COLORS]}20`,
                  background: `linear-gradient(90deg, ${SYMBOL_COLORS[DEMO_STAGES[activeStage].symbol as keyof typeof SYMBOL_COLORS]}10 0%, transparent 100%)`,
                }}
              >
                <span
                  className="text-4xl"
                  style={{
                    color: SYMBOL_COLORS[DEMO_STAGES[activeStage].symbol as keyof typeof SYMBOL_COLORS],
                    textShadow: `0 0 20px ${SYMBOL_COLORS[DEMO_STAGES[activeStage].symbol as keyof typeof SYMBOL_COLORS]}`,
                  }}
                >
                  {DEMO_STAGES[activeStage].symbol}
                </span>
                <div>
                  <h3
                    className="text-xl md:text-2xl font-semibold"
                    style={{
                      color: SYMBOL_COLORS[DEMO_STAGES[activeStage].symbol as keyof typeof SYMBOL_COLORS],
                    }}
                  >
                    {DEMO_STAGES[activeStage].title}
                  </h3>
                  <p className="text-white/50 text-sm">{DEMO_STAGES[activeStage].subtitle}</p>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-white/70 leading-relaxed mb-6">
                  {DEMO_STAGES[activeStage].description}
                </p>

                {/* Example visualization */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <p className="text-xs text-white/40 mb-2 font-mono">INPUT</p>
                    <p className="text-white/60 text-sm font-mono">
                      {DEMO_STAGES[activeStage].example.input}
                    </p>
                  </div>
                  <div
                    className="rounded-lg p-4 border"
                    style={{
                      backgroundColor: `${SYMBOL_COLORS[DEMO_STAGES[activeStage].symbol as keyof typeof SYMBOL_COLORS]}10`,
                      borderColor: `${SYMBOL_COLORS[DEMO_STAGES[activeStage].symbol as keyof typeof SYMBOL_COLORS]}30`,
                    }}
                  >
                    <p
                      className="text-xs mb-2 font-mono"
                      style={{
                        color: SYMBOL_COLORS[DEMO_STAGES[activeStage].symbol as keyof typeof SYMBOL_COLORS],
                      }}
                    >
                      OUTPUT
                    </p>
                    <p className="text-white/80 text-sm font-mono">
                      {DEMO_STAGES[activeStage].example.output}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col items-center gap-4">
            <Link
              href="/start"
              className="group relative inline-flex items-center gap-4 px-10 py-5 rounded-full transition-all duration-300 hover:scale-105 overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              {/* Animated gradient background */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `linear-gradient(135deg, ${SYMBOL_COLORS["●"]}30, ${SYMBOL_COLORS["▼"]}30, ${SYMBOL_COLORS["▲"]}30, ${SYMBOL_COLORS["◼"]}30)`,
                }}
              />
              
              {/* Symbols */}
              <div className="relative flex items-center gap-1">
                {Object.entries(SYMBOL_COLORS).map(([symbol, color], idx) => (
                  <span
                    key={symbol}
                    className="text-lg transition-all duration-300 group-hover:scale-110"
                    style={{
                      color,
                      transitionDelay: `${idx * 50}ms`,
                    }}
                  >
                    {symbol}
                  </span>
                ))}
              </div>
              
              <span className="relative text-white font-medium text-lg">Begin Your Case</span>
            </Link>

            <p className="text-white/30 text-xs">
              No account required. Your data stays with you.
            </p>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-white/30 text-xs tracking-wider">THE JOURNEY</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent" />
        </div>
      </section>

      {/* How it works section */}
      <section className="py-20 px-4 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-center text-white/50 text-sm tracking-widest mb-12">
            THE JOURNEY
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {DEMO_STAGES.map((stage, idx) => (
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
                <div className="bg-black/30 rounded px-3 py-2 text-xs font-mono text-white/50">
                  {stage.example}
                </div>
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
