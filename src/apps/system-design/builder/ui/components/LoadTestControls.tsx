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
  const [scenario, setScenario] = useState<LoadTestScenario>('quick');
  const [rps, setRps] = useState(10);
  const [duration, setDuration] = useState(1);
  const [readWriteRatio, setReadWriteRatio] = useState(0.5);

  // Import scenarios
  const scenarios = {
    quick: { name: 'Quick Test', description: 'Run 10 requests to validate code works', rps: 10, duration: 1, readWriteRatio: 0.5 },
    normal: { name: 'Normal Load', description: '1,000 RPS for 60 seconds (60K requests)', rps: 1000, duration: 60, readWriteRatio: 0.9 },
    spike: { name: 'Read Spike', description: '5,000 RPS for 30 seconds (150K requests)', rps: 5000, duration: 30, readWriteRatio: 0.98 },
    sustained: { name: 'Sustained Load', description: '500 RPS for 300 seconds (150K requests)', rps: 500, duration: 300, readWriteRatio: 0.8 },
    custom: { name: 'Custom', description: 'Configure your own test parameters', rps: 100, duration: 10, readWriteRatio: 0.9 },
  };

  const handleScenarioChange = (newScenario: LoadTestScenario) => {
    setScenario(newScenario);
    const preset = scenarios[newScenario];
    setRps(preset.rps);
    setDuration(preset.duration);
    setReadWriteRatio(preset.readWriteRatio);
  };

  const handleRunTest = () => {
    onRunTest({
      scenario,
      rps,
      duration,
      readWriteRatio,
    });
  };

  const totalRequests = rps * duration;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Load Test</h3>
        <p className="text-sm text-gray-600 mt-1">
          Test your code under realistic traffic conditions
        </p>
      </div>

      {/* Controls */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {/* Scenario Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Test Scenario
          </label>
          <div className="space-y-2">
            {(Object.keys(scenarios) as LoadTestScenario[]).map((key) => {
              const s = scenarios[key];
              return (
                <label
                  key={key}
                  className={`flex items-start p-3 border rounded-lg cursor-pointer transition-colors ${
                    scenario === key
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="scenario"
                    value={key}
                    checked={scenario === key}
                    onChange={() => handleScenarioChange(key)}
                    disabled={isRunning}
                    className="mt-1"
                  />
                  <div className="ml-3 flex-1">
                    <div className="text-sm font-medium text-gray-900">{s.name}</div>
                    <div className="text-xs text-gray-600 mt-0.5">{s.description}</div>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Custom Configuration */}
        {scenario === 'custom' && (
          <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
            {/* RPS */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Requests per Second: {rps.toLocaleString()}
              </label>
              <input
                type="range"
                min="1"
                max="10000"
                step="10"
                value={rps}
                onChange={(e) => setRps(parseInt(e.target.value))}
                disabled={isRunning}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1</span>
                <span>10,000</span>
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration: {duration} seconds
              </label>
              <input
                type="range"
                min="1"
                max="300"
                step="1"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                disabled={isRunning}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1s</span>
                <span>300s</span>
              </div>
            </div>

            {/* Read/Write Ratio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Read/Write Ratio: {(readWriteRatio * 100).toFixed(0)}% / {(100 - readWriteRatio * 100).toFixed(0)}%
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={readWriteRatio}
                onChange={(e) => setReadWriteRatio(parseFloat(e.target.value))}
                disabled={isRunning}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0% Read</span>
                <span>100% Read</span>
              </div>
            </div>
          </div>
        )}

        {/* Test Summary */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-sm font-medium text-blue-900 mb-2">Test Summary</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-blue-700">Total Requests:</span>
              <span className="ml-2 font-semibold text-blue-900">{totalRequests.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-blue-700">Duration:</span>
              <span className="ml-2 font-semibold text-blue-900">{duration}s</span>
            </div>
            <div>
              <span className="text-blue-700">Reads:</span>
              <span className="ml-2 font-semibold text-blue-900">{Math.floor(totalRequests * readWriteRatio).toLocaleString()}</span>
            </div>
            <div>
              <span className="text-blue-700">Writes:</span>
              <span className="ml-2 font-semibold text-blue-900">{Math.floor(totalRequests * (1 - readWriteRatio)).toLocaleString()}</span>
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
