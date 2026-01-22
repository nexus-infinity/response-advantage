/**
 * ◼ Response Advantage DOJO - Dialectic Engine (Port 7411)
 * 
 * Pattern #47: Can Kicking Detection
 * Geometric Pipeline: S0→S7 (Partial: S0, S1, S3-▲, S7)
 * 
 * @geometric-router ◼
 * @port 7411
 * @stage dialectic-reduction
 */

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

// Weight applied per match when calculating confidence score (0.3 means ~3-4 matches = high confidence)
const CONFIDENCE_WEIGHT_PER_MATCH = 0.3

// Detects rhetorical postponement patterns
const CAN_KICKING_PATTERNS: readonly RegExp[] = [
  // Single-word verbs with future temporal modifiers (note: "table" here requires temporal words like "later")
  /\b(we'?ll|let'?s|can|should|might|could)\s+(address|tackle|handle|discuss|table)\s+(this|that|it)\s+(later|another time|next time|in the future|down the road|eventually)\b/gi,
  // Multi-word verb: "deal with"
  /\b(we'?ll|let'?s|can|should|might|could)\s+deal with\s+(this|that|it)\s+(later|another time|next time|in the future|down the road|eventually)\b/gi,
  // Multi-word verb: "circle back"
  /\b(we'?ll|let'?s|can|should|might|could)\s+circle back\s+(to\s+)?(this|that|it)\s+(later|another time|next time|in the future|down the road|eventually)\b/gi,
  // Timing objections
  /\b(not (the right|a good) time|premature|too early)\b/gi,
  // Revisit/park patterns
  /\b(revisit later|park (this|that|it))\b/gi,
  // Put on hold/ice/back burner (constrained to 0-5 words between "put" and "on")
  /\bput(?:\s+\w+){0,5}\s+on (hold|ice|the back burner)\b/gi,
  // Direct postponement verbs
  /\b(defer|postpone|delay|punt|kick the can)\b/gi,
  // Table as direct verb (without requiring temporal modifiers)
  /\btable (this|that|the discussion|the decision)\b/gi,
  // Circle back standalone
  /\bcircle back\b/gi
]

interface CanKickingResult {
  detected: boolean
  matches: string[]
  confidence: number
}

function detectCanKicking(text: string): CanKickingResult {
  const matchSet = new Set<string>()

  for (const pattern of CAN_KICKING_PATTERNS) {
    const found = text.match(pattern)
    if (found) {
      for (const match of found) {
        matchSet.add(match)
      }
    }
  }

  const matches = Array.from(matchSet)
  const detected = matches.length > 0
  const confidence = Math.min(matches.length * CONFIDENCE_WEIGHT_PER_MATCH, 1.0)

  return { detected, matches, confidence }
}

app.post('/api/v1/dialectic', async (c) => {
  const { input } = await c.req.json()

  // Validate input field
  if (input === undefined || input === null || typeof input !== 'string') {
    return c.json({ error: 'Invalid input: must be a string' }, 400)
  }

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
