# Guided Tutorial Creation Template

This document outlines the standardized approach for creating or refactoring guided tutorials for any system design problem. Follow this template to ensure consistency, pedagogical soundness, and a great user experience.

---

## Core Philosophy: "FR-First, Then Scale"

**Make it work → Make it right → Make it scale**

1. **Phase 0**: Gather Functional Requirements (FRs) from the user's perspective
2. **Steps 1-3**: Build a basic working system (client → server → database)
3. **Steps 4+**: Introduce Non-Functional Requirements (NFRs) and scale the system

---

## Tutorial Metadata

Each tutorial should include metadata for discoverability and user guidance:

```typescript
export const myProblemGuided: GuidedTutorial = {
  problemId: 'my-problem',

  // Skill level helps users choose appropriate tutorials
  skillLevel: 'beginner' | 'intermediate' | 'advanced',

  // Optional prerequisites for sequencing
  prerequisites: ['basic-http', 'databases-101'],

  // Total estimated time (sum of all steps)
  totalEstimatedMinutes: 45,

  // Enable sandbox mode toggle in UI
  supportsSandboxMode: true,

  // ... rest of tutorial
}
```

---

## Step-by-Step Plan for Each Problem

### Phase 0: Requirements Gathering

#### Goals
- Help users think like a product engineer, not just a coder
- Focus ONLY on Functional Requirements (what the system does)
- Frame everything from the end-user's perspective
- NO NFRs, NO scale metrics, NO architectural implications yet

#### Interviewer Persona

Create an engaging interview experience with a named interviewer:

```typescript
requirementsPhase: {
  interviewer: {
    name: 'Sarah Chen',
    role: 'Engineering Manager',
    avatar: '👩‍💼'
  },
  problemStatement: "Design a URL shortener like bit.ly or TinyURL",
  questions: [...],
  // ... rest of requirements phase
}
```

#### Checklist
- [ ] Write 4-6 FR questions (user-centric, not technical)
- [ ] Each question has: `id`, `category: 'functional'`, `question`, `answer`, `followUp`
- [ ] Answers use markdown formatting (numbered lists, bold text)
- [ ] `userFacingFRs` are pure user experiences (no API endpoints)
- [ ] `keyInsight` emphasizes "make it work first"
- [ ] Remove any `scaleMetrics` or `architecturalImplications`

#### Example FR Questions Pattern
```typescript
{
  id: 'core-action-1',
  category: 'functional',
  question: "What's the main thing a user wants to do?",
  answer: `Users want to:\n\n1. **Primary action** - Description\n2. **Secondary action** - Description`,
  followUp: "What information do they need to provide?"
}
```

#### User-Facing FRs Pattern
```typescript
userFacingFRs: [
  "As a [user type], I can [action] so that [benefit]",
  "When I [trigger], I see [result]",
  "I can [capability] without [friction]"
]
```

---

### Step 1: Connect Client to Server

#### Goals
- Simplest possible architecture
- Establish the request/response pattern
- No database, no persistence yet

#### Content Structure
```typescript
{
  id: 1,
  title: "Connect Client to Server",
  estimatedMinutes: 5,
  difficulty: 'beginner',

  story: {
    emoji: '🌐',
    hook: "Your first user arrives...",
    scenario: "They want to [primary action]. Let's handle that request.",
    challenge: "Build the basic request flow.",
    illustration: 'client-server'
  },
  learnPhase: {
    conceptTitle: "Client-Server Basics",
    conceptExplanation: `...markdown content...`,
    concepts: ["Request/Response", "HTTP Methods", "API Endpoints"],
    keyPoints: [
      "Client sends request",
      "Server processes and responds",
      "No persistence yet - that's okay!"
    ],
    // Optional: Real-world context
    realWorldExample: {
      company: 'Google',
      scenario: 'Every Google search starts with a client-server request',
      howTheyDoIt: 'Their frontend sends requests to thousands of servers worldwide'
    }
  },
  practicePhase: {
    taskDescription: "Add a Client and App Server, connect them",
    componentsNeeded: [
      { type: 'client', reason: 'Represents users accessing your service', displayName: 'Client' },
      { type: 'app_server', reason: 'Handles incoming requests', displayName: 'App Server' }
    ],
    successCriteria: ["Client connected to App Server"]
  },
  celebration: {
    emoji: '🎉',
    message: 'First connection established!',
    achievement: 'You built the foundation of your system',
    nextTeaser: 'But the server needs to actually do something...'
  },
  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }]
  },
  hints: {
    level1: 'Drag a Client and App Server from the component palette',
    level2: 'Click on the Client, then click on App Server to create a connection',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }]
  }
}
```

#### Welcome Story vs Step 1 Story

**Important**: The welcome story introduces the scenario ONCE. Step 1 story should NOT repeat it:

```typescript
// Welcome story (shown ONCE before requirements)
welcomeStory: {
  hook: "You just got hired at a URL shortening startup!",
  scenario: "Your CEO needs a prototype by tomorrow.",
  challenge: "Can you build a system like bit.ly?"
}

// Step 1 story (different - assumes context from welcome)
step1.story: {
  emoji: '🌐',
  scenario: "Your first user arrives at the website...",
  hook: "They want to shorten a URL. Let's handle that request.",
  challenge: "Build the request flow from browser to server."
}
// Note: Step 1 doesn't re-introduce the company or situation
```

---

### Step 2: Implement Core Logic (Python Code)

#### Goals
- User writes actual Python code
- Implement the primary API endpoints
- Use in-memory storage (dict/list) - no DB yet

#### Content Structure
```typescript
{
  id: 2,
  title: "Implement [Feature] Logic",
  estimatedMinutes: 10,
  difficulty: 'beginner',

  story: {
    emoji: '💻',
    hook: "Time to write real code!",
    scenario: "Your server needs to actually [do something].",
    challenge: "Implement the Python handlers."
  },
  learnPhase: {
    conceptTitle: "API Implementation",
    conceptExplanation: `
Every API endpoint needs a **handler function** - code that:
1. Receives the request
2. Processes the data
3. Returns a response
    `,
    concepts: ["Python Handlers", "In-Memory Storage", "API Design"],
    keyPoints: [
      "Each API needs a handler function",
      "Use a dictionary for temporary storage",
      "Focus on correctness, not scale"
    ],

    // Quick Check Quiz (interactive learning)
    quickCheck: {
      question: 'What should redirect() return if the short code doesn\'t exist?',
      options: ['An empty string', 'None/null', 'The short code itself', 'A random URL'],
      correctIndex: 1,
      explanation: 'Returning None indicates "not found", which the server translates to a 404 response.'
    },

    // Famous Incident (memorable real-world story)
    famousIncident: {
      title: 'GitHub Unicorn Page',
      company: 'GitHub',
      year: '2013',
      whatHappened: 'A handler bug caused infinite redirects, crashing browsers.',
      lessonLearned: 'Test your handlers thoroughly - a simple bug can affect millions.',
      icon: '🦄'
    }
  },
  practicePhase: {
    taskDescription: "Configure APIs and implement Python handlers",
    successCriteria: [
      "APIs assigned to App Server",
      "Python code implements all handlers"
    ]
  },
  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
    requireAPIConfiguration: true,
    requireCodeImplementation: true  // ← Triggers inline editor + code validation
  }
}
```

#### Enhanced Python Template Pattern

Provide detailed, well-documented templates:

```python
# === [Problem Name] API Handlers ===
# This file implements the core [feature] logic.
# Storage will be in-memory first (Step 2), then moved to database (Step 3).

import random
import string
from typing import Optional, Dict, Any

# In-memory storage (replaced with DB queries in Step 3)
storage: Dict[str, Any] = {}

def generate_id(length: int = 8) -> str:
    """Generate a random alphanumeric ID."""
    chars = string.ascii_letters + string.digits
    return ''.join(random.choice(chars) for _ in range(length))

def handle_create(data: dict, context: dict) -> Optional[dict]:
    """
    Handle POST /api/v1/[resource]

    Args:
        data: The request payload with resource data
        context: Contains 'user_id', 'timestamp', etc.

    Returns:
        The created resource with ID, or None if error

    Example:
        handle_create({"name": "test"}, {"user_id": "123"})
        → {"id": "abc123", "name": "test", "created_by": "123"}
    """
    # Generate unique ID
    resource_id = generate_id()
    while resource_id in storage:  # Handle collision
        resource_id = generate_id()

    # Create resource
    resource = {
        'id': resource_id,
        **data,
        'created_at': context.get('timestamp'),
        'created_by': context.get('user_id')
    }

    # Store in memory
    storage[resource_id] = resource

    return resource

def handle_read(resource_id: str, context: dict) -> Optional[dict]:
    """
    Handle GET /api/v1/[resource]/{id}

    Args:
        resource_id: The ID of the resource to retrieve
        context: Additional context (unused here)

    Returns:
        The resource data or None if not found

    Example:
        handle_read("abc123", {}) → {"id": "abc123", "name": "test", ...}
    """
    return storage.get(resource_id)

def handle_update(resource_id: str, data: dict, context: dict) -> Optional[dict]:
    """
    Handle PUT /api/v1/[resource]/{id}

    Args:
        resource_id: The ID of the resource to update
        data: The fields to update
        context: Contains 'user_id', 'timestamp', etc.

    Returns:
        The updated resource or None if not found
    """
    if resource_id not in storage:
        return None

    resource = storage[resource_id]
    resource.update(data)
    resource['updated_at'] = context.get('timestamp')

    return resource

def handle_delete(resource_id: str, context: dict) -> bool:
    """
    Handle DELETE /api/v1/[resource]/{id}

    Args:
        resource_id: The ID of the resource to delete
        context: Additional context (unused here)

    Returns:
        True if deleted, False if not found
    """
    if resource_id in storage:
        del storage[resource_id]
        return True
    return False
```

#### Code Validation Details

How `requireCodeImplementation` validation works:

```typescript
// The validation system checks:
// 1. App server exists with APIs configured
// 2. Code exists in code store for that server
// 3. Code contains actual implementation:
//    - Has: return, =, dictionary access, function calls
//    - Less than 70% comments/TODOs (ensures real implementation)
// 4. Provides specific feedback if incomplete

validation: {
  requiredComponents: ['client', 'app_server'],
  requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
  requireAPIConfiguration: true,   // Checks handledAPIs.length > 0
  requireCodeImplementation: true, // Checks for actual Python code
}

// This triggers:
// - API assignment check on app server
// - Python code presence check
// - Code implementation quality check (not just template)
```

---

### Step 3: Add Database (Persistence)

#### Goals
- Replace in-memory storage with real database
- Introduce data modeling concepts
- Still single instance - no replication

#### Content Structure
```typescript
{
  id: 3,
  title: "Add Database",
  estimatedMinutes: 5,
  difficulty: 'beginner',

  story: {
    emoji: '💥',
    hook: "Server restarts... and all data is gone!",
    scenario: "In-memory storage doesn't survive restarts.",
    challenge: "Add persistent storage."
  },
  learnPhase: {
    conceptTitle: "Persistence Layer",
    concepts: ["Database", "CRUD Operations", "Data Durability"],
    keyPoints: [
      "Data survives server restarts",
      "Single source of truth",
      "Choose SQL vs NoSQL based on data structure"
    ],

    // Famous Incident for impact
    famousIncident: {
      title: 'MySpace Music Archive Loss',
      company: 'MySpace',
      year: '2019',
      whatHappened: 'Server migration failed, 12 years of user-uploaded music (50M+ songs) was lost forever.',
      lessonLearned: 'Persistent storage with backups is non-negotiable.',
      icon: '💀'
    },

    realWorldExample: {
      company: 'Instagram',
      scenario: 'Stores 2+ billion photos',
      howTheyDoIt: 'Uses PostgreSQL for metadata and S3 for actual images'
    }
  },
  practicePhase: {
    taskDescription: "Add a Database and connect App Server to it",
    componentsNeeded: [
      { type: 'database', reason: 'Persistent data storage', displayName: 'Database' }
    ],
    successCriteria: ["Database added", "App Server → Database connected"]
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' }
    ]
  }
}
```

---

### Step 4+: Scale Introduction (NFRs Begin)

#### Goals
- NOW introduce Non-Functional Requirements
- Start with the most impactful optimization
- Each step solves ONE scaling problem

#### Common Scaling Steps Pattern

| Step | Problem | Solution | Components | Validation |
|------|---------|----------|------------|------------|
| 4 | Slow repeated reads | Add Cache | `cache` (Redis) | requireCacheStrategy |
| 5 | Server overloaded | Load Balancer | `load_balancer` | requiredComponents |
| 6 | DB is bottleneck | Read Replicas | DB replication config | requireDatabaseReplication |
| 7 | Need more capacity | Horizontal Scaling | Multiple app server instances | requireMultipleAppInstances |
| 8 | Large files slow | Object Storage + CDN | `object_storage`, `cdn` | requiredComponents |
| 9 | Async processing | Message Queue | `message_queue` | requiredComponents |
| 10 | Cost control | Budget optimization | - | requireCostUnderBudget |

#### Scaling Step Template
```typescript
{
  id: N,
  title: "[Solve Specific Problem]",
  estimatedMinutes: 8,
  difficulty: 'intermediate',

  story: {
    emoji: '📈',
    hook: "Traffic increased 10x overnight...",
    scenario: "[Specific symptom] - users are complaining about [issue]",
    challenge: "Add [component] to solve [problem]"
  },
  learnPhase: {
    conceptTitle: "[Solution Name]",
    conceptExplanation: `...detailed markdown...`,
    concepts: ["Concept 1", "Concept 2"],
    keyPoints: [
      "Why this solves the problem",
      "Trade-offs to consider",
      "When to use vs alternatives"
    ],
    diagram: `
      [Previous Architecture]
              ↓
      [+ New Component]
              ↓
      [Result]
    `,

    // Always include a famous incident for memorable learning
    famousIncident: {
      title: 'Incident Name',
      company: 'Company',
      year: '2020',
      whatHappened: 'What went wrong',
      lessonLearned: 'The key takeaway',
      icon: '🔥'
    },

    // Quick check to verify understanding
    quickCheck: {
      question: 'Why is [solution] better than [alternative]?',
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctIndex: 1,
      explanation: 'Because...'
    }
  },
  practicePhase: {
    taskDescription: "Add [component] to handle [problem]",
    componentsNeeded: [
      { type: 'new_component', reason: 'Why needed', displayName: 'Display Name' }
    ],
    successCriteria: ["Component added", "Properly connected"]
  },
  celebration: {
    emoji: '🚀',
    message: 'System can handle [X]x more traffic!',
    achievement: 'You implemented [solution]',
    metrics: [
      { label: 'Latency', before: '500ms', after: '50ms' },
      { label: 'Capacity', after: '10,000 RPS' }
    ],
    nextTeaser: 'But what happens when...'
  }
}
```

#### Validation Options for Scaling Steps

```typescript
validation: {
  // Basic requirements (cumulative from previous steps)
  requiredComponents: ['client', 'app_server', 'database', 'cache'],
  requiredConnections: [
    { fromType: 'client', toType: 'app_server' },
    { fromType: 'app_server', toType: 'database' },
    { fromType: 'app_server', toType: 'cache' }
  ],

  // Specialized validation (use one per step)
  requireCacheStrategy: true,        // Step 4: TTL > 0 and strategy set
  requireDatabaseReplication: true,  // Step 6: replicas >= 2
  requireMultipleAppInstances: true, // Step 7: instances >= 2
  requireDatabaseCapacity: true,     // Step 9: writeCapacity >= 100
  requireCostUnderBudget: true,      // Step 10: total cost < $500/month
}
```

#### Cost Calculation Reference

For `requireCostUnderBudget` validation:

```
Database:     $120 × (1 + replicas) + $0.10 × storageGB
App Server:   $50 × instances
Cache:        $20 × memorySizeGB
Load Balancer: $30
Object Storage: $25
CDN:          $50
```

---

## Cumulative Validation Pattern

**Important**: Each step validates ALL previous requirements plus new ones:

| Step | Validates |
|------|-----------|
| 1 | client, app_server, connection |
| 2 | Step 1 + APIs configured + code written |
| 3 | Step 2 + database + app→db connection |
| 4 | Step 3 + cache + app→cache connection + cache strategy |
| 5 | Step 4 + load_balancer + client→lb→app connections |
| 6 | Step 5 + database replication enabled |
| 7 | Step 6 + multiple app server instances |
| ... | ... |

This ensures users can't skip ahead without completing previous steps.

---

## Problem Complexity & Step Count

Choose step count based on problem complexity:

| Complexity | Step Count | Example Problems | Focus |
|------------|------------|------------------|-------|
| Simple (CRUD) | 5 steps | Todo app, Notes, Blog | Basic persistence |
| Medium (Read-heavy) | 7 steps | TinyURL, Pastebin | Caching, replication |
| Complex (Real-time) | 8 steps | Discord, Slack | WebSockets, queues |
| Advanced (Multi-domain) | 10 steps | Twitter, Netflix | Full scaling stack |

### Category Templates

**Category A: CRUD Apps (5 steps)**
- Phase 0: Requirements
- Step 1: Client → Server
- Step 2: Implement CRUD APIs
- Step 3: Add Database
- Step 4: Add Caching
- Step 5: Add Load Balancer

**Category B: Read-Heavy (7 steps)**
- Phase 0-5: Same as CRUD
- Step 6: Database Replication
- Step 7: CDN for static content

**Category C: Real-Time (8 steps)**
- Phase 0-5: Same as CRUD
- Step 6: WebSocket/Pub-Sub
- Step 7: Message Queue
- Step 8: Horizontal Scaling

**Category D: Media/Streaming (10 steps)**
- Phase 0-7: Same as Read-Heavy
- Step 8: Object Storage
- Step 9: CDN + Edge Caching
- Step 10: Cost Optimization

---

## File Structure

For each problem `{problemId}`:

```
challenges/definitions/
├── {problemId}.ts           # Problem definition (FRs, NFRs, validators)
├── {problemId}Guided.ts     # Guided tutorial (steps, phases)
└── index.ts                 # Export both

tiered/
└── {problemId}.ts           # Challenge wrapper for UI
```

---

## Sandbox Mode

Enable sandbox mode to let users experiment freely without validation:

```typescript
export const myProblemGuided: GuidedTutorial = {
  // ...
  supportsSandboxMode: true,  // Shows sandbox toggle in UI
}
```

When sandbox mode is active:
- Validation is disabled
- Users can add any components
- Good for exploration after completing tutorial

---

## Quality Checklist

### Requirements Phase (Step 0)
- [ ] Only FR questions (no NFRs)
- [ ] User-centric language (no technical jargon)
- [ ] Interviewer persona defined
- [ ] Markdown renders correctly in answers
- [ ] 2-4 critical questions identified
- [ ] `keyInsight` mentions "make it work first"

### Steps 1-3 (Basic System)
- [ ] Step 1: Client → Server only
- [ ] Step 2: Python code with inline editor
- [ ] Step 3: Add database for persistence
- [ ] No scaling components yet
- [ ] Each step has story → learn → practice → celebration flow
- [ ] Famous incident or real-world example in each learn phase

### Steps 4+ (Scaling)
- [ ] Each step solves ONE problem
- [ ] Story explains WHY (user pain point)
- [ ] Learn explains HOW (concepts + diagram)
- [ ] Quick check quiz for understanding
- [ ] Practice is focused (1-2 components max)
- [ ] Builds on previous steps (references what's already there)

### Code & Validation
- [ ] `requireCodeImplementation: true` for coding steps
- [ ] Python template has clear docstrings and examples
- [ ] Validation checks components, connections, AND code
- [ ] Appropriate specialized validation (cache, replication, etc.)
- [ ] Hints guide users without giving away answers

### UX
- [ ] Welcome story appears before requirements
- [ ] No repeated content between phases
- [ ] Clear progression (no skipping steps)
- [ ] Inline code editor appears for coding steps
- [ ] Celebration metrics show progress
- [ ] `estimatedMinutes` set for each step

---

## Example: Complete Step with All Features

```typescript
const step4: GuidedStep = {
  id: 'twitter-step-4',
  stepNumber: 4,
  estimatedMinutes: 8,
  difficulty: 'intermediate',

  story: {
    emoji: '🐌',
    scenario: "Your timeline is loading slowly - 500ms per request!",
    hook: "Users are refreshing constantly, hammering the database.",
    challenge: "Cache popular tweets to speed up reads.",
    illustration: 'slow-loading'
  },

  learnPhase: {
    conceptTitle: 'Caching for Speed',
    conceptExplanation: `
A **cache** is fast, temporary storage that sits between your app and database.

Instead of:
\`\`\`
Request → Database (slow, 100ms)
\`\`\`

You get:
\`\`\`
Request → Cache (fast, 1ms) → Database (only if cache miss)
\`\`\`

**Cache Hit**: Data found in cache → instant response
**Cache Miss**: Data not in cache → fetch from DB, store in cache
    `,
    whyItMatters: 'The 80/20 rule: 20% of content gets 80% of views. Cache the hot stuff.',

    realWorldExample: {
      company: 'Twitter',
      scenario: 'Serving 500M tweets per day',
      howTheyDoIt: 'Uses Redis clusters to cache timelines - most requests never hit the database.'
    },

    famousIncident: {
      title: 'Facebook Cache Stampede',
      company: 'Facebook',
      year: '2010',
      whatHappened: 'When memcached restarted, millions of requests hit the DB simultaneously, causing a cascading failure.',
      lessonLearned: 'Cache warming and graceful degradation are essential.',
      icon: '🏃'
    },

    keyPoints: [
      'Cache sits between app server and database',
      'Set a TTL (Time To Live) to prevent stale data',
      'Use cache-aside pattern: check cache first, fallback to DB'
    ],

    diagram: `
┌────────┐     ┌─────────────┐     ┌───────┐     ┌──────────┐
│ Client │ ──▶ │ App Server  │ ──▶ │ Cache │ ──▶ │ Database │
└────────┘     └─────────────┘     └───────┘     └──────────┘
                     │                  │
                     │   Cache Hit? ────┘
                     │   Return instantly!
                     │
                     │   Cache Miss?
                     └─────────────────────▶ Fetch from DB
    `,

    keyConcepts: [
      { title: 'TTL', explanation: 'How long to keep data in cache', icon: '⏱️' },
      { title: 'Cache Hit', explanation: 'Data found in cache', icon: '✅' },
      { title: 'Cache Miss', explanation: 'Data not in cache, fetch from DB', icon: '❌' }
    ],

    quickCheck: {
      question: 'What happens during a cache miss?',
      options: [
        'Return an error to the user',
        'Fetch from database and store in cache',
        'Wait for the cache to be repopulated',
        'Redirect to a backup server'
      ],
      correctIndex: 1,
      explanation: 'On a cache miss, we fetch the data from the database, return it to the user, AND store it in cache for next time.'
    }
  },

  practicePhase: {
    frText: 'FR-2: Users see tweets from people they follow, newest first',
    taskDescription: 'Add a cache between App Server and Database',
    componentsNeeded: [
      { type: 'cache', reason: 'Store frequently accessed tweets', displayName: 'Redis Cache' }
    ],
    connectionsNeeded: [
      { from: 'App Server', to: 'Cache', reason: 'Check cache before database' }
    ],
    successCriteria: [
      'Cache component added to canvas',
      'App Server connected to Cache',
      'Cache TTL configured (30-60 seconds)',
      'Cache strategy set (cache-aside or read-through)'
    ]
  },

  celebration: {
    emoji: '⚡',
    message: 'Timeline loads 10x faster!',
    achievement: 'You implemented caching',
    metrics: [
      { label: 'Response Time', before: '500ms', after: '50ms' },
      { label: 'DB Load', before: '100%', after: '20%' }
    ],
    nextTeaser: 'But what happens when traffic spikes 10x?'
  },

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' }
    ],
    requireCacheStrategy: true  // Validates TTL > 0 and strategy is set
  },

  hints: {
    level1: 'Drag a Cache (Redis) component onto the canvas',
    level2: 'Connect App Server to Cache. Then click the Cache and set TTL to 60 seconds.',
    solutionComponents: [
      { type: 'cache', config: { ttl: 60, strategy: 'cache-aside' } }
    ],
    solutionConnections: [
      { from: 'app_server', to: 'cache' }
    ]
  }
};
```

---

## Common Mistakes to Avoid

1. **Mixing FRs and NFRs in Step 0** - Keep requirements phase pure FR
2. **Technical language in user-facing FRs** - No "API endpoints", "sharding", "replication"
3. **Too many components per step** - One concept, one component
4. **Skipping the "why"** - Every step needs a story explaining the user pain
5. **Forgetting code validation** - If step needs code, set `requireCodeImplementation: true`
6. **Repeating content** - Welcome story only once, not in Step 1 again
7. **Giant leaps in complexity** - Gradual progression, each step builds on previous
8. **No famous incidents** - Real-world failures make lessons memorable
9. **Missing quick checks** - Interactive quizzes improve retention
10. **Sparse Python templates** - Provide detailed docstrings and examples

---

## Testing Your Tutorial

1. **Flow Test**: Go through entire tutorial, verify no repeated content
2. **Validation Test**: Intentionally skip requirements, verify helpful error messages
3. **Code Test**: For coding steps, verify inline editor appears and validation works
4. **Quiz Test**: Verify quick check answers and explanations are correct
5. **Mobile Test**: Ensure panels are readable on smaller screens
6. **New User Test**: Have someone unfamiliar try it - do they get stuck?
7. **Time Test**: Complete each step, verify `estimatedMinutes` is accurate

---

## Template Files

See these files as reference implementations:

- **TinyURL** (complete): `tinyUrlGuided.ts` - Full 10-step tutorial
- **Uber** (in progress): `uberGuided.ts` - 3-step starter
- **Problem Definition**: `tinyurl.ts` - How to structure the base problem
- **Validation Logic**: `guided/validateStep.ts` - How validation works
- **Type Definitions**: `types/guidedTutorial.ts` - All interfaces

---

*Last updated: December 2024*
