import { ProgressiveLesson } from '../types/progressive-lesson-enhanced';
import { modulePrefixSuffixLessonSmartPracticeExercises } from './exercises/modulePrefixSuffixLessonSmartPracticeExercises';

export const modulePrefixSuffixLesson: ProgressiveLesson = {
  id: 'prefix-suffix-arrays',
  title: 'Module: Prefix & Suffix Arrays',
  description: 'Master prefix and suffix array patterns to solve problems requiring information from both directions',
  unlockMode: 'sequential',
  sections: [
    {
      type: 'reading',
      id: 'pivot-from-problem-to-solution',
      title: 'From Problem to Optimized Solution',
      content: `<h1>Section 1 — The Problem That Forces This Pattern</h1>
<p>You are given an array. Find an index such that:</p>
<ul>
<li>sum of elements to the <strong>left</strong> equals</li>
<li>sum of elements to the <strong>right</strong></li>
</ul>
<p>Example:</p>
<pre><code>[1, 7, 3, 6, 5, 6]
           ↑
         pivot
</code></pre>
<p>Left sum = 1 + 7 + 3 = 11<br>Right sum = 5 + 6 = 11</p>
<hr>
<h2>Section 2 — The Obvious (But Slow) Approach</h2>
<p>A natural first attempt:</p>
<ul>
<li>sum everything on the left</li>
<li>sum everything on the right</li>
<li>compare</li>
</ul>
<p>This works — but it does unnecessary work.</p>
<h3>What Actually Happens</h3>
<p>At index 1:</p>
<ul>
<li>left = sum(<code>[1]</code>)</li>
<li>right = sum(<code>[3,6,5,6]</code>)</li>
</ul>
<p>At index 2:</p>
<ul>
<li>left = sum(<code>[1,7]</code>)</li>
<li>right = sum(<code>[6,5,6]</code>)</li>
</ul>
<p>You are <strong>recomputing the same partial sums again and again</strong>, which leads to nested loops, O(n²) time, and repeated work.</p>
<hr>
<h2>Section 3 — Thinking in Directions (History vs Future)</h2>
<p>Forget the math trick for a moment. Think in terms of <strong>what information is available</strong>.</p>
<p>At any index <code>i</code>:</p>
<ol>
<li>The <strong>left side</strong> is <strong>history</strong> – everything we have already seen.  </li>
<li>The <strong>right side</strong> is <strong>future</strong> – everything we have not processed yet.</li>
</ol>
<p>On a normal left→right scan:</p>
<ul>
<li>We know the <strong>history</strong> at <code>i</code> (easy to track with a running value).</li>
<li>We are <strong>blind</strong> to the <strong>future</strong> at <code>i</code> (those elements have not been read yet).</li>
</ul>
<p>So how can we know both sides at once?</p>
<blockquote>
<p>Idea: If we walk the array <strong>backwards first</strong>, then from the forward scan&#39;s point of view,<br>the &quot;future&quot; has already been pre-computed.</p>
</blockquote>
<p>You can imagine two sweeps:</p>
<ul>
<li>A left→right sweep building a &quot;left map&quot; of what we&#39;ve seen so far.  </li>
<li>A right→left sweep building a &quot;right map&quot; of what remains.</li>
</ul>
<p>They meet at each index and give you both pieces of information instantly.</p>
<hr>
<h2>Section 4 — The Generic Two-Array Solution</h2>
<p>Before we optimize, solve the problem in a way that works for:</p>
<ul>
<li>sums  </li>
<li>products  </li>
<li>mins / maxes  </li>
<li>counts (like distinct characters)</li>
</ul>
<h3>Step 1: Build the Left Map</h3>
<p>Walk left→right, and store what you know so far:</p>
<pre><code class="language-python">left = [0] * len(nums)

running = 0
for i in range(len(nums)):
    left[i] = running      # &quot;history before i&quot;
    running += nums[i]
</code></pre>
<p>After this pass, <code>left[i]</code> answers:<br><strong>&quot;What is the sum before I got here?&quot;</strong></p>
<h3>Step 2: Build the Right Map</h3>
<p>Walk right→left, and store what is left after this index:</p>
<pre><code class="language-python">right = [0] * len(nums)

running = 0
for i in range(len(nums) - 1, -1, -1):
    right[i] = running     # &quot;future after i&quot;
    running += nums[i]
</code></pre>
<p>After this pass, <code>right[i]</code> answers:<br><strong>&quot;What is the sum after this index?&quot;</strong></p>
<h3>Step 3: Answer the Question</h3>
<p>Now the pivot check is trivial:</p>
<pre><code class="language-python">for i in range(len(nums)):
    if left[i] == right[i]:
        return i
return -1
</code></pre>
<p>This solution:</p>
<ul>
<li>Does <strong>two passes</strong> over the array  </li>
<li>Uses <strong>two arrays</strong> (<code>left</code> and <code>right</code>)  </li>
<li>Works for sums, products, mins, maxes, counts, etc. (just change what you accumulate)</li>
</ul>
<blockquote>
<p>This is the <strong>prefix/suffix approach</strong>:<br>pre-compute information from each direction so every index query is O(1).</p>
</blockquote>
<h3>Stop and Predict (Micro-Exercise)</h3>
<p>Before you look at any more code, answer for yourself:</p>
<ol>
<li>Where does the <strong>right-to-left</strong> loop start and end?  </li>
<li>What is the initial value of <code>running</code>?  </li>
<li>At index <code>i</code>, what does <code>right[i]</code> represent in words?</li>
</ol>
<p>If you can answer those, you&#39;ve internalized the two-pass idea.</p>
<hr>
<h2>Section 5 — A Sum-Only Optimization (The Shortcut)</h2>
<p>For <strong>sums specifically</strong>, we can avoid storing the <code>right</code> array at all.</p>
<p>If:</p>
<pre><code class="language-python">total = sum(nums)
</code></pre>
<p>then at index <code>i</code>:</p>
<pre><code class="language-python">right = total - left - nums[i]
</code></pre>
<p>So we can write a space-optimized solution:</p>
<pre><code class="language-python">def pivotIndex(nums):
    total = sum(nums)
    left = 0

    for i in range(len(nums)):
        right = total - left - nums[i]
        if left == right:
            return i
        left += nums[i]

    return -1
</code></pre>
<h3>Why This Works (and When It Doesn&#39;t)</h3>
<ul>
<li><code>left</code> accumulates progressively (like our left map)  </li>
<li><code>right</code> is <strong>derived</strong> instead of stored  </li>
<li>each element is touched once</li>
</ul>
<p><strong>Time:</strong> O(n)<br><strong>Space:</strong> O(1)</p>
<p>But this is a <strong>shortcut for sums only</strong>:</p>
<ul>
<li>For <strong>products</strong>, subtraction no longer makes sense.  </li>
<li>For <strong>mins / maxes</strong>, there is no simple &quot;total&quot; to subtract from.  </li>
<li>For many problems (like distinct counts), you must fall back to the full two-array approach.</li>
</ul>
<p>So the learning order is:</p>
<ol>
<li>Understand the <strong>two-pass left/right maps</strong> (general approach).  </li>
<li>Then recognize that for some operations (like sum), you can compress it into a neat arithmetic trick.</li>
</ol>
<hr>
<h2>What You Actually Learned</h2>
<p>You did not just solve a problem.</p>
<p>You learned a reusable principle.</p>
<blockquote>
<p>When a problem asks for information about <strong>both sides of an index</strong>, avoid recomputing — accumulate once and reuse.</p>
</blockquote>
<hr>
<h2>Naming the Pattern (Only Now)</h2>
<p>This thinking is commonly called the <strong>Prefix / Suffix technique</strong>.</p>
<ul>
<li><strong>Prefix</strong> → cumulative information from the left</li>
<li><strong>Suffix</strong> → cumulative information from the right</li>
</ul>
<p>Sometimes you explicitly store arrays. Sometimes you derive one side from totals. Both are the same idea.</p>
<h3>Bonus: Building the Suffix Explicitly</h3>
<p>After the &quot;aha&quot;, it can help to practice the suffix build once:</p>
<pre><code class="language-python">suf = [0] * len(nums)
suf[-1] = nums[-1]

for i in range(len(nums) - 2, -1, -1):
    suf[i] = suf[i + 1] + nums[i]
</code></pre>
<p>You walk from right to left, reusing the next value — exactly the mirror of how we build prefix sums.</p>
<hr>
<h2>When to Use This Pattern</h2>
<p>Use prefix/suffix thinking when you see:</p>
<ul>
<li>&quot;before index / after index&quot;</li>
<li>&quot;excluding current element&quot;</li>
<li>&quot;split the array&quot;</li>
<li>&quot;left side equals right side&quot;</li>
<li>&quot;information from both directions&quot;</li>
<li>nested loops that recompute ranges</li>
</ul>
<hr>
<h2>Mental Checklist (Takeaway)</h2>
<p>Before you code, ask:</p>
<ol>
<li>Am I recomputing a range repeatedly?</li>
<li>Can I accumulate results while scanning?</li>
<li>Can I derive one side from totals?</li>
<li>What invariant must hold at each index?</li>
</ol>
<p>If yes → prefix/suffix applies.</p>
<hr>
<h2>Summary</h2>
<ul>
<li>Brute force recomputes work</li>
<li>Prefix/suffix stores or derives it</li>
<li>You trade repetition for accumulation</li>
<li>This converts O(n²) → O(n)</li>
<li>The idea generalizes widely</li>
</ul>
<p>You now have the foundation needed to solve an entire family of array problems.</p>
<h2>Practice Time</h2>
<p>Now apply what you learned. For more problems, click the <strong>Practice</strong> button in the header.</p>
`,
    },
        ...modulePrefixSuffixLessonSmartPracticeExercises,],
};

