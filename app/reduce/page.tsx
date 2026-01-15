"use client"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface ReductionStep {
  symbol: "●" | "▼" | "▲" | "■"
  label: string
  description: string
}

interface ReductionResult {
  original: string
  reduced: string
  pattern: string
  steps: ReductionStep[]
}

const symbolLabels: Record<string, string> = {
  "●": "Evidence gathered",
  "▼": "Grounded in law",
  "▲": "Pattern recognized",
  "■": "Action crystallized",
}

export default function ReducePage() {
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ReductionResult | null>(null)
  const [stepsOpen, setStepsOpen] = useState(false)

  async function handleReduce() {
    if (!text.trim()) return
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/dialectic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      })

      if (response.ok) {
        const data = await response.json()
        setResult(data)
      }
    } catch (error) {
      console.error("Reduction failed:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Empty header space */}
      <header className="h-20" />

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-32">
        {/* Glass container */}
        <div className="w-full max-w-2xl backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter obfuscated text..."
            className="min-h-[240px] bg-transparent border-white/20 text-white placeholder:text-white/40 resize-none focus:border-white/40 focus:ring-0 text-base leading-relaxed"
          />

          <Button
            onClick={handleReduce}
            disabled={loading || !text.trim()}
            className="mt-6 w-full bg-transparent border border-white/60 text-white hover:bg-white/10 hover:border-white transition-all disabled:opacity-30"
          >
            {loading ? "Reducing..." : "Reduce"}
          </Button>
        </div>

        {/* Result display */}
        {result && (
          <div className="w-full max-w-2xl mt-8 space-y-6">
            {/* Original text - faded */}
            <div className="space-y-2">
              <span className="text-white/40 text-xs uppercase tracking-wider">Original</span>
              <p className="text-white/30 text-sm leading-relaxed">{result.original}</p>
            </div>

            {/* Reduced text - bright */}
            <div className="space-y-2">
              <span className="text-white/60 text-xs uppercase tracking-wider">Reduced</span>
              <p className="text-white text-lg leading-relaxed font-medium">{result.reduced}</p>
            </div>

            {/* Pattern detected */}
            <div className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-full">
              <span className="text-white/60 text-xs">{result.pattern}</span>
            </div>

            {/* Reduction steps - collapsible */}
            <Collapsible open={stepsOpen} onOpenChange={setStepsOpen}>
              <CollapsibleTrigger className="flex items-center gap-2 text-white/40 hover:text-white/60 transition-colors text-sm">
                <ChevronDown className={cn("h-4 w-4 transition-transform", stepsOpen && "rotate-180")} />
                Reduction steps
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4 space-y-3">
                {result.steps.map((step, i) => (
                  <div key={i} className="flex items-start gap-3 text-white/60">
                    <span className="text-lg">{step.symbol}</span>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm text-white/80">{step.label}</span>
                      <span className="text-xs text-white/40">{step.description}</span>
                    </div>
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>
          </div>
        )}
      </main>

      {/* Footer - four symbols */}
      <footer className="fixed bottom-0 left-0 right-0 flex items-center justify-center gap-8 py-8 bg-gradient-to-t from-black via-black/80 to-transparent">
        {["●", "▼", "▲", "■"].map((symbol) => (
          <span
            key={symbol}
            className="text-2xl text-white/40 hover:text-white transition-colors cursor-default group relative"
          >
            {symbol}
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-white/10 border border-white/20 rounded text-xs text-white/60 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              {symbolLabels[symbol]}
            </span>
          </span>
        ))}
      </footer>
    </div>
  )
}
