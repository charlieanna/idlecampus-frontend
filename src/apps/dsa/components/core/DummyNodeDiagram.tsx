import { Card } from '../ui/card';

export function DummyNodeDiagram() {
  return (
    <div className="space-y-8 my-8">
      {/* Without Dummy Node */}
      <Card className="p-6 border-2 border-red-200 bg-red-50">
        <h3 className="text-lg font-semibold text-red-900 mb-4 flex items-center gap-2">
          <span className="text-2xl">❌</span>
          Without Dummy Node - Complex!
        </h3>
        <p className="text-sm text-red-800 mb-4">
          Need special cases for head operations. Different logic for first node vs rest.
        </p>
        
        <div className="bg-white rounded-lg p-4 border border-red-300">
          <div className="text-center mb-4">
            <span className="text-xs font-semibold text-red-700">Removing value 2 from list</span>
          </div>
          
          {/* Initial State */}
          <div className="mb-6">
            <div className="text-xs text-slate-600 mb-2">Initial: [2, 1, 2, 3]</div>
            <svg width="100%" height="120" viewBox="0 0 500 120" className="border-b border-slate-200 pb-4">
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                  <polygon points="0 0, 10 3, 0 6" fill="#ef4444" />
                </marker>
              </defs>
              
              {/* Node 2 (head) */}
              <rect x="50" y="40" width="50" height="40" rx="5" fill="#fca5a5" stroke="#ef4444" strokeWidth="2" />
              <text x="75" y="65" textAnchor="middle" fill="#991b1b" fontSize="14" fontWeight="bold">2</text>
              <line x1="100" y1="60" x2="150" y2="60" stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrowhead)" />
              
              {/* Node 1 */}
              <rect x="150" y="40" width="50" height="40" rx="5" fill="#fca5a5" stroke="#ef4444" strokeWidth="2" />
              <text x="175" y="65" textAnchor="middle" fill="#991b1b" fontSize="14" fontWeight="bold">1</text>
              <line x1="200" y1="60" x2="250" y2="60" stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrowhead)" />
              
              {/* Node 2 */}
              <rect x="250" y="40" width="50" height="40" rx="5" fill="#fca5a5" stroke="#ef4444" strokeWidth="2" />
              <text x="275" y="65" textAnchor="middle" fill="#991b1b" fontSize="14" fontWeight="bold">2</text>
              <line x1="300" y1="60" x2="350" y2="60" stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrowhead)" />
              
              {/* Node 3 */}
              <rect x="350" y="40" width="50" height="40" rx="5" fill="#fca5a5" stroke="#ef4444" strokeWidth="2" />
              <text x="375" y="65" textAnchor="middle" fill="#991b1b" fontSize="14" fontWeight="bold">3</text>
              <text x="410" y="65" fill="#ef4444" fontSize="16">null</text>
              
              <text x="75" y="30" textAnchor="middle" fill="#ef4444" fontSize="10" fontWeight="bold">head</text>
            </svg>
          </div>
          
          {/* After Special Case Handling */}
          <div>
            <div className="text-xs text-slate-600 mb-2">Step 1: Special case - remove head (2)</div>
            <svg width="100%" height="120" viewBox="0 0 500 120">
              <defs>
                <marker id="arrowhead2" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                  <polygon points="0 0, 10 3, 0 6" fill="#ef4444" />
                </marker>
              </defs>
              
              {/* Node 1 (new head) */}
              <rect x="50" y="40" width="50" height="40" rx="5" fill="#fca5a5" stroke="#ef4444" strokeWidth="2" />
              <text x="75" y="65" textAnchor="middle" fill="#991b1b" fontSize="14" fontWeight="bold">1</text>
              <line x1="100" y1="60" x2="150" y2="60" stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrowhead2)" />
              
              {/* Node 2 */}
              <rect x="150" y="40" width="50" height="40" rx="5" fill="#fca5a5" stroke="#ef4444" strokeWidth="2" />
              <text x="175" y="65" textAnchor="middle" fill="#991b1b" fontSize="14" fontWeight="bold">2</text>
              <line x1="200" y1="60" x2="250" y2="60" stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrowhead2)" />
              
              {/* Node 3 */}
              <rect x="250" y="40" width="50" height="40" rx="5" fill="#fca5a5" stroke="#ef4444" strokeWidth="2" />
              <text x="275" y="65" textAnchor="middle" fill="#991b1b" fontSize="14" fontWeight="bold">3</text>
              <text x="310" y="65" fill="#ef4444" fontSize="16">null</text>
              
              <text x="75" y="30" textAnchor="middle" fill="#ef4444" fontSize="10" fontWeight="bold">head (updated)</text>
              <text x="50" y="95" fill="#ef4444" fontSize="10">⚠️ Special case needed!</text>
            </svg>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-red-100 rounded border border-red-300">
          <p className="text-xs text-red-900 font-semibold mb-1">Problems:</p>
          <ul className="text-xs text-red-800 space-y-1 list-disc list-inside">
            <li>Need to check if head needs removal (special case)</li>
            <li>Different logic for head vs middle nodes</li>
            <li>Easy to forget edge cases</li>
            <li>More code, more bugs!</li>
          </ul>
        </div>
      </Card>

      {/* With Dummy Node */}
      <Card className="p-6 border-2 border-green-200 bg-green-50">
        <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center gap-2">
          <span className="text-2xl">✅</span>
          With Dummy Node - Clean!
        </h3>
        <p className="text-sm text-green-800 mb-4">
          Same logic for all nodes. No special cases. Clean and maintainable.
        </p>
        
        <div className="bg-white rounded-lg p-4 border border-green-300">
          <div className="text-center mb-4">
            <span className="text-xs font-semibold text-green-700">Removing value 2 from list</span>
          </div>
          
          {/* Initial State with Dummy */}
          <div className="mb-6">
            <div className="text-xs text-slate-600 mb-2">Initial: dummy → [2, 1, 2, 3]</div>
            <svg width="100%" height="120" viewBox="0 0 500 120" className="border-b border-slate-200 pb-4">
              <defs>
                <marker id="arrowhead3" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                  <polygon points="0 0, 10 3, 0 6" fill="#10b981" />
                </marker>
              </defs>
              
              {/* Dummy Node */}
              <rect x="10" y="40" width="50" height="40" rx="5" fill="#86efac" stroke="#10b981" strokeWidth="2" strokeDasharray="5,5" />
              <text x="35" y="65" textAnchor="middle" fill="#065f46" fontSize="12" fontWeight="bold">dummy</text>
              <line x1="60" y1="60" x2="100" y2="60" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrowhead3)" />
              
              {/* Node 2 */}
              <rect x="100" y="40" width="50" height="40" rx="5" fill="#86efac" stroke="#10b981" strokeWidth="2" />
              <text x="125" y="65" textAnchor="middle" fill="#065f46" fontSize="14" fontWeight="bold">2</text>
              <line x1="150" y1="60" x2="200" y2="60" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrowhead3)" />
              
              {/* Node 1 */}
              <rect x="200" y="40" width="50" height="40" rx="5" fill="#86efac" stroke="#10b981" strokeWidth="2" />
              <text x="225" y="65" textAnchor="middle" fill="#065f46" fontSize="14" fontWeight="bold">1</text>
              <line x1="250" y1="60" x2="300" y2="60" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrowhead3)" />
              
              {/* Node 2 */}
              <rect x="300" y="40" width="50" height="40" rx="5" fill="#86efac" stroke="#10b981" strokeWidth="2" />
              <text x="325" y="65" textAnchor="middle" fill="#065f46" fontSize="14" fontWeight="bold">2</text>
              <line x1="350" y1="60" x2="400" y2="60" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrowhead3)" />
              
              {/* Node 3 */}
              <rect x="400" y="40" width="50" height="40" rx="5" fill="#86efac" stroke="#10b981" strokeWidth="2" />
              <text x="425" y="65" textAnchor="middle" fill="#065f46" fontSize="14" fontWeight="bold">3</text>
              <text x="460" y="65" fill="#10b981" fontSize="16">null</text>
              
              <text x="35" y="30" textAnchor="middle" fill="#10b981" fontSize="10" fontWeight="bold">dummy</text>
              <text x="125" y="30" textAnchor="middle" fill="#10b981" fontSize="10">head</text>
            </svg>
          </div>
          
          {/* After Processing */}
          <div>
            <div className="text-xs text-slate-600 mb-2">After: dummy → [1, 3] (removed all 2s)</div>
            <svg width="100%" height="120" viewBox="0 0 500 120">
              <defs>
                <marker id="arrowhead4" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                  <polygon points="0 0, 10 3, 0 6" fill="#10b981" />
                </marker>
              </defs>
              
              {/* Dummy Node */}
              <rect x="10" y="40" width="50" height="40" rx="5" fill="#86efac" stroke="#10b981" strokeWidth="2" strokeDasharray="5,5" />
              <text x="35" y="65" textAnchor="middle" fill="#065f46" fontSize="12" fontWeight="bold">dummy</text>
              <line x1="60" y1="60" x2="100" y2="60" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrowhead4)" />
              
              {/* Node 1 */}
              <rect x="100" y="40" width="50" height="40" rx="5" fill="#86efac" stroke="#10b981" strokeWidth="2" />
              <text x="125" y="65" textAnchor="middle" fill="#065f46" fontSize="14" fontWeight="bold">1</text>
              <line x1="150" y1="60" x2="200" y2="60" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrowhead4)" />
              
              {/* Node 3 */}
              <rect x="200" y="40" width="50" height="40" rx="5" fill="#86efac" stroke="#10b981" strokeWidth="2" />
              <text x="225" y="65" textAnchor="middle" fill="#065f46" fontSize="14" fontWeight="bold">3</text>
              <text x="260" y="65" fill="#10b981" fontSize="16">null</text>
              
              <text x="35" y="30" textAnchor="middle" fill="#10b981" fontSize="10" fontWeight="bold">dummy</text>
              <text x="125" y="30" textAnchor="middle" fill="#10b981" fontSize="10">head (dummy.next)</text>
              <text x="50" y="95" fill="#10b981" fontSize="10">✨ Same logic for all nodes!</text>
            </svg>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-green-100 rounded border border-green-300">
          <p className="text-xs text-green-900 font-semibold mb-1">Benefits:</p>
          <ul className="text-xs text-green-800 space-y-1 list-disc list-inside">
            <li><strong>No special case for head</strong> - dummy.next is the head!</li>
            <li><strong>Uniform logic</strong> - same code handles all positions</li>
            <li><strong>Automatically handles empty list</strong> - dummy.next = None</li>
            <li><strong>Less code, fewer bugs</strong></li>
          </ul>
        </div>
      </Card>
    </div>
  );
}

