import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { raw_text } = await request.json()

    // Simple extraction logic - replace with actual NLP/LLM extraction
    const extracted: any = {}

    // Extract agency
    if (/victoria police/i.test(raw_text)) {
      extracted.agency = "Victoria Police PSC"
    }

    // Extract reference number (pattern: VP12345 or similar)
    const refMatch = raw_text.match(/\b[A-Z]{2}\d{4,6}\b/)
    if (refMatch) {
      extracted.reference = refMatch[0]
    }

    // Extract timeline entries (look for time patterns)
    const timeMatches = raw_text.match(/\b\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)?\b/g)
    if (timeMatches) {
      extracted.timeline = timeMatches.map((time, idx) => ({
        time,
        event: `Event extracted from text (${idx + 1})`,
        source: "User input",
      }))
    }

    // Generate summary
    if (raw_text.length > 50) {
      extracted.summary = raw_text.substring(0, 100) + "..."
    }

    return NextResponse.json(extracted)
  } catch (error) {
    console.error("Error extracting data:", error)
    return NextResponse.json({ error: "Failed to extract data" }, { status: 500 })
  }
}
