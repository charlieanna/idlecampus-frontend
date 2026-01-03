# Concept: Race Conditions & Locks

### 1. The Core Concept

A **Race Condition** occurs when two or more threads attempt to change the same shared data at the same time. The final result depends on who "wins the race" to the CPU, leading to unpredictable and buggy behavior.

**The Real World Analogy:**
Imagine a bank account with $100.

1. **Person A** checks balance: "Okay, $100." (Planning to withdraw $100)
2. **Person B** checks balance: "Okay, $100." (Planning to withdraw $100)
3. **Person A** withdraws: Remaining = $0.
4. **Person B** withdraws: Remaining = -$100. (Error!)

Because Person B checked the balance *before* Person A finished updating it, the system failed.

---

### 2. The Buggy Python Code (Don't Do This)

This code attempts to increment a counter 100,000 times using 2 threads. Ideally, the result should be 200,000. **It will fail.**

```python
import threading

class UnsafeCounter:
    def __init__(self):
        self.count = 0

    def increment(self):
        # This looks atomic, but it is NOT.
        # Python splits this into: READ -> ADD -> WRITE
        # Context switch can happen between READ and WRITE.
        self.count += 1 

# Simulation
counter = UnsafeCounter()

def worker():
    for _ in range(100000):
        counter.increment()

t1 = threading.Thread(target=worker)
t2 = threading.Thread(target=worker)

t1.start()
t2.start()
t1.join()
t2.join()

print(f"Final Count: {counter.count}") 
# Likely Output: 145,238 (Instead of 200,000)

```

---

### 3. The Solution: Using a Lock (Mutex)

To fix this, we use a **Lock** (Mutual Exclusion). This forces threads to "wait their turn."

* **Acquire:** "I am entering the room. Lock the door."
* **Release:** "I am leaving. Unlock the door."

In Python, the `threading.Lock()` object handles this.

**The Correct Python Pattern:**
We use the `with` statement (Context Manager). It automatically acquires the lock at the start and **always releases it** at the end, even if your code crashes with an error.

```python
import threading

class SafeCounter:
    def __init__(self):
        self.count = 0
        # 1. Initialize the Lock
        self.lock = threading.Lock()

    def increment(self):
        # 2. Acquire Lock before touching shared data
        with self.lock:
            self.count += 1
        # Lock is automatically released here

# Simulation
counter = SafeCounter()

# ... (Same simulation code as above) ...

print(f"Final Count: {counter.count}") 
# Guaranteed Output: 200,000

```

---

### 4. Advanced: `RLock` (Re-entrant Lock)

Sometimes, a function locks the resource, and then calls *another* function inside the class that *also* tries to lock the resource.

* **Standard `Lock`:** Will freeze (Deadlock) because it's waiting for itself to unlock.
* **`RLock`:** Allows the **same thread** to lock multiple times without blocking.

**When to use:** If you have recursive functions or internal method calls that both need safety.

```python
class RecursiveSafe:
    def __init__(self):
        self.lock = threading.RLock() # Note the 'R'
        self.count = 0

    def add_one(self):
        with self.lock:
            self.count += 1

    def add_two(self):
        with self.lock:
            self.add_one() # This would hang with a normal Lock!
            self.add_one()

```

---

### 5. Mini-Quiz (Check Your Understanding)

**Q: Why do we use `with self.lock:` instead of `self.lock.acquire()`?**

* **A)** It runs faster.
* **B)** It ensures the lock is released even if an exception occurs (prevents Deadlocks).
* **C)** It allows multiple threads to enter at once.

**(Correct Answer: B)**