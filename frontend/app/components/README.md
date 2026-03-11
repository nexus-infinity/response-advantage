# Frontend Components

This directory contains modular, reusable components for the Response Advantage frontend. Each component represents a specific aspect of the sacred geometric healing journey (S0-S7 stages).

## Component Architecture

The components are organized according to the **FIELD (Frequency-Indexed Entity Language & Dynamics)** architecture and align with the **four alchemical stages** of healing:

### Core Components

#### 1. **Branding** (`Branding.tsx`)
Sacred geometric symbols representing the four vertices:
- **●** OBSERVE (Observation vertex - 963 Hz)
- **▼** GROUND (Temporal/Legal vertex - 432 Hz)
- **▲** RECOGNISE (Pattern vertex - 528 Hz)
- **◼** ACT (DOJO apex - 741 Hz)

**Alchemical Mapping**: Pure function representation across all stages

---

#### 2. **HealingStage** (`HealingStage.tsx`)
Represents a single stage in the alchemical healing journey.

**Props**:
- `symbol`: Geometric symbol (●, ▼, ▲, ◼)
- `title`: Stage name (OBSERVE, GROUND, RECOGNISE, ACT)
- `subtitle`: Psychological process (Acknowledgement, Validation, Pattern Recognition, Empowerment)
- `description`: User-facing description
- `note`: Optional additional information (e.g., King's Chamber reference)
- `isActive`: Boolean flag to highlight active stage

**Alchemical Mapping**: Individual transformation stages

---

#### 3. **HealingJourney** (`HealingJourney.tsx`)
The complete four-stage alchemical transformation journey:

1. **Nigredo** (Blackening) → **● OBSERVE** → S0: Akron Intake
   - Psychological: Acknowledgement - "This happened"
   
2. **Albedo** (Purification) → **▼ GROUND** → S1-S2: Queen's → Gallery
   - Psychological: Validation - "You were wronged"
   
3. **Citrinitas** (Solar Awakening) → **▲ RECOGNISE** → S3-S4: Trident → DOJO
   - Psychological: Pattern Recognition - "This is systemic"
   - **King's Chamber**: φ⁻¹ = 38.2% breakthrough point
   
4. **Rubedo** (Integration) → **◼ ACT** → S5-S7: King's → OBI-WAN → Crown
   - Psychological: Empowerment - "I can act"

**Geometric Stages**: Complete S0→S7 pipeline visualization

---

#### 4. **GeometricNote** (`GeometricNote.tsx`)
Displays technical information about the geometric proof system:
- Four alchemical stages
- Four psychological transformations
- Eight geometric checkpoints (S0→S7)
- Pattern #47 detection at 94% confidence

**Purpose**: Educational context for users

---

#### 5. **ActionButtons** (`ActionButtons.tsx`)
Call-to-action buttons for user interaction:
- **Begin Journey**: Initiates the S0-S7 transformation process (coming soon)
- **View on GitHub**: Links to the open-source repository

**Function**: Entry point to the healing journey

---

## Usage

Import components from the index file:

```typescript
import {
  Branding,
  HealingJourney,
  GeometricNote,
  ActionButtons,
} from './components';

export default function Home() {
  return (
    <div>
      <Branding />
      <HealingJourney />
      <GeometricNote />
      <ActionButtons />
    </div>
  );
}
```

## Architecture Alignment

These components align with:
- **GEOMETRIC_SPEC.md**: S0→S7 canonical process
- **HEALING_ARCHITECTURE.md**: Four alchemical stages and psychological transformations
- **shared/geometric-core**: TypeScript implementation of geometric stages

## Future Extensions

As the platform develops, additional components will be created for:
- **Pattern #47 Visualization**: Can Kicking detection display
- **Evidence Upload**: S0 (Akron) intake interface
- **Timeline Display**: Temporal analysis visualization
- **Response Letter**: S7 (Crown) manifest output
- **Progress Indicator**: Real-time S0→S7 journey tracking

---

## Design Principles

1. **Modularity**: Each component has a single, clear responsibility
2. **Sacred Geometry**: All components respect the ● ▼ ▲ ◼ symbolic language
3. **Alchemical Alignment**: Components map to specific transformation stages
4. **Reusability**: Components can be composed and reused across the application
5. **Type Safety**: Full TypeScript support with clear prop interfaces
