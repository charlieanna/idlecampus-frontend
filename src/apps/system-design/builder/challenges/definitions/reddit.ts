import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Reddit - Discussion Forum Platform
 * Comprehensive FR and NFR scenarios
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

  scenarios: generateScenarios('reddit', problemConfigs.reddit),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};
