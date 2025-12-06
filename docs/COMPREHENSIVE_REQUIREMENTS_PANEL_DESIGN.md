# Comprehensive Requirements Panel Design

## Overview

This document outlines the design for a single, comprehensive Requirements Gathering panel (Step 0) that teaches candidates to gather **both** Functional Requirements (FRs) AND Scale/NFR information before designing anything.

## NFR Interview Discovery Order

The user specified the correct order for discovering NFRs in an interview:

| Order | NFR Category | What to Ask | Why It Matters |
|-------|-------------|-------------|----------------|
| 1 | **Throughput** | RPS, read/write ratio | How much traffic? What's the workload pattern? |
| 2 | **Payload** | Request/response size | Affects bandwidth, storage, network design |
| 3 | **Traffic Bursts** | Peak-to-average, spikes | Do we need auto-scaling? Capacity planning |
| 4a | **Request Latency** | Response time SLA | p50, p99 for user-facing requests |
| 4b | **Processing Latency** | Async processing time | Background jobs, data pipelines |

This order makes sense because:
- **Throughput first**: Can't design for latency without knowing load
- **Payload second**: Size affects throughput calculations (bandwidth = RPS × payload)
- **Bursts third**: Capacity planning depends on peak, not average
- **Latency last**: Optimize after understanding the above constraints

## User's Concern

> "The first lesson is building the foundations adding the app server. But that is not how interviews start with. User needs to get some facts from the interviewer first."

**Current Problem:**
- Step 0 only covers FR questions
- Step 1 jumps straight to "Building the Foundation: App Servers"
- Missing: Scale/throughput questions that drive architectural decisions

**Solution:**
- Single comprehensive Requirements panel with 3 sections:
  1. **Functional Requirements** - What does the system do?
  2. **Scale & Throughput** - How much traffic? What's the read:write ratio?
  3. **Summary** - Confirmed requirements + architectural implications

---

## Panel Structure

### Section 1: Why Requirements Gathering Matters
Brief intro explaining:
- Never jump straight to design in interviews
- Good questions show structured thinking
- Scale information drives ALL architectural decisions

### Section 2: Functional Requirements (Current Content)

**Critical Questions:**
| Question | Answer | Why It Matters |
|----------|--------|----------------|
| "What are the core operations?" | Shorten URLs + Redirect | Defines the API endpoints |
| "Do short codes need to be unique?" | Yes, absolutely | Uniqueness constraint is core |

**Clarifying Questions:**
| Question | Answer | Insight |
|----------|--------|---------|
| "Do URLs expire?" | No, permanent | No TTL complexity needed |
| "Custom short codes?" | Not for MVP | Avoids collision complexity |
| "Analytics needed?" | Out of scope | Focus on core functionality |

**Confirmed FRs:**
- ✂️ FR-1: Shorten URLs
- ↪️ FR-2: Redirect URLs  
- 🔑 FR-3: Unique Codes

### Section 3: Scale & NFRs (NEW - Interview Discovery Order)

**Why Ask About Scale?**
> "You can't design for 100 RPS the same way you design for 100,000 RPS. Scale drives EVERYTHING."

Following the interview discovery order: **Throughput → Payload → Bursts → Latency**

#### 3.1 Throughput Questions
| Question | Answer | The Math |
|----------|--------|----------|
| "How many DAU?" | 100 million | Gives us scale context |
| "How many URL shortens/day?" | 10 million | → 115 writes/sec avg |
| "How many redirects/day?" | 1 billion | → 11,500 reads/sec avg |

**Read:Write Ratio Calculation:**
```
WRITES: 10M URLs/day ÷ 86,400 sec/day = 115 writes/sec average
READS:  1B redirects/day ÷ 86,400 sec/day = 11,574 reads/sec average

READ:WRITE RATIO = 100:1 (extremely read-heavy!)
```

#### 3.2 Payload Questions
| Question | Answer | Implication |
|----------|--------|-------------|
| "What's the max URL length?" | 2000 characters | ~2KB per request |
| "What metadata do we store?" | Just URL + short code | ~500 bytes per record |

**Storage Calculation:**
```
10M URLs/day × 500 bytes = 5GB/day = 1.8TB/year
```

#### 3.3 Traffic Burst Questions
| Question | Answer | Implication |
|----------|--------|-------------|
| "Peak-to-average ratio?" | 3x | Must handle 35K reads/sec |
| "Any predictable spikes?" | Marketing campaigns | Pre-scale for events |
| "Sudden viral content?" | Yes, tweets go viral | Need auto-scaling |

**Peak Traffic Calculation:**
```
Average: 11,574 reads/sec
Peak (3x): 34,722 reads/sec → Round up to 35K RPS
```

#### 3.4 Latency Questions
| Question | Answer | Type |
|----------|--------|------|
| "What's the redirect latency SLA?" | p99 < 100ms | Request/Response |
| "Create URL latency?" | p99 < 500ms acceptable | Request/Response |
| "Any async processing?" | No (real-time only) | Data Processing |

**Key Insight Box:**
> 🎯 **This is a READ-HEAVY system!** 100 reads for every 1 write.
>
> **What this tells us:**
> - Caching will be critical (most requests can hit cache)
> - Read replicas are more valuable than write scaling
> - Database writes are manageable on a single primary
> - p99 < 100ms requires cache (DB would be too slow)

### Section 4: Summary & What's Next

**Confirmed Requirements:**
| Category | Requirement |
|----------|-------------|
| FR-1 | Shorten URLs |
| FR-2 | Redirect URLs |
| FR-3 | Unique codes |
| Scale | 100M DAU, 10M writes/day, 1B reads/day |
| Ratio | 100:1 read-to-write |
| Peak | ~35K reads/sec |

**Architectural Implications:**
- ✅ Read-heavy → Cache is critical
- ✅ Moderate write load → Single DB primary might work
- ✅ Peak 35K RPS → Need multiple app servers
- ✅ 100:1 ratio → Read replicas will help

**Out of Scope:**
- Custom short codes (v2)
- Click analytics
- URL expiration
- Multi-region deployment

**CTA Button:** "Got it! Let's Start Building →"

---

## Type Changes Required

### Update `InterviewQuestion.category`

```typescript
export interface InterviewQuestion {
  id: string;
  // Extended categories for comprehensive requirements gathering
  category:
    | 'functional'      // Core functionality questions
    | 'clarification'   // Scope clarifications
    | 'scope'           // What's in/out of scope
    | 'throughput'      // RPS, read/write ratio
    | 'payload'         // Request/response size, storage
    | 'burst'           // Peak traffic, spikes
    | 'latency';        // Response time SLAs
  question: string;
  answer: string;
  importance: 'critical' | 'important' | 'nice-to-have';
  revealsRequirement?: string;
  learningPoint?: string;
  insight?: string;
  // NEW: For scale questions, include the math
  calculation?: {
    formula: string;
    result: string;
  };
}
```

### Update `RequirementsGatheringContent`

```typescript
export interface RequirementsGatheringContent {
  problemStatement: string;
  interviewer: { name: string; role: string; avatar: string; };
  
  // Group questions by section
  questions: InterviewQuestion[];  // All questions (FR + Scale)
  
  // NEW: Separate critical IDs by category
  criticalFRQuestionIds: string[];
  criticalScaleQuestionIds: string[];
  
  minimumQuestionsRequired: number;
  criticalQuestionIds: string[];  // Combined for backward compat
  
  confirmedFRs: ConfirmedFR[];
  
  // NEW: Scale summary
  scaleMetrics: {
    dailyActiveUsers: string;
    writesPerDay: string;
    readsPerDay: string;
    peakMultiplier: number;
    readWriteRatio: string;
    calculatedWriteRPS: { average: number; peak: number; };
    calculatedReadRPS: { average: number; peak: number; };
  };
  
  // NEW: Architectural implications from scale
  architecturalImplications: string[];
  
  outOfScope: string[];
  keyInsight: string;
}
```

---

## Component Changes Required

### Update `RequirementsGatheringPanel.tsx`

The panel should show 3 distinct sections:

```tsx
<RequirementsGatheringPanel>
  {/* Header */}
  <Header>Step 0: Requirements Gathering</Header>
  
  {/* Section 1: Why This Matters */}
  <WhySection>
    <p>In interviews, NEVER jump straight to design...</p>
  </WhySection>
  
  {/* Section 2: Functional Requirements */}
  <Section title="🎯 Part 1: Functional Requirements">
    <p>First, understand WHAT the system does...</p>
    <CriticalQuestions questions={frQuestions.filter(critical)} />
    <OtherQuestions questions={frQuestions.filter(notCritical)} />
    <ConfirmedFRs frs={confirmedFRs} />
  </Section>
  
  {/* Section 3: Scale & Throughput (NEW) */}
  <Section title="📊 Part 2: Scale & Throughput">
    <p>Next, understand HOW MUCH traffic...</p>
    <ScaleQuestions questions={scaleQuestions} />
    <CalculationsBox calculations={...} />
    <KeyInsight>100:1 read-to-write ratio!</KeyInsight>
    <ArchitecturalImplications items={implications} />
  </Section>
  
  {/* Section 4: Summary */}
  <Section title="📋 Summary: What We Learned">
    <AllConfirmedRequirements />
    <OutOfScope items={outOfScope} />
  </Section>
  
  {/* CTA */}
  <Button onClick={onComplete}>Got it! Let's Start Building →</Button>
</RequirementsGatheringPanel>
```

---

## Data Changes for TinyURL

### Updated `tinyUrlRequirementsPhase`

```typescript
const tinyUrlRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a URL shortener like bit.ly or TinyURL",
  
  interviewer: {
    name: 'Sarah Chen',
    role: 'Engineering Manager',
    avatar: '👩‍💼',
  },
  
  questions: [
    // ===== FUNCTIONAL REQUIREMENTS =====
    {
      id: 'core-operations',
      category: 'functional',
      question: "What are the core operations this system needs to support?",
      answer: "Two main operations:\n1. Shorten: Given a long URL, create and return a short URL\n2. Redirect: Given a short URL, redirect the user to the original long URL",
      importance: 'critical',
      revealsRequirement: 'FR-1 and FR-2',
      learningPoint: "Always start by identifying the core use cases",
    },
    {
      id: 'uniqueness',
      category: 'functional',
      question: "Do short codes need to be unique?",
      answer: "Yes, absolutely. Each short code must map to exactly one URL.",
      importance: 'critical',
      revealsRequirement: 'FR-3',
    },
    {
      id: 'url-lifecycle',
      category: 'clarification',
      question: "Do URLs ever expire or get deleted?",
      answer: "No, once created, URLs should work forever.",
      importance: 'important',
      insight: "This simplifies our design - no TTL or cleanup needed initially",
    },
    {
      id: 'custom-codes',
      category: 'clarification',
      question: "Can users specify their own custom short codes?",
      answer: "Not for the MVP. We'll auto-generate unique codes.",
      importance: 'nice-to-have',
      insight: "Custom codes add collision handling complexity - good to defer",
    },
    
    // ===== 1. THROUGHPUT (First in interview order) =====
    {
      id: 'throughput-dau',
      category: 'throughput',
      question: "How many daily active users (DAU) should we design for?",
      answer: "100 million DAU",
      importance: 'critical',
      learningPoint: "DAU gives you the scale context for all calculations",
    },
    {
      id: 'throughput-writes',
      category: 'throughput',
      question: "How many URLs are shortened per day?",
      answer: "About 10 million new URLs per day",
      importance: 'critical',
      calculation: {
        formula: "10M ÷ 86,400 sec = 115 writes/sec average",
        result: "~115 writes/sec (345 at peak)",
      },
      learningPoint: "This tells you write load on the database",
    },
    {
      id: 'throughput-reads',
      category: 'throughput',
      question: "How many redirects (reads) per day?",
      answer: "About 1 billion redirects per day",
      importance: 'critical',
      calculation: {
        formula: "1B ÷ 86,400 sec = 11,574 reads/sec average",
        result: "~11,500 reads/sec (35K at peak)",
      },
      learningPoint: "This tells you read load - and it's MUCH higher than writes!",
    },
    
    // ===== 2. PAYLOAD (Second in interview order) =====
    {
      id: 'payload-url-size',
      category: 'payload',
      question: "What's the maximum URL length we need to support?",
      answer: "Standard URLs up to 2000 characters",
      importance: 'important',
      calculation: {
        formula: "2000 chars × 1 byte = ~2KB max per URL",
        result: "~2KB max request size",
      },
      learningPoint: "Affects bandwidth calculations and storage planning",
    },
    {
      id: 'payload-storage',
      category: 'payload',
      question: "What metadata do we store with each URL?",
      answer: "Just the URL, short code, and creation timestamp. About 500 bytes per record.",
      importance: 'important',
      calculation: {
        formula: "10M URLs/day × 500 bytes = 5GB/day",
        result: "~1.8TB/year of storage growth",
      },
      learningPoint: "Storage grows linearly with URL creation rate",
    },
    
    // ===== 3. BURSTS (Third in interview order) =====
    {
      id: 'burst-peak',
      category: 'burst',
      question: "What's the peak-to-average traffic ratio?",
      answer: "Peak traffic is about 3x the average",
      importance: 'critical',
      calculation: {
        formula: "11,574 avg × 3 = 34,722 peak",
        result: "~35K reads/sec at peak",
      },
      insight: "You MUST design for peak, not average. 3x is typical for consumer apps.",
    },
    {
      id: 'burst-viral',
      category: 'burst',
      question: "Are there sudden traffic spikes we should handle?",
      answer: "Yes, when a shortened URL goes viral on social media, it can get millions of clicks in minutes.",
      importance: 'important',
      insight: "Need auto-scaling and rate limiting for protection",
    },
    
    // ===== 4. LATENCY (Fourth in interview order) =====
    {
      id: 'latency-redirect',
      category: 'latency',
      question: "What's the acceptable latency for redirects?",
      answer: "p99 should be under 100ms - users expect instant redirects",
      importance: 'critical',
      learningPoint: "This is Request/Response latency - the user is waiting",
    },
    {
      id: 'latency-create',
      category: 'latency',
      question: "What about latency for creating short URLs?",
      answer: "p99 under 500ms is acceptable - users can wait a moment for URL creation",
      importance: 'important',
      learningPoint: "Create is less latency-sensitive than redirect",
    },
    {
      id: 'latency-async',
      category: 'latency',
      question: "Is there any async processing or background jobs?",
      answer: "Not for the core flow. Everything is synchronous request/response.",
      importance: 'nice-to-have',
      insight: "No data processing latency concerns for TinyURL",
    },
  ],
  
  criticalFRQuestionIds: ['core-operations', 'uniqueness'],
  criticalScaleQuestionIds: ['scale-writes', 'scale-reads', 'scale-peak'],
  minimumQuestionsRequired: 4,
  criticalQuestionIds: ['core-operations', 'uniqueness', 'scale-writes', 'scale-reads'],
  
  confirmedFRs: [
    { id: 'fr-1', text: 'FR-1: Shorten URLs', description: 'Generate unique short URL from long URL', emoji: '✂️' },
    { id: 'fr-2', text: 'FR-2: Redirect URLs', description: 'Redirect short URL to original long URL', emoji: '↪️' },
    { id: 'fr-3', text: 'FR-3: Unique Codes', description: 'Each short code maps to exactly one URL', emoji: '🔑' },
  ],
  
  scaleMetrics: {
    dailyActiveUsers: '100 million',
    writesPerDay: '10 million',
    readsPerDay: '1 billion',
    peakMultiplier: 3,
    readWriteRatio: '100:1',
    calculatedWriteRPS: { average: 115, peak: 345 },
    calculatedReadRPS: { average: 11574, peak: 34722 },
  },
  
  architecturalImplications: [
    '✅ Read-heavy (100:1) → Caching is CRITICAL',
    '✅ 35K reads/sec peak → Need multiple app servers',
    '✅ Only 345 writes/sec peak → Single DB primary might work',
    '✅ Read replicas will help scale reads',
  ],
  
  outOfScope: [
    'Custom short codes (v2)',
    'Click analytics',
    'URL expiration',
    'Multi-region deployment',
  ],
  
  keyInsight: "This is a READ-HEAVY system! For every URL created, it gets clicked 100 times. This 100:1 ratio means: OPTIMIZE FOR READS with caching and read replicas.",
};
```

---

## Implementation Steps

1. **Update Types** (`guidedTutorial.ts`)
   - Add `'scale' | 'throughput'` to `InterviewQuestion.category`
   - Add `calculation` field to `InterviewQuestion`
   - Add `scaleMetrics` and `architecturalImplications` to `RequirementsGatheringContent`

2. **Update Component** (`RequirementsGatheringPanel.tsx`)
   - Reorganize into 3 sections (Why, FRs, Scale)
   - Add new UI for scale calculations
   - Add architectural implications section

3. **Update Data** (`tinyUrlGuided.ts`)
   - Add scale/throughput questions
   - Add scale metrics
   - Add architectural implications

4. **Test Flow**
   - Navigate to `/system-design/tiny-url/guided`
   - Verify Step 0 shows all sections
   - Verify clicking "Let's Start Building" advances to Step 1

---

## Visual Mockup

```
┌──────────────────────────────────────────────────────────────────┐
│  Step 0 of 10 • Requirements Gathering                          │
│                                                                  │
│  🎤 First: Gather Requirements                                  │
│  In a real interview, ALWAYS start by asking questions.         │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────────┐    │
│  │ 👩‍💼 Sarah Chen • Engineering Manager                      │    │
│  │ "Design a URL shortener like bit.ly or TinyURL"          │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ═══════════════════════════════════════════════════════════    │
│  🎯 PART 1: FUNCTIONAL REQUIREMENTS                             │
│  ═══════════════════════════════════════════════════════════    │
│                                                                  │
│  First, understand WHAT the system does...                      │
│                                                                  │
│  ┌─ Critical Questions ──────────────────────────────────────┐   │
│  │ Q: "What are the core operations?"                        │   │
│  │ A: "Two main operations: Shorten and Redirect..."         │   │
│  │ 💡 Always start by identifying core use cases             │   │
│  └───────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─ Confirmed FRs ───────────────────────────────────────────┐   │
│  │ ✅ ✂️ FR-1: Shorten URLs                                   │   │
│  │ ✅ ↪️ FR-2: Redirect URLs                                  │   │
│  │ ✅ 🔑 FR-3: Unique Codes                                   │   │
│  └───────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ═══════════════════════════════════════════════════════════    │
│  📊 PART 2: SCALE & THROUGHPUT                                  │
│  ═══════════════════════════════════════════════════════════    │
│                                                                  │
│  Next, understand HOW MUCH traffic the system will handle...    │
│                                                                  │
│  ┌─ Scale Questions ─────────────────────────────────────────┐   │
│  │ Q: "How many URLs are shortened per day?"                 │   │
│  │ A: "About 10 million new URLs per day"                    │   │
│  │ 📊 10M ÷ 86,400 = 115 writes/sec (345 at peak)           │   │
│  └───────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─ The Math ────────────────────────────────────────────────┐   │
│  │ WRITES: 10M/day → 115/sec avg → 345/sec peak              │   │
│  │ READS:  1B/day  → 11,500/sec avg → 35K/sec peak           │   │
│  │                                                           │   │
│  │ 🎯 READ:WRITE RATIO = 100:1 (extremely read-heavy!)       │   │
│  └───────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─ What This Tells Us ──────────────────────────────────────┐   │
│  │ ✅ Read-heavy → Caching is CRITICAL                       │   │
│  │ ✅ 35K RPS peak → Need multiple app servers               │   │
│  │ ✅ Only 345 writes/sec → Single DB primary might work     │   │
│  └───────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ═══════════════════════════════════════════════════════════    │
│  📋 SUMMARY                                                     │
│  ═══════════════════════════════════════════════════════════    │
│                                                                  │
│  ┌─ Out of Scope ────────────────────────────────────────────┐   │
│  │ 🚫 Custom short codes (v2)                                │   │
│  │ 🚫 Click analytics                                        │   │
│  │ 🚫 URL expiration                                         │   │
│  └───────────────────────────────────────────────────────────┘   │
│                                                                  │
│                    ┌─────────────────────────────────┐           │
│                    │   Got it! Let's Start Building →│           │
│                    └─────────────────────────────────┘           │
└──────────────────────────────────────────────────────────────────┘
```

---

## Success Criteria

After implementation:
1. ✅ User sees comprehensive requirements panel at Step 0
2. ✅ Panel shows both FR questions AND scale questions
3. ✅ Panel shows the RPS calculations with the math
4. ✅ Panel shows architectural implications (read-heavy → cache)
5. ✅ Only after completing Step 0 does building (Step 1) start
6. ✅ Step 1 can now reference the scale info learned in Step 0