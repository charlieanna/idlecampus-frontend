import { useState } from 'react';
import type {
  LoadTestScenario,
  LoadTestConfig,
  ScenarioPreset,
  LOAD_TEST_SCENARIOS,
} from '../../types/loadTest';

interface LoadTestControlsProps {
  onRunTest: (config: Omit<LoadTestConfig, 'code' | 'challengeId'>) => void;
  isRunning: boolean;
  onCancel: () => void;
}

export function LoadTestControls({ onRunTest, isRunning, onCancel }: LoadTestControlsProps) {
  // Simplified: Just run the test with default parameters
  const handleRunTest = () => {
    onRunTest({
      scenario: 'quick' as LoadTestScenario,
      rps: 100,
      duration: 5,
      readWriteRatio: 0.8,
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Load Test</h3>
        <p className="text-sm text-gray-600 mt-1">
          Test your implementation with simulated traffic
        </p>
      </div>

      {/* Test Description */}
      <div className="flex-1 p-4 space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">How Testing Works</h4>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start">
              <span className="mr-2">1️⃣</span>
              <span>Finds path from Client → Load Balancer → App Server</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">2️⃣</span>
              <span>Simulates traffic flow through your architecture</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">3️⃣</span>
              <span>Executes your Python code for each request</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">4️⃣</span>
              <span>Validates database and cache interactions</span>
            </li>
          </ul>
        </div>

        <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-2">Test Configuration</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-600">Requests:</span>
              <span className="ml-2 font-semibold">500 total</span>
            </div>
            <div>
              <span className="text-gray-600">Rate:</span>
              <span className="ml-2 font-semibold">100 RPS</span>
            </div>
            <div>
              <span className="text-gray-600">Duration:</span>
              <span className="ml-2 font-semibold">5 seconds</span>
            </div>
            <div>
              <span className="text-gray-600">Mix:</span>
              <span className="ml-2 font-semibold">80% reads</span>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3">
          <div className="flex items-start">
            <span className="text-yellow-600 mr-2">💡</span>
            <div className="text-sm text-yellow-800">
              <strong>Tip:</strong> Make sure your canvas has Client, Load Balancer, App Server, Database, and Cache components connected properly.
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="p-4 border-t border-gray-200">
        {isRunning ? (
          <button
            onClick={onCancel}
            className="w-full px-4 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
          >
            ⏹ Cancel Test
          </button>
        ) : (
          <button
            onClick={handleRunTest}
            className="w-full px-4 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-md hover:shadow-lg"
          >
            ▶️ Run Load Test
          </button>
        )}
      </div>
    </div>
  );
}