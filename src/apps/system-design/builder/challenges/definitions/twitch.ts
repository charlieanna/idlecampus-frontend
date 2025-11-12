import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';

/**
 * Twitch - Live Streaming Platform
 * Level 1 ONLY: Brute force connectivity test
 */
export const twitchProblemDefinition: ProblemDefinition = {
  id: 'twitch',
  title: 'Twitch - Live Streaming',
  description: `Design a live streaming platform like Twitch that:
- Streamers can broadcast live video
- Viewers can watch live streams
- Users can chat in real-time during streams
- Platform supports VOD (Video on Demand) playback`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need to process live video streams',
      },
      {
        type: 'storage',
        reason: 'Need to store stream metadata, chat logs, VODs',
      },
      {
        type: 'object_storage',
        reason: 'Need to store VOD recordings',
      },
      {
        type: 'realtime_messaging',
        reason: 'Need real-time chat during streams',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Client sends/receives stream data',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'App server needs to read/write stream metadata',
      },
      {
        from: 'compute',
        to: 'object_storage',
        reason: 'App server needs to store VODs',
      },
      {
        from: 'compute',
        to: 'realtime_messaging',
        reason: 'App server needs to handle live chat',
      },
    ],
    dataModel: {
      entities: ['user', 'stream', 'chat_message', 'follow', 'subscription'],
      fields: {
        user: ['id', 'username', 'email', 'is_streamer', 'created_at'],
        stream: ['id', 'streamer_id', 'title', 'category', 'is_live', 'viewers', 'started_at'],
        chat_message: ['id', 'stream_id', 'user_id', 'message', 'created_at'],
        follow: ['follower_id', 'streamer_id', 'created_at'],
        subscription: ['subscriber_id', 'streamer_id', 'tier', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' }, // Watching streams
        { type: 'write', frequency: 'very_high' },    // Chat messages
      ],
    },
  },

  scenarios: [
    {
      name: 'Level 1: The Brute Force Test - Does It Even Work?',
      description: 'Like algorithm brute force: ignore performance, just verify connectivity. Client → App → Database → S3 → WebSocket path exists. No optimization needed.',
      traffic: {
        rps: 0.1,
        readWriteRatio: 0.5,
        avgFileSize: 200, // 200MB for VOD chunks
      },
      passCriteria: {
        maxLatency: 30000,
        maxErrorRate: 0.99,
      },
    },
  ],

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};
