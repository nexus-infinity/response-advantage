/**
 * Error Boundary for /act route
 * Catches AkronHoldException and routes appropriately
 */

"use client"

import { AkronErrorBoundary } from "@/components/akron-error-boundary"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return <AkronErrorBoundary error={error} reset={reset} />
}
