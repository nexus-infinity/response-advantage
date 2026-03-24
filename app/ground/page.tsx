"use client"

import Link from "next/link"

// Symbol colors - muted, chakra-aligned
const SYMBOL_COLORS = {
  "●": "#7B6B8D",
  "▼": "#A85D3B",
  "▲": "#9A7B2C",
  "◼": "#4A6FA5",
}

const LEGAL_FRAMEWORKS = [
  {
    act: "Freedom of Information Act 1982",
    section: "s.33",
    title: "Personal Information Access",
    desc: "You have the right to access any personal information held about you by government agencies.",
  },
  {
    act: "Privacy Act 1988",
    section: "APP 12",
    title: "Access to Personal Information",
    desc: "Organisations must give you access to your personal information on request.",
  },
  {
    act: "Triple Zero Victim Act",
    section: "s.29(2)",
    title: "Call Recording Access",
    desc: "As the subject of an emergency call, you may access the recording under certain conditions.",
  },
  {
    act: "Ombudsman Act 1976",
    section: "s.5",
    title: "Complaint Pathways",
    desc: "You can complain to the Ombudsman about administrative actions by government agencies.",
  },
]

export default function GroundPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-base" style={{ color: SYMBOL_COLORS["▼"] }}>▼</span>
          <span className="text-sm font-medium tracking-wider">GROUND</span>
        </Link>
        <nav className="flex items-center gap-4">
          {(["●", "▼", "▲", "◼"] as const).map((s) => (
            <Link
              key={s}
              href={s === "●" ? "/observe" : s === "▼" ? "/ground" : s === "▲" ? "/reduce" : "/act"}
              className="text-base transition-opacity hover:opacity-100"
              style={{ color: SYMBOL_COLORS[s], opacity: s === "▼" ? 1 : 0.4 }}
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
            style={{ backgroundColor: `${SYMBOL_COLORS["▼"]}20` }}
          >
            <span className="text-3xl" style={{ color: SYMBOL_COLORS["▼"] }}>▼</span>
          </div>
          <h1 className="text-2xl font-light tracking-wide mb-2">Legal Framework</h1>
          <p className="text-white/50 text-sm">Ground your case in applicable law</p>
        </div>

        {/* Legal frameworks grid */}
        <div className="grid gap-4">
          {LEGAL_FRAMEWORKS.map((law, i) => (
            <div
              key={i}
              className="p-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/[0.07] transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs text-white/40 mb-1">{law.act}</p>
                  <p className="text-sm font-medium" style={{ color: SYMBOL_COLORS["▼"] }}>
                    {law.section} — {law.title}
                  </p>
                </div>
                <button className="text-xs px-3 py-1 rounded-full border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-colors">
                  Use in case
                </button>
              </div>
              <p className="text-sm text-white/60 leading-relaxed">{law.desc}</p>
            </div>
          ))}
        </div>

        {/* Quick output */}
        <div className="mt-12 p-6 rounded-xl border border-white/10 bg-white/5">
          <p className="text-xs tracking-widest text-white/40 mb-3">QUICK OUTPUT</p>
          <p className="text-white/80 text-sm leading-relaxed">
            "Under the FOI Act s.33, I am entitled to access all personal information held about me. 
            Under TZV Act s.29(2), as the subject of the call, I may access the recording."
          </p>
          <button className="mt-4 text-xs px-4 py-2 rounded-lg border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-colors">
            Copy to clipboard
          </button>
        </div>
      </div>
    </main>
  )
}
