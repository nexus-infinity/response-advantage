"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"

// Symbol colors - the transformation palette
const SYMBOL_COLORS = {
  chaos: "#666666",
  "●": "#9370DB", // Document - purple (observation)
  "▼": "#FF8C00", // Ground - orange (evidence/law)
  "▲": "#FFD700", // Recognise - gold (pattern detection)
  "◼": "#0066CC", // Act - blue (manifestation)
}

// The chaotic source material - real email fragments
const CHAOS_FRAGMENTS = [
  { text: "RE: Your enquiry INF0013960", type: "header" },
  { text: "Our investigation revealed it was not one of your neighbours.", type: "claim" },
  { text: "I suspect it might have been a passerby.", type: "speculation" },
  { text: "A call was made from a default mobile with no number able to be obtained.", type: "admission" },
  { text: "The caller gave a first name only and could not be contacted.", type: "admission" },
  { text: "Privacy considerations apply to the anonymous caller.", type: "deflection" },
  { text: "You may wish to obtain a subpoena.", type: "dismissal" },
]

// QUICK/DEEP dual outputs for each stage
const TRANSFORMATIONS = {
  observe: {
    symbol: "●",
    label: "DOCUMENT",
    verb: "Capture",
    quick: {
      label: "QUICK",
      hint: "Copy-paste ready",
      output: "On 10 January 2026 at 7:42 PM, an anonymous 000 call was made about my property at [address], falsely reporting smoke and an aggressive occupant.",
    },
    deep: {
      label: "DEEP",
      hint: "Full evidence catalog",
      items: ["Event: 000 Call - False Report", "Time: 10 Jan 2026, 7:42 PM", "Location: Residential address", "Entities: TZV, Anonymous Caller, Subject (You)"],
    },
  },
  ground: {
    symbol: "▼",
    label: "GROUND",
    verb: "Anchor",
    quick: {
      label: "QUICK",
      hint: "Use in your response",
      output: "Under the FOI Act s.33, I am entitled to access all personal information held about me. Under TZV Act s.29(2), as the subject of the call, I may access the recording.",
    },
    deep: {
      label: "DEEP",
      hint: "Full legal framework",
      items: ["FOI Act s.33 - Personal information access", "TZV Act s.29(2) - Call recording access", "Privacy Act 1988 - Data subject rights", "Ombudsman Act - Complaint pathways"],
    },
  },
  recognise: {
    symbol: "▲",
    label: "RECOGNISE",
    verb: "Reveal",
    quick: {
      label: "QUICK",
      hint: "The key contradiction",
      output: "You state the investigation 'revealed' the caller's identity, yet also state no phone number was obtained and the caller cannot be contacted. How was identity revealed without identifying information?",
    },
    deep: {
      label: "DEEP",
      hint: "Pattern analysis",
      items: ["Contradiction: 'Revealed' vs 'No data'", "Contradiction: 'Privacy for caller' vs 'Caller named you'", "Pattern: Deflection through complexity", "Pattern: Exhaustion by design"],
    },
  },
  act: {
    symbol: "◼",
    label: "ACT",
    verb: "Manifest",
    quick: {
      label: "QUICK",
      hint: "Ready to send",
      output: "To: Freedom of Information Officer\nRe: FOI Request - 000 Call Recording INF0013960\n\nDear Sir/Madam,\n\nPursuant to the Freedom of Information Act 1982, I request access to...",
    },
    deep: {
      label: "DEEP",
      hint: "Permanent record",
      items: ["FOI Request - Ready", "Formal Response - Ready", "Ombudsman Referral - Ready", "Case Record - Permanent"],
    },
  },
}

type Stage = "chaos" | "observe" | "ground" | "recognise" | "act"

export default function LandingPage() {
  const [stage, setStage] = useState<Stage>("chaos")
  const [isPlaying, setIsPlaying] = useState(true)
  const [progress, setProgress] = useState(0)
  const [chaosOpacity, setChaosOpacity] = useState(1)
  const [clarityOpacity, setClarityOpacity] = useState(0)

  const stages: Stage[] = ["chaos", "observe", "ground", "recognise", "act"]
  const stageIndex = stages.indexOf(stage)

  // Cinematic auto-play
  useEffect(() => {
    if (!isPlaying) return

    const duration = stage === "chaos" ? 4000 : 5000

    // Progress animation
    const progressTimer = setInterval(() => {
      setProgress((p) => Math.min(p + 1, 100))
    }, duration / 100)

    // Fade animation for transformation effect
    const fadeTimer = setTimeout(() => {
      if (stage !== "act") {
        setChaosOpacity(0)
        setClarityOpacity(1)
      }
    }, duration * 0.6)

    // Stage transition
    const stageTimer = setTimeout(() => {
      const nextIndex = (stageIndex + 1) % stages.length
      setStage(stages[nextIndex])
      setProgress(0)
      setChaosOpacity(1)
      setClarityOpacity(0)
    }, duration)

    return () => {
      clearInterval(progressTimer)
      clearTimeout(fadeTimer)
      clearTimeout(stageTimer)
    }
  }, [stage, isPlaying, stageIndex])

  const goToStage = useCallback((newStage: Stage) => {
    setStage(newStage)
    setProgress(0)
    setChaosOpacity(1)
    setClarityOpacity(0)
    setIsPlaying(false)
  }, [])

  const currentColor = stage === "chaos" 
    ? SYMBOL_COLORS.chaos 
    : SYMBOL_COLORS[TRANSFORMATIONS[stage].symbol as keyof typeof SYMBOL_COLORS]

  return (
    <main className="min-h-screen bg-[#050508] text-white overflow-hidden">
      {/* Hero Section - Cinematic Transformation */}
      <section className="min-h-screen flex flex-col relative">
        {/* Dynamic background gradient */}
        <div
          className="absolute inset-0 pointer-events-none transition-all duration-1000"
          style={{
            background: `radial-gradient(ellipse at 50% 30%, ${currentColor}15 0%, transparent 60%)`,
          }}
        />

        {/* Subtle grid - more chaotic when in chaos state */}
        <div
          className="absolute inset-0 pointer-events-none transition-all duration-1000"
          style={{
            opacity: stage === "chaos" ? 0.08 : 0.03,
            backgroundImage: `linear-gradient(${currentColor}20 1px, transparent 1px), linear-gradient(90deg, ${currentColor}20 1px, transparent 1px)`,
            backgroundSize: stage === "chaos" ? "30px 30px" : "60px 60px",
            transform: stage === "chaos" ? "rotate(1deg)" : "rotate(0deg)",
          }}
        />

        {/* Header */}
        <header className="relative z-20 flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <Image src="/logo-recognition.png" alt="re-cognition" fill className="object-contain" priority />
            </div>
            <span className="text-sm font-light tracking-[0.2em] text-white/50">re-cognition</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-3 py-1.5 text-[10px] font-mono tracking-wider border border-white/20 rounded-full hover:bg-white/10 transition-colors"
            >
              {isPlaying ? "PAUSE" : "PLAY"}
            </button>
            <Link
              href="/start"
              className="px-4 py-1.5 text-xs font-medium bg-white/10 border border-white/20 rounded-full hover:bg-white/20 transition-colors"
            >
              Start Case
            </Link>
          </div>
        </header>

        {/* Symbol Navigation */}
        <nav className="relative z-20 flex items-center justify-center gap-2 md:gap-4 px-4 py-6">
          {stages.map((s, idx) => {
            const isActive = stage === s
            const isPast = stageIndex > idx
            const symbol = s === "chaos" ? "?" : TRANSFORMATIONS[s].symbol
            const color = s === "chaos" ? SYMBOL_COLORS.chaos : SYMBOL_COLORS[symbol as keyof typeof SYMBOL_COLORS]

            return (
              <div key={s} className="flex items-center">
                <button
                  onClick={() => goToStage(s)}
                  className="relative flex flex-col items-center group"
                >
                  {/* Symbol with glow */}
                  <div
                    className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-500 ${
                      isActive ? "scale-110" : "scale-100"
                    }`}
                    style={{
                      backgroundColor: isActive ? `${color}20` : "transparent",
                      boxShadow: isActive ? `0 0 40px ${color}40` : "none",
                    }}
                  >
                    <span
                      className={`text-2xl md:text-3xl transition-all duration-500 ${
                        isActive ? "opacity-100" : isPast ? "opacity-50" : "opacity-25"
                      }`}
                      style={{ color }}
                    >
                      {symbol}
                    </span>
                  </div>

                  {/* Label */}
                  <span
                    className={`text-[9px] md:text-[10px] mt-2 font-medium tracking-wider transition-all duration-500 ${
                      isActive ? "opacity-100" : "opacity-0"
                    }`}
                    style={{ color }}
                  >
                    {s === "chaos" ? "CHAOS" : TRANSFORMATIONS[s].label}
                  </span>

                  {/* Progress indicator */}
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-100"
                        style={{ width: `${progress}%`, backgroundColor: color }}
                      />
                    </div>
                  )}
                </button>

                {/* Connector */}
                {idx < stages.length - 1 && (
                  <div className="flex items-center mx-2 md:mx-4">
                    <div
                      className={`w-8 md:w-16 h-px transition-all duration-500 ${
                        isPast ? "bg-white/30" : "bg-white/10"
                      }`}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        {/* Main Transformation Stage */}
        <div className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-5xl">

            {/* CHAOS STATE - The source material */}
            {stage === "chaos" && (
              <div className="relative min-h-[400px] animate-in fade-in duration-700">
                {/* Scattered chaos fragments */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-full max-w-2xl h-[350px]">
                    {CHAOS_FRAGMENTS.map((fragment, idx) => {
                      const positions = [
                        { x: 0, y: -120, rotate: -2 },
                        { x: -150, y: -40, rotate: -5 },
                        { x: 150, y: -60, rotate: 4 },
                        { x: -100, y: 50, rotate: -3 },
                        { x: 100, y: 70, rotate: 2 },
                        { x: -50, y: 130, rotate: -1 },
                        { x: 50, y: 150, rotate: 3 },
                      ]
                      const pos = positions[idx]

                      return (
                        <div
                          key={idx}
                          className="absolute left-1/2 top-1/2 bg-white/5 border border-white/10 rounded-lg px-4 py-3 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-700"
                          style={{
                            transform: `translate(-50%, -50%) translate(${pos.x}px, ${pos.y}px) rotate(${pos.rotate}deg)`,
                            animationDelay: `${idx * 100}ms`,
                            maxWidth: "280px",
                          }}
                        >
                          <p className="text-sm text-white/60">{fragment.text}</p>
                          <span
                            className={`text-[9px] font-mono mt-1 inline-block px-1.5 py-0.5 rounded ${
                              fragment.type === "admission"
                                ? "bg-amber-500/20 text-amber-400/70"
                                : fragment.type === "deflection"
                                  ? "bg-red-500/20 text-red-400/70"
                                  : "bg-white/10 text-white/40"
                            }`}
                          >
                            {fragment.type}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Chaos label */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
                  <p className="text-white/50 text-sm mb-1">You received this...</p>
                  <p className="text-white/30 text-xs">Confusing. Contradictory. Designed to exhaust.</p>
                </div>
              </div>
            )}

            {/* TRANSFORMATION STAGES - Quick/Deep dual output */}
            {stage !== "chaos" && (
              <div className="animate-in fade-in duration-700">
                {/* Stage header */}
                <div className="text-center mb-8">
                  <div
                    className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
                    style={{
                      backgroundColor: `${currentColor}20`,
                      boxShadow: `0 0 60px ${currentColor}30`,
                    }}
                  >
                    <span className="text-4xl" style={{ color: currentColor }}>
                      {TRANSFORMATIONS[stage].symbol}
                    </span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-light tracking-wider" style={{ color: currentColor }}>
                    {TRANSFORMATIONS[stage].label}
                  </h2>
                  <p className="text-white/40 text-sm mt-1">{TRANSFORMATIONS[stage].verb} the chaos</p>
                </div>

                {/* QUICK / DEEP dual output cards */}
                <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                  {/* QUICK Output */}
                  <div
                    className="border rounded-2xl p-6 animate-in slide-in-from-left duration-500"
                    style={{
                      backgroundColor: `${currentColor}08`,
                      borderColor: `${currentColor}40`,
                    }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl" style={{ color: currentColor }}>
                        {TRANSFORMATIONS[stage].symbol}
                      </span>
                      <div>
                        <span
                          className="text-[11px] font-bold tracking-widest"
                          style={{ color: currentColor }}
                        >
                          {TRANSFORMATIONS[stage].quick.label}
                        </span>
                        <p className="text-[10px] text-white/40">{TRANSFORMATIONS[stage].quick.hint}</p>
                      </div>
                    </div>

                    <div className="bg-black/40 border border-white/10 rounded-xl p-4">
                      <pre className="text-white/90 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                        {TRANSFORMATIONS[stage].quick.output}
                      </pre>
                    </div>

                    {/* Copy hint */}
                    <p className="text-[10px] text-white/30 mt-3 text-right">Click to copy</p>
                  </div>

                  {/* DEEP Output */}
                  <div
                    className="border rounded-2xl p-6 animate-in slide-in-from-right duration-500"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.02)",
                      borderColor: `${currentColor}25`,
                    }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl opacity-50" style={{ color: currentColor }}>
                        {TRANSFORMATIONS[stage].symbol}
                      </span>
                      <div>
                        <span className="text-[11px] font-bold tracking-widest text-white/60">
                          {TRANSFORMATIONS[stage].deep.label}
                        </span>
                        <p className="text-[10px] text-white/40">{TRANSFORMATIONS[stage].deep.hint}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {TRANSFORMATIONS[stage].deep.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 animate-in slide-in-from-bottom duration-300"
                          style={{ animationDelay: `${idx * 100}ms` }}
                        >
                          <span
                            className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                            style={{ backgroundColor: currentColor }}
                          />
                          <span className="text-white/70 text-sm">{item}</span>
                        </div>
                      ))}
                    </div>

                    {/* Expand hint */}
                    <p className="text-[10px] text-white/30 mt-4 text-right">Click to expand</p>
                  </div>
                </div>

                {/* Fractal hint - same pattern at every scale */}
                <div className="text-center mt-8">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                    <span className="text-xs text-white/40">Same pattern at every scale:</span>
                    <div className="flex items-center gap-1">
                      {["●", "▼", "▲", "◼"].map((s) => (
                        <span
                          key={s}
                          className="text-xs"
                          style={{
                            color: SYMBOL_COLORS[s as keyof typeof SYMBOL_COLORS],
                            opacity: TRANSFORMATIONS[stage].symbol === s ? 1 : 0.3,
                          }}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="relative z-20 flex flex-col items-center gap-3 px-4 py-8">
          <Link
            href="/start"
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-full transition-all duration-300 hover:scale-105"
            style={{
              background: `linear-gradient(135deg, ${currentColor}30, ${currentColor}10)`,
              border: `1px solid ${currentColor}40`,
            }}
          >
            <div className="flex items-center gap-1">
              {["●", "▼", "▲", "◼"].map((s) => (
                <span
                  key={s}
                  className="text-sm transition-all duration-300"
                  style={{
                    color: SYMBOL_COLORS[s as keyof typeof SYMBOL_COLORS],
                    opacity: stage === "chaos" ? 0.5 : TRANSFORMATIONS[stage as keyof typeof TRANSFORMATIONS]?.symbol === s ? 1 : 0.3,
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
            <span className="text-white font-medium">Begin Your Case</span>
          </Link>
          <p className="text-white/30 text-xs">No account required. Your data stays with you.</p>
        </div>
      </section>

      {/* Multi-Case Structure Section */}
      <section className="py-24 px-4 border-t border-white/10 bg-gradient-to-b from-transparent to-white/[0.02]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-sm tracking-widest text-white/40 mb-4">FRACTAL ARCHITECTURE</h2>
            <p className="text-2xl md:text-3xl font-light text-white text-balance">
              The same ●▼▲◼ pattern works at every scale
            </p>
          </div>

          {/* Three scales */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Micro scale */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <span className="text-lg text-white/60">1</span>
                </div>
                <div>
                  <h3 className="text-white font-medium">Single Contradiction</h3>
                  <p className="text-white/40 text-xs">Micro scale</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span style={{ color: SYMBOL_COLORS["●"] }}>●</span>
                  <span className="text-white/60">"They said X"</span>
                </div>
                <div className="flex items-center gap-2">
                  <span style={{ color: SYMBOL_COLORS["▼"] }}>▼</span>
                  <span className="text-white/60">Law says Y</span>
                </div>
                <div className="flex items-center gap-2">
                  <span style={{ color: SYMBOL_COLORS["▲"] }}>▲</span>
                  <span className="text-white/60">X contradicts Y</span>
                </div>
                <div className="flex items-center gap-2">
                  <span style={{ color: SYMBOL_COLORS["◼"] }}>◼</span>
                  <span className="text-white/60">One pointed question</span>
                </div>
              </div>
            </div>

            {/* Meso scale */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <span className="text-lg text-white/60">2</span>
                </div>
                <div>
                  <h3 className="text-white font-medium">Complete Case</h3>
                  <p className="text-white/40 text-xs">Meso scale</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span style={{ color: SYMBOL_COLORS["●"] }}>●</span>
                  <span className="text-white/60">All evidence documented</span>
                </div>
                <div className="flex items-center gap-2">
                  <span style={{ color: SYMBOL_COLORS["▼"] }}>▼</span>
                  <span className="text-white/60">Legal framework mapped</span>
                </div>
                <div className="flex items-center gap-2">
                  <span style={{ color: SYMBOL_COLORS["▲"] }}>▲</span>
                  <span className="text-white/60">Pattern analysis complete</span>
                </div>
                <div className="flex items-center gap-2">
                  <span style={{ color: SYMBOL_COLORS["◼"] }}>◼</span>
                  <span className="text-white/60">FOI + Response + Escalation</span>
                </div>
              </div>
            </div>

            {/* Macro scale */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <span className="text-lg text-white/60">3</span>
                </div>
                <div>
                  <h3 className="text-white font-medium">Life Archive</h3>
                  <p className="text-white/40 text-xs">Macro scale</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span style={{ color: SYMBOL_COLORS["●"] }}>●</span>
                  <span className="text-white/60">Years of evidence</span>
                </div>
                <div className="flex items-center gap-2">
                  <span style={{ color: SYMBOL_COLORS["▼"] }}>▼</span>
                  <span className="text-white/60">Cross-jurisdictional law</span>
                </div>
                <div className="flex items-center gap-2">
                  <span style={{ color: SYMBOL_COLORS["▲"] }}>▲</span>
                  <span className="text-white/60">Institutional behavior patterns</span>
                </div>
                <div className="flex items-center gap-2">
                  <span style={{ color: SYMBOL_COLORS["◼"] }}>◼</span>
                  <span className="text-white/60">Systemic change strategy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Legal Framework Section */}
      <section className="py-24 px-4 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-sm tracking-widest text-white/40 mb-4">LEGAL FRAMEWORK</h2>
            <p className="text-2xl md:text-3xl font-light text-white text-balance">
              Your rights, surfaced automatically
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { code: "FOI Act s.33", text: "Right to access personal information held by agencies", color: SYMBOL_COLORS["▼"] },
              { code: "TZV Act s.29(2)", text: "Subject of emergency call may access recordings", color: SYMBOL_COLORS["▼"] },
              { code: "Privacy Act 1988", text: "Your data belongs to you - not to institutions", color: SYMBOL_COLORS["▼"] },
              { code: "Ombudsman Act", text: "Complaint pathways when agencies fail to respond", color: SYMBOL_COLORS["▼"] },
            ].map((law, idx) => (
              <div
                key={idx}
                className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-white/20 transition-colors"
              >
                <span
                  className="text-xs font-mono px-2 py-1 rounded"
                  style={{ backgroundColor: `${law.color}20`, color: law.color }}
                >
                  {law.code}
                </span>
                <p className="text-white/70 text-sm mt-3">{law.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 border-t border-white/10">
        <div className="max-w-xl mx-auto text-center">
          <div className="flex justify-center gap-3 mb-8">
            {["●", "▼", "▲", "◼"].map((symbol) => (
              <span
                key={symbol}
                className="text-3xl"
                style={{
                  color: SYMBOL_COLORS[symbol as keyof typeof SYMBOL_COLORS],
                  textShadow: `0 0 20px ${SYMBOL_COLORS[symbol as keyof typeof SYMBOL_COLORS]}40`,
                }}
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
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-colors"
          >
            <span className="flex gap-1">
              {["●", "▼", "▲", "◼"].map((s) => (
                <span key={s} style={{ color: SYMBOL_COLORS[s as keyof typeof SYMBOL_COLORS] }}>
                  {s}
                </span>
              ))}
            </span>
            Start Your Case
          </Link>
          <p className="text-white/30 text-xs mt-4">No account required</p>
        </div>
      </section>
    </main>
  )
}
