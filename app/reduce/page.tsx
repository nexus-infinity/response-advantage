"use client"

import { useState } from "react"

export default function ReducePage() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState("")

  const handleReduce = async () => {
    setError("")
    setOutput("")

    try {
      const response = await fetch("http://localhost:9630/api/dialectic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input_text: input }),
      })

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`)
      }

      const data = await response.json()
      setOutput(typeof data === "string" ? data : JSON.stringify(data, null, 2))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    }
  }

  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-4 py-12 relative">
      {/* Geometric context - top left, non-intrusive */}
      <div
        className="absolute top-4 left-4 text-xs font-mono select-none"
        style={{ color: "rgba(255,255,255,0.2)", fontSize: "12px" }}
        title="Observe → Synthesize → Manifest"
      >
        ● → ▲ → ◼
      </div>

      {/* Single glass container */}
      <div
        className="w-full max-w-[800px] rounded-2xl p-8"
        style={{
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        {/* Input textarea */}
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste confusing text here..."
          rows={12}
          className="w-full text-white font-mono text-sm leading-relaxed resize-none focus:outline-none placeholder:text-white/30"
          style={{
            background: "rgba(0,0,0,0.3)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "12px",
            padding: "16px",
          }}
        />

        {/* Reduce button */}
        <div className="flex justify-center my-6">
          <button
            onClick={handleReduce}
            type="button"
            className="px-8 py-3 text-white font-medium transition-opacity hover:opacity-80"
            style={{
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.5)",
              borderRadius: "8px",
            }}
          >
            Reduce
          </button>
        </div>

        {/* Output */}
        {(output || error) && (
          <div
            className="text-white text-base leading-relaxed whitespace-pre-wrap"
            style={{
              background: "rgba(0,0,0,0.3)",
              border: `1px solid ${error ? "rgba(255,100,100,0.3)" : "rgba(255,255,255,0.1)"}`,
              borderRadius: "12px",
              padding: "16px",
            }}
          >
            {error ? <span className="text-red-400">{error}</span> : output}
          </div>
        )}
      </div>
    </main>
  )
}
