"use client"

import Link from "next/link"

// Symbol colors - muted, chakra-aligned
const SYMBOL_COLORS = {
  "●": "#7B6B8D",
  "▼": "#A85D3B",
  "▲": "#9A7B2C",
  "◼": "#4A6FA5",
}

const ACTION_TEMPLATES = [
  {
    type: "FOI Request",
    status: "Ready",
    preview: "Pursuant to the Freedom of Information Act 1982, I request access to all documents relating to...",
  },
  {
    type: "Formal Response",
    status: "Ready",
    preview: "Dear Sir/Madam, I write in response to your correspondence dated...",
  },
  {
    type: "Ombudsman Referral",
    status: "Ready",
    preview: "I wish to lodge a complaint regarding the administrative actions of...",
  },
  {
    type: "Case Record",
    status: "Permanent",
    preview: "Complete chronological record of all events, correspondence, and evidence...",
  },
]

export default function ActPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-base" style={{ color: SYMBOL_COLORS["◼"] }}>◼</span>
          <span className="text-sm font-medium tracking-wider">ACT</span>
        </Link>
        <nav className="flex items-center gap-4">
          {(["●", "▼", "▲", "◼"] as const).map((s) => (
            <Link
              key={s}
              href={s === "●" ? "/observe" : s === "▼" ? "/ground" : s === "▲" ? "/reduce" : "/act"}
              className="text-base transition-opacity hover:opacity-100"
              style={{ color: SYMBOL_COLORS[s], opacity: s === "◼" ? 1 : 0.4 }}
            >
              {s}
            </Link>
          ))}
        </nav>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <div 
            className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
            style={{ backgroundColor: `${SYMBOL_COLORS["◼"]}20` }}
          >
            <span className="text-3xl" style={{ color: SYMBOL_COLORS["◼"] }}>◼</span>
          </div>
          <h1 className="text-2xl font-light tracking-wide mb-2">Ready Actions</h1>
          <p className="text-white/50 text-sm">Send now, build your full case</p>
        </div>

        {/* Action templates */}
        <div className="grid gap-4">
          {ACTION_TEMPLATES.map((action, i) => (
            <div
              key={i}
              className="p-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/[0.07] transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span 
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{ 
                      backgroundColor: `${SYMBOL_COLORS["◼"]}20`,
                      color: SYMBOL_COLORS["◼"],
                    }}
                  >
                    {action.status}
                  </span>
                  <p className="text-sm font-medium text-white">{action.type}</p>
                </div>
                <button 
                  className="text-xs px-4 py-1.5 rounded-lg text-white transition-colors"
                  style={{ backgroundColor: SYMBOL_COLORS["◼"] }}
                >
                  Send Now
                </button>
              </div>
              <p className="text-sm text-white/50 leading-relaxed">{action.preview}</p>
            </div>
          ))}
        </div>

        {/* Case summary */}
        <div className="mt-12 p-6 rounded-xl border border-white/10 bg-white/5">
          <p className="text-xs tracking-widest text-white/40 mb-4">CASE RECORD</p>
          <div className="flex items-center gap-6 text-sm">
            <div>
              <p className="text-white/40 text-xs">Evidence</p>
              <p className="text-white font-medium">4 items</p>
            </div>
            <div>
              <p className="text-white/40 text-xs">Laws Cited</p>
              <p className="text-white font-medium">4 sections</p>
            </div>
            <div>
              <p className="text-white/40 text-xs">Contradictions</p>
              <p className="text-white font-medium">2 found</p>
            </div>
            <div>
              <p className="text-white/40 text-xs">Actions Ready</p>
              <p className="text-white font-medium">4 templates</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
