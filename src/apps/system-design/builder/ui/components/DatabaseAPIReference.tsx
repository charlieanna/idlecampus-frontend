import { useState } from 'react';

export function DatabaseAPIReference() {
  const [isExpanded, setIsExpanded] = useState(true);  // Start expanded by default

  return (
    <div className="bg-blue-50 border-2 border-blue-300 rounded-lg mb-4 shadow-md">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-blue-100 transition-colors rounded-t-lg"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">📖</span>
          <span className="font-semibold text-blue-900">Database Helper API Reference</span>
          <span className="text-xs text-white bg-blue-600 px-2 py-0.5 rounded animate-pulse">Use These Methods!</span>
        </div>
        <span className="text-blue-700 text-lg">
          {isExpanded ? '▼' : '▶'}
        </span>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-4">
          <div className="text-sm text-blue-800 bg-white rounded p-3 border border-blue-200">
            <p className="font-medium mb-2">💡 These helpers simulate real database operations:</p>
            <ul className="space-y-1 text-xs text-blue-700">
              <li>• In production, these would be actual database queries and Redis commands</li>
              <li>• They respect the components you add to your canvas (Database, Cache)</li>
              <li>• Latencies simulate real network delays (~10ms writes, ~5ms reads)</li>
              <li>• Available in both Learn Mode and Challenge Mode</li>
            </ul>
          </div>

          <div className="space-y-3">
            {/* Database Operations */}
            <div className="bg-white rounded-lg p-3 border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2 text-sm">🗄️ Database Operations</h4>
              <div className="space-y-2">
                <APIMethod
                  signature="db_write(table: str, key: str, value: Any) → bool"
                  description="Write data to database (INSERT/UPDATE)"
                  realWorld="PostgreSQL: INSERT INTO table (key, value) VALUES (?, ?)"
                  example='db_write("urls", "abc123", "https://example.com")'
                />
                <APIMethod
                  signature="db_read(table: str, key: str) → Optional[Any]"
                  description="Read data from database (SELECT)"
                  realWorld="PostgreSQL: SELECT value FROM table WHERE key = ?"
                  example='url = db_read("urls", "abc123")'
                />
                <APIMethod
                  signature="db_exists(table: str, key: str) → bool"
                  description="Check if key exists in database"
                  realWorld="PostgreSQL: SELECT EXISTS(SELECT 1 FROM table WHERE key = ?)"
                  example='if db_exists("urls", "abc123"):'
                />
              </div>
            </div>

            {/* Cache Operations */}
            <div className="bg-white rounded-lg p-3 border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2 text-sm">⚡ Cache Operations</h4>
              <div className="space-y-2">
                <APIMethod
                  signature="cache_set(key: str, value: Any, ttl: int = 3600) → bool"
                  description="Store data in cache with expiration"
                  realWorld="Redis: SETEX key ttl value"
                  example='cache_set("url:abc123", "https://example.com", ttl=3600)'
                />
                <APIMethod
                  signature="cache_get(key: str) → Optional[Any]"
                  description="Retrieve data from cache"
                  realWorld="Redis: GET key"
                  example='cached_url = cache_get("url:abc123")'
                />
              </div>
            </div>

            {/* Best Practices */}
            <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-300">
              <h4 className="font-semibold text-yellow-900 mb-2 text-sm">✨ Best Practices</h4>
              <ul className="space-y-1 text-xs text-yellow-800">
                <li>• <strong>Cache-aside pattern:</strong> Check cache first, fallback to database</li>
                <li>• <strong>Write-through:</strong> Write to database, then update cache</li>
                <li>• <strong>TTL strategy:</strong> Use appropriate TTL based on data freshness needs</li>
                <li>• <strong>Key naming:</strong> Use prefixes like "url:", "user:" for organization</li>
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
  realWorld: string;
  example: string;
}

function APIMethod({ signature, description, realWorld, example }: APIMethodProps) {
  return (
    <div className="border-l-2 border-blue-300 pl-3 py-1">
      <div className="font-mono text-xs text-blue-900 font-semibold">{signature}</div>
      <div className="text-xs text-gray-700 mt-1">{description}</div>
      <div className="text-xs text-gray-600 mt-1">
        <span className="font-medium">Real-world:</span> <code className="bg-gray-100 px-1 rounded">{realWorld}</code>
      </div>
      <div className="text-xs text-gray-600 mt-1">
        <span className="font-medium">Example:</span> <code className="bg-gray-100 px-1 rounded text-blue-700">{example}</code>
      </div>
    </div>
  );
}