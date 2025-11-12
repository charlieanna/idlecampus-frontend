# Extracted Problems Integration Roadmap

## Current Status

### Problems Added: 10 of 618
**From:** `extracted-problems/system-design/`

#### Batch 1 (First commit - 3 problems):
1. **Reddit Comment System** (Caching)
   - 5M reads/sec, multi-tier caching, viral spike handling

2. **Basic Message Queue** (Streaming)
   - 5k messages/sec, pub/sub, reliable messaging

3. **Basic Database Design** (Storage)
   - 10k reads/sec, RDBMS normalization, read replicas

#### Batch 2 (Second commit - 7 additional problems):
4. **Tutorial 1: Personal Blog Platform**
   - Beginner: scaling 100→1000 req/sec, load balancing basics

5. **Tutorial 2: Image Hosting Service**
   - Intermediate: CDN, caching, object storage, cost optimization

6. **Tutorial 3: Real-Time Chat System**
   - Advanced: WebSockets, Kafka, 100K concurrent users

7. **Static Content CDN**
   - CDN fundamentals, edge caching, 95% hit rate

### Total in App: 47 problems
- 40 original problems (Instagram, Twitter, Netflix, etc.)
- 7 extracted problems ✅
- **Remaining: 608 problems to add**

## Available Problem Categories

From `extracted-problems/system-design/INDEX.md`:

| Category | Problems | Lines | Priority |
|----------|----------|-------|----------|
| **caching** | 35 | 5,610 | HIGH (1 added) |
| **streaming** | 35 | 5,450 | HIGH (1 added) |
| **gateway** | 35 | 5,426 | HIGH |
| **storage** | 35 | 4,981 | HIGH (1 added) |
| **multiregion** | 35 | 4,780 | MEDIUM |
| **search** | 35 | 4,714 | MEDIUM |
| **platform-migration** | 19 | 2,516 | LOW |
| **tutorial** | 4 | 1,434 | DONE (3 added) |
| **next-gen-protocols** | 4 | 544 | LOW |
| **novel-databases** | 4 | 541 | LOW |
| **existential-infrastructure** | 4 | 539 | LOW |
| **ai-infrastructure** | 3 | 408 | LOW |
| **20 more categories** | 2-3 each | ~1,500 | LOW |

## Architecture Implementation

### Current Pattern (Working ✅)

Each problem requires:

1. **Problem Definition** (`/challenges/definitions/problemName.ts`)
```typescript
export const problemNameProblemDefinition: ProblemDefinition = {
  id: 'problem-id',
  title: 'Problem Title',
  description: '...',
  functionalRequirements: {
    mustHave: [...], // Component types needed
    mustConnect: [...], // Required connections
    dataModel: {...}, // Data entities and access patterns
  },
  scenarios: generateScenarios('problem-id', problemConfigs['problem-id']),
  validators: [...],
};
```

2. **Problem Config** (`/challenges/problemConfigs.ts`)
```typescript
'problem-id': {
  baseRps: 10000,
  readRatio: 0.9,
  maxLatency: 100,
  availability: 0.999,
  hasCdn: true,
  hasCache: true,
  hasObjectStorage: false,
},
```

3. **Export in Index** (`/challenges/definitions/index.ts`)
```typescript
export { problemNameProblemDefinition } from './problemName';
// Add to allProblemDefinitions array
```

4. **Tests** (`/__tests__/extractedProblems.test.ts`)
- Validates problem exists, has correct config, FR/NFRs

## Approaches to Add Remaining 608 Problems

### Option 1: Manual Batch Addition (Current Approach)
**Pros:**
- Full control over each problem
- Can customize and validate each one
- Learn patterns while building

**Cons:**
- Time-consuming (~10 minutes per problem = 100 hours)
- Repetitive work

**Recommended for:** Next 10-20 high-priority problems

### Option 2: Automated Parser Script
**Pros:**
- Fast (can add all 618 in ~1 hour of script execution)
- Consistent formatting
- Easy to update if markdown format changes

**Cons:**
- Requires initial script development (~2-4 hours)
- May need manual review/fixes

**Implementation:**
```typescript
// scripts/importExtractedProblems.ts
import * as fs from 'fs';
import * as path from 'path';

interface ParsedProblem {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  summary: string;
  goal: string;
  description: string;
  functionalRequirements: string[];
  nonFunctionalRequirements: {
    latency?: string;
    requestRate?: string;
    datasetSize?: string;
    availability?: string;
  };
  components: string[];
  hints: string[];
}

function parseMarkdownFile(filePath: string): ParsedProblem[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const problems: ParsedProblem[] = [];

  // Split by ## (problem sections)
  const sections = content.split(/^## /gm).filter(s => s.trim());

  sections.forEach(section => {
    const problem = extractProblemData(section);
    if (problem) problems.push(problem);
  });

  return problems;
}

function extractProblemData(section: string): ParsedProblem | null {
  // Extract ID, Title, Category, etc. using regex
  const idMatch = section.match(/\*\*ID:\*\* (.+)/);
  const titleMatch = section.match(/^(.+?)$/m);
  // ... more parsing

  return {
    id: idMatch?.[1] || '',
    title: titleMatch?.[1] || '',
    // ... rest of data
  };
}

function generateProblemDefinition(problem: ParsedProblem): string {
  return `
import { ProblemDefinition } from '../../types/problemDefinition';
// ... generate full definition file
  `;
}

// Main execution
const categories = ['caching', 'streaming', 'gateway', 'storage', /* ... */];
categories.forEach(category => {
  const problems = parseMarkdownFile(\`extracted-problems/system-design/\${category}.md\`);
  problems.forEach(problem => {
    const definition = generateProblemDefinition(problem);
    fs.writeFileSync(\`src/apps/system-design/builder/challenges/definitions/\${problem.id}.ts\`, definition);
  });
});
```

**Recommended for:** Adding remaining 500+ problems

### Option 3: Hybrid Approach (Recommended)
1. **Phase 1 (DONE):** Manually add 10 representative problems ✅
2. **Phase 2 (Next):** Manually add 20 more high-priority problems
   - 5 from caching (most requested)
   - 5 from streaming
   - 5 from gateway
   - 5 from storage
3. **Phase 3:** Build automated parser script
4. **Phase 4:** Run script to import remaining ~580 problems
5. **Phase 5:** Manual review and fix any parsing issues

## Next Steps

### Immediate (Add 20 more manually)
Priority problems to add next:

**Caching (5):**
- API Response Cache
- Session Store
- Full-Page Cache
- Cache Invalidation Patterns
- Distributed Cache

**Streaming (5):**
- Event Sourcing
- Change Data Capture (CDC)
- Real-time Analytics Pipeline
- Log Aggregation
- Notification System

**Gateway (5):**
- API Gateway with Rate Limiting
- GraphQL Gateway
- Service Mesh
- Reverse Proxy
- Load Balancer Strategies

**Storage (5):**
- Sharding Strategies
- Read-Write Splitting
- Data Replication
- Backup and Recovery
- Time-Series Database

### Medium-term (Build Parser)
1. Create `scripts/importExtractedProblems.ts`
2. Test on one category (tutorial - already done manually for validation)
3. Run on all categories
4. Generate problem definitions, configs, and tests
5. Manual review of generated code

### Long-term (Maintain)
1. Add new problems as they're created in extracted-problems/
2. Update existing problems when markdown changes
3. Enhance tests with more FR/NFR coverage

## Testing Strategy

For all 618 problems, we'll have:

### Integration Tests (Current)
- ✅ Problem definition exists
- ✅ Config exists with correct values
- ✅ Challenge generates successfully
- ✅ FR/NFR requirements present
- ✅ Data models defined
- ✅ Connection flows valid

### Simulation Tests (Future - Optional)
For select problems:
- Run actual simulations with good/bad designs
- Validate that FR/NFRs are enforced
- Check that hints help students progress

## Summary

**Current:** 47 total problems (40 original + 7 extracted)
**Goal:** 658 total problems (40 original + 618 extracted)
**Progress:** 1.1% of extracted problems added

**Recommended Path:**
1. ✅ Add 10 representative problems manually (DONE)
2. 🔄 Add 20 high-priority problems manually (NEXT)
3. 🔨 Build automated parser script
4. 🚀 Import remaining 580+ problems automatically
5. ✅ Review and test generated code

The architecture is ready to support all 618 problems - it's just a matter of generating the definition files!
