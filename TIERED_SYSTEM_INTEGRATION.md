# Tiered System Integration - Complete Guide

## Overview

The **3-Tier Challenge System** has been successfully integrated into the system design platform. This system addresses the critique's concern about scalability to 400+ problems by providing three different levels of complexity.

---

## Three Tiers Explained

### Tier 1: Simple - Write Python Code 🐍
**Student Task:** Implement algorithms from scratch

**Example:** TinyURL
- Write `shorten(url)` function
- Write `expand(code)` function
- Learn about hash functions, collisions, auto-increment IDs

**UI Components:**
- Python code editor (Monaco)
- Test runner with input/output validation
- Performance benchmarking
- Real-time feedback

**What Students Learn:**
- Algorithm implementation
- Data structure design
- Performance optimization
- Code efficiency

---

### Tier 2: Moderate - Configure Algorithms ⚙️
**Student Task:** Choose and configure pre-built algorithms

**Example:** Twitter Feed Ranking
- Select ranking algorithm: Chronological / Engagement-based / ML Personalized / Hybrid
- Configure parameters: cache size, update frequency, personalization level
- See performance implications of each choice

**UI Components:**
- Algorithm selection modal
- Configuration sliders/dropdowns
- Performance comparison charts
- Real-time cost/latency impact

**What Students Learn:**
- Algorithm tradeoffs
- Performance vs complexity
- System configuration
- Engineering decisions

---

### Tier 3: Advanced - Design Architecture 🏗️
**Student Task:** Focus purely on system architecture

**Example:** Uber Driver-Rider Matching
- No code writing required
- Behaviors are fully pre-built (geospatial matching, surge pricing, route calculation)
- Student designs: component layout, data flow, scaling strategy

**UI Components:**
- Component palette
- Visual canvas
- Pre-built behavior documentation
- Architecture validation

**What Students Learn:**
- System design patterns
- Scalability principles
- Component interactions
- Infrastructure decisions

---

## Integration Points

### 1. Routing (`SystemDesignApp.tsx`)

**New Routes Added:**

```typescript
// Tiered challenge selector (landing page)
<Route path="/tiered" element={<TieredSystemDesignBuilder challenges={tieredChallenges} />} />

// Individual tiered challenges
<Route path="/tiered/:challengeId" element={<TieredChallengeRoute />} />
```

**Access URLs:**
- Landing page with selector: `http://localhost:5002/system-design/tiered`
- Specific challenge: `http://localhost:5002/system-design/tiered/tinyurl`
- Specific challenge: `http://localhost:5002/system-design/tiered/twitter-feed`
- Specific challenge: `http://localhost:5002/system-design/tiered/uber-matching`

---

### 2. Challenge Registry (`tieredChallenges.ts`)

**Centralized Export:**

```typescript
export const tieredChallenges: TieredChallenge[] = [
  tinyUrlTieredChallenge,      // Tier 1
  twitterFeedTieredChallenge,  // Tier 2
  uberMatchingTieredChallenge, // Tier 3
];

// Helper functions
getTieredChallenge(id: string)
getChallengesByTier(tier: 'simple' | 'moderate' | 'advanced')
```

---

### 3. Component Updates

#### `TieredSystemDesignBuilder.tsx`

**Props Interface:**
```typescript
interface TieredSystemDesignBuilderProps {
  challengeId?: string;        // Load specific challenge
  challenges?: TieredChallenge[]; // Available challenges
}
```

**Features:**
- ✅ Accepts challengeId from URL
- ✅ Accepts challenges list as prop
- ✅ Auto-loads challenge when challengeId provided
- ✅ Shows selector when no challengeId
- ✅ Adapts UI based on tier

**Auto-loading Logic:**
```typescript
useEffect(() => {
  if (challengeId && !selectedChallenge) {
    const challenge = challenges.find(c => c.id === challengeId);
    if (challenge) {
      setSelectedChallenge(challenge);
      setShowChallengeSelector(false);
    }
  }
}, [challengeId, challenges, selectedChallenge]);
```

---

#### `ProblemCatalog.tsx`

**Added Banner:**

```jsx
<div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
  <div className="flex items-center justify-between">
    <div>
      <h2>New: 3-Tier Challenge System</h2>
      <p>Write Python code, configure algorithms, or design architecture</p>
    </div>
    <button onClick={() => navigate('/system-design/tiered')}>
      Try Tiered Challenges →
    </button>
  </div>
</div>
```

**Visual:**
- Gradient blue/indigo background
- Lightning bolt icon
- Call-to-action button
- Shows above problem list

---

## Current Challenges

### Tier 1: TinyURL (`tinyurl`)
**Implementation Tier:** Simple
**Difficulty:** Beginner

**Required Implementations:**
- `shorten(long_url: str, context: dict) -> str`
- `redirect(short_code: str, context: dict) -> str`

**Template Provided:**
```python
# Database helpers available:
# - db_write(key, value)
# - db_read(key)
# - db_exists(key)
# - db_get_next_id()

def shorten(long_url: str, context: dict) -> str:
    # TODO: Implement this
    pass

def redirect(short_code: str, context: dict) -> str:
    # TODO: Implement this
    pass
```

**Test Cases:**
1. Basic shorten and redirect
2. Duplicate URL handling
3. Invalid input handling
4. Collision testing

**Learning Objectives:**
- Hash function selection (MD5, SHA256, base62)
- Collision handling strategies
- Auto-increment vs random generation
- Database vs in-memory storage

---

### Tier 2: Twitter Feed (`twitter-feed`)
**Implementation Tier:** Moderate
**Difficulty:** Intermediate

**Configurable Algorithms:**

**1. Feed Ranking Algorithm**
- **Chronological:** Simple timestamp ordering (20ms, 1.0x throughput)
- **Engagement-based:** Sort by likes/retweets (50ms, 0.8x throughput)
- **ML Personalized:** Neural network scoring (200ms, 0.3x throughput, CPU intensive)
- **Hybrid:** ML + engagement signals (100ms, 0.6x throughput)

**2. Content Delivery**
- **Pull on Read:** Fetch tweets when user requests feed
- **Fan-out on Write:** Pre-compute feeds when tweets posted
- **Hybrid:** Fan-out for normal users, pull for celebrities

**Performance Visualization:**
- Shows latency/throughput for each choice
- Calculates combined impact
- Recommends based on requirements

**Learning Objectives:**
- Algorithm tradeoffs (latency vs accuracy)
- Fan-out write vs pull on read
- Celebrity problem solutions
- Performance optimization

---

### Tier 3: Uber Matching (`uber-matching`)
**Implementation Tier:** Advanced
**Difficulty:** Advanced

**Pre-built Behaviors:**

**1. match_driver_to_rider**
- Geospatial indexing (QuadTree/Geohash)
- Latency: 50-500ms (depends on driver density)
- Dependencies: geo_index, redis_cache
- Factors: Driver density, concurrent requests, area size

**2. calculate_surge_pricing**
- Real-time supply/demand calculation
- Latency: 10-100ms
- Dependencies: analytics_db, redis_cache
- Factors: Time of day, weather, events

**3. optimize_route**
- Multi-stop route optimization
- Latency: 100-1000ms (NP-hard problem)
- Dependencies: maps_api, graph_db
- Factors: Number of stops, traffic data

**Component Behaviors:**

```typescript
componentBehaviors: {
  appServer: {
    operations: {
      match: { baseLatency: 50, cpuIntensive: true },
      surge: { baseLatency: 20, ioIntensive: true },
      route: { baseLatency: 200, memoryIntensive: true }
    }
  },
  database: {
    dataModel: 'GeospatialRider/DriverLocations',
    schema: { estimatedSize: '500GB at scale' }
  }
}
```

**Learning Objectives:**
- Geospatial algorithms
- Real-time matching systems
- Supply/demand modeling
- High-availability architecture

---

## UI Components

### 1. TieredChallengeSelector
**File:** `src/apps/system-design/builder/ui/components/TieredChallengeSelector.tsx`

**Features:**
- Search challenges
- Filter by tier (Tier 1 / Tier 2 / Tier 3)
- Show difficulty stars
- Display requirements (latency, budget)
- Preview learning objectives
- Tier badges with color coding:
  - Green: Tier 1 (Code)
  - Yellow: Tier 2 (Configure)
  - Red: Tier 3 (Architecture)

---

### 2. ComponentBehaviorVisualizer
**File:** `src/apps/system-design/builder/ui/components/ComponentBehaviorVisualizer.tsx`

**Shows:**
- What each component does
- Worker behaviors (validations, transformations, external APIs)
- App server operations (latency, CPU/memory/IO intensive)
- Database schemas
- Prebuilt behaviors with performance specs

**Expandable Details:**
- Click component to see full behavior
- Shows latency breakdown
- Displays resource usage
- Lists dependencies

---

### 3. AlgorithmConfigModal
**File:** `src/apps/system-design/builder/ui/components/AlgorithmConfigModal.tsx`

**For Tier 2 Only:**
- Radio button selection
- Algorithm descriptions
- Performance characteristics (latency, throughput, resource usage)
- Code preview (expandable)
- Combined performance impact
- Real-time cost calculator

**Example:**
```
Feed Ranking: ML Personalized
  ⏱️ 200ms
  ⚡ 0.3x throughput
  🧠 CPU intensive
  [View Implementation ▼]
```

---

### 4. PythonExecutionStatus
**File:** `src/apps/system-design/builder/ui/components/PythonExecutionStatus.tsx`

**Shows:**
- Real-time benchmarking progress
- Performance metrics:
  - Average latency
  - P99 latency
  - Success rate
  - Throughput (req/sec)
- Latency distribution histogram
- Performance warnings:
  - "Slow Performance Detected"
  - "High Error Rate"
- Performance score (0-100)

---

### 5. PythonCodeChallengePanel
**File:** `src/apps/system-design/builder/ui/components/PythonCodeChallengePanel.tsx`

**Features:**
- Monaco code editor
- Example test cases (visible)
- Hidden test cases (run on submit)
- Run Code / Submit Solution buttons
- Test results panel
- Syntax highlighting
- Auto-complete

**Fixed Issues:**
- ✅ Now uses stateful execution (context persists)
- ✅ Proper test case handling
- ✅ RESULT_FROM_PREV placeholders work

---

## Behavior Library

### File: `src/apps/system-design/builder/behaviors/componentBehaviors.ts`

**Reusable Patterns for All 400 Problems:**

```typescript
WORKER_BEHAVIORS: {
  simple_write: { baseLatency: 20, throughputMultiplier: 1.0 },
  validate_and_write: { baseLatency: 50, throughputMultiplier: 0.8 },
  transform_and_write: { baseLatency: 200, throughputMultiplier: 0.3 },
  external_api_call: { baseLatency: 500, throughputMultiplier: 0.2 }
}

VALIDATIONS: {
  email: { name: 'Email Format', latency: 5 },
  phone: { name: 'Phone Number', latency: 3 },
  url: { name: 'URL Format', latency: 2 },
  credit_card: { name: 'Credit Card', latency: 10 }
}

TRANSFORMATIONS: {
  json_parse: { name: 'JSON Parse', latency: 5, cpuCost: 'low' },
  xml_parse: { name: 'XML Parse', latency: 20, cpuCost: 'medium' },
  image_resize: { name: 'Image Resize', latency: 200, cpuCost: 'high' },
  video_transcode: { name: 'Video Transcode', latency: 5000, cpuCost: 'high' }
}

EXTERNAL_APIS: {
  stripe: { name: 'Stripe Payment', latency: { p50: 300, p99: 2000 } },
  twilio: { name: 'Twilio SMS', latency: { p50: 500, p99: 3000 } },
  sendgrid: { name: 'SendGrid Email', latency: { p50: 400, p99: 2500 } }
}
```

**Usage:**
- Mix and match behaviors for new problems
- No code duplication
- Consistent performance modeling
- Easy to extend

---

## Type System

### File: `src/apps/system-design/builder/types/challengeTiers.ts`

**Key Types:**

```typescript
export type ImplementationTier = 'simple' | 'moderate' | 'advanced';

export interface TieredChallenge extends Challenge {
  implementationTier: ImplementationTier;

  // Tier 1: Required Python implementations
  requiredImplementations?: RequiredImplementation[];

  // Tier 2: Configurable algorithms
  configurableAlgorithms?: ConfigurableAlgorithm[];

  // Tier 3: Pre-built behaviors
  prebuiltBehaviors?: { [componentType: string]: PrebuiltBehavior[] };

  // Component behavior config (all tiers)
  componentBehaviors?: ComponentBehaviorConfig;
}
```

**Helper Functions:**
```typescript
getTierDescription(tier: ImplementationTier): string
getTierUIRequirements(tier: ImplementationTier): {
  needsCodeEditor: boolean;
  needsAlgorithmConfig: boolean;
  needsArchitectureOnly: boolean;
}
```

---

## User Journey

### Landing Page (Problem Catalog)

**URL:** `http://localhost:5002/system-design`

```
┌─────────────────────────────────────────────────────┐
│ 🔥 New: 3-Tier Challenge System                    │
│ Write Python code, configure algorithms, or design │
│ architecture                                        │
│                        [Try Tiered Challenges →]    │
└─────────────────────────────────────────────────────┘

System Design Problems
534 problems • 534 filtered

[Search box...]
[Difficulty filter] [Category filter]
[Problem list...]
```

---

### Tiered Challenge Selector

**URL:** `http://localhost:5002/system-design/tiered`

```
┌──────────────────────────────────────────────┐
│ Select Challenge                              │
│ Choose a system design problem to solve      │
├──────────────────────────────────────────────┤
│ [Search challenges...]                        │
│                                               │
│ [All Tiers (3)] [Tier 1 (1)] [Tier 2 (1)] [Tier 3 (1)] │
├──────────────────────────────────────────────┤
│ Tier Legend:                                  │
│ 🐍 Tier 1: Write Python code                 │
│ ⚙️ Tier 2: Configure algorithms              │
│ 🏗️ Tier 3: Design architecture              │
├──────────────────────────────────────────────┤
│                                               │
│ ┌───────────────────────────────────────┐   │
│ │ TinyURL Shortener         [Tier 1] ⭐  │   │
│ │ Build a URL shortener service...      │   │
│ │ ⏱️ <100ms  💰 $500/mo  📋 3 test cases│   │
│ │ What you'll do:                        │   │
│ │ • 🐍 Write Python Code                │   │
│ └───────────────────────────────────────┘   │
│                                               │
│ ┌───────────────────────────────────────┐   │
│ │ Twitter Feed Ranking    [Tier 2] ⭐⭐   │   │
│ │ Design a personalized feed...         │   │
│ │ What you'll do:                        │   │
│ │ • ⚙️ Configure Algorithms             │   │
│ └───────────────────────────────────────┘   │
│                                               │
│ ┌───────────────────────────────────────┐   │
│ │ Uber Matching          [Tier 3] ⭐⭐⭐   │   │
│ │ Real-time driver-rider matching...    │   │
│ │ What you'll do:                        │   │
│ │ • 🏗️ Design System                    │   │
│ └───────────────────────────────────────┘   │
└──────────────────────────────────────────────┘
```

---

### Tier 1 Challenge (TinyURL)

**URL:** `http://localhost:5002/system-design/tiered/tinyurl`

**Layout:**

```
┌────────────────────────────────────────────────────────────┐
│ TinyURL Shortener                                  [Tier 1] │
├──────────────┬─────────────────────────────────────────────┤
│              │                                              │
│ Problem      │ # Python Implementation                      │
│              │                                              │
│ Requirements │ def shorten(url: str, context: dict) -> str:│
│              │     # TODO: Implement                        │
│ Test Cases   │     pass                                     │
│              │                                              │
│ Components   │ def redirect(code: str, context: dict) -> str:│
│              │     # TODO: Implement                        │
│              │     pass                                     │
│              │                                              │
│              │ [Run Code]  [Submit Solution]                │
│              │                                              │
│              │ Test Results:                                │
│              │ ✓ Basic shorten and expand                   │
│              │ ✗ Duplicate URL handling                     │
│              │                                              │
├──────────────┴─────────────────────────────────────────────┤
│ Component Behaviors                            [Tier 1]     │
│                                                              │
│ Your Python code implementation will affect these behaviors  │
│ and performance.                                             │
│                                                              │
│ ┌────────────────────────────────────────┐                 │
│ │ App Server                            ▼│                 │
│ │ • shorten(): 20ms base latency         │                 │
│ │ • redirect(): 5ms base latency         │                 │
│ └────────────────────────────────────────┘                 │
└──────────────────────────────────────────────────────────────┘
```

---

### Tier 2 Challenge (Twitter Feed)

**URL:** `http://localhost:5002/system-design/tiered/twitter-feed`

**Features:**
- Algorithm configuration modal
- Performance comparison
- Real-time impact calculation
- Visual architecture builder

**Algorithm Modal:**

```
┌──────────────────────────────────────────────────────┐
│ Configure Algorithms                                  │
│ Twitter Feed Ranking - Tier 2 (Moderate)         [×] │
├──────────────────────────────────────────────────────┤
│ ℹ️ Select the best algorithm for each component     │
│    based on your requirements.                        │
│                                                       │
│ Feed Ranking Algorithm                                │
│ ┌────────────────────────────────────────────────┐   │
│ │ ○ Chronological                                │   │
│ │   ⏱️ 20ms  ⚡ 1.0x throughput                 │   │
│ │                                                │   │
│ │ ● Engagement-based                             │   │
│ │   ⏱️ 50ms  ⚡ 0.8x throughput                 │   │
│ │   [View implementation ▼]                      │   │
│ │                                                │   │
│ │ ○ ML Personalized                              │   │
│ │   ⏱️ 200ms  ⚡ 0.3x throughput  🧠 CPU        │   │
│ │                                                │   │
│ │ ○ Hybrid                                       │   │
│ │   ⏱️ 100ms  ⚡ 0.6x throughput                │   │
│ └────────────────────────────────────────────────┘   │
│                                                       │
│ Combined Performance Impact                           │
│ Total Latency: 50ms                                   │
│ Throughput: 80%                                       │
│ Resource Usage: [Memory]                              │
│ ✅ Great for real-time                               │
│                                                       │
│ [Cancel]  [Apply Configuration]                       │
└──────────────────────────────────────────────────────┘
```

---

### Tier 3 Challenge (Uber Matching)

**URL:** `http://localhost:5002/system-design/tiered/uber-matching`

**Focus:**
- Visual architecture builder
- Pre-built behavior documentation
- Component connections
- No code writing

**Component Behaviors Panel:**

```
Component Behaviors                               [Tier 3]

These behaviors are pre-built. Focus on system architecture
to support them.

┌──────────────────────────────────────────────────┐
│ App Server                                     ▼ │
│                                                   │
│ Prebuilt Behaviors:                               │
│                                                   │
│ match_driver_to_rider                             │
│ Geospatial matching with QuadTree indexing        │
│ ⏱️ 50-500ms  ⚡ 1000 ops/sec  ⚠️ 2.5% failure    │
│ Dependencies: geo_index, redis_cache              │
│                                                   │
│ calculate_surge_pricing                           │
│ Real-time supply/demand analysis                  │
│ ⏱️ 10-100ms  ⚡ 5000 ops/sec                     │
│ Dependencies: analytics_db, redis_cache           │
│                                                   │
│ optimize_route                                    │
│ Multi-stop route optimization (NP-hard)           │
│ ⏱️ 100-1000ms  ⚡ 500 ops/sec                    │
│ Dependencies: maps_api, graph_db                  │
└──────────────────────────────────────────────────┘
```

---

## Files Modified/Created

### Created Files

#### Challenges
- `src/apps/system-design/builder/challenges/tieredChallenges.ts` - Registry
- `src/apps/system-design/builder/challenges/tier1/tinyUrlTiered.ts` - Tier 1 example
- `src/apps/system-design/builder/challenges/tier2/twitterFeedTiered.ts` - Tier 2 example
- `src/apps/system-design/builder/challenges/tier3/uberMatchingTiered.ts` - Tier 3 example

#### Behaviors
- `src/apps/system-design/builder/behaviors/componentBehaviors.ts` - Reusable library

#### UI Components
- `src/apps/system-design/builder/ui/TieredSystemDesignBuilder.tsx` - Main component
- `src/apps/system-design/builder/ui/components/TieredChallengeSelector.tsx` - Selector
- `src/apps/system-design/builder/ui/components/AlgorithmConfigModal.tsx` - Tier 2 modal
- `src/apps/system-design/builder/ui/components/PythonExecutionStatus.tsx` - Benchmarking
- `src/apps/system-design/builder/ui/components/ComponentBehaviorVisualizer.tsx` - Behaviors

#### Types
- `src/apps/system-design/builder/types/challengeTiers.ts` - Type definitions

#### Documentation
- `TIERED_SYSTEM_INTEGRATION.md` - This file
- `src/apps/system-design/builder/services/__tests__/STATEFUL_EXECUTION_FIX.md` - Stateful fix docs

### Modified Files

#### Routing
- `src/apps/system-design/SystemDesignApp.tsx` - Added tiered routes

#### UI
- `src/apps/system-design/builder/ui/components/ProblemCatalog.tsx` - Added banner
- `src/apps/system-design/builder/ui/SystemDesignBuilderApp.tsx` - Stateful execution fix

#### Types
- `src/apps/system-design/builder/types/component.ts` - Added worker type

---

## Next Steps

### Immediate
1. ✅ Integrate routing
2. ✅ Wire up components
3. ✅ Add catalog banner
4. ⏭️ Test in browser
5. ⏭️ Fix any UI issues

### Short-term
1. Add more Tier 1 challenges (Instagram, Pastebin, Chat)
2. Add more Tier 2 challenges (E-commerce, Search)
3. Add more Tier 3 challenges (WhatsApp, Netflix)
4. Connect simulation to actual Python performance
5. Add Pyodide for real Python execution

### Long-term
1. Scale to 400+ problems
2. Add difficulty progression
3. Add achievement system
4. Add collaborative features
5. Add AI hints/assistance

---

## Testing Checklist

### URLs to Test

- [ ] http://localhost:5002/system-design
  - Should show banner with "Try Tiered Challenges" button

- [ ] http://localhost:5002/system-design/tiered
  - Should show TieredChallengeSelector with 3 challenges

- [ ] http://localhost:5002/system-design/tiered/tinyurl
  - Should load Tier 1 challenge with Python editor

- [ ] http://localhost:5002/system-design/tiered/twitter-feed
  - Should load Tier 2 challenge with algorithm config

- [ ] http://localhost:5002/system-design/tiered/uber-matching
  - Should load Tier 3 challenge with prebuilt behaviors

### Functionality to Test

**Tier 1:**
- [ ] Python editor loads
- [ ] Can write code
- [ ] Run Code button works
- [ ] Tests execute with persistent state
- [ ] Submit Solution validates all tests
- [ ] Performance metrics display

**Tier 2:**
- [ ] Algorithm modal opens
- [ ] Can select algorithms
- [ ] Performance impact updates
- [ ] Can expand code previews
- [ ] Apply Configuration saves choices
- [ ] Architecture reflects config

**Tier 3:**
- [ ] Prebuilt behaviors display
- [ ] Component behaviors expandable
- [ ] Architecture builder works
- [ ] No code editor shown
- [ ] Focus on system design

**Navigation:**
- [ ] Banner click navigates to /tiered
- [ ] Challenge selection navigates to /tiered/:id
- [ ] Back button returns to selector
- [ ] Browser refresh preserves state

---

## Success Metrics

### Fixed from Review

✅ **Critical Flaw #1: Stateful Execution** - RESOLVED
- Tests now preserve state between operations
- Students can use dictionaries and classes
- RESULT_FROM_PREV placeholders work

✅ **Critical Flaw #7: Tiered System Missing** - RESOLVED
- All 3 tiers implemented
- UI adapts based on tier
- 3 example challenges created

### New Capabilities

✅ **Scalability to 400+ Problems**
- Reusable behavior library
- No code duplication
- Mix-and-match patterns

✅ **Progressive Complexity**
- Tier 1: Beginners learn algorithms
- Tier 2: Intermediate learn tradeoffs
- Tier 3: Advanced learn architecture

✅ **Student Experience**
- Clear expectations per tier
- Appropriate tools per complexity
- Realistic learning objectives

---

**Integration Date:** 2025-11-14
**Status:** ✅ Complete and Ready for Testing
**Next Action:** Test in browser at http://localhost:5002/system-design/tiered
