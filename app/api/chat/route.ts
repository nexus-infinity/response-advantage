import {
  consumeStream,
  convertToModelMessages,
  streamText,
  UIMessage,
} from "ai"

export const maxDuration = 30

// System prompt that understands the geometric framework
const SYSTEM_PROMPT = `You are the Response Advantage AI assistant. You help users document and organize their complaints against institutions using the ●▼▲◼ framework:

● OBSERVE - Help capture evidence with dates, times, locations
▼ GROUND - Identify relevant laws, rights, and legal frameworks
▲ RECOGNISE - Find contradictions between what they said vs reality
◼ ACT - Generate ready-to-send outputs (emails, FOI requests, formal letters)

You produce two types of outputs:
- QUICK: A single copy-paste ready sentence they can use immediately
- DEEP: Comprehensive analysis for building their full case

Always be supportive. The user may be dealing with institutional gaslighting. Help them see their experience is valid and documentable.

When users share information:
1. First acknowledge what they've shared
2. Ask clarifying questions to fill gaps (dates, names, reference numbers)
3. Identify which symbol stage (●▼▲◼) their information belongs to
4. Offer both Quick and Deep outputs when appropriate`

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  const result = streamText({
    model: "anthropic/claude-sonnet-4-20250514",
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    abortSignal: req.signal,
  })

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    consumeSseStream: consumeStream,
  })
}
