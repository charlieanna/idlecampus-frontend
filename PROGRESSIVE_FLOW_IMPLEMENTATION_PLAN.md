# Progressive Flow Implementation Plan

## Executive Summary

This document provides a detailed, phase-by-phase implementation plan for adding a progressive flow UI to the existing system design course platform. The plan ensures backward compatibility by building the new progressive flow **alongside** the existing catalog-based UI, allowing both to coexist during development and migration.

---

## 1. Current System Analysis

### 1.1 Existing Data Structures

#### Challenges
- **Location**: [`src/apps/system-design/builder/challenges/tieredChallenges.ts`](src/apps/system-design/builder/challenges/tieredChallenges.ts:18)
- **Count**: 658 challenges (migrated from legacy system)
- **Structure**: Each challenge has:
  - `id`, `title`, `difficulty`, `description`
  - `requirements` (functional, traffic, latency, availability, budget)
  - `testCases[]` - Array of test scenarios (maps to L1-L5 levels)
  - `learningObjectives[]`
  - `pythonTemplate` and `requiredAPIs`
  - `solution` - Reference solution

#### Challenge Interface
- **Location**: [`src/apps/system-design/builder/types/testCase.ts`](src/apps/system-design/builder/types/testCase.ts:149-177)
- **TestCase Structure**: Each testCase represents a level (L1-L5):
  - `name`, `type`, `requirement`
  - `traffic` (RPS, read/write ratio)
  - `duration`, `failureInjection`
  - `passCriteria` (latency, error rate, cost, availability)
  - `solution` (optional)

#### Lessons
- **Location**: [`src/apps/system-design/builder/data/lessons/index.ts`](src/apps/system-design/builder/data/lessons/index.ts:66-119)
- **Count**: 37+ lessons organized by:
  - Fundamentals (3 lessons)
  - Components (2 lessons)
  - Patterns (13 lessons)
  - DDIA Lessons (11 chapters)
  - System Design Primer (10 lessons)
  - NFR Thinking (2 lessons)

#### Modules
- **Location**: [`src/apps/system-design/builder/data/lessons/modules.ts`](src/apps/system-design/builder/data/lessons/modules.ts:24-136)
- **Structure**: 6 progressive modules:
  1. Fundamentals (3 lessons, 120 min)
  2. Core Components (2 lessons, 60 min)
  3. Design Patterns (13 lessons, 615 min)
  4. DDIA Deep Dive (11 lessons, 550 min)
  5. System Design Primer (10 lessons, 300 min)
  6. NFR Advanced (2 lessons, 60 min)

#### Progress Service
- **Location**: [`src/apps/system-design/builder/services/progressService.ts`](src/apps/system-design/builder/services/progressService.ts:23-500)
- **Storage**: localStorage-based
- **Features**: 
  - Problem progress tracking
  - Track progress tracking
  - Achievements system
  - XP and level tracking
  - Streak calculation

### 1.2 Current Routing Structure

**Location**: [`src/apps/system-design/SystemDesignApp.tsx`](src/apps/system-design/SystemDesignApp.tsx:14-31)

```typescript
Routes:
  /system-design/                     → ProblemCatalog (existing)
  /system-design/lessons              → LessonsPage (existing)
  /system-design/lessons/:lessonId    → LessonViewer (existing)
  /system-design/:challengeId         → TieredSystemDesignBuilder (existing)
```

### 1.3 Existing UI Components

**Location**: [`src/apps/system-design/builder/ui/components/`](src/apps/system-design/builder/ui/components/)

Key components to reuse:
- `ProblemCatalog.tsx` - Challenge listing
- `TieredChallengeSelector.tsx` - Challenge selection
- `LessonHub.tsx` - Lesson navigation
- `SystemDesignLessonViewer.tsx` - Lesson content
- Design canvas components (reusable for challenge solving)

---

## 2. Data Structure Mapping

### 2.1 Challenge → Progressive Flow Mapping

```typescript
// Existing Challenge structure
interface Challenge {
  id: string;
  testCases: TestCase[]; // 5-10 test cases per challenge
}

// Maps to Progressive Flow
interface ProgressiveChallenge {
  challengeId: string; // Same as Challenge.id
  levels: Level[5];    // Fixed 5 levels
}

// Mapping strategy:
testCases[0-1]  → L1 (Connectivity)      - Basic functionality tests
testCases[2-3]  → L2 (Capacity)          - Load/capacity tests
testCases[4-5]  → L3 (Optimization)      - Performance tests
testCases[6-7]  → L4 (Resilience)        - Failure/recovery tests
testCases[8-9]  → L5 (Excellence)        - Advanced NFR tests
```

### 2.2 Track Structure

```typescript
// Map existing challenge categories to 3 tracks
const TRACK_MAPPING = {
  fundamentals: [
    'tiny-url', 'web-crawler', 'rate-limiter', 'cdn-basic',
    // ... 15 total challenges
  ],
  concepts: [
    'instagram-feed', 'twitter-timeline', 'messaging-queue',
    // ... 24 total challenges
  ],
  systems: [
    'uber-ride-sharing', 'airbnb-marketplace', 'netflix-streaming',
    // ... 22 total challenges
  ]
};
```

### 2.3 Progress Data Structure

```typescript
// Extends existing progressService
interface ProgressiveUserProgress {
  // Existing fields (keep for backward compatibility)
  problemProgress: Record<string, ProblemProgress>;
  trackProgress: Record<string, TrackProgress>;
  
  // New progressive flow fields
  progressiveFlow: {
    assessmentCompleted: boolean;
    skillLevel: 'beginner' | 'intermediate' | 'advanced';
    recommendedTrack: string;
    
    // Challenge progress with 5 levels
    challengeProgress: Record<string, {
      challengeId: string;
      status: 'locked' | 'unlocked' | 'in_progress' | 'completed';
      levelsCompleted: number[]; // [1,2,3,4,5]
      currentLevel: number;
      bestScores: number[]; // Score for each level
      xpEarned: number;
      unlockDate: Date;
      completionDate?: Date;
    }>;
    
    // Gamification
    totalXP: number;
    currentLevel: number;
    currentStreak: number;
    achievements: Achievement[];
    skillPoints: {
      available: number;
      allocated: Record<string, number>;
    };
  };
}
```

---

## 3. New Component Architecture

### 3.1 Progressive Flow Components (Parallel to Existing)

```
src/apps/system-design/progressive/
├── pages/
│   ├── AssessmentPage.tsx              # Initial skill assessment
│   ├── ProgressiveDashboard.tsx        # Main dashboard (wireframe #3)
│   ├── TrackView.tsx                   # Track-specific view
│   ├── ChallengeProgressionPage.tsx    # 5-level view (wireframe #5)
│   ├── ChallengeLevelDetail.tsx        # Level detail before starting
│   ├── ProfilePage.tsx                 # User profile (wireframe #9)
│   ├── LeaderboardPage.tsx             # Leaderboard (wireframe #10)
│   └── SkillTreePage.tsx               # Skill tree (wireframe #6)
│
├── components/
│   ├── assessment/
│   │   ├── AssessmentQuestion.tsx      # MCQ component
│   │   ├── AssessmentResults.tsx       # Results display (wireframe #2)
│   │   └── TrackRecommendation.tsx     # Track suggestion
│   │
│   ├── dashboard/
│   │   ├── UserHeader.tsx              # Level, XP, streak
│   │   ├── ProgressOverview.tsx        # Total progress stats
│   │   ├── TrackCard.tsx               # Individual track card
│   │   ├── ChallengeCard.tsx           # Challenge tile with 5-level indicator
│   │   ├── RecommendedNext.tsx         # Suggested challenges
│   │   └── PrerequisiteHint.tsx        # Unlock requirement messages
│   │
│   ├── progression/
│   │   ├── FiveLevelPath.tsx           # Visual 5-level progression
│   │   ├── LevelCard.tsx               # Individual level details
│   │   ├── LevelSuccessModal.tsx       # Level completion celebration
│   │   ├── UnlockNotification.tsx      # Challenge unlock animation
│   │   └── RequirementsPanel.tsx       # Level requirements display
│   │
│   ├── gamification/
│   │   ├── XPDisplay.tsx               # XP counter with animation
│   │   ├── LevelProgressBar.tsx        # User level progress
│   │   ├── StreakIndicator.tsx         # Streak counter with fire emoji
│   │   ├── AchievementCard.tsx         # Achievement display
│   │   ├── SkillTree.tsx               # Skill tree visualization
│   │   ├── SkillNode.tsx               # Individual skill node
│   │   └── DailyChallenge.tsx          # Daily challenge card
│   │
│   └── leaderboard/
│       ├── LeaderboardTable.tsx        # Rank listing
│       ├── TopThreePodium.tsx          # Top 3 visual
│       ├── UserStatsCard.tsx           # Personal stats
│       └── RisingStars.tsx             # Biggest movers
│
├── services/
│   ├── progressiveProgressService.ts   # Extended progress tracking
│   ├── prerequisiteService.ts          # Unlock logic
│   ├── gamificationService.ts          # XP, achievements, skills
│   ├── leaderboardService.ts           # Rankings
│   └── assessmentService.ts            # Skill assessment
│
├── hooks/
│   ├── useProgressiveProgress.ts       # Progress state management
│   ├── useUnlockStatus.ts              # Prerequisite checking
│   ├── useGamification.ts              # XP, levels, achievements
│   └── useLeaderboard.ts               # Leaderboard data
│
├── types/
│   ├── progressiveFlow.ts              # Progressive flow types
│   ├── gamification.ts                 # XP, achievements, skills
│   └── assessment.ts                   # Assessment types
│
└── utils/
    ├── challengeMapper.ts              # Map testCases to 5 levels
    ├── xpCalculator.ts                 # XP formulas
    └── prerequisiteChecker.ts          # Unlock validation
```

### 3.2 Reusing Existing Components

**No modifications needed** - reference via imports:
- Challenge builder canvas: [`TieredSystemDesignBuilder`](src/apps/system-design/builder/ui/TieredSystemDesignBuilderRefactored.tsx)
- Lesson viewer: [`SystemDesignLessonViewer`](src/apps/system-design/builder/ui/components/SystemDesignLessonViewer.tsx)
- Test runner: [`testRunner.ts`](src/apps/system-design/builder/services/testRunner.ts)
- Python executor: [`pythonExecutor.ts`](src/apps/system-design/builder/services/pythonExecutor.ts)

---

## 4. Routing Strategy (Backward Compatible)

### 4.1 New Routes (Parallel, Not Replacing)

```typescript
// Updated SystemDesignApp.tsx
<Routes>
  {/* EXISTING ROUTES - KEEP AS IS */}
  <Route path="/" element={<ProblemCatalog />} />
  <Route path="/lessons" element={<LessonsPage />} />
  <Route path="/lessons/:lessonId" element={<LessonViewer />} />
  <Route path="/:challengeId" element={<ChallengeRoute />} />
  
  {/* NEW PROGRESSIVE FLOW ROUTES */}
  <Route path="/progressive" element={<ProgressiveFlowRoot />}>
    <Route index element={<Navigate to="assessment" />} />
    <Route path="assessment" element={<AssessmentPage />} />
    <Route path="dashboard" element={<ProgressiveDashboard />} />
    <Route path="track/:trackId" element={<TrackView />} />
    <Route path="challenge/:challengeId" element={<ChallengeProgressionPage />} />
    <Route path="challenge/:challengeId/level/:levelNumber" element={<ChallengeLevelDetail />} />
    <Route path="challenge/:challengeId/solve/:levelNumber" element={<TieredSystemDesignBuilder />} />
    <Route path="profile" element={<ProfilePage />} />
    <Route path="leaderboard" element={<LeaderboardPage />} />
    <Route path="skills" element={<SkillTreePage />} />
  </Route>
</Routes>
```

### 4.2 Entry Point Toggle

```typescript
// Add toggle in main navigation
const hasProgressiveFlowAccess = user?.preferences?.useProgressiveFlow ?? false;

if (hasProgressiveFlowAccess) {
  navigate('/system-design/progressive/dashboard');
} else {
  navigate('/system-design/'); // Original catalog
}
```

---

## 5. Database Schema for Progress Tracking

### 5.1 Initial: localStorage Extension

**Extends existing progressService storage**:

```typescript
// localStorage key: 'system_design_progressive_progress'
interface LocalStorageProgressiveData {
  version: '2.0'; // Increment from existing '1.0'
  userId: string;
  
  // Existing data (keep for backward compatibility)
  legacyProgress: UserProgress;
  
  // New progressive data
  progressive: {
    assessmentCompleted: boolean;
    assessmentResults: AssessmentResults;
    
    challengeProgress: Record<string, ChallengeProgress>;
    trackProgress: Record<string, TrackProgress>;
    
    gamification: {
      totalXP: number;
      level: number;
      rank: string;
      streak: StreakData;
      achievements: Achievement[];
      skills: UserSkills;
    };
    
    metadata: {
      createdAt: Date;
      lastActive: Date;
      totalTimeSpent: number;
    };
  };
}
```

### 5.2 Phase 2: Backend Migration

**Use provided schema**: See [`PROGRESSIVE_FLOW_DATABASE_SCHEMA.md`](PROGRESSIVE_FLOW_DATABASE_SCHEMA.md) for complete PostgreSQL schema.

Key tables:
- `users`, `user_stats` - Core user data
- `challenges`, `challenge_levels` - Challenge definitions
- `user_challenge_progress`, `level_attempts` - Progress tracking
- `achievements`, `user_achievements` - Gamification
- `leaderboard_entries` - Rankings

---

## 6. Phase-by-Phase Implementation Plan

### **Phase 1: Foundation (Week 1-2)**

#### Goals
- Set up progressive flow structure
- Create basic routing
- Implement data mappers
- Build assessment flow

#### Tasks
1. **Create directory structure**
   ```bash
   mkdir -p src/apps/system-design/progressive/{pages,components,services,hooks,types,utils}
   ```

2. **Implement data mappers** (`utils/challengeMapper.ts`)
   ```typescript
   function mapChallengeToProgressive(challenge: Challenge): ProgressiveChallenge {
     return {
       challengeId: challenge.id,
       title: challenge.title,
       track: inferTrackFromId(challenge.id),
       difficulty: challenge.difficulty,
       levels: mapTestCasesToLevels(challenge.testCases)
     };
   }
   
   function mapTestCasesToLevels(testCases: TestCase[]): Level[] {
     const levelNames = ['Connectivity', 'Capacity', 'Optimization', 'Resilience', 'Excellence'];
     return levelNames.map((name, idx) => ({
       number: idx + 1,
       name,
       testCases: testCases.slice(idx * 2, idx * 2 + 2),
       xpReward: 100 * (idx + 1) * 1.5
     }));
   }
   ```

3. **Create progressive progress service** (`services/progressiveProgressService.ts`)
   - Extend existing [`progressService`](src/apps/system-design/builder/services/progressService.ts)
   - Add progressive-specific methods
   - Maintain backward compatibility

4. **Build assessment pages**
   - `AssessmentPage.tsx` - 10 MCQs (wireframe #1)
   - `AssessmentResults.tsx` - Results & recommendations (wireframe #2)
   - Use [`PROGRESSIVE_FLOW_WIREFRAMES.md`](PROGRESSIVE_FLOW_WIREFRAMES.md) as design reference

5. **Update routing** in [`SystemDesignApp.tsx`](src/apps/system-design/SystemDesignApp.tsx)

**Deliverables**:
- [ ] Directory structure created
- [ ] Challenge mapper implemented
- [ ] Progressive progress service created
- [ ] Assessment flow functional
- [ ] Routes configured

---

### **Phase 2: Dashboard & Visualization (Week 3-4)**

#### Goals
- Build main dashboard
- Implement track cards
- Create 5-level progression UI
- Add basic progress tracking

#### Tasks
1. **Create dashboard components**
   - `ProgressiveDashboard.tsx` (wireframe #3)
   - `UserHeader.tsx` - Level, XP, streak display
   - `ProgressOverview.tsx` - Overall stats
   - `TrackCard.tsx` - Fundamentals/Concepts/Systems cards

2. **Build progression components**
   - `FiveLevelPath.tsx` - Visual 5-level indicator (wireframe #5)
   - `LevelCard.tsx` - Individual level detail
   - `ChallengeCard.tsx` - Challenge tile with level bubbles

3. **Implement prerequisite logic** (`services/prerequisiteService.ts`)
   ```typescript
   function checkChallengeUnlock(
     challengeId: string,
     userProgress: ProgressiveUserProgress
   ): UnlockStatus {
     const challenge = getChallenge(challengeId);
     const prerequisites = challenge.prerequisites || [];
     
     const allMet = prerequisites.every(prereqId => 
       userProgress.challengeProgress[prereqId]?.status === 'completed'
     );
     
     return {
       unlocked: allMet,
       missingPrereqs: prerequisites.filter(id => 
         userProgress.challengeProgress[id]?.status !== 'completed'
       )
     };
   }
   ```

4. **Create hooks**
   - `useProgressiveProgress.ts` - State management
   - `useUnlockStatus.ts` - Prerequisite checking

**Deliverables**:
- [ ] Dashboard page functional
- [ ] Track cards displaying correctly
- [ ] 5-level progression visualized
- [ ] Prerequisite system working
- [ ] Challenge unlocking operational

---

### **Phase 3: Gamification (Week 5-6)**

#### Goals
- Implement XP system
- Add achievements
- Build skill tree
- Create leaderboard

#### Tasks
1. **Implement gamification service** (`services/gamificationService.ts`)
   - Use formulas from [`GAMIFICATION_FORMULAS.md`](GAMIFICATION_FORMULAS.md)
   - XP calculation, level progression
   - Achievement triggers
   - Skill point allocation

2. **Build gamification components**
   - `XPDisplay.tsx` - Animated XP counter
   - `LevelProgressBar.tsx` - User level bar
   - `StreakIndicator.tsx` - Fire emoji streak
   - `AchievementCard.tsx` - Achievement display
   - `SkillTree.tsx` - Skill tree visualization (wireframe #6)

3. **Create leaderboard** (wireframe #10)
   - `LeaderboardPage.tsx`
   - `LeaderboardTable.tsx`
   - `TopThreePodium.tsx`
   - `services/leaderboardService.ts`

4. **Add animations**
   - XP gain particles
   - Level up celebration
   - Achievement unlock modal
   - Streak fire animation

**Deliverables**:
- [ ] XP system functional
- [ ] Achievements unlocking
- [ ] Skill tree interactive
- [ ] Leaderboard displaying
- [ ] Animations polished

---

### **Phase 4: Challenge Integration (Week 7-8)**

#### Goals
- Connect progressive UI to existing builder
- Implement level submission flow
- Add success/failure modals
- Track attempts and scores

#### Tasks
1. **Create challenge flow pages**
   - `ChallengeProgressionPage.tsx` - 5-level overview (wireframe #5)
   - `ChallengeLevelDetail.tsx` - Level requirements before start (wireframe #8)
   - Wire to existing [`TieredSystemDesignBuilder`](src/apps/system-design/builder/ui/TieredSystemDesignBuilderRefactored.tsx)

2. **Build submission flow**
   ```typescript
   async function submitLevel(
     challengeId: string,
     level: number,
     design: SystemGraph
   ): Promise<LevelResult> {
     // Use existing test runner
     const results = await testRunner.runTests(design, challenge.levels[level].testCases);
     
     // Calculate score and XP
     const score = calculateScore(results);
     const xp = gamificationService.calculateXP(level, score, timeSpent);
     
     // Update progress
     await progressService.recordLevelAttempt(challengeId, level, score, xp);
     
     // Check unlocks
     if (score >= 60) {
       await checkAndUnlockNext(challengeId, level);
     }
     
     return { score, xp, passed: score >= 60, results };
   }
   ```

3. **Add modal components**
   - `LevelSuccessModal.tsx` - Level complete celebration
   - `UnlockNotification.tsx` - Challenge unlock animation
   - `HintModal.tsx` - Hint display with XP penalty

4. **Implement retry logic**
   - Track attempts per level
   - Show previous best score
   - Apply retry penalties per formulas

**Deliverables**:
- [ ] Challenge flow connected to builder
- [ ] Level submission working
- [ ] Success/failure feedback
- [ ] Retry logic operational
- [ ] Unlocks triggering correctly

---

### **Phase 5: Profile & Analytics (Week 9)**

#### Goals
- Build user profile page
- Add progress analytics
- Implement activity tracking
- Create recommendation engine

#### Tasks
1. **Create profile page** (wireframe #9)
   - `ProfilePage.tsx`
   - Track progress breakdown
   - Achievement showcase
   - Activity graph
   - Performance insights

2. **Add analytics**
   - Strengths/weaknesses analysis
   - Time-based metrics
   - Completion rates
   - Average scores per category

3. **Implement recommendations**
   ```typescript
   function getRecommendedChallenges(
     userProgress: ProgressiveUserProgress
   ): Challenge[] {
     // Analyze performance
     const weakAreas = identifyWeakAreas(userProgress);
     
     // Find unlocked challenges in weak areas
     const candidates = allChallenges.filter(c => 
       isUnlocked(c, userProgress) &&
       weakAreas.includes(c.category)
     );
     
     // Sort by optimal difficulty
     return candidates.sort(byOptimalDifficulty);
   }
   ```

**Deliverables**:
- [ ] Profile page complete
- [ ] Analytics displaying
- [ ] Recommendations working
- [ ] Activity tracking operational

---

### **Phase 6: Backend Migration (Week 10-11)**

#### Goals
- Migrate from localStorage to backend
- Implement API layer
- Add real-time features
- Enable multi-device sync

#### Tasks
1. **Implement backend APIs**
   - Use schema from [`PROGRESSIVE_FLOW_DATABASE_SCHEMA.md`](PROGRESSIVE_FLOW_DATABASE_SCHEMA.md)
   - Create endpoints:
     - `GET/POST /api/progress/challenges`
     - `GET/POST /api/progress/levels`
     - `GET /api/leaderboard`
     - `GET/POST /api/achievements`
     - `GET/POST /api/skills`

2. **Create API service layer** (`services/api/progressiveApi.ts`)
   ```typescript
   class ProgressiveAPI {
     async getUserProgress(userId: string): Promise<ProgressiveUserProgress> {
       return await fetch(`/api/users/${userId}/progress`).then(r => r.json());
     }
     
     async submitLevelAttempt(
       userId: string,
       challengeId: string,
       level: number,
       result: LevelResult
     ): Promise<void> {
       await fetch('/api/progress/level-attempt', {
         method: 'POST',
         body: JSON.stringify({ userId, challengeId, level, result })
       });
     }
     
     // ... other methods
   }
   ```

3. **Migrate data**
   - Create migration script
   - Copy localStorage → database
   - Validate data integrity
   - Add rollback capability

4. **Add real-time features**
   - WebSocket for leaderboard updates
   - Live achievement notifications
   - Streak reminders

**Deliverables**:
- [ ] Backend APIs operational
- [ ] Data migrated to database
- [ ] Real-time features working
- [ ] Multi-device sync enabled

---

### **Phase 7: Polish & Testing (Week 12)**

#### Goals
- Responsive design
- Performance optimization
- Accessibility
- User testing

#### Tasks
1. **Responsive implementation**
   - Use mobile wireframes from [`PROGRESSIVE_FLOW_WIREFRAMES.md`](PROGRESSIVE_FLOW_WIREFRAMES.md)
   - Mobile: 320-767px (single column)
   - Tablet: 768-1023px (2 columns)
   - Desktop: 1024px+ (3 columns)

2. **Performance optimization**
   - Virtual scrolling for long lists
   - Lazy load images
   - Debounce search (300ms)
   - Memoize calculations
   - Code splitting by route

3. **Accessibility**
   - ARIA labels
   - Keyboard navigation
   - Screen reader support
   - Color contrast 4.5:1
   - Focus indicators

4. **Testing**
   - Unit tests for services
   - Integration tests for flows
   - E2E tests for critical paths
   - User acceptance testing

**Deliverables**:
- [ ] Mobile responsive
- [ ] Performance optimized
- [ ] Accessibility compliant
- [ ] Tests passing
- [ ] User feedback incorporated

---

## 7. Migration Path (Optional Toggle)

### 7.1 Feature Flag System

```typescript
// Add to user preferences
interface UserPreferences {
  useProgressiveFlow: boolean; // Default: false
  // ... existing preferences
}

// In navigation
function SystemDesignNavigation() {
  const user = useUser();
  const useProgressive = user?.preferences?.useProgressiveFlow ?? false;
  
  return (
    <div>
      <Link to={useProgressive ? '/system-design/progressive/dashboard' : '/system-design/'}>
        System Design
      </Link>
      
      {/* Settings to toggle */}
      <Toggle 
        checked={useProgressive}
        onChange={enableProgressiveFlow}
        label="Use Progressive Flow (Beta)"
      />
    </div>
  );
}
```

### 7.2 Gradual Rollout

1. **Week 1-8**: Internal testing only
2. **Week 9-10**: Beta users (opt-in)
3. **Week 11**: Open beta (default off, can enable)
4. **Week 12+**: Default on for new users, optional for existing

### 7.3 Data Sync Strategy

```typescript
// Sync old progress to new format
function migrateUserProgress(
  oldProgress: UserProgress
): ProgressiveUserProgress {
  return {
    // Keep legacy for rollback
    problemProgress: oldProgress.problemProgress,
    trackProgress: oldProgress.trackProgress,
    
    // Map to progressive format
    progressiveFlow: {
      assessmentCompleted: false, // Require new assessment
      challengeProgress: mapProblemsToProgressive(oldProgress.problemProgress),
      gamification: {
        totalXP: oldProgress.totalXP || 0,
        level: calculateLevel(oldProgress.totalXP || 0),
        // ... initialize gamification
      }
    }
  };
}
```

---

## 8. Reusing Existing Resources

### 8.1 Challenge Data (61 Challenges)

**Source**: [`tieredChallenges`](src/apps/system-design/builder/challenges/tieredChallenges.ts:18) array

**Usage**:
```typescript
import { tieredChallenges } from '../builder/challenges/tieredChallenges';

// Filter and organize into tracks
const fundamentalsChallenges = tieredChallenges
  .filter(c => FUNDAMENTALS_IDS.includes(c.id))
  .map(mapChallengeToProgressive);
```

### 8.2 Test Cases → L1-L5 Mapping

**Each challenge has 5-10 testCases** → Group into 5 levels:

```typescript
function groupTestCasesIntoLevels(testCases: TestCase[]): Level[] {
  const levels = [
    { number: 1, name: 'Connectivity', xp: 150 },
    { number: 2, name: 'Capacity', xp: 160 },
    { number: 3, name: 'Optimization', xp: 170 },
    { number: 4, name: 'Resilience', xp: 160 },
    { number: 5, name: 'Excellence', xp: 200 }
  ];
  
  return levels.map((level, idx) => ({
    ...level,
    testCases: selectTestCasesForLevel(testCases, idx, level.name)
  }));
}

function selectTestCasesForLevel(
  allTests: TestCase[], 
  levelIdx: number,
  levelName: string
): TestCase[] {
  // L1: Basic functional tests
  if (levelIdx === 0) {
    return allTests.filter(t => t.type === 'functional').slice(0, 2);
  }
  // L2: Capacity tests
  if (levelIdx === 1) {
    return allTests.filter(t => t.type === 'scalability').slice(0, 2);
  }
  // L3: Performance tests
  if (levelIdx === 2) {
    return allTests.filter(t => t.type === 'performance').slice(0, 2);
  }
  // L4: Reliability tests  
  if (levelIdx === 3) {
    return allTests.filter(t => t.type === 'reliability').slice(0, 2);
  }
  // L5: Cost + advanced tests
  return allTests.filter(t => t.type === 'cost' || !isUsed(t)).slice(0, 2);
}
```

### 8.3 Lessons from DDIA

**Source**: [`allLessons`](src/apps/system-design/builder/data/lessons/index.ts:66) array

**Integration**:
```typescript
// Link lessons to challenges
const challengeWithLessons = {
  ...challenge,
  recommendedLessons: getRelatedLessons(challenge),
  prerequisites: {
    challenges: [...],
    lessons: ['ddia-chapter5-replication'] // Complete lesson before unlock
  }
};

function getRelatedLessons(challenge: Challenge): Lesson[] {
  return allLessons.filter(lesson =>
    lesson.relatedChallenges?.includes(challenge.id)
  );
}
```

### 8.4 Simulation Engine

**Reuse existing test runner**: [`testRunner.ts`](src/apps/system-design/builder/services/testRunner.ts)

**No changes needed** - progressive flow calls same test runner:

```typescript
// In progressive flow
const results = await testRunner.runTests(
  userDesign,
  level.testCases,
  challenge.availableComponents
);
```

---

## 9. Key Design Decisions

### 9.1 Why Parallel Routes?

✅ **Advantages**:
- Zero risk to existing users
- Gradual rollout capability
- Easy rollback if issues
- A/B testing possible
- Both UIs can coexist

❌ **Alternative** (breaking change):
- Replace catalog with progressive flow
- Force all users to migrate
- Higher risk, no rollback

### 9.2 Why localStorage First?

✅ **Advantages**:
- Faster initial development
- No backend dependency
- Works offline
- Easy to prototype

📅 **Backend Later**:
- Once UI is validated
- Multi-device sync needed
- Real-time features required

### 9.3 Why 5 Levels Per Challenge?

✅ **Based on wireframes**:
- Maps to L1-L5 progression
- Clear difficulty curve
- Balanced XP distribution
- Standard game design pattern

### 9.4 Why 3 Tracks?

✅ **Based on wireframes**:
- Fundamentals → Concepts → Systems
- Natural skill progression
- Manageable scope (15 + 24 + 22 challenges)
- Clear prerequisite flow

---

## 10. Success Metrics

### 10.1 Technical Metrics

- [ ] All 61 challenges mapped to progressive flow
- [ ] 5 levels per challenge functional
- [ ] Prerequisite system working (100% accuracy)
- [ ] XP calculation correct (per formulas)
- [ ] Achievement triggers operational
- [ ] Leaderboard updates in real-time
- [ ] Page load time < 2s
- [ ] Mobile responsive (320px+)

### 10.2 User Metrics

- [ ] Assessment completion rate > 80%
- [ ] Progressive flow opt-in rate > 50%
- [ ] Average session time increase > 20%
- [ ] Challenge completion rate > 60%
- [ ] User retention (7-day) > 70%
- [ ] NPS score > 50

### 10.3 Quality Metrics

- [ ] Test coverage > 80%
- [ ] Accessibility score > 90 (Lighthouse)
- [ ] Performance score > 90 (Lighthouse)
- [ ] Zero critical bugs in production
- [ ] Feature flag rollback successful

---

## 11. Risk Mitigation

### 11.1 Technical Risks

| Risk | Mitigation |
|------|-----------|
| Breaking existing catalog | Parallel routes, no modifications to existing code |
| Data loss during migration | Keep localStorage as backup, staged rollout |
| Performance issues with 61 challenges | Virtual scrolling, lazy loading, pagination |
| Browser compatibility | Polyfills, progressive enhancement |
| XP calculation exploits | Server-side validation, rate limiting |

### 11.2 UX Risks

| Risk | Mitigation |
|------|-----------|
| Users confused by two UIs | Clear toggle, onboarding flow |
| Assessment too hard/easy | A/B test difficulty, allow skip |
| Prerequisites too restrictive | Allow "skip prerequisites" power-up |
| Gamification feels grindy | Balance XP curves, celebrate milestones |

---

## 12. Open Questions

### 12.1 Product Decisions

- [ ] **Assessment**: Required or optional? (Recommend: optional with "skip to fundamentals" option)
- [ ] **Challenges per track**: Fixed 15+24+22 or dynamic? (Recommend: fixed for v1)
- [ ] **Level retries**: Unlimited or capped? (Recommend: unlimited with XP penalty)
- [ ] **Hints**: Free or XP cost? (Recommend: -10% XP per hint)
- [ ] **Daily challenge**: Required or bonus? (Recommend: bonus with 2x XP)

### 12.2 Technical Decisions

- [ ] **Backend**: Node.js/Express or Python/FastAPI? (Recommend: Node.js for consistency)
- [ ] **Database**: PostgreSQL or MongoDB? (Recommend: PostgreSQL per schema doc)
- [ ] **Real-time**: WebSockets or Server-Sent Events? (Recommend: WebSockets for leaderboard)
- [ ] **State management**: Redux or Zustand? (Recommend: Zustand for simplicity)
- [ ] **Styling**: Tailwind or CSS Modules? (Current codebase uses Tailwind)

---

## 13. Next Steps

### Immediate (Week 1)

1. **Review and approve** this implementation plan
2. **Decide** on open questions (#12)
3. **Set up** project board with tasks
4. **Create** feature branch: `feature/progressive-flow`
5. **Start Phase 1**: Foundation setup

### Week 1 Checklist

- [ ] Create directory structure
- [ ] Implement challenge mapper
- [ ] Extend progress service
- [ ] Build assessment pages
- [ ] Update routing
- [ ] Write unit tests for mappers

### Success Criteria for Week 1

- [ ] Assessment flow functional end-to-end
- [ ] User can complete assessment
- [ ] Results display recommended track
- [ ] Progress saved to localStorage
- [ ] No errors in console
- [ ] Tests passing

---

## 14. Resources & References

### Documentation
- [Progressive Flow Wireframes](PROGRESSIVE_FLOW_WIREFRAMES.md) - Complete UI designs
- [Database Schema](PROGRESSIVE_FLOW_DATABASE_SCHEMA.md) - PostgreSQL schema
- [Gamification Formulas](GAMIFICATION_FORMULAS.md) - XP, achievements, skills

### Code References
- [Existing Challenges](src/apps/system-design/builder/challenges/tieredChallenges.ts) - 658 challenges
- [Challenge Types](src/apps/system-design/builder/types/testCase.ts) - TypeScript interfaces
- [Lessons](src/apps/system-design/builder/data/lessons/index.ts) - 37+ lessons
- [Progress Service](src/apps/system-design/builder/services/progressService.ts) - Current tracking
- [Test Runner](src/apps/system-design/builder/services/testRunner.ts) - Simulation engine

### Similar Implementations
- LeetCode's study plans (track-based progression)
- Duolingo's skill tree (gamification)
- Khan Academy's mastery learning (level-based)
- Codecademy's career paths (prerequisite flow)

---

## 15. Conclusion

This implementation plan provides a **detailed, actionable roadmap** for building the progressive flow UI **alongside** the existing catalog UI without breaking anything. The approach:

✅ **Reuses existing data**: All 61 challenges, testCases, lessons, simulation engine  
✅ **Parallel routes**: New `/progressive/*` routes don't touch existing routes  
✅ **Backward compatible**: Old progress data preserved  
✅ **Gradual rollout**: Feature flag for staged deployment  
✅ **Low risk**: Can rollback at any phase  

**Total timeline**: 12 weeks (3 months) for full implementation  
**Team size**: 2-3 developers  
**Dependencies**: None (all existing resources reused)  

The progressive flow will transform the learning experience while maintaining the battle-tested existing system as a fallback.

---

**Document Version**: 1.0  
**Last Updated**: 2025-11-22  
**Status**: Ready for Review  
**Next Review**: After Phase 1 completion