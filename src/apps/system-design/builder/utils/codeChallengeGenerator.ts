/**
 * Auto-generate code challenges from system design problem definitions
 *
 * This utility analyzes a challenge's pythonTemplate and functional requirements
 * to automatically create 3-5 executable code challenges focusing on:
 * - Core FR functionality (e.g., create_profile, send_message)
 * - Common algorithms for the challenge type (e.g., friend suggestions for social)
 * - Performance optimizations (caching, batching, etc.)
 */

import { CodeChallenge, CodeTestCase } from '../types/codeChallenge';
import { ProblemDefinition } from '../types/problemDefinition';

/**
 * Challenge categories for algorithm-specific generation
 */
export type ChallengeCategory =
  | 'social_media'
  | 'messaging'
  | 'ecommerce'
  | 'streaming'
  | 'storage'
  | 'gateway'
  | 'search'
  | 'productivity'
  | 'delivery'
  | 'gaming'
  | 'generic';

/**
 * Extract function signatures from Python template code
 */
function extractFunctionSignatures(pythonTemplate: string): Array<{
  name: string;
  params: string[];
  fullSignature: string;
}> {
  const functionRegex = /def\s+(\w+)\s*\((.*?)\)\s*:/g;
  const functions: Array<{ name: string; params: string[]; fullSignature: string }> = [];

  let match;
  while ((match = functionRegex.exec(pythonTemplate)) !== null) {
    const name = match[1];
    const paramsStr = match[2];
    const params = paramsStr
      .split(',')
      .map(p => p.trim().split(':')[0].trim())
      .filter(p => p && p !== 'context');

    functions.push({
      name,
      params,
      fullSignature: match[0]
    });
  }

  return functions;
}

/**
 * Determine challenge category from problem ID and description
 */
export function categorizeChallenge(problemDef: ProblemDefinition): ChallengeCategory {
  const id = problemDef.id.toLowerCase();
  const title = problemDef.title?.toLowerCase() || '';

  // Social media platforms
  if (/(facebook|instagram|twitter|reddit|linkedin|tiktok|pinterest|snapchat|medium)/.test(id)) {
    return 'social_media';
  }

  // Messaging platforms
  if (/(whatsapp|slack|telegram|messenger|discord|chat)/.test(id)) {
    return 'messaging';
  }

  // E-commerce
  if (/(amazon|shopify|stripe|uber|airbnb|doordash|instacart|yelp|ticketmaster|booking)/.test(id)) {
    return 'ecommerce';
  }

  // Streaming/Media
  if (/(netflix|spotify|youtube|twitch|hulu|video|audio|stream)/.test(id)) {
    return 'streaming';
  }

  // Storage/Database
  if (/(dropbox|googledrive|pastebin|storage|database|s3)/.test(id)) {
    return 'storage';
  }

  // Gateway/Infrastructure
  if (/(gateway|rate.?limit|auth|graphql|api)/.test(id)) {
    return 'gateway';
  }

  // Search
  if (/(search|autocomplete|faceted|geo.?search)/.test(id)) {
    return 'search';
  }

  // Productivity
  if (/(notion|trello|calendar|zoom|github|stackoverflow)/.test(id)) {
    return 'productivity';
  }

  // Gaming
  if (/(steam|gaming|leaderboard)/.test(id)) {
    return 'gaming';
  }

  return 'generic';
}

/**
 * Generate test cases for a specific function based on its signature
 */
function generateTestCasesForFunction(
  functionName: string,
  params: string[],
  category: ChallengeCategory
): CodeTestCase[] {
  const testCases: CodeTestCase[] = [];

  // Basic test case (always included)
  testCases.push({
    id: `${functionName}_basic`,
    name: 'Basic functionality test',
    input: generateSampleInput(functionName, params, category, 'basic'),
    expectedOutput: generateExpectedOutput(functionName, category, 'basic'),
  });

  // Edge case test
  testCases.push({
    id: `${functionName}_edge`,
    name: 'Edge case test',
    input: generateSampleInput(functionName, params, category, 'edge'),
    expectedOutput: generateExpectedOutput(functionName, category, 'edge'),
  });

  // Performance test (if applicable)
  if (shouldHavePerformanceTest(functionName, category)) {
    testCases.push({
      id: `${functionName}_performance`,
      name: 'Performance test',
      input: generateSampleInput(functionName, params, category, 'performance'),
      expectedOutput: generateExpectedOutput(functionName, category, 'performance'),
      isPerformanceTest: true,
      timeoutMs: 5000,
    });
  }

  return testCases;
}

/**
 * Generate sample input for a function based on its name and category
 */
function generateSampleInput(
  functionName: string,
  params: string[],
  category: ChallengeCategory,
  testType: 'basic' | 'edge' | 'performance'
): any {
  // Create input object with parameter values
  const input: any = {};

  for (const param of params) {
    // Generate appropriate test data based on parameter name
    if (param.includes('id') || param === 'user' || param === 'owner') {
      input[param] = testType === 'basic' ? 'user_123' : 'user_999';
    } else if (param.includes('name') || param === 'title') {
      input[param] = testType === 'basic' ? 'Test Name' : '';
    } else if (param.includes('email')) {
      input[param] = 'test@example.com';
    } else if (param.includes('url') || param.includes('link')) {
      input[param] = 'https://example.com/test';
    } else if (param.includes('message') || param.includes('content') || param === 'text') {
      input[param] = testType === 'performance' ? 'x'.repeat(10000) : 'Hello, World!';
    } else if (param.includes('count') || param.includes('limit') || param.includes('size')) {
      input[param] = testType === 'performance' ? 10000 : 10;
    } else {
      // Generic string value
      input[param] = `test_${param}`;
    }
  }

  return input;
}

/**
 * Generate expected output placeholder (will be validated by backend)
 */
function generateExpectedOutput(
  functionName: string,
  category: ChallengeCategory,
  testType: string
): any {
  // For most functions, we expect a successful response object
  // The actual validation will be done by the Python test script

  if (functionName.includes('create') || functionName.includes('add')) {
    return { success: true, id: 'VALID_ID' };
  }

  if (functionName.includes('get') || functionName.includes('fetch') || functionName.includes('retrieve')) {
    return { success: true, data: 'VALID_DATA' };
  }

  if (functionName.includes('update') || functionName.includes('modify') || functionName.includes('edit')) {
    return { success: true, updated: true };
  }

  if (functionName.includes('delete') || functionName.includes('remove')) {
    return { success: true, deleted: true };
  }

  if (functionName.includes('list') || functionName.includes('all')) {
    return { success: true, items: 'VALID_ARRAY' };
  }

  // Generic success response
  return { success: true };
}

/**
 * Determine if a function should have performance tests
 */
function shouldHavePerformanceTest(functionName: string, category: ChallengeCategory): boolean {
  // Performance tests for common high-throughput operations
  const performanceKeywords = ['search', 'query', 'fetch', 'get', 'list', 'rank', 'sort', 'filter'];

  return performanceKeywords.some(keyword => functionName.toLowerCase().includes(keyword));
}

/**
 * Generate category-specific algorithm challenges
 */
function generateAlgorithmChallenges(
  category: ChallengeCategory,
  problemId: string,
  functions: Array<{ name: string; params: string[]; fullSignature: string }>
): CodeChallenge[] {
  const challenges: CodeChallenge[] = [];

  switch (category) {
    case 'social_media':
      // Friend suggestion algorithm
      if (functions.some(f => f.name.includes('friend') || f.name.includes('suggest'))) {
        challenges.push({
          id: `${problemId}_friend_suggestions`,
          title: 'Implement Friend Suggestion Algorithm',
          description: 'Suggest friends based on mutual connections (friends-of-friends)',
          difficulty: 'medium',
          functionSignature: 'def suggest_friends(user_id, context)',
          starterCode: `def suggest_friends(user_id, context):
    """
    Suggest friends for a user based on mutual connections.

    Args:
        user_id: ID of the user
        context: System context (db, cache, etc.)

    Returns:
        List of suggested user IDs, ranked by number of mutual friends
    """
    # TODO: Implement friend suggestion algorithm
    # 1. Get user's current friends
    # 2. Find friends-of-friends (2-hop connections)
    # 3. Rank by number of mutual friends
    # 4. Return top suggestions
    return []`,
          testCases: [
            {
              id: 'friend_suggestion_basic',
              name: 'Basic friend suggestions',
              input: { user_id: 'user_1' },
              expectedOutput: { success: true, suggestions: 'VALID_ARRAY' },
            },
          ],
          referenceSolution: '',
          solutionExplanation: 'Use BFS to traverse social graph to depth 2, count mutual friends, and rank suggestions.',
        });
      }
      break;

    case 'messaging':
      // Message ordering challenge
      challenges.push({
        id: `${problemId}_message_ordering`,
        title: 'Implement Message Ordering',
        description: 'Ensure messages are delivered in the correct order',
        difficulty: 'medium',
        functionSignature: 'def order_messages(messages, context)',
        starterCode: `def order_messages(messages, context):
    """
    Order messages by timestamp to ensure correct delivery sequence.

    Args:
        messages: List of messages with timestamps
        context: System context

    Returns:
        Ordered list of messages
    """
    # TODO: Implement message ordering
    # 1. Sort by timestamp
    # 2. Handle concurrent messages (same timestamp)
    # 3. Ensure causality (replies after original messages)
    return []`,
        testCases: [
          {
            id: 'message_ordering_basic',
            name: 'Basic message ordering',
            input: { messages: [{ id: 'msg_2', ts: 200 }, { id: 'msg_1', ts: 100 }] },
            expectedOutput: { success: true, ordered: ['msg_1', 'msg_2'] },
          },
        ],
        referenceSolution: '',
        solutionExplanation: 'Sort messages by timestamp, use message ID as tiebreaker for concurrent messages.',
      });
      break;

    case 'ecommerce':
      // Inventory allocation challenge
      challenges.push({
        id: `${problemId}_inventory_allocation`,
        title: 'Implement Inventory Allocation',
        description: 'Allocate inventory across multiple warehouses',
        difficulty: 'hard',
        functionSignature: 'def allocate_inventory(order, warehouses, context)',
        starterCode: `def allocate_inventory(order, warehouses, context):
    """
    Allocate inventory from warehouses to fulfill an order.

    Args:
        order: Order with items and quantities
        warehouses: Available warehouses with inventory
        context: System context

    Returns:
        Allocation plan (which warehouse fulfills which items)
    """
    # TODO: Implement inventory allocation
    # 1. Check inventory availability across warehouses
    # 2. Optimize for shipping cost/time
    # 3. Handle partial fulfillment
    return {}`,
        testCases: [
          {
            id: 'inventory_basic',
            name: 'Basic inventory allocation',
            input: {
              order: { items: [{ sku: 'item_1', qty: 5 }] },
              warehouses: [{ id: 'wh_1', inventory: { item_1: 10 } }]
            },
            expectedOutput: { success: true, allocation: 'VALID_PLAN' },
          },
        ],
        referenceSolution: '',
        solutionExplanation: 'Use greedy algorithm to allocate from nearest warehouse with sufficient inventory.',
      });
      break;

    case 'streaming':
      // Bitrate selection challenge
      challenges.push({
        id: `${problemId}_bitrate_selection`,
        title: 'Implement Adaptive Bitrate Selection',
        description: 'Select optimal video bitrate based on network conditions',
        difficulty: 'medium',
        functionSignature: 'def select_bitrate(bandwidth, buffer_level, context)',
        starterCode: `def select_bitrate(bandwidth, buffer_level, context):
    """
    Select optimal video bitrate for current network conditions.

    Args:
        bandwidth: Available bandwidth (Mbps)
        buffer_level: Current buffer level (seconds)
        context: System context

    Returns:
        Selected bitrate (Mbps)
    """
    # TODO: Implement bitrate selection
    # 1. Consider available bandwidth
    # 2. Account for buffer level (increase quality if buffer is high)
    # 3. Avoid frequent quality changes
    return 0`,
        testCases: [
          {
            id: 'bitrate_basic',
            name: 'Basic bitrate selection',
            input: { bandwidth: 10, buffer_level: 30 },
            expectedOutput: { success: true, bitrate: 'VALID_BITRATE' },
          },
        ],
        referenceSolution: '',
        solutionExplanation: 'Select bitrate = 0.8 * bandwidth if buffer > 10s, else 0.6 * bandwidth for safety.',
      });
      break;
  }

  return challenges;
}

/**
 * Main function: Generate code challenges from problem definition
 */
export function generateCodeChallengesFromFRs(problemDef: ProblemDefinition): CodeChallenge[] {
  const challenges: CodeChallenge[] = [];

  // Extract functions from Python template
  const functions = extractFunctionSignatures(problemDef.pythonTemplate || '');

  if (functions.length === 0) {
    // No functions found, return empty array
    return challenges;
  }

  // Determine challenge category
  const category = categorizeChallenge(problemDef);

  // Generate challenges for core FR functions (limit to top 3 most important)
  const coreFunctions = functions.slice(0, 3);

  for (const func of coreFunctions) {
    const testCases = generateTestCasesForFunction(func.name, func.params, category);

    challenges.push({
      id: `${problemDef.id}_${func.name}`,
      title: `Implement ${func.name}()`,
      description: `Implement the ${func.name}() function according to the requirements.`,
      difficulty: 'easy',
      componentType: 'app_server',
      functionSignature: func.fullSignature,
      starterCode: `${func.fullSignature}
    """
    Implement this function according to the functional requirements.

    Args:
        ${func.params.map(p => `${p}: Parameter description`).join('\n        ')}
        context: System context (db, cache, queue, etc.)

    Returns:
        Result of the operation
    """
    # TODO: Implement ${func.name}
    pass`,
      testCases,
      referenceSolution: '',
      solutionExplanation: `Reference implementation for ${func.name} function.`,
    });
  }

  // Add category-specific algorithm challenges
  const algorithmChallenges = generateAlgorithmChallenges(category, problemDef.id, functions);
  challenges.push(...algorithmChallenges);

  // Limit to 5 challenges maximum
  return challenges.slice(0, 5);
}
