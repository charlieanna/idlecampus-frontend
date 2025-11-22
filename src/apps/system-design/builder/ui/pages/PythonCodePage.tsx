import React from 'react';
import { PythonCodeChallengePanel } from '../components/PythonCodeChallengePanel';
import { WebCrawlerCodeChallengePanel } from '../components/WebCrawlerCodeChallengePanel';
import Editor from "@monaco-editor/react";
import { Challenge } from '../../types/testCase';
import { SystemGraph } from '../../types/graph';
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
}) => {
  const { pythonCode, setPythonCode, pythonCodeByServer, setPythonCodeByServer } = useCodeStore();

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

  return null;
};

