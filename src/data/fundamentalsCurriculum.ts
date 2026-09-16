import { FundamentalsSection } from '../types';

export const FUNDAMENTALS_SECTIONS: FundamentalsSection[] = [
  // ==========================================
  // SECTION 1: PYTHON BASICS, TYPES & CONTROL FLOW
  // ==========================================
  {
    id: 'section-1-basics',
    sectionNumber: 1,
    title: 'Python Basics, Types & Control Flow',
    subtitle: 'Dynamic Typing, Memory Model, Expressions & Branching',
    level: 'Beginner',
    estimatedTime: '45 mins',
    summary:
      'Master the building blocks of Python: variable names as object references, numeric types, string manipulation with f-strings, truthiness, and conditional branching structures.',
    notes: {
      overview:
        'Python is an interpreted, high-level, dynamically typed language created by Guido van Rossum. Unlike statically typed languages like C++ or Java where variables declare a fixed type, in Python, variables are merely labels (names) that point to objects in memory. The Python runtime handles automatic garbage collection through reference counting and cyclic garbage detection.',
      keyConcepts: [
        {
          title: 'Variables as Object References and Identity',
          explanation:
            'When you write `x = [1, 2, 3]`, Python allocates a list object in heap memory and binds the name `x` to it. Assigning `y = x` does NOT copy the list; both labels now reference the exact same object in memory (`x is y` is True). To check memory addresses, use `id(obj)`.',
          codeExample: `a = [1, 2, 3]
b = a
b.append(4)
print(a)  # [1, 2, 3, 4] -> Both names reference the same object!

# To create an independent shallow copy:
c = a.copy()
c.append(99)
print(a)  # [1, 2, 3, 4] -> Unchanged`
        },
        {
          title: 'Numeric Types & Division Semantics',
          explanation:
            'Python 3 provides arbitrary precision integers (`int`), IEEE-754 64-bit floats (`float`), and complex numbers (`complex`). Notice that `/` always returns a `float`, whereas `//` performs floor division towards negative infinity.',
          codeExample: `print(7 / 2)    # 3.5 (Float division)
print(7 // 2)   # 3   (Floor division)
print(-7 // 2)  # -4  (Floors towards negative infinity, not truncates to zero!)`
        },
        {
          title: 'Formatted Strings (f-strings) and String Methods',
          explanation:
            'Introduced in Python 3.6, f-strings evaluate expressions at runtime with concise syntax and custom specifiers (e.g. padding, float precision, date formatting). Strings in Python are immutable sequences.',
          codeExample: `item = "Server CPU"
temp = 72.4862
print(f"Status: {item} running at {temp:.1f}°C")
# Output: Status: Server CPU running at 72.5°C

# String manipulation:
raw = "   python-dsa-expert   "
clean = raw.strip().replace("-", " ").upper()
print(clean) # 'PYTHON DSA EXPERT'`
        },
        {
          title: 'Truthiness and Conditional Branching (if / elif / else)',
          explanation:
            'Every Python object has an intrinsic truth value. The following are Falsy: `None`, `False`, numeric zeros (`0`, `0.0`), empty sequences and collections (`""`, `[]`, `()`, `{}`). Everything else is Truthy. Conditions evaluate lazily via short-circuit evaluation.',
          codeExample: `cart = []
if not cart:
    print("Cart is empty!")

# Ternary expression (conditional operator):
status = "admin"
access_level = "Full" if status == "admin" else "Restricted"
print(access_level)  # 'Full'`
        }
      ],
      interviewTips: [
        'Always remember that `is` checks memory identity (`id(a) == id(b)`), whereas `==` checks value equality (`a.__eq__(b)`).',
        'Watch out for negative floor division: `-7 // 2` evaluates to `-4`, not `-3` as in languages that truncate toward zero.',
        'Strings are immutable. Any modification (like `.replace()` or concatenation) allocates a new string object.'
      ],
      commonPitfalls: [
        {
          pitfall: 'Using float equality directly with `==` (e.g. `0.1 + 0.2 == 0.3`)',
          solution:
            'Use `math.isclose(a, b)` or `abs(a - b) < 1e-9` because IEEE-754 floating points have binary representation precision limits.'
        },
        {
          pitfall: 'Assuming `x is 1000` is guaranteed to be True for identical values',
          solution:
            'Only small integers between -5 and 256 are guaranteed to be singletons in CPython. Always use `==` for value comparison.'
        }
      ],
      cheatSheet: `# Types: int, float, bool, str, NoneType
# Casting: int("42"), float("3.14"), str(100), bool(0) -> False
# Operators: + - * / // % **
# Bitwise: & | ^ ~ << >>
# Condition: if cond: ... elif other: ... else: ...
# Ternary: val_true if condition else val_false`
    },
    mcqs: [
      {
        id: 'q1-1',
        question: 'What is the output of the expression `-11 // 3` in Python?',
        codeSnippet: `print(-11 // 3)`,
        options: ['-3', '-4', '-3.66', '3'],
        correctIndex: 1,
        explanation:
          'In Python, the `//` operator performs floor division, which rounds down towards negative infinity. -11 / 3 is approximately -3.666..., so flooring it yields -4.'
      },
      {
        id: 'q1-2',
        question: 'Which of the following values evaluates to True in a boolean context?',
        options: ['"" (empty string)', '0.0 (float zero)', '[0] (list containing 0)', 'None'],
        correctIndex: 2,
        explanation:
          'A list containing an element (even if that element is 0) has a length > 0, so `bool([0])` evaluates to True. Empty containers, 0, 0.0, and None are falsy.'
      },
      {
        id: 'q1-3',
        question: 'What happens when you execute the following snippet?',
        codeSnippet: `s = "Hello"
s[0] = "h"`,
        options: [
          's becomes "hello"',
          'Raises TypeError: \'str\' object does not support item assignment',
          'Raises ValueError: immutable index',
          'A shallow copy of s is created'
        ],
        correctIndex: 1,
        explanation:
          'Python strings are immutable. You cannot modify characters in-place by index. Trying to do so raises a TypeError.'
      },
      {
        id: 'q1-4',
        question: 'What does the following short-circuit evaluation return?',
        codeSnippet: `result = 0 or "Python" and [] or 42
print(result)`,
        options: ['0', '"Python"', '[]', '42'],
        correctIndex: 3,
        explanation:
          '`"Python" and []` evaluates to `[]` because `and` returns the first falsy operand or the last truthy one. Then `0 or [] or 42`: 0 is falsy, `[]` is falsy, so it evaluates to `42`.'
      },
      {
        id: 'q1-5',
        question: 'What will be printed by the following code?',
        codeSnippet: `x = 100
y = x
x = 200
print(y)`,
        options: ['200', '100', 'None', 'Raises UnboundLocalError'],
        correctIndex: 1,
        explanation:
          'Integers are immutable. `x = 200` simply binds the name `x` to a new integer object 200. The name `y` is still bound to the original integer 100.'
      }
    ],
    codingProblems: [
      {
        id: 'p-fun-1-1',
        title: 'Temperature Classifier & Unit Converter',
        difficulty: 'Easy',
        description:
          'Write a function `classify_temperature(temp: float, unit: str) -> str` that takes a numeric temperature and unit ("C" for Celsius, "F" for Fahrenheit). If unit is "F", first convert it to Celsius using formula: `C = (F - 32) * 5 / 9`. Then return a category string:\n- "Freezing" if C < 0\n- "Moderate" if 0 <= C <= 25\n- "Warm" if 26 <= C <= 35\n- "Hot" if C > 35',
        starterCode: `def classify_temperature(temp: float, unit: str) -> str:
    # Convert to Celsius if needed, then classify and return category
    pass

# --- Example Test Call (Click 'Run Code' to execute) ---
print(classify_temperature(-5, "C"))  # Expected Output: Freezing`,
        solutionCode: `def classify_temperature(temp: float, unit: str) -> str:
    celsius = temp if unit.upper() == 'C' else (temp - 32) * 5 / 9
    if celsius < 0:
        return "Freezing"
    elif 0 <= celsius <= 25:
        return "Moderate"
    elif 26 <= celsius <= 35:
        return "Warm"
    else:
        return "Hot"`,
        explanation:
          'Use an initial conditional to normalize Fahrenheit to Celsius, then apply chained comparison bounds.',
        testCases: [
          {
            input: 'classify_temperature(-5, "C")',
            expectedOutput: 'Freezing',
            inputData: 'temp = -5, unit = "C" (Sub-zero Celsius)',
            parameters: { temp: -5, unit: 'C' }
          },
          {
            input: 'classify_temperature(32, "F")',
            expectedOutput: 'Moderate',
            inputData: 'temp = 32, unit = "F" (32°F converts to 0°C -> Moderate)',
            parameters: { temp: 32, unit: 'F' }
          },
          {
            input: 'classify_temperature(30, "C")',
            expectedOutput: 'Warm',
            inputData: 'temp = 30, unit = "C" (26 <= 30 <= 35 -> Warm)',
            parameters: { temp: 30, unit: 'C' }
          },
          {
            input: 'classify_temperature(104, "F")',
            expectedOutput: 'Hot',
            inputData: 'temp = 104, unit = "F" (104°F converts to 40°C -> Hot)',
            parameters: { temp: 104, unit: 'F' }
          }
        ],
        hints: ['Convert "F" to Celsius first: (F - 32) * 5 / 9', 'Use chained comparisons: 0 <= c <= 25']
      },
      {
        id: 'p-fun-1-2',
        title: 'Gregorian Leap Year & Century Validator',
        difficulty: 'Easy',
        description:
          'Write a function `is_leap_year(year: int) -> bool` that returns True if the given year is a leap year in the Gregorian calendar, and False otherwise.\nA leap year is divisible by 4, except for end-of-century years (divisible by 100), which must also be divisible by 400.',
        starterCode: `def is_leap_year(year: int) -> bool:
    # Return True if year is leap year, False otherwise
    pass

# --- Example Test Call (Click 'Run Code' to execute) ---
print(is_leap_year(2024))  # Expected Output: True`,
        solutionCode: `def is_leap_year(year: int) -> bool:
    return (year % 4 == 0 and year % 100 != 0) or (year % 400 == 0)`,
        explanation:
          'A year is a leap year if it is divisible by 4 but not by 100, or if it is divisible by 400. In Python this can be expressed in a single boolean expression.',
        testCases: [
          {
            input: 'is_leap_year(2024)',
            expectedOutput: 'True',
            inputData: 'year = 2024 (Divisible by 4, standard leap year)',
            parameters: { year: 2024 }
          },
          {
            input: 'is_leap_year(1900)',
            expectedOutput: 'False',
            inputData: 'year = 1900 (Century year not divisible by 400 -> False)',
            parameters: { year: 1900 }
          },
          {
            input: 'is_leap_year(2000)',
            expectedOutput: 'True',
            inputData: 'year = 2000 (Century year divisible by 400 -> True)',
            parameters: { year: 2000 }
          },
          {
            input: 'is_leap_year(2023)',
            expectedOutput: 'False',
            inputData: 'year = 2023 (Odd year, not divisible by 4)',
            parameters: { year: 2023 }
          }
        ],
        hints: ['Use the modulo operator `%`', 'Check `(year % 4 == 0 and year % 100 != 0) or (year % 400 == 0)`']
      },
      {
        id: 'p-fun-1-3',
        title: 'Tiered Discount & Sales Tax Billing Calculator',
        difficulty: 'Medium',
        description:
          'Write a function `calculate_final_bill(subtotal: float, tax_rate: float) -> float` that computes the final bill after applying discounts and then adding tax:\n- If subtotal >= 500: apply 20% discount (multiply subtotal by 0.80)\n- If 200 <= subtotal < 500: apply 10% discount (multiply subtotal by 0.90)\n- Otherwise: 0% discount\nAfter discount, apply `tax_rate` (e.g. 0.08 for 8% tax). Return the final rounded figure to 2 decimal places as a float.',
        starterCode: `def calculate_final_bill(subtotal: float, tax_rate: float) -> float:
    # Calculate discount, apply tax, and round to 2 decimal places
    pass

# --- Example Test Call (Click 'Run Code' to execute) ---
print(calculate_final_bill(600, 0.08))  # Expected Output: 518.4`,
        solutionCode: `def calculate_final_bill(subtotal: float, tax_rate: float) -> float:
    if subtotal >= 500:
        discounted = subtotal * 0.80
    elif subtotal >= 200:
        discounted = subtotal * 0.90
    else:
        discounted = subtotal
    final_amount = discounted * (1 + tax_rate)
    return round(final_amount, 2)`,
        explanation:
          'Compute discounted subtotal first based on tiered thresholds, multiply by (1 + tax_rate), and round with `round(val, 2)`.',
        testCases: [
          {
            input: 'calculate_final_bill(600, 0.08)',
            expectedOutput: '518.4',
            inputData: 'subtotal = $600.00 (>= 500 -> 20% off = $480.00), tax_rate = 0.08 (8% tax -> $518.40)',
            parameters: { subtotal: 600, tax_rate: 0.08 }
          },
          {
            input: 'calculate_final_bill(250, 0.05)',
            expectedOutput: '236.25',
            inputData: 'subtotal = $250.00 (>= 200 -> 10% off = $225.00), tax_rate = 0.05 (5% tax -> $236.25)',
            parameters: { subtotal: 250, tax_rate: 0.05 }
          },
          {
            input: 'calculate_final_bill(100, 0.10)',
            expectedOutput: '110.0',
            inputData: 'subtotal = $100.00 (< 200 -> 0% off = $100.00), tax_rate = 0.10 (10% tax -> $110.00)',
            parameters: { subtotal: 100, tax_rate: 0.10 }
          }
        ],
        hints: ['Order conditional checks from highest threshold to lowest', 'Apply tax on the discounted subtotal']
      }
    ]
  },

  // ==========================================
  // SECTION 2: LOOPS, ITERATION & SEQUENCES (LISTS & TUPLES)
  // ==========================================
  {
    id: 'section-2-loops-lists',
    sectionNumber: 2,
    title: 'Loops, Iteration & Sequences (Lists & Tuples)',
    subtitle: 'List Slicing, Mutability Traps, Unpacking & Comprehensions',
    level: 'Beginner',
    estimatedTime: '50 mins',
    summary:
      'Explore iteration primitives: for and while loops, the unique loop-else clause, range bounds, list slicing, memory mutability, tuple packing/unpacking, and high-performance list comprehensions.',
    notes: {
      overview:
        'Sequences are ordered collections where elements can be accessed by index. Python lists are dynamic arrays supporting O(1) amortized appends and O(1) index lookups. Tuples are immutable sequences often used for fixed records and dictionary keys. Understanding list slicing and memory references is critical to avoid insidious reference-duplication bugs.',
      keyConcepts: [
        {
          title: 'The For Loop and Range Generator',
          explanation:
            'Python for loops iterate directly over elements of any iterable, not via integer index increments. To get both index and value, use `enumerate(iterable)`. The `range(start, stop, step)` object generates integers on-demand with O(1) memory space.',
          codeExample: `fruits = ["apple", "banana", "cherry"]
for idx, fruit in enumerate(fruits, start=1):
    print(f"{idx}: {fruit}")

# Stepped range:
for n in range(10, 0, -2):
    print(n, end=" ") # 10 8 6 4 2`
        },
        {
          title: 'The Loop "else" Clause',
          explanation:
            'A loop can have an `else` block! The `else` block executes ONLY when the loop completes all iterations without encountering a `break` statement. This eliminates the need for boolean `found` flags.',
          codeExample: `target = 7
numbers = [2, 4, 6, 8]
for num in numbers:
    if num == target:
        print("Found target!")
        break
else:
    print("Target not present in list.") # Executes because loop finished without break`
        },
        {
          title: 'Extended Slicing Syntax: sequence[start:stop:step]',
          explanation:
            'Slicing extracts a shallow copy of a sub-sequence. If omitted, `start` defaults to 0, `stop` defaults to `len`, and `step` defaults to 1. Negative steps iterate backwards.',
          codeExample: `data = [10, 20, 30, 40, 50, 60]
print(data[1:4])     # [20, 30, 40]
print(data[::2])     # [10, 30, 50] (every 2nd item)
print(data[::-1])    # [60, 50, 40, 30, 20, 10] (Reversed copy)`
        },
        {
          title: 'List Comprehensions vs Generator Expressions',
          explanation:
            'List comprehensions offer clean, readable syntax to transform and filter iterables into a new list. Generator expressions use parentheses `(...)` to yield items lazily one-by-one, saving memory for massive datasets.',
          codeExample: `numbers = [1, 2, 3, 4, 5, 6, 7, 8]
# List comprehension:
evens_squared = [x**2 for x in numbers if x % 2 == 0]
print(evens_squared) # [4, 16, 36, 64]

# Generator expression (O(1) memory):
sum_of_squares = sum(x**2 for x in numbers)`
        }
      ],
      interviewTips: [
        'Beware of shallow list multiplication: `[[0] * 3] * 3` creates a list containing 3 references to the EXACT same inner list! Modifying one modifies all three rows.',
        'To safely create a 2D matrix, always use a comprehension: `[[0] * 3 for _ in range(3)]`.',
        'Tuples can be used as dictionary keys because they are immutable (if all their contained elements are also immutable).'
      ],
      commonPitfalls: [
        {
          pitfall: 'Modifying a list while iterating over it with a for loop',
          solution:
            'Iterate over a copy `for item in data[:]:` or construct a new filtered list using a comprehension.'
        },
        {
          pitfall: 'Forgetting the trailing comma in single-element tuples: `x = (42)` is an int, not a tuple',
          solution: 'Always write `x = (42,)` with a trailing comma.'
        }
      ],
      cheatSheet: `# Indexing: lst[0], lst[-1] (last)
# Slicing: lst[start:stop:step], lst[::-1] (reverse)
# Methods: .append(x), .extend(iterable), .pop(i), .insert(i, x), .sort(), .reverse()
# Tuples: t = (1, 2), unpacking: a, b = t
# Comprehension: [expr for item in iterable if condition]`
    },
    mcqs: [
      {
        id: 'q2-1',
        question: 'What is the output of the following 2D list modification?',
        codeSnippet: `grid = [[0] * 2] * 2
grid[0][0] = 99
print(grid)`,
        options: [
          '[[99, 0], [0, 0]]',
          '[[99, 0], [99, 0]]',
          '[[99, 99], [0, 0]]',
          'Raises IndexError'
        ],
        correctIndex: 1,
        explanation:
          'Multiplying `[[0] * 2] * 2` creates two references pointing to the exact same inner list. Modifying row 0 reflects in row 1 as well, producing `[[99, 0], [99, 0]]`.'
      },
      {
        id: 'q2-2',
        question: 'What will be printed when this loop finishes?',
        codeSnippet: `for i in range(3):
    if i == 5:
        break
else:
    print("Loop finished")`,
        options: [
          'Nothing is printed',
          '"Loop finished"',
          'Raises SyntaxError: else cannot follow for',
          'Prints "Loop finished" 3 times'
        ],
        correctIndex: 1,
        explanation:
          'The `else` clause attached to a loop executes when the loop finishes naturally without encountering a `break`. Since `i == 5` is never True, break is never hit, so "Loop finished" is printed once.'
      },
      {
        id: 'q2-3',
        question: 'What is the result of `nums[4:1:-1]` where `nums = [10, 20, 30, 40, 50, 60]`?',
        codeSnippet: `nums = [10, 20, 30, 40, 50, 60]
print(nums[4:1:-1])`,
        options: [
          '[50, 40, 30]',
          '[50, 40, 30, 20]',
          '[60, 50, 40]',
          '[]'
        ],
        correctIndex: 0,
        explanation:
          'Index 4 is 50. Stepping backward by -1 towards index 1 (exclusive) includes indices 4, 3, and 2, corresponding to [50, 40, 30]. Index 1 (20) is excluded.'
      },
      {
        id: 'q2-4',
        question: 'Which statement correctly unpacks the first element, last element, and the rest from a list?',
        codeSnippet: `data = [1, 2, 3, 4, 5]`,
        options: [
          'first, *middle, last = data',
          'first, middle..., last = data',
          'first, &middle, last = data',
          'first, [middle], last = data'
        ],
        correctIndex: 0,
        explanation:
          'Python uses extended iterable unpacking with the asterisk `*` operator. `first, *middle, last = data` binds first=1, middle=[2, 3, 4], and last=5.'
      },
      {
        id: 'q2-5',
        question: 'What is the type of `val = (100)` vs `val2 = (100,)`?',
        options: [
          'Both are tuples',
          'val is int, val2 is tuple',
          'val is tuple, val2 is syntax error',
          'val is generator, val2 is tuple'
        ],
        correctIndex: 1,
        explanation:
          'Parentheses alone indicate mathematical grouping. A comma is required to create a tuple. Hence `(100)` is int, while `(100,)` is a 1-element tuple.'
      }
    ],
    codingProblems: [
      {
        id: 'p-fun-2-1',
        title: 'Running Even Sum & Odd Product Aggregator',
        difficulty: 'Easy',
        description:
          'Write a function `even_sum_odd_product(nums: list[int]) -> tuple[int, int]` that iterates through a list of integers and returns a tuple `(even_sum, odd_product)`:\n- `even_sum`: the sum of all even numbers (0 if no evens).\n- `odd_product`: the product of all odd numbers. If no odd numbers exist in the list, return 0 for odd_product.',
        starterCode: `def even_sum_odd_product(nums: list[int]) -> tuple[int, int]:
    # Return (even_sum, odd_product)
    pass

# --- Example Test Call (Click 'Run Code' to execute) ---
print(even_sum_odd_product([1, 2, 3, 4, 5]))  # Expected Output: (6, 15)`,
        solutionCode: `def even_sum_odd_product(nums: list[int]) -> tuple[int, int]:
    even_sum = 0
    odd_product = 1
    has_odd = False
    for n in nums:
        if n % 2 == 0:
            even_sum += n
        else:
            odd_product *= n
            has_odd = True
    return (even_sum, odd_product if has_odd else 0)`,
        explanation:
          'Iterate through the list while maintaining an accumulator for even sum and tracking whether any odd numbers were encountered to handle the empty odd case.',
        testCases: [
          {
            input: 'even_sum_odd_product([1, 2, 3, 4, 5])',
            expectedOutput: '(6, 15)',
            inputData: 'nums = [1, 2, 3, 4, 5] (Evens: 2 + 4 = 6; Odds: 1 * 3 * 5 = 15)',
            parameters: { nums: [1, 2, 3, 4, 5] }
          },
          {
            input: 'even_sum_odd_product([2, 4, 6])',
            expectedOutput: '(12, 0)',
            inputData: 'nums = [2, 4, 6] (Evens: 2 + 4 + 6 = 12; No odds -> 0)',
            parameters: { nums: [2, 4, 6] }
          },
          {
            input: 'even_sum_odd_product([3, 5, 7])',
            expectedOutput: '(0, 105)',
            inputData: 'nums = [3, 5, 7] (No evens -> 0; Odds: 3 * 5 * 7 = 105)',
            parameters: { nums: [3, 5, 7] }
          },
          {
            input: 'even_sum_odd_product([])',
            expectedOutput: '(0, 0)',
            inputData: 'nums = [] (Empty list -> 0 evens, 0 odds)',
            parameters: { nums: [] }
          }
        ],
        hints: ['Initialize even_sum to 0 and odd_product to 1', 'Use a boolean flag to check if at least one odd was processed']
      },
      {
        id: 'p-fun-2-2',
        title: 'Chunk and Alternate Reverse',
        difficulty: 'Medium',
        description:
          'Write a function `chunk_and_alternate_reverse(nums: list[int], k: int) -> list[int]` that splits a list into consecutive chunks of size `k` (the last chunk may be smaller than `k`). Reverse the elements of every 2nd chunk (0-indexed chunks 1, 3, 5, ...). Return the flattened resulting list.',
        starterCode: `def chunk_and_alternate_reverse(nums: list[int], k: int) -> list[int]:
    # Split into chunks of size k, reverse every second chunk
    pass

# --- Example Test Call (Click 'Run Code' to execute) ---
print(chunk_and_alternate_reverse([1, 2, 3, 4, 5, 6, 7], 2))  # Expected Output: [1, 2, 4, 3, 5, 6, 7]`,
        solutionCode: `def chunk_and_alternate_reverse(nums: list[int], k: int) -> list[int]:
    result = []
    chunk_idx = 0
    for i in range(0, len(nums), k):
        chunk = nums[i:i+k]
        if chunk_idx % 2 == 1:
            chunk = chunk[::-1]
        result.extend(chunk)
        chunk_idx += 1
    return result`,
        explanation:
          'Use `range(0, len(nums), k)` to slice successive chunks of size `k`. If chunk_idx is odd, reverse with `chunk[::-1]`.',
        testCases: [
          {
            input: 'chunk_and_alternate_reverse([1, 2, 3, 4, 5, 6, 7], 2)',
            expectedOutput: '[1, 2, 4, 3, 5, 6, 7]',
            inputData: 'nums = [1, 2, 3, 4, 5, 6, 7], k = 2 (Chunks: [1,2], [3,4]->[4,3], [5,6], [7]->[7])',
            parameters: { nums: [1, 2, 3, 4, 5, 6, 7], k: 2 }
          },
          {
            input: 'chunk_and_alternate_reverse([10, 20, 30, 40, 50, 60], 3)',
            expectedOutput: '[10, 20, 30, 60, 50, 40]',
            inputData: 'nums = [10, 20, 30, 40, 50, 60], k = 3 (Chunk 0: [10,20,30], Chunk 1 rev: [60,50,40])',
            parameters: { nums: [10, 20, 30, 40, 50, 60], k: 3 }
          },
          {
            input: 'chunk_and_alternate_reverse([1, 2, 3], 5)',
            expectedOutput: '[1, 2, 3]',
            inputData: 'nums = [1, 2, 3], k = 5 (Single chunk of index 0, not reversed)',
            parameters: { nums: [1, 2, 3], k: 5 }
          }
        ],
        hints: ['Iterate with `range(0, len(nums), k)`', 'Check `chunk_idx % 2 == 1` to reverse with `[::-1]`']
      },
      {
        id: 'p-fun-2-3',
        title: 'Deduplicate Preserving First Occurrence Order',
        difficulty: 'Medium',
        description:
          'Write a function `deduplicate_preserve_order(items: list) -> list` that removes all subsequent duplicate values from a list while strictly maintaining the relative ordering of their first occurrences. Use a hash set for O(1) membership lookups to achieve overall O(N) linear time.',
        starterCode: `def deduplicate_preserve_order(items: list) -> list:
    # Filter duplicates while maintaining original order in O(N) time
    pass

# --- Example Test Call (Click 'Run Code' to execute) ---
print(deduplicate_preserve_order([4, 5, 4, 2, 5, 1, 2]))  # Expected Output: [4, 5, 2, 1]`,
        solutionCode: `def deduplicate_preserve_order(items: list) -> list:
    seen = set()
    result = []
    for item in items:
        if item not in seen:
            seen.add(item)
            result.append(item)
    return result`,
        explanation:
          'A set enables O(1) average lookup for previously seen items, guaranteeing overall O(N) linear time while preserving original order in the result list.',
        testCases: [
          {
            input: 'deduplicate_preserve_order([4, 5, 4, 2, 5, 1, 2])',
            expectedOutput: '[4, 5, 2, 1]',
            inputData: 'items = [4, 5, 4, 2, 5, 1, 2] (Unique order: 4, then 5, then 2, then 1)',
            parameters: { items: [4, 5, 4, 2, 5, 1, 2] }
          },
          {
            input: 'deduplicate_preserve_order(["apple", "banana", "apple", "orange"])',
            expectedOutput: "['apple', 'banana', 'orange']",
            inputData: 'items = ["apple", "banana", "apple", "orange"] (Duplicate "apple" discarded)',
            parameters: { items: ['apple', 'banana', 'apple', 'orange'] }
          },
          {
            input: 'deduplicate_preserve_order([])',
            expectedOutput: '[]',
            inputData: 'items = [] (Empty list)',
            parameters: { items: [] }
          }
        ],
        hints: ['Maintain a `seen = set()` and `result = []`', 'Append to result only when `item not in seen`']
      }
    ]
  },

  // ==========================================
  // SECTION 3: DICTIONARIES, SETS & HASH STRUCTURES
  // ==========================================
  {
    id: 'section-3-dict-sets',
    sectionNumber: 3,
    title: 'Dictionaries, Sets & Hash-Based Structures',
    subtitle: 'Hash Tables, Key Invariance, Set Algebra & O(1) Lookups',
    level: 'Intermediate',
    estimatedTime: '55 mins',
    summary:
      'Unlock algorithmic performance using hash tables: dict creation, default values, safe lookups, key hashability requirements, set theory operations, and dictionary comprehensions.',
    notes: {
      overview:
        'Dictionaries (`dict`) and sets (`set`) are Python\'s core hash-table implementations. In CPython, dictionaries are implemented as dense arrays with hash indices, which ensures O(1) average time complexity for insertions, lookups, and deletions while preserving insertion order. Elements stored in sets or as dictionary keys must be hashable (immutable objects implementing `__hash__` and `__eq__`).',
      keyConcepts: [
        {
          title: 'Dictionary Access: Subscripting vs .get() and .setdefault()',
          explanation:
            'Accessing `d[key]` raises `KeyError` if the key does not exist. `d.get(key, default)` returns `None` (or a fallback value) without throwing. `d.setdefault(key, default)` returns the value if present; otherwise inserts `key: default` and returns it.',
          codeExample: `counts = {}
words = ["python", "dsa", "python"]
for w in words:
    # Safe counting idiom:
    counts[w] = counts.get(w, 0) + 1
print(counts)  # {'python': 2, 'dsa': 1}`
        },
        {
          title: 'Key Hashability and Unhashable Types',
          explanation:
            'An object is hashable if it has a hash value that remains constant across its lifetime. Mutable objects (like `list`, `dict`, `set`) are UNHASHABLE and cannot be dictionary keys or set elements. Immutable types (`int`, `str`, `tuple`, `frozenset`) are hashable.',
          codeExample: `# Valid:
points = {(0, 0): "Origin", (1, 5): "Peak"}

# Invalid (Raises TypeError: unhashable type: 'list'):
# bad_dict = {[1, 2]: "coords"} # Error!`
        },
        {
          title: 'Mathematical Set Operations',
          explanation:
            'Sets model mathematical sets and provide fast O(1) membership testing (`x in my_set`). Set operations can be written using methods or operators.',
          codeExample: `a = {1, 2, 3, 4}
b = {3, 4, 5, 6}
print(a | b)  # Union: {1, 2, 3, 4, 5, 6}
print(a & b)  # Intersection: {3, 4}
print(a - b)  # Difference (in a but not b): {1, 2}
print(a ^ b)  # Symmetric Difference (in either, but not both): {1, 2, 5, 6}`
        },
        {
          title: 'Dictionary and Set Comprehensions',
          explanation:
            'Similar to list comprehensions, dict and set comprehensions build hash tables concisely with optional filtering.',
          codeExample: `names = ["Alice", "Bob", "Charlie"]
name_lengths = {name: len(name) for name in names if len(name) > 3}
print(name_lengths) # {'Alice': 5, 'Charlie': 7}`
        }
      ],
      interviewTips: [
        'When looking up items repeatedly, converting a list to a set drops membership checking from O(N) to O(1) average time.',
        'Use `collections.defaultdict` or `collections.Counter` in algorithmic interviews to simplify frequency and graph adjacency code.',
        'Dictionary views (`d.keys()`, `d.values()`, `d.items()`) reflect changes to the dictionary dynamically.'
      ],
      commonPitfalls: [
        {
          pitfall: 'Mutating a dictionary while iterating over its keys directly',
          solution:
            'Iterate over `list(d.keys())` or create a new dictionary to avoid `RuntimeError: dictionary changed size during iteration`.'
        },
        {
          pitfall: 'Using `{}` to create an empty set',
          solution: '`{}` creates an empty dictionary! Use `set()` to create an empty set.'
        }
      ],
      cheatSheet: `# Dict: d = {"k": "v"}, d.get(k, default), d.items(), d.values()
# Empty set: s = set()  # NOT {} which is empty dict!
# Set ops: a | b (union), a & b (intersection), a - b (diff), a ^ b (sym diff)
# Time complexity: O(1) avg for get, in, add, pop`
    },
    mcqs: [
      {
        id: 'q3-1',
        question: 'Which of the following objects can be safely used as a dictionary key in Python?',
        options: [
          '["admin", 1] (list)',
          '{"role": "user"} (dict)',
          '("user", 42) (tuple of immutable elements)',
          '{"admin", "editor"} (set)'
        ],
        correctIndex: 2,
        explanation:
          'Dictionary keys must be hashable. Lists, dicts, and sets are mutable and unhashable. A tuple containing immutable items (strings and ints) is hashable.'
      },
      {
        id: 'q3-2',
        question: 'What is the value of `scores.get("Charlie", 0)` given `scores = {"Alice": 95, "Bob": 80}`?',
        options: ['None', '0', 'Raises KeyError', 'False'],
        correctIndex: 1,
        explanation:
          'The `.get(key, default)` method returns the fallback default value (`0` in this case) when the key is not present in the dictionary, without raising an exception.'
      },
      {
        id: 'q3-3',
        question: 'What is the output of `{1, 2, 3, 4} ^ {3, 4, 5, 6}`?',
        options: [
          '{3, 4}',
          '{1, 2, 5, 6}',
          '{1, 2, 3, 4, 5, 6}',
          '{1, 2}'
        ],
        correctIndex: 1,
        explanation:
          'The `^` operator computes the symmetric difference, which includes elements that are in either set, but not in both. {1, 2} + {5, 6} = {1, 2, 5, 6}.'
      },
      {
        id: 'q3-4',
        question: 'What happens when you create `x = {}`?',
        options: [
          'x is an empty set of type `set`',
          'x is an empty dictionary of type `dict`',
          'x is an untyped generic container',
          'Raises SyntaxError'
        ],
        correctIndex: 1,
        explanation:
          'In Python, `{}` historically and currently initializes an empty dictionary. To create an empty set, you must explicitly call `set()`.'
      },
      {
        id: 'q3-5',
        question: 'What is the average time complexity of checking `item in my_collection` for a Python `set` versus a `list` containing N items?',
        options: [
          'Set: O(N), List: O(1)',
          'Set: O(1), List: O(N)',
          'Set: O(log N), List: O(N)',
          'Both are O(1)'
        ],
        correctIndex: 1,
        explanation:
          'Sets use a hash table offering O(1) average lookup time. Lists require linear scanning from start to end, which is O(N).'
      }
    ],
    codingProblems: [
      {
        id: 'p-fun-3-1',
        title: 'Word Frequency & Dominant Keyword Analyzer',
        difficulty: 'Easy',
        description:
          'Write a function `analyze_word_frequencies(text: str) -> tuple[dict[str, int], str]`: \n1. Normalize words: lowercase and remove basic punctuation (`.,!?;:`).\n2. Count occurrences of each word.\n3. Return a tuple `(frequencies_dict, most_frequent_word)`. If there is a tie for most frequent word, return the lexicographically smallest one. Return `({}, "")` if text is empty.',
        starterCode: `def analyze_word_frequencies(text: str) -> tuple[dict[str, int], str]:
    # Return (frequencies_dict, most_frequent_word)
    pass

# --- Example Test Call (Click 'Run Code' to execute) ---
print(analyze_word_frequencies("Python is great. Python is fast!"))
# Expected Output: ({'python': 2, 'is': 2, 'great': 1, 'fast': 1}, 'is')`,
        solutionCode: `def analyze_word_frequencies(text: str) -> tuple[dict[str, int], str]:
    if not text.strip():
        return ({}, "")
    cleaned = ""
    for ch in text:
        if ch not in ".,!?;:":
            cleaned += ch
        else:
            cleaned += " "
    words = [w.lower() for w in cleaned.split() if w]
    if not words:
        return ({}, "")
    freq = {}
    for w in words:
        freq[w] = freq.get(w, 0) + 1
    # Find max frequency, tie-break lexicographically smallest word
    max_count = max(freq.values())
    top_candidates = [w for w, c in freq.items() if c == max_count]
    top_candidates.sort()
    return (freq, top_candidates[0])`,
        explanation:
          'Clean punctuation, split into lowercase words, populate a hash map counter, and select the highest frequency candidate with alphabetical sorting.',
        testCases: [
          {
            input: 'analyze_word_frequencies("Python is great. Python is fast!")',
            expectedOutput: "({'python': 2, 'is': 2, 'great': 1, 'fast': 1}, 'is')",
            inputData: 'text = "Python is great. Python is fast!" (Tied count 2 for "is" and "python" -> "is" wins alphabetically)',
            parameters: { text: "Python is great. Python is fast!" }
          },
          {
            input: 'analyze_word_frequencies("Code code CODE")',
            expectedOutput: "({'code': 3}, 'code')",
            inputData: 'text = "Code code CODE" (All cases normalize to single word "code" count 3)',
            parameters: { text: "Code code CODE" }
          },
          {
            input: 'analyze_word_frequencies("")',
            expectedOutput: '({}, "")',
            inputData: 'text = "" (Empty string -> empty dict and empty word)',
            parameters: { text: "" }
          }
        ],
        hints: ['Strip punctuation using a character loop or str.replace', 'Count words using a dictionary with `.get(w, 0) + 1`']
      },
      {
        id: 'p-fun-3-2',
        title: 'Candidate Skill Gap Analyzer using Sets',
        difficulty: 'Medium',
        description:
          'Write a function `analyze_skill_gaps(candidate_skills: list[str], job_requirements: list[str]) -> dict[str, list[str]]:\nReturn a dictionary with three sorted lists:\n- "matched": skills present in both\n- "missing": skills required by the job that the candidate lacks\n- "extra": additional skills the candidate possesses that are not required',
        starterCode: `def analyze_skill_gaps(candidate_skills: list[str], job_requirements: list[str]) -> dict[str, list[str]]:
    # Use set operations to categorize matched, missing, and extra skills
    pass

# --- Example Test Call (Click 'Run Code' to execute) ---
print(analyze_skill_gaps(["Python", "SQL", "Git"], ["Python", "Docker", "SQL"]))
# Expected Output: {'extra': ['git'], 'matched': ['python', 'sql'], 'missing': ['docker']}`,
        solutionCode: `def analyze_skill_gaps(candidate_skills: list[str], job_requirements: list[str]) -> dict[str, list[str]]:
    cand = set(s.lower() for s in candidate_skills)
    job = set(s.lower() for s in job_requirements)
    return {
        "matched": sorted(list(cand & job)),
        "missing": sorted(list(job - cand)),
        "extra": sorted(list(cand - job))
    }`,
        explanation:
          'Convert both skill lists to lowercase sets. Use intersection `&` for matched, difference `job - cand` for missing, and `cand - job` for extra skills.',
        testCases: [
          {
            input: 'analyze_skill_gaps(["Python", "SQL", "Git"], ["Python", "Docker", "SQL"])',
            expectedOutput: "{'extra': ['git'], 'matched': ['python', 'sql'], 'missing': ['docker']}",
            inputData: 'candidate = ["Python", "SQL", "Git"], job = ["Python", "Docker", "SQL"]',
            parameters: {
              candidate_skills: ["Python", "SQL", "Git"],
              job_requirements: ["Python", "Docker", "SQL"]
            }
          },
          {
            input: 'analyze_skill_gaps(["React"], ["React"])',
            expectedOutput: "{'extra': [], 'matched': ['react'], 'missing': []}",
            inputData: 'candidate = ["React"], job = ["React"] (Exact match)',
            parameters: {
              candidate_skills: ["React"],
              job_requirements: ["React"]
            }
          }
        ],
        hints: ['Convert to lowercase sets first', 'Use set algebra: `&` and `-`']
      },
      {
        id: 'p-fun-3-3',
        title: 'Invert Multi-Value Dictionary Grouping',
        difficulty: 'Medium',
        description:
          'Write a function `invert_and_group(student_grades: dict[str, str]) -> dict[str, list[str]]` that takes a dictionary of `{student_name: grade}` and inverts it to `{grade: sorted_list_of_students}`.\nThe list of students for each grade must be sorted alphabetically.',
        starterCode: `def invert_and_group(student_grades: dict[str, str]) -> dict[str, list[str]]:
    # Invert mapping to {grade: [students]} with sorted student names
    pass

# --- Example Test Call (Click 'Run Code' to execute) ---
print(invert_and_group({"Alice": "A", "Bob": "B", "Charlie": "A", "Dave": "C"}))
# Expected Output: {'A': ['Alice', 'Charlie'], 'B': ['Bob'], 'C': ['Dave']}`,
        solutionCode: `def invert_and_group(student_grades: dict[str, str]) -> dict[str, list[str]]:
    grouped = {}
    for student, grade in student_grades.items():
        grouped.setdefault(grade, []).append(student)
    for grade in grouped:
        grouped[grade].sort()
    return grouped`,
        explanation:
          'Use `grouped.setdefault(grade, []).append(student)` to aggregate values by inverted key, then sort student names.',
        testCases: [
          {
            input: 'invert_and_group({"Alice": "A", "Bob": "B", "Charlie": "A", "Dave": "C"})',
            expectedOutput: "{'A': ['Alice', 'Charlie'], 'B': ['Bob'], 'C': ['Dave']}",
            inputData: 'grades = {"Alice": "A", "Bob": "B", "Charlie": "A", "Dave": "C"} (A has Alice & Charlie sorted)',
            parameters: { student_grades: { Alice: 'A', Bob: 'B', Charlie: 'A', Dave: 'C' } }
          },
          {
            input: 'invert_and_group({"Zack": "A", "Adam": "A"})',
            expectedOutput: "{'A': ['Adam', 'Zack']}",
            inputData: 'grades = {"Zack": "A", "Adam": "A"} (Alphabetical sort: Adam before Zack)',
            parameters: { student_grades: { Zack: 'A', Adam: 'A' } }
          }
        ],
        hints: ['Use `grouped.setdefault(grade, [])`', 'Remember to sort the student list for each grade']
      }
    ]
  },

  // ==========================================
  // SECTION 4: FUNCTIONS, MODULARITY & EXCEPTION HANDLING
  // ==========================================
  {
    id: 'section-4-functions',
    sectionNumber: 4,
    title: 'Functions, Modularity & Exception Handling',
    subtitle: 'Parameters, Scoping, Closures, Lambdas & Try-Except-Finally',
    level: 'Intermediate',
    estimatedTime: '60 mins',
    summary:
      'Master function mechanics: variable positional/keyword arguments (*args, **kwargs), the dangerous mutable default argument trap, LEGB variable scoping, closures, and resilient exception handling.',
    notes: {
      overview:
        'Functions are first-class citizens in Python—they can be assigned to variables, passed as arguments to other functions, and returned from functions. Python manages variable lookup through the LEGB rule (Local, Enclosing, Global, Built-in). Robust enterprise applications handle runtime faults gracefully using structured `try ... except ... else ... finally` blocks.',
      keyConcepts: [
        {
          title: 'The Mutable Default Argument Trap',
          explanation:
            'Default parameter values are evaluated ONCE when the function definition is executed, NOT each time the function is called! If you use a mutable object (like a list or dict) as a default parameter, all invocations without an explicit argument will share that single object.',
          codeExample: `# DANGEROUS:
def add_item(item, basket=[]):
    basket.append(item)
    return basket

print(add_item("Apple")) # ['Apple']
print(add_item("Pear"))  # ['Apple', 'Pear'] -> Leaked state!

# CORRECT PYTHONIC IDIOM:
def safe_add_item(item, basket=None):
    if basket is None:
        basket = []
    basket.append(item)
    return basket`
        },
        {
          title: 'Variadic Arguments: *args and **kwargs',
          explanation:
            '`*args` gathers extra positional arguments into a tuple. `**kwargs` gathers extra keyword arguments into a dictionary. You can also use `*` and `**` to unpack sequences and dicts into function calls.',
          codeExample: `def configure_service(name, *flags, **settings):
    print(f"Service: {name}")
    print(f"Flags tuple: {flags}")
    print(f"Settings dict: {settings}")

configure_service("AuthServer", "v2", "ssl", port=8080, debug=True)`
        },
        {
          title: 'The LEGB Scoping Rule & Nonlocal Keyword',
          explanation:
            'Python searches for names in 4 scopes: Local -> Enclosing (nested functions) -> Global (module level) -> Built-in. Inside a nested function, assigning to an outer variable creates a new local variable unless declared with `nonlocal`.',
          codeExample: `def outer_counter():
    count = 0
    def inner_increment():
        nonlocal count # Rebinds enclosing scope variable!
        count += 1
        return count
    return inner_increment

c = outer_counter()
print(c()) # 1
print(c()) # 2`
        },
        {
          title: 'Structured Exception Handling: try, except, else, finally',
          explanation:
            '`try` wraps risky operations. `except SpecificError:` catches faults. The `else` block runs ONLY if no exception occurred. The `finally` block ALWAYS runs, even if exceptions occur or a `return` statement was executed.',
          codeExample: `def read_config_val(data, key):
    try:
        val = int(data[key])
    except KeyError:
        print("Key missing from config!")
        return None
    except ValueError:
        print("Value could not be parsed to integer!")
        return None
    else:
        print("Successfully read and parsed value.")
        return val
    finally:
        print("Audit operation recorded.")`
        }
      ],
      interviewTips: [
        'Always catch specific exceptions (e.g. `except (KeyError, ValueError):`) rather than a bare `except:`, which also intercepts system exit signals like KeyboardInterrupt.',
        'Lambdas are restricted to a single expression and cannot contain assignments or statements.',
        'Use `raise CustomError("message") from original_error` to preserve stack traces (exception chaining).'
      ],
      commonPitfalls: [
        {
          pitfall: 'Using `except Exception:` and silently passing with `pass`',
          solution:
            'Never hide critical crashes without logging or telemetry. At minimum, log `err`.'
        },
        {
          pitfall: 'Re-assigning a global variable inside a function without `global var_name`',
          solution:
            'Attempting `x += 1` inside a function where `x` is global raises `UnboundLocalError`. Declare `global x` or pass and return arguments explicitly.'
        }
      ],
      cheatSheet: `# Definition: def func(a, b=default, *args, **kwargs):
# Default idiom: param=None, then param = [] if param is None else param
# Scope: Local -> Enclosing -> Global -> Built-in (LEGB)
# Exceptions:
# try: ... except (TypeError, ValueError) as e: ... else: ... finally: ...`
    },
    mcqs: [
      {
        id: 'q4-1',
        question: 'What is printed after executing the two calls to `append_to()` below?',
        codeSnippet: `def append_to(element, target=[]):
    target.append(element)
    return target

print(append_to(1))
print(append_to(2))`,
        options: [
          '[1] then [2]',
          '[1] then [1, 2]',
          'Raises TypeError',
          '[1] then [2, 1]'
        ],
        correctIndex: 1,
        explanation:
          'Default parameters are evaluated once when the function is defined. Because `target` defaults to a mutable list, subsequent calls mutate that same list, printing `[1]` then `[1, 2]`.'
      },
      {
        id: 'q4-2',
        question: 'In nested functions, which keyword allows modifying a variable bound in an enclosing outer function scope?',
        options: ['global', 'nonlocal', 'outer', 'super'],
        correctIndex: 1,
        explanation:
          'The `nonlocal` keyword allows a nested closure to rebind variables declared in the nearest enclosing (non-global) scope.'
      },
      {
        id: 'q4-3',
        question: 'In what circumstance does the `else` clause of a `try...except...else...finally` statement execute?',
        options: [
          'Whenever an exception is caught and suppressed',
          'Only when the `try` block executes completely without raising any exception',
          'Before the `finally` block if an error occurred',
          'During every execution regardless of errors'
        ],
        correctIndex: 1,
        explanation:
          'In Python exception handling, `else` executes only if the `try` block completed successfully without throwing any exception.'
      },
      {
        id: 'q4-4',
        question: 'What is the value of `*args` and `**kwargs` inside the called function?',
        codeSnippet: `def demo(*args, **kwargs):
    print(type(args), type(kwargs))
demo(1, 2, a=3, b=4)`,
        options: [
          'args is list, kwargs is dict',
          'args is tuple, kwargs is dict',
          'args is tuple, kwargs is list',
          'Both are dicts'
        ],
        correctIndex: 1,
        explanation:
          '`*args` bundles positional arguments into a `tuple`, while `**kwargs` bundles named keyword arguments into a `dict`.'
      },
      {
        id: 'q4-5',
        question: 'What will be returned by this function?',
        codeSnippet: `def test_finally():
    try:
        return "TRY"
    finally:
        return "FINALLY"

print(test_finally())`,
        options: ['"TRY"', '"FINALLY"', 'Raises SyntaxError', 'Both "TRY" and "FINALLY"'],
        correctIndex: 1,
        explanation:
          'The `finally` block is guaranteed to execute. If it contains a `return` statement, it overrides any prior `return` statement encountered in the `try` or `except` blocks.'
      }
    ],
    codingProblems: [
      {
        id: 'p-fun-4-1',
        title: 'Safe Division & Batch Arithmetic Engine',
        difficulty: 'Easy',
        description:
          'Write a function `safe_divide_pairs(pairs: list[tuple]) -> list[dict]` that processes pairs of `(numerator, denominator)` and returns a list of dictionaries with structure:\n`{"input": list(pair), "status": "ok", "result": float_result}` on success, or\n`{"input": list(pair), "status": "error", "error": "ZeroDivision"}` if division by zero occurs, or\n`{"input": list(pair), "status": "error", "error": "InvalidType"}` if either element cannot be converted to float.\nRound successful results to 2 decimal places.',
        starterCode: `def safe_divide_pairs(pairs: list[tuple]) -> list[dict]:
    # Safely compute quotients catching ZeroDivisionError and (TypeError, ValueError)
    pass

# --- Example Test Call (Click 'Run Code' to execute) ---
print(safe_divide_pairs([(10, 2), (5, 0), ("a", 2)]))
# Expected Output: [{'input': (10, 2), 'status': 'ok', 'result': 5.0}, {'input': (5, 0), 'status': 'error', 'error': 'ZeroDivision'}, {'input': ('a', 2), 'status': 'error', 'error': 'InvalidType'}]`,
        solutionCode: `def safe_divide_pairs(pairs: list[tuple]) -> list[dict]:
    output = []
    for pair in pairs:
        try:
            num = float(pair[0])
            den = float(pair[1])
            res = num / den
        except ZeroDivisionError:
            output.append({"input": pair, "status": "error", "error": "ZeroDivision"})
        except (TypeError, ValueError):
            output.append({"input": pair, "status": "error", "error": "InvalidType"})
        else:
            output.append({"input": pair, "status": "ok", "result": round(res, 2)})
    return output`,
        explanation:
          'Wrap quotient calculation in a `try...except` block catching `ZeroDivisionError` and `(TypeError, ValueError)`, using `else` to record the rounded result.',
        testCases: [
          {
            input: 'safe_divide_pairs([(10, 2), (5, 0), ("a", 2)])',
            expectedOutput: "[{'input': (10, 2), 'status': 'ok', 'result': 5.0}, {'input': (5, 0), 'status': 'error', 'error': 'ZeroDivision'}, {'input': ('a', 2), 'status': 'error', 'error': 'InvalidType'}]",
            inputData: 'pairs = [(10, 2), (5, 0), ("a", 2)] (Valid quotient 5.0, ZeroDivisionError, and InvalidType conversion error)',
            parameters: { pairs: [[10, 2], [5, 0], ['a', 2]] }
          }
        ],
        hints: ['Catch `ZeroDivisionError` explicitly', 'Catch `(TypeError, ValueError)` for non-numeric items']
      },
      {
        id: 'p-fun-4-2',
        title: 'Variadic Predicate Multi-Filter',
        difficulty: 'Medium',
        description:
          'Write a higher-order function `multi_filter(items: list, *predicates) -> list` that takes a list and an arbitrary number of predicate functions (`*predicates`). Return a new list containing only the items that satisfy ALL passed predicate functions (i.e. every predicate returns True for that item). If no predicates are passed, return the items as a list copy.',
        starterCode: `def multi_filter(items: list, *predicates) -> list:
    # Filter items that satisfy all passed predicate functions
    pass

# --- Example Test Call (Click 'Run Code' to execute) ---
print(multi_filter([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], lambda x: x % 2 == 0, lambda x: x > 5))
# Expected Output: [6, 8, 10]`,
        solutionCode: `def multi_filter(items: list, *predicates) -> list:
    if not predicates:
        return list(items)
    return [x for x in items if all(p(x) for p in predicates)]`,
        explanation:
          'Use `all(p(x) for p in predicates)` inside a list comprehension to check that all predicate functions evaluate to True.',
        testCases: [
          {
            input: 'multi_filter([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], lambda x: x % 2 == 0, lambda x: x > 5)',
            expectedOutput: '[6, 8, 10]',
            inputData: 'items = [1..10], predicates = [is_even, is_gt_5] -> [6, 8, 10]',
            parameters: { items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }
          },
          {
            input: 'multi_filter([-2, -1, 0, 1, 2], lambda x: x > 0)',
            expectedOutput: '[1, 2]',
            inputData: 'items = [-2, -1, 0, 1, 2], predicate = [is_positive] -> [1, 2]',
            parameters: { items: [-2, -1, 0, 1, 2] }
          }
        ],
        hints: ['Use `all(p(item) for p in predicates)`', 'Handle empty predicates by returning `list(items)`']
      },
      {
        id: 'p-fun-4-3',
        title: 'Resilient Invoker with Max Retries Simulation',
        difficulty: 'Hard',
        description:
          'Write a function `resilient_invoke(func, attempts_data: list, max_retries: int = 3)` that simulates executing a flaky operation. In each attempt `i`, call `func(attempts_data[i])`. If the call succeeds (does not raise an exception), return `{"status": "success", "attempts": i + 1, "value": result}`.\nIf all attempts up to `max_retries` fail, return `{"status": "failed", "attempts": max_retries, "last_error": str(last_exception)}`.',
        starterCode: `def resilient_invoke(func, attempts_data: list, max_retries: int = 3) -> dict:
    # Attempt invocations up to max_retries
    pass

# --- Example Test Call (Click 'Run Code' to execute) ---
print(resilient_invoke(lambda x: 10 / x, [0, 0, 2], max_retries=3))
# Expected Output: {'attempts': 3, 'status': 'success', 'value': 5.0}`,
        solutionCode: `def resilient_invoke(func, attempts_data: list, max_retries: int = 3) -> dict:
    last_err = "No attempts"
    limit = min(len(attempts_data), max_retries)
    for i in range(limit):
        try:
            val = func(attempts_data[i])
            return {"status": "success", "attempts": i + 1, "value": val}
        except Exception as e:
            last_err = str(e)
    return {"status": "failed", "attempts": limit, "last_error": last_err}`,
        explanation:
          'Iterate through attempts up to max_retries. On success, return immediately with attempt count and value; on repeated failures, return error details.',
        testCases: [
          {
            input: 'resilient_invoke(lambda x: 10 / x, [0, 0, 2], max_retries=3)',
            expectedOutput: "{'attempts': 3, 'status': 'success', 'value': 5.0}",
            inputData: 'func = lambda x: 10 / x, attempts_data = [0, 0, 2] (Attempts 1 & 2 fail on 10/0, Attempt 3 succeeds: 10/2 = 5.0)',
            parameters: { attempts_data: [0, 0, 2], max_retries: 3 }
          },
          {
            input: 'resilient_invoke(lambda x: 10 / x, [0, 0, 0], max_retries=3)',
            expectedOutput: "{'attempts': 3, 'last_error': 'division by zero', 'status': 'failed'}",
            inputData: 'func = lambda x: 10 / x, attempts_data = [0, 0, 0] (All 3 retries fail on 10/0)',
            parameters: { attempts_data: [0, 0, 0], max_retries: 3 }
          }
        ],
        hints: ['Use `for i in range(min(len(attempts_data), max_retries)):`', 'Catch `Exception as e` and record `str(e)`']
      }
    ]
  },

  // ==========================================
  // SECTION 5: ADVANCED PYTHON (OOP, DECORATORS, GENERATORS & CONTEXT MANAGERS)
  // ==========================================
  {
    id: 'section-5-advanced',
    sectionNumber: 5,
    title: 'Advanced Python (OOP, Decorators, Generators & Context Managers)',
    subtitle: 'Dunder Protocols, Method Resolution Order, Yield & With Statements',
    level: 'Advanced',
    estimatedTime: '65 mins',
    summary:
      'Level up to enterprise software engineering: Object-Oriented design, dunder/magic methods, class vs static methods, function decorators with functools, memory-efficient generators with yield, and context managers.',
    notes: {
      overview:
        'Python is deeply object-oriented. Everything—including functions, modules, and primitive integers—is an object that inherits from `object`. Python relies on protocol-based polymorphism ("duck typing") and special "dunder" methods (e.g. `__iter__`, `__enter__`) rather than rigid interfaces. Advanced patterns like decorators, generators, and context managers allow writing clean, declarative, high-throughput code.',
      keyConcepts: [
        {
          title: 'Classes, Dunder Methods & Encapsulation',
          explanation:
            'The `__init__` constructor initializes instance state. Dunder methods allow custom classes to integrate seamlessly with Python syntax: `__str__` for human strings, `__repr__` for debug output, `__eq__` for `==`, `__len__` for `len()`, and `__getitem__` for indexing `obj[i]`. Private attributes use leading underscores (`_private` convention, `__mangled` name mangling).',
          codeExample: `class Vector2D:
    def __init__(self, x: float, y: float):
        self.x = x
        self.y = y

    def __add__(self, other):
        return Vector2D(self.x + other.x, self.y + other.y)

    def __repr__(self):
        return f"Vector2D({self.x}, {self.y})"

v1 = Vector2D(2, 3)
v2 = Vector2D(5, 7)
print(v1 + v2) # Vector2D(7, 10)`
        },
        {
          title: 'Instance vs Class (@classmethod) vs Static (@staticmethod)',
          explanation:
            'Instance methods receive `self` as the first argument. `@classmethod` receives the class `cls` as the first argument (ideal for factory constructors). `@staticmethod` receives neither and behaves like a regular function scoped inside the class namespace.',
          codeExample: `class User:
    def __init__(self, username, role):
        self.username = username
        self.role = role

    @classmethod
    def create_guest(cls):
        # Factory method:
        return cls("guest_user", "viewer")

    @staticmethod
    def is_valid_username(name):
        return len(name) >= 3 and name.isalnum()`
        },
        {
          title: 'Decorators and Higher-Order Wrappers',
          explanation:
            'A decorator is a callable that takes a function as an argument and returns a replacement wrapper function. Use `functools.wraps` to preserve the original function\'s name, docstring, and signature.',
          codeExample: `import functools

def log_execution(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        print(f"Calling {func.__name__}...")
        result = func(*args, **kwargs)
        print(f"{func.__name__} completed.")
        return result
    return wrapper

@log_execution
def calculate_tax(subtotal):
    return subtotal * 0.08`
        },
        {
          title: 'Generators (yield) and Memory Efficiency',
          explanation:
            'A generator is a function containing the `yield` keyword. Instead of returning a full list and exhausting RAM, it produces a generator iterator that yields one value at a time on demand via `next()`. Generators maintain their execution frame and local variables between yields.',
          codeExample: `def infinite_powers_of_two():
    val = 1
    while True:
        yield val
        val *= 2

gen = infinite_powers_of_two()
print(next(gen)) # 1
print(next(gen)) # 2
print(next(gen)) # 4`
        },
        {
          title: 'Context Managers: The "with" Statement',
          explanation:
            'The `with` statement ensures resources (files, database connections, locks) are reliably released. A context manager implements `__enter__` (returns the resource) and `__exit__` (handles cleanup and exceptions).',
          codeExample: `class ManagedResource:
    def __enter__(self):
        print("Resource acquired.")
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        print("Resource released cleanly.")
        return False # Propagate exception if any

with ManagedResource():
    print("Doing work inside context...")`
        }
      ],
      interviewTips: [
        'Method Resolution Order (MRO) determines the inheritance lookup order in multiple inheritance using the C3 linearization algorithm (`ClassName.__mro__`).',
        'Generators enable processing gigabyte-scale logs or infinite streams with strictly O(1) auxiliary memory.',
        '`__exit__` returns `True` to suppress an exception, or `False` (default) to let it propagate up.'
      ],
      commonPitfalls: [
        {
          pitfall: 'Forgetting `@functools.wraps(func)` inside custom decorators',
          solution:
            'Without `functools.wraps`, the decorated function loses its `__name__` and `__doc__`, complicating debugging and introspection tools.'
        },
        {
          pitfall: 'Attempting to iterate through a generator twice',
          solution:
            'Generators are single-use iterators. Once exhausted (raising `StopIteration`), you must instantiate a fresh generator object.'
        }
      ],
      cheatSheet: `# Class: class MyClass(Parent): def __init__(self): ...
# Methods: instance(self), @classmethod(cls), @staticmethod()
# Dunders: __repr__, __str__, __len__, __eq__, __getitem__, __enter__, __exit__
# Decorator: def dec(fn): @wraps(fn) def wrap(*a, **k): return fn(*a, **k); return wrap
# Generator: def gen(): for x in it: yield x`
    },
    mcqs: [
      {
        id: 'q5-1',
        question: 'What is the key difference between `@classmethod` and `@staticmethod` in Python?',
        options: [
          '@classmethod receives the class object `cls` as its first parameter; @staticmethod receives neither `self` nor `cls`',
          '@classmethod is private, whereas @staticmethod is public',
          '@staticmethod cannot be called on class instances',
          '@classmethod runs at compile time, whereas @staticmethod runs at runtime'
        ],
        correctIndex: 0,
        explanation:
          'Methods decorated with `@classmethod` receive the class `cls` as their implicit first parameter. Methods with `@staticmethod` receive no implicit first argument and act like plain functions.'
      },
      {
        id: 'q5-2',
        question: 'Why does creating a generator using `yield` require drastically less memory than building a list for 10,000,000 items?',
        options: [
          'Generators compress data using gzip in memory',
          'Generators evaluate values lazily one-by-one on demand, storing only the current frame state in memory',
          'Generators run in C memory space outside the Python heap',
          'Generators store data on the disk swap file'
        ],
        correctIndex: 1,
        explanation:
          'Generators compute values lazily upon each `next()` call, maintaining O(1) auxiliary memory rather than allocating a 10-million element array.'
      },
      {
        id: 'q5-3',
        question: 'What is the purpose of applying `@functools.wraps(func)` inside a decorator function?',
        options: [
          'To make the decorated function asynchronous',
          'To preserve the original function metadata such as `__name__`, `__doc__`, and signature',
          'To prevent the function from throwing exceptions',
          'To enforce static type checking'
        ],
        correctIndex: 1,
        explanation:
          '`@functools.wraps(func)` copies the original function\'s name, docstrings, annotations, and module metadata onto the wrapper.'
      },
      {
        id: 'q5-4',
        question: 'What parameters does the dunder method `__exit__(self, ...)` receive in a context manager?',
        options: [
          'Only `self` and `result`',
          '`self`, `exc_type`, `exc_val`, and `exc_tb`',
          '`self`, `*args`, and `**kwargs`',
          '`self` and `exit_code`'
        ],
        correctIndex: 1,
        explanation:
          'When exiting a `with` block, `__exit__(self, exc_type, exc_val, exc_tb)` receives the exception class, exception value, and traceback if an error occurred (or None, None, None if successful).'
      },
      {
        id: 'q5-5',
        question: 'What happens if you attempt to loop through a generator object that has already been exhausted?',
        options: [
          'It automatically rewinds and restarts from the beginning',
          'It yields nothing and terminates immediately without raising an unhandled error',
          'Raises a fatal GeneratorExhaustedError',
          'Returns a list of None'
        ],
        correctIndex: 1,
        explanation:
          'Generators are single-pass streams. Once exhausted, calling `next()` raises `StopIteration`, which standard `for` loops catch cleanly, resulting in 0 iterations.'
      }
    ],
    codingProblems: [
      {
        id: 'p-fun-5-1',
        title: 'BankAccount Class with Encapsulated Balance & Transaction Ledger',
        difficulty: 'Medium',
        description:
          'Implement a class `BankAccount` with the following requirements:\n1. `__init__(self, owner: str, initial_balance: float = 0.0)`: initializes `owner`, `_balance`, and a list `transactions` (starting with `("DEPOSIT", initial_balance)` if initial_balance > 0).\n2. `deposit(self, amount: float) -> bool`: if amount > 0, adds to `_balance`, records `("DEPOSIT", amount)` in transactions, returns True; else returns False.\n3. `withdraw(self, amount: float) -> bool`: if 0 < amount <= `_balance`, deducts from `_balance`, records `("WITHDRAWAL", amount)` in transactions, returns True; else returns False.\n4. `get_balance(self) -> float`: returns current `_balance`.\n5. `__repr__(self)`: returns `f"BankAccount(owner=\'{self.owner}\', balance={self._balance:.2f})"`.',
        starterCode: `class BankAccount:
    def __init__(self, owner: str, initial_balance: float = 0.0):
        # Initialize attributes
        pass

    def deposit(self, amount: float) -> bool:
        pass

    def withdraw(self, amount: float) -> bool:
        pass

    def get_balance(self) -> float:
        pass

    def __repr__(self) -> str:
        pass

# --- Example Test Call (Click 'Run Code' to execute) ---
acc = BankAccount("Alice", 100)
acc.deposit(50)
acc.withdraw(30)
print(acc)  # Expected Output: BankAccount(owner='Alice', balance=120.00)`,
        solutionCode: `class BankAccount:
    def __init__(self, owner: str, initial_balance: float = 0.0):
        self.owner = owner
        self._balance = float(initial_balance)
        self.transactions = []
        if self._balance > 0:
            self.transactions.append(("DEPOSIT", self._balance))

    def deposit(self, amount: float) -> bool:
        if amount > 0:
            self._balance += amount
            self.transactions.append(("DEPOSIT", float(amount)))
            return True
        return False

    def withdraw(self, amount: float) -> bool:
        if 0 < amount <= self._balance:
            self._balance -= amount
            self.transactions.append(("WITHDRAWAL", float(amount)))
            return True
        return False

    def get_balance(self) -> float:
        return round(self._balance, 2)

    def __repr__(self) -> str:
        return f"BankAccount(owner='{self.owner}', balance={self._balance:.2f})"`,
        explanation:
          'Encapsulates balance logic, validates withdrawal limits, maintains an immutable transaction history log, and formats `__repr__`.',
        testCases: [
          {
            input: 'test_account_deposit_and_withdraw()',
            testCode: `acc = BankAccount("Alice", 100)\nacc.deposit(50)\nacc.withdraw(30)\nreturn str(acc)`,
            expectedOutput: "BankAccount(owner='Alice', balance=120.00)",
            inputData: 'acc = BankAccount("Alice", 100); acc.deposit(50); acc.withdraw(30); str(acc)',
            parameters: { owner: 'Alice', initial_balance: 100, deposit: 50, withdraw: 30 }
          },
          {
            input: 'test_overdraw_prevention()',
            testCode: `acc = BankAccount("Bob", 50)\nreturn acc.withdraw(100)`,
            expectedOutput: 'False',
            inputData: 'acc = BankAccount("Bob", 50); acc.withdraw(100) -> Overdraft returns False',
            parameters: { owner: 'Bob', initial_balance: 50, withdraw_attempt: 100 }
          }
        ],
        hints: ['Check `amount > 0` for deposits', 'Ensure `amount <= self._balance` before permitting withdrawals']
      },
      {
        id: 'p-fun-5-2',
        title: 'Call Counter & Argument Logger Decorator',
        difficulty: 'Medium',
        description:
          'Write a decorator `track_calls(func)` that tracks how many times the decorated function is invoked and records its call history:\n- The wrapped function must retain its original name via `@functools.wraps`.\n- Attach an attribute `func.call_count: int` starting at 0 and incrementing on each call.\n- Attach an attribute `func.history: list[tuple]` that appends `(args, kwargs, result)` on each invocation.\n- Return the original function\'s computed return value.',
        starterCode: `import functools

def track_calls(func):
    # Implement wrapper tracking call_count and history
    pass

# --- Example Test Call (Click 'Run Code' to execute) ---
@track_calls
def add(a, b): return a + b
add(2, 3)
add(4, 5)
print(f"Call count: {add.call_count}")  # Expected Output: Call count: 2`,
        solutionCode: `import functools

def track_calls(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        res = func(*args, **kwargs)
        wrapper.call_count += 1
        wrapper.history.append((args, kwargs, res))
        return res
    wrapper.call_count = 0
    wrapper.history = []
    return wrapper`,
        explanation:
          'Initialize `.call_count = 0` and `.history = []` on the wrapper object. In each call, invoke `func`, update trackers, and return the result.',
        testCases: [
          {
            input: 'test_decorator_call_count()',
            testCode: `@track_calls\ndef add(a, b): return a + b\nadd(2, 3)\nadd(4, 5)\nreturn add.call_count`,
            expectedOutput: '2',
            inputData: '@track_calls decorating add(a, b); called add(2, 3) and add(4, 5) -> Check add.call_count',
            parameters: { calls: ['add(2, 3)', 'add(4, 5)'] }
          },
          {
            input: 'test_decorator_history()',
            testCode: `@track_calls\ndef greet(name): return f"Hi {name}"\ngreet("Alice")\nreturn greet.history[0][2]`,
            expectedOutput: 'Hi Alice',
            inputData: '@track_calls decorating greet("Alice") -> Check greet.history[0][2]',
            parameters: { calls: ['greet("Alice")'] }
          }
        ],
        hints: ['Initialize `wrapper.call_count = 0` before returning `wrapper`', 'Use `@functools.wraps(func)`']
      },
      {
        id: 'p-fun-5-3',
        title: 'Bounded Fibonacci & Prime Number Generator',
        difficulty: 'Hard',
        description:
          'Write a generator function `bounded_prime_fib(max_val: int)` that yields numbers up to `max_val` that are BOTH in the Fibonacci sequence AND are prime numbers! (e.g. 2, 3, 5, 13, 89, ...).\n- Fibonacci starts with 0, 1, 1, 2, 3, 5...\n- Primes are integers > 1 with no positive divisors other than 1 and themselves.\n- Stop yielding once Fibonacci numbers exceed `max_val`.',
        starterCode: `def bounded_prime_fib(max_val: int):
    # Yield numbers that are both Fibonacci numbers and prime up to max_val
    pass

# --- Example Test Call (Click 'Run Code' to execute) ---
print(list(bounded_prime_fib(20)))  # Expected Output: [2, 3, 5, 13]`,
        solutionCode: `def bounded_prime_fib(max_val: int):
    def is_prime(n: int) -> bool:
        if n < 2:
            return False
        for i in range(2, int(n**0.5) + 1):
            if n % i == 0:
                return False
        return True

    a, b = 0, 1
    while b <= max_val:
        if is_prime(b):
            yield b
        a, b = b, a + b`,
        explanation:
          'Generate Fibonacci sequence numbers sequentially with `a, b = b, a + b`. For each number, test primality using trial division up to `sqrt(n)`, yielding qualifying values.',
        testCases: [
          {
            input: 'list(bounded_prime_fib(20))',
            expectedOutput: '[2, 3, 5, 13]',
            inputData: 'max_val = 20 (Fibonacci numbers <= 20 that are prime: 2, 3, 5, 13)',
            parameters: { max_val: 20 }
          },
          {
            input: 'list(bounded_prime_fib(100))',
            expectedOutput: '[2, 3, 5, 13, 89]',
            inputData: 'max_val = 100 (Fibonacci numbers <= 100 that are prime: 2, 3, 5, 13, 89)',
            parameters: { max_val: 100 }
          }
        ],
        hints: ['Use `a, b = 0, 1` then `a, b = b, a + b`', 'Test `is_prime(b)` before yielding']
      }
    ]
  }
];
