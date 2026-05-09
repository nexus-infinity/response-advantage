/**
 * FIELD ROUTER ENDPOINT
 * 
 * Single endpoint that validates Intake Packets and returns routing decisions.
 * Keeps the UI "dumb" and routing logic "sovereign".
 */

import { NextResponse } from "next/server"
import { 
  IntakePacket, 
  RouterDecision, 
  validatePacket,
  VERTICES,
  Vertex 
} from "@/lib/types/intake-packet"

export async function POST(req: Request) {
  try {
    const packet: IntakePacket = await req.json()
    
    // Validate the packet
    const decision = validatePacket(packet)
    
    // Update packet hold state based on decision
    const updatedPacket: IntakePacket = {
      ...packet,
      hold: decision.action === "HOLD",
      hold_reasons: decision.action === "HOLD" ? decision.missing_pins : [],
      updated_at: new Date().toISOString(),
    }
    
    return NextResponse.json({
      decision,
      packet: updatedPacket,
    })
    
  } catch (error) {
    console.error("[v0] Router error:", error)
    return NextResponse.json(
      { 
        decision: {
          action: "HOLD",
          missing_pins: ["Invalid packet format"],
          message: "Could not parse intake packet",
        } as RouterDecision,
        packet: null,
      },
      { status: 400 }
    )
  }
}

// GET endpoint to retrieve vertex metadata
export async function GET() {
  return NextResponse.json({
    vertices: VERTICES,
    order: ["♦︎", "●", "▼", "▲", "◼︎", "⊗"] as Vertex[],
  })
}
