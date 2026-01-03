import { ProgressiveLesson } from '../types/progressive-lesson-enhanced';
import { moduleConcurrencyLessonSmartPracticeExercises } from './exercises/moduleConcurrencyLessonSmartPracticeExercises';

export const moduleConcurrencyLesson: ProgressiveLesson = {
  id: 'concurrency-threading',
  title: 'Module: Concurrency & Threading',
  description: 'Master Python threading, synchronization primitives, and concurrent patterns for parallel execution',
  unlockMode: 'sequential',
  sections: [
    // ==================== READING 1: Concurrency Fundamentals ====================
    {
      type: 'reading',
      id: 'concurrency-fundamentals',
      title: 'Concurrency Fundamentals',
      content: `<h1>Concurrency: Running Things "At the Same Time"</h1>
<p>Concurrency is about dealing with multiple tasks at once. It doesn't mean they run <em>simultaneously</em>—it means they make progress together.</p>

<h2>Threads vs Processes</h2>
<table>
<thead>
<tr><th>Aspect</th><th>Thread</th><th>Process</th></tr>
</thead>
<tbody>
<tr><td><strong>Memory</strong></td><td>Shared with parent</td><td>Separate/isolated</td></tr>
<tr><td><strong>Creation cost</strong></td><td>Lightweight (~KB)</td><td>Heavy (~MB)</td></tr>
<tr><td><strong>Communication</strong></td><td>Direct (shared vars)</td><td>IPC (pipes, queues)</td></tr>
<tr><td><strong>Crash impact</strong></td><td>Can crash whole program</td><td>Isolated failure</td></tr>
</tbody>
</table>

<h2>Python's GIL (Global Interpreter Lock)</h2>
<p>Python has a <strong>Global Interpreter Lock</strong> that allows only one thread to execute Python bytecode at a time. This is unique to CPython (the standard implementation).</p>

<pre><code># What this means in practice:
# ❌ CPU-bound work: Threads DON'T help (GIL blocks parallelism)
# ✅ I/O-bound work: Threads DO help (GIL releases during I/O waits)

# For CPU parallelism, use multiprocessing instead:
from multiprocessing import Pool  # Each process has its own GIL
</code></pre>

<h2>When to Use Threading</h2>
<ul>
<li><strong>Network requests:</strong> Waiting for API responses</li>
<li><strong>File I/O:</strong> Reading/writing multiple files</li>
<li><strong>User interfaces:</strong> Keep UI responsive during background work</li>
<li><strong>Producer-consumer:</strong> Decoupling data generation from processing</li>
</ul>

<h2>Key Terminology</h2>
<ul>
<li><strong>Race condition:</strong> Bug caused by unpredictable thread execution order</li>
<li><strong>Deadlock:</strong> Threads waiting for each other forever</li>
<li><strong>Thread-safe:</strong> Code that works correctly with concurrent access</li>
<li><strong>Critical section:</strong> Code that must not be interrupted</li>
<li><strong>Mutex/Lock:</strong> Ensures only one thread accesses a resource</li>
</ul>
`,
      estimatedReadTime: 300,
    },

    // ==================== READING 2: Thread Basics ====================
    {
      type: 'reading',
      id: 'thread-basics',
      title: 'Thread Basics',
      content: `<h1>Creating and Managing Threads</h1>
<p>Python's <code>threading</code> module provides the core threading primitives.</p>

<h2>Basic Thread Creation</h2>
<pre><code>import threading
import time

def worker(name, delay):
    print(f"{name} starting")
    time.sleep(delay)  # Simulates work
    print(f"{name} finished")

# Create and start threads
t1 = threading.Thread(target=worker, args=("Thread-1", 2))
t2 = threading.Thread(target=worker, args=("Thread-2", 1))

t1.start()
t2.start()

print("Main thread continues...")
# Output order is non-deterministic!
</code></pre>

<h2>Waiting for Threads with join()</h2>
<pre><code>t1.start()
t2.start()

# Wait for both threads to complete
t1.join()
t2.join()

print("Both threads done!")  # Only prints after t1 and t2 finish
</code></pre>

<h2>Daemon Threads</h2>
<p>Daemon threads are background threads that don't block program exit.</p>
<pre><code># Regular thread: Program waits for it
t = threading.Thread(target=worker, args=("Regular", 5))
t.start()  # Program won't exit for 5 seconds

# Daemon thread: Program can exit immediately
t = threading.Thread(target=worker, args=("Daemon", 5))
t.daemon = True  # or pass daemon=True to constructor
t.start()
# Program can exit, killing daemon thread
</code></pre>

<h2>Thread Class Pattern</h2>
<p>For more control, subclass Thread:</p>
<pre><code>class DownloadThread(threading.Thread):
    def __init__(self, url):
        super().__init__()
        self.url = url
        self.result = None

    def run(self):
        # This method runs in the new thread
        self.result = download(self.url)

t = DownloadThread("http://example.com")
t.start()
t.join()
print(t.result)  # Access result after join
</code></pre>

<h2>Common Pitfalls</h2>
<ul>
<li><strong>Calling run() instead of start():</strong> run() executes in current thread</li>
<li><strong>Forgetting join():</strong> Main thread exits before workers finish</li>
<li><strong>Sharing mutable data:</strong> Leads to race conditions (next section)</li>
</ul>
`,
      estimatedReadTime: 360,
    },

    // ==================== EXERCISE 1: Basic Thread Creation ====================
    {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-basic-thread-creation',
      title: 'Create and Run Threads',
      description: 'Create multiple threads that run concurrently',
      targetComplexity: { time: 'O(1)', space: 'O(1)' },
      instruction: `# Create and Run Threads

Write a function that creates \`n\` threads, each printing their thread number.

## Requirements
1. Create \`n\` threads
2. Each thread should call the provided \`print_thread_id\` function with its number (0 to n-1)
3. Start all threads and wait for them to complete
4. Return the total number of threads created

## Example
\`\`\`
Input: n = 3
Output: 3
Side effect: prints "Thread 0", "Thread 1", "Thread 2" (order may vary)
\`\`\`

## Starter Code
Complete the function below:`,
      starterCode: `import threading

def print_thread_id(thread_id):
    print(f"Thread {thread_id}")

def create_threads(n):
    # Create n threads that each call print_thread_id
    # Start all threads and wait for completion
    # Return n
    pass`,
      expectedOutput: ``,
      hints: [
        { afterAttempt: 1, text: 'Use a list to store Thread objects. Each Thread should have target=print_thread_id and args=(i,)' },
        { afterAttempt: 2, text: 'After starting all threads with .start(), use another loop to .join() each one' }
      ],
      solution: {
        afterAttempt: 3,
        text: `# Solution

\`\`\`python
import threading

def print_thread_id(thread_id):
    print(f"Thread {thread_id}")

def create_threads(n):
    threads = []

    # Create and start all threads
    for i in range(n):
        t = threading.Thread(target=print_thread_id, args=(i,))
        threads.append(t)
        t.start()

    # Wait for all to complete
    for t in threads:
        t.join()

    return n
\`\`\`

## Key Points
- Store threads in a list to join them later
- Pass arguments as a tuple: \`args=(i,)\` not \`args=i\`
- Always join threads to ensure completion before returning`
      },
      testCases: [
        { input: '1', expected: '1' },
        { input: '3', expected: '3' },
        { input: '5', expected: '5' }
      ],
    },

    // ==================== READING 3: Synchronization Primitives ====================
    {
      type: 'reading',
      id: 'synchronization-primitives',
      title: 'Synchronization Primitives',
      content: `<h1>Protecting Shared Data</h1>
<p>When threads share data, we need synchronization to prevent race conditions.</p>

<h2>The Race Condition Problem</h2>
<pre><code># BROKEN: Race condition!
counter = 0

def increment():
    global counter
    for _ in range(100000):
        counter += 1  # Read, add, write - not atomic!

t1 = threading.Thread(target=increment)
t2 = threading.Thread(target=increment)
t1.start(); t2.start()
t1.join(); t2.join()
print(counter)  # Often less than 200000!
</code></pre>

<h2>Lock (Mutex)</h2>
<p>A Lock ensures only one thread accesses a resource at a time.</p>
<pre><code>lock = threading.Lock()
counter = 0

def safe_increment():
    global counter
    for _ in range(100000):
        lock.acquire()      # Wait if locked
        try:
            counter += 1    # Safe: only one thread here
        finally:
            lock.release()  # Always release!

# Better: use context manager
def safe_increment():
    global counter
    for _ in range(100000):
        with lock:          # Automatically acquires/releases
            counter += 1
</code></pre>

<h2>RLock (Reentrant Lock)</h2>
<p>A lock that can be acquired multiple times by the same thread.</p>
<pre><code>rlock = threading.RLock()

def outer():
    with rlock:
        inner()  # Same thread can acquire again

def inner():
    with rlock:  # Would deadlock with regular Lock!
        print("inner")
</code></pre>

<h2>Semaphore</h2>
<p>Allows up to N threads to access a resource simultaneously.</p>
<pre><code># Allow max 3 concurrent database connections
db_semaphore = threading.Semaphore(3)

def query_database():
    with db_semaphore:      # Blocks if 3 threads already inside
        execute_query()     # At most 3 threads here at once
</code></pre>

<h2>Event</h2>
<p>A flag that threads can wait for.</p>
<pre><code>start_event = threading.Event()

def worker():
    print("Waiting for signal...")
    start_event.wait()  # Blocks until event is set
    print("Got signal, starting work!")

# In main thread
threading.Thread(target=worker).start()
time.sleep(2)
start_event.set()  # Unblocks all waiting threads
</code></pre>

<h2>Condition</h2>
<p>For complex producer-consumer scenarios with wait/notify.</p>
<pre><code>condition = threading.Condition()
queue = []

def producer():
    with condition:
        queue.append(item)
        condition.notify()  # Wake up one consumer

def consumer():
    with condition:
        while not queue:
            condition.wait()  # Release lock, wait for notify
        return queue.pop(0)
</code></pre>

<h2>Barrier</h2>
<p>Synchronization point where all threads must arrive before any can proceed.</p>
<pre><code>barrier = threading.Barrier(3)  # Wait for 3 threads

def worker(id):
    print(f"Worker {id} preparing")
    barrier.wait()  # Block until all 3 arrive
    print(f"Worker {id} starting together")
</code></pre>
`,
      estimatedReadTime: 480,
    },

    // ==================== EXERCISE 2: Thread-Safe Counter ====================
    {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-thread-safe-counter',
      title: 'Thread-Safe Counter',
      description: 'Implement a counter that works correctly with concurrent access',
      targetComplexity: { time: 'O(1) per operation', space: 'O(1)' },
      instruction: `# Thread-Safe Counter

Implement a \`ThreadSafeCounter\` class that supports concurrent increment and decrement operations.

## Requirements
1. \`increment()\` - Add 1 to counter, return new value
2. \`decrement()\` - Subtract 1 from counter, return new value
3. \`get_value()\` - Return current value
4. All operations must be thread-safe

## Example
\`\`\`
counter = ThreadSafeCounter()
# If 1000 threads each call increment() once
# Final value should be exactly 1000
\`\`\`

## Constraints
- Counter starts at 0
- Must work correctly with any number of concurrent threads`,
      starterCode: `import threading

class ThreadSafeCounter:
    def __init__(self):
        # Initialize counter and any synchronization primitives
        pass

    def increment(self):
        # Add 1 and return new value
        pass

    def decrement(self):
        # Subtract 1 and return new value
        pass

    def get_value(self):
        # Return current value
        pass`,
      expectedOutput: ``,
      hints: [
        { afterAttempt: 1, text: 'Use threading.Lock() to protect the counter variable' },
        { afterAttempt: 2, text: 'Use "with self.lock:" to ensure the lock is always released, even if an exception occurs' }
      ],
      solution: {
        afterAttempt: 3,
        text: `# Solution

\`\`\`python
import threading

class ThreadSafeCounter:
    def __init__(self):
        self._value = 0
        self._lock = threading.Lock()

    def increment(self):
        with self._lock:
            self._value += 1
            return self._value

    def decrement(self):
        with self._lock:
            self._value -= 1
            return self._value

    def get_value(self):
        with self._lock:
            return self._value
\`\`\`

## Why This Works
- The lock ensures only one thread modifies _value at a time
- Using \`with\` ensures the lock is released even on exceptions
- get_value() also needs the lock to prevent reading partial writes`
      },
      testCases: [
        { input: 'counter = ThreadSafeCounter(); counter.increment(); counter.increment(); counter.get_value()', expected: '2' },
        { input: 'counter = ThreadSafeCounter(); counter.increment(); counter.decrement(); counter.get_value()', expected: '0' }
      ],
    },

    // ==================== EXERCISE 3: Print in Order (LeetCode 1114) ====================
    {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-print-in-order',
      title: 'Print in Order',
      description: 'Ensure three threads print in a specific order regardless of scheduling',
      targetComplexity: { time: 'O(1)', space: 'O(1)' },
      instruction: `# Print in Order (LeetCode 1114)

Three different threads are given functions \`first\`, \`second\`, and \`third\`. Design a mechanism to ensure they print in order "first" → "second" → "third", regardless of which thread runs first.

## Example
\`\`\`
Input: order = [1,2,3]  # Threads start in order
Output: "firstsecondthird"

Input: order = [1,3,2]  # Thread 3 tries to run before thread 2
Output: "firstsecondthird"  # Still correct order!

Input: order = [3,1,2]  # Thread 3 starts first
Output: "firstsecondthird"  # Thread 3 waits for 1 and 2
\`\`\`

## Your Task
Implement the Foo class so that calling first(), second(), third() from any threads always results in the correct order.`,
      starterCode: `import threading

class Foo:
    def __init__(self):
        # Initialize synchronization primitives
        pass

    def first(self, printFirst):
        # printFirst() outputs "first". Do not change this.
        printFirst()
        # Signal that first is done

    def second(self, printSecond):
        # Wait for first to complete
        # printSecond() outputs "second". Do not change this.
        printSecond()
        # Signal that second is done

    def third(self, printThird):
        # Wait for second to complete
        # printThird() outputs "third". Do not change this.
        printThird()`,
      expectedOutput: ``,
      hints: [
        { afterAttempt: 1, text: 'Use threading.Event() - one event for "first done" and one for "second done"' },
        { afterAttempt: 2, text: 'second() should wait() on first_done event. third() should wait() on second_done event.' }
      ],
      solution: {
        afterAttempt: 3,
        text: `# Solution: Using Events

\`\`\`python
import threading

class Foo:
    def __init__(self):
        self.first_done = threading.Event()
        self.second_done = threading.Event()

    def first(self, printFirst):
        printFirst()
        self.first_done.set()  # Signal first is complete

    def second(self, printSecond):
        self.first_done.wait()  # Wait for first
        printSecond()
        self.second_done.set()  # Signal second is complete

    def third(self, printThird):
        self.second_done.wait()  # Wait for second
        printThird()
\`\`\`

## Alternative: Using Locks
\`\`\`python
class Foo:
    def __init__(self):
        self.lock1 = threading.Lock()
        self.lock2 = threading.Lock()
        self.lock1.acquire()  # Start locked
        self.lock2.acquire()  # Start locked

    def first(self, printFirst):
        printFirst()
        self.lock1.release()  # Unlock for second

    def second(self, printSecond):
        with self.lock1:      # Wait for first
            printSecond()
            self.lock2.release()  # Unlock for third

    def third(self, printThird):
        with self.lock2:      # Wait for second
            printThird()
\`\`\``
      },
      testCases: [
        { input: '[1,2,3]', expected: '"firstsecondthird"' },
        { input: '[1,3,2]', expected: '"firstsecondthird"' },
        { input: '[3,2,1]', expected: '"firstsecondthird"' }
      ],
    },

    // ==================== READING 4: Thread Pools ====================
    {
      type: 'reading',
      id: 'thread-pools',
      title: 'Thread Pools & Executors',
      content: `<h1>ThreadPoolExecutor: The Modern Way</h1>
<p>Creating threads manually is tedious and error-prone. <code>ThreadPoolExecutor</code> manages a pool of reusable threads.</p>

<h2>Basic Usage</h2>
<pre><code>from concurrent.futures import ThreadPoolExecutor

def fetch_url(url):
    return requests.get(url).text

# Create pool with 4 worker threads
with ThreadPoolExecutor(max_workers=4) as executor:
    # Submit individual tasks
    future = executor.submit(fetch_url, "http://example.com")
    result = future.result()  # Blocks until complete
</code></pre>

<h2>Processing Multiple Items with map()</h2>
<pre><code>urls = ["http://a.com", "http://b.com", "http://c.com"]

with ThreadPoolExecutor(max_workers=3) as executor:
    # map() returns results in order, processes in parallel
    results = list(executor.map(fetch_url, urls))
    # results[0] = response from a.com
    # results[1] = response from b.com
    # ...
</code></pre>

<h2>Handling Futures</h2>
<pre><code>from concurrent.futures import as_completed

with ThreadPoolExecutor() as executor:
    # Submit multiple tasks
    futures = [executor.submit(fetch_url, url) for url in urls]

    # Process results as they complete (not in order!)
    for future in as_completed(futures):
        try:
            result = future.result()
            print(f"Got: {result[:50]}")
        except Exception as e:
            print(f"Error: {e}")
</code></pre>

<h2>Future Methods</h2>
<pre><code>future = executor.submit(slow_function)

future.done()       # True if completed
future.cancelled()  # True if cancelled before starting
future.cancel()     # Attempt to cancel (may fail if running)
future.result()     # Get result (blocks until ready)
future.result(timeout=5)  # Wait max 5 seconds
future.exception()  # Get exception if one occurred
</code></pre>

<h2>Choosing max_workers</h2>
<ul>
<li><strong>I/O-bound tasks:</strong> More workers (10-100+), since they spend time waiting</li>
<li><strong>CPU-bound tasks:</strong> Use ProcessPoolExecutor instead, not threads</li>
<li><strong>Default:</strong> min(32, os.cpu_count() + 4)</li>
</ul>

<pre><code># I/O bound: many workers
with ThreadPoolExecutor(max_workers=50) as executor:
    executor.map(fetch_url, urls)

# CPU bound: use processes, not threads
from concurrent.futures import ProcessPoolExecutor
with ProcessPoolExecutor() as executor:
    executor.map(compute_heavy, data)
</code></pre>
`,
      estimatedReadTime: 360,
    },

    // ==================== EXERCISE 4: Thread Pool Batch Processing ====================
    {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-thread-pool-batch',
      title: 'Parallel Batch Processing',
      description: 'Use ThreadPoolExecutor to process items in parallel',
      targetComplexity: { time: 'O(n/workers)', space: 'O(n)' },
      instruction: `# Parallel Batch Processing

Write a function that processes a list of numbers in parallel using ThreadPoolExecutor.

## Requirements
1. Apply the given \`process_item\` function to each number
2. Use \`max_workers\` threads
3. Return results in the same order as input
4. Handle any exceptions by returning None for that item

## Example
\`\`\`python
def double(x):
    return x * 2

result = parallel_process([1, 2, 3, 4], double, max_workers=2)
# result = [2, 4, 6, 8]
\`\`\`

## Constraints
- Items are independent (no dependencies)
- process_item may raise exceptions`,
      starterCode: `from concurrent.futures import ThreadPoolExecutor

def parallel_process(items, process_item, max_workers=4):
    """
    Process items in parallel and return results in order.
    If process_item raises an exception for an item, return None for that item.
    """
    pass`,
      expectedOutput: ``,
      hints: [
        { afterAttempt: 1, text: 'Use executor.map() to process all items and preserve order' },
        { afterAttempt: 2, text: 'Wrap the function to catch exceptions and return None instead of crashing' }
      ],
      solution: {
        afterAttempt: 3,
        text: `# Solution

\`\`\`python
from concurrent.futures import ThreadPoolExecutor

def parallel_process(items, process_item, max_workers=4):
    def safe_process(item):
        try:
            return process_item(item)
        except Exception:
            return None

    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        results = list(executor.map(safe_process, items))

    return results
\`\`\`

## Key Points
- \`executor.map()\` preserves order automatically
- Wrap the function to handle exceptions gracefully
- \`with\` statement ensures executor shuts down properly
- list() is needed because map() returns an iterator`
      },
      testCases: [
        { input: '[1,2,3,4], lambda x: x*2, 2', expected: '[2,4,6,8]' },
        { input: '[1,2,3], lambda x: x+1, 1', expected: '[2,3,4]' }
      ],
    },

    // ==================== EXERCISE 5: Semaphore Rate Limiting ====================
    {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-semaphore-rate-limit',
      title: 'Rate-Limited API Calls',
      description: 'Use semaphore to limit concurrent API calls',
      targetComplexity: { time: 'O(n)', space: 'O(1)' },
      instruction: `# Rate-Limited API Calls

Implement a rate-limited API caller that allows at most \`max_concurrent\` calls at once.

## Requirements
1. Create a class \`RateLimitedCaller\` with a \`call(func, *args)\` method
2. At most \`max_concurrent\` calls should execute simultaneously
3. Additional calls should wait until a slot is available
4. Return the result of the function

## Example
\`\`\`python
caller = RateLimitedCaller(max_concurrent=3)

# If 10 threads call this simultaneously:
# Only 3 will execute at once, others wait
result = caller.call(fetch_data, url)
\`\`\``,
      starterCode: `import threading

class RateLimitedCaller:
    def __init__(self, max_concurrent):
        # Initialize semaphore
        pass

    def call(self, func, *args):
        # Execute func with rate limiting
        pass`,
      expectedOutput: ``,
      hints: [
        { afterAttempt: 1, text: 'Use threading.Semaphore(max_concurrent) to limit concurrent access' },
        { afterAttempt: 2, text: 'Use "with self.semaphore:" to automatically acquire/release around the function call' }
      ],
      solution: {
        afterAttempt: 3,
        text: `# Solution

\`\`\`python
import threading

class RateLimitedCaller:
    def __init__(self, max_concurrent):
        self.semaphore = threading.Semaphore(max_concurrent)

    def call(self, func, *args):
        with self.semaphore:
            return func(*args)
\`\`\`

## How It Works
- Semaphore starts with N permits (max_concurrent)
- Each \`with\` block acquires a permit (blocks if none available)
- When function completes, permit is automatically released
- This ensures at most N concurrent executions

## Alternative: BoundedSemaphore
\`\`\`python
# Raises error if released more than acquired
self.semaphore = threading.BoundedSemaphore(max_concurrent)
\`\`\``
      },
      testCases: [
        { input: 'caller = RateLimitedCaller(2); caller.call(lambda: 42)', expected: '42' }
      ],
    },

    // ==================== READING 5: Patterns and Pitfalls ====================
    {
      type: 'reading',
      id: 'patterns-pitfalls',
      title: 'Patterns & Pitfalls',
      content: `<h1>Common Concurrency Patterns</h1>

<h2>Producer-Consumer with Queue</h2>
<p>The classic pattern for decoupling data production from consumption.</p>
<pre><code>import threading
import queue

def producer(q, items):
    for item in items:
        q.put(item)
    q.put(None)  # Poison pill to signal completion

def consumer(q):
    while True:
        item = q.get()  # Blocks until item available
        if item is None:
            break
        process(item)
        q.task_done()

q = queue.Queue()
t1 = threading.Thread(target=producer, args=(q, data))
t2 = threading.Thread(target=consumer, args=(q,))
t1.start()
t2.start()
t1.join()
t2.join()
</code></pre>

<h2>Thread-Safe Collections</h2>
<pre><code># queue.Queue is thread-safe by default
q = queue.Queue()      # FIFO
q = queue.LifoQueue()  # LIFO (stack)
q = queue.PriorityQueue()  # Smallest first

# Regular collections are NOT thread-safe!
# Use locks or queue.Queue instead
</code></pre>

<h2>Common Pitfalls</h2>

<h3>1. Deadlock</h3>
<pre><code># DEADLOCK: Thread 1 holds A, waits for B
#           Thread 2 holds B, waits for A
lock_a = threading.Lock()
lock_b = threading.Lock()

def thread1():
    with lock_a:
        with lock_b:  # Waits forever if thread2 holds lock_b
            work()

def thread2():
    with lock_b:
        with lock_a:  # Waits forever if thread1 holds lock_a
            work()

# FIX: Always acquire locks in the same order!
</code></pre>

<h3>2. Race Condition</h3>
<pre><code># RACE: Check-then-act is not atomic
if not cache.has(key):  # Thread 1 checks
    # Thread 2 might add key here!
    cache.set(key, compute())  # Thread 1 sets duplicate

# FIX: Use lock around check-and-set
with lock:
    if not cache.has(key):
        cache.set(key, compute())
</code></pre>

<h3>3. Forgetting to Release Lock</h3>
<pre><code># BAD: Exception leaves lock held forever
lock.acquire()
do_risky_work()  # If this throws, lock never releases!
lock.release()

# GOOD: Use context manager
with lock:
    do_risky_work()  # Lock releases even on exception
</code></pre>

<h3>4. Thread-Local Storage</h3>
<pre><code># Each thread gets its own copy
local = threading.local()

def worker():
    local.x = get_thread_specific_value()
    # local.x is different for each thread
    process(local.x)
</code></pre>

<h2>Best Practices</h2>
<ol>
<li><strong>Minimize shared state:</strong> Less sharing = fewer bugs</li>
<li><strong>Use high-level constructs:</strong> ThreadPoolExecutor > manual threads</li>
<li><strong>Prefer queues:</strong> For producer-consumer patterns</li>
<li><strong>Always use context managers:</strong> \`with lock:\` not \`acquire/release\`</li>
<li><strong>Acquire locks in consistent order:</strong> Prevents deadlocks</li>
</ol>
`,
      estimatedReadTime: 420,
    },

    // ==================== READING 6: Token Bucket Rate Limiting ====================
    {
      type: 'reading',
      id: 'token-bucket',
      title: 'Token Bucket Rate Limiting',
      content: `<h1>Token Bucket Algorithm</h1>
<p>The <strong>Token Bucket</strong> is a classic algorithm for rate limiting - controlling how many requests can be processed in a time window.</p>

<h2>How It Works</h2>
<p>Imagine a bucket that holds tokens:</p>
<ol>
<li>Tokens are added at a constant rate (e.g., 10 tokens/second)</li>
<li>Each request needs a token to proceed</li>
<li>If bucket is empty, request is blocked or rejected</li>
<li>Bucket has a maximum capacity (allows burst traffic)</li>
</ol>

<pre><code># Token Bucket Visualization
Bucket Capacity: 10 tokens
Refill Rate: 2 tokens/second

Time 0s: [🪙🪙🪙🪙🪙🪙🪙🪙🪙🪙] 10 tokens (full)
Request comes → takes 1 token
Time 0s: [🪙🪙🪙🪙🪙🪙🪙🪙🪙⬜] 9 tokens

Burst of 5 requests → takes 5 tokens
Time 0s: [🪙🪙🪙🪙⬜⬜⬜⬜⬜⬜] 4 tokens

Wait 3 seconds → +6 tokens (but capped at 10)
Time 3s: [🪙🪙🪙🪙🪙🪙🪙🪙🪙🪙] 10 tokens (full again)
</code></pre>

<h2>The Key Formula</h2>
<pre><code># Calculate available tokens
tokens = min(capacity, old_tokens + (now - last_refill_time) * refill_rate)
</code></pre>

<h2>Implementation</h2>
<pre><code>import threading
import time

class TokenBucket:
    def __init__(self, capacity, refill_rate):
        self.capacity = capacity      # Max tokens
        self.refill_rate = refill_rate  # Tokens per second
        self.tokens = capacity        # Start full
        self.last_refill = time.time()
        self.lock = threading.Lock()

    def _refill(self):
        now = time.time()
        elapsed = now - self.last_refill
        new_tokens = elapsed * self.refill_rate
        self.tokens = min(self.capacity, self.tokens + new_tokens)
        self.last_refill = now

    def acquire(self, tokens=1):
        with self.lock:
            self._refill()
            if self.tokens >= tokens:
                self.tokens -= tokens
                return True
            return False  # Not enough tokens
</code></pre>

<h2>Comparison: Token Bucket vs Other Algorithms</h2>
<table>
<thead>
<tr><th>Algorithm</th><th>Behavior</th><th>Use Case</th></tr>
</thead>
<tbody>
<tr><td><strong>Token Bucket</strong></td><td>Allows bursts up to capacity</td><td>API rate limiting with burst tolerance</td></tr>
<tr><td><strong>Leaky Bucket</strong></td><td>Constant output rate, no bursts</td><td>Traffic shaping, smooth output</td></tr>
<tr><td><strong>Fixed Window</strong></td><td>Count resets each interval</td><td>Simple quotas (100 req/minute)</td></tr>
<tr><td><strong>Sliding Window</strong></td><td>Rolling window, no edge spikes</td><td>More accurate rate limiting</td></tr>
</tbody>
</table>

<h2>Thread-Safety Considerations</h2>
<ul>
<li><strong>Lock around refill + consume:</strong> Both must be atomic</li>
<li><strong>Time-based refill:</strong> Calculate tokens on-demand, not with a background thread</li>
<li><strong>Distributed systems:</strong> Use Redis or similar for shared token buckets</li>
</ul>
`,
      estimatedReadTime: 360,
    },

    // ==================== EXERCISE: Token Bucket Implementation ====================
    {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-token-bucket',
      title: 'Token Bucket Rate Limiter',
      description: 'Implement a thread-safe token bucket for rate limiting',
      targetComplexity: { time: 'O(1)', space: 'O(1)' },
      instruction: `# Token Bucket Rate Limiter

Implement a thread-safe token bucket rate limiter.

## Requirements
Create \`TokenBucket\` class:
- \`__init__(capacity, refill_rate)\`: capacity = max tokens, refill_rate = tokens per second
- \`acquire(tokens=1)\`: Try to consume tokens, return True if successful, False if not enough
- \`get_tokens()\`: Return current token count (for testing)

## Key Formula
\`\`\`
available_tokens = min(capacity, old_tokens + elapsed_time * refill_rate)
\`\`\`

## Example
\`\`\`python
bucket = TokenBucket(capacity=10, refill_rate=2)  # 10 max, 2 tokens/sec
bucket.acquire(5)   # True, 5 tokens left
bucket.acquire(5)   # True, 0 tokens left
bucket.acquire(1)   # False, not enough tokens
time.sleep(1)       # +2 tokens refilled
bucket.acquire(2)   # True
\`\`\`

## Thread Safety
Multiple threads may call acquire() simultaneously - ensure correctness!`,
      starterCode: `import threading
import time

class TokenBucket:
    def __init__(self, capacity, refill_rate):
        # Initialize bucket with capacity tokens
        # refill_rate = tokens added per second
        pass

    def acquire(self, tokens=1):
        # Try to consume tokens
        # Return True if successful, False otherwise
        pass

    def get_tokens(self):
        # Return current available tokens
        pass`,
      expectedOutput: ``,
      hints: [
        { afterAttempt: 1, text: 'Track: capacity, tokens, refill_rate, last_refill_time, and a lock' },
        { afterAttempt: 2, text: 'In acquire(): first refill based on elapsed time, then check if enough tokens' },
        { afterAttempt: 3, text: 'Refill formula: tokens = min(capacity, tokens + elapsed * refill_rate)' }
      ],
      solution: {
        afterAttempt: 3,
        text: `# Solution

\`\`\`python
import threading
import time

class TokenBucket:
    def __init__(self, capacity, refill_rate):
        self.capacity = capacity
        self.refill_rate = refill_rate
        self.tokens = capacity  # Start full
        self.last_refill = time.time()
        self.lock = threading.Lock()

    def _refill(self):
        """Refill tokens based on elapsed time (call while holding lock)"""
        now = time.time()
        elapsed = now - self.last_refill
        new_tokens = elapsed * self.refill_rate
        self.tokens = min(self.capacity, self.tokens + new_tokens)
        self.last_refill = now

    def acquire(self, tokens=1):
        with self.lock:
            self._refill()
            if self.tokens >= tokens:
                self.tokens -= tokens
                return True
            return False

    def get_tokens(self):
        with self.lock:
            self._refill()
            return self.tokens
\`\`\`

## Why This Works
- **Lazy refill:** We don't need a background thread. Calculate tokens on each acquire().
- **Thread-safe:** Lock protects refill + consume as atomic operation.
- **Burst handling:** Starting at capacity allows initial burst traffic.`
      },
      testCases: [
        { input: 'bucket = TokenBucket(10, 2); bucket.acquire(5)', expected: 'True' },
        { input: 'bucket = TokenBucket(10, 2); bucket.acquire(5); bucket.acquire(5); bucket.acquire(1)', expected: 'False' },
        { input: 'bucket = TokenBucket(10, 2); bucket.get_tokens()', expected: '10' }
      ],
    },

    // ==================== EXERCISE 6: Producer-Consumer ====================
    {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-producer-consumer',
      title: 'Producer-Consumer Queue',
      description: 'Implement a multi-threaded producer-consumer pattern',
      targetComplexity: { time: 'O(n)', space: 'O(n)' },
      instruction: `# Producer-Consumer Queue

Implement a producer-consumer system where:
1. Producer thread generates numbers 0 to n-1
2. Consumer thread doubles each number and stores in results
3. Use queue.Queue for thread-safe communication

## Requirements
- \`produce(q, n)\`: Put numbers 0 to n-1 in queue, then put None to signal done
- \`consume(q, results)\`: Get items from queue, double them, append to results until None received
- \`run_producer_consumer(n)\`: Create queue, run both threads, return sorted results

## Example
\`\`\`
result = run_producer_consumer(5)
# result = [0, 2, 4, 6, 8]  # 0*2, 1*2, 2*2, 3*2, 4*2
\`\`\``,
      starterCode: `import threading
import queue

def produce(q, n):
    # Put numbers 0 to n-1 in queue
    # Put None to signal completion
    pass

def consume(q, results):
    # Get items until None
    # Double each and append to results
    pass

def run_producer_consumer(n):
    # Create queue, start threads, wait, return sorted results
    pass`,
      expectedOutput: ``,
      hints: [
        { afterAttempt: 1, text: 'Producer: use q.put(i) for each number, then q.put(None) to signal done' },
        { afterAttempt: 2, text: 'Consumer: use while True with q.get(), break when you get None, otherwise append item*2 to results' }
      ],
      solution: {
        afterAttempt: 3,
        text: `# Solution

\`\`\`python
import threading
import queue

def produce(q, n):
    for i in range(n):
        q.put(i)
    q.put(None)  # Poison pill

def consume(q, results):
    while True:
        item = q.get()
        if item is None:
            break
        results.append(item * 2)

def run_producer_consumer(n):
    q = queue.Queue()
    results = []

    producer = threading.Thread(target=produce, args=(q, n))
    consumer = threading.Thread(target=consume, args=(q, results))

    producer.start()
    consumer.start()

    producer.join()
    consumer.join()

    return sorted(results)
\`\`\`

## Key Points
- Queue is thread-safe: no locks needed
- None as "poison pill" signals consumer to stop
- sorted() handles any processing order differences`
      },
      testCases: [
        { input: '5', expected: '[0, 2, 4, 6, 8]' },
        { input: '3', expected: '[0, 2, 4]' }
      ],
    },

    // ==================== EXERCISE 7: Print FooBar Alternately (LeetCode 1115) ====================
    {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-print-foobar',
      title: 'Print FooBar Alternately',
      description: 'Coordinate two threads to alternate printing',
      targetComplexity: { time: 'O(n)', space: 'O(1)' },
      instruction: `# Print FooBar Alternately (LeetCode 1115)

Two threads will call \`foo()\` and \`bar()\` respectively. Design a mechanism so that output is always "foobar" repeated n times.

## Example
\`\`\`
Input: n = 2
Output: "foobarfoobar"

Input: n = 4
Output: "foobarfoobarfoobarfoobar"
\`\`\`

## Requirements
- foo() must always run before bar()
- Then bar() must signal foo() to run again
- Repeat n times

The threads may be scheduled in any order, but output must always be "foobar" repeated.`,
      starterCode: `import threading

class FooBar:
    def __init__(self, n):
        self.n = n
        # Initialize synchronization primitives

    def foo(self, printFoo):
        for i in range(self.n):
            # Wait for turn
            printFoo()  # prints "foo"
            # Signal bar

    def bar(self, printBar):
        for i in range(self.n):
            # Wait for turn
            printBar()  # prints "bar"
            # Signal foo`,
      expectedOutput: ``,
      hints: [
        { afterAttempt: 1, text: 'Use two Events: foo_turn and bar_turn. foo starts with its turn set.' },
        { afterAttempt: 2, text: 'Each method waits for its event, prints, clears its event, and sets the other event.' }
      ],
      solution: {
        afterAttempt: 3,
        text: `# Solution: Using Events

\`\`\`python
import threading

class FooBar:
    def __init__(self, n):
        self.n = n
        self.foo_event = threading.Event()
        self.bar_event = threading.Event()
        self.foo_event.set()  # foo goes first

    def foo(self, printFoo):
        for i in range(self.n):
            self.foo_event.wait()
            printFoo()
            self.foo_event.clear()
            self.bar_event.set()

    def bar(self, printBar):
        for i in range(self.n):
            self.bar_event.wait()
            printBar()
            self.bar_event.clear()
            self.foo_event.set()
\`\`\`

## Alternative: Using Lock
\`\`\`python
class FooBar:
    def __init__(self, n):
        self.n = n
        self.foo_lock = threading.Lock()
        self.bar_lock = threading.Lock()
        self.bar_lock.acquire()  # bar starts blocked

    def foo(self, printFoo):
        for i in range(self.n):
            self.foo_lock.acquire()
            printFoo()
            self.bar_lock.release()

    def bar(self, printBar):
        for i in range(self.n):
            self.bar_lock.acquire()
            printBar()
            self.foo_lock.release()
\`\`\``
      },
      testCases: [
        { input: '2', expected: '"foobarfoobar"' },
        { input: '1', expected: '"foobar"' }
      ],
    },

    // ==================== EXERCISE 8: Building H2O (LeetCode 1117) ====================
    {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-building-h2o',
      title: 'Building H2O',
      description: 'Coordinate threads to form water molecules',
      targetComplexity: { time: 'O(n)', space: 'O(1)' },
      instruction: `# Building H2O (LeetCode 1117)

Multiple threads represent hydrogen (H) and oxygen (O) atoms. Coordinate them so they form water molecules (H2O).

## Rules
- Each H thread calls \`hydrogen()\`
- Each O thread calls \`oxygen()\`
- Barrier: Exactly 2 H and 1 O must bond together before any can proceed
- Output order within a molecule doesn't matter ("HHO" or "HOH" or "OHH" all valid)

## Example
\`\`\`
Input: "HHOHHO" (4 H threads, 2 O threads)
Output: "HHOHHO" or "HOHHHO" or any valid grouping of H2O molecules
\`\`\`

## Hint
Use a Barrier with 3 threads (2H + 1O) and semaphores to control how many of each type can enter.`,
      starterCode: `import threading

class H2O:
    def __init__(self):
        # Initialize synchronization primitives
        pass

    def hydrogen(self, releaseHydrogen):
        # Wait for 2H + 1O to gather
        releaseHydrogen()  # prints "H"

    def oxygen(self, releaseOxygen):
        # Wait for 2H + 1O to gather
        releaseOxygen()  # prints "O"`,
      expectedOutput: ``,
      hints: [
        { afterAttempt: 1, text: 'Use Semaphore(2) for hydrogen (allows 2 H) and Semaphore(1) for oxygen (allows 1 O)' },
        { afterAttempt: 2, text: 'Use Barrier(3) so all three must arrive before any proceed. After barrier, release semaphores for next molecule.' }
      ],
      solution: {
        afterAttempt: 3,
        text: `# Solution

\`\`\`python
import threading

class H2O:
    def __init__(self):
        self.h_sem = threading.Semaphore(2)  # Allow 2 H
        self.o_sem = threading.Semaphore(1)  # Allow 1 O
        self.barrier = threading.Barrier(3)  # Wait for all 3

    def hydrogen(self, releaseHydrogen):
        self.h_sem.acquire()  # Limit to 2 H
        self.barrier.wait()   # Wait for 2H + 1O
        releaseHydrogen()
        self.h_sem.release()  # Allow next H

    def oxygen(self, releaseOxygen):
        self.o_sem.acquire()  # Limit to 1 O
        self.barrier.wait()   # Wait for 2H + 1O
        releaseOxygen()
        self.o_sem.release()  # Allow next O
\`\`\`

## How It Works
1. Semaphores ensure only 2 H and 1 O can "queue up"
2. Barrier blocks until all 3 atoms arrive
3. Once barrier releases, all 3 print (order doesn't matter)
4. Semaphore release allows next molecule to form`
      },
      testCases: [
        { input: '"HOH"', expected: 'Any permutation of "HHO"' },
        { input: '"OOHHHH"', expected: 'Two H2O molecules in any order' }
      ],
    },

    // ==================== EXERCISE 9: Dining Philosophers (LeetCode 1226) ====================
    {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-dining-philosophers',
      title: 'Dining Philosophers',
      description: 'Classic concurrency problem: prevent deadlock with shared resources',
      targetComplexity: { time: 'O(n)', space: 'O(1)' },
      instruction: `# Dining Philosophers (LeetCode 1226)

Five philosophers sit at a round table. Between each pair is a fork. To eat, a philosopher needs BOTH adjacent forks.

## The Problem
- If all philosophers pick up their left fork first, they deadlock!
- Design a solution that prevents deadlock

## Functions
- \`wantsToEat(philosopher, pickLeftFork, pickRightFork, eat, putLeftFork, putRightFork)\`

## Requirements
- Philosophers 0-4 sit in order around the table
- Philosopher i's left fork is fork i, right fork is fork (i+1) % 5
- No two philosophers can hold the same fork
- No deadlock or livelock

## Hint
Classic solutions:
1. Limit to 4 philosophers eating simultaneously
2. Even philosophers pick left first, odd pick right first`,
      starterCode: `import threading

class DiningPhilosophers:
    def __init__(self):
        # Initialize forks (locks) and any other primitives
        pass

    def wantsToEat(self, philosopher, pickLeftFork, pickRightFork, eat, putLeftFork, putRightFork):
        # Acquire forks safely (no deadlock!)
        # pickLeftFork()
        # pickRightFork()
        # eat()
        # putLeftFork()
        # putRightFork()
        pass`,
      expectedOutput: ``,
      hints: [
        { afterAttempt: 1, text: 'Create 5 locks (one per fork). The tricky part is avoiding deadlock when all try to pick up left fork.' },
        { afterAttempt: 2, text: 'Solution 1: Use a semaphore(4) so only 4 can try at once. Solution 2: Even philosophers pick left first, odd pick right first.' }
      ],
      solution: {
        afterAttempt: 3,
        text: `# Solution 1: Limit to 4 Philosophers

\`\`\`python
import threading

class DiningPhilosophers:
    def __init__(self):
        self.forks = [threading.Lock() for _ in range(5)]
        self.limit = threading.Semaphore(4)  # Only 4 can try at once

    def wantsToEat(self, philosopher, pickLeftFork, pickRightFork, eat, putLeftFork, putRightFork):
        left = philosopher
        right = (philosopher + 1) % 5

        self.limit.acquire()  # Limit concurrent attempts

        self.forks[left].acquire()
        pickLeftFork()

        self.forks[right].acquire()
        pickRightFork()

        eat()

        putRightFork()
        self.forks[right].release()

        putLeftFork()
        self.forks[left].release()

        self.limit.release()
\`\`\`

# Solution 2: Asymmetric Fork Ordering

\`\`\`python
class DiningPhilosophers:
    def __init__(self):
        self.forks = [threading.Lock() for _ in range(5)]

    def wantsToEat(self, philosopher, pickLeftFork, pickRightFork, eat, putLeftFork, putRightFork):
        left = philosopher
        right = (philosopher + 1) % 5

        # Even: left first. Odd: right first.
        # This breaks the circular wait!
        if philosopher % 2 == 0:
            first, second = left, right
            pickFirst, pickSecond = pickLeftFork, pickRightFork
            putFirst, putSecond = putLeftFork, putRightFork
        else:
            first, second = right, left
            pickFirst, pickSecond = pickRightFork, pickLeftFork
            putFirst, putSecond = putRightFork, putLeftFork

        with self.forks[first]:
            pickFirst()
            with self.forks[second]:
                pickSecond()
                eat()
                putSecond()
            putFirst()
\`\`\``
      },
      testCases: [
        { input: '[[0,1,2,3,4],[4,3,2,1,0]]', expected: 'No deadlock' }
      ],
    },

    // ==================== EXERCISE 10: Fix the Race Condition ====================
    {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-fix-race-condition',
      title: 'Fix the Race Condition',
      description: 'Debug and fix a thread-safety bug',
      targetComplexity: { time: 'O(n)', space: 'O(1)' },
      instruction: `# Fix the Race Condition

The following BankAccount class has a bug. When multiple threads transfer money, the total balance can become incorrect.

## Problem
\`\`\`python
class BankAccount:
    def __init__(self, balance):
        self.balance = balance

    def transfer(self, amount):
        if self.balance >= amount:
            self.balance -= amount
            return True
        return False
\`\`\`

## The Bug
Two threads checking balance simultaneously might both see sufficient funds, then both withdraw, causing overdraft.

## Your Task
Fix the class to be thread-safe. The total balance across all accounts should always be conserved.`,
      starterCode: `import threading

class BankAccount:
    def __init__(self, balance):
        self.balance = balance
        # Add synchronization here

    def transfer(self, amount):
        # Fix the race condition
        if self.balance >= amount:
            self.balance -= amount
            return True
        return False

    def get_balance(self):
        return self.balance`,
      expectedOutput: ``,
      hints: [
        { afterAttempt: 1, text: 'The check-then-act pattern (if balance >= amount, then subtract) is not atomic. Use a lock.' },
        { afterAttempt: 2, text: 'Add a Lock in __init__ and wrap the entire check-and-subtract operation in "with self.lock:"' }
      ],
      solution: {
        afterAttempt: 3,
        text: `# Solution

\`\`\`python
import threading

class BankAccount:
    def __init__(self, balance):
        self.balance = balance
        self._lock = threading.Lock()

    def transfer(self, amount):
        with self._lock:
            if self.balance >= amount:
                self.balance -= amount
                return True
            return False

    def get_balance(self):
        with self._lock:
            return self.balance
\`\`\`

## Why This Fixes It
- The lock ensures check-and-subtract is atomic
- Only one thread can be inside the critical section at a time
- get_balance also needs the lock to prevent reading during modification`
      },
      testCases: [
        { input: 'account = BankAccount(100); account.transfer(50); account.get_balance()', expected: '50' }
      ],
    },

    // ==================== READING 7: Deferred Execution ====================
    {
      type: 'reading',
      id: 'deferred-execution',
      title: 'Reading 7: Deferred Execution & Task Scheduling',
      estimatedReadTime: 480,
      content: `<h1>Deferred Execution (Promises & Schedulers)</h1>

<p>A common interview question: <strong>"How do you schedule a task to run in 5 seconds?"</strong></p>

<p>The naive answer <code>time.sleep(5)</code> blocks the thread. The correct answer uses a <strong>scheduler</strong> that manages delayed tasks efficiently.</p>

<h2>The Problem with sleep()</h2>
<pre><code class="language-python"># BAD: Blocks the entire thread
import time
time.sleep(5)
print("Task executed")  # Thread did nothing useful for 5 seconds
</code></pre>

<p>In a server handling 1000 requests, you can't sleep on each one - you'd run out of threads!</p>

<h2>Solution 1: threading.Timer</h2>
<p>Python's <code>threading.Timer</code> creates a new thread that waits, then executes:</p>
<pre><code class="language-python">import threading

def delayed_task():
    print("Executed after 5 seconds!")

timer = threading.Timer(5.0, delayed_task)
timer.start()  # Returns immediately, task runs later

# Can cancel before execution
timer.cancel()
</code></pre>

<p><strong>Pros:</strong> Simple API. <strong>Cons:</strong> Creates a thread per task - doesn't scale.</p>

<h2>Solution 2: Priority Queue Scheduler</h2>
<p>For many delayed tasks, use a <strong>min-heap</strong> keyed by execution time:</p>
<pre><code class="language-python">import heapq
import time
import threading

class TaskScheduler:
    def __init__(self):
        self.tasks = []  # Min-heap: (execution_time, task_id, func)
        self.task_id = 0
        self.lock = threading.Lock()
        self.condition = threading.Condition(self.lock)
        self.running = True
        self.worker = threading.Thread(target=self._run, daemon=True)
        self.worker.start()

    def schedule(self, delay_seconds, func):
        """Schedule func to run after delay_seconds."""
        with self.condition:
            exec_time = time.time() + delay_seconds
            heapq.heappush(self.tasks, (exec_time, self.task_id, func))
            self.task_id += 1
            self.condition.notify()  # Wake up worker

    def _run(self):
        """Worker thread: execute tasks when their time comes."""
        while self.running:
            with self.condition:
                while not self.tasks:
                    self.condition.wait()  # Wait for tasks

                exec_time, _, func = self.tasks[0]
                wait_time = exec_time - time.time()

                if wait_time > 0:
                    self.condition.wait(wait_time)  # Sleep until next task
                else:
                    heapq.heappop(self.tasks)
                    func()  # Execute the task
</code></pre>

<h2>Key Insight: The Polling Pattern</h2>
<p>The scheduler continuously checks: <code>execution_time <= now</code></p>
<ul>
<li>If yes → execute the task</li>
<li>If no → sleep until the next scheduled time</li>
</ul>

<p>This is how real systems work: JavaScript's event loop, Java's ScheduledExecutorService, cron jobs, etc.</p>

<h2>Solution 3: concurrent.futures with Timeout</h2>
<pre><code class="language-python">from concurrent.futures import ThreadPoolExecutor, wait, FIRST_COMPLETED
import time

def delayed_execution(delay, func, *args):
    """Execute func after delay using a thread pool."""
    def wrapper():
        time.sleep(delay)
        return func(*args)

    with ThreadPoolExecutor(max_workers=1) as executor:
        future = executor.submit(wrapper)
        return future.result()
</code></pre>

<h2>Interview Patterns</h2>
<ul>
<li><strong>Rate Limiter</strong>: Schedule token refills</li>
<li><strong>Retry with Backoff</strong>: Schedule retries at 1s, 2s, 4s, 8s...</li>
<li><strong>Cache Expiry</strong>: Schedule cache invalidation</li>
<li><strong>Timeout Handler</strong>: Cancel operation if not done in X seconds</li>
</ul>

<p><strong>Remember:</strong> Never use sleep() to schedule work. Use timers, schedulers, or event loops.</p>
`,
    },

    // ==================== EXERCISE 12: Task Scheduler ====================
    {
      type: 'exercise',
      placement: 'module',
      id: 'exercise-task-scheduler',
      title: 'Task Scheduler',
      description: 'Implement a deferred execution scheduler using priority queue',
      targetComplexity: { time: 'O(log n)', space: 'O(n)' },
      instruction: `# Task Scheduler

Implement a scheduler that executes tasks at specified times.

## Requirements
Create \`Scheduler\` class:
- \`schedule(delay, func)\`: Schedule func to run after delay seconds
- \`run_pending()\`: Execute all tasks whose time has come, return count executed
- \`pending_count()\`: Return number of pending tasks

Use a min-heap ordered by execution time.

## Example
\`\`\`python
scheduler = Scheduler()
scheduler.schedule(0.1, lambda: print("Task 1"))
scheduler.schedule(0.2, lambda: print("Task 2"))
print(scheduler.pending_count())  # 2
time.sleep(0.15)
print(scheduler.run_pending())  # 1 (Task 1 executed)
\`\`\``,
      starterCode: `import heapq
import time
import threading

class Scheduler:
    def __init__(self):
        pass

    def schedule(self, delay: float, func) -> None:
        pass

    def run_pending(self) -> int:
        pass

    def pending_count(self) -> int:
        pass`,
      expectedOutput: ``,
      hints: [
        { afterAttempt: 1, text: 'Use a heap of (execution_time, task_id, func) tuples. task_id breaks ties.' },
        { afterAttempt: 2, text: 'run_pending: while heap is not empty and heap[0][0] <= time.time(), pop and execute' }
      ],
      solution: {
        afterAttempt: 3,
        text: `# Solution

\`\`\`python
import heapq
import time
import threading

class Scheduler:
    def __init__(self):
        self.tasks = []
        self.task_id = 0
        self.lock = threading.Lock()

    def schedule(self, delay: float, func) -> None:
        with self.lock:
            exec_time = time.time() + delay
            heapq.heappush(self.tasks, (exec_time, self.task_id, func))
            self.task_id += 1

    def run_pending(self) -> int:
        executed = 0
        with self.lock:
            now = time.time()
            while self.tasks and self.tasks[0][0] <= now:
                _, _, func = heapq.heappop(self.tasks)
                func()
                executed += 1
        return executed

    def pending_count(self) -> int:
        with self.lock:
            return len(self.tasks)
\`\`\`

## Key Points
- Min-heap ensures O(log n) insert and O(log n) pop
- task_id prevents comparison errors when execution times are equal
- Lock makes it thread-safe for concurrent scheduling`
      },
      testCases: [
        { input: 's = Scheduler(); s.schedule(0, lambda: None); s.pending_count()', expected: '1' },
        { input: 's = Scheduler(); s.schedule(0, lambda: None); s.run_pending()', expected: '1' }
      ],
    },

    // Add all smart practice exercises at the end
    ...moduleConcurrencyLessonSmartPracticeExercises
  ],
};
