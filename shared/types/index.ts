/**
 * 📐 Shared Types - Response Advantage
 * 
 * Type definitions for dialectic reduction and geometric routing
 * 
 * @geometric-router 📐
 * @module types
 */

export interface DialecticInput {
  text: string
  context?: string
}

export interface DialecticOutput {
  original: string
  reduced: string
  pattern: string
  steps: ReductionStep[]
}

export interface ReductionStep {
  stage: '●' | '▼' | '▲' | '■'
  description: string
  transformation: string
}

export interface PatternMetadata {
  pattern_type: string
  reduction_depth: number
  timestamp: number
}

// ============================================================================
// 🌟 HEALING ARCHITECTURE TYPES
// ============================================================================

/**
 * Alchemical stages mapped to psychological transformation
 */
export type AlchemicalStage = 'Nigredo' | 'Albedo' | 'Citrinitas' | 'Rubedo'

/**
 * Psychological transformation stages
 */
export type PsychologicalStage = 
  | 'Acknowledgement'
  | 'Validation' 
  | 'Pattern Recognition'
  | 'Empowerment'

/**
 * Healing stage definition with geometric mapping
 */
export interface HealingStage {
  alchemical: AlchemicalStage
  psychological: PsychologicalStage
  geometric: string[] // S0-S7 stage identifiers
  symbols: string[] // Geometric symbols (◻, 🔷, ●, ▼, ▲, ◼, 🧠, 👑)
  frequency: number | number[] | null // Hz frequencies
  userExperience: string
  healingMechanism: string
  critical?: boolean // True for φ⁻¹ transformation point
  spinReversal?: number // 0.382 for King's Chamber
}

/**
 * Stage 1: Acknowledgement - "This happened. I'm not making it up."
 */
export interface AcknowledgementInput {
  documents?: File[] | string[]
  narrative?: string
  timeline?: string
}

export interface AcknowledgementResponse {
  documentCount: number
  timeSpan?: { start: Date | string; end: Date | string }
  witnessStatement: string // "I see 47 documents spanning 18 months"
  sovereigntyConfirmed: boolean
  stage: 'Acknowledgement'
  geometricStage: 'S0'
  symbol: '◻'
}

/**
 * Stage 2: Validation - "The law says you were wronged."
 */
export interface ValidationResult {
  coherence: number // 0.0-1.0 (threshold ≥0.70)
  legalFramework: LegalFrameworkMatch[]
  validationStatement: string // "Under Victoria Police Act s.XX..."
  stage: 'Validation'
  geometricStages: ['S1', 'S2']
  symbols: ['🔷', '🎭']
}

export interface LegalFrameworkMatch {
  statute: string
  section: string
  requirement: string
  violation: boolean
  context?: string
}

/**
 * Stage 3: Pattern Recognition - "This wasn't random. It's a pattern."
 */
export interface PatternRecognitionResult {
  pattern: PatternDetails
  similarCases: SimilarCase[]
  timeline: TimelineEvent[]
  transformationPoint: TransformationPoint
  stage: 'Pattern Recognition'
  geometricStages: ['S3', 'S4']
  symbols: ['●', '▼', '▲', '◼']
}

export interface PatternDetails {
  id: string // "Pattern #47"
  name: string // "Can Kicking"
  description?: string
  confidence: number // 0.0-1.0 (e.g., 0.94)
  matches: string[]
}

export interface SimilarCase {
  caseId: string
  similarity: number // 0.0-1.0
  description: string
  patternId?: string
}

export interface TimelineEvent {
  event: string
  date: Date | string
  patternIndicator: boolean
  significance?: string
}

export interface TransformationPoint {
  reached: boolean // φ⁻¹ threshold crossed (38.2%)
  spinReversalConfirmed: boolean // Clockwise → Counterclockwise
  arkadashTranslation?: string // THE BRAIN insight
  frequency: 741 // King's Chamber frequency (Hz)
}

/**
 * Stage 4: Empowerment - "I can do something about this."
 */
export interface EmpowermentOutput {
  documents: GeneratedDocument[]
  wisdomSeed: string // Condensed insight for future reference
  actionSteps: ActionStep[]
  empowermentStatement: string // "You have the tools. You are not powerless."
  stage: 'Empowerment'
  geometricStages: ['S5', 'S6', 'S7']
  symbols: ['🧠', '●', '👑']
}

export interface GeneratedDocument {
  type: 'FOI' | 'IBAC' | 'Legal Letter' | 'Complaint' | 'Other'
  title: string
  content: string
  readyToSend: boolean
  instructions?: string
}

export interface ActionStep {
  step: string
  order: number
  completed: boolean
  optional?: boolean
  deadline?: Date | string
}

/**
 * Complete healing journey result
 */
export interface HealingJourneyResult {
  acknowledgement: AcknowledgementResponse
  validation: ValidationResult
  patternRecognition: PatternRecognitionResult
  empowerment: EmpowermentOutput
  journeyComplete: boolean
  totalDuration?: number // milliseconds
  startTime: Date | string
  endTime: Date | string
}
