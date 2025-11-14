import { useState } from 'react';

export function StorageAPIReference() {
  const [isExpanded, setIsExpanded] = useState(true);  // Start expanded by default

  return (
    <div className="bg-blue-50 border-2 border-blue-300 rounded-lg mb-4 shadow-md">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-blue-100 transition-colors rounded-t-lg"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">📦</span>
          <span className="font-semibold text-blue-900">Storage API Reference</span>
          <span className="text-xs text-white bg-blue-600 px-2 py-0.5 rounded animate-pulse">Use These Methods!</span>
        </div>
        <span className="text-blue-700 text-lg">
          {isExpanded ? '▼' : '▶'}
        </span>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-4">
          <div className="text-sm text-blue-800 bg-white rounded p-3 border border-blue-200">
            <p className="font-medium mb-2">💡 These methods provide in-memory storage for your URL shortener:</p>
            <ul className="space-y-1 text-xs text-blue-700">
              <li>• All data is stored in memory during test execution</li>
              <li>• In production, this would connect to real databases and caches</li>
              <li>• The same storage is used throughout the test to maintain state</li>
            </ul>
          </div>

          <div className="space-y-3">
            {/* Storage Operations */}
            <div className="bg-white rounded-lg p-3 border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2 text-sm">📦 Storage Operations</h4>
              <div className="space-y-2">
                <APIMethod
                  signature="store(key: str, value: Any) → bool"
                  description="Save a key-value pair in memory"
                  example='store("abc123", "https://example.com")'
                />
                <APIMethod
                  signature="retrieve(key: str) → Optional[Any]"
                  description="Get a value by key (returns None if not found)"
                  example='url = retrieve("abc123")'
                />
                <APIMethod
                  signature="exists(key: str) → bool"
                  description="Check if a key exists in storage"
                  example='if exists("abc123"):'
                />
              </div>
            </div>

            {/* Best Practices */}
            <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-300">
              <h4 className="font-semibold text-yellow-900 mb-2 text-sm">✨ Implementation Tips</h4>
              <ul className="space-y-1 text-xs text-yellow-800">
                <li>• <strong>Duplicate URLs:</strong> Check if URL already exists before creating new code</li>
                <li>• <strong>Collision Handling:</strong> If hash already exists, append counter (e.g., "abc123" → "abc1231")</li>
                <li>• <strong>Invalid Input:</strong> Return None for empty or invalid inputs</li>
                <li>• <strong>Consistency:</strong> Same URL should always return the same short code</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface APIMethodProps {
  signature: string;
  description: string;
  example: string;
}

function APIMethod({ signature, description, example }: APIMethodProps) {
  return (
    <div className="border-l-2 border-blue-300 pl-3 py-1">
      <div className="font-mono text-xs text-blue-900 font-semibold">{signature}</div>
      <div className="text-xs text-gray-700 mt-1">{description}</div>
      <div className="text-xs text-gray-600 mt-1">
        <span className="font-medium">Example:</span> <code className="bg-gray-100 px-1 rounded text-blue-700">{example}</code>
      </div>
    </div>
  );
}