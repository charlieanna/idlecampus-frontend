import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Yelp - Business Review Platform
 * Level 1 ONLY: Brute force connectivity test
 */
export const yelpProblemDefinition: ProblemDefinition = {
  id: 'yelp',
  title: 'Yelp - Business Reviews',
  description: `Design a business review platform like Yelp that:
- Users can search for local businesses
- Users can write reviews and upload photos
- Businesses are ranked by rating and relevance
- Platform supports geospatial search`,

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

  scenarios: [
    {
      name: 'Level 1: The Brute Force Test - Does It Even Work?',
      description: 'Like algorithm brute force: ignore performance, just verify connectivity. Client → App → Database → S3 path exists. No optimization needed.',
      traffic: {
        rps: 0.1,
        readWriteRatio: 0.5,
        geospatialQueries: true,
        avgFileSize: 2, // 2MB photos
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
