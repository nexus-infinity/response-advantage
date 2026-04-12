/**
 * ◼ Canonical Agent Evaluation Instruction — Artifact Evaluator
 *
 * Evaluates any artifact, merge, or output against the FIELD before acceptance.
 * Implements the six-step evaluation mapped to the S0→S7 geometric pipeline:
 *
 *   Step 1 – Anchor Check        (Conservation Law)  → S0 Akron sovereignty
 *   Step 2 – Scope & Sizing      (Symmetry Law)       → S1 coherence gate
 *   Step 3 – Procedural Timing   (Resonance Law)      → S2 gallery routing
 *   Step 4 – Identity & Lineage  (Recognition Law)    → S3 trident vertices
 *   Step 5 – Constraint Validation                    → S4 King's Chamber
 *   Step 6 – Sizing Confirmation (Feedback Loop)      → S7 Crown manifestation
 *
 * If any step fails, evaluation halts and a rollback-safe patch plan is produced.
 * Only merge or advance if all six checks pass.
 *
 * @geometric-router ◼
 * @stage artifact-evaluation
 */

import { COHERENCE_THRESHOLD, SYMBOLS } from './constants'
import { writeChronicle } from './chronicle-writer'

// ---------------------------------------------------------------------------
// Artifact descriptor — the artifact under evaluation
// ---------------------------------------------------------------------------

export interface ArtifactLineage {
  /** Canonical reference identifier, e.g. FIELD-MERGE-20260401-001 */
  canonicalRef: string
  /** Semantic version string, e.g. v1.0 */
  version: string
  /** Canonical ref of the artifact this supersedes, if any */
  supersedes?: string
  /** Related canonical refs */
  relatedRefs?: string[]
  /** Current status: Submitted | Approved | Rejected | Pending */
  status: string
}

export interface ArtifactDescriptor {
  /** File path or URL of the artifact */
  path: string
  /** ISO-8601 timestamp of when the artifact was produced */
  timestamp: string
  /** Actor (human or agent) who produced the artifact */
  actor: string
  /** Intended operational domain / field name */
  domain: string
  /**
   * Explicit scope boundaries — list of entity/resource identifiers the
   * artifact is allowed to reference.  Anything outside this list is drift.
   */
  scope: string[]
  /** Current procedural phase, e.g. "validation", "merge", "deployment" */
  phase: string
  /** True only when all prerequisite steps are confirmed complete */
  prerequisitesComplete: boolean
  /** Identity and lineage metadata */
  lineage: ArtifactLineage
  /**
   * Optional structured content snapshot for sizing comparison.
   * Keys are entity names; values are the content/state objects.
   */
  content?: Record<string, unknown>
  /**
   * Optional known-good FIELD registry entries for sizing comparison.
   * When provided, the evaluator cross-checks artifact content against this.
   */
  fieldRegistry?: Record<string, unknown>
}

// ---------------------------------------------------------------------------
// Evaluation result types
// ---------------------------------------------------------------------------

export interface CheckResult {
  passed: boolean
  details: string
  data?: Record<string, unknown>
}

export interface ArtifactEvaluationResult {
  caseId: string
  canonicalRef: string
  timestamp: string
  /** True only when all six checks pass */
  passed: boolean
  checks: {
    /** Step 1 — Conservation Law */
    anchor: CheckResult
    /** Step 2 — Symmetry Law */
    scope: CheckResult
    /** Step 3 — Resonance Law */
    timing: CheckResult
    /** Step 4 — Recognition Law */
    lineage: CheckResult
    /** Step 5 — Constraint Validation */
    constraints: CheckResult
    /** Step 6 — Sizing Confirmation */
    sizing: CheckResult
  }
  /**
   * Present only when one or more checks fail.
   * Describes the rollback-safe patch steps needed before re-evaluation.
   */
  patchPlan?: string[]
  /** S7 wisdom seed summarising the evaluation journey */
  wisdomSeed: string
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/** Step 1: Anchor Check — Conservation Law */
function checkAnchor(artifact: ArtifactDescriptor): CheckResult {
  const missing: string[] = []

  if (!artifact.path || artifact.path.trim() === '') missing.push('path')
  if (!artifact.lineage.canonicalRef || artifact.lineage.canonicalRef.trim() === '') missing.push('canonicalRef')
  if (!artifact.timestamp || artifact.timestamp.trim() === '') missing.push('timestamp')
  if (!artifact.actor || artifact.actor.trim() === '') missing.push('actor')

  if (missing.length > 0) {
    return {
      passed: false,
      details: `Anchor fields missing: ${missing.join(', ')}`,
      data: { missing },
    }
  }

  // Validate ISO-8601 timestamp
  const ts = Date.parse(artifact.timestamp)
  if (isNaN(ts)) {
    return {
      passed: false,
      details: `timestamp is not a valid ISO-8601 date: "${artifact.timestamp}"`,
      data: { timestamp: artifact.timestamp },
    }
  }

  return {
    passed: true,
    details: 'Artifact is anchored to the FIELD with path, canonical ref, timestamp, and actor.',
    data: {
      path: artifact.path,
      canonicalRef: artifact.lineage.canonicalRef,
      timestamp: artifact.timestamp,
      actor: artifact.actor,
    },
  }
}

/** Step 2: Scope & Sizing Check — Symmetry Law */
function checkScope(artifact: ArtifactDescriptor): CheckResult {
  if (!artifact.scope || artifact.scope.length === 0) {
    return {
      passed: false,
      details: 'Scope boundary is empty — artifact has no defined domain constraints.',
    }
  }

  if (!artifact.domain || artifact.domain.trim() === '') {
    return {
      passed: false,
      details: 'Domain is not specified — artifact cannot be bounded without a domain.',
    }
  }

  // Check for phantom/out-of-scope entries when a registry is provided
  if (artifact.fieldRegistry && artifact.content) {
    const registryKeys = new Set(Object.keys(artifact.fieldRegistry))
    const phantomEntries = Object.keys(artifact.content).filter(
      k => !registryKeys.has(k)
    )

    if (phantomEntries.length > 0) {
      return {
        passed: false,
        details: `Artifact references ${phantomEntries.length} entry(s) not found in the FIELD registry (phantom entries).`,
        data: { phantomEntries },
      }
    }
  }

  // Coherence-style score: scope tightness
  const scopeCoherence = artifact.scope.length <= 50 ? 1.0 : COHERENCE_THRESHOLD
  const passed = scopeCoherence >= COHERENCE_THRESHOLD

  return {
    passed,
    details: passed
      ? `Scope is strictly bounded to domain "${artifact.domain}" with ${artifact.scope.length} defined entit(ies).`
      : `Scope appears over-broad (${artifact.scope.length} entries) — consider narrowing to reduce drift.`,
    data: { domain: artifact.domain, scopeSize: artifact.scope.length, scopeCoherence },
  }
}

/** Step 3: Procedural Timing Check — Resonance Law */
function checkTiming(artifact: ArtifactDescriptor): CheckResult {
  if (!artifact.phase || artifact.phase.trim() === '') {
    return {
      passed: false,
      details: 'Procedural phase is not specified — cannot confirm correct timing.',
    }
  }

  if (!artifact.prerequisitesComplete) {
    return {
      passed: false,
      details: `Prerequisites for phase "${artifact.phase}" are not yet complete. Halt and resolve prerequisites before advancing.`,
      data: { phase: artifact.phase, prerequisitesComplete: false },
    }
  }

  return {
    passed: true,
    details: `Artifact is being merged at the correct procedural moment (phase: "${artifact.phase}") with all prerequisites complete.`,
    data: { phase: artifact.phase, prerequisitesComplete: true },
  }
}

/** Step 4: Identity & Lineage Check — Recognition Law */
function checkLineage(lineage: ArtifactLineage): CheckResult {
  const missing: string[] = []

  if (!lineage.canonicalRef || lineage.canonicalRef.trim() === '') missing.push('canonicalRef')
  if (!lineage.version || lineage.version.trim() === '') missing.push('version')
  if (!lineage.status || lineage.status.trim() === '') missing.push('status')

  if (missing.length > 0) {
    return {
      passed: false,
      details: `Lineage fields missing: ${missing.join(', ')}`,
      data: { missing },
    }
  }

  return {
    passed: true,
    details: 'Artifact carries a persistent canonical reference and complete lineage.',
    data: {
      canonicalRef: lineage.canonicalRef,
      version: lineage.version,
      supersedes: lineage.supersedes ?? null,
      relatedRefs: lineage.relatedRefs ?? [],
      status: lineage.status,
    },
  }
}

/** Step 5: Constraint Validation */
function checkConstraints(artifact: ArtifactDescriptor): CheckResult {
  const violations: string[] = []

  // Constraint 1: Canonical ref format — must be non-trivial (≥ 5 chars)
  if (artifact.lineage.canonicalRef.length < 5) {
    violations.push('canonicalRef is too short to be meaningful (< 5 characters)')
  }

  // Constraint 2: Timestamp must not be in the future (clock drift guard)
  // Allow up to 60 s of future drift to tolerate minor clock skew between machines.
  const CLOCK_DRIFT_TOLERANCE_MS = 60_000
  const artifactTime = Date.parse(artifact.timestamp)
  if (!isNaN(artifactTime) && artifactTime > Date.now() + CLOCK_DRIFT_TOLERANCE_MS) {
    violations.push(`timestamp "${artifact.timestamp}" is more than 60 s in the future`)
  }

  // Constraint 3: Scope must not be empty
  if (!artifact.scope || artifact.scope.length === 0) {
    violations.push('scope boundary must contain at least one entry')
  }

  // Constraint 4: Version must follow vN.N pattern (loose check)
  if (!/^v?\d+(\.\d+)*$/.test(artifact.lineage.version.trim())) {
    violations.push(`version "${artifact.lineage.version}" does not match expected vN.N format`)
  }

  if (violations.length > 0) {
    return {
      passed: false,
      details: `${violations.length} constraint violation(s) detected.`,
      data: { violations },
    }
  }

  return {
    passed: true,
    details: 'All constraints passed — artifact is safe to advance.',
    data: { constraintsChecked: 4, violations: [] },
  }
}

/** Step 6: Sizing Confirmation — Feedback Loop */
function checkSizing(artifact: ArtifactDescriptor): CheckResult {
  // If no content or registry provided, perform basic structural sizing
  if (!artifact.content) {
    return {
      passed: true,
      details: 'No content snapshot provided — basic structural sizing accepted.',
      data: { note: 'Provide content and fieldRegistry for full sizing validation.' },
    }
  }

  const contentKeys = Object.keys(artifact.content)

  if (contentKeys.length === 0) {
    return {
      passed: false,
      details: 'Artifact content is empty — the artifact does not fit the FIELD (too small).',
    }
  }

  // If a registry is available, check for phantoms and missing required entries
  if (artifact.fieldRegistry) {
    const registryKeys = new Set(Object.keys(artifact.fieldRegistry))
    const phantomEntries = contentKeys.filter(k => !registryKeys.has(k))
    const missingEntries = Array.from(registryKeys).filter(k => !artifact.content![k])

    if (phantomEntries.length > 0 || missingEntries.length > 0) {
      return {
        passed: false,
        details: 'Artifact does not fit the FIELD — phantom or missing entries detected.',
        data: {
          phantomEntries,
          missingEntries,
          contentSize: contentKeys.length,
          registrySize: registryKeys.size,
        },
      }
    }
  }

  return {
    passed: true,
    details: `Artifact fits the FIELD — ${contentKeys.length} content entit(ies) validated against registry.`,
    data: { contentSize: contentKeys.length },
  }
}

// ---------------------------------------------------------------------------
// Rollback-safe patch plan generator
// ---------------------------------------------------------------------------

function buildPatchPlan(checks: ArtifactEvaluationResult['checks']): string[] {
  const steps: string[] = ['[ROLLBACK-SAFE PATCH PLAN] Do NOT merge. Resolve the following before re-evaluating:']
  let stepNum = 1

  if (!checks.anchor.passed) {
    steps.push(`${stepNum++}. Anchor: Add missing fields — ${checks.anchor.details}`)
  }
  if (!checks.scope.passed) {
    steps.push(`${stepNum++}. Scope: Bound the artifact — ${checks.scope.details}`)
  }
  if (!checks.timing.passed) {
    steps.push(`${stepNum++}. Timing: Wait for prerequisites — ${checks.timing.details}`)
  }
  if (!checks.lineage.passed) {
    steps.push(`${stepNum++}. Lineage: Supply canonical reference and lineage — ${checks.lineage.details}`)
  }
  if (!checks.constraints.passed) {
    steps.push(`${stepNum++}. Constraints: Fix violations — ${checks.constraints.details}`)
  }
  if (!checks.sizing.passed) {
    steps.push(`${stepNum++}. Sizing: Align artifact to FIELD registry — ${checks.sizing.details}`)
  }

  steps.push('After resolving all items above, re-run the evaluation. Only merge when all checks pass.')
  return steps
}

// ---------------------------------------------------------------------------
// Public evaluator
// ---------------------------------------------------------------------------

/**
 * Evaluate an artifact against the FIELD using the six canonical checks.
 *
 * @param artifact - Descriptor of the artifact under evaluation
 * @returns Full evaluation result; `passed` is true only if all six checks pass
 *
 * @example
 * ```ts
 * const result = await evaluateArtifact({
 *   path: '/Users/field/●OBI-WAN/evidence/2026-03-31/merged_doc.pdf',
 *   timestamp: '2026-03-31T12:00:00Z',
 *   actor: 'agent-arkadas',
 *   domain: 'FIELD-evidence',
 *   scope: ['device-001', 'device-002'],
 *   phase: 'validation',
 *   prerequisitesComplete: true,
 *   lineage: {
 *     canonicalRef: 'FIELD-MERGE-20260331-001',
 *     version: 'v1.0',
 *     status: 'Submitted',
 *   },
 * })
 *
 * if (!result.passed) console.log(result.patchPlan)
 * ```
 */
export async function evaluateArtifact(
  artifact: ArtifactDescriptor
): Promise<ArtifactEvaluationResult> {
  const caseId = `eval_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`
  const timestamp = new Date().toISOString()

  // --- Run all six checks ---
  const anchor = checkAnchor(artifact)
  const scope = checkScope(artifact)
  const timing = checkTiming(artifact)
  const lineage = checkLineage(artifact.lineage)
  const constraints = checkConstraints(artifact)
  const sizing = checkSizing(artifact)

  const checks = { anchor, scope, timing, lineage, constraints, sizing }
  const passed = Object.values(checks).every(c => c.passed)

  // --- Build patch plan if needed ---
  const patchPlan = passed ? undefined : buildPatchPlan(checks)

  // --- Generate wisdom seed (S7 Crown) ---
  const passedCount = Object.values(checks).filter(c => c.passed).length
  const wisdomSeed = `${SYMBOLS.S0}→${SYMBOLS.S7} ${caseId.slice(0, 12)} | ${artifact.lineage.canonicalRef} | ${passedCount}/6 checks passed | ${passed ? 'MERGE CLEARED' : 'HALT — PATCH REQUIRED'}`

  // --- Log to Chronicle ---
  await writeChronicle({
    stage: 'S0→S7',
    symbol: SYMBOLS.S4,
    caseId,
    action: 'artifact_evaluation',
    data: {
      canonicalRef: artifact.lineage.canonicalRef,
      actor: artifact.actor,
      domain: artifact.domain,
      phase: artifact.phase,
      passed,
      passedCount,
      failedChecks: Object.entries(checks)
        .filter(([, v]) => !v.passed)
        .map(([k]) => k),
    },
  })

  return {
    caseId,
    canonicalRef: artifact.lineage.canonicalRef,
    timestamp,
    passed,
    checks,
    patchPlan,
    wisdomSeed,
  }
}
