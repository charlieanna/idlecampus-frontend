# PYTHON-FUNDAMENTALS Problems

Total Problems: 18

---

## 1. For Loop with Range

**Difficulty:** easy
**Concept:** python-fundamentals

### Description

Use for loop with range() to create a multiplication table for a given number up to n.

### Examples

**Example 1:**
- Input: num=3, n=4
- Output: [3, 6, 9, 12]
- Explanation: 3*1=3, 3*2=6, 3*3=9, 3*4=12

### Hints

1. for i in range(1, n+1): generates 1,2,3...n
2. result.append(num * i)
3. for i in range(1, n+1): result.append(num * i)

### Starter Code

### Solution

### Test Cases

**Test 1:** 3 times table
- Input: "(3, 4)"
- Expected: "[3, 6, 9, 12]"

**Test 2:** 5 times table
- Input: "(5, 3)"
- Expected: "[5, 10, 15]"

**Test 3:** Single multiple
- Input: "(7, 1)"
- Expected: "[7]"

---

## 2. While Loop - Digit Counter

**Difficulty:** easy
**Concept:** python-fundamentals

### Description

Count the number of digits in a positive integer using a while loop.

### Examples

**Example 1:**
- Input: n = 12345
- Output: 5
- Explanation: The number has 5 digits

### Hints

1. while n > 0: keep dividing
2. n = n // 10 removes last digit
3. count += 1 in each loop iteration

### Starter Code

### Solution

### Test Cases

**Test 1:** 5 digit number
- Input: "12345"
- Expected: "5"

**Test 2:** Single digit
- Input: "9"
- Expected: "1"

**Test 3:** Number with zeros
- Input: "1000"
- Expected: "4"

---

## 3. List Slicing - Advanced Indexing

**Difficulty:** easy
**Concept:** python-fundamentals

### Description

Master list slicing: reverse lists, get every nth element, slice with negative indices.

### Examples

**Example 1:**
- Input: [1,2,3,4,5,6,7,8,9,10]
- Output: {'reversed': [10,9,8,7,6,5,4,3,2,1], 'every_3rd': [3,6,9], 'last_3': [8,9,10]}
- Explanation: Various slicing operations on the same list

### Hints

1. lst[::-1] reverses the list
2. lst[2::3] starts at index 2, takes every 3rd
3. lst[-3:] gets last 3 elements

### Starter Code

### Test Cases

**Test 1:** Full list
- Input: "[1,2,3,4,5,6,7,8,9,10]"
- Expected: "{'reversed': [10,9,8,7,6,5,4,3,2,1], 'every_3rd': [3,6,9], 'last_3': [8,9,10]}"

**Test 2:** Short list
- Input: "[1,2,3]"
- Expected: "{'reversed': [3,2,1], 'every_3rd': [3], 'last_3': [1,2,3]}"

---

## 4. Dictionary Character Frequency

**Difficulty:** easy
**Concept:** python-fundamentals

### Description

Create a function that counts the frequency of each character in a string and returns a dictionary.

### Examples

**Example 1:**
- Input: s = 'hello'
- Output: {'h': 1, 'e': 1, 'l': 2, 'o': 1}
- Explanation: Each character mapped to its frequency

### Hints

1. Start with freq = {} empty dictionary
2. Use freq[char] = freq.get(char, 0) + 1 to avoid KeyError
3. for char in s: freq[char] = freq.get(char, 0) + 1; return freq

### Starter Code

### Test Cases

**Test 1:** Basic string
- Input: "'hello'"
- Expected: "{'h': 1, 'e': 1, 'l': 2, 'o': 1}"

**Test 2:** Repeated char
- Input: "'aaa'"
- Expected: "{'a': 3}"

**Test 3:** Empty string
- Input: "''"
- Expected: "{}"

---

## 5. Set Operations - Union and Intersection

**Difficulty:** easy
**Concept:** python-fundamentals

### Description

Practice set operations: create union and intersection of two lists.

### Examples

**Example 1:**
- Input: list1=[1,2,3], list2=[2,3,4]
- Output: {'union': {1,2,3,4}, 'intersection': {2,3}}
- Explanation: Union contains all unique elements, intersection contains common elements

### Hints

1. set1 = set(list1); set2 = set(list2)
2. Union: set1 | set2; Intersection: set1 & set2
3. return {'union': set(list1) | set(list2), 'intersection': set(list1) & set(list2)}

### Starter Code

### Test Cases

**Test 1:** Basic sets
- Input: "([1,2,3], [2,3,4])"
- Expected: "{'union': {1,2,3,4}, 'intersection': {2,3}}"

**Test 2:** No overlap
- Input: "([1,2], [3,4])"
- Expected: "{'union': {1,2,3,4}, 'intersection': set()}"

**Test 3:** Duplicates
- Input: "([1,1,2], [2,2,3])"
- Expected: "{'union': {1,2,3}, 'intersection': {2}}"

---

## 6. List Comprehension Mastery

**Difficulty:** easy
**Concept:** python-fundamentals

### Description

Create a function that takes a list of numbers and returns a list of their squares, but only for even numbers. Use list comprehension.

### Examples

**Example 1:**
- Input: nums = [1, 2, 3, 4, 5, 6]
- Output: [4, 16, 36]
- Explanation: Squares of even numbers: 2²=4, 4²=16, 6²=36

### Hints

1. List comprehension format: [expression for item in list if condition]
2. Check if a number is even using num % 2 == 0
3. return [x*x for x in nums if x % 2 == 0]

### Starter Code

### Solution

### Test Cases

**Test 1:** Mixed numbers
- Input: "[1,2,3,4,5,6]"
- Expected: "[4, 16, 36]"

**Test 2:** All odd
- Input: "[1,3,5]"
- Expected: "[]"

**Test 3:** All even
- Input: "[2,4,6,8]"
- Expected: "[4, 16, 36, 64]"

---

## 7. Lambda and Filter Functions

**Difficulty:** easy
**Concept:** python-fundamentals

### Description

Filter a list to keep only positive numbers using lambda and filter functions.

### Examples

**Example 1:**
- Input: nums = [-2, -1, 0, 1, 2]
- Output: [1, 2]
- Explanation: Only positive numbers are kept

### Hints

1. lambda x: x > 0 creates anonymous function checking if x is positive
2. filter(lambda x: x > 0, nums) filters elements where condition is True
3. return list(filter(lambda x: x > 0, nums))

### Starter Code

### Test Cases

**Test 1:** Mixed numbers
- Input: "[-2,-1,0,1,2]"
- Expected: "[1, 2]"

**Test 2:** All positive
- Input: "[1,2,3]"
- Expected: "[1, 2, 3]"

**Test 3:** No positives
- Input: "[-1,-2,-3]"
- Expected: "[]"

---

## 8. String Methods - Text Processing

**Difficulty:** easy
**Concept:** python-fundamentals

### Description

Use Python string methods to clean and format text: strip whitespace, capitalize words, replace characters.

### Examples

**Example 1:**
- Input: '  hello   world  '
- Output: 'Hello World'
- Explanation: Strip spaces, capitalize words

### Hints

1. ' '.join(text.split()) removes extra whitespace
2. .title() capitalizes each word
3. return ' '.join(text.split()).title()

### Starter Code

### Test Cases

**Test 1:** Clean spaces
- Input: "'  hello   world  '"
- Expected: "'Hello World'"

**Test 2:** Capitalize
- Input: "'python programming'"
- Expected: "'Python Programming'"

---

## 9. F-Strings - String Formatting

**Difficulty:** easy
**Concept:** python-fundamentals

### Description

Practice f-string formatting: embed variables, format numbers, create dynamic strings.

### Examples

**Example 1:**
- Input: name='Alice', age=25, score=95.5
- Output: 'Alice is 25 years old and scored 95.50'
- Explanation: Variables embedded in f-string with number formatting

### Hints

1. f-strings use f'text {variable}' syntax
2. {score:.2f} formats to 2 decimal places
3. return f'{name} is {age} years old and scored {score:.2f}'

### Starter Code

### Test Cases

**Test 1:** Basic formatting
- Input: "('Alice', 25, 95.5)"
- Expected: "'Alice is 25 years old and scored 95.50'"

**Test 2:** Integer score
- Input: "('Bob', 30, 88.0)"
- Expected: "'Bob is 30 years old and scored 88.00'"

---

## 10. Enumerate and Zip - Parallel Lists

**Difficulty:** easy
**Concept:** python-fundamentals

### Description

Use enumerate to get index with value, and zip to iterate over parallel lists together.

### Examples

**Example 1:**
- Input: names=['Alice','Bob'], scores=[95,88]
- Output: ['0: Alice got 95', '1: Bob got 88']
- Explanation: Combine index, name, and score using enumerate and zip

### Hints

1. enumerate(list) gives (index, value) pairs
2. zip(names, scores) pairs elements from both lists
3. for i, (name, score) in enumerate(zip(names, scores))

### Starter Code

### Test Cases

**Test 1:** Two students
- Input: "(['Alice','Bob'], [95,88])"
- Expected: "['0: Alice got 95', '1: Bob got 88']"

**Test 2:** One student
- Input: "(['Charlie'], [100])"
- Expected: "['0: Charlie got 100']"

---

## 11. Classes and Objects - Bank Account

**Difficulty:** easy
**Concept:** python-fundamentals

### Description

Create a BankAccount class with deposit, withdraw, and get_balance methods. Practice OOP basics.

### Examples

**Example 1:**
- Input: account = BankAccount(100); account.deposit(50); account.get_balance()
- Output: 150
- Explanation: Initial 100 + deposit 50 = 150

### Hints

1. self.balance = initial_balance in __init__
2. self.balance += amount for deposit
3. if amount <= self.balance: self.balance -= amount; return True

### Starter Code

### Solution

### Test Cases

**Test 1:** Deposit
- Input: "BankAccount(100).deposit(50).get_balance()"
- Expected: "150"

**Test 2:** Withdraw
- Input: "BankAccount(100).withdraw(30).get_balance()"
- Expected: "70"

---

## 12. Counter - Word Frequency

**Difficulty:** easy
**Concept:** python-fundamentals

### Description

Count word frequencies in a sentence using Counter from collections.

### Examples

**Example 1:**
- Input: 'hello world hello'
- Output: {'hello': 2, 'world': 1}
- Explanation: 'hello' appears twice, 'world' once

### Hints

1. words = sentence.split() splits by spaces
2. Counter(words) counts word occurrences
3. return dict(Counter(sentence.split()))

### Starter Code

### Test Cases

**Test 1:** Simple sentence
- Input: "'hello world hello'"
- Expected: "{'hello': 2, 'world': 1}"

**Test 2:** Repeated word
- Input: "'python python python'"
- Expected: "{'python': 3}"

**Test 3:** Single letters
- Input: "'a b c d'"
- Expected: "{'a': 1, 'b': 1, 'c': 1, 'd': 1}"

---

## 13. DefaultDict - Group by Category

**Difficulty:** easy
**Concept:** python-fundamentals

### Description

Use defaultdict to group items by category without checking if key exists.

### Examples

**Example 1:**
- Input: items=[('apple','fruit'),('carrot','veg'),('banana','fruit')]
- Output: {'fruit': ['apple','banana'], 'veg': ['carrot']}
- Explanation: Items grouped by their category

### Hints

1. No need for: if key not in dict: dict[key] = []
2. for item, category in items: groups[category].append(item)
3. return dict(groups) to convert defaultdict to regular dict

### Starter Code

### Test Cases

**Test 1:** Mixed categories
- Input: "[('apple','fruit'),('carrot','veg'),('banana','fruit')]"
- Expected: "{'fruit': ['apple','banana'], 'veg': ['carrot']}"

**Test 2:** Same category
- Input: "[('dog','pet'),('cat','pet')]"
- Expected: "{'pet': ['dog','cat']}"

---

## 14. Deque - Queue and Stack Operations

**Difficulty:** easy
**Concept:** python-fundamentals

### Description

Use deque for efficient queue/stack operations. Add to both ends, remove from both ends.

### Examples

**Example 1:**
- Input: operations=['append 1','append 2','popleft']
- Output: [1]
- Explanation: Add 1 and 2 to right, remove 1 from left

### Hints

1. op.split() gives ['append', '1']
2. if cmd == 'append': dq.append(int(val))
3. if cmd == 'popleft': results.append(dq.popleft())

### Starter Code

### Test Cases

**Test 1:** Queue behavior
- Input: "['append 1','append 2','popleft']"
- Expected: "[1]"

**Test 2:** Stack at left
- Input: "['appendleft 1','appendleft 2','pop']"
- Expected: "[1]"

---

## 15. Heapq - Priority Queue Basics

**Difficulty:** easy
**Concept:** python-fundamentals

### Description

Use heapq to maintain a priority queue. Process tasks by priority (lower number = higher priority).

### Examples

**Example 1:**
- Input: tasks=[(3,'low'),(1,'high'),(2,'medium')]
- Output: ['high','medium','low']
- Explanation: Tasks processed in priority order

### Hints

1. heapq.heapify(tasks) converts list to heap in-place
2. heappop returns smallest item: priority, task = heappop(tasks)
3. while tasks: _, task = heappop(tasks); result.append(task)

### Starter Code

### Test Cases

**Test 1:** Priority order
- Input: "[(3,'low'),(1,'high'),(2,'medium')]"
- Expected: "['high','medium','low']"

**Test 2:** Same priority
- Input: "[(1,'first'),(1,'second')]"
- Expected: "['first','second']"

---

## 16. Type Conversion - Data Parsing

**Difficulty:** easy
**Concept:** python-fundamentals

### Description

Parse mixed data types from strings: convert to int, float, bool as appropriate.

### Examples

**Example 1:**
- Input: ['42', '3.14', 'True', 'hello']
- Output: [42, 3.14, True, 'hello']
- Explanation: Each value converted to its appropriate type

### Hints

1. try: return int(val) except ValueError: continue
2. if val in ['True', 'False']: return val == 'True'
3. Check bool first (before int), then int, then float

### Starter Code

### Test Cases

**Test 1:** Mixed types
- Input: "['42', '3.14', 'True', 'hello']"
- Expected: "[42, 3.14, True, 'hello']"

**Test 2:** Various numbers
- Input: "['False', '0', '1.0']"
- Expected: "[False, 0, 1.0]"

---

## 17. Exception Handling - Safe Division

**Difficulty:** easy
**Concept:** python-fundamentals

### Description

Implement safe division with proper exception handling for division by zero and type errors.

### Examples

**Example 1:**
- Input: divide(10, 2)
- Output: 5.0
- Explanation: Normal division works

**Example 2:**
- Input: divide(10, 0)
- Output: 'Error: Division by zero'
- Explanation: Catches ZeroDivisionError

### Hints

1. except ZeroDivisionError: handle zero; except TypeError: handle types
2. Return specific error messages for each exception type
3. Put more specific exceptions before general ones

### Starter Code

### Test Cases

**Test 1:** Normal division
- Input: "(10, 2)"
- Expected: "5.0"

**Test 2:** Divide by zero
- Input: "(10, 0)"
- Expected: "'Error: Division by zero'"

**Test 3:** String input
- Input: "('10', 2)"
- Expected: "'Error: Invalid types'"

---

## 18. Dictionary Comprehension Practice

**Difficulty:** easy
**Concept:** python-fundamentals

### Description

Use dictionary comprehension to create a mapping of numbers to their squares for even numbers only.

### Examples

**Example 1:**
- Input: [1, 2, 3, 4, 5, 6]
- Output: {2: 4, 4: 16, 6: 36}
- Explanation: Even numbers mapped to their squares

### Hints

1. {key: value for item in iterable if condition}
2. if x % 2 == 0 filters to even numbers
3. return {x: x*x for x in nums if x % 2 == 0}

### Starter Code

### Test Cases

**Test 1:** Mixed numbers
- Input: "[1,2,3,4,5,6]"
- Expected: "{2: 4, 4: 16, 6: 36}"

**Test 2:** All odd
- Input: "[1,3,5]"
- Expected: "{}"

**Test 3:** All even
- Input: "[2,4]"
- Expected: "{2: 4, 4: 16}"

---
