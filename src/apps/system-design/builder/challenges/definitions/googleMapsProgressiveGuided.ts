import { GuidedTutorial } from '../../types/guidedTutorial';

export const googleMapsProgressiveGuidedTutorial: GuidedTutorial = {
  id: 'google-maps-progressive-guided',
  title: 'Design Google Maps - Progressive Journey',
  description: 'Build a mapping and navigation platform that evolves from basic location services to real-time global navigation with traffic prediction',
  difficulty: 'progressive',
  estimatedTime: '4-6 hours across all phases',

  systemContext: {
    title: 'Google Maps',
    description: 'A mapping platform providing location search, directions, real-time navigation, and traffic information',
    requirements: [
      'Search for locations and addresses (geocoding)',
      'Display interactive maps with zoom/pan',
      'Calculate routes between locations',
      'Provide turn-by-turn navigation',
      'Show real-time traffic conditions',
      'Support offline maps'
    ],
    existingInfrastructure: 'Starting fresh - you are building a new mapping platform'
  },

  phases: [
    {
      id: 'phase-1-beginner',
      name: 'Phase 1: Basic Mapping',
      description: 'Your startup "QuickMaps" is building a simple location service. Users need to search for places and view them on a map. Start with the fundamentals.',
      difficulty: 'beginner',
      requiredSteps: ['step-1', 'step-2', 'step-3'],
      unlockCriteria: null
    },
    {
      id: 'phase-2-intermediate',
      name: 'Phase 2: Directions & POI',
      description: 'QuickMaps is getting traction! Users want driving directions and business information. Time to add routing and points of interest.',
      difficulty: 'intermediate',
      requiredSteps: ['step-4', 'step-5', 'step-6'],
      unlockCriteria: { completedPhases: ['phase-1-beginner'] }
    },
    {
      id: 'phase-3-advanced',
      name: 'Phase 3: Real-Time Navigation',
      description: 'QuickMaps has 10M users navigating daily. You need real-time traffic updates, turn-by-turn navigation, and efficient routing at scale.',
      difficulty: 'advanced',
      requiredSteps: ['step-7', 'step-8', 'step-9'],
      unlockCriteria: { completedPhases: ['phase-2-intermediate'] }
    },
    {
      id: 'phase-4-expert',
      name: 'Phase 4: Global Intelligence',
      description: 'QuickMaps is the go-to navigation app with 500M users. Time to add traffic prediction, offline maps, and transit integration.',
      difficulty: 'expert',
      requiredSteps: ['step-10', 'step-11', 'step-12'],
      unlockCriteria: { completedPhases: ['phase-3-advanced'] }
    }
  ],

  steps: [
    // ============== PHASE 1: BASIC MAPPING ==============
    {
      id: 'step-1',
      title: 'Geocoding Service',
      phase: 'phase-1-beginner',
      description: 'Implement the ability to search for locations and convert addresses to coordinates',
      order: 1,

      educationalContent: {
        title: 'Understanding Geocoding',
        explanation: `Geocoding is the foundation of any mapping service - converting human-readable addresses into geographic coordinates (latitude/longitude) and vice versa (reverse geocoding).

**The Geocoding Challenge:**
- Addresses are messy: "123 Main St", "123 Main Street", "123 Main"
- Multiple formats: "New York, NY" vs "New York City" vs "NYC"
- Ambiguity: "Springfield" exists in 30+ US states
- International variations: Different address formats worldwide

**How Google Solves This:**
1. **Address Parsing**: Break address into components (street, city, country)
2. **Normalization**: Standardize formats ("St" → "Street", "NYC" → "New York")
3. **Fuzzy Matching**: Handle typos and variations
4. **Disambiguation**: Use context (user location, search history) to pick best match

**Geospatial Data Structures:**
- **Quadtree**: Recursively divide 2D space into quadrants
- **R-tree**: Group nearby objects in bounding rectangles
- **Geohash**: Encode lat/lng into hierarchical string (e.g., "9q8yy")
- **H3**: Uber's hexagonal hierarchical grid system

**Why Geohash is Powerful:**
\`\`\`
"9q8yyk" = San Francisco area
"9q8yyk1" = More precise (smaller area)
Similar prefixes = nearby locations
\`\`\`
This enables efficient "find nearby" queries using prefix matching.`,
        keyInsight: 'Geocoding is essentially a specialized search problem - the key is handling the messiness of real-world addresses through normalization and fuzzy matching',
        commonMistakes: [
          'Treating addresses as exact strings instead of parsed components',
          'Not handling international address formats',
          'Ignoring disambiguation when multiple results match'
        ],
        interviewTips: [
          'Mention that geocoding data comes from multiple sources (government, user corrections, satellite)',
          'Discuss how geohashes enable efficient spatial queries',
          'Talk about caching popular location searches'
        ],
        realWorldExample: 'When you type "coffee" in Google Maps, it uses your current location (reverse geocoding) combined with POI data to show nearby coffee shops, ranked by relevance and distance.'
      },

      requiredComponents: ['Client', 'API Gateway', 'Geocoding Service', 'Location Database'],

      hints: [
        { trigger: 'stuck', content: 'The Location Database needs a spatial index (like Geohash or R-tree) for efficient queries' },
        { trigger: 'client_only', content: 'Geocoding requires significant data - addresses, coordinates, place names. This must be server-side.' },
        { trigger: 'no_cache', content: 'Popular locations like "Times Square" are searched constantly. Consider caching.' }
      ],

      validation: {
        requiredConnections: [
          { from: 'Client', to: 'API Gateway' },
          { from: 'API Gateway', to: 'Geocoding Service' },
          { from: 'Geocoding Service', to: 'Location Database' }
        ],
        requiredComponents: ['Location Database']
      },

      thinkingFramework: {
        approach: 'data-modeling',
        questions: [
          'How do we structure location data for efficient search?',
          'What makes address matching challenging?',
          'How do we handle ambiguous queries?'
        ],
        tradeoffs: [
          { option: 'Exact matching', pros: ['Fast', 'Simple'], cons: ['Misses variations', 'User-unfriendly'] },
          { option: 'Fuzzy matching with scoring', pros: ['Handles real input', 'Better UX'], cons: ['Slower', 'May return wrong results'] }
        ]
      }
    },

    {
      id: 'step-2',
      title: 'Map Tile System',
      phase: 'phase-1-beginner',
      description: 'Design the system for displaying interactive maps with zoom and pan capabilities',
      order: 2,

      educationalContent: {
        title: 'Map Tiles: The Secret to Fast Maps',
        explanation: `Displaying a map of the entire world at full detail would require petabytes of data. The solution? **Map tiles** - pre-rendered square images at different zoom levels.

**Tile Pyramid System:**
\`\`\`
Zoom 0:  1 tile   (whole world)
Zoom 1:  4 tiles  (2x2)
Zoom 2:  16 tiles (4x4)
...
Zoom 18: 68 billion tiles (for street-level detail)
\`\`\`

Each zoom level doubles the resolution. At zoom 18, a tile covers ~150m x 150m.

**Tile Coordinates:**
Tiles are addressed by (z, x, y) - zoom level, column, row:
\`\`\`
Zoom 2: Tile (2, 1, 0) = top-middle tile
URL pattern: /tiles/{z}/{x}/{y}.png
Example: /tiles/15/5241/12665.png
\`\`\`

**Vector vs Raster Tiles:**
- **Raster**: Pre-rendered PNG images. Simple but large (50KB-200KB each)
- **Vector**: Raw geometry data rendered client-side. Smaller (~20KB), allows rotation/styling, but requires GPU

**Why This Scales:**
1. **Pre-rendering**: Tiles are generated offline, not on-demand
2. **CDN**: Tiles are static files, perfect for global CDN distribution
3. **On-demand loading**: Only fetch visible tiles as user pans/zooms
4. **Caching**: Browser caches tiles for instant re-display`,
        keyInsight: 'Map tiles transform an impossible real-time rendering problem into a static file serving problem - one of the most CDN-friendly workloads possible',
        commonMistakes: [
          'Trying to render maps server-side per request',
          'Not using a CDN for tile delivery',
          'Loading all tiles upfront instead of on-demand'
        ],
        interviewTips: [
          'Explain the tile coordinate system (z/x/y)',
          'Discuss vector vs raster tile tradeoffs',
          'Mention that Google pre-renders tiles but also generates on-demand for fresh satellite imagery'
        ],
        realWorldExample: 'Google Maps uses vector tiles on mobile (smaller downloads, rotation support) but offers raster tiles for embed APIs (simpler integration).'
      },

      requiredComponents: ['Client', 'CDN', 'Tile Server', 'Tile Storage'],

      hints: [
        { trigger: 'stuck', content: 'Map tiles are static images that can be served from a CDN' },
        { trigger: 'no_cdn', content: 'Tiles are fetched constantly during pan/zoom. Without CDN, latency kills the UX.' },
        { trigger: 'realtime_render', content: 'Pre-render tiles offline. Real-time rendering per request is too slow.' }
      ],

      validation: {
        requiredConnections: [
          { from: 'Client', to: 'CDN' },
          { from: 'CDN', to: 'Tile Server' },
          { from: 'Tile Server', to: 'Tile Storage' }
        ],
        requiredComponents: ['CDN', 'Tile Storage']
      },

      thinkingFramework: {
        approach: 'scalability',
        questions: [
          'How much data would rendering the whole world require?',
          'How can we make map loading feel instant?',
          'What data structure represents map tiles?'
        ],
        tradeoffs: [
          { option: 'Raster tiles (PNG)', pros: ['Simple', 'Universal support'], cons: ['Larger files', 'No rotation'] },
          { option: 'Vector tiles', pros: ['Smaller', 'Customizable', 'Rotatable'], cons: ['Client rendering needed', 'Complex'] }
        ]
      }
    },

    {
      id: 'step-3',
      title: 'Basic Place Search',
      phase: 'phase-1-beginner',
      description: 'Add the ability to search for businesses and points of interest',
      order: 3,

      educationalContent: {
        title: 'Building a Places Search Engine',
        explanation: `Place search is more than geocoding - users search for "coffee near me" or "best pizza", not just addresses.

**Place Data Model:**
\`\`\`typescript
interface Place {
  id: string;
  name: string;
  location: { lat: number; lng: number };
  geohash: string;  // For spatial queries
  category: string[];  // ["restaurant", "italian", "pizza"]
  address: Address;
  rating: number;
  reviewCount: number;
  hours: BusinessHours;
  photos: string[];
}
\`\`\`

**Search Ranking Factors:**
1. **Relevance**: How well does the place match the query?
2. **Distance**: How close to user's location?
3. **Prominence**: Rating, review count, popularity
4. **Personalization**: User's search history, preferences

**Spatial Search with Geohash:**
\`\`\`
User location: geohash "9q8yy"
Query: Find places where geohash LIKE "9q8yy%"
This efficiently finds all places in the user's area
\`\`\`

**Search Architecture:**
- **Elasticsearch** for full-text search on place names
- **Geospatial index** for location-based filtering
- **Score combination**: relevance_score * distance_decay * prominence`,
        keyInsight: 'Place search is a ranking problem, not just a matching problem - the same query should return different results based on where you are and what you typically search for',
        commonMistakes: [
          'Returning places sorted only by distance (ignoring relevance)',
          'Not considering business hours in rankings',
          'Using SQL LIKE for text search instead of proper full-text search'
        ],
        interviewTips: [
          'Discuss how geohash enables efficient spatial queries',
          'Mention the ranking formula combining relevance and distance',
          'Talk about how place data is collected (business owners, web scraping, user contributions)'
        ],
        realWorldExample: 'When you search "coffee" at 7am, Google Maps prioritizes cafes that are open now. The same search at 9pm might prioritize places open late.'
      },

      requiredComponents: ['Client', 'API Gateway', 'Search Service', 'Places Database'],

      hints: [
        { trigger: 'stuck', content: 'Place search needs both text matching (Elasticsearch) and spatial filtering (geohash)' },
        { trigger: 'no_location', content: 'Results should be ranked by distance from user. You need their location.' },
        { trigger: 'sql_only', content: 'SQL is not efficient for full-text search. Consider Elasticsearch.' }
      ],

      validation: {
        requiredConnections: [
          { from: 'Client', to: 'API Gateway' },
          { from: 'API Gateway', to: 'Search Service' },
          { from: 'Search Service', to: 'Places Database' }
        ],
        requiredComponents: ['Search Service', 'Places Database']
      },

      thinkingFramework: {
        approach: 'functional-requirements',
        questions: [
          'What factors determine which place to show first?',
          'How do we search by location efficiently?',
          'How do we handle "near me" queries?'
        ],
        tradeoffs: [
          { option: 'Distance-only ranking', pros: ['Simple', 'Predictable'], cons: ['Ignores quality', 'Bad results'] },
          { option: 'Combined ranking (distance + relevance + rating)', pros: ['Better results'], cons: ['Complex', 'Hard to tune'] }
        ]
      }
    },

    // ============== PHASE 2: DIRECTIONS & POI ==============
    {
      id: 'step-4',
      title: 'Route Calculation',
      phase: 'phase-2-intermediate',
      description: 'Implement driving directions between two points',
      order: 4,

      educationalContent: {
        title: 'The Art of Route Finding',
        explanation: `Route calculation is a graph problem at massive scale. The road network is a graph where intersections are nodes and roads are edges.

**Graph Representation:**
\`\`\`
Node: Intersection or road segment endpoint
Edge: Road segment with properties:
  - length (meters)
  - speed_limit
  - road_type (highway, local, etc.)
  - restrictions (one-way, no-trucks, etc.)
\`\`\`

**Basic Approach - Dijkstra's Algorithm:**
Find shortest path by exploring nodes in order of distance from start. Works, but too slow for continental-scale routing.

**Why Dijkstra is Too Slow:**
- US road network: ~20 million nodes
- Dijkstra explores ~1 million nodes for a cross-country route
- At 1μs/node = 1 second per route = unusable

**The Solution: Contraction Hierarchies (CH)**
Pre-process the graph to add "shortcut" edges:
1. Order nodes by importance (highways > local roads)
2. "Contract" less important nodes by adding shortcuts
3. Queries only explore ~1000 nodes instead of 1 million

\`\`\`
Before: A → B → C → D (3 hops)
After:  A --------→ D (1 shortcut, same cost)
\`\`\`

**Query Time Comparison:**
- Dijkstra: ~1000ms for cross-country
- Contraction Hierarchies: ~1ms for same route

The preprocessing takes hours but query time is 1000x faster.`,
        keyInsight: 'Route calculation at scale requires heavy preprocessing (Contraction Hierarchies) to achieve sub-second query times - a classic time-space tradeoff',
        commonMistakes: [
          'Using basic Dijkstra for production routing',
          'Not considering one-way streets and turn restrictions',
          'Ignoring road type (a 60mph highway is faster than a 30mph local road)'
        ],
        interviewTips: [
          'Mention Contraction Hierarchies as the industry-standard solution',
          'Discuss that preprocessing enables fast queries',
          'Talk about how A* improves on Dijkstra with heuristics'
        ],
        realWorldExample: 'Google Maps preprocesses the entire road network nightly. When traffic patterns change significantly, they can recalculate shortcuts for affected regions.'
      },

      requiredComponents: ['Client', 'API Gateway', 'Routing Service', 'Road Graph Database'],

      hints: [
        { trigger: 'stuck', content: 'Roads form a graph. Routing is a shortest-path problem, but requires preprocessing for speed.' },
        { trigger: 'dijkstra_only', content: 'Basic Dijkstra is too slow for millions of nodes. Look into Contraction Hierarchies.' },
        { trigger: 'no_edge_weights', content: 'Edge weights should be travel TIME, not distance. A highway mile is faster than a city mile.' }
      ],

      validation: {
        requiredConnections: [
          { from: 'Client', to: 'API Gateway' },
          { from: 'API Gateway', to: 'Routing Service' },
          { from: 'Routing Service', to: 'Road Graph Database' }
        ],
        requiredComponents: ['Routing Service', 'Road Graph Database']
      },

      thinkingFramework: {
        approach: 'algorithm-selection',
        questions: [
          'What graph algorithm finds shortest paths?',
          'Why is basic shortest-path too slow at scale?',
          'How can preprocessing speed up queries?'
        ],
        tradeoffs: [
          { option: 'Dijkstra', pros: ['Simple', 'Always optimal'], cons: ['O(V log V)', 'Too slow at scale'] },
          { option: 'Contraction Hierarchies', pros: ['1000x faster queries'], cons: ['Hours of preprocessing', 'Memory intensive'] }
        ]
      }
    },

    {
      id: 'step-5',
      title: 'Multi-Modal Directions',
      phase: 'phase-2-intermediate',
      description: 'Add walking, biking, and public transit directions',
      order: 5,

      educationalContent: {
        title: 'Beyond Driving: Multi-Modal Routing',
        explanation: `Different transportation modes have completely different routing graphs and constraints.

**Mode-Specific Graphs:**

**Walking:**
- Include sidewalks, crosswalks, pedestrian paths
- Avoid highways, exclude roads without sidewalks
- Consider stairs, slopes (accessibility routing)
- Speed: ~5 km/h constant

**Biking:**
- Prefer bike lanes, bike-friendly roads
- Avoid high-traffic roads, steep hills
- Consider one-way exceptions for bikes
- Speed: ~15-25 km/h

**Public Transit:**
- Graph is time-dependent (buses run on schedules)
- Nodes: stops/stations
- Edges: scheduled trips with departure times
- Challenge: transfers between lines/modes

**Transit Routing is Harder:**
\`\`\`
Query: Get from A to B at 9:00am
Graph changes based on query time!
- 9:05 bus from stop X
- 9:15 train from station Y
- Walking between stops/stations
\`\`\`

**RAPTOR Algorithm for Transit:**
- Round-based approach
- Each round adds one more transit leg
- Efficiently explores all reachable stops by departure time
- Much faster than Dijkstra on time-expanded graphs`,
        keyInsight: 'Multi-modal routing requires separate optimized graphs per mode, with transit being fundamentally different because the graph structure changes based on query time',
        commonMistakes: [
          'Using driving graph for walking (missing pedestrian paths)',
          'Ignoring schedule data for transit',
          'Not considering mode transfers (walk to bus stop)'
        ],
        interviewTips: [
          'Explain that each mode needs its own graph',
          'Discuss GTFS format for transit schedules',
          'Mention that transit routing is NP-hard in the general case'
        ],
        realWorldExample: 'Google Maps suggests "Drive to train station, take train, walk to destination" by solving separate routing problems and combining them.'
      },

      requiredComponents: ['Client', 'API Gateway', 'Routing Service', 'Road Graph Database', 'Transit Database'],

      hints: [
        { trigger: 'stuck', content: 'Each mode needs its own graph with appropriate edges and weights' },
        { trigger: 'single_graph', content: 'Walking and driving use different paths. You need separate graph layers.' },
        { trigger: 'no_transit_time', content: 'Transit depends on schedules. The graph changes based on departure time.' }
      ],

      validation: {
        requiredConnections: [
          { from: 'API Gateway', to: 'Routing Service' },
          { from: 'Routing Service', to: 'Road Graph Database' },
          { from: 'Routing Service', to: 'Transit Database' }
        ],
        requiredComponents: ['Transit Database']
      },

      thinkingFramework: {
        approach: 'functional-requirements',
        questions: [
          'How do routing constraints differ by mode?',
          'Why is transit routing fundamentally different?',
          'How do we combine multiple modes in one trip?'
        ],
        tradeoffs: [
          { option: 'Single unified graph', pros: ['Simpler'], cons: ['Impossible for transit', 'Wrong paths for bikes'] },
          { option: 'Mode-specific graphs', pros: ['Accurate routing'], cons: ['More storage', 'Complex multimodal trips'] }
        ]
      }
    },

    {
      id: 'step-6',
      title: 'Business Details & Reviews',
      phase: 'phase-2-intermediate',
      description: 'Add detailed place information, photos, reviews, and business hours',
      order: 6,

      educationalContent: {
        title: 'Rich Place Data',
        explanation: `Place search results are just the beginning. Users want detailed information before visiting a business.

**Place Details Data Model:**
\`\`\`typescript
interface PlaceDetails {
  basic: {
    name: string;
    address: Address;
    phone: string;
    website: string;
    location: LatLng;
  };
  hours: {
    periods: Array<{
      open: { day: number; time: string };
      close: { day: number; time: string };
    }>;
    specialHours: Array<{ date: string; hours: string }>;
  };
  reviews: {
    averageRating: number;
    totalCount: number;
    reviews: Review[];
  };
  photos: Photo[];
  attributes: {
    priceLevel: 1 | 2 | 3 | 4;
    categories: string[];
    amenities: string[];  // WiFi, parking, etc.
  };
}
\`\`\`

**Review Integrity Challenges:**
- Fake reviews from competitors or paid services
- Review bombing attacks
- Businesses bribing for good reviews

**Anti-Fraud Signals:**
- Account age and activity patterns
- Review timing (burst of 5-star reviews = suspicious)
- Text analysis (copied reviews, unnatural language)
- Location verification (did reviewer actually visit?)

**Photo Management:**
- User-uploaded photos need moderation
- Automatic tagging (food, interior, exterior)
- Quality scoring to show best photos first
- Duplicate detection`,
        keyInsight: 'Rich place data comes from multiple sources (business owners, users, web scraping) and requires constant fraud detection to maintain trust',
        commonMistakes: [
          'Trusting all reviews equally',
          'Not validating business-claimed information',
          'Showing stale business hours'
        ],
        interviewTips: [
          'Discuss data sources: owner-claimed, user-contributed, scraped',
          'Mention review fraud detection',
          'Talk about how Google verifies business ownership'
        ],
        realWorldExample: 'Google uses Street View imagery to verify business existence and operating hours by reading signs. They also call businesses to verify phone numbers.'
      },

      requiredComponents: ['Client', 'API Gateway', 'Places Service', 'Places Database', 'Review Service', 'Object Storage'],

      hints: [
        { trigger: 'stuck', content: 'Place details come from multiple sources: business owners, users, and automated collection' },
        { trigger: 'no_photos', content: 'Photos are user-generated content. Store in object storage like S3.' },
        { trigger: 'trust_reviews', content: 'Reviews can be faked. You need fraud detection.' }
      ],

      validation: {
        requiredConnections: [
          { from: 'API Gateway', to: 'Places Service' },
          { from: 'Places Service', to: 'Places Database' },
          { from: 'Places Service', to: 'Review Service' },
          { from: 'Places Service', to: 'Object Storage' }
        ],
        requiredComponents: ['Review Service', 'Object Storage']
      },

      thinkingFramework: {
        approach: 'data-integrity',
        questions: [
          'Where does place data come from?',
          'How do we keep business hours accurate?',
          'How do we prevent fake reviews?'
        ],
        tradeoffs: [
          { option: 'Trust all user content', pros: ['More data'], cons: ['Spam', 'Fake reviews'] },
          { option: 'Heavy moderation', pros: ['Quality content'], cons: ['Slow updates', 'Less coverage'] }
        ]
      }
    },

    // ============== PHASE 3: REAL-TIME NAVIGATION ==============
    {
      id: 'step-7',
      title: 'Real-Time Traffic',
      phase: 'phase-3-advanced',
      description: 'Integrate live traffic data to show current road conditions and update ETAs',
      order: 7,

      educationalContent: {
        title: 'Building a Real-Time Traffic System',
        explanation: `Real-time traffic is what separates a basic map from a true navigation system. But where does traffic data come from?

**Traffic Data Sources:**
1. **Probe Data (Primary)**: Anonymous speed data from phones running maps
2. **Road Sensors**: Government-operated traffic counters
3. **Incident Reports**: Accidents, construction, events
4. **Partner Data**: Fleet vehicles, rideshare companies

**Probe Data Flow:**
\`\`\`
Phone GPS → Anonymized Speed Reports → Traffic Processing
Each report: road_segment_id, speed, timestamp
No user identity, just aggregate speeds per segment
\`\`\`

**Traffic Processing Pipeline:**
1. **Ingestion**: Millions of speed reports per minute
2. **Map Matching**: Match GPS points to road segments (non-trivial!)
3. **Aggregation**: Average speeds per segment per time window
4. **Anomaly Detection**: Flag incidents (sudden speed drops)
5. **Distribution**: Push updates to clients

**Map Matching Challenge:**
GPS is noisy (±10m accuracy). A report near an intersection could be on any of 4 roads. Solutions:
- Hidden Markov Model matching
- Consider heading, previous points, road connectivity

**Traffic Coloring:**
\`\`\`
Green:  current_speed >= 0.8 * free_flow_speed
Yellow: 0.5 <= ratio < 0.8
Red:    ratio < 0.5
Dark Red: ratio < 0.25
\`\`\`

**Scale Numbers:**
- 1 billion kilometers driven by Google Maps users daily
- Traffic updates every 2-5 minutes per road segment`,
        keyInsight: 'Traffic data is crowdsourced from users running navigation apps - Google Maps users collectively create the traffic layer that benefits everyone',
        commonMistakes: [
          'Relying only on government sensors (too sparse)',
          'Not handling GPS noise in map matching',
          'Updating traffic too slowly (stale data is worse than no data)'
        ],
        interviewTips: [
          'Explain probe data and its privacy implications',
          'Discuss map matching as a non-trivial problem',
          'Mention that traffic prediction is possible by learning patterns'
        ],
        realWorldExample: 'During a major accident, Google Maps can detect the slowdown within minutes from probe data, often before official reports. The red line appears almost instantly.'
      },

      requiredComponents: ['Client', 'API Gateway', 'Traffic Service', 'Kafka', 'Traffic Database', 'Routing Service'],

      hints: [
        { trigger: 'stuck', content: 'Traffic data comes from users themselves - anonymous speed reports from phones running navigation' },
        { trigger: 'no_streaming', content: 'Traffic updates come continuously from millions of phones. This is a streaming data problem.' },
        { trigger: 'government_only', content: 'Government sensors only cover major highways. Crowdsourced probe data covers all roads.' }
      ],

      validation: {
        requiredConnections: [
          { from: 'Client', to: 'API Gateway' },
          { from: 'Client', to: 'Traffic Service' },
          { from: 'Traffic Service', to: 'Kafka' },
          { from: 'Traffic Service', to: 'Traffic Database' }
        ],
        requiredComponents: ['Traffic Service', 'Kafka', 'Traffic Database']
      },

      thinkingFramework: {
        approach: 'data-pipeline',
        questions: [
          'Where does real-time traffic data come from?',
          'How do we process millions of location reports?',
          'How do we balance freshness vs accuracy?'
        ],
        tradeoffs: [
          { option: 'Government sensors only', pros: ['Reliable', 'Consistent'], cons: ['Sparse coverage', 'Limited to highways'] },
          { option: 'Crowdsourced probe data', pros: ['Universal coverage', 'Real-time'], cons: ['Privacy concerns', 'GPS noise'] }
        ]
      }
    },

    {
      id: 'step-8',
      title: 'Turn-by-Turn Navigation',
      phase: 'phase-3-advanced',
      description: 'Implement real-time navigation with voice guidance and route recalculation',
      order: 8,

      educationalContent: {
        title: 'Real-Time Navigation Engine',
        explanation: `Turn-by-turn navigation transforms a static route into a dynamic, real-time guidance system.

**Navigation State Machine:**
\`\`\`
States: ON_ROUTE → APPROACHING_TURN → TURN_NOW → OFF_ROUTE → REROUTING
\`\`\`

**Key Challenges:**

**1. Continuous Location Tracking:**
- High-frequency GPS updates (1Hz typically)
- Battery optimization (reduce accuracy when on highway)
- Dead reckoning when GPS is lost (tunnels)

**2. Route Matching:**
Current position must "snap" to route:
\`\`\`
if (distance_to_route > 50m) → likely off route
if (heading differs > 45°) → probably off route
if (off_route for > 10 seconds) → trigger reroute
\`\`\`

**3. Instruction Generation:**
\`\`\`typescript
interface Maneuver {
  type: 'turn-left' | 'turn-right' | 'merge' | 'exit' | ...;
  road_name: string;
  distance_to_maneuver: number;
  instruction: string;  // "Turn left onto Main Street"
}

// Warning distances based on speed
highway: warn at 2km, 1km, 500m
city: warn at 500m, 200m, 50m
\`\`\`

**4. Real-Time Rerouting:**
When traffic changes or user deviates:
1. Detect off-route or better route available
2. Calculate new route from current position
3. Smoothly transition guidance to new route
4. Must complete in <500ms to not confuse user

**5. Lane Guidance:**
"Use the 2 left lanes to turn left"
- Requires detailed lane data per intersection
- Critical for complex interchanges`,
        keyInsight: 'Navigation is a real-time state machine that continuously matches user position to route and must reroute within milliseconds when conditions change',
        commonMistakes: [
          'Not handling GPS gaps (tunnels, urban canyons)',
          'Rerouting too aggressively (annoying) or too slowly (missed turns)',
          'Ignoring speed for instruction timing'
        ],
        interviewTips: [
          'Discuss the navigation state machine',
          'Mention battery optimization strategies',
          'Talk about how lane data is collected (Street View imagery)'
        ],
        realWorldExample: 'Google Maps uses accelerometer data to continue navigation in tunnels. It knows your last speed and heading, and predicts your position until GPS returns.'
      },

      requiredComponents: ['Client', 'API Gateway', 'Navigation Service', 'Routing Service', 'Traffic Service'],

      hints: [
        { trigger: 'stuck', content: 'Navigation is a state machine: ON_ROUTE, APPROACHING_TURN, OFF_ROUTE, REROUTING' },
        { trigger: 'no_realtime', content: 'Navigation needs real-time position updates. Consider WebSocket for bidirectional communication.' },
        { trigger: 'slow_reroute', content: 'Rerouting must be fast (<500ms). Pre-compute alternative routes.' }
      ],

      validation: {
        requiredConnections: [
          { from: 'Client', to: 'API Gateway' },
          { from: 'API Gateway', to: 'Navigation Service' },
          { from: 'Navigation Service', to: 'Routing Service' },
          { from: 'Navigation Service', to: 'Traffic Service' }
        ],
        requiredComponents: ['Navigation Service']
      },

      thinkingFramework: {
        approach: 'state-management',
        questions: [
          'What states can a navigation session be in?',
          'How do we detect the user is off-route?',
          'When should we trigger rerouting?'
        ],
        tradeoffs: [
          { option: 'Aggressive rerouting', pros: ['Always optimal route'], cons: ['Annoying', 'Confusing'] },
          { option: 'Conservative rerouting', pros: ['Stable experience'], cons: ['May miss better routes'] }
        ]
      }
    },

    {
      id: 'step-9',
      title: 'ETA Calculation at Scale',
      phase: 'phase-3-advanced',
      description: 'Build accurate ETA estimation that handles traffic, road types, and uncertainty',
      order: 9,

      educationalContent: {
        title: 'The Science of ETA',
        explanation: `ETA seems simple (distance/speed) but accurate prediction requires sophisticated modeling.

**ETA Components:**
\`\`\`
ETA = Σ (segment_length / predicted_speed) + traffic_delays + signal_delays
\`\`\`

**Speed Prediction Factors:**
1. **Current traffic**: Real-time probe data
2. **Historical patterns**: "This road is always slow at 5pm on Fridays"
3. **Road type**: Highways vs. local roads vs. unpaved
4. **Weather**: Rain reduces speeds ~15%
5. **Incidents**: Accidents, construction

**Historical Traffic Patterns:**
Store speed profiles per road segment:
\`\`\`
road_segment_123:
  monday_8am: avg_speed=25, stddev=5
  monday_9am: avg_speed=45, stddev=8
  ...
\`\`\`
Use historical when real-time data is sparse.

**Uncertainty and Ranges:**
Single ETA can be wrong. Better to show ranges:
- "25-35 minutes"
- Green/yellow/red confidence indicator
\`\`\`
uncertainty = f(route_length, traffic_variance, time_of_day)
short_route + low_variance → "15 min"
long_route + high_variance → "45-60 min"
\`\`\`

**Machine Learning for ETA:**
Modern systems use ML models trained on:
- Input: route, time, weather, events, historical speeds
- Output: ETA distribution
- Training data: billions of completed trips with actual duration

Google DeepMind's ETA model reduced errors by 50% using graph neural networks.`,
        keyInsight: 'Accurate ETA requires combining real-time traffic, historical patterns, and ML prediction - a single average speed model will always be wrong',
        commonMistakes: [
          'Using speed limits instead of actual speeds',
          'Ignoring traffic signal delays',
          'Not accounting for uncertainty on longer routes'
        ],
        interviewTips: [
          'Discuss how historical patterns complement real-time data',
          'Mention that ETA uncertainty increases with route length',
          'Talk about ML models for ETA (Google published papers on this)'
        ],
        realWorldExample: 'Google Maps ETA accounts for "typical time at this light" by learning signal timing from probe data - that\'s why ETA updates as you approach signals.'
      },

      requiredComponents: ['Navigation Service', 'Traffic Service', 'Historical Traffic DB', 'ML Model Service'],

      hints: [
        { trigger: 'stuck', content: 'ETA needs both real-time traffic AND historical patterns for accuracy' },
        { trigger: 'simple_math', content: 'distance/speed is naive. You need segment-by-segment prediction with traffic.' },
        { trigger: 'no_uncertainty', content: 'Long routes have more uncertainty. Show ranges, not exact times.' }
      ],

      validation: {
        requiredConnections: [
          { from: 'Navigation Service', to: 'Traffic Service' },
          { from: 'Navigation Service', to: 'Historical Traffic DB' },
          { from: 'Navigation Service', to: 'ML Model Service' }
        ],
        requiredComponents: ['Historical Traffic DB', 'ML Model Service']
      },

      thinkingFramework: {
        approach: 'accuracy-optimization',
        questions: [
          'Why is simple distance/speed wrong?',
          'How do historical patterns improve predictions?',
          'How do we communicate uncertainty to users?'
        ],
        tradeoffs: [
          { option: 'Conservative ETA (longer)', pros: ['Users arrive early', 'Under-promise'], cons: ['Lose trust if always wrong'] },
          { option: 'Aggressive ETA (shorter)', pros: ['Looks competitive'], cons: ['Users arrive late', 'Frustration'] }
        ]
      }
    },

    // ============== PHASE 4: GLOBAL INTELLIGENCE ==============
    {
      id: 'step-10',
      title: 'Traffic Prediction',
      phase: 'phase-4-expert',
      description: 'Predict future traffic conditions for departure time planning',
      order: 10,

      educationalContent: {
        title: 'Predicting the Future of Traffic',
        explanation: `Traffic prediction enables "leave at 8am for fastest route" vs "leave now" - critical for trip planning.

**Prediction Horizons:**
- **Short-term (0-30 min)**: Extrapolate current conditions
- **Medium-term (30min-2hr)**: Blend current + historical patterns
- **Long-term (2hr+)**: Primarily historical patterns + known events

**Historical Pattern Learning:**
\`\`\`
Collect years of traffic data:
- Day of week patterns
- Seasonal patterns (school year vs summer)
- Special events (concerts, sports games)
- Weather impact
\`\`\`

**Event Integration:**
Upcoming events that affect traffic:
- Sports games: predict surge around stadium
- Concerts: predict parking lot delays
- Weather forecasts: rain prediction → slower speeds
- Holidays: predict unusual patterns

**Graph Neural Networks for Traffic:**
Model the road network as a graph:
- Nodes = road segments
- Edges = connectivity
- GNN learns how congestion propagates through network
- Can predict: "if this highway backs up, these local roads will too"

**Prediction Quality Metrics:**
\`\`\`
MAPE (Mean Absolute Percentage Error):
- Short-term: ~10% error achievable
- Long-term: 15-25% error (inherent uncertainty)
\`\`\`

**Prediction API:**
\`\`\`typescript
interface TrafficPrediction {
  departureTime: Date;
  segments: Array<{
    segmentId: string;
    predictedSpeed: number;
    confidence: number;
  }>;
  predictedETA: number;
  alternateTimeSuggestions: Array<{
    departureTime: Date;
    eta: number;
    trafficCondition: 'light' | 'moderate' | 'heavy';
  }>;
}
\`\`\``,
        keyInsight: 'Traffic prediction combines historical patterns, known events, weather forecasts, and graph neural networks to estimate future conditions - with accuracy decreasing as prediction horizon increases',
        commonMistakes: [
          'Treating traffic as static (always using historical)',
          'Not accounting for special events',
          'Overpromising prediction accuracy for long horizons'
        ],
        interviewTips: [
          'Discuss short-term vs long-term prediction strategies',
          'Mention graph neural networks for traffic modeling',
          'Talk about integrating event calendars and weather'
        ],
        realWorldExample: 'Google Maps "Depart at" feature uses traffic prediction to recommend optimal departure times. It shows "Usually 30 min, traffic is typically heavy at 5pm".'
      },

      requiredComponents: ['Routing Service', 'Traffic Prediction Service', 'Historical Traffic DB', 'Event Service', 'Weather Service', 'ML Model Service'],

      hints: [
        { trigger: 'stuck', content: 'Traffic prediction blends historical patterns with known future events (weather, concerts, games)' },
        { trigger: 'current_only', content: 'Current traffic tells you nothing about 2 hours from now. Need historical pattern learning.' },
        { trigger: 'no_events', content: 'A stadium concert will cause traffic. Integrate event calendars.' }
      ],

      validation: {
        requiredConnections: [
          { from: 'Routing Service', to: 'Traffic Prediction Service' },
          { from: 'Traffic Prediction Service', to: 'Historical Traffic DB' },
          { from: 'Traffic Prediction Service', to: 'Event Service' },
          { from: 'Traffic Prediction Service', to: 'ML Model Service' }
        ],
        requiredComponents: ['Traffic Prediction Service', 'Event Service', 'Weather Service']
      },

      thinkingFramework: {
        approach: 'prediction-modeling',
        questions: [
          'How does prediction accuracy vary with time horizon?',
          'What external factors affect future traffic?',
          'How do we learn traffic patterns from historical data?'
        ],
        tradeoffs: [
          { option: 'Historical-only prediction', pros: ['Simple', 'Stable'], cons: ['Misses anomalies', 'Cant adapt'] },
          { option: 'ML-based prediction', pros: ['More accurate', 'Adapts'], cons: ['Complex', 'Training cost'] }
        ]
      }
    },

    {
      id: 'step-11',
      title: 'Offline Maps',
      phase: 'phase-4-expert',
      description: 'Enable downloading maps for offline navigation',
      order: 11,

      educationalContent: {
        title: 'Maps Without Internet',
        explanation: `Offline maps are essential for areas with poor connectivity. But downloading "all of Europe" is not practical.

**Offline Data Components:**
1. **Map tiles**: Visual map display
2. **Road graph**: For routing calculations
3. **Place data**: POI names and locations
4. **Search index**: For offline search

**Storage Estimates:**
\`\`\`
Single city (e.g., San Francisco):
- Map tiles (zoom 0-15): ~50MB
- Road graph: ~20MB
- Places: ~10MB
- Search index: ~5MB
Total: ~85MB

Small country (e.g., Belgium):
- Map tiles: ~500MB
- Road graph: ~200MB
- Places: ~100MB
Total: ~800MB
\`\`\`

**Download Optimization:**
1. **Region selection**: Let users pick specific areas
2. **Incremental updates**: Only download changed tiles
3. **Compression**: Vector tiles compress 5-10x better
4. **Quality tiers**: Offer "essential" vs "full" downloads

**Offline Routing Challenges:**
- Contraction Hierarchies graph is huge (~2GB for US)
- Solution: Use simpler algorithm (A*) for offline
- Accept slightly slower routing (~100ms vs 1ms)

**Sync Strategy:**
\`\`\`typescript
interface OfflineRegion {
  regionId: string;
  boundingBox: BoundingBox;
  downloadedAt: Date;
  version: number;
  components: {
    tiles: { version: number; size: number };
    routing: { version: number; size: number };
    places: { version: number; size: number };
  };
}
// Check for updates when online
// Background sync changed components
\`\`\`

**Freshness vs Storage Tradeoff:**
- More zoom levels = more storage but better offline detail
- More frequent updates = fresher data but more bandwidth`,
        keyInsight: 'Offline maps require careful component selection and compression - users want to download their region, not the entire world, and data must be kept reasonably fresh',
        commonMistakes: [
          'Making users download everything or nothing',
          'Not providing update mechanism for downloaded regions',
          'Including unnecessary zoom levels (who needs zoom level 20 offline?)'
        ],
        interviewTips: [
          'Break down storage requirements by component',
          'Discuss incremental update strategy',
          'Mention that offline routing uses different algorithms than online'
        ],
        realWorldExample: 'Google Maps lets you download custom regions by drawing a box. It shows estimated size and warns about storage before downloading. Updates happen in background when on WiFi.'
      },

      requiredComponents: ['Client', 'Download Service', 'Tile Storage', 'Graph Storage', 'CDN'],

      hints: [
        { trigger: 'stuck', content: 'Offline requires tiles, routing graph, places, and search index - each is a separate download' },
        { trigger: 'all_or_nothing', content: 'Let users select specific regions. Nobody needs the whole world offline.' },
        { trigger: 'no_updates', content: 'Offline data becomes stale. Need incremental update mechanism.' }
      ],

      validation: {
        requiredConnections: [
          { from: 'Client', to: 'Download Service' },
          { from: 'Download Service', to: 'Tile Storage' },
          { from: 'Download Service', to: 'Graph Storage' },
          { from: 'Download Service', to: 'CDN' }
        ],
        requiredComponents: ['Download Service', 'Graph Storage']
      },

      thinkingFramework: {
        approach: 'resource-optimization',
        questions: [
          'What components are needed for offline functionality?',
          'How do we keep offline data fresh?',
          'How do we minimize download size while maximizing usefulness?'
        ],
        tradeoffs: [
          { option: 'Full-quality offline', pros: ['Same experience as online'], cons: ['Large downloads', 'Storage intensive'] },
          { option: 'Essential-only offline', pros: ['Smaller downloads'], cons: ['Missing details', 'Limited zoom'] }
        ]
      }
    },

    {
      id: 'step-12',
      title: 'Global Transit Integration',
      phase: 'phase-4-expert',
      description: 'Integrate transit systems worldwide with real-time arrival predictions',
      order: 12,

      educationalContent: {
        title: 'Unifying Global Transit',
        explanation: `Every city has different transit agencies, formats, and real-time systems. Unifying them is a massive integration challenge.

**GTFS: The Universal Transit Format**
Google Transit Feed Specification - standardized format for static schedules:
\`\`\`
agency.txt - Transit agency info
routes.txt - Route definitions (Bus 42, Metro Line A)
trips.txt - Scheduled trips for each route
stops.txt - Stop locations
stop_times.txt - Arrival/departure times at each stop
calendar.txt - Service days (weekdays, weekends)
\`\`\`

**GTFS-RT: Real-Time Updates**
Extensions for live data:
- **Trip Updates**: Delays, cancellations
- **Vehicle Positions**: Live location of buses/trains
- **Service Alerts**: Disruptions, detours

**Integration Challenges:**
\`\`\`
Problem: Every city does it differently
- New York: Multiple agencies (MTA, NJ Transit, PATH)
- London: TfL has proprietary API
- Tokyo: Different formats per rail company
- Many cities: No digital data at all
\`\`\`

**Real-Time Arrival Prediction:**
Even with GTFS-RT, predictions need enhancement:
1. **Schedule baseline**: What the schedule says
2. **Vehicle position**: Where the bus actually is
3. **Historical delays**: "This route is usually 5min late at rush hour"
4. **Traffic prediction**: Predict future delays based on traffic

**Prediction Model:**
\`\`\`typescript
interface ArrivalPrediction {
  stopId: string;
  routeId: string;
  scheduledArrival: Date;
  predictedArrival: Date;
  confidence: 'high' | 'medium' | 'low';
  vehiclePosition?: LatLng;
  source: 'schedule' | 'realtime' | 'predicted';
}
\`\`\`

**Data Quality Tiers:**
- Tier 1: GTFS + GTFS-RT (best experience)
- Tier 2: GTFS only (schedule-based, no real-time)
- Tier 3: Crowdsourced (user-reported arrival times)`,
        keyInsight: 'Global transit integration is less about algorithms and more about data partnerships and format normalization - GTFS provides a common language but real-time data varies wildly by agency',
        commonMistakes: [
          'Assuming all cities provide real-time data',
          'Using only scheduled times (buses are rarely on schedule)',
          'Not handling multi-agency trips'
        ],
        interviewTips: [
          'Explain GTFS as the standard format',
          'Discuss real-time data quality variations',
          'Mention that prediction enhances even real-time data'
        ],
        realWorldExample: 'Google Maps shows "Usually on time" or "Often 5 min late" based on historical analysis. They\'ve collected years of GTFS-RT data to learn route reliability.'
      },

      requiredComponents: ['API Gateway', 'Transit Service', 'GTFS Processor', 'Transit Database', 'Real-Time Feed Aggregator', 'Prediction Service'],

      hints: [
        { trigger: 'stuck', content: 'GTFS is the standard format for transit data. Real-time feeds (GTFS-RT) provide live updates.' },
        { trigger: 'single_agency', content: 'Most cities have multiple transit agencies. Need to aggregate and unify.' },
        { trigger: 'schedule_only', content: 'Schedules are often wrong. Real-time data + historical delays improve predictions.' }
      ],

      validation: {
        requiredConnections: [
          { from: 'API Gateway', to: 'Transit Service' },
          { from: 'Transit Service', to: 'GTFS Processor' },
          { from: 'Transit Service', to: 'Transit Database' },
          { from: 'Transit Service', to: 'Real-Time Feed Aggregator' },
          { from: 'Transit Service', to: 'Prediction Service' }
        ],
        requiredComponents: ['GTFS Processor', 'Real-Time Feed Aggregator', 'Prediction Service']
      },

      thinkingFramework: {
        approach: 'integration-architecture',
        questions: [
          'How do we normalize different transit data formats?',
          'How do we handle cities without real-time data?',
          'How do we predict arrivals better than agencies do?'
        ],
        tradeoffs: [
          { option: 'Agency partnerships only', pros: ['Official data', 'Reliable'], cons: ['Slow to scale', 'Coverage gaps'] },
          { option: 'Crowdsourced transit', pros: ['Global coverage'], cons: ['Inconsistent quality', 'Requires user base'] }
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

      // Services
      { type: 'Geocoding Service', category: 'service' },
      { type: 'Search Service', category: 'service' },
      { type: 'Places Service', category: 'service' },
      { type: 'Review Service', category: 'service' },
      { type: 'Routing Service', category: 'service' },
      { type: 'Navigation Service', category: 'service' },
      { type: 'Traffic Service', category: 'service' },
      { type: 'Traffic Prediction Service', category: 'service' },
      { type: 'Transit Service', category: 'service' },
      { type: 'GTFS Processor', category: 'service' },
      { type: 'Real-Time Feed Aggregator', category: 'service' },
      { type: 'Prediction Service', category: 'service' },
      { type: 'Download Service', category: 'service' },
      { type: 'Tile Server', category: 'service' },
      { type: 'Event Service', category: 'service' },
      { type: 'Weather Service', category: 'service' },
      { type: 'ML Model Service', category: 'service' },

      // Databases
      { type: 'Location Database', category: 'database' },
      { type: 'Places Database', category: 'database' },
      { type: 'Road Graph Database', category: 'database' },
      { type: 'Transit Database', category: 'database' },
      { type: 'Traffic Database', category: 'database' },
      { type: 'Historical Traffic DB', category: 'database' },

      // Storage
      { type: 'Tile Storage', category: 'storage' },
      { type: 'Graph Storage', category: 'storage' },
      { type: 'Object Storage', category: 'storage' },

      // Messaging
      { type: 'Kafka', category: 'messaging' },

      // Caching
      { type: 'Redis Cache', category: 'caching' }
    ]
  },

  learningObjectives: [
    'Design efficient geocoding with spatial indexing (geohash, R-tree)',
    'Understand map tile systems and CDN optimization',
    'Implement route calculation with Contraction Hierarchies',
    'Build real-time traffic systems from crowdsourced probe data',
    'Design turn-by-turn navigation as a state machine',
    'Create accurate ETA prediction using ML models',
    'Build traffic prediction combining historical and real-time data',
    'Design offline map download and sync systems',
    'Integrate global transit data using GTFS standards'
  ],

  prerequisites: [
    'Basic understanding of graph algorithms (Dijkstra, A*)',
    'Familiarity with geospatial concepts (lat/lng, coordinate systems)',
    'Understanding of CDN and caching',
    'Basic knowledge of ML concepts for ETA/prediction'
  ],

  interviewRelevance: {
    commonQuestions: [
      'How would you design a mapping system like Google Maps?',
      'How does real-time traffic work?',
      'Design a route calculation system that handles millions of requests',
      'How would you implement turn-by-turn navigation?',
      'Design a system for offline maps'
    ],
    keyTakeaways: [
      'Map tiles + CDN solve the rendering at scale problem',
      'Contraction Hierarchies make continental routing sub-second',
      'Traffic is crowdsourced from users running navigation',
      'ETA requires combining real-time, historical, and ML prediction',
      'Transit integration is a data partnership challenge'
    ],
    frequentMistakes: [
      'Trying to render maps in real-time instead of using tile pyramids',
      'Using basic Dijkstra for production routing',
      'Not understanding where traffic data comes from',
      'Ignoring the complexity of turn-by-turn navigation state management'
    ]
  }
};
