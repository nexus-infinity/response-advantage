import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json()

    // Mock AI response - replace with actual LLM call
    const lastMessage = messages[messages.length - 1]

    // Simple keyword extraction
    const content = lastMessage.content.toLowerCase()
    let response = ""

    if (content.includes("police") || content.includes("psc")) {
      response = "I see you're dealing with Victoria Police PSC. What was the reference number for your case?"
    } else if (/[a-z]{2}\d{5}/i.test(lastMessage.content)) {
      response = "Got it. Can you describe the timeline of events? When did each interaction happen?"
    } else {
      response = "Tell me more. What happened next?"
    }

    return NextResponse.json({
      type: "message",
      content: response,
    })
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json({ error: "Failed to process chat" }, { status: 500 })
  }
}
