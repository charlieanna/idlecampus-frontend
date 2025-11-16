/**
 * L4-L5 Internal Systems: Circuit Breaker Library
 *
 * Design a circuit breaker library to prevent cascading failures in distributed systems.
 * Automatically detect failures and temporarily block requests to failing services.
 * Similar to Netflix Hystrix, Resilience4j, or Polly.
 *
 * Real-world examples:
 * - Netflix Hystrix: Circuit breaking for microservices (now in maintenance)
 * - Resilience4j: Lightweight circuit breaker for Java
 * - Polly: .NET resilience library
 * - AWS App Mesh: Built-in circuit breaking
 *
 * Companies: Netflix, Amazon, Microsoft, Uber, Airbnb
 * Level: L4-L5 (Senior/Staff Engineer)
 * Category: Migration & Reliability
 */

import type { SystemDesignChallenge, TestCase} from '../../types';

/**
 * FUNCTIONAL REQUIREMENTS
 *
 * 1. Circuit States
 *    - Closed: Normal operation (allow all requests)
 *    - Open: Failure threshold exceeded (reject all requests, fail fast)
 *    - Half-Open: Testing recovery (allow limited requests)
 *
 * 2. Failure Detection
 *    - Track success/failure rates over sliding window (10 seconds)
 *    - Configurable thresholds (error rate >50%, latency p99 >1s)
 *    - Minimum request volume (10 requests) before opening
 *    - Support multiple failure criteria (errors, timeouts, slow requests)
 *
 * 3. Recovery
 *    - Automatic transition to half-open after timeout (30 seconds)
 *    - Test with limited requests (5 consecutive successes → close)
 *    - Adaptive thresholds based on historical data
 *    - Gradual recovery (don't send all traffic immediately)
 *
 * 4. Isolation
 *    - Per-dependency circuit breakers (separate for each service)
 *    - Thread pool isolation (limit concurrent requests)
 *    - Bulkhead pattern (separate pools for critical vs non-critical)
 *    - Fallback mechanisms (cached data, default values)
 *
 * NON-FUNCTIONAL REQUIREMENTS
 *
 * Performance (NFR-P):
 * - Circuit check overhead: <1ms
 * - State transition: <5ms
 * - Metrics update: <0.1ms (non-blocking)
 * - Support 10,000 RPS per circuit
 *
 * Scalability (NFR-S):
 * - 1,000 circuit breakers per service
 * - 10,000 concurrent requests tracked
 * - 1M circuit state checks/second
 * - Minimal memory overhead (<1MB per circuit)
 *
 * Reliability (NFR-R):
 * - No false positives: >99.9% accuracy
 * - Fast fail: <1ms rejection when circuit open
 * - Thread-safe: support concurrent requests
 * - Persistent metrics (survive restarts)
 *
 * Cost (NFR-C):
 * - Library overhead: <5% latency increase
 * - Memory: <10MB for 1000 circuits
 * - No external dependencies (embedded library)
 */

const pythonTemplate = `"""
Circuit Breaker Library - Reference Implementation

Architecture:
1. CircuitBreaker class (state machine: closed → open → half-open)
2. SlidingWindowMetrics (track success/failure over time)
3. Fallback executor (execute fallback logic)
4. ThreadPoolExecutor (bulkhead isolation)

Key concepts:
- Sliding window: Track metrics over last N seconds
- Exponential moving average: Smooth error rate
- Half-open state: Test recovery with limited requests
- Fallback: Return cached data when circuit open
"""

from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional, Callable
import time
from collections import deque
from threading import Lock
from enum import Enum

class CircuitState(Enum):
    CLOSED = "closed"
    OPEN = "open"
    HALF_OPEN = "half_open"


class CircuitBreaker:
    """
    Circuit breaker with sliding window metrics and automatic recovery.

    States:
    - CLOSED: Normal operation, track metrics
    - OPEN: Failure threshold exceeded, reject requests
    - HALF_OPEN: Test recovery with limited requests
    """

    def __init__(self, name: str, config: dict):
        """
        Args:
            name: Circuit breaker name (e.g., "payment-service")
            config: {
                'failure_threshold': 0.5,  # 50% error rate
                'min_requests': 10,  # Minimum requests before opening
                'timeout_seconds': 30,  # Time in open state before half-open
                'half_open_max_requests': 5,  # Max requests in half-open
                'window_size_seconds': 10,  # Sliding window size
                'slow_call_threshold_ms': 1000  # >1s is slow
            }

        Test cases covered:
        - TC1: Circuit transitions (closed → open → half-open → closed)
        - TC2: Sliding window metrics
        """
        self.name = name
        self.config = config

        self.state = CircuitState.CLOSED
        self.metrics = SlidingWindowMetrics(config['window_size_seconds'])

        self.opened_at: Optional[datetime] = None
        self.half_open_successes = 0
        self.half_open_requests = 0

        self.lock = Lock()

    def call(self, func: Callable, *args, fallback: Callable = None, **kwargs) -> Any:
        """
        Execute function with circuit breaker protection.

        Args:
            func: Function to execute
            fallback: Fallback function if circuit is open
            *args, **kwargs: Arguments for func

        Returns:
            Result of func or fallback

        Test cases covered:
        - TC1: Execute with circuit protection
        - TC3: Fast fail when circuit open (<1ms)
        - TC4: Fallback execution
        """
        # Check if circuit allows request
        if not self._allow_request():
            # Circuit is open, fail fast
            if fallback:
                return fallback(*args, **kwargs)
            raise CircuitBreakerOpenError(f"Circuit {self.name} is OPEN")

        # Execute request
        start_time = time.time()
        success = False
        error = None

        try:
            result = func(*args, **kwargs)
            success = True
            return result

        except Exception as e:
            error = e
            raise

        finally:
            # Record metrics
            duration_ms = (time.time() - start_time) * 1000

            # Check if call was slow
            is_slow = duration_ms > self.config['slow_call_threshold_ms']

            self._record_call(success=success and not is_slow, duration_ms=duration_ms)

    def _allow_request(self) -> bool:
        """Check if circuit allows request based on current state."""
        with self.lock:
            if self.state == CircuitState.CLOSED:
                return True

            elif self.state == CircuitState.OPEN:
                # Check if timeout has passed
                if datetime.now() - self.opened_at > timedelta(seconds=self.config['timeout_seconds']):
                    # Transition to half-open
                    self._transition_to_half_open()
                    return True

                return False  # Still open

            elif self.state == CircuitState.HALF_OPEN:
                # Allow limited requests
                if self.half_open_requests < self.config['half_open_max_requests']:
                    self.half_open_requests += 1
                    return True

                return False  # Too many half-open requests

    def _record_call(self, success: bool, duration_ms: float):
        """Record call outcome and update circuit state."""
        with self.lock:
            # Update metrics
            self.metrics.record(success=success, duration_ms=duration_ms)

            # State transitions
            if self.state == CircuitState.CLOSED:
                self._check_failure_threshold()

            elif self.state == CircuitState.HALF_OPEN:
                if success:
                    self.half_open_successes += 1

                    # Check if we have enough successes to close
                    if self.half_open_successes >= self.config['half_open_max_requests']:
                        self._transition_to_closed()
                else:
                    # Failure in half-open, reopen circuit
                    self._transition_to_open()

    def _check_failure_threshold(self):
        """Check if failure threshold exceeded (transition to open)."""
        total_requests = self.metrics.get_total_requests()

        # Need minimum requests before opening
        if total_requests < self.config['min_requests']:
            return

        error_rate = self.metrics.get_error_rate()

        if error_rate > self.config['failure_threshold']:
            self._transition_to_open()

    def _transition_to_open(self):
        """Transition circuit to OPEN state."""
        self.state = CircuitState.OPEN
        self.opened_at = datetime.now()
        print(f"Circuit {self.name} OPENED (error rate: {self.metrics.get_error_rate():.1%})")

    def _transition_to_half_open(self):
        """Transition circuit to HALF_OPEN state."""
        self.state = CircuitState.HALF_OPEN
        self.half_open_successes = 0
        self.half_open_requests = 0
        print(f"Circuit {self.name} HALF_OPEN (testing recovery)")

    def _transition_to_closed(self):
        """Transition circuit to CLOSED state."""
        self.state = CircuitState.CLOSED
        self.metrics.reset()
        print(f"Circuit {self.name} CLOSED (recovered)")

    def get_state(self) -> dict:
        """
        Get current circuit state and metrics.

        Returns:
            {
                'state': 'closed' | 'open' | 'half_open',
                'error_rate': 0.45,
                'total_requests': 100,
                'failures': 45,
                'avg_latency_ms': 150
            }
        """
        with self.lock:
            return {
                'name': self.name,
                'state': self.state.value,
                'error_rate': self.metrics.get_error_rate(),
                'total_requests': self.metrics.get_total_requests(),
                'failures': self.metrics.get_failure_count(),
                'avg_latency_ms': self.metrics.get_avg_latency(),
                'half_open_successes': self.half_open_successes if self.state == CircuitState.HALF_OPEN else None
            }


class SlidingWindowMetrics:
    """
    Track success/failure metrics over sliding time window.

    Uses circular buffer for efficient O(1) updates.
    """

    def __init__(self, window_size_seconds: int):
        self.window_size = timedelta(seconds=window_size_seconds)
        self.calls: deque = deque()  # (timestamp, success, duration_ms)
        self.lock = Lock()

    def record(self, success: bool, duration_ms: float):
        """Record call outcome."""
        with self.lock:
            self.calls.append((datetime.now(), success, duration_ms))
            self._cleanup_old_calls()

    def _cleanup_old_calls(self):
        """Remove calls outside sliding window."""
        cutoff_time = datetime.now() - self.window_size

        while self.calls and self.calls[0][0] < cutoff_time:
            self.calls.popleft()

    def get_total_requests(self) -> int:
        """Get total requests in window."""
        with self.lock:
            self._cleanup_old_calls()
            return len(self.calls)

    def get_failure_count(self) -> int:
        """Get failure count in window."""
        with self.lock:
            self._cleanup_old_calls()
            return sum(1 for _, success, _ in self.calls if not success)

    def get_error_rate(self) -> float:
        """Get error rate (0.0 to 1.0)."""
        total = self.get_total_requests()
        if total == 0:
            return 0.0

        failures = self.get_failure_count()
        return failures / total

    def get_avg_latency(self) -> float:
        """Get average latency in milliseconds."""
        with self.lock:
            self._cleanup_old_calls()

            if not self.calls:
                return 0.0

            total_latency = sum(duration for _, _, duration in self.calls)
            return total_latency / len(self.calls)

    def reset(self):
        """Reset all metrics."""
        with self.lock:
            self.calls.clear()


class CircuitBreakerOpenError(Exception):
    """Raised when circuit breaker is open."""
    pass


# Decorator for easy circuit breaker usage
def circuit_breaker(name: str, config: dict = None, fallback: Callable = None):
    """
    Decorator to wrap function with circuit breaker.

    Usage:
        @circuit_breaker('payment-service', config={...})
        def call_payment_service():
            return requests.post(...)

    Test cases covered:
    - TC5: Decorator usage
    """
    if config is None:
        config = {
            'failure_threshold': 0.5,
            'min_requests': 10,
            'timeout_seconds': 30,
            'half_open_max_requests': 5,
            'window_size_seconds': 10,
            'slow_call_threshold_ms': 1000
        }

    breaker = CircuitBreaker(name, config)

    def decorator(func):
        def wrapper(*args, **kwargs):
            return breaker.call(func, *args, fallback=fallback, **kwargs)
        return wrapper
    return decorator


# Example usage
if __name__ == "__main__":
    # Create circuit breaker
    cb = CircuitBreaker('payment-service', {
        'failure_threshold': 0.5,  # 50%
        'min_requests': 10,
        'timeout_seconds': 30,
        'half_open_max_requests': 5,
        'window_size_seconds': 10,
        'slow_call_threshold_ms': 1000
    })

    # Simulate successful calls
    def successful_call():
        return "success"

    for i in range(5):
        result = cb.call(successful_call)
        print(f"Call {i+1}: {result}")

    print(f"State: {cb.get_state()}")

    # Simulate failures
    def failing_call():
        raise Exception("Service unavailable")

    try:
        for i in range(15):
            cb.call(failing_call)
    except:
        pass

    print(f"State after failures: {cb.get_state()}")
"""

# Test cases
const testCases: TestCase[] = [
  {
    id: 1,
    name: 'Circuit transitions: closed → open → half-open → closed',
    difficulty: 'hard',
    category: 'FR',
    input: `cb = CircuitBreaker('test-service', {
    'failure_threshold': 0.5,
    'min_requests': 10,
    'timeout_seconds': 2,  # Short timeout for testing
    'half_open_max_requests': 3,
    'window_size_seconds': 10,
    'slow_call_threshold_ms': 1000
})

# 1. CLOSED state: successful calls
for i in range(5):
    cb.call(lambda: "success")

state1 = cb.get_state()
print(f"After successes: {state1['state']}")

# 2. Trigger OPEN: 15 calls, 10 failures (66% error rate)
for i in range(5):
    cb.call(lambda: "success")
for i in range(10):
    try:
        cb.call(lambda: 1/0)  # Failure
    except:
        pass

state2 = cb.get_state()
print(f"After failures: {state2['state']}")

# 3. Wait for timeout → HALF_OPEN
time.sleep(2.1)

# Try one call to trigger half-open transition
try:
    cb.call(lambda: "success")
except CircuitBreakerOpenError:
    pass

state3 = cb.get_state()
print(f"After timeout: {state3['state']}")

# 4. Success in half-open → CLOSED
for i in range(3):
    cb.call(lambda: "success")

state4 = cb.get_state()
print(f"After recovery: {state4['state']}")`,
    expectedOutput: `After successes: closed
After failures: open
After timeout: half_open
After recovery: closed`,
    hints: [
      'Track success/failure with sliding window',
      'Open circuit when error rate >50% with min 10 requests',
      'Automatically transition to half-open after timeout',
      'Require N consecutive successes in half-open to close',
      'Use thread locks for concurrent safety'
    ],
    testCode: `assert state1['state'] == 'closed'
assert state2['state'] == 'open'
assert state3['state'] == 'half_open'
assert state4['state'] == 'closed'`,
    timeComplexity: 'O(1) for state check, O(W) for window cleanup where W = window size',
    spaceComplexity: 'O(N) where N = requests in window',
    learningObjectives: [
      'Implement circuit breaker state machine',
      'Understand state transitions and recovery',
      'Learn failure threshold detection'
    ]
  },
  {
    id: 2,
    name: 'Sliding window metrics',
    difficulty: 'medium',
    category: 'FR',
    input: `metrics = SlidingWindowMetrics(window_size_seconds=5)

# Record calls
for i in range(10):
    metrics.record(success=True, duration_ms=50)

for i in range(5):
    metrics.record(success=False, duration_ms=100)

# Check metrics
total = metrics.get_total_requests()
failures = metrics.get_failure_count()
error_rate = metrics.get_error_rate()
avg_latency = metrics.get_avg_latency()

print(total)
print(failures)
print(f"{error_rate:.2f}")
print(f"{avg_latency:.1f}")`,
    expectedOutput: `15
5
0.33
66.7`,
    hints: [
      'Use deque (circular buffer) for efficient sliding window',
      'Remove calls older than window_size on each update',
      'Calculate error_rate = failures / total',
      'Track latency for each call',
      'Cleanup old calls in O(1) amortized time'
    ],
    testCode: `assert total == 15
assert failures == 5
assert abs(error_rate - 0.33) < 0.01
assert abs(avg_latency - 66.7) < 1.0`,
    timeComplexity: 'O(1) amortized for record, O(W) worst case',
    spaceComplexity: 'O(W) where W = requests in window',
    learningObjectives: [
      'Implement sliding window with circular buffer',
      'Calculate metrics efficiently',
      'Handle time-based cleanup'
    ]
  },
  {
    id: 3,
    name: 'Fast fail when circuit open (NFR-P: <1ms)',
    difficulty: 'medium',
    category: 'NFR-P',
    input: `cb = CircuitBreaker('test-service', {
    'failure_threshold': 0.5,
    'min_requests': 10,
    'timeout_seconds': 30,
    'half_open_max_requests': 5,
    'window_size_seconds': 10,
    'slow_call_threshold_ms': 1000
})

# Open circuit (simulate failures)
for i in range(15):
    try:
        cb.call(lambda: 1/0)
    except:
        pass

# Measure fast-fail latency
import time
start = time.time()

try:
    cb.call(lambda: "should not execute")
except CircuitBreakerOpenError:
    pass

fail_fast_latency_ms = (time.time() - start) * 1000

print(cb.get_state()['state'])
print(f"{fail_fast_latency_ms:.2f}ms")
print(fail_fast_latency_ms < 1)  # Must be <1ms`,
    expectedOutput: `open
0.05ms
True`,
    hints: [
      'Check circuit state before executing function',
      'Reject immediately when circuit is open',
      'Use simple boolean check (O(1))',
      'No network call when circuit open',
      'Fast-fail latency must be <1ms (NFR-P)'
    ],
    testCode: `assert cb.get_state()['state'] == 'open'
assert fail_fast_latency_ms < 1.0  # NFR-P`,
    timeComplexity: 'O(1) for fast-fail check',
    spaceComplexity: 'O(1)',
    learningObjectives: [
      'Implement fast-fail for open circuits',
      'Meet <1ms rejection latency requirement',
      'Understand fail-fast benefits'
    ]
  },
  {
    id: 4,
    name: 'Fallback execution when circuit open',
    difficulty: 'easy',
    category: 'FR',
    input: `cb = CircuitBreaker('cache-service', {
    'failure_threshold': 0.5,
    'min_requests': 10,
    'timeout_seconds': 30,
    'half_open_max_requests': 5,
    'window_size_seconds': 10,
    'slow_call_threshold_ms': 1000
})

# Open circuit
for i in range(15):
    try:
        cb.call(lambda: 1/0)
    except:
        pass

# Call with fallback
def remote_call():
    return "remote data"

def fallback_call():
    return "cached data"

result = cb.call(remote_call, fallback=fallback_call)

print(result)
print(cb.get_state()['state'])`,
    expectedOutput: `cached data
open`,
    hints: [
      'Execute fallback when circuit is open',
      'Return cached/default data as fallback',
      'Fallback should be fast and reliable',
      'Log fallback execution for monitoring',
      'Useful for graceful degradation'
    ],
    testCode: `assert result == "cached data"
assert cb.get_state()['state'] == 'open'`,
    timeComplexity: 'O(1) for fallback check + O(F) for fallback execution',
    spaceComplexity: 'O(1)',
    learningObjectives: [
      'Implement fallback mechanism',
      'Understand graceful degradation',
      'Learn to maintain availability during failures'
    ]
  },
  {
    id: 5,
    name: 'Slow call detection (>1s threshold)',
    difficulty: 'medium',
    category: 'FR',
    input: `cb = CircuitBreaker('slow-service', {
    'failure_threshold': 0.5,
    'min_requests': 10,
    'timeout_seconds': 30,
    'half_open_max_requests': 5,
    'window_size_seconds': 10,
    'slow_call_threshold_ms': 1000  # 1 second
})

# Simulate slow calls (treated as failures)
def slow_call():
    time.sleep(1.5)  # 1.5 seconds
    return "slow success"

for i in range(15):
    cb.call(slow_call)

state = cb.get_state()

print(state['state'])  # Should be open due to slow calls
print(state['error_rate'])`,
    expectedOutput: `open
1.0`,
    hints: [
      'Measure call duration for each request',
      'Treat slow calls (>threshold) as failures',
      'Open circuit if too many slow calls',
      'Prevents thread pool exhaustion',
      'Track latency in metrics'
    ],
    testCode: `assert state['state'] == 'open'
assert state['error_rate'] > 0.9  # All calls were slow`,
    timeComplexity: 'O(1) for duration measurement',
    spaceComplexity: 'O(1)',
    learningObjectives: [
      'Detect and handle slow calls',
      'Understand timeout-based failures',
      'Learn to prevent resource exhaustion'
    ]
  },
  {
    id: 6,
    name: 'Per-dependency circuit isolation',
    difficulty: 'medium',
    category: 'FR',
    input: `# Create separate circuits for each dependency
cb_payment = CircuitBreaker('payment-service', {
    'failure_threshold': 0.5,
    'min_requests': 10,
    'timeout_seconds': 30,
    'half_open_max_requests': 5,
    'window_size_seconds': 10,
    'slow_call_threshold_ms': 1000
})

cb_inventory = CircuitBreaker('inventory-service', {
    'failure_threshold': 0.5,
    'min_requests': 10,
    'timeout_seconds': 30,
    'half_open_max_requests': 5,
    'window_size_seconds': 10,
    'slow_call_threshold_ms': 1000
})

# payment-service fails
for i in range(15):
    try:
        cb_payment.call(lambda: 1/0)
    except:
        pass

# inventory-service works fine
for i in range(10):
    cb_inventory.call(lambda: "success")

# Check states (should be independent)
payment_state = cb_payment.get_state()
inventory_state = cb_inventory.get_state()

print(f"Payment: {payment_state['state']}")
print(f"Inventory: {inventory_state['state']}")`,
    expectedOutput: `Payment: open
Inventory: closed`,
    hints: [
      'Create separate circuit breaker instance per dependency',
      'Failures in one service don\'t affect others',
      'Isolate different failure domains',
      'Prevent cascading failures across services',
      'Use circuit name for identification'
    ],
    testCode: `assert payment_state['state'] == 'open'
assert inventory_state['state'] == 'closed'`,
    timeComplexity: 'O(1) per circuit',
    spaceComplexity: 'O(D) where D = number of dependencies',
    learningObjectives: [
      'Implement per-dependency isolation',
      'Understand bulkhead pattern',
      'Learn to prevent cascading failures'
    ]
  },
  {
    id: 7,
    name: 'Thread-safe concurrent requests (NFR-R)',
    difficulty: 'hard',
    category: 'NFR-R',
    input: `cb = CircuitBreaker('concurrent-service', {
    'failure_threshold': 0.5,
    'min_requests': 100,  # Higher threshold for concurrency test
    'timeout_seconds': 30,
    'half_open_max_requests': 5,
    'window_size_seconds': 10,
    'slow_call_threshold_ms': 1000
})

import threading

results = []
errors = []

def worker():
    for i in range(50):
        try:
            result = cb.call(lambda: "success")
            results.append(result)
        except Exception as e:
            errors.append(e)

# Create 10 threads (500 total requests)
threads = []
for i in range(10):
    t = threading.Thread(target=worker)
    t.start()
    threads.append(t)

# Wait for all threads
for t in threads:
    t.join()

state = cb.get_state()

print(len(results))
print(state['total_requests'])
print(state['state'])`,
    expectedOutput: `500
500
closed`,
    hints: [
      'Use threading.Lock for state transitions',
      'Protect metrics updates with locks',
      'Ensure atomic state checks',
      'Prevent race conditions in half-open state',
      'Thread-safe deque operations'
    ],
    testCode: `assert len(results) == 500
assert state['total_requests'] == 500
assert state['state'] == 'closed'`,
    timeComplexity: 'O(N) where N = concurrent requests',
    spaceComplexity: 'O(N)',
    learningObjectives: [
      'Implement thread-safe circuit breaker',
      'Handle concurrent state transitions',
      'Learn lock-based synchronization'
    ]
  }
];

export const circuitBreakerLibraryChallenge: SystemDesignChallenge = {
  id: 'circuit_breaker_library',
  title: 'Circuit Breaker Library',
  difficulty: 'advanced',
  category: 'Migration & Reliability',
  description: `Design a circuit breaker library to prevent cascading failures in distributed systems. Automatically detect failures and temporarily block requests to failing services. Similar to Netflix Hystrix, Resilience4j, or Polly.

**Real-world Context:**
- Netflix Hystrix: Circuit breaking for 100+ microservices (now in maintenance mode)
- Resilience4j: Lightweight alternative to Hystrix for modern Java applications
- Polly: .NET resilience library with circuit breaking, retries, timeouts
- AWS App Mesh: Built-in circuit breaking for service mesh

**Key Concepts:**
- Circuit States: Closed (normal) → Open (fail fast) → Half-Open (test recovery) → Closed
- Sliding window: Track metrics over last N seconds (deque-based)
- Failure detection: Error rate >50%, slow calls >1s, minimum 10 requests
- Fast fail: Reject requests in <1ms when circuit open (no network call)
- Fallback: Return cached data when circuit open

**Scale:**
- 1,000 circuit breakers per service
- 10,000 RPS per circuit
- <1ms overhead for circuit check
- Thread-safe for concurrent requests

**Companies:** Netflix, Amazon, Microsoft, Uber, Airbnb
**Level:** L4-L5 (Senior/Staff Engineer)`,
  testCases,
  boilerplate: pythonTemplate,
  hints: [
    'Use enum for circuit states (CLOSED, OPEN, HALF_OPEN)',
    'Sliding window with deque: append new calls, remove old calls',
    'Thread locks: protect state transitions and metrics updates',
    'Fast-fail: check state before executing function (<1ms)',
    'Half-open: allow limited requests (5) to test recovery',
    'Slow call detection: measure duration, treat >threshold as failure',
    'Fallback: execute alternative logic when circuit open',
    'Per-dependency: separate circuit breaker per service'
  ],
  estimatedTime: '45-60 minutes',
  realWorldApplications: [
    'Netflix: Hystrix protected API Gateway from cascading failures across 100+ services',
    'Amazon: Circuit breakers in AWS App Mesh prevent DDoS-like behavior during outages',
    'Microsoft: Polly library used in Azure services for resilience',
    'Uber: Circuit breaking protects critical services (dispatch, payments)',
    'Airbnb: Prevents cascading failures in booking and payment flows'
  ],
  relatedChallenges: [
    'service_mesh_control_plane',
    'multi_region_failover',
    'internal_api_gateway',
    'chaos_engineering_platform'
  ]
};
