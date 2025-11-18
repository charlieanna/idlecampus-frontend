# Solution Fixing Tools

This directory contains tools for automatically fixing solutions across all system design challenges.

## Overview

We've created a universal solution-fixing system that:
1. **Migrates old format to new** - Removes deprecated fields, adds required fields
2. **Works across all challenges** - TinyURL, Instagram, Netflix, etc.
3. **Validates automatically** - Ensures solutions meet requirements
4. **Generates reports** - Shows what changed and why

## Files

```
docs/
├── CORE_SOLUTION_GUIDE.md              # Universal fixing guide (for all challenges)
├── SOLUTION_FIXING_README.md           # This file
└── challenges/
    └── tinyurl/
        └── SOLUTION_GUIDE.md           # TinyURL-specific patterns

src/apps/system-design/builder/scripts/
├── fixSolution.ts                      # Core fixing logic
└── fixAllSolutions.ts                  # CLI tool for batch fixing
```

## Quick Start

### Option 1: Use the TypeScript Script (Recommended)

```bash
# Preview changes (dry run)
npx ts-node src/apps/system-design/builder/scripts/fixAllSolutions.ts --dry-run

# Fix all challenges
npx ts-node src/apps/system-design/builder/scripts/fixAllSolutions.ts

# Fix specific challenge
npx ts-node src/apps/system-design/builder/scripts/fixAllSolutions.ts --challenge tinyurl

# Verbose output
npx ts-node src/apps/system-design/builder/scripts/fixAllSolutions.ts --verbose
```

### Option 2: Programmatic Usage

```typescript
import { fixSolution, ChallengeContext } from './scripts/fixSolution';

// Define context for your challenge
const context: ChallengeContext = {
  id: 'tinyurl',
  dataModel: {
    entities: ['url'],
    primaryKey: 'short_code'
  },
  traffic: {
    readHeavy: true,
    writeRps: 100,
    readRps: 1000
  }
};

// Fix a solution
const fixedSolution = fixSolution(oldSolution, context);

// Validate the fixed solution
import { validateFixedSolution } from './scripts/fixSolution';
const validation = validateFixedSolution(fixedSolution);

if (!validation.valid) {
  console.log('Errors:', validation.errors);
}
```

### Option 3: Manual Fixing

If you prefer to manually fix solutions, follow the guide in [CORE_SOLUTION_GUIDE.md](./CORE_SOLUTION_GUIDE.md).

## What Gets Fixed

### Database Components

**Before (Old Format)**:
```typescript
{
  type: 'postgresql',
  config: {
    readCapacity: 500,      // ❌ Removed
    writeCapacity: 100,     // ❌ Removed
    replication: true       // ❌ Converted to object
  }
}
```

**After (New Format)**:
```typescript
{
  type: 'postgresql',
  config: {
    instanceType: 'commodity-db',        // ✅ Added
    replicationMode: 'single-leader',    // ✅ Added
    replication: {                        // ✅ Converted from boolean
      enabled: true,
      replicas: 1,
      mode: 'async'
    },
    sharding: {                           // ✅ Added
      enabled: false,
      shards: 1,
      shardKey: 'short_code'             // ✅ Inferred from challenge
    }
  }
}
```

### App Server Components

**Before**:
```typescript
{
  type: 'app_server',
  config: {
    instances: 3
    // Missing lbStrategy
  }
}
```

**After**:
```typescript
{
  type: 'app_server',
  config: {
    instances: 3,
    lbStrategy: 'round-robin'  // ✅ Added default
  }
}
```

### CDN Components

**Before**:
```typescript
{
  type: 'cdn',
  config: {
    enabled: true,
    cacheHitRatio: 0.95,      // ❌ Removed (fixed at 0.95)
    bandwidthGbps: 100        // ❌ Removed (not configurable)
  }
}
```

**After**:
```typescript
{
  type: 'cdn',
  config: {
    enabled: true  // ✅ Only this needed
  }
}
```

### Cache Components

**Before**:
```typescript
{
  type: 'cache',
  config: {}  // Missing required fields
}
```

**After**:
```typescript
{
  type: 'cache',
  config: {
    memorySizeGB: 4,           // ✅ Added default
    hitRatio: 0.9,             // ✅ Added default
    strategy: 'cache_aside'    // ✅ Added default
  }
}
```

## Intelligent Defaults

The fixing script makes intelligent decisions based on challenge context:

### Shard Key Selection

The script automatically chooses appropriate shard keys:

| Challenge Type | Shard Key | Example |
|----------------|-----------|---------|
| URL Shorteners | `short_code` | TinyURL, Pastebin |
| Social Networks | `user_id` | Instagram, Facebook, Twitter |
| E-commerce | `user_id` or `order_id` | Amazon, Shopify |
| Video Platforms | `video_id` | YouTube, Netflix |
| Delivery Services | `order_id` | Uber, DoorDash |
| Chat Systems | `user_id` | Slack, Discord |

### Replication Mode Selection

Default: `single-leader` (simplest, most common)

The script doesn't auto-select replication mode (leaves existing or sets default), but here's when to use each:

- **Single-leader**: Read-heavy workloads (default)
- **Multi-leader**: Write-heavy, multi-region
- **Leaderless**: High availability critical

## Validation

After fixing, the script validates that:

1. ✅ No deprecated fields (`readCapacity`, `writeCapacity`)
2. ✅ All required fields present (`instanceType`, `replicationMode`, etc.)
3. ✅ Config types are correct (replication is object, not boolean)
4. ✅ Cache components have required fields

## Example Output

```bash
$ npx ts-node src/apps/system-design/builder/scripts/fixAllSolutions.ts --dry-run

🔧 Universal Solution Fixing Tool

🔍 DRY RUN MODE - No files will be modified

Processing 45 challenge(s)...

============================================================
Challenge: TinyURL - URL Shortener (tinyurl)
============================================================
✅ Fixed challenge-level solution
Changes made:
- Removed 'readCapacity: 500' from postgresql
- Removed 'writeCapacity: 100' from postgresql
- Added 'instanceType: commodity-db' to postgresql
- Converted 'replication: true' to object format in postgresql
- Added 'sharding' configuration to postgresql

Test Cases: 22 total
✅ Fixed 15 test case solutions

============================================================
Challenge: Instagram - Photo Sharing (instagram)
============================================================
✓ Challenge-level solution already correct

Test Cases: 18 total
✅ Fixed 3 test case solutions

...

============================================================
SUMMARY
============================================================
Total challenges processed: 45
✅ Successful: 45
❌ Failed: 0
🔄 Total changes: 156

⚠️  DRY RUN - No files were modified
Run without --dry-run to apply changes: ts-node fixAllSolutions.ts
```

## Workflow

### 1. Preview Changes
```bash
npx ts-node src/apps/system-design/builder/scripts/fixAllSolutions.ts --dry-run
```

### 2. Review Output
Check what will be changed, ensure it looks correct

### 3. Apply Changes
```bash
npx ts-node src/apps/system-design/builder/scripts/fixAllSolutions.ts
```

### 4. Run Tests
```bash
npm test
```

### 5. Commit
```bash
git add .
git commit -m "Fix: Migrate solutions to new commodity hardware model"
```

## Advanced Usage

### Fix Only Specific Challenges

```bash
# Fix only TinyURL
npx ts-node src/apps/system-design/builder/scripts/fixAllSolutions.ts --challenge tinyurl

# Fix only Instagram
npx ts-node src/apps/system-design/builder/scripts/fixAllSolutions.ts --challenge instagram
```

### Generate Detailed Reports

```bash
npx ts-node src/apps/system-design/builder/scripts/fixAllSolutions.ts --verbose
```

This will show detailed change reports for each solution.

### Programmatic Batch Fixing

```typescript
import { fixChallengeSolutions } from './scripts/fixSolution';
import { challenges } from './challenges';

// Fix all challenges
const fixedChallenges = challenges.map(challenge => {
  const context = {
    id: challenge.id,
    dataModel: challenge.dataModel,
  };
  return fixChallengeSolutions(challenge, context);
});

// Save to files or use directly
```

## Troubleshooting

### Error: "Challenge not found"

Make sure the challenge ID matches exactly:
```bash
npx ts-node src/apps/system-design/builder/scripts/fixAllSolutions.ts --challenge tinyurl
```

List available challenges:
```bash
# Will show available challenges in error message if not found
npx ts-node src/apps/system-design/builder/scripts/fixAllSolutions.ts --challenge invalid
```

### Error: "Validation errors"

The script found issues that couldn't be auto-fixed. Review the errors and fix manually:

```
❌ Database component has invalid 'replication' field (must be object)
```

Fix by ensuring replication is an object:
```typescript
replication: {
  enabled: true,
  replicas: 1,
  mode: 'async'
}
```

### Script doesn't detect changes

The solution might already be in the correct format. Run with `--verbose` to see details:
```bash
npx ts-node src/apps/system-design/builder/scripts/fixAllSolutions.ts --verbose
```

## Contributing

### Adding New Challenge Types

When adding a new challenge, update the shard key inference in `fixSolution.ts`:

```typescript
function inferShardKey(context?: ChallengeContext): string {
  // ... existing code ...

  if (id.includes('yournewchallenge')) {
    return 'your_shard_key';
  }

  // ... rest of code ...
}
```

### Extending Validation

Add new validation rules in `validateFixedSolution()`:

```typescript
export function validateFixedSolution(solution: Solution): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Add your custom validation here

  return { valid: errors.length === 0, errors };
}
```

## Reference

- [CORE_SOLUTION_GUIDE.md](./CORE_SOLUTION_GUIDE.md) - Universal fixing guide
- [challenges/tinyurl/SOLUTION_GUIDE.md](./challenges/tinyurl/SOLUTION_GUIDE.md) - TinyURL-specific guide
- [fixSolution.ts](../src/apps/system-design/builder/scripts/fixSolution.ts) - Core fixing logic
- [fixAllSolutions.ts](../src/apps/system-design/builder/scripts/fixAllSolutions.ts) - CLI tool

## FAQ

**Q: Will this modify my files?**
A: Not unless you run without `--dry-run`. Always preview first.

**Q: Can I undo changes?**
A: Yes, if using version control (git). Otherwise, run `--dry-run` first.

**Q: What if I have custom requirements?**
A: Use the programmatic API with custom context, or manually fix using the guide.

**Q: Does this work for new challenges?**
A: Yes! The script infers appropriate defaults based on challenge ID and data model.

**Q: How do I add challenge-specific logic?**
A: Update `inferShardKey()` and other helper functions in `fixSolution.ts`.
