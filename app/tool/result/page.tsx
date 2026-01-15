"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Copy, Download, RotateCcw, Mail, CheckCircle2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AnalysisResult {
  pattern: {
    id: string
    name: string
    confidence: number
    stages?: string[]
  }
  response: string
  metadata: {
    processing_time_ms: number
    reduction_stages?: {
      raw: number
      filtered: number
      matched: number
      output: number
    }
  }
}

export default function ResultPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [responseText, setResponseText] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [emailSent, setEmailSent] = useState(false)
  const [emailPreview, setEmailPreview] = useState("")
  const isApproved = searchParams.get("approved") === "true"

  useEffect(() => {
    const stored = sessionStorage.getItem("analysisResult")
    if (!stored) {
      router.push("/tool")
      return
    }

    const data = JSON.parse(stored) as AnalysisResult
    setResult(data)
    setResponseText(data.response)
  }, [router])

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(responseText)
    toast({
      title: "Copied to clipboard",
      description: "Response text has been copied",
    })
  }

  const downloadText = () => {
    const blob = new Blob([responseText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `response-${result?.pattern.id || "output"}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Downloaded",
      description: "Response saved as text file",
    })
  }

  const sendApprovalEmail = async () => {
    if (!userEmail) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch("/api/send-approval-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          case_id: `CASE-${Date.now()}`,
          user_email: userEmail,
          summary: {
            agency: "Agency Name",
            reference: "REF-001",
            pattern_name: result?.pattern.name,
          },
          response: responseText,
        }),
      })

      const data = await response.json()
      setEmailPreview(data.preview_html)
      setEmailSent(true)

      toast({
        title: "Email sent",
        description: "Check your inbox for approval link",
      })
    } catch (error) {
      console.error("[v0] Error sending email:", error)
      toast({
        title: "Error",
        description: "Failed to send email",
        variant: "destructive",
      })
    }
  }

  if (!result) {
    return null
  }

  return (
    <main className="min-h-screen py-16 px-4">
      <div className="w-full max-w-[640px] mx-auto space-y-8">
        {isApproved && (
          <div className="bg-card border rounded-lg p-4 flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5" />
            <div className="flex-1">
              <p className="font-medium">Response Approved</p>
              <p className="text-sm text-muted-foreground">Your case response is ready to send</p>
            </div>
          </div>
        )}

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Analysis Complete</h1>
          <p className="text-muted-foreground">Pattern matched and response generated</p>
        </div>

        <div className="space-y-6">
          <div className="border rounded-lg p-8 space-y-6 bg-card">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">{result.pattern.name}</h2>
                <p className="text-sm text-muted-foreground">Pattern ID: {result.pattern.id}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{(result.pattern.confidence * 100).toFixed(0)}%</div>
                <p className="text-xs text-muted-foreground">Confidence</p>
              </div>
            </div>

            <div className="py-8 space-y-6">
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-3">
                  <span style={{ color: "var(--evidence)", fontSize: "48px" }} title="Evidence">
                    ●
                  </span>
                  <div className="text-xs text-muted-foreground max-w-[120px]">Observation gathered</div>
                </div>

                <div className="h-6 w-px bg-border" />

                <div className="flex items-center gap-3">
                  <span style={{ color: "var(--law)", fontSize: "56px", lineHeight: "1" }} title="Law">
                    ▼
                  </span>
                  <div className="text-xs text-muted-foreground max-w-[120px]">Grounded in statute</div>
                </div>

                <div className="h-6 w-px bg-border" />

                <div className="flex items-center gap-3">
                  <span style={{ color: "var(--pattern)", fontSize: "56px", lineHeight: "1" }} title="Pattern">
                    ▲
                  </span>
                  <div className="text-xs text-muted-foreground max-w-[120px]">Pattern recognized</div>
                </div>

                <div className="h-6 w-px bg-border" />

                <div className="flex items-center gap-3">
                  <span style={{ color: "var(--action)", fontSize: "48px" }} title="Action">
                    ◼
                  </span>
                  <div className="text-xs text-muted-foreground max-w-[120px]">Response contained</div>
                </div>
              </div>
            </div>

            {result.pattern.stages && (
              <div className="pt-4 border-t">
                <p className="text-sm font-medium mb-2">Pattern Stages:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {result.pattern.stages.map((stage, i) => (
                    <li key={i}>• {stage}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Generated Response</label>
            <Textarea
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              className="font-mono text-sm min-h-[400px]"
            />
          </div>

          {!emailSent && (
            <div className="border rounded-lg p-6 space-y-4 bg-card">
              <h3 className="text-lg font-semibold">Send Approval Email</h3>
              <p className="text-sm text-muted-foreground">
                Get a professional email summary with approval link to confirm before taking action
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="flex-1 px-3 py-2 bg-input border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <Button onClick={sendApprovalEmail}>
                  <Mail className="h-4 w-4 mr-2" />
                  Send
                </Button>
              </div>
            </div>
          )}

          {emailSent && emailPreview && (
            <div className="border border-[var(--stone-bronze)] rounded-lg p-6 space-y-2 bg-card">
              <div className="flex items-center gap-2 text-[var(--stone-bronze)]">
                <CheckCircle2 className="h-5 w-5" />
                <h3 className="font-semibold">Email Sent</h3>
              </div>
              <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono bg-muted/50 p-4 rounded">
                {emailPreview}
              </pre>
            </div>
          )}

          <div className="flex gap-3">
            <Button onClick={copyToClipboard} variant="outline" className="flex-1 bg-transparent">
              <Copy className="h-4 w-4 mr-2" />
              Copy to Clipboard
            </Button>
            <Button onClick={downloadText} variant="outline" className="flex-1 bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              Download .txt
            </Button>
          </div>

          <Button asChild variant="secondary" className="w-full" size="lg">
            <Link href="/tool">
              <RotateCcw className="h-4 w-4 mr-2" />
              Start New Analysis
            </Link>
          </Button>
        </div>

        <div className="text-center text-xs text-muted-foreground">
          Processing time: {result.metadata.processing_time_ms}ms
          {result.metadata.reduction_stages && (
            <span className="ml-2">
              | Stages: {result.metadata.reduction_stages.raw}→{result.metadata.reduction_stages.filtered}→
              {result.metadata.reduction_stages.matched}→{result.metadata.reduction_stages.output}
            </span>
          )}
        </div>
      </div>
    </main>
  )
}
