"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Menu, X, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

// Chakra-aligned symbol system
const SYMBOL_ROUTES = [
  { symbol: "●", label: "Observe", href: "/observe", color: "#7B6B8D", desc: "Document evidence" },
  { symbol: "▼", label: "Ground", href: "/ground", color: "#A85D3B", desc: "Legal framework" },
  { symbol: "▲", label: "Recognise", href: "/reduce", color: "#9A7B2C", desc: "Find contradictions" },
  { symbol: "◼", label: "Act", href: "/act", color: "#4A6FA5", desc: "Generate outputs" },
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
          title="Response Advantage"
        >
          <div className="flex flex-col items-center gap-0.5 text-sm leading-none">
            <span style={{ color: "#7B6B8D" }}>●</span>
            <span style={{ color: "#A85D3B" }}>▼</span>
            <span style={{ color: "#9A7B2C" }}>▲</span>
            <span style={{ color: "#4A6FA5" }}>◼</span>
          </div>
        </Link>

        {/* Divider */}
        <div className="w-8 h-px bg-border" />

        {/* Symbol Navigation - the four stages */}
        <nav className="flex flex-col items-center gap-2 flex-1">
          {SYMBOL_ROUTES.map((route) => {
            const isActive = pathname === route.href
            return (
              <Link
                key={route.href}
                href={route.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex flex-col items-center justify-center w-14 h-14 rounded-xl transition-all group relative",
                  isActive ? "bg-white/10" : "hover:bg-white/5",
                )}
                style={{
                  borderLeft: isActive ? `2px solid ${route.color}` : "2px solid transparent",
                }}
                title={route.label}
              >
                <span
                  className="text-lg transition-opacity"
                  style={{ 
                    color: route.color,
                    opacity: isActive ? 1 : 0.6,
                  }}
                >
                  {route.symbol}
                </span>
                <span className={cn(
                  "text-[9px] mt-0.5 transition-colors",
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
