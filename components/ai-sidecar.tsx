"use client"

import { useState, useRef, useEffect } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { Button } from "@/components/ui/button"
import { X, MessageCircle, Send, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

// Chakra-aligned colors from the symbol system
const SYMBOL_COLORS = {
  "●": "#7B6B8D",
  "▼": "#A85D3B",
  "▲": "#9A7B2C",
  "◼": "#4A6FA5",
}

export function AISidecar() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  })

  const isLoading = status === "streaming" || status === "submitted"

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    sendMessage({ text: input })
    setInput("")
  }

  // Helper to extract text from message parts
  const getMessageText = (message: typeof messages[0]) => {
    if (!message.parts || !Array.isArray(message.parts)) return ""
    return message.parts
      .filter((p): p is { type: "text"; text: string } => p.type === "text")
      .map((p) => p.text)
      .join("")
  }

  // Detect symbol mentions in text and highlight them
  const renderTextWithSymbols = (text: string) => {
    const parts = text.split(/(●|▼|▲|◼)/g)
    return parts.map((part, i) => {
      if (part in SYMBOL_COLORS) {
        return (
          <span
            key={i}
            style={{ color: SYMBOL_COLORS[part as keyof typeof SYMBOL_COLORS] }}
            className="font-bold"
          >
            {part}
          </span>
        )
      }
      return <span key={i}>{part}</span>
    })
  }

  return (
    <>
      {/* Toggle button - fixed position */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 z-50 flex items-center justify-center",
          "w-14 h-14 rounded-full transition-all duration-300",
          "bg-black/80 backdrop-blur-md border border-white/20",
          "hover:bg-black hover:border-white/30 hover:scale-105",
          "shadow-lg shadow-black/30",
          isOpen && "opacity-0 pointer-events-none"
        )}
        aria-label="Open AI Assistant"
      >
        <MessageCircle className="w-6 h-6 text-white/80" />
        {/* Pulsing indicator when AI is ready */}
        <span className="absolute top-0 right-0 w-3 h-3 rounded-full bg-[#7B6B8D] animate-pulse" />
      </button>

      {/* Sidecar panel */}
      <aside
        className={cn(
          "fixed top-0 right-0 z-50 h-full w-full md:w-[400px]",
          "bg-black/95 backdrop-blur-xl border-l border-white/10",
          "flex flex-col transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <header className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              {(["●", "▼", "▲", "◼"] as const).map((s) => (
                <span
                  key={s}
                  className="text-sm"
                  style={{ color: SYMBOL_COLORS[s], opacity: 0.8 }}
                >
                  {s}
                </span>
              ))}
            </div>
            <span className="text-white/80 text-sm font-medium">AI Assistant</span>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors"
            aria-label="Close AI Assistant"
          >
            <X className="w-5 h-5 text-white/60" />
          </button>
        </header>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-6">
              <div className="flex gap-2 mb-4">
                {(["●", "▼", "▲", "◼"] as const).map((s) => (
                  <span
                    key={s}
                    className="text-2xl"
                    style={{ color: SYMBOL_COLORS[s] }}
                  >
                    {s}
                  </span>
                ))}
              </div>
              <p className="text-white/60 text-sm mb-2">
                I can help you document your case using the geometric framework.
              </p>
              <p className="text-white/40 text-xs">
                Tell me what happened, and I will help you organize it.
              </p>
            </div>
          ) : (
            messages.map((message) => {
              const text = getMessageText(message)
              const isUser = message.role === "user"

              return (
                <div
                  key={message.id}
                  className={cn(
                    "flex",
                    isUser ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-4 py-3",
                      isUser
                        ? "bg-white/10 text-white"
                        : "bg-white/5 text-white/90 border border-white/10"
                    )}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {renderTextWithSymbols(text)}
                    </p>
                  </div>
                </div>
              )
            })
          )}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-white/60 animate-spin" />
                  <span className="text-sm text-white/40">Thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <form
          onSubmit={handleSubmit}
          className="p-4 border-t border-white/10"
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe what happened..."
              disabled={isLoading}
              className={cn(
                "flex-1 px-4 py-3 rounded-xl text-sm",
                "bg-white/5 border border-white/10 text-white",
                "placeholder:text-white/30",
                "focus:outline-none focus:border-white/20",
                "disabled:opacity-50"
              )}
            />
            <Button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="px-4 bg-white/10 border border-white/20 hover:bg-white/20"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </aside>

      {/* Backdrop overlay on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setIsOpen(false)}
          role="button"
          tabIndex={0}
          aria-label="Close sidebar"
        />
      )}
    </>
  )
}
