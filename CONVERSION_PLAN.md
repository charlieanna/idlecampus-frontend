# ProblemDefinition → Challenge Conversion Plan

## Overview
Convert all 1000+ ProblemDefinitions to proper Challenges with solutions that users can solve.

## Current State
- **ProblemDefinitions**: ~1000+ (abstract, declarative format)
- **Challenges**: ~5 (concrete, executable format with solutions)
- **Conversion**: Automatic via `problemDefinitionConverter.ts`, but **no solutions are added**

## Goal
Every ProblemDefinition should become a Challenge with:
1. ✅ Test cases (already converted from scenarios)
2. ✅ Challenge-level solution (MISSING - needs to be added)
3. ✅ Solutions using new commodity hardware model
4. ✅ Solutions that pass all test cases

---

## Approach

### Option 1: Enhance Converter (Recommended)
Modify `problemDefinitionConverter.ts` to:
- Generate a basic solution during conversion
- Use `generateSolution()` function from `addSolutionsToChallenges.ts`
- Ensure solutions use commodity hardware model

**Pros**: 
- Solutions automatically available for all challenges
- No manual intervention needed
- Consistent solution format

**Cons**:
- Generated solutions may need refinement
- Need to test solutions against test cases

### Option 2: Post-Processing Script
Create a script that:
- Loads all converted challenges
- Generates solutions for challenges without solutions
- Outputs solutions to be manually added

**Pros**:
- Can review solutions before adding
- Can batch process and test

**Cons**:
- Requires manual step to add solutions
- More complex workflow

### Option 3: Solution Generation Service
Create a service that:
- Generates solutions on-demand when challenge is loaded
- Caches generated solutions
- Allows manual override

**Pros**:
- Flexible, can improve over time
- No need to store solutions in code

**Cons**:
- More complex implementation
- Solutions not version-controlled

---

## Recommended Implementation: Option 1 + Option 2 Hybrid

### Phase 1: Enhance Converter (Quick Win)
1. Add `generateSolution()` to `problemDefinitionConverter.ts`
2. Generate basic solution during conversion
3. Test with a few challenges (Twitter, Instagram, etc.)

### Phase 2: Solution Refinement Script
1. Create `refineSolutions.ts` script
2. Load all challenges
3. Test solutions against test cases
4. Identify failing solutions
5. Output refinement suggestions

### Phase 3: Manual Refinement (Priority Challenges)
1. Focus on high-priority challenges first:
   - Twitter, Instagram, Facebook, Netflix, YouTube
   - Amazon, Uber, Airbnb, Spotify
2. Manually refine solutions using `SOLUTION_AND_TEST_PLAN.md`
3. Ensure all tests pass

### Phase 4: Automated Testing
1. Create test suite that validates all solutions
2. Run on CI/CD
3. Flag challenges with failing solutions

---

## Solution Generation Logic

Based on `SOLUTION_AND_TEST_PLAN.md`:

### 1. Identify Required Components
- **Client**: Always present
- **Load Balancer**: If RPS > 1000 or multiple app servers
- **App Server**: Always present (calculate instances from max RPS)
- **Cache**: If `availableComponents` includes `redis`/`cache` or NFR mentions caching
- **Database**: If `availableComponents` includes `database`/`postgresql`
- **CDN**: If `availableComponents` includes `cdn` or NFR mentions static content
- **S3**: If `availableComponents` includes `s3` or NFR mentions object storage
- **Queue**: If `availableComponents` includes `message_queue` or NFR mentions async

### 2. Calculate Scaling
- **App Servers**: `instances = Math.ceil(maxRps * 1.2 / 1000)`
- **Database Replicas**: `replicas = Math.ceil(readRps * 1.2 / 1000)`
- **Database Shards**: `shards = Math.ceil(writeRps * 1.2 / 300)` (if multi-leader)
- **Replication Mode**: Use `multi-leader` if `writeRps > 100`, else `single-leader`

### 3. Use Commodity Hardware Model
- **App Server**: `instanceType: 'commodity-app'` (implicit, 1000 RPS, 64GB RAM, 2TB disk)
- **Database**: `instanceType: 'commodity-db'` (1000 read/100 write RPS base)
- **Load Balancing**: `lbStrategy: 'least-connections'` (better for variable load)
- **Caching**: `strategy: 'cache_aside'` (default)

### 4. Connections
- `client → load_balancer → app_server` (if load balancer present)
- `client → app_server` (if no load balancer)
- `app_server → redis` (if cache present)
- `app_server → postgresql` (if database present)
- `client → cdn → s3` (if CDN/S3 present)
- `app_server → s3` (if S3 present, for writes)
- `app_server → message_queue` (if queue present)

---

## Implementation Steps

### Step 1: Update Converter
```typescript
// In problemDefinitionConverter.ts
import { generateSolution } from '../scripts/addSolutionsToChallenges';

export function convertProblemDefinitionToChallenge(
  def: ProblemDefinition
): Challenge {
  // ... existing conversion logic ...
  
  const challenge: Challenge = {
    // ... existing fields ...
  };
  
  // Generate solution if not present
  if (!def.solution) {
    challenge.solution = generateSolution(challenge);
  } else {
    challenge.solution = def.solution;
  }
  
  return challenge;
}
```

### Step 2: Test Solution Generation
1. Run converter on a few challenges
2. Verify solutions are generated
3. Check solution format matches expected structure

### Step 3: Validate Solutions
1. Load challenge in UI
2. Click "Solution" button
3. Verify solution loads correctly
4. Submit solution and verify tests pass

### Step 4: Refine Priority Challenges
1. Identify challenges with failing tests
2. Use `SOLUTION_AND_TEST_PLAN.md` to fix
3. Update solutions manually

---

## Success Criteria

✅ All challenges have a challenge-level solution
✅ Solutions use commodity hardware model (no `readCapacity`/`writeCapacity`)
✅ Solutions pass all functional tests (FR-1, FR-2, etc.)
✅ Solutions pass most NFR tests (80%+ pass rate acceptable initially)
✅ Solution button works for all challenges
✅ Solutions are properly formatted and loadable

---

## Next Steps

1. **Immediate**: Implement `generateSolution()` in converter
2. **Short-term**: Test with 10-20 priority challenges
3. **Medium-term**: Refine solutions for all priority challenges
4. **Long-term**: Automated testing and continuous refinement

---

## Notes

- Solutions don't need to be perfect initially - they can be refined over time
- Focus on getting basic solutions working first
- Use `SOLUTION_AND_TEST_PLAN.md` as the reference for correct format
- Test solutions against actual test cases, not just format validation

