import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { CheckCircle2, XCircle, Plus, Search, ArrowRight } from 'lucide-react';

/**
 * Interactive Trie Builder - lets users manually build a trie by inserting words
 */

interface TrieNodeVisual {
  char: string;
  isEnd: boolean;
  children: Map<string, TrieNodeVisual>;
  depth: number;
}

export function TrieManualBuilder() {
  const [words, setWords] = useState<string[]>([]);
  const [currentWord, setCurrentWord] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState<{
    found: boolean;
    message: string;
  } | null>(null);
  const [root] = useState<TrieNodeVisual>({
    char: 'ROOT',
    isEnd: false,
    children: new Map(),
    depth: 0,
  });

  // Insert a word into the trie
  const insertWord = (word: string) => {
    if (!word.trim()) return;

    let node = root;
    for (const char of word.toLowerCase()) {
      if (!node.children.has(char)) {
        node.children.set(char, {
          char,
          isEnd: false,
          children: new Map(),
          depth: node.depth + 1,
        });
      }
      node = node.children.get(char)!;
    }
    node.isEnd = true;
    setWords([...words, word.toLowerCase()]);
    setCurrentWord('');
  };

  // Search for a word in the trie
  const searchWord = (word: string) => {
    if (!word.trim()) return;

    let node = root;
    for (const char of word.toLowerCase()) {
      if (!node.children.has(char)) {
        setSearchResult({
          found: false,
          message: `Path broken at '${char}' - word not in trie`,
        });
        return;
      }
      node = node.children.get(char)!;
    }

    if (node.isEnd) {
      setSearchResult({
        found: true,
        message: `Found! "${word}" is a complete word in the trie`,
      });
    } else {
      setSearchResult({
        found: false,
        message: `Path exists but "${word}" is not marked as a complete word (only a prefix)`,
      });
    }
  };

  // Render the trie visually
  const renderNode = (node: TrieNodeVisual, x: number, y: number): JSX.Element[] => {
    const elements: JSX.Element[] = [];
    const childrenArray = Array.from(node.children.values());
    const childSpacing = 80 / Math.max(childrenArray.length, 1);

    if (node.char !== 'ROOT') {
      elements.push(
        <motion.g
          key={`node-${node.char}-${x}-${y}`}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <circle
            cx={x}
            cy={y}
            r={20}
            fill={node.isEnd ? '#10b981' : '#3b82f6'}
            stroke={node.isEnd ? '#059669' : '#2563eb'}
            strokeWidth={2}
          />
          <text
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            fontSize="14"
            fontWeight="bold"
          >
            {node.char}
          </text>
          {node.isEnd && (
            <circle cx={x + 15} cy={y - 15} r={8} fill="#10b981">
              <title>Word ends here</title>
            </circle>
          )}
        </motion.g>
      );
    }

    childrenArray.forEach((child, index) => {
      const childX = x + (index - (childrenArray.length - 1) / 2) * childSpacing;
      const childY = y + 60;

      if (node.char !== 'ROOT') {
        elements.push(
          <line
            key={`line-${node.char}-${child.char}-${index}`}
            x1={x}
            y1={y + 20}
            x2={childX}
            y2={childY - 20}
            stroke="#cbd5e1"
            strokeWidth={2}
          />
        );
      }

      elements.push(...renderNode(child, childX, childY));
    });

    return elements;
  };

  const presetWords = ['cat', 'car', 'dog', 'card', 'cart'];

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Insert Word */}
        <Card className="p-4 border-green-200 bg-green-50">
          <h4 className="text-green-900 mb-3 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Insert Words
          </h4>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={currentWord}
              onChange={(e) => setCurrentWord(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && insertWord(currentWord)}
              placeholder="Type a word..."
              className="flex-1 px-3 py-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <Button
              onClick={() => insertWord(currentWord)}
              className="bg-green-600 hover:bg-green-700"
            >
              Insert
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {presetWords.map((word) => (
              <Button
                key={word}
                size="sm"
                variant="outline"
                onClick={() => insertWord(word)}
                className="text-xs"
                disabled={words.includes(word)}
              >
                + {word}
              </Button>
            ))}
          </div>
        </Card>

        {/* Search Word */}
        <Card className="p-4 border-blue-200 bg-blue-50">
          <h4 className="text-blue-900 mb-3 flex items-center gap-2">
            <Search className="w-4 h-4" />
            Search Words
          </h4>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchWord(searchTerm)}
              placeholder="Search..."
              className="flex-1 px-3 py-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button
              onClick={() => searchWord(searchTerm)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Search
            </Button>
          </div>
          <AnimatePresence>
            {searchResult && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`p-3 rounded flex items-start gap-2 ${
                  searchResult.found
                    ? 'bg-green-100 border border-green-300'
                    : 'bg-red-100 border border-red-300'
                }`}
              >
                {searchResult.found ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                )}
                <p className="text-sm text-slate-700">{searchResult.message}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </div>

      {/* Inserted Words List */}
      {words.length > 0 && (
        <Card className="p-4 bg-purple-50 border-purple-200">
          <h4 className="text-purple-900 mb-2">Words in Trie:</h4>
          <div className="flex flex-wrap gap-2">
            {words.map((word, idx) => (
              <Badge key={idx} className="bg-purple-600">
                {word}
              </Badge>
            ))}
          </div>
        </Card>
      )}

      {/* Visual Trie */}
      <Card className="p-6 bg-slate-50 border-slate-200">
        <h4 className="text-slate-900 mb-4">Trie Structure:</h4>
        {words.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <div className="text-4xl mb-2">🌳</div>
            <p>Insert some words to see the trie structure!</p>
            <p className="text-sm mt-2">Try: cat, car, dog</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <svg
              width="100%"
              height={Math.max(300, root.children.size * 80 + 100)}
              viewBox={`0 0 ${Math.max(400, root.children.size * 100)} ${Math.max(300, root.children.size * 80 + 100)}`}
            >
              {/* Root node */}
              <g>
                <rect
                  x={200 - 30}
                  y={20 - 20}
                  width={60}
                  height={40}
                  rx={8}
                  fill="#6366f1"
                  stroke="#4f46e5"
                  strokeWidth={2}
                />
                <text
                  x={200}
                  y={20}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize="12"
                  fontWeight="bold"
                >
                  ROOT
                </text>
              </g>

              {/* Render all nodes */}
              {Array.from(root.children.values()).map((child, idx) => {
                const totalChildren = root.children.size;
                const x = 200 + (idx - (totalChildren - 1) / 2) * 100;
                const y = 100;

                return (
                  <g key={`root-child-${idx}`}>
                    <line
                      x1={200}
                      y1={40}
                      x2={x}
                      y2={y - 20}
                      stroke="#cbd5e1"
                      strokeWidth={2}
                    />
                    {renderNode(child, x, y)}
                  </g>
                );
              })}
            </svg>
          </div>
        )}

        {/* Legend */}
        <div className="mt-4 flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-500 border-2 border-blue-600" />
            <span className="text-slate-700">Path Node</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-green-500 border-2 border-green-600" />
            <span className="text-slate-700">Word Ending</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-slate-700">End Marker</span>
          </div>
        </div>
      </Card>

      {/* Tips */}
      <Card className="p-4 bg-amber-50 border-amber-200">
        <h4 className="text-amber-900 mb-2 flex items-center gap-2">
          💡 Try This:
        </h4>
        <ul className="text-sm text-slate-700 space-y-1 list-disc list-inside">
          <li>Insert "cat" and "car" - notice they share the "ca" prefix!</li>
          <li>Search for "ca" - it exists as a path but not as a word</li>
          <li>Insert "card" and "cart" - see how "car" branches out</li>
          <li>Green nodes = complete words, Blue nodes = just prefixes</li>
        </ul>
      </Card>
    </div>
  );
}

/**
 * Step-by-step Insert Animation Component
 */
export function TrieInsertAnimation() {
  const [step, setStep] = useState(0);
  const word = 'cat';
  const steps = [
    {
      title: 'Start at Root',
      description: 'Begin at the root node of the trie',
      node: 'ROOT',
      action: 'Initialize node = root',
    },
    {
      title: "Process 'c'",
      description: "'c' doesn't exist in root's children, so create it",
      node: 'c',
      action: "root.children['c'] = new TrieNode()",
    },
    {
      title: "Move to 'c'",
      description: "Update node pointer to the 'c' node",
      node: 'c',
      action: "node = node.children['c']",
    },
    {
      title: "Process 'a'",
      description: "'a' doesn't exist in 'c's children, so create it",
      node: 'a',
      action: "node.children['a'] = new TrieNode()",
    },
    {
      title: "Move to 'a'",
      description: "Update node pointer to the 'a' node",
      node: 'a',
      action: "node = node.children['a']",
    },
    {
      title: "Process 't'",
      description: "'t' doesn't exist in 'a's children, so create it",
      node: 't',
      action: "node.children['t'] = new TrieNode()",
    },
    {
      title: "Move to 't'",
      description: "Update node pointer to the 't' node",
      node: 't',
      action: "node = node.children['t']",
    },
    {
      title: 'Mark End',
      description: "All characters processed, mark 't' as word ending",
      node: 't',
      action: 'node.is_end = True',
    },
  ];

  const currentStep = steps[step];

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300">
      <h3 className="text-blue-900 mb-4">
        Step-by-Step: Inserting "{word}"
      </h3>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-slate-600 mb-2">
          <span>
            Step {step + 1} of {steps.length}
          </span>
          <span>{Math.round(((step + 1) / steps.length) * 100)}%</span>
        </div>
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-blue-600"
            initial={{ width: 0 }}
            animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Current Step */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          <div className="bg-white rounded-lg p-4 border-2 border-blue-300">
            <h4 className="text-blue-900 mb-2">{currentStep.title}</h4>
            <p className="text-slate-700 text-sm mb-3">
              {currentStep.description}
            </p>
            <div className="bg-slate-900 rounded p-3 font-mono text-sm text-green-400">
              {currentStep.action}
            </div>
          </div>

          {/* Visual representation */}
          <div className="bg-white rounded-lg p-4 flex items-center justify-center gap-4">
            <div
              className={`px-4 py-2 rounded-lg border-2 ${
                step === 0
                  ? 'border-blue-500 bg-blue-100'
                  : 'border-slate-300 bg-slate-100'
              }`}
            >
              ROOT
            </div>
            {step >= 1 && (
              <>
                <ArrowRight className="w-5 h-5 text-slate-400" />
                <div
                  className={`px-4 py-2 rounded-lg border-2 ${
                    step >= 1 && step <= 2
                      ? 'border-blue-500 bg-blue-100'
                      : 'border-slate-300 bg-slate-100'
                  }`}
                >
                  c
                </div>
              </>
            )}
            {step >= 3 && (
              <>
                <ArrowRight className="w-5 h-5 text-slate-400" />
                <div
                  className={`px-4 py-2 rounded-lg border-2 ${
                    step >= 3 && step <= 4
                      ? 'border-blue-500 bg-blue-100'
                      : 'border-slate-300 bg-slate-100'
                  }`}
                >
                  a
                </div>
              </>
            )}
            {step >= 5 && (
              <>
                <ArrowRight className="w-5 h-5 text-slate-400" />
                <div
                  className={`px-4 py-2 rounded-lg border-2 ${
                    step >= 5
                      ? step === 7
                        ? 'border-green-500 bg-green-100'
                        : 'border-blue-500 bg-blue-100'
                      : 'border-slate-300 bg-slate-100'
                  }`}
                >
                  t {step === 7 && <span className="text-green-600">✓</span>}
                </div>
              </>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <Button
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          variant="outline"
        >
          Previous
        </Button>
        <Button
          onClick={() =>
            step === steps.length - 1 ? setStep(0) : setStep(step + 1)
          }
          className="bg-blue-600 hover:bg-blue-700"
        >
          {step === steps.length - 1 ? 'Restart' : 'Next'}
        </Button>
      </div>
    </Card>
  );
}
