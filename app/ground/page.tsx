"use client"

import { useState } from "react"
import Link from "next/link"
import { CheckCircle2, AlertTriangle, Lock, Unlock, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { VERTICES } from "@/lib/types/intake-packet"

// Legal frameworks available for grounding
const LEGAL_FRAMEWORKS = [
  {
    id: "foi-33",
    act: "Freedom of Information Act 1982",
    section: "s.33",
    title: "Personal Information Access",
    desc: "You have the right to access any personal information held about you by government agencies.",
    jurisdiction: "Commonwealth",
  },
  {
    id: "privacy-app12",
    act: "Privacy Act 1988",
    section: "APP 12",
    title: "Access to Personal Information",
    desc: "Organisations must give you access to your personal information on request.",
    jurisdiction: "Commonwealth",
  },
  {
    id: "tzw-29",
    act: "Triple Zero Victim Act",
    section: "s.29(2)",
    title: "Call Recording Access",
    desc: "As the subject of an emergency call, you may access the recording under certain conditions.",
    jurisdiction: "State",
  },
  {
    id: "ombudsman-5",
    act: "Ombudsman Act 1976",
    section: "s.5",
    title: "Complaint Pathways",
    desc: "You can complain to the Ombudsman about administrative actions by government agencies.",
    jurisdiction: "Commonwealth",
  },
  {
    id: "admin-5",
    act: "Administrative Decisions (Judicial Review) Act 1977",
    section: "s.5",
    title: "Judicial Review",
    desc: "Decisions of an administrative character made under an enactment may be reviewed.",
    jurisdiction: "Commonwealth",
  },
]

// Validation checkpoints for proceeding
const VALIDATION_CHECKPOINTS = [
  { id: "observation", label: "Observation recorded", required: true },
  { id: "anchor", label: "At least one anchor attached", required: true },
  { id: "law", label: "Legal framework selected", required: true },
  { id: "jurisdiction", label: "Jurisdiction confirmed", required: false },
]

export default function GroundPage() {
  const [selectedLaws, setSelectedLaws] = useState<string[]>([])
  const [checkpoints, setCheckpoints] = useState<Record<string, boolean>>({
    observation: true, // Demo: assume we have an observation
    anchor: true,      // Demo: assume we have an anchor
    law: false,
    jurisdiction: false,
  })
  const [copied, setCopied] = useState(false)

  const toggleLaw = (lawId: string) => {
    setSelectedLaws(prev => {
      const newSelection = prev.includes(lawId) 
        ? prev.filter(id => id !== lawId)
        : [...prev, lawId]
      
      // Update checkpoint
      setCheckpoints(c => ({ ...c, law: newSelection.length > 0 }))
      return newSelection
    })
  }

  const allRequiredPassed = VALIDATION_CHECKPOINTS
    .filter(cp => cp.required)
    .every(cp => checkpoints[cp.id])

  const selectedLawsData = LEGAL_FRAMEWORKS.filter(l => selectedLaws.includes(l.id))

  const quickOutput = selectedLawsData.length > 0
    ? selectedLawsData.map(l => `Under ${l.act} ${l.section}, ${l.desc.toLowerCase()}`).join(" ")
    : "Select legal frameworks to generate output."

  const copyToClipboard = () => {
    navigator.clipboard.writeText(quickOutput)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main className="min-h-screen bg-[#0d1117] text-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <span className="text-2xl" style={{ color: VERTICES["▼"].color }}>▼</span>
          <div>
            <h1 className="text-lg font-medium tracking-wide">TATA — Ground</h1>
            <p className="text-xs text-white/40">Legal framework and validation</p>
          </div>
        </div>
        
        {/* Gate status */}
        <div className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-full text-sm",
          allRequiredPassed 
            ? "bg-green-500/20 text-green-400"
            : "bg-red-500/20 text-red-400"
        )}>
          {allRequiredPassed ? (
            <>
              <Unlock className="w-4 h-4" />
              <span>Gate Open</span>
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              <span>Gate Locked</span>
            </>
          )}
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left: Legal Frameworks */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-sm font-medium text-white/70 tracking-wider mb-4">
              LEGAL FRAMEWORKS
            </h2>

            {LEGAL_FRAMEWORKS.map((law) => {
              const isSelected = selectedLaws.includes(law.id)
              return (
                <div
                  key={law.id}
                  onClick={() => toggleLaw(law.id)}
                  className={cn(
                    "p-5 rounded-xl border cursor-pointer transition-all",
                    isSelected
                      ? "bg-white/10 border-white/20"
                      : "bg-white/5 border-white/10 hover:border-white/15"
                  )}
                  style={{
                    borderLeftColor: isSelected ? VERTICES["▼"].color : undefined,
                    borderLeftWidth: isSelected ? 3 : 1,
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-xs text-white/40 mb-1">{law.act}</p>
                      <p className="text-sm font-medium" style={{ color: VERTICES["▼"].color }}>
                        {law.section} — {law.title}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-white/50">
                        {law.jurisdiction}
                      </span>
                      {isSelected && (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-white/60 leading-relaxed">{law.desc}</p>
                </div>
              )
            })}
          </div>

          {/* Right: Validation Panel */}
          <div className="space-y-6">
            {/* Checkpoints */}
            <div className="p-5 rounded-xl border border-white/10 bg-white/5">
              <h3 className="text-sm font-medium text-white/70 mb-4">VALIDATION CHECKPOINTS</h3>
              
              <div className="space-y-3">
                {VALIDATION_CHECKPOINTS.map((cp) => (
                  <div key={cp.id} className="flex items-center gap-3">
                    {checkpoints[cp.id] ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                    )}
                    <span className={cn(
                      "text-sm",
                      checkpoints[cp.id] ? "text-white/70" : "text-red-400/80"
                    )}>
                      {cp.label}
                      {cp.required && <span className="text-red-400 ml-1">*</span>}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-xs text-white/40">
                  {allRequiredPassed 
                    ? "All required checkpoints passed. You may proceed to ATLAS."
                    : "Complete required checkpoints to unlock the gate."}
                </p>
              </div>
            </div>

            {/* Quick Output */}
            <div className="p-5 rounded-xl border border-white/10 bg-white/5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-white/70">QUICK OUTPUT</h3>
                <button
                  onClick={copyToClipboard}
                  disabled={selectedLaws.length === 0}
                  className={cn(
                    "p-2 rounded-lg transition-colors",
                    selectedLaws.length > 0
                      ? "hover:bg-white/10 text-white/60"
                      : "opacity-30 cursor-not-allowed"
                  )}
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
              
              <p className="text-sm text-white/60 leading-relaxed">
                {quickOutput}
              </p>
            </div>

            {/* Proceed Button */}
            <Link href={allRequiredPassed ? "/reduce" : "#"}>
              <Button
                disabled={!allRequiredPassed}
                className={cn(
                  "w-full",
                  allRequiredPassed
                    ? "bg-white/10 hover:bg-white/20 text-white border border-white/20"
                    : "bg-white/5 text-white/30 border border-white/10 cursor-not-allowed"
                )}
              >
                {allRequiredPassed ? (
                  <>
                    Proceed to <span style={{ color: VERTICES["▲"].color }}>▲</span> ATLAS
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Gate Locked
                  </>
                )}
              </Button>
            </Link>

            {/* Back to AKRON */}
            <Link href="/akron">
              <Button
                variant="outline"
                className="w-full bg-transparent border-white/10 text-white/50 hover:text-white hover:border-white/20"
              >
                <span style={{ color: VERTICES["♦︎"].color }} className="mr-2">♦︎</span>
                Return to AKRON
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
