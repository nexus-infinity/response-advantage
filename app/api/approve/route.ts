import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const { caseId, userEmail } = await request.json()

  // TODO: Send email to authority via DOJO backend
  // TODO: Publish case page

  console.log("[v0] Approved and sending case:", caseId, "to", userEmail)

  return NextResponse.json({
    sent: true,
    caseUrl: `/case/${caseId}`,
  })
}
