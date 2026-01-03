import { ProgressiveLesson } from '../types/progressive-lesson-enhanced';
import { module15ParenthesesLessonSmartPracticeExercises } from './exercises/moduleParenthesesLessonSmartPracticeExercises';

export const module15ParenthesesLesson: ProgressiveLesson = {
  id: 'parentheses-balanced-strings',
    title: 'Module: Balanced Parentheses Toolset',
    description: 'Master the complete toolkit for parentheses problems: stack, counter, backtracking, and DP techniques',
    unlockMode: 'sequential',
    sections: [
        // Introduction: The Parentheses Toolset
        {
            type: 'reading',
            id: 'parentheses-intro',
            title: 'The Parentheses Problem Toolset',
            estimatedReadTime: 300,
            content: `<h1>The Parentheses Problem Toolset</h1>
<p>Parentheses problems are a <strong>favorite interview category</strong> at FAANG companies. They test your understanding of stacks, recursion, and dynamic programming - all in one elegant package.</p>
<h2>The Mental Model: Height/Depth</h2>
<p>Think of parentheses as a <strong>mountain hike</strong>:</p>
<ul>
<li><code>(</code> = step UP (increase depth)</li>
<li><code>)</code> = step DOWN (decrease depth)</li>
<li>Valid string = you end at ground level (height 0) and never go underground</li>
</ul>
<pre><code>String: ( ( ) ( ) )
Height: 1 2 1 2 1 0
        ↗ ↗ ↘ ↗ ↘ ↘
</code></pre>
<h2>The Four Core Tools</h2>
<table>
<thead>
<tr>
<th>Tool</th>
<th>When to Use</th>
<th>Example Problems</th>
</tr>
</thead>
<tbody><tr>
<td><strong>Stack</strong></td>
<td>Need to match pairs, track what&#39;s open</td>
<td>Valid Parentheses, Score of Parentheses</td>
</tr>
<tr>
<td><strong>Counter</strong></td>
<td>Only care about balance, not matching</td>
<td>Min Add to Make Valid, Remove Outermost</td>
</tr>
<tr>
<td><strong>Backtracking</strong></td>
<td>Generate all valid combinations</td>
<td>Generate Parentheses, Remove Invalid</td>
</tr>
<tr>
<td><strong>DP</strong></td>
<td>Optimization (longest, minimum cost)</td>
<td>Longest Valid Parentheses</td>
</tr>
</tbody></table>
<h2>Tool #1: Stack</h2>
<p>Use when you need to <strong>match opening with closing</strong> brackets.</p>
<pre><code class="language-python">def isValid(s):
    stack = []
    for char in s:
        if char == &#39;(&#39;:
            stack.append(char)
        elif char == &#39;)&#39;:
            if not stack:
                return False  # Nothing to match!
            stack.pop()
    return len(stack) == 0  # All matched?
</code></pre>
<h2>Tool #2: Counter (Balance Tracking)</h2>
<p>Use when you only need to know <strong>how many unmatched</strong> - no need to track which ones.</p>
<pre><code class="language-python">def minAddToMakeValid(s):
    open_needed = 0  # Unmatched &#39;(&#39;
    close_needed = 0  # Unmatched &#39;)&#39;

    for char in s:
        if char == &#39;(&#39;:
            open_needed += 1
        elif char == &#39;)&#39;:
            if open_needed &gt; 0:
                open_needed -= 1  # Matched!
            else:
                close_needed += 1  # Need an extra &#39;(&#39;

    return open_needed + close_needed
</code></pre>
<h2>Tool #3: Backtracking</h2>
<p>Use when you need to <strong>generate all valid combinations</strong>.</p>
<pre><code class="language-python">def generateParenthesis(n):
    result = []

    def backtrack(current, open_count, close_count):
        if len(current) == 2 * n:
            result.append(current)
            return

        if open_count &lt; n:
            backtrack(current + &#39;(&#39;, open_count + 1, close_count)
        if close_count &lt; open_count:
            backtrack(current + &#39;)&#39;, open_count, close_count + 1)

    backtrack(&#39;&#39;, 0, 0)
    return result
</code></pre>
<h2>Tool #4: Dynamic Programming</h2>
<p>Use for <strong>optimization problems</strong> - longest valid, minimum removals, etc.</p>
<hr>
<h2>Problem Progression in This Module</h2>
<p>We&#39;ll tackle 10 problems, building your toolset:</p>
<ol>
<li><strong>Valid Parentheses</strong> - Stack basics</li>
<li><strong>Remove Outermost Parentheses</strong> - Height tracking</li>
<li><strong>Minimum Add to Make Valid</strong> - Counter technique</li>
<li><strong>Generate Parentheses</strong> - Backtracking</li>
<li><strong>Score of Parentheses</strong> - Stack evaluation</li>
<li><strong>Maximum Nesting Depth Split</strong> - Depth assignment</li>
<li>*<em>Valid Parenthesis String (with <em>)</em></em> - Range tracking</li>
<li><strong>Longest Valid Parentheses</strong> - DP</li>
<li><strong>Remove Invalid Parentheses</strong> - BFS/Backtracking</li>
<li><strong>Serialize/Deserialize Binary Tree</strong> - Tree ↔ Parentheses</li>
</ol>
<p>Let&#39;s build your toolkit!</p>
`
        },

        // Module Complete
        {
            type: 'reading',
            id: 'module-complete',
            title: 'Parentheses Toolset Complete!',
            content: `<h1>Congratulations! You&#39;ve Mastered the Parentheses Toolset</h1>
<h2>The Tools You&#39;ve Learned</h2>
<table>
<thead>
<tr>
<th>Tool</th>
<th>When to Use</th>
<th>Problems</th>
</tr>
</thead>
<tbody><tr>
<td><strong>Stack</strong></td>
<td>Match pairs, track opens</td>
<td>Valid Parentheses, Score, Longest Valid</td>
</tr>
<tr>
<td><strong>Counter</strong></td>
<td>Just balance, no matching</td>
<td>Min Add, Remove Outermost</td>
</tr>
<tr>
<td><strong>Depth/Height</strong></td>
<td>Level-based operations</td>
<td>Remove Outermost, Max Depth Split</td>
</tr>
<tr>
<td><strong>Backtracking</strong></td>
<td>Generate all valid</td>
<td>Generate Parentheses, Remove Invalid</td>
</tr>
<tr>
<td><strong>DP</strong></td>
<td>Optimization problems</td>
<td>Longest Valid</td>
</tr>
<tr>
<td><strong>Range Tracking</strong></td>
<td>Handle uncertainty (*)</td>
<td>Valid with Wildcards</td>
</tr>
</tbody></table>
<h2>Pattern Recognition Guide</h2>
<h3>&quot;Is this string valid?&quot;</h3>
<p>→ <strong>Stack</strong> (for multiple bracket types) or <strong>Counter</strong> (for single type)</p>
<h3>&quot;Count/fix minimum changes&quot;</h3>
<p>→ <strong>Counter</strong> - track unmatched opens and closes</p>
<h3>&quot;Generate all valid combinations&quot;</h3>
<p>→ <strong>Backtracking</strong> with open_count, close_count</p>
<h3>&quot;Find longest/minimum something&quot;</h3>
<p>→ <strong>DP</strong> or <strong>Stack with indices</strong></p>
<h3>&quot;Handle wildcards/uncertainty&quot;</h3>
<p>→ <strong>Range tracking</strong> [lo, hi]</p>
<h3>&quot;Split or assign parentheses&quot;</h3>
<p>→ <strong>Depth tracking</strong> with parity</p>
<h2>Bonus: Find the Missing Numbers</h2>
<p>Don&#39;t miss the <strong>bonus Google interview question</strong> at the end! It demonstrates:</p>
<ul>
<li>How to progress from brute force → optimal (4 different approaches!)</li>
<li>The importance of knowing built-in function complexities</li>
<li>How to handle output formatting (hyphenated ranges)</li>
</ul>
<h2>Interview Tips</h2>
<ol>
<li><p><strong>Start with the mental model:</strong> Draw the &quot;mountain&quot; - every string is a height graph</p>
</li>
<li><p><strong>Identify the tool:</strong> Match the problem type to the right technique</p>
</li>
<li><p><strong>Edge cases to always check:</strong></p>
<ul>
<li>Empty string</li>
<li>All opens &quot;(((&quot;</li>
<li>All closes &quot;)))&quot;</li>
<li>Single char</li>
</ul>
</li>
<li><p><strong>Common optimization:</strong> Many stack problems can use O(1) space with counters!</p>
</li>
</ol>
<h2>What&#39;s Next?</h2>
<p>You now have a complete toolkit for one of the most common interview categories. Practice mixing these problems to build pattern recognition!</p>
<p><strong>Recommended practice order for interviews:</strong></p>
<ol>
<li>Valid Parentheses (warm-up)</li>
<li>Generate Parentheses (backtracking)</li>
<li>Longest Valid Parentheses (DP)</li>
<li>Remove Invalid Parentheses (BFS)</li>
</ol>
<p>Good luck with your interviews!</p>
`,
            estimatedReadTime: 180,
            autoMarkComplete: false,
        },
        ...module15ParenthesesLessonSmartPracticeExercises,
    ],
};
