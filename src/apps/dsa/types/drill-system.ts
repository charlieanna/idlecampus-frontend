// Adaptive Drill System Types

export type DrillDifficulty = 'easy' | 'medium' | 'hard' | 'mixed';
export type DrillStatus = 'not-started' | 'in-progress' | 'completed' | 'failed';

export interface DrillChallenge {
  id: string;
  topic: string; // e.g., "Pod Management", "SELECT Queries"
  difficulty: Exclude<DrillDifficulty, 'mixed'>;
  question: string;
  expectedAnswer: string;
  hints: string[];
  explanation: string;
  basePoints: number; // Points for correct answer
  speedBonusThreshold: number; // Seconds for speed bonus
  speedBonusPoints: number;
  relatedCommand: string; // For proficiency tracking
}

export interface DrillAttempt {
  challengeId: string;
  attemptedAt: Date;
  userAnswer: string;
  wasCorrect: boolean;
  timeTaken: number; // seconds
  hintsUsed: number;
  retries: number;
  pointsEarned: number;
  bonuses: {
    speed?: number;
    noHints?: number;
    firstTry?: number;
  };
  penalties: {
    hints?: number;
    retries?: number;
  };
}

export interface DrillSessionConfig {
  topics: string[]; // Empty = auto-select from weak areas
  difficulty: DrillDifficulty;
  duration: number; // minutes
  targetChallenges: number; // Number of drills
  autoSelectWeakAreas: boolean;
}

export interface DrillSession {
  id: string;
  startedAt: Date;
  completedAt?: Date;
  config: DrillSessionConfig;
  challenges: DrillChallenge[];
  attempts: DrillAttempt[];
  currentChallengeIndex: number;
  status: DrillStatus;
  totalPoints: number;
  proficiencyImprovements: Map<string, number>; // topic -> improvement %
}

export interface TopicProficiency {
  topic: string;
  proficiencyScore: number; // 0-100
  totalAttempts: number;
  successfulAttempts: number;
  averageTime: number; // seconds
  lastPracticed: Date;
  trend: 'improving' | 'stable' | 'declining';
  weakCommands: string[]; // Specific commands struggling with
  needsPractice: boolean; // < 70% proficiency
}

export interface DrillStats {
  totalSessions: number;
  totalDrills: number;
  totalPoints: number;
  averageScore: number; // Average points per session
  averageAccuracy: number; // % correct
  speedBonusesEarned: number;
  achievementsUnlocked: DrillAchievement[];
  personalBests: {
    highestScore: number;
    fastestTime: number; // seconds for single drill
    longestStreak: number; // correct answers in a row
    mostPointsInSession: number;
  };
  topicProficiencies: Map<string, TopicProficiency>;
}

export interface DrillAchievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  requirement: {
    type: 'sessions' | 'drills' | 'points' | 'speed' | 'accuracy' | 'streak';
    value: number;
  };
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

// Pre-built drill challenges for CKAD
export const ckadDrillChallenges: DrillChallenge[] = [
  // Easy - Pod Management
  {
    id: 'drill-pod-create-1',
    topic: 'Pod Management',
    difficulty: 'easy',
    question: 'Create a pod named "web" using the nginx image',
    expectedAnswer: 'kubectl run web --image=nginx',
    hints: [
      'Use kubectl run command',
      'Syntax: kubectl run <name> --image=<image>',
    ],
    explanation: 'kubectl run is the simplest way to create a pod with a single container.',
    basePoints: 10,
    speedBonusThreshold: 20,
    speedBonusPoints: 5,
    relatedCommand: 'kubectl run',
  },
  {
    id: 'drill-pod-list-1',
    topic: 'Pod Management',
    difficulty: 'easy',
    question: 'List all pods in the current namespace',
    expectedAnswer: 'kubectl get pods',
    hints: [
      'Use kubectl get command',
      'Resource type is "pods" or "pod"',
    ],
    explanation: 'kubectl get pods shows all pods in the current namespace.',
    basePoints: 8,
    speedBonusThreshold: 15,
    speedBonusPoints: 4,
    relatedCommand: 'kubectl get',
  },
  {
    id: 'drill-pod-describe-1',
    topic: 'Pod Management',
    difficulty: 'easy',
    question: 'Get detailed information about a pod named "app"',
    expectedAnswer: 'kubectl describe pod app',
    hints: [
      'Use kubectl describe command',
      'Specify resource type and name',
    ],
    explanation: 'kubectl describe provides detailed information including events and status.',
    basePoints: 10,
    speedBonusThreshold: 20,
    speedBonusPoints: 5,
    relatedCommand: 'kubectl describe',
  },

  // Medium - Pod Management
  {
    id: 'drill-pod-create-2',
    topic: 'Pod Management',
    difficulty: 'medium',
    question: 'Create a pod named "db" using postgres:13 image and expose port 5432',
    expectedAnswer: 'kubectl run db --image=postgres:13 --port=5432',
    hints: [
      'Use kubectl run with additional flags',
      'The --port flag exposes a container port',
    ],
    explanation: 'The --port flag makes the container port accessible within the cluster.',
    basePoints: 15,
    speedBonusThreshold: 30,
    speedBonusPoints: 7,
    relatedCommand: 'kubectl run',
  },
  {
    id: 'drill-pod-list-2',
    topic: 'Pod Management',
    difficulty: 'medium',
    question: 'List all pods with their IP addresses and node information',
    expectedAnswer: 'kubectl get pods -o wide',
    hints: [
      'Use kubectl get pods with an output flag',
      'The -o flag controls output format',
    ],
    explanation: '-o wide shows additional details like IP, node, and nominated node.',
    basePoints: 12,
    speedBonusThreshold: 25,
    speedBonusPoints: 6,
    relatedCommand: 'kubectl get',
  },
  {
    id: 'drill-pod-logs-1',
    topic: 'Pod Management',
    difficulty: 'medium',
    question: 'View the last 50 lines of logs from a pod named "webapp"',
    expectedAnswer: 'kubectl logs webapp --tail=50',
    hints: [
      'Use kubectl logs command',
      'The --tail flag limits the number of lines',
    ],
    explanation: '--tail=N shows only the last N lines of logs, useful for large log files.',
    basePoints: 15,
    speedBonusThreshold: 25,
    speedBonusPoints: 7,
    relatedCommand: 'kubectl logs',
  },

  // Hard - Pod Management
  {
    id: 'drill-pod-create-3',
    topic: 'Pod Management',
    difficulty: 'hard',
    question: 'Create a pod named "test" with nginx image, set environment variable DB_HOST=mysql, and add label tier=frontend',
    expectedAnswer: 'kubectl run test --image=nginx --env=DB_HOST=mysql --labels=tier=frontend',
    hints: [
      'Use multiple flags: --env and --labels',
      'Format: --env=KEY=VALUE and --labels=KEY=VALUE',
    ],
    explanation: 'kubectl run supports multiple flags to configure the pod at creation time.',
    basePoints: 20,
    speedBonusThreshold: 40,
    speedBonusPoints: 10,
    relatedCommand: 'kubectl run',
  },
  {
    id: 'drill-pod-exec-1',
    topic: 'Pod Management',
    difficulty: 'hard',
    question: 'Execute the command "ls /app" inside a pod named "webapp"',
    expectedAnswer: 'kubectl exec webapp -- ls /app',
    hints: [
      'Use kubectl exec command',
      'Syntax: kubectl exec <pod> -- <command>',
    ],
    explanation: 'kubectl exec runs commands inside a running container. The -- separates kubectl flags from the command.',
    basePoints: 18,
    speedBonusThreshold: 35,
    speedBonusPoints: 9,
    relatedCommand: 'kubectl exec',
  },

  // Easy - Service Networking
  {
    id: 'drill-svc-create-1',
    topic: 'Service Networking',
    difficulty: 'easy',
    question: 'Expose a pod named "web" on port 80',
    expectedAnswer: 'kubectl expose pod web --port=80',
    hints: [
      'Use kubectl expose command',
      'Specify the resource type (pod) and name',
    ],
    explanation: 'kubectl expose creates a Service that routes traffic to the pod.',
    basePoints: 12,
    speedBonusThreshold: 25,
    speedBonusPoints: 6,
    relatedCommand: 'kubectl expose',
  },
  {
    id: 'drill-svc-list-1',
    topic: 'Service Networking',
    difficulty: 'easy',
    question: 'List all services in the current namespace',
    expectedAnswer: 'kubectl get services',
    hints: [
      'Use kubectl get command',
      'Resource type is "services" or "svc"',
    ],
    explanation: 'kubectl get services shows all Service resources.',
    basePoints: 8,
    speedBonusThreshold: 15,
    speedBonusPoints: 4,
    relatedCommand: 'kubectl get',
  },

  // Medium - Service Networking
  {
    id: 'drill-svc-create-2',
    topic: 'Service Networking',
    difficulty: 'medium',
    question: 'Expose pod "api" on port 8080 and target container port 3000',
    expectedAnswer: 'kubectl expose pod api --port=8080 --target-port=3000',
    hints: [
      'Use kubectl expose with --port and --target-port',
      '--port is the Service port, --target-port is the container port',
    ],
    explanation: '--port is what clients use, --target-port is the actual container port.',
    basePoints: 15,
    speedBonusThreshold: 30,
    speedBonusPoints: 7,
    relatedCommand: 'kubectl expose',
  },

  // Easy - Deployments
  {
    id: 'drill-deploy-create-1',
    topic: 'Deployments',
    difficulty: 'easy',
    question: 'Create a deployment named "web" with nginx image',
    expectedAnswer: 'kubectl create deployment web --image=nginx',
    hints: [
      'Use kubectl create deployment command',
      'Syntax: kubectl create deployment <name> --image=<image>',
    ],
    explanation: 'kubectl create deployment creates a Deployment with a ReplicaSet.',
    basePoints: 10,
    speedBonusThreshold: 20,
    speedBonusPoints: 5,
    relatedCommand: 'kubectl create deployment',
  },
  {
    id: 'drill-deploy-scale-1',
    topic: 'Deployments',
    difficulty: 'medium',
    question: 'Scale deployment "web" to 5 replicas',
    expectedAnswer: 'kubectl scale deployment web --replicas=5',
    hints: [
      'Use kubectl scale command',
      'Specify the deployment and replica count',
    ],
    explanation: 'kubectl scale adjusts the number of pod replicas.',
    basePoints: 12,
    speedBonusThreshold: 25,
    speedBonusPoints: 6,
    relatedCommand: 'kubectl scale',
  },
];

// Pre-built drill challenges for SQL
export const sqlDrillChallenges: DrillChallenge[] = [
  // Easy - SELECT
  {
    id: 'drill-sql-select-1',
    topic: 'SELECT Queries',
    difficulty: 'easy',
    question: 'Select all columns from the users table',
    expectedAnswer: 'SELECT * FROM users',
    hints: [
      'Use SELECT * to get all columns',
      "Don't forget the FROM clause",
    ],
    explanation: 'SELECT * retrieves all columns from a table.',
    basePoints: 8,
    speedBonusThreshold: 15,
    speedBonusPoints: 4,
    relatedCommand: 'SELECT',
  },
  {
    id: 'drill-sql-select-2',
    topic: 'SELECT Queries',
    difficulty: 'easy',
    question: 'Select only name and email columns from users table',
    expectedAnswer: 'SELECT name, email FROM users',
    hints: [
      'List column names separated by commas',
      'Use FROM to specify the table',
    ],
    explanation: 'Selecting specific columns improves performance and clarity.',
    basePoints: 10,
    speedBonusThreshold: 20,
    speedBonusPoints: 5,
    relatedCommand: 'SELECT',
  },

  // Medium - WHERE
  {
    id: 'drill-sql-where-1',
    topic: 'Filtering Data',
    difficulty: 'medium',
    question: 'Select all users where age is greater than 25',
    expectedAnswer: 'SELECT * FROM users WHERE age > 25',
    hints: [
      'Use WHERE clause to filter',
      'Comparison operator for "greater than" is >',
    ],
    explanation: 'WHERE filters rows based on conditions.',
    basePoints: 12,
    speedBonusThreshold: 25,
    speedBonusPoints: 6,
    relatedCommand: 'WHERE',
  },
  {
    id: 'drill-sql-where-2',
    topic: 'Filtering Data',
    difficulty: 'medium',
    question: 'Select all users where country is "USA"',
    expectedAnswer: "SELECT * FROM users WHERE country = 'USA'",
    hints: [
      'Use WHERE with = for exact match',
      'String values need quotes',
    ],
    explanation: 'String comparisons require quotes around the value.',
    basePoints: 12,
    speedBonusThreshold: 25,
    speedBonusPoints: 6,
    relatedCommand: 'WHERE',
  },

  // Hard - Complex queries
  {
    id: 'drill-sql-complex-1',
    topic: 'Complex Queries',
    difficulty: 'hard',
    question: 'Select name and email from users where age > 25 AND country = "USA", ordered by name',
    expectedAnswer: "SELECT name, email FROM users WHERE age > 25 AND country = 'USA' ORDER BY name",
    hints: [
      'Combine WHERE with AND for multiple conditions',
      'Use ORDER BY at the end',
    ],
    explanation: 'Complex queries combine filtering, column selection, and sorting.',
    basePoints: 20,
    speedBonusThreshold: 40,
    speedBonusPoints: 10,
    relatedCommand: 'SELECT',
  },
];

// Achievements
export const drillAchievements: DrillAchievement[] = [
  {
    id: 'first-drill',
    name: 'First Steps',
    description: 'Complete your first drill session',
    icon: '🎯',
    requirement: { type: 'sessions', value: 1 },
    rarity: 'common',
  },
  {
    id: 'drill-10',
    name: 'Dedicated Learner',
    description: 'Complete 10 drill sessions',
    icon: '📚',
    requirement: { type: 'sessions', value: 10 },
    rarity: 'common',
  },
  {
    id: 'drill-50',
    name: 'Practice Master',
    description: 'Complete 50 drill sessions',
    icon: '🏆',
    requirement: { type: 'sessions', value: 50 },
    rarity: 'rare',
  },
  {
    id: 'speed-demon',
    name: 'Speed Demon',
    description: 'Earn 5 speed bonuses in one session',
    icon: '⚡',
    requirement: { type: 'speed', value: 5 },
    rarity: 'rare',
  },
  {
    id: 'perfect-session',
    name: 'Perfectionist',
    description: 'Complete a session with 100% accuracy',
    icon: '✨',
    requirement: { type: 'accuracy', value: 100 },
    rarity: 'epic',
  },
  {
    id: 'streak-10',
    name: 'On Fire',
    description: 'Get 10 correct answers in a row',
    icon: '🔥',
    requirement: { type: 'streak', value: 10 },
    rarity: 'epic',
  },
  {
    id: 'points-1000',
    name: 'Point Collector',
    description: 'Earn 1000 total points',
    icon: '💰',
    requirement: { type: 'points', value: 1000 },
    rarity: 'rare',
  },
  {
    id: 'drill-master',
    name: 'Drill Master',
    description: 'Complete 100 individual drills',
    icon: '👑',
    requirement: { type: 'drills', value: 100 },
    rarity: 'legendary',
  },
];

// Utility class for proficiency calculation
export class ProficiencyTracker {
  static calculateProficiency(
    totalAttempts: number,
    successfulAttempts: number,
    averageTime: number,
    recentPerformance: boolean[]
  ): number {
    if (totalAttempts === 0) return 0;

    // Base accuracy (60% weight)
    const accuracy = (successfulAttempts / totalAttempts) * 60;

    // Speed factor (20% weight)
    // Faster is better, but cap at reasonable threshold
    const optimalTime = 30; // seconds
    const speedFactor = averageTime <= optimalTime ? 20 : Math.max(0, 20 - (averageTime - optimalTime) / 5);

    // Recent trend (20% weight)
    // Last 5 attempts matter more
    const recent = recentPerformance.slice(-5);
    const recentSuccessRate = recent.filter(Boolean).length / Math.max(recent.length, 1);
    const trendFactor = recentSuccessRate * 20;

    return Math.min(100, Math.round(accuracy + speedFactor + trendFactor));
  }

  static determineTrend(
    recentPerformance: boolean[]
  ): 'improving' | 'stable' | 'declining' {
    if (recentPerformance.length < 3) return 'stable';

    const recent = recentPerformance.slice(-5);
    const older = recentPerformance.slice(-10, -5);

    const recentRate = recent.filter(Boolean).length / recent.length;
    const olderRate = older.length > 0 ? older.filter(Boolean).length / older.length : recentRate;

    if (recentRate > olderRate + 0.15) return 'improving';
    if (recentRate < olderRate - 0.15) return 'declining';
    return 'stable';
  }

  static selectWeakTopics(
    proficiencies: Map<string, TopicProficiency>,
    count: number = 3
  ): string[] {
    const sorted = Array.from(proficiencies.values())
      .filter(p => p.needsPractice)
      .sort((a, b) => a.proficiencyScore - b.proficiencyScore);

    return sorted.slice(0, count).map(p => p.topic);
  }

  static generateDrillSession(
    config: DrillSessionConfig,
    availableChallenges: DrillChallenge[],
    topicProficiencies?: Map<string, TopicProficiency>
  ): DrillChallenge[] {
    let selectedChallenges: DrillChallenge[] = [];

    // Auto-select topics from weak areas
    if (config.autoSelectWeakAreas && topicProficiencies) {
      const weakTopics = this.selectWeakTopics(topicProficiencies);
      config.topics = weakTopics.length > 0 ? weakTopics : config.topics;
    }

    // Filter by topics if specified
    let pool = config.topics.length > 0
      ? availableChallenges.filter(c => config.topics.includes(c.topic))
      : availableChallenges;

    // Filter by difficulty
    if (config.difficulty !== 'mixed') {
      pool = pool.filter(c => c.difficulty === config.difficulty);
    }

    // Shuffle and select
    const shuffled = pool.sort(() => Math.random() - 0.5);
    selectedChallenges = shuffled.slice(0, config.targetChallenges);

    return selectedChallenges;
  }
}
