import { ProblemDefinition } from '../../types/problemDefinition';
import {
  validConnectionFlowValidator,
  replicationConfigValidator,
  partitioningConfigValidator,
  highAvailabilityValidator,
  transactionConfigValidator,
} from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Airbnb - Vacation Rental Platform
 * Comprehensive FR and NFR scenarios with DDIA/SDP concepts
 *
 * DDIA Concepts Applied (Ch. 2 - Data Models & Query Languages, Ch. 12 - Future of Data Systems):
 * - Relational Model: Normalized SQL schema design with proper foreign keys
 * - Complex Joins: Multi-table queries (listings → bookings → reviews → users)
 * - Indexing Strategies: Geospatial indexes for location search, composite indexes
 * - Query Optimization: Efficient joins for review aggregation, availability checks
 * - Referential Integrity: Foreign key constraints to prevent orphaned bookings
 * - ACID Transactions (Ch. 7): Atomic booking + payment processing
 *
 * DDIA Ch. 3 - Storage & Retrieval:
 * - Composite Indexes: (listing_id, check_in, check_out) for availability queries
 * - Geospatial Indexes: PostGIS or MySQL spatial indexes for location search
 * - Covering Indexes: Include commonly queried columns to avoid table lookups
 *
 * DDIA Ch. 12 - Lambda Architecture for Analytics:
 *
 * Lambda Architecture combines batch processing and stream processing to provide:
 * - Accurate results from batch layer (eventual)
 * - Fast approximations from speed layer (real-time)
 * - Unified serving layer for queries
 *
 * Three Layers:
 *
 * 1. Batch Layer (Accurate, Historical):
 *    - Input: Immutable event log (S3 or HDFS)
 *    - Processing: Apache Spark batch jobs (runs every 6 hours)
 *    - Output: Precomputed views (batch views)
 *    - Data: Complete historical data (all bookings, reviews, searches)
 *
 * 2. Speed Layer (Real-time, Approximate):
 *    - Input: Live event stream (Kafka)
 *    - Processing: Kafka Streams or Flink (real-time)
 *    - Output: Real-time views (incremental updates)
 *    - Data: Recent data only (last 6 hours)
 *
 * 3. Serving Layer:
 *    - Merges batch views + speed layer views
 *    - Queries combine both sources for complete picture
 *    - Batch views provide accurate baseline
 *    - Speed layer fills the gap with recent data
 *
 * Use Case 1: Listing Popularity Score
 *
 * Batch Layer (runs every 6 hours):
 * - Read all historical data: bookings, views, reviews (past year)
 * - Calculate comprehensive popularity score:
 *   - Total bookings: 1,500
 *   - Total views: 45,000
 *   - Average rating: 4.8
 *   - Review count: 320
 *   - Conversion rate: 3.3%
 * - Store in batch_listing_stats table
 * - Last computed: 6:00 AM
 *
 * Speed Layer (real-time):
 * - Stream processing: bookings, views, reviews (since 6:00 AM)
 * - Incremental updates:
 *   - New bookings: +5 (since 6 AM)
 *   - New views: +200 (since 6 AM)
 *   - New reviews: +2 (since 6 AM)
 * - Store in realtime_listing_stats table
 *
 * Serving Layer Query (at 11:00 AM):
 * SELECT
 *   batch.listing_id,
 *   batch.total_bookings + realtime.new_bookings AS current_bookings,
 *   batch.total_views + realtime.new_views AS current_views,
 *   (batch.avg_rating * batch.review_count + realtime.new_rating_sum) /
 *     (batch.review_count + realtime.new_reviews) AS current_avg_rating
 * FROM batch_listing_stats batch
 * LEFT JOIN realtime_listing_stats realtime ON batch.listing_id = realtime.listing_id
 * WHERE batch.listing_id = 'listing_123'
 *
 * Result: Combines accurate historical data with fresh real-time updates
 *
 * Use Case 2: Host Earnings Dashboard
 *
 * Batch Layer (Spark job, runs at 2:00 AM daily):
 * Input: All bookings, payments, cancellations (historical)
 * Processing:
 *   - Group by host_id
 *   - SUM(payment_amount - airbnb_fee) for each month
 *   - Calculate year-over-year growth
 *   - Identify top-earning listings
 * Output: host_earnings_summary (PostgreSQL)
 *   - host_id, total_earnings, avg_booking_value, booking_count
 *   - Last updated: 2:00 AM today
 *
 * Speed Layer (Kafka Streams, real-time):
 * Input: Live booking and payment events
 * Processing:
 *   - Filter events where timestamp > last_batch_time (2:00 AM)
 *   - Aggregate earnings by host_id
 *   - Windowed aggregation: 1-hour tumbling windows
 * Output: realtime_host_earnings (Redis)
 *   - host_id, earnings_since_batch, new_bookings_count
 *
 * Serving Layer API (/api/hosts/:id/earnings):
 * def get_host_earnings(host_id):
 *     batch_data = postgres.query("SELECT * FROM host_earnings_summary WHERE host_id = ?", host_id)
 *     realtime_data = redis.get(f"realtime_earnings:{host_id}")
 *
 *     return {
 *         "total_earnings": batch_data.total_earnings + realtime_data.earnings_since_batch,
 *         "total_bookings": batch_data.booking_count + realtime_data.new_bookings_count,
 *         "last_batch_update": "2:00 AM",
 *         "realtime_as_of": datetime.now()
 *     }
 *
 * Use Case 3: Search Ranking with Fresh Availability
 *
 * Batch Layer:
 * - Precompute listing scores (quality, popularity, host reputation)
 * - Build search index with historical booking patterns
 * - Output: Elasticsearch index (updated every 12 hours)
 *
 * Speed Layer:
 * - Real-time availability updates (booking created → listing unavailable)
 * - Recent review updates (affects ranking)
 * - Price changes
 * - Output: Redis cache (TTL: 6 hours)
 *
 * Serving Layer (Search API):
 * 1. Query Elasticsearch (batch layer): Get top 100 listings by base score
 * 2. Query Redis (speed layer): Get real-time availability for top 100
 * 3. Merge results: Remove unavailable listings, re-rank based on fresh data
 * 4. Return top 20 to user
 *
 * Lambda Architecture Trade-offs (DDIA Ch. 12):
 *
 * Advantages:
 * - Fault tolerance: Batch layer can recompute if speed layer fails
 * - Accuracy: Batch layer provides correct results (no approximations)
 * - Low latency: Speed layer provides real-time updates
 * - Scalability: Batch and speed layers scale independently
 *
 * Disadvantages:
 * - Complexity: Maintain two separate codebases (batch + stream)
 * - Data duplication: Same logic implemented twice
 * - Eventual consistency: Speed layer and batch layer may temporarily diverge
 * - Resource overhead: Running both batch and stream processing
 *
 * Alternative: Kappa Architecture (DDIA Ch. 12):
 * - Single stream processing layer (no separate batch layer)
 * - Reprocess stream from beginning for corrections
 * - Simpler, but requires replayable streams (Kafka retention)
 * - Airbnb could use Kappa for simpler use cases (e.g., notification delivery)
 *
 * System Design Primer Concepts:
 * - Database Indexing: B-tree indexes for primary keys, geospatial for location
 * - Transaction Management: Two-phase commit for booking + payment atomicity
 * - Denormalization: Cache listing ratings to avoid expensive review aggregations
 */
export const airbnbProblemDefinition: ProblemDefinition = {
  id: 'airbnb',
  title: 'Airbnb - Vacation Rentals',
  description: `Design a vacation rental platform like Airbnb that:
- Hosts can list properties with photos and details
- Guests can search and book properties
- Platform handles payments and bookings
- Users can leave reviews

Learning Objectives (DDIA/SDP):
1. Design normalized SQL schema with foreign keys (DDIA Ch. 2)
   - Proper relationships: users → listings, listings → bookings, bookings → reviews
2. Implement complex joins for aggregations (DDIA Ch. 2)
   - Average rating per listing from reviews table
   - Availability checks across bookings table
3. Create efficient indexes for common queries (DDIA Ch. 3)
   - Geospatial index for location-based search
   - Composite index (listing_id, check_in, check_out) for availability
4. Ensure ACID transactions for bookings (DDIA Ch. 7)
   - Atomic: Create booking + payment together
   - Isolation: Prevent double-booking with serializable transactions
5. Optimize query performance with denormalization (DDIA Ch. 2)
   - Cache average_rating on listings table
6. Implement lambda architecture for analytics (DDIA Ch. 12)
   - Batch layer: Historical data processing with Spark
   - Speed layer: Real-time stream processing with Kafka Streams
   - Serving layer: Merge batch and real-time views
7. Design batch processing for popularity scores (DDIA Ch. 12)
   - Periodic jobs for comprehensive analytics
   - Immutable event logs for reprocessing
8. Build real-time views for fresh data (DDIA Ch. 12)
   - Incremental updates from event streams
   - Low-latency serving with Redis
9. Compare lambda vs kappa architecture (DDIA Ch. 12)
   - Trade-offs: complexity vs accuracy vs latency`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Hosts can list properties with photos and details',
    'Guests can search and book properties',
    'Platform handles payments and bookings',
    'Users can leave reviews'
  ],

  // DDIA/SDP Non-Functional Requirements
  userFacingNFRs: [
    'Search latency: p99 < 300ms (DDIA Ch. 3: Geospatial index)',
    'Booking transaction: ACID guarantees (DDIA Ch. 7: Serializable isolation)',
    'No double-bookings: Prevent with transactions (DDIA Ch. 7: Write skew prevention)',
    'Review aggregation: p99 < 100ms (DDIA Ch. 2: Denormalized average_rating)',
    'Availability query: < 50ms (DDIA Ch. 3: Composite index on dates)',
    'Referential integrity: Enforce FK constraints (DDIA Ch. 2: Relational model)',
    'Complex joins: < 200ms for 5-table queries (DDIA Ch. 2: Query optimization)',
    'Scalability: Partition by city/region (DDIA Ch. 6: Geographic partitioning)',
    'Batch processing: 6-hour refresh cycle (DDIA Ch. 12: Lambda batch layer)',
    'Real-time updates: < 5s latency (DDIA Ch. 12: Lambda speed layer)',
    'Serving layer latency: < 100ms (DDIA Ch. 12: Merge batch + realtime views)',
    'Batch job fault tolerance: Recompute from immutable log (DDIA Ch. 12: Event sourcing)',
    'Analytics accuracy: 100% from batch layer (DDIA Ch. 12: No approximations)',
    'Speed layer coverage: Last 6 hours (DDIA Ch. 12: Incremental updates)',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need to process bookings and searches',
      },
      {
        type: 'storage',
        reason: 'Need to store listings, bookings, users, reviews',
      },
      {
        type: 'object_storage',
        reason: 'Need to store property photos',
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
        reason: 'App server needs to read/write booking data',
      },
      {
        from: 'compute',
        to: 'object_storage',
        reason: 'App server needs to upload/retrieve photos',
      },
    ],
    dataModel: {
      entities: ['user', 'listing', 'booking', 'review', 'payment'],
      fields: {
        user: ['id', 'name', 'email', 'phone', 'is_host', 'created_at'],
        listing: ['id', 'host_id', 'title', 'description', 'price_per_night', 'lat', 'lng', 'created_at'],
        booking: ['id', 'listing_id', 'guest_id', 'check_in', 'check_out', 'total_price', 'status', 'created_at'],
        review: ['id', 'booking_id', 'reviewer_id', 'rating', 'comment', 'created_at'],
        payment: ['id', 'booking_id', 'amount', 'status', 'created_at'],
      },
      accessPatterns: [
        { type: 'geospatial_query', frequency: 'very_high' }, // Search by location
        { type: 'write', frequency: 'high' },        // Creating bookings
        { type: 'read_by_key', frequency: 'very_high' }, // Viewing listings
      ],
    },
  },

  scenarios: generateScenarios('airbnb', problemConfigs.airbnb),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
    {
      name: 'Transaction Configuration (DDIA Ch. 7)',
      validate: transactionConfigValidator,
    },
    {
      name: 'Replication Configuration (DDIA Ch. 5)',
      validate: replicationConfigValidator,
    },
    {
      name: 'Partitioning Configuration (DDIA Ch. 6)',
      validate: partitioningConfigValidator,
    },
    {
      name: 'High Availability (DDIA Ch. 5)',
      validate: highAvailabilityValidator,
    },
  ],

  pythonTemplate: `from datetime import datetime
from typing import List, Dict

# In-memory storage (naive implementation)
users = {}
listings = {}
bookings = {}
reviews = {}
payments = {}

def create_listing(listing_id: str, host_id: str, title: str, price_per_night: float, lat: float, lng: float) -> Dict:
    """
    FR-1: Hosts can list properties with photos and details
    Naive implementation - stores listing in memory
    """
    listings[listing_id] = {
        'id': listing_id,
        'host_id': host_id,
        'title': title,
        'description': "",
        'price_per_night': price_per_night,
        'lat': lat,
        'lng': lng,
        'photos': [],
        'created_at': datetime.now()
    }
    return listings[listing_id]

def search_listings(lat: float, lng: float, check_in: str, check_out: str, max_distance: float = 10.0) -> List[Dict]:
    """
    FR-2: Guests can search properties
    Naive implementation - returns all listings (no geospatial filtering)
    Real system would use geospatial database
    """
    # In real system, would filter by location, availability, dates
    return list(listings.values())

def book_property(booking_id: str, listing_id: str, guest_id: str, check_in: str, check_out: str) -> Dict:
    """
    FR-2: Guests can book properties
    Naive implementation - creates booking without conflict checking
    """
    if listing_id not in listings:
        return None

    listing = listings[listing_id]
    # Calculate nights and total (simplified)
    nights = 1  # Would calculate from dates in real system
    total_price = listing['price_per_night'] * nights

    bookings[booking_id] = {
        'id': booking_id,
        'listing_id': listing_id,
        'guest_id': guest_id,
        'check_in': check_in,
        'check_out': check_out,
        'total_price': total_price,
        'status': 'confirmed',
        'created_at': datetime.now()
    }
    return bookings[booking_id]

def process_payment(payment_id: str, booking_id: str, amount: float) -> Dict:
    """
    FR-3: Platform handles payments
    Naive implementation - stores payment record
    No actual payment processing
    """
    payments[payment_id] = {
        'id': payment_id,
        'booking_id': booking_id,
        'amount': amount,
        'status': 'completed',
        'created_at': datetime.now()
    }
    return payments[payment_id]

def leave_review(review_id: str, booking_id: str, reviewer_id: str, rating: int, comment: str) -> Dict:
    """
    FR-4: Users can leave reviews
    Naive implementation - stores review in memory
    """
    reviews[review_id] = {
        'id': review_id,
        'booking_id': booking_id,
        'reviewer_id': reviewer_id,
        'rating': rating,  # 1-5 stars
        'comment': comment,
        'created_at': datetime.now()
    }
    return reviews[review_id]

def get_listing_reviews(listing_id: str) -> List[Dict]:
    """
    Helper: Get all reviews for a listing
    Naive implementation - finds all bookings for listing and their reviews
    """
    listing_reviews = []
    # Find all bookings for this listing
    listing_booking_ids = [b['id'] for b in bookings.values() if b['listing_id'] == listing_id]

    # Find reviews for those bookings
    for review in reviews.values():
        if review['booking_id'] in listing_booking_ids:
            listing_reviews.append(review)

    return listing_reviews
`,
};
