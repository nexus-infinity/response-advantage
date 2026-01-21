"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"

// Symbol colors - the narrative palette
const COLORS = {
  purple: "#9370DB",  // ● Document - Observation
  orange: "#FF8C00",  // ▼ Ground - Evidence  
  gold: "#FFD700",    // ▲ Recognise - Pattern
  blue: "#0066CC",    // ■ Act - Resolution
}

export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0)
  const [hoveredSymbol, setHoveredSymbol] = useState<string | null>(null)
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Calculate symbol positions based on scroll
  const getSymbolTransform = (index: number) => {
    const progress = Math.min(scrollY / 400, 1)
    const baseY = 0
    const spreadY = index * 120 * progress
    const spreadX = (index - 1.5) * 80 * progress
    return {
      transform: `translate(${spreadX}px, ${baseY + spreadY}px) scale(${1 + progress * 0.2})`,
      opacity: 0.3 + progress * 0.7,
    }
  }

  return (
    <main className="min-h-[300vh] bg-[#050508] text-white">
      {/* Hero - The Geometric Constellation */}
      <section 
        ref={heroRef}
        className="h-screen sticky top-0 flex items-center justify-center overflow-hidden"
      >
        {/* Radial gradient backdrop */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse 80% 50% at 50% 50%, ${COLORS.purple}08 0%, transparent 50%),
              radial-gradient(ellipse 60% 40% at 30% 60%, ${COLORS.blue}05 0%, transparent 40%),
              radial-gradient(ellipse 50% 30% at 70% 40%, ${COLORS.gold}05 0%, transparent 40%)
            `,
          }}
        />

        {/* The central geometry - symbols arranged around logo */}
        <div className="relative flex flex-col items-center">
          {/* Logo at center */}
          <div className="relative z-10 mb-8">
            <div className="relative w-24 h-24 md:w-32 md:h-32">
              <Image
                src="/logo-recognition.png"
                alt="re-cognition"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* The four symbols - forming a constellation */}
          <div className="relative h-[280px] w-[320px] md:h-[360px] md:w-[400px]">
            {/* ● Document - Top */}
            <div 
              className="absolute left-1/2 -translate-x-1/2 top-0 transition-all duration-700 cursor-pointer group"
              onMouseEnter={() => setHoveredSymbol("document")}
              onMouseLeave={() => setHoveredSymbol(null)}
            >
              <div className="flex flex-col items-center">
                <span 
                  className="text-5xl md:text-6xl transition-all duration-500"
                  style={{ 
                    color: COLORS.purple,
                    textShadow: hoveredSymbol === "document" ? `0 0 40px ${COLORS.purple}` : `0 0 20px ${COLORS.purple}40`,
                    transform: hoveredSymbol === "document" ? "scale(1.2)" : "scale(1)",
                  }}
                >
                  ●
                </span>
                <span 
                  className={`text-xs tracking-widest mt-2 transition-all duration-300 ${
                    hoveredSymbol === "document" ? "opacity-100" : "opacity-0"
                  }`}
                  style={{ color: COLORS.purple }}
                >
                  DOCUMENT
                </span>
              </div>
            </div>

            {/* ▼ Ground - Left */}
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 transition-all duration-700 cursor-pointer group"
              onMouseEnter={() => setHoveredSymbol("ground")}
              onMouseLeave={() => setHoveredSymbol(null)}
            >
              <div className="flex flex-col items-center">
                <span 
                  className="text-5xl md:text-6xl transition-all duration-500"
                  style={{ 
                    color: COLORS.orange,
                    textShadow: hoveredSymbol === "ground" ? `0 0 40px ${COLORS.orange}` : `0 0 20px ${COLORS.orange}40`,
                    transform: hoveredSymbol === "ground" ? "scale(1.2)" : "scale(1)",
                  }}
                >
                  ▼
                </span>
                <span 
                  className={`text-xs tracking-widest mt-2 transition-all duration-300 ${
                    hoveredSymbol === "ground" ? "opacity-100" : "opacity-0"
                  }`}
                  style={{ color: COLORS.orange }}
                >
                  GROUND
                </span>
              </div>
            </div>

            {/* ▲ Recognise - Right */}
            <div 
              className="absolute right-0 top-1/2 -translate-y-1/2 transition-all duration-700 cursor-pointer group"
              onMouseEnter={() => setHoveredSymbol("recognise")}
              onMouseLeave={() => setHoveredSymbol(null)}
            >
              <div className="flex flex-col items-center">
                <span 
                  className="text-5xl md:text-6xl transition-all duration-500"
                  style={{ 
                    color: COLORS.gold,
                    textShadow: hoveredSymbol === "recognise" ? `0 0 40px ${COLORS.gold}` : `0 0 20px ${COLORS.gold}40`,
                    transform: hoveredSymbol === "recognise" ? "scale(1.2)" : "scale(1)",
                  }}
                >
                  ▲
                </span>
                <span 
                  className={`text-xs tracking-widest mt-2 transition-all duration-300 ${
                    hoveredSymbol === "recognise" ? "opacity-100" : "opacity-0"
                  }`}
                  style={{ color: COLORS.gold }}
                >
                  RECOGNISE
                </span>
              </div>
            </div>

            {/* ■ Act - Bottom */}
            <div 
              className="absolute left-1/2 -translate-x-1/2 bottom-0 transition-all duration-700 cursor-pointer group"
              onMouseEnter={() => setHoveredSymbol("act")}
              onMouseLeave={() => setHoveredSymbol(null)}
            >
              <div className="flex flex-col items-center">
                <span 
                  className="text-5xl md:text-6xl transition-all duration-500"
                  style={{ 
                    color: COLORS.blue,
                    textShadow: hoveredSymbol === "act" ? `0 0 40px ${COLORS.blue}` : `0 0 20px ${COLORS.blue}40`,
                    transform: hoveredSymbol === "act" ? "scale(1.2)" : "scale(1)",
                  }}
                >
                  ■
                </span>
                <span 
                  className={`text-xs tracking-widest mt-2 transition-all duration-300 ${
                    hoveredSymbol === "act" ? "opacity-100" : "opacity-0"
                  }`}
                  style={{ color: COLORS.blue }}
                >
                  ACT
                </span>
              </div>
            </div>

            {/* Connecting lines - SVG constellation */}
            <svg 
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ opacity: 0.15 }}
            >
              {/* Top to Left */}
              <line x1="50%" y1="15%" x2="12%" y2="50%" stroke={COLORS.purple} strokeWidth="1" />
              {/* Top to Right */}
              <line x1="50%" y1="15%" x2="88%" y2="50%" stroke={COLORS.purple} strokeWidth="1" />
              {/* Left to Bottom */}
              <line x1="12%" y1="50%" x2="50%" y2="85%" stroke={COLORS.orange} strokeWidth="1" />
              {/* Right to Bottom */}
              <line x1="88%" y1="50%" x2="50%" y2="85%" stroke={COLORS.gold} strokeWidth="1" />
              {/* Left to Right (through center) */}
              <line x1="12%" y1="50%" x2="88%" y2="50%" stroke="white" strokeWidth="1" strokeDasharray="4,8" />
            </svg>
          </div>

          {/* Title and tagline */}
          <div className="text-center mt-8">
            <h1 className="text-3xl md:text-4xl font-extralight tracking-[0.3em] text-white/90 mb-4">
              re-cognition
            </h1>
            <p className="text-white/40 text-sm md:text-base max-w-sm mx-auto leading-relaxed">
              From observation to action.<br/>
              Your evidence, grounded in law.
            </p>
          </div>

          {/* CTA */}
          <Link
            href="/start"
            className="mt-10 group relative"
          >
            <div 
              className="px-8 py-4 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm flex items-center gap-3 transition-all duration-300 group-hover:border-white/40 group-hover:bg-white/10"
            >
              <span 
                className="text-xl transition-all duration-300 group-hover:scale-125"
                style={{ color: COLORS.purple }}
              >
                ●
              </span>
              <span className="text-white/80 group-hover:text-white transition-colors">
                Begin
              </span>
            </div>
          </Link>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <div className="w-px h-12 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
        </div>
      </section>

      {/* The Journey - Visual narrative */}
      <section className="relative py-32 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Stage 1: Document */}
          <div className="flex items-start gap-8 mb-32">
            <div className="shrink-0">
              <span 
                className="text-6xl md:text-7xl"
                style={{ color: COLORS.purple, textShadow: `0 0 30px ${COLORS.purple}40` }}
              >
                ●
              </span>
            </div>
            <div className="pt-2">
              <h2 className="text-2xl md:text-3xl font-light text-white mb-4">
                Document what happened
              </h2>
              <p className="text-white/50 leading-relaxed text-lg">
                Drop the email, the letter, the notice. Capture where you are. 
                The system observes - extracting dates, entities, claims, contradictions.
              </p>
            </div>
          </div>

          {/* Stage 2: Ground */}
          <div className="flex items-start gap-8 mb-32 md:ml-16">
            <div className="shrink-0">
              <span 
                className="text-6xl md:text-7xl"
                style={{ color: COLORS.orange, textShadow: `0 0 30px ${COLORS.orange}40` }}
              >
                ▼
              </span>
            </div>
            <div className="pt-2">
              <h2 className="text-2xl md:text-3xl font-light text-white mb-4">
                Ground in law
              </h2>
              <p className="text-white/50 leading-relaxed text-lg">
                Relevant legislation surfaces automatically. Not generic legal advice - 
                specific provisions that apply to your exact situation.
              </p>
            </div>
          </div>

          {/* Stage 3: Recognise */}
          <div className="flex items-start gap-8 mb-32 md:ml-32">
            <div className="shrink-0">
              <span 
                className="text-6xl md:text-7xl"
                style={{ color: COLORS.gold, textShadow: `0 0 30px ${COLORS.gold}40` }}
              >
                ▲
              </span>
            </div>
            <div className="pt-2">
              <h2 className="text-2xl md:text-3xl font-light text-white mb-4">
                Recognise the pattern
              </h2>
              <p className="text-white/50 leading-relaxed text-lg">
                What they said versus what is. Contradictions made visible. 
                The questions that matter, articulated clearly.
              </p>
            </div>
          </div>

          {/* Stage 4: Act */}
          <div className="flex items-start gap-8 md:ml-48">
            <div className="shrink-0">
              <span 
                className="text-6xl md:text-7xl"
                style={{ color: COLORS.blue, textShadow: `0 0 30px ${COLORS.blue}40` }}
              >
                ■
              </span>
            </div>
            <div className="pt-2">
              <h2 className="text-2xl md:text-3xl font-light text-white mb-4">
                Act with clarity
              </h2>
              <p className="text-white/50 leading-relaxed text-lg">
                FOI requests, formal responses, ombudsman complaints - 
                ready to send. A permanent record that cannot be unseen.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-4 border-t border-white/5">
        <div className="max-w-xl mx-auto text-center">
          {/* Symbol sequence */}
          <div className="flex justify-center items-center gap-4 mb-8">
            <span className="text-3xl" style={{ color: COLORS.purple }}>●</span>
            <span className="w-8 h-px bg-white/20" />
            <span className="text-3xl" style={{ color: COLORS.orange }}>▼</span>
            <span className="w-8 h-px bg-white/20" />
            <span className="text-3xl" style={{ color: COLORS.gold }}>▲</span>
            <span className="w-8 h-px bg-white/20" />
            <span className="text-3xl" style={{ color: COLORS.blue }}>■</span>
          </div>

          <h2 className="text-2xl md:text-3xl font-extralight text-white mb-6 leading-relaxed">
            Knowledge should not be<br/>the privilege of the few
          </h2>
          
          <Link
            href="/start"
            className="inline-flex items-center gap-3 px-10 py-5 bg-white text-[#050508] rounded-full font-medium hover:bg-white/90 transition-all duration-300 hover:scale-105"
          >
            <span style={{ color: COLORS.purple }}>●</span>
            Begin Your Case
          </Link>
        </div>
      </section>
    </main>
  )
}
