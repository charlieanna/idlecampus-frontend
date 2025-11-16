import { ProblemCoachConfig, LevelCoachConfig } from '../types/coachConfig';

/**
 * Slack Coach Configuration
 * Pattern: Real-Time Messaging + Presence + Channels
 * Focus: WebSocket, message ordering, presence detection, scalability
 */

const level1Config: LevelCoachConfig = {
  level: 1,
  title: 'Level 1: Basic Messaging',
  goal: 'Build a system where users can send messages in channels and DMs',
  description: 'Learn the fundamentals of chat application architecture',
  estimatedTime: '16 minutes',
  learningObjectives: [
    'Understand real-time messaging requirements',
    'Design channel-based messaging',
    'Implement message persistence',
    'Handle direct messages (1-on-1 chat)',
  ],

  messages: [
    {
      trigger: { type: 'on_first_visit' },
      message: '👋 Welcome to Slack! You\'re building a real-time team collaboration platform. Unlike social feeds, messages must arrive instantly (sub-second latency).',
      messageType: 'info',
      icon: '👋',
      priority: 100,
      showOnce: true,
    },
    {
      trigger: { type: 'on_load' },
      message: '🎯 Goal: Send and receive messages in real-time\n\nUsers should be able to:\n• Send messages in channels\n• Send direct messages (DMs)\n• See message history\n• Upload files\n\n💡 Key: Messages must be instant (no polling, no refresh)!',
      messageType: 'info',
      icon: '🎯',
      priority: 90,
    },
    {
      trigger: { type: 'component_added', componentType: 'app_server' },
      message: '✅ App Server added!\n\nHandles:\n• POST /message - Send message\n• GET /channel/messages - Fetch history\n• POST /upload - File upload\n\nBut wait... how do messages arrive instantly without polling? 🤔',
      messageType: 'success',
      icon: '✅',
      showOnce: true,
    },
    {
      trigger: { type: 'component_added', componentType: 'websocket' },
      message: '✅ WebSocket is the KEY to real-time messaging!\n\n💡 How it works:\n1. Client connects to WebSocket (persistent connection)\n2. User sends message via WebSocket\n3. Server pushes message to all channel members\n4. Instant delivery (no polling!)\n\n**HTTP**: Request-response\n**WebSocket**: Bidirectional, persistent',
      messageType: 'success',
      icon: '✅',
      showOnce: true,
    },
    {
      trigger: { type: 'component_added', componentType: 'postgresql' },
      message: '✅ PostgreSQL for message persistence!\n\nStores:\n• Messages (id, channel_id, user_id, content, timestamp)\n• Channels (id, workspace_id, name)\n• Users (id, email, name)\n• Threads, reactions, mentions\n\n💡 WebSocket for real-time, DB for history!',
      messageType: 'success',
      icon: '✅',
      showOnce: true,
    },
    {
      trigger: { type: 'component_added', componentType: 's3' },
      message: '✅ S3 for file storage!\n\nSlack allows:\n• Images, PDFs, code snippets\n• Max 1GB per file\n• Files shared in channels\n\nStore files in S3, metadata in PostgreSQL.',
      messageType: 'success',
      icon: '✅',
      showOnce: true,
    },
    {
      trigger: { type: 'validator_failed', validatorName: 'Valid Connection Flow' },
      message: '🔗 Connect the components!\n\nMessage flow:\n1. Client ←→ WebSocket (bidirectional)\n2. WebSocket ↔ App Server (handle messages)\n3. App Server → PostgreSQL (persist messages)\n4. App Server → S3 (store files)\n\nReal-time + Persistence!',
      messageType: 'hint',
      icon: '💡',
    },
    {
      trigger: { type: 'all_tests_passed' },
      message: '🎉 Messages are working in real-time!\n\nBut there\'s a problem: with many users, how does the server know who\'s online? Let\'s add presence detection!',
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
      hint: '💡 Hint: Real-time messaging needs:\n1. Persistent connection (not HTTP polling)\n2. Database for message history\n3. Object storage for files\n\nWhat protocol enables bidirectional real-time communication?',
      hintLevel: 1,
    },
    {
      condition: { minAttempts: 3 },
      hint: '🔍 Specific hint: Add:\n1. WebSocket (real-time bidirectional)\n2. App Server (business logic)\n3. PostgreSQL (message persistence)\n4. S3 (file storage)\n\nConnect: Client ←→ WebSocket ←→ App → PostgreSQL + S3',
      hintLevel: 2,
    },
    {
      condition: { minAttempts: 5, minTimeSeconds: 190 },
      hint: '🎯 Direct solution:\n• WebSocket for instant messaging\n• App Server for logic\n• PostgreSQL for messages/channels\n• S3 for file attachments\n\nFlow: Client ←→ WebSocket ←→ App → PostgreSQL',
      hintLevel: 3,
    },
  ],
};

const level2Config: LevelCoachConfig = {
  level: 2,
  title: 'Level 2: Presence & Message Ordering',
  goal: 'Add presence detection and ensure message ordering across servers',
  description: 'Handle online/offline status and distributed messaging',
  estimatedTime: '22 minutes',
  learningObjectives: [
    'Implement presence detection (who\'s online)',
    'Use Redis for session management',
    'Ensure message ordering in distributed systems',
    'Handle typing indicators',
  ],

  messages: [
    {
      trigger: { type: 'on_load' },
      message: '🎯 Level 2 Goals:\n\n1. **Presence**: Show who\'s online/offline/away\n2. **Message ordering**: Messages must arrive in order\n3. **Typing indicators**: "Alice is typing..."\n4. **Multi-server**: Scale with load balancer\n\nChallenges ahead!',
      messageType: 'info',
      icon: '🎯',
      priority: 90,
    },
    {
      trigger: { type: 'component_added', componentType: 'redis' },
      message: '✅ Redis for presence and pub/sub!\n\n💡 Use cases:\n1. **Presence**: `user:{id}:status` = "online" with TTL\n2. **Typing**: `channel:{id}:typing` = [user_ids]\n3. **Pub/Sub**: Broadcast messages across app servers\n4. **Session store**: WebSocket connection tracking\n\n**Heartbeat**: Client sends ping every 30s → Redis updates TTL',
      messageType: 'success',
      icon: '✅',
      showOnce: true,
    },
    {
      trigger: { type: 'component_added', componentType: 'load_balancer' },
      message: '✅ Load Balancer for horizontal scaling!\n\n💡 Problem: User A on Server 1, User B on Server 2.\nHow does A\'s message reach B?\n\n**Solution**: Redis Pub/Sub!\n1. Server 1 publishes to Redis channel\n2. Server 2 subscribes to same channel\n3. Server 2 pushes to B via WebSocket\n\n**Sticky sessions** keep user on same server.',
      messageType: 'success',
      icon: '✅',
      showOnce: true,
    },
    {
      trigger: { type: 'validator_failed', validatorName: 'Presence Detection' },
      message: '⚠️ Presence detection not configured!\n\nImplementation:\n1. Client connects → Store in Redis: `user:{id}:online`\n2. Client sends heartbeat every 30s → Refresh TTL\n3. TTL expires → User offline\n4. Broadcast status changes via Redis Pub/Sub\n\nResult: Green dot for online users!',
      messageType: 'warning',
      icon: '⚠️',
    },
    {
      trigger: { type: 'validator_failed', validatorName: 'Message Ordering' },
      message: '⚠️ Messages arriving out of order!\n\nCauses:\n• Network delays\n• Multiple servers processing messages\n\n💡 Solutions:\n1. **Timestamps**: Server assigns timestamp on receive\n2. **Sequence IDs**: Incrementing counter per channel\n3. **Vector clocks**: For distributed ordering\n\nSlack uses server timestamps + sequence IDs.',
      messageType: 'warning',
      icon: '⚠️',
    },
    {
      trigger: { type: 'all_tests_passed' },
      message: '🎉 Presence works and messages are ordered!\n\nYou\'ve learned:\n• Redis for presence tracking\n• Pub/Sub for multi-server messaging\n• Message ordering strategies\n\nNext: Scale to millions of messages!',
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
      hint: '💡 Hint: Presence needs fast in-memory storage with TTL. Multi-server messaging needs Pub/Sub. Which data store provides both?',
      hintLevel: 1,
    },
    {
      condition: { minAttempts: 4 },
      hint: '🔍 Specific hint: Add:\n1. Redis (presence, pub/sub, sessions)\n2. Load Balancer (multiple app servers)\n\nPresence: Store in Redis with TTL\nMessaging: Pub/Sub across servers',
      hintLevel: 2,
    },
    {
      condition: { minAttempts: 6, minTimeSeconds: 250 },
      hint: '🎯 Direct solution:\n• Redis for `user:{id}:status` with 30s TTL\n• Redis Pub/Sub for cross-server messaging\n• Load Balancer with sticky sessions\n• Server timestamps for message ordering',
      hintLevel: 3,
    },
  ],
};

const level3Config: LevelCoachConfig = {
  level: 3,
  title: 'Level 3: Scale to Millions of Messages',
  goal: 'Handle enterprise scale with search, analytics, and archival',
  description: 'Optimize for high message volume and long message history',
  estimatedTime: '26 minutes',
  learningObjectives: [
    'Implement full-text search for messages',
    'Handle message archival (1M+ messages per channel)',
    'Add analytics and monitoring',
    'Optimize database for high write throughput',
  ],

  messages: [
    {
      trigger: { type: 'on_load' },
      message: '🎯 Level 3: Enterprise scale!\n\nChallenges:\n• Channels with 1M+ messages (search becomes slow)\n• 10K+ messages/sec across all channels\n• Full-text search across all messages\n• Message retention policies (delete old data)\n\nTime to optimize!',
      messageType: 'info',
      icon: '🎯',
      priority: 90,
    },
    {
      trigger: { type: 'component_added', componentType: 'elasticsearch' },
      message: '✅ Elasticsearch for message search!\n\n💡 Why?\n• PostgreSQL LIKE queries are SLOW on millions of messages\n• Elasticsearch is purpose-built for full-text search\n\n**Features**:\n• Search by keyword, user, date range\n• Autocomplete\n• Relevance ranking\n• Highlighting matches\n\n**Index**: Every message → Elasticsearch via message queue',
      messageType: 'success',
      icon: '✅',
      showOnce: true,
    },
    {
      trigger: { type: 'bottleneck_detected', component: 'postgresql' },
      message: '⚠️ Database write bottleneck!\n\nProblem: 10K messages/sec overwhelming PostgreSQL.\n\n💡 Solutions:\n1. **Write-through cache**: Cache recent messages in Redis\n2. **Message queue**: Buffer writes during spikes\n3. **Sharding**: Partition by workspace_id\n4. **Cassandra**: Time-series optimized DB for messages\n\nSlack uses Vitess (sharded MySQL).',
      messageType: 'warning',
      icon: '⚠️',
    },
    {
      trigger: { type: 'component_added', componentType: 'message_queue' },
      message: '✅ Message Queue for async processing!\n\n💡 Use cases:\n1. **Search indexing**: Message → Queue → Elasticsearch\n2. **Analytics**: Message → Queue → Data warehouse\n3. **Notifications**: Message → Queue → Email/Push\n4. **Webhooks**: Message → Queue → 3rd party integrations\n\nDecouples real-time delivery from heavy processing!',
      messageType: 'success',
      icon: '✅',
      showOnce: true,
    },
    {
      trigger: { type: 'component_added', componentType: 'cassandra' },
      message: '✅ Cassandra for message storage at scale!\n\n💡 Why Cassandra?\n• Optimized for high write throughput (append-only)\n• Time-series data model (messages sorted by time)\n• Horizontal scalability (add more nodes)\n• Handles billions of messages\n\n**Model**: `messages_by_channel` partitioned by (workspace_id, channel_id)',
      messageType: 'success',
      icon: '✅',
      showOnce: true,
    },
    {
      trigger: { type: 'all_tests_passed' },
      message: '🎉 Slack is production-ready at enterprise scale! 🚀\n\nYou\'ve mastered:\n✓ Real-time messaging with WebSocket\n✓ Presence detection with Redis\n✓ Message ordering in distributed systems\n✓ Full-text search with Elasticsearch\n✓ Scaling to millions of messages/sec\n✓ Multi-server architecture with Pub/Sub\n\nThis is real Slack architecture!',
      messageType: 'celebration',
      icon: '🎉',
      action: {
        type: 'next_problem',
        problemId: 'discord',
      },
    },
  ],

  unlockHints: [
    {
      condition: { minAttempts: 2 },
      hint: '💡 Hint: Three optimizations:\n1. Search: Use specialized search engine\n2. Write throughput: Use time-series optimized DB\n3. Async processing: Decouple with message queue',
      hintLevel: 1,
    },
    {
      condition: { minAttempts: 4 },
      hint: '🔍 Specific hint:\n1. Elasticsearch for full-text search\n2. Message Queue for async indexing/analytics\n3. Consider Cassandra for message storage (high write throughput)\n4. Redis cache for recent messages (last 100 per channel)',
      hintLevel: 2,
    },
    {
      condition: { minAttempts: 6, minTimeSeconds: 300 },
      hint: '🎯 Direct solution:\n• Elasticsearch for search (indexed via Kafka)\n• Kafka/RabbitMQ for async processing\n• Cassandra for message storage (billions of messages)\n• Redis for recent message cache\n• Keep PostgreSQL for metadata (users, channels, workspaces)',
      hintLevel: 3,
    },
  ],
};

export const slackCoachConfig: ProblemCoachConfig = {
  problemId: 'slack',
  archetype: 'messaging',
  levelConfigs: {
    1: level1Config,
    2: level2Config,
    3: level3Config,
  },
  celebrationMessages: {
    1: '🎉 Level 1 Complete!\n\nYou\'ve built real-time messaging! You understand:\n• WebSocket for bidirectional communication\n• Message persistence in database\n• File sharing with object storage\n\nNext: Add presence and multi-server support!',
    2: '🎉 Level 2 Complete!\n\nPresence and ordering work! You\'ve learned:\n• Redis for presence detection\n• Pub/Sub for multi-server messaging\n• Message ordering strategies\n• Typing indicators\n\nNext: Scale to enterprise!',
    3: '🎉 Slack Complete! 💬\n\nYou\'ve mastered real-time messaging at scale:\n✓ WebSocket for instant delivery\n✓ Presence with Redis\n✓ Distributed messaging with Pub/Sub\n✓ Full-text search with Elasticsearch\n✓ Billions of messages with Cassandra\n✓ Async processing with queues\n\nThis is production Slack architecture! 🚀',
  },
  nextProblemRecommendation: 'discord',
  prerequisites: ['trello'],
  estimatedTotalTime: '64 minutes',
};

export function getSlackLevelConfig(level: number): LevelCoachConfig | null {
  return slackCoachConfig.levelConfigs[level] || null;
}
