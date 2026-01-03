import { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Badge } from '../ui/badge';
import { Code2, Trophy } from 'lucide-react';
import { LeetCodeProblemPage } from './LeetCodeProblemPage';
import { dsaProblems } from '../../data/dsaCourseData';

export default function BacktrackingTreeLesson() {
  const [selectedProblemId, setSelectedProblemId] = useState<string | null>(null);

  // Get the backtracking problems
  const backtrackingProblems = dsaProblems.filter(p => p.topic === 'backtracking');

  // If a problem is selected, show the LeetCode problem page
  if (selectedProblemId) {
    const problem = backtrackingProblems.find(p => p.id === selectedProblemId);
    if (problem) {
      return (
        <LeetCodeProblemPage 
          problem={problem} 
          onBack={() => setSelectedProblemId(null)}
        />
      );
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'medium':
        return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      case 'hard':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };
  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-12 px-6">
      {/* Title */}
      <div className="max-w-4xl w-full text-center mb-12">
        <h1 className="text-3xl text-slate-900 mb-2">Backtracking Tree Discovery</h1>
        <p className="text-slate-600">
          Discover how backtracking works by building all subsets — see the tree form naturally, then understand the code pattern.
        </p>
      </div>

      {/* Sections as Accordion */}
      <div className="w-full max-w-4xl">
        <Accordion type="multiple" defaultValue={["section-1", "section-2"]} className="space-y-4">
          {/* Section 1: Introduce the Problem */}
          <AccordionItem value="section-1" className="bg-white border border-blue-200 rounded-xl overflow-hidden shadow-sm">
            <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-blue-50/50">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🧩</span>
                <h2 className="text-xl text-blue-700">The Challenge: Finding All Subsets</h2>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <p className="text-slate-700 mb-4 text-base">
                We're going to build all subsets of <code className="text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded font-mono">[1, 2]</code> — 
                every possible combination of these numbers, including the empty one.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-blue-900 mb-2">💭 Think for a moment:</p>
                <p className="text-slate-700 text-sm">
                  How would you do this by hand? What are all the possible subsets?
                </p>
              </div>
              <p className="text-slate-700 text-sm">
                For each number, you only have two options: <strong className="text-blue-700">include it</strong> or <strong className="text-blue-700">skip it</strong>.
                That's it. Let's explore all those choices systematically.
              </p>
            </AccordionContent>
          </AccordionItem>

          {/* Section 2: Build the Logic in Plain English */}
          <AccordionItem value="section-2" className="bg-white border border-green-200 rounded-xl overflow-hidden shadow-sm">
            <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-green-50/50">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🌳</span>
                <h2 className="text-xl text-green-700">Building the Tree: Step by Step</h2>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <p className="text-slate-700 mb-6 text-base">
                Let's walk through this step by step. Watch how the tree forms naturally from our choices.
              </p>

              <div className="space-y-4 mb-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-900 mb-2">Step 1: Start with an empty set</p>
                  <p className="text-slate-700 text-sm">We begin with <code className="text-green-700 bg-green-100 px-1.5 py-0.5 rounded">[]</code> — no elements chosen yet.</p>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-900 mb-2">Step 2: First element is <code className="text-green-700 bg-green-100 px-1.5 py-0.5 rounded">1</code></p>
                  <p className="text-slate-700 text-sm">You can <strong>include</strong> it or <strong>skip</strong> it. This creates two branches.</p>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-900 mb-2">Step 3: If you include <code className="text-green-700 bg-green-100 px-1.5 py-0.5 rounded">1</code></p>
                  <p className="text-slate-700 text-sm">Your current subset becomes <code className="text-green-700 bg-green-100 px-1.5 py-0.5 rounded">[1]</code>. Now move to the next element.</p>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-900 mb-2">Step 4: Next element is <code className="text-green-700 bg-green-100 px-1.5 py-0.5 rounded">2</code></p>
                  <p className="text-slate-700 text-sm">Again, you can include or skip it. This creates more branches.</p>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-900 mb-2">Step 5: When there are no more elements</p>
                  <p className="text-slate-700 text-sm">Record what you have — that's a complete subset (a solution)!</p>
                </div>
              </div>

              {/* Visual Tree */}
              <div className="bg-slate-50 border-2 border-green-300 rounded-lg p-6 mb-6">
                <h3 className="text-green-900 mb-6 text-center text-lg">The Decision Tree for [1, 2]</h3>
                
                <div className="flex flex-col items-center space-y-8">
                  <div className="bg-blue-600 border-2 border-blue-500 rounded-lg px-6 py-3 shadow-lg">
                    <div className="text-white text-lg">[]</div>
                    <div className="text-xs text-blue-100 mt-1 text-center">Start: empty subset</div>
                  </div>

                  <div className="flex gap-16 w-full justify-center items-start">
                    <div className="flex flex-col items-center flex-1 max-w-[280px]">
                      <div className="bg-blue-500 border border-blue-400 rounded px-3 py-1.5 mb-3 w-full text-center">
                        <div className="text-white text-sm">include 1</div>
                        <div className="text-blue-100 text-xs mt-0.5">Choice: add element 1</div>
                      </div>
                      
                      <div className="bg-blue-600 border-2 border-blue-500 rounded-lg px-4 py-2.5 shadow-lg mb-6 w-full">
                        <div className="text-white text-base text-center">[1]</div>
                        <div className="text-xs text-blue-100 mt-1 text-center">After including 1</div>
                      </div>
                      
                      <div className="flex gap-6 w-full">
                        <div className="flex flex-col items-center flex-1">
                          <div className="bg-blue-400 border border-blue-300 rounded px-2 py-1 mb-2.5 w-full text-center">
                            <div className="text-white text-xs">include 2</div>
                          </div>
                          <div className="bg-green-600 border-2 border-green-500 rounded-lg px-3 py-2.5 shadow-lg w-full">
                            <div className="text-white text-sm text-center">[1, 2]</div>
                            <div className="text-xs text-green-100 mt-1 text-center">✅ Solution</div>
                            <div className="mt-2 bg-slate-600 border border-slate-500 rounded px-2 py-1 text-center">
                              <div className="text-slate-100 text-xs">Leaf Node</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-center flex-1">
                          <div className="bg-blue-400 border border-blue-300 rounded px-2 py-1 mb-2.5 w-full text-center">
                            <div className="text-white text-xs">skip 2</div>
                          </div>
                          <div className="bg-green-600 border-2 border-green-500 rounded-lg px-3 py-2.5 shadow-lg w-full">
                            <div className="text-white text-sm text-center">[1]</div>
                            <div className="text-xs text-green-100 mt-1 text-center">✅ Solution</div>
                            <div className="mt-2 bg-slate-600 border border-slate-500 rounded px-2 py-1 text-center">
                              <div className="text-slate-100 text-xs">Leaf Node</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-center flex-1 max-w-[280px]">
                      <div className="bg-blue-500 border border-blue-400 rounded px-3 py-1.5 mb-3 w-full text-center">
                        <div className="text-white text-sm">skip 1</div>
                        <div className="text-blue-100 text-xs mt-0.5">Choice: don't add element 1</div>
                      </div>
                      
                      <div className="bg-blue-600 border-2 border-blue-500 rounded-lg px-4 py-2.5 shadow-lg mb-6 w-full">
                        <div className="text-white text-base text-center">[]</div>
                        <div className="text-xs text-blue-100 mt-1 text-center">After skipping 1</div>
                      </div>
                      
                      <div className="flex gap-6 w-full">
                        <div className="flex flex-col items-center flex-1">
                          <div className="bg-blue-400 border border-blue-300 rounded px-2 py-1 mb-2.5 w-full text-center">
                            <div className="text-white text-xs">include 2</div>
                          </div>
                          <div className="bg-green-600 border-2 border-green-500 rounded-lg px-3 py-2.5 shadow-lg w-full">
                            <div className="text-white text-sm text-center">[2]</div>
                            <div className="text-xs text-green-100 mt-1 text-center">✅ Solution</div>
                            <div className="mt-2 bg-slate-600 border border-slate-500 rounded px-2 py-1 text-center">
                              <div className="text-slate-100 text-xs">Leaf Node</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-center flex-1">
                          <div className="bg-blue-400 border border-blue-300 rounded px-2 py-1 mb-2.5 w-full text-center">
                            <div className="text-white text-xs">skip 2</div>
                          </div>
                          <div className="bg-green-600 border-2 border-green-500 rounded-lg px-3 py-2.5 shadow-lg w-full">
                            <div className="text-white text-sm text-center">[]</div>
                            <div className="text-xs text-green-100 mt-1 text-center">✅ Solution</div>
                            <div className="mt-2 bg-slate-600 border border-slate-500 rounded px-2 py-1 text-center">
                              <div className="text-slate-100 text-xs">Leaf Node</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-300">
                  <div className="flex flex-wrap gap-4 justify-center text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-600 border border-blue-500 rounded"></div>
                      <span className="text-slate-700">Internal Node (decision point)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-600 border border-green-500 rounded"></div>
                      <span className="text-slate-700">Leaf Node (solution found)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-500 border border-blue-400 rounded"></div>
                      <span className="text-slate-700">Edge (choice made)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-900 mb-2">💡 The Key Insight:</p>
                <p className="text-slate-700 text-sm">
                  That's it — recursion just automates this process. 
                  Every node is a partial subset, every branch is a choice (include or skip), 
                  and the leaves (✅) are your answers. The tree shows all possible paths.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Section 3: From Tree to Code */}
          <AccordionItem value="section-3" className="bg-white border border-purple-200 rounded-xl overflow-hidden shadow-sm">
            <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-purple-50/50">
              <div className="flex items-center gap-3">
                <span className="text-2xl">💻</span>
                <h2 className="text-xl text-purple-700">From Tree to Code</h2>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <p className="text-slate-700 mb-4 text-base">
                Now let's see how we can write code that does exactly what we just did by hand.
              </p>
              
              <p className="text-slate-700 mb-4 text-sm">
                We can think of a function that takes the current subset (<code className="text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">path</code>) and an index.
                At each step, we have two calls: one that includes the current number, and one that skips it.
              </p>

              <div className="bg-slate-900 rounded-lg p-6 border border-slate-700 mb-4">
                <pre className="text-sm font-mono text-slate-100 overflow-x-auto mb-0">
{`def subsets(nums):
    result = []
    
    def backtrack(path, index):
        # Base case: no more elements to process
        if index == len(nums):
            result.append(path[:])  # Save this subset
            return
        
        # Choice 1: Include nums[index]
        path.append(nums[index])
        backtrack(path, index + 1)
        path.pop()  # Undo: remove what we added
        
        # Choice 2: Skip nums[index]
        backtrack(path, index + 1)
    
    backtrack([], 0)
    return result

subsets([1, 2])`}
                </pre>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                <p className="text-purple-900 mb-3">🔗 How the Code Matches the Tree:</p>
                <div className="space-y-3 text-sm text-slate-700">
                  <div className="flex items-start gap-3">
                    <span className="text-purple-600">•</span>
                    <span><code className="text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded">path.append(nums[index])</code> = going down a branch (include the element)</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-purple-600">•</span>
                    <span><code className="text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded">backtrack(path, index + 1)</code> = explore deeper (recurse to next level)</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-purple-600">•</span>
                    <span><code className="text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded">path.pop()</code> = come back up (undo the choice, restore state)</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-purple-600">•</span>
                    <span><code className="text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded">if index == len(nums)</code> = base case (reached a leaf, save solution)</span>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <p className="text-purple-900 mb-2">✨ See the Pattern?</p>
                <p className="text-slate-700 text-sm">
                  Those four key operations — <code className="text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded">append</code>, <code className="text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded">backtrack</code>, 
                  <code className="text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded">pop</code>, and the base case — match exactly what we did in the tree. 
                  The code is just automating the tree traversal!
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Section 4: How the Tree Guides Code Writing */}
          <AccordionItem value="section-4" className="bg-white border border-cyan-200 rounded-xl overflow-hidden shadow-sm">
            <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-cyan-50/50">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🧭</span>
                <h2 className="text-xl text-cyan-700">How the Tree Guides Code Writing</h2>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <p className="text-slate-700 mb-4 text-base">
                Now that you can visualize how recursion expands — how do we turn that tree into code?
              </p>
              <p className="text-slate-700 mb-6 text-sm">
                Every line of the backtracking template is just a direct translation of something visible in the recursion tree.
              </p>

              <div className="bg-slate-50 border border-cyan-200 rounded-lg p-6 mb-6">
                <h3 className="text-cyan-900 mb-4 text-center">Tree Element → Code Translation</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-300">
                        <th className="text-left py-3 px-4 text-cyan-900">Tree Element</th>
                        <th className="text-left py-3 px-4 text-cyan-900">What It Means in Code</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-700">
                      <tr className="border-b border-slate-200">
                        <td className="py-3 px-4"><code className="text-cyan-700 bg-cyan-50 px-1.5 py-0.5 rounded">Each node</code></td>
                        <td className="py-3 px-4">One function call (<code className="text-cyan-700 bg-cyan-50 px-1.5 py-0.5 rounded">backtrack(...)</code>)</td>
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="py-3 px-4"><code className="text-cyan-700 bg-cyan-50 px-1.5 py-0.5 rounded">Each branch</code></td>
                        <td className="py-3 px-4">One recursive call inside a loop</td>
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="py-3 px-4"><code className="text-cyan-700 bg-cyan-50 px-1.5 py-0.5 rounded">Each choice</code></td>
                        <td className="py-3 px-4">Happens inside the loop (<code className="text-cyan-700 bg-cyan-50 px-1.5 py-0.5 rounded">for choice in choices:</code>)</td>
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="py-3 px-4"><code className="text-cyan-700 bg-cyan-50 px-1.5 py-0.5 rounded">Each leaf (solution)</code></td>
                        <td className="py-3 px-4">The base case (<code className="text-cyan-700 bg-cyan-50 px-1.5 py-0.5 rounded">if ...: record</code>)</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4"><code className="text-cyan-700 bg-cyan-50 px-1.5 py-0.5 rounded">Each step back up</code></td>
                        <td className="py-3 px-4">The <code className="text-cyan-700 bg-cyan-50 px-1.5 py-0.5 rounded">undo()</code> line</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4 mb-6">
                <p className="text-cyan-900 mb-2">🎯 The Universal Pattern:</p>
                <p className="text-slate-700 text-sm mb-3">
                  Every backtracking problem—Subsets, Permutations, Combination Sum—just plugs different logic into these blanks.
                </p>
                <div className="bg-slate-900 rounded-lg p-4 mt-3">
                  <pre className="text-xs font-mono text-slate-100 overflow-x-auto mb-0">
{`def backtrack(current_state):
    if base_condition:
        record(current_state)
        return
    
    for choice in choices:
        make(choice)
        backtrack(updated_state)
        undo(choice)`}
                  </pre>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Section 5: Universal Backtracking Template */}
          <AccordionItem value="section-5" className="bg-white border border-indigo-200 rounded-xl overflow-hidden shadow-sm">
            <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-indigo-50/50">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎯</span>
                <h2 className="text-xl text-indigo-700">The Universal Backtracking Template</h2>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <p className="text-slate-700 mb-4 text-base">
                Now that you understand how the tree maps to code, here's the complete universal template that works for all backtracking problems.
              </p>

              <div className="bg-slate-900 rounded-lg p-6 border border-slate-700 mb-6">
                <pre className="text-sm font-mono text-slate-100 overflow-x-auto mb-0">
{`def solve(input_data):
    result = []  # Initialize inside function
    
    def backtrack(current_state, index):
        if base_condition:
            result.append(current_state[:])
            return
        
        for choice in choices:
            make(choice)                    # ← Apply
            backtrack(updated_state, ...)   # ← Recurse
            undo(choice)                    # ← Backtrack
    
    backtrack([], 0)
    return result

solve(input_data)`}
                </pre>
              </div>

              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                <p className="text-indigo-900 mb-2">💡 Three Questions to Ask:</p>
                <div className="space-y-2 text-sm text-slate-700">
                  <div className="flex items-start gap-3">
                    <span className="text-indigo-600">1.</span>
                    <span>What is my <code className="text-indigo-700 bg-indigo-100 px-1.5 py-0.5 rounded">state</code>? (What does each node represent?)</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-indigo-600">2.</span>
                    <span>What is my <code className="text-indigo-700 bg-indigo-100 px-1.5 py-0.5 rounded">choice</code>? (What causes each branch?)</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-indigo-600">3.</span>
                    <span>When does recursion <code className="text-indigo-700 bg-indigo-100 px-1.5 py-0.5 rounded">stop</code>? (Where are the leaves?)</span>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Call to Action */}
      <div className="w-full max-w-4xl mt-8 bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-xl p-6 text-center shadow-sm">
        <h2 className="text-2xl text-blue-900 mb-3">🚀 Ready to Practice?</h2>
        <p className="text-slate-700 mb-4">
          Now that you understand the tree-to-code pattern, it's time to solve real problems!
        </p>
        <p className="text-sm text-slate-600">
          Click on the practice problems below to start coding with the LeetCode-style editor.
        </p>
      </div>

      {/* Practice Problems Section */}
      <div className="w-full max-w-4xl mt-6">
        <Accordion type="multiple" defaultValue={["practice-problems"]} className="space-y-4">
          <AccordionItem value="practice-problems" className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-slate-50">
              <div className="flex items-center gap-3">
                <Trophy className="w-6 h-6 text-yellow-500" />
                <h2 className="text-xl text-slate-900">Practice Problems</h2>
                <Badge className="ml-2 bg-blue-100 text-blue-700 border-blue-300">
                  {backtrackingProblems.length} Problems
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <p className="text-slate-600 mb-6 text-sm">
                Apply what you've learned by solving these classic backtracking problems.
                Each problem builds on the concepts from the tree discovery lesson.
              </p>

              <div className="space-y-3">
                {backtrackingProblems.map((problem, index) => (
                  <button
                    key={problem.id}
                    onClick={() => setSelectedProblemId(problem.id)}
                    className="w-full text-left bg-white border border-slate-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-slate-500 text-sm">#{index + 1}</span>
                          <h3 className="text-slate-900 group-hover:text-blue-700 transition-colors">
                            {problem.title}
                          </h3>
                          <Badge className={`text-xs ${getDifficultyColor(problem.difficulty)}`}>
                            {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 line-clamp-2">
                          {problem.description.split('\n')[0]}
                        </p>
                        <div className="flex items-center gap-2 mt-3">
                          {problem.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <Code2 className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-slate-200">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-900 mb-2">💡 Pro Tip:</p>
                  <p className="text-slate-700 text-sm">
                    Start with <strong>Subsets</strong> since it's the foundation. Once you understand it,
                    <strong> Permutations</strong> and <strong>Combination Sum</strong> will make much more sense!
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
