import { ProgressiveLesson } from '../types/progressive-lesson-enhanced';
import { moduleGreedyLessonSmartPracticeExercises } from './exercises/moduleGreedyLessonSmartPracticeExercises';

export const moduleGreedyLesson: ProgressiveLesson = {
  id: 'greedy-algorithms',
  title: 'Module: Greedy Algorithms',
  description: 'Master greedy algorithms: interval scheduling, sorting strategies, binary search on answer, and proof techniques',
  unlockMode: 'sequential',
  sections: [
    {
      type: 'reading',
      id: 'greedy-intro',
      title: 'Introduction: The Greedy Mindset',
      content: `<h1>Greedy Algorithms: Local Choices, Global Solutions</h1>
<p>A <strong>greedy algorithm</strong> makes the locally optimal choice at each step, hoping this leads to a globally optimal solution.</p>
<h2>The Core Idea</h2>
<p>At every decision point, pick the option that looks best <em>right now</em>, without considering future consequences. Sometimes this simple strategy gives the optimal answer!</p>
<pre><code>Example: Making change for 87 cents (US coins)
Greedy: Always pick the largest coin that fits
  → 50¢ (remaining: 37¢)
  → 25¢ (remaining: 12¢)
  → 10¢ (remaining: 2¢)
  → 1¢ (remaining: 1¢)
  → 1¢ (remaining: 0¢)
Total: 5 coins ✓ (This IS optimal for US coins!)
</code></pre>
<h2>When Does Greedy Work?</h2>
<p>Greedy works when the problem has these properties:</p>
<ol>
<li><strong>Greedy Choice Property:</strong> A locally optimal choice leads to a globally optimal solution</li>
<li><strong>Optimal Substructure:</strong> The optimal solution contains optimal solutions to subproblems</li>
</ol>
<p>Not all problems have these properties! That's why proving greedy correctness matters.</p>
<hr>
<h2>Common Greedy Patterns</h2>
<table>
<thead>
<tr><th>Pattern</th><th>Strategy</th><th>Classic Problems</th></tr>
</thead>
<tbody>
<tr><td><strong>Interval Scheduling</strong></td><td>Sort by end time, pick earliest</td><td>Activity Selection, Meeting Rooms</td></tr>
<tr><td><strong>Sorting + Two Pointers</strong></td><td>Sort and scan from ends</td><td>Two Sum variants, Container With Water</td></tr>
<tr><td><strong>Frequency Counting</strong></td><td>Process by frequency order</td><td>Task Scheduler, Reorganize String</td></tr>
<tr><td><strong>Binary Search on Answer</strong></td><td>Guess answer, check feasibility</td><td>Capacity to Ship, Koko Eating Bananas</td></tr>
<tr><td><strong>Greedy + Heap</strong></td><td>Always process min/max element</td><td>Merge K Sorted Lists, Dijkstra's</td></tr>
</tbody>
</table>
`,
      estimatedReadTime: 300,
    },
    {
      type: 'reading',
      id: 'greedy-proof',
      title: 'Proving Greedy Correctness',
      content: `<h1>How to Prove a Greedy Algorithm Works</h1>
<p>The trickiest part of greedy algorithms isn't writing the code—it's convincing yourself (and interviewers) that it's correct.</p>
<h2>Two Main Proof Techniques</h2>
<h3>1. Exchange Argument</h3>
<p>Show that any optimal solution can be transformed into the greedy solution without making it worse.</p>
<pre><code>Proof structure:
1. Assume OPT is an optimal solution
2. If OPT differs from GREEDY at some point...
3. Show you can "exchange" to match GREEDY
4. The exchange doesn't make OPT worse
5. Therefore, GREEDY is also optimal
</code></pre>
<h3>2. Greedy Stays Ahead</h3>
<p>Show that at every step, greedy is at least as good as any other approach.</p>
<pre><code>Proof structure:
1. Define a measure of "progress"
2. Show greedy makes at least as much progress as any alternative at each step
3. By induction, greedy ends up at least as good as optimal
</code></pre>
<hr>
<h2>Example: Activity Selection</h2>
<p><strong>Problem:</strong> Given intervals, select maximum non-overlapping ones.</p>
<p><strong>Greedy:</strong> Sort by end time. Always pick the interval that ends earliest (and doesn't conflict).</p>
<p><strong>Proof (Exchange):</strong></p>
<ol>
<li>Let OPT be any optimal solution</li>
<li>Let GREEDY pick interval G first (earliest end time)</li>
<li>If OPT picks different interval O first, then O.end ≥ G.end</li>
<li>Replace O with G in OPT → still valid (G ends earlier, so no new conflicts)</li>
<li>New solution has same size, so it's still optimal</li>
<li>Repeat for each greedy choice → GREEDY = OPT</li>
</ol>
<p><strong>Key insight:</strong> Picking the earliest-ending interval leaves the most room for future choices.</p>
`,
      estimatedReadTime: 360,
    },
    {
      type: 'reading',
      id: 'greedy-vs-dp',
      title: 'Greedy vs Dynamic Programming',
      content: `<h1>When Greedy Fails: Enter DP</h1>
<p>Greedy doesn't always work. Here's how to tell the difference:</p>
<h2>Greedy Failure Example: Coin Change</h2>
<pre><code>Coins: [1, 3, 4]
Target: 6

Greedy (pick largest first):
  → 4 (remaining: 2)
  → 1 (remaining: 1)
  → 1 (remaining: 0)
Total: 3 coins

Optimal:
  → 3 + 3 = 6
Total: 2 coins ✗ Greedy failed!
</code></pre>
<p>The greedy choice (picking 4) eliminated the path to the optimal solution (two 3s).</p>
<hr>
<h2>Decision Framework</h2>
<table>
<thead>
<tr><th>Characteristic</th><th>Likely Greedy</th><th>Likely DP</th></tr>
</thead>
<tbody>
<tr><td>Choices affect future options?</td><td>Minimally</td><td>Significantly</td></tr>
<tr><td>Need to try all combinations?</td><td>No</td><td>Yes</td></tr>
<tr><td>Local optimal = global optimal?</td><td>Yes</td><td>Not necessarily</td></tr>
<tr><td>Can prove exchange argument?</td><td>Yes</td><td>Usually no</td></tr>
</tbody>
</table>
<h2>Greedy-Friendly Problem Types</h2>
<ul>
<li><strong>Interval scheduling</strong> (sort by end time)</li>
<li><strong>Huffman coding</strong> (always merge smallest)</li>
<li><strong>Fractional knapsack</strong> (best value/weight ratio)</li>
<li><strong>Minimum spanning tree</strong> (Kruskal's, Prim's)</li>
<li><strong>Single-source shortest path</strong> (Dijkstra's with non-negative weights)</li>
</ul>
<h2>DP-Required Problem Types</h2>
<ul>
<li><strong>0/1 Knapsack</strong> (can't take fractions)</li>
<li><strong>Coin change</strong> (minimum coins)</li>
<li><strong>Longest common subsequence</strong></li>
<li><strong>Edit distance</strong></li>
</ul>
`,
      estimatedReadTime: 300,
    },
    {
      type: 'reading',
      id: 'greedy-binary-search',
      title: 'Pattern: Binary Search on Answer',
      content: `<h1>Binary Search on Answer</h1>
<p>A powerful technique that combines greedy checking with binary search.</p>
<h2>The Pattern</h2>
<p>When you need to find the minimum/maximum value that satisfies some condition:</p>
<ol>
<li><strong>Binary search</strong> on the answer space</li>
<li>For each candidate answer, <strong>greedily check</strong> if it's feasible</li>
</ol>
<pre><code>def binary_search_answer(lo, hi):
    while lo < hi:
        mid = (lo + hi) // 2
        if can_achieve(mid):  # Greedy feasibility check
            hi = mid  # Try smaller
        else:
            lo = mid + 1  # Need larger
    return lo
</code></pre>
<hr>
<h2>Classic Examples</h2>
<h3>Capacity to Ship Packages</h3>
<p><strong>Problem:</strong> Ship packages in order with minimum capacity such that all ship within D days.</p>
<pre><code>Binary search: ship capacity from max(weights) to sum(weights)
Greedy check: Can we ship with capacity C in ≤ D days?
  → Greedily pack each day until capacity reached
  → Count days needed
</code></pre>
<h3>Koko Eating Bananas</h3>
<p><strong>Problem:</strong> Find minimum eating speed to finish all bananas in H hours.</p>
<pre><code>Binary search: speed from 1 to max(piles)
Greedy check: Can Koko finish at speed K in ≤ H hours?
  → Each pile takes ceil(pile/K) hours
  → Sum all hours, check if ≤ H
</code></pre>
<h3>Split Array Largest Sum</h3>
<p><strong>Problem:</strong> Split array into m subarrays to minimize the largest subarray sum.</p>
<pre><code>Binary search: sum from max(nums) to sum(nums)
Greedy check: Can we split with max sum ≤ S using ≤ m subarrays?
  → Greedily extend subarray until sum exceeds S
  → Count subarrays needed
</code></pre>
<hr>
<h2>Key Insight</h2>
<p>The answer space is <strong>monotonic</strong>: if capacity C works, then C+1 also works. This monotonicity enables binary search!</p>
`,
      estimatedReadTime: 360,
    },
    {
      type: 'reading',
      id: 'greedy-summary',
      title: 'Summary: Greedy Algorithm Checklist',
      content: `<h1>Greedy Algorithm Checklist</h1>
<h2>Before Coding</h2>
<ol>
<li><strong>Identify the greedy choice:</strong> What local decision should you make at each step?</li>
<li><strong>Verify correctness:</strong> Can you prove it works (exchange argument or greedy stays ahead)?</li>
<li><strong>Consider counterexamples:</strong> Does greedy fail for any edge cases?</li>
</ol>
<h2>Common Greedy Strategies</h2>
<ul>
<li><strong>Sort first:</strong> Most greedy problems require sorting by some criteria</li>
<li><strong>Process extremes:</strong> Pick min/max element, earliest/latest event</li>
<li><strong>Use heaps:</strong> When you need repeated access to min/max</li>
<li><strong>Two pointers:</strong> When processing from both ends</li>
</ul>
<h2>Red Flags (Might Need DP Instead)</h2>
<ul>
<li>Counting <em>number of ways</em> to do something</li>
<li>Choices have significant downstream effects</li>
<li>Can't prove greedy choice is always safe</li>
<li>Problem asks for <em>all</em> solutions, not just one optimal</li>
</ul>
<h2>Interview Tips</h2>
<ol>
<li>State your greedy strategy clearly before coding</li>
<li>Give intuition for why it works</li>
<li>Be ready to explain with an example</li>
<li>If asked to prove, use exchange argument</li>
</ol>
<p><strong>Now practice with the exercises below!</strong></p>
`,
      estimatedReadTime: 240,
    },

    // SMART PRACTICE EXERCISES - All practice problems for this module
    ...moduleGreedyLessonSmartPracticeExercises,
  ],
};
