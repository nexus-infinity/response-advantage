"use client"

import { useEffect, useState } from "react"
import { ChevronDown, AlertTriangle, CheckCircle2 } from "lucide-react"

interface VertexStatus {
  symbol: string
  label: string
  status: "pending" | "active" | "complete"
  color: string
}

interface CoherenceHUDProps {
  score?: number
  vertices?: VertexStatus[]
  isExpanded?: boolean
  onExpandChange?: (expanded: boolean) => void
}

export default function CoherenceHUD({
  score = 0,
  vertices = [
    { symbol: "♦︎", label: "AKRON", status: "pending", color: "#8B4513" },
    { symbol: "●", label: "OBI-WAN", status: "active", color: "#7B6B8D" },
    { symbol: "▼", label: "TATA", status: "pending", color: "#A85D3B" },
    { symbol: "▲", label: "ATLAS", status: "pending", color: "#9A7B2C" },
    { symbol: "◼︎", label: "DOJO", status: "pending", color: "#4A6FA5" },
    { symbol: "⊗", label: "ARKADAS", status: "pending", color: "#6B8E6B" },
  ],
  isExpanded: false,
  onExpandChange,
}: CoherenceHUDProps) {
  const [expanded, setExpanded] = useState(isExpanded)
  const [coherenceScore, setCoherenceScore] = useState(score)

  const handleExpandChange = (newExpanded: boolean) => {
    setExpanded(newExpanded)
    onExpandChange?.(newExpanded)
  }

  // Animate score when it changes
  useEffect(() => {
    setCoherenceScore(score)
  }, [score])

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Main HUD Panel */}
      <div className="glass shadow-elevated rounded-2xl p-4 border border-border/50 backdrop-blur-xl w-fit">
        <div className="flex items-center justify-between gap-4">
          {/* Score display */}
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs text-muted-foreground font-medium tracking-wider uppercase">
              Coherence
            </span>
            <div className="flex items-baseline gap-1">
              <span
                className="text-2xl font-bold transition-all"
                style={{
                  color: coherenceScore > 70 ? "#10b981" : coherenceScore > 40 ? "#f59e0b" : "#ef4444",
                }}
              >
                {coherenceScore}
              </span>
              <span className="text-xs text-muted-foreground">%</span>
            </div>
          </div>

          {/* Divider */}
          <div className="w-px h-12 bg-border/30" />

          {/* Vertex strip - always visible */}
          <div className="flex items-center gap-1">
            {vertices.map((vertex) => (
              <div
                key={vertex.symbol}
                className="flex items-center justify-center w-8 h-8 rounded-lg transition-all"
                style={{
                  backgroundColor:
                    vertex.status === "complete"
                      ? `${vertex.color}20`
                      : vertex.status === "active"
                        ? `${vertex.color}15`
                        : "rgba(255,255,255,0.05)",
                  border:
                    vertex.status === "active"
                      ? `1px solid ${vertex.color}`
                      : "1px solid transparent",
                }}
                title={`${vertex.label} - ${vertex.status}`}
              >
                {/* Status indicator */}
                <div className="relative">
                  <span
                    className="text-sm font-bold"
                    style={{
                      color: vertex.color,
                      opacity:
                        vertex.status === "pending"
                          ? 0.3
                          : vertex.status === "active"
                            ? 1
                            : 0.7,
                    }}
                  >
                    {vertex.symbol}
                  </span>
                  {vertex.status === "complete" && (
                    <div
                      className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: vertex.color }}
                    />
                  )}
                  {vertex.status === "active" && (
                    <div
                      className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full animate-pulse"
                      style={{ backgroundColor: vertex.color }}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Expand button */}
          <button
            onClick={() => handleExpandChange(!expanded)}
            className="p-1.5 hover:bg-accent transition-smooth rounded-lg"
            aria-label="Toggle diagnostics"
          >
            <ChevronDown
              className="w-4 h-4 text-muted-foreground transition-transform"
              style={{
                transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
          </button>
        </div>

        {/* Expanded diagnostics panel */}
        {expanded && (
          <div className="mt-4 pt-4 border-t border-border/30 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
            {/* Vertex details */}
            <div className="space-y-2">
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                Vertex Status
              </p>
              {vertices.map((vertex) => (
                <div
                  key={vertex.symbol}
                  className="flex items-center gap-2 text-xs p-2 rounded-lg bg-background/50"
                >
                  {vertex.status === "complete" ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
                  ) : vertex.status === "active" ? (
                    <div
                      className="w-3.5 h-3.5 rounded-full animate-pulse"
                      style={{ backgroundColor: vertex.color }}
                    />
                  ) : (
                    <AlertTriangle className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />
                  )}
                  <span className="flex-1 text-muted-foreground">
                    <span style={{ color: vertex.color }} className="font-bold mr-1.5">
                      {vertex.symbol}
                    </span>
                    {vertex.label}
                  </span>
                  <span
                    className={`text-[9px] px-2 py-0.5 rounded tracking-wider uppercase font-medium ${
                      vertex.status === "complete"
                        ? "bg-green-500/10 text-green-600 dark:text-green-400"
                        : vertex.status === "active"
                          ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                          : "bg-muted/50 text-muted-foreground"
                    }`}
                  >
                    {vertex.status}
                  </span>
                </div>
              ))}
            </div>

            {/* Score breakdown */}
            <div>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-2">
                Score Breakdown
              </p>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Evidence Quality</span>
                  <span className="font-mono text-foreground">{Math.round(coherenceScore * 0.4)}%</span>
                </div>
                <div className="h-1 bg-background/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
                    style={{ width: `${coherenceScore * 0.4}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs mt-2">
                  <span className="text-muted-foreground">Legal Grounding</span>
                  <span className="font-mono text-foreground">{Math.round(coherenceScore * 0.3)}%</span>
                </div>
                <div className="h-1 bg-background/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all"
                    style={{ width: `${coherenceScore * 0.3}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs mt-2">
                  <span className="text-muted-foreground">Pattern Recognition</span>
                  <span className="font-mono text-foreground">{Math.round(coherenceScore * 0.3)}%</span>
                </div>
                <div className="h-1 bg-background/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-500 to-amber-500 transition-all"
                    style={{ width: `${coherenceScore * 0.3}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Quick actions */}
            <div className="pt-2 border-t border-border/30">
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-2">
                Quick Actions
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button className="px-2 py-1.5 text-xs rounded-lg bg-background/50 hover:bg-background transition-smooth text-muted-foreground hover:text-foreground">
                  View Case
                </button>
                <button className="px-2 py-1.5 text-xs rounded-lg bg-background/50 hover:bg-background transition-smooth text-muted-foreground hover:text-foreground">
                  Export
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hover hint - desktop only */}
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 hover:opacity-100 transition-opacity pointer-events-none hidden md:block">
        <div className="text-xs text-muted-foreground whitespace-nowrap bg-background/80 backdrop-blur px-2 py-1 rounded border border-border/50">
          System status + diagnostics
        </div>
      </div>
    </div>
  )
}
