"use client"
import { useEffect, useState, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"

type Phase = "extracting" | "grounding" | "framing" | "incoherence" | "offering" | "executing" | "complete"

interface ExtractedData {
  dates: string[]
  people: string[]
  entities: string[]
  events: string[]
  documents: string[]
}

interface LawGrounding {
  theyToldYou: string
  butTheLawSays: string
  citation: string
  breach: string
}

interface Framing {
  whatHappened: string
  whyItMatters: string
  whatTheyShouldHaveDone: string
  pattern: string
}

interface Action {
  id: string
  label: string
  description: string
  status: "pending" | "offered" | "accepted" | "executing" | "complete"
  result?: string
}

interface NarrativeIncoherence {
  claim: string
  contradiction: string
  impossibility: string
}

export default function ProcessingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const processingId = searchParams.get("id")

  const [phase, setPhase] = useState<Phase>("extracting")
  const [extracted, setExtracted] = useState<ExtractedData | null>(null)
  const [grounding, setGrounding] = useState<LawGrounding | null>(null)
  const [framing, setFraming] = useState<Framing | null>(null)
  const [actions, setActions] = useState<Action[]>([])
  const [caseId, setCaseId] = useState<string | null>(null)
  const [incoherence, setIncoherence] = useState<NarrativeIncoherence[]>([])

  const [streamingText, setStreamingText] = useState("")
  const streamRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!processingId) {
      router.push("/")
      return
    }

    const processRealCase = async () => {
      // Phase 1: Extraction - watching YOUR data get pulled out
      setPhase("extracting")
      await streamText("Analysing evidence...", 50)
      await delay(800)

      const extractedData: ExtractedData = {
        dates: [
          "10 January 2026 — Call logged",
          "13 January 2026 — Investigation conducted",
          "14 January 2026 — Photo ID requested",
        ],
        people: ["Leon Spizzo (Subject of call)", "Caller (Unidentified)", "Information Access Officer"],
        entities: ["Triple Zero Victoria", "Victoria Police Communications", "Emergency Services"],
        events: [
          "000 call received: 'smoke from outdoor firepit'",
          "Caller description included 'aggressive' (triggers police attendance)",
          "Firefighters attended — no fire or smoke present",
          "Police investigation opened, subsequently closed",
          "Audio recording request submitted by subject",
          "Photo ID requested by TZV",
        ],
        documents: ["TZV Reference INF0013960", "000 Call Recording (requested)"],
      }

      await streamText("\n\n● EVIDENCE EXTRACTED\n", 30)
      await delay(300)

      await streamText("\n┌─ Timeline ─────────────────────────────┐\n", 15)
      for (const date of extractedData.dates) {
        await streamText(`│ ${date}\n`, 25)
        await delay(200)
      }
      await streamText("└────────────────────────────────────────┘", 15)

      await streamText("\n\n┌─ Entities ─────────────────────────────┐\n", 15)
      for (const entity of extractedData.entities) {
        await streamText(`│ ${entity}\n`, 20)
        await delay(150)
      }
      await streamText("└────────────────────────────────────────┘", 15)

      await streamText("\n\n┌─ Sequence ─────────────────────────────┐\n", 15)
      for (let i = 0; i < extractedData.events.length; i++) {
        await streamText(`│ ${i + 1}. ${extractedData.events[i]}\n`, 20)
        await delay(300)
      }
      await streamText("└────────────────────────────────────────┘", 15)

      setExtracted(extractedData)
      await delay(1000)

      // Phase 2: Law Grounding
      setPhase("grounding")
      await streamText("\n\n▼ LAW REFERENCED\n", 30)
      await delay(500)

      const lawData: LawGrounding = {
        theyToldYou: "Photo ID required to access call audio. Privacy considerations apply.",
        butTheLawSays:
          "Freedom of Information Act 1982 (Vic) s.33 provides right to access personal information. TZV Act s.29(2) recognises persons who are 'a subject of the Triple Zero call' may access recordings.",
        citation: "FOI Act 1982 (Vic) s.33 | TZV Act 2020 s.29(2)",
        breach:
          "As the subject of claims made in this call, access provisions apply. Photo ID is a standard verification step. Requiring caller consent where caller made claims against the subject is a separate consideration.",
      }

      await streamText("\n┌─ Position Stated ──────────────────────┐\n", 15)
      await streamText(`│ "${lawData.theyToldYou}"\n`, 30)
      await streamText("└────────────────────────────────────────┘", 15)
      await delay(800)

      await streamText("\n\n┌─ Relevant Legislation ─────────────────┐\n", 15)
      await streamText(`│ ${lawData.butTheLawSays}\n`, 20)
      await streamText("└────────────────────────────────────────┘", 15)
      await delay(500)

      await streamText(`\n\nReference: ${lawData.citation}`, 25)
      await delay(500)

      await streamText(`\n\nNote: ${lawData.breach}`, 22)

      setGrounding(lawData)
      await delay(1200)

      // Phase 3: Framing
      setPhase("framing")
      await streamText("\n\n▲ CONTEXT ESTABLISHED\n", 30)
      await delay(500)

      const frameData: Framing = {
        whatHappened:
          "An anonymous 000 call was made reporting smoke/fire at this address and describing the occupant as 'aggressive'. Emergency services attended and confirmed no fire or smoke present.",
        whyItMatters:
          "The subject of the call is seeking access to the recording. Standard verification (Photo ID) has been requested. Additional requirements may apply under TZV policy.",
        whatTheyShouldHaveDone:
          "Under TZV Act s.29(2), where a person is the subject of a Triple Zero call, consideration for access applies. Photo ID addresses identity verification. Caller consent requirements where the caller made claims against the subject warrant examination.",
        pattern:
          "Multiple sequential requirements observed: Photo ID → potential caller consent → privacy review → processing time. Each step individually standard; cumulative effect extends timeline.",
      }

      await streamText("\n┌─ Summary ──────────────────────────────┐\n", 15)
      await streamText(`│ ${frameData.whatHappened}\n`, 18)
      await streamText("└────────────────────────────────────────┘", 15)
      await delay(800)

      await streamText("\n\n┌─ Relevance ────────────────────────────┐\n", 15)
      await streamText(`│ ${frameData.whyItMatters}\n`, 18)
      await streamText("└────────────────────────────────────────┘", 15)
      await delay(800)

      await streamText("\n\n┌─ Applicable Framework ─────────────────┐\n", 15)
      await streamText(`│ ${frameData.whatTheyShouldHaveDone}\n`, 18)
      await streamText("└────────────────────────────────────────┘", 15)
      await delay(600)

      await streamText("\n\n┌─ OBSERVATION ──────────────────────────┐\n", 15)
      await streamText(`│ ${frameData.pattern}\n`, 20)
      await streamText("└────────────────────────────────────────┘", 15)

      setFraming(frameData)
      await delay(1500)

      // Phase 4: Statements Compared - Questions, not accusations
      setPhase("incoherence")
      await streamText("\n\n◎ QUESTIONS ARISING\n", 30)
      await delay(500)

      const questions: NarrativeIncoherence[] = [
        {
          claim: '"Investigation revealed it was not one of your neighbours"',
          contradiction: "No phone number obtained, only a first name provided, caller cannot be contacted",
          impossibility: "One wonders: how does one investigate identity without identifying information?",
        },
        {
          claim: '"I suspect it might have been a passerby"',
          contradiction: "Zero identifying data available",
          impossibility: "An interesting suspicion. What carries it, one might ask?",
        },
        {
          claim: '"A call was made from a default mobile with no number able to be obtained"',
          contradiction: "Caller reported an 'emergency' requiring immediate response",
          impossibility: "Who reports emergencies anonymously and cannot be reached? A curious pattern.",
        },
        {
          claim: '"Privacy considerations for the anonymous caller"',
          contradiction: "Caller made claims about a specific person and their behaviour",
          impossibility: "Does privacy extend to those who make claims about others? A question worth sitting with.",
        },
        {
          claim: '"Unable to prove the call was made maliciously"',
          contradiction: "Also unable to verify any information the caller provided",
          impossibility: "If nothing can be verified, what can be proven? And who bears that weight?",
        },
        {
          claim: '"You may wish to obtain a subpoena"',
          contradiction: "For a recording of claims made against you, by someone untraceable",
          impossibility: "The path suggested: pay to access words spoken about you, by no one in particular.",
        },
      ]

      setIncoherence(questions)

      await streamText("\n┌─ Examining the narrative ──────────────┐\n", 15)
      for (let i = 0; i < questions.length; i++) {
        await delay(400)
        await streamText(`\n│ "${questions[i].claim}"\n`, 22)
        await streamText(`│   Yet: ${questions[i].contradiction}\n`, 18)
        await streamText(`│   ${questions[i].impossibility}\n`, 20)
        if (i < questions.length - 1) {
          await streamText("│\n", 10)
        }
      }
      await streamText("\n└────────────────────────────────────────┘", 15)
      await delay(1000)

      // Phase 5: Offering actions
      setPhase("offering")
      await streamText("\n\n■ PATHS FORWARD\n", 30)
      await delay(500)

      const actionOptions: Action[] = [
        {
          id: "foi-request",
          label: "Prepare FOI Request",
          description: "A formal path. Sometimes the direct approach.",
          status: "offered",
        },
        {
          id: "email",
          label: "Draft response to TZV",
          description: "Photo ID provided, subject status clarified. Clear and unhurried.",
          status: "offered",
        },
        {
          id: "case-page",
          label: "Create case record",
          description: "A place that exists. Witnessed. Permanent.",
          status: "offered",
        },
        {
          id: "ombudsman",
          label: "Prepare Ombudsman referral",
          description: "If the path remains blocked, another door.",
          status: "offered",
        },
      ]

      setActions(actionOptions)

      for (const action of actionOptions) {
        await streamText(`\n\n→ ${action.label}`, 25)
        await streamText(`\n   ${action.description}`, 18)
        await delay(400)
      }

      await streamText("\n\n────────────────────────────────────────", 15)
      await streamText("\nWhen ready.", 25)
    }

    processRealCase()
  }, [processingId, router])

  const streamText = async (text: string, speed: number) => {
    for (const char of text) {
      setStreamingText((prev) => prev + char)
      await delay(speed)
      if (streamRef.current) {
        streamRef.current.scrollTop = streamRef.current.scrollHeight
      }
    }
  }

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  const executeAction = async (actionId: string) => {
    setActions((prev) => prev.map((a) => (a.id === actionId ? { ...a, status: "executing" as const } : a)))

    setPhase("executing")

    if (actionId === "foi-request") {
      await streamText("\n\n⟳ Generating FOI Request...", 30)
      await delay(1500)
      await streamText("\n\n   To: Freedom of Information Officer", 20)
      await streamText("\n   Triple Zero Victoria", 20)
      await streamText("\n\n   RE: FOI Request - 000 Call Audio (10 January 2026)", 20)
      await streamText("\n\n   I, Leon Spizzo, request under the Freedom of Information", 20)
      await streamText("\n   Act 1982 (Vic) access to the 000 call recording made on", 20)
      await streamText("\n   10 January 2026 concerning my residential address.", 20)
      await streamText("\n\n   I am a subject of this call as defined under s.29(2)", 20)
      await streamText("\n   of the TZV Act. Photo ID attached.", 20)
      await streamText("\n\n   ✓ FOI Request ready for submission", 30)
    } else if (actionId === "email") {
      await streamText("\n\n⟳ Drafting TZV response...", 30)
      await delay(1500)
      await streamText("\n\n   Subject: RE: INF0013960 - Photo ID Attached", 20)
      await streamText("\n\n   To whom it may concern,", 20)
      await streamText("\n\n   Please find attached my photo identification as requested.", 20)
      await streamText("\n\n   I note that under your own criteria, I qualify for access as", 20)
      await streamText("\n   'a person who is a subject of the Triple Zero call.'", 20)
      await streamText("\n   The caller made claims directly about me and my property.", 20)
      await streamText("\n\n   Requiring consent from an anonymous caller who made false", 20)
      await streamText("\n   claims against me is neither reasonable nor required by", 20)
      await streamText("\n   the TZV Act where I am the subject of those claims.", 20)
      await streamText("\n\n   ✓ Email ready for your review", 30)
    } else if (actionId === "case-page") {
      await streamText("\n\n⟳ Generating case page...", 30)
      await delay(2000)
      const newCaseId = `LS-2026-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
      setCaseId(newCaseId)
      await streamText(`\n\n   ✓ Case page live at /case/${newCaseId}`, 30)
      await streamText("\n\n   This is now your permanent record.", 20)
      await streamText("\n   It exists. It cannot be unseen.", 20)
    } else if (actionId === "ombudsman") {
      await streamText("\n\n⟳ Preparing Ombudsman complaint template...", 30)
      await delay(1500)
      await streamText("\n\n   Victorian Ombudsman Complaint", 20)
      await streamText("\n   Agency: Triple Zero Victoria", 20)
      await streamText("\n   Issue: Unreasonable barriers to accessing personal information", 20)
      await streamText("\n   Pattern: Barrier stacking on legitimate FOI-equivalent request", 20)
      await streamText("\n\n   ✓ Template ready - submit if TZV continues obstruction", 30)
    }

    setActions((prev) => prev.map((a) => (a.id === actionId ? { ...a, status: "complete" as const } : a)))
  }

  const hasCompletedActions = actions.some((a) => a.status === "complete")

  return (
    <main className="min-h-screen flex flex-col items-center px-3 md:px-4 py-8 md:py-12">
      <div className="w-full max-w-full md:max-w-[900px]">
        <div className="flex items-center justify-center gap-2 md:gap-4 mb-6 md:mb-8 overflow-x-auto">
          <PhaseSymbol symbol="●" active={phase === "extracting"} complete={!!extracted} />
          <div className="w-4 md:w-8 h-px bg-border flex-shrink-0" />
          <PhaseSymbol symbol="▼" active={phase === "grounding"} complete={!!grounding} />
          <div className="w-4 md:w-8 h-px bg-border flex-shrink-0" />
          <PhaseSymbol symbol="▲" active={phase === "framing"} complete={!!framing} />
          <div className="w-4 md:w-8 h-px bg-border flex-shrink-0" />
          <PhaseSymbol symbol="◎" active={phase === "incoherence"} complete={incoherence.length > 0} />
          <div className="w-4 md:w-8 h-px bg-border flex-shrink-0" />
          <PhaseSymbol
            symbol="■"
            active={phase === "offering" || phase === "executing"}
            complete={hasCompletedActions}
          />
        </div>

        <div
          ref={streamRef}
          className="bg-[#0a0a0a] border border-[#222] rounded-lg p-3 md:p-6 h-[50vh] md:h-[60vh] overflow-y-auto font-mono text-xs md:text-sm leading-relaxed"
        >
          <pre className="whitespace-pre-wrap text-[#e0e0e0] break-words">
            {streamingText}
            <span className="animate-pulse">▌</span>
          </pre>
        </div>

        {phase === "offering" && actions.length > 0 && (
          <div className="mt-6 md:mt-8 space-y-3">
            {actions.map((action) => (
              <button
                key={action.id}
                onClick={() => executeAction(action.id)}
                disabled={action.status === "executing" || action.status === "complete"}
                className={`w-full p-3 md:p-4 rounded-lg border text-left transition-all min-h-[60px] ${
                  action.status === "complete"
                    ? "border-green-800 bg-green-950/30 text-green-200"
                    : action.status === "executing"
                      ? "border-yellow-800 bg-yellow-950/30 text-yellow-200 animate-pulse"
                      : "border-[#333] hover:border-[#555] hover:bg-[#111] active:bg-[#1a1a1a]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm md:text-base">{action.label}</span>
                  {action.status === "complete" && <span>✓</span>}
                  {action.status === "executing" && <span className="animate-spin">⟳</span>}
                </div>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">{action.description}</p>
              </button>
            ))}
          </div>
        )}

        {hasCompletedActions && (
          <div className="mt-6 md:mt-8 flex justify-center">
            <button
              onClick={() => router.push(`/result?caseId=${caseId || "preview"}`)}
              className="w-full md:w-auto px-8 py-3 bg-foreground text-background rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              View Your Case
            </button>
          </div>
        )}
      </div>
    </main>
  )
}

function PhaseSymbol({ symbol, active, complete }: { symbol: string; active: boolean; complete: boolean }) {
  return (
    <div
      className={`text-lg md:text-2xl transition-all flex-shrink-0 ${
        active ? "scale-125 animate-pulse" : complete ? "opacity-100" : "opacity-30"
      }`}
      style={{
        color: complete ? "var(--foreground)" : active ? "var(--foreground)" : "var(--muted)",
      }}
    >
      {symbol}
    </div>
  )
}
