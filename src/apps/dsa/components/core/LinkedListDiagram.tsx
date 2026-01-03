import { Card } from '../ui/card';

export function LinkedListStructureDiagram() {
  return (
    <div className="space-y-8 my-8">
      {/* Basic Node Structure */}
      <Card className="p-6 border-2 border-blue-200 bg-blue-50">
        <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
          <span className="text-2xl">🔗</span>
          Structure of a Linked List Node
        </h3>
        <p className="text-sm text-blue-800 mb-4">
          Each node has two parts: <strong>data</strong> (the value) and <strong>next</strong> (pointer to the next node).
        </p>

        <div className="bg-white rounded-lg p-4 border border-blue-300">
          <svg width="100%" height="160" viewBox="0 0 400 160">
            {/* Single Node Detailed View */}
            <rect x="100" y="30" width="200" height="80" rx="8" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2" />

            {/* Divider */}
            <line x1="200" y1="30" x2="200" y2="110" stroke="#3b82f6" strokeWidth="2" />

            {/* Data section */}
            <text x="150" y="55" textAnchor="middle" fill="#1e40af" fontSize="12" fontWeight="bold">DATA</text>
            <text x="150" y="85" textAnchor="middle" fill="#1e3a8a" fontSize="24" fontWeight="bold">42</text>

            {/* Next section */}
            <text x="250" y="55" textAnchor="middle" fill="#1e40af" fontSize="12" fontWeight="bold">NEXT</text>
            <circle cx="250" cy="80" r="8" fill="#3b82f6" />
            <line x1="258" y1="80" x2="300" y2="80" stroke="#3b82f6" strokeWidth="2" />
            <polygon points="295,75 305,80 295,85" fill="#3b82f6" />

            {/* Labels */}
            <text x="150" y="135" textAnchor="middle" fill="#64748b" fontSize="11">stores the value</text>
            <text x="250" y="135" textAnchor="middle" fill="#64748b" fontSize="11">points to next node</text>
          </svg>
        </div>
      </Card>

      {/* Complete Linked List */}
      <Card className="p-6 border-2 border-purple-200 bg-purple-50">
        <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center gap-2">
          <span className="text-2xl">📋</span>
          Complete Linked List: 1 → 2 → 3 → None
        </h3>
        <p className="text-sm text-purple-800 mb-4">
          The <strong>head</strong> pointer gives us access to the first node. From there, we follow <code className="bg-purple-200 px-1 rounded">next</code> pointers to reach any node.
        </p>

        <div className="bg-white rounded-lg p-4 border border-purple-300">
          <svg width="100%" height="140" viewBox="0 0 550 140">
            <defs>
              <marker id="arrow-purple" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                <polygon points="0 0, 10 3, 0 6" fill="#9333ea" />
              </marker>
            </defs>

            {/* Head pointer */}
            <text x="25" y="55" textAnchor="middle" fill="#9333ea" fontSize="12" fontWeight="bold">head</text>
            <circle cx="25" cy="70" r="6" fill="#9333ea" />
            <line x1="31" y1="70" x2="60" y2="70" stroke="#9333ea" strokeWidth="2" markerEnd="url(#arrow-purple)" />

            {/* Node 1 */}
            <rect x="65" y="45" width="90" height="50" rx="6" fill="#f3e8ff" stroke="#9333ea" strokeWidth="2" />
            <line x1="110" y1="45" x2="110" y2="95" stroke="#9333ea" strokeWidth="1" strokeDasharray="3,3" />
            <text x="88" y="75" textAnchor="middle" fill="#581c87" fontSize="18" fontWeight="bold">1</text>
            <circle cx="130" cy="70" r="5" fill="#9333ea" />

            {/* Arrow 1 to 2 */}
            <line x1="155" y1="70" x2="185" y2="70" stroke="#9333ea" strokeWidth="2" markerEnd="url(#arrow-purple)" />

            {/* Node 2 */}
            <rect x="190" y="45" width="90" height="50" rx="6" fill="#f3e8ff" stroke="#9333ea" strokeWidth="2" />
            <line x1="235" y1="45" x2="235" y2="95" stroke="#9333ea" strokeWidth="1" strokeDasharray="3,3" />
            <text x="213" y="75" textAnchor="middle" fill="#581c87" fontSize="18" fontWeight="bold">2</text>
            <circle cx="255" cy="70" r="5" fill="#9333ea" />

            {/* Arrow 2 to 3 */}
            <line x1="280" y1="70" x2="310" y2="70" stroke="#9333ea" strokeWidth="2" markerEnd="url(#arrow-purple)" />

            {/* Node 3 */}
            <rect x="315" y="45" width="90" height="50" rx="6" fill="#f3e8ff" stroke="#9333ea" strokeWidth="2" />
            <line x1="360" y1="45" x2="360" y2="95" stroke="#9333ea" strokeWidth="1" strokeDasharray="3,3" />
            <text x="338" y="75" textAnchor="middle" fill="#581c87" fontSize="18" fontWeight="bold">3</text>
            <circle cx="380" cy="70" r="5" fill="#9333ea" />

            {/* Arrow to None */}
            <line x1="405" y1="70" x2="435" y2="70" stroke="#9333ea" strokeWidth="2" markerEnd="url(#arrow-purple)" />

            {/* None/Null */}
            <rect x="440" y="55" width="60" height="30" rx="4" fill="#faf5ff" stroke="#9333ea" strokeWidth="1" strokeDasharray="4,4" />
            <text x="470" y="75" textAnchor="middle" fill="#9333ea" fontSize="14" fontWeight="bold">None</text>

            {/* Labels for val and next */}
            <text x="88" y="115" textAnchor="middle" fill="#a855f7" fontSize="10">val</text>
            <text x="130" y="115" textAnchor="middle" fill="#a855f7" fontSize="10">next</text>
          </svg>
        </div>

        <div className="mt-4 p-3 bg-purple-100 rounded border border-purple-300">
          <p className="text-xs text-purple-900">
            <strong>Key insight:</strong> We can only access nodes by starting at <code className="bg-purple-200 px-1 rounded">head</code> and following pointers.
            Unlike arrays, we can't jump directly to any position!
          </p>
        </div>
      </Card>

      {/* Traversal Animation */}
      <Card className="p-6 border-2 border-emerald-200 bg-emerald-50">
        <h3 className="text-lg font-semibold text-emerald-900 mb-4 flex items-center gap-2">
          <span className="text-2xl">🚶</span>
          Traversing a Linked List
        </h3>
        <p className="text-sm text-emerald-800 mb-4">
          We use a <code className="bg-emerald-200 px-1 rounded">current</code> pointer that starts at <code className="bg-emerald-200 px-1 rounded">head</code> and moves through each node.
        </p>

        <div className="bg-white rounded-lg p-4 border border-emerald-300">
          {/* Step by step traversal */}
          <div className="space-y-4">
            {/* Step 1 */}
            <div className="border-b border-emerald-200 pb-3">
              <div className="text-xs text-emerald-700 font-semibold mb-2">Step 1: current = head (points to first node)</div>
              <svg width="100%" height="80" viewBox="0 0 450 80">
                <defs>
                  <marker id="arrow-emerald" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                    <polygon points="0 0, 10 3, 0 6" fill="#10b981" />
                  </marker>
                </defs>

                {/* Current pointer */}
                <text x="65" y="15" textAnchor="middle" fill="#059669" fontSize="10" fontWeight="bold">current ▼</text>

                {/* Highlighted Node 1 */}
                <rect x="30" y="25" width="70" height="40" rx="5" fill="#d1fae5" stroke="#10b981" strokeWidth="3" />
                <text x="65" y="50" textAnchor="middle" fill="#065f46" fontSize="16" fontWeight="bold">1</text>

                {/* Arrow */}
                <line x1="100" y1="45" x2="130" y2="45" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrow-emerald)" />

                {/* Node 2 */}
                <rect x="135" y="25" width="70" height="40" rx="5" fill="#ecfdf5" stroke="#6ee7b7" strokeWidth="2" />
                <text x="170" y="50" textAnchor="middle" fill="#065f46" fontSize="16">2</text>

                {/* Arrow */}
                <line x1="205" y1="45" x2="235" y2="45" stroke="#6ee7b7" strokeWidth="2" markerEnd="url(#arrow-emerald)" />

                {/* Node 3 */}
                <rect x="240" y="25" width="70" height="40" rx="5" fill="#ecfdf5" stroke="#6ee7b7" strokeWidth="2" />
                <text x="275" y="50" textAnchor="middle" fill="#065f46" fontSize="16">3</text>

                {/* Arrow to None */}
                <line x1="310" y1="45" x2="340" y2="45" stroke="#6ee7b7" strokeWidth="2" markerEnd="url(#arrow-emerald)" />
                <text x="370" y="50" fill="#6ee7b7" fontSize="12">None</text>

                <text x="420" y="50" fill="#10b981" fontSize="11">→ print(1)</text>
              </svg>
            </div>

            {/* Step 2 */}
            <div className="border-b border-emerald-200 pb-3">
              <div className="text-xs text-emerald-700 font-semibold mb-2">Step 2: current = current.next (move to second node)</div>
              <svg width="100%" height="80" viewBox="0 0 450 80">
                {/* Node 1 - visited */}
                <rect x="30" y="25" width="70" height="40" rx="5" fill="#f0fdf4" stroke="#bbf7d0" strokeWidth="1" />
                <text x="65" y="50" textAnchor="middle" fill="#86efac" fontSize="16">1</text>

                {/* Arrow */}
                <line x1="100" y1="45" x2="130" y2="45" stroke="#bbf7d0" strokeWidth="2" />

                {/* Current pointer */}
                <text x="170" y="15" textAnchor="middle" fill="#059669" fontSize="10" fontWeight="bold">current ▼</text>

                {/* Highlighted Node 2 */}
                <rect x="135" y="25" width="70" height="40" rx="5" fill="#d1fae5" stroke="#10b981" strokeWidth="3" />
                <text x="170" y="50" textAnchor="middle" fill="#065f46" fontSize="16" fontWeight="bold">2</text>

                {/* Arrow */}
                <line x1="205" y1="45" x2="235" y2="45" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrow-emerald)" />

                {/* Node 3 */}
                <rect x="240" y="25" width="70" height="40" rx="5" fill="#ecfdf5" stroke="#6ee7b7" strokeWidth="2" />
                <text x="275" y="50" textAnchor="middle" fill="#065f46" fontSize="16">3</text>

                {/* Arrow to None */}
                <line x1="310" y1="45" x2="340" y2="45" stroke="#6ee7b7" strokeWidth="2" />
                <text x="370" y="50" fill="#6ee7b7" fontSize="12">None</text>

                <text x="420" y="50" fill="#10b981" fontSize="11">→ print(2)</text>
              </svg>
            </div>

            {/* Step 3 */}
            <div className="border-b border-emerald-200 pb-3">
              <div className="text-xs text-emerald-700 font-semibold mb-2">Step 3: current = current.next (move to third node)</div>
              <svg width="100%" height="80" viewBox="0 0 450 80">
                {/* Node 1 - visited */}
                <rect x="30" y="25" width="70" height="40" rx="5" fill="#f0fdf4" stroke="#bbf7d0" strokeWidth="1" />
                <text x="65" y="50" textAnchor="middle" fill="#86efac" fontSize="16">1</text>

                {/* Arrow */}
                <line x1="100" y1="45" x2="130" y2="45" stroke="#bbf7d0" strokeWidth="2" />

                {/* Node 2 - visited */}
                <rect x="135" y="25" width="70" height="40" rx="5" fill="#f0fdf4" stroke="#bbf7d0" strokeWidth="1" />
                <text x="170" y="50" textAnchor="middle" fill="#86efac" fontSize="16">2</text>

                {/* Arrow */}
                <line x1="205" y1="45" x2="235" y2="45" stroke="#bbf7d0" strokeWidth="2" />

                {/* Current pointer */}
                <text x="275" y="15" textAnchor="middle" fill="#059669" fontSize="10" fontWeight="bold">current ▼</text>

                {/* Highlighted Node 3 */}
                <rect x="240" y="25" width="70" height="40" rx="5" fill="#d1fae5" stroke="#10b981" strokeWidth="3" />
                <text x="275" y="50" textAnchor="middle" fill="#065f46" fontSize="16" fontWeight="bold">3</text>

                {/* Arrow to None */}
                <line x1="310" y1="45" x2="340" y2="45" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrow-emerald)" />
                <text x="370" y="50" fill="#6ee7b7" fontSize="12">None</text>

                <text x="420" y="50" fill="#10b981" fontSize="11">→ print(3)</text>
              </svg>
            </div>

            {/* Step 4 */}
            <div>
              <div className="text-xs text-emerald-700 font-semibold mb-2">Step 4: current = current.next → current is None → STOP!</div>
              <svg width="100%" height="80" viewBox="0 0 450 80">
                {/* All nodes visited */}
                <rect x="30" y="25" width="70" height="40" rx="5" fill="#f0fdf4" stroke="#bbf7d0" strokeWidth="1" />
                <text x="65" y="50" textAnchor="middle" fill="#86efac" fontSize="16">1</text>
                <line x1="100" y1="45" x2="130" y2="45" stroke="#bbf7d0" strokeWidth="2" />

                <rect x="135" y="25" width="70" height="40" rx="5" fill="#f0fdf4" stroke="#bbf7d0" strokeWidth="1" />
                <text x="170" y="50" textAnchor="middle" fill="#86efac" fontSize="16">2</text>
                <line x1="205" y1="45" x2="235" y2="45" stroke="#bbf7d0" strokeWidth="2" />

                <rect x="240" y="25" width="70" height="40" rx="5" fill="#f0fdf4" stroke="#bbf7d0" strokeWidth="1" />
                <text x="275" y="50" textAnchor="middle" fill="#86efac" fontSize="16">3</text>
                <line x1="310" y1="45" x2="340" y2="45" stroke="#bbf7d0" strokeWidth="2" />

                {/* Current pointer at None */}
                <text x="370" y="15" textAnchor="middle" fill="#ef4444" fontSize="10" fontWeight="bold">current ▼</text>
                <rect x="345" y="25" width="55" height="40" rx="5" fill="#fef2f2" stroke="#ef4444" strokeWidth="2" strokeDasharray="4,4" />
                <text x="372" y="50" textAnchor="middle" fill="#ef4444" fontSize="12" fontWeight="bold">None</text>

                <text x="430" y="50" fill="#ef4444" fontSize="11">→ Done!</text>
              </svg>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-emerald-100 rounded border border-emerald-300">
          <p className="text-xs text-emerald-900">
            <strong>Pattern:</strong> <code className="bg-emerald-200 px-1 rounded">while current:</code> loops until we hit <code className="bg-emerald-200 px-1 rounded">None</code> (end of list).
          </p>
        </div>
      </Card>

      {/* Memory Layout Comparison */}
      <Card className="p-6 border-2 border-amber-200 bg-amber-50">
        <h3 className="text-lg font-semibold text-amber-900 mb-4 flex items-center gap-2">
          <span className="text-2xl">💾</span>
          Memory: Array vs Linked List
        </h3>
        <p className="text-sm text-amber-800 mb-4">
          Arrays store elements <strong>contiguously</strong> (next to each other). Linked list nodes are <strong>scattered</strong> in memory!
        </p>

        <div className="bg-white rounded-lg p-4 border border-amber-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Array Memory */}
            <div>
              <div className="text-center text-sm font-semibold text-amber-800 mb-2">Array: [10, 20, 30]</div>
              <svg width="100%" height="120" viewBox="0 0 220 120">
                <text x="10" y="20" fill="#92400e" fontSize="10">Memory Address:</text>

                {/* Memory cells */}
                <rect x="10" y="30" width="60" height="40" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" />
                <text x="40" y="55" textAnchor="middle" fill="#92400e" fontSize="16" fontWeight="bold">10</text>
                <text x="40" y="85" textAnchor="middle" fill="#d97706" fontSize="9">0x100</text>

                <rect x="70" y="30" width="60" height="40" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" />
                <text x="100" y="55" textAnchor="middle" fill="#92400e" fontSize="16" fontWeight="bold">20</text>
                <text x="100" y="85" textAnchor="middle" fill="#d97706" fontSize="9">0x104</text>

                <rect x="130" y="30" width="60" height="40" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" />
                <text x="160" y="55" textAnchor="middle" fill="#92400e" fontSize="16" fontWeight="bold">30</text>
                <text x="160" y="85" textAnchor="middle" fill="#d97706" fontSize="9">0x108</text>

                <text x="100" y="110" textAnchor="middle" fill="#10b981" fontSize="10" fontWeight="bold">✓ Contiguous!</text>
              </svg>
            </div>

            {/* Linked List Memory */}
            <div>
              <div className="text-center text-sm font-semibold text-amber-800 mb-2">Linked List: 10 → 20 → 30</div>
              <svg width="100%" height="120" viewBox="0 0 220 120">
                <defs>
                  <marker id="arrow-amber" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                    <polygon points="0 0, 10 3, 0 6" fill="#f59e0b" />
                  </marker>
                </defs>

                <text x="10" y="20" fill="#92400e" fontSize="10">Scattered in Memory:</text>

                {/* Node at 0x500 */}
                <rect x="140" y="25" width="50" height="30" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" />
                <text x="165" y="45" textAnchor="middle" fill="#92400e" fontSize="12" fontWeight="bold">10</text>
                <text x="165" y="65" textAnchor="middle" fill="#d97706" fontSize="8">0x500</text>

                {/* Node at 0x248 */}
                <rect x="10" y="70" width="50" height="30" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" />
                <text x="35" y="90" textAnchor="middle" fill="#92400e" fontSize="12" fontWeight="bold">20</text>
                <text x="35" y="110" textAnchor="middle" fill="#d97706" fontSize="8">0x248</text>

                {/* Node at 0x834 */}
                <rect x="85" y="70" width="50" height="30" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" />
                <text x="110" y="90" textAnchor="middle" fill="#92400e" fontSize="12" fontWeight="bold">30</text>
                <text x="110" y="110" textAnchor="middle" fill="#d97706" fontSize="8">0x834</text>

                {/* Arrows showing pointers */}
                <path d="M 165 55 Q 165 85, 60 85" stroke="#f59e0b" strokeWidth="1.5" fill="none" markerEnd="url(#arrow-amber)" />
                <path d="M 60 85 L 85 85" stroke="#f59e0b" strokeWidth="1.5" fill="none" markerEnd="url(#arrow-amber)" />
              </svg>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="p-2 bg-green-100 rounded border border-green-300">
            <p className="text-xs text-green-800"><strong>Array advantage:</strong> Fast random access (O(1)) - jump directly to any index!</p>
          </div>
          <div className="p-2 bg-purple-100 rounded border border-purple-300">
            <p className="text-xs text-purple-800"><strong>Linked List advantage:</strong> Fast insert/delete (O(1)) - just update pointers!</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
