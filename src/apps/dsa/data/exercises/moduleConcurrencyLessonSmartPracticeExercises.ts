import type { ExerciseSection } from '../../types/progressive-lesson-enhanced';

export const moduleConcurrencyLessonSmartPracticeExercises: ExerciseSection[] = [
  // ==================== GROUP 1: Basic Threading (15 exercises) ====================
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-thread-hello-world',
    title: 'Thread Hello World',
    description: 'Create a simple thread that prints a message',
    targetComplexity: { time: 'O(1)', space: 'O(1)' },
    instruction: `# Thread Hello World

Create a thread that prints "Hello from thread!" and wait for it to complete.

## Example
\`\`\`
Output: "Hello from thread!"
Return: True (indicating thread completed)
\`\`\``,
    starterCode: `import threading

def hello_thread():
    # Create a thread that prints "Hello from thread!"
    # Start it and wait for completion
    # Return True when done
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Create a Thread with target=print and args=("Hello from thread!",)' },
      { afterAttempt: 2, text: 'Call start() then join() on the thread, then return True' }
    ],
    solution: {
      afterAttempt: 3,
      text: `\`\`\`python
import threading

def hello_thread():
    t = threading.Thread(target=print, args=("Hello from thread!",))
    t.start()
    t.join()
    return True
\`\`\``
    },
    testCases: [
      { input: '', expected: 'True' }
    ],
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-thread-with-args',
    title: 'Thread with Arguments',
    description: 'Pass multiple arguments to a thread function',
    targetComplexity: { time: 'O(1)', space: 'O(1)' },
    instruction: `# Thread with Arguments

Create a thread that calls a function with multiple arguments and keyword arguments.

## Requirements
Write \`run_with_args(func, args, kwargs)\` that:
1. Creates a thread calling func with given args and kwargs
2. Starts and waits for the thread
3. Returns "completed"

## Example
\`\`\`python
def greet(name, greeting="Hello"):
    print(f"{greeting}, {name}!")

run_with_args(greet, ("Alice",), {"greeting": "Hi"})
# Prints: "Hi, Alice!"
# Returns: "completed"
\`\`\``,
    starterCode: `import threading

def run_with_args(func, args, kwargs):
    # Create thread with args and kwargs
    # Start and wait for completion
    # Return "completed"
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Thread constructor accepts target, args, and kwargs parameters' },
      { afterAttempt: 2, text: 'threading.Thread(target=func, args=args, kwargs=kwargs)' }
    ],
    solution: {
      afterAttempt: 3,
      text: `\`\`\`python
import threading

def run_with_args(func, args, kwargs):
    t = threading.Thread(target=func, args=args, kwargs=kwargs)
    t.start()
    t.join()
    return "completed"
\`\`\``
    },
    testCases: [
      { input: 'lambda x, y: x+y, (1, 2), {}', expected: '"completed"' }
    ],
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-thread-return-value',
    title: 'Getting Thread Return Values',
    description: 'Capture return value from a thread function',
    targetComplexity: { time: 'O(1)', space: 'O(1)' },
    instruction: `# Getting Thread Return Values

Threads don't directly return values. Implement a way to capture the return value.

## Requirements
Write \`run_and_get_result(func, *args)\` that:
1. Runs func(*args) in a thread
2. Captures and returns the result

## Example
\`\`\`python
result = run_and_get_result(lambda x, y: x * y, 6, 7)
# result = 42
\`\`\`

## Hint
Use a mutable container (list or dict) to store the result.`,
    starterCode: `import threading

def run_and_get_result(func, *args):
    # Run func in a thread and return its result
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Create a list result = [None], have the thread set result[0] = func(*args)' },
      { afterAttempt: 2, text: 'Define a wrapper function that stores the result, then use that as the thread target' }
    ],
    solution: {
      afterAttempt: 3,
      text: `\`\`\`python
import threading

def run_and_get_result(func, *args):
    result = [None]

    def wrapper():
        result[0] = func(*args)

    t = threading.Thread(target=wrapper)
    t.start()
    t.join()
    return result[0]
\`\`\``
    },
    testCases: [
      { input: 'lambda x, y: x * y, 6, 7', expected: '42' },
      { input: 'lambda: "hello"', expected: '"hello"' }
    ],
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-multiple-threads-parallel',
    title: 'Run Multiple Threads in Parallel',
    description: 'Start multiple threads and wait for all to complete',
    targetComplexity: { time: 'O(n)', space: 'O(n)' },
    instruction: `# Run Multiple Threads in Parallel

Write a function that runs multiple tasks concurrently.

## Requirements
\`run_parallel(tasks)\` where tasks is a list of (func, args) tuples:
1. Create a thread for each task
2. Start all threads
3. Wait for all to complete
4. Return the number of tasks completed

## Example
\`\`\`python
tasks = [
    (print, ("Task 1",)),
    (print, ("Task 2",)),
    (print, ("Task 3",))
]
result = run_parallel(tasks)
# Prints all three (order may vary)
# Returns: 3
\`\`\``,
    starterCode: `import threading

def run_parallel(tasks):
    # tasks is list of (func, args) tuples
    # Run all in parallel, return count
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Create all threads first, start all, then join all' },
      { afterAttempt: 2, text: 'Use two loops: one for start(), one for join()' }
    ],
    solution: {
      afterAttempt: 3,
      text: `\`\`\`python
import threading

def run_parallel(tasks):
    threads = []
    for func, args in tasks:
        t = threading.Thread(target=func, args=args)
        threads.append(t)

    for t in threads:
        t.start()

    for t in threads:
        t.join()

    return len(tasks)
\`\`\``
    },
    testCases: [
      { input: '[(lambda: None, ()), (lambda: None, ())]', expected: '2' }
    ],
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-daemon-thread',
    title: 'Daemon Thread Behavior',
    description: 'Understand daemon vs non-daemon threads',
    targetComplexity: { time: 'O(1)', space: 'O(1)' },
    instruction: `# Daemon Thread Behavior

Create a function that demonstrates daemon thread behavior.

## Requirements
\`create_daemon_thread(func)\`:
1. Create a daemon thread that runs func
2. Start it (don't wait)
3. Return the thread object

The caller can check thread.daemon to verify.

## Key Point
Daemon threads are killed when the main program exits, without waiting for them.`,
    starterCode: `import threading

def create_daemon_thread(func):
    # Create and start a daemon thread
    # Return the thread object
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Set daemon=True in Thread constructor or set thread.daemon = True before start()' }
    ],
    solution: {
      afterAttempt: 3,
      text: `\`\`\`python
import threading

def create_daemon_thread(func):
    t = threading.Thread(target=func, daemon=True)
    t.start()
    return t
\`\`\``
    },
    testCases: [
      { input: 'lambda: None', expected: 'thread.daemon == True' }
    ],
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-thread-name',
    title: 'Named Threads',
    description: 'Create threads with custom names for debugging',
    targetComplexity: { time: 'O(1)', space: 'O(1)' },
    instruction: `# Named Threads

Create threads with meaningful names for easier debugging.

## Requirements
\`create_named_thread(name, func)\`:
1. Create a thread with the given name
2. Start it and wait
3. Return the thread's name

## Example
\`\`\`python
result = create_named_thread("DataLoader", load_data)
# result = "DataLoader"
\`\`\``,
    starterCode: `import threading

def create_named_thread(name, func):
    # Create a named thread
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Thread constructor accepts a name parameter' }
    ],
    solution: {
      afterAttempt: 3,
      text: `\`\`\`python
import threading

def create_named_thread(name, func):
    t = threading.Thread(target=func, name=name)
    t.start()
    t.join()
    return t.name
\`\`\``
    },
    testCases: [
      { input: '"Worker", lambda: None', expected: '"Worker"' }
    ],
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-current-thread',
    title: 'Get Current Thread Info',
    description: 'Access information about the currently running thread',
    targetComplexity: { time: 'O(1)', space: 'O(1)' },
    instruction: `# Get Current Thread Info

Write a function that returns information about the current thread.

## Requirements
\`get_thread_info()\` should return a dict with:
- "name": thread name
- "ident": thread identifier (integer)
- "is_alive": whether thread is running

Call this from within a thread to get its info.`,
    starterCode: `import threading

def get_thread_info():
    # Return dict with current thread info
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Use threading.current_thread() to get the current thread object' }
    ],
    solution: {
      afterAttempt: 3,
      text: `\`\`\`python
import threading

def get_thread_info():
    t = threading.current_thread()
    return {
        "name": t.name,
        "ident": t.ident,
        "is_alive": t.is_alive()
    }
\`\`\``
    },
    testCases: [
      { input: '', expected: 'dict with name, ident, is_alive keys' }
    ],
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-thread-count',
    title: 'Count Active Threads',
    description: 'Count how many threads are currently running',
    targetComplexity: { time: 'O(1)', space: 'O(1)' },
    instruction: `# Count Active Threads

Write a function that spawns n threads, and while they're running, returns the active thread count.

## Requirements
\`count_threads_during_execution(n, sleep_time)\`:
1. Create n threads that each sleep for sleep_time seconds
2. Start all threads
3. Return threading.active_count() (includes main thread)
4. Don't wait for threads (they run as daemons)`,
    starterCode: `import threading
import time

def count_threads_during_execution(n, sleep_time):
    # Create n sleeping threads, return active count
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Create daemon threads so they don\'t block. Use time.sleep in the thread function.' },
      { afterAttempt: 2, text: 'threading.active_count() returns total active threads including main' }
    ],
    solution: {
      afterAttempt: 3,
      text: `\`\`\`python
import threading
import time

def count_threads_during_execution(n, sleep_time):
    def sleeper():
        time.sleep(sleep_time)

    threads = []
    for _ in range(n):
        t = threading.Thread(target=sleeper, daemon=True)
        t.start()
        threads.append(t)

    return threading.active_count()
\`\`\``
    },
    testCases: [
      { input: '5, 1', expected: '>= 6' }
    ],
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-thread-subclass',
    title: 'Thread Subclass Pattern',
    description: 'Create a custom Thread subclass',
    targetComplexity: { time: 'O(1)', space: 'O(1)' },
    instruction: `# Thread Subclass Pattern

Create a Thread subclass that stores its result.

## Requirements
Create \`ResultThread\` class that:
1. Extends threading.Thread
2. Accepts a function and args in constructor
3. Runs the function in run() and stores result in self.result
4. Result is accessible after join()

## Example
\`\`\`python
t = ResultThread(lambda x: x * 2, args=(21,))
t.start()
t.join()
print(t.result)  # 42
\`\`\``,
    starterCode: `import threading

class ResultThread(threading.Thread):
    def __init__(self, func, args=()):
        # Initialize thread and store func/args
        pass

    def run(self):
        # Execute func and store result
        pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Call super().__init__() in __init__. Store func and args as instance variables.' },
      { afterAttempt: 2, text: 'In run(), set self.result = self.func(*self.args)' }
    ],
    solution: {
      afterAttempt: 3,
      text: `\`\`\`python
import threading

class ResultThread(threading.Thread):
    def __init__(self, func, args=()):
        super().__init__()
        self.func = func
        self.args = args
        self.result = None

    def run(self):
        self.result = self.func(*self.args)
\`\`\``
    },
    testCases: [
      { input: 't = ResultThread(lambda x: x*2, (21,)); t.start(); t.join(); t.result', expected: '42' }
    ],
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-join-timeout',
    title: 'Join with Timeout',
    description: 'Wait for a thread with a timeout',
    targetComplexity: { time: 'O(1)', space: 'O(1)' },
    instruction: `# Join with Timeout

Write a function that waits for a thread but gives up after a timeout.

## Requirements
\`wait_with_timeout(thread, timeout)\`:
1. Wait for thread to complete, but max timeout seconds
2. Return True if thread completed, False if timeout

## Example
\`\`\`python
t = threading.Thread(target=time.sleep, args=(10,))
t.start()
result = wait_with_timeout(t, 1)
# result = False (thread still running after 1 second)
\`\`\``,
    starterCode: `import threading

def wait_with_timeout(thread, timeout):
    # Wait for thread with timeout
    # Return True if completed, False if timeout
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'thread.join(timeout=timeout) will wait at most timeout seconds' },
      { afterAttempt: 2, text: 'After join returns, check thread.is_alive() to see if it completed' }
    ],
    solution: {
      afterAttempt: 3,
      text: `\`\`\`python
import threading

def wait_with_timeout(thread, timeout):
    thread.join(timeout=timeout)
    return not thread.is_alive()
\`\`\``
    },
    testCases: [
      { input: 'quick_thread, 5', expected: 'True' }
    ],
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-thread-exception',
    title: 'Handle Thread Exceptions',
    description: 'Capture exceptions from threads',
    targetComplexity: { time: 'O(1)', space: 'O(1)' },
    instruction: `# Handle Thread Exceptions

Exceptions in threads don't propagate to the main thread. Capture them explicitly.

## Requirements
\`run_and_catch(func)\`:
1. Run func in a thread
2. If it raises an exception, capture it
3. Return (result, exception) tuple
4. One will be None, one will have a value

## Example
\`\`\`python
result, exc = run_and_catch(lambda: 1/0)
# result = None, exc = ZeroDivisionError(...)
\`\`\``,
    starterCode: `import threading

def run_and_catch(func):
    # Run func in thread, return (result, exception)
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Use try/except in a wrapper function that stores both result and exception' },
      { afterAttempt: 2, text: 'Store results in a mutable container like [None, None] for [result, exception]' }
    ],
    solution: {
      afterAttempt: 3,
      text: `\`\`\`python
import threading

def run_and_catch(func):
    container = [None, None]  # [result, exception]

    def wrapper():
        try:
            container[0] = func()
        except Exception as e:
            container[1] = e

    t = threading.Thread(target=wrapper)
    t.start()
    t.join()
    return tuple(container)
\`\`\``
    },
    testCases: [
      { input: 'lambda: 42', expected: '(42, None)' },
      { input: 'lambda: 1/0', expected: '(None, ZeroDivisionError)' }
    ],
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-thread-local',
    title: 'Thread-Local Storage',
    description: 'Use thread-local data for thread-specific values',
    targetComplexity: { time: 'O(1)', space: 'O(n)' },
    instruction: `# Thread-Local Storage

Each thread can have its own copy of data using threading.local().

## Requirements
Create a function that demonstrates thread-local storage:
1. Create a thread-local object
2. Run 3 threads that each set local.value to their thread number
3. Return a dict mapping thread names to their local values

## Expected
Each thread sees only its own value, not others'.`,
    starterCode: `import threading

def demonstrate_thread_local():
    # Show that each thread has its own copy
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Create local = threading.local(). Each thread can set local.value independently.' },
      { afterAttempt: 2, text: 'Store results in a shared dict (with a lock), keyed by thread name' }
    ],
    solution: {
      afterAttempt: 3,
      text: `\`\`\`python
import threading

def demonstrate_thread_local():
    local = threading.local()
    results = {}
    lock = threading.Lock()

    def worker(n):
        local.value = n  # Each thread has its own copy
        with lock:
            results[threading.current_thread().name] = local.value

    threads = []
    for i in range(3):
        t = threading.Thread(target=worker, args=(i,), name=f"Thread-{i}")
        threads.append(t)
        t.start()

    for t in threads:
        t.join()

    return results
\`\`\``
    },
    testCases: [
      { input: '', expected: '{"Thread-0": 0, "Thread-1": 1, "Thread-2": 2}' }
    ],
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-enumerate-threads',
    title: 'Enumerate All Threads',
    description: 'List all currently running threads',
    targetComplexity: { time: 'O(n)', space: 'O(n)' },
    instruction: `# Enumerate All Threads

Get information about all currently running threads.

## Requirements
\`list_all_threads()\`:
1. Return list of dicts for all active threads
2. Each dict has: name, daemon, is_alive

## Example
\`\`\`python
threads = list_all_threads()
# [{"name": "MainThread", "daemon": False, "is_alive": True}, ...]
\`\`\``,
    starterCode: `import threading

def list_all_threads():
    # Return info about all threads
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Use threading.enumerate() to get all active Thread objects' }
    ],
    solution: {
      afterAttempt: 3,
      text: `\`\`\`python
import threading

def list_all_threads():
    return [
        {
            "name": t.name,
            "daemon": t.daemon,
            "is_alive": t.is_alive()
        }
        for t in threading.enumerate()
    ]
\`\`\``
    },
    testCases: [
      { input: '', expected: 'list with at least MainThread' }
    ],
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-thread-timer',
    title: 'Timer Thread',
    description: 'Schedule a function to run after a delay',
    targetComplexity: { time: 'O(1)', space: 'O(1)' },
    instruction: `# Timer Thread

Use threading.Timer to schedule delayed execution.

## Requirements
\`schedule_after(delay, func, *args)\`:
1. Schedule func to run after delay seconds
2. Return the Timer object (caller can cancel it)

## Example
\`\`\`python
timer = schedule_after(5, print, "Hello!")
# Prints "Hello!" after 5 seconds
timer.cancel()  # Cancel if not yet executed
\`\`\``,
    starterCode: `import threading

def schedule_after(delay, func, *args):
    # Schedule func to run after delay
    # Return the timer object
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'threading.Timer(delay, func, args=args) creates a timer thread' },
      { afterAttempt: 2, text: 'Call timer.start() to begin countdown, return the timer' }
    ],
    solution: {
      afterAttempt: 3,
      text: `\`\`\`python
import threading

def schedule_after(delay, func, *args):
    timer = threading.Timer(delay, func, args=args)
    timer.start()
    return timer
\`\`\``
    },
    testCases: [
      { input: '0.1, lambda: "done"', expected: 'Timer object' }
    ],
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-thread-id-mapping',
    title: 'Map Thread Results by ID',
    description: 'Track which thread produced which result',
    targetComplexity: { time: 'O(n)', space: 'O(n)' },
    instruction: `# Map Thread Results by ID

Run multiple threads and track which thread produced which result.

## Requirements
\`map_results_by_thread(funcs)\`:
1. Run each function in a separate thread
2. Return dict mapping thread ident to result

## Example
\`\`\`python
funcs = [lambda: "a", lambda: "b"]
results = map_results_by_thread(funcs)
# {12345: "a", 12346: "b"} (with actual thread idents)
\`\`\``,
    starterCode: `import threading

def map_results_by_thread(funcs):
    # Run each func in a thread, map ident -> result
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Store results in a shared dict with lock. Key is threading.current_thread().ident' },
      { afterAttempt: 2, text: 'Create a wrapper that runs the func and stores result keyed by thread ident' }
    ],
    solution: {
      afterAttempt: 3,
      text: `\`\`\`python
import threading

def map_results_by_thread(funcs):
    results = {}
    lock = threading.Lock()

    def wrapper(func):
        result = func()
        with lock:
            results[threading.current_thread().ident] = result

    threads = [threading.Thread(target=wrapper, args=(f,)) for f in funcs]
    for t in threads:
        t.start()
    for t in threads:
        t.join()

    return results
\`\`\``
    },
    testCases: [
      { input: '[lambda: 1, lambda: 2]', expected: 'dict with 2 entries' }
    ],
  },

  // ==================== GROUP 2: Locks & Mutex (15 exercises) ====================
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-basic-lock',
    title: 'Basic Lock Usage',
    description: 'Protect a shared variable with a lock',
    targetComplexity: { time: 'O(n)', space: 'O(1)' },
    instruction: `# Basic Lock Usage

Increment a shared counter safely from multiple threads.

## Requirements
\`safe_increment(n_threads, increments_per_thread)\`:
1. Create a shared counter starting at 0
2. Run n_threads threads, each incrementing counter increments_per_thread times
3. Use a lock to prevent race conditions
4. Return final counter value

## Expected
Result should always equal n_threads * increments_per_thread`,
    starterCode: `import threading

def safe_increment(n_threads, increments_per_thread):
    # Return final counter value after all increments
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Create a Lock. Each thread acquires lock before incrementing.' },
      { afterAttempt: 2, text: 'Use "with lock:" to ensure lock is always released' }
    ],
    solution: {
      afterAttempt: 3,
      text: `\`\`\`python
import threading

def safe_increment(n_threads, increments_per_thread):
    counter = [0]  # Use list to allow modification in nested function
    lock = threading.Lock()

    def incrementer():
        for _ in range(increments_per_thread):
            with lock:
                counter[0] += 1

    threads = [threading.Thread(target=incrementer) for _ in range(n_threads)]
    for t in threads:
        t.start()
    for t in threads:
        t.join()

    return counter[0]
\`\`\``
    },
    testCases: [
      { input: '10, 1000', expected: '10000' },
      { input: '5, 100', expected: '500' }
    ],
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-lock-context-manager',
    title: 'Lock Context Manager',
    description: 'Use with statement for automatic lock release',
    targetComplexity: { time: 'O(1)', space: 'O(1)' },
    instruction: `# Lock Context Manager

Demonstrate why context managers are preferred for locks.

## Requirements
\`critical_section(lock, func)\`:
1. Acquire the lock
2. Run func()
3. Always release the lock, even if func raises an exception
4. Re-raise any exception from func

The context manager pattern handles this automatically.`,
    starterCode: `import threading

def critical_section(lock, func):
    # Run func with lock held, always release
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Use "with lock:" - it handles acquire/release automatically' },
      { afterAttempt: 2, text: 'Just "with lock: return func()" handles everything' }
    ],
    solution: {
      afterAttempt: 3,
      text: `\`\`\`python
import threading

def critical_section(lock, func):
    with lock:
        return func()
\`\`\`

Or manually (why context manager is better):
\`\`\`python
def critical_section(lock, func):
    lock.acquire()
    try:
        return func()
    finally:
        lock.release()
\`\`\``
    },
    testCases: [
      { input: 'lock, lambda: 42', expected: '42' }
    ],
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-rlock',
    title: 'Reentrant Lock',
    description: 'Use RLock for recursive locking',
    targetComplexity: { time: 'O(n)', space: 'O(n)' },
    instruction: `# Reentrant Lock

Regular Lock deadlocks if same thread tries to acquire twice. RLock allows re-entry.

## Requirements
Create \`RecursiveCounter\` class:
1. Uses RLock for thread safety
2. \`increment(n)\`: if n > 0, increment counter and call increment(n-1)
3. \`get_value()\`: return current count

The recursive call must re-acquire the lock.`,
    starterCode: `import threading

class RecursiveCounter:
    def __init__(self):
        # Use RLock, not Lock!
        pass

    def increment(self, n):
        # Recursively increment n times
        pass

    def get_value(self):
        pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'threading.RLock() can be acquired multiple times by the same thread' },
      { afterAttempt: 2, text: 'With RLock, the recursive call can acquire the lock again without deadlock' }
    ],
    solution: {
      afterAttempt: 3,
      text: `\`\`\`python
import threading

class RecursiveCounter:
    def __init__(self):
        self._value = 0
        self._lock = threading.RLock()  # Reentrant!

    def increment(self, n):
        if n <= 0:
            return
        with self._lock:
            self._value += 1
            self.increment(n - 1)  # Can re-acquire lock

    def get_value(self):
        with self._lock:
            return self._value
\`\`\``
    },
    testCases: [
      { input: 'c = RecursiveCounter(); c.increment(5); c.get_value()', expected: '5' }
    ],
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-lock-timeout',
    title: 'Lock with Timeout',
    description: 'Try to acquire a lock with a timeout',
    targetComplexity: { time: 'O(1)', space: 'O(1)' },
    instruction: `# Lock with Timeout

Try to acquire a lock, but give up after a timeout.

## Requirements
\`try_acquire(lock, timeout)\`:
1. Try to acquire lock within timeout seconds
2. If acquired, do some work (return "acquired")
3. If timeout, return "timeout"
4. Always release if acquired`,
    starterCode: `import threading

def try_acquire(lock, timeout):
    # Try to acquire lock with timeout
    # Return "acquired" or "timeout"
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'lock.acquire(timeout=timeout) returns True if acquired, False if timeout' },
      { afterAttempt: 2, text: 'If acquired returns True, remember to release() in a finally block' }
    ],
    solution: {
      afterAttempt: 3,
      text: `\`\`\`python
import threading

def try_acquire(lock, timeout):
    acquired = lock.acquire(timeout=timeout)
    if acquired:
        try:
            return "acquired"
        finally:
            lock.release()
    else:
        return "timeout"
\`\`\``
    },
    testCases: [
      { input: 'free_lock, 1', expected: '"acquired"' }
    ],
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-lock-check-held',
    title: 'Check if Lock is Held',
    description: 'Check lock status without blocking',
    targetComplexity: { time: 'O(1)', space: 'O(1)' },
    instruction: `# Check if Lock is Held

Check whether a lock is currently held, without blocking.

## Requirements
\`is_lock_held(lock)\`:
1. Check if lock is currently acquired
2. Return True/False
3. Do NOT block waiting for the lock

## Hint
Try to acquire with timeout=0.`,
    starterCode: `import threading

def is_lock_held(lock):
    # Check if lock is held, without blocking
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'acquire(blocking=False) returns immediately with True/False' },
      { afterAttempt: 2, text: 'If acquire returns True, the lock was free (release it!). If False, it was held.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `\`\`\`python
import threading

def is_lock_held(lock):
    acquired = lock.acquire(blocking=False)
    if acquired:
        lock.release()  # We acquired it, so it wasn't held
        return False
    return True  # We couldn't acquire, so it was held
\`\`\``
    },
    testCases: [
      { input: 'free_lock', expected: 'False' },
      { input: 'held_lock', expected: 'True' }
    ],
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-multiple-locks-order',
    title: 'Acquire Multiple Locks Safely',
    description: 'Acquire multiple locks without deadlock',
    targetComplexity: { time: 'O(1)', space: 'O(1)' },
    instruction: `# Acquire Multiple Locks Safely

When acquiring multiple locks, always use consistent ordering to prevent deadlock.

## Requirements
\`transfer(lock_a, lock_b, action)\`:
1. Acquire both locks in a consistent order (by id)
2. Run action()
3. Release both locks

## Key Insight
Always acquire locks in the same order (e.g., by object id) to prevent deadlock.`,
    starterCode: `import threading

def transfer(lock_a, lock_b, action):
    # Acquire both locks safely, run action, release
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Sort locks by id(lock) to get consistent ordering' },
      { afterAttempt: 2, text: 'first, second = sorted([lock_a, lock_b], key=id)' }
    ],
    solution: {
      afterAttempt: 3,
      text: `\`\`\`python
import threading

def transfer(lock_a, lock_b, action):
    # Always acquire in consistent order by id
    first, second = sorted([lock_a, lock_b], key=id)

    with first:
        with second:
            return action()
\`\`\``
    },
    testCases: [
      { input: 'lock_a, lock_b, lambda: "done"', expected: '"done"' }
    ],
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-read-write-lock',
    title: 'Reader-Writer Lock',
    description: 'Allow multiple readers or one writer',
    targetComplexity: { time: 'O(1)', space: 'O(1)' },
    instruction: `# Reader-Writer Lock

Implement a lock that allows multiple concurrent readers OR one exclusive writer.

## Requirements
Create \`RWLock\` class with:
- \`acquire_read()\`: Acquire for reading (multiple OK)
- \`release_read()\`: Release read lock
- \`acquire_write()\`: Acquire for writing (exclusive)
- \`release_write()\`: Release write lock

## Rules
- Multiple readers can hold the lock simultaneously
- Writers need exclusive access (no readers or other writers)`,
    starterCode: `import threading

class RWLock:
    def __init__(self):
        pass

    def acquire_read(self):
        pass

    def release_read(self):
        pass

    def acquire_write(self):
        pass

    def release_write(self):
        pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Track reader count. Use a lock to protect the count and a separate lock for writing.' },
      { afterAttempt: 2, text: 'First reader acquires write lock, last reader releases it.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `\`\`\`python
import threading

class RWLock:
    def __init__(self):
        self._read_lock = threading.Lock()
        self._write_lock = threading.Lock()
        self._readers = 0

    def acquire_read(self):
        with self._read_lock:
            self._readers += 1
            if self._readers == 1:
                self._write_lock.acquire()  # First reader blocks writers

    def release_read(self):
        with self._read_lock:
            self._readers -= 1
            if self._readers == 0:
                self._write_lock.release()  # Last reader unblocks writers

    def acquire_write(self):
        self._write_lock.acquire()

    def release_write(self):
        self._write_lock.release()
\`\`\``
    },
    testCases: [
      { input: 'rwlock.acquire_read(); rwlock.release_read()', expected: 'no deadlock' }
    ],
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-lock-decorator',
    title: 'Lock Decorator',
    description: 'Create a decorator that makes a function thread-safe',
    targetComplexity: { time: 'O(1)', space: 'O(1)' },
    instruction: `# Lock Decorator

Create a decorator that wraps a function with a lock.

## Requirements
\`synchronized(lock)\` decorator:
1. Before calling the function, acquire the lock
2. Call the function
3. Release the lock (even on exception)
4. Return the function's result

## Example
\`\`\`python
lock = threading.Lock()

@synchronized(lock)
def critical_operation():
    # This is now thread-safe
    pass
\`\`\``,
    starterCode: `import threading
from functools import wraps

def synchronized(lock):
    # Return a decorator that wraps functions with lock
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Return a decorator that returns a wrapper function' },
      { afterAttempt: 2, text: 'The wrapper should use "with lock:" around func(*args, **kwargs)' }
    ],
    solution: {
      afterAttempt: 3,
      text: `\`\`\`python
import threading
from functools import wraps

def synchronized(lock):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            with lock:
                return func(*args, **kwargs)
        return wrapper
    return decorator
\`\`\``
    },
    testCases: [
      { input: '@synchronized(lock) decorated function', expected: 'thread-safe execution' }
    ],
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-lock-free-read',
    title: 'Thread-Safe Read with Lock',
    description: 'Safely read shared data',
    targetComplexity: { time: 'O(1)', space: 'O(1)' },
    instruction: `# Thread-Safe Read

Create a thread-safe container that allows reading and writing.

## Requirements
Create \`SafeValue\` class:
- \`__init__(value)\`: Initialize with a value
- \`get()\`: Return current value (thread-safe)
- \`set(value)\`: Update value (thread-safe)
- \`update(func)\`: Apply func to current value and store result (atomic)`,
    starterCode: `import threading

class SafeValue:
    def __init__(self, value):
        pass

    def get(self):
        pass

    def set(self, value):
        pass

    def update(self, func):
        # Atomically apply func to value
        pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'All methods should use "with self._lock:" to protect access' },
      { afterAttempt: 2, text: 'update() should read, apply func, and write within a single lock acquisition' }
    ],
    solution: {
      afterAttempt: 3,
      text: `\`\`\`python
import threading

class SafeValue:
    def __init__(self, value):
        self._value = value
        self._lock = threading.Lock()

    def get(self):
        with self._lock:
            return self._value

    def set(self, value):
        with self._lock:
            self._value = value

    def update(self, func):
        with self._lock:
            self._value = func(self._value)
            return self._value
\`\`\``
    },
    testCases: [
      { input: 'sv = SafeValue(5); sv.update(lambda x: x*2)', expected: '10' }
    ],
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-lock-queue',
    title: 'Thread-Safe Queue with Lock',
    description: 'Implement a basic thread-safe queue',
    targetComplexity: { time: 'O(1)', space: 'O(n)' },
    instruction: `# Thread-Safe Queue with Lock

Implement a simple thread-safe queue (before learning about queue.Queue).

## Requirements
Create \`LockedQueue\` class:
- \`put(item)\`: Add item to queue
- \`get()\`: Remove and return item (raise Empty if empty)
- \`empty()\`: Return True if queue is empty
- \`size()\`: Return current size`,
    starterCode: `import threading

class Empty(Exception):
    pass

class LockedQueue:
    def __init__(self):
        pass

    def put(self, item):
        pass

    def get(self):
        pass

    def empty(self):
        pass

    def size(self):
        pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Use a list as the underlying storage and a lock to protect it' },
      { afterAttempt: 2, text: 'get() should pop from front (index 0), put() should append to back' }
    ],
    solution: {
      afterAttempt: 3,
      text: `\`\`\`python
import threading

class Empty(Exception):
    pass

class LockedQueue:
    def __init__(self):
        self._items = []
        self._lock = threading.Lock()

    def put(self, item):
        with self._lock:
            self._items.append(item)

    def get(self):
        with self._lock:
            if not self._items:
                raise Empty()
            return self._items.pop(0)

    def empty(self):
        with self._lock:
            return len(self._items) == 0

    def size(self):
        with self._lock:
            return len(self._items)
\`\`\``
    },
    testCases: [
      { input: 'q = LockedQueue(); q.put(1); q.get()', expected: '1' }
    ],
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-lock-dict',
    title: 'Thread-Safe Dictionary',
    description: 'Implement a thread-safe dictionary wrapper',
    targetComplexity: { time: 'O(1)', space: 'O(n)' },
    instruction: `# Thread-Safe Dictionary

Create a thread-safe dictionary wrapper.

## Requirements
Create \`SafeDict\` class:
- \`get(key, default=None)\`: Get value for key
- \`set(key, value)\`: Set value for key
- \`delete(key)\`: Remove key
- \`keys()\`: Return list of keys
- \`get_or_set(key, default)\`: Return value if exists, else set and return default`,
    starterCode: `import threading

class SafeDict:
    def __init__(self):
        pass

    def get(self, key, default=None):
        pass

    def set(self, key, value):
        pass

    def delete(self, key):
        pass

    def keys(self):
        pass

    def get_or_set(self, key, default):
        # Atomic get-or-set
        pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Use a regular dict with a lock protecting all operations' },
      { afterAttempt: 2, text: 'get_or_set must check and set within a single lock acquisition' }
    ],
    solution: {
      afterAttempt: 3,
      text: `\`\`\`python
import threading

class SafeDict:
    def __init__(self):
        self._dict = {}
        self._lock = threading.Lock()

    def get(self, key, default=None):
        with self._lock:
            return self._dict.get(key, default)

    def set(self, key, value):
        with self._lock:
            self._dict[key] = value

    def delete(self, key):
        with self._lock:
            if key in self._dict:
                del self._dict[key]

    def keys(self):
        with self._lock:
            return list(self._dict.keys())

    def get_or_set(self, key, default):
        with self._lock:
            if key not in self._dict:
                self._dict[key] = default
            return self._dict[key]
\`\`\``
    },
    testCases: [
      { input: 'd = SafeDict(); d.set("a", 1); d.get("a")', expected: '1' }
    ],
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-bounded-counter',
    title: 'Bounded Counter with Lock',
    description: 'Counter that cannot go below min or above max',
    targetComplexity: { time: 'O(1)', space: 'O(1)' },
    instruction: `# Bounded Counter

Create a thread-safe counter with min/max bounds.

## Requirements
Create \`BoundedCounter\` class:
- \`__init__(value, min_val, max_val)\`
- \`increment()\`: Add 1, return True if successful, False if at max
- \`decrement()\`: Subtract 1, return True if successful, False if at min
- \`get_value()\`: Return current value`,
    starterCode: `import threading

class BoundedCounter:
    def __init__(self, value, min_val, max_val):
        pass

    def increment(self):
        pass

    def decrement(self):
        pass

    def get_value(self):
        pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Check bounds before modifying, all within the lock' },
      { afterAttempt: 2, text: 'Return False without modifying if at boundary' }
    ],
    solution: {
      afterAttempt: 3,
      text: `\`\`\`python
import threading

class BoundedCounter:
    def __init__(self, value, min_val, max_val):
        self._value = value
        self._min = min_val
        self._max = max_val
        self._lock = threading.Lock()

    def increment(self):
        with self._lock:
            if self._value >= self._max:
                return False
            self._value += 1
            return True

    def decrement(self):
        with self._lock:
            if self._value <= self._min:
                return False
            self._value -= 1
            return True

    def get_value(self):
        with self._lock:
            return self._value
\`\`\``
    },
    testCases: [
      { input: 'c = BoundedCounter(5, 0, 10); c.increment(); c.get_value()', expected: '6' }
    ],
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-lock-list',
    title: 'Thread-Safe List',
    description: 'Thread-safe list operations',
    targetComplexity: { time: 'O(1) for most ops', space: 'O(n)' },
    instruction: `# Thread-Safe List

Create a thread-safe list wrapper.

## Requirements
Create \`SafeList\` class:
- \`append(item)\`: Add item to end
- \`pop()\`: Remove and return last item
- \`get(index)\`: Get item at index
- \`length()\`: Return length
- \`to_list()\`: Return a copy of the internal list`,
    starterCode: `import threading

class SafeList:
    def __init__(self):
        pass

    def append(self, item):
        pass

    def pop(self):
        pass

    def get(self, index):
        pass

    def length(self):
        pass

    def to_list(self):
        pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Protect all operations with a lock' },
      { afterAttempt: 2, text: 'to_list() should return a copy, not the internal list, to prevent external modification' }
    ],
    solution: {
      afterAttempt: 3,
      text: `\`\`\`python
import threading

class SafeList:
    def __init__(self):
        self._items = []
        self._lock = threading.Lock()

    def append(self, item):
        with self._lock:
            self._items.append(item)

    def pop(self):
        with self._lock:
            return self._items.pop()

    def get(self, index):
        with self._lock:
            return self._items[index]

    def length(self):
        with self._lock:
            return len(self._items)

    def to_list(self):
        with self._lock:
            return self._items.copy()
\`\`\``
    },
    testCases: [
      { input: 'sl = SafeList(); sl.append(1); sl.append(2); sl.to_list()', expected: '[1, 2]' }
    ],
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-compare-and-swap',
    title: 'Compare-And-Swap Pattern',
    description: 'Implement atomic compare-and-swap',
    targetComplexity: { time: 'O(1)', space: 'O(1)' },
    instruction: `# Compare-And-Swap Pattern

Implement compare-and-swap (CAS), a fundamental atomic operation.

## Requirements
Create \`AtomicValue\` class:
- \`get()\`: Return current value
- \`set(value)\`: Set value
- \`compare_and_swap(expected, new_value)\`:
  - If current value == expected, set to new_value, return True
  - Otherwise, don't change, return False
  - Must be atomic

## Use Case
CAS is used in lock-free algorithms and optimistic locking.`,
    starterCode: `import threading

class AtomicValue:
    def __init__(self, value):
        pass

    def get(self):
        pass

    def set(self, value):
        pass

    def compare_and_swap(self, expected, new_value):
        pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'compare_and_swap must check and set within a single lock acquisition' },
      { afterAttempt: 2, text: 'Compare, set if equal, all inside "with self._lock:"' }
    ],
    solution: {
      afterAttempt: 3,
      text: `\`\`\`python
import threading

class AtomicValue:
    def __init__(self, value):
        self._value = value
        self._lock = threading.Lock()

    def get(self):
        with self._lock:
            return self._value

    def set(self, value):
        with self._lock:
            self._value = value

    def compare_and_swap(self, expected, new_value):
        with self._lock:
            if self._value == expected:
                self._value = new_value
                return True
            return False
\`\`\``
    },
    testCases: [
      { input: 'av = AtomicValue(5); av.compare_and_swap(5, 10)', expected: 'True' },
      { input: 'av = AtomicValue(5); av.compare_and_swap(3, 10)', expected: 'False' }
    ],
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-spin-lock',
    title: 'Simple Spin Lock',
    description: 'Implement a spin lock using atomic operations',
    targetComplexity: { time: 'O(1)', space: 'O(1)' },
    instruction: `# Simple Spin Lock

A spin lock keeps trying (spinning) until it acquires the lock.

## Requirements
Create \`SpinLock\` class:
- \`acquire()\`: Spin until lock acquired
- \`release()\`: Release the lock

## Implementation
Use a flag that's atomically checked and set.

## Note
In real code, use threading.Lock. This is for understanding concepts.`,
    starterCode: `import threading
import time

class SpinLock:
    def __init__(self):
        pass

    def acquire(self):
        # Keep trying until we get the lock
        pass

    def release(self):
        pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Use a flag and a lock to make the flag check/set atomic' },
      { afterAttempt: 2, text: 'In acquire(), loop until you successfully set the flag from False to True' }
    ],
    solution: {
      afterAttempt: 3,
      text: `\`\`\`python
import threading
import time

class SpinLock:
    def __init__(self):
        self._locked = False
        self._lock = threading.Lock()  # Protects the flag

    def acquire(self):
        while True:
            with self._lock:
                if not self._locked:
                    self._locked = True
                    return
            time.sleep(0.001)  # Small sleep to reduce CPU usage

    def release(self):
        with self._lock:
            self._locked = False
\`\`\``
    },
    testCases: [
      { input: 'sl = SpinLock(); sl.acquire(); sl.release()', expected: 'no deadlock' }
    ],
  },

  // ==================== GROUP 3: Events & Conditions (15 exercises) ====================
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-basic-event',
    title: 'Basic Event Usage',
    description: 'Use Event for simple signaling',
    targetComplexity: { time: 'O(1)', space: 'O(1)' },
    instruction: `# Basic Event Usage

Use an Event to signal between threads.

## Requirements
\`wait_for_signal()\`:
1. Create an Event
2. Start a thread that waits for the event
3. Set the event after 0.1 seconds
4. Return True when waiter thread completes`,
    starterCode: `import threading
import time

def wait_for_signal():
    # Create event, start waiter, set event, return when done
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Create Event, start thread that calls event.wait(), then event.set()' }
    ],
    solution: {
      afterAttempt: 3,
      text: `\`\`\`python
import threading
import time

def wait_for_signal():
    event = threading.Event()

    def waiter():
        event.wait()

    t = threading.Thread(target=waiter)
    t.start()

    time.sleep(0.1)
    event.set()

    t.join()
    return True
\`\`\``
    },
    testCases: [
      { input: '', expected: 'True' }
    ],
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-event-timeout',
    title: 'Event with Timeout',
    description: 'Wait for an event with a timeout',
    targetComplexity: { time: 'O(1)', space: 'O(1)' },
    instruction: `# Event with Timeout

Wait for an event, but give up after a timeout.

## Requirements
\`wait_with_timeout(event, timeout)\`:
1. Wait for event to be set
2. If event is set within timeout, return True
3. If timeout expires, return False`,
    starterCode: `import threading

def wait_with_timeout(event, timeout):
    # Wait for event with timeout
    # Return True if set, False if timeout
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'event.wait(timeout=timeout) returns True if event was set, False if timeout' }
    ],
    solution: {
      afterAttempt: 3,
      text: `\`\`\`python
import threading

def wait_with_timeout(event, timeout):
    return event.wait(timeout=timeout)
\`\`\``
    },
    testCases: [
      { input: 'set_event, 1', expected: 'True' },
      { input: 'unset_event, 0.1', expected: 'False' }
    ],
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-event-clear',
    title: 'Resettable Event',
    description: 'Clear and reuse an event',
    targetComplexity: { time: 'O(1)', space: 'O(1)' },
    instruction: `# Resettable Event

Events can be cleared and reused.

## Requirements
\`toggle_event(event, n_times)\`:
1. Toggle the event n_times (set, clear, set, clear, ...)
2. Return final state (True if set, False if cleared)`,
    starterCode: `import threading

def toggle_event(event, n_times):
    # Toggle event n times, return final state
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Use event.set() and event.clear() alternately' },
      { afterAttempt: 2, text: 'event.is_set() returns current state' }
    ],
    solution: {
      afterAttempt: 3,
      text: `\`\`\`python
import threading

def toggle_event(event, n_times):
    for i in range(n_times):
        if event.is_set():
            event.clear()
        else:
            event.set()
    return event.is_set()
\`\`\``
    },
    testCases: [
      { input: 'cleared_event, 3', expected: 'True' },
      { input: 'cleared_event, 4', expected: 'False' }
    ],
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-condition-basic',
    title: 'Basic Condition Usage',
    description: 'Use Condition for wait/notify pattern',
    targetComplexity: { time: 'O(1)', space: 'O(1)' },
    instruction: `# Basic Condition Usage

Condition is used for complex wait/notify patterns.

## Requirements
Create \`Latch\` class (one-time gate):
- \`wait()\`: Block until gate is opened
- \`open()\`: Open the gate, wake all waiters
- Once opened, wait() returns immediately`,
    starterCode: `import threading

class Latch:
    def __init__(self):
        pass

    def wait(self):
        # Block until opened
        pass

    def open(self):
        # Open and wake all waiters
        pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Use Condition with a flag. wait() loops until flag is True.' },
      { afterAttempt: 2, text: 'open() sets flag and calls notify_all()' }
    ],
    solution: {
      afterAttempt: 3,
      text: `\`\`\`python
import threading

class Latch:
    def __init__(self):
        self._opened = False
        self._condition = threading.Condition()

    def wait(self):
        with self._condition:
            while not self._opened:
                self._condition.wait()

    def open(self):
        with self._condition:
            self._opened = True
            self._condition.notify_all()
\`\`\``
    },
    testCases: [
      { input: 'latch = Latch(); latch.open(); latch.wait()', expected: 'returns immediately' }
    ],
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-condition-predicate',
    title: 'Condition with Predicate',
    description: 'Use wait_for() with a predicate function',
    targetComplexity: { time: 'O(1)', space: 'O(1)' },
    instruction: `# Condition with Predicate

Use condition.wait_for(predicate) for cleaner code.

## Requirements
Reimplement \`Latch\` using wait_for() instead of while loop.`,
    starterCode: `import threading

class Latch:
    def __init__(self):
        pass

    def wait(self):
        # Use wait_for() with predicate
        pass

    def open(self):
        pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'wait_for(predicate) is equivalent to while not predicate(): wait()' },
      { afterAttempt: 2, text: 'self._condition.wait_for(lambda: self._opened)' }
    ],
    solution: {
      afterAttempt: 3,
      text: `\`\`\`python
import threading

class Latch:
    def __init__(self):
        self._opened = False
        self._condition = threading.Condition()

    def wait(self):
        with self._condition:
            self._condition.wait_for(lambda: self._opened)

    def open(self):
        with self._condition:
            self._opened = True
            self._condition.notify_all()
\`\`\``
    },
    testCases: [
      { input: 'latch = Latch(); latch.open(); latch.wait()', expected: 'returns' }
    ],
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-barrier-basic',
    title: 'Basic Barrier Usage',
    description: 'Synchronize multiple threads at a barrier',
    targetComplexity: { time: 'O(1)', space: 'O(1)' },
    instruction: `# Basic Barrier Usage

A Barrier makes threads wait until all arrive.

## Requirements
\`run_with_barrier(n_threads)\`:
1. Create a Barrier for n_threads
2. Start n_threads, each waits at barrier then appends "done" to results
3. Return results list after all complete

All threads should append "done" only after all have reached the barrier.`,
    starterCode: `import threading

def run_with_barrier(n_threads):
    # All threads wait at barrier, then all proceed together
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Create Barrier(n_threads). Each thread calls barrier.wait() before appending.' },
      { afterAttempt: 2, text: 'After barrier.wait() returns, all threads have arrived.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `\`\`\`python
import threading

def run_with_barrier(n_threads):
    barrier = threading.Barrier(n_threads)
    results = []
    lock = threading.Lock()

    def worker():
        barrier.wait()  # Wait for all threads
        with lock:
            results.append("done")

    threads = [threading.Thread(target=worker) for _ in range(n_threads)]
    for t in threads:
        t.start()
    for t in threads:
        t.join()

    return results
\`\`\``
    },
    testCases: [
      { input: '3', expected: '["done", "done", "done"]' }
    ],
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-barrier-action',
    title: 'Barrier with Action',
    description: 'Run an action when all threads arrive at barrier',
    targetComplexity: { time: 'O(1)', space: 'O(1)' },
    instruction: `# Barrier with Action

Barrier can run an action when all threads arrive.

## Requirements
\`barrier_with_action(n_threads, action)\`:
1. Create a Barrier for n_threads with action as the barrier action
2. action() is called once when all threads arrive
3. Return after all threads complete`,
    starterCode: `import threading

def barrier_with_action(n_threads, action):
    # Create barrier that runs action when all arrive
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Barrier accepts an action parameter: Barrier(n, action=func)' },
      { afterAttempt: 2, text: 'The action is called by exactly one thread when the barrier is released' }
    ],
    solution: {
      afterAttempt: 3,
      text: `\`\`\`python
import threading

def barrier_with_action(n_threads, action):
    barrier = threading.Barrier(n_threads, action=action)

    def worker():
        barrier.wait()

    threads = [threading.Thread(target=worker) for _ in range(n_threads)]
    for t in threads:
        t.start()
    for t in threads:
        t.join()
\`\`\``
    },
    testCases: [
      { input: '3, lambda: print("all arrived")', expected: 'prints once' }
    ],
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-countdown-latch',
    title: 'Countdown Latch',
    description: 'Wait until a count reaches zero',
    targetComplexity: { time: 'O(1)', space: 'O(1)' },
    instruction: `# Countdown Latch

A CountdownLatch waits until count reaches zero.

## Requirements
Create \`CountdownLatch\` class:
- \`__init__(count)\`: Initialize with count
- \`count_down()\`: Decrement count by 1
- \`wait()\`: Block until count reaches 0
- \`get_count()\`: Return current count`,
    starterCode: `import threading

class CountdownLatch:
    def __init__(self, count):
        pass

    def count_down(self):
        pass

    def wait(self):
        pass

    def get_count(self):
        pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Use Condition. count_down() decrements and notifies if zero.' },
      { afterAttempt: 2, text: 'wait() uses wait_for(lambda: self._count == 0)' }
    ],
    solution: {
      afterAttempt: 3,
      text: `\`\`\`python
import threading

class CountdownLatch:
    def __init__(self, count):
        self._count = count
        self._condition = threading.Condition()

    def count_down(self):
        with self._condition:
            self._count -= 1
            if self._count == 0:
                self._condition.notify_all()

    def wait(self):
        with self._condition:
            self._condition.wait_for(lambda: self._count == 0)

    def get_count(self):
        with self._condition:
            return self._count
\`\`\``
    },
    testCases: [
      { input: 'latch = CountdownLatch(2); latch.count_down(); latch.get_count()', expected: '1' }
    ],
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-blocking-queue',
    title: 'Blocking Queue',
    description: 'Queue that blocks when empty',
    targetComplexity: { time: 'O(1)', space: 'O(n)' },
    instruction: `# Blocking Queue

Create a queue where get() blocks until an item is available.

## Requirements
Create \`BlockingQueue\` class:
- \`put(item)\`: Add item (never blocks)
- \`get()\`: Get item, blocking if queue is empty
- \`get_nowait()\`: Get item, raise Empty if queue is empty`,
    starterCode: `import threading

class Empty(Exception):
    pass

class BlockingQueue:
    def __init__(self):
        pass

    def put(self, item):
        pass

    def get(self):
        pass

    def get_nowait(self):
        pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Use Condition. get() waits until items available.' },
      { afterAttempt: 2, text: 'put() adds item and notifies one waiter' }
    ],
    solution: {
      afterAttempt: 3,
      text: `\`\`\`python
import threading

class Empty(Exception):
    pass

class BlockingQueue:
    def __init__(self):
        self._items = []
        self._condition = threading.Condition()

    def put(self, item):
        with self._condition:
            self._items.append(item)
            self._condition.notify()

    def get(self):
        with self._condition:
            self._condition.wait_for(lambda: len(self._items) > 0)
            return self._items.pop(0)

    def get_nowait(self):
        with self._condition:
            if not self._items:
                raise Empty()
            return self._items.pop(0)
\`\`\``
    },
    testCases: [
      { input: 'q = BlockingQueue(); q.put(1); q.get()', expected: '1' }
    ],
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-bounded-blocking-queue',
    title: 'Bounded Blocking Queue',
    description: 'Queue that blocks when full or empty',
    targetComplexity: { time: 'O(1)', space: 'O(n)' },
    instruction: `# Bounded Blocking Queue

Create a queue with a maximum size that blocks on put when full.

## Requirements
Create \`BoundedBlockingQueue\` class:
- \`__init__(maxsize)\`: Initialize with max capacity
- \`put(item)\`: Add item, blocking if full
- \`get()\`: Get item, blocking if empty
- \`size()\`: Return current size`,
    starterCode: `import threading

class BoundedBlockingQueue:
    def __init__(self, maxsize):
        pass

    def put(self, item):
        pass

    def get(self):
        pass

    def size(self):
        pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'put() waits until size < maxsize, get() waits until size > 0' },
      { afterAttempt: 2, text: 'put() notifies waiting getters, get() notifies waiting putters' }
    ],
    solution: {
      afterAttempt: 3,
      text: `\`\`\`python
import threading

class BoundedBlockingQueue:
    def __init__(self, maxsize):
        self._maxsize = maxsize
        self._items = []
        self._condition = threading.Condition()

    def put(self, item):
        with self._condition:
            self._condition.wait_for(lambda: len(self._items) < self._maxsize)
            self._items.append(item)
            self._condition.notify()  # Wake up getter

    def get(self):
        with self._condition:
            self._condition.wait_for(lambda: len(self._items) > 0)
            item = self._items.pop(0)
            self._condition.notify()  # Wake up putter
            return item

    def size(self):
        with self._condition:
            return len(self._items)
\`\`\``
    },
    testCases: [
      { input: 'q = BoundedBlockingQueue(2); q.put(1); q.put(2); q.size()', expected: '2' }
    ],
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-event-many-waiters',
    title: 'Event with Many Waiters',
    description: 'Signal multiple waiting threads at once',
    targetComplexity: { time: 'O(n)', space: 'O(1)' },
    instruction: `# Event with Many Waiters

Demonstrate Event waking multiple waiting threads.

## Requirements
\`signal_all(n_waiters)\`:
1. Create an Event
2. Start n_waiters threads that wait for the event
3. Set the event to wake all
4. Return count of threads that were woken`,
    starterCode: `import threading
import time

def signal_all(n_waiters):
    # Create event, start waiters, set event, count woken
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Each waiter increments a counter after event.wait() returns' },
      { afterAttempt: 2, text: 'Use a lock to protect the counter' }
    ],
    solution: {
      afterAttempt: 3,
      text: `\`\`\`python
import threading
import time

def signal_all(n_waiters):
    event = threading.Event()
    woken = [0]
    lock = threading.Lock()

    def waiter():
        event.wait()
        with lock:
            woken[0] += 1

    threads = [threading.Thread(target=waiter) for _ in range(n_waiters)]
    for t in threads:
        t.start()

    time.sleep(0.1)  # Let all threads start waiting
    event.set()

    for t in threads:
        t.join()

    return woken[0]
\`\`\``
    },
    testCases: [
      { input: '5', expected: '5' }
    ],
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-cyclic-barrier',
    title: 'Cyclic Barrier',
    description: 'Barrier that can be reused',
    targetComplexity: { time: 'O(1)', space: 'O(1)' },
    instruction: `# Cyclic Barrier

Python's Barrier is already cyclic (can be reused).

## Requirements
\`multi_phase_work(n_threads, n_phases)\`:
1. Create n_threads that each go through n_phases
2. Use a barrier to sync between phases
3. Return total work done (n_threads * n_phases)`,
    starterCode: `import threading

def multi_phase_work(n_threads, n_phases):
    # Threads sync at barrier between each phase
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Each thread loops n_phases times, calling barrier.wait() each iteration' },
      { afterAttempt: 2, text: 'After each barrier.wait(), all threads proceed to next phase together' }
    ],
    solution: {
      afterAttempt: 3,
      text: `\`\`\`python
import threading

def multi_phase_work(n_threads, n_phases):
    barrier = threading.Barrier(n_threads)
    work_done = [0]
    lock = threading.Lock()

    def worker():
        for phase in range(n_phases):
            # Do work for this phase
            with lock:
                work_done[0] += 1
            barrier.wait()  # Sync before next phase

    threads = [threading.Thread(target=worker) for _ in range(n_threads)]
    for t in threads:
        t.start()
    for t in threads:
        t.join()

    return work_done[0]
\`\`\``
    },
    testCases: [
      { input: '3, 4', expected: '12' }
    ],
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-condition-notify-one',
    title: 'Notify One vs Notify All',
    description: 'Understand notify() vs notify_all()',
    targetComplexity: { time: 'O(1)', space: 'O(1)' },
    instruction: `# Notify One vs Notify All

\`notify()\` wakes one waiter, \`notify_all()\` wakes all.

## Requirements
Create \`SelectiveSignal\` class:
- \`wait()\`: Wait for signal
- \`signal_one()\`: Wake exactly one waiter
- \`signal_all()\`: Wake all waiters`,
    starterCode: `import threading

class SelectiveSignal:
    def __init__(self):
        pass

    def wait(self):
        pass

    def signal_one(self):
        pass

    def signal_all(self):
        pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Use Condition. signal_one() calls notify(), signal_all() calls notify_all()' }
    ],
    solution: {
      afterAttempt: 3,
      text: `\`\`\`python
import threading

class SelectiveSignal:
    def __init__(self):
        self._signaled = False
        self._condition = threading.Condition()

    def wait(self):
        with self._condition:
            while not self._signaled:
                self._condition.wait()

    def signal_one(self):
        with self._condition:
            self._signaled = True
            self._condition.notify()  # Wake one waiter

    def signal_all(self):
        with self._condition:
            self._signaled = True
            self._condition.notify_all()  # Wake all waiters
\`\`\``
    },
    testCases: [
      { input: 'signal.signal_one()', expected: 'wakes one' }
    ],
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-pulse-event',
    title: 'Pulse Event',
    description: 'Event that auto-clears after waking waiters',
    targetComplexity: { time: 'O(1)', space: 'O(1)' },
    instruction: `# Pulse Event

An event that sets and immediately clears, waking one waiter.

## Requirements
Create \`PulseEvent\` class:
- \`wait()\`: Wait for pulse
- \`pulse()\`: Wake one waiter, don't stay set

Unlike regular Event, pulse() wakes one waiter but doesn't stay set for future waiters.`,
    starterCode: `import threading

class PulseEvent:
    def __init__(self):
        pass

    def wait(self):
        pass

    def pulse(self):
        pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Use Condition instead of Event. pulse() notifies one waiter.' },
      { afterAttempt: 2, text: 'Use a counter that pulse() increments and wait() checks' }
    ],
    solution: {
      afterAttempt: 3,
      text: `\`\`\`python
import threading

class PulseEvent:
    def __init__(self):
        self._pulse_count = 0
        self._condition = threading.Condition()

    def wait(self):
        with self._condition:
            current = self._pulse_count
            self._condition.wait_for(lambda: self._pulse_count > current)

    def pulse(self):
        with self._condition:
            self._pulse_count += 1
            self._condition.notify()  # Wake one waiter
\`\`\``
    },
    testCases: [
      { input: 'pe = PulseEvent(); pe.pulse()', expected: 'wakes one' }
    ],
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-rendezvous',
    title: 'Rendezvous Pattern',
    description: 'Two threads meet and exchange data',
    targetComplexity: { time: 'O(1)', space: 'O(1)' },
    instruction: `# Rendezvous Pattern

Two threads meet at a rendezvous point and exchange data.

## Requirements
Create \`Rendezvous\` class:
- \`exchange(data)\`: Wait for partner, exchange data, return partner's data
- Both threads must arrive before either proceeds`,
    starterCode: `import threading

class Rendezvous:
    def __init__(self):
        pass

    def exchange(self, data):
        # Wait for partner, exchange, return partner's data
        pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Use a Barrier(2) to sync. Store data in shared slots.' },
      { afterAttempt: 2, text: 'Each thread stores its data, waits at barrier, then reads partner\'s data' }
    ],
    solution: {
      afterAttempt: 3,
      text: `\`\`\`python
import threading

class Rendezvous:
    def __init__(self):
        self._barrier = threading.Barrier(2)
        self._data = [None, None]
        self._lock = threading.Lock()
        self._index = [0]

    def exchange(self, data):
        with self._lock:
            my_index = self._index[0]
            self._index[0] = (self._index[0] + 1) % 2

        self._data[my_index] = data
        self._barrier.wait()

        partner_index = 1 - my_index
        return self._data[partner_index]
\`\`\``
    },
    testCases: [
      { input: 'Thread A: exchange("A"), Thread B: exchange("B")', expected: 'A gets "B", B gets "A"' }
    ],
  },

  // ==================== GROUP 4: Semaphores (10 exercises) ====================
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-basic-semaphore',
    title: 'Basic Semaphore Usage',
    description: 'Limit concurrent access with a semaphore',
    targetComplexity: { time: 'O(n)', space: 'O(1)' },
    instruction: `# Basic Semaphore Usage

Limit how many threads can access a resource simultaneously.

## Requirements
\`limited_access(n_threads, max_concurrent)\`:
1. Create n_threads that each want to access a resource
2. Use semaphore to allow only max_concurrent at a time
3. Return max concurrency observed (should be <= max_concurrent)`,
    starterCode: `import threading
import time

def limited_access(n_threads, max_concurrent):
    # Use semaphore to limit concurrency
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Create Semaphore(max_concurrent). Each thread acquires before accessing.' },
      { afterAttempt: 2, text: 'Track current_count, update max_observed, all with a lock' }
    ],
    solution: {
      afterAttempt: 3,
      text: `\`\`\`python
import threading
import time

def limited_access(n_threads, max_concurrent):
    sem = threading.Semaphore(max_concurrent)
    current = [0]
    max_observed = [0]
    lock = threading.Lock()

    def worker():
        with sem:
            with lock:
                current[0] += 1
                max_observed[0] = max(max_observed[0], current[0])
            time.sleep(0.01)  # Simulate work
            with lock:
                current[0] -= 1

    threads = [threading.Thread(target=worker) for _ in range(n_threads)]
    for t in threads:
        t.start()
    for t in threads:
        t.join()

    return max_observed[0]
\`\`\``
    },
    testCases: [
      { input: '10, 3', expected: '<= 3' }
    ],
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-bounded-semaphore',
    title: 'Bounded Semaphore',
    description: 'Semaphore that errors on over-release',
    targetComplexity: { time: 'O(1)', space: 'O(1)' },
    instruction: `# Bounded Semaphore

BoundedSemaphore raises error if released more times than acquired.

## Requirements
\`test_bounded()\`:
1. Create a BoundedSemaphore(2)
2. Acquire it twice
3. Release it twice
4. Try to release again (should raise ValueError)
5. Return True if ValueError was raised`,
    starterCode: `import threading

def test_bounded():
    # Test that over-release raises ValueError
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'BoundedSemaphore prevents accidental extra releases' },
      { afterAttempt: 2, text: 'Catch ValueError on the third release' }
    ],
    solution: {
      afterAttempt: 3,
      text: `\`\`\`python
import threading

def test_bounded():
    sem = threading.BoundedSemaphore(2)
    sem.acquire()
    sem.acquire()
    sem.release()
    sem.release()
    try:
        sem.release()  # Over-release!
        return False
    except ValueError:
        return True
\`\`\``
    },
    testCases: [
      { input: '', expected: 'True' }
    ],
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-semaphore-pool',
    title: 'Connection Pool with Semaphore',
    description: 'Implement a simple connection pool',
    targetComplexity: { time: 'O(1)', space: 'O(n)' },
    instruction: `# Connection Pool with Semaphore

Create a pool of reusable connections.

## Requirements
Create \`ConnectionPool\` class:
- \`__init__(connections)\`: Initialize with list of connections
- \`acquire()\`: Get a connection (blocks if none available)
- \`release(conn)\`: Return connection to pool`,
    starterCode: `import threading

class ConnectionPool:
    def __init__(self, connections):
        pass

    def acquire(self):
        pass

    def release(self, conn):
        pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Use Semaphore to track available slots and a list for actual connections' },
      { afterAttempt: 2, text: 'acquire() gets semaphore then pops from list. release() appends then releases semaphore.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `\`\`\`python
import threading

class ConnectionPool:
    def __init__(self, connections):
        self._connections = list(connections)
        self._semaphore = threading.Semaphore(len(connections))
        self._lock = threading.Lock()

    def acquire(self):
        self._semaphore.acquire()
        with self._lock:
            return self._connections.pop()

    def release(self, conn):
        with self._lock:
            self._connections.append(conn)
        self._semaphore.release()
\`\`\``
    },
    testCases: [
      { input: 'pool = ConnectionPool([1,2]); c = pool.acquire(); pool.release(c)', expected: 'works' }
    ],
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-semaphore-timeout',
    title: 'Semaphore with Timeout',
    description: 'Try to acquire semaphore with timeout',
    targetComplexity: { time: 'O(1)', space: 'O(1)' },
    instruction: `# Semaphore with Timeout

Try to acquire a semaphore, but give up after timeout.

## Requirements
\`try_acquire_semaphore(sem, timeout)\`:
1. Try to acquire sem within timeout seconds
2. Return True if acquired, False if timeout`,
    starterCode: `import threading

def try_acquire_semaphore(sem, timeout):
    # Try to acquire with timeout
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'sem.acquire(timeout=timeout) returns True if acquired' }
    ],
    solution: {
      afterAttempt: 3,
      text: `\`\`\`python
import threading

def try_acquire_semaphore(sem, timeout):
    return sem.acquire(timeout=timeout)
\`\`\``
    },
    testCases: [
      { input: 'available_sem, 1', expected: 'True' }
    ],
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-rate-limiter',
    title: 'Simple Rate Limiter',
    description: 'Limit requests per second',
    targetComplexity: { time: 'O(1)', space: 'O(1)' },
    instruction: `# Simple Rate Limiter

Limit how many operations can happen per time window.

## Requirements
Create \`RateLimiter\` class:
- \`__init__(max_calls, period)\`: Allow max_calls per period seconds
- \`acquire()\`: Wait until allowed, then permit call
- \`try_acquire()\`: Return True if allowed, False if rate limited`,
    starterCode: `import threading
import time

class RateLimiter:
    def __init__(self, max_calls, period):
        pass

    def acquire(self):
        pass

    def try_acquire(self):
        pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Use Semaphore for permits. Refill permits periodically.' },
      { afterAttempt: 2, text: 'Start a daemon thread that releases the semaphore periodically' }
    ],
    solution: {
      afterAttempt: 3,
      text: `\`\`\`python
import threading
import time

class RateLimiter:
    def __init__(self, max_calls, period):
        self._semaphore = threading.Semaphore(max_calls)
        self._max_calls = max_calls
        self._period = period
        self._start_refiller()

    def _start_refiller(self):
        def refill():
            while True:
                time.sleep(self._period)
                # Release up to max_calls permits
                for _ in range(self._max_calls):
                    try:
                        self._semaphore.release()
                    except ValueError:
                        break  # Already at max

        t = threading.Thread(target=refill, daemon=True)
        t.start()

    def acquire(self):
        self._semaphore.acquire()

    def try_acquire(self):
        return self._semaphore.acquire(blocking=False)
\`\`\``
    },
    testCases: [
      { input: 'rl = RateLimiter(5, 1); rl.try_acquire()', expected: 'True' }
    ],
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-semaphore-binary',
    title: 'Binary Semaphore (Mutex)',
    description: 'Semaphore with count 1 acts like a lock',
    targetComplexity: { time: 'O(1)', space: 'O(1)' },
    instruction: `# Binary Semaphore

A semaphore with count 1 is called a binary semaphore and acts like a mutex.

## Requirements
\`use_as_mutex()\`:
1. Create a Semaphore(1)
2. Use it to protect a shared counter
3. Increment counter 1000 times from 2 threads
4. Return final counter (should be 2000)`,
    starterCode: `import threading

def use_as_mutex():
    # Use Semaphore(1) as a lock
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Semaphore(1) allows only one thread to hold it at a time' },
      { afterAttempt: 2, text: 'Use "with semaphore:" just like you would use a lock' }
    ],
    solution: {
      afterAttempt: 3,
      text: `\`\`\`python
import threading

def use_as_mutex():
    mutex = threading.Semaphore(1)  # Binary semaphore
    counter = [0]

    def incrementer():
        for _ in range(1000):
            with mutex:
                counter[0] += 1

    t1 = threading.Thread(target=incrementer)
    t2 = threading.Thread(target=incrementer)
    t1.start()
    t2.start()
    t1.join()
    t2.join()

    return counter[0]
\`\`\``
    },
    testCases: [
      { input: '', expected: '2000' }
    ],
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-semaphore-fair',
    title: 'Fair Semaphore',
    description: 'Semaphore that grants in FIFO order',
    targetComplexity: { time: 'O(n)', space: 'O(n)' },
    instruction: `# Fair Semaphore

Python's Semaphore is not guaranteed to be fair. Implement a fair version.

## Requirements
Create \`FairSemaphore\` class:
- Threads acquire in the order they arrived (FIFO)
- \`acquire()\`: Wait for permit, FIFO order
- \`release()\`: Release permit

Note: This is for learning; in practice, unfair semaphores are usually fine.`,
    starterCode: `import threading
from collections import deque

class FairSemaphore:
    def __init__(self, value):
        pass

    def acquire(self):
        pass

    def release(self):
        pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Use a queue of waiting threads (each with their own Event)' },
      { afterAttempt: 2, text: 'Each waiter adds itself to queue, waits on its Event. Release wakes first in queue.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `\`\`\`python
import threading
from collections import deque

class FairSemaphore:
    def __init__(self, value):
        self._value = value
        self._lock = threading.Lock()
        self._queue = deque()

    def acquire(self):
        my_event = threading.Event()

        with self._lock:
            if self._value > 0:
                self._value -= 1
                return  # Got it immediately
            self._queue.append(my_event)

        my_event.wait()  # Wait for release to wake us

    def release(self):
        with self._lock:
            if self._queue:
                next_waiter = self._queue.popleft()
                next_waiter.set()  # Wake next in FIFO order
            else:
                self._value += 1
\`\`\``
    },
    testCases: [
      { input: 'fs = FairSemaphore(1); fs.acquire(); fs.release()', expected: 'FIFO order' }
    ],
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-worker-pool-semaphore',
    title: 'Worker Pool with Semaphore',
    description: 'Limit concurrent workers',
    targetComplexity: { time: 'O(n)', space: 'O(n)' },
    instruction: `# Worker Pool with Semaphore

Limit how many workers can be active at once.

## Requirements
\`process_with_workers(tasks, max_workers)\`:
1. Process all tasks
2. At most max_workers tasks run concurrently
3. Return list of results (in any order)`,
    starterCode: `import threading

def process_with_workers(tasks, max_workers):
    # tasks is list of callables
    # return list of results
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Create a thread per task, but use semaphore to limit concurrent execution' },
      { afterAttempt: 2, text: 'Each thread acquires semaphore, runs task, stores result, releases semaphore' }
    ],
    solution: {
      afterAttempt: 3,
      text: `\`\`\`python
import threading

def process_with_workers(tasks, max_workers):
    sem = threading.Semaphore(max_workers)
    results = []
    lock = threading.Lock()

    def worker(task):
        with sem:
            result = task()
            with lock:
                results.append(result)

    threads = [threading.Thread(target=worker, args=(task,)) for task in tasks]
    for t in threads:
        t.start()
    for t in threads:
        t.join()

    return results
\`\`\``
    },
    testCases: [
      { input: '[lambda: 1, lambda: 2], 2', expected: '[1, 2] in some order' }
    ],
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-semaphore-producer-consumer',
    title: 'Producer-Consumer with Semaphores',
    description: 'Classic bounded buffer with semaphores',
    targetComplexity: { time: 'O(n)', space: 'O(n)' },
    instruction: `# Producer-Consumer with Semaphores

Implement bounded buffer using semaphores (not Condition).

## Requirements
Create \`BoundedBuffer\` class:
- \`__init__(capacity)\`: Buffer with max capacity
- \`put(item)\`: Add item, block if full
- \`get()\`: Get item, block if empty

Use two semaphores: empty slots and full slots.`,
    starterCode: `import threading

class BoundedBuffer:
    def __init__(self, capacity):
        pass

    def put(self, item):
        pass

    def get(self):
        pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'empty = Semaphore(capacity), full = Semaphore(0)' },
      { afterAttempt: 2, text: 'put: acquire empty, add item, release full. get: acquire full, remove item, release empty.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `\`\`\`python
import threading

class BoundedBuffer:
    def __init__(self, capacity):
        self._buffer = []
        self._lock = threading.Lock()
        self._empty = threading.Semaphore(capacity)  # Empty slots
        self._full = threading.Semaphore(0)  # Full slots

    def put(self, item):
        self._empty.acquire()  # Wait for empty slot
        with self._lock:
            self._buffer.append(item)
        self._full.release()  # Signal one full slot

    def get(self):
        self._full.acquire()  # Wait for full slot
        with self._lock:
            item = self._buffer.pop(0)
        self._empty.release()  # Signal one empty slot
        return item
\`\`\``
    },
    testCases: [
      { input: 'bb = BoundedBuffer(2); bb.put(1); bb.get()', expected: '1' }
    ],
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-counting-semaphore',
    title: 'Counting Semaphore from Scratch',
    description: 'Implement a counting semaphore using conditions',
    targetComplexity: { time: 'O(1)', space: 'O(1)' },
    instruction: `# Counting Semaphore from Scratch

Implement a counting semaphore using only Condition.

## Requirements
Create \`MySemaphore\` class:
- \`__init__(value)\`: Initial permit count
- \`acquire()\`: Get permit, block if none
- \`release()\`: Add permit`,
    starterCode: `import threading

class MySemaphore:
    def __init__(self, value):
        pass

    def acquire(self):
        pass

    def release(self):
        pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Use Condition with a counter. acquire() waits until counter > 0.' },
      { afterAttempt: 2, text: 'release() increments counter and notifies one waiter' }
    ],
    solution: {
      afterAttempt: 3,
      text: `\`\`\`python
import threading

class MySemaphore:
    def __init__(self, value):
        self._value = value
        self._condition = threading.Condition()

    def acquire(self):
        with self._condition:
            self._condition.wait_for(lambda: self._value > 0)
            self._value -= 1

    def release(self):
        with self._condition:
            self._value += 1
            self._condition.notify()
\`\`\``
    },
    testCases: [
      { input: 's = MySemaphore(2); s.acquire(); s.acquire()', expected: 'blocks on third' }
    ],
  },

  // ==================== GROUP 5: Thread Pools (15 exercises) ====================
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-executor-basic',
    title: 'Basic ThreadPoolExecutor',
    description: 'Submit tasks to a thread pool',
    targetComplexity: { time: 'O(n)', space: 'O(n)' },
    instruction: `# Basic ThreadPoolExecutor

Submit tasks to a thread pool and get results.

## Requirements
\`process_items(items, func, max_workers)\`:
1. Create a ThreadPoolExecutor with max_workers
2. Process all items with func
3. Return list of results in order`,
    starterCode: `from concurrent.futures import ThreadPoolExecutor

def process_items(items, func, max_workers):
    # Process items in parallel
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Use executor.map(func, items) to process all items' },
      { afterAttempt: 2, text: 'executor.map() returns an iterator, convert to list' }
    ],
    solution: {
      afterAttempt: 3,
      text: `\`\`\`python
from concurrent.futures import ThreadPoolExecutor

def process_items(items, func, max_workers):
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        return list(executor.map(func, items))
\`\`\``
    },
    testCases: [
      { input: '[1,2,3], lambda x: x*2, 2', expected: '[2,4,6]' }
    ],
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-executor-submit',
    title: 'Submit with Futures',
    description: 'Use submit() and Future objects',
    targetComplexity: { time: 'O(n)', space: 'O(n)' },
    instruction: `# Submit with Futures

Use submit() for more control over individual tasks.

## Requirements
\`submit_tasks(tasks, max_workers)\`:
1. Submit all tasks (callables) to executor
2. Wait for all to complete
3. Return dict mapping task index to result`,
    starterCode: `from concurrent.futures import ThreadPoolExecutor

def submit_tasks(tasks, max_workers):
    # Submit tasks, return {index: result}
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'executor.submit(task) returns a Future. Store futures with their indices.' },
      { afterAttempt: 2, text: 'future.result() blocks until task completes and returns the result' }
    ],
    solution: {
      afterAttempt: 3,
      text: `\`\`\`python
from concurrent.futures import ThreadPoolExecutor

def submit_tasks(tasks, max_workers):
    results = {}
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = {executor.submit(task): i for i, task in enumerate(tasks)}
        for future, index in futures.items():
            results[index] = future.result()
    return results
\`\`\``
    },
    testCases: [
      { input: '[lambda: 1, lambda: 2], 2', expected: '{0: 1, 1: 2}' }
    ],
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-as-completed',
    title: 'Process as Completed',
    description: 'Handle results as they become available',
    targetComplexity: { time: 'O(n)', space: 'O(n)' },
    instruction: `# Process as Completed

Process results as soon as they're ready, not in submission order.

## Requirements
\`first_n_results(tasks, n, max_workers)\`:
1. Submit all tasks
2. Return the first n results that complete
3. Don't wait for remaining tasks`,
    starterCode: `from concurrent.futures import ThreadPoolExecutor, as_completed

def first_n_results(tasks, n, max_workers):
    # Return first n results to complete
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'as_completed(futures) yields futures as they complete' },
      { afterAttempt: 2, text: 'Iterate as_completed, collect n results, then break' }
    ],
    solution: {
      afterAttempt: 3,
      text: `\`\`\`python
from concurrent.futures import ThreadPoolExecutor, as_completed

def first_n_results(tasks, n, max_workers):
    results = []
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = [executor.submit(task) for task in tasks]
        for future in as_completed(futures):
            results.append(future.result())
            if len(results) >= n:
                break
    return results
\`\`\``
    },
    testCases: [
      { input: '[fast_task, slow_task, fast_task], 2, 3', expected: '2 fast results' }
    ],
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-future-exception',
    title: 'Handle Future Exceptions',
    description: 'Handle exceptions from futures',
    targetComplexity: { time: 'O(n)', space: 'O(n)' },
    instruction: `# Handle Future Exceptions

Futures may raise exceptions. Handle them gracefully.

## Requirements
\`safe_process(tasks, max_workers)\`:
1. Submit all tasks
2. Return list of (result, error) tuples
3. result is the value if successful, None otherwise
4. error is the exception if failed, None otherwise`,
    starterCode: `from concurrent.futures import ThreadPoolExecutor

def safe_process(tasks, max_workers):
    # Return [(result, error), ...]
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Use try/except around future.result()' },
      { afterAttempt: 2, text: 'Or use future.exception() to check for exception without raising' }
    ],
    solution: {
      afterAttempt: 3,
      text: `\`\`\`python
from concurrent.futures import ThreadPoolExecutor

def safe_process(tasks, max_workers):
    results = []
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = [executor.submit(task) for task in tasks]
        for future in futures:
            exc = future.exception()
            if exc:
                results.append((None, exc))
            else:
                results.append((future.result(), None))
    return results
\`\`\``
    },
    testCases: [
      { input: '[lambda: 1, lambda: 1/0], 2', expected: '[(1, None), (None, ZeroDivisionError)]' }
    ],
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-future-cancel',
    title: 'Cancel Pending Futures',
    description: 'Cancel futures that haven\'t started',
    targetComplexity: { time: 'O(n)', space: 'O(n)' },
    instruction: `# Cancel Pending Futures

Cancel futures that haven't started yet.

## Requirements
\`run_with_cancel(tasks, cancel_after, max_workers)\`:
1. Submit all tasks
2. After cancel_after complete, cancel remaining
3. Return (completed_count, cancelled_count)`,
    starterCode: `from concurrent.futures import ThreadPoolExecutor, as_completed

def run_with_cancel(tasks, cancel_after, max_workers):
    # Cancel remaining after cancel_after complete
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'future.cancel() returns True if cancelled, False if already running/done' },
      { afterAttempt: 2, text: 'After collecting cancel_after results, call cancel() on remaining futures' }
    ],
    solution: {
      afterAttempt: 3,
      text: `\`\`\`python
from concurrent.futures import ThreadPoolExecutor, as_completed

def run_with_cancel(tasks, cancel_after, max_workers):
    completed = 0
    cancelled = 0

    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = [executor.submit(task) for task in tasks]

        for future in as_completed(futures):
            completed += 1
            if completed >= cancel_after:
                break

        # Cancel remaining
        for future in futures:
            if future.cancel():
                cancelled += 1

    return (completed, cancelled)
\`\`\``
    },
    testCases: [
      { input: '[slow_tasks...], 2, 1', expected: '(2, some_cancelled)' }
    ],
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-future-timeout',
    title: 'Future with Timeout',
    description: 'Get result with timeout',
    targetComplexity: { time: 'O(1)', space: 'O(1)' },
    instruction: `# Future with Timeout

Wait for a future with a timeout.

## Requirements
\`get_with_timeout(future, timeout)\`:
1. Try to get result within timeout seconds
2. Return (result, True) if successful
3. Return (None, False) if timeout`,
    starterCode: `from concurrent.futures import TimeoutError

def get_with_timeout(future, timeout):
    # Get result with timeout
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'future.result(timeout=timeout) raises TimeoutError if timeout' },
      { afterAttempt: 2, text: 'Catch TimeoutError and return (None, False)' }
    ],
    solution: {
      afterAttempt: 3,
      text: `\`\`\`python
from concurrent.futures import TimeoutError

def get_with_timeout(future, timeout):
    try:
        result = future.result(timeout=timeout)
        return (result, True)
    except TimeoutError:
        return (None, False)
\`\`\``
    },
    testCases: [
      { input: 'quick_future, 5', expected: '(result, True)' }
    ],
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-executor-map-multiple',
    title: 'Map with Multiple Iterables',
    description: 'Process corresponding items from multiple lists',
    targetComplexity: { time: 'O(n)', space: 'O(n)' },
    instruction: `# Map with Multiple Iterables

executor.map() can take multiple iterables.

## Requirements
\`add_parallel(list1, list2, max_workers)\`:
1. Add corresponding elements: list1[i] + list2[i]
2. Process in parallel
3. Return list of sums`,
    starterCode: `from concurrent.futures import ThreadPoolExecutor

def add_parallel(list1, list2, max_workers):
    # Add corresponding elements in parallel
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'executor.map(func, iter1, iter2) passes corresponding items to func' },
      { afterAttempt: 2, text: 'Use a lambda or function that takes two arguments' }
    ],
    solution: {
      afterAttempt: 3,
      text: `\`\`\`python
from concurrent.futures import ThreadPoolExecutor

def add_parallel(list1, list2, max_workers):
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        return list(executor.map(lambda a, b: a + b, list1, list2))
\`\`\``
    },
    testCases: [
      { input: '[1,2,3], [4,5,6], 2', expected: '[5,7,9]' }
    ],
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-future-callback',
    title: 'Future Callbacks',
    description: 'Add callback to run when future completes',
    targetComplexity: { time: 'O(n)', space: 'O(n)' },
    instruction: `# Future Callbacks

Add a callback that runs when a future completes.

## Requirements
\`submit_with_callback(tasks, callback, max_workers)\`:
1. Submit all tasks
2. For each, add callback that receives the future
3. Return after all complete`,
    starterCode: `from concurrent.futures import ThreadPoolExecutor

def submit_with_callback(tasks, callback, max_workers):
    # Add callback to each future
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'future.add_done_callback(callback) registers a callback' },
      { afterAttempt: 2, text: 'The callback receives the future as its argument' }
    ],
    solution: {
      afterAttempt: 3,
      text: `\`\`\`python
from concurrent.futures import ThreadPoolExecutor

def submit_with_callback(tasks, callback, max_workers):
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = []
        for task in tasks:
            future = executor.submit(task)
            future.add_done_callback(callback)
            futures.append(future)
        # Context manager waits for all futures
\`\`\``
    },
    testCases: [
      { input: '[lambda: 1], print_result, 1', expected: 'callback called' }
    ],
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-executor-chaining',
    title: 'Chain Futures',
    description: 'Run tasks that depend on previous results',
    targetComplexity: { time: 'O(n)', space: 'O(n)' },
    instruction: `# Chain Futures

Run a pipeline where each step depends on the previous.

## Requirements
\`chain_tasks(initial, tasks, max_workers)\`:
1. Start with initial value
2. Pass result of each task to the next
3. Return final result`,
    starterCode: `from concurrent.futures import ThreadPoolExecutor

def chain_tasks(initial, tasks, max_workers):
    # Chain: initial -> task1 -> task2 -> ...
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Each task depends on previous, so they must run sequentially' },
      { afterAttempt: 2, text: 'Loop: submit task with current value, wait for result, repeat' }
    ],
    solution: {
      afterAttempt: 3,
      text: `\`\`\`python
from concurrent.futures import ThreadPoolExecutor

def chain_tasks(initial, tasks, max_workers):
    value = initial
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        for task in tasks:
            future = executor.submit(task, value)
            value = future.result()
    return value
\`\`\``
    },
    testCases: [
      { input: '1, [lambda x: x+1, lambda x: x*2], 1', expected: '4' }
    ],
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-executor-batch',
    title: 'Batch Processing with Executor',
    description: 'Process items in batches',
    targetComplexity: { time: 'O(n)', space: 'O(n)' },
    instruction: `# Batch Processing

Process items in batches for efficiency.

## Requirements
\`batch_process(items, func, batch_size, max_workers)\`:
1. Split items into batches of batch_size
2. Process each batch with func (which takes a list)
3. Combine and return all results`,
    starterCode: `from concurrent.futures import ThreadPoolExecutor

def batch_process(items, func, batch_size, max_workers):
    # Process in batches
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Create batches: [items[i:i+batch_size] for i in range(0, len(items), batch_size)]' },
      { afterAttempt: 2, text: 'Use executor.map(func, batches) then flatten results' }
    ],
    solution: {
      afterAttempt: 3,
      text: `\`\`\`python
from concurrent.futures import ThreadPoolExecutor

def batch_process(items, func, batch_size, max_workers):
    batches = [items[i:i+batch_size] for i in range(0, len(items), batch_size)]

    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        batch_results = list(executor.map(func, batches))

    # Flatten results
    return [item for batch in batch_results for item in batch]
\`\`\``
    },
    testCases: [
      { input: '[1,2,3,4,5], lambda b: [x*2 for x in b], 2, 2', expected: '[2,4,6,8,10]' }
    ],
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-wait-functions',
    title: 'Wait Functions',
    description: 'Use wait() for more control',
    targetComplexity: { time: 'O(n)', space: 'O(n)' },
    instruction: `# Wait Functions

Use wait() for fine-grained control over waiting.

## Requirements
\`wait_any(tasks, max_workers)\`:
1. Submit all tasks
2. Wait until at least one completes
3. Return (done_futures, not_done_futures)`,
    starterCode: `from concurrent.futures import ThreadPoolExecutor, wait, FIRST_COMPLETED

def wait_any(tasks, max_workers):
    # Wait for first completion
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'wait(futures, return_when=FIRST_COMPLETED) returns when any completes' },
      { afterAttempt: 2, text: 'Returns a named tuple with done and not_done sets' }
    ],
    solution: {
      afterAttempt: 3,
      text: `\`\`\`python
from concurrent.futures import ThreadPoolExecutor, wait, FIRST_COMPLETED

def wait_any(tasks, max_workers):
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = [executor.submit(task) for task in tasks]
        result = wait(futures, return_when=FIRST_COMPLETED)
        return (result.done, result.not_done)
\`\`\``
    },
    testCases: [
      { input: '[fast, slow, slow], 3', expected: '(1 done, 2 not done)' }
    ],
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-executor-shutdown',
    title: 'Executor Shutdown',
    description: 'Properly shutdown an executor',
    targetComplexity: { time: 'O(1)', space: 'O(1)' },
    instruction: `# Executor Shutdown

Understand shutdown behavior.

## Requirements
\`shutdown_demo(executor, wait)\`:
1. Call executor.shutdown(wait=wait)
2. Return True if shutdown immediately, False if waited`,
    starterCode: `from concurrent.futures import ThreadPoolExecutor

def shutdown_demo(executor, wait):
    # Shutdown and return behavior
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'shutdown(wait=True) blocks until all tasks complete' },
      { afterAttempt: 2, text: 'shutdown(wait=False) returns immediately, tasks continue in background' }
    ],
    solution: {
      afterAttempt: 3,
      text: `\`\`\`python
from concurrent.futures import ThreadPoolExecutor

def shutdown_demo(executor, wait):
    executor.shutdown(wait=wait)
    return not wait  # True if returned immediately
\`\`\``
    },
    testCases: [
      { input: 'executor, False', expected: 'True' }
    ],
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-executor-context',
    title: 'Executor as Context Manager',
    description: 'Use executor with context manager',
    targetComplexity: { time: 'O(n)', space: 'O(n)' },
    instruction: `# Executor as Context Manager

Use 'with' statement for automatic cleanup.

## Requirements
Explain: What happens when you use ThreadPoolExecutor with 'with'?
Write a function demonstrating proper usage.`,
    starterCode: `from concurrent.futures import ThreadPoolExecutor

def demo_context_manager():
    # Demonstrate context manager usage
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'with ThreadPoolExecutor() as executor: ... automatically calls shutdown(wait=True)' }
    ],
    solution: {
      afterAttempt: 3,
      text: `\`\`\`python
from concurrent.futures import ThreadPoolExecutor

def demo_context_manager():
    # Context manager ensures shutdown(wait=True) is called
    with ThreadPoolExecutor(max_workers=2) as executor:
        futures = [executor.submit(lambda: i) for i in range(3)]
    # Here, all tasks are guaranteed complete
    # because __exit__ calls shutdown(wait=True)
    return [f.result() for f in futures]
\`\`\``
    },
    testCases: [
      { input: '', expected: 'all tasks complete before exit' }
    ],
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-executor-reuse',
    title: 'Reuse Executor',
    description: 'Submit multiple batches to same executor',
    targetComplexity: { time: 'O(n)', space: 'O(n)' },
    instruction: `# Reuse Executor

Reuse an executor for multiple batches of work.

## Requirements
\`multi_batch_process(batches, func, max_workers)\`:
1. Create ONE executor
2. Process all batches through it
3. Return list of batch results`,
    starterCode: `from concurrent.futures import ThreadPoolExecutor

def multi_batch_process(batches, func, max_workers):
    # Process multiple batches with one executor
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Create executor once, call map() for each batch' },
      { afterAttempt: 2, text: 'Reusing executor avoids thread creation overhead' }
    ],
    solution: {
      afterAttempt: 3,
      text: `\`\`\`python
from concurrent.futures import ThreadPoolExecutor

def multi_batch_process(batches, func, max_workers):
    results = []
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        for batch in batches:
            batch_result = list(executor.map(func, batch))
            results.append(batch_result)
    return results
\`\`\``
    },
    testCases: [
      { input: '[[1,2], [3,4]], lambda x: x*2, 2', expected: '[[2,4], [6,8]]' }
    ],
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-executor-initializer',
    title: 'Executor with Initializer',
    description: 'Run setup code in each worker',
    targetComplexity: { time: 'O(n)', space: 'O(n)' },
    instruction: `# Executor with Initializer

Run initialization code when each worker thread starts.

## Requirements
\`process_with_init(items, func, init_func, max_workers)\`:
1. Create executor with initializer=init_func
2. init_func runs once per worker thread
3. Process items with func
4. Return results`,
    starterCode: `from concurrent.futures import ThreadPoolExecutor

def process_with_init(items, func, init_func, max_workers):
    # Use initializer for worker setup
    pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'ThreadPoolExecutor accepts initializer and initargs parameters' },
      { afterAttempt: 2, text: 'Initializer runs once per worker thread, not once per task' }
    ],
    solution: {
      afterAttempt: 3,
      text: `\`\`\`python
from concurrent.futures import ThreadPoolExecutor

def process_with_init(items, func, init_func, max_workers):
    with ThreadPoolExecutor(
        max_workers=max_workers,
        initializer=init_func
    ) as executor:
        return list(executor.map(func, items))
\`\`\``
    },
    testCases: [
      { input: '[1,2,3], double, setup_logging, 2', expected: '[2,4,6]' }
    ],
  },

  // ==================== GROUP 6: Patterns (10 exercises) ====================
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-thread-safe-singleton',
    title: 'Thread-Safe Singleton',
    description: 'Implement thread-safe singleton pattern',
    targetComplexity: { time: 'O(1)', space: 'O(1)' },
    instruction: `# Thread-Safe Singleton

Implement a singleton that's safe to access from multiple threads.

## Requirements
Create \`Singleton\` class:
- Only one instance ever created
- Thread-safe: concurrent access doesn't create multiple instances
- \`get_instance()\` class method returns the single instance`,
    starterCode: `import threading

class Singleton:
    _instance = None
    _lock = threading.Lock()

    @classmethod
    def get_instance(cls):
        pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Check if instance exists, if not, acquire lock and create' },
      { afterAttempt: 2, text: 'Use double-checked locking: check, lock, check again, create' }
    ],
    solution: {
      afterAttempt: 3,
      text: `\`\`\`python
import threading

class Singleton:
    _instance = None
    _lock = threading.Lock()

    @classmethod
    def get_instance(cls):
        if cls._instance is None:  # First check (no lock)
            with cls._lock:
                if cls._instance is None:  # Second check (with lock)
                    cls._instance = cls()
        return cls._instance
\`\`\``
    },
    testCases: [
      { input: 'Singleton.get_instance() is Singleton.get_instance()', expected: 'True' }
    ],
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-thread-safe-cache',
    title: 'Thread-Safe Cache',
    description: 'Implement a thread-safe LRU cache',
    targetComplexity: { time: 'O(1)', space: 'O(n)' },
    instruction: `# Thread-Safe Cache

Create a thread-safe cache with max size.

## Requirements
Create \`ThreadSafeCache\` class:
- \`__init__(maxsize)\`: Max items to store
- \`get(key)\`: Get value, return None if not found
- \`set(key, value)\`: Set value, evict oldest if full
- Thread-safe for concurrent access`,
    starterCode: `import threading
from collections import OrderedDict

class ThreadSafeCache:
    def __init__(self, maxsize):
        pass

    def get(self, key):
        pass

    def set(self, key, value):
        pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Use OrderedDict for LRU behavior. move_to_end() on get, popitem(last=False) to evict.' },
      { afterAttempt: 2, text: 'Protect all operations with a lock' }
    ],
    solution: {
      afterAttempt: 3,
      text: `\`\`\`python
import threading
from collections import OrderedDict

class ThreadSafeCache:
    def __init__(self, maxsize):
        self._cache = OrderedDict()
        self._maxsize = maxsize
        self._lock = threading.Lock()

    def get(self, key):
        with self._lock:
            if key in self._cache:
                self._cache.move_to_end(key)
                return self._cache[key]
            return None

    def set(self, key, value):
        with self._lock:
            if key in self._cache:
                self._cache.move_to_end(key)
            self._cache[key] = value
            if len(self._cache) > self._maxsize:
                self._cache.popitem(last=False)
\`\`\``
    },
    testCases: [
      { input: 'c = ThreadSafeCache(2); c.set("a",1); c.get("a")', expected: '1' }
    ],
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-periodic-task',
    title: 'Periodic Task Runner',
    description: 'Run a task repeatedly at fixed intervals',
    targetComplexity: { time: 'O(1)', space: 'O(1)' },
    instruction: `# Periodic Task Runner

Run a task at regular intervals.

## Requirements
Create \`PeriodicRunner\` class:
- \`__init__(interval, func)\`: Run func every interval seconds
- \`start()\`: Begin periodic execution
- \`stop()\`: Stop execution`,
    starterCode: `import threading
import time

class PeriodicRunner:
    def __init__(self, interval, func):
        pass

    def start(self):
        pass

    def stop(self):
        pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Use a daemon thread that loops: run func, sleep interval' },
      { afterAttempt: 2, text: 'Use an Event to signal stop' }
    ],
    solution: {
      afterAttempt: 3,
      text: `\`\`\`python
import threading
import time

class PeriodicRunner:
    def __init__(self, interval, func):
        self._interval = interval
        self._func = func
        self._stop_event = threading.Event()
        self._thread = None

    def _run(self):
        while not self._stop_event.is_set():
            self._func()
            self._stop_event.wait(self._interval)

    def start(self):
        self._stop_event.clear()
        self._thread = threading.Thread(target=self._run, daemon=True)
        self._thread.start()

    def stop(self):
        self._stop_event.set()
        if self._thread:
            self._thread.join()
\`\`\``
    },
    testCases: [
      { input: 'pr = PeriodicRunner(1, task); pr.start(); pr.stop()', expected: 'runs periodically' }
    ],
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-future-promise',
    title: 'Simple Promise',
    description: 'Implement a promise/future pattern',
    targetComplexity: { time: 'O(1)', space: 'O(1)' },
    instruction: `# Simple Promise

Create a promise that can be fulfilled later.

## Requirements
Create \`Promise\` class:
- \`get()\`: Block until result is available, return result
- \`set(value)\`: Set the result, unblock waiters
- \`is_ready()\`: Return True if result is set`,
    starterCode: `import threading

class Promise:
    def __init__(self):
        pass

    def get(self):
        pass

    def set(self, value):
        pass

    def is_ready(self):
        pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Use Event for signaling and store value in instance variable' },
      { afterAttempt: 2, text: 'get() waits on event, set() stores value and sets event' }
    ],
    solution: {
      afterAttempt: 3,
      text: `\`\`\`python
import threading

class Promise:
    def __init__(self):
        self._value = None
        self._event = threading.Event()

    def get(self):
        self._event.wait()
        return self._value

    def set(self, value):
        self._value = value
        self._event.set()

    def is_ready(self):
        return self._event.is_set()
\`\`\``
    },
    testCases: [
      { input: 'p = Promise(); p.set(42); p.get()', expected: '42' }
    ],
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-work-stealing',
    title: 'Work Stealing Queue',
    description: 'Implement a basic work stealing pattern',
    targetComplexity: { time: 'O(1)', space: 'O(n)' },
    instruction: `# Work Stealing Queue

Workers can steal work from other workers when idle.

## Requirements
Create \`WorkStealingQueue\` class:
- Each worker has its own queue
- \`push(worker_id, task)\`: Add task to worker's queue
- \`pop(worker_id)\`: Get task from own queue
- \`steal(from_worker_id)\`: Steal from another worker's queue`,
    starterCode: `import threading

class WorkStealingQueue:
    def __init__(self, num_workers):
        pass

    def push(self, worker_id, task):
        pass

    def pop(self, worker_id):
        pass

    def steal(self, from_worker_id):
        pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Use a list of deques, one per worker. Each needs its own lock.' },
      { afterAttempt: 2, text: 'pop() from right (LIFO for owner), steal() from left (FIFO for thief)' }
    ],
    solution: {
      afterAttempt: 3,
      text: `\`\`\`python
import threading
from collections import deque

class WorkStealingQueue:
    def __init__(self, num_workers):
        self._queues = [deque() for _ in range(num_workers)]
        self._locks = [threading.Lock() for _ in range(num_workers)]

    def push(self, worker_id, task):
        with self._locks[worker_id]:
            self._queues[worker_id].append(task)

    def pop(self, worker_id):
        with self._locks[worker_id]:
            if self._queues[worker_id]:
                return self._queues[worker_id].pop()  # LIFO
            return None

    def steal(self, from_worker_id):
        with self._locks[from_worker_id]:
            if self._queues[from_worker_id]:
                return self._queues[from_worker_id].popleft()  # FIFO
            return None
\`\`\``
    },
    testCases: [
      { input: 'wsq = WorkStealingQueue(2); wsq.push(0, task); wsq.steal(0)', expected: 'task' }
    ],
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-publish-subscribe',
    title: 'Publish-Subscribe Pattern',
    description: 'Implement thread-safe pub/sub',
    targetComplexity: { time: 'O(n)', space: 'O(n)' },
    instruction: `# Publish-Subscribe Pattern

Thread-safe publish-subscribe messaging.

## Requirements
Create \`PubSub\` class:
- \`subscribe(topic, callback)\`: Register callback for topic
- \`unsubscribe(topic, callback)\`: Remove callback
- \`publish(topic, message)\`: Call all callbacks for topic`,
    starterCode: `import threading
from collections import defaultdict

class PubSub:
    def __init__(self):
        pass

    def subscribe(self, topic, callback):
        pass

    def unsubscribe(self, topic, callback):
        pass

    def publish(self, topic, message):
        pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Use defaultdict(set) for topic -> callbacks mapping' },
      { afterAttempt: 2, text: 'Protect all operations with a lock. Copy callbacks before calling to avoid holding lock during callbacks.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `\`\`\`python
import threading
from collections import defaultdict

class PubSub:
    def __init__(self):
        self._subscribers = defaultdict(set)
        self._lock = threading.Lock()

    def subscribe(self, topic, callback):
        with self._lock:
            self._subscribers[topic].add(callback)

    def unsubscribe(self, topic, callback):
        with self._lock:
            self._subscribers[topic].discard(callback)

    def publish(self, topic, message):
        with self._lock:
            callbacks = list(self._subscribers[topic])
        for callback in callbacks:
            callback(message)
\`\`\``
    },
    testCases: [
      { input: 'ps = PubSub(); ps.subscribe("t", print); ps.publish("t", "hi")', expected: 'prints "hi"' }
    ],
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-actor-pattern',
    title: 'Simple Actor',
    description: 'Implement actor pattern with message queue',
    targetComplexity: { time: 'O(1)', space: 'O(n)' },
    instruction: `# Simple Actor

An actor processes messages from its mailbox in a single thread.

## Requirements
Create \`Actor\` class:
- \`__init__(handler)\`: handler(message) processes each message
- \`send(message)\`: Add message to mailbox
- \`start()\`: Begin processing messages
- \`stop()\`: Stop processing`,
    starterCode: `import threading
import queue

class Actor:
    def __init__(self, handler):
        pass

    def send(self, message):
        pass

    def start(self):
        pass

    def stop(self):
        pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Use queue.Queue for mailbox. Thread loops getting messages and calling handler.' },
      { afterAttempt: 2, text: 'Use None or special message to signal stop' }
    ],
    solution: {
      afterAttempt: 3,
      text: `\`\`\`python
import threading
import queue

class Actor:
    def __init__(self, handler):
        self._handler = handler
        self._mailbox = queue.Queue()
        self._thread = None
        self._running = False

    def send(self, message):
        self._mailbox.put(message)

    def _run(self):
        while self._running:
            try:
                message = self._mailbox.get(timeout=0.1)
                if message is None:
                    break
                self._handler(message)
            except queue.Empty:
                continue

    def start(self):
        self._running = True
        self._thread = threading.Thread(target=self._run, daemon=True)
        self._thread.start()

    def stop(self):
        self._running = False
        self._mailbox.put(None)
        if self._thread:
            self._thread.join()
\`\`\``
    },
    testCases: [
      { input: 'a = Actor(print); a.start(); a.send("hi"); a.stop()', expected: 'prints "hi"' }
    ],
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-thread-pool-custom',
    title: 'Custom Thread Pool',
    description: 'Implement a simple thread pool from scratch',
    targetComplexity: { time: 'O(n)', space: 'O(n)' },
    instruction: `# Custom Thread Pool

Implement a basic thread pool (before using ThreadPoolExecutor).

## Requirements
Create \`ThreadPool\` class:
- \`__init__(num_threads)\`: Create pool with num_threads workers
- \`submit(func, *args)\`: Submit task, return Future-like object
- \`shutdown()\`: Stop all workers

This is for learning; use ThreadPoolExecutor in real code.`,
    starterCode: `import threading
import queue

class ThreadPool:
    def __init__(self, num_threads):
        pass

    def submit(self, func, *args):
        pass

    def shutdown(self):
        pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Workers loop: get task from shared queue, execute, store result' },
      { afterAttempt: 2, text: 'submit() puts (func, args, result_holder) on queue. Workers set result_holder.result.' }
    ],
    solution: {
      afterAttempt: 3,
      text: `\`\`\`python
import threading
import queue

class Future:
    def __init__(self):
        self._result = None
        self._exception = None
        self._event = threading.Event()

    def set_result(self, result):
        self._result = result
        self._event.set()

    def set_exception(self, exc):
        self._exception = exc
        self._event.set()

    def result(self):
        self._event.wait()
        if self._exception:
            raise self._exception
        return self._result

class ThreadPool:
    def __init__(self, num_threads):
        self._queue = queue.Queue()
        self._threads = []
        self._shutdown = False

        for _ in range(num_threads):
            t = threading.Thread(target=self._worker, daemon=True)
            t.start()
            self._threads.append(t)

    def _worker(self):
        while True:
            task = self._queue.get()
            if task is None:
                break
            func, args, future = task
            try:
                result = func(*args)
                future.set_result(result)
            except Exception as e:
                future.set_exception(e)

    def submit(self, func, *args):
        future = Future()
        self._queue.put((func, args, future))
        return future

    def shutdown(self):
        for _ in self._threads:
            self._queue.put(None)
        for t in self._threads:
            t.join()
\`\`\``
    },
    testCases: [
      { input: 'pool = ThreadPool(2); f = pool.submit(lambda: 42); f.result()', expected: '42' }
    ],
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-debounce',
    title: 'Thread-Safe Debounce',
    description: 'Delay execution until calls stop',
    targetComplexity: { time: 'O(1)', space: 'O(1)' },
    instruction: `# Thread-Safe Debounce

Only execute after a pause in calls.

## Requirements
Create \`Debouncer\` class:
- \`__init__(wait, func)\`: Wait 'wait' seconds of silence before calling func
- \`call(*args)\`: Request a call to func with args
- If called again before wait expires, reset timer`,
    starterCode: `import threading

class Debouncer:
    def __init__(self, wait, func):
        pass

    def call(self, *args):
        pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Use Timer. Cancel previous timer on each call, start new one.' },
      { afterAttempt: 2, text: 'Store timer and use lock to safely cancel and create' }
    ],
    solution: {
      afterAttempt: 3,
      text: `\`\`\`python
import threading

class Debouncer:
    def __init__(self, wait, func):
        self._wait = wait
        self._func = func
        self._timer = None
        self._lock = threading.Lock()

    def call(self, *args):
        with self._lock:
            if self._timer:
                self._timer.cancel()
            self._timer = threading.Timer(
                self._wait,
                lambda: self._func(*args)
            )
            self._timer.start()
\`\`\``
    },
    testCases: [
      { input: 'd = Debouncer(0.5, print); d.call("a"); d.call("b")', expected: 'only prints "b"' }
    ],
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-throttle',
    title: 'Thread-Safe Throttle',
    description: 'Limit execution rate',
    targetComplexity: { time: 'O(1)', space: 'O(1)' },
    instruction: `# Thread-Safe Throttle

Execute at most once per interval.

## Requirements
Create \`Throttler\` class:
- \`__init__(interval, func)\`: At most one call per interval seconds
- \`call(*args)\`: Call func if interval has passed, otherwise skip
- Return True if called, False if throttled`,
    starterCode: `import threading
import time

class Throttler:
    def __init__(self, interval, func):
        pass

    def call(self, *args):
        pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Track last call time. Only call if time since last call >= interval.' },
      { afterAttempt: 2, text: 'Use lock to protect check-and-update of last call time' }
    ],
    solution: {
      afterAttempt: 3,
      text: `\`\`\`python
import threading
import time

class Throttler:
    def __init__(self, interval, func):
        self._interval = interval
        self._func = func
        self._last_call = 0
        self._lock = threading.Lock()

    def call(self, *args):
        with self._lock:
            now = time.time()
            if now - self._last_call >= self._interval:
                self._last_call = now
                self._func(*args)
                return True
            return False
\`\`\``
    },
    testCases: [
      { input: 't = Throttler(1, print); t.call("a"); t.call("b")', expected: 'first True, second False' }
    ],
  },

  // ==================== GROUP 7: Token Bucket Rate Limiting (10 exercises) ====================
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-token-bucket-basic',
    title: 'Basic Token Bucket',
    description: 'Implement a simple token bucket rate limiter',
    targetComplexity: { time: 'O(1)', space: 'O(1)' },
    instruction: `# Basic Token Bucket

Implement a token bucket that allows controlled consumption of tokens.

## Requirements
Create \`TokenBucket\` class:
- \`__init__(capacity, refill_rate)\`: capacity = max tokens, refill_rate = tokens per second
- \`consume(tokens=1)\`: Try to consume tokens, return True if allowed, False otherwise
- Tokens refill over time based on refill_rate

## Example
\`\`\`
bucket = TokenBucket(10, 2)  # 10 capacity, 2 tokens/sec
bucket.consume(5)  # True (5 tokens used, 5 remain)
bucket.consume(6)  # False (only 5 tokens available)
\`\`\``,
    starterCode: `import threading
import time

class TokenBucket:
    def __init__(self, capacity: int, refill_rate: float):
        pass

    def consume(self, tokens: int = 1) -> bool:
        pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Track current tokens and last refill time' },
      { afterAttempt: 2, text: 'On each consume, first refill tokens based on elapsed time: tokens = min(capacity, tokens + elapsed * refill_rate)' }
    ],
    solution: {
      afterAttempt: 3,
      text: `\`\`\`python
import threading
import time

class TokenBucket:
    def __init__(self, capacity: int, refill_rate: float):
        self.capacity = capacity
        self.refill_rate = refill_rate
        self.tokens = capacity
        self.last_refill = time.time()
        self.lock = threading.Lock()

    def consume(self, tokens: int = 1) -> bool:
        with self.lock:
            now = time.time()
            elapsed = now - self.last_refill
            self.tokens = min(self.capacity, self.tokens + elapsed * self.refill_rate)
            self.last_refill = now

            if self.tokens >= tokens:
                self.tokens -= tokens
                return True
            return False
\`\`\``
    },
    testCases: [
      { input: 'b = TokenBucket(10, 2); [b.consume(5), b.consume(6)]', expected: '[True, False]' }
    ],
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-token-bucket-get-tokens',
    title: 'Token Bucket Get Available',
    description: 'Add method to check available tokens without consuming',
    targetComplexity: { time: 'O(1)', space: 'O(1)' },
    instruction: `# Token Bucket Get Available

Extend the token bucket with a method to check available tokens.

## Requirements
Create \`TokenBucket\` class with:
- \`__init__(capacity, refill_rate)\`: Initialize bucket
- \`get_available()\`: Return current available tokens (after refill calculation)
- \`consume(tokens)\`: Standard consume method

## Example
\`\`\`
bucket = TokenBucket(10, 2)
bucket.consume(3)
print(bucket.get_available())  # 7
time.sleep(1)  # After 1 second, 2 tokens refill
print(bucket.get_available())  # 9
\`\`\``,
    starterCode: `import threading
import time

class TokenBucket:
    def __init__(self, capacity: int, refill_rate: float):
        pass

    def _refill(self):
        pass

    def get_available(self) -> float:
        pass

    def consume(self, tokens: int = 1) -> bool:
        pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Create a shared _refill() method to update tokens based on elapsed time' },
      { afterAttempt: 2, text: 'get_available() should call _refill() and return current tokens' }
    ],
    solution: {
      afterAttempt: 3,
      text: `\`\`\`python
import threading
import time

class TokenBucket:
    def __init__(self, capacity: int, refill_rate: float):
        self.capacity = capacity
        self.refill_rate = refill_rate
        self.tokens = capacity
        self.last_refill = time.time()
        self.lock = threading.Lock()

    def _refill(self):
        now = time.time()
        elapsed = now - self.last_refill
        self.tokens = min(self.capacity, self.tokens + elapsed * self.refill_rate)
        self.last_refill = now

    def get_available(self) -> float:
        with self.lock:
            self._refill()
            return self.tokens

    def consume(self, tokens: int = 1) -> bool:
        with self.lock:
            self._refill()
            if self.tokens >= tokens:
                self.tokens -= tokens
                return True
            return False
\`\`\``
    },
    testCases: [
      { input: 'b = TokenBucket(10, 2); b.consume(3); b.get_available()', expected: '7.0' }
    ],
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-token-bucket-wait',
    title: 'Token Bucket with Wait',
    description: 'Implement blocking consume that waits for tokens',
    targetComplexity: { time: 'O(1)', space: 'O(1)' },
    instruction: `# Token Bucket with Wait

Add a blocking consume method that waits for tokens if not available.

## Requirements
Create \`TokenBucket\` class with:
- \`consume(tokens)\`: Non-blocking, returns True/False
- \`consume_blocking(tokens, timeout=None)\`: Wait up to timeout seconds for tokens
  - Returns True if tokens acquired, False if timeout reached
  - If timeout is None, wait indefinitely

## Example
\`\`\`
bucket = TokenBucket(5, 1)  # 5 capacity, 1 token/sec
bucket.consume(5)  # Empty the bucket
bucket.consume_blocking(3, timeout=5)  # Waits ~3 seconds, returns True
\`\`\``,
    starterCode: `import threading
import time

class TokenBucket:
    def __init__(self, capacity: int, refill_rate: float):
        pass

    def consume(self, tokens: int = 1) -> bool:
        pass

    def consume_blocking(self, tokens: int = 1, timeout: float = None) -> bool:
        pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Use a Condition variable to wait and notify when tokens might be available' },
      { afterAttempt: 2, text: 'Calculate wait time as (tokens_needed - available) / refill_rate, use Condition.wait(timeout)' }
    ],
    solution: {
      afterAttempt: 3,
      text: `\`\`\`python
import threading
import time

class TokenBucket:
    def __init__(self, capacity: int, refill_rate: float):
        self.capacity = capacity
        self.refill_rate = refill_rate
        self.tokens = capacity
        self.last_refill = time.time()
        self.lock = threading.Lock()
        self.condition = threading.Condition(self.lock)

    def _refill(self):
        now = time.time()
        elapsed = now - self.last_refill
        self.tokens = min(self.capacity, self.tokens + elapsed * self.refill_rate)
        self.last_refill = now

    def consume(self, tokens: int = 1) -> bool:
        with self.lock:
            self._refill()
            if self.tokens >= tokens:
                self.tokens -= tokens
                return True
            return False

    def consume_blocking(self, tokens: int = 1, timeout: float = None) -> bool:
        deadline = time.time() + timeout if timeout else None
        with self.condition:
            while True:
                self._refill()
                if self.tokens >= tokens:
                    self.tokens -= tokens
                    return True
                if deadline:
                    remaining = deadline - time.time()
                    if remaining <= 0:
                        return False
                    wait_time = min(remaining, (tokens - self.tokens) / self.refill_rate)
                else:
                    wait_time = (tokens - self.tokens) / self.refill_rate
                self.condition.wait(wait_time)
\`\`\``
    },
    testCases: [
      { input: 'b = TokenBucket(5, 10); b.consume(5); b.consume_blocking(2, 1)', expected: 'True' }
    ],
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-token-bucket-per-key',
    title: 'Per-Key Token Bucket',
    description: 'Implement rate limiting per user/key',
    targetComplexity: { time: 'O(1)', space: 'O(n)' },
    instruction: `# Per-Key Token Bucket

Implement rate limiting where each key (user/IP) has its own bucket.

## Requirements
Create \`RateLimiter\` class:
- \`__init__(capacity, refill_rate)\`: Default bucket settings
- \`allow(key, tokens=1)\`: Check if key can consume tokens
- Each unique key gets its own token bucket

## Example
\`\`\`
limiter = RateLimiter(10, 1)  # 10 tokens, 1/sec per user
limiter.allow("user1", 5)  # True
limiter.allow("user2", 5)  # True (different user)
limiter.allow("user1", 6)  # False (user1 only has 5 left)
\`\`\``,
    starterCode: `import threading
import time
from collections import defaultdict

class RateLimiter:
    def __init__(self, capacity: int, refill_rate: float):
        pass

    def allow(self, key: str, tokens: int = 1) -> bool:
        pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Use a dictionary to store (tokens, last_refill) per key' },
      { afterAttempt: 2, text: 'Create bucket on first access with full capacity' }
    ],
    solution: {
      afterAttempt: 3,
      text: `\`\`\`python
import threading
import time
from collections import defaultdict

class RateLimiter:
    def __init__(self, capacity: int, refill_rate: float):
        self.capacity = capacity
        self.refill_rate = refill_rate
        self.buckets = {}  # key -> (tokens, last_refill)
        self.lock = threading.Lock()

    def allow(self, key: str, tokens: int = 1) -> bool:
        with self.lock:
            now = time.time()

            if key not in self.buckets:
                self.buckets[key] = [self.capacity, now]

            bucket = self.buckets[key]
            elapsed = now - bucket[1]
            bucket[0] = min(self.capacity, bucket[0] + elapsed * self.refill_rate)
            bucket[1] = now

            if bucket[0] >= tokens:
                bucket[0] -= tokens
                return True
            return False
\`\`\``
    },
    testCases: [
      { input: 'r = RateLimiter(10, 1); [r.allow("a", 5), r.allow("b", 5), r.allow("a", 6)]', expected: '[True, True, False]' }
    ],
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-token-bucket-burst',
    title: 'Token Bucket with Burst',
    description: 'Implement bucket with separate burst and sustained rate',
    targetComplexity: { time: 'O(1)', space: 'O(1)' },
    instruction: `# Token Bucket with Burst

Implement a bucket that allows bursts above the sustained rate.

## Requirements
Create \`BurstBucket\` class:
- \`__init__(burst_capacity, sustained_rate)\`:
  - burst_capacity: Maximum tokens for burst
  - sustained_rate: Tokens added per second
- \`consume(tokens=1)\`: Standard consume
- \`get_capacity()\`: Return burst capacity
- \`get_rate()\`: Return sustained rate

## Example
\`\`\`
bucket = BurstBucket(100, 10)  # 100 burst, 10/sec sustained
bucket.consume(50)  # True (burst)
# After 5 seconds, refills 50 tokens
\`\`\``,
    starterCode: `import threading
import time

class BurstBucket:
    def __init__(self, burst_capacity: int, sustained_rate: float):
        pass

    def consume(self, tokens: int = 1) -> bool:
        pass

    def get_capacity(self) -> int:
        pass

    def get_rate(self) -> float:
        pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'This is a standard token bucket where capacity=burst_capacity and refill_rate=sustained_rate' },
      { afterAttempt: 2, text: 'The "burst" terminology means the initial/max capacity allows burst traffic' }
    ],
    solution: {
      afterAttempt: 3,
      text: `\`\`\`python
import threading
import time

class BurstBucket:
    def __init__(self, burst_capacity: int, sustained_rate: float):
        self.capacity = burst_capacity
        self.rate = sustained_rate
        self.tokens = burst_capacity
        self.last_refill = time.time()
        self.lock = threading.Lock()

    def _refill(self):
        now = time.time()
        elapsed = now - self.last_refill
        self.tokens = min(self.capacity, self.tokens + elapsed * self.rate)
        self.last_refill = now

    def consume(self, tokens: int = 1) -> bool:
        with self.lock:
            self._refill()
            if self.tokens >= tokens:
                self.tokens -= tokens
                return True
            return False

    def get_capacity(self) -> int:
        return self.capacity

    def get_rate(self) -> float:
        return self.rate
\`\`\``
    },
    testCases: [
      { input: 'b = BurstBucket(100, 10); [b.consume(50), b.get_capacity(), b.get_rate()]', expected: '[True, 100, 10]' }
    ],
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-token-bucket-decorator',
    title: 'Rate Limit Decorator',
    description: 'Create a decorator for rate limiting functions',
    targetComplexity: { time: 'O(1)', space: 'O(1)' },
    instruction: `# Rate Limit Decorator

Create a decorator that rate limits function calls.

## Requirements
Create \`rate_limit(calls_per_second)\` decorator:
- Limits function to specified calls per second
- Blocks if rate limit exceeded (wait for tokens)
- Thread-safe for concurrent calls

## Example
\`\`\`python
@rate_limit(2)  # 2 calls per second max
def api_call(msg):
    print(msg)
    return True

# These 4 calls will take ~1.5 seconds total
api_call("a")  # immediate
api_call("b")  # immediate
api_call("c")  # waits ~0.5s
api_call("d")  # waits ~0.5s
\`\`\``,
    starterCode: `import threading
import time
from functools import wraps

def rate_limit(calls_per_second: float):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            pass
        return wrapper
    return decorator`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Create a token bucket inside the decorator closure with capacity=1 and refill_rate=calls_per_second' },
      { afterAttempt: 2, text: 'Before calling the function, wait until a token is available' }
    ],
    solution: {
      afterAttempt: 3,
      text: `\`\`\`python
import threading
import time
from functools import wraps

def rate_limit(calls_per_second: float):
    def decorator(func):
        lock = threading.Lock()
        tokens = 1.0
        last_refill = time.time()

        @wraps(func)
        def wrapper(*args, **kwargs):
            nonlocal tokens, last_refill
            while True:
                with lock:
                    now = time.time()
                    elapsed = now - last_refill
                    tokens = min(1.0, tokens + elapsed * calls_per_second)
                    last_refill = now

                    if tokens >= 1:
                        tokens -= 1
                        break

                time.sleep(0.01)  # Small sleep before retry

            return func(*args, **kwargs)
        return wrapper
    return decorator
\`\`\``
    },
    testCases: [
      { input: '@rate_limit(10)\\ndef f(): return True\\n[f() for _ in range(3)]', expected: '[True, True, True]' }
    ],
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-token-bucket-sliding-log',
    title: 'Sliding Window Log Rate Limiter',
    description: 'Implement rate limiting using sliding window log algorithm',
    targetComplexity: { time: 'O(n)', space: 'O(n)' },
    instruction: `# Sliding Window Log Rate Limiter

Implement rate limiting using timestamps instead of tokens.

## Requirements
Create \`SlidingWindowLog\` class:
- \`__init__(max_requests, window_seconds)\`: Allow max_requests per window
- \`allow()\`: Return True if request allowed, False otherwise
- Track request timestamps, remove expired ones

## Example
\`\`\`
limiter = SlidingWindowLog(3, 1.0)  # 3 requests per second
limiter.allow()  # True (1st request)
limiter.allow()  # True (2nd request)
limiter.allow()  # True (3rd request)
limiter.allow()  # False (limit reached)
time.sleep(1)
limiter.allow()  # True (window slid)
\`\`\``,
    starterCode: `import threading
import time
from collections import deque

class SlidingWindowLog:
    def __init__(self, max_requests: int, window_seconds: float):
        pass

    def allow(self) -> bool:
        pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Use a deque to store timestamps of recent requests' },
      { afterAttempt: 2, text: 'Remove timestamps older than (now - window_seconds) before checking count' }
    ],
    solution: {
      afterAttempt: 3,
      text: `\`\`\`python
import threading
import time
from collections import deque

class SlidingWindowLog:
    def __init__(self, max_requests: int, window_seconds: float):
        self.max_requests = max_requests
        self.window = window_seconds
        self.timestamps = deque()
        self.lock = threading.Lock()

    def allow(self) -> bool:
        with self.lock:
            now = time.time()
            cutoff = now - self.window

            # Remove expired timestamps
            while self.timestamps and self.timestamps[0] < cutoff:
                self.timestamps.popleft()

            if len(self.timestamps) < self.max_requests:
                self.timestamps.append(now)
                return True
            return False
\`\`\``
    },
    testCases: [
      { input: 's = SlidingWindowLog(2, 1); [s.allow(), s.allow(), s.allow()]', expected: '[True, True, False]' }
    ],
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-token-bucket-leaky',
    title: 'Leaky Bucket',
    description: 'Implement leaky bucket algorithm',
    targetComplexity: { time: 'O(1)', space: 'O(1)' },
    instruction: `# Leaky Bucket

Implement the leaky bucket algorithm (similar to token bucket but for output rate).

## Requirements
Create \`LeakyBucket\` class:
- \`__init__(capacity, leak_rate)\`: capacity=queue size, leak_rate=items/sec
- \`add()\`: Add item to bucket, return True if added, False if full
- \`get_level()\`: Return current fill level

The bucket "leaks" at a constant rate (items are processed).

## Example
\`\`\`
bucket = LeakyBucket(10, 2)  # holds 10, leaks 2/sec
bucket.add()  # True, level=1
bucket.add()  # True, level=2
time.sleep(1)  # 2 items leaked
bucket.get_level()  # ~0
\`\`\``,
    starterCode: `import threading
import time

class LeakyBucket:
    def __init__(self, capacity: int, leak_rate: float):
        pass

    def add(self) -> bool:
        pass

    def get_level(self) -> float:
        pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Track water level instead of tokens. Level decreases over time.' },
      { afterAttempt: 2, text: 'On each operation: level = max(0, level - elapsed * leak_rate)' }
    ],
    solution: {
      afterAttempt: 3,
      text: `\`\`\`python
import threading
import time

class LeakyBucket:
    def __init__(self, capacity: int, leak_rate: float):
        self.capacity = capacity
        self.leak_rate = leak_rate
        self.level = 0
        self.last_leak = time.time()
        self.lock = threading.Lock()

    def _leak(self):
        now = time.time()
        elapsed = now - self.last_leak
        self.level = max(0, self.level - elapsed * self.leak_rate)
        self.last_leak = now

    def add(self) -> bool:
        with self.lock:
            self._leak()
            if self.level < self.capacity:
                self.level += 1
                return True
            return False

    def get_level(self) -> float:
        with self.lock:
            self._leak()
            return self.level
\`\`\``
    },
    testCases: [
      { input: 'b = LeakyBucket(10, 100); b.add(); b.add(); b.get_level()', expected: '~0 (leaked quickly)' }
    ],
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-token-bucket-distributed',
    title: 'Distributed Rate Limiter (Simulated)',
    description: 'Simulate distributed rate limiting with local approximation',
    targetComplexity: { time: 'O(1)', space: 'O(1)' },
    instruction: `# Distributed Rate Limiter (Simulated)

Simulate a distributed rate limiter that tracks global rate across instances.

## Requirements
Create \`DistributedLimiter\` class:
- \`__init__(global_limit, num_instances)\`: Total limit split across instances
- \`allow_local()\`: Check if this instance can allow request
- \`get_local_limit()\`: Return this instance's share of limit

Each instance gets global_limit / num_instances of the total rate.

## Example
\`\`\`
# 100 requests/sec globally, 4 instances
limiter = DistributedLimiter(100, 4)
limiter.get_local_limit()  # 25 (100/4)
limiter.allow_local()  # True (up to 25/sec)
\`\`\``,
    starterCode: `import threading
import time

class DistributedLimiter:
    def __init__(self, global_limit: int, num_instances: int):
        pass

    def allow_local(self) -> bool:
        pass

    def get_local_limit(self) -> float:
        pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Calculate local limit as global_limit / num_instances' },
      { afterAttempt: 2, text: 'Use a token bucket with capacity=1 and refill_rate=local_limit' }
    ],
    solution: {
      afterAttempt: 3,
      text: `\`\`\`python
import threading
import time

class DistributedLimiter:
    def __init__(self, global_limit: int, num_instances: int):
        self.local_limit = global_limit / num_instances
        self.tokens = 1.0
        self.last_refill = time.time()
        self.lock = threading.Lock()

    def allow_local(self) -> bool:
        with self.lock:
            now = time.time()
            elapsed = now - self.last_refill
            self.tokens = min(1.0, self.tokens + elapsed * self.local_limit)
            self.last_refill = now

            if self.tokens >= 1:
                self.tokens -= 1
                return True
            return False

    def get_local_limit(self) -> float:
        return self.local_limit
\`\`\``
    },
    testCases: [
      { input: 'd = DistributedLimiter(100, 4); d.get_local_limit()', expected: '25.0' }
    ],
  },
  {
    type: 'exercise',
    placement: 'module',
    id: 'exercise-token-bucket-api-limiter',
    title: 'API Rate Limiter',
    description: 'Complete rate limiter for API endpoints',
    targetComplexity: { time: 'O(1)', space: 'O(n)' },
    instruction: `# API Rate Limiter

Implement a production-style API rate limiter.

## Requirements
Create \`APILimiter\` class:
- \`__init__(requests_per_minute)\`: Set rate limit
- \`check(client_id)\`: Returns (allowed: bool, retry_after: float)
  - allowed: True if request permitted
  - retry_after: Seconds to wait if not allowed (0 if allowed)
- \`get_remaining(client_id)\`: Return remaining requests for client

## Example
\`\`\`
limiter = APILimiter(60)  # 60 req/min = 1 req/sec
allowed, retry = limiter.check("user1")  # (True, 0)
allowed, retry = limiter.check("user1")  # (False, ~1.0)
print(limiter.get_remaining("user1"))  # 0
\`\`\``,
    starterCode: `import threading
import time

class APILimiter:
    def __init__(self, requests_per_minute: int):
        pass

    def check(self, client_id: str) -> tuple:
        pass

    def get_remaining(self, client_id: str) -> int:
        pass`,
    expectedOutput: ``,
    hints: [
      { afterAttempt: 1, text: 'Convert requests_per_minute to requests_per_second for the token bucket' },
      { afterAttempt: 2, text: 'Calculate retry_after as (1 - current_tokens) / refill_rate' }
    ],
    solution: {
      afterAttempt: 3,
      text: `\`\`\`python
import threading
import time

class APILimiter:
    def __init__(self, requests_per_minute: int):
        self.rate = requests_per_minute / 60.0  # per second
        self.capacity = 1.0
        self.clients = {}  # client_id -> (tokens, last_refill)
        self.lock = threading.Lock()

    def _get_or_create_bucket(self, client_id):
        now = time.time()
        if client_id not in self.clients:
            self.clients[client_id] = [self.capacity, now]
        return self.clients[client_id]

    def _refill(self, bucket):
        now = time.time()
        elapsed = now - bucket[1]
        bucket[0] = min(self.capacity, bucket[0] + elapsed * self.rate)
        bucket[1] = now

    def check(self, client_id: str) -> tuple:
        with self.lock:
            bucket = self._get_or_create_bucket(client_id)
            self._refill(bucket)

            if bucket[0] >= 1:
                bucket[0] -= 1
                return (True, 0.0)

            retry_after = (1 - bucket[0]) / self.rate
            return (False, retry_after)

    def get_remaining(self, client_id: str) -> int:
        with self.lock:
            bucket = self._get_or_create_bucket(client_id)
            self._refill(bucket)
            return int(bucket[0])
\`\`\``
    },
    testCases: [
      { input: 'a = APILimiter(60); r1 = a.check("u")[0]; r2 = a.check("u")[0]; [r1, r2]', expected: '[True, False]' }
    ],
  },
];
