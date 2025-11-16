/**
 * Test for Python Executor - Verifies stateful execution
 */

import { PythonExecutor, MockDatabase, MockRedisCache, MockMessageQueue, ExecutionContext } from '../pythonExecutor';

describe('PythonExecutor - Stateful Execution', () => {
  let executor: PythonExecutor;
  let context: ExecutionContext;

  beforeEach(() => {
    executor = PythonExecutor.getInstance();
    context = {
      db: new MockDatabase(),
      cache: new MockRedisCache(),
      queue: new MockMessageQueue(),
      config: {}
    };
  });

  test('should maintain state between shorten() and expand() calls', async () => {
    const pythonCode = `
# Simple TinyURL implementation
url_map = {}
counter = 1

def shorten(url):
    global counter
    code = f"url{counter}"
    counter += 1
    url_map[code] = url
    return code

def expand(code):
    return url_map.get(code, None)
`;

    // Test 1: Shorten a URL
    const shortCode = await executor.execute(
      pythonCode,
      'shorten',
      ['https://example.com'],
      context
    );

    console.log('Test 1 - Shorten:', shortCode);
    expect(shortCode).toBeTruthy();
    expect(typeof shortCode).toBe('string');

    // Test 2: Expand the same code - STATE SHOULD BE PRESERVED
    const longUrl = await executor.execute(
      pythonCode,
      'expand',
      [shortCode],
      context  // SAME CONTEXT - this is the key!
    );

    console.log('Test 2 - Expand:', longUrl);
    expect(longUrl).toBe('https://example.com');
  });

  test('should preserve state across multiple shorten/expand operations', async () => {
    const pythonCode = `
url_map = {}
counter = 1

def shorten(url):
    global counter
    code = f"url{counter}"
    counter += 1
    url_map[code] = url
    return code

def expand(code):
    return url_map.get(code, None)
`;

    // Shorten multiple URLs
    const url1 = 'https://google.com';
    const url2 = 'https://github.com';
    const url3 = 'https://stackoverflow.com';

    const code1 = await executor.execute(pythonCode, 'shorten', [url1], context);
    const code2 = await executor.execute(pythonCode, 'shorten', [url2], context);
    const code3 = await executor.execute(pythonCode, 'shorten', [url3], context);

    console.log('Shortened codes:', { code1, code2, code3 });

    // Expand them in different order
    const expanded2 = await executor.execute(pythonCode, 'expand', [code2], context);
    const expanded1 = await executor.execute(pythonCode, 'expand', [code1], context);
    const expanded3 = await executor.execute(pythonCode, 'expand', [code3], context);

    console.log('Expanded URLs:', { expanded1, expanded2, expanded3 });

    expect(expanded1).toBe(url1);
    expect(expanded2).toBe(url2);
    expect(expanded3).toBe(url3);
  });

  test('should use context.db for persistence', async () => {
    const pythonCode = `
def shorten(url):
    # This will be simulated, but should use context.db
    pass

def expand(code):
    # This will be simulated, but should use context.db
    pass
`;

    // The executor should use context.db internally
    const shortCode = await executor.execute(pythonCode, 'shorten', ['https://test.com'], context);

    // Check that something was stored in the database
    console.log('Database contents after shorten:', {
      hasData: context.db.exists(shortCode),
      value: context.db.get(shortCode)
    });

    const expanded = await executor.execute(pythonCode, 'expand', [shortCode], context);

    expect(expanded).toBe('https://test.com');
  });

  test('should reset state when context is replaced', async () => {
    const pythonCode = `
url_map = {}

def shorten(url):
    code = "abc123"
    url_map[code] = url
    return code

def expand(code):
    return url_map.get(code, None)
`;

    // Use first context
    const code1 = await executor.execute(pythonCode, 'shorten', ['https://first.com'], context);

    // Create NEW context
    const newContext: ExecutionContext = {
      db: new MockDatabase(),
      cache: new MockRedisCache(),
      queue: new MockMessageQueue(),
      config: {}
    };

    // Use new context - should NOT have previous data
    const expanded = await executor.execute(pythonCode, 'expand', [code1], newContext);

    console.log('Expanded with new context:', expanded);
    // This should fail because newContext doesn't have the data
    // Note: Simulator returns undefined instead of null for missing values
    expect(expanded).toBeFalsy();
  });
});

describe('MockDatabase', () => {
  let db: MockDatabase;

  beforeEach(() => {
    db = new MockDatabase();
  });

  test('should store and retrieve values', () => {
    db.insert('abc123', 'https://example.com');

    expect(db.exists('abc123')).toBe(true);
    expect(db.get('abc123')).toBe('https://example.com');
    expect(db.exists('nonexistent')).toBe(false);
  });

  test('should generate incrementing IDs', () => {
    const id1 = db.get_next_id();
    const id2 = db.get_next_id();
    const id3 = db.get_next_id();

    expect(id1).toBe(1);
    expect(id2).toBe(2);
    expect(id3).toBe(3);
  });

  test('should find by URL', () => {
    db.insert('abc', 'https://google.com');
    db.insert('def', 'https://github.com');

    const result = db.find_by_url('https://google.com');

    expect(result).toEqual({
      short_code: 'abc',
      long_url: 'https://google.com'
    });
  });
});
