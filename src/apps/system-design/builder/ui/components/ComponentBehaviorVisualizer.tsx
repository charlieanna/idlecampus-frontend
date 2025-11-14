import React, { useState } from 'react';
import {
  Activity,
  CheckCircle,
  Clock,
  Code,
  Cpu,
  Database,
  HardDrive,
  Info,
  Layers,
  Server,
  Settings,
  Shield,
  Transform,
  Users,
  Zap,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { ComponentNode } from '../../types/component';
import { ComponentBehaviorConfig, PrebuiltBehavior, TieredChallenge } from '../../types/challengeTiers';
import { WORKER_BEHAVIORS, VALIDATIONS, TRANSFORMATIONS, EXTERNAL_APIS } from '../../behaviors/componentBehaviors';

interface ComponentBehaviorVisualizerProps {
  components: ComponentNode[];
  challenge?: TieredChallenge;
  selectedComponentId?: string;
  onSelectComponent?: (id: string) => void;
}

/**
 * Component Behavior Visualizer
 *
 * Shows what each component is doing based on tier and configuration
 * Helps students understand the performance implications
 */
export function ComponentBehaviorVisualizer({
  components,
  challenge,
  selectedComponentId,
  onSelectComponent,
}: ComponentBehaviorVisualizerProps) {
  const [expandedComponent, setExpandedComponent] = useState<string | null>(null);

  const getComponentBehavior = (component: ComponentNode): any => {
    if (!challenge?.componentBehaviors) return null;

    switch (component.type) {
      case 'app_server':
        return challenge.componentBehaviors.appServer;
      case 'worker':
        return challenge.componentBehaviors.worker;
      case 'database':
      case 'postgresql':
      case 'mongodb':
      case 'cassandra':
        return challenge.componentBehaviors.database;
      default:
        return null;
    }
  };

  const getPrebuiltBehaviors = (component: ComponentNode): PrebuiltBehavior[] => {
    if (!challenge?.prebuiltBehaviors) return [];
    return challenge.prebuiltBehaviors[component.type] || [];
  };

  const getComponentIcon = (type: string) => {
    switch (type) {
      case 'app_server':
        return <Server className="w-5 h-5" />;
      case 'worker':
        return <Settings className="w-5 h-5" />;
      case 'database':
      case 'postgresql':
      case 'mongodb':
      case 'cassandra':
        return <Database className="w-5 h-5" />;
      case 'redis':
        return <Layers className="w-5 h-5" />;
      case 'message_queue':
        return <Activity className="w-5 h-5" />;
      default:
        return <Server className="w-5 h-5" />;
    }
  };

  const renderWorkerBehavior = (behavior: any) => {
    if (!behavior) return null;

    const workerBehavior = WORKER_BEHAVIORS[behavior.behavior];

    return (
      <div className="space-y-3">
        {/* Behavior Type */}
        <div className="flex items-start space-x-2">
          <Activity className="w-4 h-4 text-gray-400 mt-1" />
          <div>
            <div className="text-sm font-medium text-gray-700">Behavior</div>
            <div className="text-sm text-gray-900">{workerBehavior?.description}</div>
            <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
              <span className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{workerBehavior?.baseLatency}ms base</span>
              </span>
              <span className="flex items-center space-x-1">
                <Zap className="w-3 h-3" />
                <span>{workerBehavior?.throughputMultiplier}x throughput</span>
              </span>
            </div>
          </div>
        </div>

        {/* Validations */}
        {behavior.validations && behavior.validations.length > 0 && (
          <div className="flex items-start space-x-2">
            <Shield className="w-4 h-4 text-green-500 mt-1" />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-700">Validations</div>
              <div className="space-y-1 mt-1">
                {behavior.validations.map((v: string) => {
                  const validation = VALIDATIONS[v];
                  return (
                    <div key={v} className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">{validation?.name || v}</span>
                      <span className="text-gray-500">+{validation?.latency || 0}ms</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Transformations */}
        {behavior.transformations && behavior.transformations.length > 0 && (
          <div className="flex items-start space-x-2">
            <Transform className="w-4 h-4 text-purple-500 mt-1" />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-700">Transformations</div>
              <div className="space-y-1 mt-1">
                {behavior.transformations.map((t: string) => {
                  const transformation = TRANSFORMATIONS[t];
                  return (
                    <div key={t} className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">{transformation?.name || t}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-500">+{transformation?.latency || 0}ms</span>
                        {transformation?.cpuCost === 'high' && (
                          <Cpu className="w-3 h-3 text-orange-500" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* External APIs */}
        {behavior.externalApis && behavior.externalApis.length > 0 && (
          <div className="flex items-start space-x-2">
            <ExternalLink className="w-4 h-4 text-blue-500 mt-1" />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-700">External APIs</div>
              <div className="space-y-1 mt-1">
                {behavior.externalApis.map((api: string) => {
                  const apiSpec = EXTERNAL_APIS[api];
                  return (
                    <div key={api} className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">{apiSpec?.name || api}</span>
                      <span className="text-gray-500">
                        {apiSpec?.latency.p50 || 0}-{apiSpec?.latency.p99 || 0}ms
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderAppServerOperations = (operations: any) => {
    if (!operations?.operations) return null;

    return (
      <div className="space-y-2">
        {Object.entries(operations.operations).map(([op, spec]: [string, any]) => (
          <div key={op} className="flex items-start space-x-2">
            <Activity className="w-4 h-4 text-gray-400 mt-1" />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-700 capitalize">{op}</div>
              <div className="flex items-center space-x-3 mt-1 text-xs text-gray-500">
                <span className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{spec.baseLatency}ms</span>
                </span>
                {spec.cpuIntensive && (
                  <span className="flex items-center space-x-1">
                    <Cpu className="w-3 h-3 text-orange-500" />
                    <span>CPU</span>
                  </span>
                )}
                {spec.memoryIntensive && (
                  <span className="flex items-center space-x-1">
                    <Database className="w-3 h-3 text-purple-500" />
                    <span>Memory</span>
                  </span>
                )}
                {spec.ioIntensive && (
                  <span className="flex items-center space-x-1">
                    <HardDrive className="w-3 h-3 text-blue-500" />
                    <span>I/O</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderPrebuiltBehaviors = (behaviors: PrebuiltBehavior[]) => {
    return (
      <div className="space-y-3">
        {behaviors.map((behavior, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
            <div className="font-medium text-sm text-gray-900">{behavior.operation}</div>
            <p className="text-xs text-gray-600 mt-1">{behavior.description}</p>
            <div className="flex items-center space-x-3 mt-2 text-xs">
              <span className="flex items-center space-x-1">
                <Clock className="w-3 h-3 text-gray-400" />
                <span>
                  {typeof behavior.latency === 'number'
                    ? `${behavior.latency}ms`
                    : `${behavior.latency.min}-${behavior.latency.max}ms`}
                </span>
              </span>
              {behavior.throughput && (
                <span className="flex items-center space-x-1">
                  <Zap className="w-3 h-3 text-gray-400" />
                  <span>{behavior.throughput} ops/sec</span>
                </span>
              )}
              {behavior.failureRate && (
                <span className="flex items-center space-x-1 text-orange-600">
                  <Activity className="w-3 h-3" />
                  <span>{(behavior.failureRate * 100).toFixed(1)}% failure</span>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Component Behaviors</h3>
        {challenge && (
          <span className={`
            inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
            ${challenge.implementationTier === 'simple' ? 'bg-green-100 text-green-800' :
              challenge.implementationTier === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'}
          `}>
            Tier {challenge.implementationTier === 'simple' ? 1 :
                  challenge.implementationTier === 'moderate' ? 2 : 3}
          </span>
        )}
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <Info className="w-4 h-4 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-900">
            {challenge?.implementationTier === 'simple' && (
              <span>Your Python code implementation will affect these behaviors and performance.</span>
            )}
            {challenge?.implementationTier === 'moderate' && (
              <span>Configure algorithms to optimize these behaviors for your requirements.</span>
            )}
            {challenge?.implementationTier === 'advanced' && (
              <span>These behaviors are pre-built. Focus on system architecture to support them.</span>
            )}
          </div>
        </div>
      </div>

      {/* Components List */}
      <div className="space-y-3">
        {components.map((component) => {
          const behavior = getComponentBehavior(component);
          const prebuiltBehaviors = getPrebuiltBehaviors(component);
          const isExpanded = expandedComponent === component.id;
          const isSelected = selectedComponentId === component.id;

          if (!behavior && prebuiltBehaviors.length === 0) return null;

          return (
            <div
              key={component.id}
              className={`
                border rounded-lg transition-all cursor-pointer
                ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}
              `}
              onClick={() => {
                onSelectComponent?.(component.id);
                setExpandedComponent(isExpanded ? null : component.id);
              }}
            >
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getComponentIcon(component.type)}
                    <div>
                      <div className="font-medium text-gray-900">
                        {component.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </div>
                      {component.customLogic?.enabled && (
                        <span className="inline-flex items-center space-x-1 text-xs text-green-600">
                          <Code className="w-3 h-3" />
                          <span>Custom Python Logic</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <ChevronRight className={`
                    w-4 h-4 text-gray-400 transition-transform
                    ${isExpanded ? 'rotate-90' : ''}
                  `} />
                </div>

                {/* Behavior Details (Expanded) */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    {component.type === 'worker' && renderWorkerBehavior(behavior)}
                    {component.type === 'app_server' && renderAppServerOperations(behavior)}
                    {prebuiltBehaviors.length > 0 && renderPrebuiltBehaviors(prebuiltBehaviors)}

                    {/* Database Schema */}
                    {(component.type === 'database' || component.type === 'postgresql' ||
                      component.type === 'mongodb' || component.type === 'cassandra') &&
                      behavior?.schema && (
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-gray-700">Data Model</div>
                        <div className="text-sm text-gray-600">
                          {behavior.dataModel} ({behavior.schema.estimatedSize})
                        </div>
                        <div className="space-y-1">
                          {behavior.schema.tables.map((table: any) => (
                            <div key={table.name} className="text-xs text-gray-500">
                              <span className="font-medium">{table.name}</span>: {table.fields.length} fields
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {components.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Users className="w-12 h-12 mx-auto text-gray-300 mb-2" />
            <p>No components added yet</p>
            <p className="text-sm mt-1">Add components to see their behaviors</p>
          </div>
        )}
      </div>
    </div>
  );
}