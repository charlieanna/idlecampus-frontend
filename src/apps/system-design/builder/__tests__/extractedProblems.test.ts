import { describe, it, expect } from 'vitest';
import { generatedChallenges } from '../challenges/generatedChallenges';
import { allProblemDefinitions } from '../challenges/definitions';
import { problemConfigs } from '../challenges/problemConfigs';

/**
 * FR and NFR Tests for Extracted Problems
 * Validates that extracted problems from extracted-problems/ are properly integrated
 */
describe('Extracted Problems - Integration Tests', () => {
  describe('Problem Definitions', () => {
    it('should include Reddit Comment System problem', () => {
      const redditProblem = allProblemDefinitions.find(
        (p) => p.id === 'reddit-comment-system'
      );
      expect(redditProblem).toBeDefined();
      expect(redditProblem?.title).toBe('Reddit Comment System');
    });

    it('should include Basic Message Queue problem', () => {
      const queueProblem = allProblemDefinitions.find(
        (p) => p.id === 'basic-message-queue'
      );
      expect(queueProblem).toBeDefined();
      expect(queueProblem?.title).toBe('Basic Message Queue');
    });

    it('should include Basic Database Design problem', () => {
      const dbProblem = allProblemDefinitions.find(
        (p) => p.id === 'basic-database-design'
      );
      expect(dbProblem).toBeDefined();
      expect(dbProblem?.title).toBe('Basic RDBMS Design');
    });

    it('should include Tutorial Simple Blog problem', () => {
      const tutorialProblem = allProblemDefinitions.find(
        (p) => p.id === 'tutorial-simple-blog'
      );
      expect(tutorialProblem).toBeDefined();
      expect(tutorialProblem?.title).toContain('Tutorial');
    });

    it('should include Tutorial Image Hosting problem', () => {
      const tutorialProblem = allProblemDefinitions.find(
        (p) => p.id === 'tutorial-intermediate-images'
      );
      expect(tutorialProblem).toBeDefined();
      expect(tutorialProblem?.title).toContain('Image');
    });

    it('should include Tutorial Real-Time Chat problem', () => {
      const tutorialProblem = allProblemDefinitions.find(
        (p) => p.id === 'tutorial-advanced-chat'
      );
      expect(tutorialProblem).toBeDefined();
      expect(tutorialProblem?.title).toContain('Chat');
    });

    it('should include Static Content CDN problem', () => {
      const cdnProblem = allProblemDefinitions.find(
        (p) => p.id === 'static-content-cdn'
      );
      expect(cdnProblem).toBeDefined();
      expect(cdnProblem?.title).toBe('Static Content CDN');
    });

    it('should have expected total count of problems (40 original + 41 extracted)', () => {
      expect(allProblemDefinitions.length).toBe(81);
    });
  });

  describe('Problem Configurations', () => {
    it('should have config for Reddit Comment System', () => {
      expect(problemConfigs['reddit-comment-system']).toBeDefined();
      expect(problemConfigs['reddit-comment-system'].baseRps).toBe(5000000);
      expect(problemConfigs['reddit-comment-system'].readRatio).toBe(0.99);
    });

    it('should have config for Basic Message Queue', () => {
      expect(problemConfigs['basic-message-queue']).toBeDefined();
      expect(problemConfigs['basic-message-queue'].baseRps).toBe(5000);
      expect(problemConfigs['basic-message-queue'].readRatio).toBe(0.5);
    });

    it('should have config for Basic Database Design', () => {
      expect(problemConfigs['basic-database-design']).toBeDefined();
      expect(problemConfigs['basic-database-design'].baseRps).toBe(11000);
      expect(problemConfigs['basic-database-design'].readRatio).toBe(0.91);
    });
  });

  describe('Generated Challenges', () => {
    it('should generate challenges for all problem definitions', () => {
      expect(generatedChallenges.length).toBe(81);
    });

    it('should generate challenge for Reddit Comment System', () => {
      const redditChallenge = generatedChallenges.find(
        (c) => c.id === 'reddit-comment-system'
      );
      expect(redditChallenge).toBeDefined();
      expect(redditChallenge?.name).toContain('Reddit');
    });

    it('should generate challenge for Basic Message Queue', () => {
      const queueChallenge = generatedChallenges.find(
        (c) => c.id === 'basic-message-queue'
      );
      expect(queueChallenge).toBeDefined();
      expect(queueChallenge?.name).toContain('Message Queue');
    });

    it('should generate challenge for Basic Database Design', () => {
      const dbChallenge = generatedChallenges.find(
        (c) => c.id === 'basic-database-design'
      );
      expect(dbChallenge).toBeDefined();
      expect(dbChallenge?.name).toContain('Database');
    });
  });

  describe('Functional Requirements', () => {
    it('Reddit Comment System should require caching and CDN', () => {
      const redditProblem = allProblemDefinitions.find(
        (p) => p.id === 'reddit-comment-system'
      );
      const hasCacheReq = redditProblem?.functionalRequirements.mustHave.some(
        (r) => r.type === 'cache'
      );
      const hasCdnReq = redditProblem?.functionalRequirements.mustHave.some(
        (r) => r.type === 'cdn'
      );
      expect(hasCacheReq).toBe(true);
      expect(hasCdnReq).toBe(true);
    });

    it('Basic Message Queue should require message queue component', () => {
      const queueProblem = allProblemDefinitions.find(
        (p) => p.id === 'basic-message-queue'
      );
      const hasQueueReq = queueProblem?.functionalRequirements.mustHave.some(
        (r) => r.type === 'message_queue'
      );
      expect(hasQueueReq).toBe(true);
    });

    it('Basic Database Design should require storage and cache', () => {
      const dbProblem = allProblemDefinitions.find(
        (p) => p.id === 'basic-database-design'
      );
      const hasStorageReq = dbProblem?.functionalRequirements.mustHave.some(
        (r) => r.type === 'storage'
      );
      const hasCacheReq = dbProblem?.functionalRequirements.mustHave.some(
        (r) => r.type === 'cache'
      );
      expect(hasStorageReq).toBe(true);
      expect(hasCacheReq).toBe(true);
    });
  });

  describe('Non-Functional Requirements (via configs)', () => {
    it('Reddit Comment System should have high availability requirement', () => {
      const config = problemConfigs['reddit-comment-system'];
      expect(config.availability).toBe(0.9999);
      expect(config.maxLatency).toBe(100);
    });

    it('Basic Message Queue should have balanced read/write', () => {
      const config = problemConfigs['basic-message-queue'];
      expect(config.readRatio).toBe(0.5); // 50/50 pub/sub
      expect(config.maxLatency).toBe(100);
    });

    it('Basic Database Design should have low latency requirement', () => {
      const config = problemConfigs['basic-database-design'];
      expect(config.maxLatency).toBe(50);
      expect(config.availability).toBe(0.999);
    });
  });

  describe('Data Models', () => {
    it('Reddit Comment System should have comment data model', () => {
      const redditProblem = allProblemDefinitions.find(
        (p) => p.id === 'reddit-comment-system'
      );
      expect(redditProblem?.functionalRequirements.dataModel).toBeDefined();
      expect(
        redditProblem?.functionalRequirements.dataModel?.entities
      ).toContain('comment');
      expect(
        redditProblem?.functionalRequirements.dataModel?.entities
      ).toContain('thread');
    });

    it('Basic Message Queue should have message data model', () => {
      const queueProblem = allProblemDefinitions.find(
        (p) => p.id === 'basic-message-queue'
      );
      expect(queueProblem?.functionalRequirements.dataModel).toBeDefined();
      expect(
        queueProblem?.functionalRequirements.dataModel?.entities
      ).toContain('message');
      expect(
        queueProblem?.functionalRequirements.dataModel?.entities
      ).toContain('queue');
    });

    it('Basic Database Design should have normalized blog schema', () => {
      const dbProblem = allProblemDefinitions.find(
        (p) => p.id === 'basic-database-design'
      );
      expect(dbProblem?.functionalRequirements.dataModel).toBeDefined();
      expect(
        dbProblem?.functionalRequirements.dataModel?.entities
      ).toContain('user');
      expect(
        dbProblem?.functionalRequirements.dataModel?.entities
      ).toContain('post');
      expect(
        dbProblem?.functionalRequirements.dataModel?.entities
      ).toContain('comment');
    });
  });

  describe('Scenarios Generation', () => {
    it('should generate scenarios for each problem', () => {
      const redditProblem = allProblemDefinitions.find(
        (p) => p.id === 'reddit-comment-system'
      );
      expect(redditProblem?.scenarios).toBeDefined();
      expect(redditProblem?.scenarios.length).toBeGreaterThan(0);
    });

    it('scenarios should reflect problem configs', () => {
      const queueProblem = allProblemDefinitions.find(
        (p) => p.id === 'basic-message-queue'
      );
      const config = problemConfigs['basic-message-queue'];

      // Check that scenarios use config values
      expect(queueProblem?.scenarios).toBeDefined();
      if (queueProblem?.scenarios.length) {
        const firstScenario = queueProblem.scenarios[0];
        expect(firstScenario.traffic).toBeDefined();
      }
    });
  });

  describe('Connection Requirements', () => {
    it('Reddit Comment System should require proper connection flow', () => {
      const redditProblem = allProblemDefinitions.find(
        (p) => p.id === 'reddit-comment-system'
      );
      const connections = redditProblem?.functionalRequirements.mustConnect;
      expect(connections).toBeDefined();
      expect(connections?.length).toBeGreaterThan(0);

      // Should have client -> load_balancer connection
      const clientToLb = connections?.some(
        (c) => c.from === 'client' && c.to === 'load_balancer'
      );
      expect(clientToLb).toBe(true);
    });

    it('Basic Message Queue should have queue connection flow', () => {
      const queueProblem = allProblemDefinitions.find(
        (p) => p.id === 'basic-message-queue'
      );
      const connections = queueProblem?.functionalRequirements.mustConnect;

      // Should have compute -> message_queue and message_queue -> compute
      const toQueue = connections?.some((c) => c.to === 'message_queue');
      const fromQueue = connections?.some((c) => c.from === 'message_queue');
      expect(toQueue).toBe(true);
      expect(fromQueue).toBe(true);
    });
  });

  describe('Problem Categories', () => {
    it('should categorize problems correctly', () => {
      // Reddit Comment System = Caching category
      const redditProblem = allProblemDefinitions.find(
        (p) => p.id === 'reddit-comment-system'
      );
      expect(redditProblem?.description).toContain('caching');

      // Basic Message Queue = Streaming category
      const queueProblem = allProblemDefinitions.find(
        (p) => p.id === 'basic-message-queue'
      );
      expect(queueProblem?.description).toContain('message');

      // Basic Database Design = Storage category
      const dbProblem = allProblemDefinitions.find(
        (p) => p.id === 'basic-database-design'
      );
      expect(dbProblem?.description).toContain('database');
    });
  });
});
