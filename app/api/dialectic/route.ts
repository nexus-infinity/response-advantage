import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { text } = await req.json()

    // If DOJO API is configured, use it
    if (process.env.DOJO_API_URL) {
      const response = await fetch(`${process.env.DOJO_API_URL}/api/v1/dialectic`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: text }),
      })

      if (response.ok) {
        return NextResponse.json(await response.json())
      }
    }

    // Mock reduction for demonstration
    const mockResult = {
      original: text,
      reduced: extractEssence(text),
      pattern: detectPattern(text),
      steps: [
        {
          symbol: "●" as const,
          label: "Evidence extracted",
          description: "Key claims and statements identified",
        },
        {
          symbol: "▼" as const,
          label: "Grounded",
          description: "Mapped against documented obligations",
        },
        {
          symbol: "▲" as const,
          label: "Pattern surfaced",
          description: "Institutional behavior recognized",
        },
        {
          symbol: "■" as const,
          label: "Clarity formed",
          description: "Reduction complete",
        },
      ],
    }

    return NextResponse.json(mockResult)
  } catch (error) {
    return NextResponse.json({ error: "Reduction failed" }, { status: 500 })
  }
}

function extractEssence(text: string): string {
  // Simple extraction - in production, DOJO handles this
  const sentences = text.split(/[.!?]+/).filter(Boolean)
  if (sentences.length <= 2) return text.trim()

  // Take first and last meaningful sentences
  const first = sentences[0].trim()
  const last = sentences[sentences.length - 1].trim()

  return `${first}. ${last}.`
}

function detectPattern(text: string): string {
  const lower = text.toLowerCase()

  if (lower.includes("unable") || lower.includes("cannot")) {
    return "Barrier presentation"
  }
  if (lower.includes("policy") || lower.includes("procedure")) {
    return "Process deflection"
  }
  if (lower.includes("unfortunately") || lower.includes("regret")) {
    return "Sympathetic dismissal"
  }
  if (lower.includes("contact") || lower.includes("reach")) {
    return "Referral loop"
  }

  return "Obfuscation detected"
}
