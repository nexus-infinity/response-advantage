# Responsive Advantage: Funding Interface Specification

**Version:** 1.0  
**Date:** 2026-03-31  
**Status:** Operational

---

## About Responsive Advantage

**Canonical Description (Funder-Facing):**

Responsive Advantage is a tranche-based funding model that directly maps dollars to forensic deliverables. Every funding request enforces Conservation (evidence-cost transparency), Symmetry (uniform rules for funder and applicant), and procedural Resonance. Funding advances by structure, not negotiation. This is how we keep truth-production aligned across administrative churn.

---

## Purpose

Responsive Advantage is the **funding intake and approval interface** for Nexxus Infinity. It enforces Conservation and Symmetry constraints on all incoming funding packets before advancing to processing.

---

## Funding Packet Structure

All funding requests use the Recognition Header format:

```typescript
interface FundingPacket {
  // Layer A: Recognition
  canonicalRef: string;              // FIELD-FUNDING-{DATE}-{SEQ}
  matterType: "FundingPacket";
  version: string;                   // v1.0, v1.1, etc.
  status: "Draft" | "Submitted" | "Under Review" | "Approved" | "Declined" | "Funded";
  createdDate: ISO8601;
  lastModified: ISO8601;
  lineage: {
    supersedes: string[];            // Previous Refs this replaces
    supersededBy: string[];          // Refs that replace this
  };
  externalIds: {
    fundingRequestNumber?: string;
    projectCode?: string;
    [key: string]: string;
  };

  // Layer B: Constraint Info
  applicant: {
    name: string;
    identifier: string;              // ABN, company number, etc.
    contact: string;
  };
  fundingRequestAmount: number;
  currency: string;                  // AUD, USD, etc.
  purposes: string[];                // Specific deliverable descriptions

  // Layer C: Deliverables (Conservation-mapped)
  deliverables: Deliverable[];      // See Deliverable schema below
  budget: BudgetBreakdown;           // Dollar-to-artifact mapping
  timeline: {
    requestDate: ISO8601;
    expectedStartDate: ISO8601;
    expectedCompletionDate: ISO8601;
    tranches: Tranche[];             // Phased funding if applicable
  };

  // Layer D: Interface & Approval
  targetInterface: "Funding" | "Publication" | "Filing";
  requiredApprovals: string[];
  approvalStatus: ApprovalRecord[];
  reasonCode?: string;               // Populated on decline
  nextSteps?: string;                // Populated on review
  processingId?: string;             // Assigned by system after submission
}

interface Deliverable {
  id: string;                        // FIELD-DELIVER-{DATE}-{SEQ}
  name: string;
  description: string;
  evidenceThreshold: "Low" | "Medium" | "High";
  estimatedCost: number;
  relatedRefs: string[];             // Links to FOI, Timeline, etc.
  expectedOutput: {
    type: "FOIBundle" | "TimelineNormalization" | "PublicationPage" | "ExpertReport";
    format: string;                  // PDF, JSON, Markdown, etc.
    access: "Public" | "Restricted" | "ConfidentialPrivilege";
  };
  conservationProof: {
    evidenceCost: number;            // Dollar amount tied to this
    verifiable: boolean;
  };
  status: "Proposed" | "Approved" | "InProgress" | "Completed" | "Published";
}

interface BudgetBreakdown {
  items: BudgetItem[];
  total: number;
  conservationValidation: {
    totalEvidenceCost: number;
    unassignedFunds: number;        // Should be 0 for strict Conservation
    status: "Compliant" | "Violation";
    violations?: string[];
  };
}

interface BudgetItem {
  description: string;
  amount: number;
  relatedDeliverable: string;       // Which deliverable this funds
  receiptsRequired: boolean;
  expectedDocumentation: string[];
}

interface Tranche {
  tranch eId: string;
  releaseCondition: string;         // e.g., "Upon FOI response received"
  amount: number;
  dueDate: ISO8601;
  relatedDeliverables: string[];
}

interface ApprovalRecord {
  approverId: string;
  approverRole: "Funder" | "Applicant" | "Administrator" | "Compliance";
  decision: "Approved" | "Declined" | "Pending" | "RequestedRevision";
  timestamp: ISO8601;
  comment?: string;
  reasonCode?: string;               // Required on decline
}
```

---

## Conservation Constraint: Dollar-to-Artifact Mapping

**Rule:** Every dollar in the budget must map 1:1 to a specific deliverable artifact.

### Compliant Example:
```json
{
  "canonicalRef": "FIELD-FUNDING-20260331-002",
  "fundingRequestAmount": 200,
  "deliverables": [
    {
      "id": "FIELD-DELIVER-20260331-001",
      "name": "FOI Request Lodgement",
      "estimatedCost": 50,
      "expectedOutput": { "type": "FOIBundle" }
    },
    {
      "id": "FIELD-DELIVER-20260331-002",
      "name": "Response Bundle Processing",
      "estimatedCost": 100,
      "expectedOutput": { "type": "FOIBundle" }
    },
    {
      "id": "FIELD-DELIVER-20260331-003",
      "name": "Publication Summary Page",
      "estimatedCost": 50,
      "expectedOutput": { "type": "PublicationPage" }
    }
  ],
  "budget": {
    "items": [
      {
        "description": "Statutory FOI filing fee",
        "amount": 50,
        "relatedDeliverable": "FIELD-DELIVER-20260331-001"
      },
      {
        "description": "Document indexing labor (10 hours @ $10/hr)",
        "amount": 100,
        "relatedDeliverable": "FIELD-DELIVER-20260331-002"
      },
      {
        "description": "Publication markup and proofing",
        "amount": 50,
        "relatedDeliverable": "FIELD-DELIVER-20260331-003"
      }
    ],
    "total": 200,
    "conservationValidation": {
      "totalEvidenceCost": 200,
      "unassignedFunds": 0,
      "status": "Compliant"
    }
  }
}
```

### Non-Compliant Example (REJECTED):
```json
{
  "fundingRequestAmount": 200,
  "deliverables": [
    {
      "id": "FIELD-DELIVER-20260331-001",
      "name": "FOI Request Lodgement",
      "estimatedCost": 50
    }
  ],
  "budget": {
    "items": [
      {
        "description": "General research retainer",
        "amount": 200,
        "relatedDeliverable": "FIELD-DELIVER-20260331-001"  // But FOI only costs $50!
      }
    ],
    "total": 200,
    "conservationValidation": {
      "totalEvidenceCost": 50,
      "unassignedFunds": 150,  // VIOLATION
      "status": "Violation",
      "violations": [
        "Unassigned funds: $150 not mapped to deliverables",
        "Budget exceeds deliverable scope"
      ]
    }
  },
  "status": "Rejected"
  "reasonCode": "CONSERVATION_VIOLATION_UNASSIGNED_FUNDS"
}
```

---

## Symmetry Constraint: Matching Structure Format

**Rule:** Funder and applicant must use the same Recognition Header format for all communications.

### Applicant Submits:
```
Canonical Ref: FIELD-FUNDING-20260331-002
Applicant: Responsive Advantage
Status: Submitted
Budget: [as above]
```

### System Requires Funder Response In Same Format:
```
Canonical Ref: FIELD-FUNDING-20260331-002-RESPONSE
Supersedes: FIELD-FUNDING-20260331-002
Appro ver: [Funder ID]
Decision: Approved | Declined
Reason Code: [If declined: CONSERVATION_VIOLATION, BUDGET_EXCEEDED, SCOPE_UNCLEAR, etc.]
Next Steps: [Explicit instruction or funding approval]
Processing ID: [Assigned by system]
```

Both use same schema; both carry canonical Refs; no asymmetry.

---

## Resonance Constraint: Procedurally Timed Review

**Rule:** Funding decisions must occur within defined procedural windows.

### Statutory Timeline:
- **Day 0:** Packet submitted (becomes Submitted status)
- **Days 1-14:** Initial review period (Under Review status)
- **Day 14:** Decision deadline (Approved/Declined/Pending status assigned)
- **Day 30:** Appeal/revision deadline if Declined
- **Day 35:** Final decision locked (status becomes Final)

### Violation Detection:
If funder does not respond by Day 14, system automatically:
1. Sends reminder notification
2. Escalates to supervisor approval path
3. On Day 30, marks packet as "Deemed Approved" (applies if no explicit decline)

---

## Approval Workflow

### State Machine:
```
Draft
  ↓ [applicant submits]
Submitted
  ↓ [system validates Conservation]
  ├→ REJECTED (if Conservation violation) → reasonCode assigned
  └→ Under Review (passes Conservation)
       ↓ [funder reviews]
       ├→ Approved → Processing ID issued → funds allocated
       ├→ Declined → reasonCode required → revise path opens
       └→ RequestedRevision → specifics in comment field
            ↓ [applicant revises]
            Back to Submitted
```

### Required Reason Codes:
When Declining, funder MUST select from:
- `CONSERVATION_VIOLATION_UNASSIGNED_FUNDS`
- `CONSERVATION_VIOLATION_EVIDENCE_UNCLEAR`
- `SYMMETRY_VIOLATION_FORMAT_MISMATCH`
- `RESONANCE_VIOLATION_TIMING_INVALID`
- `SCOPE_EXCEEDS_AUTHORIZATION`
- `BUDGET_EXCEEDS_LIMITS`
- `EVIDENCE_THRESHOLD_TOO_HIGH`
- `OTHER_WITH_EXPLANATION`

---

## Processing After Approval

Upon `Approved` status:
1. **Processing ID** assigned: `PROC-{DATE}-{SEQ}`
2. **Layer A Update:** Approved funding packet created new Ref: `FIELD-FUNDING-20260331-002-APPROVED`
3. **Layer C Processing:** Deliverables routed to FIELD machinery for execution
4. **Layer D Output:** 
   - Applicant notified with approval + next steps
   - Funding amount held in escrow pending deliverable completion
   - Walkerville tranche notice published with expected delivery timeline

---

## Data Model: Interface with Responsive Advantage

### HTTP Endpoints:

```
POST   /api/funding-packets
       Submit new funding request
       Body: FundingPacket (status: Draft)
       Returns: { canonicalRef, processingId }

GET    /api/funding-packets/{canonicalRef}
       Retrieve packet by Canonical Ref
       Returns: Full FundingPacket object

PATCH  /api/funding-packets/{canonicalRef}
       Update packet (revisions, status changes)
       Body: Partial FundingPacket
       Returns: Updated FundingPacket

GET    /api/funding-packets?status=Under Review
       Query packets by status
       Returns: FundingPacket[]

POST   /api/funding-packets/{canonicalRef}/approve
       Funder approval action
       Body: { decision: "Approved", reasonCode?: string, nextSteps: string }
       Returns: { status: "Approved", processingId }

POST   /api/funding-packets/{canonicalRef}/decline
       Funder decline action
       Body: { reasonCode: string, comment: string }
       Returns: { status: "Declined", reasonCode }

GET    /api/conservation-validate
       Check Conservation compliance before submission
       Body: { deliverables, budget }
       Returns: { compliant: boolean, violations: string[] }
```

---

## Integration Points

1. **Layer A (Recognition):** Canonical Ref generation on packet creation
2. **Layer B (Constraints):** Conservation validator called on submission; Symmetry enforcer checks response format
3. **Layer C (FIELD):** Approved packets routed to processing pipeline; ProofStore gets funding metadata
4. **Layer D (Interfaces):** 
   - Walkerville publication system notified of approved funding
   - Regulatory filing system receives funding context if applicable

---

## Walkerville Publication (Layer D Output)

When a funding packet is Approved, Walkerville automatically publishes:

```markdown
# Funded Project: [Project Name]

**Canonical Ref:** FIELD-FUNDING-20260331-002  
**Status:** Approved  
**Funding Amount:** $200 AUD  
**Approved Date:** 2026-04-01  

## Deliverables

- [D1] FOI Request Lodgement ($50)
- [D2] Response Bundle Processing ($100)
- [D3] Publication Summary Page ($50)

## Timeline

Expected completion: 2026-04-30

## What This Funding Produces

All outputs from this funded project will be linked back to this Canonical Ref. See [Deliverable Status](link to status page).

---
```

---

## Compliance Checklist

Before approving any funding packet, verify:

- [ ] Canonical Ref format valid
- [ ] Conservation validation returns compliant=true
- [ ] All deliverables have estimated costs
- [ ] Budget items map 1:1 to deliverables
- [ ] Unassigned funds = 0
- [ ] Timeline is within Resonance window
- [ ] Applicant metadata complete
- [ ] Reason codes documented (if revision requested)
- [ ] Processing ID will be assigned upon approval

---

## Bridge: Inventory & Logistics Prospectus to Nexxus Infinity

Responsive Advantage can be presented to external funders as a standard "business model" + "operational infrastructure" narrative. The following mapping translates standard funding/prospectus language into Layer A/B/C/D terms:

| Prospectus Section | Nexxus Layer | What It Means |
|--------------------|--------------|--------------|
| Company Overview | Layer A (Recognition) | Identity, persistent Refs, lineage, versioning—who we are and what persists across time |
| Business Model | Layer B (Constraints) | Four Laws + Four Doctrines—how we ensure truth-production survives hostile environments |
| Financial Information | Layer B (Conservation ledger) | Every spend anchored to artifact; untraced money blocked; financials auditable |
| Market Analysis | Layer D (Interface map) | Who resists symmetry; which channels accept our structure; terrain mapping |
| Operational Infrastructure | Layer C (FIELD) | ProofStore, PULSE, Brick Registry—the processing machinery that converts reality to verifiable units |
| Risk Factors | Layer B/C (Failure modes) | Unresolved geometry, administrative churn, evidence suppression, procedural timing violations |
| Growth Strategy | Layer D (Tranche cadence) | How we scale via discrete, bounded deployments—each tranche a complete, verified unit |
| Corporate Governance | Layer B (Symmetric enforcement) | Reason codes, explicit status tracking, no asymmetric discretion—same rules for all parties |
| Legal/Regulatory Compliance | Layer B (Resonance) | Procedural timing, valid channels, correct format—we advance by alignment with legal structure, not against it |
| Use of Proceeds | Layer D (Interface outputs) | What each funding tranche produces—publication, filing, funding, evidence bundles—each trackable to this Ref |

**Key Point:** You don't need special language for external audiences. Responsive Advantage *is* a legitimate business model; Nexxus Infinity is the discipline that makes it work. The prospectus is the external skin; the architecture is the internal discipline.

