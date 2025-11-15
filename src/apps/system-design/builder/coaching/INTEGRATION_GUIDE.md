# Coach/Navigator System - Integration Guide

## Overview

The Coach/Navigator system provides contextual guidance, progressive hints, and celebration feedback to create a guided learning experience. This guide shows how to integrate it into your system design builder.

## What We Built

### 1. **Type System** (`types/coachConfig.ts`)
- Complete TypeScript interfaces for coach configuration
- Message triggers (on_load, after_test, bottleneck_detected, etc.)
- Coach actions (show_hint, next_level, highlight_component, etc.)
- Progress tracking types
- Learning track definitions

### 2. **Coach Configuration** (`coaching/tinyUrlCoach.ts`)
- 2-level configuration for TinyURL problem
- 15+ contextual messages
- Progressive hints (3 levels of specificity)
- Celebration messages
- Achievement definitions

### 3. **UI Components**
- **CoachPanel** (`ui/components/CoachPanel.tsx`)
  - Collapsible sidebar
  - Displays active messages based on triggers
  - Shows progressive hints
  - Progress indicators
  - Learning objectives

- **LevelSuccessModal** (`ui/components/LevelSuccessModal.tsx`)
  - Celebration with confetti animation
  - Performance stats
  - Achievement notifications
  - Next-step CTAs

### 4. **Progress Service** (`services/progressService.ts`)
- LocalStorage-based persistence
- Track completion across problems
- Achievement system
- Statistics and analytics
- Export/import capability

---

## Quick Start Integration

### Step 1: Import Coach Configuration

```typescript
import { tinyUrlCoachConfig, getTinyUrlLevelConfig } from './coaching/tinyUrlCoach';
import { CoachPanel } from './ui/components/CoachPanel';
import { LevelSuccessModal } from './ui/components/LevelSuccessModal';
import { progressService } from './services/progressService';
```

### Step 2: Add State to Your Component

```typescript
const [currentLevel, setCurrentLevel] = useState(1);
const [showSuccessModal, setShowSuccessModal] = useState(false);
const [attempts, setAttempts] = useState(0);
const [timeSpent, setTimeSpent] = useState(0);
const [startTime] = useState(Date.now());

// Get level config
const levelConfig = getTinyUrlLevelConfig(currentLevel);
```

### Step 3: Track Attempts and Time

```typescript
// On test run
const handleRunTests = async () => {
  setAttempts(prev => prev + 1);
  setTimeSpent(Math.floor((Date.now() - startTime) / 1000));

  progressService.recordAttempt('tiny_url', currentLevel);

  // Run your tests...
  const results = await runTests();

  // Check if level complete
  if (allTestsPassed(results)) {
    handleLevelComplete();
  }
};
```

### Step 4: Handle Level Completion

```typescript
const handleLevelComplete = () => {
  const timeForLevel = Math.floor((Date.now() - startTime) / 1000);

  // Save progress
  progressService.markLevelComplete(
    'tiny_url',
    currentLevel,
    calculateScore(testResults), // 0-100
    timeForLevel
  );

  // Show celebration
  setShowSuccessModal(true);
};
```

### Step 5: Add Components to Your UI

```tsx
return (
  <div className="flex h-screen">
    {/* Coach Panel - Left Sidebar */}
    {levelConfig && (
      <CoachPanel
        problemId="tiny_url"
        levelConfig={levelConfig}
        systemGraph={systemGraph}
        testResults={testResults}
        currentLevel={currentLevel}
        attempts={attempts}
        timeSpent={timeSpent}
        bottlenecks={detectedBottlenecks}
        failedValidators={failedValidators}
        onAction={handleCoachAction}
        onNextLevel={handleNextLevel}
      />
    )}

    {/* Your main canvas */}
    <div className="flex-1">
      {/* Your existing UI */}
    </div>

    {/* Success Modal */}
    <LevelSuccessModal
      isOpen={showSuccessModal}
      level={currentLevel}
      celebrationMessage={tinyUrlCoachConfig.celebrationMessages[currentLevel]}
      stats={{
        testsPassedLabel: 'Tests Passed',
        testsPassedValue: `${passedTests}/${totalTests}`,
        latencyLabel: 'P99 Latency',
        latencyValue: `${p99Latency}ms`,
        costLabel: 'Monthly Cost',
        costValue: `$${monthlyCost}`,
      }}
      hasNextLevel={currentLevel < 2}
      nextLevelTitle={currentLevel === 1 ? 'Scale to 1000 RPS' : undefined}
      nextProblemTitle="Todo App - CRUD & Consistency"
      onClose={() => setShowSuccessModal(false)}
      onNextLevel={handleNextLevel}
      onNextProblem={handleNextProblem}
    />
  </div>
);
```

### Step 6: Implement Coach Actions

```typescript
const handleCoachAction = (action: CoachAction) => {
  switch (action.type) {
    case 'show_hint':
      // Show hint dialog
      setShowHintDialog(true);
      progressService.useHint('tiny_url');
      break;

    case 'highlight_component':
      // Highlight component on canvas
      highlightComponent(action.componentId);
      break;

    case 'suggest_connection':
      // Show suggested connection
      showConnectionSuggestion(action.from, action.to);
      break;

    case 'next_level':
      handleNextLevel();
      break;

    case 'next_problem':
      navigateToProblem(action.problemId);
      break;
  }
};
```

---

## Advanced: Detecting Bottlenecks and Failed Validators

### Bottleneck Detection

```typescript
const detectBottlenecks = (simulationResults: SimulationResult): string[] => {
  const bottlenecks: string[] = [];

  simulationResults.componentMetrics.forEach((metrics, componentId) => {
    if (metrics.utilization > 0.9) {
      const component = systemGraph.components.find(c => c.id === componentId);
      if (component) {
        bottlenecks.push(component.type);
      }
    }
  });

  return bottlenecks;
};
```

### Validator Tracking

```typescript
const getFailedValidators = (validationResults: ValidationResult[]): string[] => {
  return validationResults
    .filter(result => !result.valid)
    .map(result => result.validatorName);
};
```

---

## Creating Your Own Coach Config

### Template for New Problems

```typescript
import { ProblemCoachConfig, LevelCoachConfig } from '../types/coachConfig';

const level1Config: LevelCoachConfig = {
  level: 1,
  title: 'Level 1: [Your Title]',
  goal: '[Short description of what to achieve]',
  estimatedTime: '10 minutes',
  learningObjectives: [
    'Objective 1',
    'Objective 2',
    'Objective 3',
  ],

  messages: [
    {
      trigger: { type: 'on_load' },
      message: 'Welcome message...',
      messageType: 'info',
      icon: '👋',
      priority: 100,
    },
    {
      trigger: { type: 'validator_failed', validatorName: 'YourValidator' },
      message: 'Hint when this validator fails...',
      messageType: 'hint',
      icon: '💡',
    },
    // Add more messages...
  ],

  unlockHints: [
    {
      condition: { minAttempts: 2 },
      hint: 'Subtle hint after 2 attempts...',
      hintLevel: 1,
    },
    {
      condition: { minAttempts: 4 },
      hint: 'More specific hint after 4 attempts...',
      hintLevel: 2,
    },
  ],
};

export const yourProblemCoachConfig: ProblemCoachConfig = {
  problemId: 'your_problem',
  archetype: 'crud', // or 'read_heavy', 'write_heavy', etc.
  levelConfigs: {
    1: level1Config,
    2: level2Config,
  },
  celebrationMessages: {
    1: 'Celebration for level 1...',
    2: 'Celebration for level 2...',
  },
  nextProblemRecommendation: 'next_problem_id',
};
```

---

## Message Trigger Types

| Trigger | When it fires | Use case |
|---------|--------------|----------|
| `on_load` | Component first loads | Initial instructions |
| `on_first_visit` | User's first time seeing this level | Welcome message |
| `after_test` | After a specific test runs | Test-specific guidance |
| `all_tests_passed` | All tests pass | Celebration trigger |
| `level_complete` | Level fully complete | Move to next level |
| `stuck` | Failed N times | Offer help |
| `bottleneck_detected` | Component overloaded | Suggest optimization |
| `validator_failed` | Specific validator fails | Targeted hint |
| `component_added` | User adds component | Confirmation/guidance |
| `cost_exceeded` | Design too expensive | Cost optimization hint |
| `latency_exceeded` | Latency too high | Performance hint |

---

## Progress Tracking API

```typescript
import { progressService } from './services/progressService';

// Start a problem
progressService.startProblem('tiny_url');

// Record attempt
progressService.recordAttempt('tiny_url', 1);

// Mark level complete
progressService.markLevelComplete('tiny_url', 1, 95, 300);

// Mark problem complete
progressService.markProblemComplete('tiny_url');

// Record hint usage
progressService.useHint('tiny_url');

// View solution
progressService.viewSolution('tiny_url', 'solution_id');

// Get statistics
const stats = progressService.getStats();
console.log(`Completed ${stats.problemsCompleted} problems`);
console.log(`Unlocked ${stats.achievementsUnlocked} achievements`);

// Export/import for backup
const backup = progressService.exportProgress();
progressService.importProgress(backup);
```

---

## Next Steps

### Phase 2: Additional Problems
1. Create coach configs for Todo App, Feed, etc.
2. Use pattern templates to speed up creation
3. Test cross-problem progression

### Phase 3: Learning Tracks
1. Define track structure (see `types/coachConfig.ts`)
2. Build track visualization UI
3. Implement track unlocking logic

### Phase 4: Enhanced Features
1. Add code hints (for Tier 1 problems)
2. Interactive tutorials
3. Replay feature (show how to solve)
4. Community solutions

---

## Example: Full Integration

See `examples/CoachIntegrationExample.tsx` for a complete working example.

---

## Troubleshooting

### Messages not appearing?
- Check that `CoachContext` is populated correctly
- Verify trigger conditions match your state
- Use React DevTools to inspect `activeMessages`

### Progress not saving?
- Check localStorage quota (5MB limit)
- Verify `progressService` is initialized
- Check browser console for errors

### Performance issues?
- Memoize `CoachContext` with `useMemo`
- Limit message re-renders with `React.memo`
- Debounce rapid state changes

---

## Support

For questions or issues, please refer to:
- Type definitions in `types/coachConfig.ts`
- Example configurations in `coaching/`
- Component documentation in source files

Happy coaching! 🎓
