# Response Advantage - System Documentation

**Last Updated:** Session 2026-05-10  
**Status:** Development - Phase 1 Complete, Phase 2 In Progress

---

## Overview

Response Advantage is a geometric complaint documentation system that transforms chaotic institutional experiences into structured, actionable outputs. The system operates via a four-stage symbolic framework (●▼▲◼) that guides users from raw observation through to ready-to-send formal communications.

---

## Core Concepts

### The Symbol System

| Symbol | Stage | Color | Chakra | Entity | Purpose |
|--------|-------|-------|--------|--------|---------|
| ● | OBSERVE | `#7B6B8D` (muted violet) | Crown/Third Eye | OBI-WAN | Capture raw observations, evidence, what happened |
| ▼ | GROUND | `#A85D3B` (terracotta) | Sacral | TATA | Anchor to legal framework, rights, jurisdiction |
| ▲ | RECOGNISE | `#9A7B2C` (antique gold) | Solar Plexus | ATLAS | Find contradictions, pattern recognition |
| ◼ | ACT | `#4A6FA5` (steel blue) | Throat | DOJO | Generate outputs, manifestation, ready-to-send |

### Output Duality

Every stage produces TWO outputs:
- **Quick**: Copy-paste ready sentence for immediate use
- **Deep**: Comprehensive record with full metadata, timestamps, references

---

## Architecture

### File Structure

```
/app
├── page.tsx              # Landing page with hero transformation
├── layout.tsx            # Root layout with sidebars
├── globals.css           # Tailwind v4 + design tokens
├── observe/page.tsx      # ● Stage - Evidence capture
├── ground/page.tsx       # ▼ Stage - Legal framework (STUB)
├── reduce/page.tsx       # ▲ Stage - Dialectic reduction
├── act/page.tsx          # ◼ Stage - Output generation (STUB)
├── start/page.tsx        # Case initiation
├── processing/page.tsx   # Cinematic map sequence
├── result/page.tsx       # Final output display
├── case/[id]/page.tsx    # Individual case view
└── api/
    ├── chat/route.ts     # AI SDK 6 streaming chat
    ├── upload/route.ts   # File upload handler
    ├── dialectic/route.ts # Reduction engine proxy
    ├── geocode/route.ts  # Address to coordinates
    ├── process/route.ts  # Case processing
    ├── result/[caseId]/route.ts
    └── extract/route.ts  # Entity extraction

/components
├── navigation-sidebar.tsx  # Left navigation (●▼▲◼)
├── ai-sidecar.tsx          # Right collapsible AI chat
├── logo-symbols.tsx        # Animated symbol display
├── location-map.tsx        # Google Maps integration
├── theme-provider.tsx      # Dark/light mode
└── ui/                     # shadcn/ui components

/lib
├── constants/symbols.ts    # Centralized symbol definitions
├── types/complaint-system.ts # Domain type definitions
└── utils.ts                # Utility functions (cn, etc.)
```

---

## Functional Pages

### `/` - Landing Page
**Status:** COMPLETE

- Hero section with animated symbol transformation
- Stage progression visualization (chaos → ● → ▼ → ▲ → ◼)
- "Start Case" call-to-action
- Quick/Deep output previews per stage

### `/observe` - Evidence Capture
**Status:** COMPLETE

- Location input with address capture
- Evidence description form
- File attachment support
- Generates ● observation records

### `/reduce` - Dialectic Reduction
**Status:** COMPLETE

- Contrast comparison interface ("They said" vs "Reality")
- Single contradiction enforcement
- Quick output generation
- Posts to `/api/dialectic` for AI processing

### `/processing` - Cinematic Sequence
**Status:** COMPLETE

- Geocodes all case addresses
- Google Maps integration with custom markers
- Symbol-colored pins for each stage
- Animated stage progression
- 8-second timeout fallback if maps fail

### `/ground` - Legal Framework
**Status:** STUB - Needs Implementation

Planned features:
- Jurisdiction selector (Australian law default)
- Act/Section lookup
- Rights framework display
- Legal precedent suggestions

### `/act` - Output Generation
**Status:** STUB - Needs Implementation

Planned features:
- Email generator with audience wrappers
- FOI request builder
- Formal complaint letter generator
- Export to PDF/DOCX

---

## UI Components

### Navigation Sidebar (Left)
**Location:** `/components/navigation-sidebar.tsx`

- Fixed position, left side
- Four symbol stages with labels
- Active state highlighting with left border
- Hover tooltips with descriptions
- "New Case" button at bottom
- Mobile hamburger menu
- Responsive: hidden on mobile, visible on `md:` breakpoint

### AI Sidecar (Right)
**Location:** `/components/ai-sidecar.tsx`

- Collapsible panel, slides from right
- Floating trigger button (bottom-right)
- Chat view with streaming responses
- Settings view with:
  - AI connection status (Vercel AI Gateway)
  - Model info (Claude Sonnet)
  - Chat history management
  - Clear conversation
- Quick prompt suggestions for empty state
- Symbol highlighting in messages (●▼▲◼ colored inline)
- Mobile: full-screen overlay with backdrop

### Logo Symbols
**Location:** `/components/logo-symbols.tsx`

- Animated or static symbol display
- Configurable size (sm/md/lg)
- Row or column direction
- Uses centralized color constants

---

## API Endpoints

### `/api/chat` - AI Chat
**Method:** POST  
**Status:** COMPLETE

Uses AI SDK 6 with `streamText`. System prompt instructs Claude about:
- The ●▼▲◼ framework
- Quick/Deep output duality
- Emotional context awareness
- Australian legal system focus

### `/api/upload` - File Upload
**Method:** POST  
**Status:** COMPLETE

Returns `processingId` for tracking case through system.

### `/api/dialectic` - Reduction Engine
**Method:** POST  
**Status:** COMPLETE

Proxies to DOJO backend (localhost:9630 or production). Handles contrast comparisons.

### `/api/geocode` - Address Resolution
**Method:** POST  
**Status:** COMPLETE

Converts addresses to lat/lng coordinates for map display.

### `/api/process` - Case Processing
**Method:** POST/GET  
**Status:** COMPLETE

Initiates and tracks case processing status.

---

## Type System

### Core Types (`/lib/types/complaint-system.ts`)

```typescript
type Stage = "●" | "▼" | "▲" | "◼"
type SymbolKey = Stage

interface StageMetadata {
  stage: Stage
  label: string
  color: string
  description: string
  userPrompt: string
}

interface LocationEvent {
  id: string
  symbol: Stage
  title: string
  time: string
  address: string
  detail: string
  coords?: { lat: number; lng: number }
  pinColor?: string
}

interface ContrastComparison {
  theySaid: string
  reality: string
  source?: string
  date?: string
}
```

---

## Design System

### Colors (Chakra-Aligned, Muted)

| Token | Value | Usage |
|-------|-------|-------|
| `--evidence` / ● | `#7B6B8D` | Observation stage |
| `--law` / ▼ | `#A85D3B` | Grounding stage |
| `--pattern` / ▲ | `#9A7B2C` | Recognition stage |
| `--action` / ◼ | `#4A6FA5` | Action stage |
| `--background` | `#0d1117` | App background |
| `--foreground` | `#ffffff` | Primary text |

### Typography
- Font: Inter (sans-serif)
- Headings: Font weight 600-700
- Body: Font weight 400, line-height 1.5-1.6
- Symbols: Consistent `text-lg` (18px) in navigation

### Layout
- Left sidebar: 80px width (`md:ml-20` offset)
- Right sidecar: 400px width when open
- Main content: Flexible, centered
- Responsive breakpoint: `md` (768px)

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Yes | Google Maps JavaScript API |
| `AI_GATEWAY_API_KEY` | No | Only for non-default AI providers |

**Note:** The Vercel AI Gateway provides zero-config access to Claude, GPT, and other models without additional API keys.

---

## Known Limitations

1. **No persistence** - Cases are not saved to database (Supabase integration planned)
2. **No auth** - No user accounts yet
3. **Stub pages** - `/ground` and `/act` need full implementation
4. **No exports** - PDF/DOCX generation not implemented
5. **No GTS validation** - 12-point output validator not implemented
6. **No spinning-top logic** - Recursive stage reversal not implemented

---

## Development Commands

```bash
# Local development
npm run dev

# The app runs on next-lite runtime in v0
# No package.json required - dependencies inferred from imports
```

---

## Next Implementation Priorities

1. **Complete `/ground` page** - Legal framework selector UI
2. **Complete `/act` page** - Output generation with audience wrappers
3. **Implement Quick/Deep rendering** - Dual output display in UI
4. **Add Reference ID spine** - `FIELD-[MATTERCODE]-YYYYMMDD-NNN`
5. **Database integration** - Supabase for case persistence
6. **GTS validator** - 12-point check before output release
