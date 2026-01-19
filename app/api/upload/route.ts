import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || ""

    // Generate processing ID
    const processingId = `proc-${Date.now()}`

    if (contentType.includes("multipart/form-data")) {
      // File upload
      const formData = await request.formData()
      const files = formData.getAll("files")
      const locationData = formData.get("location")

      // TODO: Send to DOJO backend at port 3960
      console.log("[v0] Files uploaded:", files.length)
      if (locationData) {
        console.log("[v0] Location:", locationData)
      }

      return NextResponse.json({ processingId, status: "accepted" })
    } else {
      // Text paste or JSON body
      let text = ""
      let location = null
      
      try {
        const body = await request.json()
        text = body.text || ""
        location = body.location || null
      } catch {
        // Body might be empty or not JSON
        text = ""
      }

      // TODO: Send to DOJO backend at port 3960
      if (text) {
        console.log("[v0] Text submitted:", text.substring(0, 100))
      }
      if (location) {
        console.log("[v0] Location:", location)
      }

      return NextResponse.json({ processingId, status: "accepted" })
    }
  } catch (error) {
    console.error("[v0] Upload error:", error)
    return NextResponse.json(
      { error: "Upload failed", processingId: `proc-${Date.now()}` },
      { status: 500 }
    )
  }
}
