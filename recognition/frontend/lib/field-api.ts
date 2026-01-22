// FIELD API Client
// TypeScript client for response-advantage-app → FIELD backend

const FIELD_API_BASE = process.env.NEXT_PUBLIC_FIELD_API || 'http://localhost:9630'

export interface ChronicleEvent {
  timestamp: number
  iso_time: string
  case_id: string
  stage: string
  vertex: string
  [key: string]: any
}

export interface CaseStatus {
  case_id: string
  status: string
  current_stage: string
  coherence: number
  filename: string
  processing_time: number
  events: ChronicleEvent[]
  event_count: number
}

export interface IntakeResponse {
  case_id: string
  status: string
  coherence: number
  validation_passed: boolean
  message: string
}

export class FIELDClient {
  private baseUrl: string

  constructor(baseUrl = FIELD_API_BASE) {
    this.baseUrl = baseUrl
  }

  /**
   * S0: Upload document to ●OBI-WAN intake
   */
  async uploadDocument(file: File): Promise<IntakeResponse> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(`${this.baseUrl}/api/field/intake`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Get current processing status
   */
  async getStatus(caseId: string): Promise<CaseStatus> {
    const response = await fetch(`${this.baseUrl}/api/field/status/${caseId}`)

    if (!response.ok) {
      throw new Error(`Status fetch failed: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * S6: Get results/manifest for completed case
   */
  async getResult(caseId: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/field/result/${caseId}`)

    if (!response.ok) {
      throw new Error(`Result fetch failed: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Get recent Chronicle events (all cases)
   */
  async getRecentChronicle(limit = 50): Promise<ChronicleEvent[]> {
    const response = await fetch(
      `${this.baseUrl}/api/field/chronicle/recent?limit=${limit}`
    )

    if (!response.ok) {
      throw new Error(`Chronicle fetch failed: ${response.statusText}`)
    }

    const data = await response.json()
    return data.events
  }

  /**
   * Stream status updates (poll every 1s until complete)
   */
  async *streamStatus(caseId: string): AsyncGenerator<CaseStatus> {
    while (true) {
      const status = await this.getStatus(caseId)
      yield status

      if (status.status === 'completed' || status.status === 'failed') {
        break
      }

      // Poll every 1 second
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
  }
}

// Singleton instance
export const fieldClient = new FIELDClient()

// React hook for easy integration
export function useFIELDUpload() {
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [caseId, setCaseId] = React.useState<string | null>(null)

  const upload = async (file: File) => {
    try {
      setLoading(true)
      setError(null)
      const result = await fieldClient.uploadDocument(file)
      setCaseId(result.case_id)
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { upload, loading, error, caseId }
}

// React hook for status streaming
export function useFIELDStatus(caseId: string | null) {
  const [status, setStatus] = React.useState<CaseStatus | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!caseId) return

    const stream = async () => {
      try {
        for await (const update of fieldClient.streamStatus(caseId)) {
          setStatus(update)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Status fetch failed')
      }
    }

    stream()
  }, [caseId])

  return { status, error }
}
