/**
 * Packet Store Utilities
 * 
 * Handles IntakePacket persistence across requests
 * In production: database or secure session store
 * For now: in-memory with cache
 */

import { IntakePacket } from "@/lib/types/intake-packet"

// In-memory store (demo)
// In production: use database or secure session backend
const packetStore = new Map<string, IntakePacket>()

/**
 * Get packet by case ID
 */
export async function getIntakePacket(caseId?: string): Promise<IntakePacket | null> {
  if (!caseId) {
    // In production: get from session middleware
    return null
  }

  return packetStore.get(caseId) || null
}

/**
 * Save or update packet
 */
export async function saveIntakePacket(packet: IntakePacket): Promise<void> {
  packetStore.set(packet.case_id, packet)
}

/**
 * Validate packet schema (machine-enforced)
 */
export function validatePacketSchema(packet: any): packet is IntakePacket {
  // Strict validation - no variations allowed
  const required = [
    "case_id",
    "ref",
    "stage",
    "vertex",
    "observed",
    "anchors",
    "triangle_check",
    "hold",
  ]

  return required.every((field) => field in packet) && typeof packet.case_id === "string"
}

/**
 * Create new packet
 */
export function createIntakePacket(observed: string): IntakePacket {
  return {
    case_id: `case_${Date.now()}`,
    ref: `FIELD-DEFAULT-${new Date().toISOString().split("T")[0].replace(/-/g, "")}-001`,
    stage: 0,
    vertex: "●",
    observed,
    interpretation: null,
    recommendation: null,
    anchors: [],
    triangle_check: {
      fact: "pending",
      doc: "pending",
      ledger: "pending",
    },
    hold: false,
    hold_reasons: [],
  }
}
