"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Menu, X, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

// Full 6-vertex FIELD system
const VERTEX_ROUTES = [
  { symbol: "♦︎", label: "AKRON", href: "/akron", color: "#8B4513", desc: "Intake / HOLD zone", status: "active" as const },
  { symbol: "●", label: "OBI-WAN", href: "/observe", color: "#7B6B8D", desc: "Document evidence", status: "active" as const },
  { symbol: "▼", label: "TATA", href: "/ground", color: "#A85D3B", desc: "Legal grounding", status: "active" as const },
  { symbol: "▲", label: "ATLAS", href: "/reduce", color: "#9A7B2C", desc: "Pattern recognition", status: "active" as const },
  { symbol: "◼︎", label: "DOJO", href: "/act", color: "#4A6FA5", desc: "Output generation", status: "active" as const },
  { symbol: "⊗", label: "ARKADAS", href: "/spin", color: "#6B8E6B", desc: "Coordination", status: "coming-soon" as const },
]

export function NavigationSidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 md:hidden w-10 h-10 flex items-center justify-center rounded-lg bg-card border border-border"
        aria-label="Open navigation"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && <div className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={() => setMobileOpen(false)} />}

      {/* Sidebar - hidden on mobile unless open */}
      <div
        className={cn(
          "fixed left-0 top-0 h-screen w-20 bg-card border-r border-border flex flex-col items-center py-8 gap-8 z-50 stone-edge transition-transform duration-300",
          "md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        {/* Mobile close button */}
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 md:hidden"
          aria-label="Close navigation"
        >
          <X className="w-5 h-5" />
        </button>

        <Link
          href="/"
          onClick={() => setMobileOpen(false)}
          className="flex items-center justify-center w-12 h-12 rounded-lg hover:bg-white/5 transition-colors group"
          title="FIELD System"
        >
          <div className="flex flex-col items-center gap-0 text-[10px] leading-tight">
            <span style={{ color: "#8B4513" }}>♦︎</span>
            <span style={{ color: "#7B6B8D" }}>●</span>
            <span style={{ color: "#A85D3B" }}>▼</span>
            <span style={{ color: "#9A7B2C" }}>▲</span>
            <span style={{ color: "#4A6FA5" }}>◼︎</span>
            <span style={{ color: "#6B8E6B" }}>⊗</span>
          </div>
        </Link>

        {/* Divider */}
        <div className="w-8 h-px bg-border" />

        {/* 6-Vertex Navigation - full FIELD system */}
        <nav className="flex flex-col items-center gap-1 flex-1">
          {VERTEX_ROUTES.map((route) => {
            const isActive = pathname === route.href
            const isDisabled = route.status === "coming-soon"
            
            if (isDisabled) {
              return (
                <div
                  key={route.href}
                  className="flex flex-col items-center justify-center w-14 h-10 rounded-xl opacity-30 cursor-not-allowed group relative"
                  title={`${route.label} - Coming soon`}
                >
                  <span className="text-base" style={{ color: route.color }}>{route.symbol}</span>
                  <span className="text-[8px] mt-0.5 text-white/30">{route.label}</span>
                </div>
              )
            }
            
            return (
              <Link
                key={route.href}
                href={route.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex flex-col items-center justify-center w-14 h-12 rounded-xl transition-all group relative",
                  isActive ? "bg-white/10" : "hover:bg-white/5",
                )}
                style={{
                  borderLeft: isActive ? `2px solid ${route.color}` : "2px solid transparent",
                }}
                title={route.label}
              >
                <span
                  className="text-base transition-opacity"
                  style={{ 
                    color: route.color,
                    opacity: isActive ? 1 : 0.6,
                  }}
                >
                  {route.symbol}
                </span>
                <span className={cn(
                  "text-[8px] mt-0.5 transition-colors",
                  isActive ? "text-white/70" : "text-white/40"
                )}>
                  {route.label}
                </span>

                {/* Tooltip on hover - desktop only */}
                <div className="absolute left-full ml-3 px-3 py-2 bg-black/90 border border-white/10 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity hidden md:block z-50">
                  <p className="text-xs font-medium text-white whitespace-nowrap">{route.label}</p>
                  <p className="text-[10px] text-white/50 whitespace-nowrap">{route.desc}</p>
                </div>
              </Link>
            )
          })}
        </nav>

        {/* Divider */}
        <div className="w-8 h-px bg-border" />

        {/* New Case button */}
        <Link
          href="/start"
          onClick={() => setMobileOpen(false)}
          className="flex flex-col items-center justify-center w-14 h-14 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
          title="Start new case"
        >
          <Plus className="w-5 h-5 text-white/40 group-hover:text-white/60" />
          <span className="text-[9px] mt-0.5 text-white/40 group-hover:text-white/60">New</span>
        </Link>

        {/* Status indicator */}
        <div className="w-2 h-2 rounded-full bg-green-500/60 animate-pulse" title="System Active" />
      </div>
    </>
  )
}
