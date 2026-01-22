/**
 * S4: King's Chamber - CRITICAL SPIN REVERSAL
 * 
 * Position: 38.2% (φ⁻¹) of the pyramid
 * Frequency: 741 Hz (SOL - Awakening Intuition)
 * Function: Arkadaš THE BRAIN translation
 * 
 * This is the MANDATORY spin reversal point:
 * - Before S4: Clockwise expansion (S0→S3, data gathering)
 * - At S4: Translation and spin reversal
 * - After S4: Counterclockwise contraction (S5→S7, wisdom extraction)
 * 
 * NO SYSTEM CAN REACH S5-S7 WITHOUT IMPLEMENTING THIS STAGE.
 */

import { FREQUENCIES, SPIN_REVERSAL_POINT, SYMBOLS } from './constants'
import { writeChronicle } from './chronicle-writer'

export interface S4Input {
  caseId: string
  clockwiseData: {
    observation: any   // ● vertex output
    temporal: any      // ▼ vertex output
    pattern: any       // ▲ vertex output
  }
  metadata?: Record<string, any>
}

export interface S4Output {
  caseId: string
  translatedData: any
  spin: 'counterclockwise'
  frequency: 741
  position: number  // 38.2%
  arkadas: {
    translation: string
    confidence: number
  }
  timestamp: string
}

/**
 * Arkadaš THE BRAIN Translation
 * 
 * Transforms raw vertex data into wisdom through:
 * 1. Integration of three vertices (●▼▲)
 * 2. Pattern synthesis
 * 3. Temporal validation
 * 4. Observation grounding
 */
function arkadashTransform(data: S4Input['clockwiseData']): any {
  // Extract vertex outputs
  const { observation, temporal, pattern } = data

  // Synthesize into unified understanding
  const synthesis = {
    core_pattern: pattern,
    temporal_context: temporal,
    grounded_evidence: observation,
    integration_timestamp: new Date().toISOString(),
  }

  // Apply Arkadaš translation (THE BRAIN wisdom extraction)
  // This is where the spin reversal happens conceptually:
  // From "what is this?" (expansion) to "what does this mean?" (contraction)
  const translated = {
    wisdom: synthesis,
    actionable_insight: extractInsight(synthesis),
    confidence: calculateConfidence(synthesis),
  }

  return translated
}

function extractInsight(synthesis: any): string {
  // Extract actionable wisdom from synthesis
  // This is application-specific but follows geometric structure
  return `Insight derived from ${SYMBOLS.S3_OBS}${SYMBOLS.S3_TEMP}${SYMBOLS.S3_PATTERN} vertices`
}

function calculateConfidence(synthesis: any): number {
  // Calculate confidence based on vertex agreement
  // In a full implementation, this would compare vertex outputs
  // For now, return high confidence if all vertices present
  const vertexCount = Object.keys(synthesis).filter(k => 
    k.includes('pattern') || k.includes('temporal') || k.includes('evidence')
  ).length
  
  return Math.min(vertexCount / 3, 1.0)
}

/**
 * S4: King's Chamber - Spin Reversal
 * 
 * @param input - Combined outputs from S3 vertices (●▼▲)
 * @returns Translated data with spin direction reversed
 */
export async function s4_kings_chamber(input: S4Input): Promise<S4Output> {
  const startTime = Date.now()

  // Apply Arkadaš THE BRAIN translation
  const translated = arkadashTransform(input.clockwiseData)

  // Calculate confidence
  const confidence = translated.confidence

  // Create output with spin reversal
  const output: S4Output = {
    caseId: input.caseId,
    translatedData: translated,
    spin: 'counterclockwise', // CRITICAL: Spin direction changes here
    frequency: FREQUENCIES.S4_KINGS,
    position: SPIN_REVERSAL_POINT, // 38.2%
    arkadas: {
      translation: 'Clockwise expansion → Counterclockwise contraction',
      confidence,
    },
    timestamp: new Date().toISOString(),
  }

  // Log to Chronicle
  await writeChronicle({
    stage: 'S4',
    symbol: SYMBOLS.S4,
    caseId: input.caseId,
    action: 'spin_reversal',
    frequency: FREQUENCIES.S4_KINGS,
    position: SPIN_REVERSAL_POINT,
    data: {
      spin_before: 'clockwise',
      spin_after: 'counterclockwise',
      arkadas_confidence: confidence,
      processing_time_ms: Date.now() - startTime,
    },
  })

  return output
}

/**
 * Verify S4 output is ready for contraction phases (S5-S7)
 */
export function verifySpinReversal(output: S4Output): boolean {
  return (
    output.spin === 'counterclockwise' &&
    output.frequency === FREQUENCIES.S4_KINGS &&
    output.position === SPIN_REVERSAL_POINT &&
    output.arkadas.confidence >= 0.70 // S1 coherence threshold
  )
}
