# STACKS Problems

Total Problems: 22

---

## 1. Implement Stack using Queues

**Difficulty:** easy
**Concept:** stacks
**Family:** stacks:one-queue-stack

### Description

Implement a stack using only queue operations. Your stack should support push, pop, top, and empty operations.

### Examples

**Example 1:**
- Input: push(1), push(2), top(), pop(), empty()
- Output: 2, 2, false
- Explanation: After push(1) and push(2), top() returns 2. After pop(), the stack has one element so empty() returns false.

### Hints

1. Use one queue. When pushing, add element then rotate all previous elements to the back by dequeuing and enqueuing them.
2. After enqueuing new element, rotate n-1 times (where n is queue size) so new element is at front.
3. Pop and top are simple queue operations since we maintain LIFO order. Pop uses popleft(), top peeks at queue[0].

### Starter Code

### Solution

### Test Cases

**Test 1:** Top returns most recent
- Input: "push(1), push(2), top()"
- Expected: "2"

**Test 2:** Pop returns and removes top
- Input: "push(1), push(2), pop()"
- Expected: "2"

**Test 3:** Empty after removing all
- Input: "push(1), pop(), empty()"
- Expected: "true"

---

## 2. Min Stack

**Difficulty:** easy
**Concept:** stacks
**Family:** stacks:min-stack

### Description

Design a stack that supports push, pop, top, and retrieving the minimum element in constant time. All operations must be O(1).

### Examples

**Example 1:**
- Input: push(-2), push(0), push(-3), getMin(), pop(), getMin()
- Output: -3, -2
- Explanation: getMin() returns -3, then after pop(), getMin() returns -2.

### Hints

1. Maintain two stacks: one for all values, one for minimums. The min_stack keeps track of the minimum at each state.
2. Always push to main stack. For min_stack, only push if the value is <= current minimum (or if min_stack is empty).
3. Pop from main stack. If the popped value equals the top of min_stack, also pop from min_stack.

### Starter Code

### Solution

### Test Cases

**Test 1:** Min tracks current minimum
- Input: "push(-2), push(0), push(-3), getMin()"
- Expected: "-3"

**Test 2:** Min updates after pop
- Input: "push(-2), push(0), push(-3), getMin(), pop(), getMin()"
- Expected: "-3, -2"

**Test 3:** Handles duplicates
- Input: "push(5), push(5), getMin()"
- Expected: "5"

---

## 3. Evaluate Reverse Polish Notation

**Difficulty:** medium
**Concept:** stacks
**Family:** stacks:rpn

### Description

Evaluate an arithmetic expression in Reverse Polish Notation. Valid operators are +, -, *, /. Division should truncate toward zero.

### Examples

**Example 1:**
- Input: ["2","1","+","3","*"]
- Output: 9
- Explanation: ((2 + 1) * 3) = 9

### Hints

1. Use a stack to store numbers. When you see a number, push it. When you see an operator, pop two numbers.
2. For operators, pop b then a (order matters!), compute a op b, then push result back to stack.
3. Use int(a / b) for division to truncate toward zero correctly for negative numbers.

### Starter Code

### Solution

### Test Cases

**Test 1:** ((2+1)*3)
- Input: "[\"2\",\"1\",\"+\",\"3\",\"*\"]"
- Expected: "9"

**Test 2:** (4+(13/5))
- Input: "[\"4\",\"13\",\"5\",\"/\",\"+\"]"
- Expected: "6"

**Test 3:** Complex expression
- Input: "[\"10\",\"6\",\"9\",\"3\",\"+\",\"-11\",\"*\",\"/\",\"*\",\"17\",\"+\",\"5\",\"+\"]"
- Expected: "22"

---

## 4. Valid Parentheses

**Difficulty:** easy
**Concept:** stacks
**Family:** stacks:parentheses-balance

### Description

Given a string containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. Brackets must close in the correct order.

### Examples

**Example 1:**
- Input: s = "()[]{}"
- Output: true

**Example 2:**
- Input: s = "([)]"
- Output: false

### Hints

1. Use a stack to keep track of opening brackets. Push '(', '{', '[' onto the stack.
2. Create a dictionary mapping closing brackets to opening: {')':'(', '}':'{', ']':'['}. Check if stack top matches.
3. If you see a closing bracket and stack is empty, return False. After processing all chars, stack must be empty.

### Starter Code

### Solution

### Test Cases

**Test 1:** Simple valid
- Input: "\"()\""
- Expected: "true"

**Test 2:** Multiple types
- Input: "\"()[]{}\""
- Expected: "true"

**Test 3:** Mismatch
- Input: "\"(]\""
- Expected: "false"

**Test 4:** Wrong order
- Input: "\"([)]\""
- Expected: "false"

**Test 5:** Nested valid
- Input: "\"{[]}\""
- Expected: "true"

---

## 5. Next Greater Element I

**Difficulty:** easy
**Concept:** stacks
**Family:** stacks:next-greater

### Description

You are given two arrays nums1 and nums2. For each element in nums1, find the next greater element in nums2. Return -1 if it doesn't exist.

### Examples

**Example 1:**
- Input: nums1 = [4,1,2], nums2 = [1,3,4,2]
- Output: [-1,3,-1]
- Explanation: For 4, there is no next greater. For 1, next greater is 3. For 2, no next greater.

### Hints

1. Use a decreasing monotonic stack. Process nums2 from right to left, maintaining stack of potential next greater elements.
2. For each element in nums2, pop smaller elements from stack, then map[element] = stack top (or -1 if empty).
3. After building the map from nums2, iterate through nums1 and look up each element in the map.

### Starter Code

### Solution

### Test Cases

**Test 1:** Example case
- Input: "[4,1,2], [1,3,4,2]"
- Expected: "[-1, 3, -1]"

**Test 2:** Increasing sequence
- Input: "[2,4], [1,2,3,4]"
- Expected: "[3, -1]"

---

## 6. Daily Temperatures

**Difficulty:** medium
**Concept:** stacks
**Family:** stacks:monotonic-temperatures

### Description

Given an array of daily temperatures, return an array where each element is the number of days you have to wait until a warmer temperature. If there is no future day, put 0 instead.

### Examples

**Example 1:**
- Input: temperatures = [73,74,75,71,69,72,76,73]
- Output: [1,1,4,2,1,1,0,0]
- Explanation: For 73, next day is warmer (1 day). For 74, next day is warmer (1 day). For 75, have to wait 4 days for 76.

### Hints

1. Use a stack to store indices (not temperatures). This allows calculating the number of days difference.
2. Maintain a decreasing stack. When you find a warmer day, pop all cooler days from stack and update their results.
3. When popping index i with current index j, the answer for day i is j - i days.

### Starter Code

### Solution

### Test Cases

**Test 1:** Example case
- Input: "[73,74,75,71,69,72,76,73]"
- Expected: "[1, 1, 4, 2, 1, 1, 0, 0]"

**Test 2:** Increasing temps
- Input: "[30,40,50,60]"
- Expected: "[1, 1, 1, 0]"

**Test 3:** Strictly increasing
- Input: "[30,60,90]"
- Expected: "[1, 1, 0]"

---

## 7. Next Greater Element II (Circular)

**Difficulty:** medium
**Concept:** stacks
**Family:** stacks:next-greater-circular

### Description

Given a circular integer array, return the next greater number for every element. The circular nature means you can search for the next greater element by wrapping around to the beginning.

### Examples

**Example 1:**
- Input: nums = [1,2,1]
- Output: [2,-1,2]
- Explanation: First 1 -> 2 (next). 2 has no greater. Last 1 -> 2 (wraps to beginning).

### Hints

1. Process the array twice by iterating from 0 to 2*n-1, using index i % n to access elements.
2. Only update result[i] on first pass (when i < n). Second pass is just to help find next greater for early elements.
3. Same decreasing stack pattern. Pop and update when finding greater element.

### Starter Code

### Solution

### Test Cases

**Test 1:** Circular wrapping
- Input: "[1,2,1]"
- Expected: "[2, -1, 2]"

**Test 2:** Mixed case
- Input: "[1,2,3,4,3]"
- Expected: "[2, 3, 4, -1, 4]"

---

## 8. Largest Rectangle in Histogram

**Difficulty:** hard
**Concept:** stacks

### Description

Given an array of integers representing histogram bar heights where the width of each bar is 1, find the area of the largest rectangle in the histogram.

### Examples

**Example 1:**
- Input: heights = [2,1,5,6,2,3]
- Output: 10
- Explanation: The largest rectangle is formed by heights 5 and 6 with area = 2 * 5 = 10.

### Hints

1. Use a stack to maintain indices in increasing order of heights. When you find a smaller height, it's time to calculate area.
2. When popping index i, the height is heights[i]. The width is current_index - stack_top - 1 (or current_index if stack empty).
3. After processing all bars, pop remaining indices from stack and calculate their areas with width extending to the end.

### Starter Code

### Solution

### Test Cases

**Test 1:** Example case
- Input: "[2,1,5,6,2,3]"
- Expected: "10"

**Test 2:** Two bars
- Input: "[2,4]"
- Expected: "4"

**Test 3:** Valley shape
- Input: "[2,1,2]"
- Expected: "3"

---

## 9. Baseball Game

**Difficulty:** easy
**Concept:** stacks

### Description

You're keeping score for a baseball game. Given a list of strings representing operations, calculate the sum of scores. Operations: integer (score), '+' (sum of last 2), 'D' (double last), 'C' (cancel last).

### Examples

**Example 1:**
- Input: ops = ["5","2","C","D","+"]
- Output: 30
- Explanation: 5, then 2, cancel 2 (back to 5), double 5 (10), sum last two 5+10 (15). Total: 5+10+15=30

### Hints

1. Use stack to keep valid scores. For integers, push to stack. For 'C', pop last score.
2. For 'D', push 2 * stack[-1]. For '+', push stack[-1] + stack[-2]. All operations work on the stack.
3. After processing all operations, return sum(stack).

### Starter Code

### Solution

### Test Cases

**Test 1:** Example case
- Input: "[\"5\",\"2\",\"C\",\"D\",\"+\"]"
- Expected: "30"

**Test 2:** With negatives
- Input: "[\"5\",\"-2\",\"4\",\"C\",\"D\",\"9\",\"+\",\"+\"]"
- Expected: "27"

---

## 10. Remove All Adjacent Duplicates In String

**Difficulty:** easy
**Concept:** stacks

### Description

Given a string, repeatedly remove adjacent duplicate characters. Return the final string after all such duplicate removals have been made.

### Examples

**Example 1:**
- Input: s = "abbaca"
- Output: "ca"
- Explanation: Remove "bb" -> "aaca", then remove "aa" -> "ca"

### Hints

1. Use stack to track characters. When you see a char, check if it equals the top of stack.
2. If current char equals stack top, pop (they cancel out). Otherwise, push current char.
3. Join stack characters into a string: ''.join(stack).

### Starter Code

### Solution

### Test Cases

**Test 1:** Multiple removals
- Input: "\"abbaca\""
- Expected: "\"ca\""

**Test 2:** Middle duplicates
- Input: "\"azxxzy\""
- Expected: "\"ay\""

---

## 11. Simplify Path

**Difficulty:** medium
**Concept:** stacks

### Description

Given an absolute path for a Unix-style file system, simplify it. The path starts with '/', '..' means go up one level, and '.' means current directory.

### Examples

**Example 1:**
- Input: path = "/home/user/Documents/../Pictures"
- Output: "/home/user/Pictures"
- Explanation: Going up from Documents brings us to user, then we enter Pictures.

### Hints

1. Split path by '/' to get components. Process each component: ignore empty strings and '.'.
2. Use stack for directories. For regular name, push to stack. For '..', pop from stack (if not empty).
3. Join stack with '/': '/' + '/'.join(stack). Handle edge case of empty stack (return '/').

### Starter Code

### Solution

### Test Cases

**Test 1:** Trailing slash
- Input: "\"/home/\""
- Expected: "\"/home\""

**Test 2:** With . and ..
- Input: "\"/a/./b/../../c/\""
- Expected: "\"/c\""

**Test 3:** Multiple slashes
- Input: "\"/a//b////c/d//././/..\""
- Expected: "\"/a/b/c\""

---

## 12. Decode String

**Difficulty:** medium
**Concept:** stacks

### Description

Given an encoded string with pattern k[encoded_string], where k is a number indicating how many times to repeat the encoded_string. Decode and return it.

### Examples

**Example 1:**
- Input: s = "3[a]2[bc]"
- Output: "aaabcbc"

**Example 2:**
- Input: s = "3[a2[c]]"
- Output: "accaccacc"

### Hints

1. Use two stacks: one for numbers, one for strings. When you see '[', push current num and string onto stacks.
2. When you see ']', pop num and prev_string. Repeat current_string num times and append to prev_string.
3. Build current_string character by character. Build current_num digit by digit (could be multi-digit like 100).

### Starter Code

### Solution

### Test Cases

**Test 1:** Simple pattern
- Input: "\"3[a]2[bc]\""
- Expected: "\"aaabcbc\""

**Test 2:** Nested pattern
- Input: "\"3[a2[c]]\""
- Expected: "\"accaccacc\""

**Test 3:** Multiple patterns
- Input: "\"2[abc]3[cd]ef\""
- Expected: "\"abcabccdcdcdef\""

---

## 13. Asteroid Collision

**Difficulty:** medium
**Concept:** stacks

### Description

We have asteroids in a row. Each asteroid moves at the same speed. Positive value means moving right, negative means moving left. When they collide, smaller one explodes. Find the final state.

### Examples

**Example 1:**
- Input: asteroids = [5,10,-5]
- Output: [5,10]
- Explanation: The 10 and -5 collide, -5 explodes. 5 and 10 never collide.

### Hints

1. Use stack to track asteroids moving right (positive). Left-moving asteroids (negative) may collide with them.
2. For negative asteroid, while stack top is positive and smaller, pop it (explodes). If equal, both explode. If negative survives, add it.
3. Positive asteroids go to stack. Negative either collide away, or get added if they survive or stack is empty/negative.

### Starter Code

### Solution

### Test Cases

**Test 1:** Simple collision
- Input: "[5,10,-5]"
- Expected: "[5, 10]"

**Test 2:** No collision
- Input: "[-2,-1,1,2]"
- Expected: "[-2, -1, 1, 2]"

**Test 3:** Chain collision
- Input: "[10,2,-5]"
- Expected: "[10]"

---

## 14. Remove K Digits

**Difficulty:** medium
**Concept:** stacks

### Description

Given a non-negative integer num represented as a string and an integer k, remove k digits from num to make the smallest possible number. Return the result as a string without leading zeros.

### Examples

**Example 1:**
- Input: num = "1432219", k = 3
- Output: "1219"
- Explanation: Remove 4, 3, 2 to get smallest number.

### Hints

1. Use monotonic increasing stack. For each digit, pop larger digits from stack while k > 0.
2. When you see a smaller digit, remove previous larger digits (they make number bigger). This greedy choice gives smallest result.
3. If k > 0 after processing, remove from end. Remove leading zeros. If empty, return '0'.

### Starter Code

### Solution

### Test Cases

**Test 1:** Example case
- Input: "\"1432219\", 3"
- Expected: "\"1219\""

**Test 2:** Leading zeros
- Input: "\"10200\", 1"
- Expected: "\"200\""

**Test 3:** Remove all
- Input: "\"10\", 2"
- Expected: "\"0\""

---

## 15. Trapping Rain Water (Stack Approach)

**Difficulty:** hard
**Concept:** stacks

### Description

Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining. Use the stack approach.

### Examples

**Example 1:**
- Input: height = [0,1,0,2,1,0,1,3,2,1,2,1]
- Output: 6
- Explanation: Water trapped in valleys between bars.

### Hints

1. Use stack to store indices of bars. When you find a bar higher than stack top, you can trap water.
2. When popping index i, water height is min(height[stack top], height[current]) - height[i]. Width is distance between bars.
3. Calculate water layer by layer. Each time you pop, you're filling one layer of water between left and right boundaries.

### Starter Code

### Solution

### Test Cases

**Test 1:** Example case
- Input: "[0,1,0,2,1,0,1,3,2,1,2,1]"
- Expected: "6"

**Test 2:** Large valley
- Input: "[4,2,0,3,2,5]"
- Expected: "9"

---

## 16. Score of Parentheses

**Difficulty:** medium
**Concept:** stacks

### Description

Given a balanced parentheses string, compute the score. Rules: () = 1, AB = A + B (concatenation), (A) = 2 * A (nesting).

### Examples

**Example 1:**
- Input: s = "(()(()))"
- Output: 6
- Explanation: (()) = 2, () = 1, so (()(())) = 2 * (1 + 2) = 6

### Hints

1. Use stack to track scores at each level. Push 0 when you see '(' (placeholder for this level).
2. On ')', pop the score for current level. If it's 0 (empty pair), score is 1. Otherwise, double it. Add to new stack top.
3. Each level accumulates its score. When closing, add current level's score to parent level. Final answer is stack[0].

### Starter Code

### Solution

### Test Cases

**Test 1:** Simple pair
- Input: "\"()\""
- Expected: "1"

**Test 2:** Nested
- Input: "\"(())\""
- Expected: "2"

**Test 3:** Concatenation
- Input: "\"()()\""
- Expected: "2"

**Test 4:** Complex
- Input: "\"(()(()))\""
- Expected: "6"

---

## 17. Basic Calculator

**Difficulty:** hard
**Concept:** stacks

### Description

Implement a basic calculator to evaluate a string expression containing digits, +, -, (, ), and spaces. No multiplication or division.

### Examples

**Example 1:**
- Input: s = "(1+(4+5+2)-3)+(6+8)"
- Output: 23

### Hints

1. Use stack to save state when entering parentheses. Push (current_result, sign) on '('.
2. Track current number and sign (1 or -1). When you complete a number, add sign * number to result.
3. On '(', push result and sign, reset both. On ')', pop old_result and old_sign, compute: old_result + old_sign * current_result.
4. O(n) time where n is string length - process each character once. O(n) space for stack in worst case with nested parentheses.

### Starter Code

### Solution

### Test Cases

**Test 1:** Simple addition
- Input: "\"1 + 1\""
- Expected: "2"

**Test 2:** Mixed operations
- Input: "\" 2-1 + 2 \""
- Expected: "3"

**Test 3:** With parentheses
- Input: "\"(1+(4+5+2)-3)+(6+8)\""
- Expected: "23"

---

## 18. Basic Calculator II

**Difficulty:** medium
**Concept:** stacks

### Description

Implement a calculator to evaluate a string expression containing non-negative integers, +, -, *, / operators and spaces. Integer division should truncate toward zero.

### Examples

**Example 1:**
- Input: s = "3+2*2"
- Output: 7

**Example 2:**
- Input: s = " 3/2 "
- Output: 1

**Example 3:**
- Input: s = " 3+5 / 2 "
- Output: 5

### Hints

1. Use stack to store numbers with their signs. Addition and subtraction are delayed, multiplication and division are immediate.
2. For + or -, push current_number to stack (with sign). For * or /, pop from stack, compute with current_number, push result back.
3. Track last operator seen (initially '+'). When you see a new operator or reach end, process the current number using last operator.
4. Initialize operator='+', number=0, stack=[]. For each char: build number from digits, when operator or end: apply last operator (push ±number for +/-, pop and compute for */), update operator.
5. Handle spaces by skipping. At end of string, process last number. For division, use int(a/b) to truncate toward zero.
6. O(n) time - single pass through string. O(n) space for stack in worst case (all additions/subtractions).

### Starter Code

### Solution

### Test Cases

**Test 1:** Multiplication precedence
- Input: "\"3+2*2\""
- Expected: "7"

**Test 2:** Integer division
- Input: "\" 3/2 \""
- Expected: "1"

**Test 3:** Mixed operators
- Input: "\" 3+5 / 2 \""
- Expected: "5"

**Test 4:** Subtraction and division
- Input: "\"14-3/2\""
- Expected: "13"

**Test 5:** Multiple divisions
- Input: "\"100000000/1/2/3/4/5/6/7/8/9/10\""
- Expected: "27"

**Test 6:** Left to right evaluation
- Input: "\"1-1+1\""
- Expected: "1"

---

## 19. Basic Calculator III

**Difficulty:** hard
**Concept:** stacks

### Description

Implement a calculator to evaluate a string expression with non-negative integers, +, -, *, /, and parentheses ( ). Integer division should truncate toward zero.

### Examples

**Example 1:**
- Input: s = "1+1"
- Output: 2

**Example 2:**
- Input: s = "6-4/2"
- Output: 4

**Example 3:**
- Input: s = "2*(5+5*2)/3+(6/2+8)"
- Output: 21

### Hints

1. This problem combines Basic Calculator I (parentheses handling) and II (operator precedence). Use recursion to handle parentheses, and stack for operators.
2. Create helper function that processes substring. When you see '(', recursively evaluate the expression inside, then continue with the result.
3. Pass index as parameter to track position. When entering '(', increment index and recurse. When seeing ')', return current result and updated index.
4. Within each level (between parentheses), use same logic as Calculator II: stack for numbers, apply * and / immediately, delay + and -.
5. Helper(s, i): while i < len(s): if digit, build num; if '(', result = helper(s, i+1); if ')', return (sum(stack), i); if operator, process last num with operator, update operator.
6. O(n) time - each character processed once despite recursion. O(n) space for call stack and internal stack in worst case.

### Starter Code

### Solution

### Test Cases

**Test 1:** Simple addition
- Input: "\"1+1\""
- Expected: "2"

**Test 2:** Division precedence
- Input: "\"6-4/2\""
- Expected: "4"

**Test 3:** Complex with parentheses
- Input: "\"2*(5+5*2)/3+(6/2+8)\""
- Expected: "21"

**Test 4:** Nested operations
- Input: "\"(2+6*3+5-(3*14/7+2)*5)+3\""
- Expected: "-12"

**Test 5:** Single zero
- Input: "\"0\""
- Expected: "0"

**Test 6:** Parentheses after operator
- Input: "\"1-(5)\""
- Expected: "-4"

---

## 20. Maximal Rectangle

**Difficulty:** hard
**Concept:** stacks

### Description

Given a binary matrix filled with 0's and 1's, find the largest rectangle containing only 1's and return its area. This reduces to the Largest Rectangle in Histogram problem.

### Examples

**Example 1:**
- Input: matrix = [["1","0","1","0","0"],["1","0","1","1","1"],["1","1","1","1","1"],["1","0","0","1","0"]]
- Output: 6
- Explanation: The maximal rectangle is formed by rows 1-2, cols 2-4, with area 2*3=6.

### Hints

1. Transform each row into a histogram problem. For each row, heights[j] = number of consecutive 1's above (including current row) at column j.
2. Initialize heights array with zeros. For each row: if matrix[i][j]=='1', heights[j]++; else heights[j]=0. This gives histogram at each row.
3. For each row's histogram, use Largest Rectangle in Histogram algorithm (monotonic increasing stack) to find max area. Track overall maximum.
4. For histogram: maintain increasing stack of indices. When heights[i] < heights[stack[-1]], pop and calculate area: height=heights[popped], width=i-stack[-1]-1 (or i if stack empty).
5. 1) Initialize heights=[0]*cols, max_area=0. 2) For each row: update heights (increment if '1', reset to 0 if '0'). 3) Calculate max rectangle in current histogram. 4) Update max_area. 5) Return max_area.
6. O(m*n) time where m=rows, n=cols. Each cell processed once for histogram, then O(n) for each row's histogram calculation. O(n) space for heights array and stack.

### Starter Code

### Solution

### Test Cases

**Test 1:** Example matrix
- Input: "[[\"1\",\"0\",\"1\",\"0\",\"0\"],[\"1\",\"0\",\"1\",\"1\",\"1\"],[\"1\",\"1\",\"1\",\"1\",\"1\"],[\"1\",\"0\",\"0\",\"1\",\"0\"]]"
- Expected: "6"

**Test 2:** Single zero
- Input: "[[\"0\"]]"
- Expected: "0"

**Test 3:** Single one
- Input: "[[\"1\"]]"
- Expected: "1"

**Test 4:** Full rectangle
- Input: "[[\"1\",\"1\"],[\"1\",\"1\"]]"
- Expected: "4"

**Test 5:** Diagonal ones
- Input: "[[\"0\",\"1\"],[\"1\",\"0\"]]"
- Expected: "1"

**Test 6:** Complex pattern
- Input: "[[\"1\",\"0\",\"1\",\"1\",\"1\"],[\"0\",\"1\",\"0\",\"1\",\"0\"],[\"1\",\"1\",\"1\",\"1\",\"1\"],[\"1\",\"1\",\"1\",\"1\",\"0\"]]"
- Expected: "6"

---

## 21. Sum of Subarray Minimums

**Difficulty:** medium
**Concept:** stacks

### Description

Given an array of integers, find the sum of min(b) for every contiguous subarray b. Return the result modulo 10^9 + 7.

### Examples

**Example 1:**
- Input: arr = [3,1,2,4]
- Output: 17
- Explanation: Subarrays are [3],[1],[2],[4],[3,1],[1,2],[2,4],[3,1,2],[1,2,4],[3,1,2,4]. Minimums are 3,1,2,4,1,1,2,1,1,1. Sum = 17.

### Hints

1. Each element contributes to answer based on how many subarrays have it as minimum. Need to count left and right extensions.
2. Use increasing stack to find previous less element (PLE) and next less element (NLE) for each element.
3. For element at i: left = i - PLE[i], right = NLE[i] - i. Contribution = arr[i] * left * right. Sum all contributions.

### Starter Code

### Solution

### Test Cases

**Test 1:** Example case
- Input: "[3,1,2,4]"
- Expected: "17"

**Test 2:** Larger array
- Input: "[11,81,94,43,3]"
- Expected: "444"

---

## 22. Stock Span Problem

**Difficulty:** medium
**Concept:** stacks

### Description

Design an algorithm to collect daily price quotes for a stock and return the span of the stock's price for the current day. The span is the max number of consecutive days (up to today) where price <= today's price.

### Examples

**Example 1:**
- Input: [100,80,60,70,60,75,85]
- Output: [1,1,1,2,1,4,6]
- Explanation: On day 6, the span is 6 because all previous days had price <= 85.

### Hints

1. Use stack to store (price, span) pairs. Stack maintains decreasing prices from bottom to top.
2. For new price, pop all stack elements with price <= current. Add their spans. Current span = 1 + sum of popped spans.
3. Stack always contains prices in decreasing order. This allows efficient lookup of previous greater prices.

### Starter Code

### Solution

### Test Cases

**Test 1:** Example sequence
- Input: "[100,80,60,70,60,75,85]"
- Expected: "[1, 1, 1, 2, 1, 4, 6]"

**Test 2:** Increasing prices
- Input: "[31,41,48,59,79]"
- Expected: "[1, 2, 3, 4, 5]"

---
