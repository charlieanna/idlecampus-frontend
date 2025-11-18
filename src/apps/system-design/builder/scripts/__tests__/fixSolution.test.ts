/**
 * Tests for universal solution fixing script
 */

import {
  fixSolution,
  validateFixedSolution,
  generateFixReport,
  ChallengeContext,
} from '../fixSolution';
import { Solution } from '../../types/testCase';

describe('fixSolution', () => {
  describe('Database component fixing', () => {
    it('should remove deprecated readCapacity and writeCapacity', () => {
      const oldSolution: Solution = {
        components: [
          {
            type: 'database',
            config: {
              readCapacity: 500,
              writeCapacity: 100,
            },
          },
        ],
        connections: [],
        explanation: '',
      };

      const fixed = fixSolution(oldSolution);

      expect(fixed.components[0].config.readCapacity).toBeUndefined();
      expect(fixed.components[0].config.writeCapacity).toBeUndefined();
    });

    it('should add instanceType', () => {
      const oldSolution: Solution = {
        components: [
          {
            type: 'database',
            config: {},
          },
        ],
        connections: [],
        explanation: '',
      };

      const fixed = fixSolution(oldSolution);

      expect(fixed.components[0].config.instanceType).toBe('commodity-db');
    });

    it('should convert boolean replication to object', () => {
      const oldSolution: Solution = {
        components: [
          {
            type: 'database',
            config: {
              replication: true,
            },
          },
        ],
        connections: [],
        explanation: '',
      };

      const fixed = fixSolution(oldSolution);

      expect(fixed.components[0].config.replication).toEqual({
        enabled: true,
        replicas: 1,
        mode: 'async',
      });
    });

    it('should add replicationMode', () => {
      const oldSolution: Solution = {
        components: [
          {
            type: 'database',
            config: {},
          },
        ],
        connections: [],
        explanation: '',
      };

      const fixed = fixSolution(oldSolution);

      expect(fixed.components[0].config.replicationMode).toBe('single-leader');
    });

    it('should add sharding configuration', () => {
      const oldSolution: Solution = {
        components: [
          {
            type: 'database',
            config: {},
          },
        ],
        connections: [],
        explanation: '',
      };

      const context: ChallengeContext = {
        id: 'tinyurl',
      };

      const fixed = fixSolution(oldSolution, context);

      expect(fixed.components[0].config.sharding).toEqual({
        enabled: false,
        shards: 1,
        shardKey: 'short_code',
      });
    });

    it('should infer correct shard key for different challenges', () => {
      const oldSolution: Solution = {
        components: [{ type: 'database', config: {} }],
        connections: [],
        explanation: '',
      };

      // TinyURL
      let fixed = fixSolution(oldSolution, { id: 'tinyurl' });
      expect(fixed.components[0].config.sharding.shardKey).toBe('short_code');

      // Instagram
      fixed = fixSolution(oldSolution, { id: 'instagram' });
      expect(fixed.components[0].config.sharding.shardKey).toBe('user_id');

      // Uber
      fixed = fixSolution(oldSolution, { id: 'uber' });
      expect(fixed.components[0].config.sharding.shardKey).toBe('order_id');

      // Netflix
      fixed = fixSolution(oldSolution, { id: 'netflix' });
      expect(fixed.components[0].config.sharding.shardKey).toBe('video_id');
    });
  });

  describe('App Server component fixing', () => {
    it('should add lbStrategy if missing', () => {
      const oldSolution: Solution = {
        components: [
          {
            type: 'app_server',
            config: {
              instances: 3,
            },
          },
        ],
        connections: [],
        explanation: '',
      };

      const fixed = fixSolution(oldSolution);

      expect(fixed.components[0].config.lbStrategy).toBe('round-robin');
    });

    it('should preserve existing lbStrategy', () => {
      const oldSolution: Solution = {
        components: [
          {
            type: 'app_server',
            config: {
              instances: 3,
              lbStrategy: 'least-connections',
            },
          },
        ],
        connections: [],
        explanation: '',
      };

      const fixed = fixSolution(oldSolution);

      expect(fixed.components[0].config.lbStrategy).toBe('least-connections');
    });
  });

  describe('CDN component fixing', () => {
    it('should remove cacheHitRatio and bandwidthGbps', () => {
      const oldSolution: Solution = {
        components: [
          {
            type: 'cdn',
            config: {
              enabled: true,
              cacheHitRatio: 0.95,
              bandwidthGbps: 100,
            },
          },
        ],
        connections: [],
        explanation: '',
      };

      const fixed = fixSolution(oldSolution);

      expect(fixed.components[0].config.cacheHitRatio).toBeUndefined();
      expect(fixed.components[0].config.bandwidthGbps).toBeUndefined();
      expect(fixed.components[0].config.enabled).toBe(true);
    });
  });

  describe('Cache component fixing', () => {
    it('should add default configuration if missing', () => {
      const oldSolution: Solution = {
        components: [
          {
            type: 'cache',
            config: {},
          },
        ],
        connections: [],
        explanation: '',
      };

      const fixed = fixSolution(oldSolution);

      expect(fixed.components[0].config.memorySizeGB).toBe(4);
      expect(fixed.components[0].config.hitRatio).toBe(0.9);
      expect(fixed.components[0].config.strategy).toBe('cache_aside');
    });

    it('should preserve existing cache configuration', () => {
      const oldSolution: Solution = {
        components: [
          {
            type: 'cache',
            config: {
              memorySizeGB: 8,
              hitRatio: 0.95,
              strategy: 'write_through',
            },
          },
        ],
        connections: [],
        explanation: '',
      };

      const fixed = fixSolution(oldSolution);

      expect(fixed.components[0].config.memorySizeGB).toBe(8);
      expect(fixed.components[0].config.hitRatio).toBe(0.95);
      expect(fixed.components[0].config.strategy).toBe('write_through');
    });
  });

  describe('validateFixedSolution', () => {
    it('should pass validation for correctly fixed solution', () => {
      const solution: Solution = {
        components: [
          {
            type: 'database',
            config: {
              instanceType: 'commodity-db',
              replicationMode: 'single-leader',
              replication: {
                enabled: true,
                replicas: 1,
                mode: 'async',
              },
              sharding: {
                enabled: false,
                shards: 1,
                shardKey: 'short_code',
              },
            },
          },
        ],
        connections: [],
        explanation: '',
      };

      const validation = validateFixedSolution(solution);

      expect(validation.valid).toBe(true);
      expect(validation.errors).toEqual([]);
    });

    it('should fail validation for deprecated fields', () => {
      const solution: Solution = {
        components: [
          {
            type: 'database',
            config: {
              readCapacity: 500, // Deprecated
              writeCapacity: 100, // Deprecated
            },
          },
        ],
        connections: [],
        explanation: '',
      };

      const validation = validateFixedSolution(solution);

      expect(validation.valid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
    });

    it('should fail validation for missing required fields', () => {
      const solution: Solution = {
        components: [
          {
            type: 'database',
            config: {},
          },
        ],
        connections: [],
        explanation: '',
      };

      const validation = validateFixedSolution(solution);

      expect(validation.valid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
    });
  });

  describe('generateFixReport', () => {
    it('should generate report for changed solution', () => {
      const original: Solution = {
        components: [
          {
            type: 'database',
            config: {
              readCapacity: 500,
              writeCapacity: 100,
              replication: true,
            },
          },
        ],
        connections: [],
        explanation: '',
      };

      const fixed = fixSolution(original);
      const report = generateFixReport(original, fixed);

      expect(report).toContain('readCapacity');
      expect(report).toContain('writeCapacity');
      expect(report).toContain('replication');
    });

    it('should report no changes for already correct solution', () => {
      const solution: Solution = {
        components: [
          {
            type: 'database',
            config: {
              instanceType: 'commodity-db',
              replicationMode: 'single-leader',
              replication: {
                enabled: true,
                replicas: 1,
                mode: 'async',
              },
              sharding: {
                enabled: false,
                shards: 1,
                shardKey: 'short_code',
              },
            },
          },
        ],
        connections: [],
        explanation: '',
      };

      const fixed = fixSolution(solution);
      const report = generateFixReport(solution, fixed);

      expect(report).toBe(
        'No changes needed - solution already in correct format.'
      );
    });
  });

  describe('Complex solution fixing', () => {
    it('should fix complete TinyURL solution', () => {
      const oldSolution: Solution = {
        components: [
          { type: 'client', config: {} },
          { type: 'load_balancer', config: {} },
          {
            type: 'app_server',
            config: {
              instances: 6,
            },
          },
          {
            type: 'cache',
            config: {},
          },
          {
            type: 'database',
            config: {
              readCapacity: 12000,
              writeCapacity: 1200,
              replication: true,
            },
          },
        ],
        connections: [
          { from: 'client', to: 'load_balancer' },
          { from: 'load_balancer', to: 'app_server' },
          { from: 'app_server', to: 'cache' },
          { from: 'app_server', to: 'database' },
        ],
        explanation: 'TinyURL solution',
      };

      const context: ChallengeContext = {
        id: 'tinyurl',
      };

      const fixed = fixSolution(oldSolution, context);

      // Validate database component
      const db = fixed.components.find((c) => c.type === 'database');
      expect(db).toBeDefined();
      expect(db!.config.readCapacity).toBeUndefined();
      expect(db!.config.writeCapacity).toBeUndefined();
      expect(db!.config.instanceType).toBe('commodity-db');
      expect(db!.config.replicationMode).toBe('single-leader');
      expect(db!.config.replication).toEqual({
        enabled: true,
        replicas: 1,
        mode: 'async',
      });
      expect(db!.config.sharding.shardKey).toBe('short_code');

      // Validate app server component
      const app = fixed.components.find((c) => c.type === 'app_server');
      expect(app).toBeDefined();
      expect(app!.config.lbStrategy).toBe('round-robin');

      // Validate cache component
      const cache = fixed.components.find((c) => c.type === 'cache');
      expect(cache).toBeDefined();
      expect(cache!.config.memorySizeGB).toBe(4);
      expect(cache!.config.hitRatio).toBe(0.9);
      expect(cache!.config.strategy).toBe('cache_aside');

      // Validate overall solution
      const validation = validateFixedSolution(fixed);
      expect(validation.valid).toBe(true);
    });
  });
});
