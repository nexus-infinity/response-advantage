"use client"

import { useState, useRef, useEffect } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { Button } from "@/components/ui/button"
import { X, MessageCircle, Send, Loader2, Settings, ChevronLeft, Trash2, Key } from "lucide-react"
import { cn } from "@/lib/utils"

// Chakra-aligned colors from the symbol system
const SYMBOL_COLORS = {
  "●": "#7B6B8D",
  "▼": "#A85D3B",
  "▲": "#9A7B2C",
  "◼": "#4A6FA5",
}

type SidecarView = "chat" | "settings"

export function AISidecar() {
  const [isOpen, setIsOpen] = useState(false)
  const [view, setView] = useState<SidecarView>("chat")
  const [input, setInput] = useState("")
  const [apiKeyConfigured, setApiKeyConfigured] = useState(true) // Assumes Vercel AI Gateway
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  })

  const clearChat = () => {
    setMessages([])
  }

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
            {view === "settings" ? (
              <button
                type="button"
                onClick={() => setView("chat")}
                className="p-1 rounded hover:bg-white/5"
              >
                <ChevronLeft className="w-5 h-5 text-white/60" />
              </button>
            ) : (
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
            )}
            <span className="text-white/80 text-sm font-medium">
              {view === "settings" ? "Settings" : "AI Assistant"}
            </span>
          </div>
          <div className="flex items-center gap-1">
            {view === "chat" && (
              <>
                <button
                  type="button"
                  onClick={clearChat}
                  className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                  aria-label="Clear chat"
                  title="Clear chat"
                >
                  <Trash2 className="w-4 h-4 text-white/40 hover:text-white/60" />
                </button>
                <button
                  type="button"
                  onClick={() => setView("settings")}
                  className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                  aria-label="Settings"
                >
                  <Settings className="w-4 h-4 text-white/40 hover:text-white/60" />
                </button>
              </>
            )}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors"
              aria-label="Close AI Assistant"
            >
              <X className="w-5 h-5 text-white/60" />
            </button>
          </div>
        </header>

        {/* Content area - switches between chat and settings */}
        {view === "settings" ? (
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-6">
              {/* API Key Status */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                    <Key className="w-5 h-5 text-white/60" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-white">AI Connection</h3>
                    <p className="text-xs text-white/40">Vercel AI Gateway</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs text-white/60">Connected via Vercel integration</span>
                </div>
                <p className="text-xs text-white/40 mt-3">
                  AI is powered by the Vercel AI Gateway. No additional configuration required.
                </p>
              </div>

              {/* Model Info */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <h3 className="text-sm font-medium text-white mb-2">Model</h3>
                <p className="text-xs text-white/60 mb-3">Claude Sonnet (anthropic/claude-sonnet-4-20250514)</p>
                <div className="text-xs text-white/40 space-y-1">
                  <p>Optimized for the geometric framework:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li><span style={{ color: SYMBOL_COLORS["●"] }}>●</span> Observation & documentation</li>
                    <li><span style={{ color: SYMBOL_COLORS["▼"] }}>▼</span> Legal grounding</li>
                    <li><span style={{ color: SYMBOL_COLORS["▲"] }}>▲</span> Pattern recognition</li>
                    <li><span style={{ color: SYMBOL_COLORS["◼"] }}>◼</span> Action generation</li>
                  </ul>
                </div>
              </div>

              {/* Clear Chat */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <h3 className="text-sm font-medium text-white mb-2">Chat History</h3>
                <p className="text-xs text-white/40 mb-3">
                  {messages.length} message{messages.length !== 1 ? "s" : ""} in current session
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearChat}
                  className="w-full bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear conversation
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <>
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
                  
                  {/* Quick prompts */}
                  <div className="mt-6 w-full space-y-2">
                    <button
                      type="button"
                      onClick={() => {
                        setInput("I received an email that contradicts what they told me before")
                        document.querySelector<HTMLInputElement>("input[type='text']")?.focus()
                      }}
                      className="w-full p-3 text-left text-xs text-white/50 hover:text-white/70 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors"
                    >
                      &ldquo;I received an email that contradicts what they told me before&rdquo;
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setInput("Help me understand my rights in this situation")
                        document.querySelector<HTMLInputElement>("input[type='text']")?.focus()
                      }}
                      className="w-full p-3 text-left text-xs text-white/50 hover:text-white/70 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors"
                    >
                      &ldquo;Help me understand my rights in this situation&rdquo;
                    </button>
                  </div>
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
          </>
        )}
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
