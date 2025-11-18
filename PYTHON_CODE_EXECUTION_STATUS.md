# Python Code Execution Status by Challenge

## Summary

There are **3 different ways** Python code is handled:

1. **Backend API Execution** (Real Python execution)
2. **Frontend Simulation** (Simulated execution, not real)
3. **Architecture Validation Only** (No execution, just validation)

---

## 1. Backend API Execution (Real Python Execution)

**Only 1 challenge uses this:**

### ✅ TinyURL (`tiny_url`)
- **Location**: Python tab → "Run Tests" button
- **Execution**: `apiService.executeCode('tinyurl_hash_function', script)`
- **Backend Endpoint**: `POST /api/v1/code_labs/tinyurl_hash_function/execute`
- **How it works**:
  1. User writes Python code (`shorten()`, `redirect()` functions)
  2. Test script is generated that calls these functions
  3. Script is sent to backend API
  4. Backend executes Python in isolated environment
  5. Results are returned and validated
- **Test Cases**: FR-1, FR-2, FR-3, FR-4, FR-5 (all execute Python functions)

**Example Test:**
```python
# Generated test script:
context = {}
result1 = shorten("https://example.com", context)
result2 = redirect(result1, context)
# Validate: result1 is valid code, result2 == "https://example.com"
```

---

## 2. Frontend Simulation (Simulated, Not Real Execution)

**Challenges with `codeChallenges` property:**

### ✅ Food Blog (`food_blog`)
- **Has**: `codeChallenges: foodBlogCodeChallenges`
- **Location**: Python tab → Uses `PythonCodeChallengePanel`
- **Execution**: Frontend simulation via `pythonExecutor` (currently in simulation mode)
- **Status**: Simulates execution, doesn't actually run Python

### ✅ Todo App (`todo_app`)
- **Has**: `codeChallenges: todoAppCodeChallenges`
- **Location**: Python tab → Uses `PythonCodeChallengePanel`
- **Execution**: Frontend simulation
- **Status**: Simulates execution, doesn't actually run Python

### ✅ Ticket Master (`ticket_master`)
- **Has**: `codeChallenges: ticketMasterCodeChallenges`
- **Location**: Python tab → Uses `PythonCodeChallengePanel`
- **Execution**: Frontend simulation
- **Status**: Simulates execution, doesn't actually run Python

### ✅ TinyURL Variants
- `tiny_url_tiered` - Has `codeChallenges`
- `tiny_url_l6` - Has `codeChallenges`
- `tiny_url_progressive` - Has `codeChallenges`
- **Note**: These might use backend execution like main `tiny_url`

### ⚠️ Instagram (`instagram`)
- **Has**: `instagramCodeChallenges` defined in code
- **Status**: **NOT USED** - Instagram challenge doesn't have `codeChallenges` property set
- **Location**: Would use `PythonCodeChallengePanel` if added

**How Frontend Simulation Works:**
- Uses `pythonExecutor.simulateExecution()`
- Currently in `simulationMode = true`
- Simulates function behavior based on code patterns
- Does NOT actually execute Python code
- Can be upgraded to real execution via Pyodide in the future

---

## 3. Architecture Validation Only (No Execution)

**All other challenges (500+ challenges):**

### Examples:
- Discord (`discord`)
- Facebook (`facebook`)
- WhatsApp (`whatsapp`)
- YouTube (`youtube`)
- Uber (`uber`)
- Amazon (`amazon`)
- Instagram (`instagram`) - Has `pythonTemplate` but no execution
- And 500+ more...

**What they have:**
- ✅ `pythonTemplate` - Python code template provided
- ❌ No `codeChallenges` - No code execution challenges
- ❌ No backend API endpoint - No Python execution service

**What Python code is used for:**
1. **Connection Validation**: Checks if Python API calls match canvas connections
   - Python uses `context['db']` → Must have `app_server → database` connection
   - Python uses `context['queue']` → Must have `app_server → message_queue` connection

2. **Schema Validation**: Checks if Python code matches database schema
   - Python accesses `context['db'].get('user_id')` → Must have `user_id` field in schema

3. **NOT for execution**: Python code is never actually executed
   - Functions like `create_server()`, `send_message()` are never called
   - Only the code structure is analyzed

**FR Test Execution:**
- FR tests only validate architecture (components, connections)
- FR tests simulate traffic flow (error rate, latency)
- FR tests do NOT execute Python functions

---

## Complete List

### Backend API Execution (Real Python)
1. ✅ **TinyURL** (`tiny_url`)

### Frontend Simulation (Simulated Python)
1. ✅ **Food Blog** (`food_blog`)
2. ✅ **Todo App** (`todo_app`)
3. ✅ **Ticket Master** (`ticket_master`)
4. ✅ **TinyURL Tiered** (`tiny_url_tiered`)
5. ✅ **TinyURL L6** (`tiny_url_l6`)
6. ✅ **TinyURL Progressive** (`tiny_url_progressive`)

### Architecture Validation Only (No Execution)
- **All other 500+ challenges** including:
  - Discord, Facebook, WhatsApp, YouTube, Uber, Amazon, Instagram, etc.

---

## How to Add Python Execution for Discord

To make Discord execute Python code like TinyURL:

1. **Add backend endpoint** (or reuse existing):
   ```typescript
   // Option 1: Create new endpoint
   const response = await apiService.executeCode('discord_chat', script);
   
   // Option 2: Reuse tinyurl endpoint (if it's generic)
   const response = await apiService.executeCode('tinyurl_hash_function', script);
   ```

2. **Add test script generation** for Discord functions:
   ```python
   # Test script for FR-1: Create Server
   context = {}
   server = create_server("server_1", "My Server", "user_1", context)
   # Validate: server has correct structure
   ```

3. **Update `handleRunPythonTests`** to support Discord:
   ```typescript
   // Currently only handles TinyURL
   // Need to add Discord-specific test generation
   ```

4. **Or use `codeChallenges`** approach:
   - Create `discordCodeChallenges.ts` with `CodeChallenge[]`
   - Add `codeChallenges: discordCodeChallenges` to Discord challenge
   - Will use `PythonCodeChallengePanel` (currently simulation, but can be upgraded)

---

## Current State Summary

| Challenge Type | Count | Python Execution | Status |
|---------------|-------|------------------|--------|
| Backend API Execution | 1 | ✅ Real execution | TinyURL only |
| Frontend Simulation | 6 | ⚠️ Simulated | Food Blog, Todo App, etc. |
| Architecture Validation | 500+ | ❌ No execution | Discord, Facebook, etc. |

**Total Challenges**: ~538
- **1** executes Python via backend API
- **6** simulate Python execution (frontend)
- **531** only validate architecture (no Python execution)

