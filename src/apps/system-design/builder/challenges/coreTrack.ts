import type { Challenge } from '../types/testCase';

export type CoreStage = 1 | 2 | 3 | 4;

export interface CoreProblemMeta {
  id: string;    // Challenge id
  stage: CoreStage;
}

// Curated core track for interview prep
// Focuses on building systems from scratch (L1-L4), not migration problems
export const coreProblems: CoreProblemMeta[] = [
  // Stage 1 – Fundamentals
  { id: 'tinyurl', stage: 1 },  // Classic URL shortener (advanced version)

  // Stage 2 – Product Systems (Real-world apps)
  { id: 'instagram', stage: 2 },
  { id: 'twitter', stage: 2 },
  { id: 'reddit', stage: 2 },
  { id: 'linkedin', stage: 2 },
  { id: 'facebook', stage: 2 },
  { id: 'tiktok', stage: 2 },
  { id: 'whatsapp', stage: 2 },
  { id: 'slack', stage: 2 },
  { id: 'netflix', stage: 2 },
  { id: 'youtube', stage: 2 },

  // Stage 3 – Comprehensive Platforms (Multi-concept systems)
  { id: 'comprehensive-ecommerce-platform', stage: 3 },
  { id: 'comprehensive-social-media-platform', stage: 3 },
  { id: 'comprehensive-search-platform', stage: 3 },
  { id: 'comprehensive-api-gateway-platform', stage: 3 },
  { id: 'comprehensive-cloud-storage-platform', stage: 3 },
  
  // Stage 3 – Infrastructure & Services
  { id: 'amazon', stage: 3 },
  { id: 'shopify', stage: 3 },
  { id: 'stripe', stage: 3 },
  { id: 'dropbox', stage: 3 },
  { id: 'github', stage: 3 },
  { id: 'uber', stage: 3 },
  { id: 'airbnb', stage: 3 },

  // Stage 4 – Multi-Region & Advanced Patterns
  { id: 'basic-multi-region', stage: 4 },
  { id: 'active-active-regions', stage: 4 },
  { id: 'cross-region-failover', stage: 4 },
  { id: 'global-cdn', stage: 4 },
  { id: 'kafka-streaming-pipeline', stage: 4 },
];

export const coreProblemIdSet: Set<string> = new Set(coreProblems.map(p => p.id));

export function isCoreProblem(challenge: Pick<Challenge, 'id'>): boolean {
  return coreProblemIdSet.has(challenge.id);
}

export function getCoreStage(challenge: Pick<Challenge, 'id'>): CoreStage | null {
  const meta = coreProblems.find(p => p.id === challenge.id);
  return meta ? meta.stage : null;
}

