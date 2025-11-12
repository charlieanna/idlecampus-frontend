import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Zoom - Video Conferencing Platform
 * Comprehensive FR and NFR scenarios
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

  scenarios: generateScenarios('zoom', problemConfigs.zoom),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};
