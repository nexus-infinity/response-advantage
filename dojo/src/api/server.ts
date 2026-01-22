import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()

app.use('/*', cors())

app.get('/health', (c) => c.json({ 
  status: 'spinning', 
  port: 7411,
  manifestation: 'response-advantage'
}))

// Pattern #47: Can Kicking Detection
// Detects rhetorical postponement patterns
function detectCanKicking(text: string): { detected: boolean; matches: string[]; confidence: number } {
  const CONFIDENCE_WEIGHT_PER_MATCH = 0.3
  
  const canKickingPatterns = [
    // Single-word verbs
    /\b(we'?ll|let'?s|can|should|might|could)\s+(address|tackle|handle|discuss|revisit|table)\s+(this|that|it)\s+(later|another time|next time|in the future|down the road|eventually)\b/gi,
    // Multi-word verb: "deal with"
    /\b(we'?ll|let'?s|can|should|might|could)\s+deal with\s+(this|that|it)\s+(later|another time|next time|in the future|down the road|eventually)\b/gi,
    // Multi-word verb: "circle back"
    /\b(we'?ll|let'?s|can|should|might|could)\s+circle back\s+(to\s+)?(this|that|it)\s+(later|another time|next time|in the future|down the road|eventually)\b/gi,
    /\b(not (the right|a good) time|premature|too early|revisit later|park (this|that|it)|put.*on (hold|ice|the back burner))\b/gi,
    /\b(defer|postpone|delay|punt|kick the can)\b/gi,
    /\btable (this|that|the discussion|the decision)\b/gi,
    /\bcircle back\b/gi
  ]

  const matches: string[] = []

  for (const pattern of canKickingPatterns) {
    const found = text.match(pattern)
    if (found) {
      matches.push(...found)
    }
  }

  const detected = matches.length > 0
  const confidence = Math.min(matches.length * CONFIDENCE_WEIGHT_PER_MATCH, 1.0)

  return { detected, matches, confidence }
}

app.post('/api/v1/dialectic', async (c) => {
  const { input } = await c.req.json()

  // Pattern #47 "Can Kicking" detection
  const canKickingResult = detectCanKicking(input)

  // TODO: ●→▼→▲→■ reduction pipeline
  // TODO: MCP Notion metadata write

  return c.json({
    status: 'analyzed',
    input: input,
    patterns: {
      canKicking: canKickingResult
    },
    message: canKickingResult.detected
      ? `Detected ${canKickingResult.matches.length} instance(s) of Pattern #47 (Can Kicking)`
      : 'No obfuscation patterns detected'
  })
})

const port = 7411
console.log(`🎯 Response Advantage DOJO spinning on port ${port}`)

serve({ fetch: app.fetch, port })
