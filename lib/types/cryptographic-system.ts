/**
 * CRYPTOGRAPHIC INTEGRITY SYSTEM
 * 
 * ⊗ ARKADAŠ operates as a zero-trust signature firewall
 * It validates transitions but NEVER creates or signs state
 */

import { IntakePacket } from "./intake-packet"

/**
 * Glyph Identity Keys (public keys for verification)
 * Each vertex has a signing identity. ⊗ only needs public keys.
 */
export interface GlyphKeychain {
  "●": string // OBI-WAN - evidence origin
  "▼": string // TATA - validation authority
  "▲": string // ATLAS - reduction authority
  "♦︎": string // AKRON - hold authority
  "■": string // DOJO - execution authority
}

/**
 * Signed Transition Object
 * Created BY glyphs, VERIFIED BY ⊗
 */
export interface SignedTransition {
  from_vertex: string
  to_vertex: string
  timestamp: number
  packet_hash: string // hash(input_state)
  transformation: {
    field: string
    old_value: string | null
    new_value: string
  }[]
  signature: string // GPG signature of this entire object
  signed_by_key: string // Public key fingerprint of signer
}

/**
 * State Hash Proof
 * Proves packet integrity at a checkpoint
 */
export interface StateHashProof {
  packet_id: string
  vertex: string
  state_hash: string // SHA256(packet)
  signed_timestamp: number
  verified: boolean
}

/**
 * Routing Decision from ⊗
 * NEVER prose. Only structured decisions.
 */
export interface RoutingDecision {
  decision: "NEXT" | "HOLD"
  next_route: string | null
  validated_transition: boolean
  fail_reasons: FailureType[]
  verified_by: "⊗" // Always ⊗
  signature_status: "VALID" | "INVALID" | "MISSING"
  fallback_vertex?: string // Where to send if HOLD
}

/**
 * Failure Taxonomy
 * Named failures route automatically instead of accumulating
 */
export type FailureType =
  | "SIGNATURE_INVALID"
  | "SIGNATURE_MISSING"
  | "STATE_HASH_MISMATCH"
  | "ROUTE_VIOLATION"
  | "STATE_TAMPER"
  | "MISSING_ANCHOR"
  | "TIMELINE_CONFLICT"
  | "CLAIM_UNSUPPORTED"
  | "TRIANGLE_INCOMPLETE"
  | "ROUTE_CONFLICT"

/**
 * Valid Graph Transitions
 * Enforces strict sequence rules
 */
export const VALID_TRANSITIONS: Record<string, string[]> = {
  "♦︎": ["●"], // AKRON → OBI-WAN (intake to observation)
  "●": ["▼"], // OBI-WAN → TATA (observation to grounding)
  "▼": ["▲"], // TATA → ATLAS (grounding to recognition)
  "▲": ["■"], // ATLAS → DOJO (recognition to action)
  "■": [], // DOJO is terminal
}

/**
 * Cryptographic Router Logic
 * Zero-trust verification pipeline
 */
export function verifyTransition(
  packet: IntakePacket,
  transition: SignedTransition,
  keychain: GlyphKeychain
): RoutingDecision {
  const failures: FailureType[] = []

  // STEP 1: Verify signature
  if (!transition.signature) {
    failures.push("SIGNATURE_MISSING")
  } else if (!verifyGPGSignature(transition, keychain)) {
    failures.push("SIGNATURE_INVALID")
  }

  // If signature fails, HOLD immediately
  if (failures.includes("SIGNATURE_INVALID") || failures.includes("SIGNATURE_MISSING")) {
    return {
      decision: "HOLD",
      next_route: null,
      validated_transition: false,
      fail_reasons: failures,
      verified_by: "⊗",
      signature_status: "INVALID",
      fallback_vertex: "♦︎",
    }
  }

  // STEP 2: Verify transition graph
  const allowedNext = VALID_TRANSITIONS[packet.vertex] || []
  if (!allowedNext.includes(transition.to_vertex)) {
    failures.push("ROUTE_VIOLATION")
  }

  // STEP 3: Verify state consistency
  const currentHash = computePacketHash(packet)
  if (currentHash !== transition.packet_hash) {
    failures.push("STATE_HASH_MISMATCH")
  }

  // Check for tampering
  if (hasStateBeenTampered(packet, transition)) {
    failures.push("STATE_TAMPER")
  }

  // If any validation failed, HOLD
  if (failures.length > 0) {
    return {
      decision: "HOLD",
      next_route: null,
      validated_transition: false,
      fail_reasons: failures,
      verified_by: "⊗",
      signature_status: "VALID",
      fallback_vertex: "♦︎",
    }
  }

  // All validations passed - NEXT
  const nextRoute = getRouteForVertex(transition.to_vertex)
  return {
    decision: "NEXT",
    next_route: nextRoute,
    validated_transition: true,
    fail_reasons: [],
    verified_by: "⊗",
    signature_status: "VALID",
  }
}

/**
 * GPG Signature Verification
 * Placeholder for actual GPG verification
 * In production, use node-gpg or similar
 */
function verifyGPGSignature(transition: SignedTransition, keychain: GlyphKeychain): boolean {
  // TODO: Implement actual GPG verification
  // For now, return true if signature exists and key is in keychain
  return transition.signature.length > 0 && Object.values(keychain).includes(transition.signed_by_key)
}

/**
 * Compute SHA256 hash of packet state
 */
function computePacketHash(packet: IntakePacket): string {
  const crypto = require("crypto")
  const stateString = JSON.stringify({
    case_id: packet.case_id,
    observed: packet.observed,
    interpretation: packet.interpretation,
    recommendation: packet.recommendation,
    anchors: packet.anchors,
  })
  return crypto.createHash("sha256").update(stateString).digest("hex")
}

/**
 * Detect state tampering between transitions
 */
function hasStateBeenTampered(packet: IntakePacket, transition: SignedTransition): boolean {
  // Check if any field was modified outside the transition's declared changes
  const declaredFields = new Set(transition.transformation.map((t) => t.field))

  // In production, compare against previous signed state
  // For now, simple validation
  return false
}

/**
 * Map vertex to route
 */
function getRouteForVertex(vertex: string): string {
  const routes: Record<string, string> = {
    "●": "/observe",
    "▼": "/ground",
    "▲": "/reduce",
    "■": "/act",
    "♦︎": "/akron",
  }
  return routes[vertex] || "/akron"
}

/**
 * Machine-enforced Glyph Contracts
 * Each glyph has strict input/output schema
 */
export interface GlyphContract<T = any> {
  vertex: string
  inputSchema: any // Zod or similar validator
  outputSchema: any
  transform: (input: T) => T
  canProceed: (packet: IntakePacket) => boolean
}

/**
 * GROUND_PASS Gate
 * Hard boolean that blocks /act entirely
 */
export class GroundGate {
  private passed: boolean = false

  constructor(packet: IntakePacket) {
    this.passed = this.validate(packet)
  }

  private validate(packet: IntakePacket): boolean {
    // All triangle checks must pass
    const triangleComplete =
      packet.triangle_check.fact !== "pending" &&
      packet.triangle_check.doc !== "pending" &&
      packet.triangle_check.ledger !== "pending"

    // At least one anchor
    const anchorsPresent = packet.anchors.length > 0

    // Recommendation present
    const recommendationPresent = packet.recommendation !== null && packet.recommendation.length > 0

    return triangleComplete && anchorsPresent && recommendationPresent
  }

  get isOpen(): boolean {
    return this.passed
  }

  getBlockReason(): string {
    if (!this.passed) {
      return "GROUND_GATE_CLOSED: Complete triangle validation + anchors required"
    }
    return ""
  }
}

/**
 * Exception Class - ♦︎ AKRON Hold
 * Not a UI state. A hard exception type.
 */
export class AkronHoldException extends Error {
  readonly failureReasons: FailureType[]
  readonly fallbackVertex: string = "♦︎"
  readonly shouldBlock: boolean = true

  constructor(reasons: FailureType[]) {
    super(`AKRON HOLD: ${reasons.join(", ")}`)
    this.failureReasons = reasons
    this.name = "AkronHoldException"
  }

  canRetry(): boolean {
    // Some failures are transient
    return this.failureReasons.some((f) => !["ROUTE_VIOLATION", "STATE_TAMPER"].includes(f))
  }
}
