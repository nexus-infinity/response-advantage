"use client"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

type Phase = "map" | "timeline" | "contrast" | "questions" | "actions" | "complete"

interface LocationEvent {
  id: string
  symbol: string
  title: string
  time: string
  location: string
  coords: { lat: number; lng: number }
  detail: string
  visible: boolean
}

interface Contrast {
  id: string
  theySaid: string
  reality: string
  visible: boolean
}

interface Question {
  text: string
  visible: boolean
}

interface Action {
  id: string
  label: string
  description: string
  status: "pending" | "ready" | "done"
}

export default function ProcessingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const processingId = searchParams.get("id")

  const [phase, setPhase] = useState<Phase>("map")
  const [events, setEvents] = useState<LocationEvent[]>([])
  const [activeEventIndex, setActiveEventIndex] = useState(-1)
  const [contrasts, setContrasts] = useState<Contrast[]>([])
  const [questions, setQuestions] = useState<Question[]>([])
  const [actions, setActions] = useState<Action[]>([])
  const [showLine, setShowLine] = useState(false)
  const [caseId, setCaseId] = useState<string | null>(null)

  useEffect(() => {
    if (!processingId) {
      router.push("/")
      return
    }

    runCinematicSequence()
  }, [processingId, router])

  const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

  const runCinematicSequence = async () => {
    // Phase 1: Map with events appearing
    setPhase("map")
    
    const locationEvents: LocationEvent[] = [
      {
        id: "1",
        symbol: "●",
        title: "Your Home",
        time: "10 Jan 2026, 7:42 PM",
        location: "Your residential address",
        coords: { lat: -37.8136, lng: 144.9631 },
        detail: "Anonymous 000 call made claiming 'smoke from firepit' and describing occupant as 'aggressive'",
        visible: false,
      },
      {
        id: "2", 
        symbol: "●",
        title: "Emergency Response",
        time: "10 Jan 2026, 8:15 PM",
        location: "Your residential address",
        coords: { lat: -37.8136, lng: 144.9631 },
        detail: "Firefighters attend. No fire. No smoke. Nothing.",
        visible: false,
      },
      {
        id: "3",
        symbol: "▼",
        title: "TZV Office",
        time: "13 Jan 2026",
        location: "Triple Zero Victoria",
        coords: { lat: -37.8095, lng: 144.9690 },
        detail: "Police 'investigation' opened and closed. Method: unknown.",
        visible: false,
      },
      {
        id: "4",
        symbol: "▼",
        title: "Access Request",
        time: "14 Jan 2026",
        location: "Triple Zero Victoria", 
        coords: { lat: -37.8095, lng: 144.9690 },
        detail: "You request the recording. They request Photo ID.",
        visible: false,
      },
    ]

    // Animate events appearing one by one
    for (let i = 0; i < locationEvents.length; i++) {
      await delay(1200)
      setActiveEventIndex(i)
      setEvents(prev => {
        const updated = [...locationEvents.slice(0, i + 1)]
        updated[i] = { ...updated[i], visible: true }
        return updated
      })
      if (i > 0) setShowLine(true)
    }

    await delay(2000)

    // Phase 2: Timeline consolidation
    setPhase("timeline")
    await delay(1500)

    // Phase 3: The Contrast - this is the magic moment
    setPhase("contrast")
    
    const contrastData: Contrast[] = [
      {
        id: "1",
        theySaid: "Investigation revealed it was not one of your neighbours",
        reality: "No phone number. Only a first name. Cannot contact caller.",
        visible: false,
      },
      {
        id: "2", 
        theySaid: "I suspect it might have been a passerby",
        reality: "Zero identifying information exists to support any suspicion.",
        visible: false,
      },
      {
        id: "3",
        theySaid: "Privacy considerations for the anonymous caller",
        reality: "The caller made claims about YOU. Named YOUR address. Called YOU aggressive.",
        visible: false,
      },
      {
        id: "4",
        theySaid: "Unable to prove the call was made maliciously",
        reality: "Unable to prove ANYTHING about the call. Or the caller. Or their claims.",
        visible: false,
      },
      {
        id: "5",
        theySaid: "You may wish to obtain a subpoena",
        reality: "Pay money to hear what someone said about you. Someone who doesn't exist.",
        visible: false,
      },
    ]

    // Reveal contrasts one by one with dramatic timing
    for (let i = 0; i < contrastData.length; i++) {
      await delay(1800)
      setContrasts(prev => {
        const updated = [...contrastData.slice(0, i + 1)]
        updated[i] = { ...updated[i], visible: true }
        return updated
      })
    }

    await delay(2000)

    // Phase 4: Questions that land
    setPhase("questions")
    
    const questionData: Question[] = [
      { text: "How does one investigate identity without identifying information?", visible: false },
      { text: "Who reports emergencies from untraceable phones?", visible: false },
      { text: "Why does privacy protect those who make claims, but not those claimed about?", visible: false },
    ]

    for (let i = 0; i < questionData.length; i++) {
      await delay(2000)
      setQuestions(prev => {
        const updated = [...questionData.slice(0, i + 1)]
        updated[i] = { ...updated[i], visible: true }
        return updated
      })
    }

    await delay(2500)

    // Phase 5: Actions available
    setPhase("actions")
    
    setActions([
      { id: "foi", label: "FOI Request", description: "Formal access request, legally grounded", status: "ready" },
      { id: "response", label: "TZV Response", description: "Clear reply with Photo ID attached", status: "ready" },
      { id: "case", label: "Case Record", description: "Permanent. Witnessed. Exists.", status: "ready" },
      { id: "ombudsman", label: "Ombudsman", description: "If the path stays blocked", status: "ready" },
    ])
  }

  const executeAction = async (id: string) => {
    setActions(prev => prev.map(a => a.id === id ? { ...a, status: "done" as const } : a))
    
    if (id === "case") {
      const newCaseId = `LS-2026-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
      setCaseId(newCaseId)
    }
  }

  const allActionsDone = actions.length > 0 && actions.every(a => a.status === "done")

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* Phase indicator - geometric symbols */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 flex items-center gap-3 z-50">
        <PhaseGlyph symbol="●" active={phase === "map" || phase === "timeline"} complete={phase !== "map" && phase !== "timeline"} />
        <span className="w-8 h-px bg-white/20" />
        <PhaseGlyph symbol="▼" active={phase === "contrast"} complete={["questions", "actions", "complete"].includes(phase)} />
        <span className="w-8 h-px bg-white/20" />
        <PhaseGlyph symbol="▲" active={phase === "questions"} complete={["actions", "complete"].includes(phase)} />
        <span className="w-8 h-px bg-white/20" />
        <PhaseGlyph symbol="■" active={phase === "actions" || phase === "complete"} complete={phase === "complete"} />
      </div>

      {/* Map Phase - Visual story */}
      {(phase === "map" || phase === "timeline") && (
        <div className="h-screen flex flex-col">
          {/* Simulated map background */}
          <div className="flex-1 relative bg-gradient-to-b from-[#1a1a2e] to-[#0a0a0a]">
            {/* Grid overlay to simulate map */}
            <div className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                `,
                backgroundSize: '50px 50px'
              }}
            />
            
            {/* Connection line */}
            {showLine && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <line 
                  x1="30%" y1="40%" 
                  x2="70%" y2="60%"
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="2"
                  strokeDasharray="8,4"
                  className="animate-pulse"
                />
              </svg>
            )}
            
            {/* Event cards positioned on "map" */}
            {events.map((event, idx) => (
              <div
                key={event.id}
                className={`absolute transition-all duration-700 ${
                  event.visible ? "opacity-100 scale-100" : "opacity-0 scale-90"
                }`}
                style={{
                  left: idx < 2 ? "15%" : "55%",
                  top: `${25 + (idx % 2) * 25}%`,
                }}
              >
                <div className={`
                  bg-black/80 backdrop-blur border rounded-lg p-4 max-w-[280px] md:max-w-[320px]
                  ${activeEventIndex === idx ? "border-white shadow-lg shadow-white/10" : "border-white/20"}
                `}>
                  <div className="flex items-start gap-3">
                    <span className={`text-2xl ${activeEventIndex === idx ? "animate-pulse" : ""}`}>
                      {event.symbol}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white/50 font-mono">{event.time}</p>
                      <h3 className="font-medium mt-1">{event.title}</h3>
                      <p className="text-sm text-white/70 mt-2 leading-relaxed">{event.detail}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Timeline strip at bottom */}
          {phase === "timeline" && (
            <div className="h-24 bg-black border-t border-white/10 flex items-center justify-center gap-4 px-4 overflow-x-auto">
              {events.map((event, idx) => (
                <div key={event.id} className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-lg">{event.symbol}</span>
                  <div className="text-xs">
                    <p className="text-white/50">{event.time.split(",")[0]}</p>
                    <p className="text-white/80">{event.title}</p>
                  </div>
                  {idx < events.length - 1 && <span className="w-8 h-px bg-white/30 mx-2" />}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Contrast Phase - Side by side truth */}
      {phase === "contrast" && (
        <div className="min-h-screen pt-20 pb-12 px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-center text-white/50 text-sm tracking-widest mb-12">
              ▼ WHAT THEY SAID vs WHAT IS
            </h2>
            
            <div className="space-y-6">
              {contrasts.map((c, idx) => (
                <div
                  key={c.id}
                  className={`transition-all duration-500 ${
                    c.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
                >
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* What they said */}
                    <div className="bg-red-950/20 border border-red-900/30 rounded-lg p-5">
                      <p className="text-xs text-red-400/70 mb-2 tracking-wide">THEY SAID</p>
                      <p className="text-white/90 leading-relaxed">"{c.theySaid}"</p>
                    </div>
                    
                    {/* Reality */}
                    <div className="bg-emerald-950/20 border border-emerald-900/30 rounded-lg p-5">
                      <p className="text-xs text-emerald-400/70 mb-2 tracking-wide">REALITY</p>
                      <p className="text-white/90 leading-relaxed">{c.reality}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Questions Phase - The landing */}
      {phase === "questions" && (
        <div className="min-h-screen flex flex-col items-center justify-center px-4">
          <div className="max-w-2xl text-center space-y-8">
            <span className="text-4xl">▲</span>
            
            {questions.map((q, idx) => (
              <p
                key={idx}
                className={`text-xl md:text-2xl leading-relaxed text-white/90 transition-all duration-700 ${
                  q.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                {q.text}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Actions Phase */}
      {(phase === "actions" || phase === "complete") && (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-20">
          <div className="max-w-xl w-full">
            <div className="text-center mb-12">
              <span className="text-4xl">■</span>
              <h2 className="text-white/50 text-sm tracking-widest mt-4">PATHS FORWARD</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {actions.map((action) => (
                <button
                  key={action.id}
                  onClick={() => executeAction(action.id)}
                  disabled={action.status === "done"}
                  className={`
                    p-6 rounded-lg border text-left transition-all
                    ${action.status === "done" 
                      ? "bg-white/5 border-white/20 opacity-60" 
                      : "bg-white/5 border-white/10 hover:border-white/40 hover:bg-white/10"
                    }
                  `}
                >
                  <div className="flex items-start justify-between">
                    <h3 className="font-medium">{action.label}</h3>
                    {action.status === "done" && <span className="text-emerald-400">✓</span>}
                  </div>
                  <p className="text-sm text-white/50 mt-2">{action.description}</p>
                </button>
              ))}
            </div>

            {allActionsDone && (
              <div className="mt-12 text-center">
                <button
                  onClick={() => router.push(`/result?caseId=${caseId || "preview"}`)}
                  className="px-8 py-4 bg-white text-black rounded-lg font-medium hover:bg-white/90 transition-colors"
                >
                  View Your Case
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  )
}

function PhaseGlyph({ symbol, active, complete }: { symbol: string; active: boolean; complete: boolean }) {
  return (
    <span className={`
      text-xl transition-all duration-300
      ${active ? "text-white scale-125" : complete ? "text-white/60" : "text-white/20"}
      ${active ? "animate-pulse" : ""}
    `}>
      {symbol}
    </span>
  )
}
