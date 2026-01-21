"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"

// Symbol system - the geometric language
const SYMBOLS = {
  observe: { glyph: "●", color: "#9370DB", name: "DOCUMENT", verb: "Observe" },
  ground: { glyph: "▼", color: "#FF8C00", name: "GROUND", verb: "Ground" },
  recognise: { glyph: "▲", color: "#FFD700", name: "RECOGNISE", verb: "Recognise" },
  act: { glyph: "◼", color: "#0066CC", name: "ACT", verb: "Act" },
}

// Narrative stages - the story unfolds through geometry
const NARRATIVE = [
  {
    key: "observe",
    headline: "Your confusion becomes data",
    subtext: "Drop the email. The PDF. The screenshot of bureaucratic nonsense.",
    visual: "evidence-drop", // triggers animation
    example: {
      input: "Confusing email from TZV about 000 call access...",
      output: "Timeline extracted. Entities identified. Location marked.",
    },
  },
  {
    key: "ground",
    headline: "Law surfaces automatically",
    subtext: "What they told you vs what the legislation actually says.",
    visual: "law-contrast",
    example: {
      theySaid: '"Privacy considerations for the anonymous caller"',
      lawSays: "FOI Act s.33: Right to access personal information",
    },
  },
  {
    key: "recognise",
    headline: "Contradictions become visible",
    subtext: "The patterns they hoped you wouldn't notice.",
    visual: "pattern-reveal",
    example: {
      claim: '"Investigation revealed it was not your neighbours"',
      reality: "No phone number. No identity. No way to investigate.",
    },
  },
  {
    key: "act",
    headline: "Action materialises",
    subtext: "Ready-to-send documents. No lawyer required.",
    visual: "action-cards",
    example: {
      outputs: ["FOI Request", "Formal Response", "Ombudsman Complaint", "Case Record"],
    },
  },
]

export default function LandingPage() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [hasInteracted, setHasInteracted] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)

  const activeStage = NARRATIVE[activeIndex]
  const activeSymbol = SYMBOLS[activeStage.key as keyof typeof SYMBOLS]

  // Auto-advance narrative
  useEffect(() => {
    if (!isAutoPlaying) return
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % NARRATIVE.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [isAutoPlaying])

  // Handle symbol click
  const handleSymbolClick = (index: number) => {
    setActiveIndex(index)
    setIsAutoPlaying(false)
    setHasInteracted(true)
  }

  return (
    <main className="min-h-screen bg-[#050508] text-white">
      {/* Hero - Full viewport symbolic experience */}
      <section ref={heroRef} className="min-h-screen relative flex flex-col">
        {/* Ambient background - subtle geometry */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Radial gradient following active symbol color */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-[0.08] blur-3xl transition-all duration-1000"
            style={{ backgroundColor: activeSymbol.color }}
          />
          {/* Subtle grid */}
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `linear-gradient(${activeSymbol.color}20 1px, transparent 1px), linear-gradient(90deg, ${activeSymbol.color}20 1px, transparent 1px)`,
              backgroundSize: "80px 80px",
            }}
          />
        </div>

        {/* Top bar - Logo small */}
        <header className="relative z-20 flex items-center justify-between p-6 md:p-8">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <Image src="/logo-recognition.png" alt="re-cognition" fill className="object-contain" priority />
            </div>
            <span className="text-sm font-light tracking-widest text-white/60 hidden sm:block">re-cognition</span>
          </div>
          <Link
            href="/start"
            className="text-sm text-white/60 hover:text-white transition-colors flex items-center gap-2"
          >
            <span style={{ color: activeSymbol.color }}>{activeSymbol.glyph}</span>
            Start
          </Link>
        </header>

        {/* Main hero content */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 relative z-10">
          {/* Central symbol - the anchor */}
          <div className="mb-8 md:mb-12">
            <div
              className="relative w-24 h-24 md:w-32 md:h-32 flex items-center justify-center transition-all duration-700"
              style={{
                filter: `drop-shadow(0 0 60px ${activeSymbol.color}50)`,
              }}
            >
              {/* Outer ring */}
              <div
                className="absolute inset-0 rounded-full border-2 opacity-20 transition-all duration-700"
                style={{ borderColor: activeSymbol.color }}
              />
              {/* Pulsing ring */}
              <div
                className="absolute inset-0 rounded-full border opacity-40 animate-ping"
                style={{ borderColor: activeSymbol.color, animationDuration: "3s" }}
              />
              {/* The glyph */}
              <span
                className="text-5xl md:text-7xl transition-all duration-500"
                style={{ color: activeSymbol.color }}
              >
                {activeSymbol.glyph}
              </span>
            </div>
          </div>

          {/* Headline - changes with stage */}
          <div className="text-center max-w-2xl mx-auto mb-8 md:mb-12">
            <h1 className="text-3xl md:text-5xl font-light mb-4 transition-all duration-500 leading-tight">
              {activeStage.headline}
            </h1>
            <p className="text-lg md:text-xl text-white/50 transition-all duration-500">
              {activeStage.subtext}
            </p>
          </div>

          {/* Visual example card - the proof */}
          <div
            className="w-full max-w-xl mx-auto rounded-2xl border bg-white/[0.02] backdrop-blur-sm p-6 md:p-8 transition-all duration-500"
            style={{ borderColor: `${activeSymbol.color}30` }}
          >
            {/* Stage-specific content */}
            {activeStage.key === "observe" && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-white/40 text-sm">
                  <span style={{ color: activeSymbol.color }}>{activeSymbol.glyph}</span>
                  INPUT
                </div>
                <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-white/60 border border-white/10">
                  {activeStage.example.input}
                </div>
                <div className="flex items-center gap-2 justify-center text-white/20">
                  <span className="w-8 h-px bg-current" />
                  <span className="text-xs">BECOMES</span>
                  <span className="w-8 h-px bg-current" />
                </div>
                <div
                  className="rounded-lg p-4 text-sm border"
                  style={{ borderColor: `${activeSymbol.color}40`, backgroundColor: `${activeSymbol.color}10` }}
                >
                  <span style={{ color: activeSymbol.color }}>{activeStage.example.output}</span>
                </div>
              </div>
            )}

            {activeStage.key === "ground" && (
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <p className="text-xs text-red-400/70 mb-2">THEY SAID</p>
                  <p className="text-white/80 text-sm">{activeStage.example.theySaid}</p>
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
                  <p className="text-xs text-emerald-400/70 mb-2">LAW SAYS</p>
                  <p className="text-white/80 text-sm">{activeStage.example.lawSays}</p>
                </div>
              </div>
            )}

            {activeStage.key === "recognise" && (
              <div className="space-y-4">
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <p className="text-xs text-white/40 mb-2">CLAIM</p>
                  <p className="text-white/80 text-sm">{activeStage.example.claim}</p>
                </div>
                <div
                  className="rounded-lg p-4 border"
                  style={{ borderColor: `${activeSymbol.color}40`, backgroundColor: `${activeSymbol.color}10` }}
                >
                  <p className="text-xs mb-2" style={{ color: `${activeSymbol.color}99` }}>REALITY</p>
                  <p className="text-white/90 text-sm font-medium">{activeStage.example.reality}</p>
                </div>
              </div>
            )}

            {activeStage.key === "act" && (
              <div className="grid grid-cols-2 gap-3">
                {activeStage.example.outputs.map((output, idx) => (
                  <div
                    key={output}
                    className="rounded-lg p-4 text-center border transition-all duration-300 hover:scale-105 cursor-pointer"
                    style={{
                      borderColor: `${activeSymbol.color}30`,
                      backgroundColor: idx === 0 ? `${activeSymbol.color}20` : "transparent",
                    }}
                  >
                    <span
                      className="text-lg block mb-1"
                      style={{ color: activeSymbol.color }}
                    >
                      {["●", "▼", "▲", "◼"][idx]}
                    </span>
                    <span className="text-sm text-white/70">{output}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Symbol navigation - the journey line */}
          <div className="mt-12 flex items-center gap-4 md:gap-6">
            {NARRATIVE.map((stage, idx) => {
              const symbol = SYMBOLS[stage.key as keyof typeof SYMBOLS]
              const isActive = idx === activeIndex
              const isPast = idx < activeIndex

              return (
                <button
                  key={stage.key}
                  onClick={() => handleSymbolClick(idx)}
                  className="flex items-center gap-4 md:gap-6 group"
                >
                  <div
                    className={`relative flex items-center justify-center transition-all duration-500 ${
                      isActive ? "scale-125" : "scale-100"
                    }`}
                  >
                    {/* Active ring */}
                    {isActive && (
                      <div
                        className="absolute inset-0 rounded-full border-2 scale-150 opacity-50"
                        style={{ borderColor: symbol.color }}
                      />
                    )}
                    <span
                      className={`text-2xl md:text-3xl transition-all duration-300 ${
                        isActive ? "" : isPast ? "opacity-60" : "opacity-30"
                      } group-hover:opacity-100`}
                      style={{
                        color: symbol.color,
                        textShadow: isActive ? `0 0 30px ${symbol.color}` : "none",
                      }}
                    >
                      {symbol.glyph}
                    </span>
                  </div>
                  {/* Connector line */}
                  {idx < NARRATIVE.length - 1 && (
                    <div
                      className={`w-8 md:w-12 h-px transition-all duration-500 ${
                        isPast ? "opacity-60" : "opacity-20"
                      }`}
                      style={{
                        backgroundColor: isPast ? SYMBOLS[NARRATIVE[idx + 1].key as keyof typeof SYMBOLS].color : "white",
                      }}
                    />
                  )}
                </button>
              )
            })}
          </div>

          {/* Stage labels - appears on hover/interaction */}
          <div className="mt-4 h-6">
            <p
              className="text-xs tracking-widest transition-all duration-300"
              style={{ color: `${activeSymbol.color}99` }}
            >
              {activeSymbol.name}
            </p>
          </div>
        </div>

        {/* CTA - fixed at bottom */}
        <div className="relative z-20 flex flex-col items-center gap-4 pb-12">
          <Link
            href="/start"
            className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${SYMBOLS.observe.color}30, ${SYMBOLS.act.color}30)`,
              border: `1px solid ${activeSymbol.color}40`,
            }}
          >
            {/* Animated gradient on hover */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: `linear-gradient(90deg, ${SYMBOLS.observe.color}20, ${SYMBOLS.ground.color}20, ${SYMBOLS.recognise.color}20, ${SYMBOLS.act.color}20)`,
              }}
            />
            <span className="relative flex items-center gap-2">
              {Object.values(SYMBOLS).map((s, i) => (
                <span
                  key={s.glyph}
                  className="text-lg transition-transform group-hover:scale-110"
                  style={{ color: s.color, transitionDelay: `${i * 50}ms` }}
                >
                  {s.glyph}
                </span>
              ))}
            </span>
            <span className="relative text-white font-medium">Begin Your Journey</span>
          </Link>
          <p className="text-white/30 text-xs">No account. No tracking. Your data stays with you.</p>
        </div>
      </section>

      {/* How it works - detailed breakdown */}
      <section className="py-24 px-4 border-t border-white/5 bg-[#030305]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex justify-center gap-3 mb-4">
              {Object.values(SYMBOLS).map((s) => (
                <span key={s.glyph} className="text-2xl" style={{ color: s.color }}>
                  {s.glyph}
                </span>
              ))}
            </div>
            <h2 className="text-2xl md:text-3xl font-light text-white/90 mb-3">
              Four symbols. One system.
            </h2>
            <p className="text-white/40 max-w-lg mx-auto">
              Each geometric form represents a phase of transformation from confusion to clarity.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {NARRATIVE.map((stage, idx) => {
              const symbol = SYMBOLS[stage.key as keyof typeof SYMBOLS]
              return (
                <div
                  key={stage.key}
                  className="group relative bg-white/[0.02] border border-white/5 rounded-xl p-6 hover:border-white/10 transition-all duration-300"
                >
                  {/* Symbol large background */}
                  <div
                    className="absolute top-4 right-4 text-6xl opacity-5 group-hover:opacity-10 transition-opacity"
                    style={{ color: symbol.color }}
                  >
                    {symbol.glyph}
                  </div>

                  <div className="relative">
                    <span
                      className="text-3xl block mb-4"
                      style={{ color: symbol.color }}
                    >
                      {symbol.glyph}
                    </span>
                    <h3 className="text-lg font-medium text-white mb-2">{symbol.name}</h3>
                    <p className="text-white/50 text-sm leading-relaxed mb-4">{stage.subtext}</p>
                    <div
                      className="text-xs px-3 py-1 rounded-full inline-block"
                      style={{ backgroundColor: `${symbol.color}20`, color: symbol.color }}
                    >
                      Step {idx + 1}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 border-t border-white/5">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-light text-white mb-4 leading-tight">
            Knowledge should not be the privilege of the few
          </h2>
          <p className="text-white/50 text-lg mb-10">
            The geometry of understanding. Document. Ground. Recognise. Act.
          </p>
          <Link
            href="/start"
            className="inline-flex items-center gap-3 px-10 py-5 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-all hover:scale-105"
          >
            <span className="flex items-center gap-1">
              {Object.values(SYMBOLS).map((s) => (
                <span key={s.glyph} className="text-sm" style={{ color: s.color }}>
                  {s.glyph}
                </span>
              ))}
            </span>
            Start Your Case
          </Link>
        </div>
      </section>
    </main>
  )
}
