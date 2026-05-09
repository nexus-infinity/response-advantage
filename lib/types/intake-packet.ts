/**
 * INTAKE PACKET SCHEMA
 * 
 * The bridge between UI and FIELD router.
 * Every route writes/updates this same object.
 * The router validates it and returns HOLD or NEXT.
 */

// The 6 vertices of the FIELD system
export type Vertex = "♦︎" | "●" | "▼" | "▲" | "◼︎" | "⊗"

// Vertex metadata
export const VERTICES: Record<Vertex, {
  label: string
  entity: string
  color: string
  route: string
  description: string
  status: "active" | "disabled" | "coming-soon"
}> = {
  "♦︎": {
    label: "AKRON",
    entity: "Intake / HOLD",
    color: "#8B4513", // Sienna - earth/foundation
    route: "/akron",
    description: "Fail-closed intake + notary/HOLD zone",
    status: "active",
  },
  "●": {
    label: "OBI-WAN",
    entity: "Observer",
    color: "#7B6B8D", // Muted violet (Crown/Third Eye)
    route: "/observe",
    description: "What did you observe?",
    status: "active",
  },
  "▼": {
    label: "TATA",
    entity: "Evidence",
    color: "#A85D3B", // Terracotta (Sacral)
    route: "/ground",
    description: "Legal grounding and anchors",
    status: "active",
  },
  "▲": {
    label: "ATLAS",
    entity: "Intelligence",
    color: "#9A7B2C", // Antique gold (Solar Plexus)
    route: "/reduce",
    description: "Pattern recognition and contradictions",
    status: "active",
  },
  "◼︎": {
    label: "DOJO",
    entity: "Manifestation",
    color: "#4A6FA5", // Steel blue (Throat)
    route: "/act",
    description: "Output generation",
    status: "active",
  },
  "⊗": {
    label: "ARKADAS",
    entity: "Coordination",
    color: "#6B8E6B", // Sage green - continuity
    route: "/spin",
    description: "Routing decisions and state continuity",
    status: "coming-soon",
  },
}

// Triangle check statuses
export type TriangleStatus = "missing" | "partial" | "complete"

export interface TriangleCheck {
  fact: TriangleStatus      // What happened (observation)
  doc: TriangleStatus       // Supporting evidence (anchors)
  ledger: TriangleStatus    // Audit trail (receipts)
}

// Sensitivity levels
export type Sensitivity = "public" | "internal" | "confidential" | "restricted"

// Anchor types (proof of existence)
export interface Anchor {
  id: string
  type: "url" | "file" | "timestamp" | "message_id" | "hash"
  value: string
  verified: boolean
  created_at: string
}

// The main Intake Packet - shared by all routes
export interface IntakePacket {
  // Identity
  case_id: string
  ref: string // FIELD-[MATTERCODE]-YYYYMMDD-NNN
  
  // Current position in the system
  stage: number // S0-S11 mapping
  vertex: Vertex
  
  // Core content
  observed: string | null      // What was observed (●)
  interpretation: string | null // What it means (▲)
  recommendation: string | null // What to do (◼︎)
  
  // Validation state
  anchors: Anchor[]
  triangle_check: TriangleCheck
  sensitivity: Sensitivity
  
  // HOLD state
  hold: boolean
  hold_reasons: string[] // Exact missing pins
  
  // Metadata
  created_at: string
  updated_at: string
  owner_id?: string
}

// Router response
export type RouterDecision = 
  | { action: "HOLD"; missing_pins: string[]; message: string }
  | { action: "NEXT"; route: string; vertex: Vertex; message: string }

// Create a new empty packet
export function createIntakePacket(caseId: string): IntakePacket {
  const now = new Date().toISOString()
  const date = now.split("T")[0].replace(/-/g, "")
  
  return {
    case_id: caseId,
    ref: `FIELD-NEW-${date}-001`,
    stage: 0,
    vertex: "♦︎", // Start at AKRON (intake)
    observed: null,
    interpretation: null,
    recommendation: null,
    anchors: [],
    triangle_check: {
      fact: "missing",
      doc: "missing",
      ledger: "missing",
    },
    sensitivity: "internal",
    hold: true, // Start in HOLD until validated
    hold_reasons: ["No observation recorded", "No anchors attached", "Triangle incomplete"],
    created_at: now,
    updated_at: now,
  }
}

// Validate a packet and return router decision
export function validatePacket(packet: IntakePacket): RouterDecision {
  const missing: string[] = []
  
  // Check observation
  if (!packet.observed || packet.observed.trim().length < 10) {
    missing.push("Observation required (minimum 10 characters)")
  }
  
  // Check anchors
  if (packet.anchors.length === 0) {
    missing.push("At least one anchor required (URL, file, timestamp, or message ID)")
  }
  
  // Check triangle
  if (packet.triangle_check.fact === "missing") {
    missing.push("Triangle: Fact status missing")
  }
  if (packet.triangle_check.doc === "missing") {
    missing.push("Triangle: Documentation status missing")
  }
  if (packet.triangle_check.ledger === "missing") {
    missing.push("Triangle: Ledger/receipt status missing")
  }
  
  // If any missing, HOLD
  if (missing.length > 0) {
    return {
      action: "HOLD",
      missing_pins: missing,
      message: `Cannot proceed: ${missing.length} validation${missing.length > 1 ? "s" : ""} required`,
    }
  }
  
  // Determine next vertex based on current
  const progression: Record<Vertex, Vertex> = {
    "♦︎": "●", // AKRON → OBI-WAN
    "●": "▼",  // OBI-WAN → TATA
    "▼": "▲",  // TATA → ATLAS
    "▲": "◼︎", // ATLAS → DOJO
    "◼︎": "⊗", // DOJO → ARKADAS
    "⊗": "♦︎", // ARKADAS → AKRON (cycle)
  }
  
  const nextVertex = progression[packet.vertex]
  const nextRoute = VERTICES[nextVertex].route
  
  return {
    action: "NEXT",
    route: nextRoute,
    vertex: nextVertex,
    message: `Validation passed. Proceeding to ${VERTICES[nextVertex].label}`,
  }
}
