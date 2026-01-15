"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import dynamic from "next/dynamic"

const LocationMap = dynamic(() => import("@/components/location-map"), { ssr: false })

interface ResultData {
  caseId: string
  letter: string
  observation: {
    dates: string[]
    events: string[]
    locations?: Array<{ lat: number; lng: number; address: string; label: string }>
  }
  lawBreach: { law: string; violation: string }
  pattern: { id: string; name: string; confidence: number }
  deadline: string
}

export default function ResultPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const caseId = searchParams.get("caseId")

  const [data, setData] = useState<ResultData | null>(null)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    if (!caseId) {
      router.push("/")
      return
    }

    fetch(`/api/result/${caseId}`)
      .then((res) => res.json())
      .then(setData)
  }, [caseId, router])

  if (!data) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading result...</div>
      </main>
    )
  }

  const handleApprove = async () => {
    setSending(true)
    await fetch("/api/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ caseId: data.caseId, userEmail: "user@example.com" }),
    })
    router.push(`/case/${data.caseId}`)
  }

  return (
    <main className="min-h-screen px-4 py-12">
      <div className="max-w-[1200px] mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center">Review & Approve</h1>

        {/* LEFT: Email Draft */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Email to Authority</h2>
          <div className="border rounded-lg p-4 bg-muted/30">
            <pre className="text-sm font-mono whitespace-pre-wrap leading-relaxed">{data.letter}</pre>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 text-sm bg-muted rounded hover:opacity-80">Copy</button>
            <button className="px-4 py-2 text-sm bg-muted rounded hover:opacity-80">Download .txt</button>
          </div>
        </div>

        {/* MIDDLE: Case Page Preview */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Your Public Case Page</h2>
          <div className="border rounded-lg p-4 space-y-2">
            <p className="text-sm text-muted-foreground">Preview of your case page:</p>
            <Link
              href={`/case/${data.caseId}`}
              target="_blank"
              className="text-sm text-foreground underline hover:no-underline"
            >
              Open in new tab →
            </Link>
            <p className="text-xs text-muted-foreground pt-2">
              This page will be public and update automatically when they respond.
            </p>
          </div>
        </div>

        {/* RIGHT: Breakdown Summary */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Breakdown Summary</h2>
          <div className="space-y-4 text-sm">
            <div className="flex gap-2">
              <span style={{ color: "var(--evidence)" }}>●</span>
              <div>
                <strong>Observation:</strong>
                <ul className="list-disc list-inside mt-1">
                  {data.observation.events.slice(0, 3).map((event, i) => (
                    <li key={i}>{event}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex gap-2">
              <span style={{ color: "var(--law)" }}>▼</span>
              <div>
                <strong>Law Breach:</strong>
                <p className="mt-1">
                  {data.lawBreach.law} — {data.lawBreach.violation}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <span style={{ color: "var(--pattern)" }}>▲</span>
              <div>
                <strong>Pattern:</strong>
                <p className="mt-1">
                  #{data.pattern.id}, {Math.round(data.pattern.confidence * 100)}% confidence
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <span style={{ color: "var(--action)" }}>■</span>
              <div>
                <strong>Timeline:</strong>
                <p className="mt-1">Sent today → Deadline {data.deadline}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Location Map */}
        {data.observation.locations && data.observation.locations.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Location Map</h2>
            <LocationMap locations={data.observation.locations} className="h-[400px]" />
          </div>
        )}

        <div className="flex items-center justify-center gap-4 pt-8 border-t border-border">
          <button
            onClick={handleApprove}
            disabled={sending}
            className="px-8 py-3 bg-foreground text-background rounded-lg font-medium hover:opacity-90 disabled:opacity-50"
          >
            {sending ? "Sending..." : "Approve & Send"}
          </button>
          <button className="px-8 py-3 bg-muted text-foreground rounded-lg font-medium hover:opacity-80">
            Edit First
          </button>
        </div>

        <p className="text-center text-sm text-muted-foreground">Case ID: {data.caseId}</p>
      </div>
    </main>
  )
}
