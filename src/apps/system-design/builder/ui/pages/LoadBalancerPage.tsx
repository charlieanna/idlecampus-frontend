import React from 'react';
import { LoadBalancerConfigPanel } from '../components/LoadBalancerConfigPanel';
import { SystemGraph } from '../../types/graph';

interface LoadBalancerPageProps {
  systemGraph: SystemGraph;
  onUpdateConfig: (nodeId: string, config: any) => void;
}

/**
 * LoadBalancerPage - Load balancer configuration
 * Maps to Figma: LoadBalancerPage frame
 */
export const LoadBalancerPage: React.FC<LoadBalancerPageProps> = ({
  systemGraph,
  onUpdateConfig,
}) => {
  return (
    <LoadBalancerConfigPanel
      systemGraph={systemGraph}
      onUpdateConfig={onUpdateConfig}
    />
  );
};

