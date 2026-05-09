/**
 * ◼︎ DOJO - Output Generation
 * 
 * HARD-GATED by GROUND_PASS
 * This page CANNOT be reached if:
 * - Triangle validation incomplete
 * - No anchors attached
 * - No recommendation present
 * 
 * This is not a UI check. It's an enforced exception.
 */

import { GroundGate, AkronHoldException } from "@/lib/types/cryptographic-system"
import { IntakePacket } from "@/lib/types/intake-packet"

// Mock: In production, fetch from session/database
async function getIntakePacket(): Promise<IntakePacket | null> {
  // TODO: Implement proper packet retrieval from session
  return null
}

export const metadata = {
  title: "DOJO — Output Generation",
  description: "Generate and send actionable outputs",
}

export default async function ActPage() {
  // Fetch the current packet
  const packet = await getIntakePacket()

  if (!packet) {
    // Redirect handled in middleware
    return null
  }

  // ENFORCE the gate - this is not optional
  const gate = new GroundGate(packet)

  if (!gate.isOpen) {
    // Throw exception - page is completely unreachable
    const failures = []
    
    if (packet.triangle_check.fact === "pending") failures.push("TRIANGLE_INCOMPLETE")
    if (packet.triangle_check.doc === "pending") failures.push("MISSING_ANCHOR")
    if (packet.triangle_check.ledger === "pending") failures.push("CLAIM_UNSUPPORTED")
    if (packet.anchors.length === 0) failures.push("MISSING_ANCHOR")
    if (!packet.recommendation) failures.push("CLAIM_UNSUPPORTED")

    throw new AkronHoldException(failures.length > 0 ? failures : ["TRIANGLE_INCOMPLETE"])
  }

  // Gate is open - render ACT
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6 border-b border-border">
        <div className="flex items-center gap-4">
          <span className="text-xl" style={{ color: "#4A6FA5" }}>◼︎</span>
          <div>
            <h1 className="text-lg font-semibold tracking-tight">DOJO</h1>
            <p className="text-xs text-muted-foreground">Output generation and execution</p>
          </div>
        </div>
        <span className="text-xs px-3 py-1.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 font-medium tracking-wide">
          GATE OPEN
        </span>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-8 py-10 space-y-8">
        
        {/* Recommendation */}
        <div className="p-6 rounded-2xl bg-accent/50 border border-border">
          <h2 className="text-xs font-medium text-muted-foreground tracking-wider uppercase mb-4">
            Recommendation
          </h2>
          <p className="text-foreground leading-relaxed text-sm">
            {packet.recommendation}
          </p>
        </div>

        {/* Action Templates */}
        <div>
          <h2 className="text-xs font-medium text-muted-foreground tracking-wider uppercase mb-4">
            Ready Actions
          </h2>
          <div className="space-y-3">
            <div className="p-5 rounded-xl bg-accent/50 hover:bg-accent transition-smooth cursor-pointer">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">FOI Request</p>
                  <p className="text-xs text-muted-foreground mt-1">Pursuant to the Freedom of Information Act...</p>
                </div>
                <button className="px-3 py-1.5 text-xs rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-smooth">
                  Send
                </button>
              </div>
            </div>
            <div className="p-5 rounded-xl bg-accent/50 hover:bg-accent transition-smooth cursor-pointer">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Formal Response</p>
                  <p className="text-xs text-muted-foreground mt-1">Dear Sir/Madam, I write in response...</p>
                </div>
                <button className="px-3 py-1.5 text-xs rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-smooth">
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Case Summary */}
        <div className="p-6 rounded-2xl bg-accent/50 border border-border">
          <h2 className="text-xs font-medium text-muted-foreground tracking-wider uppercase mb-4">
            Case Summary
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground text-xs">Evidence</p>
              <p className="text-foreground font-medium mt-1">{packet.anchors.length} items</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Stage</p>
              <p className="text-foreground font-medium mt-1">{packet.vertex}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Reference</p>
              <p className="text-foreground font-medium mt-1 font-mono text-xs">{packet.ref}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Status</p>
              <p className="text-foreground font-medium mt-1">Ready to Act</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
