"use client"
import { useEffect, useState, useRef, useCallback } from "react"
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

// Symbol router colors from the manifest
const SYMBOL_COLORS: Record<string, string> = {
  "●": "#9370DB", // OBI-WAN - Observer
  "▼": "#FF8C00", // TATA - Evidence
  "▲": "#FFD700", // ATLAS - Intelligence
  "◼": "#0066CC", // DOJO - Manifestation
}

export default function ProcessingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const processingId = searchParams.get("id")
  const mapContainerRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const polylineRef = useRef<any>(null)

  const [phase, setPhase] = useState<Phase>("intro")
  const [mapLoaded, setMapLoaded] = useState(false)
  const [activeEventIndex, setActiveEventIndex] = useState(-1)
  const [showCard, setShowCard] = useState(false)
  const [contrasts, setContrasts] = useState<Contrast[]>([])
  const [activeContrastIndex, setActiveContrastIndex] = useState(-1)
  const [questions, setQuestions] = useState<string[]>([])
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(-1)
  const [actions, setActions] = useState<Action[]>([])
  const [caseId, setCaseId] = useState<string | null>(null)

  // Melbourne coordinates for demo - would come from actual case data
  const events: LocationEvent[] = [
    {
      id: "1",
      symbol: "●",
      title: "YOU WERE HERE",
      time: "10 Jan 2026, 7:42 PM",
      address: "Residential Address, Melbourne",
      coords: { lat: -37.8136, lng: 144.9531 },
      detail: "Anonymous 000 call made. Claimed 'smoke from firepit'. Described you as 'aggressive'.",
      pinColor: SYMBOL_COLORS["●"],
    },
    {
      id: "2",
      symbol: "●",
      title: "EMERGENCY RESPONSE",
      time: "10 Jan 2026, 8:15 PM",
      address: "Residential Address, Melbourne",
      coords: { lat: -37.8136, lng: 144.9531 },
      detail: "Firefighters arrived. Found nothing. No fire. No smoke. Nothing.",
      pinColor: SYMBOL_COLORS["●"],
    },
    {
      id: "3",
      symbol: "▼",
      title: "THEY WERE HERE",
      time: "13 Jan 2026",
      address: "Triple Zero Victoria HQ",
      coords: { lat: -37.8095, lng: 144.9790 },
      detail: "Police 'investigation' opened and closed. How? Unknown.",
      pinColor: SYMBOL_COLORS["▼"],
    },
    {
      id: "4",
      symbol: "▼",
      title: "YOUR REQUEST",
      time: "14 Jan 2026",
      address: "Triple Zero Victoria HQ",
      coords: { lat: -37.8095, lng: 144.9790 },
      detail: "You asked for the recording. They asked for Photo ID.",
      pinColor: SYMBOL_COLORS["▼"],
    },
  ]

  const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

  // Initialize Real Google Maps
  const initMap = useCallback(async () => {
    if (!mapContainerRef.current || mapInstanceRef.current) return

    // Check if Google Maps is already loaded
    if (!window.google?.maps) {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
      if (!apiKey) {
        console.error("[v0] Google Maps API key not found")
        // Fallback to Leaflet if no API key
        const L = (await import("leaflet")).default
        await import("leaflet/dist/leaflet.css")
        const map = L.map(mapContainerRef.current, {
          center: [-37.8116, 144.9660],
          zoom: 14,
          zoomControl: false,
          attributionControl: false,
        })
        L.tileLayer(
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          { maxZoom: 19 }
        ).addTo(map)
        mapInstanceRef.current = map
        setMapLoaded(true)
        return
      }

      // Load Google Maps script
      const script = document.createElement("script")
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry&callback=initGoogleMap`
      script.async = true
      script.defer = true
      
      // Define callback
      ;(window as Window & { initGoogleMap?: () => void }).initGoogleMap = () => {
        initMap()
      }
      
      document.head.appendChild(script)
      return
    }

    // Create Google Map with satellite/hybrid view (like Google Earth)
    const map = new window.google.maps.Map(mapContainerRef.current, {
      center: { lat: -37.8116, lng: 144.9660 },
      zoom: 14,
      mapTypeId: "hybrid", // Satellite imagery with labels
      disableDefaultUI: true,
      gestureHandling: "none",
      tilt: 45, // 3D tilt like Google Earth
      heading: 0,
      styles: [
        { featureType: "poi", stylers: [{ visibility: "off" }] },
        { featureType: "transit", stylers: [{ visibility: "off" }] },
      ],
    })

    mapInstanceRef.current = map
    setMapLoaded(true)
  }, [])

  // Animate camera to location - works with both Google Maps and Leaflet
  const flyTo = useCallback(
    async (coords: { lat: number; lng: number }, zoom: number = 16) => {
      if (!mapInstanceRef.current) return

      // Check if it's Google Maps or Leaflet
      if (window.google?.maps && mapInstanceRef.current.panTo) {
        // Google Maps - smooth pan and zoom
        mapInstanceRef.current.panTo({ lat: coords.lat, lng: coords.lng })
        await delay(500)
        mapInstanceRef.current.setZoom(zoom)
        await delay(1000)
      } else if (mapInstanceRef.current.flyTo) {
        // Leaflet fallback
        mapInstanceRef.current.flyTo([coords.lat, coords.lng], zoom, {
          duration: 1.5,
          easeLinearity: 0.25,
        })
        await delay(1600)
      }
    },
    []
  )

  // Draw flight path between points - works with both Google Maps and Leaflet
  const drawFlightPath = useCallback(
    async (from: LocationEvent, to: LocationEvent) => {
      if (!mapInstanceRef.current) return

      // Remove existing polyline
      if (polylineRef.current) {
        if (polylineRef.current.setMap) {
          // Google Maps
          polylineRef.current.setMap(null)
        } else if (mapInstanceRef.current.removeLayer) {
          // Leaflet
          mapInstanceRef.current.removeLayer(polylineRef.current)
        }
      }

      // Check if it's Google Maps or Leaflet
      if (window.google?.maps) {
        // Google Maps polyline
        polylineRef.current = new window.google.maps.Polyline({
          path: [
            { lat: from.coords.lat, lng: from.coords.lng },
            { lat: to.coords.lat, lng: to.coords.lng },
          ],
          geodesic: true,
          strokeColor: "#ffffff",
          strokeOpacity: 0.8,
          strokeWeight: 3,
          map: mapInstanceRef.current,
        })
      } else {
        // Leaflet fallback
        const L = (await import("leaflet")).default
        const path = [
          [from.coords.lat, from.coords.lng],
          [to.coords.lat, to.coords.lng],
        ]
        polylineRef.current = L.polyline(path as [number, number][], {
          color: "#ffffff",
          weight: 3,
          opacity: 0.8,
          dashArray: "10, 10",
        }).addTo(mapInstanceRef.current)
      }
    },
    []
  )

  // Run cinematic sequence
  const runCinematicSequence = useCallback(async () => {
    if (!mapLoaded) return

    // Intro - wide shot
    setPhase("intro")
    await delay(1000)

    // Map phase - events appear one by one with camera movements
    setPhase("map")

    for (let i = 0; i < events.length; i++) {
      setActiveEventIndex(i)
      setShowCard(false)

      // Fly to location
      await flyTo(events[i].coords, i < 2 ? 17 : 16)
      await delay(500)

      // Show info card
      setShowCard(true)
      await delay(2500)

      // Draw flight path to next location
      if (i < events.length - 1) {
        setPhase("flying")
        setShowCard(false)
        await drawFlightPath(events[i], events[i + 1])
        await delay(1500)
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
      { id: "foi", label: "FOI Request", icon: "●", status: "ready" },
      { id: "response", label: "TZV Response", icon: "▼", status: "ready" },
      { id: "case", label: "Case Record", icon: "▲", status: "ready" },
      { id: "ombudsman", label: "Ombudsman", icon: "◼", status: "ready" },
    ])
  }, [mapLoaded, flyTo, drawFlightPath])

  // Initialize
  useEffect(() => {
    if (!processingId) {
      router.push("/")
      return
    }
    initMap()
  }, [processingId, router, initMap])

  // Start sequence when map loads
  useEffect(() => {
    if (mapLoaded) {
      runCinematicSequence()
    }
  }, [mapLoaded, runCinematicSequence])

  const executeAction = (id: string) => {
    setActions((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "done" as const } : a))
    )
    if (id === "case") {
      setCaseId(
        `LS-2026-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
      )
    }
  }

  const allDone = actions.length > 0 && actions.every((a) => a.status === "done")

  return (
    <main className="fixed inset-0 bg-[#0d1117] text-white overflow-hidden">
      {/* Phase indicator - geometric symbols */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-black/70 backdrop-blur-md px-5 py-3 rounded-full border border-white/10">
        {[
          { s: "●", phases: ["intro", "map", "flying"] },
          { s: "▼", phases: ["contrast"] },
          { s: "▲", phases: ["questions"] },
          { s: "◼", phases: ["actions", "complete"] },
        ].map(({ s, phases }) => (
          <span
            key={s}
            className={`text-xl transition-all duration-500 ${
              phases.includes(phase) ? "scale-125" : "scale-100"
            }`}
            style={{
              color: phases.includes(phase)
                ? SYMBOL_COLORS[s]
                : "rgba(255,255,255,0.3)",
              textShadow: phases.includes(phase)
                ? `0 0 20px ${SYMBOL_COLORS[s]}`
                : "none",
            }}
          >
            {s}
          </span>
        ))}
      </div>

      {/* Map container - full screen satellite view */}
      {(phase === "intro" || phase === "map" || phase === "flying") && (
        <div className="absolute inset-0">
          {/* Leaflet Map */}
          <div ref={mapContainerRef} className="absolute inset-0 z-0" />

          {/* Overlay gradient for cinematic feel */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/30 via-transparent to-black/50 z-10" />

          {/* Custom markers overlay */}
          <div className="absolute inset-0 pointer-events-none z-20">
            {events.map((event, idx) => (
              <div
                key={event.id}
                className={`absolute transition-all duration-700 ${
                  idx <= activeEventIndex
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-50"
                }`}
                style={{
                  left: "50%",
                  top: "40%",
                  transform: "translate(-50%, -50%)",
                  display: idx === activeEventIndex ? "block" : "none",
                }}
              >
                {/* Animated pulse */}
                <div
                  className="absolute -inset-8 rounded-full animate-ping"
                  style={{ backgroundColor: `${event.pinColor}30` }}
                />

                {/* Symbol marker */}
                <div
                  className="relative w-16 h-16 rounded-full flex items-center justify-center text-3xl font-bold shadow-2xl border-2 border-white"
                  style={{
                    backgroundColor: event.pinColor,
                    boxShadow: `0 0 40px ${event.pinColor}80`,
                  }}
                >
                  {event.symbol}
                </div>
              </div>
            ))}
          </div>

          {/* Event info card */}
          {showCard && activeEventIndex >= 0 && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 w-full max-w-md px-4 animate-in slide-in-from-bottom-8 fade-in duration-500">
              <div
                className="bg-black/80 backdrop-blur-xl rounded-2xl p-6 border shadow-2xl"
                style={{ borderColor: events[activeEventIndex].pinColor }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold shrink-0"
                    style={{
                      backgroundColor: events[activeEventIndex].pinColor,
                    }}
                  >
                    {events[activeEventIndex].symbol}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white/50 font-mono mb-1">
                      {events[activeEventIndex].time}
                    </p>
                    <h3
                      className="font-bold text-xl mb-1"
                      style={{ color: events[activeEventIndex].pinColor }}
                    >
                      {events[activeEventIndex].title}
                    </h3>
                    <p className="text-sm text-white/60 mb-3">
                      {events[activeEventIndex].address}
                    </p>
                    <p className="text-white/90 leading-relaxed">
                      {events[activeEventIndex].detail}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Flying indicator */}
          {phase === "flying" && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
              <div
                className="w-4 h-4 bg-white rounded-full animate-pulse shadow-lg"
                style={{ boxShadow: "0 0 20px white, 0 0 40px white" }}
              />
            </div>
          )}
        </div>
      )}

      {/* Contrast Phase - Split screen comparison */}
      {phase === "contrast" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 overflow-y-auto">
          <div className="text-center mb-8">
            <span
              className="text-4xl"
              style={{ color: SYMBOL_COLORS["▼"] }}
            >
              ▼
            </span>
            <p className="text-white/40 text-sm tracking-widest mt-2">
              COMPARE
            </p>
          </div>

          <div className="w-full max-w-4xl space-y-4">
            {contrasts.map((c, idx) => (
              <div
                key={idx}
                className={`grid md:grid-cols-2 gap-3 transition-all duration-700 ${
                  idx <= activeContrastIndex
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
              >
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 backdrop-blur">
                  <p className="text-[10px] text-red-400 tracking-widest mb-2">
                    THEY SAID
                  </p>
                  <p className="text-white/90 text-sm leading-relaxed">
                    &quot;{c.theySaid}&quot;
                  </p>
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 backdrop-blur">
                  <p className="text-[10px] text-emerald-400 tracking-widest mb-2">
                    REALITY
                  </p>
                  <p className="text-white/90 text-sm leading-relaxed">
                    {c.reality}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Questions Phase - Centered, one at a time */}
      {phase === "questions" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
          <span
            className="text-4xl mb-8"
            style={{ color: SYMBOL_COLORS["▲"] }}
          >
            ▲
          </span>

          <div className="max-w-2xl text-center space-y-6">
            {questions.map((q, idx) => (
              <p
                key={idx}
                className={`text-xl md:text-2xl leading-relaxed transition-all duration-700 ${
                  idx <= activeQuestionIndex
                    ? "opacity-100 translate-y-0 text-white"
                    : "opacity-0 translate-y-4"
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
            <span
              className="text-4xl"
              style={{ color: SYMBOL_COLORS["◼"] }}
            >
              ◼
            </span>
            <p className="text-white/40 text-sm tracking-widest mt-2">
              PATHS FORWARD
            </p>
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
                <span
                  className="text-3xl block mb-2"
                  style={{ color: SYMBOL_COLORS[action.icon] }}
                >
                  {action.icon}
                </span>
                <span className="font-medium">{action.label}</span>
                {action.status === "done" && (
                  <span className="absolute top-2 right-2 text-emerald-400 text-lg">
                    ✓
                  </span>
                )}
              </button>
            ))}
          </div>

          {allDone && (
            <button
              onClick={() =>
                router.push(`/result?caseId=${caseId || "preview"}`)
              }
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
