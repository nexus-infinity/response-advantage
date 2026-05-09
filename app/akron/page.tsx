"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { AlertTriangle, CheckCircle2, Clock, FileText, Link2, Hash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { 
  IntakePacket, 
  createIntakePacket, 
  VERTICES,
  Vertex 
} from "@/lib/types/intake-packet"

// Demo packets for display
const DEMO_PACKETS: IntakePacket[] = [
  {
    ...createIntakePacket("case-001"),
    ref: "FIELD-AGED-20260410-001",
    observed: "Email received from facility manager contradicting previous verbal assurances about care standards.",
    vertex: "●",
    hold: true,
    hold_reasons: ["No anchors attached", "Triangle: Documentation status missing"],
    triangle_check: { fact: "complete", doc: "missing", ledger: "missing" },
  },
  {
    ...createIntakePacket("case-002"),
    ref: "FIELD-FOI-20260408-003",
    observed: "FOI request submitted 45 days ago, no response received despite statutory 30-day requirement.",
    vertex: "▼",
    hold: true,
    hold_reasons: ["Triangle: Ledger/receipt status missing"],
    triangle_check: { fact: "complete", doc: "complete", ledger: "missing" },
    anchors: [
      { id: "a1", type: "timestamp", value: "2026-02-23T09:15:00Z", verified: true, created_at: "2026-02-23T09:15:00Z" },
      { id: "a2", type: "message_id", value: "FOI-2026-0234", verified: true, created_at: "2026-02-23T09:15:00Z" },
    ],
  },
]

export default function AkronPage() {
  const [packets, setPackets] = useState<IntakePacket[]>(DEMO_PACKETS)
  const [selectedPacket, setSelectedPacket] = useState<IntakePacket | null>(null)

  const getVertexColor = (vertex: Vertex) => VERTICES[vertex].color

  const getTriangleStatusIcon = (status: "missing" | "partial" | "complete") => {
    switch (status) {
      case "complete": return <CheckCircle2 className="w-4 h-4 text-green-500" />
      case "partial": return <Clock className="w-4 h-4 text-yellow-500" />
      case "missing": return <AlertTriangle className="w-4 h-4 text-red-400" />
    }
  }

  const getAnchorIcon = (type: string) => {
    switch (type) {
      case "url": return <Link2 className="w-3 h-3" />
      case "file": return <FileText className="w-3 h-3" />
      case "hash": return <Hash className="w-3 h-3" />
      default: return <Clock className="w-3 h-3" />
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground p-8">
      {/* Header - Apple-inspired */}
      <header className="mb-10">
        <div className="flex items-center gap-4 mb-3">
          <span className="text-2xl" style={{ color: VERTICES["♦︎"].color }}>♦︎</span>
          <h1 className="text-2xl font-semibold tracking-tight">AKRON</h1>
        </div>
        <p className="text-muted-foreground text-sm max-w-md">
          Fail-closed intake zone. Items require validation before proceeding.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* HOLD Queue */}
        <div className="lg:col-span-2 space-y-3">
          <h2 className="text-xs font-medium text-muted-foreground tracking-wider uppercase mb-4">
            Hold Queue ({packets.filter(p => p.hold).length})
          </h2>

          {packets.filter(p => p.hold).map((packet) => (
            <div
              key={packet.case_id}
              onClick={() => setSelectedPacket(packet)}
              className={cn(
                "p-5 rounded-2xl cursor-pointer transition-smooth",
                selectedPacket?.case_id === packet.case_id
                  ? "bg-accent shadow-soft"
                  : "bg-accent/50 hover:bg-accent"
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span 
                    className="text-base"
                    style={{ color: getVertexColor(packet.vertex) }}
                  >
                    {packet.vertex}
                  </span>
                  <span className="text-xs font-mono text-muted-foreground">{packet.ref}</span>
                </div>
                <span className="text-[10px] tracking-wide uppercase px-2 py-1 rounded-lg bg-destructive/10 text-destructive font-medium">
                  Hold
                </span>
              </div>

              <p className="text-sm text-foreground/80 mb-4 line-clamp-2 leading-relaxed">
                {packet.observed}
              </p>

              {/* Triangle status */}
              <div className="flex items-center gap-6 mb-4">
                <div className="flex items-center gap-1.5">
                  {getTriangleStatusIcon(packet.triangle_check.fact)}
                  <span className="text-[10px] text-muted-foreground">Fact</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {getTriangleStatusIcon(packet.triangle_check.doc)}
                  <span className="text-[10px] text-muted-foreground">Doc</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {getTriangleStatusIcon(packet.triangle_check.ledger)}
                  <span className="text-[10px] text-muted-foreground">Ledger</span>
                </div>
              </div>

              {/* Missing pins */}
              <div className="space-y-1.5">
                {packet.hold_reasons.map((reason, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-destructive/80">
                    <AlertTriangle className="w-3 h-3" />
                    <span>{reason}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {packets.filter(p => p.hold).length === 0 && (
            <div className="p-10 rounded-2xl bg-accent/50 text-center">
              <CheckCircle2 className="w-10 h-10 text-green-500/50 mx-auto mb-4" />
              <p className="text-foreground/60 font-medium">No items in HOLD</p>
              <p className="text-xs text-muted-foreground mt-1">All packets validated</p>
            </div>
          )}
        </div>

        {/* Detail Panel */}
        <div className="lg:col-span-1">
          {selectedPacket ? (
            <div className="sticky top-8 p-5 rounded-2xl bg-accent/50">
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-5">Details</h3>
              
              <div className="space-y-5">
                <div>
                  <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Reference</label>
                  <p className="text-sm font-mono mt-1">{selectedPacket.ref}</p>
                </div>

                <div>
                  <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Current Vertex</label>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span style={{ color: getVertexColor(selectedPacket.vertex) }}>
                      {selectedPacket.vertex}
                    </span>
                    <span className="text-sm font-medium">{VERTICES[selectedPacket.vertex].label}</span>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Observation</label>
                  <p className="text-sm text-foreground/70 mt-1.5 leading-relaxed">{selectedPacket.observed}</p>
                </div>

                <div>
                  <label className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    Anchors ({selectedPacket.anchors.length})
                  </label>
                  {selectedPacket.anchors.length > 0 ? (
                    <div className="mt-2 space-y-2">
                      {selectedPacket.anchors.map((anchor) => (
                        <div 
                          key={anchor.id}
                          className="flex items-center gap-2 text-xs text-muted-foreground p-3 rounded-xl bg-background/50"
                        >
                          {getAnchorIcon(anchor.type)}
                          <span className="font-mono truncate">{anchor.value}</span>
                          {anchor.verified && (
                            <CheckCircle2 className="w-3 h-3 text-green-500 ml-auto" />
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-destructive/80 mt-1.5">No anchors attached</p>
                  )}
                </div>

                <div>
                  <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Missing Pins</label>
                  <div className="mt-2 space-y-1.5">
                    {selectedPacket.hold_reasons.map((reason, i) => (
                      <div key={i} className="text-xs text-destructive/80 p-3 rounded-xl bg-destructive/5">
                        {reason}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-5">
                  <Button 
                    className="w-full rounded-xl"
                    onClick={() => {
                      window.location.href = VERTICES[selectedPacket.vertex].route
                    }}
                  >
                    Resolve at {VERTICES[selectedPacket.vertex].label}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="sticky top-8 p-10 rounded-2xl bg-accent/30 text-center">
              <p className="text-muted-foreground text-sm">Select a packet to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-12 p-5 rounded-2xl bg-accent/30">
        <h3 className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-4">Triangle Validation</h3>
        <div className="flex flex-wrap gap-8 text-xs">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl flex items-center justify-center bg-background/50 font-medium text-foreground/60">F</span>
            <span className="text-muted-foreground">Fact - What happened</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl flex items-center justify-center bg-background/50 font-medium text-foreground/60">D</span>
            <span className="text-muted-foreground">Doc - Supporting evidence</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl flex items-center justify-center bg-background/50 font-medium text-foreground/60">L</span>
            <span className="text-muted-foreground">Ledger - Audit trail</span>
          </div>
        </div>
      </div>
    </main>
  )
}
