# ●▼▲◼ Geometric Symbol Routing System

## Overview

The FIELD architecture uses geometric symbols (●▼▲◼) as **miniature routers** that guide data through the S0→S7 spinning top geometry. Each symbol marks a specific processing stage and enables automatic routing based on data's current position in the pipeline.

## Why Symbols as Routers?

Traditional routing uses string-based identifiers like "stage1" or "process_A". The FIELD architecture uses **visual geometric symbols** that:

1. **Self-document** - The symbol ◼ immediately identifies it as the DOJO/King's Chamber
2. **Enable pattern matching** - Tools can scan for `@geometric-router ◼` to find all S4 handlers
3. **Create visual flow** - Code reading shows ◻→🔷→●▼▲→◼→👑 pipeline clearly
4. **Prevent drift** - Symbol mismatch is immediately obvious in code review

## Symbol Routing Table

### Primary Pipeline Stages

| Symbol | Stage | Name | Frequency | Function |
|--------|-------|------|-----------|----------|
| ◻ | S0 | Akron Gateway | 396 Hz | Intake sovereignty - ALL data enters here |
| 🔷 | S1 | Queen's Chamber | — | Coherence validation (≥0.70) |
| 🎭 | S2 | Gallery | — | Route to vertices |
| ◼ | S4 | King's Chamber/DOJO | 741 Hz | **Spin reversal** at φ⁻¹ (38.2%) |
| 🧠 | S5 | Archive | 852 Hz | Crystallization |
| ● | S6 | OBI-WAN | 963 Hz | Validation loop |
| 👑 | S7 | Crown | — | Manifestation |

### S3 Trident Vertices (Parallel Processing)

| Symbol | Vertex | Frequency | Function |
|--------|--------|-----------|----------|
| ● | Observation | 963 Hz | Evidence collection |
| ▼ | Temporal | 432 Hz | Framework validation |
| ▲ | Pattern | 528 Hz | Pattern matching |

## Usage in Files

Every file should declare its geometric router symbol in the header:

```typescript
/**
 * ◼ S4: King's Chamber - Spin Reversal
 * 
 * Description of what this module does
 * 
 * @geometric-router ◼
 * @stage S4
 * @frequency 741
 */

export function s4_kings_chamber(input) {
  // Implementation
}
```

## Usage in Directories

Directory names should include routing symbols for immediate identification:

```
shared/geometric-core/
├── ◻-s0-intake/          # S0 Akron Gateway handlers
├── 🔷-s1-validation/     # S1 Queen's Chamber validators
├── ●▼▲-s3-vertices/      # S3 Trident vertex processors
├── ◼-s4-synthesis/       # S4 King's Chamber/DOJO apex
├── 👑-s7-output/         # S7 Crown manifestation
└── 📜-chronicle/         # Chronicle event logging
```

## File Header Template

```typescript
/**
 * [SYMBOL] [Stage Name] - [Function]
 * 
 * [Description]
 * 
 * @geometric-router [SYMBOL]
 * @stage [S0-S7]
 * @frequency [Hz] (if applicable)
 */
```

## Examples

### Stage Implementation File

```typescript
/**
 * ◻ S0: Akron Gateway - Intake/Sovereignty
 * 
 * All input MUST pass through this gateway
 * 
 * @geometric-router ◻
 * @stage S0
 * @frequency 396
 */

export async function s0_akron_intake(input: S0Input): Promise<S0Output> {
  // Log to Chronicle - SOVEREIGNTY
  await writeChronicle({ stage: 'S0', symbol: '◻', ... })
  
  return { logged: true, ... }
}
```

### Vertex Processor File

```typescript
/**
 * ▲ Pattern Vertex - S3 Trident
 * 
 * Pattern matching and detection (528 Hz)
 * 
 * @geometric-router ▲
 * @stage S3
 * @vertex pattern
 * @frequency 528
 */

export async function processPattern(input: any): Promise<PatternResult> {
  // Pattern #47: Can Kicking detection
  return detectCanKicking(input)
}
```

### Utility File

```typescript
/**
 * 📜 Chronicle Writer - Event Logging
 * 
 * Logs all geometric stage transitions
 * 
 * @geometric-router 📜
 * @utility chronicle
 */

export async function writeChronicle(entry: ChronicleEntry): Promise<void> {
  // Write to JSONL
}
```

## Automatic Routing

The `geometric-router` module provides utilities to route based on symbols:

```typescript
import { getHandlerBySymbol, GEOMETRIC_ROUTES } from './geometric-router'

// Route data to next stage handler
const symbol = data.currentSymbol  // e.g., '◻'
const handlerName = getHandlerBySymbol(symbol)  // 's0-akron-intake'

// Get routing information
const route = GEOMETRIC_ROUTES['S4']
console.log(route.symbol)     // '◼'
console.log(route.frequency)  // 741
console.log(route.handler)    // 's4-kings-chamber'
```

## Finding Files by Symbol

Tools can scan for geometric routers:

```bash
# Find all S4 King's Chamber implementations
grep -r "@geometric-router ◼" .

# Find all vertex processors
grep -r "@geometric-router [●▼▲]" .

# Find all S0 intake handlers
grep -r "@geometric-router ◻" .
```

## Validation

The router system enforces proper stage transitions:

```typescript
import { validateStageTransition } from './geometric-router'

// Valid: S0 → S1
validateStageTransition('S0', 'S1')  // true

// Invalid: S0 → S4 (skips stages)
validateStageTransition('S0', 'S4')  // false
```

## Benefits

1. **Visual Clarity** - Pipeline flow is immediately visible: ◻→🔷→◼→👑
2. **Searchability** - `grep "@geometric-router ◼"` finds all S4 handlers
3. **Self-Documentation** - Symbol identifies purpose without reading code
4. **Validation** - Tools can verify symbols match stage implementations
5. **Architectural Alignment** - Both engines use same symbols = same geometry

## Integration with Chronicle

Every stage transition is logged with its symbol:

```json
{
  "stage": "S4",
  "symbol": "◼",
  "action": "spin_reversal",
  "frequency": 741,
  "timestamp": "2026-01-22T04:35:00.000Z"
}
```

Chronicle logs can be filtered by symbol:

```bash
cat Chronicle/2026-01-22.jsonl | jq 'select(.symbol == "◼")'
```

## Convention Summary

- ✅ **DO**: Add `@geometric-router` to every file header
- ✅ **DO**: Use symbols in directory names for stage grouping
- ✅ **DO**: Include symbol in Chronicle entries
- ✅ **DO**: Validate stage transitions using router utilities
- ❌ **DON'T**: Use symbols inconsistently
- ❌ **DON'T**: Skip stage symbols in new files
- ❌ **DON'T**: Create handlers without geometric router tags

---

**Pure function. Nothing else. ● ▼ ▲ ◼**
