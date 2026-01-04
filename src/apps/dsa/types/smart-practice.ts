import type { ProblemHintStep } from './dsa-course';

/**
 * Smart Practice System Type Definitions
 * Adaptive learning with spaced repetition and weakness detection
 */

// ============= Weakness Detection Types =============

export interface WeaknessProfile {
  userId: string;
  patterns: Map<string, WeaknessScore>;    // "two-pointers" → score
  concepts: Map<string, WeaknessScore>;    // "time-complexity" → score
  errorTypes: Map<string, ErrorPattern>;   // "off-by-one" → frequency
  struggleMetrics: Map<string, StruggleMetric>; // Pattern → time/attempts
  lastUpdated: Date;
}

export interface WeaknessScore {
  score: number;           // 0-1 (0 = weak, 1 = strong)
  attempts: number;
  successes: number;
  averageTime: number;     // milliseconds
  lastSeen: Date;
  trend: 'improving' | 'declining' | 'stable';
  confidence: number;      // 0-1, based on consistency
}

export interface ErrorPattern {
  type: string;           // "off-by-one", "null-check", "boundary"
  frequency: number;
  lastOccurred: Date;
  examples: string[];     // Problem IDs where error occurred
  fixed: boolean;         // Has user overcome this error type?
}

export interface StruggleMetric {
  patternId: string;
  averageSolveTime: number;
  hintsUsed: number;
  abandonRate: number;    // % of problems abandoned
  debugTime: number;      // Time spent debugging errors
}

// ============= Concept Scoring Types (Decay-Based System) =============

export interface ConceptScore {
  conceptId: string;
  conceptName: string;
  learningSequence: number;  // Order in which concept was learned (1st, 2nd, 3rd, etc.)
  baseUrgency: number;       // Base urgency (100 initially, reduced by practice)
  urgencyScore: number;      // Calculated: baseUrgency + sequence decay
  weaknessScore: number;     // 100% (struggling) → 0% (strong)
  combinedPriority: number;  // Calculated: urgency×0.4 + weakness×0.6
  practiceCount: number;
  successCount: number;
  failureCount: number;
  lastPracticed: Date | null;
  successRate: number;
  averageSolveTime: number;
  totalHintsUsed: number;
  lastUpdateTime: Date;
  moduleId?: string;         // Which module introduced this concept
  learnedAt?: Date;          // When the concept was first learned (for reference only)
}

export interface PracticeAttempt {
  success: boolean;
  timeSpent: number;         // in seconds
  expectedTime: number;      // expected time in seconds
  hintsUsed: number;
  submissionAttempts: number; // How many times submitted before passing (1 = first try!)
  errorType?: string;
  problemDifficulty: 'easy' | 'medium' | 'hard';
}

export interface ConceptPriorityResult {
  conceptId: string;
  conceptName: string;
  priority: number;
  reason: string;
  urgencyScore: number;
  weaknessScore: number;
  color: 'red' | 'yellow' | 'green';
}

export interface ConceptMasteryLevel {
  level: 'Mastered' | 'Solid' | 'Improving' | 'Learning' | 'New';
  emoji: string;
  percentage: number;
}

// Legacy Spaced Repetition (deprecated - replaced by concept scoring)
export interface SpacedRepetitionItem {
  conceptId: string;
  userId: string;
  interval: number;        // Days until next review
  easeFactor: number;      // 1.3 (hard) to 2.5 (easy)
  repetitions: number;
  nextReview: Date;
  lastReview: Date;
  quality: number;         // 0-5 from last review
  stage: 'learning' | 'young' | 'mature';
}

export interface ReviewSchedule {
  userId: string;
  todayReviews: SpacedRepetitionItem[];
  overdueReviews: SpacedRepetitionItem[];
  upcomingReviews: Map<Date, SpacedRepetitionItem[]>;
  completedToday: number;
  streak: number;
}

// ============= Concept Retention Tests =============

export interface ConceptRetentionTest {
  id: string;
  type: 'quick-check' | 'module-mastery' | 'final-assessment';
  moduleIds: string[];
  questions: TestQuestion[];
  timeLimit: number;       // minutes
  passingScore: number;    // 0-1
  adaptiveDifficulty: boolean;
}

export interface TestQuestion {
  id: string;
  type: 'recognition' | 'recall' | 'apply' | 'analyze';
  concept: string;
  pattern?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;

  // For multiple choice
  options?: string[];
  correctAnswer: string | number;

  // For coding questions
  starterCode?: string;
  testCases?: TestCase[];
  expectedOutput?: string;

  explanation: string;
  commonMistakes: string[];
  hints: string[];

  // Metrics
  averageTime: number;
  successRate: number;
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  hidden: boolean;
}

export interface TestResult {
  testId: string;
  userId: string;
  score: number;           // 0-1
  timeSpent: number;       // milliseconds
  questionResults: QuestionResult[];
  weaknessesDetected: string[];
  recommendedFocus: string[];
  timestamp: Date;
}

export interface QuestionResult {
  questionId: string;
  correct: boolean;
  timeSpent: number;
  hintsUsed: number;
  answer: string;
  concept: string;
  pattern?: string;
}

// ============= Adaptive Problem Bank =============

export interface AdaptiveProblem {
  id: string;
  title: string;
  description: string;
  difficulty: DifficultyLevel;

  // Multi-dimensional tagging
  patterns: string[];        // ['two-pointers', 'sliding-window']
  concepts: string[];        // ['arrays', 'strings', 'optimization']
  techniques: string[];      // ['brute-force', 'optimized']
  prerequisites: string[];   // Module IDs that must be completed

  // Problem content
  examples: Example[];
  constraints: string[];
  starterCode: Map<string, string>; // language → code
  solution: Map<string, string>;
  testCases: TestCase[];

  // Adaptive hints system
  hints: HintLevel[];

  // Learning metadata
  averageSolveTime: number;
  successRate: number;
  commonMistakes: string[];
  similarProblems: string[];  // IDs of related problems

  // For weakness targeting
  targetWeaknesses: string[];  // Which weaknesses this helps

  // Spaced repetition
  reviewValue: number;        // How good for review (0-1)

  tags: string[];

  // Complexity analysis
  timeComplexity?: string;    // e.g., 'O(n)', 'O(log n)'
  spaceComplexity?: string;   // e.g., 'O(1)', 'O(n)'
}

export interface DifficultyLevel {
  base: 'easy' | 'medium' | 'hard';
  numeric: number;           // 1-10 for fine-grained difficulty
  adaptive: boolean;         // Can difficulty be adjusted?
}

export interface Example {
  input: string;
  output: string;
  explanation?: string;
  visual?: string;           // URL to diagram/animation
}

export interface HintLevel extends ProblemHintStep {
  level: 1 | 2 | 3 | 4 | 5;
  hint: string;
  penaltyPercent: number;    // Score reduction for using
  revealCode?: boolean;      // Show partial solution?
  /**
   * Optional assessment prompt/question to verify understanding post-hint.
   */
  assessmentPrompt?: string;
}

// ============= Progress Tracking =============

export interface UserProgress {
  userId: string;

  // Overall metrics
  totalProblemsSolved: number;
  totalTimePracticed: number; // milliseconds
  currentStreak: number;
  longestStreak: number;
  lastPracticeDate: Date;

  // Concept Scores (Decay-Based System)
  conceptScores: ConceptScore[];

  // Skill assessment
  skillRadar: SkillRadar;

  // Detailed progress by pattern/concept
  patternMastery: Map<string, MasteryLevel>;
  conceptMastery: Map<string, MasteryLevel>;

  // Weakness evolution over time
  weaknessTimeline: WeaknessEvolution[];

  // Practice efficiency metrics
  efficiencyMetrics: EfficiencyMetrics;

  // Interview readiness
  interviewReadiness: InterviewReadiness;

  // Achievements
  achievements: Achievement[];
  unlockedAchievements: Set<string>;

  // Current level/rank
  level: UserLevel;
  experience: number;
  nextLevelXP: number;
}

export interface SkillRadar {
  arrays: number;           // 0-100
  strings: number;
  twoPointers: number;
  slidingWindow: number;
  hashMaps: number;
  linkedLists: number;
  trees: number;
  graphs: number;
  dynamicProgramming: number;
  heaps: number;
  backtracking: number;
  timeComplexity: number;
  spaceOptimization: number;
  debugging: number;
  problemSolving: number;
}

export interface MasteryLevel {
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'master';
  score: number;           // 0-100
  problemsSolved: number;
  successRate: number;
  averageTime: number;
  lastPracticed: Date;
  trending: 'up' | 'down' | 'stable';
}

export interface WeaknessEvolution {
  concept: string;
  dataPoints: Array<{
    date: Date;
    score: number;
    event?: string;        // "Completed Module 5", "Intensive Practice"
  }>;
}

export interface EfficiencyMetrics {
  averageProblemTime: number;
  timeImprovement: number;   // % faster than 30 days ago
  hintsPerProblem: number;
  firstAttemptSuccess: number; // % solved on first try
  debugEfficiency: number;   // Time to fix errors
}

export interface InterviewReadiness {
  overall: number;           // 0-100
  byDifficulty: {
    easy: number;
    medium: number;
    hard: number;
  };
  byTopic: Map<string, number>;
  weakestAreas: string[];
  strongestAreas: string[];
  recommendedFocus: string[];
  estimatedStudyHours: number;
  readinessDate: Date;      // Predicted interview-ready date
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'streak' | 'mastery' | 'speed' | 'perfect' | 'challenge';
  requirement: string;
  unlockedAt?: Date;
  progress: number;         // 0-1
  reward?: string;
}

export interface UserLevel {
  name: string;            // "Apprentice", "Expert", etc.
  numeric: number;         // 1-50
  title: string;           // "Array Ninja", "Algorithm Master"
  perks: string[];         // Unlocked features
}

// ============= Practice Session =============

export interface PracticeSession {
  sessionId: string;
  userId: string;
  startTime: Date;
  endTime?: Date;

  problems: PracticeProblemAttempt[];

  // Session goals
  targetWeaknesses: string[];
  targetConcepts: string[];
  sessionType: 'weakness' | 'review' | 'mixed' | 'challenge';

  // Results
  problemsSolved: number;
  successRate: number;
  weaknessesImproved: Map<string, number>; // Concept → improvement

  // Feedback
  sessionFeedback?: string;
  nextRecommendation: string;
}

export interface PracticeProblemAttempt {
  problemId: string;
  startTime: Date;
  endTime?: Date;

  code: string;
  language: string;

  testResults: TestResult[];
  allTestsPassed: boolean;

  hintsUsed: number;
  mistakes: string[];

  // For analysis
  patterns: string[];
  concepts: string[];
  weaknessesTargeted: string[];

  score: number;           // 0-100 considering time, hints, attempts
}

// ============= Smart Problem Selection =============

export interface ProblemSelectionCriteria {
  userId: string;

  // Weights for selection algorithm
  weaknessWeight: number;   // 0-1, typically 0.6
  reviewWeight: number;     // 0-1, typically 0.3
  challengeWeight: number;  // 0-1, typically 0.1

  // Constraints
  timeAvailable: number;    // minutes
  difficulty: 'adaptive' | 'easy' | 'medium' | 'hard';

  // Focus areas (optional)
  focusPatterns?: string[];
  focusConcepts?: string[];

  // Enhanced filtering options (optional)
  filters?: {
    moduleIds?: number[];        // Filter to specific modules (e.g., [1, 2, 3])
    familyIds?: string[];        // Filter to specific concept families (e.g., ['sliding-window', 'union-find'])
    conceptNames?: string[];     // Filter to specific concepts (e.g., ['Dijkstra', 'Two Pointers'])
    fromCurrentWindow?: boolean; // Module 15: Only problems from current sliding window
    windowItemIds?: string[];    // Specific item IDs from Module 15 window
    excludeSolved?: boolean;     // Skip already solved problems
    excludeProblemIds?: string[]; // Specific problems to exclude
  };

  excludeRecent: boolean;  // Don't repeat last 24h problems
  varietyBonus: boolean;   // Prefer variety in patterns
}

export interface SelectedProblemSet {
  problems: Array<{
    problem: AdaptiveProblem;
    reason: 'weakness' | 'review' | 'challenge' | 'variety';
    targetWeakness?: string;
    reviewConcept?: string;
    estimatedTime: number;
  }>;

  totalEstimatedTime: number;
  weaknessesCovered: string[];
  conceptsReviewed: string[];

  sessionGoals: string[];
  successCriteria: string;
}

// ============= Gamification =============

export interface UserGamificationProfile {
  userId: string;

  // Points and currency
  experiencePoints: number;
  coins: number;           // Virtual currency
  gems: number;            // Premium currency

  // Streaks and challenges
  dailyStreak: number;
  weeklyChallenge: WeeklyChallenge;

  // Battle/Competition
  battleRating: number;
  battlesWon: number;
  battlesLost: number;

  // Collections
  badges: Badge[];
  titles: Title[];
  currentTitle?: string;

  // Power-ups
  powerUps: PowerUp[];
  activePowerUps: ActivePowerUp[];
}

export interface WeeklyChallenge {
  id: string;
  week: Date;
  description: string;
  target: number;
  progress: number;
  reward: string;
  completed: boolean;
}

export interface Badge {
  id: string;
  name: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  imageUrl: string;
  unlockedAt: Date;
}

export interface Title {
  id: string;
  name: string;            // "Sliding Window Samurai"
  requirement: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  equipped: boolean;
}

export interface PowerUp {
  id: string;
  name: string;            // "Hint Master", "Time Freeze"
  description: string;
  effect: string;
  duration: number;        // minutes
  cost: { coins?: number; gems?: number };
}

export interface ActivePowerUp {
  powerUpId: string;
  activatedAt: Date;
  expiresAt: Date;
}

// ============= Export Helper Functions =============

export interface SmartPracticeAPI {
  // Concept Scoring (Decay-Based System)
  initializeConcept: (conceptId: string, conceptName: string, moduleId?: string) => ConceptScore;
  updateConceptScore: (concept: ConceptScore, attempt: PracticeAttempt) => ConceptScore;
  getPrioritizedConcepts: (concepts: ConceptScore[]) => ConceptPriorityResult[];
  getMasteryLevel: (concept: ConceptScore) => ConceptMasteryLevel;
  getRecommendedDifficulty: (concept: ConceptScore) => 'easy' | 'medium' | 'hard';

  // Weakness Detection
  calculateWeaknessScore: (attempts: number, successes: number, timeSpent: number, hintsUsed: number) => number;
  updateWeaknessProfile: (profile: WeaknessProfile, attempt: PracticeProblemAttempt) => WeaknessProfile;
  detectErrorPatterns: (attempts: PracticeProblemAttempt[]) => ErrorPattern[];

  // Problem Selection (Now uses concept scores)
  selectProblems: (criteria: ProblemSelectionCriteria, conceptScores: ConceptScore[]) => Promise<SelectedProblemSet>;

  // Progress Tracking
  calculateInterviewReadiness: (progress: UserProgress) => InterviewReadiness;
  generateSkillRadar: (attempts: PracticeProblemAttempt[]) => SkillRadar;

  // Gamification
  checkAchievements: (progress: UserProgress) => Achievement[];
  calculateLevel: (experience: number) => UserLevel;
}

// ============= Analytics Events =============

export interface AnalyticsEvent {
  eventType: 'problem_started' | 'problem_completed' | 'hint_used' |
  'test_taken' | 'weakness_improved' | 'achievement_unlocked' |
  'streak_updated' | 'review_completed';
  userId: string;
  timestamp: Date;
  data: Record<string, any>;

  // For tracking learning efficiency
  sessionId?: string;
  moduleId?: string;
  patternId?: string;
  conceptId?: string;
}