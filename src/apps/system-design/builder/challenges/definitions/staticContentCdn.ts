import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Static Content CDN - Easy caching problem
 * From extracted-problems/system-design/caching.md
 */
export const staticContentCdnProblemDefinition: ProblemDefinition = {
  id: 'static-content-cdn',
  title: 'Static Content CDN',
  description: `Design a CDN for a news website serving static content that:
- Serves images, CSS, and JavaScript from edge locations globally
- Achieves 95% cache hit rate to reduce origin load
- Delivers content with <50ms latency globally
- Handles 20k requests/sec for static assets`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'cdn',
        reason: 'Need CDN to serve static assets from edge locations',
      },
      {
        type: 'compute',
        reason: 'Need origin server to handle cache misses',
      },
      {
        type: 'object_storage',
        reason: 'Need S3 to store master copies of static assets',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'cdn',
        reason: 'Users access static content through CDN',
      },
      {
        from: 'cdn',
        to: 'compute',
        reason: 'CDN pulls from origin on cache miss',
      },
      {
        from: 'compute',
        to: 'object_storage',
        reason: 'Origin fetches assets from S3',
      },
    ],
    dataModel: {
      entities: ['asset'],
      fields: {
        asset: ['id', 'filename', 's3_key', 'content_type', 'size_bytes', 'version'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' }, // Serving assets
      ],
    },
  },

  scenarios: generateScenarios('static-content-cdn', problemConfigs['static-content-cdn']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};
