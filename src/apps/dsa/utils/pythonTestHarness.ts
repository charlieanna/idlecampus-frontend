/**
 * Shared Python Test Harness
 *
 * This module provides a unified test harness for running Python code tests
 * with Pyodide. It handles:
 * - Tree and linked list data structure conversions
 * - Multiple input formats (snippet mode and JSON mode)
 * - Base64 encoding for safe test case embedding
 * - Comprehensive error handling
 */

import { NormalizedTestCase } from '../components/progressive-lesson/types';

/**
 * Test case format used by Smart Practice problems
 */
export interface SmartPracticeTestCase {
    input: string;
    expectedOutput: string;
    hidden?: boolean;
}

/**
 * Convert Smart Practice test cases to normalized format
 */
export const normalizeSmartPracticeTestCases = (testCases: SmartPracticeTestCase[]): NormalizedTestCase[] => {
    return testCases.map(tc => ({
        mode: 'snippet' as const,
        inputExpr: tc.input,
        expectedExpr: tc.expectedOutput
    }));
};

/**
 * Helper functions injected into Python for common data structures
 */
const HELPER_FUNCTIONS = [
    'deserialize_tree', 'serialize_tree',
    'list_to_linkedlist', 'linkedlist_to_list',
    '__convert_tree_input', '__convert_tree_output',
    '__convert_linked_list_input', '__convert_linked_list_output',
    '__parse_test_input', '__prepare_call_args', '__json_safe',
    '__wrap_call_payload', '__parse_literal', '__call_user_function'
];

/**
 * Detect the main function name from Python code
 */
const detectFunctionName = (code: string, targetFunction?: string): { funcName: string; hasSolutionWrapper: boolean; hasConversionHelpers: boolean } => {
    let funcName = 'solution'; // default fallback

    if (targetFunction) {
        return { funcName: targetFunction, hasSolutionWrapper: false, hasConversionHelpers: false };
    }

    const allFuncMatches = Array.from(code.matchAll(/def\s+([A-Za-z_]\w*)\s*\(([^)]*)\)/g));

    // Check if code has a solution wrapper with conversion helpers
    const hasSolutionWrapper = code.includes('def solution(');
    const hasConversionHelpers = code.includes('__convert_linked_list_input') ||
        code.includes('__convert_tree_input') ||
        code.includes('# Auto-generated solution wrapper');

    // If there's a solution wrapper with conversion, always use it
    if (hasSolutionWrapper && hasConversionHelpers) {
        funcName = 'solution';
    } else {
        // Find the user's main function (skip helper functions and solution wrapper)
        for (const funcMatch of allFuncMatches) {
            const name = funcMatch[1];
            const params = (funcMatch[2] || '').trim();
            // Check if this is a method (has 'self' anywhere in params)
            const isSelfMethod = /\bself\b/.test(params);
            // Skip __init__, methods with 'self' parameter, known helper functions, and 'solution' wrapper
            if (name !== '__init__' &&
                name !== 'solution' &&
                !isSelfMethod &&
                !HELPER_FUNCTIONS.includes(name) &&
                !name.startsWith('__')) {
                funcName = name;
                break;
            }
        }
    }

    return { funcName, hasSolutionWrapper, hasConversionHelpers };
};

/**
 * Build Python test harness code
 *
 * This function generates Python code that:
 * 1. Imports required modules
 * 2. Defines helper functions for data structures
 * 3. Injects user code
 * 4. Runs test cases and outputs JSON results
 */
export const buildPythonTestHarness = (
    code: string,
    testCases: NormalizedTestCase[],
    targetFunction?: string
): string => {
    // Validate that code doesn't have obvious syntax issues
    if (!code || typeof code !== 'string') {
        throw new Error('Invalid code provided to test harness');
    }

    const { funcName } = detectFunctionName(code, targetFunction);

    const serializedCases = JSON.stringify(testCases ?? []);
    // Use base64 encoding to safely embed JSON in Python code
    const base64Cases = btoa(unescape(encodeURIComponent(serializedCases)));

    // Ensure base64 string doesn't contain any problematic characters
    if (!/^[A-Za-z0-9+/=]+$/.test(base64Cases)) {
        throw new Error('Invalid base64 encoding generated');
    }

    // Detect if user code contains a TreeNode class definition
    const hasTreeNode = /class\s+TreeNode/.test(code);

    // Detect if function signature mentions TreeNode (type hints like "root: TreeNode")
    const hasTreeNodeTypeHint = /TreeNode/.test(code) && /def\s+\w+\s*\([^)]*TreeNode/.test(code);

    // Detect tree-related function names (inorder, preorder, postorder, traversal, etc.)
    const hasTreeFunctionName = /\b(inorder|preorder|postorder|traversal|levelOrder|maxDepth|isValidBST|lowestCommonAncestor|serialize|deserialize)\b/.test(code);

    // Check if test cases look like tree serializations (lists with None/null)
    const looksLikeTreeProblem = testCases.some(tc => {
        const input = tc.inputExpr || (tc as any).input || '';
        // Check if input is a list representation with null/None (tree serialization)
        if (typeof input === 'string') {
            // If it's a string like "[1, null, 2, 3]", check for null/None
            if (/null|None/.test(input) && /\[.*\]/.test(input)) {
                return true;
            }
            try {
                // Try to parse as JSON/Python literal
                const normalized = input.replace(/null/g, 'None').replace(/'/g, '"');
                const parsed = JSON.parse(normalized);
                if (Array.isArray(parsed)) {
                    // Tree serializations typically have None/null values
                    return parsed.some(v => v === null || v === undefined);
                }
            } catch {
                // If parsing fails, check if it looks like a tree serialization string
                return /\[.*null.*\]|\[.*None.*\]/.test(input);
            }
        }
        return false;
    });

    // Include tree helpers if TreeNode is defined, mentioned in type hints, function name suggests tree, or test cases look like trees
    const isTreeProblem = hasTreeNode || hasTreeNodeTypeHint || hasTreeFunctionName || looksLikeTreeProblem;

    // Tree deserialization helper - included if it's a tree problem
    const treeHelper = isTreeProblem ? `
# === Auto-generated Tree Helper ===
# TreeNode class definition (if not already in user code)
${hasTreeNode ? '' : `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
`}
def deserialize_tree(data):
    """Deserialize a list to a binary tree (LeetCode format)"""
    if not data:
        return None
    if isinstance(data, TreeNode):
        return data  # Already a TreeNode
    vals = data
    if not vals or vals[0] is None:
        return None
    root = TreeNode(vals[0])
    queue = [root]
    i = 1
    while queue and i < len(vals):
        node = queue.pop(0)
        if i < len(vals) and vals[i] is not None:
            node.left = TreeNode(vals[i])
            queue.append(node.left)
        i += 1
        if i < len(vals) and vals[i] is not None:
            node.right = TreeNode(vals[i])
            queue.append(node.right)
        i += 1
    return root
` : '';

    // Add typing imports at the start for user code with type hints
    const typingImports = 'from typing import List, Dict, Optional, Tuple, Set, Any\n';

    return `${typingImports}${code}
${treeHelper}
# === Auto-generated Test Harness ===
# Wrap everything in a try-except to ensure we ALWAYS print something
try:
    import json, ast, base64
    import sys
    import traceback
    import inspect
    try:
        results = []

        _TEST_CASES_JSON = base64.b64decode('${base64Cases}').decode('utf-8')
        _TEST_CASES = json.loads(_TEST_CASES_JSON)

        # Validate test cases were loaded
        _HAS_ERROR = False
        if not _TEST_CASES:
            results.append({
                'test': 0,
                'passed': False,
                'error': 'Test cases failed to load or are empty',
                'expected': 'N/A'
            })
            _HAS_ERROR = True

        # Function name detected from user code
        _FUNC_NAME = '${funcName}'

        # Detect if this is a tree/linked-list problem that needs list as single argument
        # Check if deserialize_tree exists (from tree helper) or conversion helpers exist
        _IS_TREE_PROBLEM = 'deserialize_tree' in globals() or '__convert_tree_input' in globals()
        _IS_LINKED_LIST_PROBLEM = 'list_to_linkedlist' in globals() or '__convert_linked_list_input' in globals()
        _NEEDS_LIST_AS_SINGLE_ARG = _IS_TREE_PROBLEM or _IS_LINKED_LIST_PROBLEM

        # Verify function exists early and try to find it if not found
        if _FUNC_NAME not in globals():
            _HELPER_FUNCS = {'print', 'json', 'ast', 'base64', 'sys', 'traceback', 'inspect',
                            'list_to_linkedlist', 'linkedlist_to_list', 'list_to_random_list', 'random_list_to_list',
                            'deserialize_tree', 'serialize_tree', 'solution'}
            user_funcs = [name for name in globals().keys()
                         if callable(globals()[name])
                         and not name.startswith('_')
                         and name not in _HELPER_FUNCS]

            if user_funcs:
                _FUNC_NAME = user_funcs[0]
            else:
                results.append({
                    'test': 0,
                    'passed': False,
                    'error': f"Function '{_FUNC_NAME}' not found. Available callables: {user_funcs}",
                    'expected': 'N/A'
                })
                _HAS_ERROR = True

        def __json_safe(value):
            if isinstance(value, dict):
                return {k: __json_safe(v) for k, v in value.items()}
            if isinstance(value, (list, tuple)):
                return [__json_safe(v) for v in value]
            if isinstance(value, (int, float, bool)) or value is None or isinstance(value, str):
                return value
            return repr(value)

        def __wrap_call_payload(value, expand_lists=False):
            if value is None:
                return {'__call__': 'args', 'args': [None]}
            if isinstance(value, dict) and value.get('__call__') in ('args', 'kwargs'):
                return value
            if isinstance(value, dict):
                return {'__call__': 'args', 'args': [value]}
            if isinstance(value, tuple):
                return {'__call__': 'args', 'args': list(value)}
            if expand_lists and isinstance(value, list):
                return {'__call__': 'args', 'args': value}
            return {'__call__': 'args', 'args': [value]}

        # Special handler for "first_bad_version" style problems
        # Input format: "n = 5, bad = 4" needs special parsing
        def __parse_bad_version_input(expr):
            """Parse 'n = X, bad = Y' format and return (n, bad)"""
            if not isinstance(expr, str):
                return None
            import re
            match = re.match(r'n\\s*=\\s*(\\d+)\\s*,\\s*bad\\s*=\\s*(\\d+)', expr.strip())
            if match:
                return int(match.group(1)), int(match.group(2))
            return None

        def __parse_literal(expr):
            if expr is None or isinstance(expr, (int, float, bool)):
                return expr
            if isinstance(expr, str):
                stripped = expr.strip()
                if stripped == "":
                    return None
                lowered = stripped.lower()
                if lowered == "none":
                    return None
                if lowered == "true":
                    return True
                if lowered == "false":
                    return False

                # Check for special "n = X, bad = Y" format (first_bad_version problem)
                bad_version_args = __parse_bad_version_input(stripped)
                if bad_version_args:
                    return {'__special__': 'bad_version', 'n': bad_version_args[0], 'bad': bad_version_args[1]}

                # IMPORTANT: Check if this looks like a quoted string literal first
                # This handles cases like "'.,;:!?'" which should be parsed as the string '.,;:!?'
                # We need to check for both single and double quotes
                if len(stripped) >= 2:
                    first_char = stripped[0]
                    last_char = stripped[-1]
                    # If it starts and ends with matching quotes, it's a string literal
                    if (first_char == '"' and last_char == '"') or (first_char == "'" and last_char == "'"):
                        # For double-quoted strings, the content can safely contain single quotes, semicolons, etc.
                        # Just extract the content directly without trying to parse
                        if first_char == '"' and last_char == '"':
                            # Double-quoted string - content can contain anything including single quotes
                            return stripped[1:-1]
                        else:
                            # Single-quoted string - try to parse it, but if it fails, extract content
                            try:
                                return ast.literal_eval(stripped)
                            except Exception:
                                # If parsing fails (e.g., contains problematic characters), extract content
                                # and convert to double-quoted string for safety
                                content = stripped[1:-1]
                                # Escape any double quotes in content
                                escaped_content = content.replace('"', '\\"')
                                try:
                                    return ast.literal_eval(f'"{escaped_content}"')
                                except Exception:
                                    # Last resort: just return the unquoted content
                                    return content

                normalized = stripped.replace('null', 'None').replace('true', 'True').replace('false', 'False')

                # Try parsing as-is first
                try:
                    return ast.literal_eval(normalized)
                except Exception:
                    pass
                
                # If it contains comma and doesn't start/end with brackets, try as tuple
                # This handles cases like '["a"], [1]' -> (["a"], [1]) or '[2, 1, 5], 3' -> ([2, 1, 5], 3)
                if ',' in normalized:
                    # Check if it looks like multiple comma-separated values
                    # Count brackets to see if we have complete expressions
                    open_brackets = normalized.count('[') + normalized.count('(')
                    close_brackets = normalized.count(']') + normalized.count(')')
                    
                    # If brackets are balanced, try parsing as tuple
                    # This handles inputs like "[2, 1, 5, 1, 3, 2], 3" -> ([2, 1, 5, 1, 3, 2], 3)
                    if open_brackets == close_brackets:
                        try:
                            # Try wrapping in parentheses to make it a tuple
                            tuple_value = ast.literal_eval(f'({normalized})')
                            # Only return tuple if it actually parsed as a tuple with multiple elements
                            if isinstance(tuple_value, tuple) and len(tuple_value) > 1:
                                return tuple_value
                        except Exception:
                            pass
                    
                    # Also try parsing as tuple even if brackets aren't perfectly balanced
                    # This handles edge cases where parsing might still work
                    try:
                        tuple_value = ast.literal_eval(f'({normalized})')
                        if isinstance(tuple_value, tuple) and len(tuple_value) > 1:
                            return tuple_value
                    except Exception:
                        pass
                
                # Try wrapping in parentheses (for single values that might be tuples)
                try:
                    return ast.literal_eval(f'({normalized})')
                except Exception:
                    pass
                
                # Try wrapping in brackets (for single values)
                try:
                    return ast.literal_eval(f'[{normalized}]')
                except Exception:
                    # If all parsing fails, return original string
                    return expr
            return expr

        def __call_user_function(payload):
            """Call the user's function with the given payload"""

            # Handle special case for first_bad_version problems
            # The payload will be {'__special__': 'bad_version', 'n': X, 'bad': Y}
            if isinstance(payload, dict) and payload.get('__special__') == 'bad_version':
                n_val = payload.get('n')
                bad_val = payload.get('bad')

                # Define mock isBadVersion function and inject into globals
                def isBadVersion(version):
                    return version >= bad_val
                globals()['isBadVersion'] = isBadVersion

                # Find and call the user's first_bad_version function
                user_func = globals().get(_FUNC_NAME)
                if user_func is None:
                    # Try common function names for this problem
                    for name in ['firstBadVersion', 'first_bad_version', 'solution']:
                        if name in globals():
                            user_func = globals()[name]
                            break
                if user_func is None:
                    raise NameError(f"Function '{_FUNC_NAME}' not found for first_bad_version problem")

                return user_func(n_val)

            user_func = globals().get(_FUNC_NAME)
            if user_func is None:
                all_callables = {name: obj for name, obj in globals().items()
                               if callable(obj) and not name.startswith('_')
                               and not isinstance(obj, type)}
                if all_callables:
                    potential_names = [n for n in all_callables.keys() if n not in ['print', 'json', 'ast', 'base64', 'sys', 'traceback', 'inspect', '__json_safe', '__wrap_call_payload', '__parse_literal', '__call_user_function']]
                    if potential_names:
                        user_func = all_callables[potential_names[0]]
                    else:
                        raise NameError(f"name '{_FUNC_NAME}' is not defined. Available functions: {list(all_callables.keys())}")
                else:
                    raise NameError(f"name '{_FUNC_NAME}' is not defined. No callable functions found in globals.")

            has_no_params = False
            try:
                sig = inspect.signature(user_func)
                params = list(sig.parameters.values())
                has_no_params = len(params) == 0
            except Exception:
                pass

            if isinstance(payload, dict) and payload.get('__call__') == 'kwargs':
                kwargs = payload.get('kwargs', {})
                if has_no_params and not kwargs:
                    return user_func()
                return user_func(**kwargs)
            elif isinstance(payload, dict) and payload.get('__call__') == 'args':
                args = payload.get('args', [])
                if has_no_params:
                    return user_func()
                if not args:
                    try:
                        return user_func()
                    except TypeError as te:
                        if "required positional argument" in str(te) or "missing" in str(te).lower():
                            raise TypeError(f"Function {_FUNC_NAME} requires arguments but none were provided")
                        raise
                if len(args) == 1 and args[0] is None and has_no_params:
                    return user_func()

                # Convert list arguments to TreeNode if this is a tree problem
                if _IS_TREE_PROBLEM and 'deserialize_tree' in globals():
                    converted_args = []
                    for arg in args:
                        if isinstance(arg, list):
                            converted_args.append(deserialize_tree(arg))
                        else:
                            converted_args.append(arg)
                    args = converted_args

                return user_func(*args)
            else:
                if has_no_params:
                    return user_func()
                return user_func(payload)

        # Validate test cases exist before running
        if _HAS_ERROR:
            pass
        elif not _TEST_CASES or len(_TEST_CASES) == 0:
            results.append({
                'test': 0,
                'passed': False,
                'error': 'No test cases found. Please check the exercise configuration.',
                'expected': 'N/A'
            })
        else:
            # Run all test cases
            for idx, tc in enumerate(_TEST_CASES, 1):
                mode = tc.get('mode', 'snippet')
                try:
                    if mode == 'snippet':
                        raw_input = tc.get('inputExpr') or tc.get('input')

                        if raw_input and isinstance(raw_input, str) and '_FUNC_NAME' in raw_input:
                            raw_input = raw_input.replace('_FUNC_NAME', _FUNC_NAME)

                        import re
                        is_function_call = raw_input and isinstance(raw_input, str) and re.match(r'^[a-zA-Z_]\\w*\\s*[(]', raw_input.strip())
                        
                        # IMPORTANT: Check if this is a quoted string literal FIRST
                        # If it is, we should parse it as a literal, not execute it as code
                        # This handles cases like "'.,;:!?'" which contains ';' but is actually a string literal
                        is_quoted_string_literal = False
                        if raw_input and isinstance(raw_input, str):
                            stripped = raw_input.strip()
                            # Simple check: if it starts and ends with matching quotes (single or double),
                            # treat it as a string literal UNLESS it clearly looks like a function call
                            if len(stripped) >= 2:
                                first_char = stripped[0]
                                last_char = stripped[-1]
                                # Check for matching quotes
                                if (first_char == '"' and last_char == '"') or (first_char == "'" and last_char == "'"):
                                    # Only exclude if it's clearly a function call (has identifier followed by paren)
                                    # Examples that should NOT be treated as literals:
                                    # - "func("something")" 
                                    # - "addWord("bad")"
                                    # But "'.,;:!?'" should be treated as a literal
                                    is_likely_function_call = False
                                    try:
                                        # Check if it starts with an identifier followed by opening paren
                                        # This pattern indicates a function call, not a simple string
                                        is_likely_function_call = bool(re.search(r'^[a-zA-Z_]\\w+\\s*\\(', stripped))
                                    except Exception:
                                        pass
                                    
                                    # If it doesn't look like a function call, it's definitely a string literal
                                    if not is_likely_function_call:
                                        is_quoted_string_literal = True
                        
                        # Check if this is WordDictionary problem (comma-separated function calls like addWord("bad"), search("pad"))
                        # Must be very specific: starts with addWord(, contains search(, and does NOT contain patterns like "board =", "words ="
                        is_word_dict_problem = False
                        if raw_input and isinstance(raw_input, str) and not is_quoted_string_literal:
                            stripped = raw_input.strip()
                            # Exclude patterns that indicate other problem types
                            excludes_other_problems = ('board =' not in stripped and 
                                                       'words =' not in stripped and 
                                                       'nums =' not in stripped and
                                                       'target =' not in stripped and
                                                       's =' not in stripped and
                                                       't =' not in stripped)
                            is_word_dict_problem = (stripped.startswith('addWord(') and 
                                                    ',' in stripped and 
                                                    'search(' in stripped and
                                                    excludes_other_problems)
                        
                        # Check if this is MagicDictionary problem (patterns like md = MagicDictionary(), md.search(...), md.buildDict(...))
                        is_magic_dict_problem = False
                        if raw_input and isinstance(raw_input, str) and not is_quoted_string_literal:
                            stripped = raw_input.strip()
                            # Check for MagicDictionary class name or md instance method calls
                            is_magic_dict_problem = ('MagicDictionary' in stripped or 
                                                     'md.search' in stripped or 
                                                     'md.buildDict' in stripped or
                                                     'md = MagicDictionary' in stripped)
                        
                        # Only execute as code if it's NOT a quoted string literal
                        # IMPORTANT: If it's a quoted string literal, skip code execution entirely
                        should_execute_as_code = False
                        if not is_quoted_string_literal and raw_input and isinstance(raw_input, str):
                            should_execute_as_code = (';' in raw_input or ('=' in raw_input and '==' not in raw_input and not raw_input.strip().startswith('{')) or is_function_call or is_word_dict_problem or is_magic_dict_problem)
                        
                        if should_execute_as_code:
                            import re
                            # For WordDictionary, split by comma (but be careful with commas inside strings)
                            if is_word_dict_problem:
                                # Use regex to find function calls with quoted arguments
                                import re
                                # Pattern: functionName("string") or functionName('string')
                                # Matches: word( "anything" ) or word( 'anything' )
                                pattern = r'\\w+\\s*\\(["\\'][^"\\']*["\\']\\)'
                                matches = re.findall(pattern, raw_input)
                                if matches and len(matches) > 1:
                                    statements = [m.strip() for m in matches if m.strip()]
                                else:
                                    # Fallback: try to split by comma outside quotes using a simpler method
                                    # Split on comma, then check if each part looks like a function call
                                    parts = []
                                    current = ''
                                    in_quotes = False
                                    for char in raw_input:
                                        if char in ('"', "'"):
                                            in_quotes = not in_quotes
                                            current += char
                                        elif char == ',' and not in_quotes:
                                            if current.strip():
                                                parts.append(current.strip())
                                            current = ''
                                        else:
                                            current += char
                                    if current.strip():
                                        parts.append(current.strip())
                                    statements = parts if parts else [raw_input.strip()]
                                # Final check: if we still only have 1 statement but it contains commas and function calls, force split
                                if len(statements) == 1 and ',' in statements[0] and ('addWord(' in statements[0] or 'search(' in statements[0]):
                                    # Force split on comma (simple but should work for this case)
                                    statements = [s.strip() for s in statements[0].split(',') if s.strip()]
                            elif is_magic_dict_problem:
                                # For MagicDictionary, split by semicolon (pattern: md = MagicDictionary(); md.buildDict(...); md.search(...))
                                statements = [s.strip() for s in raw_input.split(';') if s.strip()]
                            else:
                                statements = [s.strip() for s in raw_input.split(';') if s.strip()]
                            if statements:
                                exec_ns = {}

                                skip_helpers = {
                                    '__call_user_function', '__parse_literal', '__wrap_call_payload',
                                    '__json_safe', '__convert_tree_input', '__convert_tree_output',
                                    '__convert_linked_list_input', '__convert_linked_list_output',
                                    '__parse_test_input', '__prepare_call_args',
                                    '_FUNC_NAME', '_TEST_CASES', '_TEST_CASES_JSON', '_HAS_ERROR',
                                    'results', 'idx', 'tc', 'mode', 'raw_input', 'input_json',
                                    'expected_json', 'expected_value', 'actual_value', 'passed',
                                    'json', 'ast', 'base64', 'sys', 'traceback', 'inspect', 're'
                                }

                                global_items = list(globals().items())

                                for key, value in global_items:
                                    if key in skip_helpers:
                                        continue
                                    if key.startswith('__') and key not in ['__builtins__', '__name__', '__doc__', '__file__']:
                                        continue
                                    try:
                                        exec_ns[key] = value
                                    except:
                                        pass

                                if '__builtins__' not in exec_ns:
                                    import builtins
                                    exec_ns['__builtins__'] = builtins

                                if 'ListNode' not in exec_ns and raw_input and 'ListNode' in str(raw_input):
                                    exec('''
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
''', exec_ns)

                                if 'TreeNode' not in exec_ns and raw_input and 'TreeNode' in str(raw_input):
                                    exec('''
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
''', exec_ns)

                                # Ensure Trie and TrieNode classes are available for Trie problems
                                if raw_input and ('Trie' in str(raw_input) or 'TrieNode' in str(raw_input)):
                                    if 'TrieNode' not in exec_ns and 'TrieNode' in globals():
                                        exec_ns['TrieNode'] = globals()['TrieNode']
                                    if 'Trie' not in exec_ns and 'Trie' in globals():
                                        exec_ns['Trie'] = globals()['Trie']

                                # Ensure TrieNode is available for MagicDictionary (it uses TrieNode internally)
                                if is_magic_dict_problem:
                                    # Always ensure TrieNode is available for MagicDictionary problems
                                    if 'TrieNode' not in exec_ns:
                                        if 'TrieNode' in globals():
                                            exec_ns['TrieNode'] = globals()['TrieNode']
                                        else:
                                            # Define TrieNode if not available (MagicDictionary uses it internally)
                                            exec('''
class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_word = False
        self.is_end_of_word = False
''', exec_ns)
                                            # Also add to globals so it persists
                                            if 'TrieNode' not in globals():
                                                exec('''
class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_word = False
        self.is_end_of_word = False
''', globals())
                                    # Also ensure Trie class is available (in case user code references it)
                                    if 'Trie' not in exec_ns:
                                        if 'Trie' in globals():
                                            exec_ns['Trie'] = globals()['Trie']
                                    # Ensure MagicDictionary class is available
                                    if 'MagicDictionary' not in exec_ns:
                                        if 'MagicDictionary' in globals():
                                            exec_ns['MagicDictionary'] = globals()['MagicDictionary']
                                    # Ensure md instance persists in globals for reuse across test cases
                                    if 'md' not in globals():
                                        if 'MagicDictionary' in exec_ns:
                                            exec('md = MagicDictionary()', globals())
                                    # Copy md from globals to exec_ns so it's available in this test case
                                    if 'md' in globals():
                                        exec_ns['md'] = globals()['md']

                                # Ensure WordDictionary wrapper functions exist for WordDictionary problems
                                if is_word_dict_problem:
                                    if 'WordDictionary' not in exec_ns:
                                        # Try to get from globals
                                        if 'WordDictionary' in globals():
                                            exec_ns['WordDictionary'] = globals()['WordDictionary']
                                    if 'wordDict' not in exec_ns:
                                        # Create instance if WordDictionary class exists
                                        if 'WordDictionary' in exec_ns:
                                            exec('wordDict = WordDictionary()', exec_ns)
                                    if 'addWord' not in exec_ns:
                                        exec('''
def addWord(word):
    wordDict.addWord(word)
''', exec_ns)
                                    if 'search' not in exec_ns:
                                        exec('''
def search(word):
    return wordDict.search(word)
''', exec_ns)

                                last_stmt = statements[-1]
                                assignment_match = re.match(r'^(\\w+)\\s*=\\s*(.+)$', last_stmt)

                                if assignment_match and len(statements) == 1:
                                    exec(last_stmt, exec_ns)
                                    var_name = assignment_match.group(1)
                                    arg_value = exec_ns.get(var_name)
                                    # Persist md to globals for MagicDictionary problems
                                    if is_magic_dict_problem and 'md' in exec_ns:
                                        globals()['md'] = exec_ns['md']
                                    actual_value = __call_user_function({'__call__': 'args', 'args': [arg_value]})
                                else:
                                    try:
                                        for stmt in statements[:-1]:
                                            exec(stmt, exec_ns)

                                        if assignment_match:
                                            exec(last_stmt, exec_ns)
                                            var_name = assignment_match.group(1)
                                            actual_value = exec_ns.get(var_name)
                                        else:
                                            actual_value = eval(last_stmt, exec_ns)
                                        
                                        # Persist md to globals for MagicDictionary problems after all statements execute
                                        if is_magic_dict_problem and 'md' in exec_ns:
                                            globals()['md'] = exec_ns['md']
                                    except RecursionError as re:
                                        raise Exception(f'Recursion error: {str(re)}. Check for infinite loops in your code.')
                                    except NameError as ne:
                                        raise Exception(f'Name error: {str(ne)}. Make sure all classes and functions are defined correctly.')
                                    except Exception as e:
                                        raise Exception(f'Error executing code snippet: {str(e)}')
                            else:
                                actual_value = None
                        else:
                            parsed_value = __parse_literal(raw_input)

                            expected_expr = tc.get('expectedExpr', '')
                            expected_is_string_output = isinstance(expected_expr, str) and '\\n' in expected_expr
                            converted_to_linkedlist = False

                            if converted_to_linkedlist and parsed_value is None:
                                payload = {'__call__': 'args', 'args': [None]}
                            else:
                                # Handle tuple inputs (multiple arguments like ["a"], [1] for build_dict)
                                if isinstance(parsed_value, tuple):
                                    # Expand tuple to separate arguments
                                    payload = {'__call__': 'args', 'args': list(parsed_value)}
                                elif isinstance(parsed_value, list):
                                    # Single list argument
                                    payload = {'__call__': 'args', 'args': [parsed_value]}
                                elif isinstance(parsed_value, dict) and parsed_value.get('__special__') == 'bad_version':
                                    # Special handling for first_bad_version problem - pass directly
                                    payload = parsed_value
                                else:
                                    payload = __wrap_call_payload(parsed_value, False)

                            if expected_is_string_output:
                                import io
                                import sys
                                _buf = io.StringIO()
                                _old_stdout = sys.stdout
                                sys.stdout = _buf
                                try:
                                    __call_user_function(payload)
                                    actual_value = _buf.getvalue().strip()
                                finally:
                                    sys.stdout = _old_stdout
                            else:
                                actual_value = __call_user_function(payload)

                        expected_value = __parse_literal(tc.get('expectedExpr'))
                    else:
                        input_json = tc.get('inputJson') or 'null'
                        payload_value = json.loads(input_json)
                        converted_to_linkedlist = False

                        if _NEEDS_LIST_AS_SINGLE_ARG:
                            if isinstance(payload_value, list) and len(payload_value) >= 2 and isinstance(payload_value[0], list):
                                payload = {'__call__': 'args', 'args': payload_value}
                            else:
                                payload = __wrap_call_payload(payload_value, False)
                        else:
                            payload = __wrap_call_payload(payload_value, True)
                        actual_value = __call_user_function(payload)
                        expected_json = tc.get('expectedJson') or 'null'
                        expected_value = json.loads(expected_json)

                    # Convert tree output if needed
                    if 'TreeNode' in globals() and isinstance(actual_value, TreeNode) and 'serialize_tree' in globals():
                        actual_value = serialize_tree(actual_value)

                    # Convert linked list output if needed
                    if hasattr(actual_value, 'random') and hasattr(actual_value, 'val') and 'random_list_to_list' in globals():
                        actual_value = random_list_to_list(actual_value)
                    elif 'linkedlist_to_list' in globals():
                        if hasattr(actual_value, 'next') and hasattr(actual_value, 'val') and not hasattr(actual_value, 'random'):
                            actual_value = linkedlist_to_list(actual_value)
                        elif actual_value is None and 'list_to_linkedlist' in globals():
                            actual_value = []

                    # Handle floating-point precision
                    def normalize_float_strings(s):
                        if not isinstance(s, str):
                            return s
                        import re
                        def round_float(match):
                            num_str = match.group(0)
                            try:
                                num = float(num_str)
                                rounded = round(num, 1)
                                if rounded == int(rounded):
                                    return str(int(rounded))
                                formatted = f"{rounded:.1f}".rstrip('0').rstrip('.')
                                return formatted
                            except (ValueError, OverflowError):
                                return num_str
                        return re.sub(r'\\b\\d+\\.\\d+\\b', round_float, s)

                    if isinstance(actual_value, str) and isinstance(expected_value, str):
                        normalized_actual = normalize_float_strings(actual_value)
                        normalized_expected = normalize_float_strings(expected_value)
                        passed = normalized_actual == normalized_expected
                    elif isinstance(actual_value, float) or isinstance(expected_value, float):
                        try:
                            actual_float = float(actual_value) if not isinstance(actual_value, float) else actual_value
                            expected_float = float(expected_value) if not isinstance(expected_value, float) else expected_value
                            passed = abs(actual_float - expected_float) < 0.05
                        except (ValueError, TypeError):
                            passed = actual_value == expected_value
                    else:
                        if isinstance(actual_value, list) and isinstance(expected_value, list):
                            if (len(actual_value) > 0 and isinstance(actual_value[0], list) and
                                len(expected_value) > 0 and isinstance(expected_value[0], list)):
                                try:
                                    actual_set = set(tuple(item) if isinstance(item, list) else item for item in actual_value)
                                    expected_set = set(tuple(item) if isinstance(item, list) else item for item in expected_value)
                                    passed = actual_set == expected_set
                                except TypeError:
                                    passed = actual_value == expected_value
                            else:
                                passed = actual_value == expected_value
                        else:
                            passed = actual_value == expected_value
                    results.append({
                        'test': idx,
                        'passed': bool(passed),
                        'input': raw_input if mode == 'snippet' else input_json,
                        'result': __json_safe(actual_value),
                        'expected': __json_safe(expected_value)
                    })
                except NameError as e:
                    if mode == 'snippet':
                        expected_value = __parse_literal(tc.get('expectedExpr'))
                        input_val = raw_input
                    else:
                        expected_value = json.loads(tc.get('expectedJson') or 'null')
                        input_val = input_json
                    results.append({
                        'test': idx,
                        'passed': False,
                        'input': input_val,
                        'error': f'Function not found: {str(e)}. Make sure your function is defined correctly.',
                        'expected': __json_safe(expected_value)
                    })
                except Exception as e:
                    if mode == 'snippet':
                        expected_value = __parse_literal(tc.get('expectedExpr'))
                        input_val = raw_input
                    else:
                        expected_value = json.loads(tc.get('expectedJson') or 'null')
                        input_val = input_json
                    results.append({
                        'test': idx,
                        'passed': False,
                        'input': input_val,
                        'error': str(e),
                        'expected': __json_safe(expected_value)
                    })

        # Always print results
        if not results or len(results) == 0:
            error_msg_parts = [f'No test results generated. Function name: {_FUNC_NAME}']
            error_msg_parts.append(f'Test cases count: {len(_TEST_CASES) if _TEST_CASES else 0}')
            func_exists = _FUNC_NAME in globals()
            error_msg_parts.append(f'Function in globals: {func_exists}')
            if not func_exists:
                available = [k for k in globals().keys() if callable(globals()[k]) and not k.startswith("_") and k not in ['print', 'json', 'ast', 'base64', 'sys', 'traceback', 'inspect']]
                error_msg_parts.append(f'Available functions: {available}')
            if _TEST_CASES:
                error_msg_parts.append(f'First test case: {str(_TEST_CASES[0])[:100]}')
            error_msg = ', '.join(error_msg_parts)
            results = [{
                'test': 0,
                'passed': False,
                'error': error_msg,
                'expected': 'N/A'
            }]

        try:
            output_json = json.dumps(results)
            print(output_json)
        except Exception as json_err:
            error_result = [{
                'test': 0,
                'passed': False,
                'error': f'Failed to serialize results: {str(json_err)}',
                'expected': 'N/A'
            }]
            print(json.dumps(error_result))
    except SyntaxError as e:
        error_result = [{
            'test': 0,
            'passed': False,
            'error': f'Syntax error in your code: {str(e)}. Please check your Python syntax.',
            'expected': 'N/A'
        }]
        print(json.dumps(error_result))
    except Exception as e:
        error_result = [{
            'test': 0,
            'passed': False,
            'error': f'Error setting up test harness: {str(e)}',
            'expected': 'N/A'
        }]
        print(json.dumps(error_result))
except Exception as outer_e:
    try:
        import json
        error_result = [{
            'test': 0,
            'passed': False,
            'error': f'Critical error in test harness (outer catch): {str(outer_e)}',
            'expected': 'N/A'
        }]
        print(json.dumps(error_result))
    except:
        print(f'[{{"test":0,"passed":false,"error":"Critical error: {str(outer_e)}","expected":"N/A"}}]')
`;
};

/**
 * Parse raw Python test output into structured results
 */
export const parsePythonTestResults = (rawOutput: string | undefined | null): { results: any[]; logs?: string; error?: string } => {
    try {
        const trimmed = (rawOutput || '').trim();

        // Look for JSON array of test results
        const testResultsMatch = trimmed.match(/\[\s*\{\s*"test"\s*:/);
        let jsonStr = '';
        let logs = '';

        if (testResultsMatch) {
            const startIdx = testResultsMatch.index!;
            // Everything before the JSON array is logs
            logs = trimmed.substring(0, startIdx).trim();

            const remainder = trimmed.substring(startIdx);

            let depth = 0;
            let endIdx = 0;
            for (let i = 0; i < remainder.length; i++) {
                if (remainder[i] === '[') depth++;
                if (remainder[i] === ']') depth--;
                if (depth === 0) {
                    endIdx = i + 1;
                    break;
                }
            }
            jsonStr = remainder.substring(0, endIdx);
        } else {
            const jsonMatch = trimmed.match(/\[[\s\S]*\]/);
            // If we found JSON but not specifically test results, treat prior content as logs too
            if (jsonMatch) {
                jsonStr = jsonMatch[0];
                logs = trimmed.substring(0, jsonMatch.index).trim();
            } else {
                jsonStr = trimmed;
            }
        }

        if (!jsonStr || jsonStr === '[]') {
            if (trimmed.includes('NameError') || trimmed.includes('is not defined')) {
                return {
                    results: [],
                    logs: trimmed,
                    error: `Function not found. Make sure your function is defined correctly.\n\nOutput: ${trimmed}`
                };
            }
            if (trimmed.includes('SyntaxError') || trimmed.includes('IndentationError')) {
                return {
                    results: [],
                    logs: trimmed,
                    error: `Syntax error in your code.\n\nOutput: ${trimmed}`
                };
            }
            return {
                results: [],
                logs: trimmed,
                error: `No test results returned. The test harness may have failed to execute.\n\nOutput: ${trimmed.substring(0, 500)}`
            };
        }

        const parsed = JSON.parse(jsonStr);
        if (Array.isArray(parsed)) {
            return { results: parsed, logs };
        }
        return { results: [], logs, error: 'Invalid test results format.' };
    } catch (error: any) {
        const trimmed = (rawOutput || '').trim();

        // Check for common Python errors
        if (trimmed.includes('NameError') || trimmed.includes('is not defined')) {
            return {
                results: [],
                logs: trimmed,
                error: `Function not found. Make sure your function is defined correctly.\n\nOutput: ${trimmed.substring(0, 500)}`
            };
        }
        if (trimmed.includes('SyntaxError') || trimmed.includes('IndentationError')) {
            return {
                results: [],
                logs: trimmed,
                error: `Syntax error in your code.\n\nOutput: ${trimmed.substring(0, 500)}`
            };
        }

        return {
            results: [],
            logs: trimmed,
            error: `Failed to parse test results: ${error.message}\n\nRaw output: ${trimmed.substring(0, 500)}`
        };
    }
};
