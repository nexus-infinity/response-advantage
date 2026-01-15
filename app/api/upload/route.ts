import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const contentType = request.headers.get("content-type")

  // Generate processing ID
  const processingId = `proc-${Date.now()}`

  if (contentType?.includes("multipart/form-data")) {
    // File upload
    const formData = await request.formData()
    const files = formData.getAll("files")

    // TODO: Send to DOJO backend at port 3960
    console.log("[v0] Files uploaded:", files.length)

    return NextResponse.json({ processingId, status: "accepted" })
  } else {
    // Text paste
    const { text } = await request.json()

    // TODO: Send to DOJO backend at port 3960
    console.log("[v0] Text submitted:", text.substring(0, 100))

    return NextResponse.json({ processingId, status: "accepted" })
  }
}
