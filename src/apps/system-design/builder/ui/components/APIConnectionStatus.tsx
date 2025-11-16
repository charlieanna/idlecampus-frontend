/**
 * API Connection Status Component
 *
 * Shows which APIs are used in Python code and their connection status
 */

import React from 'react';
import { SystemGraph } from '../../types/graph';
import {
  detectAPIUsage,
  getConnectedComponents,
  componentTypesToAPIs,
  APIType,
} from '../../services/connectionValidator';

interface APIConnectionStatusProps {
  pythonCode: string;
  systemGraph: SystemGraph;
}

const API_LABELS: Record<APIType, string> = {
  db: 'Database',
  cache: 'Cache',
  queue: 'Message Queue',
  cdn: 'CDN',
  search: 'Search',
};

const API_ICONS: Record<APIType, string> = {
  db: '💾',
  cache: '⚡',
  queue: '📮',
  cdn: '🌐',
  search: '🔍',
};

export function APIConnectionStatus({ pythonCode, systemGraph }: APIConnectionStatusProps) {
  const usedAPIs = detectAPIUsage(pythonCode);
  const connectedTypes = getConnectedComponents(systemGraph);
  const connectedAPIs = componentTypesToAPIs(connectedTypes);

  if (usedAPIs.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>ℹ️</span>
          <span>No context APIs detected in code</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 mb-4">
      <div className="text-xs font-semibold text-gray-700 mb-2">API Connections</div>
      <div className="space-y-1.5">
        {usedAPIs.map(apiType => {
          const isConnected = connectedAPIs.includes(apiType);
          return (
            <div
              key={apiType}
              className={`flex items-center justify-between px-2 py-1.5 rounded text-xs ${
                isConnected
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <span>{API_ICONS[apiType]}</span>
                <span className="font-medium">
                  context.{apiType}
                </span>
              </div>
              {isConnected ? (
                <span className="text-green-700 font-medium">✓ Connected</span>
              ) : (
                <span className="text-red-700 font-medium">✗ Not Connected</span>
              )}
            </div>
          );
        })}
      </div>
      {!usedAPIs.every(api => connectedAPIs.includes(api)) && (
        <div className="mt-2 pt-2 border-t border-gray-200">
          <div className="text-xs text-amber-700 flex items-start gap-2">
            <span>⚠️</span>
            <span>
              Connect missing components on the Canvas tab before submitting
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
