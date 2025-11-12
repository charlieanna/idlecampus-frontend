import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';

/**
 * Stack Overflow - Q&A Platform
 * Level 1 ONLY: Brute force connectivity test
 */
export const stackoverflowProblemDefinition: ProblemDefinition = {
  id: 'stackoverflow',
  title: 'Stack Overflow - Q&A Platform',
  description: `Design a Q&A platform like Stack Overflow that:
- Users can ask and answer questions
- Questions and answers can be upvoted/downvoted
- Users earn reputation points
- Questions have tags for categorization`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need to process questions, answers, votes',
      },
      {
        type: 'storage',
        reason: 'Need to store questions, answers, users, votes',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Client sends requests',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'App server needs to store Q&A data',
      },
    ],
    dataModel: {
      entities: ['user', 'question', 'answer', 'vote', 'tag'],
      fields: {
        user: ['id', 'username', 'email', 'reputation', 'created_at'],
        question: ['id', 'user_id', 'title', 'body', 'views', 'score', 'created_at'],
        answer: ['id', 'question_id', 'user_id', 'body', 'score', 'is_accepted', 'created_at'],
        vote: ['id', 'target_id', 'target_type', 'user_id', 'value', 'created_at'],
        tag: ['id', 'name', 'description', 'count', 'created_at'],
      },
      accessPatterns: [
        { type: 'write', frequency: 'high' },        // Posting questions/answers
        { type: 'read_by_key', frequency: 'very_high' }, // Viewing questions
        { type: 'read_by_query', frequency: 'very_high' }, // Searching questions
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
