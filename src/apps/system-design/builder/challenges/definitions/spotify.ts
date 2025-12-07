import { ProblemDefinition } from '../../types/problemDefinition';
import {
  validConnectionFlowValidator,
  replicationConfigValidator,
  partitioningConfigValidator,
} from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';
import { generateCodeChallengesFromFRs } from '../../utils/codeChallengeGenerator';
import { spotifyGuidedTutorial } from './spotifyGuided';

/**
 * Spotify - Music Streaming Platform
 * DDIA Ch. 10 (Batch Processing) - Collaborative Filtering Recommendations via MapReduce
 *
 * DDIA Concepts Applied:
 * - Ch. 10: MapReduce for collaborative filtering recommendations
 *   - Batch process billions of listening events nightly
 *   - Generate "Discover Weekly" playlists using matrix factorization
 *   - User-based CF: Find similar users based on listening patterns
 *   - Item-based CF: "Users who liked X also liked Y"
 * - Ch. 10: Join algorithms for user-song-artist relationships
 *   - Sort-merge join: Join listening_events with song_metadata
 *   - Broadcast join: Small artist table broadcast to all mappers
 *   - Partition join: Partition both sides by user_id for efficiency
 * - Ch. 10: Batch analytics pipeline for trending songs
 *   - MapReduce: Count plays per song, artist, genre (last 24 hours)
 *   - Output to data warehouse for "Top Charts"
 *   - Incremental batch: Process only new events since last run
 * - Ch. 10: Workflow orchestration with Airflow/Luigi
 *   - DAG: Listening events → Feature extraction → CF model → Recommendations
 *   - Dependencies: Model training waits for feature extraction
 *   - Retry logic: Failed batch jobs retry with exponential backoff
 * - Ch. 10: Data warehousing for analytics dashboards
 *   - OLAP cubes: Aggregate plays by (user, song, time, location)
 *   - Star schema: fact_plays → dim_users, dim_songs, dim_time
 *   - Roll-up queries: Daily → Weekly → Monthly aggregates
 *
 * Collaborative Filtering with MapReduce (DDIA Ch. 10):
 * Problem: Generate personalized "Discover Weekly" playlist for 100M users
 *
 * User-Item Matrix (Sparse):
 * - 100M users × 50M songs = 5×10^15 potential entries
 * - Actual listening events: ~100B entries (0.002% density)
 * - Matrix too large to fit in memory → Use MapReduce
 *
 * Item-Based Collaborative Filtering (DDIA Ch. 10):
 * Algorithm: "Users who liked song X also liked song Y"
 *
 * MapReduce Job 1: Build Co-Occurrence Matrix
 * Input: Listening events (user_id, song_id, play_count)
 *
 * Map phase:
 * def map(user_id, songs_listened):
 *     # Emit all pairs of songs this user listened to
 *     for song_i in songs_listened:
 *         for song_j in songs_listened:
 *             if song_i != song_j:
 *                 emit((song_i, song_j), 1)
 *
 * Reduce phase:
 * def reduce(song_pair, counts):
 *     # Count how many users listened to both songs
 *     total = sum(counts)
 *     emit(song_pair, total)  # Co-occurrence count
 *
 * Example Output:
 * ("Bohemian Rhapsody", "Stairway to Heaven") → 5,000,000 users
 * ("Bohemian Rhapsody", "Hotel California") → 3,200,000 users
 *
 * MapReduce Job 2: Compute Similarity Scores
 * Input: Co-occurrence matrix from Job 1
 *
 * Map phase:
 * def map(song_pair, co_occurrence):
 *     (song_i, song_j) = song_pair
 *     # Emit for both directions
 *     emit(song_i, (song_j, co_occurrence))
 *     emit(song_j, (song_i, co_occurrence))
 *
 * Reduce phase:
 * def reduce(song_i, related_songs):
 *     # Calculate cosine similarity or Jaccard similarity
 *     for (song_j, co_occurrence) in related_songs:
 *         similarity = co_occurrence / sqrt(users_of_i * users_of_j)
 *         emit((song_i, song_j), similarity)
 *
 * MapReduce Job 3: Generate Recommendations
 * Input: User listening history + Song similarity matrix
 *
 * Map phase:
 * def map(user_id, songs_listened):
 *     for song_id in songs_listened:
 *         # Look up similar songs
 *         similar_songs = similarity_matrix[song_id]
 *         for (similar_song, score) in similar_songs.top_k(50):
 *             emit(user_id, (similar_song, score))
 *
 * Reduce phase:
 * def reduce(user_id, candidate_songs):
 *     # Aggregate scores, filter already-listened songs
 *     recommendations = {}
 *     for (song_id, score) in candidate_songs:
 *         recommendations[song_id] = recommendations.get(song_id, 0) + score
 *     # Sort by score, return top 30
 *     top_30 = sorted(recommendations.items(), key=lambda x: x[1], reverse=True)[:30]
 *     emit(user_id, top_30)  # Write to "Discover Weekly" playlist
 *
 * Join Algorithms for Enrichment (DDIA Ch. 10):
 * Goal: Join listening events with song metadata (artist, album, genre)
 *
 * Sort-Merge Join (DDIA Ch. 10):
 * Input A: Listening events (user_id, song_id, timestamp) - 1TB sorted by song_id
 * Input B: Song metadata (song_id, artist, genre) - 10GB sorted by song_id
 *
 * Mapper:
 * - Partition both inputs by song_id (same partitioning function)
 * - Each mapper gets events and metadata for same song_id range
 *
 * Reducer:
 * def reduce(song_id, values):
 *     metadata = None
 *     events = []
 *     for value in values:
 *         if value.type == 'metadata':
 *             metadata = value
 *         else:
 *             events.append(value)
 *     # Join: Enrich each event with metadata
 *     for event in events:
 *         enriched = {**event, **metadata}
 *         emit(event.user_id, enriched)
 *
 * Broadcast Join (DDIA Ch. 10):
 * When song metadata (10GB) fits in memory:
 * - Load entire metadata table into each mapper's memory
 * - No shuffle phase needed → Faster!
 *
 * Map phase:
 * metadata_map = load_metadata()  # 10GB in memory
 * def map(user_id, event):
 *     song_metadata = metadata_map[event.song_id]
 *     enriched = {**event, **song_metadata}
 *     emit(user_id, enriched)  # No reduce needed
 *
 * Batch Analytics Pipeline (DDIA Ch. 10):
 * Goal: Compute "Top Charts" trending songs updated daily
 *
 * MapReduce Job: Daily Play Counts
 * Input: Listening events from last 24 hours (compressed Avro files on HDFS)
 *
 * Map phase:
 * def map(user_id, event):
 *     if event.timestamp >= NOW() - 24 hours:
 *         emit(event.song_id, 1)  # Count play
 *
 * Reduce phase:
 * def reduce(song_id, counts):
 *     total_plays = sum(counts)
 *     emit(song_id, total_plays)
 *
 * Combiner optimization:
 * def combine(song_id, counts):
 *     # Sum counts locally before shuffle (reduces network I/O)
 *     return sum(counts)
 *
 * Output: Top 100 songs by play count → Load to Redis for API
 *
 * Incremental Batch Processing (DDIA Ch. 10):
 * - Partition events by date: /events/2025-01-01/, /events/2025-01-02/, ...
 * - Process only new partitions since last batch run
 * - Merge with previous results (e.g., rolling 7-day top charts)
 *
 * Workflow Orchestration with Airflow (DDIA Ch. 10):
 * DAG: Spotify Recommendation Pipeline
 *
 * Task 1: Extract listening events (00:00 UTC)
 * Task 2: Build co-occurrence matrix (depends on Task 1)
 * Task 3: Compute similarity scores (depends on Task 2)
 * Task 4: Generate user recommendations (depends on Task 3)
 * Task 5: Write to "Discover Weekly" playlists (depends on Task 4)
 *
 * Retry Logic:
 * - Task failure: Retry 3 times with exponential backoff (1min, 5min, 15min)
 * - Upstream failure: Skip downstream tasks
 * - Alerting: Slack notification if pipeline fails
 *
 * Data Warehouse for Analytics (DDIA Ch. 10):
 * Star Schema:
 * - Fact table: fact_plays (user_id, song_id, time_id, location_id, play_duration)
 * - Dimensions: dim_users, dim_songs, dim_time, dim_locations
 *
 * OLAP Query: "Top 10 genres in USA last month"
 * SELECT genre, SUM(play_count) as total_plays
 * FROM fact_plays
 * JOIN dim_songs ON fact_plays.song_id = dim_songs.song_id
 * JOIN dim_locations ON fact_plays.location_id = dim_locations.location_id
 * WHERE dim_locations.country = 'USA'
 *   AND time_id BETWEEN '2025-01-01' AND '2025-01-31'
 * GROUP BY genre
 * ORDER BY total_plays DESC
 * LIMIT 10;
 *
 * Materialized View: Pre-aggregate for fast dashboards
 * CREATE MATERIALIZED VIEW top_genres_by_country_day AS
 * SELECT country, date, genre, SUM(play_count) as total_plays
 * FROM fact_plays
 * JOIN dim_songs, dim_locations, dim_time
 * GROUP BY country, date, genre;
 *
 * System Design Primer Concepts:
 * - MapReduce: Hadoop/Spark for distributed batch processing
 * - HDFS: Distributed file system for petabyte-scale event storage
 * - Workflow: Apache Airflow for DAG orchestration
 * - Data Warehouse: Snowflake/Redshift for OLAP analytics
 */
export const spotifyProblemDefinition: ProblemDefinition = {
  id: 'spotify',
  title: 'Spotify - Music Streaming',
  description: `Design a music streaming platform like Spotify that:
- Users can search and play songs
- Users can create and share playlists
- Platform recommends music based on listening history
- Users can follow artists and other users

Learning Objectives (DDIA Ch. 10):
1. Implement MapReduce for collaborative filtering recommendations (DDIA Ch. 10)
   - Batch process billions of listening events for "Discover Weekly"
   - Item-based CF: "Users who liked X also liked Y"
   - Generate co-occurrence matrix and similarity scores
2. Design join algorithms for data enrichment (DDIA Ch. 10)
   - Sort-merge join: listening events + song metadata
   - Broadcast join: Small dimension tables in memory
   - Partition join: Co-partition by user_id for efficiency
3. Build batch analytics pipeline for trending songs (DDIA Ch. 10)
   - MapReduce: Count plays per song/artist/genre (last 24 hours)
   - Incremental batch: Process only new partitions
   - Combiners: Reduce shuffle network I/O
4. Orchestrate batch workflows with Airflow (DDIA Ch. 10)
   - DAG: Events → Features → CF Model → Recommendations
   - Retry logic with exponential backoff
   - Dependency management between tasks
5. Design data warehouse for OLAP analytics (DDIA Ch. 10)
   - Star schema: fact_plays + dimensions (users, songs, time, location)
   - Materialized views for dashboard performance
   - Roll-up queries: Daily → Weekly → Monthly aggregates`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Users can search and play songs',
    'Users can create and share playlists',
    'Users can follow artists and other users'
  ],

  userFacingNFRs: [
    'Batch recommendations: Process 100M users overnight (DDIA Ch. 10: MapReduce collaborative filtering)',
    'Join throughput: 10TB/hour for event enrichment (DDIA Ch. 10: Sort-merge join + broadcast join)',
    'Analytics latency: Daily top charts in < 1 hour (DDIA Ch. 10: Incremental batch with combiners)',
    'Workflow orchestration: < 6 hour end-to-end pipeline (DDIA Ch. 10: Airflow DAG with retries)',
    'OLAP query: Dashboard loads in < 5s (DDIA Ch. 10: Materialized views on star schema)',
    'MapReduce efficiency: 90% CPU utilization (DDIA Ch. 10: Partition-local combiners)',
    'Incremental processing: Only process new events (DDIA Ch. 10: Date-partitioned HDFS)',
    'Fault tolerance: Retry failed tasks 3× (DDIA Ch. 10: Airflow exponential backoff)',
    'Data warehouse: Roll-up aggregates in < 10s (DDIA Ch. 10: Pre-computed dimensions)',
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

  scenarios: generateScenarios('spotify', problemConfigs.spotify, [
    'Users can search and play songs',
    'Users can create and share playlists',
    'Users can follow artists and other users'
  ]),

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

  // Guided Tutorial
  guidedTutorial: spotifyGuidedTutorial,
};

// Auto-generate code challenges from functional requirements
(spotifyProblemDefinition as any).codeChallenges = generateCodeChallengesFromFRs(spotifyProblemDefinition);
