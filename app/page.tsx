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

// Narrative stages - each with DUAL OUTPUT (input -> symbol -> output)
type NarrativeStage = "chaos" | "observe" | "ground" | "recognise" | "act"

// The dual output structure: what goes IN, what comes OUT
const DUAL_OUTPUTS = {
  chaos: {
    label: "You received this...",
    input: null,
    output: null,
  },
  observe: {
    symbol: "●",
    label: "Document",
    input: {
      label: "CHAOS",
      content: "Confusing email about a 000 call. Anonymous caller. Privacy restrictions. No clear path forward.",
    },
    output: {
      label: "EVIDENCE",
      items: [
        { key: "Event", value: "000 Call - False Report" },
        { key: "Time", value: "10 Jan 2026, 7:42 PM" },
        { key: "Location", value: "Your residential address" },
        { key: "Entities", value: "TZV, Anonymous Caller, You" },
      ],
    },
  },
  ground: {
    symbol: "▼",
    label: "Ground",
    input: {
      label: "YOUR QUESTION",
      content: '"What are my rights? Can I access the recording? Who has power here?"',
    },
    output: {
      label: "YOUR RIGHTS",
      items: [
        { code: "FOI Act s.33", text: "Access to personal information" },
        { code: "TZV Act s.29(2)", text: "Subject may access call recordings" },
        { code: "Privacy Act 1988", text: "Your data belongs to you" },
      ],
    },
  },
  recognise: {
    symbol: "▲",
    label: "Recognise",
    input: {
      label: "THEY SAID",
      items: [
        '"Investigation revealed it was not your neighbours"',
        '"Privacy considerations apply to the caller"',
        '"Unable to prove malicious intent"',
      ],
    },
    output: {
      label: "REALITY",
      items: [
        "No phone number was obtained",
        "Caller named YOU, not themselves",
        "Unable to prove ANYTHING - no data",
      ],
    },
  },
  act: {
    symbol: "◼",
    label: "Act",
    input: {
      label: "STUCK",
      content: "Feeling powerless. No clear next step. Institutional maze designed to exhaust.",
    },
    output: {
      label: "READY",
      items: [
        { name: "FOI Request", status: "ready" },
        { name: "Formal Response", status: "ready" },
        { name: "Ombudsman Referral", status: "ready" },
        { name: "Case Record", status: "permanent" },
      ],
    },
  },
}

const NARRATIVE_CONTENT = {
  chaos: {
    label: "You received this...",
    documents: [
      { text: "Confusing email", rotation: 0, offset: { x: 0, y: 0 } },
      { text: "Anonymous caller", rotation: 30, offset: { x: 50, y: 50 } },
      { text: "Privacy restrictions", rotation: -30, offset: { x: -50, y: 50 } },
      { text: "No clear path forward", rotation: 0, offset: { x: 0, y: -50 } },
    ],
  },
  observe: {
    label: "Document",
    subtitle: "Capture the details of the chaos.",
    symbol: "●",
    content: {
      time: "10 Jan 2026, 7:42 PM",
      evidence: "000 Call - False Report",
      location: "Your residential address",
    },
  },
  ground: {
    label: "Ground",
    subtitle: "Understand your rights.",
    symbol: "▼",
    laws: [
      { code: "FOI Act s.33", text: "Access to personal information" },
      { code: "TZV Act s.29(2)", text: "Subject may access call recordings" },
      { code: "Privacy Act 1988", text: "Your data belongs to you" },
    ],
  },
  recognise: {
    label: "Recognise",
    subtitle: "Reveal the truth.",
    symbol: "▲",
    contrasts: [
      { said: "Investigation revealed it was not your neighbours", reality: "No phone number was obtained" },
      { said: "Privacy considerations apply to the caller", reality: "Caller named YOU, not themselves" },
      { said: "Unable to prove malicious intent", reality: "Unable to prove ANYTHING - no data" },
    ],
  },
  act: {
    label: "Act",
    subtitle: "Take control.",
    symbol: "◼",
    actions: [
      { name: "FOI Request", status: "ready" },
      { name: "Formal Response", status: "ready" },
      { name: "Ombudsman Referral", status: "ready" },
      { name: "Case Record", status: "permanent" },
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

        {/* Main Stage Content - DUAL OUTPUT Pattern */}
        <div className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-5xl">
            {/* CHAOS STATE - No dual output, just chaos */}
            {stage === "chaos" && (
              <div className="relative h-[350px] md:h-[400px] animate-in fade-in duration-700">
                {/* Chaotic overlapping documents */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {NARRATIVE_CONTENT.chaos.documents.map((doc, idx) => (
                    <div
                      key={idx}
                      className="absolute bg-white/5 border border-white/10 rounded-lg p-4 md:p-6 max-w-[240px] backdrop-blur-sm animate-in fade-in zoom-in-95 duration-700"
                      style={{
                        transform: `rotate(${doc.rotation}deg) translate(${doc.offset.x}px, ${doc.offset.y}px)`,
                        animationDelay: `${idx * 150}ms`,
                        zIndex: idx,
                      }}
                    >
                      <p className="text-sm text-white/60 font-mono">{doc.text}</p>
                    </div>
                  ))}
                </div>
                {/* Label */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
                  <p className="text-white/40 text-sm mb-1">{NARRATIVE_CONTENT.chaos.label}</p>
                  <p className="text-white/20 text-xs">Confusing. Contradictory. Designed to exhaust.</p>
                </div>
              </div>
            )}

            {/* ● OBSERVE - DUAL OUTPUT: Chaos -> Evidence */}
            {stage === "observe" && (
              <div className="animate-in fade-in duration-700">
                <div className="grid md:grid-cols-[1fr,auto,1fr] gap-4 md:gap-6 items-center">
                  {/* INPUT - Chaos */}
                  <div className="bg-white/5 border border-white/10 rounded-xl p-5 animate-in slide-in-from-left duration-500">
                    <p className="text-[10px] text-white/40 tracking-widest mb-3">{DUAL_OUTPUTS.observe.input?.label}</p>
                    <p className="text-white/60 text-sm leading-relaxed">{DUAL_OUTPUTS.observe.input?.content}</p>
                  </div>

                  {/* SYMBOL - The Processor */}
                  <div className="flex flex-col items-center justify-center py-4 md:py-0">
                    <div
                      className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center animate-pulse"
                      style={{
                        backgroundColor: `${SYMBOL_COLORS["●"]}20`,
                        boxShadow: `0 0 40px ${SYMBOL_COLORS["●"]}50`,
                      }}
                    >
                      <span className="text-4xl md:text-5xl" style={{ color: SYMBOL_COLORS["●"] }}>●</span>
                    </div>
                    <p className="text-xs mt-2 font-medium tracking-wider" style={{ color: SYMBOL_COLORS["●"] }}>
                      DOCUMENT
                    </p>
                  </div>

                  {/* OUTPUT - Evidence */}
                  <div
                    className="border rounded-xl p-5 animate-in slide-in-from-right duration-500"
                    style={{ backgroundColor: `${SYMBOL_COLORS["●"]}10`, borderColor: `${SYMBOL_COLORS["●"]}40` }}
                  >
                    <p className="text-[10px] tracking-widest mb-3" style={{ color: SYMBOL_COLORS["●"] }}>
                      {DUAL_OUTPUTS.observe.output?.label}
                    </p>
                    <div className="space-y-2">
                      {DUAL_OUTPUTS.observe.output?.items.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm">
                          <span className="text-white/40 font-mono text-xs w-16 shrink-0">{item.key}</span>
                          <span className="text-white/90">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ▼ GROUND - DUAL OUTPUT: Question -> Rights */}
            {stage === "ground" && (
              <div className="animate-in fade-in duration-700">
                <div className="grid md:grid-cols-[1fr,auto,1fr] gap-4 md:gap-6 items-center">
                  {/* INPUT - Your Question */}
                  <div className="bg-white/5 border border-white/10 rounded-xl p-5 animate-in slide-in-from-left duration-500">
                    <p className="text-[10px] text-white/40 tracking-widest mb-3">{DUAL_OUTPUTS.ground.input?.label}</p>
                    <p className="text-white/60 text-sm leading-relaxed italic">{DUAL_OUTPUTS.ground.input?.content}</p>
                  </div>

                  {/* SYMBOL - The Processor */}
                  <div className="flex flex-col items-center justify-center py-4 md:py-0">
                    <div
                      className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: `${SYMBOL_COLORS["▼"]}20`,
                        boxShadow: `0 0 40px ${SYMBOL_COLORS["▼"]}50`,
                      }}
                    >
                      <span className="text-4xl md:text-5xl animate-bounce" style={{ color: SYMBOL_COLORS["▼"] }}>▼</span>
                    </div>
                    <p className="text-xs mt-2 font-medium tracking-wider" style={{ color: SYMBOL_COLORS["▼"] }}>
                      GROUND
                    </p>
                  </div>

                  {/* OUTPUT - Your Rights */}
                  <div
                    className="border rounded-xl p-5 animate-in slide-in-from-right duration-500"
                    style={{ backgroundColor: `${SYMBOL_COLORS["▼"]}10`, borderColor: `${SYMBOL_COLORS["▼"]}40` }}
                  >
                    <p className="text-[10px] tracking-widest mb-3" style={{ color: SYMBOL_COLORS["▼"] }}>
                      {DUAL_OUTPUTS.ground.output?.label}
                    </p>
                    <div className="space-y-3">
                      {DUAL_OUTPUTS.ground.output?.items.map((law, idx) => (
                        <div
                          key={idx}
                          className="animate-in slide-in-from-bottom duration-500"
                          style={{ animationDelay: `${idx * 150}ms` }}
                        >
                          <span
                            className="text-[10px] font-mono px-2 py-0.5 rounded"
                            style={{ backgroundColor: `${SYMBOL_COLORS["▼"]}30`, color: SYMBOL_COLORS["▼"] }}
                          >
                            {law.code}
                          </span>
                          <p className="text-white/80 text-sm mt-1">{law.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ▲ RECOGNISE - DUAL OUTPUT: They Said -> Reality */}
            {stage === "recognise" && (
              <div className="animate-in fade-in duration-700">
                <div className="grid md:grid-cols-[1fr,auto,1fr] gap-4 md:gap-6 items-start">
                  {/* INPUT - They Said */}
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-5 animate-in slide-in-from-left duration-500">
                    <p className="text-[10px] text-red-400/80 tracking-widest mb-3">{DUAL_OUTPUTS.recognise.input?.label}</p>
                    <div className="space-y-3">
                      {DUAL_OUTPUTS.recognise.input?.items?.map((item, idx) => (
                        <p key={idx} className="text-white/60 text-sm italic">{item}</p>
                      ))}
                    </div>
                  </div>

                  {/* SYMBOL - The Processor */}
                  <div className="flex flex-col items-center justify-center py-4 md:py-8">
                    <div
                      className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: `${SYMBOL_COLORS["▲"]}20`,
                        boxShadow: `0 0 40px ${SYMBOL_COLORS["▲"]}50`,
                      }}
                    >
                      <span
                        className="text-4xl md:text-5xl"
                        style={{
                          color: SYMBOL_COLORS["▲"],
                          animation: "pulse 2s ease-in-out infinite",
                        }}
                      >
                        ▲
                      </span>
                    </div>
                    <p className="text-xs mt-2 font-medium tracking-wider" style={{ color: SYMBOL_COLORS["▲"] }}>
                      RECOGNISE
                    </p>
                  </div>

                  {/* OUTPUT - Reality */}
                  <div
                    className="border rounded-xl p-5 animate-in slide-in-from-right duration-500"
                    style={{ backgroundColor: `${SYMBOL_COLORS["▲"]}10`, borderColor: `${SYMBOL_COLORS["▲"]}40` }}
                  >
                    <p className="text-[10px] tracking-widest mb-3" style={{ color: SYMBOL_COLORS["▲"] }}>
                      {DUAL_OUTPUTS.recognise.output?.label}
                    </p>
                    <div className="space-y-3">
                      {DUAL_OUTPUTS.recognise.output?.items?.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 animate-in slide-in-from-bottom duration-500"
                          style={{ animationDelay: `${idx * 150}ms` }}
                        >
                          <span className="text-emerald-400 mt-0.5">+</span>
                          <p className="text-white/90 text-sm">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ◼ ACT - DUAL OUTPUT: Stuck -> Ready */}
            {stage === "act" && (
              <div className="animate-in fade-in duration-700">
                <div className="grid md:grid-cols-[1fr,auto,1fr] gap-4 md:gap-6 items-center">
                  {/* INPUT - Stuck */}
                  <div className="bg-white/5 border border-white/10 rounded-xl p-5 animate-in slide-in-from-left duration-500 opacity-50">
                    <p className="text-[10px] text-white/40 tracking-widest mb-3">{DUAL_OUTPUTS.act.input?.label}</p>
                    <p className="text-white/50 text-sm leading-relaxed line-through">{DUAL_OUTPUTS.act.input?.content}</p>
                  </div>

                  {/* SYMBOL - The Processor */}
                  <div className="flex flex-col items-center justify-center py-4 md:py-0">
                    <div
                      className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: `${SYMBOL_COLORS["◼"]}20`,
                        boxShadow: `0 0 40px ${SYMBOL_COLORS["◼"]}50`,
                      }}
                    >
                      <span className="text-4xl md:text-5xl" style={{ color: SYMBOL_COLORS["◼"] }}>◼</span>
                    </div>
                    <p className="text-xs mt-2 font-medium tracking-wider" style={{ color: SYMBOL_COLORS["◼"] }}>
                      ACT
                    </p>
                  </div>

                  {/* OUTPUT - Ready */}
                  <div
                    className="border rounded-xl p-5 animate-in slide-in-from-right duration-500"
                    style={{ backgroundColor: `${SYMBOL_COLORS["◼"]}10`, borderColor: `${SYMBOL_COLORS["◼"]}40` }}
                  >
                    <p className="text-[10px] tracking-widest mb-3" style={{ color: SYMBOL_COLORS["◼"] }}>
                      {DUAL_OUTPUTS.act.output?.label}
                    </p>
                    <div className="space-y-2">
                      {DUAL_OUTPUTS.act.output?.items.map((action, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 animate-in slide-in-from-bottom duration-500"
                          style={{ animationDelay: `${idx * 100}ms` }}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              action.status === "permanent" ? "bg-amber-400" : "bg-emerald-400"
                            }`}
                          />
                          <span className="text-white/90 text-sm font-medium">{action.name}</span>
                          <span className="text-[10px] text-white/40 ml-auto uppercase">{action.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
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
