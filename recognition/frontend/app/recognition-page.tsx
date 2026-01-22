"use client"

import React from 'react'
import { Upload, FileText, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

// Inline types (avoiding import issues)
interface ChronicleEvent {
  timestamp: number
  iso_time: string
  case_id: string
  stage: string
  vertex: string
  action?: string
  coherence?: number
  [key: string]: any
}

interface CaseStatus {
  case_id: string
  status: string
  current_stage: string
  coherence: number
  filename: string
  processing_time: number
  events: ChronicleEvent[]
  event_count: number
}

const FIELD_API = 'http://localhost:9630'

export default function RecognitionPage() {
  const [dragActive, setDragActive] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [caseId, setCaseId] = React.useState<string | null>(null)
  const [status, setStatus] = React.useState<CaseStatus | null>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const uploadFile = async (file: File) => {
    try {
      setLoading(true)
      setError(null)
      
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch(`${FIELD_API}/api/field/intake`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`)
      }

      const result = await response.json()
      setCaseId(result.case_id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await uploadFile(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await uploadFile(e.target.files[0])
    }
  }

  // Poll status
  React.useEffect(() => {
    if (!caseId) return

    const pollStatus = async () => {
      try {
        const response = await fetch(`${FIELD_API}/api/field/status/${caseId}`)
        if (response.ok) {
          const data = await response.json()
          setStatus(data)
        }
      } catch (err) {
        console.error('Status poll failed:', err)
      }
    }

    const interval = setInterval(pollStatus, 1000)
    pollStatus() // Initial call

    return () => clearInterval(interval)
  }, [caseId])

  const getStageSymbol = (stage: string) => {
    const symbols: Record<string, string> = {
      'S0': '●', 'S1': '▼', 'S2': '▲', 'S3': '▲',
      'S4': '◼', 'S5': '◼', 'S6': '◼', 'S7': '●'
    }
    return symbols[stage] || '○'
  }

  const getVertexName = (stage: string) => {
    const names: Record<string, string> = {
      'S0': 'OBI-WAN (Intake)', 'S1': 'TATA (Validation)',
      'S2': 'ATLAS (Mapping)', 'S3': 'ATLAS (Planning)',
      'S4': 'DOJO (Execution)', 'S5': 'DOJO (Proof)',
      'S6': 'DOJO (Manifestation)', 'S7': 'OBI-WAN (Wisdom)'
    }
    return names[stage] || stage
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">◼ FIELD Recognition</h1>
          <p className="text-gray-400">
            Geometric document intelligence • S0→S7 transformation flow
          </p>
        </div>

        {!caseId && (
          <Card className="bg-gray-900 border-gray-800">
            <div
              className={`p-12 border-2 border-dashed rounded-lg transition-colors ${
                dragActive
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-gray-700 hover:border-gray-600'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center space-y-4">
                <Upload className="w-16 h-16 text-gray-400" />
                <div className="text-center">
                  <p className="text-xl font-semibold mb-2">Drop document here</p>
                  <p className="text-sm text-gray-400 mb-4">PDF, images, or text files</p>
                  <label htmlFor="file-upload">
                    <Button variant="outline" className="cursor-pointer" asChild>
                      <span>
                        <FileText className="w-4 h-4 mr-2" />
                        Select File
                      </span>
                    </Button>
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    onChange={handleFileInput}
                  />
                </div>
              </div>
            </div>
          </Card>
        )}

        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto" />
            <p className="mt-4 text-gray-400">Processing intake...</p>
          </div>
        )}

        {error && (
          <Card className="bg-red-900/20 border-red-800 p-4">
            <div className="flex items-center space-x-2 text-red-400">
              <XCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          </Card>
        )}

        {status && (
          <div className="space-y-6">
            <Card className="bg-gray-900 border-gray-800 p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{status.filename}</h2>
                  <p className="text-sm text-gray-400">Case: {status.case_id}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-green-400">
                    {(status.coherence * 100).toFixed(0)}%
                  </div>
                  <div className="text-xs text-gray-400">Coherence</div>
                </div>
              </div>
            </Card>

            <Card className="bg-gray-900 border-gray-800 p-6">
              <div className="flex items-center space-x-4">
                <div className="text-6xl">{getStageSymbol(status.current_stage)}</div>
                <div>
                  <h3 className="text-xl font-semibold">
                    {getVertexName(status.current_stage)}
                  </h3>
                  <p className="text-sm text-gray-400">Status: {status.status}</p>
                </div>
              </div>
            </Card>

            <Card className="bg-gray-900 border-gray-800 p-6">
              <h3 className="text-lg font-semibold mb-4">Chronicle Events</h3>
              <div className="space-y-3">
                {status.events.map((event, i) => (
                  <div
                    key={i}
                    className="flex items-start space-x-3 text-sm border-l-2 border-gray-700 pl-4 py-2"
                  >
                    <span className="text-2xl">{getStageSymbol(event.stage)}</span>
                    <div className="flex-1">
                      <div className="font-mono text-xs text-gray-400">
                        {event.iso_time}
                      </div>
                      <div className="font-semibold">{event.vertex}</div>
                      <div className="text-gray-400">{event.action || event.stage}</div>
                    </div>
                    {event.coherence && (
                      <div className="text-green-400 font-semibold">
                        {(event.coherence * 100).toFixed(0)}%
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
