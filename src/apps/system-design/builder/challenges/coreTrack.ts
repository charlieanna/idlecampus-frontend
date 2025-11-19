import type { Challenge } from '../types/testCase';

export type CoreStage = 1 | 2 | 3 | 4;

export interface CoreProblemMeta {
  id: string;    // Challenge id
  stage: CoreStage;
}

// Curated core track (approx. 40 problems) for interview prep
export const coreProblems: CoreProblemMeta[] = [
  // Stage 1 – Fundamentals
  { id: 'tiny_url', stage: 1 },
  { id: 'todo_app', stage: 1 },
  { id: 'food_blog', stage: 1 },
  { id: 'basic-database-design', stage: 1 },
  { id: 'basic-message-queue', stage: 1 },
  { id: 'basic-text-search', stage: 1 },
  { id: 'basic-api-gateway', stage: 1 },
  { id: 'simple-rate-limiter', stage: 1 },
  { id: 'nosql-basics', stage: 1 },
  { id: 'realtime-notifications', stage: 1 },

  // Stage 2 – Product Systems
  { id: 'instagram', stage: 2 },
  { id: 'twitter', stage: 2 },
  { id: 'reddit', stage: 2 },
  { id: 'reddit-comment-system', stage: 2 },
  { id: 'linkedin', stage: 2 },
  { id: 'facebook', stage: 2 },
  { id: 'tiktok', stage: 2 },
  { id: 'pinterest', stage: 2 },
  { id: 'snapchat', stage: 2 },
  { id: 'discord', stage: 2 },
  { id: 'medium', stage: 2 },
  { id: 'whatsapp', stage: 2 },
  { id: 'slack', stage: 2 },
  { id: 'telegram', stage: 2 },
  { id: 'messenger', stage: 2 },

  // Stage 3 – Infra & Multiregion
  { id: 'amazon', stage: 3 },
  { id: 'shopify', stage: 3 },
  { id: 'stripe', stage: 3 },
  { id: 'dropbox', stage: 3 },
  { id: 'googledrive', stage: 3 },
  { id: 'github', stage: 3 },
  { id: 'stackoverflow', stage: 3 },
  { id: 'doordash', stage: 3 },
  { id: 'instacart', stage: 3 },
  { id: 'yelp', stage: 3 },
  { id: 'basic-multi-region', stage: 3 },

  // Stage 4 – Stretch / L6-style
  { id: 'multi-region-social-cache', stage: 4 },
  { id: 'multi-tenant-saas-cache', stage: 4 },
  { id: 'global-inventory-mastery', stage: 4 },
  { id: 'rtb-ad-cache', stage: 4 },
  { id: 'financial-trading-cache', stage: 4 },
  { id: 'sports-betting-cache', stage: 4 },
];

export const coreProblemIdSet: Set<string> = new Set(coreProblems.map(p => p.id));

export function isCoreProblem(challenge: Pick<Challenge, 'id'>): boolean {
  return coreProblemIdSet.has(challenge.id);
}

export function getCoreStage(challenge: Pick<Challenge, 'id'>): CoreStage | null {
  const meta = coreProblems.find(p => p.id === challenge.id);
  return meta ? meta.stage : null;
}

