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
      {/* Toggle button - Apple-inspired floating action */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-8 right-8 z-50 flex items-center justify-center",
          "w-12 h-12 rounded-2xl transition-smooth",
          "glass shadow-elevated",
          "hover:scale-105 active:scale-95",
          isOpen && "opacity-0 pointer-events-none"
        )}
        aria-label="Open AI Assistant"
      >
        <MessageCircle className="w-5 h-5 text-foreground/70" />
        {/* Status indicator */}
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-green-500" />
      </button>

      {/* Sidecar panel - Apple-inspired */}
      <aside
        className={cn(
          "fixed top-0 right-0 z-50 h-full w-full md:w-[380px]",
          "bg-card/95 backdrop-blur-2xl border-l border-border",
          "flex flex-col transition-smooth",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header - refined */}
        <header className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            {view === "settings" ? (
              <button
                type="button"
                onClick={() => setView("chat")}
                className="p-1.5 rounded-lg hover:bg-accent transition-smooth"
              >
                <ChevronLeft className="w-4 h-4 text-muted-foreground" />
              </button>
            ) : (
              <div className="flex gap-1.5">
                {(["●", "▼", "▲", "◼"] as const).map((s) => (
                  <span
                    key={s}
                    className="text-xs"
                    style={{ color: SYMBOL_COLORS[s], opacity: 0.7 }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}
            <span className="text-foreground/90 text-sm font-medium tracking-tight">
              {view === "settings" ? "Settings" : "Assistant"}
            </span>
          </div>
          <div className="flex items-center gap-0.5">
            {view === "chat" && (
              <>
                <button
                  type="button"
                  onClick={clearChat}
                  className="p-2 rounded-lg hover:bg-accent transition-smooth"
                  aria-label="Clear chat"
                  title="Clear chat"
                >
                  <Trash2 className="w-4 h-4 text-muted-foreground" />
                </button>
                <button
                  type="button"
                  onClick={() => setView("settings")}
                  className="p-2 rounded-lg hover:bg-accent transition-smooth"
                  aria-label="Settings"
                >
                  <Settings className="w-4 h-4 text-muted-foreground" />
                </button>
              </>
            )}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-lg hover:bg-accent transition-smooth"
              aria-label="Close AI Assistant"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </header>

        {/* Content area - switches between chat and settings */}
        {view === "settings" ? (
          <div className="flex-1 overflow-y-auto p-5">
            <div className="space-y-4">
              {/* API Key Status */}
              <div className="p-4 rounded-2xl bg-accent/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-background flex items-center justify-center shadow-soft">
                    <Key className="w-4 h-4 text-foreground/60" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-foreground tracking-tight">AI Connection</h3>
                    <p className="text-xs text-muted-foreground">Vercel AI Gateway</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  <span className="text-xs text-muted-foreground">Connected</span>
                </div>
              </div>

              {/* Model Info */}
              <div className="p-4 rounded-2xl bg-accent/50">
                <h3 className="text-sm font-medium text-foreground tracking-tight mb-2">Model</h3>
                <p className="text-xs text-muted-foreground mb-3">Claude Sonnet</p>
                <div className="text-xs text-muted-foreground space-y-1.5">
                  <p className="text-foreground/60">Optimized for:</p>
                  <ul className="space-y-1">
                    <li className="flex items-center gap-2"><span style={{ color: SYMBOL_COLORS["●"] }}>●</span> Observation</li>
                    <li className="flex items-center gap-2"><span style={{ color: SYMBOL_COLORS["▼"] }}>▼</span> Grounding</li>
                    <li className="flex items-center gap-2"><span style={{ color: SYMBOL_COLORS["▲"] }}>▲</span> Recognition</li>
                    <li className="flex items-center gap-2"><span style={{ color: SYMBOL_COLORS["◼"] }}>◼</span> Action</li>
                  </ul>
                </div>
              </div>

              {/* Clear Chat */}
              <div className="p-4 rounded-2xl bg-accent/50">
                <h3 className="text-sm font-medium text-foreground tracking-tight mb-2">History</h3>
                <p className="text-xs text-muted-foreground mb-3">
                  {messages.length} message{messages.length !== 1 ? "s" : ""}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearChat}
                  className="w-full rounded-xl"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-2" />
                  Clear
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Messages area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center px-4">
                  <div className="flex gap-3 mb-5">
                    {(["●", "▼", "▲", "◼"] as const).map((s) => (
                      <span
                        key={s}
                        className="text-xl"
                        style={{ color: SYMBOL_COLORS[s], opacity: 0.6 }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                  <p className="text-foreground/70 text-sm font-medium tracking-tight mb-1">
                    How can I help?
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Document your case using the geometric framework.
                  </p>
                  
                  {/* Quick prompts - refined */}
                  <div className="mt-8 w-full space-y-2">
                    <button
                      type="button"
                      onClick={() => {
                        setInput("I received an email that contradicts what they told me before")
                        document.querySelector<HTMLInputElement>("input[type='text']")?.focus()
                      }}
                      className="w-full p-3.5 text-left text-xs text-muted-foreground hover:text-foreground bg-accent/50 hover:bg-accent rounded-xl transition-smooth"
                    >
                      &ldquo;I received contradicting information&rdquo;
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setInput("Help me understand my rights in this situation")
                        document.querySelector<HTMLInputElement>("input[type='text']")?.focus()
                      }}
                      className="w-full p-3.5 text-left text-xs text-muted-foreground hover:text-foreground bg-accent/50 hover:bg-accent rounded-xl transition-smooth"
                    >
                      &ldquo;Help me understand my rights&rdquo;
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
                            ? "bg-primary text-primary-foreground"
                            : "bg-accent text-foreground"
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
                  <div className="bg-accent rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-3.5 h-3.5 text-muted-foreground animate-spin" />
                      <span className="text-sm text-muted-foreground">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input area - refined */}
            <form
              onSubmit={handleSubmit}
              className="p-4 border-t border-border"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Message..."
                  disabled={isLoading}
                  className={cn(
                    "flex-1 px-4 py-3 rounded-xl text-sm",
                    "bg-accent text-foreground",
                    "placeholder:text-muted-foreground",
                    "focus:outline-none focus:ring-2 focus:ring-ring",
                    "disabled:opacity-50 transition-smooth"
                  )}
                />
                <Button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  size="icon"
                  className="rounded-xl w-11 h-11"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </>
        )}
      </aside>

      {/* Backdrop overlay on mobile - refined */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden transition-smooth"
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
