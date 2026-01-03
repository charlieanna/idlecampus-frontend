// Spaced Repetition Review System Types

export type ReviewPlacement = 'lesson-opener' | 'mid-lesson' | 'concept-transition' | 'lesson-closer';

export interface ReviewChallenge {
  id: string;
  commandPattern: string;
  question: string;
  expectedAnswer: string;
  hints?: string[];
  explanation: string; // Shown after answer
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string; // e.g., "pods", "deployments", "SELECT queries"
  relatedLessonId: string;
}

export interface ReviewPromptConfig {
  placement: ReviewPlacement;
  timing: {
    afterSectionIndex?: number; // For mid-lesson
    beforeLessonEnd?: boolean; // For lesson-closer
  };
  challenge?: ReviewChallenge; // Pre-selected challenge
  autoSelect?: boolean; // Auto-select based on algorithm
  isSkippable: boolean;
}

export interface ReviewAttempt {
  challengeId: string;
  attemptedAt: Date;
  userAnswer: string;
  wasCorrect: boolean;
  timeTaken: number; // seconds
  skipped: boolean;
  hintsUsed: number;
}

export interface CommandReviewHistory {
  commandPattern: string;
  firstLearnedAt: Date;
  lastReviewedAt: Date;
  totalReviews: number;
  successfulReviews: number;
  failedReviews: number;
  currentStreak: number;
  nextReviewDue: Date;
  proficiencyScore: number; // 0-100
  spacedRepetitionInterval: number; // days
}

export interface ReviewStats {
  totalReviewsCompleted: number;
  totalReviewsSkipped: number;
  currentStreak: number; // consecutive days
  longestStreak: number;
  totalPoints: number;
  badges: ReviewBadge[];
  reviewsByDay: Map<string, number>; // ISO date string -> count
}

export interface ReviewBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  requirement: {
    type: 'review-count' | 'streak' | 'accuracy' | 'speed';
    value: number;
  };
}

// Spaced Repetition Algorithm
export class SpacedRepetitionAlgorithm {
  // SuperMemo-2 inspired algorithm
  static calculateNextInterval(
    currentInterval: number,
    quality: number // 0-5 (0=fail, 5=perfect)
  ): number {
    if (quality < 3) {
      return 1; // Review tomorrow if failed
    }

    // Successful recall
    if (currentInterval === 0) return 1;
    if (currentInterval === 1) return 6;
    
    // Exponential growth based on quality
    const factor = 1.3 + (quality - 3) * 0.2;
    return Math.round(currentInterval * factor);
  }

  static calculateProficiencyScore(history: CommandReviewHistory): number {
    if (history.totalReviews === 0) return 0;
    
    const successRate = (history.successfulReviews / history.totalReviews) * 100;
    const recencyBonus = this.calculateRecencyBonus(history.lastReviewedAt);
    const streakBonus = Math.min(history.currentStreak * 2, 20);
    
    return Math.min(successRate + recencyBonus + streakBonus, 100);
  }

  private static calculateRecencyBonus(lastReviewed: Date): number {
    const daysSince = Math.floor(
      (Date.now() - lastReviewed.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysSince === 0) return 10;
    if (daysSince <= 3) return 5;
    if (daysSince <= 7) return 0;
    return -5; // Penalty for not reviewing
  }

  // Select which command to review based on priority
  static selectCommandForReview(
    histories: CommandReviewHistory[],
    currentTopic?: string
  ): CommandReviewHistory | null {
    const now = new Date();
    
    // Filter to commands due for review
    const dueForReview = histories.filter(h => h.nextReviewDue <= now);
    
    if (dueForReview.length === 0) return null;
    
    // Prioritize by topic match, then by proficiency (review weak commands first)
    const sorted = dueForReview.sort((a, b) => {
      // Topic match bonus
      if (currentTopic) {
        const aMatches = a.commandPattern.includes(currentTopic);
        const bMatches = b.commandPattern.includes(currentTopic);
        if (aMatches && !bMatches) return -1;
        if (!aMatches && bMatches) return 1;
      }
      
      // Lower proficiency = higher priority
      return a.proficiencyScore - b.proficiencyScore;
    });
    
    return sorted[0];
  }
}

// Pre-built review challenges for CKAD
export const ckadReviewChallenges: ReviewChallenge[] = [
  {
    id: 'review-kubectl-run',
    commandPattern: 'kubectl run',
    question: 'Create a pod named "nginx-review" using the nginx image',
    expectedAnswer: 'kubectl run nginx-review --image=nginx',
    hints: [
      'Use the kubectl run command',
      'Syntax: kubectl run <pod-name> --image=<image>',
    ],
    explanation: 'kubectl run creates a single pod. The --image flag specifies the container image.',
    difficulty: 'easy',
    topic: 'pods',
    relatedLessonId: 'pods-basics',
  },
  {
    id: 'review-kubectl-get-pods',
    commandPattern: 'kubectl get pods',
    question: 'List all pods in the current namespace with wide output',
    expectedAnswer: 'kubectl get pods -o wide',
    hints: [
      'Use kubectl get pods with an output flag',
      'The -o flag controls output format',
    ],
    explanation: 'The -o wide flag shows additional details like node, IP address, and nominated node.',
    difficulty: 'medium',
    topic: 'pods',
    relatedLessonId: 'pods-basics',
  },
  {
    id: 'review-kubectl-describe',
    commandPattern: 'kubectl describe',
    question: 'Get detailed information about a pod named "myapp"',
    expectedAnswer: 'kubectl describe pod myapp',
    hints: [
      'Use kubectl describe command',
      'Specify the resource type (pod) and name',
    ],
    explanation: 'kubectl describe shows detailed information including events, which is crucial for debugging.',
    difficulty: 'easy',
    topic: 'pods',
    relatedLessonId: 'pods-basics',
  },
  {
    id: 'review-kubectl-logs',
    commandPattern: 'kubectl logs',
    question: 'View logs for a pod named "webapp"',
    expectedAnswer: 'kubectl logs webapp',
    hints: [
      'Use the kubectl logs command',
      'Syntax: kubectl logs <pod-name>',
    ],
    explanation: 'kubectl logs retrieves container logs, essential for debugging application issues.',
    difficulty: 'easy',
    topic: 'pods',
    relatedLessonId: 'pods-debugging',
  },
  {
    id: 'review-kubectl-delete',
    commandPattern: 'kubectl delete',
    question: 'Delete a pod named "old-app"',
    expectedAnswer: 'kubectl delete pod old-app',
    hints: [
      'Use kubectl delete command',
      'Specify resource type and name',
    ],
    explanation: 'kubectl delete removes resources. Be careful - this action cannot be undone!',
    difficulty: 'easy',
    topic: 'pods',
    relatedLessonId: 'pods-basics',
  },
  {
    id: 'review-kubectl-create-deployment',
    commandPattern: 'kubectl create deployment',
    question: 'Create a deployment named "web" with nginx image and 3 replicas',
    expectedAnswer: 'kubectl create deployment web --image=nginx --replicas=3',
    hints: [
      'Use kubectl create deployment',
      'Add --replicas flag to specify count',
    ],
    explanation: 'Deployments manage ReplicaSets, which maintain the desired number of pod replicas.',
    difficulty: 'medium',
    topic: 'deployments',
    relatedLessonId: 'deployments-basics',
  },
];

// Pre-built review challenges for SQL
export const sqlReviewChallenges: ReviewChallenge[] = [
  {
    id: 'review-select-all',
    commandPattern: 'SELECT *',
    question: 'Write a query to select all columns from the "users" table',
    expectedAnswer: 'SELECT * FROM users',
    hints: [
      'Use SELECT * to get all columns',
      "Don't forget the FROM clause",
    ],
    explanation: 'SELECT * retrieves all columns. In production, specify columns for better performance.',
    difficulty: 'easy',
    topic: 'select',
    relatedLessonId: 'sql-select-basics',
  },
  {
    id: 'review-where-clause',
    commandPattern: 'WHERE',
    question: 'Select all users where country is "USA"',
    expectedAnswer: 'SELECT * FROM users WHERE country = \'USA\'',
    hints: [
      'Use WHERE clause to filter',
      'String values need quotes',
    ],
    explanation: 'WHERE filters rows based on conditions. Remember to use quotes for string values.',
    difficulty: 'medium',
    topic: 'where',
    relatedLessonId: 'sql-filtering',
  },
  {
    id: 'review-order-by',
    commandPattern: 'ORDER BY',
    question: 'Select all users ordered by age in descending order',
    expectedAnswer: 'SELECT * FROM users ORDER BY age DESC',
    hints: [
      'Use ORDER BY clause',
      'DESC means descending',
    ],
    explanation: 'ORDER BY sorts results. Use DESC for descending, ASC (default) for ascending.',
    difficulty: 'medium',
    topic: 'sorting',
    relatedLessonId: 'sql-sorting',
  },
];

// Badges
export const reviewBadges: ReviewBadge[] = [
  {
    id: 'first-review',
    name: 'First Steps',
    description: 'Completed your first review',
    icon: '🎯',
    requirement: { type: 'review-count', value: 1 },
  },
  {
    id: 'review-streak-3',
    name: 'Getting Consistent',
    description: '3-day review streak',
    icon: '🔥',
    requirement: { type: 'streak', value: 3 },
  },
  {
    id: 'review-streak-7',
    name: 'Week Warrior',
    description: '7-day review streak',
    icon: '⚡',
    requirement: { type: 'streak', value: 7 },
  },
  {
    id: 'review-streak-30',
    name: 'Month Master',
    description: '30-day review streak',
    icon: '💎',
    requirement: { type: 'streak', value: 30 },
  },
  {
    id: 'review-master',
    name: 'Review Master',
    description: 'Completed 50 reviews',
    icon: '🏆',
    requirement: { type: 'review-count', value: 50 },
  },
  {
    id: 'perfect-week',
    name: 'Perfect Week',
    description: '100% accuracy for 7 days',
    icon: '✨',
    requirement: { type: 'accuracy', value: 100 },
  },
];
