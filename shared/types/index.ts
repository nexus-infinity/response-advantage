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
