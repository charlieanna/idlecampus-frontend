import { ProblemCoachConfig, LevelCoachConfig } from '../types/coachConfig';

/**
 * Instagram Coach Configuration
 * Pattern: Social Feed + Image Storage + CDN
 * Focus: Image upload/delivery, feed generation, object storage
 */

const level1Config: LevelCoachConfig = {
  level: 1,
  title: 'Level 1: Photo Upload & Feed',
  goal: 'Build a system where users can upload photos and view a personalized feed',
  description: 'Learn image storage and basic feed architecture',
  estimatedTime: '18 minutes',
  learningObjectives: [
    'Understand object storage for images/videos',
    'Design metadata vs media storage separation',
    'Implement basic feed queries',
    'Handle file uploads and retrieval',
  ],

  messages: [
    {
      trigger: { type: 'on_first_visit' },
      message: '👋 Welcome to Instagram! This is a photo-sharing platform where users upload images and view feeds. You\'ll learn how to handle large media files, not just text data.',
      messageType: 'info',
      icon: '👋',
      priority: 100,
      showOnce: true,
    },
    {
      trigger: { type: 'on_load' },
      message: '🎯 Goal: Upload photos and view personalized feed\n\nUsers should be able to:\n• Upload photos (5-10 MB each)\n• View feed from followed users\n• Like and comment on photos\n\n💡 Key insight: Separate metadata (DB) from media (object storage)!',
      messageType: 'info',
      icon: '🎯',
      priority: 90,
    },
    {
      trigger: { type: 'component_added', componentType: 'app_server' },
      message: '✅ Great! App Server handles:\n• Upload API (receive photo)\n• Feed API (get timeline)\n• Like/Comment APIs\n\nNow add TWO storage types: Database + Object Storage!',
      messageType: 'success',
      icon: '✅',
      showOnce: true,
    },
    {
      trigger: { type: 'component_added', componentType: 'postgresql' },
      message: '✅ PostgreSQL for metadata!\n\nStores:\n• User profiles\n• Post metadata (id, user_id, caption, timestamp)\n• Likes, comments, follows\n\n💡 But NOT the actual images! Images go to S3.',
      messageType: 'success',
      icon: '✅',
      showOnce: true,
    },
    {
      trigger: { type: 'component_added', componentType: 's3' },
      message: '✅ S3 (Object Storage) for images!\n\nPerfect for:\n• Storing 5-10 MB photos\n• Storing videos (up to 60 seconds)\n• Scalable to billions of files\n• Cheap storage ($0.023/GB/month)\n\n💡 App server uploads to S3, stores S3 URL in PostgreSQL.',
      messageType: 'success',
      icon: '✅',
      showOnce: true,
    },
    {
      trigger: { type: 'validator_failed', validatorName: 'Valid Connection Flow' },
      message: '🔗 Connect the components!\n\nUpload flow:\n1. Client → App Server (upload photo)\n2. App Server → S3 (store image)\n3. App Server → PostgreSQL (store metadata with S3 URL)\n\nView flow:\n1. Client → App Server (get feed)\n2. App Server → PostgreSQL (get post IDs)\n3. App Server → S3 (get image URLs)\n4. Return to client',
      messageType: 'hint',
      icon: '💡',
    },
    {
      trigger: { type: 'all_tests_passed' },
      message: '🎉 Photos are uploading and feeds are working!\n\nBut images are loading slowly. Users in Tokyo wait 500ms for images from S3 in Virginia. Let\'s add a CDN!',
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
      hint: '💡 Hint: Instagram needs TWO types of storage:\n1. Database for metadata (small, structured)\n2. Object storage for images (large, unstructured)\n\nDon\'t store images in the database!',
      hintLevel: 1,
    },
    {
      condition: { minAttempts: 3 },
      hint: '🔍 Specific hint: Add:\n1. App Server (handles uploads)\n2. PostgreSQL (metadata: user_id, caption, timestamp)\n3. S3 (actual image files)\n\nConnect: Client → App → PostgreSQL + S3',
      hintLevel: 2,
    },
    {
      condition: { minAttempts: 5, minTimeSeconds: 200 },
      hint: '🎯 Direct solution:\n• App Server\n• PostgreSQL (metadata)\n• S3 (images)\n\nUpload: Client → App → S3 (image) + PostgreSQL (URL)',
      hintLevel: 3,
    },
  ],
};

const level2Config: LevelCoachConfig = {
  level: 2,
  title: 'Level 2: Global Image Delivery with CDN',
  goal: 'Serve images fast globally using CDN and fanout-on-write for feeds',
  description: 'Add CDN for images and optimize feed generation',
  estimatedTime: '25 minutes',
  learningObjectives: [
    'Implement CDN for global image delivery',
    'Understand fanout-on-write for feeds',
    'Use Redis for pre-computed timelines',
    'Reduce image load time from 500ms → 50ms',
  ],

  messages: [
    {
      trigger: { type: 'on_load' },
      message: '🎯 Level 2 Goals:\n\n1. **Speed up images**: CDN for <50ms global delivery\n2. **Speed up feeds**: Pre-compute with fanout-on-write\n\nCurrent problems:\n• Images: 500ms from S3 (too slow)\n• Feeds: Database JOIN on every request (expensive)',
      messageType: 'info',
      icon: '🎯',
      priority: 90,
    },
    {
      trigger: { type: 'component_added', componentType: 'cdn' },
      message: '✅ CDN added! This caches images at edge locations worldwide.\n\n💡 Flow:\n1. User in Tokyo requests image\n2. CDN edge in Tokyo serves it (50ms)\n3. If not cached, fetch from S3 (500ms)\n4. Cache for next request\n\n**Result**: 95% of image requests = 50ms instead of 500ms!',
      messageType: 'success',
      icon: '✅',
      showOnce: true,
    },
    {
      trigger: { type: 'latency_exceeded', maxLatency: 100 },
      message: '⚠️ High latency detected!\n\nCause: Images loading from S3 directly.\n\n💡 Solution: Add CDN (CloudFront/Cloudflare) in front of S3. Images will be cached at edge locations globally.',
      messageType: 'warning',
      icon: '⚠️',
    },
    {
      trigger: { type: 'component_added', componentType: 'redis' },
      message: '✅ Redis for pre-computed feeds!\n\n💡 Fanout-on-write strategy:\n1. When user A uploads photo\n2. Get A\'s followers list\n3. Add photo to each follower\'s Redis timeline\n4. Reading feed = O(1) from Redis!\n\n**Example**:\nUser A uploads → Fan out to 500 followers\' timelines',
      messageType: 'success',
      icon: '✅',
      showOnce: true,
    },
    {
      trigger: { type: 'bottleneck_detected', component: 'postgresql' },
      message: '⚠️ Database bottleneck on feed queries!\n\nProblem: Joining posts with follows table on every feed request.\n\n💡 Solution: Pre-compute feeds using Redis. Store each user\'s timeline as:\n`feed:{user_id}` = [post_id_1, post_id_2, ...]',
      messageType: 'warning',
      icon: '⚠️',
    },
    {
      trigger: { type: 'component_added', componentType: 'message_queue' },
      message: '✅ Message Queue for async fanout!\n\n💡 Upload flow:\n1. Upload photo → PostgreSQL + S3\n2. Publish to queue (instant response to user)\n3. Workers consume queue\n4. Workers fan out to Redis timelines\n\nUser doesn\'t wait for fanout!',
      messageType: 'success',
      icon: '✅',
      showOnce: true,
    },
    {
      trigger: { type: 'all_tests_passed' },
      message: '🎉 Excellent! Images load in <50ms globally and feeds are blazing fast!\n\nBut there\'s more: what about image processing (thumbnails, filters)? Let\'s add that!',
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
      hint: '💡 Hint: Two optimizations needed:\n1. CDN for images (edge caching)\n2. Redis for feeds (pre-compute timelines)\n\nBoth avoid hitting slow backend on every request.',
      hintLevel: 1,
    },
    {
      condition: { minAttempts: 4 },
      hint: '🔍 Specific hint: Add:\n1. CDN (CloudFront) in front of S3\n2. Redis for timeline storage\n3. Message Queue for async fanout\n4. Workers to process fanout\n\nClient → CDN → S3 (images)\nClient → App → Redis (feed)',
      hintLevel: 2,
    },
    {
      condition: { minAttempts: 6, minTimeSeconds: 280 },
      hint: '🎯 Direct solution:\n• Add CDN before S3\n• Add Redis for timelines\n• Add Message Queue (Kafka)\n• Configure fanout-on-write strategy\n\nImages: Client → CDN → S3\nFeeds: Stored in Redis, updated on upload',
      hintLevel: 3,
    },
  ],
};

const level3Config: LevelCoachConfig = {
  level: 3,
  title: 'Level 3: Image Processing & Scale',
  goal: 'Add real-time image processing and handle celebrity influencers',
  description: 'Process images on-the-fly and handle hybrid fanout',
  estimatedTime: '28 minutes',
  learningObjectives: [
    'Implement image processing pipeline (thumbnails, filters)',
    'Use Lambda for on-the-fly transformations',
    'Handle celebrity accounts (10M+ followers)',
    'Implement hybrid fanout strategy',
  ],

  messages: [
    {
      trigger: { type: 'on_load' },
      message: '🎯 Level 3 Goals:\n\n1. **Image processing**: Generate thumbnails, apply filters\n2. **Celebrity problem**: Influencers with 10M+ followers break fanout-on-write\n3. **Scale**: Handle 1B photos, 500M users\n\nNew challenges incoming!',
      messageType: 'info',
      icon: '🎯',
      priority: 90,
    },
    {
      trigger: { type: 'component_added', componentType: 'lambda' },
      message: '✅ Lambda for image processing!\n\n💡 Use cases:\n1. **Thumbnails**: Generate 150x150, 320x320, 640x640\n2. **Filters**: Apply Instagram-style filters\n3. **Format conversion**: WebP for modern browsers\n4. **Compression**: Reduce file size by 70%\n\n**Trigger**: Upload to S3 → Lambda runs → Processed images to S3',
      messageType: 'success',
      icon: '✅',
      showOnce: true,
    },
    {
      trigger: { type: 'component_added', componentType: 'redis' },
      message: '✅ Redis cache for celebrity posts!\n\n💡 Hybrid fanout:\n• Regular users (<10K followers): fanout-on-write\n• Celebrities (>10K followers): cache recent posts\n\nOn feed read:\n1. Fetch pre-computed timeline (regular users)\n2. Fetch celebrity posts from cache\n3. Merge and sort\n\nThis is how Instagram actually works!',
      messageType: 'success',
      icon: '✅',
      showOnce: true,
    },
    {
      trigger: { type: 'bottleneck_detected', component: 'message_queue' },
      message: '⚠️ Fanout queue overwhelmed!\n\nProblem: Celebrity with 10M followers posted.\nFanout would write to 10M Redis timelines = 5+ minutes.\n\n💡 Solution: Don\'t fan out celebrities!\nCache their recent posts instead, merge on timeline read.',
      messageType: 'warning',
      icon: '⚠️',
    },
    {
      trigger: { type: 'component_added', componentType: 'elasticsearch' },
      message: '✅ Elasticsearch for search!\n\nPerfect for:\n• User search (by username)\n• Photo search (by caption, hashtags)\n• Location search\n• Autocomplete suggestions\n\nIndexes updated on every post via message queue.',
      messageType: 'success',
      icon: '✅',
      showOnce: true,
    },
    {
      trigger: { type: 'all_tests_passed' },
      message: '🎉 Instagram is production-ready! 🚀\n\nYou\'ve mastered:\n✓ Image storage and CDN delivery\n✓ Fanout-on-write for feeds\n✓ Hybrid fanout for celebrities\n✓ Image processing pipeline\n✓ Search with Elasticsearch\n✓ Handling 1B+ photos globally\n\nThis is real Instagram architecture!',
      messageType: 'celebration',
      icon: '🎉',
      action: {
        type: 'next_problem',
        problemId: 'netflix',
      },
    },
  ],

  unlockHints: [
    {
      condition: { minAttempts: 2 },
      hint: '💡 Hint: Two new challenges:\n1. Image processing (thumbnails, filters) → Use Lambda\n2. Celebrities break fanout → Use hybrid strategy',
      hintLevel: 1,
    },
    {
      condition: { minAttempts: 4 },
      hint: '🔍 Specific hint:\n1. Lambda for image processing (triggered on S3 upload)\n2. Check follower count on post:\n   - <10K: fanout-on-write\n   - >10K: cache in Redis celebrity:{user_id}\n3. Elasticsearch for search functionality',
      hintLevel: 2,
    },
    {
      condition: { minAttempts: 6, minTimeSeconds: 320 },
      hint: '🎯 Direct solution:\n• Lambda@Edge or regular Lambda for image processing\n• Hybrid fanout: Regular users → Redis timelines, Celebrities → Redis cache\n• Elasticsearch for user/content search\n• On feed read: Merge pre-computed + celebrity posts',
      hintLevel: 3,
    },
  ],
};

export const instagramCoachConfig: ProblemCoachConfig = {
  problemId: 'instagram',
  archetype: 'social_feed',
  levelConfigs: {
    1: level1Config,
    2: level2Config,
    3: level3Config,
  },
  celebrationMessages: {
    1: '🎉 Level 1 Complete!\n\nYou\'ve built photo upload and feeds! You understand:\n• Object storage (S3) for large files\n• Metadata vs media separation\n• Basic feed queries\n\nNext: Add CDN for global delivery!',
    2: '🎉 Level 2 Complete!\n\nImages load in <50ms globally! You\'ve learned:\n• CDN for edge caching\n• Fanout-on-write for feeds\n• Pre-computed timelines in Redis\n• Async processing with queues\n\nNext: Image processing and celebrity handling!',
    3: '🎉 Instagram Complete! 📸\n\nYou\'ve mastered image-heavy social media at scale:\n✓ Object storage + CDN (global image delivery)\n✓ Fanout-on-write (fast feeds)\n✓ Hybrid fanout (celebrity handling)\n✓ Image processing pipeline (thumbnails, filters)\n✓ Search with Elasticsearch\n\nThis is production Instagram architecture! 🚀',
  },
  nextProblemRecommendation: 'netflix',
  prerequisites: ['twitter'],
  estimatedTotalTime: '71 minutes',
};

export function getInstagramLevelConfig(level: number): LevelCoachConfig | null {
  return instagramCoachConfig.levelConfigs[level] || null;
}
