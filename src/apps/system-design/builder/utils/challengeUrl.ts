/**
 * Utility functions for generating consistent challenge URLs
 */

/**
 * Converts a challenge ID to URL format (replaces underscores with hyphens)
 * This ensures URLs are consistent and SEO-friendly
 * 
 * @example
 * challengeIdToUrl('tiny_url') // returns 'tiny-url'
 * challengeIdToUrl('web_crawler') // returns 'web-crawler'
 */
export function challengeIdToUrl(challengeId: string): string {
  return challengeId.replace(/_/g, '-');
}

/**
 * Converts a URL slug back to challenge ID format (replaces hyphens with underscores)
 * 
 * @example
 * urlToChallengeId('tiny-url') // returns 'tiny_url'
 * urlToChallengeId('web-crawler') // returns 'web_crawler'
 */
export function urlToChallengeId(urlSlug: string): string {
  return urlSlug.replace(/-/g, '_');
}

/**
 * Generates a challenge URL path
 * 
 * @example
 * getChallengeUrl('tiny_url') // returns '/system-design/tiny-url'
 */
export function getChallengeUrl(challengeId: string): string {
  return `/system-design/${challengeIdToUrl(challengeId)}`;
}

