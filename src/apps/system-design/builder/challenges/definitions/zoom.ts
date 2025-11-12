import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';

/**
 * Zoom - Video Conferencing Platform
 * Level 1 ONLY: Brute force connectivity test
 */
export const zoomProblemDefinition: ProblemDefinition = {
  id: 'zoom',
  title: 'Zoom - Video Conferencing',
  description: `Design a video conferencing platform like Zoom that:
- Users can create and join video meetings
- Meetings support screen sharing and recording
- Platform handles audio and video streaming
- Users can chat during meetings`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need to process video/audio streams and signaling',
      },
      {
        type: 'storage',
        reason: 'Need to store meeting metadata and recordings',
      },
      {
        type: 'object_storage',
        reason: 'Need to store meeting recordings',
      },
      {
        type: 'realtime_messaging',
        reason: 'Need real-time video/audio streaming',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Client sends video/audio streams',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'App server needs to store meeting data',
      },
      {
        from: 'compute',
        to: 'object_storage',
        reason: 'App server needs to store recordings',
      },
      {
        from: 'compute',
        to: 'realtime_messaging',
        reason: 'App server handles real-time streams',
      },
    ],
    dataModel: {
      entities: ['user', 'meeting', 'participant', 'recording', 'chat_message'],
      fields: {
        user: ['id', 'email', 'name', 'created_at'],
        meeting: ['id', 'host_id', 'title', 'scheduled_start', 'duration', 'status', 'created_at'],
        participant: ['meeting_id', 'user_id', 'joined_at', 'left_at'],
        recording: ['id', 'meeting_id', 'url', 'duration', 'created_at'],
        chat_message: ['id', 'meeting_id', 'user_id', 'message', 'created_at'],
      },
      accessPatterns: [
        { type: 'write', frequency: 'very_high' },  // Streaming video/audio
        { type: 'read_by_key', frequency: 'high' }, // Loading meeting details
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
        avgFileSize: 500, // 500MB recordings
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
