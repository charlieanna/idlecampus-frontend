import { ProgressiveLesson, LessonSection } from '../types/progressive-lesson-enhanced';
import { module3BitManipulationLessonSmartPracticeExercises } from './exercises/moduleBitManipulationLessonSmartPracticeExercises';

export const module3BitManipulationLesson: ProgressiveLesson = {
  id: 'bit-manipulation-math',
  title: 'Module: Bit Manipulation & Math',
  description: 'Master bitwise operations and mathematical problem-solving techniques',
  unlockMode: 'sequential',
  sections: [
    {
      type: 'reading',
      id: 'bit-operations',
      title: 'Core Bit Operations',
      content: `<h1>Core Bit Operations ⚡</h1>
<h2>The Basics</h2>
<h3>1. AND (&amp;) - Both must be 1</h3>
<pre><code>5 &amp; 3
0101
0011
----
0001  = 1
</code></pre>
<p><strong>Use:</strong> Check if bit is set, clear bits, masks</p>
<h3>2. OR (|) - Either can be 1</h3>
<pre><code>5 | 3
0101
0011
----
0111  = 7
</code></pre>
<p><strong>Use:</strong> Set bits, combine flags</p>
<h3>3. XOR (^) - Different bits = 1</h3>
<pre><code>5 ^ 3
0101
0011
----
0110  = 6
</code></pre>
<p><strong>Use:</strong> Toggle bits, find unique element, swap variables</p>
<h3>4. NOT (~) - Flip all bits</h3>
<pre><code>~5
0101 → 1010  (in 4-bit representation)
</code></pre>
<h3>5. Left Shift (&lt;&lt;) - Multiply by 2^n</h3>
<pre><code>5 &lt;&lt; 1
0101 &lt;&lt; 1 = 1010  = 10  (5 * 2)
5 &lt;&lt; 2 = 10100 = 20  (5 * 4)
</code></pre>
<h3>6. Right Shift (&gt;&gt;) - Divide by 2^n</h3>
<pre><code>5 &gt;&gt; 1
0101 &gt;&gt; 1 = 0010  = 2  (5 // 2)
</code></pre>
<hr>
<h2>Essential Tricks</h2>
<h3>Check if Bit is Set</h3>
<pre><code class="language-python">def is_bit_set(n, i):
    return (n &amp; (1 &lt;&lt; i)) != 0
</code></pre>
<h3>Set a Bit</h3>
<pre><code class="language-python">def set_bit(n, i):
    return n | (1 &lt;&lt; i)
</code></pre>
<h3>Clear a Bit</h3>
<pre><code class="language-python">def clear_bit(n, i):
    return n &amp; ~(1 &lt;&lt; i)
</code></pre>
<h3>Toggle a Bit</h3>
<pre><code class="language-python">def toggle_bit(n, i):
    return n ^ (1 &lt;&lt; i)
</code></pre>
<hr>
<h2>Power of 2 Check</h2>
<p><strong>Why <code>n &amp; (n-1) == 0</code> works:</strong></p>
<pre><code>n = 8 (power of 2)
    1000
n-1 = 7
    0111
n &amp; (n-1) = 0000  ← Only one bit was set!

n = 6 (not power of 2)
    0110
n-1 = 5
    0101
n &amp; (n-1) = 0100  ← Still has bits set
</code></pre>
<p>Powers of 2 have exactly ONE bit set!</p>
`,
    },

    {
      type: 'reading',
      id: 'math-patterns',
      title: 'Mathematical Patterns',
      content: `<h1>Mathematical Patterns 📐</h1>
<h2>GCD - Greatest Common Divisor</h2>
<p><strong>Euclidean Algorithm:</strong></p>
<pre><code class="language-python">def gcd(a, b):
    while b:
        a, b = b, a % b
    return a
</code></pre>
<p><strong>LCM - Least Common Multiple:</strong></p>
<pre><code class="language-python">def lcm(a, b):
    return (a * b) // gcd(a, b)
</code></pre>
<hr>
<h2>Prime Numbers</h2>
<h3>Check if Prime</h3>
<pre><code class="language-python">def is_prime(n):
    if n &lt; 2:
        return False
    for i in range(2, int(n**0.5) + 1):
        if n % i == 0:
            return False
    return True
</code></pre>
<p><strong>Optimization:</strong> Only check up to √n!</p>
<h3>Sieve of Eratosthenes (all primes up to n)</h3>
<pre><code class="language-python">def sieve(n):
    is_prime = [True] * (n + 1)
    is_prime[0] = is_prime[1] = False

    for i in range(2, int(n**0.5) + 1):
        if is_prime[i]:
            # Mark multiples as not prime
            for j in range(i*i, n + 1, i):
                is_prime[j] = False

    return [i for i in range(n + 1) if is_prime[i]]
</code></pre>
<hr>
<h2>Fast Exponentiation</h2>
<p><strong>Compute a^n in O(log n):</strong></p>
<pre><code class="language-python">def power(a, n):
    result = 1
    while n &gt; 0:
        if n &amp; 1:  # If n is odd
            result *= a
        a *= a
        n &gt;&gt;= 1  # n = n // 2
    return result
</code></pre>
<p><strong>With modulo (for large numbers):</strong></p>
<pre><code class="language-python">def power_mod(a, n, mod):
    result = 1
    a %= mod
    while n &gt; 0:
        if n &amp; 1:
            result = (result * a) % mod
        a = (a * a) % mod
        n &gt;&gt;= 1
    return result
</code></pre>
<hr>
<h2>Number Theory Tricks</h2>
<h3>Sum of 1 to n</h3>
<pre><code class="language-python">sum_n = n * (n + 1) // 2
</code></pre>
<h3>Sum of squares 1² + 2² + ... + n²</h3>
<pre><code class="language-python">sum_squares = n * (n + 1) * (2*n + 1) // 6
</code></pre>
<h3>Check if perfect square</h3>
<pre><code class="language-python">def is_perfect_square(n):
    root = int(n ** 0.5)
    return root * root == n
</code></pre>
`,
    },// EXERCISE: Bitwise ORs of Subarrays (LeetCode 898)
    ,// EXERCISE: Count Triplets with Equal XOR (LeetCode 1442)
    ,// EXERCISE: Minimum One Bit Operations (LeetCode 1611)
    ,{
      type: 'reading',
      id: 'module3-summary',
      title: 'Module Complete!',
      content: `<h1>🎉 Module 3 Complete!</h1>
<h2>Bit Operations Mastered</h2>
<h3>Core Operations</h3>
<ul>
<li><strong>AND (&amp;):</strong> Check bits, create masks</li>
<li><strong>OR (|):</strong> Set bits, combine flags</li>
<li><strong>XOR (^):</strong> Find differences, toggle bits, find unique</li>
<li><strong>Shifts (&lt;&lt;, &gt;&gt;):</strong> Multiply/divide by powers of 2</li>
</ul>
<h3>Essential Tricks</h3>
<ul>
<li><strong>Power of 2:</strong> <code>n &amp; (n-1) == 0</code></li>
<li><strong>Count bits:</strong> Brian Kernighan&#39;s algorithm</li>
<li><strong>Single number:</strong> XOR all elements</li>
<li><strong>Set/clear/toggle bit:</strong> Bit masks</li>
</ul>
<hr>
<h2>Math Patterns Mastered</h2>
<h3>Algorithms</h3>
<ul>
<li><strong>GCD/LCM:</strong> Euclidean algorithm</li>
<li><strong>Primes:</strong> Sieve of Eratosthenes</li>
<li><strong>Fast power:</strong> O(log n) exponentiation</li>
</ul>
<h3>Formulas</h3>
<ul>
<li>Sum 1 to n: <code>n(n+1)/2</code></li>
<li>Sum of squares: <code>n(n+1)(2n+1)/6</code></li>
<li>Perfect square check</li>
</ul>
<hr>
<h2>When to Use</h2>
<p><strong>Bit Manipulation:</strong></p>
<ul>
<li>Subset generation</li>
<li>Flag management</li>
<li>Space-efficient storage</li>
<li>Ultra-fast operations</li>
</ul>
<p><strong>Math:</strong></p>
<ul>
<li>Number theory problems</li>
<li>Optimization problems</li>
<li>Combinatorics</li>
<li>Modular arithmetic</li>
</ul>
<hr>
<h2>Next: Module 4</h2>
<p><strong>Array + Hash Map Combinations</strong> - Advanced patterns combining techniques!</p>
<p>Ready? 🚀</p>
`,
    },
  
  ...module3BitManipulationLessonSmartPracticeExercises,
  ].filter(Boolean) as LessonSection[],
};
