import { ProblemDefinition } from '../../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../../validation/validators/commonValidators';
import { basicFunctionalValidator } from '../../../validation/validators/featureValidators';
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

  pythonTemplate: `# 📚 Tutorial 1: Personal Blog Platform
# Learn the basics of system design by building a simple blog

def create_post(author_id: str, title: str, content: str, context) -> str:
    """
    Create a new blog post.

    Args:
        author_id: ID of the author
        title: Post title
        content: Post content
        context: Execution context

    Returns:
        post_id: Unique ID for the post

    Available APIs:
        - context.db.get(key) - Get from database
        - context.db.set(key, value) - Store in database
        - context.cache.get(key) - Get from cache
        - context.cache.set(key, value, ttl_seconds) - Store in cache
    """
    # TODO: Generate a unique post_id
    # TODO: Store post in database with author_id, title, content, created_at
    # TODO: Return the post_id
    pass

def get_post(post_id: str, context) -> dict:
    """
    Get a blog post by ID.

    Args:
        post_id: ID of the post
        context: Execution context

    Returns:
        Post data (title, content, author_id, created_at)
    """
    # TODO: Try to get from cache first (hint: this is faster!)
    # TODO: If not in cache, get from database
    # TODO: Store in cache for next time (TTL: 3600 seconds = 1 hour)
    # TODO: Return the post data
    pass

def list_posts(limit: int, context) -> list:
    """
    Get recent blog posts.

    Args:
        limit: Number of posts to return
        context: Execution context

    Returns:
        List of posts, sorted by created_at (newest first)
    """
    # TODO: Get posts from database
    # TODO: Sort by created_at timestamp (descending)
    # TODO: Return most recent 'limit' posts
    # HINT: Consider caching this list since it's read frequently
    pass

# Example usage:
# post_id = create_post("author1", "My First Post", "Hello World!", context)
# post = get_post(post_id, context)
# recent_posts = list_posts(10, context)
`,
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

  pythonTemplate: `# 📚 Tutorial 2: Image Hosting Service
# Learn CDN, caching, and storage optimization

def upload_image(user_id: str, image_data: bytes, filename: str, context) -> str:
    """
    Upload an image to the service.

    Args:
        user_id: ID of the user uploading
        image_data: Image binary data
        filename: Original filename
        context: Execution context

    Returns:
        image_id: Unique ID for the image

    Available APIs:
        - context.db.set(key, value) - Store metadata in database
        - context.cdn.put_asset(url, data) - Upload to CDN/Object Storage
        - context.cache.set(key, value, ttl) - Cache popular images
    """
    # TODO: Generate unique image_id
    # TODO: Upload image_data to CDN/S3 via context.cdn.put_asset()
    # TODO: Store metadata in database (user_id, filename, size, created_at)
    # TODO: Return the image_id
    pass

def get_image(image_id: str, context) -> dict:
    """
    Get image URL for viewing.

    Args:
        image_id: ID of the image
        context: Execution context

    Returns:
        Image details (cdn_url, filename, size, etc.)
    """
    # TODO: Check cache first (popular images should be cached!)
    # TODO: If not cached, get metadata from database
    # TODO: Get CDN URL via context.cdn.get_asset()
    # TODO: Cache the result (TTL: 3600 seconds for popular images)
    # TODO: Return image details with CDN URL
    pass

def delete_image(image_id: str, user_id: str, context) -> bool:
    """
    Delete an image (only owner can delete).

    Args:
        image_id: ID of the image
        user_id: ID of the user requesting deletion
        context: Execution context

    Returns:
        True if successful
    """
    # TODO: Get image metadata from database
    # TODO: Verify user_id matches the owner
    # TODO: Delete from CDN/S3
    # TODO: Delete metadata from database
    # TODO: Invalidate cache
    # TODO: Return success
    pass

# Example usage:
# image_id = upload_image("user123", image_bytes, "photo.jpg", context)
# image = get_image(image_id, context)
# delete_image(image_id, "user123", context)
`,
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

  pythonTemplate: `# 📚 Tutorial 3: Real-Time Chat System
# Master complex architectures with real-time features

def send_message(user_id: str, room_id: str, message: str, context) -> str:
    """
    Send a message to a chat room.

    Args:
        user_id: ID of the sender
        room_id: ID of the chat room
        message: Message content
        context: Execution context

    Returns:
        message_id: Unique ID for the message

    Available APIs:
        - context.db.set(key, value) - Store in database
        - context.queue.publish(topic, message) - Publish to message queue
        - context.cache.set(key, value, ttl) - Cache recent messages
    """
    # TODO: Generate unique message_id and timestamp
    # TODO: Store message in database (sharded by room_id for scale)
    # TODO: Publish to Kafka queue for real-time delivery to WebSocket servers
    # TODO: Cache recent messages for this room (TTL: 300 seconds)
    # TODO: Return message_id
    pass

def get_room_messages(room_id: str, limit: int, offset: int, context) -> list:
    """
    Get message history for a room (paginated).

    Args:
        room_id: ID of the chat room
        limit: Number of messages to return
        offset: Pagination offset
        context: Execution context

    Returns:
        List of messages, sorted by timestamp (newest first)
    """
    # TODO: Check cache for recent messages (offset=0)
    # TODO: If not cached or paginating, query database
    # TODO: Sort by timestamp descending
    # TODO: Cache the first page (offset=0) for fast access
    # TODO: Return messages
    pass

def join_room(user_id: str, room_id: str, context) -> bool:
    """
    Join a chat room.

    Args:
        user_id: ID of the user
        room_id: ID of the room
        context: Execution context

    Returns:
        True if successful
    """
    # TODO: Add user to room_members table in database
    # TODO: Publish "user_joined" event to queue for presence updates
    # TODO: Invalidate room members cache
    # TODO: Return success
    pass

def update_presence(user_id: str, status: str, context) -> bool:
    """
    Update user online/offline status.

    Args:
        user_id: ID of the user
        status: 'online' or 'offline'
        context: Execution context

    Returns:
        True if successful
    """
    # TODO: Update presence in cache (fast lookup, TTL: 60 seconds)
    # TODO: Publish presence update to queue
    # TODO: Optionally update database for offline status
    # TODO: Return success
    pass

# Example usage:
# msg_id = send_message("user123", "room456", "Hello everyone!", context)
# messages = get_room_messages("room456", 50, 0, context)
# join_room("user789", "room456", context)
# update_presence("user123", "online", context)
`,
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

  pythonTemplate: `# 📚 BoE Walkthrough: Real-Time Chat System
# Learn to apply all 6 NFRs step-by-step to design WhatsApp-scale chat

def send_message(sender_id: str, recipient_id: str, message: str, context) -> str:
    """
    Send a message in a WhatsApp-like system.

    Args:
        sender_id: ID of the sender
        recipient_id: ID of the recipient
        message: Message content
        context: Execution context

    Returns:
        message_id: Unique ID for the message

    Available APIs:
        - context.db.set(key, value)
        - context.queue.publish(topic, message)
        - context.cache.set(key, value, ttl)
    """
    # TODO: Implement message sending with NFR considerations:
    # - Latency: Use cache for user status checks
    # - Throughput: Use queue for async delivery
    # - Consistency: Store in DB immediately
    # - Availability: Handle failures gracefully
    # - Durability: Ensure message is persisted
    # - Scale: Consider sharding by user_id
    pass

def deliver_message(message_id: str, context) -> bool:
    """
    Deliver a message to recipient (async).

    Args:
        message_id: ID of the message to deliver
        context: Execution context

    Returns:
        True if delivered successfully
    """
    # TODO: Get message from DB
    # TODO: Check recipient online status (cache)
    # TODO: If online, push via WebSocket
    # TODO: If offline, store for later delivery
    # TODO: Update delivery status
    pass

# Example usage:
# msg_id = send_message("user1", "user2", "Hello!", context)
# delivered = deliver_message(msg_id, context)
`,
};

