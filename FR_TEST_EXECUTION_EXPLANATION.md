# How FR Tests Are Executed: TinyURL vs Discord

## Key Difference

### TinyURL: Python Code Execution
- **Location**: Separate "Python" tab in the UI
- **Execution**: Python code is **actually executed** via backend API
- **How it works**:
  1. User writes Python code (e.g., `shorten()`, `redirect()` functions)
  2. Test runner creates a test script that calls these functions
  3. Script is sent to backend API: `POST /api/v1/code_labs/tinyurl_hash_function/execute`
  4. Backend executes Python code in isolated environment
  5. Results are returned and validated

**Example TinyURL FR Test:**
```python
# Test script generated:
context = {}
result1 = shorten("https://example.com", context)
result2 = redirect("abc123", context)
# Validate: result1 is a valid code, result2 == "https://example.com"
```

### Discord: Architecture + Simulation Validation
- **Location**: "Design" tab → "Submit Solution" button
- **Execution**: Python code is **NOT executed**, only **validated**
- **How it works**:
  1. User designs architecture on canvas (components + connections)
  2. Python code is provided (from `pythonTemplate`)
  3. **Connection Validation**: Checks if Python code API calls match canvas connections
     - Python code uses `context['db']` → Must have `app_server → database` connection
     - Python code uses `context['queue']` → Must have `app_server → message_queue` connection
  4. **Schema Validation**: Checks if Python code matches database schema
  5. **Traffic Simulation**: Simulates traffic flow through architecture
     - Measures: error rate, latency, throughput
     - Does NOT execute Python functions

**Example Discord FR-1 Test:**
```
1. Architecture Check:
   ✅ Has compute (app_server)
   ✅ Has storage (postgresql)
   ✅ Has realtime_messaging (message_queue)
   ✅ Has client → compute connection
   ✅ Has compute → storage connection
   ✅ Has compute → realtime_messaging connection

2. Connection Validation:
   ✅ Python code uses context['db'] → matches app_server → postgresql
   ✅ Python code uses context['queue'] → matches app_server → message_queue

3. Traffic Simulation:
   - Simulates 1 RPS through: client → app_server → postgresql
   - Measures: errorRate = 0%, latency = 50ms
   - ✅ Passes (errorRate < 0%, latency < 10000ms)
```

## Why The Difference?

### TinyURL (Code-First Approach)
- **Focus**: Writing correct Python code
- **Tests**: Execute actual functions to verify logic
- **Backend**: Has dedicated Python executor service
- **Use Case**: Learning Python programming + system design

### Discord (Architecture-First Approach)
- **Focus**: Designing correct architecture
- **Tests**: Validate architecture can handle traffic
- **Backend**: No Python execution needed
- **Use Case**: Learning system design patterns (scaling, replication, etc.)

## Current State: Discord FR Tests

**What Discord FR tests DO:**
- ✅ Validate required components exist
- ✅ Validate required connections exist
- ✅ Validate Python code API calls match canvas connections
- ✅ Validate Python code matches database schema
- ✅ Simulate traffic and measure metrics

**What Discord FR tests DON'T DO:**
- ❌ Execute Python functions (like `create_server()`, `send_message()`)
- ❌ Test Python code logic
- ❌ Verify Python code correctness

## How to Add Python Execution for Discord

If you want Discord FR tests to actually execute Python code (like TinyURL), you would need to:

1. **Add Python execution endpoint** for Discord:
   ```typescript
   // Similar to TinyURL's 'tinyurl_hash_function'
   const response = await apiService.executeCode('discord_chat', script);
   ```

2. **Create test scripts** that call Discord functions:
   ```python
   # Test script for FR-1: Create Server
   context = {}
   server = create_server("server_1", "My Server", "user_1", context)
   # Validate: server has correct structure
   
   # Test script for FR-2: Send Message
   message = send_message("msg_1", "channel_1", "user_1", "Hello!", context)
   # Validate: message stored correctly
   ```

3. **Update test runner** to execute Python for functional tests:
   ```typescript
   if (testCase.type === 'functional' && challenge.pythonTemplate) {
     // Execute Python code via backend
     const result = await executePythonTests(pythonCode, testCase);
   } else {
     // Run architecture simulation
     const result = testRunner.runTestCase(systemGraph, testCase);
   }
   ```

## Summary

- **TinyURL**: Executes Python code → Tests function logic
- **Discord**: Validates architecture → Tests system design
- **Both**: Use Python code, but in different ways
  - TinyURL: Execute it
  - Discord: Validate it matches architecture

The pattern detection you implemented affects **solution generation** (what components to add), but doesn't change how FR tests are executed. FR tests for Discord still only validate architecture, not execute Python code.

