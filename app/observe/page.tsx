"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Camera, Mic, FileText, Upload, MapPin } from "lucide-react"
import { SymbolSpinner } from "@/components/logo-symbols"
import { useRouter } from "next/navigation"
import { getMapsApiKey, reverseGeocode } from "@/app/actions/maps"

interface Location {
  lat: number
  lng: number
  address?: string
}

export default function ObservePage() {
  const router = useRouter()
  const [mode, setMode] = useState<"text" | "photo" | "voice" | null>(null)
  const [observation, setObservation] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [location, setLocation] = useState<Location | null>(null)
  const [locationLoading, setLocationLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [mapsApiKey, setMapsApiKey] = useState("")

  useEffect(() => {
    getMapsApiKey().then(setMapsApiKey)
    captureLocation()
  }, [])

  const captureLocation = async () => {
    setLocationLoading(true)
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          const loc: Location = {
            lat: latitude,
            lng: longitude,
          }

          const address = await reverseGeocode(latitude, longitude)
          if (address) {
            loc.address = address
          }

          setLocation(loc)
          setLocationLoading(false)
        },
        (error) => {
          console.log("[v0] Location error:", error)
          setLocationLoading(false)
        },
      )
    } else {
      setLocationLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!observation.trim()) return

    setIsProcessing(true)

    const data = {
      observation,
      location,
      timestamp: new Date().toISOString(),
    }
    sessionStorage.setItem("initialObservation", JSON.stringify(data))

    setTimeout(() => {
      router.push("/tool")
    }, 1500)
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setMode("photo")
      setObservation(`[Photo uploaded: ${file.name}]\n\nDescribe what this shows...`)
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12 geometric-grid">
      <div className="w-full max-w-[640px] space-y-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-full border-2 flex items-center justify-center">
              <span className="text-5xl" style={{ color: "var(--evidence)" }}>
                ●
              </span>
            </div>
          </div>
          <h1 className="text-3xl font-bold">Document Your Observation</h1>
          <p className="text-muted-foreground leading-relaxed">
            Start with what happened. Take a photo, record your voice, or just write it down.
          </p>
        </div>

        <div className="border rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" style={{ color: "var(--evidence)" }} />
              <span className="font-medium text-sm">Location</span>
            </div>
            {locationLoading ? (
              <span className="text-xs text-muted-foreground">Detecting...</span>
            ) : location ? (
              <span className="text-xs text-muted-foreground">Captured</span>
            ) : (
              <Button variant="ghost" size="sm" onClick={captureLocation} className="text-xs">
                Enable
              </Button>
            )}
          </div>
          {location && (
            <>
              {location.address && <p className="text-sm text-muted-foreground">{location.address}</p>}
              {mapsApiKey && (
                <div className="w-full h-32 bg-card rounded overflow-hidden border">
                  <img
                    src={`https://maps.googleapis.com/maps/api/staticmap?center=${location.lat},${location.lng}&zoom=15&size=600x300&markers=color:red%7C${location.lat},${location.lng}&key=${mapsApiKey}`}
                    alt="Location map"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </>
          )}
          {!location && !locationLoading && (
            <p className="text-xs text-muted-foreground">
              Location helps establish context. Tap "Enable" to capture where you are.
            </p>
          )}
        </div>

        {!mode && (
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => setMode("photo")}
              className="flex flex-col items-center gap-3 p-6 rounded-lg border hover:border-foreground hover:bg-card transition-all group"
            >
              <Camera className="h-8 w-8 text-muted-foreground group-hover:text-foreground" />
              <span className="text-sm font-medium">Photo</span>
            </button>
            <button
              onClick={() => setMode("voice")}
              className="flex flex-col items-center gap-3 p-6 rounded-lg border hover:border-foreground hover:bg-card transition-all group"
            >
              <Mic className="h-8 w-8 text-muted-foreground group-hover:text-foreground" />
              <span className="text-sm font-medium">Voice</span>
            </button>
            <button
              onClick={() => setMode("text")}
              className="flex flex-col items-center gap-3 p-6 rounded-lg border hover:border-foreground hover:bg-card transition-all group"
            >
              <FileText className="h-8 w-8 text-muted-foreground group-hover:text-foreground" />
              <span className="text-sm font-medium">Text</span>
            </button>
          </div>
        )}

        {mode === "text" && (
          <div className="space-y-4">
            <Textarea
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              placeholder="What happened? When did it happen? Who was involved? Include any details you remember..."
              className="min-h-[300px]"
              autoFocus
            />
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setMode(null)} className="flex-1">
                Change Method
              </Button>
              <Button onClick={handleSubmit} disabled={isProcessing || !observation.trim()} className="flex-1">
                {isProcessing ? <SymbolSpinner size="sm" /> : "Continue"}
              </Button>
            </div>
          </div>
        )}

        {mode === "photo" && (
          <div className="space-y-4">
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-64 border-2 border-dashed border-border rounded-lg hover:border-[var(--evidence)] hover:bg-card/50 transition-all flex flex-col items-center justify-center gap-4 stone-edge group"
            >
              <Upload className="h-12 w-12 text-muted-foreground group-hover:text-[var(--evidence)]" />
              <p className="text-sm text-muted-foreground">Click to upload photo or document</p>
            </button>
            <Textarea
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              placeholder="Add context about this photo..."
              className="min-h-[150px] stone-edge"
            />
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setMode(null)} className="flex-1">
                Change Method
              </Button>
              <Button onClick={handleSubmit} disabled={isProcessing || !observation.trim()} className="flex-1">
                {isProcessing ? <SymbolSpinner size="sm" /> : "Continue"}
              </Button>
            </div>
          </div>
        )}

        {mode === "voice" && (
          <div className="space-y-4">
            <div className="w-full h-64 border-2 border-border rounded-lg bg-card/50 flex flex-col items-center justify-center gap-4 stone-edge">
              <div className="w-20 h-20 rounded-full bg-[var(--evidence)]/10 border-2 border-[var(--evidence)] flex items-center justify-center animate-pulse">
                <Mic className="h-10 w-10 text-[var(--evidence)]" />
              </div>
              <p className="text-sm text-muted-foreground">Voice recording coming soon</p>
              <p className="text-xs text-muted-foreground">Use text mode for now</p>
            </div>
            <Button variant="outline" onClick={() => setMode("text")} className="w-full">
              Switch to Text
            </Button>
          </div>
        )}
      </div>
    </main>
  )
}
