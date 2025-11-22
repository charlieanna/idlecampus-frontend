/**
 * Scenario-Based Question Evaluator
 *
 * Evaluates free-form text responses to scenario questions by checking for:
 * - Key concepts and terminology
 * - Trade-off discussions
 * - Anti-patterns (what NOT to do)
 * - Depth of understanding
 */

import {
  ScenarioQuestion,
  ScenarioResponse,
  ResponseEvaluation,
  KeyPoint,
  Tradeoff,
} from '../types/spacedRepetition';

// ============================================================================
// Main Evaluation Function
// ============================================================================

/**
 * Evaluate a user's response to a scenario question
 */
export function evaluateScenarioResponse(
  question: ScenarioQuestion,
  userAnswer: string,
  confidence: 1 | 2 | 3 | 4 | 5,
  hintsUsed: number
): ResponseEvaluation {
  const normalizedAnswer = normalizeText(userAnswer);

  // 1. Check for key points (required concepts)
  const keyPointsFound = evaluateKeyPoints(
    normalizedAnswer,
    question.expectedAnswer.keyPoints
  );

  // 2. Check for trade-off discussions
  const tradeoffsDiscussed = evaluateTradeoffs(
    normalizedAnswer,
    question.expectedAnswer.tradeoffs || []
  );

  // 3. Check for anti-patterns (things they should NOT mention)
  const antipatternsMentioned = evaluateAntipatterns(
    normalizedAnswer,
    question.expectedAnswer.antipatterns || []
  );

  // 4. Check for optional bonus points
  const optionalPointsFound = evaluateOptionalPoints(
    normalizedAnswer,
    question.expectedAnswer.optionalPoints || []
  );

  // 5. Calculate quality metrics
  const completeness = calculateCompleteness(keyPointsFound, tradeoffsDiscussed);
  const accuracy = calculateAccuracy(keyPointsFound, antipatternsMentioned);
  const depth = calculateDepth(
    normalizedAnswer,
    tradeoffsDiscussed,
    optionalPointsFound
  );

  // 6. Calculate overall score
  let score = 0;

  // Key points: 60% of score
  const requiredKeyPoints = keyPointsFound.filter(kp =>
    question.expectedAnswer.keyPoints.find(k => k.concept === kp.concept)?.mustMention
  );
  const requiredFound = requiredKeyPoints.filter(kp => kp.found).length;
  const requiredTotal = requiredKeyPoints.length;
  score += (requiredFound / Math.max(requiredTotal, 1)) * 60;

  // Tradeoffs: 20% of score
  if (question.expectedAnswer.tradeoffs && question.expectedAnswer.tradeoffs.length > 0) {
    score += (tradeoffsDiscussed.length / question.expectedAnswer.tradeoffs.length) * 20;
  } else {
    score += 20; // Full points if no tradeoffs required
  }

  // Depth and optional points: 20% of score
  score += depth * 0.2;

  // Penalties
  score -= antipatternsMentioned.length * 10; // -10 points per anti-pattern
  score -= hintsUsed * 5; // -5 points per hint used

  // Clamp score to 0-100
  score = Math.max(0, Math.min(100, Math.round(score)));

  // 7. Generate feedback
  const { strengths, improvements, nextSteps } = generateFeedback(
    keyPointsFound,
    tradeoffsDiscussed,
    antipatternsMentioned,
    optionalPointsFound,
    question
  );

  return {
    score,
    passed: score >= 70,
    keyPointsFound,
    tradeoffsDiscussed,
    antipatternsMentioned,
    optionalPointsFound,
    completeness,
    accuracy,
    depth,
    strengths,
    improvements,
    nextSteps,
  };
}

// ============================================================================
// Key Point Evaluation
// ============================================================================

function evaluateKeyPoints(
  answer: string,
  keyPoints: KeyPoint[]
): ResponseEvaluation['keyPointsFound'] {
  return keyPoints.map(keyPoint => {
    const matchedKeywords = keyPoint.keywords.filter(keyword =>
      answer.includes(normalizeText(keyword))
    );

    const found = matchedKeywords.length > 0;

    return {
      concept: keyPoint.concept,
      found,
      matchedKeywords,
    };
  });
}

// ============================================================================
// Tradeoff Evaluation
// ============================================================================

function evaluateTradeoffs(answer: string, tradeoffs: Tradeoff[]): string[] {
  const discussed: string[] = [];

  for (const tradeoff of tradeoffs) {
    // Check if any of the options in this tradeoff are mentioned
    const mentioned = tradeoff.options.some(option =>
      answer.includes(normalizeText(option.name)) ||
      option.pros.some(pro => answer.includes(normalizeText(pro))) ||
      option.cons.some(con => answer.includes(normalizeText(con)))
    );

    if (mentioned) {
      discussed.push(tradeoff.aspect);
    }
  }

  return discussed;
}

// ============================================================================
// Anti-pattern Detection
// ============================================================================

function evaluateAntipatterns(answer: string, antipatterns: string[]): string[] {
  return antipatterns.filter(antipattern =>
    answer.includes(normalizeText(antipattern))
  );
}

// ============================================================================
// Optional Points Evaluation
// ============================================================================

function evaluateOptionalPoints(answer: string, optionalPoints: string[]): string[] {
  return optionalPoints.filter(point =>
    answer.includes(normalizeText(point))
  );
}

// ============================================================================
// Quality Metric Calculations
// ============================================================================

function calculateCompleteness(
  keyPointsFound: ResponseEvaluation['keyPointsFound'],
  tradeoffsDiscussed: string[]
): number {
  const keyPointScore = keyPointsFound.filter(kp => kp.found).length / Math.max(keyPointsFound.length, 1);
  const tradeoffBonus = tradeoffsDiscussed.length > 0 ? 20 : 0;

  return Math.min(100, Math.round(keyPointScore * 80 + tradeoffBonus));
}

function calculateAccuracy(
  keyPointsFound: ResponseEvaluation['keyPointsFound'],
  antipatternsMentioned: string[]
): number {
  const correctPoints = keyPointsFound.filter(kp => kp.found).length;
  const totalMentions = correctPoints + antipatternsMentioned.length;

  if (totalMentions === 0) return 0;

  return Math.round((correctPoints / totalMentions) * 100);
}

function calculateDepth(
  answer: string,
  tradeoffsDiscussed: string[],
  optionalPointsFound: string[]
): number {
  let depth = 0;

  // Word count indicates detail level
  const wordCount = answer.split(/\s+/).length;
  if (wordCount > 100) depth += 30;
  else if (wordCount > 50) depth += 20;
  else if (wordCount > 25) depth += 10;

  // Trade-off discussion indicates deeper thinking
  depth += tradeoffsDiscussed.length * 15;

  // Optional points show extra knowledge
  depth += optionalPointsFound.length * 10;

  // Check for reasoning words (because, therefore, however, although, etc.)
  const reasoningWords = ['because', 'therefore', 'however', 'although', 'while', 'whereas', 'since'];
  const reasoningCount = reasoningWords.filter(word => answer.includes(word)).length;
  depth += reasoningCount * 5;

  return Math.min(100, depth);
}

// ============================================================================
// Feedback Generation
// ============================================================================

function generateFeedback(
  keyPointsFound: ResponseEvaluation['keyPointsFound'],
  tradeoffsDiscussed: string[],
  antipatternsMentioned: string[],
  optionalPointsFound: string[],
  question: ScenarioQuestion
): {
  strengths: string[];
  improvements: string[];
  nextSteps?: string[];
} {
  const strengths: string[] = [];
  const improvements: string[] = [];
  const nextSteps: string[] = [];

  // Strengths
  const correctKeyPoints = keyPointsFound.filter(kp => kp.found);
  if (correctKeyPoints.length > 0) {
    strengths.push(
      `Identified key concepts: ${correctKeyPoints.map(kp => kp.concept).join(', ')}`
    );
  }

  if (tradeoffsDiscussed.length > 0) {
    strengths.push(`Discussed important trade-offs: ${tradeoffsDiscussed.join(', ')}`);
  }

  if (optionalPointsFound.length > 0) {
    strengths.push(`Demonstrated deeper knowledge: ${optionalPointsFound.join(', ')}`);
  }

  // Improvements
  const missedKeyPoints = keyPointsFound.filter(kp => !kp.found);
  if (missedKeyPoints.length > 0) {
    improvements.push(
      `Consider these aspects: ${missedKeyPoints.map(kp => kp.concept).join(', ')}`
    );
  }

  const missedTradeoffs = (question.expectedAnswer.tradeoffs || [])
    .filter(t => !tradeoffsDiscussed.includes(t.aspect))
    .map(t => t.aspect);
  if (missedTradeoffs.length > 0) {
    improvements.push(`Explore these trade-offs: ${missedTradeoffs.join(', ')}`);
  }

  if (antipatternsMentioned.length > 0) {
    improvements.push(
      `Avoid these approaches: ${antipatternsMentioned.join(', ')} (see explanation for why)`
    );
  }

  // Next steps
  if (missedKeyPoints.length > 0) {
    nextSteps.push('Review the explanation to understand the missing concepts');
  }

  if (question.relatedResources && question.relatedResources.length > 0) {
    nextSteps.push('Check out the related resources for deeper understanding');
  }

  return { strengths, improvements, nextSteps };
}

// ============================================================================
// Text Normalization
// ============================================================================

/**
 * Normalize text for comparison
 * - Convert to lowercase
 * - Remove extra whitespace
 * - Remove punctuation
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ') // Replace punctuation with spaces
    .replace(/\s+/g, ' ')      // Collapse multiple spaces
    .trim();
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Check if answer contains a phrase (with some flexibility)
 */
export function containsPhrase(answer: string, phrase: string): boolean {
  const normalizedAnswer = normalizeText(answer);
  const normalizedPhrase = normalizeText(phrase);

  // Exact match
  if (normalizedAnswer.includes(normalizedPhrase)) return true;

  // Check for individual important words (>3 chars) from the phrase
  const words = normalizedPhrase.split(' ').filter(w => w.length > 3);
  const matchedWords = words.filter(word => normalizedAnswer.includes(word));

  // If most of the important words are present, consider it a match
  return matchedWords.length >= Math.ceil(words.length * 0.7);
}

/**
 * Extract key technical terms from answer
 */
export function extractTechnicalTerms(answer: string): string[] {
  const terms: string[] = [];

  // Common system design terms
  const knownTerms = [
    'cache', 'redis', 'memcached',
    'queue', 'kafka', 'rabbitmq', 'sqs',
    'database', 'sql', 'nosql', 'mongodb', 'postgres',
    'cdn', 'load balancer', 'nginx',
    'consistency', 'availability', 'partition',
    'latency', 'throughput', 'scalability',
    'sharding', 'replication', 'partitioning',
    'eventual consistency', 'strong consistency',
    'write-through', 'write-back', 'write-around',
    'read-through', 'cache-aside',
  ];

  const normalized = normalizeText(answer);
  for (const term of knownTerms) {
    if (normalized.includes(normalizeText(term))) {
      terms.push(term);
    }
  }

  return [...new Set(terms)]; // Remove duplicates
}

/**
 * Assess answer quality based on structure and content
 */
export function assessAnswerQuality(answer: string): {
  hasStructure: boolean;
  hasExamples: boolean;
  hasReasoning: boolean;
  wordCount: number;
} {
  const normalized = normalizeText(answer);
  const wordCount = answer.split(/\s+/).length;

  // Check for structure (bullet points, numbering, paragraphs)
  const hasStructure = /[-*•]/.test(answer) || /\d+\./.test(answer) || answer.includes('\n\n');

  // Check for examples
  const exampleWords = ['example', 'for instance', 'such as', 'like'];
  const hasExamples = exampleWords.some(word => normalized.includes(word));

  // Check for reasoning
  const reasoningWords = ['because', 'therefore', 'since', 'thus', 'hence', 'consequently'];
  const hasReasoning = reasoningWords.some(word => normalized.includes(word));

  return {
    hasStructure,
    hasExamples,
    hasReasoning,
    wordCount,
  };
}
