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

  pythonTemplate: `from datetime import datetime
from typing import List, Dict

# In-memory storage (naive implementation)
users = {}
songs = {}
playlists = {}
playlist_songs = {}
artists = {}
play_history = {}
follows = {}

def search_songs(query: str) -> List[Dict]:
    """
    FR-1: Users can search for songs
    Naive implementation - simple substring match on title
    """
    results = []
    for song in songs.values():
        if query.lower() in song.get('title', '').lower():
            results.append(song)
    return results

def play_song(song_id: str, user_id: str) -> Dict:
    """
    FR-1: Users can play songs
    Naive implementation - returns song URL and records play
    """
    if song_id not in songs:
        return None

    # Record play in history
    history_id = f"{user_id}_{song_id}_{datetime.now().timestamp()}"
    play_history[history_id] = {
        'user_id': user_id,
        'song_id': song_id,
        'played_at': datetime.now()
    }

    return songs[song_id]

def create_playlist(playlist_id: str, user_id: str, name: str, is_public: bool = True) -> Dict:
    """
    FR-2: Users can create playlists
    Naive implementation - stores playlist in memory
    """
    playlists[playlist_id] = {
        'id': playlist_id,
        'user_id': user_id,
        'name': name,
        'is_public': is_public,
        'created_at': datetime.now()
    }
    return playlists[playlist_id]

def add_song_to_playlist(playlist_id: str, song_id: str) -> Dict:
    """
    FR-2: Users can add songs to playlists
    Naive implementation - stores song-playlist relationship
    """
    key = f"{playlist_id}_{song_id}"
    playlist_songs[key] = {
        'playlist_id': playlist_id,
        'song_id': song_id,
        'added_at': datetime.now()
    }
    return playlist_songs[key]

def share_playlist(playlist_id: str, shared_by: str, shared_with: str) -> Dict:
    """
    FR-2: Users can share playlists
    Naive implementation - returns share confirmation
    In real system, this would create notifications
    """
    return {
        'playlist_id': playlist_id,
        'shared_by': shared_by,
        'shared_with': shared_with,
        'shared_at': datetime.now()
    }

def follow_artist(user_id: str, artist_id: str) -> Dict:
    """
    FR-3: Users can follow artists
    Naive implementation - stores follow relationship
    """
    follow_key = f"{user_id}_artist_{artist_id}"
    follows[follow_key] = {
        'user_id': user_id,
        'artist_id': artist_id,
        'type': 'artist',
        'created_at': datetime.now()
    }
    return follows[follow_key]

def follow_user(follower_id: str, following_id: str) -> Dict:
    """
    FR-3: Users can follow other users
    Naive implementation - stores follow relationship
    """
    follow_key = f"{follower_id}_user_{following_id}"
    follows[follow_key] = {
        'follower_id': follower_id,
        'following_id': following_id,
        'type': 'user',
        'created_at': datetime.now()
    }
    return follows[follow_key]
`,
};
