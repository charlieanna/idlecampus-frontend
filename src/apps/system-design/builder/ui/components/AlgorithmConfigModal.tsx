import React, { useState } from 'react';
import { X, Cpu, Clock, Database, Zap, Info, Code, ChevronDown, ChevronUp } from 'lucide-react';
import { ConfigurableAlgorithm, AlgorithmOption } from '../../types/challengeTiers';

interface AlgorithmConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  algorithms: ConfigurableAlgorithm[];
  onConfigComplete: (config: Record<string, string>) => void;
  challengeTitle: string;
}

/**
 * Algorithm Configuration Modal for Tier 2 Problems
 *
 * Allows students to select and configure pre-built algorithms
 * Shows performance implications of each choice
 */
export function AlgorithmConfigModal({
  isOpen,
  onClose,
  algorithms,
  onConfigComplete,
  challengeTitle,
}: AlgorithmConfigModalProps) {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    // Initialize with defaults
    const defaults: Record<string, string> = {};
    algorithms.forEach(alg => {
      defaults[alg.algorithmKey] = alg.defaultOption;
    });
    return defaults;
  });

  const [expandedCode, setExpandedCode] = useState<Record<string, boolean>>({});
  const [showPerformanceImpact, setShowPerformanceImpact] = useState(true);

  if (!isOpen) return null;

  const handleOptionSelect = (algorithmKey: string, optionId: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [algorithmKey]: optionId,
    }));
  };

  const handleConfirm = () => {
    onConfigComplete(selectedOptions);
    onClose();
  };

  const calculateTotalPerformance = () => {
    let totalLatency = 0;
    let totalThroughput = 1.0;
    const factors = {
      cpu: false,
      memory: false,
      io: false,
    };

    algorithms.forEach(alg => {
      const selectedOption = alg.options.find(
        opt => opt.id === selectedOptions[alg.algorithmKey]
      );
      if (selectedOption) {
        totalLatency += selectedOption.performanceProfile.avgLatency;
        totalThroughput *= selectedOption.performanceProfile.throughputMultiplier;
        factors.cpu = factors.cpu || selectedOption.performanceProfile.cpuIntensive;
        factors.memory = factors.memory || selectedOption.performanceProfile.memoryIntensive;
        factors.io = factors.io || selectedOption.performanceProfile.ioIntensive;
      }
    });

    return { totalLatency, totalThroughput, factors };
  };

  const { totalLatency, totalThroughput, factors } = calculateTotalPerformance();

  const getLatencyColor = (latency: number) => {
    if (latency < 50) return 'text-green-600';
    if (latency < 200) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getThroughputColor = (throughput: number) => {
    if (throughput >= 1.0) return 'text-green-600';
    if (throughput >= 0.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-5xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Configure Algorithms</h2>
            <p className="text-sm text-gray-600 mt-1">{challengeTitle} - Tier 2 (Moderate)</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm text-blue-900 font-medium">
                    Configure Pre-Built Algorithms
                  </p>
                  <p className="text-sm text-blue-700 mt-1">
                    Select the best algorithm for each component based on your requirements.
                    Each choice has different performance characteristics and tradeoffs.
                  </p>
                </div>
              </div>
            </div>

            {/* Algorithm Configurations */}
            {algorithms.map((algorithm) => (
              <div key={algorithm.algorithmKey} className="border border-gray-200 rounded-lg">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">{algorithm.label}</h3>
                  <p className="text-sm text-gray-600 mt-1">{algorithm.description}</p>
                </div>

                <div className="p-4 space-y-3">
                  {algorithm.options.map((option) => {
                    const isSelected = selectedOptions[algorithm.algorithmKey] === option.id;
                    const showCode = expandedCode[`${algorithm.algorithmKey}-${option.id}`];

                    return (
                      <div
                        key={option.id}
                        className={`
                          border rounded-lg transition-all cursor-pointer
                          ${isSelected
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                          }
                        `}
                        onClick={() => handleOptionSelect(algorithm.algorithmKey, option.id)}
                      >
                        <div className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3">
                                <input
                                  type="radio"
                                  checked={isSelected}
                                  onChange={() => {}}
                                  className="w-4 h-4 text-blue-600"
                                />
                                <div>
                                  <div className="font-medium text-gray-900">{option.name}</div>
                                  <div className="text-sm text-gray-600 mt-1">
                                    {option.description}
                                  </div>
                                </div>
                              </div>

                              {/* Performance Characteristics */}
                              <div className="mt-3 ml-7 flex flex-wrap gap-3">
                                <div className="flex items-center space-x-1">
                                  <Clock className="w-4 h-4 text-gray-400" />
                                  <span className={`text-sm font-medium ${getLatencyColor(option.performanceProfile.avgLatency)}`}>
                                    {option.performanceProfile.avgLatency}ms
                                  </span>
                                </div>

                                <div className="flex items-center space-x-1">
                                  <Zap className="w-4 h-4 text-gray-400" />
                                  <span className={`text-sm font-medium ${getThroughputColor(option.performanceProfile.throughputMultiplier)}`}>
                                    {option.performanceProfile.throughputMultiplier}x throughput
                                  </span>
                                </div>

                                {option.performanceProfile.cpuIntensive && (
                                  <div className="flex items-center space-x-1">
                                    <Cpu className="w-4 h-4 text-orange-500" />
                                    <span className="text-sm text-gray-600">CPU intensive</span>
                                  </div>
                                )}

                                {option.performanceProfile.memoryIntensive && (
                                  <div className="flex items-center space-x-1">
                                    <Database className="w-4 h-4 text-purple-500" />
                                    <span className="text-sm text-gray-600">Memory intensive</span>
                                  </div>
                                )}
                              </div>

                              {/* Code Preview (if available) */}
                              {option.configCode && (
                                <div className="mt-3 ml-7">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setExpandedCode(prev => ({
                                        ...prev,
                                        [`${algorithm.algorithmKey}-${option.id}`]: !showCode,
                                      }));
                                    }}
                                    className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
                                  >
                                    <Code className="w-4 h-4" />
                                    <span>View implementation</span>
                                    {showCode ? (
                                      <ChevronUp className="w-4 h-4" />
                                    ) : (
                                      <ChevronDown className="w-4 h-4" />
                                    )}
                                  </button>

                                  {showCode && (
                                    <pre className="mt-2 p-3 bg-gray-900 text-gray-100 rounded-lg text-xs overflow-x-auto">
                                      <code>{option.configCode.trim()}</code>
                                    </pre>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Performance Impact Summary */}
            {showPerformanceImpact && (
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">
                  Combined Performance Impact
                </h4>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Total Latency</div>
                    <div className={`text-2xl font-bold ${getLatencyColor(totalLatency)}`}>
                      {totalLatency}ms
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-600">Throughput</div>
                    <div className={`text-2xl font-bold ${getThroughputColor(totalThroughput)}`}>
                      {(totalThroughput * 100).toFixed(0)}%
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-600">Resource Usage</div>
                    <div className="flex space-x-2 mt-1">
                      {factors.cpu && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          CPU
                        </span>
                      )}
                      {factors.memory && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          Memory
                        </span>
                      )}
                      {factors.io && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          I/O
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-600">Recommendation</div>
                    <div className="text-sm mt-1">
                      {totalLatency < 100
                        ? '✅ Great for real-time'
                        : totalLatency < 500
                        ? '⚠️ Acceptable latency'
                        : '❌ Too slow for user-facing'
                      }
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Configure algorithms based on your system requirements
            </p>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Apply Configuration
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}