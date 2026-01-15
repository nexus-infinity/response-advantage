"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

interface LocationMapProps {
  locations: Array<{
    lat: number
    lng: number
    address: string
    label: string
    timestamp?: string
  }>
  className?: string
}

// API key is now only used server-side via the API route
export default function LocationMap({ locations, className = "" }: LocationMapProps) {
  const [mapUrl, setMapUrl] = useState<string>("")
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    if (locations.length === 0) return

    const fetchMapUrl = async () => {
      try {
        const response = await fetch("/api/static-map", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ locations }),
        })

        if (!response.ok) throw new Error("Failed to generate map")

        const data = await response.json()
        setMapUrl(data.mapUrl)
      } catch (err) {
        console.error("[v0] Map generation error:", err)
        setError("Map unavailable")
      }
    }

    fetchMapUrl()
  }, [locations])

  if (error || locations.length === 0) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-muted/20 border border-border/50 rounded-lg p-8 ${className}`}
      >
        <span className="text-4xl mb-3 opacity-30">◎</span>
        <p className="text-sm text-muted-foreground">{error || "No locations recorded"}</p>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {/* Static map image from server */}
      <div className="relative w-full h-full rounded-lg overflow-hidden bg-muted/20 border border-border/50">
        {mapUrl ? (
          <Image src={mapUrl || "/placeholder.svg"} alt="Location map" fill className="object-cover" unoptimized />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-pulse text-2xl opacity-30">◎</div>
          </div>
        )}

        {/* Location markers overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Visual indicator that locations exist */}
          <div className="absolute top-3 left-3 flex gap-1">
            {locations.map((_, idx) => (
              <div
                key={idx}
                className="w-6 h-6 rounded-full border-2 border-background flex items-center justify-center text-xs font-bold shadow-md pointer-events-auto cursor-pointer transition-transform hover:scale-110"
                style={{ background: "var(--foreground)", color: "var(--background)" }}
                onClick={() => setSelectedLocation(selectedLocation === idx ? null : idx)}
              >
                {idx + 1}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Location details panel */}
      {selectedLocation !== null && (
        <div className="absolute bottom-3 left-3 right-3 bg-background/95 backdrop-blur border border-border rounded-lg p-3 shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <div className="font-bold text-sm">{locations[selectedLocation].label}</div>
              <div className="text-xs text-muted-foreground mt-1">{locations[selectedLocation].address}</div>
              {locations[selectedLocation].timestamp && (
                <div className="text-xs text-muted-foreground/70 mt-1 font-mono">
                  {locations[selectedLocation].timestamp}
                </div>
              )}
            </div>
            <button
              onClick={() => setSelectedLocation(null)}
              className="text-muted-foreground hover:text-foreground text-lg leading-none"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
