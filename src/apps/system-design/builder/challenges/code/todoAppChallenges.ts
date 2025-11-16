import { CodeChallenge } from '../../types/codeChallenge';

/**
 * Todo App Code Challenges
 * Implementation tasks for a collaborative todo application
 */

const createTodoChallenge: CodeChallenge = {
  id: 'todoapp_create_todo',
  title: 'Implement Create Todo',
  description: `Implement a function to create a new todo item for a user.

**Requirements:**
- Generate unique todo IDs (use incrementing counter)
- Store todos in database
- Invalidate user's cached todo list
- Return the created todo object

**Database Schema:**
\`\`\`
context['db']['todos'] = {
  'todo_1': {'id': 'todo_1', 'user_id': 'user_1', 'title': '...', 'completed': False},
  ...
}
\`\`\`

**Interview Focus:**
- How do you generate unique IDs in distributed systems?
- Why invalidate cache after writes?
- What happens if DB write succeeds but cache invalidation fails?`,

  difficulty: 'easy',
  componentType: 'app_server',

  functionSignature: 'function createTodo(userId: string, title: string, context: dict): dict',

  starterCode: `def create_todo(user_id: str, title: str, context: dict) -> dict:
    """
    Create a new todo item for a user.

    Args:
        user_id: User identifier
        title: Todo title/description
        context: Shared context with db and cache access

    Returns:
        Created todo dictionary with id, user_id, title, completed, created_at
    """
    # Initialize storage if needed
    if 'db' not in context:
        context['db'] = {'todos': {}, 'next_id': 0}
    if 'cache' not in context:
        context['cache'] = {}

    # Your code here

    return {}`,

  testCases: [
    {
      id: 'test_create_first',
      name: 'Create first todo',
      input: { user_id: 'user_1', title: 'Buy groceries', context: {} },
      expectedOutput: { id: 'todo_0', user_id: 'user_1', title: 'Buy groceries', completed: false },
    },
    {
      id: 'test_create_second',
      name: 'Create second todo with incremented ID',
      input: {
        user_id: 'user_1',
        title: 'Walk dog',
        context: { db: { todos: { 'todo_0': {} }, next_id: 1 }, cache: {} }
      },
      expectedOutput: { id: 'todo_1', user_id: 'user_1', title: 'Walk dog', completed: false },
    },
    {
      id: 'test_different_user',
      name: 'Create todo for different user',
      input: { user_id: 'user_2', title: 'Read book', context: { db: { todos: {}, next_id: 5 }, cache: {} } },
      expectedOutput: { id: 'todo_5', user_id: 'user_2', title: 'Read book', completed: false },
    },
  ],

  referenceSolution: `def create_todo(user_id: str, title: str, context: dict) -> dict:
    # Initialize storage
    if 'db' not in context:
        context['db'] = {'todos': {}, 'next_id': 0}
    if 'cache' not in context:
        context['cache'] = {}

    # Generate unique ID
    todo_id = f'todo_{context["db"]["next_id"]}'
    context['db']['next_id'] += 1

    # Create todo object
    import time
    todo = {
        'id': todo_id,
        'user_id': user_id,
        'title': title,
        'completed': False,
        'created_at': int(time.time())
    }

    # Store in database
    context['db']['todos'][todo_id] = todo

    # Invalidate user's cache
    cache_key = f'todos_{user_id}'
    if cache_key in context['cache']:
        del context['cache'][cache_key]

    return todo`,

  solutionExplanation: `**Optimal Approach: Counter-based ID Generation**

1. **Unique IDs**: Use incrementing counter (context['db']['next_id'])
2. **Atomic Operations**: Increment counter and create todo in one step
3. **Cache Invalidation**: Delete user's cached todo list after write
4. **Return Value**: Return full todo object for immediate use

**Key Insights**:
- Counter-based IDs work well for single-server systems
- In distributed systems, use UUID or Twitter Snowflake algorithm
- Cache invalidation pattern: write-through or write-invalidate
- Always invalidate cache AFTER successful DB write

**Interview Tips**:
- Discuss distributed ID generation (UUID, Snowflake)
- Mention cache stampede problem (many reads after invalidation)
- Talk about eventual consistency in distributed caches`,
};

const getTodosChallenge: CodeChallenge = {
  id: 'todoapp_get_todos',
  title: 'Implement Get Todos with Caching',
  description: `Implement a function to fetch all todos for a user with cache-aside pattern.

**Requirements:**
- Check cache first (cache-aside pattern)
- If cache miss, fetch from database
- Store result in cache for future requests
- Return list of todo dictionaries

**Cache-Aside Pattern:**
1. Check cache for data
2. If found (cache hit), return it
3. If not found (cache miss), fetch from DB
4. Store in cache and return

**Interview Focus:**
- What is cache-aside vs write-through caching?
- How long should todos be cached (TTL)?
- What happens if cache and DB get out of sync?`,

  difficulty: 'medium',
  componentType: 'app_server',

  functionSignature: 'function getTodos(userId: string, context: dict): list',

  starterCode: `def get_todos(user_id: str, context: dict) -> list:
    """
    Get all todos for a user with caching.

    Args:
        user_id: User identifier
        context: Shared context with db and cache access

    Returns:
        List of todo dictionaries for the user
    """
    # Initialize storage if needed
    if 'db' not in context:
        context['db'] = {'todos': {}}
    if 'cache' not in context:
        context['cache'] = {}

    # Your code here (implement cache-aside pattern)

    return []`,

  testCases: [
    {
      id: 'test_cache_miss',
      name: 'Cache miss - fetch from DB',
      input: {
        user_id: 'user_1',
        context: {
          db: {
            todos: {
              'todo_1': { id: 'todo_1', user_id: 'user_1', title: 'Buy milk' },
              'todo_2': { id: 'todo_2', user_id: 'user_1', title: 'Walk dog' }
            }
          },
          cache: {}
        }
      },
      expectedOutput: [
        { id: 'todo_1', user_id: 'user_1', title: 'Buy milk' },
        { id: 'todo_2', user_id: 'user_1', title: 'Walk dog' }
      ],
    },
    {
      id: 'test_cache_hit',
      name: 'Cache hit - return from cache',
      input: {
        user_id: 'user_1',
        context: {
          db: { todos: {} },
          cache: {
            'todos_user_1': [{ id: 'todo_1', title: 'Cached todo' }]
          }
        }
      },
      expectedOutput: [{ id: 'todo_1', title: 'Cached todo' }],
    },
    {
      id: 'test_empty_list',
      name: 'User with no todos',
      input: {
        user_id: 'user_999',
        context: { db: { todos: {} }, cache: {} }
      },
      expectedOutput: [],
    },
  ],

  referenceSolution: `def get_todos(user_id: str, context: dict) -> list:
    # Initialize storage
    if 'db' not in context:
        context['db'] = {'todos': {}}
    if 'cache' not in context:
        context['cache'] = {}

    # Cache key for this user's todos
    cache_key = f'todos_{user_id}'

    # Check cache first (cache-aside pattern)
    if cache_key in context['cache']:
        return context['cache'][cache_key]

    # Cache miss - fetch from database
    user_todos = []
    for todo_id, todo in context['db']['todos'].items():
        if todo.get('user_id') == user_id:
            user_todos.append(todo)

    # Store in cache for next time
    context['cache'][cache_key] = user_todos

    return user_todos`,

  solutionExplanation: `**Optimal Approach: Cache-Aside Pattern**

1. **Check Cache**: Look for cached data using key pattern \`todos_{user_id}\`
2. **Cache Hit**: If found, return immediately (fast path)
3. **Cache Miss**: Query database for user's todos
4. **Populate Cache**: Store results in cache before returning
5. **Return Data**: Same result whether cache hit or miss

**Key Insights**:
- Cache-aside puts application in control of caching logic
- Alternative: write-through (update cache on every write)
- TTL (time-to-live) prevents stale data (e.g., 5 minutes for todos)
- Cache key design matters: use pattern like \`{resource}_{id}\`

**Interview Tips**:
- Discuss cache eviction policies (LRU, LFU, TTL)
- Mention cache stampede: many requests miss cache simultaneously
- Talk about cache warming strategies
- Consider eventual consistency between cache and DB`,
};

const updateTodoChallenge: CodeChallenge = {
  id: 'todoapp_update_todo',
  title: 'Implement Update Todo',
  description: `Implement a function to update a todo's completion status.

**Requirements:**
- Find todo by ID in database
- Update the 'completed' field
- Invalidate the owner's cached todo list
- Return updated todo (or None if not found)

**Cache Invalidation:**
After updating DB, must invalidate cache to prevent serving stale data.

**Interview Focus:**
- Why invalidate cache instead of updating it?
- What if todo_id doesn't exist?
- How to handle partial failures (DB succeeds, cache fails)?`,

  difficulty: 'easy',
  componentType: 'app_server',

  functionSignature: 'function updateTodo(todoId: string, completed: bool, context: dict): dict',

  starterCode: `def update_todo(todo_id: str, completed: bool, context: dict) -> dict:
    """
    Update a todo's completion status.

    Args:
        todo_id: Todo identifier
        completed: New completion status
        context: Shared context with db and cache access

    Returns:
        Updated todo dictionary or None if not found
    """
    if 'db' not in context:
        context['db'] = {'todos': {}}
    if 'cache' not in context:
        context['cache'] = {}

    # Your code here

    return None`,

  testCases: [
    {
      id: 'test_mark_complete',
      name: 'Mark todo as completed',
      input: {
        todo_id: 'todo_1',
        completed: true,
        context: {
          db: {
            todos: {
              'todo_1': { id: 'todo_1', user_id: 'user_1', title: 'Test', completed: false }
            }
          },
          cache: {}
        }
      },
      expectedOutput: { id: 'todo_1', user_id: 'user_1', title: 'Test', completed: true },
    },
    {
      id: 'test_mark_incomplete',
      name: 'Mark todo as incomplete',
      input: {
        todo_id: 'todo_2',
        completed: false,
        context: {
          db: {
            todos: {
              'todo_2': { id: 'todo_2', user_id: 'user_1', title: 'Walk', completed: true }
            }
          },
          cache: {}
        }
      },
      expectedOutput: { id: 'todo_2', user_id: 'user_1', title: 'Walk', completed: false },
    },
    {
      id: 'test_not_found',
      name: 'Todo not found returns None',
      input: {
        todo_id: 'todo_999',
        completed: true,
        context: { db: { todos: {} }, cache: {} }
      },
      expectedOutput: null,
    },
  ],

  referenceSolution: `def update_todo(todo_id: str, completed: bool, context: dict) -> dict:
    if 'db' not in context:
        context['db'] = {'todos': {}}
    if 'cache' not in context:
        context['cache'] = {}

    # Find todo in database
    if todo_id not in context['db']['todos']:
        return None

    # Update the todo
    todo = context['db']['todos'][todo_id]
    todo['completed'] = completed

    # Invalidate user's cache
    user_id = todo['user_id']
    cache_key = f'todos_{user_id}'
    if cache_key in context['cache']:
        del context['cache'][cache_key]

    return todo`,

  solutionExplanation: `**Optimal Approach: Update-then-Invalidate**

1. **Find Todo**: Check if todo_id exists in database
2. **Return Early**: If not found, return None immediately
3. **Update DB**: Modify the 'completed' field in place
4. **Invalidate Cache**: Delete user's cached todo list
5. **Return Updated**: Return the modified todo object

**Key Insights**:
- Invalidate cache AFTER successful DB update
- Invalidation is safer than cache update (prevents inconsistency)
- If todo not found, don't touch cache (optimization)
- Return None vs raising error depends on API design

**Interview Tips**:
- Discuss write-through vs write-invalidate caching
- Mention optimistic locking for concurrent updates
- Talk about idempotency (same update twice = same result)
- Consider returning 404 vs None in REST APIs`,
};

const deleteTodoChallenge: CodeChallenge = {
  id: 'todoapp_delete_todo',
  title: 'Implement Delete Todo',
  description: `Implement a function to delete a todo item.

**Requirements:**
- Find and remove todo from database
- Invalidate owner's cached todo list
- Return True if deleted, False if not found

**Defensive Programming:**
- Handle case where todo doesn't exist
- Don't fail if cache key doesn't exist

**Interview Focus:**
- Should delete be idempotent?
- How to handle soft delete vs hard delete?
- What if user deletes todo that's cached?`,

  difficulty: 'easy',
  componentType: 'app_server',

  functionSignature: 'function deleteTodo(todoId: string, context: dict): bool',

  starterCode: `def delete_todo(todo_id: str, context: dict) -> bool:
    """
    Delete a todo item.

    Args:
        todo_id: Todo identifier
        context: Shared context with db and cache access

    Returns:
        True if deleted, False if not found
    """
    if 'db' not in context:
        context['db'] = {'todos': {}}
    if 'cache' not in context:
        context['cache'] = {}

    # Your code here

    return False`,

  testCases: [
    {
      id: 'test_delete_existing',
      name: 'Delete existing todo',
      input: {
        todo_id: 'todo_1',
        context: {
          db: {
            todos: {
              'todo_1': { id: 'todo_1', user_id: 'user_1', title: 'Delete me' }
            }
          },
          cache: { 'todos_user_1': [{ id: 'todo_1' }] }
        }
      },
      expectedOutput: true,
    },
    {
      id: 'test_delete_nonexistent',
      name: 'Delete non-existent todo returns false',
      input: {
        todo_id: 'todo_999',
        context: { db: { todos: {} }, cache: {} }
      },
      expectedOutput: false,
    },
    {
      id: 'test_invalidate_cache',
      name: 'Deleting todo invalidates cache',
      input: {
        todo_id: 'todo_5',
        context: {
          db: {
            todos: {
              'todo_5': { id: 'todo_5', user_id: 'user_2', title: 'Cached item' }
            }
          },
          cache: { 'todos_user_2': [{ id: 'todo_5' }] }
        }
      },
      expectedOutput: true,
    },
  ],

  referenceSolution: `def delete_todo(todo_id: str, context: dict) -> bool:
    if 'db' not in context:
        context['db'] = {'todos': {}}
    if 'cache' not in context:
        context['cache'] = {}

    # Check if todo exists
    if todo_id not in context['db']['todos']:
        return False

    # Get user_id before deleting
    user_id = context['db']['todos'][todo_id]['user_id']

    # Delete from database
    del context['db']['todos'][todo_id]

    # Invalidate user's cache
    cache_key = f'todos_{user_id}'
    if cache_key in context['cache']:
        del context['cache'][cache_key]

    return True`,

  solutionExplanation: `**Optimal Approach: Delete-then-Invalidate**

1. **Check Existence**: Return False early if todo not found
2. **Save User ID**: Must save before deleting (for cache invalidation)
3. **Delete from DB**: Remove todo from database
4. **Invalidate Cache**: Delete user's cached todo list
5. **Return Success**: Return True to indicate deletion

**Key Insights**:
- Must get user_id BEFORE deleting todo from DB
- Idempotent delete: DELETE same ID twice → first returns True, second False
- Soft delete: set 'deleted' flag instead of removing
- Hard delete: permanently remove from database

**Interview Tips**:
- Discuss soft delete vs hard delete tradeoffs
- Mention GDPR compliance (right to be forgotten)
- Talk about cascade deletes (delete related data)
- Consider audit logs (who deleted what and when)`,
};

export const todoAppCodeChallenges: CodeChallenge[] = [
  createTodoChallenge,
  getTodosChallenge,
  updateTodoChallenge,
  deleteTodoChallenge,
];
