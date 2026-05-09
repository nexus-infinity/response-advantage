## Visual Architecture - Post-Refinement (Session 3)

### Information Hierarchy

```
┌─────────────────────────────────────────────────────────────────┐
│                    PROFESSIONAL BASELINE                        │
│                   (All pages except /processing)                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │                                                        │   │
│  │         CALM, RESTRAINED CONTENT AREA                │   │
│  │    (Fades, minimal motion, clear typography)         │   │
│  │                                                        │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                 │
│                                      ┌─────────────────────┐   │
│                                      │  COHERENCE HUD      │   │
│                                      │ ──────────────────  │   │
│                                      │ Coherence: 65%      │   │
│                                      │ ♦︎●▼▲◼︎⊗             │   │
│                                      │ [expand ↓]          │   │
│                                      └─────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
        ▲
        └── Always visible, persistent, non-intrusive
            Glassmorphic aesthetic, bottom-right z-40
```

### Coherence HUD States

**Collapsed (Default)**
```
┌──────────────────────────────────┐
│ Coherence  │  ●▼▲◼︎⊗ [↓]         │
│    65%     │                      │
└──────────────────────────────────┘
```

**Expanded (Click to reveal diagnostics)**
```
┌─────────────────────────────────────┐
│ Coherence     │  ●▼▲◼︎⊗ [↑]        │
│    65%        │                     │
├─────────────────────────────────────┤
│ Vertex Status                       │
│ ♦︎ AKRON        Pending              │
│ ● OBI-WAN      Active (pulsing)     │
│ ▼ TATA         Pending              │
│ ▲ ATLAS        Pending              │
│ ◼︎ DOJO         Pending              │
│ ⊗ ARKADAS      Pending              │
├─────────────────────────────────────┤
│ Score Breakdown                     │
│ Evidence Quality      42% ▓░░░░░░░░ │
│ Legal Grounding       20% ▓░░░░░░░░ │
│ Pattern Recognition   3% ░░░░░░░░░ │
├─────────────────────────────────────┤
│ [View Case]  [Export]               │
└─────────────────────────────────────┘
```

### Navigation Sidebar (Left Edge - Always)

```
┌────┐
│ ♦︎ │  AKRON (Intake)
│ ● │  OBI-WAN (Observe)
│ ▼ │  TATA (Ground)
│ ▲ │  ATLAS (Reduce)
│ ◼︎ │  DOJO (Act)
│ ⊗ │  ARKADAS (Coming soon)
│ ─ │  ─────
│ ✚ │  NEW CASE
│ ● │  STATUS
└────┘
```

### Route-Specific Treatments

| Route | Motion Level | Aesthetic | Maps |
|-------|--------------|-----------|------|
| `/` | Calm fades | Centered lists, minimal | None |
| `/start` | Minimal | Form-focused | None |
| `/observe` | Subtle | Evidence capture | Static map (component) |
| `/akron` | None | Professional UI | None |
| `/ground` | None | Legal grid | Optional static |
| `/reduce` | None | Pattern display | None |
| `/processing` | **CINEMATIC** | **Satellite 45° tilt** | **Real Google Maps** |
| `/act` | None | Output ready | Static snapshot |
| `/result` | Minimal fade | Summary display | Map snapshot |

### Coherence HUD Integration Points

The HUD reads from:
- Current `IntakePacket` state (via context/hooks in future)
- Triangle validation status (Fact/Doc/Ledger)
- Active vertex (highlighted in strip)
- Overall coherence score (0-100%)

Future: Can be wired to update in real-time as user progresses through stages.

---

## De-Noise Summary

| Element | Before | After |
|---------|--------|-------|
| Chaos fragments | Scattered, rotating, +150ms delay each | Centered list, linear fade-in |
| Transformation overlays | Multiple simultaneous animations | Clean single fade + simple slide |
| Background grid | Kinetic rotation in chaos state | Static, minimal |
| HUD presence | None (lost in UI) | Always visible, persistent |
| Cinematic feel | Every page | `/processing` only |
| Navigation | Same as before (good) | Enhanced with status dots |

**Result**: The system now reads as **professional forensic software** with controlled cinematic moments, not an art installation.
