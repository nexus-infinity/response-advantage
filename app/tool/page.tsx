"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Paperclip } from "lucide-react"
import { SymbolSpinner } from "@/components/logo-symbols"
import { useRouter } from "next/navigation"

interface Message {
  role: "user" | "assistant" | "system"
  content: string
  extractedData?: {
    agency?: string
    reference?: string
    timeline?: Array<{ time: string; event: string; source: string }>
    summary?: string
  }
}

export default function ToolPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>(() => {
    const initialObs = typeof window !== "undefined" ? sessionStorage.getItem("initialObservation") : null
    if (initialObs) {
      sessionStorage.removeItem("initialObservation")
      return [
        {
          role: "assistant",
          content:
            "I've received your observation. Let me help you build your case. Can you tell me which organization or agency is involved?",
        },
      ]
    }
    return [
      {
        role: "assistant",
        content: "Tell me what happened, or paste any emails, messages, or documents you have.",
      },
    ]
  })
  const [input, setInput] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsProcessing(true)

    try {
      // Call extraction API
      const extractRes = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ raw_text: input }),
      })
      const extracted = await extractRes.json()

      // Generate AI response with extracted data
      const aiResponse: Message = {
        role: "assistant",
        content: generateAIResponse(extracted),
        extractedData: extracted,
      }
      setMessages((prev) => [...prev, aiResponse])

      // Check if we have enough data to process
      if (extracted.agency && extracted.reference && extracted.timeline?.length > 0) {
        // Offer to generate response
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: "I've assembled everything. Should I generate your response?",
            },
          ])
        }, 1000)
      }
    } catch (error) {
      console.error("[v0] Error processing message:", error)
      setMessages((prev) => [...prev, { role: "assistant", content: "I encountered an error. Please try again." }])
    } finally {
      setIsProcessing(false)
    }
  }

  const generateAIResponse = (data: any): string => {
    const parts: string[] = []

    if (data.agency) {
      parts.push(`I see you're dealing with ${data.agency}.`)
    }
    if (data.reference) {
      parts.push(`Reference: ${data.reference}.`)
    }
    if (data.timeline && data.timeline.length > 0) {
      parts.push(`I've documented ${data.timeline.length} event${data.timeline.length > 1 ? "s" : ""}.`)
    }
    if (data.summary) {
      parts.push(`Issue: ${data.summary}`)
    }

    if (parts.length === 0) {
      return "Could you provide more details? I'm looking for the agency name, reference number, and what happened."
    }

    return parts.join(" ")
  }

  const handleGenerateResponse = async () => {
    setIsAnalyzing(true)

    // Collect all extracted data from messages
    const allData = messages.reduce(
      (acc, msg) => {
        if (msg.extractedData) {
          return {
            agency: msg.extractedData.agency || acc.agency,
            reference: msg.extractedData.reference || acc.reference,
            timeline: [...(acc.timeline || []), ...(msg.extractedData.timeline || [])],
            summary: msg.extractedData.summary || acc.summary,
          }
        }
        return acc
      },
      { agency: "", reference: "", timeline: [], summary: "" },
    )

    try {
      const response = await fetch("/api/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(allData),
      })

      const result = await response.json()
      sessionStorage.setItem("analysisResult", JSON.stringify(result))
      sessionStorage.setItem("conversationContext", JSON.stringify(messages))

      router.push("/tool/result")
    } catch (error) {
      console.error("[v0] Error generating response:", error)
      setMessages((prev) => [...prev, { role: "assistant", content: "Failed to generate response. Please try again." }])
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <main className="h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex-1 overflow-y-auto px-4 py-6 desert-grid">
        <div className="max-w-[640px] mx-auto space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-lg px-4 py-3 ${
                  msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-card text-card-foreground stone-edge"
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
          {isProcessing && (
            <div className="flex justify-start">
              <div className="bg-card rounded-lg px-4 py-3 stone-edge">
                <SymbolSpinner />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t border-border bg-card/50 backdrop-blur">
        <div className="max-w-[640px] mx-auto px-4 py-4">
          {messages.some((m) => m.content.includes("Should I generate your response?")) && (
            <Button
              onClick={handleGenerateResponse}
              disabled={isAnalyzing}
              className="w-full mb-3 glow-bronze"
              size="lg"
            >
              {isAnalyzing ? (
                <span className="flex items-center gap-2">
                  <SymbolSpinner size="sm" />
                  Analyzing Pattern...
                </span>
              ) : (
                "Generate Response"
              )}
            </Button>
          )}

          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="shrink-0 bg-transparent">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              placeholder="Type your message or paste documents..."
              className="resize-none stone-edge"
              rows={3}
            />
            <Button onClick={handleSend} disabled={isProcessing || !input.trim()} size="icon" className="shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
    </main>
  )
}
