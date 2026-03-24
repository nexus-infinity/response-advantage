// Symbol System - Muted, Professional, Chakra-Aligned
// Reputable evidence aesthetic: subdued but meaningful
// These colors honor frequency mapping while maintaining professional tone

export const SYMBOL_COLORS = {
  chaos: "#4a4a4a",
  "●": "#7B6B8D", // OBSERVE - muted violet (Crown/Third Eye - witnessing)
  "▼": "#A85D3B", // GROUND - terracotta (Sacral - anchoring in law)
  "▲": "#9A7B2C", // RECOGNISE - antique gold (Solar Plexus - pattern detection)
  "◼": "#4A6FA5", // ACT - steel blue (Throat - manifestation, speech)
} as const

// Symbol metadata for consistent labeling
export const SYMBOL_META = {
  "●": {
    label: "OBSERVE",
    verb: "Document",
    desc: "Capture evidence",
    route: "/observe",
    chakra: "Crown/Third Eye",
    entity: "OBI-WAN",
  },
  "▼": {
    label: "GROUND",
    verb: "Anchor",
    desc: "Legal framework",
    route: "/ground",
    chakra: "Sacral",
    entity: "TATA",
  },
  "▲": {
    label: "RECOGNISE",
    verb: "Reveal",
    desc: "Find contradictions",
    route: "/reduce",
    chakra: "Solar Plexus",
    entity: "ATLAS",
  },
  "◼": {
    label: "ACT",
    verb: "Manifest",
    desc: "Generate outputs",
    route: "/act",
    chakra: "Throat",
    entity: "DOJO",
  },
} as const

// Consistent sizing
export const SYMBOL_SIZE = {
  xs: "text-xs",     // 12px - inline references
  sm: "text-sm",     // 14px - compact UI
  base: "text-base", // 16px - standard/side panel
  lg: "text-lg",     // 18px - emphasis
  xl: "text-xl",     // 20px - navigation
  "2xl": "text-2xl", // 24px - headers
  "3xl": "text-3xl", // 30px - hero nav
  "4xl": "text-4xl", // 36px - hero focus
  "5xl": "text-5xl", // 48px - transformation center
} as const

export type SymbolKey = "●" | "▼" | "▲" | "◼"
export type SymbolColorKey = keyof typeof SYMBOL_COLORS
