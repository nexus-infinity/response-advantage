"use client"

import type React from "react"
import { useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Upload, Camera } from "lucide-react"

export default function StartPage() {
  const router = useRouter()
  const [isDragging, setIsDragging] = useState(false)
  const [text, setText] = useState("")
  const [uploading, setUploading] = useState(false)
  const [location, setLocation] = useState<{ lat: number; lng: number; address: string } | null>(null)
  const [loadingLocation, setLoadingLocation] = useState(true)

  useEffect(() => {
    const captureLocation = async () => {
      if (!navigator.geolocation) {
        setLoadingLocation(false)
        return
      }

      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 5000,
          })
        })

        const { latitude: lat, longitude: lng } = position.coords

        const response = await fetch("/api/geocode", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lat, lng }),
        })

        const { address } = await response.json()
        setLocation({ lat, lng, address })
      } catch (err) {
        console.error("[v0] Location capture error:", err)
      } finally {
        setLoadingLocation(false)
      }
    }

    captureLocation()
  }, [])

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      setUploading(true)

      const files = Array.from(e.dataTransfer.files)
      const formData = new FormData()
      files.forEach((file) => formData.append("files", file))
      if (location) {
        formData.append("location", JSON.stringify(location))
      }

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const { processingId } = await response.json()
      router.push(`/processing?id=${processingId}`)
    },
    [router, location],
  )

  const handleTextSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!text.trim()) return

      setUploading(true)

      const response = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, location }),
      })

      const { processingId } = await response.json()
      router.push(`/processing?id=${processingId}`)
    },
    [text, router, location],
  )

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    const formData = new FormData()
    Array.from(files).forEach((file) => formData.append("files", file))
    if (location) {
      formData.append("location", JSON.stringify(location))
    }

    const response = await fetch("/api/upload", { method: "POST", body: formData })
    const { processingId } = await response.json()
    router.push(`/processing?id=${processingId}`)
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-8 md:py-4">
      <div className="w-full max-w-full md:max-w-[800px] space-y-8 md:space-y-12">
        {loadingLocation && <div className="text-center text-sm text-muted-foreground">Capturing your location...</div>}
        {location && (
          <div className="border rounded-lg p-3 md:p-4 bg-muted/20 text-sm">
            <p className="font-medium">Location captured:</p>
            <p className="text-muted-foreground text-xs md:text-sm">{location.address}</p>
          </div>
        )}

        <div className="text-center space-y-3 md:space-y-4">
          <h1 className="text-2xl md:text-4xl font-bold">Drop your evidence</h1>
          <p className="text-muted-foreground text-base md:text-lg">
            Upload documents, screenshots, emails — or paste text directly below.
          </p>
        </div>

        <div
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-xl p-6 md:p-12 transition-all ${
            isDragging ? "border-foreground bg-muted/50 scale-[1.02]" : "border-border hover:border-muted-foreground"
          }`}
        >
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-muted flex items-center justify-center">
              <Upload className="w-6 h-6 md:w-8 md:h-8 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <p className="text-base md:text-lg font-medium">Drag and drop files here</p>
              <p className="text-xs md:text-sm text-muted-foreground">Accepts images, PDFs, emails, documents</p>
            </div>

            {/* Hidden file inputs */}
            <input
              type="file"
              multiple
              accept="image/*,.pdf,.eml,.msg,.txt"
              onChange={handleFileChange}
              className="hidden"
              id="file-input"
            />
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              className="hidden"
              id="camera-input"
            />

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <label
                htmlFor="file-input"
                className="px-4 py-2 bg-foreground text-background rounded-md cursor-pointer hover:opacity-90 transition-opacity text-center"
              >
                Browse files
              </label>
              <label
                htmlFor="camera-input"
                className="px-4 py-2 bg-muted text-foreground border border-border rounded-md cursor-pointer hover:bg-muted/80 transition-opacity flex items-center justify-center gap-2 sm:hidden"
              >
                <Camera className="w-4 h-4" />
                Take photo
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-center text-sm text-muted-foreground font-medium">OR</p>
          <form onSubmit={handleTextSubmit} className="space-y-4">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste email text or describe what happened here..."
              className="w-full h-36 md:h-48 px-3 md:px-4 py-3 rounded-lg border border-border bg-background font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-foreground"
            />
            <button
              type="submit"
              disabled={!text.trim() || uploading}
              className="w-full py-3 bg-foreground text-background rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              {uploading ? "Processing..." : "Process Evidence"}
            </button>
          </form>
        </div>

        <div className="flex items-center justify-center gap-4 md:gap-6 pt-6 md:pt-8 border-t border-border">
          <div className="flex flex-col items-center gap-1">
            <span className="text-xl md:text-2xl" style={{ color: "var(--evidence)" }}>
              ●
            </span>
            <span className="text-[10px] md:text-xs text-muted-foreground">Observation</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-xl md:text-2xl" style={{ color: "var(--law)" }}>
              ▼
            </span>
            <span className="text-[10px] md:text-xs text-muted-foreground">Law/Breach</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-xl md:text-2xl" style={{ color: "var(--pattern)" }}>
              ▲
            </span>
            <span className="text-[10px] md:text-xs text-muted-foreground">Pattern</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-xl md:text-2xl" style={{ color: "var(--action)" }}>
              ■
            </span>
            <span className="text-[10px] md:text-xs text-muted-foreground">Output</span>
          </div>
        </div>
      </div>
    </main>
  )
}
