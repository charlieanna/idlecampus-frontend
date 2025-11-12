import { useState } from 'react';
import { X } from 'lucide-react';
import { ProblemDefinition } from '../../types/problemDefinition';

interface ComponentConfigWizardProps {
  componentType: string;
  problemDefinition: ProblemDefinition;
  onComplete: (config: Record<string, any>) => void;
  onCancel: () => void;
}

/**
 * Component Configuration Wizard
 *
 * Guides users through making intentional technology decisions when adding components.
 * Instead of defaults, users must answer:
 * - WHY this component? (based on problem requirements)
 * - WHAT data model? (tables, indexes)
 * - WHICH technology? (PostgreSQL vs Cassandra)
 * - WHAT configuration? (consistency, replication, etc.)
 */
export function ComponentConfigWizard({
  componentType,
  problemDefinition,
  onComplete,
  onCancel,
}: ComponentConfigWizardProps) {
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState<Record<string, any>>({});

  const updateConfig = (key: string, value: any) => {
    setConfig({ ...config, [key]: value });
  };

  const handleNext = () => {
    if (step === getTotalSteps()) {
      onComplete(config);
    } else {
      setStep(step + 1);
    }
  };

  const getTotalSteps = () => {
    switch (componentType) {
      case 'postgresql':
        return 4; // Engine → Data Model → Performance → Reliability
      case 'redis':
        return 3; // What to cache → Eviction → Performance
      case 'message_queue':
        return 3; // Queue type → Durability → Throughput
      default:
        return 2;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Configure {getComponentName(componentType)}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Step {step} of {getTotalSteps()} • Make intentional architectural decisions
            </p>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {componentType === 'postgresql' && (
            <PostgreSQLWizard
              step={step}
              config={config}
              updateConfig={updateConfig}
              problemDefinition={problemDefinition}
            />
          )}
          {componentType === 'redis' && (
            <RedisWizard
              step={step}
              config={config}
              updateConfig={updateConfig}
              problemDefinition={problemDefinition}
            />
          )}
          {componentType === 'message_queue' && (
            <MessageQueueWizard
              step={step}
              config={config}
              updateConfig={updateConfig}
              problemDefinition={problemDefinition}
            />
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <button
            onClick={step === 1 ? onCancel : () => setStep(step - 1)}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </button>
          <div className="flex gap-2">
            {Array.from({ length: getTotalSteps() }).map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i + 1 === step
                    ? 'bg-blue-600'
                    : i + 1 < step
                    ? 'bg-blue-400'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {step === getTotalSteps() ? 'Add Component' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// PostgreSQL Configuration Wizard
// =============================================================================

function PostgreSQLWizard({
  step,
  config,
  updateConfig,
  problemDefinition,
}: {
  step: number;
  config: Record<string, any>;
  updateConfig: (key: string, value: any) => void;
  problemDefinition: ProblemDefinition;
}) {
  if (step === 1) {
    // Step 1: Choose Database Engine
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Choose Database Engine
        </h3>
        <p className="text-sm text-gray-600">
          Based on your problem requirements, which database makes sense?
        </p>

        {/* Show problem context */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm font-medium text-blue-900 mb-2">
            Problem: {problemDefinition.title}
          </p>
          {problemDefinition.functionalRequirements.dataModel && (
            <div className="text-sm text-blue-800 space-y-1">
              <p>Access Patterns:</p>
              <ul className="list-disc list-inside ml-2">
                {problemDefinition.functionalRequirements.dataModel.accessPatterns.map(
                  (pattern, i) => (
                    <li key={i}>
                      {pattern.type} ({pattern.frequency})
                    </li>
                  )
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Database options */}
        <div className="space-y-3">
          <EngineOption
            selected={config.engine === 'postgresql'}
            onClick={() => updateConfig('engine', 'postgresql')}
            title="PostgreSQL"
            description="ACID transactions, complex queries, strong consistency"
            useCases="Best for: Complex relationships, ACID required, SQL queries"
            recommended={hasComplexQueries(problemDefinition)}
          />
          <EngineOption
            selected={config.engine === 'mongodb'}
            onClick={() => updateConfig('engine', 'mongodb')}
            title="MongoDB"
            description="NoSQL, flexible schema, horizontal scaling"
            useCases="Best for: Flexible schema, document storage, fast reads"
            recommended={hasFlexibleSchema(problemDefinition)}
          />
          <EngineOption
            selected={config.engine === 'cassandra'}
            onClick={() => updateConfig('engine', 'cassandra')}
            title="Cassandra"
            description="High write throughput, eventual consistency, distributed"
            useCases="Best for: High write volume, time-series data, no complex joins"
            recommended={hasHighWrites(problemDefinition)}
          />
        </div>
      </div>
    );
  }

  if (step === 2) {
    // Step 2: Define Data Model
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Define Data Model</h3>
        <p className="text-sm text-gray-600">
          What tables/collections will you store? What indexes?
        </p>

        {/* Show suggested data model */}
        {problemDefinition.functionalRequirements.dataModel && (
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm font-medium text-green-900 mb-2">
              Suggested Schema:
            </p>
            {problemDefinition.functionalRequirements.dataModel.entities.map(
              (entity) => (
                <div key={entity} className="mb-3">
                  <p className="text-sm font-medium text-green-800">{entity}</p>
                  <ul className="list-disc list-inside ml-2 text-sm text-green-700">
                    {problemDefinition.functionalRequirements.dataModel.fields[
                      entity
                    ].map((field) => (
                      <li key={field}>{field}</li>
                    ))}
                  </ul>
                </div>
              )
            )}
          </div>
        )}

        {/* User input for custom data model */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Primary Key / Partition Key
          </label>
          <input
            type="text"
            value={config.primaryKey || ''}
            onChange={(e) => updateConfig('primaryKey', e.target.value)}
            placeholder="e.g., short_code, user_id"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            How will you lookup data? This determines performance.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Indexes Needed
          </label>
          <input
            type="text"
            value={config.indexes || ''}
            onChange={(e) => updateConfig('indexes', e.target.value)}
            placeholder="e.g., created_at, user_id"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Comma-separated. Indexes speed up queries but slow down writes.
          </p>
        </div>
      </div>
    );
  }

  if (step === 3) {
    // Step 3: Performance Configuration
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Performance & Cost
        </h3>
        <p className="text-sm text-gray-600">
          Choose instance size based on expected traffic
        </p>

        {/* Show traffic context */}
        <div className="p-4 bg-yellow-50 rounded-lg">
          <p className="text-sm font-medium text-yellow-900 mb-2">
            Expected Traffic:
          </p>
          <ul className="list-disc list-inside text-sm text-yellow-800">
            {problemDefinition.scenarios.map((scenario, i) => (
              <li key={i}>
                Level {i + 1}: {scenario.traffic.rps} RPS (
                {((scenario.traffic.readWriteRatio || 0.5) * 100).toFixed(0)}%
                reads)
              </li>
            ))}
          </ul>
        </div>

        {/* Instance type selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Instance Type
          </label>
          <select
            value={config.instanceType || 'db.t3.medium'}
            onChange={(e) => updateConfig('instanceType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <optgroup label="T3 - Dev/Testing (Cheap)">
              <option value="db.t3.micro">
                db.t3.micro - 50 RPS, $13/mo
              </option>
              <option value="db.t3.small">
                db.t3.small - 100 RPS, $26/mo
              </option>
              <option value="db.t3.medium">
                db.t3.medium - 200 RPS, $53/mo
              </option>
            </optgroup>
            <optgroup label="M5 - Production (Recommended)">
              <option value="db.m5.large">
                db.m5.large - 500 RPS, $133/mo
              </option>
              <option value="db.m5.xlarge">
                db.m5.xlarge - 1000 RPS, $266/mo
              </option>
            </optgroup>
          </select>
        </div>

        {/* Consistency level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Transaction Isolation Level
          </label>
          <select
            value={config.isolationLevel || 'read-committed'}
            onChange={(e) => updateConfig('isolationLevel', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="read-committed">
              Read Committed (Default, good balance)
            </option>
            <option value="serializable">
              Serializable (Strong consistency, slower)
            </option>
            <option value="read-uncommitted">
              Read Uncommitted (Fast, dirty reads possible)
            </option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Trade-off: Consistency vs Performance
          </p>
        </div>
      </div>
    );
  }

  if (step === 4) {
    // Step 4: Reliability Configuration
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Reliability & High Availability
        </h3>
        <p className="text-sm text-gray-600">
          How should the system handle failures?
        </p>

        {/* Replication */}
        <div className="p-4 border border-gray-200 rounded-lg">
          <label className="flex items-center gap-2 mb-3">
            <input
              type="checkbox"
              checked={config.replication?.enabled || false}
              onChange={(e) =>
                updateConfig('replication', {
                  enabled: e.target.checked,
                  replicas: 1,
                  mode: 'async',
                })
              }
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-900">
              Enable Replication (Recommended for production)
            </span>
          </label>

          {config.replication?.enabled && (
            <div className="ml-6 space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Number of Replicas
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={config.replication?.replicas || 1}
                  onChange={(e) =>
                    updateConfig('replication', {
                      ...config.replication,
                      replicas: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Cost = {1 + (config.replication?.replicas || 1)}x base price
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Replication Mode
                </label>
                <div className="space-y-2">
                  <label className="flex items-start gap-2">
                    <input
                      type="radio"
                      name="replicationMode"
                      value="async"
                      checked={config.replication?.mode === 'async'}
                      onChange={(e) =>
                        updateConfig('replication', {
                          ...config.replication,
                          mode: e.target.value,
                        })
                      }
                      className="mt-1"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Async (Recommended)
                      </p>
                      <p className="text-xs text-gray-600">
                        Fast writes, may lose recent data on failover. Good for
                        most use cases.
                      </p>
                    </div>
                  </label>
                  <label className="flex items-start gap-2">
                    <input
                      type="radio"
                      name="replicationMode"
                      value="sync"
                      checked={config.replication?.mode === 'sync'}
                      onChange={(e) =>
                        updateConfig('replication', {
                          ...config.replication,
                          mode: e.target.value,
                        })
                      }
                      className="mt-1"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Sync (Strong Consistency)
                      </p>
                      <p className="text-xs text-gray-600">
                        10x slower writes! No data loss on failover. Only for
                        critical data.
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}

// =============================================================================
// Redis Configuration Wizard
// =============================================================================

function RedisWizard({
  step,
  config,
  updateConfig,
  problemDefinition,
}: {
  step: number;
  config: Record<string, any>;
  updateConfig: (key: string, value: any) => void;
  problemDefinition: ProblemDefinition;
}) {
  if (step === 1) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          What Should You Cache?
        </h3>
        <p className="text-sm text-gray-600">
          Based on your access patterns, what data makes sense to cache?
        </p>

        {/* Show access patterns */}
        <div className="p-4 bg-purple-50 rounded-lg">
          <p className="text-sm font-medium text-purple-900 mb-2">
            Access Patterns:
          </p>
          {problemDefinition.functionalRequirements.dataModel?.accessPatterns.map(
            (pattern, i) => (
              <div key={i} className="text-sm text-purple-800">
                • {pattern.type} - {pattern.frequency} frequency
              </div>
            )
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cache Key Pattern
          </label>
          <input
            type="text"
            value={config.cacheKeyPattern || ''}
            onChange={(e) => updateConfig('cacheKeyPattern', e.target.value)}
            placeholder="e.g., short_code, user:*:profile"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            What keys will you cache? This determines cache effectiveness.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Expected Hit Ratio
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={config.hitRatio || 0.9}
            onChange={(e) =>
              updateConfig('hitRatio', parseFloat(e.target.value))
            }
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>0%</span>
            <span className="font-medium text-blue-600">
              {((config.hitRatio || 0.9) * 100).toFixed(0)}%
            </span>
            <span>100%</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Higher hit ratio = less database load. 90% is typical for read-heavy
            workloads.
          </p>
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Eviction Policy
        </h3>
        <p className="text-sm text-gray-600">
          When cache is full, what should be removed?
        </p>

        <div className="space-y-3">
          <EvictionOption
            selected={config.evictionPolicy === 'lru'}
            onClick={() => updateConfig('evictionPolicy', 'lru')}
            title="LRU - Least Recently Used"
            description="Remove items that haven't been accessed recently"
            useCases="Best for: General purpose, time-based access patterns"
            recommended={true}
          />
          <EvictionOption
            selected={config.evictionPolicy === 'lfu'}
            onClick={() => updateConfig('evictionPolicy', 'lfu')}
            title="LFU - Least Frequently Used"
            description="Remove items that are rarely accessed"
            useCases="Best for: Long-lived, frequency-based patterns"
          />
          <EvictionOption
            selected={config.evictionPolicy === 'ttl'}
            onClick={() => updateConfig('evictionPolicy', 'ttl')}
            title="TTL - Time To Live"
            description="Remove items after fixed time period"
            useCases="Best for: Time-sensitive data (sessions, OTPs)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            TTL (seconds)
          </label>
          <input
            type="number"
            min="60"
            max="86400"
            step="60"
            value={config.ttl || 3600}
            onChange={(e) => updateConfig('ttl', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            {config.ttl ? `${Math.floor(config.ttl / 60)} minutes` : ''}. How
            long should data stay in cache?
          </p>
        </div>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Performance & Durability
        </h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Instance Type
          </label>
          <select
            value={config.instanceType || 'cache.t3.small'}
            onChange={(e) => updateConfig('instanceType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <optgroup label="T3 - Small Workloads">
              <option value="cache.t3.micro">
                cache.t3.micro - 10K RPS, $12/mo
              </option>
              <option value="cache.t3.small">
                cache.t3.small - 25K RPS, $25/mo
              </option>
            </optgroup>
            <optgroup label="M5 - Medium Workloads">
              <option value="cache.m5.large">
                cache.m5.large - 50K RPS, $99/mo
              </option>
            </optgroup>
            <optgroup label="R5 - High Memory">
              <option value="cache.r5.large">
                cache.r5.large - 75K RPS, $137/mo
              </option>
            </optgroup>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Persistence
          </label>
          <select
            value={config.persistence || 'rdb'}
            onChange={(e) => updateConfig('persistence', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="none">None - Fastest, lose data on restart</option>
            <option value="rdb">
              RDB - Periodic snapshots (good balance)
            </option>
            <option value="aof">AOF - Write log (most durable, +10% cost)</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Trade-off: Speed vs Durability. Most caches use RDB or no
            persistence.
          </p>
        </div>
      </div>
    );
  }

  return null;
}

// =============================================================================
// Message Queue Configuration Wizard
// =============================================================================

function MessageQueueWizard({
  step,
  config,
  updateConfig,
  problemDefinition,
}: {
  step: number;
  config: Record<string, any>;
  updateConfig: (key: string, value: any) => void;
  problemDefinition: ProblemDefinition;
}) {
  if (step === 1) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Choose Queue Type
        </h3>
        <p className="text-sm text-gray-600">
          What kind of message queue do you need?
        </p>

        <div className="space-y-3">
          <EngineOption
            selected={config.queueType === 'kafka'}
            onClick={() => updateConfig('queueType', 'kafka')}
            title="Kafka"
            description="High throughput, distributed, persistent log"
            useCases="Best for: Event streaming, high volume, replay capability"
          />
          <EngineOption
            selected={config.queueType === 'rabbitmq'}
            onClick={() => updateConfig('queueType', 'rabbitmq')}
            title="RabbitMQ"
            description="Flexible routing, AMQP protocol, task queues"
            useCases="Best for: Task queues, complex routing, RPC patterns"
          />
          <EngineOption
            selected={config.queueType === 'sqs'}
            onClick={() => updateConfig('queueType', 'sqs')}
            title="AWS SQS"
            description="Fully managed, simple, pay-per-use"
            useCases="Best for: AWS ecosystem, simple queues, no ops overhead"
          />
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Durability & Ordering
        </h3>

        <div>
          <label className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              checked={config.persistent || false}
              onChange={(e) => updateConfig('persistent', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-900">
              Persistent Messages (Survive restart)
            </span>
          </label>
          <p className="text-xs text-gray-500 ml-6">
            Persist messages to disk. Slower but messages won't be lost.
          </p>
        </div>

        <div>
          <label className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              checked={config.ordered || false}
              onChange={(e) => updateConfig('ordered', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-900">
              Strict Ordering (FIFO)
            </span>
          </label>
          <p className="text-xs text-gray-500 ml-6">
            Guarantee message order. Reduces throughput.
          </p>
        </div>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Throughput Configuration
        </h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Expected Message Rate
          </label>
          <input
            type="number"
            min="100"
            max="1000000"
            step="100"
            value={config.messageRate || 1000}
            onChange={(e) => updateConfig('messageRate', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">Messages per second</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Partitions (Kafka) / Queues
          </label>
          <input
            type="number"
            min="1"
            max="100"
            value={config.partitions || 3}
            onChange={(e) => updateConfig('partitions', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            More partitions = higher throughput, but more complexity
          </p>
        </div>
      </div>
    );
  }

  return null;
}

// =============================================================================
// Helper Components
// =============================================================================

function EngineOption({
  selected,
  onClick,
  title,
  description,
  useCases,
  recommended,
}: {
  selected: boolean;
  onClick: () => void;
  title: string;
  description: string;
  useCases: string;
  recommended?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
        selected
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-gray-900">{title}</h4>
            {recommended && (
              <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                Recommended
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
          <p className="text-xs text-gray-500 mt-2">{useCases}</p>
        </div>
        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
            selected
              ? 'border-blue-500 bg-blue-500'
              : 'border-gray-300 bg-white'
          }`}
        >
          {selected && <div className="w-2 h-2 bg-white rounded-full" />}
        </div>
      </div>
    </button>
  );
}

function EvictionOption({
  selected,
  onClick,
  title,
  description,
  useCases,
  recommended,
}: {
  selected: boolean;
  onClick: () => void;
  title: string;
  description: string;
  useCases: string;
  recommended?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full p-3 border-2 rounded-lg text-left transition-all ${
        selected
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
            {recommended && (
              <span className="px-1.5 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                ✓
              </span>
            )}
          </div>
          <p className="text-xs text-gray-600 mt-1">{description}</p>
          <p className="text-xs text-gray-500 mt-1">{useCases}</p>
        </div>
        <div
          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
            selected
              ? 'border-blue-500 bg-blue-500'
              : 'border-gray-300 bg-white'
          }`}
        >
          {selected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
        </div>
      </div>
    </button>
  );
}

// =============================================================================
// Helper Functions
// =============================================================================

function getComponentName(type: string): string {
  const names: Record<string, string> = {
    postgresql: 'Database',
    redis: 'Cache',
    message_queue: 'Message Queue',
    mongodb: 'MongoDB',
    cassandra: 'Cassandra',
  };
  return names[type] || type;
}

function hasComplexQueries(problem: ProblemDefinition): boolean {
  return problem.functionalRequirements.dataModel?.accessPatterns.some(
    (p) => p.type === 'complex_query'
  ) || false;
}

function hasFlexibleSchema(problem: ProblemDefinition): boolean {
  return problem.description.toLowerCase().includes('flexible') ||
    problem.description.toLowerCase().includes('schema changes');
}

function hasHighWrites(problem: ProblemDefinition): boolean {
  return problem.functionalRequirements.dataModel?.accessPatterns.some(
    (p) => p.type === 'write' && p.frequency === 'very_high'
  ) || false;
}
