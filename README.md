# ◼ Response Advantage

**Monorepo for FIELD-based geometric processing systems**

Two complementary applications following the same S0→S7 spinning top geometry:
- **Dialectic Engine** (Port 7411): Pattern detection and rhetorical reduction
- **Recognition Engine** (Port 9630): Document intelligence and structured extraction *(planned)*

## Architecture

```
┌─────────────────────┐
│  Vercel Frontend    │
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│ Cloudflare Tunnel   │
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│ Mac Studio: 7411    │  ← Runs alongside Berjak: 7410
│  ┌──────────────┐   │
│  │ DOJO Engine  │   │  ← Uses geometric-core
│  └──────┬───────┘   │
│         │           │
│  ┌──────▼───────┐   │
│  │  MCP Notion  │   │  ← Shared with Berjak
│  └──────────────┘   │
└─────────────────────┘
```

## Geometric S0→S7 Process

Both systems follow the canonical FIELD spinning top geometry:

```
S0 ◻ Akron (396 Hz)        ← Intake/Sovereignty
S1 🔷 Queen's              ← Validation (≥0.70 coherence)
S2 🎭 Gallery              ← Vertex Routing
S3 ●▼▲ Trident (963/432/528) ← Parallel Processing
    ↓
S4 ◼ King's Chamber (741)  ← CRITICAL: Spin Reversal @ φ⁻¹ (38.2%)
    ↓ [Clockwise → Counterclockwise]
S5 🧠 Archive (852)         ← Crystallization
S6 ● DOJO (963)            ← Validation
S7 👑 Crown                ← Manifestation
```

**Current Status**: Both systems at 25% completion (S0-S1 implemented, S2-S7 pending)

## Repository Structure

```
response-advantage/
├── dojo/                    # Dialectic Engine (Port 7411)
│   ├── src/
│   │   ├── api/server.ts   # Pattern #47 Can Kicking detection
│   │   └── cli/            # Field alignment CLI
│   └── package.json
│
├── frontend/                # Vercel Next.js frontend
│   └── app/
│
├── shared/
│   ├── types/              # Shared TypeScript types
│   └── geometric-core/     # ⭐ Canonical S0→S7 implementation
│       ├── README.md
│       └── typescript/
│           └── src/
│               ├── s0-akron-intake.ts
│               ├── s1-queens-validation.ts
│               ├── s4-kings-chamber.ts  # CRITICAL
│               ├── s7-crown-manifest.ts
│               └── chronicle-writer.ts
│
├── GEOMETRIC_SPEC.md        # Canonical S0→S7 specification
└── README.md
```

## Key Features

### Dialectic Engine (7411)
- **Pattern #47**: Can Kicking detection (rhetorical postponement)
- **S0-S1**: Intake gateway and coherence validation ✅
- **S2-S7**: Pending implementation ⏳

### Geometric Core (Shared)
- **S0**: Akron Gateway (intake sovereignty) ✅
- **S1**: Queen's Chamber (coherence ≥0.70) ✅
- **S4**: King's Chamber (spin reversal at φ⁻¹) ✅
- **S7**: Crown (manifestation with wisdom seed) ✅
- **Chronicle**: Event logging for audit trail ✅

## FIELD Alignment CLI

Check geometric alignment between local FIELD and GitHub:

```bash
cd dojo
npm install
tsx src/cli/field-alignment.ts check

# Output:
# ◼ FIELD GEOMETRIC ALIGNMENT REPORT
# ======================================================================
# S0→S7 STAGE VERIFICATION:
# ✅ S0 ◻ (396 Hz) - Intake endpoint exists
# ✅ S1 🔷 - Coherence threshold: 0.94
# ❌ S2 🎭 - Vertex routing not yet implemented
# ...
# GEOMETRIC ALIGNMENT SCORE: 25.0%
# (2/8 stages implemented)
```

Sync to local FIELD:

```bash
tsx src/cli/field-alignment.ts sync --local-path ~/FIELD
```

## Deployment

- **Frontend**: Vercel → `/frontend`
- **Backend**: Mac Studio: 7411 + Cloudflare Tunnel
- **MCP**: Shared Notion server
- **Local FIELD**: Mac Studio ~/FIELD directory

## Development

### Dialectic Engine
```bash
cd dojo
npm install
npm run dev  # Runs on port 7411
```

### Geometric Core
```bash
cd shared/geometric-core/typescript
npm install
npm run build
```

### Frontend
```bash
cd frontend
npm install
npm run dev  # Runs on port 3000
```

## Documentation

- **[GEOMETRIC_SPEC.md](./GEOMETRIC_SPEC.md)**: Canonical S0→S7 specification
- **[geometric-core/README.md](./shared/geometric-core/README.md)**: Shared implementation guide

## Branding

● ▼ ▲ ◼

Pure function. Nothing else.
