import { ProblemCoachConfig, LevelCoachConfig } from '../types/coachConfig';

/**
 * Trello Coach Configuration
 * Pattern: CRUD + Collaboration
 * Focus: Data modeling, consistency, real-time updates
 */

const level1Config: LevelCoachConfig = {
  level: 1,
  title: 'Level 1: Basic CRUD Operations',
  goal: 'Build a system that can create, read, update, and delete boards, lists, and cards',
  description: 'Learn how to design a basic CRUD application with relational data',
  estimatedTime: '15 minutes',
  learningObjectives: [
    'Understand CRUD operations and data modeling',
    'Design relational data structures (boards → lists → cards)',
    'Implement basic create and read operations',
    'Connect client to app server to database',
  ],

  messages: [
    {
      trigger: { type: 'on_first_visit' },
      message: '👋 Welcome to Trello! This is a classic CRUD (Create, Read, Update, Delete) problem. You\'ll learn how to design a system where users can organize tasks in boards, lists, and cards.',
      messageType: 'info',
      icon: '👋',
      priority: 100,
      showOnce: true,
    },
    {
      trigger: { type: 'on_load' },
      message: '🎯 Goal: Build a working CRUD system\n\nUsers should be able to:\n• Create boards with lists and cards\n• Read/view their boards\n• Update card positions (drag & drop)\n• Delete cards/lists\n\nStart with the basic flow: Client → App Server → Database',
      messageType: 'info',
      icon: '🎯',
      priority: 90,
    },
    {
      trigger: { type: 'component_added', componentType: 'app_server' },
      message: '✅ Great! App Server added. This will handle all CRUD operations (create boards, move cards, etc.). Now add a Database to store the data.',
      messageType: 'success',
      icon: '✅',
      showOnce: true,
    },
    {
      trigger: { type: 'component_added', componentType: 'postgresql' },
      message: '✅ PostgreSQL added! Perfect choice for CRUD operations with relational data.\n\n💡 Tip: PostgreSQL is great for:\n• ACID transactions (moving cards is atomic)\n• Foreign keys (cards belong to lists, lists belong to boards)\n• Complex queries (search across boards)',
      messageType: 'success',
      icon: '✅',
      showOnce: true,
    },
    {
      trigger: { type: 'validator_failed', validatorName: 'Valid Connection Flow' },
      message: '🔗 Components need to be connected! Connect:\n1. Client → App Server (users send requests)\n2. App Server → Database (store/retrieve data)\n\nEvery CRUD operation follows this flow.',
      messageType: 'hint',
      icon: '💡',
    },
    {
      trigger: { type: 'all_tests_passed' },
      message: '🎉 Awesome! Your basic CRUD system works!\n\nYou can now create boards, lists, and cards. But what happens when multiple users collaborate on the same board? Let\'s tackle that next!',
      messageType: 'celebration',
      icon: '🎉',
      action: {
        type: 'next_level',
      },
    },
  ],

  unlockHints: [
    {
      condition: { minAttempts: 2 },
      hint: '💡 Hint: Every CRUD application needs three things:\n1. A client (users)\n2. An app server (business logic)\n3. A database (persistent storage)',
      hintLevel: 1,
    },
    {
      condition: { minAttempts: 3 },
      hint: '🔍 Specific hint: You need Client → App Server → PostgreSQL/MySQL.\n\nPostgreSQL is a great choice because Trello has relational data:\n• Boards contain Lists\n• Lists contain Cards\n• Cards have Comments',
      hintLevel: 2,
    },
    {
      condition: { minAttempts: 5, minTimeSeconds: 180 },
      hint: '🎯 Direct help: Add these components:\n1. App Server (handles CRUD logic)\n2. PostgreSQL (stores boards/lists/cards)\n\nConnect: Client → App Server → PostgreSQL',
      hintLevel: 3,
    },
  ],
};

const level2Config: LevelCoachConfig = {
  level: 2,
  title: 'Level 2: Real-Time Collaboration',
  goal: 'Enable multiple users to collaborate on boards in real-time',
  description: 'Add real-time updates and handle concurrent modifications',
  estimatedTime: '20 minutes',
  learningObjectives: [
    'Implement WebSocket for real-time updates',
    'Handle concurrent card movements',
    'Design for eventual consistency',
    'Broadcast changes to all connected clients',
  ],

  messages: [
    {
      trigger: { type: 'on_load' },
      message: '🎯 Level 2 Goal: Real-time collaboration!\n\nWhen one user moves a card, everyone viewing that board should see the update instantly. This requires WebSocket connections for push updates.',
      messageType: 'info',
      icon: '🎯',
      priority: 90,
    },
    {
      trigger: { type: 'component_added', componentType: 'websocket' },
      message: '✅ WebSocket added! This enables real-time bidirectional communication.\n\n💡 How it works:\n• User A moves a card\n• App server updates database\n• WebSocket broadcasts change to Users B, C, D\n• Everyone sees the update instantly!',
      messageType: 'success',
      icon: '✅',
      showOnce: true,
    },
    {
      trigger: { type: 'component_added', componentType: 'redis' },
      message: '✅ Redis added! Great for:\n• Pub/Sub (broadcast card movements)\n• Session storage (track who\'s viewing each board)\n• Presence detection (show who\'s online)\n\nConnect it to your App Server!',
      messageType: 'success',
      icon: '✅',
      showOnce: true,
    },
    {
      trigger: { type: 'validator_failed', validatorName: 'Real-Time Updates' },
      message: '⚠️ Real-time updates not configured!\n\nFor collaboration, you need:\n1. WebSocket for push notifications\n2. Redis Pub/Sub to broadcast changes across app server instances\n\nArchitecture:\nClient ←→ WebSocket ←→ App Server ←→ Redis Pub/Sub',
      messageType: 'warning',
      icon: '⚠️',
    },
    {
      trigger: { type: 'all_tests_passed' },
      message: '🎉 Excellent! You\'ve built a collaborative system!\n\nMultiple users can now work on the same board simultaneously. Next level: scaling to handle thousands of concurrent users!',
      messageType: 'celebration',
      icon: '🎉',
      action: {
        type: 'next_level',
      },
    },
  ],

  unlockHints: [
    {
      condition: { minAttempts: 2 },
      hint: '💡 Hint: Real-time updates require bidirectional communication. HTTP polling is inefficient. What protocol is designed for real-time push updates?',
      hintLevel: 1,
    },
    {
      condition: { minAttempts: 3 },
      hint: '🔍 Specific hint: Add WebSocket for real-time updates. For multi-server deployments, use Redis Pub/Sub to broadcast changes across all app server instances.',
      hintLevel: 2,
    },
    {
      condition: { minAttempts: 5, minTimeSeconds: 240 },
      hint: '🎯 Direct help:\n1. Add WebSocket (connects clients to server)\n2. Add Redis (Pub/Sub for broadcasting)\n3. Connect: Client ←→ WebSocket ←→ App Server ←→ Redis',
      hintLevel: 3,
    },
  ],
};

const level3Config: LevelCoachConfig = {
  level: 3,
  title: 'Level 3: Scale to 10,000 Concurrent Users',
  goal: 'Handle high concurrency with optimistic locking and caching',
  description: 'Scale the system to support thousands of simultaneous collaborators',
  estimatedTime: '25 minutes',
  learningObjectives: [
    'Implement optimistic locking for concurrent updates',
    'Use caching to reduce database load',
    'Handle conflict resolution (two users move same card)',
    'Scale horizontally with load balancing',
  ],

  messages: [
    {
      trigger: { type: 'on_load' },
      message: '🎯 Level 3 Goal: Scale to 10,000 concurrent users!\n\nChallenges:\n• High read load (users viewing boards)\n• Concurrent writes (multiple users moving cards)\n• Conflict resolution (what if two users move the same card?)\n\nYou\'ll need caching and smart conflict handling.',
      messageType: 'info',
      icon: '🎯',
      priority: 90,
    },
    {
      trigger: { type: 'bottleneck_detected', component: 'postgresql' },
      message: '⚠️ Database bottleneck detected!\n\nWith 10,000 users reading boards constantly, PostgreSQL is overwhelmed. Add a cache (Redis) to serve read-heavy queries.\n\n💡 Cache board contents for 30-60 seconds. Invalidate on updates.',
      messageType: 'warning',
      icon: '⚠️',
    },
    {
      trigger: { type: 'component_added', componentType: 'redis' },
      message: '✅ Redis cache added!\n\n💡 Caching strategy:\n• Cache board contents (lists + cards)\n• Use cache_aside pattern\n• TTL: 60 seconds\n• Invalidate on card movements\n\nThis can reduce database reads by 80-90%!',
      messageType: 'success',
      icon: '✅',
      showOnce: true,
    },
    {
      trigger: { type: 'component_added', componentType: 'load_balancer' },
      message: '✅ Load Balancer added! This distributes WebSocket connections across multiple app servers.\n\n💡 Don\'t forget:\n• Redis Pub/Sub to sync across servers\n• Sticky sessions for WebSocket persistence',
      messageType: 'success',
      icon: '✅',
      showOnce: true,
    },
    {
      trigger: { type: 'all_tests_passed' },
      message: '🎉 Incredible! You\'ve scaled Trello to 10,000 concurrent users!\n\nYou\'ve mastered:\n✓ CRUD operations with relational data\n✓ Real-time collaboration with WebSocket\n✓ Caching for high read loads\n✓ Horizontal scaling with load balancing\n\nGreat work! 🚀',
      messageType: 'celebration',
      icon: '🎉',
      action: {
        type: 'next_problem',
        problemId: 'twitter',
      },
    },
  ],

  unlockHints: [
    {
      condition: { minAttempts: 2 },
      hint: '💡 Hint: With 10,000 users constantly reading boards, the database will be a bottleneck. What can you add between the app server and database to reduce read load?',
      hintLevel: 1,
    },
    {
      condition: { minAttempts: 4 },
      hint: '🔍 Specific hint:\n1. Add Redis cache for board contents (reduce DB reads)\n2. Add Load Balancer for horizontal scaling\n3. Use optimistic locking (version numbers) for concurrent card updates',
      hintLevel: 2,
    },
    {
      condition: { minAttempts: 6, minTimeSeconds: 300 },
      hint: '🎯 Direct solution:\n• Add Redis cache between App Server and PostgreSQL\n• Add Load Balancer before App Servers\n• Configure Redis for both caching AND Pub/Sub\n• Use cache_aside strategy with 60s TTL',
      hintLevel: 3,
    },
  ],
};

export const trelloCoachConfig: ProblemCoachConfig = {
  problemId: 'trello',
  archetype: 'crud',
  levelConfigs: {
    1: level1Config,
    2: level2Config,
    3: level3Config,
  },
  celebrationMessages: {
    1: '🎉 Level 1 Complete!\n\nYou\'ve built a working CRUD system! You now understand:\n• Relational data modeling (boards → lists → cards)\n• Basic database operations\n• Client-server architecture\n\nNext: Add real-time collaboration!',
    2: '🎉 Level 2 Complete!\n\nYou\'ve enabled real-time collaboration! You\'ve learned:\n• WebSocket for bidirectional communication\n• Redis Pub/Sub for broadcasting\n• Handling concurrent updates\n\nNext: Scale to thousands of users!',
    3: '🎉 Trello Complete! 🚀\n\nYou\'ve mastered CRUD at scale! Key achievements:\n• ACID transactions for data integrity\n• Real-time updates for collaboration\n• Caching for high read loads\n• Horizontal scaling for concurrency\n\nYou\'re ready for more complex problems!',
  },
  nextProblemRecommendation: 'twitter',
  prerequisites: [],
  estimatedTotalTime: '60 minutes',
};

export function getTrelloLevelConfig(level: number): LevelCoachConfig | null {
  return trelloCoachConfig.levelConfigs[level] || null;
}
