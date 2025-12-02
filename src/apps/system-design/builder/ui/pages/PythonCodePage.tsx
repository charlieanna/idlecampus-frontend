import React, { useState, useEffect } from 'react';
import { PythonCodeChallengePanel } from '../components/PythonCodeChallengePanel';
import { WebCrawlerCodeChallengePanel } from '../components/WebCrawlerCodeChallengePanel';
import Editor from "@monaco-editor/react";
import { Challenge } from '../../types/testCase';
import { SystemGraph, ComponentNode } from '../../types/graph';
import { useCodeStore } from '../store';

interface PythonCodePageProps {
  challenge: Challenge;
  systemGraph: SystemGraph;
  onRunTests: () => void;
  onSubmit: () => void;
  isTinyUrl?: boolean;
  isWebCrawler?: boolean;
  hasCodeChallenges?: boolean;
  hasPythonTemplate?: boolean;
  appServersWithAPIs?: ComponentNode[];
}

// Generate Python code template based on APIs
function generateAPICode(serverName: string, apis: string[]): string {
  const functionDefs = apis.map(api => {
    const parts = api.trim().split(/\s+/);
    const method = parts.length > 1 ? parts[0] : 'GET';
    const path = parts.length > 1 ? parts[1] : parts[0];

    // Create function name from path
    const pathParts = path.split('/').filter(p => p && !p.includes('*') && !p.startsWith(':'));
    const funcName = `handle_${method.toLowerCase()}_${pathParts.join('_') || 'request'}`;

    return `def ${funcName}(request, context):
    """
    Handle ${method} ${path}

    Args:
        request: The incoming request object
        context: System context with access to databases, caches, etc.

    Returns:
        Response object
    """
    # TODO: Implement this API handler
    pass
`;
  }).join('\n');

  return `# ${serverName} - API Handlers
# This server handles the following APIs:
${apis.map(api => `#   - ${api}`).join('\n')}

from typing import Any, Dict

${functionDefs}
`;
}

/**
 * PythonCodePage - Python code editor and testing
 * Maps to Figma: PythonCodePage frame
 */
export const PythonCodePage: React.FC<PythonCodePageProps> = ({
  challenge,
  systemGraph,
  onRunTests,
  onSubmit,
  isTinyUrl = false,
  isWebCrawler = false,
  hasCodeChallenges = false,
  hasPythonTemplate = false,
  appServersWithAPIs = [],
}) => {
  const { pythonCode, setPythonCode, pythonCodeByServer, setPythonCodeByServer } = useCodeStore();
  const [selectedServerId, setSelectedServerId] = useState<string | null>(null);

  // Initialize code for each app server when APIs change
  useEffect(() => {
    if (appServersWithAPIs.length > 0) {
      const newCodeByServer = { ...pythonCodeByServer };
      let hasChanges = false;

      appServersWithAPIs.forEach(server => {
        const serverName = server.config?.displayName || server.config?.serviceName || `Server ${server.id}`;
        const apis = server.config?.handledAPIs || [];

        // Only generate code if this server doesn't have code yet
        if (!newCodeByServer[server.id]) {
          newCodeByServer[server.id] = {
            code: generateAPICode(serverName, apis),
            apis: apis,
          };
          hasChanges = true;
        }
      });

      if (hasChanges) {
        setPythonCodeByServer(newCodeByServer);
      }

      // Select first server if none selected
      if (!selectedServerId && appServersWithAPIs.length > 0) {
        setSelectedServerId(appServersWithAPIs[0].id);
      }
    }
  }, [appServersWithAPIs, pythonCodeByServer, setPythonCodeByServer, selectedServerId]);

  // Get current server's code
  const currentServerCode = selectedServerId ? pythonCodeByServer[selectedServerId]?.code || '' : '';
  const currentServer = appServersWithAPIs.find(s => s.id === selectedServerId);

  // Handle code change for current server
  const handleCodeChange = (newCode: string | undefined) => {
    if (selectedServerId && newCode !== undefined) {
      setPythonCodeByServer({
        ...pythonCodeByServer,
        [selectedServerId]: {
          ...pythonCodeByServer[selectedServerId],
          code: newCode,
        },
      });
    }
  };

  // TinyURL or generic code challenges with PythonCodeChallengePanel
  if (isTinyUrl || (!isWebCrawler && hasCodeChallenges)) {
    return (
      <PythonCodeChallengePanel
        pythonCode={pythonCode}
        setPythonCode={setPythonCode}
        pythonCodeByServer={pythonCodeByServer}
        setPythonCodeByServer={setPythonCodeByServer}
        systemGraph={systemGraph}
        onRunTests={onRunTests}
        onSubmit={onSubmit}
      />
    );
  }

  // Web Crawler specific
  if (isWebCrawler) {
    return (
      <WebCrawlerCodeChallengePanel
        pythonCode={pythonCode}
        setPythonCode={setPythonCode}
        onRunTests={onRunTests}
        onSubmit={onSubmit}
      />
    );
  }

  // Generic Python Editor for challenges with pythonTemplate but no codeChallenges
  if (!hasCodeChallenges && hasPythonTemplate) {
    return (
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Problem Statement (40%) */}
        <div className="w-2/5 bg-white border-r border-gray-200 flex flex-col">
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Problem Title */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {challenge?.title}
                </h2>
                <div className="mt-2 flex items-center gap-2">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded ${
                      challenge?.difficulty === "easy"
                        ? "bg-green-100 text-green-700"
                        : challenge?.difficulty === "medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    {challenge?.difficulty || "Medium"}
                  </span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                    System Design
                  </span>
                </div>
              </div>

              {/* Problem Description */}
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700">
                  {challenge?.description}
                </p>
              </div>

              {/* Functional Requirements */}
              {challenge?.requirements &&
                challenge.requirements.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Requirements
                    </h3>
                    <ul className="list-disc pl-5 space-y-1 text-gray-700">
                      {challenge.requirements.map((req, idx) => (
                        <li key={idx}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}

              {/* Non-Functional Requirements */}
              {challenge?.nonFunctionalRequirements &&
                challenge.nonFunctionalRequirements.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Performance Requirements
                    </h3>
                    <ul className="list-disc pl-5 space-y-1 text-gray-700">
                      {challenge.nonFunctionalRequirements.map(
                        (req, idx) => (
                          <li key={idx}>{req}</li>
                        ),
                      )}
                    </ul>
                  </div>
                )}

              {/* Constraints */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Constraints
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                  <li>Your implementation should be efficient</li>
                  <li>Handle error cases gracefully</li>
                  <li>Follow the function signatures provided</li>
                </ul>
              </div>

              {/* Hints */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Hints
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                  <li>
                    Use the context API to interact with databases and
                    caches
                  </li>
                  {challenge?.requiredAPIs &&
                    challenge.requiredAPIs.length > 0 && (
                      <li>
                        Available APIs:{" "}
                        {challenge.requiredAPIs.join(", ")}
                      </li>
                    )}
                  <li>Complete the TODO sections in the code</li>
                  <li>Handle edge cases appropriately</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Code Editor (60%) */}
        <div className="flex-1 flex flex-col bg-gray-50">
          {/* Code Editor Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Python Implementation
            </h3>
            <button
              onClick={onSubmit}
              className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              ▶️ Submit Solution
            </button>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1 overflow-hidden">
            <Editor
              height="100%"
              defaultLanguage="python"
              value={pythonCode}
              onChange={(value) => setPythonCode(value || "")}
              theme="vs-dark"
              options={{
                minimap: { enabled: true },
                fontSize: 14,
                lineNumbers: "on",
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 4,
                wordWrap: "on",
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  // New view: Show code editors for app servers with configured APIs
  if (appServersWithAPIs.length > 0) {
    return (
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Server List */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-sm font-semibold text-gray-900">App Servers</h3>
            <p className="text-xs text-gray-500 mt-1">Select a server to write API handlers</p>
          </div>
          <div className="flex-1 overflow-y-auto">
            {appServersWithAPIs.map(server => {
              const serverName = server.config?.displayName || server.config?.serviceName || `Server ${server.id.slice(0, 8)}`;
              const apis = server.config?.handledAPIs || [];
              const isSelected = selectedServerId === server.id;

              return (
                <button
                  key={server.id}
                  onClick={() => setSelectedServerId(server.id)}
                  className={`w-full p-3 text-left border-b border-gray-100 transition-colors ${
                    isSelected ? 'bg-blue-50 border-l-4 border-l-blue-500' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="font-medium text-sm text-gray-900">{serverName}</div>
                  <div className="text-xs text-gray-500 mt-1">{apis.length} API{apis.length !== 1 ? 's' : ''}</div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {apis.slice(0, 3).map((api: string, idx: number) => {
                      const method = api.split(/\s+/)[0] || 'API';
                      return (
                        <span key={idx} className="text-[10px] px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded">
                          {method.substring(0, 4)}
                        </span>
                      );
                    })}
                    {apis.length > 3 && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">
                        +{apis.length - 3}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Panel: Code Editor */}
        <div className="flex-1 flex flex-col bg-gray-50">
          {currentServer ? (
            <>
              {/* Header */}
              <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {currentServer.config?.displayName || currentServer.config?.serviceName || 'App Server'}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Implement handlers for: {(currentServer.config?.handledAPIs || []).join(', ')}
                  </p>
                </div>
                <button
                  onClick={onSubmit}
                  className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                >
                  ▶️ Submit Solution
                </button>
              </div>

              {/* Monaco Editor */}
              <div className="flex-1 overflow-hidden">
                <Editor
                  height="100%"
                  defaultLanguage="python"
                  value={currentServerCode}
                  onChange={handleCodeChange}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: true },
                    fontSize: 14,
                    lineNumbers: "on",
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 4,
                    wordWrap: "on",
                  }}
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select an app server to write code
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};

