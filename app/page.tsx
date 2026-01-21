"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"

// Symbol colors from manifest
const SYMBOL_COLORS = {
  "●": "#9370DB", // Document - purple (observation)
  "▼": "#FF8C00", // Ground - orange (evidence/law)
  "▲": "#FFD700", // Recognise - gold (pattern detection)
  "◼": "#0066CC", // Act - blue (manifestation)
}

// The chaotic email that transforms
const CHAOS_EMAIL = `Dear Mr Spizzo,

Thank you for your enquiry regarding the 000 call. Our investigation revealed it was not one of your neighbours. I suspect it might have been a passerby.

A call was made from a default mobile with no number able to be obtained. The caller gave a first name only and could not be contacted.

Unfortunately we are unable to prove the call was made maliciously. Privacy considerations apply to the anonymous caller. You may wish to obtain a subpoena.

Kind regards,
Information Access Officer`

// Transformation stages
const STAGES = [
  {
    id: "chaos",
    symbol: null,
    title: "You received this...",
    subtitle: "Confusing. Contradictory. Designed to exhaust.",
  },
  {
    id: "document",
    symbol: "●",
    title: "Document",
    subtitle: "Evidence captured. Location tagged.",
    extract: ["000 call", "10 Jan 2026", "Your address", "Anonymous caller", "No phone number"],
  },
  {
    id: "ground",
    symbol: "▼",
    title: "Ground",
    subtitle: "Laws and rights surface.",
    laws: [
      { cite: "FOI Act s.33", text: "Right to access personal information" },
      { cite: "TZV Act s.29(2)", text: "Subject of call may access recordings" },
    ],
  },
  {
    id: "recognise",
    symbol: "▲",
    title: "Recognise",
    subtitle: "Contradictions revealed.",
    contrasts: [
      { said: '"Investigation revealed..."', reality: "No identifying info exists" },
      { said: '"Privacy for anonymous caller"', reality: "Caller named YOU" },
      { said: '"Unable to prove malicious"', reality: "Unable to prove ANYTHING" },
    ],
  },
  {
    id: "act",
    symbol: "◼",
    title: "Act",
    subtitle: "Ready to send.",
    actions: ["FOI Request", "Formal Response", "Case Record", "Ombudsman Referral"],
  },
]

export default function LandingPage() {
  const [currentStage, setCurrentStage] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [hasInteracted, setHasInteracted] = useState(false)

  // Auto-play through stages
  useEffect(() => {
    if (!isPlaying) return
    const durations = [3000, 2500, 2500, 3000, 3000] // Time per stage
    const timer = setTimeout(() => {
      setCurrentStage((prev) => {
        if (prev >= STAGES.length - 1) {
          return 0 // Loop back
        }
        return prev + 1
      })
    }, durations[currentStage])
    return () => clearTimeout(timer)
  }, [currentStage, isPlaying])

  const stage = STAGES[currentStage]
  const stageColor = stage.symbol ? SYMBOL_COLORS[stage.symbol as keyof typeof SYMBOL_COLORS] : "#666"

  const handleStageClick = (idx: number) => {
    setCurrentStage(idx)
    setIsPlaying(false)
    setHasInteracted(true)
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Hero Section - Full viewport */}
      <section className="min-h-screen flex flex-col relative overflow-hidden">
        {/* Animated background gradient based on current stage */}
        <div
          className="absolute inset-0 transition-all duration-1000 opacity-20"
          style={{
            background: `radial-gradient(ellipse at 50% 30%, ${stageColor}30 0%, transparent 60%)`,
          }}
        />

        {/* Header with logo */}
        <header className="relative z-20 flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 relative">
              <Image src="/logo-recognition.png" alt="re-cognition" fill className="object-contain" />
            </div>
            <span className="text-white/70 font-light tracking-wider text-sm hidden sm:block">re-cognition</span>
          </div>
          <Link
            href="/start"
            className="px-4 py-2 text-sm border border-white/20 rounded-full hover:bg-white/10 transition-colors"
          >
            Start Your Case
          </Link>
        </header>

        {/* Main hero content */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 relative z-10">
          {/* Symbol progression bar */}
          <div className="flex items-center gap-3 mb-8">
            {STAGES.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => handleStageClick(idx)}
                className="flex items-center gap-3 group"
              >
                {idx === 0 ? (
                  <div
                    className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center transition-all duration-500 ${
                      currentStage === 0 ? "border-white/60 bg-white/10" : "border-white/20"
                    }`}
                  >
                    <span className="text-xs text-white/60">?</span>
                  </div>
                ) : (
                  <span
                    className={`text-2xl md:text-3xl transition-all duration-500 ${
                      currentStage === idx ? "scale-125" : "scale-100 opacity-40"
                    }`}
                    style={{
                      color: SYMBOL_COLORS[s.symbol as keyof typeof SYMBOL_COLORS],
                      textShadow: currentStage === idx
                        ? `0 0 30px ${SYMBOL_COLORS[s.symbol as keyof typeof SYMBOL_COLORS]}`
                        : "none",
                    }}
                  >
                    {s.symbol}
                  </span>
                )}
                {idx < STAGES.length - 1 && (
                  <div
                    className={`w-6 md:w-12 h-0.5 transition-all duration-500 ${
                      currentStage > idx ? "bg-white/50" : "bg-white/10"
                    }`}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Stage title */}
          <div className="text-center mb-6">
            <h2
              className="text-lg md:text-xl font-medium mb-1 transition-all duration-500"
              style={{ color: stageColor }}
            >
              {stage.title}
            </h2>
            <p className="text-white/50 text-sm">{stage.subtitle}</p>
          </div>

          {/* Main transformation display */}
          <div className="w-full max-w-4xl mx-auto relative" style={{ minHeight: "400px" }}>
            {/* CHAOS STATE - The messy email */}
            {currentStage === 0 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="relative">
                  {/* Overlapping document effect */}
                  <div className="absolute -top-2 -left-2 w-full h-full bg-white/5 rounded-lg transform rotate-1" />
                  <div className="absolute -top-1 -right-1 w-full h-full bg-white/5 rounded-lg transform -rotate-1" />
                  
                  {/* Main email */}
                  <div className="relative bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6 md:p-8">
                    <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/10">
                      <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                        <span className="text-red-400 text-xs">!</span>
                      </div>
                      <div>
                        <p className="text-white/80 text-sm font-medium">RE: Information Request INF0013960</p>
                        <p className="text-white/40 text-xs">Triple Zero Victoria</p>
                      </div>
                    </div>
                    <pre className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                      {CHAOS_EMAIL}
                    </pre>
                    
                    {/* Confusion indicators */}
                    <div className="mt-6 flex flex-wrap gap-2">
                      {["Contradictory", "Vague", "No recourse?", "Privacy for whom?"].map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs bg-red-500/20 text-red-300 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* DOCUMENT STAGE - Extraction */}
            {currentStage === 1 && stage.id === "document" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Faded email */}
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 opacity-40">
                    <pre className="text-white/50 text-xs leading-relaxed whitespace-pre-wrap font-sans line-clamp-[12]">
                      {CHAOS_EMAIL}
                    </pre>
                  </div>
                  
                  {/* Extracted data */}
                  <div
                    className="bg-black/40 border rounded-xl p-6"
                    style={{ borderColor: `${SYMBOL_COLORS["●"]}50` }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl" style={{ color: SYMBOL_COLORS["●"] }}>●</span>
                      <span className="text-white/60 text-sm tracking-wider">EVIDENCE EXTRACTED</span>
                    </div>
                    <div className="space-y-3">
                      {stage.extract?.map((item, idx) => (
                        <div
                          key={item}
                          className="flex items-center gap-3 animate-in slide-in-from-left duration-500"
                          style={{ animationDelay: `${idx * 150}ms` }}
                        >
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: SYMBOL_COLORS["●"] }}
                          />
                          <span className="text-white/80">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* GROUND STAGE - Laws surface */}
            {currentStage === 2 && stage.id === "ground" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="grid gap-4 max-w-2xl mx-auto">
                  {stage.laws?.map((law, idx) => (
                    <div
                      key={law.cite}
                      className="bg-black/40 border rounded-xl p-5 animate-in slide-in-from-bottom duration-500"
                      style={{
                        borderColor: `${SYMBOL_COLORS["▼"]}50`,
                        animationDelay: `${idx * 200}ms`,
                      }}
                    >
                      <div className="flex items-start gap-4">
                        <span className="text-2xl" style={{ color: SYMBOL_COLORS["▼"] }}>▼</span>
                        <div>
                          <p
                            className="font-mono text-sm mb-1"
                            style={{ color: SYMBOL_COLORS["▼"] }}
                          >
                            {law.cite}
                          </p>
                          <p className="text-white/80">{law.text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* RECOGNISE STAGE - Contradictions */}
            {currentStage === 3 && stage.id === "recognise" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="space-y-4 max-w-3xl mx-auto">
                  {stage.contrasts?.map((c, idx) => (
                    <div
                      key={c.said}
                      className="grid md:grid-cols-2 gap-3 animate-in slide-in-from-bottom duration-500"
                      style={{ animationDelay: `${idx * 200}ms` }}
                    >
                      <div className="bg-red-950/30 border border-red-900/40 rounded-xl p-4">
                        <p className="text-[10px] text-red-400/70 tracking-widest mb-2">THEY SAID</p>
                        <p className="text-white/80 text-sm">{c.said}</p>
                      </div>
                      <div className="bg-emerald-950/30 border border-emerald-900/40 rounded-xl p-4">
                        <p className="text-[10px] text-emerald-400/70 tracking-widest mb-2">REALITY</p>
                        <p className="text-white/80 text-sm">{c.reality}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ACT STAGE - Ready actions */}
            {currentStage === 4 && stage.id === "act" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                  {stage.actions?.map((action, idx) => (
                    <div
                      key={action}
                      className="bg-black/40 border rounded-xl p-5 text-center animate-in zoom-in duration-500 hover:scale-105 transition-transform cursor-pointer"
                      style={{
                        borderColor: `${SYMBOL_COLORS["◼"]}50`,
                        animationDelay: `${idx * 100}ms`,
                      }}
                    >
                      <span
                        className="text-3xl block mb-3"
                        style={{ color: SYMBOL_COLORS["◼"] }}
                      >
                        ◼
                      </span>
                      <p className="text-white/80 text-sm font-medium">{action}</p>
                    </div>
                  ))}
                </div>
                
                {/* Final message */}
                <p className="text-center text-white/50 mt-8 text-sm">
                  From chaos to clarity in seconds.
                </p>
              </div>
            )}
          </div>

          {/* Play/Pause and progress */}
          <div className="mt-8 flex items-center gap-4">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              {isPlaying ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
              ) : (
                <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <polygon points="5,3 19,12 5,21" />
                </svg>
              )}
            </button>
            
            {/* Progress bar */}
            <div className="flex gap-1">
              {STAGES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handleStageClick(idx)}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    idx === currentStage ? "w-8 bg-white" : "w-4 bg-white/30 hover:bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="relative z-10 pb-8 text-center">
          <Link
            href="/start"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full font-medium hover:scale-105 transition-transform"
          >
            <span className="flex gap-1">
              {Object.entries(SYMBOL_COLORS).map(([symbol, color]) => (
                <span key={symbol} style={{ color }} className="text-lg">
                  {symbol}
                </span>
              ))}
            </span>
            <span>Begin Your Case</span>
          </Link>
          <p className="text-white/30 text-xs mt-3">No account required</p>
        </div>
      </section>

      {/* How it works - detailed */}
      <section className="py-20 px-4 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-center text-white/50 text-sm tracking-widest mb-4">THE TRANSFORMATION</h2>
          <p className="text-center text-white/70 mb-12 max-w-2xl mx-auto">
            Every confusing letter, every bureaucratic maze, every institutional barrier -
            transformed into clarity and action.
          </p>

          <div className="space-y-6">
            {STAGES.slice(1).map((s, idx) => (
              <div
                key={s.id}
                className="flex items-start gap-6 p-6 rounded-xl border border-white/10 hover:border-white/20 transition-colors"
              >
                <span
                  className="text-4xl shrink-0"
                  style={{ color: SYMBOL_COLORS[s.symbol as keyof typeof SYMBOL_COLORS] }}
                >
                  {s.symbol}
                </span>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-white/40 text-xs font-mono">0{idx + 1}</span>
                    <h3
                      className="text-xl font-medium"
                      style={{ color: SYMBOL_COLORS[s.symbol as keyof typeof SYMBOL_COLORS] }}
                    >
                      {s.title}
                    </h3>
                  </div>
                  <p className="text-white/60">{s.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 border-t border-white/10 bg-gradient-to-b from-transparent to-white/5">
        <div className="max-w-xl mx-auto text-center">
          <div className="flex justify-center gap-3 mb-6">
            {Object.entries(SYMBOL_COLORS).map(([symbol, color]) => (
              <span
                key={symbol}
                className="text-3xl"
                style={{ color, textShadow: `0 0 20px ${color}40` }}
              >
                {symbol}
              </span>
            ))}
          </div>
          <h2 className="text-2xl md:text-3xl font-light text-white mb-4 text-balance">
            Knowledge should not be the privilege of the few
          </h2>
          <p className="text-white/50 mb-8">
            Transform confusion into clarity. Document, ground, recognise, act.
          </p>
          <Link
            href="/start"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-colors"
          >
            Start Now
          </Link>
        </div>
      </section>
    </main>
  )
}
