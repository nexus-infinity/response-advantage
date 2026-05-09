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
    <main className="min-h-screen bg-[#0d1117] text-white p-8">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl" style={{ color: VERTICES["♦︎"].color }}>♦︎</span>
          <h1 className="text-2xl font-light tracking-wide">AKRON</h1>
        </div>
        <p className="text-white/50 text-sm">
          Fail-closed intake zone. Items here require validation before proceeding.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* HOLD Queue */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-medium text-white/70 tracking-wider mb-4">
            HOLD QUEUE ({packets.filter(p => p.hold).length})
          </h2>

          {packets.filter(p => p.hold).map((packet) => (
            <div
              key={packet.case_id}
              onClick={() => setSelectedPacket(packet)}
              className={cn(
                "p-4 rounded-xl border cursor-pointer transition-all",
                selectedPacket?.case_id === packet.case_id
                  ? "bg-white/10 border-white/20"
                  : "bg-white/5 border-white/10 hover:border-white/15"
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span 
                    className="text-lg"
                    style={{ color: getVertexColor(packet.vertex) }}
                  >
                    {packet.vertex}
                  </span>
                  <span className="text-xs font-mono text-white/40">{packet.ref}</span>
                </div>
                <span className="text-xs px-2 py-1 rounded bg-red-500/20 text-red-400">
                  HOLD
                </span>
              </div>

              <p className="text-sm text-white/70 mb-3 line-clamp-2">
                {packet.observed}
              </p>

              {/* Triangle status */}
              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center gap-1">
                  {getTriangleStatusIcon(packet.triangle_check.fact)}
                  <span className="text-[10px] text-white/40">Fact</span>
                </div>
                <div className="flex items-center gap-1">
                  {getTriangleStatusIcon(packet.triangle_check.doc)}
                  <span className="text-[10px] text-white/40">Doc</span>
                </div>
                <div className="flex items-center gap-1">
                  {getTriangleStatusIcon(packet.triangle_check.ledger)}
                  <span className="text-[10px] text-white/40">Ledger</span>
                </div>
              </div>

              {/* Missing pins */}
              <div className="space-y-1">
                {packet.hold_reasons.map((reason, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-red-400/80">
                    <AlertTriangle className="w-3 h-3" />
                    <span>{reason}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {packets.filter(p => p.hold).length === 0 && (
            <div className="p-8 rounded-xl border border-white/10 bg-white/5 text-center">
              <CheckCircle2 className="w-12 h-12 text-green-500/50 mx-auto mb-4" />
              <p className="text-white/50">No items in HOLD</p>
              <p className="text-xs text-white/30 mt-1">All packets have been validated</p>
            </div>
          )}
        </div>

        {/* Detail Panel */}
        <div className="lg:col-span-1">
          {selectedPacket ? (
            <div className="sticky top-8 p-4 rounded-xl border border-white/10 bg-white/5">
              <h3 className="text-sm font-medium text-white/70 mb-4">Packet Details</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] text-white/40 uppercase tracking-wider">Reference</label>
                  <p className="text-sm font-mono">{selectedPacket.ref}</p>
                </div>

                <div>
                  <label className="text-[10px] text-white/40 uppercase tracking-wider">Current Vertex</label>
                  <div className="flex items-center gap-2 mt-1">
                    <span style={{ color: getVertexColor(selectedPacket.vertex) }}>
                      {selectedPacket.vertex}
                    </span>
                    <span className="text-sm">{VERTICES[selectedPacket.vertex].label}</span>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-white/40 uppercase tracking-wider">Observation</label>
                  <p className="text-sm text-white/70 mt-1">{selectedPacket.observed}</p>
                </div>

                <div>
                  <label className="text-[10px] text-white/40 uppercase tracking-wider">
                    Anchors ({selectedPacket.anchors.length})
                  </label>
                  {selectedPacket.anchors.length > 0 ? (
                    <div className="mt-2 space-y-2">
                      {selectedPacket.anchors.map((anchor) => (
                        <div 
                          key={anchor.id}
                          className="flex items-center gap-2 text-xs text-white/60 p-2 rounded bg-white/5"
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
                    <p className="text-xs text-red-400/80 mt-1">No anchors attached</p>
                  )}
                </div>

                <div>
                  <label className="text-[10px] text-white/40 uppercase tracking-wider">Missing Pins</label>
                  <div className="mt-2 space-y-1">
                    {selectedPacket.hold_reasons.map((reason, i) => (
                      <div key={i} className="text-xs text-red-400/80 p-2 rounded bg-red-500/10">
                        {reason}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <Button 
                    className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20"
                    onClick={() => {
                      // Navigate to the appropriate vertex to resolve
                      window.location.href = VERTICES[selectedPacket.vertex].route
                    }}
                  >
                    Resolve at {VERTICES[selectedPacket.vertex].label}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="sticky top-8 p-8 rounded-xl border border-white/10 bg-white/5 text-center">
              <p className="text-white/40 text-sm">Select a packet to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-12 p-4 rounded-xl border border-white/10 bg-white/5">
        <h3 className="text-xs font-medium text-white/50 mb-3">TRIANGLE VALIDATION</h3>
        <div className="flex flex-wrap gap-6 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded flex items-center justify-center bg-white/5">F</span>
            <span className="text-white/60">Fact - What happened (observation)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded flex items-center justify-center bg-white/5">D</span>
            <span className="text-white/60">Doc - Supporting evidence (anchors)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded flex items-center justify-center bg-white/5">L</span>
            <span className="text-white/60">Ledger - Audit trail (receipts)</span>
          </div>
        </div>
      </div>
    </main>
  )
}
