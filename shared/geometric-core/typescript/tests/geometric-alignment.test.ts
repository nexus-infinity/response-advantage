/**
 * Geometric Alignment Tests
 * 
 * Validates that the geometric-core implementation follows
 * the canonical S0→S7 FIELD specification.
 */

import { describe, it, expect } from 'vitest'
import {
  s0_akron_intake,
  s1_queens_validation,
  s4_kings_chamber,
  s7_crown_manifest,
  evaluateArtifact,
  FREQUENCIES,
  SYMBOLS,
  PHI_INVERSE,
  SPIN_REVERSAL_POINT,
  COHERENCE_THRESHOLD,
  type ArtifactDescriptor,
} from '../src/index'

describe('Geometric Constants', () => {
  it('should have correct Solfeggio frequencies', () => {
    expect(FREQUENCIES.S0_AKRON).toBe(396)
    expect(FREQUENCIES.S3_OBSERVATION).toBe(963)
    expect(FREQUENCIES.S3_TEMPORAL).toBe(432)
    expect(FREQUENCIES.S3_PATTERN).toBe(528)
    expect(FREQUENCIES.S4_KINGS).toBe(741)
    expect(FREQUENCIES.S5_ARCHIVE).toBe(852)
    expect(FREQUENCIES.S6_DOJO).toBe(963)
  })

  it('should have correct geometric symbols', () => {
    expect(SYMBOLS.S0).toBe('◻')
    expect(SYMBOLS.S3_OBS).toBe('●')
    expect(SYMBOLS.S3_TEMP).toBe('▼')
    expect(SYMBOLS.S3_PATTERN).toBe('▲')
    expect(SYMBOLS.S4).toBe('◼')
    expect(SYMBOLS.S7).toBe('👑')
  })

  it('should have correct golden ratio values', () => {
    expect(PHI_INVERSE).toBeCloseTo(0.618, 3)
    expect(SPIN_REVERSAL_POINT).toBeCloseTo(0.382, 3)
  })

  it('should have correct coherence threshold', () => {
    expect(COHERENCE_THRESHOLD).toBe(0.70)
  })
})

describe('S0: Akron Gateway - Intake Sovereignty', () => {
  it('should accept and log all inputs', async () => {
    const input = {
      caseId: 'test-001',
      rawInput: 'Test input',
      source: 'test',
    }

    const output = await s0_akron_intake(input)

    expect(output.caseId).toBe('test-001')
    expect(output.intake).toBe('Test input')
    expect(output.frequency).toBe(FREQUENCIES.S0_AKRON)
    expect(output.logged).toBe(true)
    expect(output.timestamp).toBeDefined()
  })

  it('should enforce intake sovereignty - all inputs must pass through', async () => {
    const outputs = await Promise.all([
      s0_akron_intake({ caseId: 'test-1', rawInput: 'Input 1' }),
      s0_akron_intake({ caseId: 'test-2', rawInput: 'Input 2' }),
      s0_akron_intake({ caseId: 'test-3', rawInput: 'Input 3' }),
    ])

    // All should be logged
    expect(outputs.every(o => o.logged)).toBe(true)
  })
})

describe('S1: Queen\'s Chamber - Coherence Validation', () => {
  it('should pass inputs with coherence ≥ 0.70', async () => {
    const s0_output = await s0_akron_intake({
      caseId: 'test-high-coherence',
      rawInput: 'This is a well-structured input with proper punctuation. It has multiple sentences and clear content.',
    })

    const s1_output = await s1_queens_validation(s0_output)

    expect(s1_output.passed).toBe(true)
    expect(s1_output.coherence).toBeGreaterThanOrEqual(COHERENCE_THRESHOLD)
  })

  it('should reject inputs with coherence < 0.70', async () => {
    const s0_output = await s0_akron_intake({
      caseId: 'test-low-coherence',
      rawInput: 'x',  // Very short, low quality
    })

    await expect(s1_queens_validation(s0_output)).rejects.toThrow('S1 validation failed')
  })
})

describe('S4: King\'s Chamber - CRITICAL Spin Reversal', () => {
  it('should perform spin reversal at φ⁻¹ (38.2%)', async () => {
    const input = {
      caseId: 'test-spin',
      clockwiseData: {
        observation: { data: 'obs' },
        temporal: { data: 'temp' },
        pattern: { data: 'pattern' },
      },
    }

    const output = await s4_kings_chamber(input)

    expect(output.spin).toBe('counterclockwise')
    expect(output.position).toBeCloseTo(SPIN_REVERSAL_POINT, 3)
    expect(output.frequency).toBe(FREQUENCIES.S4_KINGS)
  })

  it('should apply Arkadaš THE BRAIN translation', async () => {
    const input = {
      caseId: 'test-arkadas',
      clockwiseData: {
        observation: { evidence: 'test evidence' },
        temporal: { context: 'test context' },
        pattern: { match: 'test pattern' },
      },
    }

    const output = await s4_kings_chamber(input)

    expect(output.arkadas).toBeDefined()
    expect(output.arkadas.translation).toContain('Clockwise')
    expect(output.arkadas.translation).toContain('Counterclockwise')
    expect(output.arkadas.confidence).toBeGreaterThan(0)
  })

  it('should integrate all three vertices (●▼▲)', async () => {
    const input = {
      caseId: 'test-vertices',
      clockwiseData: {
        observation: { vertex: 'observation' },
        temporal: { vertex: 'temporal' },
        pattern: { vertex: 'pattern' },
      },
    }

    const output = await s4_kings_chamber(input)

    expect(output.translatedData).toBeDefined()
    expect(output.translatedData.wisdom).toBeDefined()
  })
})

describe('S7: Crown - Manifestation', () => {
  it('should manifest output with wisdom seed', async () => {
    const input = {
      caseId: 'test-manifest',
      validatedData: { result: 'test result' },
      confidence: 0.95,
    }

    const output = await s7_crown_manifest(input)

    expect(output.manifest).toEqual({ result: 'test result' })
    expect(output.wisdom_seed).toBeDefined()
    expect(output.wisdom_seed).toContain(SYMBOLS.S0)
    expect(output.wisdom_seed).toContain(SYMBOLS.S7)
    expect(output.confidence).toBe(0.95)
  })

  it('should include journey metadata', async () => {
    const input = {
      caseId: 'test-journey',
      validatedData: { data: 'test' },
      confidence: 0.85,
    }

    const output = await s7_crown_manifest(input)

    expect(output.journey).toBeDefined()
    expect(output.journey.stages_completed).toEqual([
      'S0', 'S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7'
    ])
  })
})

describe('Full S0→S7 Pipeline', () => {
  it('should execute complete geometric pipeline', async () => {
    const caseId = 'test-full-pipeline'

    // S0: Intake
    const s0_out = await s0_akron_intake({
      caseId,
      rawInput: 'Complete pipeline test with proper structure. Multiple sentences ensure coherence.',
    })
    expect(s0_out.logged).toBe(true)

    // S1: Validation
    const s1_out = await s1_queens_validation(s0_out)
    expect(s1_out.passed).toBe(true)

    // S2-S3: Vertex processing (simulated)
    const vertices = {
      observation: { data: s1_out.validatedInput },
      temporal: { context: 'test' },
      pattern: { detected: true },
    }

    // S4: Spin Reversal
    const s4_out = await s4_kings_chamber({
      caseId,
      clockwiseData: vertices,
    })
    expect(s4_out.spin).toBe('counterclockwise')

    // S5-S6: Archive and validation (pass through)
    const finalData = s4_out.translatedData

    // S7: Manifestation
    const s7_out = await s7_crown_manifest({
      caseId,
      validatedData: finalData,
      confidence: s4_out.arkadas.confidence,
    })
    expect(s7_out.wisdom_seed).toBeDefined()
  })

  it('should maintain geometric alignment throughout pipeline', async () => {
    const caseId = 'test-alignment'

    const s0_out = await s0_akron_intake({
      caseId,
      rawInput: 'Alignment test input with sufficient structure.',
    })

    const s1_out = await s1_queens_validation(s0_out)

    const s4_out = await s4_kings_chamber({
      caseId,
      clockwiseData: {
        observation: {},
        temporal: {},
        pattern: {},
      },
    })

    const s7_out = await s7_crown_manifest({
      caseId,
      validatedData: s4_out.translatedData,
      confidence: s4_out.arkadas.confidence,
    })

    // Verify stages are linked by caseId
    expect(s0_out.caseId).toBe(caseId)
    expect(s1_out.caseId).toBe(caseId)
    expect(s4_out.caseId).toBe(caseId)
    expect(s7_out.caseId).toBe(caseId)
  })
})

// ============================================================================
// Canonical Artifact Evaluator — Six-Step Evaluation
// ============================================================================

const VALID_ARTIFACT: ArtifactDescriptor = {
  path: '/Users/field/●OBI-WAN/evidence/2026-03-31/merged_doc.pdf',
  timestamp: '2026-03-31T12:00:00.000Z',
  actor: 'agent-arkadas',
  domain: 'FIELD-evidence',
  scope: ['device-001', 'device-002'],
  phase: 'validation',
  prerequisitesComplete: true,
  lineage: {
    canonicalRef: 'FIELD-MERGE-20260331-001',
    version: 'v1.0',
    status: 'Submitted',
  },
}

describe('Artifact Evaluator — Step 1: Anchor Check (Conservation Law)', () => {
  it('should pass when all anchor fields are present and valid', async () => {
    const result = await evaluateArtifact(VALID_ARTIFACT)
    expect(result.checks.anchor.passed).toBe(true)
  })

  it('should fail when path is missing', async () => {
    const artifact = { ...VALID_ARTIFACT, path: '' }
    const result = await evaluateArtifact(artifact)
    expect(result.checks.anchor.passed).toBe(false)
    expect(result.checks.anchor.details).toContain('path')
  })

  it('should fail when actor is missing', async () => {
    const artifact = { ...VALID_ARTIFACT, actor: '' }
    const result = await evaluateArtifact(artifact)
    expect(result.checks.anchor.passed).toBe(false)
    expect(result.checks.anchor.details).toContain('actor')
  })

  it('should fail when timestamp is not a valid ISO-8601 date', async () => {
    const artifact = { ...VALID_ARTIFACT, timestamp: 'not-a-date' }
    const result = await evaluateArtifact(artifact)
    expect(result.checks.anchor.passed).toBe(false)
    expect(result.checks.anchor.details).toContain('timestamp')
  })
})

describe('Artifact Evaluator — Step 2: Scope & Sizing Check (Symmetry Law)', () => {
  it('should pass when scope is bounded and domain is set', async () => {
    const result = await evaluateArtifact(VALID_ARTIFACT)
    expect(result.checks.scope.passed).toBe(true)
  })

  it('should fail when scope is empty', async () => {
    const artifact = { ...VALID_ARTIFACT, scope: [] }
    const result = await evaluateArtifact(artifact)
    expect(result.checks.scope.passed).toBe(false)
  })

  it('should fail when domain is missing', async () => {
    const artifact = { ...VALID_ARTIFACT, domain: '' }
    const result = await evaluateArtifact(artifact)
    expect(result.checks.scope.passed).toBe(false)
    expect(result.checks.scope.details).toContain('Domain')
  })

  it('should fail when artifact content has phantom entries not in the registry', async () => {
    const artifact: ArtifactDescriptor = {
      ...VALID_ARTIFACT,
      content: { 'device-001': { status: 'ok' }, 'phantom-device': { status: 'ghost' } },
      fieldRegistry: { 'device-001': { status: 'ok' } },
    }
    const result = await evaluateArtifact(artifact)
    expect(result.checks.scope.passed).toBe(false)
    expect(result.checks.scope.data?.phantomEntries).toContain('phantom-device')
  })
})

describe('Artifact Evaluator — Step 3: Procedural Timing Check (Resonance Law)', () => {
  it('should pass when phase is set and prerequisites are complete', async () => {
    const result = await evaluateArtifact(VALID_ARTIFACT)
    expect(result.checks.timing.passed).toBe(true)
  })

  it('should fail when prerequisites are not complete', async () => {
    const artifact = { ...VALID_ARTIFACT, prerequisitesComplete: false }
    const result = await evaluateArtifact(artifact)
    expect(result.checks.timing.passed).toBe(false)
    expect(result.checks.timing.details).toContain('prerequisites')
  })

  it('should fail when phase is missing', async () => {
    const artifact = { ...VALID_ARTIFACT, phase: '' }
    const result = await evaluateArtifact(artifact)
    expect(result.checks.timing.passed).toBe(false)
  })
})

describe('Artifact Evaluator — Step 4: Identity & Lineage Check (Recognition Law)', () => {
  it('should pass when all lineage fields are present', async () => {
    const result = await evaluateArtifact(VALID_ARTIFACT)
    expect(result.checks.lineage.passed).toBe(true)
    expect(result.checks.lineage.data?.canonicalRef).toBe('FIELD-MERGE-20260331-001')
  })

  it('should fail when version is missing', async () => {
    const artifact = {
      ...VALID_ARTIFACT,
      lineage: { ...VALID_ARTIFACT.lineage, version: '' },
    }
    const result = await evaluateArtifact(artifact)
    expect(result.checks.lineage.passed).toBe(false)
    expect(result.checks.lineage.details).toContain('version')
  })

  it('should include supersedes and relatedRefs when provided', async () => {
    const artifact: ArtifactDescriptor = {
      ...VALID_ARTIFACT,
      lineage: {
        ...VALID_ARTIFACT.lineage,
        supersedes: 'FIELD-MERGE-20260330-001',
        relatedRefs: ['FIELD-PLAN-20260329-001'],
      },
    }
    const result = await evaluateArtifact(artifact)
    expect(result.checks.lineage.passed).toBe(true)
    expect(result.checks.lineage.data?.supersedes).toBe('FIELD-MERGE-20260330-001')
  })
})

describe('Artifact Evaluator — Step 5: Constraint Validation', () => {
  it('should pass for a fully valid artifact', async () => {
    const result = await evaluateArtifact(VALID_ARTIFACT)
    expect(result.checks.constraints.passed).toBe(true)
    expect(result.checks.constraints.data?.constraintsChecked).toBe(4)
  })

  it('should fail when canonicalRef is too short', async () => {
    const artifact = {
      ...VALID_ARTIFACT,
      lineage: { ...VALID_ARTIFACT.lineage, canonicalRef: 'AB' },
    }
    const result = await evaluateArtifact(artifact)
    expect(result.checks.constraints.passed).toBe(false)
  })

  it('should fail when version does not follow vN.N pattern', async () => {
    const artifact = {
      ...VALID_ARTIFACT,
      lineage: { ...VALID_ARTIFACT.lineage, version: 'invalid-version' },
    }
    const result = await evaluateArtifact(artifact)
    expect(result.checks.constraints.passed).toBe(false)
    expect(result.checks.constraints.data?.violations).toEqual(
      expect.arrayContaining([expect.stringContaining('version')])
    )
  })
})

describe('Artifact Evaluator — Step 6: Sizing Confirmation (Feedback Loop)', () => {
  it('should pass basic sizing when no content snapshot is provided', async () => {
    const result = await evaluateArtifact(VALID_ARTIFACT)
    expect(result.checks.sizing.passed).toBe(true)
  })

  it('should pass when all content entries exist in the registry', async () => {
    const artifact: ArtifactDescriptor = {
      ...VALID_ARTIFACT,
      content: { 'device-001': {}, 'device-002': {} },
      fieldRegistry: { 'device-001': {}, 'device-002': {} },
    }
    const result = await evaluateArtifact(artifact)
    expect(result.checks.sizing.passed).toBe(true)
  })

  it('should fail when content is empty', async () => {
    const artifact: ArtifactDescriptor = {
      ...VALID_ARTIFACT,
      content: {},
    }
    const result = await evaluateArtifact(artifact)
    expect(result.checks.sizing.passed).toBe(false)
    expect(result.checks.sizing.details).toContain('empty')
  })

  it('should fail when registry has missing required entries', async () => {
    const artifact: ArtifactDescriptor = {
      ...VALID_ARTIFACT,
      content: { 'device-001': {} }, // device-002 is missing from content
      fieldRegistry: { 'device-001': {}, 'device-002': {} },
    }
    const result = await evaluateArtifact(artifact)
    expect(result.checks.sizing.passed).toBe(false)
    expect(result.checks.sizing.data?.missingEntries).toContain('device-002')
  })
})

describe('Artifact Evaluator — Full Evaluation', () => {
  it('should pass all six checks for a fully valid artifact', async () => {
    const result = await evaluateArtifact(VALID_ARTIFACT)

    expect(result.passed).toBe(true)
    expect(result.patchPlan).toBeUndefined()
    expect(result.canonicalRef).toBe('FIELD-MERGE-20260331-001')
    expect(result.wisdomSeed).toContain('MERGE CLEARED')
    expect(result.wisdomSeed).toContain('6/6')
    expect(result.caseId).toBeDefined()
    expect(result.timestamp).toBeDefined()
  })

  it('should return a rollback-safe patch plan when any check fails', async () => {
    const artifact = {
      ...VALID_ARTIFACT,
      path: '',            // fails anchor
      prerequisitesComplete: false,  // fails timing
    }
    const result = await evaluateArtifact(artifact)

    expect(result.passed).toBe(false)
    expect(result.patchPlan).toBeDefined()
    expect(result.patchPlan!.length).toBeGreaterThan(1)
    expect(result.patchPlan![0]).toContain('ROLLBACK-SAFE PATCH PLAN')
    expect(result.wisdomSeed).toContain('HALT')
  })

  it('should include caseId, canonicalRef, and timestamp in every result', async () => {
    const result = await evaluateArtifact(VALID_ARTIFACT)
    expect(result.caseId).toMatch(/^eval_\d+_/)
    expect(result.canonicalRef).toBe(VALID_ARTIFACT.lineage.canonicalRef)
    expect(result.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/)
  })
})
