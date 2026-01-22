# ◼ Recognition System - Document Intelligence Engine

**Port**: 9630 (●OBI-WAN frequency)  
**Purpose**: S0→S7 document transformation with Chronicle logging  
**Status**: Operational (S0-S1 implemented, S2-S7 integration with geometric-core pending)

---

## Architecture

```
Document Upload
      ↓
S0 ◻ Akron Intake (9630)
      ↓
S1 🔷 Queen's Validation (coherence ≥0.70)
      ↓
[S2-S7 TODO: Wire to shared/geometric-core]
      ↓
Chronicle JSONL Log
```

---

## Backend (Python FastAPI)

**File**: `backend/recognition_api.py`

### Endpoints

```bash
POST /api/field/intake
# Upload document → S0 intake → S1 validation
# Returns: case_id, coherence, validation_passed

GET /api/field/status/{case_id}
# Poll processing status
# Returns: current_stage, events, coherence

GET /api/field/result/{case_id}
# Get S6 manifest for completed case
# Returns: structured extraction

GET /api/field/chronicle/recent?limit=50
# Get recent Chronicle events (all cases)
# Returns: JSONL events array
```

### Start Backend

```bash
cd recognition/backend
python3 recognition_api.py
# → Listening on port 9630
```

---

## Frontend (Next.js/React)

**File**: `frontend/app/recognition-page.tsx`

### Features

- Drag-and-drop file upload
- Real-time geometric visualization (●▼▲◼)
- Chronicle event timeline
- Coherence score display
- S0→S7 progress tracking

### Integration with Production

Add to main Next.js app:

```typescript
// Add route: /recognition
// Import: recognition-page.tsx
// API: Points to localhost:9630 or production tunnel
```

---

## Chronicle System

**File**: `backend/chronicle_unifier.py`

Unified 48 events from scattered JSONL files into:
```
~/FIELD/▼TATA/chronicle/unified_events.jsonl
```

**Format**:
```jsonl
{"timestamp":1737551405.137,"case_id":"case_123","stage":"S0","vertex":"●OBI-WAN","action":"intake"}
{"timestamp":1737551405.892,"case_id":"case_123","stage":"S1","vertex":"▼TATA","coherence":0.87}
```

---

## Integration with Geometric Core

### Current Status

Recognition currently implements S0-S1 locally:
```python
# Local implementation (needs replacement)
def calculate_coherence(file_path: Path) -> float:
    # Basic heuristics
    return 0.87 if file_path.suffix == '.pdf' else 0.55
```

### Integration TODO

Replace with shared geometric-core:

```python
# recognition/backend/recognition_api.py

from shared.geometric_core.python import (
    s0_akron_intake,
    s1_queens_validation,
    s4_kings_chamber,
    s7_crown_manifest
)

@app.post("/api/field/intake")
async def intake_document(file: UploadFile):
    # Use canonical S0 from geometric-core
    result = s0_akron_intake({
        'caseId': generate_case_id(),
        'rawInput': file.file.read(),
        'filename': file.filename,
        'source': 'recognition-api',
        'metadata': {'port': 9630}
    })
    
    # Use canonical S1 validation
    validated = s1_queens_validation(result)
    
    # [S2-S7 pipeline goes here]
    
    return validated
```

---

## Deployment

### Local Development

**Terminal 1**: Backend
```bash
cd recognition/backend
python3 recognition_api.py
```

**Terminal 2**: Frontend
```bash
cd recognition/frontend
npm run dev
```

**Access**: http://localhost:3000/recognition

### Production

**Backend**: Mac Studio port 9630 + Cloudflare Tunnel
**Frontend**: Vercel deployment (separate route from dialectic)

---

## Test Case: Bank Austria PDF

**Expected Flow**:
1. Upload: `Bank_Austria_Statement.pdf`
2. S0: Saved to `●OBI-WAN/_intake/`
3. S1: Coherence = 0.87 (structured PDF)
4. Chronicle: 2 events logged
5. Status: "processing" (S1 passed)
6. [S2-S7]: Pending geometric-core integration

---

## Geometric Alignment

| Stage | Implemented | Geometric Core | Aligned? |
|-------|-------------|----------------|----------|
| S0 | ✅ | ✅ | Partial (local vs canonical) |
| S1 | ✅ | ✅ | Partial (local vs canonical) |
| S2-S7 | ❌ | ✅ | **TODO: Wire to core** |

**Next Step**: Replace local S0-S1 with geometric-core imports to ensure canonical alignment.

---

## Files

```
recognition/
├── backend/
│   ├── recognition_api.py       # FastAPI server (port 9630)
│   └── chronicle_unifier.py     # JSONL consolidation
└── frontend/
    ├── app/
    │   └── recognition-page.tsx  # Upload UI
    └── lib/
        └── field-api.ts          # API client (TODO)
```

---

## Chronicle Stats

**Unified Events**: 48  
**Time Range**: 2025-07-30 → 2026-01-22  
**Size**: 18KB  
**Sources**: 10 scattered JSONL files  

**Purpose**: Psychohistory engine - each case improves pattern detection for future cases.
