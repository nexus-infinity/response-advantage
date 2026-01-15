"use server"

export async function getMapsApiKey() {
  return process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""
}

export async function reverseGeocode(lat: number, lng: number) {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`,
    )
    const data = await response.json()
    return data.results?.[0]?.formatted_address || ""
  } catch (error) {
    console.error("Geocoding error:", error)
    return ""
  }
}
