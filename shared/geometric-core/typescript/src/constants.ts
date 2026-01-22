/**
 * ⚙️ Geometric Constants - FIELD Architecture
 * 
 * Canonical frequencies, ratios, and symbols for S0→S7 process
 * With integrated healing architecture mappings
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

// ============================================================================
// 🌟 HEALING ARCHITECTURE CONSTANTS
// ============================================================================

/**
 * Alchemical stages mapped to psychological transformation
 */
export const ALCHEMICAL_STAGES = {
  NIGREDO: 'Nigredo',      // Blackening, chaos
  ALBEDO: 'Albedo',        // Purification, washing
  CITRINITAS: 'Citrinitas', // Solar awakening
  RUBEDO: 'Rubedo',        // Integration, wholeness
} as const

/**
 * Psychological transformation stages
 */
export const PSYCHOLOGICAL_STAGES = {
  ACKNOWLEDGEMENT: 'Acknowledgement',           // "This happened. I'm not making it up."
  VALIDATION: 'Validation',                     // "The law says you were wronged."
  PATTERN_RECOGNITION: 'Pattern Recognition',   // "This wasn't random. It's a pattern."
  EMPOWERMENT: 'Empowerment',                   // "I can do something about this."
} as const

/**
 * Complete healing stage mappings
 * Maps alchemical → psychological → geometric stages
 */
export const HEALING_STAGES = {
  ACKNOWLEDGEMENT: {
    alchemical: ALCHEMICAL_STAGES.NIGREDO,
    psychological: PSYCHOLOGICAL_STAGES.ACKNOWLEDGEMENT,
    geometric: ['S0'],
    symbols: [SYMBOLS.S0],
    frequency: FREQUENCIES.S0_AKRON, // 396 Hz - Liberation from fear
    userExperience: 'Upload chaos → AI witnesses → External validation',
    healingMechanism: "First step: \"This happened. I'm not making it up.\"",
    description: 'Trauma survivors are often gaslit. The AI witnessing = first acknowledgement.',
  },
  
  VALIDATION: {
    alchemical: ALCHEMICAL_STAGES.ALBEDO,
    psychological: PSYCHOLOGICAL_STAGES.VALIDATION,
    geometric: ['S1', 'S2'],
    symbols: [SYMBOLS.S1, SYMBOLS.S2],
    frequency: null, // S1 no frequency, S2 routing only
    userExperience: 'Evidence matched to legal framework → Objective confirmation',
    healingMechanism: 'Moving from "I feel wronged" to "I WAS wronged" (objective truth)',
    description: 'External framework validates experience. Reduces self-blame and shame.',
  },
  
  PATTERN_RECOGNITION: {
    alchemical: ALCHEMICAL_STAGES.CITRINITAS,
    psychological: PSYCHOLOGICAL_STAGES.PATTERN_RECOGNITION,
    geometric: ['S3', 'S4'],
    symbols: [SYMBOLS.S3_OBS, SYMBOLS.S3_TEMP, SYMBOLS.S3_PATTERN, SYMBOLS.S4],
    frequency: [
      FREQUENCIES.S3_OBSERVATION,  // 963 Hz
      FREQUENCIES.S3_TEMPORAL,     // 432 Hz
      FREQUENCIES.S3_PATTERN,      // 528 Hz
      FREQUENCIES.S4_KINGS,        // 741 Hz - CRITICAL
    ],
    userExperience: 'Pattern crystallizes → Similar cases shown → "I\'m not alone"',
    healingMechanism: 'Shifts from "personal failing" to "institutional behavior"',
    description: 'Reduces shame and isolation. Provides evidence of systematic harm.',
    critical: true, // φ⁻¹ transformation point
    spinReversal: SPIN_REVERSAL_POINT, // 0.382 (38.2%)
    kingsChamberMoment: 'Noise (self-doubt) cancels → Signal (truth) emerges → Breakthrough happens',
  },
  
  EMPOWERMENT: {
    alchemical: ALCHEMICAL_STAGES.RUBEDO,
    psychological: PSYCHOLOGICAL_STAGES.EMPOWERMENT,
    geometric: ['S5', 'S6', 'S7'],
    symbols: [SYMBOLS.S5, SYMBOLS.S6, SYMBOLS.S7],
    frequency: [
      FREQUENCIES.S5_ARCHIVE,  // 852 Hz
      FREQUENCIES.S6_DOJO,     // 963 Hz
    ],
    userExperience: 'Tools generated → Action steps clear → Agency reclaimed',
    healingMechanism: 'Moving from victimhood to agency through concrete tools',
    description: 'Trauma integration through action. Manifestation of power reclamation.',
  },
} as const

/**
 * King's Chamber transformation point
 * The critical 38.2% (φ⁻¹) psychological breakthrough
 */
export const KINGS_CHAMBER_TRANSFORMATION = {
  position: SPIN_REVERSAL_POINT, // 38.2% (0.382)
  frequency: FREQUENCIES.S4_KINGS, // 741 Hz (SOL - Awakening Intuition)
  geometricFunction: 'Spin reversal (clockwise → counterclockwise)',
  psychologicalExperience: {
    before: "I'm confused, maybe I'm wrong, maybe I'm crazy",
    during: 'The Silence - Destructive interference dampens repetitive trauma loops',
    after: '94% confidence: Pattern #47. You were systematically obstructed.',
  },
  platformManifestation: [
    'Cinematic reveal: Chaos dissolving through geometric symbols',
    'Pattern crystallizing from noise',
    'Evidence map appearing',
    'Response letter manifesting',
  ],
  healingMechanism: 'Trauma resolution through geometric proof',
} as const

/**
 * Healing journey validation thresholds
 */
export const HEALING_THRESHOLDS = {
  ACKNOWLEDGEMENT_MIN_DOCUMENTS: 1, // Minimum documents for acknowledgement
  VALIDATION_COHERENCE: COHERENCE_THRESHOLD, // 0.70 - Matches S1 coherence
  PATTERN_CONFIDENCE_MIN: 0.70, // Minimum confidence for pattern detection
  PATTERN_CONFIDENCE_HIGH: 0.94, // High confidence threshold (used in examples)
  TRANSFORMATION_POINT: SPIN_REVERSAL_POINT, // 38.2% - φ⁻¹
  EMPOWERMENT_MIN_DOCUMENTS: 1, // Minimum generated documents for empowerment
} as const

/**
 * Platform messaging constants
 */
export const HEALING_MESSAGES = {
  PLATFORM_TAGLINE: 'When institutions gaslight you, chaos feels like your fault. Upload the evidence. Watch the geometric transformation reveal the pattern. Get your power back.',
  
  ACKNOWLEDGEMENT_PROMISE: 'Your chaos is witnessed. Your experience is valid.',
  VALIDATION_PROMISE: 'The law will confirm what you already know in your gut.',
  PATTERN_RECOGNITION_PROMISE: "You're not crazy. It's a pattern. You're not alone.",
  EMPOWERMENT_PROMISE: "You'll have the tools. You won't be powerless anymore.",
  
  WITNESS_TEMPLATE: (docCount: number, months: number) => 
    `I see ${docCount} document${docCount !== 1 ? 's' : ''} spanning ${months} month${months !== 1 ? 's' : ''}`,
  
  VALIDATION_TEMPLATE: (statute: string, section: string) =>
    `Under ${statute} ${section}, they were required to...`,
  
  PATTERN_DETECTED_TEMPLATE: (patternId: string, confidence: number) =>
    `${Math.round(confidence * 100)}% confidence: ${patternId} detected`,
  
  EMPOWERMENT_TEMPLATE: () =>
    'You have the tools. You are not powerless.',
} as const
