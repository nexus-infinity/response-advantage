import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { caseId: string } }) {
  // Mock result data
  // TODO: Fetch from DOJO backend

  const mockData = {
    caseId: params.caseId,
    letter: `Dear Professional Standards Command,

Re: VP28997 — False Contact Claims & Premature Closure

On 12 January 2026 at 10:21 AM, your office claimed to be 
"attempting to contact" me. At 11:16 AM I confirmed no contact 
had been received. At 11:40 AM I was informed the assigned 
officer was "not in today."

Full case documentation: response.advantage/case/${params.caseId}

I request substantive response within 14 days (30 January 2026).

Regards,
[Your name]`,
    observation: {
      dates: ["12 Jan 2026", "16 Jan 2026"],
      events: ["PSC claims 'attempting to contact'", "You confirm no contact received", "Told officer not in today"],
    },
    lawBreach: {
      law: "Victoria Police Act 2013 s.170",
      violation: "Duty to investigate complaints",
    },
    pattern: {
      id: "47",
      name: "PSC Can Kicking",
      confidence: 0.94,
    },
    deadline: "30 Jan 2026",
  }

  return NextResponse.json(mockData)
}
