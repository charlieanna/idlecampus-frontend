import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Search, CheckCircle2, XCircle } from 'lucide-react';

/**
 * Interactive visualization showing the difference between word search and prefix search
 */

export function TrieSearchVisualization() {
  const [searchType, setSearchType] = useState<'word' | 'prefix'>('word');
  const [searchQuery, setSearchQuery] = useState('cat');
  const [isSearching, setIsSearching] = useState(false);
  const [currentChar, setCurrentChar] = useState(-1);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  // Mock trie structure (cat, car, dog are inserted)
  const trieStructure = {
    c: {
      a: {
        t: { isEnd: true, children: {} },
        r: { isEnd: true, children: {} },
      },
    },
    d: {
      o: {
        g: { isEnd: true, children: {} },
      },
    },
  };

  const runSearch = async () => {
    setIsSearching(true);
    setResult(null);
    setCurrentChar(-1);

    const query = searchQuery.toLowerCase();

    // Simulate stepping through each character
    for (let i = 0; i < query.length; i++) {
      setCurrentChar(i);
      await new Promise((resolve) => setTimeout(resolve, 600));
    }

    // Check result based on search type
    await new Promise((resolve) => setTimeout(resolve, 400));

    // Simple mock logic
    const validWords = ['cat', 'car', 'dog'];
    const validPrefixes = ['c', 'ca', 'cat', 'car', 'd', 'do', 'dog'];

    if (searchType === 'word') {
      if (validWords.includes(query)) {
        setResult({
          success: true,
          message: `"${query}" found! Path exists AND is_end = True ✓`,
        });
      } else if (validPrefixes.includes(query)) {
        setResult({
          success: false,
          message: `"${query}" - Path exists but is_end = False (prefix only, not a complete word)`,
        });
      } else {
        setResult({
          success: false,
          message: `"${query}" - Path does not exist in trie`,
        });
      }
    } else {
      // prefix search
      if (validPrefixes.includes(query) || validWords.includes(query)) {
        setResult({
          success: true,
          message: `Prefix "${query}" found! Path exists (no need to check is_end) ✓`,
        });
      } else {
        setResult({
          success: false,
          message: `Prefix "${query}" - Path does not exist in trie`,
        });
      }
    }

    setIsSearching(false);
  };

  const examples = {
    word: [
      { query: 'cat', result: 'Found (complete word)' },
      { query: 'ca', result: 'Not found (prefix only)' },
      { query: 'dog', result: 'Found (complete word)' },
      { query: 'zebra', result: 'Not found (no path)' },
    ],
    prefix: [
      { query: 'ca', result: 'Found (prefix exists)' },
      { query: 'car', result: 'Found (also a complete word)' },
      { query: 'do', result: 'Found (prefix exists)' },
      { query: 'zebra', result: 'Not found (no path)' },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Search Type Selector */}
      <div className="flex justify-center gap-4">
        <Button
          onClick={() => setSearchType('word')}
          className={
            searchType === 'word'
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-slate-300 hover:bg-slate-400'
          }
        >
          Word Search
        </Button>
        <Button
          onClick={() => setSearchType('prefix')}
          className={
            searchType === 'prefix'
              ? 'bg-purple-600 hover:bg-purple-700'
              : 'bg-slate-300 hover:bg-slate-400'
          }
        >
          Prefix Search (starts_with)
        </Button>
      </div>

      {/* Description */}
      <Card
        className={`p-4 ${
          searchType === 'word'
            ? 'bg-blue-50 border-blue-200'
            : 'bg-purple-50 border-purple-200'
        }`}
      >
        <h4
          className={`mb-2 ${
            searchType === 'word' ? 'text-blue-900' : 'text-purple-900'
          }`}
        >
          {searchType === 'word' ? 'Word Search' : 'Prefix Search (starts_with)'}
        </h4>
        <p className="text-sm text-slate-700">
          {searchType === 'word'
            ? 'Checks if the EXACT word exists. Must follow path AND have is_end = True.'
            : 'Checks if ANY word starts with this prefix. Only needs path to exist, ignores is_end.'}
        </p>
      </Card>

      {/* Search Input and Visualization */}
      <Card className="p-6 bg-slate-50 border-slate-200">
        <div className="mb-4 flex gap-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter search query..."
            className="flex-1 px-4 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button
            onClick={runSearch}
            disabled={isSearching || !searchQuery.trim()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Search className="w-4 h-4 mr-2" />
            {isSearching ? 'Searching...' : 'Search'}
          </Button>
        </div>

        {/* Visual Trie with Highlighted Path */}
        <div className="bg-white rounded-lg p-6 border-2 border-slate-200 mb-4">
          <div className="text-center mb-4 text-sm text-slate-600">
            Trie contains: "cat", "car", "dog"
          </div>

          {/* Simple tree visualization */}
          <div className="flex justify-center">
            <svg width="400" height="250" viewBox="0 0 400 250">
              {/* Root */}
              <g>
                <rect
                  x="175"
                  y="10"
                  width="50"
                  height="30"
                  rx="5"
                  fill="#6366f1"
                  stroke="#4f46e5"
                  strokeWidth="2"
                />
                <text
                  x="200"
                  y="28"
                  textAnchor="middle"
                  fill="white"
                  fontSize="12"
                  fontWeight="bold"
                >
                  ROOT
                </text>
              </g>

              {/* 'c' branch */}
              <line x1="200" y1="40" x2="120" y2="70" stroke="#cbd5e1" strokeWidth="2" />
              <motion.g
                animate={{
                  opacity: currentChar >= 0 && searchQuery[0] === 'c' ? 1 : 0.3,
                }}
              >
                <circle cx="120" cy="80" r="18" fill="#3b82f6" stroke="#2563eb" strokeWidth="2" />
                <text x="120" y="85" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
                  c
                </text>
              </motion.g>

              {/* 'a' under 'c' */}
              <line x1="120" y1="98" x2="90" y2="128" stroke="#cbd5e1" strokeWidth="2" />
              <motion.g
                animate={{
                  opacity: currentChar >= 1 && searchQuery.substring(0, 2) === 'ca' ? 1 : 0.3,
                }}
              >
                <circle cx="90" cy="138" r="18" fill="#3b82f6" stroke="#2563eb" strokeWidth="2" />
                <text x="90" y="143" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
                  a
                </text>
              </motion.g>

              {/* 't' under 'a' */}
              <line x1="90" y1="156" x2="70" y2="186" stroke="#cbd5e1" strokeWidth="2" />
              <motion.g
                animate={{
                  opacity: currentChar >= 2 && searchQuery.substring(0, 3) === 'cat' ? 1 : 0.3,
                }}
              >
                <circle cx="70" cy="196" r="18" fill="#10b981" stroke="#059669" strokeWidth="2" />
                <text x="70" y="201" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
                  t
                </text>
                <circle cx="82" cy="185" r="6" fill="#10b981" />
              </motion.g>

              {/* 'r' under 'a' */}
              <line x1="90" y1="156" x2="110" y2="186" stroke="#cbd5e1" strokeWidth="2" />
              <motion.g
                animate={{
                  opacity: currentChar >= 2 && searchQuery.substring(0, 3) === 'car' ? 1 : 0.3,
                }}
              >
                <circle cx="110" cy="196" r="18" fill="#10b981" stroke="#059669" strokeWidth="2" />
                <text x="110" y="201" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
                  r
                </text>
                <circle cx="122" cy="185" r="6" fill="#10b981" />
              </motion.g>

              {/* 'd' branch */}
              <line x1="200" y1="40" x2="280" y2="70" stroke="#cbd5e1" strokeWidth="2" />
              <motion.g
                animate={{
                  opacity: currentChar >= 0 && searchQuery[0] === 'd' ? 1 : 0.3,
                }}
              >
                <circle cx="280" cy="80" r="18" fill="#3b82f6" stroke="#2563eb" strokeWidth="2" />
                <text x="280" y="85" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
                  d
                </text>
              </motion.g>

              {/* 'o' under 'd' */}
              <line x1="280" y1="98" x2="280" y2="128" stroke="#cbd5e1" strokeWidth="2" />
              <motion.g
                animate={{
                  opacity: currentChar >= 1 && searchQuery.substring(0, 2) === 'do' ? 1 : 0.3,
                }}
              >
                <circle cx="280" cy="138" r="18" fill="#3b82f6" stroke="#2563eb" strokeWidth="2" />
                <text x="280" y="143" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
                  o
                </text>
              </motion.g>

              {/* 'g' under 'o' */}
              <line x1="280" y1="156" x2="280" y2="186" stroke="#cbd5e1" strokeWidth="2" />
              <motion.g
                animate={{
                  opacity: currentChar >= 2 && searchQuery.substring(0, 3) === 'dog' ? 1 : 0.3,
                }}
              >
                <circle cx="280" cy="196" r="18" fill="#10b981" stroke="#059669" strokeWidth="2" />
                <text x="280" y="201" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
                  g
                </text>
                <circle cx="292" cy="185" r="6" fill="#10b981" />
              </motion.g>
            </svg>
          </div>
        </div>

        {/* Result Display */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <Card
                className={`p-4 ${
                  result.success
                    ? 'bg-green-50 border-green-300'
                    : 'bg-red-50 border-red-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  {result.success ? (
                    <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                  )}
                  <div>
                    <h4
                      className={`mb-1 ${
                        result.success ? 'text-green-900' : 'text-red-900'
                      }`}
                    >
                      {result.success ? 'Success!' : 'Not Found'}
                    </h4>
                    <p className="text-sm text-slate-700">{result.message}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Example Queries */}
      <Card className="p-4 bg-yellow-50 border-yellow-200">
        <h4 className="text-yellow-900 mb-3">Try These Examples:</h4>
        <div className="grid grid-cols-2 gap-3">
          {examples[searchType].map((ex, idx) => (
            <Button
              key={idx}
              size="sm"
              variant="outline"
              onClick={() => setSearchQuery(ex.query)}
              className="text-left justify-start"
            >
              <div className="flex flex-col items-start">
                <span className="font-mono text-xs">{ex.query}</span>
                <span className="text-xs text-slate-600">{ex.result}</span>
              </div>
            </Button>
          ))}
        </div>
      </Card>
    </div>
  );
}
