import React from 'react';
import { AppServerConfigPanel } from '../components/AppServerConfigPanel';
import { SystemGraph } from '../../types/graph';

interface AppServerPageProps {
  systemGraph: SystemGraph;
  onUpdateConfig: (nodeId: string, config: any) => void;
}

/**
 * AppServerPage - App server configuration
 * Maps to Figma: AppServerPage frame
 */
export const AppServerPage: React.FC<AppServerPageProps> = ({
  systemGraph,
  onUpdateConfig,
}) => {
  return (
    <AppServerConfigPanel
      systemGraph={systemGraph}
      onUpdateConfig={onUpdateConfig}
    />
  );
};

