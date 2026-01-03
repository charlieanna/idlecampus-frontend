import { ProgressiveLesson } from '../types/progressive-lesson-enhanced';
import { moduleQueueLessonSmartPracticeExercises } from './exercises/moduleQueueLessonSmartPracticeExercises';

export const moduleQueueLesson: ProgressiveLesson = {
  id: 'queue-discovery-fifo',
  title: 'Module: Queue Discovery (FIFO Thinking)',
  description: 'Understand queues, simulate them by hand, master circular queues, and learn the three queue templates used in BFS, sliding windows, and scheduling.',
  unlockMode: 'flexible',
  sections: [
    {
      type: 'reading',
      id: 'queue-fifo-principle',
      title: 'Section 1 · The FIFO Principle',
      estimatedReadTime: 360,
      content: `<h1>First-In-First-Out (FIFO)</h1>

<p>Queues process elements in the <strong>exact order they arrive</strong>: the first element to enter is the first one to leave. Picture the line outside a movie theatre:</p>

<ul>
  <li>Person 1 arrives → stands at the front.</li>
  <li>Person 2 arrives → stands behind Person 1.</li>
  <li>Service always happens at the <strong>front</strong>, while new arrivals join the <strong>back</strong>.</li>
</ul>

<table>
  <thead>
    <tr><th>Operation</th><th>Description</th><th>Complexity</th></tr>
  </thead>
  <tbody>
    <tr><td><code>enqueue(x)</code></td><td>Add <code>x</code> to the <strong>back</strong> of the queue</td><td>O(1)</td></tr>
    <tr><td><code>dequeue()</code></td><td>Remove and return the <strong>front</strong> element</td><td>O(1)</td></tr>
    <tr><td><code>front()</code> / <code>peek()</code></td><td>View, but do not remove, the front element</td><td>O(1)</td></tr>
    <tr><td><code>is_empty()</code></td><td>Do we still have elements waiting?</td><td>O(1)</td></tr>
  </tbody>
</table>

<p>Queues are ideal when <strong>fairness</strong> or <strong>arrival order</strong> matters: customer service, print jobs, traffic lights, OS schedulers, BFS traversals, etc.</p>`,
    },
    {
      type: 'reading',
      id: 'queue-manual-simulator',
      title: 'Section 2 · Manual Queue Simulation',
      estimatedReadTime: 300,
      content: `<h1>Practice Enqueue / Dequeue</h1>

<ol>
  <li>Start with queue <code>[1, 2, 3]</code> (1 is at the front).</li>
  <li>Enqueue 4 → <code>[1, 2, 3, 4]</code></li>
  <li>Enqueue 9 → <code>[1, 2, 3, 4, 9]</code></li>
  <li>Dequeue → remove the <em>front</em> → <code>[2, 3, 4, 9]</code></li>
  <li>Peek → return 2, but leave the queue unchanged</li>
</ol>

<p>Track these values as you simulate:</p>

<ul>
  <li><strong>Size</strong> = number of waiting items</li>
  <li><strong>Front Element</strong> = <code>queue[0]</code> when non-empty, otherwise “Empty”</li>
  <li><strong>Back Element</strong> = last pushed item</li>
</ul>

<h3>Observation</h3>

<p>Queues only change at <strong>two ends</strong>: the back accepts arrivals, the front serves them. Everything between stays ordered, which is why queues power BFS and multi-producer/multi-consumer pipelines.</p>`,
    },
    {
      type: 'reading',
      id: 'queue-circular',
      title: 'Section 3 · Circular Queue (Fixed Buffer)',
      estimatedReadTime: 360,
      content: `<h1>Why Circular Queues?</h1>

<p>Plain array-based queues waste space: once you dequeue, the freed slots at the front stay unused unless you shift everything (O(n)).<br />Circular queues fix that by <strong>wrapping indices with modulo arithmetic</strong>.</p>

<pre><code>class CircularQueue:
    def __init__(self, k):
        self.data = [None] * k
        self.front = 0
        self.back = 0
        self.count = 0

    def enqueue(self, value):
        if self.count == len(self.data):
            raise OverflowError('queue full')
        self.data[self.back] = value
        self.back = (self.back + 1) % len(self.data)
        self.count += 1
</code></pre>

<ul>
  <li><strong>Front pointer</strong> moves forward as we dequeue.</li>
  <li><strong>Back pointer</strong> wraps around when we hit the end.</li>
  <li>Capacity is fixed, but we reuse every cell.</li>
</ul>

<p>Circular queues show up inside caches, thread pools, rate limiters, and networking buffers where a fixed-size ring is cheaper and faster than dynamic structures.</p>`,
    },
    {
      type: 'reading',
      id: 'queue-patterns',
      title: 'Section 4 · Queue Patterns & Templates',
      estimatedReadTime: 420,
      content: `<h1>Queue Patterns & Templates</h1>

<h2>1. Breadth-First Search (BFS)</h2>

<p>A queue guarantees we visit nodes level-by-level (shortest number of edges from the root).</p>

<pre><code>queue = collections.deque([root])
while queue:
    node = queue.popleft()
    process(node)
    for child in node.children:
        queue.append(child)
</code></pre>

<h2>2. Sliding Window Deque</h2>

<p>Maintain a deque of indices to answer “max in window” or “first negative” queries in O(n).</p>

<pre><code>for i, num in enumerate(nums):
    while deque and deque[0] <= i - k:
        deque.popleft()  # out of window
    while deque and nums[deque[-1]] <= num:
        deque.pop()      # maintain decreasing order
    deque.append(i)
    if i >= k - 1:
        answer.append(nums[deque[0]])
</code></pre>

<h2>3. Task / Request Scheduling</h2>

<p>Use a queue to process tasks in the order received; optionally combine with a priority queue when fairness and priority both matter.</p>

<pre><code>queue = collections.deque(tasks)
time = 0
while queue:
    task = queue.popleft()
    execute(task)
    time += task.duration
</code></pre>

<p>Whenever you hear “level order”, “shortest number of steps”, or “process requests fairly”, this table should pop into your head.</p>`,
    },
    {
      type: 'reading',
      id: 'queue-real-world',
      title: 'Section 5 · Real-World Applications & Mindset',
      estimatedReadTime: 300,
      content: `<h1>Where Queues Dominate</h1>

<ul>
  <li><strong>Print job queues</strong>: documents print in submission order.</li>
  <li><strong>Customer support</strong>: tickets, hotline callers, chat queues.</li>
  <li><strong>Traffic systems</strong>: toll booths, traffic lights, airport security.</li>
  <li><strong>Messaging middleware</strong>: Kafka, RabbitMQ, AWS SQS.</li>
  <li><strong>Gaming</strong>: matchmaking queues, turn order in multiplayer fights.</li>
  <li><strong>Web servers</strong>: incoming HTTP requests waiting for worker threads.</li>
</ul>

<h3>Queue Mindset</h3>

<p>Ask:</p>
<ul>
  <li>“Is fairness/order of arrival critical?”</li>
  <li>“Do I need level-by-level exploration?”</li>
  <li>“Are producers and consumers decoupled?”</li>
</ul>

<p>If the answer is yes, model it as a queue.</p>`,
    },
    ...moduleQueueLessonSmartPracticeExercises,
  ],
};

