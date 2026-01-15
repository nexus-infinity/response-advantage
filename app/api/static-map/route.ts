import { type NextRequest, NextResponse } from "next/server"

// Google Maps API key stays on server, never exposed to client
export async function POST(request: NextRequest) {
  try {
    const { locations } = await request.json()

    if (!locations || locations.length === 0) {
      return NextResponse.json({ error: "No locations provided" }, { status: 400 })
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY

    if (!apiKey) {
      // Return a placeholder map if no API key configured
      return NextResponse.json({
        mapUrl: `/placeholder.svg?height=400&width=600&query=map+with+${locations.length}+location+markers`,
      })
    }

    // Build markers string for static map API
    const markers = locations
      .map(
        (loc: { lat: number; lng: number }, idx: number) =>
          `markers=color:0x1a1a1a%7Clabel:${idx + 1}%7C${loc.lat},${loc.lng}`,
      )
      .join("&")

    // Calculate center point
    const centerLat = locations.reduce((sum: number, loc: { lat: number }) => sum + loc.lat, 0) / locations.length
    const centerLng = locations.reduce((sum: number, loc: { lng: number }) => sum + loc.lng, 0) / locations.length

    // Build static map URL (server-side only)
    const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${centerLat},${centerLng}&zoom=13&size=600x400&scale=2&maptype=roadmap&${markers}&style=feature:all|saturation:-100&key=${apiKey}`

    return NextResponse.json({ mapUrl: staticMapUrl })
  } catch (error) {
    console.error("[v0] Static map error:", error)
    return NextResponse.json(
      { mapUrl: `/placeholder.svg?height=400&width=600&query=location+map+placeholder` },
      { status: 200 },
    )
  }
}
