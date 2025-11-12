import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';

/**
 * Twitter - Microblogging Platform
 * Level 1 ONLY: Brute force connectivity test
 */
export const twitterProblemDefinition: ProblemDefinition = {
  id: 'twitter',
  title: 'Twitter - Microblogging Platform',
  description: `Design a microblogging platform like Twitter that:
- Users can post short messages (tweets) up to 280 characters
- Users can follow other users and see their tweets in a timeline
- Users can like and retweet posts
- Users can search for tweets and users`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need to process API requests (post, read timeline)',
      },
      {
        type: 'storage',
        reason: 'Need to store tweets, users, follows, likes',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Client sends requests to app server',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'App server needs to read/write tweet data',
      },
    ],
    dataModel: {
      entities: ['user', 'tweet', 'follow', 'like'],
      fields: {
        user: ['id', 'username', 'email', 'created_at'],
        tweet: ['id', 'user_id', 'text', 'created_at'],
        follow: ['follower_id', 'following_id', 'created_at'],
        like: ['tweet_id', 'user_id', 'created_at'],
      },
      accessPatterns: [
        { type: 'write', frequency: 'high' },        // Posting tweets
        { type: 'read_by_query', frequency: 'very_high' }, // Reading timeline
      ],
    },
  },

  scenarios: [
    {
      name: 'Level 1: The Brute Force Test - Does It Even Work?',
      description: 'Like algorithm brute force: ignore performance, just verify connectivity. Client → App → Database path exists. No optimization needed.',
      traffic: {
        rps: 0.1,
        readWriteRatio: 0.5,
      },
      passCriteria: {
        maxLatency: 30000,
        maxErrorRate: 0.99,
      },
    },
  ],

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};
