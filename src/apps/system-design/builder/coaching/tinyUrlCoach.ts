import { ProblemCoachConfig, LevelCoachConfig } from '../types/coachConfig';

/**
 * TinyURL Coach Configuration
 * Progressive learning path: Connectivity → Performance
 */

const level1Config: LevelCoachConfig = {
  level: 1,
  title: 'Level 1: Make It Work',
  goal: 'Build a working Client → App → Database flow',
  description: 'Focus on basic connectivity. Performance doesn\'t matter yet!',
  estimatedTime: '10 minutes',
  learningObjectives: [
    'Understand basic system architecture',
    'Connect client to app server to database',
    'Verify end-to-end functionality',
  ],

  messages: [
    // Initial guidance
    {
      trigger: { type: 'on_first_visit' },
      message: "👋 Welcome to your first system design! Let's build a URL shortener like bit.ly. We'll start simple and add complexity step by step.",
      messageType: 'info',
      icon: '👋',
      priority: 100,
    },
    {
      trigger: { type: 'on_load' },
      message: "🎯 Goal: Create a working system that can shorten URLs. Don't worry about performance yet—just make it work!",
      messageType: 'info',
      icon: '🎯',
      priority: 90,
    },

    // Guidance messages
    {
      trigger: { type: 'on_load' },
      message: "Start by dragging three components onto the canvas: Client, App Server, and Database (PostgreSQL).",
      messageType: 'hint',
      icon: '💡',
      priority: 80,
    },

    // After adding components
    {
      trigger: { type: 'component_added', componentType: 'app_server' },
      message: "Great! App Server added. This is where your URL shortening logic will run.",
      messageType: 'success',
      icon: '✅',
      showOnce: true,
    },
    {
      trigger: { type: 'component_added', componentType: 'postgresql' },
      message: "Database added! This will store your URL mappings (short_code → long_url).",
      messageType: 'success',
      icon: '✅',
      showOnce: true,
    },

    // Connection guidance
    {
      trigger: { type: 'after_test', testIndex: 0, result: 'fail' },
      message: "Components need to be connected. Try: Client → App Server → Database",
      messageType: 'hint',
      icon: '🔗',
      priority: 70,
    },

    // Validation failures
    {
      trigger: { type: 'validator_failed', validatorName: 'Valid Connection Flow' },
      message: "Connection flow issue detected. Make sure data flows: Client → App Server → Database",
      messageType: 'warning',
      icon: '⚠️',
    },

    // Success!
    {
      trigger: { type: 'all_tests_passed' },
      message: "🎉 Awesome! Your TinyURL works! You just built your first distributed system.",
      messageType: 'celebration',
      icon: '🎉',
      priority: 100,
      action: { type: 'next_level' },
    },
  ],

  unlockHints: [
    {
      condition: { minAttempts: 2 },
      hint: "Hint: Every system needs compute (App Server) and storage (Database). The Client represents users.",
      hintLevel: 1,
    },
    {
      condition: { minAttempts: 3 },
      hint: "Specific hint: Connect Client to App Server, then App Server to Database. Use the connection tool.",
      hintLevel: 2,
    },
    {
      condition: { minAttempts: 5, minTimeSeconds: 180 },
      hint: "Need help? Click 'Show Solution' to see the correct architecture for Level 1.",
      hintLevel: 3,
    },
  ],
};

const level2Config: LevelCoachConfig = {
  level: 2,
  title: 'Level 2: Scale to 1000 RPS',
  goal: 'Add caching to handle high read traffic',
  description: 'Learn how to optimize read-heavy systems with caching',
  estimatedTime: '15 minutes',
  learningObjectives: [
    'Understand read-heavy workload patterns',
    'Implement caching strategy',
    'Optimize database load',
    'Achieve target latency under load',
  ],

  messages: [
    // Level start
    {
      trigger: { type: 'on_load' },
      message: "🚀 Level 2: Now we're handling 1000 requests per second! 90% are reads (people clicking short links).",
      messageType: 'info',
      icon: '🚀',
      priority: 100,
    },
    {
      trigger: { type: 'on_load' },
      message: "💡 Think: What happens when 900 read requests hit your database every second?",
      messageType: 'hint',
      icon: '💡',
      priority: 90,
    },

    // Bottleneck detection
    {
      trigger: { type: 'bottleneck_detected', component: 'postgresql' },
      message: "⚠️ Database bottleneck detected! With 900 reads/sec, PostgreSQL is overwhelmed.",
      messageType: 'warning',
      icon: '⚠️',
      priority: 95,
    },
    {
      trigger: { type: 'bottleneck_detected', component: 'postgresql' },
      message: "💡 Hint: 90% of requests read the same popular URLs. What technology caches frequently accessed data?",
      messageType: 'hint',
      icon: '💡',
      priority: 85,
    },

    // Validator guidance
    {
      trigger: { type: 'validator_failed', validatorName: 'Cache for Read-Heavy Traffic' },
      message: "Your system needs caching! Try adding Redis between App Server and Database.",
      messageType: 'hint',
      icon: '💾',
      priority: 90,
    },
    {
      trigger: { type: 'validator_failed', validatorName: 'Read-Heavy Cache Strategy' },
      message: "Cache strategy tip: For read-heavy workloads like TinyURL, use 'cache_aside' strategy.",
      messageType: 'hint',
      icon: '⚙️',
    },

    // Cache added
    {
      trigger: { type: 'component_added', componentType: 'redis' },
      message: "✅ Redis added! Now configure it: Set hit ratio to 0.9 (90% cache hits) and connect App → Cache → DB",
      messageType: 'success',
      icon: '✅',
      showOnce: true,
    },

    // Latency issues
    {
      trigger: { type: 'latency_exceeded', maxLatency: 100 },
      message: "Latency too high! Check: 1) Is cache connected? 2) Is hit ratio high enough? 3) Is DB capacity sufficient?",
      messageType: 'warning',
      icon: '⏱️',
    },

    // Success messages
    {
      trigger: { type: 'after_test', testIndex: 0, result: 'pass' },
      message: "Great! Basic load test passed. Now let's see if you can handle the full 1000 RPS...",
      messageType: 'success',
      icon: '✅',
    },
    {
      trigger: { type: 'all_tests_passed' },
      message: "⭐ Outstanding! You've mastered caching for read-heavy workloads. Your system now handles 1000 RPS efficiently!",
      messageType: 'celebration',
      icon: '⭐',
      priority: 100,
      action: { type: 'next_problem', problemId: 'todo_app' },
    },
  ],

  unlockHints: [
    {
      condition: { minAttempts: 2, afterValidatorFails: ['Cache for Read-Heavy Traffic'] },
      hint: "Read-heavy systems (90%+ reads) benefit from caching. Add Redis to cache popular URLs.",
      hintLevel: 1,
    },
    {
      condition: { minAttempts: 3 },
      hint: "Connection pattern: App Server → Cache (Redis) → Database. Cache checks first, DB on miss.",
      hintLevel: 2,
    },
    {
      condition: { minAttempts: 4, minTimeSeconds: 300 },
      hint: "Cache configuration: hitRatio: 0.9, ttl: 3600, memorySizeGB: 4. Use cache_aside strategy.",
      hintLevel: 3,
    },
    {
      condition: { minAttempts: 6 },
      hint: "Still stuck? The key insight: Caching reduces DB load from 900 reads/sec to 90 reads/sec (10% cache misses).",
      hintLevel: 3,
    },
  ],
};

export const tinyUrlCoachConfig: ProblemCoachConfig = {
  problemId: 'tiny_url',
  archetype: 'url_shortener',

  levelConfigs: {
    1: level1Config,
    2: level2Config,
  },

  celebrationMessages: {
    1: "🎉 Level 1 Complete!\n\nYou built your first working system! You now understand:\n✅ Client-Server-Database architecture\n✅ Basic data flow\n✅ Why we separate layers\n\nReady for Level 2?",
    2: "⭐ Level 2 Complete!\n\nAmazing work! You've mastered:\n✅ Caching strategies for read-heavy systems\n✅ Database load optimization\n✅ Scaling to 1000 RPS\n\nYou're ready for more complex systems!",
  },

  nextProblemRecommendation: 'todo_app',
};

/**
 * Helper to get current level config
 */
export function getTinyUrlLevelConfig(level: number): LevelCoachConfig | undefined {
  return tinyUrlCoachConfig.levelConfigs[level];
}

/**
 * Helper to get next level or problem recommendation
 */
export function getNextStep(currentLevel: number): {
  type: 'next_level' | 'next_problem';
  destination: number | string;
  message: string;
} {
  if (currentLevel === 1) {
    return {
      type: 'next_level',
      destination: 2,
      message: "Ready to scale to 1000 RPS? Let's learn about caching!",
    };
  } else {
    return {
      type: 'next_problem',
      destination: tinyUrlCoachConfig.nextProblemRecommendation || 'todo_app',
      message: "Great job! Let's apply these concepts to a CRUD application.",
    };
  }
}