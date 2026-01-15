import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const { lat, lng } = await request.json()

  const apiKey = process.env.GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    return NextResponse.json({ address: `${lat.toFixed(4)}, ${lng.toFixed(4)}` })
  }

  try {
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`)

    const data = await response.json()

    if (data.results && data.results.length > 0) {
      return NextResponse.json({ address: data.results[0].formatted_address })
    }

    return NextResponse.json({ address: `${lat.toFixed(4)}, ${lng.toFixed(4)}` })
  } catch (error) {
    console.error("[v0] Geocoding error:", error)
    return NextResponse.json({ address: `${lat.toFixed(4)}, ${lng.toFixed(4)}` })
  }
}
