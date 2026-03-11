/**
 * Component Type Definitions
 * 
 * Type definitions for Response Advantage frontend components,
 * aligned with the sacred geometric S0-S7 architecture.
 */

/**
 * Geometric Stage
 * 
 * Maps to the S0-S7 canonical process defined in GEOMETRIC_SPEC.md
 */
export type GeometricStage = 'S0' | 'S1' | 'S2' | 'S3' | 'S4' | 'S5' | 'S6' | 'S7';

/**
 * Alchemical Stage
 * 
 * The four classical alchemical transformation stages
 */
export type AlchemicalStage = 'Nigredo' | 'Albedo' | 'Citrinitas' | 'Rubedo';

/**
 * Healing Stage Symbol
 * 
 * Sacred geometric symbols representing the four vertices
 */
export type HealingSymbol = '●' | '▼' | '▲' | '◼';

/**
 * Psychological Process
 * 
 * The four psychological transformations in the healing journey
 */
export type PsychologicalProcess = 'Acknowledgement' | 'Validation' | 'Pattern Recognition' | 'Empowerment';

/**
 * Healing Stage Data
 * 
 * Complete data for a single stage in the healing journey
 */
export interface HealingStageData {
  symbol: HealingSymbol;
  title: string;
  subtitle: PsychologicalProcess;
  description: string;
  note?: string;
  isActive?: boolean;
  alchemicalStage: AlchemicalStage;
  geometricStages: GeometricStage[];
  frequency?: number; // Hz for the stage
}
