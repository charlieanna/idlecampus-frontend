import { ProblemDefinition } from '../../types/problemDefinition';
import {
  validConnectionFlowValidator,
  replicationConfigValidator,
  partitioningConfigValidator,
} from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Yelp - Business Review Platform
 * DDIA Ch. 3 (Storage & Retrieval) - Geospatial Indexes
 *
 * DDIA Concepts Applied:
 * - Ch. 3: Geospatial indexes for location-based search
 *   - R-tree or Quadtree for efficient proximity queries
 *   - PostGIS extensions for PostgreSQL (geography type)
 *   - Geohashing for partitioning and sharding by location
 * - Ch. 3: Composite indexes for complex queries
 *   - (lat, lng, category, rating) for filtered business search
 * - Ch. 3: Secondary indexes for sorting
 *   - Index on rating for "highest rated" queries
 *   - Index on review_count for popularity sorting
 *
 * Geospatial Index Types (DDIA Ch. 3):
 * - **R-tree**: Hierarchical bounding boxes, good for range queries
 * - **Quadtree**: Recursive spatial subdivision into 4 quadrants
 * - **Geohash**: Encode lat/lng into base32 string for partitioning
 *
 * Example Query (PostGIS):
 * SELECT * FROM businesses
 * WHERE ST_DWithin(location::geography, ST_MakePoint(-122.4, 37.7)::geography, 5000)
 *   AND category = 'restaurant'
 * ORDER BY rating DESC
 * LIMIT 20;
 *
 * System Design Primer Concepts:
 * - Geospatial Indexing: Use Quadtree or Geohash for driver/business proximity
 * - Denormalization: Cache average_rating on businesses table
 */
export const yelpProblemDefinition: ProblemDefinition = {
  id: 'yelp',
  title: 'Yelp - Business Reviews',
  description: `Design a business review platform like Yelp that:
- Users can search for local businesses
- Users can write reviews and upload photos
- Businesses are ranked by rating and relevance
- Platform supports geospatial search

Learning Objectives (DDIA Ch. 3):
1. Implement geospatial indexes for location-based search (DDIA Ch. 3)
   - Use R-tree or Quadtree for proximity queries
   - Support "find businesses within 5km" efficiently
2. Design composite indexes for filtered queries (DDIA Ch. 3)
   - Combine location, category, rating in single index
3. Optimize sorting with secondary indexes (DDIA Ch. 3)
   - Index on rating for "highest rated" view
4. Partition by geography for horizontal scaling (DDIA Ch. 6)
   - Use geohashing to shard by city/region`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Users can search for local businesses',
    'Users can write reviews and upload photos',
    'Businesses are ranked by rating and relevance',
    'Platform supports geospatial search'
  ],

  userFacingNFRs: [
    'Proximity search: p99 < 100ms for 5km radius (DDIA Ch. 3: Geospatial index)',
    'Geospatial query: Return results in O(log n + k) time (DDIA Ch. 3: R-tree)',
    'Search with filters: < 200ms for location + category + rating (DDIA Ch. 3: Composite index)',
    'Review aggregation: < 50ms (DDIA Ch. 3: Denormalized average_rating)',
    'Partitioning: Partition by geohash for data locality (DDIA Ch. 6)',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need to process searches and reviews',
      },
      {
        type: 'storage',
        reason: 'Need to store businesses, reviews, users',
      },
      {
        type: 'object_storage',
        reason: 'Need to store review photos',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Client sends search and review requests',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'App server needs to store review data',
      },
      {
        from: 'compute',
        to: 'object_storage',
        reason: 'App server needs to store photos',
      },
    ],
    dataModel: {
      entities: ['user', 'business', 'review', 'photo', 'category'],
      fields: {
        user: ['id', 'name', 'email', 'review_count', 'created_at'],
        business: ['id', 'name', 'address', 'lat', 'lng', 'category', 'rating', 'created_at'],
        review: ['id', 'business_id', 'user_id', 'rating', 'text', 'created_at'],
        photo: ['id', 'review_id', 'url', 'created_at'],
        category: ['id', 'name', 'parent_id', 'created_at'],
      },
      accessPatterns: [
        { type: 'geospatial_query', frequency: 'very_high' }, // Searching nearby businesses
        { type: 'write', frequency: 'high' },        // Writing reviews
        { type: 'read_by_key', frequency: 'very_high' }, // Viewing business pages
      ],
    },
  },

  scenarios: generateScenarios('yelp', problemConfigs.yelp),

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
from typing import List, Dict, Optional

# In-memory storage (naive implementation)
users = {}
businesses = {}
reviews = {}
photos = {}
categories = {}

def search_businesses(location: str = None, category: str = None,
                      query: str = None) -> List[Dict]:
    """
    FR-1: Users can search for local businesses
    Naive implementation - simple text matching, no real geospatial search
    """
    results = []
    for business in businesses.values():
        if location and location.lower() not in business['address'].lower():
            continue
        if category and business.get('category') != category:
            continue
        if query and query.lower() not in business['name'].lower():
            continue
        results.append(business)

    # Sort by rating (naive ranking)
    results.sort(key=lambda x: x.get('rating', 0), reverse=True)
    return results

def write_review(review_id: str, business_id: str, user_id: str,
                 rating: int, text: str) -> Dict:
    """
    FR-2: Users can write reviews
    Naive implementation - stores review in memory
    """
    if rating < 1 or rating > 5:
        raise ValueError("Rating must be between 1 and 5")

    reviews[review_id] = {
        'id': review_id,
        'business_id': business_id,
        'user_id': user_id,
        'rating': rating,
        'text': text,
        'created_at': datetime.now()
    }

    # Update business rating (naive average)
    business = businesses.get(business_id)
    if business:
        business_reviews = [r for r in reviews.values() if r['business_id'] == business_id]
        avg_rating = sum(r['rating'] for r in business_reviews) / len(business_reviews)
        business['rating'] = round(avg_rating, 1)

    return reviews[review_id]

def upload_photo(photo_id: str, review_id: str, url: str) -> Dict:
    """
    FR-2: Users can upload photos
    Naive implementation - stores photo reference
    """
    photos[photo_id] = {
        'id': photo_id,
        'review_id': review_id,
        'url': url,
        'created_at': datetime.now()
    }
    return photos[photo_id]

def get_business_reviews(business_id: str, limit: int = 20) -> List[Dict]:
    """
    Helper: Get reviews for a business
    Naive implementation - returns recent reviews with photos
    """
    business_reviews = []
    for review in reviews.values():
        if review['business_id'] == business_id:
            # Add photos for review
            review_photos = [p for p in photos.values() if p['review_id'] == review['id']]
            review_with_photos = {**review, 'photos': review_photos}
            business_reviews.append(review_with_photos)

    # Sort by created_at (most recent first)
    business_reviews.sort(key=lambda x: x['created_at'], reverse=True)
    return business_reviews[:limit]
`,
};
