import { ProblemDefinition } from '../../types/problemDefinition';
import {
  validConnectionFlowValidator,
  replicationConfigValidator,
  partitioningConfigValidator,
} from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Spotify - Music Streaming Platform
 * DDIA Ch. 3 (Storage & Retrieval) - Music Catalog Search
 *
 * DDIA Concepts Applied:
 * - Ch. 3: Multi-field full-text search for music catalog
 *   - Elasticsearch with multi_match query across song, artist, album
 *   - Field boosting: title^3, artist^2, album, lyrics
 *   - Support fuzzy matching for typos (Levenshtein distance)
 * - Ch. 3: Autocomplete/typeahead search (DDIA Ch. 3)
 *   - Edge n-gram tokenizer for prefix matching
 *   - Index: "beatles" → "b", "be", "bea", "beat", "beatl", "beatles"
 *   - Sub-millisecond autocomplete latency
 * - Ch. 3: Composite indexes for filtering
 *   - Index on (genre, popularity DESC) for discovery
 *   - Index on (artist_id, release_year DESC) for artist discography
 * - Ch. 3: Audio fingerprinting index
 *   - Chromaprint/AcoustID for duplicate detection
 *   - Shazam-style audio recognition
 *
 * Multi-Field Search Example (Elasticsearch):
 * {
 *   "query": {
 *     "multi_match": {
 *       "query": "imagine john lennon",
 *       "fields": ["title^3", "artist^2", "album"],
 *       "type": "best_fields",
 *       "fuzziness": "AUTO"
 *     }
 *   },
 *   "suggest": {
 *     "song-suggest": {
 *       "prefix": "imag",
 *       "completion": {
 *         "field": "title.suggest",
 *         "size": 10
 *       }
 *     }
 *   }
 * }
 *
 * Autocomplete Architecture (DDIA Ch. 3):
 * - Edge n-gram tokenizer breaks "imagine" into:
 *   - "i", "im", "ima", "imag", "imagi", "imagin", "imagine"
 * - Searching "imag" instantly matches "imagine" (no full-text scan)
 * - Typically limited to first 20 chars for performance
 *
 * System Design Primer Concepts:
 * - Search: Elasticsearch cluster for catalog search
 * - CDN: Audio file distribution (similar to Netflix)
 * - Caching: Redis for popular song metadata, playlists
 */
export const spotifyProblemDefinition: ProblemDefinition = {
  id: 'spotify',
  title: 'Spotify - Music Streaming',
  description: `Design a music streaming platform like Spotify that:
- Users can search and play songs
- Users can create and share playlists
- Platform recommends music based on listening history
- Users can follow artists and other users

Learning Objectives (DDIA Ch. 3):
1. Implement multi-field full-text search (DDIA Ch. 3)
   - Search across song title, artist, album, lyrics simultaneously
   - Use field boosting for relevance (title > artist > album)
2. Design autocomplete/typeahead search (DDIA Ch. 3)
   - Edge n-gram tokenizer for instant prefix matching
   - Sub-millisecond latency for suggestions
3. Create composite indexes for music discovery (DDIA Ch. 3)
   - Index on (genre, popularity DESC) for trending
4. Handle fuzzy matching for typos (DDIA Ch. 3)
   - Levenshtein distance for "beatels" → "beatles"
5. Index audio fingerprints for recognition (DDIA Ch. 3)
   - Chromaprint for Shazam-style audio matching`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Users can search and play songs',
    'Users can create and share playlists',
    'Users can follow artists and other users'
  ],

  userFacingNFRs: [
    'Search latency: p99 < 200ms (DDIA Ch. 3: Multi-field Elasticsearch)',
    'Autocomplete: p99 < 50ms (DDIA Ch. 3: Edge n-gram indexing)',
    'Fuzzy matching: Handle 1-2 character typos (DDIA Ch. 3: Levenshtein distance)',
    'Discovery feed: < 300ms (DDIA Ch. 3: Composite index on genre + popularity)',
    'Audio CDN: > 95% cache hit ratio (SDP: Pre-position popular tracks)',
    'Audio fingerprint: < 1s to identify song (DDIA Ch. 3: Chromaprint index)',
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
    {
      name: 'Replication Configuration (DDIA Ch. 5)',
      validate: replicationConfigValidator,
    },
    {
      name: 'Partitioning Configuration (DDIA Ch. 6)',
      validate: partitioningConfigValidator,
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
