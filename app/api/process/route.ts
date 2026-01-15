import { type NextRequest, NextResponse } from "next/server"

interface TimelineEntry {
  time: string
  event: string
  source: string
}

interface ProcessRequest {
  agency: string
  reference: string
  timeline: TimelineEntry[]
  summary: string
}

export async function POST(request: NextRequest) {
  try {
    const body: ProcessRequest = await request.json()

    // Mock response - replace with actual DOJO API call
    const mockResponse = {
      pattern: {
        id: "47",
        name: "PSC Can Kicking",
        confidence: 0.94,
        stages: ["False contact claim", "Premature closure", "Unavailability barrier", "Burden reversal"],
      },
      response: `Dear ${body.agency},

Re: ${body.reference} — Pattern Recognition Analysis

I am writing regarding the above reference and the concerning pattern of procedural irregularities that have emerged.

TIMELINE OF EVENTS:
${body.timeline.map((entry, i) => `${i + 1}. ${entry.time} - ${entry.event} (${entry.source})`).join("\n")}

ISSUE IDENTIFIED:
${body.summary}

PATTERN ANALYSIS:
The events documented above align with a recognized institutional pattern (Pattern ID: 47 - "PSC Can Kicking"). This pattern is characterized by:
• False claims of contact attempts
• Premature closure of complaints
• Strategic unavailability of responsible parties
• Reversal of burden onto the complainant

REQUESTED ACTION:
1. Provide evidence of all contact attempts claimed
2. Reinstate the complaint with proper investigation
3. Assign an available point of contact
4. Acknowledge the procedural failures identified

This response is generated with 94% confidence based on institutional pattern matching. The documented timeline creates a clear evidential foundation for review.

Yours faithfully,
[Generated Response]`,
      metadata: {
        processing_time_ms: 234,
        reduction_stages: {
          raw: body.timeline.length,
          filtered: body.timeline.length,
          matched: 1,
          output: 1,
        },
      },
    }

    // Simulate DOJO processing delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    return NextResponse.json(mockResponse)
  } catch (error) {
    console.error("Error processing request:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
