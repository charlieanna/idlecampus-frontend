import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';

/**
 * Reddit - Discussion Forum Platform
 * Level 1 ONLY: Brute force connectivity test
 */
export const redditProblemDefinition: ProblemDefinition = {
  id: 'reddit',
  title: 'Reddit - Discussion Forum',
  description: `Design a discussion forum like Reddit that:
- Users can create posts in different subreddits
- Users can comment on posts (nested comments)
- Users can upvote and downvote posts and comments
- Posts are ranked by votes and recency`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need to process requests (post, comment, vote)',
      },
      {
        type: 'storage',
        reason: 'Need to store posts, comments, votes, users',
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
        reason: 'App server needs to read/write content',
      },
    ],
    dataModel: {
      entities: ['user', 'subreddit', 'post', 'comment', 'vote'],
      fields: {
        user: ['id', 'username', 'karma', 'created_at'],
        subreddit: ['id', 'name', 'description', 'created_at'],
        post: ['id', 'subreddit_id', 'user_id', 'title', 'content', 'score', 'created_at'],
        comment: ['id', 'post_id', 'parent_comment_id', 'user_id', 'text', 'score', 'created_at'],
        vote: ['id', 'target_id', 'target_type', 'user_id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'write', frequency: 'high' },        // Creating posts/comments
        { type: 'read_by_query', frequency: 'very_high' }, // Viewing subreddit feed
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
