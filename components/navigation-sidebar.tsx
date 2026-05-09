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

      {/* Sidebar - Apple-inspired glass panel */}
      <div
        className={cn(
          "fixed left-0 top-0 h-screen w-20 flex flex-col items-center py-6 gap-6 z-50",
          "bg-sidebar/80 backdrop-blur-xl border-r border-sidebar-border",
          "transition-transform duration-300 ease-out",
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
          className="flex items-center justify-center w-11 h-11 rounded-2xl hover:bg-sidebar-accent transition-smooth group"
          title="FIELD System"
        >
          <div className="flex flex-col items-center gap-px text-[9px] leading-none tracking-tight">
            <span className="opacity-80" style={{ color: "#8B4513" }}>♦︎</span>
            <span className="opacity-80" style={{ color: "#7B6B8D" }}>●</span>
            <span className="opacity-80" style={{ color: "#A85D3B" }}>▼</span>
            <span className="opacity-80" style={{ color: "#9A7B2C" }}>▲</span>
            <span className="opacity-80" style={{ color: "#4A6FA5" }}>◼︎</span>
            <span className="opacity-40" style={{ color: "#6B8E6B" }}>⊗</span>
          </div>
        </Link>

        {/* Divider - subtle */}
        <div className="w-8 h-px bg-sidebar-border" />

        {/* 6-Vertex Navigation - Apple-inspired */}
        <nav className="flex flex-col items-center gap-0.5 flex-1">
          {VERTEX_ROUTES.map((route) => {
            const isActive = pathname === route.href
            const isDisabled = route.status === "coming-soon"
            
            if (isDisabled) {
              return (
                <div
                  key={route.href}
                  className="flex flex-col items-center justify-center w-14 h-11 rounded-xl opacity-25 cursor-not-allowed"
                  title={`${route.label} - Coming soon`}
                >
                  <span className="text-sm" style={{ color: route.color }}>{route.symbol}</span>
                  <span className="text-[7px] mt-0.5 text-muted-foreground tracking-wide uppercase">{route.label}</span>
                </div>
              )
            }
            
            return (
              <Link
                key={route.href}
                href={route.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex flex-col items-center justify-center w-14 h-11 rounded-xl transition-smooth group relative",
                  isActive 
                    ? "bg-sidebar-accent shadow-soft" 
                    : "hover:bg-sidebar-accent/50",
                )}
                title={route.label}
              >
                <span
                  className="text-sm transition-smooth"
                  style={{ 
                    color: route.color,
                    opacity: isActive ? 1 : 0.7,
                    transform: isActive ? "scale(1.1)" : "scale(1)",
                  }}
                >
                  {route.symbol}
                </span>
                <span className={cn(
                  "text-[7px] mt-0.5 tracking-wide uppercase transition-smooth",
                  isActive ? "text-foreground/80" : "text-muted-foreground"
                )}>
                  {route.label}
                </span>

                {/* Tooltip - refined glassmorphism */}
                <div className="absolute left-full ml-4 px-3 py-2 glass shadow-elevated rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-smooth hidden md:block z-50">
                  <p className="text-xs font-medium text-foreground whitespace-nowrap">{route.label}</p>
                  <p className="text-[10px] text-muted-foreground whitespace-nowrap">{route.desc}</p>
                </div>
              </Link>
            )
          })}
        </nav>

        {/* Divider - subtle */}
        <div className="w-8 h-px bg-sidebar-border" />

        {/* New Case button - refined */}
        <Link
          href="/start"
          onClick={() => setMobileOpen(false)}
          className="flex flex-col items-center justify-center w-11 h-11 rounded-xl bg-sidebar-accent hover:bg-sidebar-accent/80 transition-smooth group shadow-soft"
          title="Start new case"
        >
          <Plus className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-smooth" />
          <span className="text-[7px] mt-0.5 tracking-wide uppercase text-muted-foreground group-hover:text-foreground transition-smooth">New</span>
        </Link>

        {/* Status indicator - refined */}
        <div className="w-1.5 h-1.5 rounded-full bg-green-500" title="System Active" />
      </div>
    </>
  )
}
