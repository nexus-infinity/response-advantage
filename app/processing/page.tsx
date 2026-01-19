"use client"
import { useEffect, useState, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"

type Phase = "intro" | "map" | "flying" | "contrast" | "questions" | "actions" | "complete"

interface LocationEvent {
  id: string
  symbol: string
  title: string
  time: string
  address: string
  coords: { lat: number; lng: number }
  detail: string
  pinColor: string
}

interface FlightPath {
  from: number
  to: number
  progress: number
}

interface Contrast {
  theySaid: string
  reality: string
}

interface Action {
  id: string
  label: string
  icon: string
  status: "pending" | "ready" | "done"
}

export default function ProcessingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const processingId = searchParams.get("id")
  const mapRef = useRef<HTMLDivElement>(null)

  const [phase, setPhase] = useState<Phase>("intro")
  const [zoomLevel, setZoomLevel] = useState(1)
  const [mapCenter, setMapCenter] = useState({ x: 50, y: 50 })
  const [activeEventIndex, setActiveEventIndex] = useState(-1)
  const [flightPath, setFlightPath] = useState<FlightPath | null>(null)
  const [showCard, setShowCard] = useState(false)
  const [contrasts, setContrasts] = useState<Contrast[]>([])
  const [activeContrastIndex, setActiveContrastIndex] = useState(-1)
  const [questions, setQuestions] = useState<string[]>([])
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(-1)
  const [actions, setActions] = useState<Action[]>([])
  const [caseId, setCaseId] = useState<string | null>(null)

  const events: LocationEvent[] = [
    {
      id: "1",
      symbol: "●",
      title: "YOU WERE HERE",
      time: "10 Jan 2026, 7:42 PM",
      address: "Your Home",
      coords: { lat: -37.8136, lng: 144.9631 },
      detail: "Anonymous 000 call made. Claimed 'smoke from firepit'. Described you as 'aggressive'.",
      pinColor: "#ef4444",
    },
    {
      id: "2",
      symbol: "●",
      title: "EMERGENCY RESPONSE",
      time: "10 Jan 2026, 8:15 PM",
      address: "Your Home",
      coords: { lat: -37.8136, lng: 144.9631 },
      detail: "Firefighters arrived. Found nothing. No fire. No smoke. Nothing.",
      pinColor: "#f97316",
    },
    {
      id: "3",
      symbol: "▼",
      title: "THEY WERE HERE",
      time: "13 Jan 2026",
      address: "Triple Zero Victoria",
      coords: { lat: -37.8095, lng: 144.9690 },
      detail: "Police 'investigation' opened and closed. How? Unknown.",
      pinColor: "#8b5cf6",
    },
    {
      id: "4",
      symbol: "▼",
      title: "YOUR REQUEST",
      time: "14 Jan 2026",
      address: "Triple Zero Victoria",
      coords: { lat: -37.8095, lng: 144.9690 },
      detail: "You asked for the recording. They asked for Photo ID.",
      pinColor: "#6366f1",
    },
  ]

  const eventPositions = [
    { x: 25, y: 35 },
    { x: 30, y: 45 },
    { x: 70, y: 40 },
    { x: 75, y: 55 },
  ]

  useEffect(() => {
    if (!processingId) {
      router.push("/")
      return
    }
    runCinematicSequence()
  }, [processingId, router])

  const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

  const animateZoom = async (targetZoom: number, duration: number) => {
    const startZoom = zoomLevel
    const steps = 60
    const stepDuration = duration / steps
    for (let i = 0; i <= steps; i++) {
      const progress = i / steps
      const eased = 1 - Math.pow(1 - progress, 3)
      setZoomLevel(startZoom + (targetZoom - startZoom) * eased)
      await delay(stepDuration)
    }
  }

  const animateFlight = async (fromIdx: number, toIdx: number) => {
    setFlightPath({ from: fromIdx, to: toIdx, progress: 0 })
    const steps = 40
    for (let i = 0; i <= steps; i++) {
      setFlightPath({ from: fromIdx, to: toIdx, progress: i / steps })
      await delay(30)
    }
    setFlightPath(null)
  }

  const runCinematicSequence = async () => {
    // Intro - zoom from space
    setPhase("intro")
    await delay(500)
    await animateZoom(1.5, 1500)
    await delay(300)

    // Map phase - events appear one by one
    setPhase("map")
    
    for (let i = 0; i < events.length; i++) {
      setActiveEventIndex(i)
      setShowCard(false)
      
      // Pan to location
      setMapCenter(eventPositions[i])
      await delay(400)
      
      // Show card with bounce
      setShowCard(true)
      await delay(2000)
      
      // Flight to next location
      if (i < events.length - 1) {
        setPhase("flying")
        setShowCard(false)
        await delay(300)
        await animateFlight(i, i + 1)
        setPhase("map")
      }
    }

    await delay(1500)

    // Contrast phase
    setPhase("contrast")
    const contrastData: Contrast[] = [
      {
        theySaid: "Investigation revealed it was not one of your neighbours",
        reality: "No phone number. Only a first name. Cannot contact caller.",
      },
      {
        theySaid: "I suspect it might have been a passerby",
        reality: "Zero identifying information to support any suspicion.",
      },
      {
        theySaid: "Privacy considerations for the anonymous caller",
        reality: "The caller named YOUR address. Called YOU aggressive.",
      },
      {
        theySaid: "Unable to prove the call was made maliciously",
        reality: "Unable to prove anything. About anything. At all.",
      },
      {
        theySaid: "You may wish to obtain a subpoena",
        reality: "Pay to hear what a ghost said about you.",
      },
    ]
    setContrasts(contrastData)

    for (let i = 0; i < contrastData.length; i++) {
      setActiveContrastIndex(i)
      await delay(2200)
    }

    await delay(1000)

    // Questions phase
    setPhase("questions")
    const questionData = [
      "How does one investigate identity without identifying information?",
      "Who reports emergencies from untraceable phones?",
      "Why does privacy protect accusers but not the accused?",
    ]
    setQuestions(questionData)

    for (let i = 0; i < questionData.length; i++) {
      setActiveQuestionIndex(i)
      await delay(2500)
    }

    await delay(1500)

    // Actions phase
    setPhase("actions")
    setActions([
      { id: "foi", label: "FOI Request", icon: "📄", status: "ready" },
      { id: "response", label: "TZV Response", icon: "✉️", status: "ready" },
      { id: "case", label: "Case Record", icon: "◼", status: "ready" },
      { id: "ombudsman", label: "Ombudsman", icon: "⚖️", status: "ready" },
    ])
  }

  const executeAction = (id: string) => {
    setActions((prev) => prev.map((a) => (a.id === id ? { ...a, status: "done" as const } : a)))
    if (id === "case") {
      setCaseId(`LS-2026-${Math.random().toString(36).substr(2, 6).toUpperCase()}`)
    }
  }

  const allDone = actions.length > 0 && actions.every((a) => a.status === "done")

  return (
    <main className="fixed inset-0 bg-[#0d1117] text-white overflow-hidden">
      {/* Phase indicator */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full">
        {["●", "▼", "▲", "■"].map((s, i) => (
          <span
            key={s}
            className={`text-lg transition-all duration-500 ${
              (phase === "map" || phase === "flying" || phase === "intro") && i === 0
                ? "text-white scale-110"
                : phase === "contrast" && i === 1
                  ? "text-white scale-110"
                  : phase === "questions" && i === 2
                    ? "text-white scale-110"
                    : phase === "actions" && i === 3
                      ? "text-white scale-110"
                      : "text-white/30"
            }`}
          >
            {s}
          </span>
        ))}
      </div>

      {/* Map View */}
      {(phase === "intro" || phase === "map" || phase === "flying") && (
        <div
          ref={mapRef}
          className="absolute inset-0 transition-transform duration-700 ease-out"
          style={{
            transform: `scale(${zoomLevel})`,
            transformOrigin: `${mapCenter.x}% ${mapCenter.y}%`,
          }}
        >
          {/* Satellite-style map background */}
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(ellipse at 30% 40%, #1a2332 0%, transparent 50%),
                radial-gradient(ellipse at 70% 50%, #1e2d3d 0%, transparent 50%),
                linear-gradient(180deg, #0d1117 0%, #161b22 50%, #0d1117 100%)
              `,
            }}
          />

          {/* Street grid overlay */}
          <svg className="absolute inset-0 w-full h-full opacity-20">
            {/* Horizontal roads */}
            {[20, 35, 50, 65, 80].map((y) => (
              <line key={`h${y}`} x1="0%" y1={`${y}%`} x2="100%" y2={`${y}%`} stroke="#3d4f5f" strokeWidth="1" />
            ))}
            {/* Vertical roads */}
            {[15, 30, 45, 60, 75, 90].map((x) => (
              <line key={`v${x}`} x1={`${x}%`} y1="0%" x2={`${x}%`} y2="100%" stroke="#3d4f5f" strokeWidth="1" />
            ))}
            {/* Main road */}
            <line x1="20%" y1="30%" x2="80%" y2="60%" stroke="#4a6070" strokeWidth="3" />
          </svg>

          {/* Location pins - all visible but dimmed until active */}
          {events.map((event, idx) => (
            <div
              key={event.id}
              className="absolute transition-all duration-500"
              style={{
                left: `${eventPositions[idx].x}%`,
                top: `${eventPositions[idx].y}%`,
                transform: "translate(-50%, -100%)",
                opacity: idx <= activeEventIndex ? 1 : 0.2,
              }}
            >
              {/* Pin */}
              <div
                className={`relative transition-transform duration-300 ${
                  idx === activeEventIndex ? "scale-125" : "scale-100"
                }`}
              >
                <svg width="40" height="50" viewBox="0 0 40 50" className="drop-shadow-lg">
                  <path
                    d="M20 0 C8.954 0 0 8.954 0 20 C0 35 20 50 20 50 C20 50 40 35 40 20 C40 8.954 31.046 0 20 0Z"
                    fill={event.pinColor}
                  />
                  <circle cx="20" cy="18" r="8" fill="white" />
                  <text x="20" y="22" textAnchor="middle" fontSize="12" fill={event.pinColor}>
                    {idx + 1}
                  </text>
                </svg>

                {/* Pulse ring for active */}
                {idx === activeEventIndex && (
                  <div
                    className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full animate-ping"
                    style={{ backgroundColor: `${event.pinColor}40` }}
                  />
                )}
              </div>
            </div>
          ))}

          {/* Flight path animation */}
          {flightPath && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <linearGradient id="flightGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={events[flightPath.from].pinColor} />
                  <stop offset="100%" stopColor={events[flightPath.to].pinColor} />
                </linearGradient>
              </defs>
              {/* Trail */}
              <line
                x1={`${eventPositions[flightPath.from].x}%`}
                y1={`${eventPositions[flightPath.from].y}%`}
                x2={`${eventPositions[flightPath.from].x + (eventPositions[flightPath.to].x - eventPositions[flightPath.from].x) * flightPath.progress}%`}
                y2={`${eventPositions[flightPath.from].y + (eventPositions[flightPath.to].y - eventPositions[flightPath.from].y) * flightPath.progress}%`}
                stroke="url(#flightGradient)"
                strokeWidth="3"
                strokeDasharray="8,4"
              />
              {/* Flying dot */}
              <circle
                cx={`${eventPositions[flightPath.from].x + (eventPositions[flightPath.to].x - eventPositions[flightPath.from].x) * flightPath.progress}%`}
                cy={`${eventPositions[flightPath.from].y + (eventPositions[flightPath.to].y - eventPositions[flightPath.from].y) * flightPath.progress}%`}
                r="6"
                fill="white"
                className="drop-shadow-lg"
              />
            </svg>
          )}

          {/* Event card - appears near active pin */}
          {showCard && activeEventIndex >= 0 && (
            <div
              className="absolute z-20 transition-all duration-500 animate-in slide-in-from-bottom-4 fade-in"
              style={{
                left: `${eventPositions[activeEventIndex].x + 5}%`,
                top: `${eventPositions[activeEventIndex].y - 5}%`,
                maxWidth: "320px",
              }}
            >
              <div
                className="bg-black/90 backdrop-blur-md rounded-xl p-5 border shadow-2xl"
                style={{ borderColor: events[activeEventIndex].pinColor }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: events[activeEventIndex].pinColor }}
                  >
                    {activeEventIndex + 1}
                  </span>
                  <div>
                    <p className="text-xs text-white/50 font-mono">{events[activeEventIndex].time}</p>
                    <h3 className="font-semibold text-lg" style={{ color: events[activeEventIndex].pinColor }}>
                      {events[activeEventIndex].title}
                    </h3>
                  </div>
                </div>
                <p className="text-sm text-white/60 mb-2">{events[activeEventIndex].address}</p>
                <p className="text-white/90 leading-relaxed">{events[activeEventIndex].detail}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Contrast Phase - Split screen comparison */}
      {phase === "contrast" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
          <div className="text-center mb-8">
            <span className="text-3xl text-purple-400">▼</span>
            <p className="text-white/40 text-sm tracking-widest mt-2">COMPARE</p>
          </div>

          <div className="w-full max-w-4xl space-y-4">
            {contrasts.map((c, idx) => (
              <div
                key={idx}
                className={`grid md:grid-cols-2 gap-3 transition-all duration-700 ${
                  idx <= activeContrastIndex ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              >
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 backdrop-blur">
                  <p className="text-[10px] text-red-400 tracking-widest mb-2">THEY SAID</p>
                  <p className="text-white/90 text-sm leading-relaxed">"{c.theySaid}"</p>
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 backdrop-blur">
                  <p className="text-[10px] text-emerald-400 tracking-widest mb-2">REALITY</p>
                  <p className="text-white/90 text-sm leading-relaxed">{c.reality}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Questions Phase - Centered, one at a time */}
      {phase === "questions" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
          <span className="text-4xl text-blue-400 mb-8">▲</span>

          <div className="max-w-2xl text-center space-y-6">
            {questions.map((q, idx) => (
              <p
                key={idx}
                className={`text-xl md:text-2xl leading-relaxed transition-all duration-700 ${
                  idx <= activeQuestionIndex ? "opacity-100 translate-y-0 text-white" : "opacity-0 translate-y-4"
                }`}
              >
                {q}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Actions Phase - Card grid */}
      {phase === "actions" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
          <div className="text-center mb-10">
            <span className="text-4xl">■</span>
            <p className="text-white/40 text-sm tracking-widest mt-2">PATHS FORWARD</p>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-md w-full">
            {actions.map((action) => (
              <button
                key={action.id}
                onClick={() => executeAction(action.id)}
                disabled={action.status === "done"}
                className={`
                  relative p-6 rounded-2xl border text-center transition-all duration-300
                  ${
                    action.status === "done"
                      ? "bg-emerald-500/10 border-emerald-500/30"
                      : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/30 hover:scale-105 active:scale-95"
                  }
                `}
              >
                <span className="text-3xl block mb-2">{action.icon}</span>
                <span className="font-medium">{action.label}</span>
                {action.status === "done" && (
                  <span className="absolute top-2 right-2 text-emerald-400 text-lg">✓</span>
                )}
              </button>
            ))}
          </div>

          {allDone && (
            <button
              onClick={() => router.push(`/result?caseId=${caseId || "preview"}`)}
              className="mt-10 px-8 py-4 bg-white text-black rounded-full font-medium hover:scale-105 active:scale-95 transition-transform"
            >
              View Your Case
            </button>
          )}
        </div>
      )}
    </main>
  )
}
