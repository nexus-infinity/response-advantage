/**
 * Akron Hold Error Boundary
 * 
 * Catches AkronHoldException and routes to /akron with reason
 * This is the fail-closed handler
 */

"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { AlertTriangle } from "lucide-react"
import { AkronHoldException } from "@/lib/types/cryptographic-system"

interface AkronErrorBoundaryProps {
  error: Error & { digest?: string }
  reset: () => void
}

export function AkronErrorBoundary({ error, reset }: AkronErrorBoundaryProps) {
  const router = useRouter()
  const isAkronHold = error instanceof AkronHoldException || error.message.includes("AKRON HOLD")

  useEffect(() => {
    // Log the error for debugging
    console.error("[v0] System exception:", error)
  }, [error])

  if (!isAkronHold) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <AlertTriangle className="w-12 h-12 text-destructive/60 mx-auto mb-4" />
          <h1 className="text-lg font-semibold mb-2">System Error</h1>
          <p className="text-muted-foreground text-sm mb-6">{error.message}</p>
          <button
            onClick={reset}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-smooth"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  // AKRON HOLD - fail-closed behavior
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="max-w-2xl mx-auto px-8 py-16">
        <div className="p-8 rounded-2xl bg-destructive/5 border border-destructive/20">
          <div className="flex items-start gap-4 mb-6">
            <AlertTriangle className="w-6 h-6 text-destructive flex-shrink-0 mt-1" />
            <div>
              <h1 className="text-lg font-semibold text-destructive mb-2">System Hold</h1>
              <p className="text-sm text-foreground/80">
                Your case has been placed in HOLD status. Required validation is missing.
              </p>
            </div>
          </div>

          <div className="space-y-2 mb-6">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
              Hold Reasons
            </p>
            {error.message.split(":")[1]?.split(",").map((reason, i) => (
              <div
                key={i}
                className="text-sm text-foreground/70 p-3 rounded-lg bg-destructive/5 border border-destructive/10"
              >
                {reason.trim()}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 p-4 rounded-lg bg-accent/50 mb-6">
            <span className="text-2xl">♦︎</span>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Next Step</p>
              <p className="text-sm text-foreground">Return to AKRON to resolve hold reasons</p>
            </div>
          </div>

          <button
            onClick={() => router.push("/akron")}
            className="w-full px-4 py-3 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-smooth font-medium"
          >
            Go to AKRON Hold Queue
          </button>
        </div>
      </main>
    </div>
  )
}

export default AkronErrorBoundary
