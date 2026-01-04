/**
 * Shared Code Preprocessing Utility
 * 
 * Handles tree/linked list problem detection and helper injection
 * Works with both ExerciseSection (modules) and DSAProblem (Smart Practice) formats
 */

import { ensureSolutionWrapper } from '../components/progressive-lesson/CodeEditorPanel';

export interface ProblemMetadata {
  id?: string;
  title?: string;
  instruction?: string;
  starterCode?: string;
  testCases?: Array<{
    input?: string;
    expectedOutput?: string | number | boolean | null;
  }>;
}

/**
 * Detect if a problem is a tree problem based on code and metadata
 */
export function detectTreeProblem(
  code: string,
  starterCode: string,
  metadata: ProblemMetadata
): boolean {
  // Check test cases for tree-like format (e.g., [5, null, 7])
  const hasTreeLikeTestCase = Array.isArray(metadata.testCases) && metadata.testCases.some(tc => {
    if (tc.expectedOutput === undefined || tc.expectedOutput === null) return false;
    const expected = typeof tc.expectedOutput === 'string'
      ? tc.expectedOutput
      : (JSON.stringify(tc.expectedOutput) || '');
    // Check if expected output looks like a serialized tree (must contain null/None)
    return expected && typeof expected === 'string' &&
      expected.startsWith('[') &&
      (expected.includes('null') || expected.includes('None'));
  });

  return (
    code.includes('TreeNode') ||
    starterCode.includes('TreeNode') ||
    metadata.title?.toLowerCase().includes('tree') ||
    metadata.id?.toLowerCase().includes('tree') ||
    hasTreeLikeTestCase
  );
}

/**
 * Detect if a problem is a linked list problem
 */
export function detectLinkedListProblem(
  code: string,
  starterCode: string,
  metadata: ProblemMetadata
): boolean {
  const codeHasListNode = code.includes('ListNode') || starterCode.includes('ListNode');
  const codeHasNodeClass = code.includes('class Node') || starterCode.includes('class Node');
  const codeHasRandomPointer = code.includes('.random') || starterCode.includes('.random');
  
  return Boolean(
    codeHasListNode ||
    codeHasNodeClass ||
    codeHasRandomPointer ||
    code.includes('.next') ||
    starterCode.includes('.next') ||
    metadata.title?.toLowerCase().includes('linked list') ||
    metadata.title?.toLowerCase().includes('sorted list') ||
    metadata.title?.toLowerCase().includes('random pointer') ||
    metadata.id?.toLowerCase().includes('linkedlist') ||
    metadata.id?.toLowerCase().includes('linked-list') ||
    metadata.instruction?.toLowerCase().includes('linked list')
  );
}

/**
 * Preprocess code for execution - adds tree/linked list helpers as needed
 * Works with both ExerciseSection and DSAProblem formats
 */
export function preprocessCodeForExecution(
  code: string,
  metadata: ProblemMetadata
): string {
  const starterCode = metadata.starterCode || '';
  let codeToUse = code;

  // Detect problem types
  const isLinkedListProblem = detectLinkedListProblem(code, starterCode, metadata);
  const isTreeProblem = !isLinkedListProblem && detectTreeProblem(code, starterCode, metadata);

  // Add linked list helpers if needed
  if (isLinkedListProblem || codeToUse.includes('ListNode') || codeToUse.includes('class Node')) {
    const needsNodeClass = code.includes('class Node') || starterCode.includes('class Node') ||
                          code.includes('.random') || starterCode.includes('.random');

    const linkedListHelper = `# ListNode definition
if 'ListNode' not in dir():
    class ListNode:
        def __init__(self, val=0, next=None):
            self.val = val
            self.next = next

# Helper: Convert list to linked list
def list_to_linkedlist(arr):
    if not arr:
        return None
    head = ListNode(arr[0])
    current = head
    for val in arr[1:]:
        current.next = ListNode(val)
        current = current.next
    return head

# Helper: Convert linked list to list
def linkedlist_to_list(head):
    result = []
    current = head
    while current:
        result.append(current.val)
        current = current.next
    return result`;

    const nodeClassHelper = needsNodeClass ? `

# Node definition (for problems with random pointer)
if 'Node' not in dir():
    class Node:
        def __init__(self, x: int, next: 'Node' = None, random: 'Node' = None):
            self.val = int(x)
            self.next = next
            self.random = random

# Helper: Convert [[val, random_idx], ...] to Node linked list with random pointers
def list_to_random_list(arr):
    if not arr:
        return None
    nodes = [Node(item[0]) for item in arr]
    for i in range(len(nodes) - 1):
        nodes[i].next = nodes[i + 1]
    for i, item in enumerate(arr):
        if len(item) > 1 and item[1] is not None:
            nodes[i].random = nodes[item[1]]
    return nodes[0] if nodes else None

# Helper: Convert Node linked list with random pointers to [[val, random_idx], ...]
def random_list_to_list(head):
    if not head:
        return []
    nodes = []
    node_to_idx = {}
    current = head
    idx = 0
    while current:
        nodes.append(current)
        node_to_idx[id(current)] = idx
        current = current.next
        idx += 1
    result = []
    for node in nodes:
        random_idx = node_to_idx.get(id(node.random)) if node.random else None
        result.append([node.val, random_idx])
    return result
` : '';

    codeToUse = `${linkedListHelper}${nodeClassHelper}\n${codeToUse}`;
  }

  // Add tree helpers if needed
  if (isTreeProblem || codeToUse.includes('TreeNode')) {
    const needsTreeNode = !codeToUse.includes('class TreeNode');
    const treeHelper = needsTreeNode ? `
import collections

# TreeNode definition
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
` : `
import collections
`;

    const serializeHelpers = `
# Helper: Deserialize list to Tree (LeetCode style)
def deserialize_tree(data):
    if not data:
        return None
    
    root = TreeNode(data[0])
    queue = collections.deque([root])
    i = 1
    while queue and i < len(data):
        node = queue.popleft()
        
        if i < len(data) and data[i] is not None:
            node.left = TreeNode(data[i])
            queue.append(node.left)
        i += 1
        
        if i < len(data) and data[i] is not None:
            node.right = TreeNode(data[i])
            queue.append(node.right)
        i += 1
    return root

# Helper: Serialize Tree to list (LeetCode style)
def serialize_tree(root):
    if not root:
        return []
    result = []
    queue = collections.deque([root])
    while queue:
        node = queue.popleft()
        if node:
            result.append(node.val)
            queue.append(node.left)
            queue.append(node.right)
        else:
            result.append(None)
    
    # Remove trailing Nones
    while result and result[-1] is None:
        result.pop()
    return result
`;
    codeToUse = `${treeHelper}${serializeHelpers}\n${codeToUse}`;
  }

  // Detect function name
  const allFuncMatches = Array.from(codeToUse.matchAll(/def\s+([A-Za-z_]\w*)\s*\(([^)]*)\)/g));
  const HELPER_FUNC_NAMES = new Set([
    'deserialize_tree', 'serialize_tree',
    'list_to_linkedlist', 'linkedlist_to_list',
    'list_to_random_list', 'random_list_to_list',
    'solution'
  ]);

  const userFunctions = allFuncMatches
    .filter(match => {
      const name = match[1];
      const params = match[2];
      const isSelfMethod = /\bself\b/.test(params);
      return !name.startsWith('__') &&
        !isSelfMethod &&
        !HELPER_FUNC_NAMES.has(name);
    })
    .map(match => match[1]);

  const defaultFuncName = userFunctions[0] || 'solution';

  // Only wrap with solution wrapper if we need conversion helpers (tree/linked list)
  // For simple problems without data structure conversions, return code as-is
  const effectiveIsLinkedListProblem = isLinkedListProblem || codeToUse.includes('ListNode') || codeToUse.includes('class Node');
  const effectiveIsTreeProblem = (isTreeProblem || codeToUse.includes('TreeNode')) && !effectiveIsLinkedListProblem;

  // Only wrap if we have conversion helpers to apply
  if (effectiveIsLinkedListProblem || effectiveIsTreeProblem) {
    return ensureSolutionWrapper({
      code: codeToUse,
      defaultFuncName,
      isLinkedListProblem: effectiveIsLinkedListProblem,
      isTreeProblem: effectiveIsTreeProblem,
      isTrieProblem: false,
      isListOfStringsExercise: false,
      isNestedDictTrieExercise: false,
      isDesignProblem: false,
      designClassName: '',
    });
  }

  // For simple problems without conversions, just add typing imports and return code as-is
  const typingImports = 'from typing import List, Dict, Optional, Tuple, Set, Any\n\n';
  return typingImports + codeToUse;
}

