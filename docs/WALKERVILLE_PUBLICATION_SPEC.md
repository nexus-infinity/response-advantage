# Walkerville: Publication Interface Specification

**Version:** 1.0  
**Date:** 2026-03-31  
**Status:** Operational

---

## Purpose

Walkerville is the **public-facing publication layer** that releases Nexxus Infinity outputs to the world. It maintains editorial distinction between Observed Facts (evidence-anchored), Interpretations (labeled), and Unresolved Geometry (explicitly excluded).

---

## Core Principles

### 1. Canonical Ref as Persistent Link
Every published page carries a canonical reference that persists across time:
- Allows readers to verify lineage
- Enables fact-checking and source tracing
- Prevents administrative erasure ("What I claimed in 2026 still matches this evidence")

### 2. Tranche-Based Publication
Content released in discrete, bounded tranches:
- Each tranche has a date, scope, and explicit completion status
- Allows incremental evidence release without "final version" pressure
- "What changed" deltas show progression

### 3. Three-Tier Evidence Classification
- **Observed Facts** — Directly anchored to evidence (tagged with source)
- **Interpretations** — Analysis or conclusion (explicitly labeled "We interpret this as...")
- **Unresolved Geometry** — Claims not yet verified (explicitly excluded or marked "Status: Unresolved")

### 4. Sensitive Information Redaction
- Evidence bundle stored securely in ProofStore
- Public summaries published without breaking privacy/privilege
- Hash links allow readers to verify "I saw the actual document; here's the hash"

---

## Walkerville Page Structure

### **Root Pages (Static)**

#### Home / About
```
# About Walkerville

Walkerville is the public index for Nexxus Infinity projects. 
Every page you see here is linked to verified evidence and procedural filings.

## What We Publish

- **Observed Facts:** Claims directly supported by documents or evidence
- **Interpretations:** Our analysis of what evidence means (clearly labeled)
- **Unresolved:** Open questions we're actively investigating

## Verification

Each page carries a canonical reference (e.g., FIELD-TIMELINE-20260318-003).
You can trace back to the original evidence through our Evidence Index.

[Link to Evidence Index]

---
```

#### Evidence Index
```
# Evidence Index

This page lists all ProofStore bundles available for public or restricted access.

| Canonical Ref | Matter Type | Date | Access Level | Hash | Link |
|---|---|---|---|---|---|
| FIELD-FOI-20260331-042 | FOI Response Bundle | 2026-03-31 | Restricted | sha256:abc... | [view] |
| FIELD-TIMELINE-20260318-003 | Timeline Events | 2026-03-18 | Public | sha256:def... | [view] |
| FIELD-CASE-20260301-001 | Regulatory Filing | 2026-03-01 | Public | sha256:ghi... | [view] |

---
```

#### Funding Tracker
```
# Funded Projects

This page shows all active and completed funding requests flowing through Responsive Advantage.

| Canonical Ref | Project | Amount | Status | Funded | Expected | Related Outputs |
|---|---|---|---|---|---|---|
| FIELD-FUNDING-20260331-002 | NAB FOI Request | $200 | Approved | 2026-04-01 | 2026-04-30 | [FIELD-FOI-20260331-042] |

---
```

---

### **Project Pages (Dynamic, Tranche-Based)**

#### Example: NAB 2019-2023 Banking Timeline

**Page Structure:**
```markdown
# NAB Correspondence & Breach Timeline: 2019-2023

**Canonical Ref:** FIELD-TIMELINE-20260318-003  
**Matter Type:** Timeline + Evidence Bundle  
**Status:** Active (Updated Q2 2026 quarterly)  
**Created:** 2026-03-18  
**Last Updated:** 2026-03-31  

## Overview

This page documents National Australia Bank's conduct and regulatory breaches during 
the 2019-2023 period, with particular focus on correspondence, account management, 
and systemic issues identified through [Regulatory Filing X].

**Publication Status:**
- Tranche 1 (Q2 2026): Foundational timeline + regulatory context
- Tranche 2 (Q3 2026): FOI correspondence release (pending NAB response)
- Tranche 3 (Q4 2026): Expert analysis + impact assessment

---

## Observed Facts (Evidence-Anchored)

### 2019

#### March 15, 2019 — Duty Notice Issued
**Observed Fact:**  
NAB received formal regulatory inquiry regarding account management practices.

**Evidence:**  
Source Document: [FIELD-DOC-20190315-001] — Regulatory letter  
Hash: sha256:abc123  
Classification: Public

**Interpretation:** [Clearly labeled]  
This notice initiated NAB's statutory 30-day response obligation.

#### April 14, 2019 — Response Deadline Passed
**Observed Fact:**  
No response to regulatory inquiry by statutory deadline.

**Evidence:**  
Source: [FIELD-DOC-20190414-001] — Escalation notice from regulator  
Hash: sha256:def456  
Classification: Public  

**Unresolved:**  
Whether NAB claimed administrative delay or failed to respond intentionally. 
(This will be clarified in Tranche 2 when FOI correspondence is released.)

---

### 2020

#### January 8, 2020 — Follow-Up Correspondence
**Observed Fact:**  
Regulator sent follow-up letter re: outstanding response.

**Evidence:**  
[FIELD-DOC-20200108-001]  
Hash: sha256:ghi789  
Classification: Public

---

## Interpretations (Explicitly Labeled)

### Pattern: Systemic Non-Response

**Our Interpretation:**  
The 2019-2023 period shows a recurring pattern of regulatory letters going unanswered 
or answered months late. This is consistent with testimony from [Expert Report X, p. 12].

**Caveat:** This interpretation is subject to revision once FOI documents in Tranche 2 
are released. NAB may provide explanations for delays.

---

## Unresolved Geometry (Explicitly Excluded)

We are **NOT** claiming:
- Deliberate wrongdoing (Resonance violation: procedure not complete)
- Culpability of specific NAB executives (Symmetry violation: no response provided)
- Total financial impact (Evidence threshold not met)

These will be addressed in subsequent tranches.

---

## Lineage & Related Refs

**Related Funding:**  
[FIELD-FUNDING-20260331-002] — FOI Request funding  
[FIELD-FUNDING-20260401-003] — Expert analysis funding (planned Q2 2026)

**Related Filings:**  
[FIELD-REGULATORY-20260315-001] — Formal complaint to ASIC  
[FIELD-COURT-20260320-001] — Discovery request in [Case Name]

**Prior Versions:**  
This timeline will be updated as new evidence is released.  
See [Version History](#version-history)

---

## How to Read This Page

1. **Observed Facts** sections have blue backgrounds. Each claim links to evidence.
2. **Interpretations** sections have yellow backgrounds. "We interpret..." language signals analysis.
3. **Unresolved** sections have gray backgrounds. They mark open questions.
4. Every hash can be verified against ProofStore. Request access via [Verification Portal].

---

## Download Evidence Bundle

**Full Bundle:** [Download ZIP]  
- Includes all linked documents (PDFs, emails, regulatory letters)
- Hash verification file included
- Access restricted; requires institutional login

**Public Summary:** [Download PDF]  
- Redacted version with sensitive info removed
- Same canonical structure
- Publicly available

---

## Timeline: What's Next

- **2026-04-30:** FOI response expected from NAB
- **2026-05-15:** Tranche 2 (FOI correspondence) published
- **2026-07-31:** Expert analysis report complete
- **2026-08-15:** Tranche 3 (interpretation + impact) published

---

## Version History

| Version | Date | Changes |
|---|---|---|
| v1.0 | 2026-03-31 | Initial timeline + foundational facts published |
| v1.1 | [TBD] | FOI documents added; Tranche 2 |

---

## Questions?

All claims on this page are linked to canonical references. To verify or request additional 
documentation, contact [Contact Portal] with the Canonical Ref number.

---
```

---

## Publication Workflow (Layer D Output Gate)

### Step 1: Tranche Proposal
```
Author creates tranche with:
- Canonical Ref
- Matter type
- Scope (what will be published)
- Evidence artifacts (which ProofStore bundles)
- Fact/Interpretation/Unresolved categorization
```

### Step 2: Constraint Validation
```
System checks:
✓ Conservation: Every fact has evidence cost (time spent verifying)
✓ Symmetry: Both Walkerville and source (e.g., NAB) use same structural format
✓ Resonance: Publication timed to procedural moment (e.g., after FOI response, not during 30-day response window)
✓ Recognition: All Canonical Refs valid and traceable
```

### Step 3: Redaction & Privacy Review
```
Sensitive data removed:
- Personal information (home addresses, phone numbers)
- Trade secrets (business processes, pricing)
- Privilege (attorney-client, advice privilege)
- Confidentiality agreements

Audit trail: What was redacted + why + date
```

### Step 4: Publication
```
Tranche published to Walkerville with:
- Canonical Ref displayed
- Last Updated timestamp
- Related References links
- Version history
- Verification hash
```

### Step 5: Index Update
```
Walkerville Home page updated:
- New project appears in index
- Funding connection shown
- Tranche release schedule published
```

---

## Canonical Page Components

### Fact Box (Always includes Evidence Link)
```markdown
**Observed Fact:**  
NAB failed to respond to regulatory inquiry within 30 days.

**Evidence:**  
Source: [FIELD-DOC-20190414-001] — Regulatory escalation notice  
Hash: sha256:abc123def456...  
Access: [Public] [Restricted] [Privileged]  
Modified: 2026-03-31

---
```

### Interpretation Box (Always labeled)
```markdown
**Interpretation** ⚠  
We interpret this pattern as systemic non-compliance.

**Caveat:** This analysis is subject to revision pending FOI release in Q3 2026.

**Sources:** [Expert Report X], [Prior Timeline Y]

---
```

### Unresolved Box (Explicitly excludes claims)
```markdown
**Unresolved Geometry**  
We are **not** claiming intentional wrongdoing by any NAB executive.

**Why:** Procedure not complete (FOI response pending). Cannot reach conclusions 
without full evidence.

**Status:** Expected resolution Q3 2026.

---
```

---

## Data Model: Walkerville CMS

```typescript
interface WalkervillePage {
  canonicalRef: string;              // FIELD-PROJECT-{DATE}-{SEQ}
  title: string;
  matterType: "Timeline" | "Analysis" | "Funding" | "Index" | "Evidence";
  status: "Draft" | "Scheduled" | "Published" | "Archived";
  createdDate: ISO8601;
  lastUpdated: ISO8601;
  
  tranches: Tranche[];
  sections: Section[];
  
  relatedRefs: {
    funding: string[];               // FIELD-FUNDING-* refs
    evidence: string[];              // FIELD-DOC-* refs
    filings: string[];               // FIELD-REGULATORY-* refs
  };
  
  redactionLog: RedactionRecord[];
  verificationHash: string;
  accessLevel: "Public" | "Restricted" | "ConfidentialPrivilege";
}

interface Section {
  type: "ObservedFact" | "Interpretation" | "UnresolvedGeometry" | "Narrative";
  title: string;
  content: string;                   // Markdown
  
  if (type === "ObservedFact") {
    evidenceLinks: {
      sourceRef: string;             // FIELD-DOC-*
      hash: string;
      classification: "Public" | "Restricted" | "ConfidentialPrivilege";
    }[];
  }
  
  if (type === "Interpretation") {
    caveat: string;                  // "Subject to revision pending..."
    sources: string[];               // Citation refs
  }
  
  if (type === "UnresolvedGeometry") {
    excludedClaims: string[];        // What we're NOT claiming
    reasonForExclusion: string;      // Why (procedure incomplete, etc.)
    expectedResolution: ISO8601;     // When will this be resolved?
  }
}

interface Tranche {
  tranch eId: string;                // FIELD-TRANCHE-{DATE}-{SEQ}
  releasedDate: ISO8601;
  scope: string;                     // Bounded description of what's in this tranche
  status: "Planned" | "Released" | "Superseded";
  relatedRefs: string[];
  supersedes?: string;               // Prior Tranche Ref if revising
}

interface RedactionRecord {
  sectionId: string;
  reason: "Privacy" | "TradeSecret" | "Privilege" | "Confidentiality" | "Other";
  redactedContent: string;           // Hash of what was removed
  redactionDate: ISO8601;
  justification: string;
}
```

---

## Integration Points

1. **Layer A (Recognition):** Canonical Ref on every page; version history tracked
2. **Layer B (Constraints):** Constraint validation before publication
3. **Layer C (FIELD):** Evidence bundles retrieved from ProofStore for verification
4. **Layer D (Interfaces):** 
   - Publication is Layer D output
   - Links back to Responsive Advantage funding
   - Regulatory filing layer references Walkerville summaries

---

## Example: From Approval to Publication

### Day 1 (Funder approves)
```
FIELD-FUNDING-20260331-002 → Status: Approved
Processing ID: PROC-20260331-001
```

### Day 2-14 (FIELD processing)
```
FIELD-FOI-20260331-042 submitted to NAB
ProofStore bundle created: /evidence/FIELD-FOI-20260331-042/
```

### Day 30 (NAB response received)
```
FIELD-FOI-20260331-042-RESPONSE created
New bundle: /evidence/FIELD-FOI-20260331-042-RESPONSE/
Documents indexed, hashed, classified
```

### Day 35 (Publication tranche prepared)
```
Tranche 1 created:
- Canonical Ref: FIELD-WALKERVILLE-20260404-001
- Type: "FOI Response Publication"
- Linked to FIELD-FOI-20260331-042-RESPONSE
- Redaction completed (sensitive info removed)
```

### Day 36 (Published)
```
Walkerville page LIVE:
https://walkerville.example/projects/nab-timeline-2019-2023
- Shows Tranche 1 with FOI response summary
- Links to funding Ref: FIELD-FUNDING-20260331-002
- Verification hashes displayed
- Next tranche (expert analysis) scheduled for Q3 2026
```

---

## Compliance Checklist

Before publishing any tranche, verify:

- [ ] Canonical Ref assigned and valid
- [ ] Every Observed Fact has linked evidence
- [ ] Every Interpretation labeled with caveat
- [ ] Unresolved Geometry explicitly excludes claims
- [ ] Redaction complete (privacy, privilege, trade secret reviewed)
- [ ] Related Refs (funding, filings) documented
- [ ] Version history updated
- [ ] Hash verification file generated
- [ ] Access level set correctly
- [ ] Timeline/status page updated

