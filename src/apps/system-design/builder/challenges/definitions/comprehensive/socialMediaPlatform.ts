import { ProblemDefinition } from '../../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../../validation/validators/commonValidators';
import { generateScenarios } from '../../scenarioGenerator';
import { problemConfigs } from '../../problemConfigs';
import { generateCodeChallengesFromFRs } from '../../../utils/codeChallengeGenerator';

/**
 * Comprehensive Social Media Platform
 * 
 * This problem consolidates all streaming/real-time concepts into a single, realistic application.
 * Users will progressively build a Twitter/Slack-scale social platform that covers:
 * 
 * STREAMING CONCEPTS COVERED:
 * 1. Real-time Push Notifications - WebSocket delivery for instant updates
 * 2. Event Log Streaming - Centralized logging with Kafka
 * 3. Pub/Sub Messaging - Topic-based message routing
 * 4. Real-time Chat - Instant messaging with message ordering
 * 5. Live Feed Updates - Real-time feed updates with WebSockets
 * 6. Presence Tracking - Online/offline status
 * 7. Message Queuing - Async task processing
 * 8. Stream Processing - Real-time analytics
 * 
 * The problem is designed for progressive learning:
 * - Start with basic post creation and feed
 * - Add real-time notifications
 * - Introduce chat messaging
 * - Add presence tracking
 * - Scale with message queues
 * - Add analytics and monitoring
 */
export const comprehensiveSocialMediaPlatformDefinition: ProblemDefinition = {
  id: 'comprehensive-social-media-platform',
  title: 'Social Media Platform (Twitter/Slack-scale)',
  description: `Design a comprehensive social media platform (like Twitter or Slack) that handles:
  
  **Core User Features:**
  - Post updates and share content with followers
  - Real-time feed updates (see new posts instantly)
  - Direct messaging and group chat
  - Real-time notifications (likes, comments, mentions)
  - Online presence indicators (who's online)
  - Follow/unfollow users
  - Like, comment, and share posts
  
  **Scale Requirements:**
  - Support 100M active users
  - Handle 10k posts/sec during peak hours
  - Deliver 100k notifications/sec
  - Maintain millions of WebSocket connections
  - Process 20k chat messages/sec
  - Provide sub-100ms message delivery
  
  **Key Learning Objectives:**
  This problem teaches you to build a production-grade real-time system with:
  - WebSocket connections for real-time updates
  - Fan-out pattern for timeline updates (write fan-out for normal users, read fan-out for celebrities)
  - Pub/sub pattern for fan-out notifications
  - Message queues (Kafka) for reliable delivery
  - Event sourcing for audit logs and timeline reconstruction - DDIA Ch. 12
  - Presence tracking with Redis
  - Message ordering and consistency
  - Backpressure handling
  - Stream processing for analytics (real-time engagement metrics) - DDIA Ch. 11
  - CQRS pattern (separate read model for feeds, write model for posts) - DDIA Ch. 12
  - Change Data Capture (CDC) to sync data across services - DDIA Ch. 12
  - Lambda/Kappa architecture for analytics (batch + stream processing) - DDIA Ch. 12
  
  **Progressive Approach:**
  Start simple with basic posts, then progressively add:
  1. Post creation and feed display
  2. Real-time notifications
  3. Direct messaging
  4. Group chat
  5. Presence tracking
  6. Analytics and monitoring`,

  userFacingFRs: [
    // Core Social Features
    'Users can create posts with text, images, and videos',
    'Users can follow/unfollow other users',
    'Users can view their personalized feed of posts from followed users',
    'Users can like, comment, and share posts',
    'Users can delete their own posts',
    
    // Fan-out Pattern (Twitter Timeline Problem)
    'When a user with <10K followers posts, system writes to all follower timelines immediately (write fan-out)',
    'When a celebrity with >10K followers posts, system stores post in their timeline only (read fan-out)',
    'When reading timeline, system merges posts from followed users + celebrity posts (hybrid approach)',
    'System handles users with 1M+ followers efficiently without blocking',
    
    // Real-time Features
    'Users see new posts appear in their feed in real-time (no refresh needed)',
    'Users receive instant notifications for likes, comments, and mentions',
    'Users see online/offline status of other users',
    'Notification badge updates in real-time',
    
    // Messaging Features
    'Users can send direct messages to other users',
    'Users can create group chats with multiple participants',
    'Users see when someone is typing in a chat',
    'Messages are delivered instantly (<100ms)',
    'Message history is preserved and searchable',
    
    // Presence Features
    'Users can see who is currently online',
    'Users can set their status (online, away, do not disturb)',
    'Users can see when someone was last active',
    
    // Event Sourcing & CQRS (DDIA Ch. 12)
    'All post actions (create, edit, delete) are stored as immutable events',
    'Timeline can be reconstructed from event log',
    'System uses CQRS - separate read model (optimized timeline queries) and write model (post creation)',
    'Analytics use Lambda architecture - batch processing for accuracy, stream processing for real-time',
    'Data changes are captured via CDC and synced to search index and analytics systems',
  ],

  userFacingNFRs: [
    // Performance
    'Feed loads in <500ms at P95',
    'New posts appear in feed within 100ms',
    'Post latency: <100ms for normal users (<10K followers)',
    'Timeline read: <200ms including celebrity post merge',
    'Notifications delivered within 50ms at P95',
    'Chat messages delivered within 100ms',
    'Presence updates propagate within 5 seconds',
    
    // Scale
    'Support 100M active users',
    'Handle 10,000 posts/sec during peak hours',
    'Handle celebrity posts with 1M+ followers efficiently',
    'Deliver 100,000 notifications/sec',
    'Maintain 10M concurrent WebSocket connections',
    'Process 20,000 chat messages/sec',
    
    // Reliability
    'System availability of 99.9%',
    'Zero message loss (all messages persisted)',
    'Message ordering guaranteed per chat/channel',
    'Graceful handling of connection drops (auto-reconnect)',
    
    // Consistency
    'Users see their own posts immediately (read-after-write consistency)',
    'Message ordering preserved in chat (FIFO per channel)',
    'Notification count eventually consistent (may lag by 1-2 seconds)',
  ],

  functionalRequirements: {
    mustHave: [
      // Frontend & Load Balancing
      {
        type: 'load_balancer',
        reason: 'Need sticky load balancer for WebSocket connections (session affinity)',
      },
      
      // Application Layer
      {
        type: 'compute',
        reason: 'Need application servers for REST API (posts, follows, likes)',
      },
      {
        type: 'compute',
        reason: 'Need WebSocket servers for real-time connections (feed updates, notifications)',
      },
      {
        type: 'compute',
        reason: 'Need chat servers for messaging with message ordering',
      },
      
      // Message Queue / Streaming
      {
        type: 'message_queue',
        reason: 'Need Kafka for event streaming (post created, like added, comment added)',
      },
      {
        type: 'message_queue',
        reason: 'Need Redis pub/sub for real-time notification fan-out',
      },
      {
        type: 'message_queue',
        reason: 'Need message queue for async tasks (send emails, generate thumbnails)',
      },
      
      // Caching Layer
      {
        type: 'cache',
        reason: 'Need Redis for WebSocket connection registry (user → server mapping)',
      },
      {
        type: 'cache',
        reason: 'Need Redis for presence tracking (online/offline status)',
      },
      {
        type: 'cache',
        reason: 'Need Redis for feed cache (recent posts)',
      },
      
      // Database Layer
      {
        type: 'storage',
        reason: 'Need primary database for users, posts, follows, likes',
      },
      {
        type: 'storage',
        reason: 'Need database for chat messages (append-only log)',
      },
      {
        type: 'storage',
        reason: 'Need database for notifications',
      },
      
      // Object Storage
      {
        type: 'object_storage',
        reason: 'Need object storage (S3) for images and videos',
      },
      
      // CDN
      {
        type: 'cdn',
        reason: 'Need CDN for serving media files (images, videos)',
      },
    ],
    
    mustConnect: [
      // User Traffic Flow
      {
        from: 'client',
        to: 'load_balancer',
        reason: 'Users connect through load balancer',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes REST API requests to app servers',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes WebSocket connections to WS servers (sticky sessions)',
      },
      
      // Post Creation Flow
      {
        from: 'compute',
        to: 'storage',
        reason: 'App server writes post to database',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'App server publishes "post created" event to Kafka',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Fan-out worker consumes event and notifies followers',
      },
      
      // Real-time Notification Flow
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'App server publishes notification to Redis pub/sub',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'WebSocket servers subscribe to notifications',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'WS server looks up user connection in registry',
      },
      {
        from: 'compute',
        to: 'client',
        reason: 'WS server pushes notification to user via WebSocket',
      },
      
      // Chat Message Flow
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Chat server publishes message to Kafka (for ordering)',
      },
      {
        from: 'message_queue',
        to: 'storage',
        reason: 'Kafka consumer persists message to database',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Kafka consumer forwards message to recipients via WebSocket',
      },
      
      // Presence Tracking
      {
        from: 'compute',
        to: 'cache',
        reason: 'WS server updates user presence in Redis (heartbeat)',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'WS server publishes presence change events',
      },
      
      // Feed Loading
      {
        from: 'compute',
        to: 'cache',
        reason: 'App server checks feed cache in Redis',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'App server queries database on cache miss',
      },
      
      // Media Handling
      {
        from: 'compute',
        to: 'object_storage',
        reason: 'App server uploads images/videos to S3',
      },
      {
        from: 'cdn',
        to: 'object_storage',
        reason: 'CDN pulls media from S3 origin',
      },
      {
        from: 'client',
        to: 'cdn',
        reason: 'Users load media through CDN',
      },
    ],
    
    dataModel: {
      entities: [
        'user',
        'post',
        'follow',
        'like',
        'comment',
        'notification',
        'message',
        'chat',
        'presence',
        'connection',
      ],
      fields: {
        user: ['id', 'username', 'email', 'avatar_url', 'bio', 'created_at'],
        post: ['id', 'user_id', 'text', 'media_urls', 'created_at', 'like_count', 'comment_count'],
        follow: ['follower_id', 'followee_id', 'created_at'],
        like: ['user_id', 'post_id', 'created_at'],
        comment: ['id', 'post_id', 'user_id', 'text', 'created_at'],
        notification: ['id', 'user_id', 'type', 'actor_id', 'post_id', 'read', 'created_at'],
        message: ['id', 'chat_id', 'user_id', 'text', 'created_at', 'sequence_number'],
        chat: ['id', 'type', 'participant_ids', 'created_at'],
        presence: ['user_id', 'status', 'last_seen', 'updated_at'],
        connection: ['user_id', 'server_id', 'socket_id', 'connected_at'],
      },
      accessPatterns: [
        { type: 'write', frequency: 'very_high' },         // Posts, messages, notifications
        { type: 'read_by_key', frequency: 'very_high' },   // User lookups, connection registry
        { type: 'read_by_query', frequency: 'high' },      // Feed queries, message history
        { type: 'read_by_range', frequency: 'medium' },    // Timeline queries
      ],
    },
  },

  scenarios: generateScenarios('comprehensive-social-media-platform', problemConfigs['comprehensive-social-media-platform']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

// Auto-generate code challenges from functional requirements
(comprehensiveSocialMediaPlatformDefinition as any).codeChallenges = generateCodeChallengesFromFRs(comprehensiveSocialMediaPlatformDefinition);

