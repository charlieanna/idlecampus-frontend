import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';

/**
 * LinkedIn - Professional Networking Platform
 * Level 1 ONLY: Brute force connectivity test
 */
export const linkedinProblemDefinition: ProblemDefinition = {
  id: 'linkedin',
  title: 'LinkedIn - Professional Network',
  description: `Design a professional networking platform like LinkedIn that:
- Users can create profiles with work experience
- Users can connect with other professionals
- Users can post updates and articles
- Users can search for jobs and people`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need to process requests (profile updates, connections)',
      },
      {
        type: 'storage',
        reason: 'Need to store user profiles, connections, posts',
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
        reason: 'App server needs to read/write profile data',
      },
    ],
    dataModel: {
      entities: ['user', 'profile', 'connection', 'post', 'job'],
      fields: {
        user: ['id', 'email', 'password_hash', 'created_at'],
        profile: ['user_id', 'name', 'headline', 'summary', 'photo_url'],
        connection: ['user_id_1', 'user_id_2', 'status', 'created_at'],
        post: ['id', 'user_id', 'content', 'created_at'],
        job: ['id', 'company_id', 'title', 'description', 'location', 'created_at'],
      },
      accessPatterns: [
        { type: 'write', frequency: 'low' },        // Updating profiles
        { type: 'read_by_key', frequency: 'high' }, // Viewing profiles
        { type: 'read_by_query', frequency: 'medium' }, // Job search
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
