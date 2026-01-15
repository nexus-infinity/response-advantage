import { notFound } from "next/navigation"
import dynamic from "next/dynamic"

const LocationMap = dynamic(() => import("@/components/location-map"), { ssr: false })

interface CaseData {
  caseId: string
  patternName: string
  status: "awaiting" | "responded" | "escalated"
  timeline: Array<{
    date: string
    time?: string
    event: string
    status: "submitted" | "pending" | "resolved" | "escalated"
  }>
  caseFile: Array<{
    date: string
    time: string
    event: string
    location: string
    person: string
    evidence: string
  }>
  evidenceGallery: Array<{
    url: string
    timestamp: string
    caption: string
  }>
  story: {
    whatHappened: string
    whyItMatters: string
    whatYouAsk: string
  }
  escalation: {
    deadline: string
    nextAuthority: string
  }
  locations?: Array<{
    lat: number
    lng: number
    address: string
    label: string
    timestamp?: string
  }>
}

async function getCaseData(id: string): Promise<CaseData | null> {
  // This would fetch from your DOJO backend
  // Mock data for now
  return {
    caseId: id,
    patternName: "PSC Can Kicking",
    status: "awaiting",
    timeline: [
      { date: "12 Jan 2026", time: "10:21", event: "Complaint submitted", status: "submitted" },
      { date: "16 Jan 2026", event: "Email sent to authority", status: "pending" },
    ],
    caseFile: [
      {
        date: "12 Jan",
        time: "10:21",
        event: "PSC email: 'attempting contact'",
        location: "Email",
        person: "Officer Smith",
        evidence: "#",
      },
      {
        date: "12 Jan",
        time: "11:16",
        event: "Your reply: 'No contact received'",
        location: "Email",
        person: "You",
        evidence: "#",
      },
    ],
    evidenceGallery: [],
    story: {
      whatHappened:
        "You submitted a complaint. Professional Standards claimed they were trying to contact you, but you never received any contact. When you followed up, they said the officer wasn't in. Your complaint was being deflected rather than investigated.",
      whyItMatters:
        "Police accountability depends on Professional Standards investigating complaints seriously. When they use false contact claims to avoid investigation, they undermine public trust and leave misconduct unchecked. Your experience matters because it documents a pattern of institutional avoidance.",
      whatYouAsk:
        "A genuine investigation of your original complaint, not procedural deflection. Professional Standards should acknowledge the false contact claim, assign a different officer, and complete a proper review within 14 days.",
    },
    escalation: {
      deadline: "30 Jan 2026",
      nextAuthority: "Victorian Inspectorate",
    },
    locations: [
      { lat: -37.814, lng: 144.963, address: "123 Main St, Melbourne", label: "Initial Complaint Location" },
      {
        lat: -37.818,
        lng: 144.966,
        address: "456 Elm St, Melbourne",
        label: "Follow-up Location",
        timestamp: "12 Jan 2026",
      },
    ],
  }
}

export default async function CasePage({ params }: { params: { id: string } }) {
  const data = await getCaseData(params.id)

  if (!data) {
    notFound()
  }

  const statusColors = {
    awaiting: "bg-orange-500/10 text-orange-500 border-orange-500",
    responded: "bg-green-500/10 text-green-500 border-green-500",
    escalated: "bg-red-500/10 text-red-500 border-red-500",
  }

  return (
    <main className="min-h-screen px-4 py-12">
      <div className="max-w-[1000px] mx-auto space-y-12">
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-bold">Case {data.caseId}</h1>
          <div className="flex items-center justify-center gap-4">
            <span className="text-lg text-muted-foreground">{data.patternName}</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusColors[data.status]}`}>
              {data.status === "awaiting"
                ? "Awaiting Response"
                : data.status === "responded"
                  ? "Responded"
                  : "Deadline Passed"}
            </span>
          </div>
        </div>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Timeline</h2>
          <div className="space-y-4">
            {data.timeline.map((item, i) => (
              <div key={i} className="flex gap-4">
                <div
                  className={`w-3 h-3 rounded-full mt-1.5 ${
                    item.status === "submitted"
                      ? "bg-blue-500"
                      : item.status === "pending"
                        ? "bg-orange-500"
                        : item.status === "resolved"
                          ? "bg-green-500"
                          : "bg-red-500"
                  }`}
                />
                <div>
                  <p className="font-medium">
                    {item.date} {item.time && `at ${item.time}`}
                  </p>
                  <p className="text-sm text-muted-foreground">{item.event}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Case File</h2>
          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-2 text-left font-medium">Date</th>
                  <th className="px-4 py-2 text-left font-medium">Time</th>
                  <th className="px-4 py-2 text-left font-medium">Event</th>
                  <th className="px-4 py-2 text-left font-medium">Location</th>
                  <th className="px-4 py-2 text-left font-medium">Person</th>
                  <th className="px-4 py-2 text-left font-medium">Evidence</th>
                </tr>
              </thead>
              <tbody>
                {data.caseFile.map((row, i) => (
                  <tr key={i} className="border-t border-border">
                    <td className="px-4 py-2">{row.date}</td>
                    <td className="px-4 py-2">{row.time}</td>
                    <td className="px-4 py-2">{row.event}</td>
                    <td className="px-4 py-2">{row.location}</td>
                    <td className="px-4 py-2">{row.person}</td>
                    <td className="px-4 py-2">
                      <a href={row.evidence} className="text-foreground underline hover:no-underline">
                        Link
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {data.locations && data.locations.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Event Locations</h2>
            <LocationMap locations={data.locations} className="h-[500px]" />
            <div className="text-sm text-muted-foreground space-y-1">
              {data.locations.map((loc, i) => (
                <div key={i} className="flex gap-2">
                  <span className="font-bold">{i + 1}.</span>
                  <div>
                    <span className="font-medium">{loc.label}</span> — {loc.address}
                    {loc.timestamp && <span className="text-xs ml-2">({loc.timestamp})</span>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="space-y-6 bg-muted/30 border rounded-lg p-8">
          <h2 className="text-2xl font-bold">The Story</h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">What Happened (Witness)</h3>
              <p className="text-muted-foreground leading-relaxed">{data.story.whatHappened}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Why This Matters (Validation)</h3>
              <p className="text-muted-foreground leading-relaxed">{data.story.whyItMatters}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">What You're Asking For (Empowerment)</h3>
              <p className="text-muted-foreground leading-relaxed">{data.story.whatYouAsk}</p>
            </div>
          </div>

          <p className="text-xs text-muted-foreground italic pt-4 border-t border-border">
            This section serves as therapeutic mirroring—reflecting your experience back to you in clear language so you
            feel heard, understood, and can share your truth.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Escalation Path</h2>
          <div className="border rounded-lg p-6 space-y-2">
            <p>
              <strong>Deadline:</strong> {data.escalation.deadline}
            </p>
            <p>
              <strong>If no response:</strong> {data.escalation.nextAuthority}
            </p>
          </div>
        </section>

        <footer className="text-center text-sm text-muted-foreground space-y-2 pt-8 border-t border-border">
          <div className="flex items-center justify-center gap-3">
            <span>Generated by reduction geometry</span>
            <div className="flex gap-2">
              <span style={{ color: "var(--evidence)" }}>●</span>
              <span style={{ color: "var(--law)" }}>▼</span>
              <span style={{ color: "var(--pattern)" }}>▲</span>
              <span style={{ color: "var(--action)" }}>■</span>
            </div>
          </div>
          <p>Last updated: {new Date().toLocaleString()}</p>
        </footer>
      </div>
    </main>
  )
}
