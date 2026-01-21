"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"

// Symbol colors from manifest
const SYMBOL_COLORS = {
  chaos: "#666666",
  "●": "#9370DB", // Observe - purple
  "▼": "#FF8C00", // Ground - orange
  "▲": "#FFD700", // Recognise - gold
  "◼": "#0066CC", // Act - blue
}

// Narrative stages with visual content
type NarrativeStage = "chaos" | "observe" | "ground" | "recognise" | "act"

const NARRATIVE_CONTENT = {
  chaos: {
    label: "You received this...",
    documents: [
      { text: "RE: Your enquiry INF0013960", rotation: -3, offset: { x: -20, y: 10 } },
      { text: "Privacy considerations apply...", rotation: 2, offset: { x: 30, y: -15 } },
      { text: "Unable to verify caller identity", rotation: -1, offset: { x: -10, y: 25 } },
      { text: "You may wish to obtain a subpoena", rotation: 4, offset: { x: 15, y: -5 } },
    ],
  },
  observe: {
    symbol: "●",
    label: "Document",
    subtitle: "Evidence captured. Location marked.",
    content: {
      evidence: "000 Call Recording Request",
      location: "Federation Square, Melbourne",
      time: "10 Jan 2026, 7:42 PM",
    },
  },
  ground: {
    symbol: "▼",
    label: "Ground",
    subtitle: "Laws surface automatically",
    laws: [
      { code: "FOI Act s.33", text: "Right to access personal information" },
      { code: "TZV Act s.29(2)", text: "Subject of call may access recording" },
      { code: "Privacy Act", text: "Your data, your rights" },
    ],
  },
  recognise: {
    symbol: "▲",
    label: "Recognise",
    subtitle: "Contradictions revealed",
    contrasts: [
      { said: '"Investigation revealed it was not a neighbour"', reality: "No identifying information exists" },
      { said: '"Privacy for the anonymous caller"', reality: "Caller made claims about YOU" },
    ],
  },
  act: {
    symbol: "◼",
    label: "Act",
    subtitle: "Ready-to-send documents",
    actions: [
      { name: "FOI Request", status: "ready" },
      { name: "Formal Response", status: "ready" },
      { name: "Case Record", status: "ready" },
    ],
  },
}

export default function LandingPage() {
  const [stage, setStage] = useState<NarrativeStage>("chaos")
  const [isPlaying, setIsPlaying] = useState(true)
  const [stageProgress, setStageProgress] = useState(0)

  const stages: NarrativeStage[] = ["chaos", "observe", "ground", "recognise", "act"]

  // Auto-play narrative
  useEffect(() => {
    if (!isPlaying) return

    const stageDuration = 3500
    const progressInterval = setInterval(() => {
      setStageProgress((p) => Math.min(p + 2, 100))
    }, stageDuration / 50)

    const stageInterval = setInterval(() => {
      setStage((current) => {
        const currentIdx = stages.indexOf(current)
        const nextIdx = (currentIdx + 1) % stages.length
        setStageProgress(0)
        return stages[nextIdx]
      })
    }, stageDuration)

    return () => {
      clearInterval(progressInterval)
      clearInterval(stageInterval)
    }
  }, [isPlaying])

  const goToStage = useCallback((newStage: NarrativeStage) => {
    setStage(newStage)
    setStageProgress(0)
    setIsPlaying(false)
  }, [])

  const currentSymbol = stage === "chaos" ? null : NARRATIVE_CONTENT[stage].symbol

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* Hero Section - Narrative Animation */}
      <section className="min-h-screen flex flex-col relative">
        {/* Background - subtle grid that shifts with stage */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
          style={{
            opacity: stage === "chaos" ? 0.05 : 0.02,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: stage === "chaos" ? "40px 40px" : "60px 60px",
          }}
        />

        {/* Header - Logo and Navigation */}
        <header className="relative z-20 flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <Image src="/logo-recognition.png" alt="re-cognition" fill className="object-contain" priority />
            </div>
            <span className="text-sm font-light tracking-widest text-white/60">re-cognition</span>
          </div>

          {/* Play/Pause */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="text-white/40 hover:text-white/80 transition-colors text-xs font-mono"
          >
            {isPlaying ? "PAUSE" : "PLAY"}
          </button>
        </header>

        {/* Symbol Progression - Top Navigation */}
        <div className="relative z-20 flex items-center justify-center gap-1 md:gap-2 px-4 py-6">
          {stages.map((s, idx) => {
            const isActive = stage === s
            const isPast = stages.indexOf(stage) > idx
            const symbol = s === "chaos" ? "?" : NARRATIVE_CONTENT[s].symbol
            const color = s === "chaos" ? SYMBOL_COLORS.chaos : SYMBOL_COLORS[symbol as keyof typeof SYMBOL_COLORS]

            return (
              <div key={s} className="flex items-center">
                <button
                  onClick={() => goToStage(s)}
                  className={`relative flex flex-col items-center transition-all duration-500 ${
                    isActive ? "scale-110" : "scale-100"
                  }`}
                >
                  {/* Symbol */}
                  <span
                    className={`text-2xl md:text-3xl transition-all duration-500 ${
                      isActive ? "opacity-100" : isPast ? "opacity-60" : "opacity-30"
                    }`}
                    style={{
                      color,
                      textShadow: isActive ? `0 0 30px ${color}` : "none",
                    }}
                  >
                    {symbol}
                  </span>

                  {/* Stage label */}
                  <span
                    className={`text-[10px] md:text-xs mt-1 transition-all duration-500 ${
                      isActive ? "opacity-100" : "opacity-0"
                    }`}
                    style={{ color }}
                  >
                    {s === "chaos" ? "CHAOS" : NARRATIVE_CONTENT[s].label.toUpperCase()}
                  </span>

                  {/* Progress bar under active */}
                  {isActive && (
                    <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full transition-all duration-100 rounded-full"
                        style={{ width: `${stageProgress}%`, backgroundColor: color }}
                      />
                    </div>
                  )}
                </button>

                {/* Connector line */}
                {idx < stages.length - 1 && (
                  <div
                    className={`w-6 md:w-12 h-px mx-1 md:mx-2 transition-all duration-500 ${
                      isPast ? "bg-white/30" : "bg-white/10"
                    }`}
                  />
                )}
              </div>
            )
          })}
        </div>

        {/* Main Stage Content */}
        <div className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-3xl">
            {/* CHAOS STATE */}
            {stage === "chaos" && (
              <div className="relative h-[400px] md:h-[450px]">
                {/* Chaotic overlapping documents */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {NARRATIVE_CONTENT.chaos.documents.map((doc, idx) => (
                    <div
                      key={idx}
                      className="absolute bg-white/5 border border-white/10 rounded-lg p-4 md:p-6 max-w-[280px] backdrop-blur-sm animate-in fade-in duration-700"
                      style={{
                        transform: `rotate(${doc.rotation}deg) translate(${doc.offset.x}px, ${doc.offset.y}px)`,
                        animationDelay: `${idx * 150}ms`,
                        zIndex: idx,
                      }}
                    >
                      <p className="text-sm md:text-base text-white/60 font-mono">{doc.text}</p>
                    </div>
                  ))}
                </div>

                {/* "You received this..." label */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
                  <p className="text-white/40 text-sm mb-2">{NARRATIVE_CONTENT.chaos.label}</p>
                  <p className="text-white/20 text-xs">Confusing. Contradictory. Designed to exhaust.</p>
                </div>
              </div>
            )}

            {/* ● OBSERVE STATE */}
            {stage === "observe" && (
              <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div
                  className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full mb-6 animate-pulse"
                  style={{
                    backgroundColor: `${SYMBOL_COLORS["●"]}20`,
                    boxShadow: `0 0 60px ${SYMBOL_COLORS["●"]}40`,
                  }}
                >
                  <span className="text-5xl md:text-6xl" style={{ color: SYMBOL_COLORS["●"] }}>
                    ●
                  </span>
                </div>

                <h2 className="text-2xl md:text-3xl font-light mb-2" style={{ color: SYMBOL_COLORS["●"] }}>
                  {NARRATIVE_CONTENT.observe.label}
                </h2>
                <p className="text-white/50 mb-8">{NARRATIVE_CONTENT.observe.subtitle}</p>

                {/* Evidence card */}
                <div
                  className="inline-block bg-black/40 border rounded-xl p-6 text-left"
                  style={{ borderColor: `${SYMBOL_COLORS["●"]}40` }}
                >
                  <div className="flex items-start gap-4">
                    <span className="text-2xl" style={{ color: SYMBOL_COLORS["●"] }}>
                      ●
                    </span>
                    <div>
                      <p className="text-xs text-white/40 font-mono mb-1">{NARRATIVE_CONTENT.observe.content.time}</p>
                      <p className="text-white font-medium mb-1">{NARRATIVE_CONTENT.observe.content.evidence}</p>
                      <p className="text-white/50 text-sm">{NARRATIVE_CONTENT.observe.content.location}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ▼ GROUND STATE */}
            {stage === "ground" && (
              <div className="text-center animate-in fade-in duration-700">
                <span className="text-5xl md:text-6xl mb-4 inline-block" style={{ color: SYMBOL_COLORS["▼"] }}>
                  ▼
                </span>

                <h2 className="text-2xl md:text-3xl font-light mb-2" style={{ color: SYMBOL_COLORS["▼"] }}>
                  {NARRATIVE_CONTENT.ground.label}
                </h2>
                <p className="text-white/50 mb-8">{NARRATIVE_CONTENT.ground.subtitle}</p>

                {/* Law cards rising */}
                <div className="flex flex-col gap-3 max-w-md mx-auto">
                  {NARRATIVE_CONTENT.ground.laws.map((law, idx) => (
                    <div
                      key={law.code}
                      className="bg-black/40 border rounded-lg p-4 text-left animate-in slide-in-from-bottom-4 duration-500"
                      style={{
                        borderColor: `${SYMBOL_COLORS["▼"]}30`,
                        animationDelay: `${idx * 200}ms`,
                      }}
                    >
                      <span
                        className="text-xs font-mono px-2 py-1 rounded"
                        style={{ backgroundColor: `${SYMBOL_COLORS["▼"]}20`, color: SYMBOL_COLORS["▼"] }}
                      >
                        {law.code}
                      </span>
                      <p className="text-white/70 text-sm mt-2">{law.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ▲ RECOGNISE STATE */}
            {stage === "recognise" && (
              <div className="text-center animate-in fade-in duration-700">
                <span className="text-5xl md:text-6xl mb-4 inline-block" style={{ color: SYMBOL_COLORS["▲"] }}>
                  ▲
                </span>

                <h2 className="text-2xl md:text-3xl font-light mb-2" style={{ color: SYMBOL_COLORS["▲"] }}>
                  {NARRATIVE_CONTENT.recognise.label}
                </h2>
                <p className="text-white/50 mb-8">{NARRATIVE_CONTENT.recognise.subtitle}</p>

                {/* Contrast cards */}
                <div className="space-y-4 max-w-xl mx-auto">
                  {NARRATIVE_CONTENT.recognise.contrasts.map((contrast, idx) => (
                    <div
                      key={idx}
                      className="grid md:grid-cols-2 gap-3 animate-in slide-in-from-bottom-4 duration-500"
                      style={{ animationDelay: `${idx * 300}ms` }}
                    >
                      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-left">
                        <p className="text-[10px] text-red-400/70 tracking-widest mb-1">THEY SAID</p>
                        <p className="text-white/80 text-sm">{contrast.said}</p>
                      </div>
                      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 text-left">
                        <p className="text-[10px] text-emerald-400/70 tracking-widest mb-1">REALITY</p>
                        <p className="text-white/80 text-sm">{contrast.reality}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ◼ ACT STATE */}
            {stage === "act" && (
              <div className="text-center animate-in fade-in duration-700">
                <span className="text-5xl md:text-6xl mb-4 inline-block" style={{ color: SYMBOL_COLORS["◼"] }}>
                  ◼
                </span>

                <h2 className="text-2xl md:text-3xl font-light mb-2" style={{ color: SYMBOL_COLORS["◼"] }}>
                  {NARRATIVE_CONTENT.act.label}
                </h2>
                <p className="text-white/50 mb-8">{NARRATIVE_CONTENT.act.subtitle}</p>

                {/* Action buttons */}
                <div className="flex flex-wrap justify-center gap-3 mb-8">
                  {NARRATIVE_CONTENT.act.actions.map((action, idx) => (
                    <div
                      key={action.name}
                      className="bg-black/40 border rounded-lg px-5 py-3 flex items-center gap-2 animate-in slide-in-from-bottom-4 duration-500"
                      style={{
                        borderColor: `${SYMBOL_COLORS["◼"]}40`,
                        animationDelay: `${idx * 150}ms`,
                      }}
                    >
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="text-white/80">{action.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CTA - Fixed at bottom */}
        <div className="relative z-20 flex flex-col items-center gap-3 px-4 py-8">
          <Link
            href="/start"
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-full transition-all duration-300 hover:scale-105"
            style={{
              background:
                stage === "chaos"
                  ? "rgba(255,255,255,0.1)"
                  : `linear-gradient(135deg, ${SYMBOL_COLORS[currentSymbol as keyof typeof SYMBOL_COLORS]}40, ${SYMBOL_COLORS[currentSymbol as keyof typeof SYMBOL_COLORS]}20)`,
              border: `1px solid ${stage === "chaos" ? "rgba(255,255,255,0.2)" : SYMBOL_COLORS[currentSymbol as keyof typeof SYMBOL_COLORS]}40`,
            }}
          >
            <span
              className="text-xl transition-transform group-hover:scale-110"
              style={{ color: stage === "chaos" ? "#fff" : SYMBOL_COLORS[currentSymbol as keyof typeof SYMBOL_COLORS] }}
            >
              {stage === "chaos" ? "●" : currentSymbol}
            </span>
            <span className="text-white font-medium">Begin Your Case</span>
          </Link>
          <p className="text-white/30 text-xs">No account required</p>
        </div>
      </section>

      {/* How it works - Grid Section */}
      <section className="py-20 px-4 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-center text-white/50 text-sm tracking-widest mb-12">THE JOURNEY</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {(["observe", "ground", "recognise", "act"] as const).map((s, idx) => {
              const content = NARRATIVE_CONTENT[s]
              const color = SYMBOL_COLORS[content.symbol as keyof typeof SYMBOL_COLORS]

              return (
                <button
                  key={s}
                  onClick={() => {
                    goToStage(s)
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }}
                  className="bg-white/5 border border-white/10 rounded-xl p-6 text-left hover:border-white/20 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-3xl group-hover:scale-110 transition-transform" style={{ color }}>
                      {content.symbol}
                    </span>
                    <div>
                      <span className="text-white/40 text-xs font-mono">STEP {idx + 1}</span>
                      <h3 className="text-lg font-medium text-white">{content.label}</h3>
                    </div>
                  </div>
                  <p className="text-white/50 text-sm">{content.subtitle}</p>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 border-t border-white/10">
        <div className="max-w-xl mx-auto text-center">
          <div className="flex justify-center gap-3 mb-6">
            {["●", "▼", "▲", "◼"].map((symbol) => (
              <span
                key={symbol}
                className="text-2xl"
                style={{ color: SYMBOL_COLORS[symbol as keyof typeof SYMBOL_COLORS] }}
              >
                {symbol}
              </span>
            ))}
          </div>
          <h2 className="text-2xl md:text-3xl font-light text-white mb-4 text-balance">
            Knowledge should not be the privilege of the few
          </h2>
          <p className="text-white/50 mb-8">Transform confusion into clarity. Document, ground, recognise, act.</p>
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
