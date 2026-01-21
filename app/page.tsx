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

// DUAL OUTPUT: Quick (actionable sentence) + Deep (comprehensive record)
const DUAL_OUTPUTS = {
  chaos: {
    label: "You received this...",
    input: null,
    quick: null,
    deep: null,
  },
  observe: {
    symbol: "●",
    label: "Document",
    input: {
      label: "CHAOS",
      content: "Confusing email about a 000 call. Anonymous caller. Privacy restrictions. No clear path forward.",
    },
    quick: {
      label: "QUICK",
      template: "On [date] at [time], a [event] occurred at [location] involving [entities].",
      filled: "On 10 January 2026 at 7:42 PM, an anonymous 000 call was made about my property at [address], falsely reporting smoke and an aggressive occupant.",
    },
    deep: {
      label: "DEEP",
      items: [
        "Full evidence catalog",
        "Timestamped files",
        "Location metadata",
        "Entity relationships mapped",
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
    quick: {
      label: "QUICK",
      template: "Under [Act s.XX], you are required to...",
      filled: "Under the FOI Act s.33, I am entitled to access all personal information held about me. Under TZV Act s.29(2), as the subject of the call, I may access the recording.",
    },
    deep: {
      label: "DEEP",
      items: [
        "Full legal research",
        "Relevant precedents",
        "Jurisdiction analysis",
        "Compliance requirements",
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
    quick: {
      label: "QUICK",
      template: "You stated [X], however [Y] contradicts this because [Z].",
      filled: "You stated the investigation 'revealed' the caller's identity, however you also state no phone number was obtained and the caller cannot be contacted. How can an identity be revealed without identifying information?",
    },
    deep: {
      label: "DEEP",
      items: [
        "Timeline of contradictions",
        "Pattern analysis",
        "Institutional behavior mapping",
        "Response gap identification",
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
    quick: {
      label: "QUICK",
      name: "Ready-to-send FOI Request",
      preview: "To: Freedom of Information Officer\nRe: FOI Request - 000 Call Recording\n\nI am writing to request access to...",
    },
    deep: {
      label: "DEEP",
      items: [
        "Complete case record",
        "Response tracking",
        "Escalation pathways",
        "Permanent documentation",
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

            {/* ● OBSERVE - QUICK/DEEP DUAL OUTPUT */}
            {stage === "observe" && (
              <div className="animate-in fade-in duration-700">
                {/* Input -> Symbol row */}
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 max-w-xs">
                    <p className="text-white/50 text-xs">{DUAL_OUTPUTS.observe.input?.content}</p>
                  </div>
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center animate-pulse shrink-0"
                    style={{
                      backgroundColor: `${SYMBOL_COLORS["●"]}20`,
                      boxShadow: `0 0 30px ${SYMBOL_COLORS["●"]}50`,
                    }}
                  >
                    <span className="text-3xl" style={{ color: SYMBOL_COLORS["●"] }}>●</span>
                  </div>
                </div>

                {/* QUICK / DEEP side by side */}
                <div className="grid md:grid-cols-2 gap-4">
                  {/* QUICK - Copy-paste ready */}
                  <div
                    className="border rounded-xl p-5 animate-in slide-in-from-left duration-500"
                    style={{ backgroundColor: `${SYMBOL_COLORS["●"]}10`, borderColor: `${SYMBOL_COLORS["●"]}40` }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg" style={{ color: SYMBOL_COLORS["●"] }}>●</span>
                      <span className="text-[10px] tracking-widest font-bold" style={{ color: SYMBOL_COLORS["●"] }}>QUICK</span>
                      <span className="text-[10px] text-white/30 ml-auto">copy-paste ready</span>
                    </div>
                    <p className="text-white/40 text-xs font-mono mb-2">{DUAL_OUTPUTS.observe.quick?.template}</p>
                    <p className="text-white/90 text-sm leading-relaxed bg-black/30 rounded-lg p-3 border border-white/10">
                      {DUAL_OUTPUTS.observe.quick?.filled}
                    </p>
                  </div>

                  {/* DEEP - Comprehensive record */}
                  <div
                    className="border rounded-xl p-5 animate-in slide-in-from-right duration-500"
                    style={{ borderColor: `${SYMBOL_COLORS["●"]}30`, backgroundColor: "rgba(0,0,0,0.3)" }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg" style={{ color: SYMBOL_COLORS["●"] }}>●</span>
                      <span className="text-[10px] tracking-widest font-bold" style={{ color: SYMBOL_COLORS["●"] }}>DEEP</span>
                      <span className="text-[10px] text-white/30 ml-auto">full record</span>
                    </div>
                    <div className="space-y-2">
                      {DUAL_OUTPUTS.observe.deep?.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 text-sm animate-in slide-in-from-bottom duration-300"
                          style={{ animationDelay: `${idx * 100}ms` }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: SYMBOL_COLORS["●"] }} />
                          <span className="text-white/70">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ▼ GROUND - QUICK/DEEP DUAL OUTPUT */}
            {stage === "ground" && (
              <div className="animate-in fade-in duration-700">
                {/* Input -> Symbol row */}
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 max-w-xs">
                    <p className="text-white/50 text-xs italic">{DUAL_OUTPUTS.ground.input?.content}</p>
                  </div>
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: `${SYMBOL_COLORS["▼"]}20`,
                      boxShadow: `0 0 30px ${SYMBOL_COLORS["▼"]}50`,
                    }}
                  >
                    <span className="text-3xl animate-bounce" style={{ color: SYMBOL_COLORS["▼"] }}>▼</span>
                  </div>
                </div>

                {/* QUICK / DEEP side by side */}
                <div className="grid md:grid-cols-2 gap-4">
                  {/* QUICK - Copy-paste ready */}
                  <div
                    className="border rounded-xl p-5 animate-in slide-in-from-left duration-500"
                    style={{ backgroundColor: `${SYMBOL_COLORS["▼"]}10`, borderColor: `${SYMBOL_COLORS["▼"]}40` }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg" style={{ color: SYMBOL_COLORS["▼"] }}>▼</span>
                      <span className="text-[10px] tracking-widest font-bold" style={{ color: SYMBOL_COLORS["▼"] }}>QUICK</span>
                      <span className="text-[10px] text-white/30 ml-auto">copy-paste ready</span>
                    </div>
                    <p className="text-white/40 text-xs font-mono mb-2">{DUAL_OUTPUTS.ground.quick?.template}</p>
                    <p className="text-white/90 text-sm leading-relaxed bg-black/30 rounded-lg p-3 border border-white/10">
                      {DUAL_OUTPUTS.ground.quick?.filled}
                    </p>
                  </div>

                  {/* DEEP - Comprehensive record */}
                  <div
                    className="border rounded-xl p-5 animate-in slide-in-from-right duration-500"
                    style={{ borderColor: `${SYMBOL_COLORS["▼"]}30`, backgroundColor: "rgba(0,0,0,0.3)" }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg" style={{ color: SYMBOL_COLORS["▼"] }}>▼</span>
                      <span className="text-[10px] tracking-widest font-bold" style={{ color: SYMBOL_COLORS["▼"] }}>DEEP</span>
                      <span className="text-[10px] text-white/30 ml-auto">full research</span>
                    </div>
                    <div className="space-y-2">
                      {DUAL_OUTPUTS.ground.deep?.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 text-sm animate-in slide-in-from-bottom duration-300"
                          style={{ animationDelay: `${idx * 100}ms` }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: SYMBOL_COLORS["▼"] }} />
                          <span className="text-white/70">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ▲ RECOGNISE - QUICK/DEEP DUAL OUTPUT */}
            {stage === "recognise" && (
              <div className="animate-in fade-in duration-700">
                {/* Input -> Symbol row */}
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2 max-w-xs">
                    <p className="text-white/50 text-xs italic">"{DUAL_OUTPUTS.recognise.input?.items?.[0]}"</p>
                  </div>
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: `${SYMBOL_COLORS["▲"]}20`,
                      boxShadow: `0 0 30px ${SYMBOL_COLORS["▲"]}50`,
                    }}
                  >
                    <span className="text-3xl" style={{ color: SYMBOL_COLORS["▲"], animation: "pulse 2s ease-in-out infinite" }}>▲</span>
                  </div>
                </div>

                {/* QUICK / DEEP side by side */}
                <div className="grid md:grid-cols-2 gap-4">
                  {/* QUICK - The key contradiction */}
                  <div
                    className="border rounded-xl p-5 animate-in slide-in-from-left duration-500"
                    style={{ backgroundColor: `${SYMBOL_COLORS["▲"]}10`, borderColor: `${SYMBOL_COLORS["▲"]}40` }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg" style={{ color: SYMBOL_COLORS["▲"] }}>▲</span>
                      <span className="text-[10px] tracking-widest font-bold" style={{ color: SYMBOL_COLORS["▲"] }}>QUICK</span>
                      <span className="text-[10px] text-white/30 ml-auto">the key question</span>
                    </div>
                    <p className="text-white/40 text-xs font-mono mb-2">{DUAL_OUTPUTS.recognise.quick?.template}</p>
                    <p className="text-white/90 text-sm leading-relaxed bg-black/30 rounded-lg p-3 border border-white/10">
                      {DUAL_OUTPUTS.recognise.quick?.filled}
                    </p>
                  </div>

                  {/* DEEP - Pattern analysis */}
                  <div
                    className="border rounded-xl p-5 animate-in slide-in-from-right duration-500"
                    style={{ borderColor: `${SYMBOL_COLORS["▲"]}30`, backgroundColor: "rgba(0,0,0,0.3)" }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg" style={{ color: SYMBOL_COLORS["▲"] }}>▲</span>
                      <span className="text-[10px] tracking-widest font-bold" style={{ color: SYMBOL_COLORS["▲"] }}>DEEP</span>
                      <span className="text-[10px] text-white/30 ml-auto">full analysis</span>
                    </div>
                    <div className="space-y-2">
                      {DUAL_OUTPUTS.recognise.deep?.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 text-sm animate-in slide-in-from-bottom duration-300"
                          style={{ animationDelay: `${idx * 100}ms` }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: SYMBOL_COLORS["▲"] }} />
                          <span className="text-white/70">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ◼ ACT - QUICK/DEEP DUAL OUTPUT */}
            {stage === "act" && (
              <div className="animate-in fade-in duration-700">
                {/* Input -> Symbol row */}
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 max-w-xs opacity-50">
                    <p className="text-white/40 text-xs line-through">{DUAL_OUTPUTS.act.input?.content}</p>
                  </div>
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: `${SYMBOL_COLORS["◼"]}20`,
                      boxShadow: `0 0 30px ${SYMBOL_COLORS["◼"]}50`,
                    }}
                  >
                    <span className="text-3xl" style={{ color: SYMBOL_COLORS["◼"] }}>◼</span>
                  </div>
                </div>

                {/* QUICK / DEEP side by side */}
                <div className="grid md:grid-cols-2 gap-4">
                  {/* QUICK - Ready to send */}
                  <div
                    className="border rounded-xl p-5 animate-in slide-in-from-left duration-500"
                    style={{ backgroundColor: `${SYMBOL_COLORS["◼"]}10`, borderColor: `${SYMBOL_COLORS["◼"]}40` }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg" style={{ color: SYMBOL_COLORS["◼"] }}>◼</span>
                      <span className="text-[10px] tracking-widest font-bold" style={{ color: SYMBOL_COLORS["◼"] }}>QUICK</span>
                      <span className="text-[10px] text-white/30 ml-auto">ready to send</span>
                    </div>
                    <p className="text-white/60 text-xs mb-2">{DUAL_OUTPUTS.act.quick?.name}</p>
                    <pre className="text-white/80 text-xs leading-relaxed bg-black/30 rounded-lg p-3 border border-white/10 whitespace-pre-wrap font-mono">
                      {DUAL_OUTPUTS.act.quick?.preview}
                    </pre>
                  </div>

                  {/* DEEP - Full case record */}
                  <div
                    className="border rounded-xl p-5 animate-in slide-in-from-right duration-500"
                    style={{ borderColor: `${SYMBOL_COLORS["◼"]}30`, backgroundColor: "rgba(0,0,0,0.3)" }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg" style={{ color: SYMBOL_COLORS["◼"] }}>◼</span>
                      <span className="text-[10px] tracking-widest font-bold" style={{ color: SYMBOL_COLORS["◼"] }}>DEEP</span>
                      <span className="text-[10px] text-white/30 ml-auto">permanent record</span>
                    </div>
                    <div className="space-y-2">
                      {DUAL_OUTPUTS.act.deep?.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 text-sm animate-in slide-in-from-bottom duration-300"
                          style={{ animationDelay: `${idx * 100}ms` }}
                        >
                          <span className="w-2 h-2 rounded-full bg-emerald-400" />
                          <span className="text-white/70">{item}</span>
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
