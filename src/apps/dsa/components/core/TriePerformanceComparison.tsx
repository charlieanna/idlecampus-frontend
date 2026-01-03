import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Play, Zap, Turtle } from 'lucide-react';

/**
 * Interactive Performance Comparison: Array vs Trie
 */

export function TriePerformanceComparison() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [arrayChecks, setArrayChecks] = useState(0);
  const [trieChecks, setTrieChecks] = useState(0);

  const words = ['apple', 'application', 'approve', 'zebra', 'zoo', 'zoom'];
  const searchTerm = 'app';

  const runComparison = async () => {
    setIsAnimating(true);
    setCurrentStep(0);
    setArrayChecks(0);
    setTrieChecks(0);

    // Array approach - check each word
    for (let i = 0; i < words.length; i++) {
      setCurrentStep(i);
      setArrayChecks(i + 1);
      await new Promise((resolve) => setTimeout(resolve, 600));
    }

    await new Promise((resolve) => setTimeout(resolve, 500));

    // Trie approach - just follow path
    for (let i = 0; i < searchTerm.length; i++) {
      setTrieChecks(i + 1);
      await new Promise((resolve) => setTimeout(resolve, 400));
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsAnimating(false);
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-slate-50 to-blue-50 border-2 border-blue-300">
      <div className="text-center mb-6">
        <h3 className="text-blue-900 mb-2">Performance Race: Array vs Trie</h3>
        <p className="text-sm text-slate-600">
          Find all words starting with "{searchTerm}" in {words.length} words
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Array Approach */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Turtle className="w-5 h-5 text-orange-600" />
              <h4 className="text-orange-900">Array Search</h4>
            </div>
            <Badge className="bg-orange-600">
              {arrayChecks} checks
            </Badge>
          </div>

          <Card className="p-4 bg-white border-orange-200 min-h-[300px]">
            <div className="text-xs text-slate-600 mb-3 font-mono">
              for word in words:
              <br />
              {'  '}if word.startswith("app"):
              <br />
              {'    '}results.append(word)
            </div>

            <div className="space-y-2">
              {words.map((word, idx) => (
                <motion.div
                  key={word}
                  initial={{ opacity: 0.3 }}
                  animate={{
                    opacity: 1,
                    scale: isAnimating && currentStep === idx ? 1.05 : 1,
                    backgroundColor:
                      isAnimating && currentStep === idx
                        ? '#fed7aa'
                        : word.startsWith(searchTerm)
                        ? '#d1fae5'
                        : '#ffffff',
                  }}
                  className="p-2 rounded border text-sm font-mono flex items-center justify-between"
                >
                  <span>{word}</span>
                  {isAnimating && currentStep >= idx && (
                    <span className="text-xs text-orange-600">
                      ✓ checked
                    </span>
                  )}
                </motion.div>
              ))}
            </div>

            <div className="mt-4 text-center text-sm text-orange-700">
              O(n × m) - Check every word!
            </div>
          </Card>
        </div>

        {/* Trie Approach */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-green-600" />
              <h4 className="text-green-900">Trie Search</h4>
            </div>
            <Badge className="bg-green-600">
              {trieChecks} steps
            </Badge>
          </div>

          <Card className="p-4 bg-white border-green-200 min-h-[300px]">
            <div className="text-xs text-slate-600 mb-3 font-mono">
              node = root
              <br />
              for char in "app":
              <br />
              {'  '}node = node.children[char]
            </div>

            {/* Visual Trie Path */}
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <div className="flex items-center gap-3">
                <div className="px-4 py-2 rounded-lg border-2 border-blue-500 bg-blue-100">
                  ROOT
                </div>
                <div className="text-slate-400">→</div>
                <motion.div
                  initial={{ opacity: 0.3 }}
                  animate={{
                    opacity: trieChecks >= 1 ? 1 : 0.3,
                    scale: trieChecks === 1 ? 1.1 : 1,
                  }}
                  className="px-4 py-2 rounded-lg border-2 border-blue-500 bg-blue-100"
                >
                  a
                </motion.div>
                <div className="text-slate-400">→</div>
                <motion.div
                  initial={{ opacity: 0.3 }}
                  animate={{
                    opacity: trieChecks >= 2 ? 1 : 0.3,
                    scale: trieChecks === 2 ? 1.1 : 1,
                  }}
                  className="px-4 py-2 rounded-lg border-2 border-blue-500 bg-blue-100"
                >
                  p
                </motion.div>
                <div className="text-slate-400">→</div>
                <motion.div
                  initial={{ opacity: 0.3 }}
                  animate={{
                    opacity: trieChecks >= 3 ? 1 : 0.3,
                    scale: trieChecks === 3 ? 1.1 : 1,
                  }}
                  className="px-4 py-2 rounded-lg border-2 border-green-500 bg-green-100"
                >
                  p ✓
                </motion.div>
              </div>

              <AnimatePresence>
                {trieChecks === 3 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                  >
                    <div className="text-sm text-green-700 mb-2">
                      Path found! All words with prefix "app":
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {words
                        .filter((w) => w.startsWith(searchTerm))
                        .map((w) => (
                          <Badge key={w} className="bg-green-600">
                            {w}
                          </Badge>
                        ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="mt-4 text-center text-sm text-green-700">
              O(m) - Only follow the prefix path!
            </div>
          </Card>
        </div>
      </div>

      {/* Control Button */}
      <div className="text-center">
        <Button
          onClick={runComparison}
          disabled={isAnimating}
          size="lg"
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Play className="w-4 h-4 mr-2" />
          {isAnimating ? 'Running...' : 'Run Comparison'}
        </Button>
      </div>

      {/* Results Summary */}
      <AnimatePresence>
        {arrayChecks > 0 && !isAnimating && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 grid grid-cols-2 gap-4"
          >
            <Card className="p-4 bg-orange-50 border-orange-200">
              <div className="text-orange-900 mb-1">Array Approach</div>
              <div className="text-2xl text-orange-700">{arrayChecks}</div>
              <div className="text-xs text-slate-600">operations needed</div>
            </Card>
            <Card className="p-4 bg-green-50 border-green-200">
              <div className="text-green-900 mb-1">Trie Approach</div>
              <div className="text-2xl text-green-700">{trieChecks}</div>
              <div className="text-xs text-slate-600">operations needed</div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Key Insight */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-900 flex items-start gap-2">
          <span className="text-lg">💡</span>
          <span>
            <strong>Why Trie Wins:</strong> With 1 million words, Array needs to
            check ALL million words. Trie only follows 3 character steps! The
            difference is <strong>~999,997 fewer operations</strong>!
          </span>
        </p>
      </div>
    </Card>
  );
}
