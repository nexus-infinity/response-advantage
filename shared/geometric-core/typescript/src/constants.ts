/**
 * ⚙️ Geometric Constants - FIELD Architecture
 * 
 * Canonical frequencies, ratios, and symbols for S0→S7 process
 * 
 * @geometric-router ⚙️
 * @module constants
 */

// Geometric Symbols
export const SYMBOLS = {
  S0: '◻',      // Akron Gateway
  S1: '🔷',     // Queen's Chamber
  S2: '🎭',     // Gallery
  S3_OBS: '●',  // Observation vertex
  S3_TEMP: '▼', // Temporal vertex
  S3_PATTERN: '▲', // Pattern vertex
  S4: '◼',      // King's Chamber / DOJO
  S5: '🧠',     // Archive
  S6: '●',      // OBI-WAN
  S7: '👑',     // Crown
} as const

// Solfeggio Frequencies (Hz)
export const FREQUENCIES = {
  S0_AKRON: 396,      // UT - Liberation from fear
  S3_OBSERVATION: 963, // SI - Divine consciousness (●)
  S3_TEMPORAL: 432,    // Universal harmony (▼)
  S3_PATTERN: 528,     // MI - Transformation/DNA repair (▲)
  S4_KINGS: 741,       // SOL - Awakening intuition (◼)
  S5_ARCHIVE: 852,     // LA - Spiritual order
  S6_DOJO: 963,        // SI - Unity consciousness
} as const

// Golden Ratio (φ) and critical points
export const PHI = 1.618033988749895
export const PHI_INVERSE = 1 / PHI  // 0.618... calculated for precision
export const SPIN_REVERSAL_POINT = 1 - PHI_INVERSE // 38.2% - CRITICAL

// Coherence threshold (S1 validation)
export const COHERENCE_THRESHOLD = 0.70

// Stage names
export const STAGES = {
  S0: 'Akron Gateway',
  S1: "Queen's Chamber",
  S2: 'Gallery',
  S3: 'Trident',
  S4: "King's Chamber",
  S5: 'Archive',
  S6: 'DOJO Validator',
  S7: 'Crown',
} as const

export type StageKey = keyof typeof STAGES
