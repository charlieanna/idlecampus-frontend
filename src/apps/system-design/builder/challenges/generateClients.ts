import { ComponentNode } from '../types/component';
import { ClientDescription, ProblemDefinition } from '../types/problemDefinition';

/**
 * Analyzes a functional requirement to determine if it's read-heavy or write-heavy
 */
function analyzeRequirement(fr: string): { isRead: boolean; isWrite: boolean; description: string } {
  const lower = fr.toLowerCase();

  // Write indicators
  const writeKeywords = ['post', 'create', 'upload', 'publish', 'write', 'send', 'submit', 'add', 'shorten', 'generate'];
  const isWrite = writeKeywords.some(keyword => lower.includes(keyword));

  // Read indicators
  const readKeywords = ['view', 'read', 'get', 'see', 'browse', 'search', 'feed', 'timeline', 'access', 'redirect', 'watch', 'listen', 'download'];
  const isRead = readKeywords.some(keyword => lower.includes(keyword));

  return {
    isRead,
    isWrite,
    description: fr
  };
}

/**
 * Extracts a concise action from a functional requirement
 * e.g., "Users can post short messages (tweets)" -> "Posts tweets"
 */
function extractAction(fr: string): string {
  const lower = fr.toLowerCase();

  // Try to extract the action after "can" or "to"
  const canMatch = lower.match(/can\s+([^,\.]+)/);
  if (canMatch) {
    let action = canMatch[1].trim();
    // Capitalize first letter and return
    return action.charAt(0).toUpperCase() + action.slice(1);
  }

  // Fallback: just take first 30 chars
  return fr.substring(0, 30) + (fr.length > 30 ? '...' : '');
}

/**
 * Generates a short subtitle from a functional requirement
 * e.g., "Users can post short messages (tweets)" -> "Posts tweets"
 */
function generateSubtitle(fr: string): string {
  const action = extractAction(fr);

  // Clean up common patterns
  let subtitle = action
    .replace(/^users?\s+/i, '')
    .replace(/^can\s+/i, '')
    .trim();

  // Ensure it starts with capital letter
  if (subtitle.length > 0) {
    subtitle = subtitle.charAt(0).toUpperCase() + subtitle.slice(1);
  }

  return subtitle || 'User actions';
}

/**
 * Generates a client name from the action
 * e.g., "post tweets" -> "Tweet Client"
 */
function generateClientName(fr: string, index: number): string {
  const lower = fr.toLowerCase();

  // Try to extract the main noun/object
  if (lower.includes('tweet')) return 'Tweet Client';
  if (lower.includes('timeline') || lower.includes('feed')) return 'Timeline Client';
  if (lower.includes('search')) return 'Search Client';
  if (lower.includes('message')) return 'Message Client';
  if (lower.includes('photo') || lower.includes('image')) return 'Photo Client';
  if (lower.includes('video')) return 'Video Client';
  if (lower.includes('post') && !lower.includes('tweet')) return 'Post Client';
  if (lower.includes('url')) return 'URL Client';
  if (lower.includes('file')) return 'File Client';
  if (lower.includes('upload')) return 'Upload Client';
  if (lower.includes('comment')) return 'Comment Client';
  if (lower.includes('like')) return 'Like Client';
  if (lower.includes('follow')) return 'Follow Client';
  if (lower.includes('profile')) return 'Profile Client';
  if (lower.includes('user')) return 'User Client';

  // Fallback
  return `Client ${index + 1}`;
}

/**
 * Converts a name to snake_case ID
 * e.g., "Tweet Client" -> "tweet_client"
 */
function toSnakeCase(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');
}

/**
 * Generates a single standardized client per problem for a compact canvas
 */
export function generateClientsFromFRs(problemDef: ProblemDefinition): ClientDescription[] {
  // Always render a single standardized client for a compact canvas
  return [
    {
      name: 'Client',
      subtitle: 'User traffic source',
      id: 'client',
    },
  ];
}

/**
 * Generates initial component nodes from client descriptions
 */
export function generateClientNodes(problemDef: ProblemDefinition): ComponentNode[] {
  const clientDescriptions = generateClientsFromFRs(problemDef);

  return clientDescriptions.map((client, index) => ({
    id: client.id || toSnakeCase(client.name),
    type: 'client' as const,
    config: {
      displayName: client.name,
      subtitle: client.subtitle,
    }
  }));
}
