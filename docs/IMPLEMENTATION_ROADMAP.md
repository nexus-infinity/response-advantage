# Implementation Roadmap: Operationalizing Nexxus Infinity

**Version:** 1.0  
**Date:** 2026-03-31  
**Status:** Active

---

## Current State → Target State Mapping

### **Layer A: Recognition (Identity & Persistence)**

#### Current Implementation
- ✓ `recognition/` package exists
- ✓ `frontend/app/components/` recognition components exist
- ⚠ No formal Canonical Ref generator

#### Target Implementation
```typescript
// recognition/src/canonical-ref-generator.ts
export interface CanonicalRef {
  system: string;           // "FIELD"
  matterType: string;       // "FOI", "TIMELINE", "FUNDING", etc.
  dateStamp: string;        // YYYYMMDD
  sequence: number;         // 001, 002, etc.
  
  toString(): string;       // Returns "FIELD-FOI-20260331-042"
}

// Usage:
const ref = generateCanonicalRef("FOI");
// → "FIELD-FOI-20260331-042"
```

#### Implementation Priority: **PHASE 1** (Weeks 1-2)
- [ ] Create canonical-ref-generator.ts
- [ ] Create ref registry (prevents duplicates)
- [ ] Add TypeScript types for all ref formats
- [ ] Integration test with recognition API

---

### **Layer B: Constraint Kernel (The Four Laws)**

#### Current Implementation
- ⚠ Geometric validation stages exist (s0-s7) but not formalized as "Four Laws"
- ⚠ No explicit Conservation validator
- ⚠ No explicit Symmetry enforcer

#### Target Implementation

**File Structure:**
```
shared/geometric-core/typescript/src/
  constraints/
    ├── conservation.ts          # Evidence cost validator
    ├── symmetry.ts              # Format & party structure validator
    ├── resonance.ts             # Temporal procedural validator
    ├── recognition.ts           # Identity verification validator
    └── constraint-engine.ts     # Master validator gate
```

**Conservation Validator:**
```typescript
// conservation.ts
export interface ConservationCheck {
  totalClaimsAdvancing: number;
  totalEvidenceCostPaid: number;
  untraceableExpenditure: number;  // Should be 0
  compliant: boolean;
  violations: string[];
}

export async function validateConservation(
  packet: FundingPacket
): Promise<ConservationCheck> {
  // For each deliverable, verify:
  // 1. Estimated cost exists
  // 2. Budget item maps 1:1 to deliverable
  // 3. No unassigned funds
  // Return violations if any
}
```

**Symmetry Enforcer:**
```typescript
// symmetry.ts
export interface SymmetryCheck {
  applicantUsesRecognitionHeader: boolean;
  funderCanRespondInSameFormat: boolean;
  bothPartiesHaveSameRules: boolean;
  compliant: boolean;
  violations: string[];
}

export async function validateSymmetry(
  packet: FundingPacket
): Promise<SymmetryCheck> {
  // Verify:
  // 1. Packet has canonical Ref
  // 2. Packet has matter type
  // 3. Funder response schema matches applicant schema
  // Return violations if asymmetric
}
```

**Resonance Scheduler:**
```typescript
// resonance.ts
export interface ResonanceCheck {
  withinStatutoryWindow: boolean;
  proceduralMomentValid: boolean;
  compliant: boolean;
  violations: string[];
  nextValidWindow?: ISO8601;
}

export async function validateResonance(
  packet: FundingPacket,
  procedureType: "FOI" | "DiscoveryFiling" | "Regulatory"
): Promise<ResonanceCheck> {
  // For FOI: Check if within 30-day submission window
  // For Discovery: Check if within court-ordered timeline
  // For Regulatory: Check if within response deadline
}
```

**Recognition Verifier:**
```typescript
// recognition.ts
export interface RecognitionCheck {
  canonicalRefValid: boolean;
  lineagePreserved: boolean;
  supercessionChainCorrect: boolean;
  compliant: boolean;
  violations: string[];
}

export async function validateRecognition(
  packet: FundingPacket
): Promise<RecognitionCheck> {
  // Verify:
  // 1. Canonical Ref format is correct
  // 2. All supersedes/supersededBy Refs exist in system
  // 3. No circular references
  // 4. Version numbering is sequential
}
```

**Master Constraint Engine:**
```typescript
// constraint-engine.ts
export interface ConstraintValidationResult {
  conservation: ConservationCheck;
  symmetry: SymmetryCheck;
  resonance: ResonanceCheck;
  recognition: RecognitionCheck;
  allCompliant: boolean;
  violations: string[];
}

export async function validateAllConstraints(
  packet: FundingPacket,
  context: { procedureType?: string }
): Promise<ConstraintValidationResult> {
  // Run all four validators
  // Aggregate results
  // Return combined validation
}
```

#### Integration Points
- `dojo/src/api/server.ts` — Call constraint validators before advancing packets
- `s0-akron-intake.ts` — First gate (Conservation check)
- `s1-queens-validation.ts` — Second gate (Symmetry check)
- `s4-kings-chamber.ts` — Third gate (Resonance check)
- `s7-crown-manifest.ts` — Final gate (Recognition check)

#### Implementation Priority: **PHASE 2** (Weeks 3-5)
- [ ] Create constraint validators (all 4 files)
- [ ] Create constraint-engine aggregator
- [ ] Wire into geometric-core processing pipeline
- [ ] Add unit tests for each constraint
- [ ] Integration tests: valid packet → compliant; invalid packet → violations

---

### **Layer C: FIELD Processing (Internal Machinery)**

#### Current Implementation
- ✓ `dojo/src/api/server.ts` provides processing entry point
- ✓ `chronicle-writer.ts` implements event logging
- ✓ `geometric-router.ts` routes through stages
- ⚠ PULSE subsystem needs formalization
- ⚠ ProofStore bundle registry needs creation
- ⚠ Brick registry needs formalization

#### Target Implementation

**PULSE Normalization:**
```typescript
// shared/geometric-core/typescript/src/pulse-renderer.ts

export interface TimelineEvent {
  id: string;                    // FIELD-EVENT-{DATE}-{SEQ}
  actorId: string;               // Who (entity ref)
  action: string;                // What
  timestamp: ISO8601;            // When
  location?: string;             // Where
  evidenceRefs: string[];        // Source documents
  relatedBreaches?: string[];    // Link to Brick refs
}

export interface EntityGraph {
  entities: Entity[];            // People, companies, accounts
  relationships: Relationship[]; // Who connected to whom
  temporalEdges: Event[];        // Ordered sequence
}

export async function pulseRender(
  rawEvidence: RawDocument[],
  context: { entityIdentifiers: string[] }
): Promise<EntityGraph & TimelineEvent[]> {
  // Extract structured events from messy documents
  // Identify entities and relationships
  // Return normalized, queryable format
}
```

**ProofStore Bundle Registry:**
```typescript
// shared/geometric-core/typescript/src/proofstore-registry.ts

export interface ProofBundle {
  canonicalRef: string;          // FIELD-DOC-{DATE}-{SEQ}
  contentHash: string;           // sha256 of bundle
  version: string;               // v1.0, v1.1 (new version = new Ref)
  created: ISO8601;
  files: BundleFile[];
  accessLevel: "Public" | "Restricted" | "ConfidentialPrivilege";
  metadata: {
    matterType: string;
    relatedRefs: string[];       // FOI request, Timeline, Funding, etc.
    chain: string[];             // Lineage
  };
}

export interface BundleFile {
  id: string;
  fileName: string;
  mimeType: string;
  hash: string;                  // sha256 of individual file
  sizeBytes: number;
  classification: "Public" | "Redacted" | "ConfidentialPrivilege";
}

export async function createProofBundle(
  files: File[],
  canonicalRef: string,
  context: { matterType: string; accessLevel: string }
): Promise<ProofBundle> {
  // Create immutable bundle
  // Calculate content hash
  // Store (or reference remote storage: S3, Vercel Blob, etc.)
  // Return bundle with verification hash
}

export async function getProofBundle(
  canonicalRef: string
): Promise<ProofBundle> {
  // Retrieve by canonical Ref
  // Verify integrity (hash check)
  // Return with access level applied
}
```

**Brick Atomic Unit Registry:**
```typescript
// shared/geometric-core/typescript/src/brick-registry.ts

export interface Brick {
  brickId: string;               // FIELD-BRICK-{DATE}-{SEQ}
  duty: string;                  // Obligation that existed
  act: string;                   // Action or inaction
  timestamp: ISO8601;            // Procedural moment
  evidence: {
    documentRefs: string[];      // Proof of occurrence
    hash: string;                // Combined evidence hash
  };
  status: "Draft" | "Verified" | "Challenged" | "Resolved";
  severity: "Low" | "Medium" | "High" | "Critical";
  relatedBricks: string[];       // Links to other Bricks (causal chain)
  interpretations: {
    constraintViolated?: "Conservation" | "Symmetry" | "Resonance" | "Recognition";
    consequence: string;         // What resulted from this breach
  };
}

export async function createBrick(input: {
  duty: string;
  act: string;
  timestamp: ISO8601;
  evidence: string[];            // Document Refs
}): Promise<Brick> {
  // Generate Brick ID
  // Verify evidence exists in ProofStore
  // Calculate evidence hash
  // Return Brick with status: Draft
}

export async function aggregateBricksIntoTimeline(
  brickIds: string[]
): Promise<Timeline> {
  // Sort by timestamp
  // Identify causal chains (Brick A → Brick B → Brick C)
  // Return complete narrative with constraint violations highlighted
}
```

#### Integration Points
- PULSE output → ProofStore (normalized events become stored documents)
- ProofStore bundles → Brick registry (evidence linked to atomic units)
- Brick registry → Chronicle writer (events logged with Refs)
- All outputs tagged with Canonical Refs and versioned

#### Implementation Priority: **PHASE 3** (Weeks 6-8)
- [ ] Create PULSE renderer with NLP entity extraction
- [ ] Create ProofStore with storage backend (S3 or Vercel Blob)
- [ ] Create Brick registry with causal chain linking
- [ ] Wire Chronicle writer to all outputs
- [ ] End-to-end test: Raw document → PULSE → ProofStore → Bricks → Timeline

---

### **Layer D: Interfaces (Bounded Outputs)**

#### Current Implementation
- ✓ `frontend/app/page.tsx` provides UI entry point
- ✗ Responsive Advantage funding API **NOT YET IMPLEMENTED**
- ✗ Walkerville publication interface **NOT YET IMPLEMENTED**

#### Target Implementation

**Responsive Advantage API (in `frontend/app/api/funding/`):**

```typescript
// frontend/app/api/funding/route.ts

export async function POST(request: Request) {
  // POST /api/funding/packets
  // Body: FundingPacket (status: Draft)
  // Returns: { canonicalRef, processingId }
  
  const packet = await request.json();
  
  // 1. Assign Canonical Ref (Layer A)
  const ref = generateCanonicalRef("FUNDING");
  
  // 2. Validate constraints (Layer B)
  const constraints = await validateAllConstraints(packet);
  if (!constraints.allCompliant) {
    return Response.json({
      status: "Rejected",
      violations: constraints.violations
    }, { status: 400 });
  }
  
  // 3. Create ProofBundle (Layer C)
  const bundle = await createProofBundle(
    [packet],
    ref,
    { matterType: "FundingPacket", accessLevel: "Restricted" }
  );
  
  // 4. Store in database and assign processingId
  const processingId = await saveFundingPacket(
    { ...packet, canonicalRef: ref, bundleRef: bundle.canonicalRef }
  );
  
  // 5. Return output
  return Response.json({
    canonicalRef: ref,
    processingId,
    status: "Submitted"
  });
}

export async function GET(request: Request) {
  // GET /api/funding/packets?status=Under Review
  // Returns: FundingPacket[]
  
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  
  const packets = await getFundingPackets({ status });
  return Response.json(packets);
}

export async function PATCH(request: Request) {
  // PATCH /api/funding/packets/{canonicalRef}
  // Body: Partial updates
  // Returns: Updated FundingPacket
  
  const { canonicalRef } = JSON.parse(await request.text());
  const updates = await request.json();
  
  // Create new version Ref if substantive changes
  const newRef = createSupercedingRef(canonicalRef);
  
  const updated = await updateFundingPacket(canonicalRef, {
    ...updates,
    supersededBy: newRef,
    lastModified: new Date().toISOString()
  });
  
  return Response.json(updated);
}
```

**Funding Approval Endpoint:**
```typescript
// frontend/app/api/funding/[canonicalRef]/approve/route.ts

export async function POST(
  request: Request,
  { params }: { params: { canonicalRef: string } }
) {
  const { decision, reasonCode, nextSteps } = await request.json();
  
  const packet = await getFundingPacket(params.canonicalRef);
  
  if (decision === "Approved") {
    const processingId = generateProcessingId();
    
    // Update Layer A (Recognition)
    await updateFundingPacket(params.canonicalRef, {
      status: "Approved",
      processingId,
      approvalStatus: [{
        approverId: "funder-id",
        decision: "Approved",
        timestamp: new Date().toISOString()
      }]
    });
    
    // Notify Layer D (Walkerville) to publish funding notice
    await notifyWalkerville({
      event: "FundingApproved",
      ref: params.canonicalRef,
      processingId
    });
    
    return Response.json({ status: "Approved", processingId });
  } else if (decision === "Declined") {
    await updateFundingPacket(params.canonicalRef, {
      status: "Declined",
      reasonCode,
      approvalStatus: [{
        approverId: "funder-id",
        decision: "Declined",
        reasonCode,
        timestamp: new Date().toISOString()
      }]
    });
    
    return Response.json({ status: "Declined", reasonCode });
  }
}
```

**Walkerville Publication API (in `frontend/app/api/publication/`):**

```typescript
// frontend/app/api/publication/tranches/route.ts

export async function POST(request: Request) {
  // POST /api/publication/tranches
  // Body: Tranche (new publication release)
  // Returns: { canonicalRef, url }
  
  const tranche = await request.json();
  
  // 1. Validate constraints (Layer B)
  const constraints = await validatePublicationConstraints(tranche);
  if (!constraints.compliant) {
    return Response.json({
      status: "Rejected",
      violations: constraints.violations
    }, { status: 400 });
  }
  
  // 2. Perform redaction (sensitive data removal)
  const redacted = await redactSensitiveData(tranche);
  
  // 3. Generate verification hashes
  const hashes = generateVerificationHashes(redacted);
  
  // 4. Create Walkerville page
  const page = await createWalkervillePage({
    ...tranche,
    content: redacted,
    verificationHashes: hashes
  });
  
  // 5. Return published URL
  return Response.json({
    canonicalRef: page.canonicalRef,
    url: `https://walkerville.example/projects/${page.slug}`,
    status: "Published"
  });
}

export async function GET(request: Request) {
  // GET /api/publication/tranches/{canonicalRef}
  // Returns: Published Tranche page
  
  const { searchParams } = new URL(request.url);
  const ref = searchParams.get("ref");
  
  const page = await getWalkervillePage(ref);
  return Response.json(page);
}
```

#### Integration Points
- Responsive Advantage receives funding packets → validates → stores with Canonical Refs
- Walkerville receives publication requests → redacts → publishes with verification hashes
- Both interfaces call constraint validators (Layer B)
- Both interfaces reference ProofStore bundles (Layer C)
- Both interfaces create audit trails (Layer A)

#### Implementation Priority: **PHASE 4** (Weeks 9-11)
- [ ] Create Responsive Advantage API (POST, GET, PATCH, approve/decline)
- [ ] Create funding validation and Conservation check endpoints
- [ ] Create Walkerville publication API (POST tranches, GET pages)
- [ ] Create redaction pipeline
- [ ] Add authentication/authorization layer
- [ ] End-to-end test: Submit funding → Approve → Auto-publish to Walkerville

---

## Phased Implementation Timeline

### **PHASE 1: Recognition Layer (Weeks 1-2)**
**Deliverable:** Canonical Ref generator + ref registry  
**Acceptance Criteria:**
- [ ] All new packets assigned valid, unique Canonical Refs
- [ ] Refs are immutable (cannot change)
- [ ] Lineage/supersession chain is trackable
- [ ] No duplicate Refs in system

### **PHASE 2: Constraint Kernel (Weeks 3-5)**
**Deliverable:** Four constraint validators integrated into processing pipeline  
**Acceptance Criteria:**
- [ ] Conservation validator rejects packets with unassigned funds
- [ ] Symmetry enforcer ensures both parties use same format
- [ ] Resonance scheduler blocks out-of-window submissions
- [ ] Recognition verifier prevents invalid Refs from advancing
- [ ] All validators called before Layer C processing

### **PHASE 3: FIELD Processing (Weeks 6-8)**
**Deliverable:** PULSE, ProofStore, Brick systems operational  
**Acceptance Criteria:**
- [ ] Raw documents normalize into structured events
- [ ] Bundles stored with verification hashes
- [ ] Atomic breaches identified and linked
- [ ] Chronicle writer logs all outputs with Refs
- [ ] End-to-end: Document → Normalized Events → ProofStore → Bricks

### **PHASE 4: Interfaces (Weeks 9-11)**
**Deliverable:** Responsive Advantage + Walkerville fully operational  
**Acceptance Criteria:**
- [ ] Funding packets submitted, approved, tracked via Canonical Refs
- [ ] Publication tranches published with redaction + verification hashes
- [ ] Funding approval auto-triggers Walkerville publication
- [ ] Users can trace any claim back to evidence via Refs
- [ ] All Layer D outputs map back to Layer C processing

### **PHASE 5: Validation & Hardening (Weeks 12-13)**
**Deliverable:** Security, performance, compliance audit  
**Acceptance Criteria:**
- [ ] No untracked expenditure (Conservation)
- [ ] No asymmetric disclosure (Symmetry)
- [ ] All timing compliant (Resonance)
- [ ] No erasure possible (Recognition)
- [ ] Performance: <500ms for constraint checks
- [ ] All Refs verified under load

---

## Success Metrics

### **Layer A Metrics**
- Every packet has a Canonical Ref
- Ref immutability verified (no deletions/resets)
- 100% lineage traceability

### **Layer B Metrics**
- 100% of packets pass constraint validation before advancement
- Zero Conservation violations (untracked funds caught)
- Zero Symmetry violations (asymmetric formats rejected)
- Zero Resonance violations (out-of-window submissions blocked)
- Zero Recognition violations (invalid Refs rejected)

### **Layer C Metrics**
- Raw documents → Normalized events (>90% accuracy)
- All bundles verify via hash
- All bricks linked to evidence
- <5 second processing time per packet

### **Layer D Metrics**
- Funding packets: <24 hour approval turnaround
- Publication tranches: <48 hour publication after approval
- User verification: All claims traceable to Canonical Refs in <10 seconds

---

## Risk Mitigation

### **Risk: Constraint Validators Too Strict**
- Mitigation: Allow "RequestedRevision" status for packets to be refined without rejection
- Mitigation: Provide explicit violation messages so applicants can fix

### **Risk: PULSE NLP Misses Important Events**
- Mitigation: Manual review gate before publishing
- Mitigation: Allow Brick challenges ("This is wrong") with counter-evidence

### **Risk: ProofStore Storage Bottleneck**
- Mitigation: Use S3 or Vercel Blob with CDN
- Mitigation: Compress large bundles

### **Risk: Regulatory Compliance**
- Mitigation: All outputs carry Canonical Refs (auditability)
- Mitigation: All redactions logged (transparency)
- Mitigation: All decisions require reason codes (accountability)

---

## Success Criteria for Full Implementation

✓ Response Advantage ecosystem operational with Canonical Refs on all transactions  
✓ All funding decisions traceable via reason codes + next steps  
✓ All evidence bundles stored with verification hashes  
✓ All publishing decisions show Observed Facts vs. Interpretations vs. Unresolved  
✓ Zero untracked expenditure (Conservation guaranteed)  
✓ Zero asymmetric disclosure (Symmetry guaranteed)  
✓ All submissions procedurally timed (Resonance guaranteed)  
✓ No administrative erasure possible (Recognition guaranteed)

