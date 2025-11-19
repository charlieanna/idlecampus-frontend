import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';
import { generateCodeChallengesFromFRs } from '../../utils/codeChallengeGenerator';

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

  userFacingFRs: [
    '**POST /api/assets/upload** - Upload static asset (image, CSS, JS) to origin storage (S3)',
    '**GET /cdn/{filename}** - Serve static asset from CDN edge cache with automatic origin fallback',
    '**POST /api/assets/{filename}/invalidate** - Invalidate CDN cache for a specific asset',
    '**GET /api/cdn/stats** - Get CDN cache statistics (hit rate, cached items)',
  ],

  userFacingNFRs: [
    '**Throughput**: Handle 20k requests/sec for static assets globally',
    '**Cache Hit Rate**: Achieve 95% cache hit rate to minimize origin load',
    '**Latency**: Deliver content with <50ms latency from edge locations worldwide',
    '**Availability**: Serve content from edge caches even during origin failures',
  ],

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

  pythonTemplate: `from datetime import datetime
from typing import Dict, Optional

# In-memory storage (naive implementation)
assets = {}
cdn_cache = {}  # Simulates CDN edge cache
origin_storage = {}  # Simulates S3

def upload_asset(asset_id: str, filename: str, content_type: str,
                 size_bytes: int, s3_key: str) -> Dict:
    """
    Upload asset to origin storage (S3)
    Naive implementation - stores asset metadata
    """
    assets[asset_id] = {
        'id': asset_id,
        'filename': filename,
        's3_key': s3_key,
        'content_type': content_type,
        'size_bytes': size_bytes,
        'version': 1,
        'created_at': datetime.now()
    }

    origin_storage[s3_key] = {
        'asset_id': asset_id,
        'data': f'<binary data for {filename}>',
        'uploaded_at': datetime.now()
    }

    return assets[asset_id]

def serve_asset(filename: str) -> Optional[Dict]:
    """
    Serve asset from CDN (95% cache hit rate)
    Naive implementation - checks CDN cache first, then origin
    """
    # Check CDN cache
    if filename in cdn_cache:
        cdn_cache[filename]['hits'] += 1
        return {
            'source': 'cdn_cache',
            'filename': filename,
            'data': cdn_cache[filename]['data'],
            'content_type': cdn_cache[filename]['content_type'],
            'latency_ms': 10  # <50ms from edge
        }

    # Cache miss - fetch from origin
    asset = None
    for a in assets.values():
        if a['filename'] == filename:
            asset = a
            break

    if not asset:
        return None

    # Fetch from S3
    s3_data = origin_storage.get(asset['s3_key'])
    if not s3_data:
        return None

    # Cache at CDN edge
    cdn_cache[filename] = {
        'data': s3_data['data'],
        'content_type': asset['content_type'],
        'cached_at': datetime.now(),
        'hits': 1
    }

    return {
        'source': 'origin',
        'filename': filename,
        'data': s3_data['data'],
        'content_type': asset['content_type'],
        'latency_ms': 150  # Higher latency from origin
    }

def invalidate_cdn_cache(filename: str) -> bool:
    """
    Invalidate CDN cache for asset
    Naive implementation - removes from cache
    """
    if filename in cdn_cache:
        del cdn_cache[filename]
        return True
    return False

def get_cdn_stats() -> Dict:
    """
    Get CDN cache statistics
    Naive implementation - calculates hit rate
    """
    total_hits = sum(item['hits'] for item in cdn_cache.values())
    cached_items = len(cdn_cache)

    return {
        'cached_items': cached_items,
        'total_hits': total_hits,
        'estimated_hit_rate': 0.95 if cached_items > 0 else 0.0
    }
`,
};

// Auto-generate code challenges from functional requirements
(staticContentCdnProblemDefinition as any).codeChallenges = generateCodeChallengesFromFRs(staticContentCdnProblemDefinition);
