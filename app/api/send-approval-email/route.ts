import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { case_id, user_email, summary, response } = await request.json()

    // Mock email sending - replace with actual email service (Resend, SendGrid, etc.)
    const emailPreview = `
Subject: Your Response to ${summary.agency} - Approval Required

Dear User,

Your case analysis is complete. Please review and approve:

CASE: ${case_id}
AGENCY: ${summary.agency}
REFERENCE: ${summary.reference}
PATTERN: ${summary.pattern_name}

RESPONSE DRAFT:
${response}

To approve and send this response, click here:
${process.env.NEXT_PUBLIC_URL}/tool/result?approved=true&case=${case_id}

To edit, return to the results page.

Powered by re-cognition
● ▼ ▲ ■
    `.trim()

    console.log("[v0] Email preview:", emailPreview)

    return NextResponse.json({
      sent: true,
      preview_html: emailPreview,
    })
  } catch (error) {
    console.error("Error sending email:", error)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}
