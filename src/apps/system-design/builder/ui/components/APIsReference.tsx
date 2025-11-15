/**
 * APIs Reference Panel
 * Shows available APIs for the execution context
 * All APIs use the same in-memory storage by default
 */

import React from 'react';

export const APIsReference: React.FC = () => {
  return (
    <div className="p-6 space-y-6 bg-white rounded-lg">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Available APIs</h2>
        <p className="text-gray-600">
          Your Python code has access to multiple APIs. <strong>All APIs use the same in-memory storage</strong> -
          you can use whichever style you prefer!
        </p>
      </div>

      <div className="space-y-8">
        {/* Direct Context Access */}
        <div className="border-l-4 border-blue-500 pl-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            1. Direct Context Access (Dictionary-style)
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            The simplest approach - use context like a Python dictionary.
          </p>
          <div className="bg-gray-50 rounded p-4 font-mono text-sm">
            <div className="text-green-600"># Store data</div>
            <div>context['url_mappings'] = {'{}'}</div>
            <div>context['next_id'] = 0</div>
            <div className="mt-2 text-green-600"># Retrieve data</div>
            <div>mappings = context.get('url_mappings', {'{}'} )</div>
            <div>next_id = context.get('next_id', 0)</div>
          </div>
        </div>

        {/* Database API */}
        <div className="border-l-4 border-purple-500 pl-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            2. Database API
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            Database-style API with familiar methods. Uses the same storage as above!
          </p>
          <div className="bg-gray-50 rounded p-4 font-mono text-sm">
            <div className="text-green-600"># Store data</div>
            <div>context.db.set('short_abc', 'https://example.com')</div>
            <div>context.db.insert('short_xyz', 'https://google.com')</div>
            <div className="mt-2 text-green-600"># Retrieve data</div>
            <div>url = context.db.get('short_abc')</div>
            <div className="mt-2 text-green-600"># Check existence</div>
            <div>if context.db.exists('short_abc'):</div>
            <div className="ml-4">print("Found it!")</div>
            <div className="mt-2 text-green-600"># Generate unique IDs</div>
            <div>id = context.db.get_next_id()  # Returns 1, 2, 3...</div>
          </div>
        </div>

        {/* Cache API */}
        <div className="border-l-4 border-orange-500 pl-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            3. Cache API
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            Redis-style caching API with TTL support. Same storage as db and direct access!
          </p>
          <div className="bg-gray-50 rounded p-4 font-mono text-sm">
            <div className="text-green-600"># Store with TTL (time to live)</div>
            <div>context.cache.set('user_session', user_data, ttl=3600)  # 1 hour</div>
            <div className="mt-2 text-green-600"># Retrieve</div>
            <div>user = context.cache.get('user_session')</div>
            <div className="mt-2 text-green-600"># Check existence</div>
            <div>if context.cache.exists('user_session'):</div>
            <div className="ml-4">print("Session active")</div>
            <div className="mt-2 text-green-600"># Delete</div>
            <div>context.cache.delete('user_session')</div>
          </div>
        </div>

        {/* Key Insight */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="text-2xl">💡</div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Key Insight: They're All The Same!</h3>
              <p className="text-sm text-blue-800 mb-2">
                All three APIs access the <strong>same in-memory storage</strong>. This means:
              </p>
              <ul className="text-sm text-blue-800 space-y-1 ml-4 list-disc">
                <li>Data stored via <code>context['key']</code> can be read via <code>context.db.get('key')</code></li>
                <li>Data stored via <code>context.db.set()</code> can be read via <code>context.cache.get()</code></li>
                <li>They all share the same memory space</li>
              </ul>
            </div>
          </div>
        </div>

        {/* When to Add Components */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="text-2xl">⚠️</div>
            <div>
              <h3 className="font-semibold text-yellow-900 mb-2">When Should You Add Database/Cache Components?</h3>
              <p className="text-sm text-yellow-800 mb-2">
                <strong>In-memory storage is VOLATILE</strong> - data is lost when the app server restarts!
              </p>
              <ul className="text-sm text-yellow-800 space-y-2 ml-4 list-disc">
                <li>
                  <strong>No components:</strong> Data lives in app server memory only
                  <br />
                  <span className="text-xs">→ Lost on restart! Good for learning, bad for production</span>
                </li>
                <li>
                  <strong>Add Database component:</strong> Data persists across restarts
                  <br />
                  <span className="text-xs">→ Required for production systems</span>
                </li>
                <li>
                  <strong>Add Cache component:</strong> Faster reads, reduce database load
                  <br />
                  <span className="text-xs">→ Improves performance for read-heavy workloads</span>
                </li>
              </ul>
              <p className="text-sm text-yellow-800 mt-3">
                💡 <strong>Try it:</strong> Submit your design with just Client → App Server, then look for test cases
                that simulate app server restarts. You'll see why persistence is important!
              </p>
            </div>
          </div>
        </div>

        {/* Progressive Enhancement */}
        <div className="border-t pt-4">
          <h3 className="font-semibold text-gray-900 mb-3">Progressive Enhancement Path</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                1
              </div>
              <div className="text-sm text-gray-700">
                <strong>Start Simple:</strong> Client → App Server with in-memory storage
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-semibold">
                2
              </div>
              <div className="text-sm text-gray-700">
                <strong>Add Persistence:</strong> Connect Database component for data durability
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-semibold">
                3
              </div>
              <div className="text-sm text-gray-700">
                <strong>Optimize Performance:</strong> Add Cache component for faster reads
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-semibold">
                4
              </div>
              <div className="text-sm text-gray-700">
                <strong>Scale Further:</strong> Add load balancer, multiple app servers, etc.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
