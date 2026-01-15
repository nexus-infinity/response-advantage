import { generateCaseVisualization, generateProgressionVisualization } from "@/lib/image-gen"
import type { NextRequest } from "next/server"

export async function POST(req: NextRequest) {
  const { caseId, pattern, contradictions, stage, extractedData } = await req.json()

  try {
    let imageUrl: string

    if (stage === "complete" && extractedData) {
      // Generate full progression visualization
      imageUrl = await generateProgressionVisualization({
        caseId,
        extractedData,
      })
    } else {
      // Generate stage-specific visualization
      imageUrl = await generateCaseVisualization({
        pattern,
        contradictions,
        stage,
      })
    }

    return Response.json({ imageUrl })
  } catch (error) {
    console.error("Visualization generation failed:", error)
    // Graceful degradation - return placeholder
    return Response.json({
      imageUrl: null,
      fallback: true,
      message: "Visualization will be generated when available",
    })
  }
}
