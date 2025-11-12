import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Spotify - Music Streaming Platform
 * Comprehensive FR and NFR scenarios
 */
export const spotifyProblemDefinition: ProblemDefinition = {
  id: 'spotify',
  title: 'Spotify - Music Streaming',
  description: `Design a music streaming platform like Spotify that:
- Users can search and play songs
- Users can create and share playlists
- Platform recommends music based on listening history
- Users can follow artists and other users`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Users can search and play songs',
    'Users can create and share playlists',
    'Users can follow artists and other users'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need to process streaming and playlist management',
      },
      {
        type: 'storage',
        reason: 'Need to store songs, playlists, user data',
      },
      {
        type: 'object_storage',
        reason: 'Need to store audio files',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Client sends requests to app server',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'App server needs to read/write music metadata',
      },
      {
        from: 'compute',
        to: 'object_storage',
        reason: 'App server needs to stream audio files',
      },
    ],
    dataModel: {
      entities: ['user', 'song', 'playlist', 'artist', 'play_history'],
      fields: {
        user: ['id', 'email', 'username', 'subscription_tier', 'created_at'],
        song: ['id', 'artist_id', 'title', 'duration', 'audio_url', 'created_at'],
        playlist: ['id', 'user_id', 'name', 'is_public', 'created_at'],
        artist: ['id', 'name', 'bio', 'image_url', 'created_at'],
        play_history: ['user_id', 'song_id', 'played_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' }, // Playing songs
        { type: 'write', frequency: 'very_high' },    // Recording plays
        { type: 'read_by_query', frequency: 'high' }, // Searching songs
      ],
    },
  },

  scenarios: generateScenarios('spotify', problemConfigs.spotify),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};
