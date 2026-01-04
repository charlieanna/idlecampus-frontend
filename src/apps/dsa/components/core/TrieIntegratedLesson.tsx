import { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { Search, CheckCircle2, XCircle, ArrowRight, Lightbulb, Code2 } from 'lucide-react';
import { TrieManualBuilder, TrieInsertAnimation } from './TrieManualBuilder';
import { TriePerformanceComparison } from './TriePerformanceComparison';
import { TrieSearchVisualization } from './TrieSearchVisualization';
import { TrieTaskEditor } from './TrieTaskEditor';

/**
 * Comprehensive Trie Lesson - Learn > Task > Learn > Task Format
 * Following the backtracking chapter pattern with interactive components
 */

export default function TrieIntegratedLesson() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-12 px-6">
      {/* Title */}
      <div className="max-w-4xl w-full text-center mb-12">
        <h1 className="text-3xl text-slate-900 mb-2">Trie (Prefix Tree) Discovery</h1>
        <p className="text-slate-600">
          Discover why we need Tries and how they enable lightning-fast string operations through hands-on building.
        </p>
      </div>

      {/* Sections as Accordion */}
      <div className="w-full max-w-4xl">
        <Accordion type="multiple" defaultValue={["section-1", "section-1-5", "section-2"]} className="space-y-4">
          
          {/* Section 1: The Problem - Why Do We Need Better? */}
          <AccordionItem value="section-1" className="bg-white border border-red-200 rounded-xl overflow-hidden shadow-sm">
            <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-red-50/50">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🤔</span>
                <h2 className="text-xl text-red-700">The Problem: Autocomplete is Slow!</h2>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="space-y-4">
                <p className="text-slate-700 text-base">
                  Imagine you're building a search engine. You have 1 million words in your dictionary. 
                  When a user types <code className="text-red-700 bg-red-50 px-1.5 py-0.5 rounded font-mono">"app"</code>, 
                  you need to show all words that start with "app" (like "apple", "application", "approve").
                </p>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-900 mb-3">❌ The Naive Approach (Array/List):</p>
                  <div className="bg-white rounded p-3 font-mono text-sm text-slate-700 mb-3">
                    <div>words = ["apple", "application", "approve", "zoo", "zebra", ...]</div>
                    <div className="mt-2 text-red-600"># User types "app"</div>
                    <div>for word in words:  # Check ALL 1 million words!</div>
                    <div className="ml-4">if word.startswith("app"):</div>
                    <div className="ml-8">results.append(word)</div>
                  </div>
                  <p className="text-sm text-slate-600">
                    ⏱️ Time Complexity: <strong className="text-red-700">O(n × m)</strong> where n = number of words, m = length of each word
                    <br />
                    For 1 million words, this is <strong className="text-red-700">TOO SLOW!</strong>
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-900 mb-2">💭 What if we could...</p>
                  <ul className="text-slate-700 text-sm space-y-2 list-disc list-inside">
                    <li>Only look at words that <strong>actually start with "app"</strong>?</li>
                    <li>Share common prefixes between words to save space?</li>
                    <li>Find all matching words in O(k) time where k = length of prefix?</li>
                  </ul>
                </div>

                <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4">
                  <p className="text-green-900 mb-2">✅ Enter the Trie (Prefix Tree)!</p>
                  <p className="text-slate-700 text-sm">
                    A Trie is a tree structure that stores strings by <strong>sharing common prefixes</strong>. 
                    Each path from root to node represents a string prefix.
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Section 1.5: Interactive Performance Race */}
          <AccordionItem value="section-1-5" className="bg-white border border-orange-200 rounded-xl overflow-hidden shadow-sm">
            <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-orange-50/50">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⚡</span>
                <h2 className="text-xl text-orange-700">Interactive: See The Performance Difference!</h2>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="space-y-4 mb-6">
                <p className="text-slate-700 text-base">
                  Watch the race! See how Array search checks EVERY word while Trie just follows the path.
                </p>
              </div>
              <TriePerformanceComparison />
            </AccordionContent>
          </AccordionItem>

          {/* Section 2: Building Intuition - Visualize the Structure */}
          <AccordionItem value="section-2" className="bg-white border border-blue-200 rounded-xl overflow-hidden shadow-sm">
            <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-blue-50/50">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🌳</span>
                <h2 className="text-xl text-blue-700">Understanding: How Does a Trie Work?</h2>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="space-y-6">
                <p className="text-slate-700 text-base">
                  Let's build a Trie for these words: <code className="bg-blue-50 px-2 py-1 rounded">"cat"</code>, 
                  <code className="bg-blue-50 px-2 py-1 rounded ml-2">"car"</code>, 
                  <code className="bg-blue-50 px-2 py-1 rounded ml-2">"dog"</code>
                </p>

                {/* Visual Trie Structure */}
                <div className="bg-slate-50 border-2 border-blue-300 rounded-lg p-6">
                  <h3 className="text-blue-900 mb-6 text-center text-lg">The Trie Structure</h3>
                  
                  <div className="flex flex-col items-center space-y-6">
                    {/* Root */}
                    <div className="bg-blue-600 border-2 border-blue-500 rounded-lg px-6 py-3 shadow-lg">
                      <div className="text-white text-lg">Root</div>
                      <div className="text-xs text-blue-100 mt-1 text-center">Empty - starting point</div>
                    </div>

                    {/* First Level */}
                    <div className="flex gap-24 items-start">
                      {/* 'c' branch */}
                      <div className="flex flex-col items-center">
                        <div className="bg-blue-500 border-2 border-blue-400 rounded-lg px-5 py-2.5 shadow mb-4">
                          <div className="text-white text-base">c</div>
                        </div>
                        
                        {/* 'a' under 'c' */}
                        <div className="bg-blue-400 border-2 border-blue-300 rounded-lg px-4 py-2 shadow mb-4">
                          <div className="text-white text-sm">a</div>
                        </div>

                        {/* 't' and 'r' branches */}
                        <div className="flex gap-8">
                          <div className="flex flex-col items-center">
                            <div className="bg-blue-300 border-2 border-blue-200 rounded-lg px-3 py-1.5 shadow">
                              <div className="text-white text-sm">t</div>
                            </div>
                            <div className="mt-2 bg-green-600 border border-green-500 rounded px-3 py-1 text-white text-xs">
                              ✓ "cat"
                            </div>
                          </div>
                          <div className="flex flex-col items-center">
                            <div className="bg-blue-300 border-2 border-blue-200 rounded-lg px-3 py-1.5 shadow">
                              <div className="text-white text-sm">r</div>
                            </div>
                            <div className="mt-2 bg-green-600 border border-green-500 rounded px-3 py-1 text-white text-xs">
                              ✓ "car"
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 'd' branch */}
                      <div className="flex flex-col items-center">
                        <div className="bg-blue-500 border-2 border-blue-400 rounded-lg px-5 py-2.5 shadow mb-4">
                          <div className="text-white text-base">d</div>
                        </div>
                        <div className="bg-blue-400 border-2 border-blue-300 rounded-lg px-4 py-2 shadow mb-4">
                          <div className="text-white text-sm">o</div>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="bg-blue-300 border-2 border-blue-200 rounded-lg px-3 py-1.5 shadow">
                            <div className="text-white text-sm">g</div>
                          </div>
                          <div className="mt-2 bg-green-600 border border-green-500 rounded px-3 py-1 text-white text-xs">
                            ✓ "dog"
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 bg-blue-100 border border-blue-300 rounded p-4">
                    <p className="text-blue-900 text-sm mb-2">🔍 Key Observations:</p>
                    <ul className="text-slate-700 text-sm space-y-1 list-disc list-inside">
                      <li><strong>Shared prefix "ca"</strong> - Both "cat" and "car" share the path through 'c' → 'a'</li>
                      <li><strong>Each node = one character</strong> - Not the entire word!</li>
                      <li><strong>Green checkmarks</strong> - Mark the end of valid words</li>
                      <li><strong>Search "ca"</strong> - Follow c → a, find BOTH branches (cat, car) instantly!</li>
                    </ul>
                  </div>
                </div>

                {/* Node Structure */}
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <p className="text-purple-900 mb-3">🔧 What's Inside Each Node?</p>
                  <div className="bg-white rounded p-3 font-mono text-sm text-slate-700">
                    <div>class TrieNode:</div>
                    <div className="ml-4">children = {'{}'} <span className="text-purple-600"># Dictionary: char → TrieNode</span></div>
                    <div className="ml-4">is_end = False <span className="text-purple-600"># True if this ends a word</span></div>
                  </div>
                  <p className="text-sm text-slate-600 mt-3">
                    Example: At node 'a' in path "ca", children = {'{'}'t': TrieNode, 'r': TrieNode{'}'}
                  </p>
                </div>

                {/* Operations Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-4 bg-green-50 border-green-200">
                    <h4 className="text-green-900 mb-2 flex items-center gap-2">
                      <span className="text-lg">➕</span> Insert
                    </h4>
                    <p className="text-sm text-slate-700">
                      Add "cat": Follow c→a→t, create nodes if missing, mark 't' as end
                    </p>
                    <Badge className="mt-2 bg-green-600">O(m) - m = word length</Badge>
                  </Card>
                  <Card className="p-4 bg-blue-50 border-blue-200">
                    <h4 className="text-blue-900 mb-2 flex items-center gap-2">
                      <span className="text-lg">🔍</span> Search
                    </h4>
                    <p className="text-sm text-slate-700">
                      Find "cat": Follow c→a→t, check if 't' is marked as end
                    </p>
                    <Badge className="mt-2 bg-blue-600">O(m) - m = word length</Badge>
                  </Card>
                  <Card className="p-4 bg-yellow-50 border-yellow-200">
                    <h4 className="text-yellow-900 mb-2 flex items-center gap-2">
                      <span className="text-lg">📝</span> Prefix
                    </h4>
                    <p className="text-sm text-slate-700">
                      Check "ca": Follow c→a, return true if path exists
                    </p>
                    <Badge className="mt-2 bg-yellow-600">O(m) - m = prefix length</Badge>
                  </Card>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Section 2.5: Interactive Trie Builder */}
          <AccordionItem value="section-2-5" className="bg-white border border-purple-200 rounded-xl overflow-hidden shadow-sm">
            <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-purple-50/50">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎮</span>
                <h2 className="text-xl text-purple-700">Interactive: Build Your Own Trie!</h2>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="space-y-4 mb-6">
                <p className="text-slate-700 text-base">
                  Now it's your turn! Insert words and search to see how the Trie grows. Watch how words share prefixes!
                </p>
              </div>
              <TrieManualBuilder />
            </AccordionContent>
          </AccordionItem>

          {/* Section 4: Insert Operation */}
          <AccordionItem value="section-4" className="bg-white border border-indigo-200 rounded-xl overflow-hidden shadow-sm">
            <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-indigo-50/50">
              <div className="flex items-center gap-3">
                <span className="text-2xl">➕</span>
                <h2 className="text-xl text-indigo-700">Understanding: Inserting Words</h2>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <InsertExplanation />
              <div className="mt-6">
                <TrieInsertAnimation />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Section 6: Search Operation */}
          <AccordionItem value="section-6" className="bg-white border border-purple-200 rounded-xl overflow-hidden shadow-sm">
            <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-purple-50/50">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🔍</span>
                <h2 className="text-xl text-purple-700">Understanding: Searching for Words</h2>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <SearchExplanation />
              <div className="mt-6">
                <h4 className="text-purple-900 mb-4">Interactive: Word vs Prefix Search</h4>
                <TrieSearchVisualization />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Section 7: Real-World Applications */}
          <AccordionItem value="section-7" className="bg-white border border-cyan-200 rounded-xl overflow-hidden shadow-sm">
            <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-cyan-50/50">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🚀</span>
                <h2 className="text-xl text-cyan-700">Where Are Tries Used?</h2>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <RealWorldApplications />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}

// ========== Component: TrieNode Task ==========
function TrieNodeTask() {
  const starterCode = `class TrieNode:
    def __init__(self):
        # TODO: Initialize children dictionary
        # TODO: Initialize is_end as False
        pass

# Test your TrieNode
node = TrieNode()
print("children:", node.children)
print("is_end:", node.is_end)`;

  const solution = `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

node = TrieNode()
print("children:", node.children)
print("is_end:", node.is_end)`;

  return (
    <div className="space-y-4">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-green-900 mb-2">🎯 Your Mission:</p>
        <p className="text-slate-700 text-sm">
          Create a <code className="bg-green-100 px-1.5 py-0.5 rounded">TrieNode</code> class with:
        </p>
        <ul className="text-slate-700 text-sm mt-2 space-y-1 list-disc list-inside ml-4">
          <li><strong>children</strong>: An empty dictionary (will store char → TrieNode mappings)</li>
          <li><strong>is_end</strong>: A boolean flag set to False (marks word endings)</li>
        </ul>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-sm text-blue-900 flex items-center gap-2">
          <Lightbulb className="w-4 h-4" />
          <strong>Hint:</strong> Use <code className="bg-blue-100 px-1.5 py-0.5 rounded">self.children = {'{}'}</code>
        </p>
      </div>

      <TrieTaskEditor
        starterCode={starterCode}
        solution={solution}
        expectedOutput="children: {}\nis_end: False"
        taskDescription="Create the TrieNode class"
      />
    </div>
  );
}

// ========== Component: Insert Explanation ==========
function InsertExplanation() {
  return (
    <div className="space-y-4">
      <p className="text-slate-700 text-base">
        To insert a word like <code className="bg-indigo-50 px-2 py-1 rounded">"cat"</code>, we need to:
      </p>

      <div className="space-y-3">
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="bg-indigo-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm">
              1
            </div>
            <div>
              <p className="text-indigo-900 mb-1">Start at the root</p>
              <p className="text-slate-700 text-sm">Begin at the root node of the Trie</p>
            </div>
          </div>
        </div>

        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="bg-indigo-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm">
              2
            </div>
            <div>
              <p className="text-indigo-900 mb-1">For each character in "cat"</p>
              <p className="text-slate-700 text-sm">
                Check if the character exists in current node's children
              </p>
            </div>
          </div>
        </div>

        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="bg-indigo-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm">
              3
            </div>
            <div>
              <p className="text-indigo-900 mb-1">Create node if missing</p>
              <p className="text-slate-700 text-sm">
                If character doesn't exist: <code className="bg-indigo-100 px-1.5 py-0.5 rounded">node.children[char] = TrieNode()</code>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="bg-indigo-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm">
              4
            </div>
            <div>
              <p className="text-indigo-900 mb-1">Move to child node</p>
              <p className="text-slate-700 text-sm">
                Update: <code className="bg-indigo-100 px-1.5 py-0.5 rounded">node = node.children[char]</code>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm">
              5
            </div>
            <div>
              <p className="text-green-900 mb-1">Mark the end</p>
              <p className="text-slate-700 text-sm">
                After processing all characters, set: <code className="bg-green-100 px-1.5 py-0.5 rounded">node.is_end = True</code>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
        <p className="text-slate-900 mb-2">📝 Example Trace: Inserting "cat"</p>
        <div className="font-mono text-sm text-slate-700 space-y-1">
          <div>node = root</div>
          <div>char = 'c' → create root.children['c'] = TrieNode() → move to it</div>
          <div>char = 'a' → create c_node.children['a'] = TrieNode() → move to it</div>
          <div>char = 't' → create a_node.children['t'] = TrieNode() → move to it</div>
          <div className="text-green-600">✓ Set t_node.is_end = True</div>
        </div>
      </div>
    </div>
  );
}

// ========== Component: Insert Task ==========
function InsertTask() {
  const starterCode = `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

class Trie:
    def __init__(self):
        self.root = TrieNode()
    
    def insert(self, word):
        node = self.root
        
        # TODO: Loop through each character in word
        # TODO: If char not in node.children, create new TrieNode
        # TODO: Move to the child node
        # TODO: After loop, mark node.is_end = True
        pass

# Test
trie = Trie()
trie.insert("cat")
print("Inserted 'cat'")
print("Root has 'c':", 'c' in trie.root.children)`;

  const solution = `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

class Trie:
    def __init__(self):
        self.root = TrieNode()
    
    def insert(self, word):
        node = self.root
        
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        
        node.is_end = True

trie = Trie()
trie.insert("cat")
print("Inserted 'cat'")
print("Root has 'c':", 'c' in trie.root.children)`;

  return (
    <div className="space-y-4">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-green-900 mb-2">🎯 Your Mission:</p>
        <p className="text-slate-700 text-sm">
          Implement the <code className="bg-green-100 px-1.5 py-0.5 rounded">insert(word)</code> method that adds a word to the Trie.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-sm text-blue-900 flex items-center gap-2">
          <Lightbulb className="w-4 h-4" />
          <strong>Hint:</strong> Use a for loop and check <code className="bg-blue-100 px-1.5 py-0.5 rounded">if char not in node.children</code>
        </p>
      </div>

      <TrieTaskEditor
        starterCode={starterCode}
        solution={solution}
        expectedOutput="Inserted 'cat'\nRoot has 'c': True"
        taskDescription="Implement the insert method"
      />
    </div>
  );
}

// ========== Component: Search Explanation ==========
function SearchExplanation() {
  return (
    <div className="space-y-4">
      <p className="text-slate-700 text-base">
        To search for a word like <code className="bg-purple-50 px-2 py-1 rounded">"cat"</code>, we need to:
      </p>

      <div className="space-y-3">
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm">
              1
            </div>
            <div>
              <p className="text-purple-900 mb-1">Start at the root</p>
              <p className="text-slate-700 text-sm">Begin traversal from root node</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm">
              2
            </div>
            <div>
              <p className="text-purple-900 mb-1">Check each character</p>
              <p className="text-slate-700 text-sm">
                If character NOT in children → return False (word doesn't exist)
              </p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm">
              3
            </div>
            <div>
              <p className="text-purple-900 mb-1">Move to child</p>
              <p className="text-slate-700 text-sm">
                If character exists, move to that child node
              </p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm">
              4
            </div>
            <div>
              <p className="text-green-900 mb-1">Check word ending</p>
              <p className="text-slate-700 text-sm">
                After processing all chars, return <code className="bg-green-100 px-1.5 py-0.5 rounded">node.is_end</code>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-900 mb-2">⚠️ Important Distinction:</p>
        <div className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <XCircle className="w-4 h-4 text-red-600 mt-0.5" />
            <p className="text-slate-700">
              Path exists but is_end = False → prefix exists, but NOT a complete word
              <br />
              Example: Trie has "cat", search "ca" → path exists, but "ca" is not a word!
            </p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
            <p className="text-slate-700">
              Path exists AND is_end = True → word found!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ========== Component: Search Task ==========
function SearchTask() {
  const starterCode = `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

class Trie:
    def __init__(self):
        self.root = TrieNode()
    
    def insert(self, word):
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end = True
    
    def search(self, word):
        node = self.root
        
        # TODO: Loop through each character
        # TODO: If char not in children, return False
        # TODO: Move to child node
        # TODO: After loop, return node.is_end
        pass

# Test
trie = Trie()
trie.insert("cat")
trie.insert("car")
print(trie.search("cat"))   # Should print True
print(trie.search("ca"))    # Should print False (prefix only)
print(trie.search("dog"))   # Should print False`;

  const solution = `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

class Trie:
    def __init__(self):
        self.root = TrieNode()
    
    def insert(self, word):
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end = True
    
    def search(self, word):
        node = self.root
        
        for char in word:
            if char not in node.children:
                return False
            node = node.children[char]
        
        return node.is_end

trie = Trie()
trie.insert("cat")
trie.insert("car")
print(trie.search("cat"))
print(trie.search("ca"))
print(trie.search("dog"))`;

  return (
    <div className="space-y-4">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-green-900 mb-2">🎯 Your Mission:</p>
        <p className="text-slate-700 text-sm">
          Implement <code className="bg-green-100 px-1.5 py-0.5 rounded">search(word)</code> that returns True if word exists, False otherwise.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-sm text-blue-900 flex items-center gap-2">
          <Lightbulb className="w-4 h-4" />
          <strong>Hint:</strong> Check both path existence AND is_end flag!
        </p>
      </div>

      <TrieTaskEditor
        starterCode={starterCode}
        solution={solution}
        expectedOutput="True\nFalse\nFalse"
        taskDescription="Implement the search method"
      />
    </div>
  );
}

// ========== Component: Complete Trie ==========
function CompleteTrie() {
  const starterCode = `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

class Trie:
    def __init__(self):
        self.root = TrieNode()
    
    def insert(self, word):
        # TODO: Implement insert
        pass
    
    def search(self, word):
        # TODO: Implement search
        pass
    
    def starts_with(self, prefix):
        """Check if any word starts with prefix"""
        # TODO: Similar to search, but don't check is_end
        # Just return True if path exists, False otherwise
        pass

# Test all methods
trie = Trie()
trie.insert("apple")
trie.insert("app")
print(trie.search("apple"))        # True
print(trie.search("app"))          # True
print(trie.search("appl"))         # False
print(trie.starts_with("app"))     # True
print(trie.starts_with("appe"))    # True`;

  const solution = `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

class Trie:
    def __init__(self):
        self.root = TrieNode()
    
    def insert(self, word):
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end = True
    
    def search(self, word):
        node = self.root
        for char in word:
            if char not in node.children:
                return False
            node = node.children[char]
        return node.is_end
    
    def starts_with(self, prefix):
        node = self.root
        for char in prefix:
            if char not in node.children:
                return False
            node = node.children[char]
        return True

trie = Trie()
trie.insert("apple")
trie.insert("app")
print(trie.search("apple"))
print(trie.search("app"))
print(trie.search("appl"))
print(trie.starts_with("app"))
print(trie.starts_with("appe"))`;

  return (
    <div className="space-y-4">
      <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-4">
        <p className="text-amber-900 mb-2">🏆 Final Challenge:</p>
        <p className="text-slate-700 text-sm mb-3">
          Implement a complete Trie with all three methods: insert, search, and starts_with.
        </p>
        <ul className="text-slate-700 text-sm space-y-1 list-disc list-inside ml-4">
          <li><strong>insert(word)</strong>: Add a word to the Trie</li>
          <li><strong>search(word)</strong>: Return True if exact word exists</li>
          <li><strong>starts_with(prefix)</strong>: Return True if any word has this prefix</li>
        </ul>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-sm text-blue-900 flex items-center gap-2">
          <Lightbulb className="w-4 h-4" />
          <strong>Hint:</strong> starts_with is like search, but without the is_end check!
        </p>
      </div>

      <TrieTaskEditor
        starterCode={starterCode}
        solution={solution}
        expectedOutput="True\nTrue\nFalse\nTrue\nTrue"
        taskDescription="Complete Trie implementation"
      />
    </div>
  );
}

// ========== Component: Real World Applications ==========
function RealWorldApplications() {
  return (
    <div className="space-y-4">
      <p className="text-slate-700 text-base mb-4">
        Now that you've built a Trie from scratch, let's see where they're used in real applications!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4 border-cyan-200 bg-cyan-50">
          <div className="flex items-start gap-3 mb-3">
            <div className="bg-cyan-600 text-white rounded p-2">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-cyan-900">Autocomplete / Search Suggestions</h4>
              <Badge className="mt-1 bg-cyan-600">Google, IDEs</Badge>
            </div>
          </div>
          <p className="text-sm text-slate-700">
            Type "app" → instantly get "apple", "application", "approve" suggestions. 
            Tries make this O(k) instead of O(n).
          </p>
        </Card>

        <Card className="p-4 border-blue-200 bg-blue-50">
          <div className="flex items-start gap-3 mb-3">
            <div className="bg-blue-600 text-white rounded p-2">
              <span className="text-lg">📖</span>
            </div>
            <div>
              <h4 className="text-blue-900">Spell Checkers</h4>
              <Badge className="mt-1 bg-blue-600">Word, Grammarly</Badge>
            </div>
          </div>
          <p className="text-sm text-slate-700">
            Check if a word exists in dictionary. Suggest similar words by exploring nearby paths in the Trie.
          </p>
        </Card>

        <Card className="p-4 border-green-200 bg-green-50">
          <div className="flex items-start gap-3 mb-3">
            <div className="bg-green-600 text-white rounded p-2">
              <span className="text-lg">🌐</span>
            </div>
            <div>
              <h4 className="text-green-900">IP Routing Tables</h4>
              <Badge className="mt-1 bg-green-600">Internet Routers</Badge>
            </div>
          </div>
          <p className="text-sm text-slate-700">
            Longest prefix matching for IP addresses. Find the most specific route by traversing the Trie.
          </p>
        </Card>

        <Card className="p-4 border-purple-200 bg-purple-50">
          <div className="flex items-start gap-3 mb-3">
            <div className="bg-purple-600 text-white rounded p-2">
              <span className="text-lg">📱</span>
            </div>
            <div>
              <h4 className="text-purple-900">T9 Predictive Text</h4>
              <Badge className="mt-1 bg-purple-600">Old Phone Keyboards</Badge>
            </div>
          </div>
          <p className="text-sm text-slate-700">
            Press 2-2-8 on a phone → suggests "cat", "bat", "act". Trie maps number sequences to words.
          </p>
        </Card>

        <Card className="p-4 border-orange-200 bg-orange-50">
          <div className="flex items-start gap-3 mb-3">
            <div className="bg-orange-600 text-white rounded p-2">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-orange-900">Code Editors (IntelliSense)</h4>
              <Badge className="mt-1 bg-orange-600">VS Code, IntelliJ</Badge>
            </div>
          </div>
          <p className="text-sm text-slate-700">
            Type "Array." → get all Array methods. Tries store API names for instant code completion.
          </p>
        </Card>

        <Card className="p-4 border-pink-200 bg-pink-50">
          <div className="flex items-start gap-3 mb-3">
            <div className="bg-pink-600 text-white rounded p-2">
              <span className="text-lg">🎮</span>
            </div>
            <div>
              <h4 className="text-pink-900">Boggle / Word Games</h4>
              <Badge className="mt-1 bg-pink-600">Scrabble, Boggle</Badge>
            </div>
          </div>
          <p className="text-sm text-slate-700">
            Quickly validate if letter sequences form valid words. Tries make word lookups instant.
          </p>
        </Card>
      </div>

      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border-2 border-cyan-300 rounded-lg p-6 mt-6">
        <h3 className="text-cyan-900 mb-3 flex items-center gap-2">
          <span className="text-2xl">⚡</span>
          Why Tries Win
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-cyan-900 mb-1">Array/List Approach:</p>
            <ul className="text-slate-700 space-y-1 list-disc list-inside">
              <li>Search: O(n × m) - check every word</li>
              <li>Prefix search: O(n × m) - scan all words</li>
              <li>Space: O(n × m) - store full words</li>
            </ul>
          </div>
          <div>
            <p className="text-green-900 mb-1">Trie Approach:</p>
            <ul className="text-slate-700 space-y-1 list-disc list-inside">
              <li>Search: O(m) - length of word only!</li>
              <li>Prefix search: O(m) - length of prefix only!</li>
              <li>Space: Shared prefixes save memory</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
