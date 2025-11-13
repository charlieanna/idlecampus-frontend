import React, { useState } from 'react';

interface DataModelSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (dataModel: string) => void;
}

const dataModels = [
  {
    value: 'relational',
    label: 'Relational',
    icon: '💾',
    desc: 'ACID, JOINs, complex queries',
    examples: 'User profiles, Orders, Transactions',
    best: 'Many-to-many relationships, ACID transactions required',
    useCases: ['E-commerce orders', 'Banking systems', 'User accounts']
  },
  {
    value: 'document',
    label: 'Document',
    icon: '📄',
    desc: 'Flexible schema, JSON-like',
    examples: 'Product catalogs, Content, Profiles',
    best: 'Self-contained entities, flexible/evolving schema',
    useCases: ['Content management', 'Product catalogs', 'User profiles']
  },
  {
    value: 'wide-column',
    label: 'Wide-Column',
    icon: '📊',
    desc: 'Column families, write-heavy',
    examples: 'Time-series, Logs, Analytics',
    best: 'Massive writes, time-series data',
    useCases: ['IoT data', 'Event logs', 'Analytics']
  },
  {
    value: 'graph',
    label: 'Graph',
    icon: '🔗',
    desc: 'Nodes & edges, traversals',
    examples: 'Social networks, Recommendations',
    best: 'Highly connected data, path queries',
    useCases: ['Social networks', 'Recommendation engines', 'Fraud detection']
  },
  {
    value: 'key-value',
    label: 'Key-Value',
    icon: '🔑',
    desc: 'Simple lookups, caching',
    examples: 'Sessions, Shopping carts, Feature flags',
    best: 'Simple key lookups only',
    useCases: ['Session storage', 'Caching', 'Feature flags']
  },
];

export function DataModelSelectionModal({ isOpen, onClose, onConfirm }: DataModelSelectionModalProps) {
  const [selectedModel, setSelectedModel] = useState<string>('relational');
  const [showDetails, setShowDetails] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(selectedModel);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6">
          <h2 className="text-2xl font-bold mb-2">Choose Your Database Data Model</h2>
          <p className="text-blue-100">
            This is the most important decision for your database. Select based on your data structure and query patterns.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dataModels.map((model) => (
              <div
                key={model.value}
                className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-lg ${
                  selectedModel === model.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedModel(model.value)}
              >
                {/* Selection indicator */}
                {selectedModel === model.value && (
                  <div className="absolute top-2 right-2">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <span className="text-3xl">{model.icon}</span>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{model.label}</h3>
                    <p className="text-sm text-gray-600 mb-2">{model.desc}</p>

                    <div className="space-y-1 text-xs">
                      <div>
                        <span className="font-medium text-gray-700">Examples:</span>{' '}
                        <span className="text-gray-600">{model.examples}</span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDetails(showDetails === model.value ? null : model.value);
                        }}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        {showDetails === model.value ? 'Hide' : 'Show'} use cases
                      </button>

                      {showDetails === model.value && (
                        <div className="mt-2 p-2 bg-gray-50 rounded">
                          <p className="font-medium text-gray-700 mb-1">Common use cases:</p>
                          <ul className="list-disc list-inside text-gray-600">
                            {model.useCases.map((useCase, i) => (
                              <li key={i}>{useCase}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Info box */}
          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-2">
              <span className="text-amber-600 text-lg">💡</span>
              <div className="text-sm">
                <p className="font-medium text-amber-900 mb-1">Pro Tip (DDIA Ch. 2)</p>
                <p className="text-amber-800">
                  The data model fundamentally determines how you think about the problem.
                  Choose based on your access patterns, not on what's popular.
                  <strong> For 90% of applications, Relational or Document will work fine.</strong>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t">
          <div className="text-sm text-gray-600">
            Selected: <span className="font-medium text-gray-900">
              {dataModels.find(m => m.value === selectedModel)?.label}
            </span>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Add Database with {dataModels.find(m => m.value === selectedModel)?.label} Model
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}