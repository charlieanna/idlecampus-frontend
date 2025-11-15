import { ProblemCoachConfig, LevelCoachConfig } from '../types/coachConfig';

/**
 * Netflix Coach Configuration
 * Pattern: Video Streaming + CDN + Adaptive Bitrate
 * Focus: Video delivery, transcoding, CDN optimization, recommendations
 */

const level1Config: LevelCoachConfig = {
  level: 1,
  title: 'Level 1: Basic Video Streaming',
  goal: 'Build a system where users can browse and stream videos',
  description: 'Learn video storage and basic streaming architecture',
  estimatedTime: '16 minutes',
  learningObjectives: [
    'Understand video storage requirements',
    'Design catalog browsing and search',
    'Implement basic video streaming',
    'Handle watch history and progress tracking',
  ],

  messages: [
    {
      trigger: { type: 'on_first_visit' },
      message: '👋 Welcome to Netflix! You\'re building a video streaming platform. Key challenge: deliver high-quality video to millions of users globally with minimal buffering.',
      messageType: 'info',
      icon: '👋',
      priority: 100,
      showOnce: true,
    },
    {
      trigger: { type: 'on_load' },
      message: '🎯 Goal: Browse and stream videos\n\nUsers should be able to:\n• Browse catalog (movies, TV shows)\n• Search for content\n• Stream videos on-demand\n• Track watch progress\n\n💡 Video files are HUGE (5GB+ for a movie). Storage strategy is critical!',
      messageType: 'info',
      icon: '🎯',
      priority: 90,
    },
    {
      trigger: { type: 'component_added', componentType: 'app_server' },
      message: '✅ App Server added!\n\nHandles:\n• GET /catalog - Browse content\n• GET /search - Search videos\n• POST /stream - Initialize stream\n• POST /watch/progress - Track progress\n\nNow where do we store videos? 🤔',
      messageType: 'success',
      icon: '✅',
      showOnce: true,
    },
    {
      trigger: { type: 'component_added', componentType: 's3' },
      message: '✅ S3 for video storage!\n\n💡 Why object storage?\n• Videos are immutable (write once, read many)\n• Huge files (5-20 GB per movie)\n• Need scalability (petabytes of content)\n• S3 is cheaper than block storage\n\n**Cost**: $0.023/GB/month\n**Example**: 1 million movies × 10GB = $230K/month',
      messageType: 'success',
      icon: '✅',
      showOnce: true,
    },
    {
      trigger: { type: 'component_added', componentType: 'postgresql' },
      message: '✅ PostgreSQL for metadata!\n\nStores:\n• Videos (id, title, description, s3_url, duration)\n• Users (id, email, subscription_tier)\n• Watch history (user_id, video_id, progress)\n• Subscriptions, ratings, reviews\n\n💡 Metadata in DB, actual video in S3!',
      messageType: 'success',
      icon: '✅',
      showOnce: true,
    },
    {
      trigger: { type: 'validator_failed', validatorName: 'Valid Connection Flow' },
      message: '🔗 Connect the components!\n\nStreaming flow:\n1. Client → App Server (request video)\n2. App Server → PostgreSQL (get video metadata + S3 URL)\n3. App Server → S3 (presigned URL for direct access)\n4. Client → S3 (stream video chunks)\n\n💡 Client streams DIRECTLY from S3 (app server not in data path)',
      messageType: 'hint',
      icon: '💡',
    },
    {
      trigger: { type: 'all_tests_passed' },
      message: '🎉 Basic streaming works!\n\nBut there\'s a problem: users in Japan streaming from S3 in Virginia = 500ms latency and buffering. We need a CDN!',
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
      hint: '💡 Hint: Videos are massive files (5-20 GB). You need:\n1. Object storage for videos (scalable, cheap)\n2. Database for metadata (title, duration, URL)\n3. Separate video storage from metadata!',
      hintLevel: 1,
    },
    {
      condition: { minAttempts: 3 },
      hint: '🔍 Specific hint: Add:\n1. App Server (catalog API)\n2. PostgreSQL (metadata)\n3. S3 (video files)\n\nFlow: Client → App → PostgreSQL (get S3 URL) → Client → S3 (stream)',
      hintLevel: 2,
    },
    {
      condition: { minAttempts: 5, minTimeSeconds: 180 },
      hint: '🎯 Direct solution:\n• App Server for APIs\n• PostgreSQL for metadata\n• S3 for video storage\n\nConnect: Client → App → PostgreSQL + S3\nVideo delivery: S3 presigned URLs',
      hintLevel: 3,
    },
  ],
};

const level2Config: LevelCoachConfig = {
  level: 2,
  title: 'Level 2: Global CDN & Adaptive Streaming',
  goal: 'Deliver videos globally with low latency and adaptive bitrate',
  description: 'Add CDN, transcoding, and HLS/DASH streaming',
  estimatedTime: '26 minutes',
  learningObjectives: [
    'Implement CDN for global video delivery',
    'Understand transcoding (multiple qualities)',
    'Use HLS/DASH for adaptive bitrate streaming',
    'Optimize for different network conditions',
  ],

  messages: [
    {
      trigger: { type: 'on_load' },
      message: '🎯 Level 2 Goals:\n\n1. **Global delivery**: CDN for <100ms latency worldwide\n2. **Adaptive bitrate**: Switch quality based on bandwidth\n3. **Transcoding**: SD, HD, 4K versions of each video\n\nLet\'s make streaming smooth for everyone!',
      messageType: 'info',
      icon: '🎯',
      priority: 90,
    },
    {
      trigger: { type: 'component_added', componentType: 'cdn' },
      message: '✅ CDN (CloudFront) for global delivery!\n\n💡 How it works:\n1. Videos stored in S3 (origin)\n2. CDN caches at edge locations (200+ worldwide)\n3. User in Tokyo → Tokyo edge (50ms, not 500ms!)\n4. Cache miss → Fetch from S3 once, serve millions\n\n**Netflix uses**:\n• Own CDN (Open Connect)\n• Boxes in ISP data centers\n• 95%+ cache hit rate',
      messageType: 'success',
      icon: '✅',
      showOnce: true,
    },
    {
      trigger: { type: 'latency_exceeded', maxLatency: 100 },
      message: '⚠️ High latency! Videos buffering!\n\nCause: Streaming from S3 origin directly.\n\n💡 Solution: Add CDN\n• Edge locations near users\n• Cache popular content\n• Reduce origin load by 95%+',
      messageType: 'warning',
      icon: '⚠️',
    },
    {
      trigger: { type: 'component_added', componentType: 'lambda' },
      message: '✅ Lambda for transcoding!\n\n💡 Transcoding pipeline:\n1. Upload original video (4K, 50 Mbps)\n2. Lambda triggered on S3 upload\n3. Transcode to multiple qualities:\n   - 240p @ 0.5 Mbps (mobile, slow)\n   - 480p @ 1.5 Mbps (SD)\n   - 720p @ 3 Mbps (HD)\n   - 1080p @ 6 Mbps (Full HD)\n   - 4K @ 25 Mbps (Ultra HD)\n4. Generate HLS playlist (.m3u8)\n\n**HLS**: HTTP Live Streaming (Apple standard)',
      messageType: 'success',
      icon: '✅',
      showOnce: true,
    },
    {
      trigger: { type: 'component_added', componentType: 'encoding_service' },
      message: '✅ Dedicated encoding service!\n\n💡 Better than Lambda for video:\n• MediaConvert / Elastic Transcoder (AWS)\n• Specialized for video transcoding\n• Handles long-running jobs (hours)\n• Supports advanced codecs (H.265, AV1)\n\n**Output**: Segmented files + manifest\n• video_720p_segment_001.ts\n• video_720p_segment_002.ts\n• manifest.m3u8',
      messageType: 'success',
      icon: '✅',
      showOnce: true,
    },
    {
      trigger: { type: 'all_tests_passed' },
      message: '🎉 Adaptive streaming works globally!\n\nYou\'ve learned:\n• CDN for global delivery\n• Transcoding to multiple qualities\n• HLS for adaptive bitrate\n• <100ms latency worldwide\n\nNext: Recommendations and personalization!',
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
      hint: '💡 Hint: Two optimizations:\n1. CDN for global edge caching\n2. Transcoding for multiple qualities (adaptive bitrate)\n\nNetflix serves different quality based on your bandwidth!',
      hintLevel: 1,
    },
    {
      condition: { minAttempts: 4 },
      hint: '🔍 Specific hint: Add:\n1. CDN (CloudFront) in front of S3\n2. Transcoding service (MediaConvert or Lambda)\n3. Generate HLS/DASH playlists\n\nFlow: Upload → Transcode → S3 → CDN → Client',
      hintLevel: 2,
    },
    {
      condition: { minAttempts: 6, minTimeSeconds: 290 },
      hint: '🎯 Direct solution:\n• CDN with S3 origin\n• AWS MediaConvert for transcoding\n• Output: 240p, 480p, 720p, 1080p, 4K\n• HLS manifest (.m3u8)\n• Client uses HLS.js or native player\n• Player adapts quality based on bandwidth',
      hintLevel: 3,
    },
  ],
};

const level3Config: LevelCoachConfig = {
  level: 3,
  title: 'Level 3: Recommendations & Scale',
  goal: 'Add personalized recommendations and handle massive scale',
  description: 'ML-powered recommendations and Netflix-scale infrastructure',
  estimatedTime: '28 minutes',
  learningObjectives: [
    'Implement recommendation engine with ML',
    'Handle billions of viewing events',
    'Optimize for 200M+ concurrent users',
    'Add content discovery and search',
  ],

  messages: [
    {
      trigger: { type: 'on_load' },
      message: '🎯 Level 3: Netflix scale!\n\nChallenges:\n• Personalized recommendations (70% of views!)\n• Search across 100K+ titles\n• Billions of viewing events/day\n• 200M+ concurrent users globally\n\nTime for advanced architecture!',
      messageType: 'info',
      icon: '🎯',
      priority: 90,
    },
    {
      trigger: { type: 'component_added', componentType: 'machine_learning' },
      message: '✅ ML for recommendations!\n\n💡 Netflix recommendation system:\n1. **Collaborative filtering**: Users like you watched...\n2. **Content-based**: Similar to what you watched\n3. **Hybrid approach**: Combine both\n\n**Features**:\n• Watch history\n• Ratings\n• Time of day\n• Device type\n• Completion rate\n\n**Model**: Matrix factorization + Deep learning\n**Retraining**: Daily with billions of data points',
      messageType: 'success',
      icon: '✅',
      showOnce: true,
    },
    {
      trigger: { type: 'component_added', componentType: 'elasticsearch' },
      message: '✅ Elasticsearch for content search!\n\n💡 Search features:\n• Full-text search (titles, descriptions)\n• Fuzzy matching ("Stanger Things" → "Stranger Things")\n• Filters (genre, year, rating)\n• Autocomplete\n• Ranking by relevance + popularity\n\n**Index**: Updated when new content added\n**Query time**: <50ms across 100K titles',
      messageType: 'success',
      icon: '✅',
      showOnce: true,
    },
    {
      trigger: { type: 'component_added', componentType: 'kafka' },
      message: '✅ Kafka for event streaming!\n\n💡 Viewing events:\n• Play, pause, seek, stop\n• Quality changes\n• Buffering events\n• Completion tracking\n\n**Scale**: Billions of events/day\n**Consumers**:\n1. ML model training\n2. Analytics (what\'s popular?)\n3. Billing (watch time)\n4. A/B testing',
      messageType: 'success',
      icon: '✅',
      showOnce: true,
    },
    {
      trigger: { type: 'component_added', componentType: 'cassandra' },
      message: '✅ Cassandra for viewing history!\n\n💡 Why Cassandra?\n• Billions of watch events\n• High write throughput (append-only)\n• Time-series optimized\n• Horizontal scaling\n\n**Schema**: `watch_history` partitioned by (user_id, date)\n**Query**: "Get user\'s watch history for last 30 days"',
      messageType: 'success',
      icon: '✅',
      showOnce: true,
    },
    {
      trigger: { type: 'all_tests_passed' },
      message: '🎉 Netflix is production-ready at massive scale! 🎬\n\nYou\'ve mastered:\n✓ Video storage and streaming (S3)\n✓ Global CDN delivery (<100ms)\n✓ Adaptive bitrate (HLS/DASH)\n✓ Transcoding pipeline (multiple qualities)\n✓ ML-powered recommendations\n✓ Full-text search (Elasticsearch)\n✓ Event streaming (Kafka)\n✓ Billions of viewing events (Cassandra)\n\nThis is real Netflix architecture! 🚀',
      messageType: 'celebration',
      icon: '🎉',
      action: {
        type: 'next_problem',
        problemId: 'youtube',
      },
    },
  ],

  unlockHints: [
    {
      condition: { minAttempts: 2 },
      hint: '💡 Hint: Three enhancements:\n1. ML for personalized recommendations\n2. Search engine for content discovery\n3. Event streaming for billions of viewing events',
      hintLevel: 1,
    },
    {
      condition: { minAttempts: 4 },
      hint: '🔍 Specific hint:\n1. ML service for recommendations (collaborative filtering)\n2. Elasticsearch for search\n3. Kafka for viewing events\n4. Cassandra for viewing history (time-series)\n5. Redis for trending/popular cache',
      hintLevel: 2,
    },
    {
      condition: { minAttempts: 6, minTimeSeconds: 320 },
      hint: '🎯 Direct solution:\n• ML model (matrix factorization) for recommendations\n• Elasticsearch for content search\n• Kafka for event streaming (play, pause, complete)\n• Cassandra for viewing history\n• Redis for caching popular content\n• PostgreSQL for catalog metadata\n• Data pipeline: Kafka → Spark → ML training',
      hintLevel: 3,
    },
  ],
};

export const netflixCoachConfig: ProblemCoachConfig = {
  problemId: 'netflix',
  archetype: 'cdn',
  levelConfigs: {
    1: level1Config,
    2: level2Config,
    3: level3Config,
  },
  celebrationMessages: {
    1: '🎉 Level 1 Complete!\n\nBasic streaming works! You understand:\n• Object storage for videos (S3)\n• Metadata vs media separation\n• Presigned URLs for direct access\n\nNext: Global CDN and adaptive streaming!',
    2: '🎉 Level 2 Complete!\n\nGlobal adaptive streaming! You\'ve learned:\n• CDN for edge caching\n• Transcoding to multiple qualities\n• HLS/DASH for adaptive bitrate\n• <100ms latency worldwide\n\nNext: Recommendations and massive scale!',
    3: '🎉 Netflix Complete! 🎬\n\nYou\'ve mastered video streaming at scale:\n✓ S3 + CDN for global delivery\n✓ Adaptive bitrate streaming (HLS)\n✓ Transcoding pipeline (SD to 4K)\n✓ ML recommendations (70% of views!)\n✓ Elasticsearch for search\n✓ Event streaming with Kafka\n✓ Billions of viewing events/day\n\nThis is production Netflix architecture! 🚀',
  },
  nextProblemRecommendation: 'youtube',
  prerequisites: ['static-content-cdn'],
  estimatedTotalTime: '70 minutes',
};

export function getNetflixLevelConfig(level: number): LevelCoachConfig | null {
  return netflixCoachConfig.levelConfigs[level] || null;
}
