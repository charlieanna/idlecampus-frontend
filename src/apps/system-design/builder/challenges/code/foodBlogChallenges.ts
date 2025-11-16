import { CodeChallenge } from '../../types/codeChallenge';

/**
 * Food Blog Code Challenges
 * Implementation tasks for a recipe sharing platform
 */

const imageOptimizationChallenge: CodeChallenge = {
  id: 'foodblog_image_optimization',
  title: 'Implement Image Optimization',
  description: `Implement a function to serve optimized images based on client device and network conditions.

**Requirements:**
- Detect device type (mobile/desktop) from user agent
- Choose appropriate image size
- Return CDN URL with optimized image parameters

**Example:**
- Mobile device: 800px width images
- Desktop: 1920px width images
- Slow connection: Compress more (quality: 60)
- Fast connection: Higher quality (quality: 85)

**Interview Focus:**
- How do you handle different screen sizes?
- What compression strategies minimize bandwidth?
- How do CDN query parameters work?`,

  difficulty: 'easy',
  componentType: 'app_server',

  functionSignature: 'function getOptimizedImageUrl(imagePath: string, userAgent: string, connection: string): string',

  starterCode: `/**
 * Generate optimized image URL based on device and connection
 * @param imagePath - Original image path (e.g., '/images/chocolate-cake.jpg')
 * @param userAgent - User agent string
 * @param connection - Connection type ('slow' | 'fast')
 * @returns Optimized CDN URL with query parameters
 */
function getOptimizedImageUrl(imagePath: string, userAgent: string, connection: string): string {
  // TODO: Implement image optimization logic
  // Hint: CDN URLs can have query params like ?w=800&q=85

  const isMobile = userAgent.toLowerCase().includes('mobile');

  // Your code here

  return '';
}`,

  testCases: [
    {
      id: 'test_mobile_slow',
      name: 'Mobile device with slow connection',
      input: { imagePath: '/images/pasta.jpg', userAgent: 'Mozilla/5.0 (iPhone)', connection: 'slow' },
      expectedOutput: '/images/pasta.jpg?w=800&q=60',
    },
    {
      id: 'test_desktop_fast',
      name: 'Desktop with fast connection',
      input: { imagePath: '/images/pasta.jpg', userAgent: 'Mozilla/5.0 (Windows NT)', connection: 'fast' },
      expectedOutput: '/images/pasta.jpg?w=1920&q=85',
    },
    {
      id: 'test_mobile_fast',
      name: 'Mobile with fast connection',
      input: { imagePath: '/images/salad.jpg', userAgent: 'Mozilla/5.0 (Android)', connection: 'fast' },
      expectedOutput: '/images/salad.jpg?w=800&q=85',
    },
  ],

  referenceSolution: `function getOptimizedImageUrl(imagePath: string, userAgent: string, connection: string): string {
  const isMobile = userAgent.toLowerCase().includes('mobile');

  // Choose width based on device
  const width = isMobile ? 800 : 1920;

  // Choose quality based on connection
  const quality = connection === 'slow' ? 60 : 85;

  // Build optimized URL with query parameters
  return \`\${imagePath}?w=\${width}&q=\${quality}\`;
}`,

  solutionExplanation: `**Optimal Approach: Device and Connection Detection**

1. **Device Detection**: Check user agent for 'mobile' keyword
2. **Responsive Sizing**: Mobile=800px, Desktop=1920px
3. **Connection-Aware Quality**: Slow=60%, Fast=85%
4. **CDN Parameters**: Use query strings (?w=width&q=quality)

**Key Insights**:
- User agent detection is simple but effective for most cases
- CDN query parameters allow dynamic image transformations
- Lower quality on slow connections reduces bandwidth without changing layout

**Interview Tips**:
- Discuss responsive images and srcset attribute
- Mention WebP/AVIF for modern browsers
- Talk about lazy loading for below-fold images`,
};

const cacheStrategyChallenge: CodeChallenge = {
  id: 'foodblog_cache_strategy',
  title: 'Implement Cache-Control Headers',
  description: `Set appropriate cache headers for different content types in a food blog.

**Requirements:**
- HTML pages: Cache for 5 minutes (may update frequently)
- Images: Cache for 1 year (immutable content)
- API responses: Don't cache (dynamic data)

**Cache-Control Values:**
- Short: "public, max-age=300" (5 minutes)
- Long: "public, max-age=31536000, immutable" (1 year)
- No cache: "no-store"

**Interview Focus:**
- Why different cache durations for different content?
- What is the difference between max-age and immutable?
- How does browser caching reduce server load?`,

  difficulty: 'easy',
  componentType: 'app_server',

  functionSignature: 'function getCacheHeader(contentType: string): string',

  starterCode: `/**
 * Return appropriate Cache-Control header for content type
 * @param contentType - MIME type (e.g., 'text/html', 'image/jpeg', 'application/json')
 * @returns Cache-Control header value
 */
function getCacheHeader(contentType: string): string {
  // TODO: Implement cache header logic
  // Hint: Check if contentType starts with 'image/', 'text/html', etc.

  // Your code here

  return '';
}`,

  testCases: [
    {
      id: 'test_html',
      name: 'HTML pages cache for 5 minutes',
      input: { contentType: 'text/html' },
      expectedOutput: 'public, max-age=300',
    },
    {
      id: 'test_jpeg',
      name: 'JPEG images cache for 1 year',
      input: { contentType: 'image/jpeg' },
      expectedOutput: 'public, max-age=31536000, immutable',
    },
    {
      id: 'test_png',
      name: 'PNG images also cache for 1 year',
      input: { contentType: 'image/png' },
      expectedOutput: 'public, max-age=31536000, immutable',
    },
    {
      id: 'test_json',
      name: 'API responses should not be cached',
      input: { contentType: 'application/json' },
      expectedOutput: 'no-store',
    },
  ],

  referenceSolution: `function getCacheHeader(contentType: string): string {
  // Images are immutable - cache for 1 year
  if (contentType.startsWith('image/')) {
    return 'public, max-age=31536000, immutable';
  }

  // HTML pages - cache briefly (5 minutes)
  if (contentType === 'text/html') {
    return 'public, max-age=300';
  }

  // API responses - don't cache
  if (contentType === 'application/json') {
    return 'no-store';
  }

  // Default: no caching
  return 'no-store';
}`,

  solutionExplanation: `**Optimal Approach: Content-Based Caching Strategy**

1. **Images**: Long cache (1 year + immutable) - content rarely changes
2. **HTML**: Short cache (5 minutes) - may update frequently
3. **API**: No cache - dynamic data changes often
4. **Default**: No cache - safe fallback

**Key Insights**:
- \`immutable\` directive tells browser content will never change
- Public vs private caching affects CDN behavior
- max-age is in seconds (31536000 = 365 days)

**Interview Tips**:
- Discuss ETags and conditional requests
- Mention service workers for offline caching
- Talk about cache invalidation strategies
- Consider using content-based URLs (hash in filename) for long caching`,
};

export const foodBlogCodeChallenges: CodeChallenge[] = [
  imageOptimizationChallenge,
  cacheStrategyChallenge,
];
