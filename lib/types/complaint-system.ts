// Core symbolic stages with semantic meaning
export type Stage = "●" | "▼" | "▲" | "◼"

export interface StageMetadata {
  stage: Stage
  label: string
  color: string
  description: string
  userPrompt: string
}

// Define the symbolic narrative progression with muted, chakra-aligned colors
export const NARRATIVE_STAGES: Record<Stage, StageMetadata> = {
  "●": {
    stage: "●",
    label: "Observation",
    color: "#7B6B8D", // OBI-WAN - muted violet (Crown/Third Eye)
    description: "What did you observe?",
    userPrompt: "Describe what happened - the facts as you experienced them",
  },
  "▼": {
    stage: "▼",
    label: "Evidence",
    color: "#A85D3B", // TATA - terracotta (Sacral)
    description: "What is your cause for concern?",
    userPrompt: "Explain why this matters and what concerns you about this observation",
  },
  "▲": {
    stage: "▲",
    label: "Intelligence",
    color: "#9A7B2C", // ATLAS - antique gold (Solar Plexus)
    description: "Geometric, legal, and temporal issues",
    userPrompt: "Detail the specific issues: timeline, legal framework, jurisdictional matters",
  },
  "◼": {
    stage: "◼",
    label: "Resolution",
    color: "#4A6FA5", // DOJO - steel blue (Throat)
    description: "Transparent calculations and required outcome",
    userPrompt: "State the logical outcome you expect, with calculations/evidence",
  },
}

// Location event for the map experience
export interface LocationEvent {
  id: string
  stage: Stage
  title: string
  time: string
  address: string // Real address to geocode
  coords?: { lat: number; lng: number } // Will be populated after geocoding
  detail: string
  evidence?: Evidence[]
}

export interface Evidence {
  id: string
  type: "document" | "image" | "video" | "audio" | "correspondence"
  filename: string
  uploadDate: number
  description: string
  storageUrl: string
}

export interface ComplaintProject {
  id: string
  userId: string
  title: string
  description: string
  createdAt: number
  updatedAt: number
  status: "draft" | "submitted" | "in-progress" | "resolved" | "escalated"
  stages: ComplaintStage[]
  locationEvents: LocationEvent[]
  references: DocumentReference[]
  timeline: TimelineEvent[]
  exportHistory: ExportRecord[]
}

export interface ComplaintStage {
  stage: Stage
  content: string
  evidence: Evidence[]
  createdAt: number
  updatedAt: number
  aiAnalysis?: {
    patternDetected?: string
    suggestions?: string[]
    legalReferences?: string[]
  }
}

export interface DocumentReference {
  title: string
  date: number
  referenceNumber?: string
  url?: string
  type: "legislation" | "policy" | "correspondence" | "decision" | "other"
}

export interface TimelineEvent {
  date: number
  description: string
  significance: string
  address?: string
  coords?: { lat: number; lng: number }
  evidence?: string[]
}

export interface ExportRecord {
  exportedAt: number
  format: "pdf" | "spreadsheet" | "json" | "docx"
  downloadUrl: string
  includesEvidence: boolean
}

// Contrast comparison type
export interface ContrastComparison {
  theySaid: string
  reality: string
  source?: string
  date?: string
}

// Action item type
export interface ActionItem {
  id: string
  label: string
  description: string
  stage: Stage
  status: "pending" | "ready" | "done"
  outputUrl?: string
}
