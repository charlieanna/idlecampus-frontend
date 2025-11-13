import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../../validation/validators/commonValidators';
import {
  urlShorteningValidator,
  urlRedirectValidator,
  analyticsTrackingValidator,
  photoUploadValidator,
  feedViewValidator,
  basicFunctionalValidator,
} from '../../../validation/validators/featureValidators';
import { generateScenarios } from '../../scenarioGenerator';
import { problemConfigs } from '../../problemConfigs';

/**
 * Tutorial Problems - Complete Set
 * Auto-generated from ALL_PROBLEMS.md
 * Total: 4 problems
 */

/**
 * 📚 Tutorial 1: Personal Blog Platform
 * From extracted-problems/system-design/tutorial.md
 */
export const tutorialSimpleBlogProblemDefinition: ProblemDefinition = {
  id: 'tutorial-simple-blog',
  title: '📚 Tutorial 1: Personal Blog Platform',
  description: `Welcome to your first system design tutorial! 🎉

In this tutorial, you'll learn:
- How to drag and drop components onto the canvas
- How to connect components together
- How tier validation works
- Basic scaling concepts

**Scenario**: You're building a personal blog for a tech writer. Right now it gets 100 requests/sec, but it's going viral and you need to scale to 1,000 requests/sec while maintaining high availability.

**How this works**:
1. Read each tier's requirements
2. Drag components from the palette on the right
3. Connect them by clicking and dragging between nodes
4. Watch the tier checkmarks turn green ✅
5. Read the hints if you get stuck!
- Users can read blog posts
- Users can view comments
- Authors can publish new posts
- System handles both reads (90%) and writes (10%)`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Users can read blog posts',
    'Users can view comments',
    'Authors can publish new posts',
    'System handles both reads (90%) and writes (10%)'
  ],
  userFacingNFRs: [
    'Latency: P99 < 200ms',
    'Request Rate: Start: 100 req/sec, Target: 1,000 req/sec',
    'Dataset Size: 10,000 blog posts, 100,000 comments (~100MB)',
    'Availability: 99.9% uptime (no single point of failure)'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Blog Readers (redirect_client) for learn the basics of system design',
      },
      {
        type: 'load_balancer',
        reason: 'Need Load Balancer (lb) for learn the basics of system design',
      },
      {
        type: 'storage',
        reason: 'Need Primary DB (db_primary) for learn the basics of system design',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Blog Readers routes to Load Balancer',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Load Balancer routes to App Servers',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'App Servers routes to Primary DB',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'App Servers routes to Read Replica',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('tutorial-simple-blog', problemConfigs['tutorial-simple-blog'], [
    'Users can read blog posts',
    'Users can view comments',
    'Authors can publish new posts',
    'System handles both reads (90%) and writes (10%)'
  ]),

  validators: [
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * 📚 Tutorial 2: Image Hosting Service
 * From extracted-problems/system-design/tutorial.md
 */
export const tutorialIntermediateImagesProblemDefinition: ProblemDefinition = {
  id: 'tutorial-intermediate-images',
  title: '📚 Tutorial 2: Image Hosting Service',
  description: `Ready for the next level? 🚀

In this tutorial, you'll learn:
- How to use CDN for global content delivery
- Cache hit rate tuning and TTL strategies
- Object storage vs database storage
- Parameter configuration (click on nodes to adjust!)
- Cost optimization for storage-heavy workloads

**Scenario**: You're building an image hosting service like Imgur. Users upload images and share links. The service serves 10,000 image requests/sec globally, stores 1M images (5TB), and needs to be cost-efficient.

**New Concepts**:
- **CDN (Content Delivery Network)**: Caches images at edge locations worldwide
- **Object Storage (S3)**: Cheap, scalable storage for images
- **Cache Hit Rate**: % of requests served from cache (higher = better)
- **TTL (Time To Live)**: How long to cache before refreshing

**Pro Tip**: Click on any component to see and adjust its parameters!
- Users can upload images (write)
- Users can view images via URLs (read)
- Images are served globally with low latency
- Support 1M stored images (5TB total)`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Users can upload images (write)',
    'Users can view images via URLs (read)',
    'Images are served globally with low latency',
    'Support 1M stored images (5TB total)',
    '95% reads (image views), 5% writes (uploads)'
  ],
  userFacingNFRs: [
    'Latency: P99 < 100ms globally (P50 < 20ms)',
    'Request Rate: 10,000 requests/sec (9,500 reads, 500 writes)',
    'Dataset Size: 1M images, 5TB storage, growing 100GB/month',
    'Availability: 99.99% uptime',
    'Durability: 99.999999999% (eleven nines)'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Global Users (redirect_client) for learn cdn, caching, and storage optimization',
      },
      {
        type: 'cdn',
        reason: 'Need CloudFront CDN (cdn) for learn cdn, caching, and storage optimization',
      },
      {
        type: 'load_balancer',
        reason: 'Need ALB (lb) for learn cdn, caching, and storage optimization',
      },
      {
        type: 'cache',
        reason: 'Need Redis Cache (cache) for learn cdn, caching, and storage optimization',
      },
      {
        type: 'storage',
        reason: 'Need Primary DB (db_primary) for learn cdn, caching, and storage optimization',
      },
      {
        type: 'object_storage',
        reason: 'Need S3 Storage (s3) for learn cdn, caching, and storage optimization',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'cdn',
        reason: 'Global Users routes to CloudFront CDN',
      },
      {
        from: 'cdn',
        to: 'load_balancer',
        reason: 'CloudFront CDN routes to ALB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'ALB routes to App Servers',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'App Servers routes to Redis Cache',
      },
      {
        from: 'compute',
        to: 'object_storage',
        reason: 'App Servers routes to S3 Storage',
      },
      {
        from: 'cache',
        to: 'storage',
        reason: 'Redis Cache routes to Primary DB',
      },
      {
        from: 'cache',
        to: 'compute',
        reason: 'Redis Cache routes to Read Replica',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('tutorial-intermediate-images', problemConfigs['tutorial-intermediate-images'], [
    'Users can upload images (write)',
    'Users can view images via URLs (read)',
    'Images are served globally with low latency',
    'Support 1M stored images (5TB total)',
    '95% reads (image views), 5% writes (uploads)'
  ]),

  validators: [
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * 📚 Tutorial 3: Real-Time Chat System
 * From extracted-problems/system-design/tutorial.md
 */
export const tutorialAdvancedChatProblemDefinition: ProblemDefinition = {
  id: 'tutorial-advanced-chat',
  title: '📚 Tutorial 3: Real-Time Chat System',
  description: `Welcome to the advanced tutorial! This is a production-level system design. 💪

In this tutorial, you'll master:
- Real-time communication with WebSockets
- Message queues for reliability and decoupling
- Horizontal scaling and sharding strategies
- Monitoring and observability
- Multi-region architecture for global scale

**Scenario**: You're building a real-time chat system like Slack/Discord. It needs to support:
- 100,000 concurrent users online
- 50,000 messages per second during peak
- Real-time message delivery (<500ms)
- Message history (1B+ messages stored)
- Global availability (multi-region)

**Complex Concepts**:
- **WebSocket Servers**: Maintain persistent connections for real-time updates
- **Message Queues (Kafka)**: Ensure reliable message delivery and ordering
- **Database Sharding**: Split database by chat_room_id for horizontal scale
- **Monitoring**: Track latency, errors, throughput in real-time

This is what you'll build in production! Take your time. 🚀
- Users can send/receive messages in real-time
- Messages are delivered to all room participants instantly
- Message history is persisted and searchable
- Support for 1:1 chats and group rooms (up to 10K members)`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Users can send/receive messages in real-time',
    'Messages are delivered to all room participants instantly',
    'Message history is persisted and searchable',
    'Support for 1:1 chats and group rooms (up to 10K members)',
    'Typing indicators and presence (online/offline)',
    'File attachments and rich media'
  ],
  userFacingNFRs: [
    'Latency: P99 < 500ms for message delivery, P99 < 100ms for message send',
    'Request Rate: 50,000 messages/sec peak, 100,000 concurrent WebSocket connections',
    'Dataset Size: 1B messages (10TB), growing 1TB/month',
    'Availability: 99.99% uptime globally',
    'Durability: No message loss, 30-day message retention'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need 100K Users (redirect_client) for master complex architectures with real-time features',
      },
      {
        type: 'cdn',
        reason: 'Need CloudFront (cdn) for master complex architectures with real-time features',
      },
      {
        type: 'load_balancer',
        reason: 'Need ALB (API) (lb) for master complex architectures with real-time features',
      },
      {
        type: 'message_queue',
        reason: 'Need Kafka Cluster (stream) for master complex architectures with real-time features',
      },
      {
        type: 'cache',
        reason: 'Need Redis Cluster (cache) for master complex architectures with real-time features',
      },
      {
        type: 'storage',
        reason: 'Need Primary DB (db_primary) for master complex architectures with real-time features',
      },
      {
        type: 'object_storage',
        reason: 'Need S3 Attachments (s3) for master complex architectures with real-time features',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'cdn',
        reason: '100K Users routes to CloudFront',
      },
      {
        from: 'cdn',
        to: 'load_balancer',
        reason: 'CloudFront routes to ALB (API)',
      },
      {
        from: 'cdn',
        to: 'load_balancer',
        reason: 'CloudFront routes to NLB (WebSocket)',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'ALB (API) routes to API Servers',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'NLB (WebSocket) routes to WS Servers',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'API Servers routes to Kafka Cluster',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'WS Servers routes to Kafka Cluster',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'API Servers routes to Redis Cluster',
      },
      {
        from: 'cache',
        to: 'storage',
        reason: 'Redis Cluster routes to Primary DB',
      },
      {
        from: 'cache',
        to: 'compute',
        reason: 'Redis Cluster routes to Read Replicas',
      },
      {
        from: 'compute',
        to: 'object_storage',
        reason: 'API Servers routes to S3 Attachments',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('tutorial-advanced-chat', problemConfigs['tutorial-advanced-chat'], [
    'Users can send/receive messages in real-time',
    'Messages are delivered to all room participants instantly',
    'Message history is persisted and searchable',
    'Support for 1:1 chats and group rooms (up to 10K members)',
    'Typing indicators and presence (online/offline)',
    'File attachments and rich media'
  ]),

  validators: [
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * 📚 BoE Walkthrough: Real-Time Chat System
 * From extracted-problems/system-design/tutorial.md
 */
export const boeWalkthroughChatProblemDefinition: ProblemDefinition = {
  id: 'boe-walkthrough-chat',
  title: '📚 BoE Walkthrough: Real-Time Chat System',
  description: `Learn to apply all 6 NFRs step-by-step to design WhatsApp-scale chat`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    
  ],
  userFacingNFRs: [
    
  ],

  functionalRequirements: {
    mustHave: [

    ],
    mustConnect: [

    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('boe-walkthrough-chat', problemConfigs['boe-walkthrough-chat'], [
    
  ]),

  validators: [
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

