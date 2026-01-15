"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Minimize2, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

const routes = [
  {
    label: "Home",
    icon: Home,
    href: "/",
    color: "text-foreground",
  },
  {
    label: "Quick Reduce",
    icon: Minimize2,
    href: "/reduce",
    color: "text-foreground",
  },
]

export function NavigationSidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  if (pathname === "/reduce") {
    return null
  }

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
          className="flex items-center justify-center w-12 h-12 rounded-lg hover:bg-secondary transition-colors"
        >
          <div className="flex flex-col items-center gap-0.5 text-base leading-none">
            <span style={{ color: "var(--evidence)" }}>●</span>
            <span style={{ color: "var(--law)" }}>▼</span>
            <span style={{ color: "var(--pattern)" }}>▲</span>
            <span style={{ color: "var(--action)" }}>■</span>
          </div>
        </Link>

        {/* Divider */}
        <div className="w-8 h-px bg-border" />

        {/* Navigation Items */}
        <nav className="flex flex-col items-center gap-4 flex-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center justify-center w-12 h-12 rounded-lg transition-all hover:bg-secondary group relative",
                pathname === route.href ? "bg-secondary glow-sand" : "bg-transparent",
              )}
              title={route.label}
            >
              <route.icon
                className={cn(
                  "h-5 w-5 transition-colors",
                  pathname === route.href ? route.color : "text-muted-foreground group-hover:text-foreground",
                )}
              />

              {/* Tooltip on hover - desktop only */}
              <span className="absolute left-20 px-3 py-1.5 bg-card border border-border rounded-md text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity stone-edge hidden md:block">
                {route.label}
              </span>
            </Link>
          ))}
        </nav>

        <div className="w-2 h-2 rounded-full bg-[var(--stone-bronze)] animate-pulse opacity-60" title="System Active" />
      </div>
    </>
  )
}
