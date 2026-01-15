import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  // Mock progressive chamber processing
  // TODO: Poll DOJO backend chambers

  const mockData = {
    status: "complete",
    currentChamber: "output",
    caseId: "47-PSC-VP28997",
    observation: {
      dates: ["12 Jan 2026", "16 Jan 2026"],
      times: ["10:21 AM", "11:16 AM", "11:40 AM"],
      locations: ["Email", "Phone"],
      people: ["Officer Smith", "Receptionist", "You"],
      events: ["PSC claims 'attempting to contact'", "You confirm no contact received", "Told officer not in today"],
    },
    lawBreach: {
      law: "Victoria Police Act 2013 s.170",
      violation: "Duty to investigate complaints",
      calculation: "False contact claim + premature closure = procedural failure",
    },
    pattern: {
      id: "47",
      name: "PSC Can Kicking",
      confidence: 0.94,
      documented: 23,
    },
  }

  return NextResponse.json(mockData)
}
