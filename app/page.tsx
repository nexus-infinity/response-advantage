"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"

// The four vertices of the system
const VERTICES = {
  observe: {
    symbol: "●",
    color: "#9370DB",
    name: "Observe",
    verb: "Document your reality",
    description: "Drop evidence. Capture location. The system witnesses.",
  },
  ground: {
    symbol: "▼",
    color: "#FF8C00", 
    name: "Ground",
    verb: "Surface your rights",
    description: "Laws and precedents emerge. Knowledge becomes visible.",
  },
  recognise: {
    symbol: "▲",
    color: "#FFD700",
    name: "Recognise",
    verb: "See the pattern",
    description: "Contradictions revealed. The narrative becomes clear.",
  },
  manifest: {
    symbol: "◼",
    color: "#0066CC",
    name: "Manifest",
    verb: "Act with clarity",
    description: "Documents generated. The path forward exists.",
  },
}

const VERTEX_ORDER = ["observe", "ground", "recognise", "manifest"] as const

// Demo narrative - a real example flowing through the system
const DEMO_NARRATIVE = {
  observe: {
    input: "Confusing email from Triple Zero Victoria...",
    output: "10 Jan 2026: Anonymous 000 call. Claims: smoke, aggressive occupant.",
  },
  ground: {
    input: "What are my rights here?",
    output: "FOI Act s.33 — Right to access personal information\nTZV Act s.29(2) — Subject access provisions",
  },
  recognise: {
    input: "Something doesn't add up...",
    output: '"Investigation revealed identity" — yet no phone number, no contact possible.\nHow does one investigate without identifying information?',
  },
  manifest: {
    input: "What can I actually do?",
    output: "FOI Request [ready]\nFormal Response [ready]\nCase Record [permanent]",
  },
}

export default function LandingPage() {
  const [activeVertex, setActiveVertex] = useState<keyof typeof VERTICES>("observe")
  const [isAnimating, setIsAnimating] = useState(true)
  const [showNarrative, setShowNarrative] = useState(false)
  const geometryRef = useRef<HTMLDivElement>(null)

  // Auto-cycle through vertices
  useEffect(() => {
    if (!isAnimating) return
    const interval = setInterval(() => {
      setActiveVertex((prev) => {
        const currentIdx = VERTEX_ORDER.indexOf(prev)
        return VERTEX_ORDER[(currentIdx + 1) % VERTEX_ORDER.length]
      })
    }, 4000)
    return () => clearInterval(interval)
  }, [isAnimating])

  // Show narrative after first cycle
  useEffect(() => {
    const timer = setTimeout(() => setShowNarrative(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  const activeData = VERTICES[activeVertex]
  const activeNarrative = DEMO_NARRATIVE[activeVertex]

  return (
    <main className="min-h-screen bg-[#050508] text-white overflow-x-hidden">
      {/* Hero Section - The Geometry IS the Interface */}
      <section className="min-h-screen flex flex-col items-center justify-center relative px-4 py-8">
        {/* Radial gradient background from active color */}
        <div
          className="absolute inset-0 transition-all duration-1000 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 30%, ${activeData.color}15 0%, transparent 50%)`,
          }}
        />

        {/* Geometric grid - subtle */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(${activeData.color}40 1px, transparent 1px),
              linear-gradient(90deg, ${activeData.color}40 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
          }}
        />

        <div className="relative z-10 w-full max-w-6xl mx-auto">
          {/* Top: Logo + Title */}
          <div className="flex items-center justify-center gap-4 mb-8 md:mb-12">
            <div className="relative w-12 h-12 md:w-16 md:h-16">
              <Image
                src="/logo-recognition.png"
                alt="re-cognition"
                fill
                className="object-contain"
                priority
              />
            </div>
            <h1 className="text-xl md:text-2xl font-light tracking-[0.2em] text-white/80">
              re-cognition
            </h1>
          </div>

          {/* Central Geometry - The Four Vertices */}
          <div 
            ref={geometryRef}
            className="relative mx-auto mb-8 md:mb-12"
            style={{ width: "min(400px, 90vw)", height: "min(400px, 90vw)" }}
          >
            {/* Connection lines between vertices */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
              {/* Outer square connecting all vertices */}
              <path
                d="M 200 40 L 360 200 L 200 360 L 40 200 Z"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
              />
              {/* Inner connecting lines */}
              <line x1="200" y1="40" x2="200" y2="360" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
              <line x1="40" y1="200" x2="360" y2="200" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
              
              {/* Animated path showing current flow */}
              <circle
                cx="200"
                cy="200"
                r="120"
                fill="none"
                stroke={`${activeData.color}30`}
                strokeWidth="2"
                strokeDasharray="8,8"
                className="animate-spin"
                style={{ animationDuration: "20s" }}
              />
            </svg>

            {/* The Four Vertex Symbols */}
            {VERTEX_ORDER.map((key, idx) => {
              const vertex = VERTICES[key]
              const isActive = activeVertex === key
              // Position in diamond: top, right, bottom, left
              const positions = [
                { x: 50, y: 5 },   // top - observe
                { x: 85, y: 45 },  // right - ground
                { x: 50, y: 85 },  // bottom - recognise
                { x: 15, y: 45 },  // left - manifest
              ]
              const pos = positions[idx]

              return (
                <button
                  key={key}
                  onClick={() => {
                    setActiveVertex(key)
                    setIsAnimating(false)
                  }}
                  className="absolute transition-all duration-500 group"
                  style={{
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  {/* Pulse ring for active */}
                  {isActive && (
                    <div
                      className="absolute inset-0 -m-4 rounded-full animate-ping"
                      style={{ backgroundColor: `${vertex.color}30` }}
                    />
                  )}
                  
                  {/* Symbol container */}
                  <div
                    className={`
                      relative flex items-center justify-center rounded-full
                      transition-all duration-500
                      ${isActive ? "w-20 h-20 md:w-24 md:h-24" : "w-14 h-14 md:w-16 md:h-16"}
                    `}
                    style={{
                      backgroundColor: isActive ? `${vertex.color}20` : "rgba(255,255,255,0.05)",
                      border: `2px solid ${isActive ? vertex.color : "rgba(255,255,255,0.1)"}`,
                      boxShadow: isActive ? `0 0 40px ${vertex.color}40` : "none",
                    }}
                  >
                    <span
                      className={`
                        transition-all duration-500
                        ${isActive ? "text-4xl md:text-5xl" : "text-2xl md:text-3xl"}
                      `}
                      style={{
                        color: isActive ? vertex.color : "rgba(255,255,255,0.4)",
                        textShadow: isActive ? `0 0 20px ${vertex.color}` : "none",
                      }}
                    >
                      {vertex.symbol}
                    </span>
                  </div>

                  {/* Label - shows on hover or active */}
                  <span
                    className={`
                      absolute whitespace-nowrap text-xs font-medium tracking-wider
                      transition-all duration-300
                      ${idx === 0 ? "-top-8" : idx === 1 ? "left-full ml-3" : idx === 2 ? "-bottom-8" : "right-full mr-3"}
                      ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-60"}
                    `}
                    style={{ color: vertex.color }}
                  >
                    {vertex.name.toUpperCase()}
                  </span>
                </button>
              )
            })}

            {/* Center - Current State Display */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-40 md:w-48">
              <p
                className="text-lg md:text-xl font-light transition-all duration-500"
                style={{ color: activeData.color }}
              >
                {activeData.verb}
              </p>
            </div>
          </div>

          {/* Narrative Flow Card - The Demo */}
          <div
            className={`
              mx-auto max-w-2xl transition-all duration-700
              ${showNarrative ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
            `}
          >
            <div
              className="bg-black/40 backdrop-blur-sm border rounded-2xl p-6 md:p-8 transition-all duration-500"
              style={{ borderColor: `${activeData.color}40` }}
            >
              {/* Input -> Output flow */}
              <div className="space-y-4">
                {/* Input side */}
                <div className="flex items-start gap-3">
                  <span className="text-white/30 text-xs font-mono mt-1">IN</span>
                  <p className="text-white/60 text-sm md:text-base italic">
                    {activeNarrative.input}
                  </p>
                </div>

                {/* Processing indicator */}
                <div className="flex items-center gap-2 pl-8">
                  <span
                    className="text-2xl animate-pulse"
                    style={{ color: activeData.color }}
                  >
                    {activeData.symbol}
                  </span>
                  <div
                    className="flex-1 h-px"
                    style={{
                      background: `linear-gradient(90deg, ${activeData.color}, transparent)`,
                    }}
                  />
                </div>

                {/* Output side */}
                <div className="flex items-start gap-3">
                  <span className="text-white/30 text-xs font-mono mt-1">OUT</span>
                  <div
                    className="text-sm md:text-base font-mono whitespace-pre-line"
                    style={{ color: activeData.color }}
                  >
                    {activeNarrative.output}
                  </div>
                </div>
              </div>

              {/* Stage description */}
              <p className="text-white/40 text-xs mt-6 text-center">
                {activeData.description}
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col items-center gap-4 mt-8 md:mt-12">
            <Link
              href="/start"
              className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 active:scale-95"
              style={{
                background: `linear-gradient(135deg, ${VERTICES.observe.color}30, ${VERTICES.manifest.color}30)`,
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              {/* Animated symbol sequence */}
              <span className="flex items-center gap-1">
                {VERTEX_ORDER.map((key) => (
                  <span
                    key={key}
                    className={`text-lg transition-all duration-300 ${
                      activeVertex === key ? "scale-125 opacity-100" : "scale-100 opacity-40"
                    }`}
                    style={{ color: VERTICES[key].color }}
                  >
                    {VERTICES[key].symbol}
                  </span>
                ))}
              </span>
              <span className="text-white font-medium ml-2">Begin Your Case</span>
            </Link>

            <p className="text-white/30 text-xs">
              No account. No cost. Your evidence, your control.
            </p>
          </div>
        </div>
      </section>

      {/* Journey Section - Expanded Detail */}
      <section className="py-20 px-4 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex justify-center gap-3 mb-4">
              {VERTEX_ORDER.map((key) => (
                <span
                  key={key}
                  className="text-xl"
                  style={{ color: VERTICES[key].color }}
                >
                  {VERTICES[key].symbol}
                </span>
              ))}
            </div>
            <h2 className="text-2xl md:text-3xl font-light text-white/90 mb-2">
              The Four Movements
            </h2>
            <p className="text-white/40 text-sm">
              From confusion to clarity in four geometric steps
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {VERTEX_ORDER.map((key, idx) => {
              const vertex = VERTICES[key]
              const narrative = DEMO_NARRATIVE[key]
              return (
                <div
                  key={key}
                  className="group relative bg-white/[0.02] border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all duration-300 overflow-hidden"
                >
                  {/* Background glow on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at 30% 30%, ${vertex.color}10 0%, transparent 50%)`,
                    }}
                  />

                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-4">
                      <span
                        className="text-4xl"
                        style={{ color: vertex.color }}
                      >
                        {vertex.symbol}
                      </span>
                      <div>
                        <span className="text-white/30 text-xs font-mono">
                          MOVEMENT {idx + 1}
                        </span>
                        <h3
                          className="text-xl font-medium"
                          style={{ color: vertex.color }}
                        >
                          {vertex.name}
                        </h3>
                      </div>
                    </div>

                    <p className="text-white/70 text-sm mb-4 leading-relaxed">
                      {vertex.description}
                    </p>

                    <div className="bg-black/30 rounded-lg p-4 space-y-2">
                      <p className="text-white/40 text-xs italic">"{narrative.input}"</p>
                      <div className="flex items-center gap-2">
                        <span style={{ color: vertex.color }}>{vertex.symbol}</span>
                        <span className="text-white/20">→</span>
                      </div>
                      <p
                        className="text-xs font-mono whitespace-pre-line"
                        style={{ color: vertex.color }}
                      >
                        {narrative.output}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 border-t border-white/5">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-white/50 text-lg mb-6 font-light">
            Knowledge should not be the privilege of the few.
          </p>
          
          <Link
            href="/start"
            className="inline-flex items-center gap-3 px-10 py-5 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-all duration-300 hover:scale-105"
          >
            <span className="flex gap-1">
              {VERTEX_ORDER.map((key) => (
                <span
                  key={key}
                  className="text-sm"
                  style={{ color: VERTICES[key].color }}
                >
                  {VERTICES[key].symbol}
                </span>
              ))}
            </span>
            <span>Start Your Journey</span>
          </Link>
        </div>
      </section>
    </main>
  )
}
