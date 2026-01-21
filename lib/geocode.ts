// Geocode addresses using Google Maps Geocoding API
export async function geocodeAddress(
  address: string
): Promise<{ lat: number; lng: number } | null> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    console.warn("[v0] No Google Maps API key, using fallback coordinates")
    return null
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
    )
    const data = await response.json()

    if (data.status === "OK" && data.results[0]) {
      const { lat, lng } = data.results[0].geometry.location
      return { lat, lng }
    }

    console.warn(`[v0] Geocoding failed for "${address}":`, data.status)
    return null
  } catch (error) {
    console.error("[v0] Geocoding error:", error)
    return null
  }
}

// Batch geocode multiple addresses
export async function geocodeAddresses(
  addresses: string[]
): Promise<Map<string, { lat: number; lng: number }>> {
  const results = new Map<string, { lat: number; lng: number }>()

  // Process in parallel but with rate limiting
  const batchSize = 5
  for (let i = 0; i < addresses.length; i += batchSize) {
    const batch = addresses.slice(i, i + batchSize)
    const promises = batch.map(async (address) => {
      const coords = await geocodeAddress(address)
      if (coords) {
        results.set(address, coords)
      }
    })
    await Promise.all(promises)
    
    // Small delay between batches to avoid rate limits
    if (i + batchSize < addresses.length) {
      await new Promise((r) => setTimeout(r, 200))
    }
  }

  return results
}

// Format address for display (shorter version)
export function formatAddressShort(address: string): string {
  // Remove country, state codes, postcodes for cleaner display
  return address
    .replace(/,\s*(Australia|VIC|NSW|QLD|SA|WA|NT|ACT|TAS)\s*\d*/gi, "")
    .replace(/\s*\d{4}\s*$/, "")
    .trim()
}
