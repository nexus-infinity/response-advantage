import Together from "together-ai"

const together = new Together({
  apiKey: process.env.TOGETHER_API_KEY!,
})

// Geometric symbol mapping for visualization
const SYMBOL_PROMPTS = {
  evidence: "● circle, gathering point, singularity of observation",
  law: "▼ inverted triangle, grounding, weight of documented rights",
  pattern: "▲ rising triangle, recognition emerging from noise",
  action: "■ square, containment, manifestation into form",
}

export async function generateCaseVisualization({
  pattern,
  contradictions,
  stage,
}: {
  pattern: string
  contradictions: string[]
  stage: "evidence" | "law" | "pattern" | "action"
}) {
  const symbolContext = SYMBOL_PROMPTS[stage]

  const prompt = `Abstract geometric visualization of re-cognition.
    Stage: ${stage} (${symbolContext}).
    Pattern observed: ${pattern}.
    Visual metaphor: what was obscured, now witnessed.
    ${contradictions.length} points of incoherence dissolving into clarity.
    Style: minimal, high contrast, cream background (#f5f5f0), 
    near-black lines (#1a1a1a), sacred geometry.
    No text. Pure form. The question, not the answer.`

  const response = await together.images.create({
    model: "black-forest-labs/FLUX.1-schnell-Free",
    prompt,
    width: 1024,
    height: 1024,
    steps: 4,
    n: 1,
  })

  return response.data[0].url
}

// Generate progression visualization (all four stages)
export async function generateProgressionVisualization({
  caseId,
  extractedData,
}: {
  caseId: string
  extractedData: {
    timeline: string[]
    laws: string[]
    patterns: string[]
    actions: string[]
  }
}) {
  const prompt = `Sacred geometry progression visualization.
    Four symbols in vertical descent: ● ▼ ▲ ■
    Each connected by thin lines of transformation.
    ● at top: ${extractedData.timeline.length} points of evidence gathered
    ▼ below: ${extractedData.laws.length} laws grounding the observation  
    ▲ rising: ${extractedData.patterns.length} patterns recognized
    ■ at base: ${extractedData.actions.length} paths forward manifested
    Style: minimal, meditative, cream and charcoal.
    The geometry speaks. No words needed.`

  const response = await together.images.create({
    model: "black-forest-labs/FLUX.1-schnell-Free",
    prompt,
    width: 1024,
    height: 1024,
    steps: 4,
    n: 1,
  })

  return response.data[0].url
}
