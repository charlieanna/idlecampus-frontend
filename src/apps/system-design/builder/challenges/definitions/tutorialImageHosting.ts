import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';
import { generateCodeChallengesFromFRs } from '../../utils/codeChallengeGenerator';

/**
 * Tutorial 2: Image Hosting Service
 * From extracted-problems/system-design/tutorial.md
 */
export const tutorialImageHostingProblemDefinition: ProblemDefinition = {
  id: 'tutorial-intermediate-images',
  title: 'Tutorial 2: Image Hosting Service',
  description: `Learn CDN, caching, and storage optimization by building an image hosting service like Imgur that:
- Serves 10,000 requests/sec globally
- Stores 1M images (5TB) in object storage
- Uses CDN for global content delivery with 90% cache hit rate
- Optimizes costs with proper storage strategy`,

  userFacingFRs: [
    '**POST /api/images** - Upload a new image (max 10MB, supports JPG/PNG/GIF)',
    '**GET /api/images/:id** - Get image metadata (filename, size, upload date, S3 URL)',
    '**GET /cdn/images/:id** - Download the actual image file from CDN (served from edge locations)',
    '**DELETE /api/images/:id** - Delete an image (removes from S3 and invalidates CDN cache)',
    '**GET /api/users/:id/images** - List all images uploaded by a specific user',
    'Images are automatically cached at CDN edge locations for fast global delivery',
    'Metadata (image info) is cached in Redis for sub-10ms lookups',
  ],

  userFacingNFRs: [
    '**Image Download Latency**: < 100ms p95 globally when served from CDN (cache hit)',
    '**Metadata Latency**: < 50ms p95 for fetching image metadata from cache',
    '**Upload Latency**: < 2s p95 for uploading images to S3',
    '**CDN Cache Hit Rate**: > 90% (most image requests served from edge, not origin)',
    '**Throughput**: 10,000 requests/sec globally distributed',
    '**Storage Capacity**: Support 1M images (~5TB total)',
    '**Cost Optimization**: Use S3 Standard for recent images, S3 Glacier for old images (> 1 year)',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need app servers to handle uploads and serve metadata',
      },
      {
        type: 'storage',
        reason: 'Need database to store image metadata',
      },
      {
        type: 'object_storage',
        reason: 'Need S3 for cost-effective image file storage',
      },
      {
        type: 'cdn',
        reason: 'Need CDN to cache images at edge locations globally',
      },
      {
        type: 'cache',
        reason: 'Need Redis to cache metadata for fast lookups',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB to distribute API traffic',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'cdn',
        reason: 'Users access images through CDN',
      },
      {
        from: 'cdn',
        to: 'load_balancer',
        reason: 'CDN pulls from origin on cache miss',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to app servers',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'App servers cache metadata',
      },
      {
        from: 'compute',
        to: 'object_storage',
        reason: 'App servers upload/fetch images from S3',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'App servers store/query metadata',
      },
    ],
    dataModel: {
      entities: ['image', 'user'],
      fields: {
        image: ['id', 'user_id', 'filename', 's3_url', 'size_bytes', 'upload_date'],
        user: ['id', 'username', 'upload_count'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' }, // Viewing images
        { type: 'write_large_file', frequency: 'medium' }, // Uploading images
      ],
    },
  },

  scenarios: generateScenarios('tutorial-intermediate-images', problemConfigs['tutorial-intermediate-images']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

// Auto-generate code challenges from functional requirements
(tutorialImageHostingProblemDefinition as any).codeChallenges = generateCodeChallengesFromFRs(tutorialImageHostingProblemDefinition);
