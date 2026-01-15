"use client"

import type React from "react"
import { useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Upload } from "lucide-react"

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

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-[800px] space-y-12">
        {loadingLocation && <div className="text-center text-sm text-muted-foreground">Capturing your location...</div>}
        {location && (
          <div className="border rounded-lg p-4 bg-muted/20 text-sm">
            <p className="font-medium">Location captured:</p>
            <p className="text-muted-foreground">{location.address}</p>
          </div>
        )}

        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Drop your evidence</h1>
          <p className="text-muted-foreground text-lg">
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
          className={`relative border-2 border-dashed rounded-xl p-12 transition-all ${
            isDragging ? "border-foreground bg-muted/50 scale-[1.02]" : "border-border hover:border-muted-foreground"
          }`}
        >
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <Upload className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <p className="text-lg font-medium">Drag and drop files here</p>
              <p className="text-sm text-muted-foreground">Accepts images, PDFs, emails, documents</p>
            </div>
            <input
              type="file"
              multiple
              accept="image/*,.pdf,.eml,.msg,.txt"
              onChange={async (e) => {
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
              }}
              className="hidden"
              id="file-input"
            />
            <label
              htmlFor="file-input"
              className="px-4 py-2 bg-foreground text-background rounded-md cursor-pointer hover:opacity-90 transition-opacity"
            >
              Or click to browse
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-center text-sm text-muted-foreground font-medium">OR</p>
          <form onSubmit={handleTextSubmit} className="space-y-4">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste email text or describe what happened here..."
              className="w-full h-48 px-4 py-3 rounded-lg border border-border bg-background font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-foreground"
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

        <div className="flex items-center justify-center gap-6 pt-8 border-t border-border">
          <div className="flex flex-col items-center gap-1">
            <span className="text-2xl" style={{ color: "var(--evidence)" }}>
              ●
            </span>
            <span className="text-xs text-muted-foreground">Observation</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-2xl" style={{ color: "var(--law)" }}>
              ▼
            </span>
            <span className="text-xs text-muted-foreground">Law/Breach</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-2xl" style={{ color: "var(--pattern)" }}>
              ▲
            </span>
            <span className="text-xs text-muted-foreground">Pattern</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-2xl" style={{ color: "var(--action)" }}>
              ■
            </span>
            <span className="text-xs text-muted-foreground">Output</span>
          </div>
        </div>
      </div>
    </main>
  )
}
