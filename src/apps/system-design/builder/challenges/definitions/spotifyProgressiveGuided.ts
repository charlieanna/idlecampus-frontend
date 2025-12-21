import { GuidedTutorial } from '../../types/guidedTutorial';

export const spotifyProgressiveGuidedTutorial: GuidedTutorial = {
  id: 'spotify-progressive-guided',
  title: 'Design Spotify - Progressive Journey',
  description: 'Build a music streaming platform that evolves from basic playback to personalized recommendations and offline sync',
  difficulty: 'progressive',
  estimatedTime: '4-6 hours across all phases',

  systemContext: {
    title: 'Spotify',
    description: 'A music streaming platform providing on-demand audio playback, playlists, and personalized recommendations',
    requirements: [
      'Stream music on-demand with minimal latency',
      'Create and manage playlists',
      'Search for songs, artists, and albums',
      'Provide personalized recommendations',
      'Support offline playback',
      'Handle royalty tracking for artists'
    ],
    existingInfrastructure: 'Starting fresh - you are building a new music streaming service'
  },

  phases: [
    {
      id: 'phase-1-beginner',
      name: 'Phase 1: Basic Streaming',
      description: 'Your startup "TuneStream" is launching a music streaming service. Users need to browse music and play songs. Start with the fundamentals.',
      difficulty: 'beginner',
      requiredSteps: ['step-1', 'step-2', 'step-3'],
      unlockCriteria: null
    },
    {
      id: 'phase-2-intermediate',
      name: 'Phase 2: Playlists & Social',
      description: 'TuneStream has 1M users! They want to create playlists, follow artists, and share music with friends. Time to add social features.',
      difficulty: 'intermediate',
      requiredSteps: ['step-4', 'step-5', 'step-6'],
      unlockCriteria: { completedPhases: ['phase-1-beginner'] }
    },
    {
      id: 'phase-3-advanced',
      name: 'Phase 3: Scale & Quality',
      description: 'TuneStream has 50M users streaming simultaneously. You need adaptive bitrate, global CDN, and seamless playback at scale.',
      difficulty: 'advanced',
      requiredSteps: ['step-7', 'step-8', 'step-9'],
      unlockCriteria: { completedPhases: ['phase-2-intermediate'] }
    },
    {
      id: 'phase-4-expert',
      name: 'Phase 4: Intelligence & Offline',
      description: 'TuneStream is competing with Spotify. Time to add personalized recommendations, offline mode, and artist analytics.',
      difficulty: 'expert',
      requiredSteps: ['step-10', 'step-11', 'step-12'],
      unlockCriteria: { completedPhases: ['phase-3-advanced'] }
    }
  ],

  steps: [
    // ============== PHASE 1: BASIC STREAMING ==============
    {
      id: 'step-1',
      title: 'Music Catalog',
      phase: 'phase-1-beginner',
      description: 'Design the data model for storing songs, albums, and artists',
      order: 1,

      educationalContent: {
        title: 'Modeling Music Metadata',
        explanation: `A music catalog has complex relationships: songs belong to albums, albums have artists, songs can have multiple artists (features), and the same song can appear on multiple albums (greatest hits, soundtracks).

**Core Data Models:**
\`\`\`typescript
interface Artist {
  id: string;
  name: string;
  bio: string;
  imageUrl: string;
  genres: string[];
  monthlyListeners: number;
  verified: boolean;
}

interface Album {
  id: string;
  title: string;
  artists: Artist[];  // Primary artist(s)
  releaseDate: Date;
  coverArt: string;
  type: 'album' | 'single' | 'ep' | 'compilation';
  totalTracks: number;
  label: string;
  copyrights: Copyright[];
}

interface Track {
  id: string;
  title: string;
  artists: Artist[];  // Can differ from album artists
  album: Album;
  trackNumber: number;
  discNumber: number;
  durationMs: number;
  explicit: boolean;
  audioFileId: string;  // Reference to actual audio
  isrc: string;  // International Standard Recording Code
}
\`\`\`

**Why ISRC Matters:**
The ISRC (International Standard Recording Code) uniquely identifies a recording worldwide. The same song re-released or on different albums has the same ISRC. This enables:
- Royalty tracking across platforms
- Duplicate detection
- Linking to other databases (Apple Music, YouTube)

**Catalog Scale:**
- Spotify: ~100 million tracks
- Growing by ~100,000 new tracks daily
- Metadata storage: ~10TB (small!)
- The audio files are the big storage challenge`,
        keyInsight: 'Music metadata has many-to-many relationships everywhere - tracks have multiple artists, appear on multiple albums, and the same recording (ISRC) can exist in multiple versions',
        commonMistakes: [
          'Assuming one track = one album (compilations break this)',
          'Not handling featuring artists separately',
          'Ignoring ISRC for cross-platform identification'
        ],
        interviewTips: [
          'Mention the ISRC as the unique identifier for royalty tracking',
          'Discuss album types (single, EP, album, compilation)',
          'Talk about how metadata is tiny compared to audio storage'
        ],
        realWorldExample: 'When you "Shazam" a song, it returns an ISRC. Spotify uses that ISRC to find the exact track in their catalog, even if metadata differs slightly.'
      },

      requiredComponents: ['Client', 'API Gateway', 'Catalog Service', 'Metadata Database'],

      hints: [
        { trigger: 'stuck', content: 'Start with the core entities: Artist, Album, Track. Consider their relationships.' },
        { trigger: 'simple_model', content: 'A track can have multiple artists (features) and appear on multiple albums (compilations).' },
        { trigger: 'no_isrc', content: 'ISRC (International Standard Recording Code) uniquely identifies recordings for royalties.' }
      ],

      validation: {
        requiredConnections: [
          { from: 'Client', to: 'API Gateway' },
          { from: 'API Gateway', to: 'Catalog Service' },
          { from: 'Catalog Service', to: 'Metadata Database' }
        ],
        requiredComponents: ['Catalog Service', 'Metadata Database']
      },

      thinkingFramework: {
        approach: 'data-modeling',
        questions: [
          'What are the core entities in a music catalog?',
          'How do tracks, albums, and artists relate?',
          'What uniquely identifies a song recording?'
        ],
        tradeoffs: [
          { option: 'Normalized database', pros: ['No duplication', 'Easy updates'], cons: ['Complex queries', 'More joins'] },
          { option: 'Denormalized for reads', pros: ['Fast queries'], cons: ['Data duplication', 'Harder updates'] }
        ]
      }
    },

    {
      id: 'step-2',
      title: 'Audio Streaming',
      phase: 'phase-1-beginner',
      description: 'Implement basic audio playback with streaming from cloud storage',
      order: 2,

      educationalContent: {
        title: 'Streaming Audio at Scale',
        explanation: `Audio streaming is fundamentally different from video - files are smaller but users expect instant playback with zero buffering.

**Audio File Specs:**
\`\`\`
Spotify audio qualities:
- Low: 24 kbps (Ogg Vorbis)
- Normal: 96 kbps
- High: 160 kbps
- Very High: 320 kbps

Average song (3.5 minutes):
- 96 kbps: ~2.5 MB
- 320 kbps: ~8.4 MB
\`\`\`

**Why Ogg Vorbis?**
- Better quality per bitrate than MP3
- Open source (no licensing fees)
- Spotify also uses AAC for Apple devices

**Streaming Flow:**
\`\`\`
1. Client requests track
2. Server returns signed URL to audio file
3. Client streams via HTTP Range requests
4. Playback starts after small buffer (~500KB)
\`\`\`

**HTTP Range Requests:**
Enable seeking without downloading entire file:
\`\`\`
GET /track.ogg
Range: bytes=1000000-1500000

Response: 206 Partial Content
Content-Range: bytes 1000000-1500000/8400000
\`\`\`

**Buffer Strategy:**
- Buffer ahead: 30 seconds of audio
- Re-buffer on seek
- Adaptive buffer size based on network quality

**Gapless Playback:**
Spotify's signature feature - no silence between album tracks:
- Pre-fetch next track while current plays
- Cross-fade or gapless transition
- Requires client-side queue management`,
        keyInsight: 'Audio streaming uses HTTP Range requests for seeking and requires aggressive pre-buffering of the next track for seamless transitions',
        commonMistakes: [
          'Downloading entire file before playing',
          'Not implementing Range requests for seeking',
          'Forgetting gapless playback for albums'
        ],
        interviewTips: [
          'Explain why Ogg Vorbis over MP3 (quality and licensing)',
          'Discuss HTTP Range requests for seeking',
          'Mention pre-fetching next track for gapless playback'
        ],
        realWorldExample: 'Spotify pre-downloads the next few tracks in your queue. When you skip, playback is instant because the audio is already buffered locally.'
      },

      requiredComponents: ['Client', 'API Gateway', 'Streaming Service', 'Audio Storage', 'CDN'],

      hints: [
        { trigger: 'stuck', content: 'Audio files are stored in object storage (S3) and served via CDN for low latency' },
        { trigger: 'no_cdn', content: 'Users are global. Without CDN, playback latency will be unacceptable.' },
        { trigger: 'full_download', content: 'Stream audio progressively with HTTP Range requests, dont download entire file first.' }
      ],

      validation: {
        requiredConnections: [
          { from: 'Client', to: 'CDN' },
          { from: 'CDN', to: 'Audio Storage' },
          { from: 'Client', to: 'API Gateway' },
          { from: 'API Gateway', to: 'Streaming Service' }
        ],
        requiredComponents: ['Streaming Service', 'Audio Storage', 'CDN']
      },

      thinkingFramework: {
        approach: 'performance-optimization',
        questions: [
          'How do we minimize time to first byte of audio?',
          'How do we handle seeking in a long track?',
          'How do we make track transitions seamless?'
        ],
        tradeoffs: [
          { option: 'Full download then play', pros: ['Simple', 'No buffering issues'], cons: ['Slow start', 'Wasted bandwidth'] },
          { option: 'Progressive streaming', pros: ['Instant start', 'Efficient'], cons: ['More complex', 'Buffer management'] }
        ]
      }
    },

    {
      id: 'step-3',
      title: 'Music Search',
      phase: 'phase-1-beginner',
      description: 'Implement search across songs, artists, and albums',
      order: 3,

      educationalContent: {
        title: 'Building Music Search',
        explanation: `Music search has unique challenges: users search by song title, artist name, lyrics fragments, or even partial/misspelled queries.

**Search Query Types:**
\`\`\`
"Bohemian Rhapsody" - exact title
"Queen" - artist name
"Is this the real life" - lyrics
"bohemain rapsody" - typo
"that song that goes mama" - vague/partial
\`\`\`

**Search Architecture:**
\`\`\`
Elasticsearch index with multiple fields:
{
  "track_id": "abc123",
  "title": "Bohemian Rhapsody",
  "title_normalized": "bohemian rhapsody",
  "artist": "Queen",
  "album": "A Night at the Opera",
  "lyrics": "Is this the real life...",
  "popularity": 98,
  "release_year": 1975
}
\`\`\`

**Fuzzy Matching:**
Handle typos with Elasticsearch fuzzy queries:
\`\`\`json
{
  "fuzzy": {
    "title": {
      "value": "bohemain",
      "fuzziness": "AUTO"
    }
  }
}
\`\`\`

**Ranking Signals:**
1. Text relevance (BM25 score)
2. Popularity (play count)
3. Recency (new releases boosted)
4. Personalization (prefer genres user listens to)
5. Exact match boost (typing "Queen" should show Queen first)

**Autocomplete:**
As-you-type suggestions require:
- Edge n-gram tokenization
- Low latency (sub-50ms)
- Separate lightweight index
\`\`\`
"Bohe" → ["Bohemian Rhapsody", "Bohemian Like You"]
\`\`\``,
        keyInsight: 'Music search requires fuzzy matching for typos, multiple field search (title, artist, lyrics), and heavy ranking by popularity since users usually want the most popular version',
        commonMistakes: [
          'Only matching exact text (users make typos)',
          'Not boosting by popularity (obscure covers appear first)',
          'Slow autocomplete (must be <50ms)'
        ],
        interviewTips: [
          'Discuss fuzzy matching for typo tolerance',
          'Mention popularity as a key ranking signal',
          'Talk about autocomplete requiring separate optimized index'
        ],
        realWorldExample: 'When you search "helo" in Spotify, it shows "Hello" by Adele because fuzzy matching handles the missing letter, and Adeles version ranks highest by popularity.'
      },

      requiredComponents: ['Client', 'API Gateway', 'Search Service', 'Elasticsearch', 'Metadata Database'],

      hints: [
        { trigger: 'stuck', content: 'Use Elasticsearch for full-text search with fuzzy matching for typos' },
        { trigger: 'sql_only', content: 'SQL LIKE queries are too slow and dont handle typos. Use a search engine.' },
        { trigger: 'no_ranking', content: 'Results need ranking by relevance AND popularity. BM25 alone isnt enough.' }
      ],

      validation: {
        requiredConnections: [
          { from: 'Client', to: 'API Gateway' },
          { from: 'API Gateway', to: 'Search Service' },
          { from: 'Search Service', to: 'Elasticsearch' }
        ],
        requiredComponents: ['Search Service', 'Elasticsearch']
      },

      thinkingFramework: {
        approach: 'search-ranking',
        questions: [
          'How do we handle typos in search queries?',
          'What signals determine which result ranks first?',
          'How do we make autocomplete fast enough?'
        ],
        tradeoffs: [
          { option: 'SQL LIKE queries', pros: ['Simple'], cons: ['No fuzzy match', 'Slow', 'No ranking'] },
          { option: 'Elasticsearch', pros: ['Fuzzy', 'Fast', 'Ranking'], cons: ['Extra infrastructure', 'Sync complexity'] }
        ]
      }
    },

    // ============== PHASE 2: PLAYLISTS & SOCIAL ==============
    {
      id: 'step-4',
      title: 'User Playlists',
      phase: 'phase-2-intermediate',
      description: 'Enable users to create, edit, and organize playlists',
      order: 4,

      educationalContent: {
        title: 'Designing Playlists',
        explanation: `Playlists are the core user-generated content in music streaming. They range from personal collections to viral public playlists with millions of followers.

**Playlist Data Model:**
\`\`\`typescript
interface Playlist {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  coverImage: string;
  isPublic: boolean;
  isCollaborative: boolean;
  followers: number;
  tracks: PlaylistTrack[];
  createdAt: Date;
  updatedAt: Date;
}

interface PlaylistTrack {
  trackId: string;
  addedAt: Date;
  addedBy: string;  // For collaborative playlists
  position: number;  // Order in playlist
}
\`\`\`

**Ordering Challenges:**
Users reorder tracks constantly. Naive approach:
\`\`\`
position: 1, 2, 3, 4, 5
Move track 5 to position 2:
Update positions 2,3,4,5 → expensive!
\`\`\`

**Better: Fractional Indexing**
\`\`\`
Initial: 1.0, 2.0, 3.0, 4.0, 5.0
Insert between 1 and 2: position = 1.5
Insert between 1 and 1.5: position = 1.25
\`\`\`
Only update the moved item, not the entire list.

**Collaborative Playlists:**
Multiple users edit the same playlist:
- Conflict resolution: last write wins (simple)
- Operational transforms (complex but better UX)
- Real-time sync via WebSocket for live editing

**Playlist Folders:**
Users organize hundreds of playlists:
\`\`\`typescript
interface PlaylistFolder {
  id: string;
  name: string;
  playlistIds: string[];
  position: number;
}
\`\`\``,
        keyInsight: 'Playlist ordering is a common interview problem - fractional indexing allows O(1) reordering instead of O(n) position updates',
        commonMistakes: [
          'Using integer positions (requires updating many rows on reorder)',
          'Not handling collaborative edit conflicts',
          'Allowing unlimited playlist size (causes performance issues)'
        ],
        interviewTips: [
          'Explain fractional indexing for efficient reordering',
          'Discuss collaborative playlist conflict resolution',
          'Mention that Spotify limits playlists to 10,000 tracks'
        ],
        realWorldExample: 'Spotify uses "Lexicographic fractional indexing" - positions are strings like "0|i" that allow infinite insertions between any two items.'
      },

      requiredComponents: ['Client', 'API Gateway', 'Playlist Service', 'Playlist Database', 'Metadata Database'],

      hints: [
        { trigger: 'stuck', content: 'Playlists are ordered lists of tracks. Consider how reordering affects the database.' },
        { trigger: 'integer_positions', content: 'Integer positions require updating many rows on reorder. Try fractional indexing.' },
        { trigger: 'no_collab', content: 'Collaborative playlists need conflict resolution. What happens with simultaneous edits?' }
      ],

      validation: {
        requiredConnections: [
          { from: 'Client', to: 'API Gateway' },
          { from: 'API Gateway', to: 'Playlist Service' },
          { from: 'Playlist Service', to: 'Playlist Database' }
        ],
        requiredComponents: ['Playlist Service', 'Playlist Database']
      },

      thinkingFramework: {
        approach: 'data-structure-choice',
        questions: [
          'How do we efficiently reorder tracks in a playlist?',
          'How do we handle collaborative editing?',
          'What limits should we place on playlist size?'
        ],
        tradeoffs: [
          { option: 'Integer positions', pros: ['Simple', 'Intuitive'], cons: ['O(n) reorder', 'Contention'] },
          { option: 'Fractional indexing', pros: ['O(1) reorder'], cons: ['More complex', 'Precision limits'] }
        ]
      }
    },

    {
      id: 'step-5',
      title: 'Following & Library',
      phase: 'phase-2-intermediate',
      description: 'Let users follow artists, save albums, and build their library',
      order: 5,

      educationalContent: {
        title: 'User Library & Follow System',
        explanation: `Users build their music library by following artists, saving albums, and liking songs. This creates a personalized music collection.

**Library Data Models:**
\`\`\`typescript
interface UserLibrary {
  userId: string;
  savedTracks: Array<{
    trackId: string;
    savedAt: Date;
  }>;
  savedAlbums: Array<{
    albumId: string;
    savedAt: Date;
  }>;
  followedArtists: Array<{
    artistId: string;
    followedAt: Date;
  }>;
  followedPlaylists: Array<{
    playlistId: string;
    followedAt: Date;
  }>;
}
\`\`\`

**Scale Considerations:**
- Users can save tens of thousands of songs
- Popular artists have millions of followers
- Need to answer: "Does user X follow artist Y?" in O(1)

**Storage Strategy:**
\`\`\`
User-centric queries (my library):
  Key: user_123_saved_tracks
  Value: Set of track IDs with timestamps

Entity-centric queries (artist followers count):
  Counter: artist_456_follower_count = 5,234,567
\`\`\`

**Fan-out on Save:**
When a user saves a track:
1. Add to user's saved tracks (user-centric)
2. Increment track's save count (aggregate)
3. Notify recommendation system (for personalization)
4. Update search relevance (popular tracks rank higher)

**"Liked Songs" Playlist:**
Spotify auto-generates a playlist from liked tracks:
- Automatically synced as user likes/unlikes
- Can be played shuffled or in order
- Essentially a virtual playlist backed by the likes table`,
        keyInsight: 'Library operations require both user-centric storage (my saved songs) and entity-centric aggregates (total followers) - optimize for both read patterns',
        commonMistakes: [
          'Only storing user→entity relationship (slow to count followers)',
          'Not using counters for aggregate stats',
          'Loading entire library when user just wants to check one item'
        ],
        interviewTips: [
          'Discuss dual storage: user-centric and entity-centric',
          'Mention approximate counters for follower counts at scale',
          'Talk about "Liked Songs" as a virtual playlist pattern'
        ],
        realWorldExample: 'Spotify shows "5.2M monthly listeners" - this is an approximate counter updated asynchronously, not a real-time count of a table.'
      },

      requiredComponents: ['Client', 'API Gateway', 'Library Service', 'User Database', 'Redis Cache'],

      hints: [
        { trigger: 'stuck', content: 'Library needs user-centric views (my saved songs) AND entity-centric aggregates (follower counts)' },
        { trigger: 'single_table', content: 'One table cant serve both "my library" and "artist followers" efficiently. Denormalize.' },
        { trigger: 'exact_counts', content: 'Exact follower counts are expensive. Use approximate counters updated asynchronously.' }
      ],

      validation: {
        requiredConnections: [
          { from: 'Client', to: 'API Gateway' },
          { from: 'API Gateway', to: 'Library Service' },
          { from: 'Library Service', to: 'User Database' },
          { from: 'Library Service', to: 'Redis Cache' }
        ],
        requiredComponents: ['Library Service', 'User Database', 'Redis Cache']
      },

      thinkingFramework: {
        approach: 'read-write-patterns',
        questions: [
          'What are the common read patterns for library data?',
          'How do we efficiently count followers at scale?',
          'How do we check membership quickly (is song saved)?'
        ],
        tradeoffs: [
          { option: 'Single normalized table', pros: ['Simple'], cons: ['Slow aggregates', 'Hot partitions for popular artists'] },
          { option: 'Denormalized with counters', pros: ['Fast reads', 'Efficient counts'], cons: ['Eventual consistency', 'More storage'] }
        ]
      }
    },

    {
      id: 'step-6',
      title: 'Social Sharing',
      phase: 'phase-2-intermediate',
      description: 'Add friend activity feed showing what friends are listening to',
      order: 6,

      educationalContent: {
        title: 'Music as Social Experience',
        explanation: `Spotifys friend activity shows real-time listening activity, creating social discovery of music.

**Activity Feed Data:**
\`\`\`typescript
interface ListeningActivity {
  userId: string;
  trackId: string;
  context: 'playlist' | 'album' | 'radio' | 'search';
  contextId: string;  // Which playlist/album
  startedAt: Date;
  device: string;
}
\`\`\`

**Real-Time Activity Feed:**
\`\`\`
Friend Activity Panel:
- John is listening to "Blinding Lights"
- Sarah is listening to "Bad Guy"
- Mike is listening to "Watermelon Sugar"
\`\`\`

**Privacy Controls:**
Users must opt-in to share activity:
\`\`\`typescript
interface PrivacySettings {
  shareListeningActivity: boolean;
  privateSession: boolean;  // Temporary privacy
  showRecentlyPlayed: boolean;
}
\`\`\`

**Activity Distribution:**
When user plays a song:
1. Check privacy settings
2. If sharing enabled, publish to activity stream
3. Friends subscribed to user's activity receive update
4. Fan-out to all friends (push model for real-time)

**Activity Aggregation:**
Dont spam with every song - aggregate short listens:
\`\`\`
Skip after 10 seconds → don't publish
Listen for >30 seconds → publish activity
Play same song again → update timestamp, don't create new
\`\`\`

**Collaborative Listening:**
"Group Session" feature - friends listen together:
- Host controls playback
- All participants hear same track at same time
- WebSocket for sync across devices`,
        keyInsight: 'Social music features require real-time pub/sub for activity feeds, but must respect privacy settings and aggregate short listens to avoid spam',
        commonMistakes: [
          'Sharing activity without user consent (privacy issue)',
          'Publishing every song change (spammy)',
          'Not handling "private session" mode'
        ],
        interviewTips: [
          'Discuss privacy as a first-class concern',
          'Explain activity aggregation (minimum listen time)',
          'Mention real-time sync for group listening features'
        ],
        realWorldExample: 'Spotify\'s "Private Session" temporarily hides your activity from friends - useful when listening to guilty pleasures!'
      },

      requiredComponents: ['Client', 'API Gateway', 'Activity Service', 'WebSocket Gateway', 'Redis Cache', 'Activity Database'],

      hints: [
        { trigger: 'stuck', content: 'Activity feeds need real-time push to friends. Consider WebSocket for live updates.' },
        { trigger: 'no_privacy', content: 'Users must opt-in to share activity. Privacy settings are critical.' },
        { trigger: 'every_song', content: 'Dont publish skipped songs. Only share meaningful listens (>30 seconds).' }
      ],

      validation: {
        requiredConnections: [
          { from: 'Client', to: 'WebSocket Gateway' },
          { from: 'WebSocket Gateway', to: 'Activity Service' },
          { from: 'Activity Service', to: 'Redis Cache' },
          { from: 'Activity Service', to: 'Activity Database' }
        ],
        requiredComponents: ['Activity Service', 'WebSocket Gateway']
      },

      thinkingFramework: {
        approach: 'real-time-architecture',
        questions: [
          'How do we push activity updates to friends in real-time?',
          'What privacy controls do users need?',
          'How do we avoid spamming the feed with every song?'
        ],
        tradeoffs: [
          { option: 'Poll for updates', pros: ['Simple'], cons: ['Delayed', 'Wastes bandwidth'] },
          { option: 'WebSocket push', pros: ['Real-time', 'Efficient'], cons: ['Connection management complexity'] }
        ]
      }
    },

    // ============== PHASE 3: SCALE & QUALITY ==============
    {
      id: 'step-7',
      title: 'Adaptive Bitrate Streaming',
      phase: 'phase-3-advanced',
      description: 'Implement quality switching based on network conditions',
      order: 7,

      educationalContent: {
        title: 'Adaptive Bitrate for Audio',
        explanation: `Unlike video (where ABR is critical), audio ABR is simpler but still important for mobile users with varying network quality.

**Audio Quality Tiers:**
\`\`\`
File encoding (Ogg Vorbis):
- Low: 24 kbps (saves data, lower quality)
- Normal: 96 kbps (default free tier)
- High: 160 kbps (premium)
- Very High: 320 kbps (premium, WiFi only default)

Each track stored in all qualities:
track_123_24.ogg
track_123_96.ogg
track_123_160.ogg
track_123_320.ogg
\`\`\`

**Quality Selection Logic:**
\`\`\`typescript
function selectQuality(
  networkType: 'wifi' | 'cellular' | '3g',
  bandwidth: number,  // measured kbps
  userSetting: 'auto' | 'low' | 'normal' | 'high' | 'very_high',
  isPremium: boolean
): Quality {
  if (userSetting !== 'auto') return userSetting;

  if (networkType === 'wifi' && isPremium) return 'very_high';
  if (bandwidth > 500) return 'high';
  if (bandwidth > 150) return 'normal';
  return 'low';
}
\`\`\`

**Mid-Song Quality Switch:**
Unlike video, audio rarely switches mid-song:
- Songs are short (3-4 minutes)
- Buffer ahead is larger relative to file size
- Quality switch is jarring for audio (noticeable)

**Bandwidth Measurement:**
- Measure download speed during stream
- Running average over last 30 seconds
- Use for next track selection, not current track

**Storage Multiplication:**
\`\`\`
100M tracks × 4 qualities = 400M files
Average 3MB per file × 400M = 1.2 PB
\`\`\`
Storage cost is significant but manageable.`,
        keyInsight: 'Audio ABR is simpler than video - switch quality between tracks rather than during playback, and let users set preferences per network type',
        commonMistakes: [
          'Switching quality mid-song (jarring)',
          'Not accounting for user preferences (some want data savings)',
          'Defaulting to highest quality on cellular (users hate this)'
        ],
        interviewTips: [
          'Explain why audio ABR differs from video ABR',
          'Discuss storage multiplication for multiple qualities',
          'Mention user settings per network type (WiFi vs cellular)'
        ],
        realWorldExample: 'Spotify remembers your quality preference per network - "Very High" on WiFi but "Normal" on cellular. It even has a "Data Saver" mode for low-bandwidth situations.'
      },

      requiredComponents: ['Client', 'API Gateway', 'Streaming Service', 'Audio Storage', 'CDN', 'Quality Selector'],

      hints: [
        { trigger: 'stuck', content: 'Store each track in multiple bitrates. Select quality based on network and user settings.' },
        { trigger: 'single_quality', content: 'Users on slow networks need lower bitrates. Store multiple encodings.' },
        { trigger: 'realtime_switch', content: 'Unlike video, audio quality usually stays constant per track. Switch between tracks.' }
      ],

      validation: {
        requiredConnections: [
          { from: 'Client', to: 'API Gateway' },
          { from: 'API Gateway', to: 'Streaming Service' },
          { from: 'Streaming Service', to: 'Audio Storage' },
          { from: 'Audio Storage', to: 'CDN' }
        ],
        requiredComponents: ['Audio Storage', 'CDN']
      },

      thinkingFramework: {
        approach: 'user-experience',
        questions: [
          'When should we switch audio quality?',
          'How do we measure network bandwidth?',
          'What user controls should we provide?'
        ],
        tradeoffs: [
          { option: 'Always highest quality', pros: ['Best audio'], cons: ['Data usage', 'Buffering on slow networks'] },
          { option: 'Adaptive based on network', pros: ['No buffering', 'Data efficient'], cons: ['Variable quality'] }
        ]
      }
    },

    {
      id: 'step-8',
      title: 'Global CDN Strategy',
      phase: 'phase-3-advanced',
      description: 'Design CDN architecture for serving audio worldwide with minimal latency',
      order: 8,

      educationalContent: {
        title: 'CDN for Music Streaming',
        explanation: `With 500M users globally, audio files must be served from nearby edge locations for instant playback.

**CDN Challenges for Music:**
- 100M tracks × 4 qualities = 400M files
- Total storage: ~1.5 PB
- Cant cache everything at every edge

**Tiered Caching Strategy:**
\`\`\`
Tier 1: Edge locations (100s worldwide)
  - Cache popular tracks
  - ~10TB per location
  - Hit rate: ~85% for popular content

Tier 2: Regional hubs (10-20 worldwide)
  - Larger cache
  - ~100TB per hub
  - Fallback for edge misses

Tier 3: Origin (cloud storage)
  - All content
  - Accessed only for rare tracks
\`\`\`

**Popularity-Based Caching:**
\`\`\`
Top 1% of tracks = 80% of plays (power law)
Cache strategy:
- Hot tier: Top 100K tracks, all edges
- Warm tier: Top 1M tracks, regional
- Cold tier: Everything else, origin only
\`\`\`

**Cache Key Design:**
\`\`\`
/audio/{track_id}/{quality}.ogg
/audio/abc123/320.ogg

Include quality in key so each bitrate cached separately
\`\`\`

**Edge Selection:**
DNS-based routing to nearest edge:
\`\`\`
audio.spotify.com → GeoDNS
→ User in Tokyo → edge-tokyo.spotify.com
→ User in Berlin → edge-frankfurt.spotify.com
\`\`\`

**Cost Optimization:**
- Origin egress is expensive
- Edge-to-edge transfer is cheaper
- Pull popular content from nearby edge, not origin
\`\`\`
edge-tokyo misses → pull from edge-singapore
NOT from us-east-1 origin
\`\`\``,
        keyInsight: 'Music follows a power law distribution - the top 1% of tracks get 80% of plays, so cache aggressively based on popularity and use tiered caching',
        commonMistakes: [
          'Trying to cache all content at all edges (impossible)',
          'Not using popularity for cache decisions',
          'Pulling from origin instead of nearby edges'
        ],
        interviewTips: [
          'Explain power law distribution of music plays',
          'Discuss tiered caching strategy',
          'Mention edge-to-edge transfer for cost optimization'
        ],
        realWorldExample: 'Spotify pre-positions new releases from major artists at all edges before release time. When a Taylor Swift album drops, its already at every edge location.'
      },

      requiredComponents: ['Client', 'CDN', 'Regional Cache', 'Origin Storage', 'GeoDNS'],

      hints: [
        { trigger: 'stuck', content: 'Music follows power law - top 1% of tracks = 80% of plays. Cache based on popularity.' },
        { trigger: 'cache_all', content: 'You cant cache 400M files at every edge. Use tiered caching with popularity-based eviction.' },
        { trigger: 'origin_always', content: 'Origin egress is expensive. Pull from nearby edges when possible.' }
      ],

      validation: {
        requiredConnections: [
          { from: 'Client', to: 'CDN' },
          { from: 'CDN', to: 'Regional Cache' },
          { from: 'Regional Cache', to: 'Origin Storage' }
        ],
        requiredComponents: ['CDN', 'Regional Cache', 'Origin Storage']
      },

      thinkingFramework: {
        approach: 'caching-strategy',
        questions: [
          'What percentage of tracks are played frequently?',
          'How do we decide what to cache at edge locations?',
          'How do we minimize origin egress costs?'
        ],
        tradeoffs: [
          { option: 'Uniform caching', pros: ['Simple'], cons: ['Inefficient', 'Poor hit rate'] },
          { option: 'Popularity-based caching', pros: ['High hit rate', 'Cost efficient'], cons: ['Cold tracks have latency'] }
        ]
      }
    },

    {
      id: 'step-9',
      title: 'Play Count & Royalties',
      phase: 'phase-3-advanced',
      description: 'Track plays accurately for royalty payments and artist analytics',
      order: 9,

      educationalContent: {
        title: 'Counting Plays at Scale',
        explanation: `Play counts determine how billions of dollars are distributed to artists, labels, and publishers. Accuracy is critical and auditable.

**What Counts as a "Play"?**
Spotify's rule: 30+ seconds of playback
\`\`\`typescript
interface PlayEvent {
  userId: string;
  trackId: string;
  timestamp: Date;
  durationMs: number;  // How long they listened
  context: 'playlist' | 'album' | 'radio';
  contextId: string;
  device: string;
  quality: string;
  offline: boolean;  // Was this synced later?
  country: string;  // Affects royalty rates
}
\`\`\`

**Fraud Detection:**
- Bot plays (scripts playing songs)
- Click farms (paid services to inflate plays)
- Playlist stuffing (short songs repeated)

**Detection Signals:**
\`\`\`
Red flags:
- Same user, same track, repeated
- Plays from same IP range
- Accounts only playing one artist
- Unnaturally uniform play patterns
\`\`\`

**Royalty Calculation:**
\`\`\`
Monthly royalty pool ÷ total plays × track plays = track royalty

But it's more complex:
- Premium plays worth more than free
- Country rates differ
- Label/distributor takes percentage
- Publishers (songwriters) paid separately from masters (performers)
\`\`\`

**Event Processing Pipeline:**
\`\`\`
Client → Kafka → Stream Processing →
  ├── Real-time counters (for display)
  ├── Fraud detection
  └── Batch aggregation (for royalties)
\`\`\`

**Immutable Audit Log:**
Royalty payments are legally binding:
- Every play event stored immutably
- Batch aggregation is reproducible
- Artists can audit their play counts`,
        keyInsight: 'Play counting isnt just incrementing a counter - it determines billion-dollar royalty payments and requires fraud detection, country-specific rates, and immutable audit logs',
        commonMistakes: [
          'Simple counter without fraud detection',
          'Not requiring minimum play duration',
          'Losing play events (unacceptable for royalties)'
        ],
        interviewTips: [
          'Explain the 30-second rule for counting plays',
          'Discuss fraud detection for bot plays',
          'Mention that different countries have different royalty rates'
        ],
        realWorldExample: 'In 2020, Spotify removed thousands of tracks after detecting artificial streaming fraud. Their fraud detection looks for unnatural patterns across millions of data points.'
      },

      requiredComponents: ['Client', 'API Gateway', 'Play Event Service', 'Kafka', 'Stream Processor', 'Fraud Detection', 'Play Count Database'],

      hints: [
        { trigger: 'stuck', content: 'Plays determine royalties. Need fraud detection and immutable audit logging.' },
        { trigger: 'simple_counter', content: 'A simple counter can be gamed. Need fraud detection for bot plays.' },
        { trigger: 'no_audit', content: 'Royalty payments are legal. Every play must be in an immutable audit log.' }
      ],

      validation: {
        requiredConnections: [
          { from: 'Client', to: 'API Gateway' },
          { from: 'API Gateway', to: 'Play Event Service' },
          { from: 'Play Event Service', to: 'Kafka' },
          { from: 'Kafka', to: 'Stream Processor' },
          { from: 'Stream Processor', to: 'Fraud Detection' },
          { from: 'Stream Processor', to: 'Play Count Database' }
        ],
        requiredComponents: ['Play Event Service', 'Kafka', 'Stream Processor', 'Fraud Detection']
      },

      thinkingFramework: {
        approach: 'data-integrity',
        questions: [
          'How do we ensure accurate play counts?',
          'How do we detect fraudulent plays?',
          'How do we make royalty calculations auditable?'
        ],
        tradeoffs: [
          { option: 'Trust all plays', pros: ['Simple'], cons: ['Fraud vulnerable', 'Legal liability'] },
          { option: 'Strict validation + fraud detection', pros: ['Accurate', 'Auditable'], cons: ['Complex', 'May reject legitimate plays'] }
        ]
      }
    },

    // ============== PHASE 4: INTELLIGENCE & OFFLINE ==============
    {
      id: 'step-10',
      title: 'Personalized Recommendations',
      phase: 'phase-4-expert',
      description: 'Build recommendation algorithms for Discover Weekly and Radio',
      order: 10,

      educationalContent: {
        title: 'Music Recommendation Systems',
        explanation: `Spotifys recommendation system is their competitive moat. "Discover Weekly" drives engagement and differentiates from competitors.

**Recommendation Approaches:**

**1. Collaborative Filtering:**
"Users who liked X also liked Y"
\`\`\`
User A likes: [Track 1, Track 2, Track 3]
User B likes: [Track 1, Track 2, Track 4]
Recommend Track 4 to User A
\`\`\`

**2. Content-Based Filtering:**
Analyze audio features to find similar songs:
\`\`\`typescript
interface AudioFeatures {
  tempo: number;        // BPM
  energy: number;       // 0-1 intensity
  danceability: number; // 0-1
  valence: number;      // 0-1 (sad to happy)
  acousticness: number;
  instrumentalness: number;
  speechiness: number;
  key: number;
  mode: 'major' | 'minor';
}
\`\`\`
Find tracks with similar feature vectors.

**3. Natural Language Processing:**
Analyze text about music:
- Blog posts mentioning tracks together
- Playlist names and descriptions
- Social media discussions

**Hybrid System:**
\`\`\`
Final score =
  0.4 × collaborative_score +
  0.3 × content_score +
  0.2 × popularity_score +
  0.1 × freshness_score
\`\`\`

**Discover Weekly Pipeline:**
\`\`\`
Weekly batch job:
1. Build user taste profile from recent listens
2. Find similar users (collaborative)
3. Extract candidate tracks from similar users
4. Filter: remove already-played, match audio features
5. Rank by predicted rating
6. Diversify: ensure genre/artist variety
7. Generate 30-song playlist
\`\`\`

**Cold Start Problem:**
New users have no history:
- Ask genre preferences on signup
- Use demographic similarities
- Start with popularity-based recommendations`,
        keyInsight: 'Music recommendation combines collaborative filtering (user similarity), content-based filtering (audio features), and NLP (text analysis) - no single approach works alone',
        commonMistakes: [
          'Only using collaborative filtering (fails for new/niche music)',
          'Not diversifying recommendations (too similar)',
          'Recommending songs user has already heard many times'
        ],
        interviewTips: [
          'Explain collaborative vs content-based filtering',
          'Discuss audio feature extraction for similarity',
          'Mention the cold start problem for new users'
        ],
        realWorldExample: 'Spotifys audio analysis extracts 13 features from every track. Their "Discover Weekly" blends collaborative filtering with these audio features to surface songs you haven\'t heard but will probably like.'
      },

      requiredComponents: ['Recommendation Service', 'User Profile Service', 'Audio Analysis Service', 'ML Model Service', 'Feature Store'],

      hints: [
        { trigger: 'stuck', content: 'Recommendations need multiple signals: user behavior, audio features, and text analysis' },
        { trigger: 'collab_only', content: 'Collaborative filtering fails for new music. Also use audio feature similarity.' },
        { trigger: 'no_diversity', content: 'Users get bored with similar recommendations. Ensure genre and artist diversity.' }
      ],

      validation: {
        requiredConnections: [
          { from: 'Recommendation Service', to: 'User Profile Service' },
          { from: 'Recommendation Service', to: 'Audio Analysis Service' },
          { from: 'Recommendation Service', to: 'ML Model Service' },
          { from: 'Recommendation Service', to: 'Feature Store' }
        ],
        requiredComponents: ['Recommendation Service', 'Audio Analysis Service', 'ML Model Service', 'Feature Store']
      },

      thinkingFramework: {
        approach: 'ml-system-design',
        questions: [
          'What signals indicate a user will like a song?',
          'How do we recommend new music with no play history?',
          'How do we balance familiarity and discovery?'
        ],
        tradeoffs: [
          { option: 'Collaborative only', pros: ['Proven', 'Captures taste'], cons: ['Cold start', 'Filter bubble'] },
          { option: 'Hybrid approach', pros: ['Better coverage', 'More serendipity'], cons: ['Complex', 'Harder to tune'] }
        ]
      }
    },

    {
      id: 'step-11',
      title: 'Offline Mode',
      phase: 'phase-4-expert',
      description: 'Enable downloading music for offline playback with DRM protection',
      order: 11,

      educationalContent: {
        title: 'Offline Music with DRM',
        explanation: `Offline mode is critical for mobile users but requires DRM (Digital Rights Management) to protect copyrighted content.

**Download Model:**
\`\`\`typescript
interface DownloadedTrack {
  trackId: string;
  userId: string;
  encryptedFile: string;  // Path to encrypted audio
  encryptionKey: string;  // Per-user, per-track key
  downloadedAt: Date;
  expiresAt: Date;  // Must re-verify license periodically
  quality: string;
}
\`\`\`

**DRM Requirements (from labels):**
- Content encrypted at rest
- Per-user encryption keys
- Offline limit: typically 30 days before re-auth
- Device limit: typically 3-5 devices
- Cant extract raw audio file

**Encryption Approach:**
\`\`\`
1. Generate per-user encryption key (AES-256)
2. Encrypt audio file with this key
3. Store encrypted file locally
4. Key stored in secure enclave (iOS) or Android Keystore
5. Only Spotify app can decrypt and play
\`\`\`

**License Verification:**
\`\`\`
Every 30 days (while online):
1. App contacts license server
2. Verifies user still has premium subscription
3. Renews offline license
4. Without renewal, downloaded music stops playing
\`\`\`

**Storage Management:**
\`\`\`typescript
interface OfflineStorage {
  totalBytes: number;
  usedBytes: number;
  downloadedTracks: number;
  playlists: Array<{
    playlistId: string;
    downloadedTracks: number;
    totalSize: number;
  }>;
}

// Settings
maxOfflineStorage: 10GB (user configurable)
audioQuality: 'normal' | 'high'  // 96 vs 160 kbps
wifiOnlyDownloads: boolean
\`\`\`

**Smart Downloads:**
Auto-download predicted content:
- Daily mix playlists
- Liked songs (most recent)
- Predict commute playlist`,
        keyInsight: 'Offline music requires DRM encryption to satisfy label requirements - the technical challenge is balancing security with a seamless user experience',
        commonMistakes: [
          'Storing unencrypted audio (violates label agreements)',
          'Not handling license expiration gracefully',
          'Downloading at original quality (wastes storage)'
        ],
        interviewTips: [
          'Explain DRM requirements from music labels',
          'Discuss per-user encryption keys',
          'Mention the 30-day offline re-verification requirement'
        ],
        realWorldExample: 'Spotifys offline mode uses Widevine DRM on Android and FairPlay on iOS. If you cancel premium, downloaded music stops working even though the files are still on your device.'
      },

      requiredComponents: ['Client', 'Download Service', 'License Server', 'DRM Service', 'Encrypted Storage'],

      hints: [
        { trigger: 'stuck', content: 'Offline requires DRM - encrypted files with per-user keys and periodic license verification' },
        { trigger: 'no_drm', content: 'Music labels require DRM. Unencrypted downloads violate licensing agreements.' },
        { trigger: 'no_expiry', content: 'Offline licenses must expire. User must come online periodically to re-verify.' }
      ],

      validation: {
        requiredConnections: [
          { from: 'Client', to: 'Download Service' },
          { from: 'Download Service', to: 'DRM Service' },
          { from: 'Client', to: 'License Server' },
          { from: 'DRM Service', to: 'Encrypted Storage' }
        ],
        requiredComponents: ['Download Service', 'License Server', 'DRM Service', 'Encrypted Storage']
      },

      thinkingFramework: {
        approach: 'security-constraints',
        questions: [
          'What do music labels require for offline playback?',
          'How do we encrypt content per-user?',
          'What happens when the license expires?'
        ],
        tradeoffs: [
          { option: 'No offline (simplest)', pros: ['No DRM complexity'], cons: ['Poor mobile experience'] },
          { option: 'DRM-protected downloads', pros: ['Great UX', 'Label compliant'], cons: ['Complex', 'Platform-specific'] }
        ]
      }
    },

    {
      id: 'step-12',
      title: 'Artist Analytics & Insights',
      phase: 'phase-4-expert',
      description: 'Build analytics dashboard for artists showing streams, demographics, and trends',
      order: 12,

      educationalContent: {
        title: 'Spotify for Artists Analytics',
        explanation: `Artists need insights to understand their audience, track growth, and plan tours. Spotify for Artists provides this data.

**Artist Dashboard Metrics:**
\`\`\`typescript
interface ArtistAnalytics {
  overview: {
    monthlyListeners: number;
    followers: number;
    streams: { period: string; count: number }[];
  };

  audience: {
    demographics: {
      ageGroups: Record<string, number>;
      gender: Record<string, number>;
    };
    geography: {
      topCountries: Array<{ country: string; listeners: number }>;
      topCities: Array<{ city: string; listeners: number }>;
    };
  };

  music: {
    topTracks: Array<{ trackId: string; streams: number }>;
    savesVsStreams: number;  // Engagement metric
    playlistReach: number;  // Listeners via playlists
  };

  realTime: {
    currentListeners: number;
    trendsComparedToLastWeek: number;
  };
}
\`\`\`

**Data Pipeline:**
\`\`\`
Play events → Kafka → Spark aggregation →
  ├── Real-time dashboard (streaming)
  ├── Daily batch (detailed analytics)
  └── Monthly reports (trends)
\`\`\`

**Privacy Considerations:**
- Aggregate data only (no individual listener info)
- Minimum thresholds (don't show if <5 listeners)
- No exact locations (city level only)

**Tour Planning Data:**
\`\`\`
"Your top 10 cities by listeners:"
1. Los Angeles: 45,000
2. New York: 42,000
3. London: 38,000
...
Artists use this to plan tour stops.
\`\`\`

**Pre-Save Campaigns:**
\`\`\`typescript
interface PreSave {
  releaseId: string;
  userId: string;
  createdAt: Date;
  autoAddToLibrary: boolean;
}

// On release date:
// Auto-add to pre-saved users' libraries
// Send notification
// Count for first-day metrics
\`\`\`

**Playlist Pitching:**
Artists pitch unreleased songs for editorial playlists:
\`\`\`
pitch: {
  trackId: string,
  releaseDate: Date,
  genre: string,
  description: string,
  songMeaning: string,
  targetPlaylists: string[]
}
\`\`\``,
        keyInsight: 'Artist analytics transforms raw play data into actionable insights - tour planning, audience understanding, and release strategy all depend on these aggregations',
        commonMistakes: [
          'Showing individual listener data (privacy violation)',
          'Not providing geographic data (crucial for touring)',
          'Real-time only without historical trends'
        ],
        interviewTips: [
          'Discuss batch vs streaming for different analytics needs',
          'Mention privacy aggregation minimums',
          'Talk about how artists use data for tour planning'
        ],
        realWorldExample: 'Billie Eilish used Spotify for Artists data to plan her first world tour - booking venues sized appropriately for each city\'s listener count.'
      },

      requiredComponents: ['API Gateway', 'Analytics Service', 'Spark Cluster', 'Analytics Database', 'Real-Time Aggregator', 'Dashboard API'],

      hints: [
        { trigger: 'stuck', content: 'Artist analytics needs both real-time (current listeners) and batch processing (trends, demographics)' },
        { trigger: 'realtime_only', content: 'Historical trends require batch processing. Real-time alone is insufficient.' },
        { trigger: 'raw_data', content: 'Never expose individual listener data. Aggregate with privacy thresholds.' }
      ],

      validation: {
        requiredConnections: [
          { from: 'API Gateway', to: 'Analytics Service' },
          { from: 'Analytics Service', to: 'Spark Cluster' },
          { from: 'Analytics Service', to: 'Analytics Database' },
          { from: 'Analytics Service', to: 'Real-Time Aggregator' }
        ],
        requiredComponents: ['Analytics Service', 'Spark Cluster', 'Real-Time Aggregator']
      },

      thinkingFramework: {
        approach: 'analytics-pipeline',
        questions: [
          'What metrics do artists care about?',
          'How do we balance real-time vs batch analytics?',
          'What privacy constraints apply to listener data?'
        ],
        tradeoffs: [
          { option: 'Pre-computed aggregates only', pros: ['Fast queries'], cons: ['No custom analysis', 'Delayed insights'] },
          { option: 'Real-time + batch hybrid', pros: ['Fresh data', 'Deep analysis'], cons: ['Complex infrastructure'] }
        ]
      }
    }
  ],

  sandboxConfig: {
    availableComponents: [
      // Clients
      { type: 'Client', category: 'client' },
      { type: 'Mobile App', category: 'client' },

      // Gateways
      { type: 'API Gateway', category: 'gateway' },
      { type: 'CDN', category: 'gateway' },
      { type: 'WebSocket Gateway', category: 'gateway' },

      // Core Services
      { type: 'Catalog Service', category: 'service' },
      { type: 'Streaming Service', category: 'service' },
      { type: 'Search Service', category: 'service' },
      { type: 'Playlist Service', category: 'service' },
      { type: 'Library Service', category: 'service' },
      { type: 'Activity Service', category: 'service' },
      { type: 'Play Event Service', category: 'service' },
      { type: 'Quality Selector', category: 'service' },

      // Advanced Services
      { type: 'Recommendation Service', category: 'service' },
      { type: 'User Profile Service', category: 'service' },
      { type: 'Audio Analysis Service', category: 'service' },
      { type: 'ML Model Service', category: 'service' },
      { type: 'Download Service', category: 'service' },
      { type: 'License Server', category: 'service' },
      { type: 'DRM Service', category: 'service' },
      { type: 'Analytics Service', category: 'service' },
      { type: 'Fraud Detection', category: 'service' },

      // Processing
      { type: 'Stream Processor', category: 'processing' },
      { type: 'Spark Cluster', category: 'processing' },
      { type: 'Real-Time Aggregator', category: 'processing' },

      // Databases
      { type: 'Metadata Database', category: 'database' },
      { type: 'User Database', category: 'database' },
      { type: 'Playlist Database', category: 'database' },
      { type: 'Activity Database', category: 'database' },
      { type: 'Play Count Database', category: 'database' },
      { type: 'Analytics Database', category: 'database' },

      // Storage
      { type: 'Audio Storage', category: 'storage' },
      { type: 'Origin Storage', category: 'storage' },
      { type: 'Regional Cache', category: 'storage' },
      { type: 'Encrypted Storage', category: 'storage' },
      { type: 'Feature Store', category: 'storage' },

      // Search
      { type: 'Elasticsearch', category: 'search' },

      // Messaging
      { type: 'Kafka', category: 'messaging' },

      // Caching
      { type: 'Redis Cache', category: 'caching' },

      // DNS
      { type: 'GeoDNS', category: 'dns' }
    ]
  },

  learningObjectives: [
    'Design music metadata models with complex relationships (tracks, albums, artists)',
    'Implement audio streaming with HTTP Range requests and gapless playback',
    'Build music search with fuzzy matching and popularity ranking',
    'Design efficient playlist ordering with fractional indexing',
    'Implement social activity feeds with privacy controls',
    'Design CDN strategy for music with popularity-based caching',
    'Build play counting systems with fraud detection for royalties',
    'Implement recommendation systems combining collaborative and content-based filtering',
    'Design offline mode with DRM protection',
    'Build artist analytics with real-time and batch processing'
  ],

  prerequisites: [
    'Basic understanding of audio encoding (bitrates, codecs)',
    'Familiarity with CDN concepts',
    'Understanding of recommendation system basics',
    'Knowledge of streaming data processing'
  ],

  interviewRelevance: {
    commonQuestions: [
      'How would you design Spotify?',
      'Design a music streaming service',
      'How do recommendation systems work?',
      'How would you implement playlist reordering efficiently?',
      'Design a system for counting plays accurately'
    ],
    keyTakeaways: [
      'Music catalogs have complex many-to-many relationships',
      'Audio streaming uses HTTP Range requests for seeking',
      'Fractional indexing enables O(1) playlist reordering',
      'Music plays follow power law - cache popular tracks aggressively',
      'Play counting must handle fraud detection for royalties',
      'Recommendations combine collaborative and content-based filtering'
    ],
    frequentMistakes: [
      'Not handling multiple qualities for adaptive streaming',
      'Using integer positions for playlist ordering',
      'Simple counters without fraud detection',
      'Only collaborative filtering for recommendations'
    ]
  }
};
