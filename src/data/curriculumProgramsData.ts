import { SolvedBasicProgram, DayTipAndTrick } from '../types';

export interface DaySolvedData {
  basicPrograms: SolvedBasicProgram[];
  tipsAndTricks: DayTipAndTrick[];
}

export const DAY_PROGRAMS_AND_TIPS: Record<string, DaySolvedData> = {
  // ==========================================
  // DAY 1: PATTERN PROGRAMMING
  // ==========================================
  T1: {
    basicPrograms: [
      {
        id: 'bp-t1-1',
        title: 'Right-Angled Star Triangle',
        difficulty: 'Beginner',
        concept: 'Outer-Inner Nested Loop Mapping',
        problemStatement: 'Print a right-angled triangle of height N where row 1 has 1 star, row 2 has 2 stars, up to row N having N stars.',
        logicSteps: [
          'Identify row count: The outer loop runs from row = 1 to N.',
          'Identify column count: In any row `i`, exactly `i` stars need to be printed.',
          'Format output: In Python, you can either print character by character with end="" or use string multiplication `*` * i.',
          'After printing row `i`, print a newline to advance to the next line.'
        ],
        code: `def print_right_triangle(n: int):\n    # Outer loop controls row number from 1 to n\n    for i in range(1, n + 1):\n        # Inner logic: print 'i' stars separated by spaces\n        row_stars = "* " * i\n        print(row_stars.strip())\n\n# Example execution\nprint_right_triangle(5)`,
        sampleInput: 'n = 5',
        sampleOutput: '*\n* *\n* * *\n* * * *\n* * * * *',
        timeComplexity: 'O(N^2)',
        spaceComplexity: 'O(1)',
        tipOrTrick: 'Use string multiplication `"* " * i` combined with `.strip()` to avoid trailing space errors in automated judges.'
      },
      {
        id: 'bp-t1-2',
        title: 'Inverted Right-Angled Number Triangle',
        difficulty: 'Beginner',
        concept: 'Decreasing Row Loop Bounds',
        problemStatement: 'Print an inverted triangle of numbers where row 1 displays 1 to N, row 2 displays 1 to N-1, down to 1.',
        logicSteps: [
          'Outer loop variable `i` controls the number of columns to print in the current row: starts at N and decrements down to 1.',
          'Inner loop variable `j` runs from 1 to `i` printing each number followed by a space.',
          'Notice how range step parameter `range(n, 0, -1)` provides clean countdown logic.'
        ],
        code: `def print_inverted_number_triangle(n: int):\n    # Count down from n to 1\n    for i in range(n, 0, -1):\n        for j in range(1, i + 1):\n            print(j, end=" " if j < i else "")\n        print()  # Newline after each row\n\n# Example execution\nprint_inverted_number_triangle(5)`,
        sampleInput: 'n = 5',
        sampleOutput: '1 2 3 4 5\n1 2 3 4\n1 2 3\n1 2\n1',
        timeComplexity: 'O(N^2)',
        spaceComplexity: 'O(1)',
        tipOrTrick: 'Using `end=" " if j < i else ""` perfectly suppresses trailing spaces without calling `.rstrip()`.'
      },
      {
        id: 'bp-t1-3',
        title: 'Symmetric Centered Star Pyramid',
        difficulty: 'Easy',
        concept: 'Two-Part Inner Grid: Leading Spaces + Odd Stars',
        problemStatement: 'Print an equilateral centered pyramid of height N where row `i` has (N - i) leading spaces and (2*i - 1) stars.',
        logicSteps: [
          'Calculate leading spaces: Row 1 needs (N - 1) spaces, Row 2 needs (N - 2) spaces, Row `i` needs (N - i) spaces.',
          'Calculate star count: Odd numbers sequence: 1, 3, 5, 7, ... which is given by `2 * i - 1`.',
          'Combine them: `" " * (n - i) + "*" * (2 * i - 1)` directly renders each row.'
        ],
        code: `def print_pyramid(n: int):\n    for i in range(1, n + 1):\n        spaces = " " * (n - i)\n        stars = "*" * (2 * i - 1)\n        print(spaces + stars)\n\n# Example execution\nprint_pyramid(4)`,
        sampleInput: 'n = 4',
        sampleOutput: '   *\n  ***\n *****\n*******',
        timeComplexity: 'O(N^2)',
        spaceComplexity: 'O(1)',
        tipOrTrick: 'The formula for any arithmetic sequence is `start + (step * index)`. For odd counts starting at 1, it is always `2*i - 1`.'
      },
      {
        id: 'bp-t1-4',
        title: 'Hollow Square Frame',
        difficulty: 'Easy',
        concept: 'Coordinate Boundary Condition Checking',
        problemStatement: 'Print a hollow square of size N where only the outer boundary contains stars, and inner cells are blank spaces.',
        logicSteps: [
          'Think of coordinates `(row, col)` from 0 to N-1.',
          'Identify boundary condition: A star is printed if `row == 0` or `row == n-1` or `col == 0` or `col == n-1`.',
          'Otherwise, an inner space `" "` is printed.',
          'This coordinate-check pattern is identical to finding matrix borders.'
        ],
        code: `def print_hollow_square(n: int):\n    for r in range(n):\n        row_chars = []\n        for c in range(n):\n            if r == 0 or r == n - 1 or c == 0 or c == n - 1:\n                row_chars.append("*")\n            else:\n                row_chars.append(" ")\n        print(" ".join(row_chars))\n\n# Example execution\nprint_hollow_square(5)`,
        sampleInput: 'n = 5',
        sampleOutput: '* * * * *\n*       *\n*       *\n*       *\n* * * * *',
        timeComplexity: 'O(N^2)',
        spaceComplexity: 'O(N)',
        tipOrTrick: 'Accumulating row characters into a list and using `" ".join()` makes grid formatting readable and avoids spacing mistakes.'
      },
      {
        id: 'bp-t1-5',
        title: "Floyd's Continuous Natural Number Triangle",
        difficulty: 'Easy',
        concept: 'Stateful Accumulator Across Loop Iterations',
        problemStatement: 'Print a triangle of height N where numbers increment continuously: 1 in row 1; 2 3 in row 2; 4 5 6 in row 3, etc.',
        logicSteps: [
          'Maintain a persistent variable `current_num = 1` outside the loops.',
          'Outer loop `i` runs from 1 to N.',
          'Inner loop runs `i` times: print `current_num`, increment `current_num += 1`.',
          'Notice that `current_num` is NOT reset on each row.'
        ],
        code: `def print_floyds_triangle(n: int):\n    num = 1\n    for i in range(1, n + 1):\n        row_vals = []\n        for _ in range(i):\n            row_vals.append(str(num))\n            num += 1\n        print(" ".join(row_vals))\n\n# Example execution\nprint_floyds_triangle(4)`,
        sampleInput: 'n = 4',
        sampleOutput: '1\n2 3\n4 5 6\n7 8 9 10',
        timeComplexity: 'O(N^2)',
        spaceComplexity: 'O(N)',
        tipOrTrick: 'Whenever pattern numbers do not restart at 1 every row, declare your counter outside the outer loop!'
      }
    ],
    tipsAndTricks: [
      {
        title: 'Python String Multiplication Speedup',
        category: 'Pythonic Shortcut',
        explanation: 'In Python, `"*" * k` runs in fast C-level memory. You often do not need nested loops just to print uniform repeated characters.',
        codeSnippet: `# Instead of loop:\n# for _ in range(k): print("*", end="")\n# Simply write:\nprint("*" * k)`
      },
      {
        title: 'Controlling Spacing & Newlines',
        category: 'Logic Building',
        explanation: 'The `print()` function defaults to `end="\\n"`. Pass `end=" "` to print horizontally on the same line, or `end=""` for tight character joining.',
        codeSnippet: `print("Hello", end=" ")  # Prints on same line with space\nprint("World")          # Adds newline at the end`
      },
      {
        title: 'The Golden Grid Boundary Rule',
        category: 'Edge Case Guard',
        explanation: 'To print hollow shapes, diagonal crosses, or borders: define boolean checks on indices: `r == 0 or r == n-1` (horizontal border), `c == 0 or c == m-1` (vertical border), `r == c` (main diagonal), `r + c == n - 1` (anti-diagonal).',
        codeSnippet: `is_border = (r == 0 or r == n - 1 or c == 0 or c == n - 1)`
      },
      {
        title: 'Off-By-One Range Mental Anchor',
        category: 'Logic Building',
        explanation: 'In Python, `range(a, b)` generates numbers from `a` up to `b - 1`. If you want N rows indexed 1 through N, always specify `range(1, n + 1)`.',
        codeSnippet: `for i in range(1, n + 1):  # Guarantees i reaches n`
      }
    ]
  },

  // ==========================================
  // DAY 2: ARRAYS (1D)
  // ==========================================
  T2: {
    basicPrograms: [
      {
        id: 'bp-t2-1',
        title: 'Find Min and Max Without Built-In Functions',
        difficulty: 'Beginner',
        concept: 'Linear Scan with Running Extremes',
        problemStatement: 'Given a list of numbers, find the maximum and minimum values without calling python `max()` or `min()`.',
        logicSteps: [
          'Initialize `min_val` and `max_val` to the first element `arr[0]`, never 0 (as negative numbers would break 0 initializers).',
          'Iterate through the array starting from index 1 to the end.',
          'If current element is greater than `max_val`, update `max_val`. If smaller than `min_val`, update `min_val`.',
          'Return the tuple `(min_val, max_val)`.'
        ],
        code: `def find_min_max(arr: list[int]) -> tuple[int, int]:\n    if not arr:\n        raise ValueError("List cannot be empty")\n    \n    min_val = arr[0]\n    max_val = arr[0]\n    \n    for num in arr[1:]:\n        if num > max_val:\n            max_val = num\n        elif num < min_val:\n            min_val = num\n            \n    return min_val, max_val\n\n# Example execution\nprint(find_min_max([12, 45, 2, 89, 34, -5, 27]))`,
        sampleInput: '[12, 45, 2, 89, 34, -5, 27]',
        sampleOutput: '(-5, 89)',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        tipOrTrick: 'Always initialize running min/max with `arr[0]` or `float("-inf")` / `float("inf")`. Initializing with 0 fails if all elements are negative!'
      },
      {
        id: 'bp-t2-2',
        title: 'Linear Search with Multiple Occurrence Indices',
        difficulty: 'Beginner',
        concept: 'Index Enumeration & Conditional Accumulation',
        problemStatement: 'Search for a target value in a list and return all zero-based indices where the target occurs, or an empty list if not found.',
        logicSteps: [
          'Create an empty accumulator list `indices = []`.',
          'Use `enumerate(arr)` to get both index `i` and element `val` simultaneously.',
          'Whenever `val == target`, append `i` to `indices`.',
          'Return `indices`.'
        ],
        code: `def search_all_occurrences(arr: list, target) -> list[int]:\n    matching_indices = []\n    for idx, item in enumerate(arr):\n        if item == target:\n            matching_indices.append(idx)\n    return matching_indices\n\n# Example execution\nnums = [10, 20, 30, 20, 40, 20, 50]\nprint(search_all_occurrences(nums, 20))`,
        sampleInput: 'arr = [10, 20, 30, 20, 40, 20, 50], target = 20',
        sampleOutput: '[1, 3, 5]',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(K) where K is occurrence count',
        tipOrTrick: 'Prefer `for idx, val in enumerate(arr)` over `for i in range(len(arr)): val = arr[i]`. It is faster and more Pythonic.'
      },
      {
        id: 'bp-t2-3',
        title: 'Count Even, Odd, and Zero Elements',
        difficulty: 'Beginner',
        concept: 'Three-Way Branching & Modulo Arithmetic',
        problemStatement: 'Given a list of integers, count how many elements are zero, strictly positive even, and strictly odd.',
        logicSteps: [
          'Initialize three counters: `zeros = 0`, `evens = 0`, `odds = 0`.',
          'Check for zero first: `if num == 0: zeros += 1`.',
          'Else check parity: `if num % 2 == 0: evens += 1 else: odds += 1`.',
          'Return a dictionary or tuple of counts.'
        ],
        code: `def count_parity_and_zeros(arr: list[int]) -> dict:\n    counts = {"zeros": 0, "evens": 0, "odds": 0}\n    for x in arr:\n        if x == 0:\n            counts["zeros"] += 1\n        elif x % 2 == 0:\n            counts["evens"] += 1\n        else:\n            counts["odds"] += 1\n    return counts\n\n# Example execution\nprint(count_parity_and_zeros([0, 1, 4, 7, 8, 0, 11, -2]))`,
        sampleInput: '[0, 1, 4, 7, 8, 0, 11, -2]',
        sampleOutput: "{'zeros': 2, 'evens': 3, 'odds': 3}",
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        tipOrTrick: 'Remember that 0 is mathematically even, but in competitive programming, tasks often treat 0 as a distinct bucket; always test 0 first!'
      },
      {
        id: 'bp-t2-4',
        title: 'Check if List is Sorted in Non-Decreasing Order',
        difficulty: 'Easy',
        concept: 'Adjacent Element Invariant & Early Exit',
        problemStatement: 'Determine whether a list of numbers is sorted in ascending order (where duplicates are allowed, i.e., arr[i] <= arr[i+1]).',
        logicSteps: [
          'If array length is <= 1, it is already sorted by definition; return True.',
          'Loop from `i = 0` to `len(arr) - 2`.',
          'Compare neighbor elements: if `arr[i] > arr[i + 1]`, the invariant is violated; return False immediately.',
          'If loop finishes with no violations, return True.'
        ],
        code: `def is_sorted(arr: list[int]) -> bool:\n    # Early exit if empty or single item\n    if len(arr) <= 1:\n        return True\n        \n    for i in range(len(arr) - 1):\n        # Invariant violation check\n        if arr[i] > arr[i + 1]:\n            return False\n            \n    return True\n\n# Example execution\nprint(is_sorted([1, 2, 2, 4, 9]))  # True\nprint(is_sorted([1, 5, 3, 9]))     # False`,
        sampleInput: '[1, 2, 2, 4, 9] and [1, 5, 3, 9]',
        sampleOutput: 'True and False',
        timeComplexity: 'O(N) with O(1) best case',
        spaceComplexity: 'O(1)',
        tipOrTrick: 'When checking adjacent elements, loop up to `len(arr) - 1` to prevent index out of bounds error when reading `arr[i + 1]`.'
      },
      {
        id: 'bp-t2-5',
        title: 'Remove Duplicates While Preserving Original Order',
        difficulty: 'Easy',
        concept: 'Hash Set Lookup for O(1) Seen Tracking',
        problemStatement: 'Given a list with duplicate entries, produce a new list with unique elements in the exact order of their first appearance.',
        logicSteps: [
          'Converting `list(set(arr))` removes duplicates but destroys the original order!',
          'To preserve order: maintain a `seen = set()` for O(1) membership checks and an `ordered_unique = []` list.',
          'Iterate through elements: if element not in `seen`, add it to `seen` and append to `ordered_unique`.',
          'Returns result in linear O(N) time.'
        ],
        code: `def remove_duplicates_ordered(arr: list) -> list:\n    seen = set()\n    unique_list = []\n    for item in arr:\n        if item not in seen:\n            seen.add(item)\n            unique_list.append(item)\n    return unique_list\n\n# Example execution\nprint(remove_duplicates_ordered([4, 5, 2, 4, 1, 5, 9, 2]))`,
        sampleInput: '[4, 5, 2, 4, 1, 5, 9, 2]',
        sampleOutput: '[4, 5, 2, 1, 9]',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(N)',
        tipOrTrick: 'In Python 3.7+, `list(dict.fromkeys(arr))` also removes duplicates while preserving order in one line!'
      }
    ],
    tipsAndTricks: [
      {
        title: 'The Mutation Hazard: Never Delete While Iterating',
        category: 'Edge Case Guard',
        explanation: 'Removing items from a list while looping over it skips the element immediately following the deleted one because indices shift left.',
        codeSnippet: `# BAD: skips items\n# for x in lst:\n#     if x < 0: lst.remove(x)\n\n# GOOD: Filter with list comprehension\nlst = [x for x in lst if x >= 0]`
      },
      {
        title: 'List Slicing Creates a Copy',
        category: 'Performance Trick',
        explanation: '`arr[:]` or `arr[1:5]` creates an independent shallow copy in memory. If memory is tight, pass start/end indices instead of sub-slicing.',
        codeSnippet: `shallow_copy = arr[:]  # Changes to shallow_copy won't affect arr`
      },
      {
        title: 'Fast Aggregations with Generator Expressions',
        category: 'Pythonic Shortcut',
        explanation: 'Compute sum of squares, counts, or conditional checks memory-efficiently without building intermediate lists.',
        codeSnippet: `positive_sum = sum(x for x in arr if x > 0)\nhas_negative = any(x < 0 for x in arr)`
      },
      {
        title: 'Sentinel Values for Min/Max',
        category: 'Logic Building',
        explanation: 'When searching for the largest negative number or smallest positive, use `float("-inf")` and `float("inf")` as safe identity values.',
        codeSnippet: `max_negative = float("-inf")\nmin_positive = float("inf")`
      }
    ]
  },

  // ==========================================
  // DAY 3: ARRAYS 1D (ADVANCED)
  // ==========================================
  T3: {
    basicPrograms: [
      {
        id: 'bp-t3-1',
        title: 'In-Place Array Reversal using Two Pointers',
        difficulty: 'Easy',
        concept: 'Opposite-End Two-Pointer Swapping',
        problemStatement: 'Reverse a list in-place without using `arr.reverse()`, `arr[::-1]`, or allocating an auxiliary array.',
        logicSteps: [
          'Place pointer `left` at index 0 and `right` at index `len(arr) - 1`.',
          'While `left < right`: swap `arr[left]` and `arr[right]`.',
          'Increment `left += 1`, decrement `right -= 1`.',
          'Stop when pointers cross. The array is reversed in O(N/2) = O(N) operations with O(1) auxiliary memory.'
        ],
        code: `def reverse_in_place(arr: list) -> None:\n    left = 0\n    right = len(arr) - 1\n    \n    while left < right:\n        # Simultaneous tuple swap in Python\n        arr[left], arr[right] = arr[right], arr[left]\n        left += 1\n        right -= 1\n\n# Example execution\nnums = [10, 20, 30, 40, 50]\nreverse_in_place(nums)\nprint(nums)`,
        sampleInput: '[10, 20, 30, 40, 50]',
        sampleOutput: '[50, 40, 30, 20, 10]',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1) in-place',
        tipOrTrick: 'Python allows simultaneous in-place swap `a, b = b, a` without needing a temporary variable `temp`.'
      },
      {
        id: 'bp-t3-2',
        title: 'Two Sum on Sorted Array',
        difficulty: 'Easy',
        concept: 'Greedy Monotonic Two-Pointer Convergence',
        problemStatement: 'Given a sorted array of integers and a target sum, find the pair of elements that sum up to target in O(N) time.',
        logicSteps: [
          'Initialize `left = 0`, `right = len(arr) - 1`.',
          'Calculate `current_sum = arr[left] + arr[right]`.',
          'If `current_sum == target`: return `(arr[left], arr[right])`.',
          'If `current_sum < target`: the sum is too small, so increase it by incrementing `left += 1`.',
          'If `current_sum > target`: the sum is too large, so decrease it by decrementing `right -= 1`.'
        ],
        code: `def two_sum_sorted(arr: list[int], target: int) -> tuple[int, int] | None:\n    left = 0\n    right = len(arr) - 1\n    \n    while left < right:\n        curr_sum = arr[left] + arr[right]\n        if curr_sum == target:\n            return arr[left], arr[right]\n        elif curr_sum < target:\n            left += 1\n        else:\n            right -= 1\n            \n    return None\n\n# Example execution\nprint(two_sum_sorted([2, 5, 8, 11, 15, 18], 19))`,
        sampleInput: 'arr = [2, 5, 8, 11, 15, 18], target = 19',
        sampleOutput: '(8, 11)',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        tipOrTrick: 'Two-pointer on sorted arrays replaces an O(N^2) nested loop with a clean O(N) single pass.'
      },
      {
        id: 'bp-t3-3',
        title: 'Move Zeros to End In-Place',
        difficulty: 'Medium',
        concept: 'Fast-Slow Pointer Partitioning',
        problemStatement: 'Move all 0s to the end of an array while maintaining the relative order of the non-zero elements.',
        logicSteps: [
          'Maintain a pointer `insert_pos = 0` which records where the next non-zero number belongs.',
          'Iterate through the array with `i`. When `arr[i] != 0`, swap `arr[i]` with `arr[insert_pos]` and increment `insert_pos += 1`.',
          'All non-zero elements get shifted to the left sequentially, and zeros bubble to the right.'
        ],
        code: `def move_zeros_to_end(arr: list[int]) -> None:\n    insert_pos = 0\n    for i in range(len(arr)):\n        if arr[i] != 0:\n            # Swap non-zero to insert position\n            arr[insert_pos], arr[i] = arr[i], arr[insert_pos]\n            insert_pos += 1\n\n# Example execution\nnums = [0, 1, 0, 3, 12, 0, 5]\nmove_zeros_to_end(nums)\nprint(nums)`,
        sampleInput: '[0, 1, 0, 3, 12, 0, 5]',
        sampleOutput: '[1, 3, 12, 5, 0, 0, 0]',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1) in-place',
        tipOrTrick: 'This fast-slow pointer pattern is the exact foundational building block for QuickSort partitioning.'
      },
      {
        id: 'bp-t3-4',
        title: 'Prefix Sum Array & Range Query',
        difficulty: 'Easy',
        concept: 'Cumulative Sum Precomputation',
        problemStatement: 'Construct a prefix sum array where each index `i` stores the sum of elements from index 0 to `i`. Use it to query sub-array sums in O(1).',
        logicSteps: [
          'Initialize `prefix = [0] * len(arr)`. Set `prefix[0] = arr[0]`.',
          'For `i` from 1 to `len(arr) - 1`, compute: `prefix[i] = prefix[i - 1] + arr[i]`.',
          'To query sum of sub-array from index `L` to `R`: if `L == 0`, answer is `prefix[R]`; otherwise `prefix[R] - prefix[L - 1]` in O(1) time.'
        ],
        code: `def build_prefix_sum(arr: list[int]) -> list[int]:\n    if not arr:\n        return []\n    prefix = [0] * len(arr)\n    prefix[0] = arr[0]\n    for i in range(1, len(arr)):\n        prefix[i] = prefix[i - 1] + arr[i]\n    return prefix\n\ndef query_range_sum(prefix: list[int], L: int, R: int) -> int:\n    if L == 0:\n        return prefix[R]\n    return prefix[R] - prefix[L - 1]\n\n# Example execution\nnums = [3, 1, 4, 1, 5, 9, 2]\npref = build_prefix_sum(nums)\nprint("Prefix array:", pref)\nprint("Sum from index 2 to 5:", query_range_sum(pref, 2, 5))`,
        sampleInput: 'nums = [3, 1, 4, 1, 5, 9, 2], Range: L=2, R=5',
        sampleOutput: 'Prefix array: [3, 4, 8, 9, 14, 23, 25]\nSum from index 2 to 5: 19',
        timeComplexity: 'O(N) preprocessing, O(1) per range query',
        spaceComplexity: 'O(N)',
        tipOrTrick: 'Any problem asking for multiple subarray sum queries can be reduced from O(N * Q) to O(N + Q) with prefix sums.'
      },
      {
        id: 'bp-t3-5',
        title: 'Exact Median Calculator for Even/Odd Lists',
        difficulty: 'Easy',
        concept: 'Sorted Array Index Mathematics',
        problemStatement: 'Calculate the mathematical median of a list of numbers without using `statistics.median()`.',
        logicSteps: [
          'Sort a copy of the list: `sorted_arr = sorted(arr)`. Let `n = len(sorted_arr)`.',
          'If `n` is odd: median is the single middle element at index `n // 2`.',
          'If `n` is even: median is the average of the two central elements at `n // 2 - 1` and `n // 2`.'
        ],
        code: `def calculate_median(arr: list[float]) -> float:\n    if not arr:\n        raise ValueError("Cannot calculate median of empty list")\n        \n    s = sorted(arr)\n    n = len(s)\n    mid = n // 2\n    \n    if n % 2 != 0:\n        return float(s[mid])\n    else:\n        return (s[mid - 1] + s[mid]) / 2.0\n\n# Example execution\nprint(calculate_median([7, 1, 3, 4, 9]))     # Odd length -> 4.0\nprint(calculate_median([7, 1, 3, 4, 9, 10])) # Even length -> 5.5`,
        sampleInput: '[7, 1, 3, 4, 9] and [7, 1, 3, 4, 9, 10]',
        sampleOutput: '4.0 and 5.5',
        timeComplexity: 'O(N log N) for sorting',
        spaceComplexity: 'O(N)',
        tipOrTrick: 'Always test both even-length and odd-length arrays when dealing with central element calculations.'
      }
    ],
    tipsAndTricks: [
      {
        title: 'Two-Pointer Collision Condition',
        category: 'Logic Building',
        explanation: 'When using two pointers from opposite ends, use `while left < right` for pairs or swaps. Use `while left <= right` when you need to inspect the solitary central element (like in binary search).',
        codeSnippet: `while left < right:   # Strictly different elements\nwhile left <= right:  # Includes central element`
      },
      {
        title: 'Integer Division vs Float Division',
        category: 'Edge Case Guard',
        explanation: 'In Python 3, `/` always produces a `float` (e.g. `4 / 2 -> 2.0`). Always use `//` for indexing array coordinates to avoid `TypeError: list indices must be integers`.',
        codeSnippet: `mid = len(arr) // 2  # Correct integer index`
      },
      {
        title: 'Sliding Window Invariant',
        category: 'Performance Trick',
        explanation: 'For subarray questions of fixed size K, do not recompute `sum(arr[i:i+k])` at every step! Add the incoming element and subtract the outgoing element in O(1).',
        codeSnippet: `window_sum += arr[i] - arr[i - k]  # O(1) sliding window update`
      },
      {
        title: 'Counting Pairs with Hash Maps',
        category: 'Interview Secret',
        explanation: 'If the array is unsorted and you need Two Sum in O(N), use a hash map storing `target - x: index` rather than sorting in O(N log N).',
        codeSnippet: `seen = {}\nfor i, x in enumerate(arr):\n    if target - x in seen:\n        return seen[target - x], i\n    seen[x] = i`
      }
    ]
  },

  // ==========================================
  // DAY 4: ARRAYS (2D)
  // ==========================================
  T4: {
    basicPrograms: [
      {
        id: 'bp-t4-1',
        title: 'Matrix Row-wise and Column-wise Sums',
        difficulty: 'Beginner',
        concept: 'Grid Index Transposition (r, c) vs (c, r)',
        problemStatement: 'Given an R x C matrix, calculate the sum of each row and the sum of each column.',
        logicSteps: [
          'Row sums: for each row `r`, sum all elements across columns `sum(matrix[r])`.',
          'Column sums: for each column `c`, iterate down rows `r` and accumulate `matrix[r][c]`.',
          'Notice how swapping loop order changes the traversal from row-major to column-major.'
        ],
        code: `def row_and_col_sums(matrix: list[list[int]]) -> tuple[list[int], list[int]]:\n    rows = len(matrix)\n    cols = len(matrix[0]) if rows > 0 else 0\n    \n    row_sums = [sum(row) for row in matrix]\n    \n    col_sums = []\n    for c in range(cols):\n        c_sum = sum(matrix[r][c] for r in range(rows))\n        col_sums.append(c_sum)\n        \n    return row_sums, col_sums\n\n# Example execution\ngrid = [\n    [1, 2, 3],\n    [4, 5, 6],\n    [7, 8, 9]\n]\nr_sums, c_sums = row_and_col_sums(grid)\nprint("Row sums:", r_sums)\nprint("Col sums:", c_sums)`,
        sampleInput: '[[1, 2, 3], [4, 5, 6], [7, 8, 9]]',
        sampleOutput: 'Row sums: [6, 15, 24]\nCol sums: [12, 15, 18]',
        timeComplexity: 'O(R * C)',
        spaceComplexity: 'O(R + C)',
        tipOrTrick: 'You can also compute all column sums in one line with `[sum(col) for col in zip(*matrix)]`!'
      },
      {
        id: 'bp-t4-2',
        title: 'Search in a 2D Grid with Coordinates Return',
        difficulty: 'Easy',
        concept: '2D Linear Coordinate Scanning',
        problemStatement: 'Search for a target value in a 2D matrix and return its `(row, col)` coordinate or `(-1, -1)` if not found.',
        logicSteps: [
          'Outer loop iterates over row index `r` from 0 to R-1.',
          'Inner loop iterates over col index `c` from 0 to C-1.',
          'If `matrix[r][c] == target`, immediately return `(r, c)`.',
          'If both loops complete with no match, return `(-1, -1)`.'
        ],
        code: `def search_matrix(matrix: list[list[int]], target: int) -> tuple[int, int]:\n    for r in range(len(matrix)):\n        for c in range(len(matrix[r])):\n            if matrix[r][c] == target:\n                return r, c\n    return -1, -1\n\n# Example execution\ngrid = [\n    [10, 20, 30],\n    [40, 50, 60],\n    [70, 80, 90]\n]\nprint(search_matrix(grid, 50))  # (1, 1)\nprint(search_matrix(grid, 99))  # (-1, -1)`,
        sampleInput: 'grid, target = 50',
        sampleOutput: '(1, 1)',
        timeComplexity: 'O(R * C)',
        spaceComplexity: 'O(1)',
        tipOrTrick: 'Always inspect `len(matrix)` for row count and `len(matrix[0])` for column count.'
      },
      {
        id: 'bp-t4-3',
        title: 'Snake / Wave Pattern Row Traversal',
        difficulty: 'Easy',
        concept: 'Alternating Row Direction with Parity Check',
        problemStatement: 'Traverse a matrix such that even rows are read left-to-right, and odd rows are read right-to-left (wave pattern).',
        logicSteps: [
          'Loop through rows `r` from 0 to R-1.',
          'If `r % 2 == 0` (even row): print elements from `c = 0` to C-1.',
          'If `r % 2 != 0` (odd row): print elements in reverse using `reversed(matrix[r])` or `matrix[r][::-1]`.',
          'Collect all elements into a single flat list.'
        ],
        code: `def snake_traversal(matrix: list[list[int]]) -> list[int]:\n    result = []\n    for r in range(len(matrix)):\n        if r % 2 == 0:\n            result.extend(matrix[r])\n        else:\n            result.extend(reversed(matrix[r]))\n    return result\n\n# Example execution\ngrid = [\n    [1,  2,  3],\n    [4,  5,  6],\n    [7,  8,  9]\n]\nprint(snake_traversal(grid))`,
        sampleInput: '[[1, 2, 3], [4, 5, 6], [7, 8, 9]]',
        sampleOutput: '[1, 2, 3, 6, 5, 4, 7, 8, 9]',
        timeComplexity: 'O(R * C)',
        spaceComplexity: 'O(R * C)',
        tipOrTrick: 'Using `result.extend()` flattens rows cleanly without manual nested append loops.'
      },
      {
        id: 'bp-t4-4',
        title: 'Count Elements Meeting a Condition Across Grid',
        difficulty: 'Beginner',
        concept: 'Grid Filtering & Threshold Counting',
        problemStatement: 'Count how many negative numbers exist in an arbitrary R x C matrix.',
        logicSteps: [
          'Initialize `count = 0`.',
          'Iterate through every cell `val` using nested loops.',
          'If `val < 0`, increment `count += 1`.',
          'Return total count.'
        ],
        code: `def count_negatives(grid: list[list[int]]) -> int:\n    count = 0\n    for row in grid:\n        for val in row:\n            if val < 0:\n                count += 1\n    return count\n\n# Example execution\nmatrix = [\n    [4,  3,  2, -1],\n    [3,  2,  1, -1],\n    [1,  1, -1, -2],\n    [-1, -1, -2, -3]\n]\nprint("Negative count:", count_negatives(matrix))`,
        sampleInput: '4x4 matrix with negative numbers',
        sampleOutput: 'Negative count: 8',
        timeComplexity: 'O(R * C)',
        spaceComplexity: 'O(1)',
        tipOrTrick: 'In Python, `sum(1 for row in grid for val in row if val < 0)` accomplishes this in a clean, one-line generator.'
      },
      {
        id: 'bp-t4-5',
        title: 'Check if Matrix is Symmetric (matrix == transpose)',
        difficulty: 'Easy',
        concept: 'Symmetric Cell Equality check `matrix[r][c] == matrix[c][r]`',
        problemStatement: 'Determine if an N x N square matrix is symmetric along its main diagonal.',
        logicSteps: [
          'First confirm the matrix is square: `rows == cols`. If not, return False.',
          'Iterate row `r` from 0 to N-1, and col `c` from `r + 1` to N-1 (only need to check upper triangle!).',
          'If `matrix[r][c] != matrix[c][r]`, return False immediately.',
          'If all checks pass, return True.'
        ],
        code: `def is_symmetric(matrix: list[list[int]]) -> bool:\n    n = len(matrix)\n    for r in range(n):\n        if len(matrix[r]) != n:\n            return False  # Not square\n            \n    for r in range(n):\n        # Only check elements above main diagonal\n        for c in range(r + 1, n):\n            if matrix[r][c] != matrix[c][r]:\n                return False\n                \n    return True\n\n# Example execution\nsym_grid = [\n    [1, 7, 3],\n    [7, 4, -5],\n    [3, -5, 6]\n]\nprint("Is symmetric?", is_symmetric(sym_grid))`,
        sampleInput: '[[1, 7, 3], [7, 4, -5], [3, -5, 6]]',
        sampleOutput: 'Is symmetric? True',
        timeComplexity: 'O(N^2 / 2) = O(N^2)',
        spaceComplexity: 'O(1)',
        tipOrTrick: 'Only looping `range(r + 1, n)` checks each pair exactly once, cutting comparisons in half and avoiding redundant checks.'
      }
    ],
    tipsAndTricks: [
      {
        title: 'The Deadly 2D List Multiplication Trap',
        category: 'Edge Case Guard',
        explanation: 'Writing `[[0] * cols] * rows` creates multiple references to the SAME inner list. Modifying `grid[0][0]` will change EVERY row!',
        codeSnippet: `# DANGEROUS BUG:\n# grid = [[0] * 3] * 3  # All rows share same memory!\n\n# SAFE & CORRECT:\ngrid = [[0 for _ in range(cols)] for _ in range(rows)]`
      },
      {
        title: 'Fast Column Unpacking with `zip(*matrix)`',
        category: 'Pythonic Shortcut',
        explanation: 'The `*` splat operator unpacks rows into `zip()`, pairing corresponding column items instantly.',
        codeSnippet: `columns = list(zip(*matrix))  # Transposes rows into tuples of columns!`
      },
      {
        title: 'Boundary Guard Condition',
        category: 'Logic Building',
        explanation: 'When exploring neighbors (up, down, left, right), verify bounds before indexing to avoid IndexError.',
        codeSnippet: `def is_valid(r, c, R, C):\n    return 0 <= r < R and 0 <= c < C`
      },
      {
        title: 'Direction Vectors for Grid Navigation',
        category: 'Interview Secret',
        explanation: 'Instead of four separate if-statements for (Up, Down, Left, Right), use direction vectors `[(0, 1), (0, -1), (1, 0), (-1, 0)]`.',
        codeSnippet: `directions = [(0, 1), (0, -1), (1, 0), (-1, 0)]\nfor dr, dc in directions:\n    nr, nc = r + dr, c + dc`
      }
    ]
  },

  // ==========================================
  // DAY 5: ARRAYS 2D (ADVANCED)
  // ==========================================
  T5: {
    basicPrograms: [
      {
        id: 'bp-t5-1',
        title: 'Diagonal Sums (Primary & Secondary Diagonals)',
        difficulty: 'Easy',
        concept: 'Diagonal Coordinate Equations: r == c and r + c == n - 1',
        problemStatement: 'Calculate the sum of the primary diagonal and secondary diagonal of an N x N matrix in a single O(N) pass, counting the center element only once if N is odd.',
        logicSteps: [
          'Primary diagonal coordinates are `(i, i)` where row equals col.',
          'Secondary diagonal coordinates are `(i, n - 1 - i)` where row + col equals `n - 1`.',
          'Single loop `i` from 0 to N-1 adds `matrix[i][i]` and `matrix[i][n - 1 - i]`.',
          'If N is odd, the central element `matrix[n//2][n//2]` was added twice; subtract it once.'
        ],
        code: `def diagonal_sum(mat: list[list[int]]) -> int:\n    n = len(mat)\n    total = 0\n    for i in range(n):\n        total += mat[i][i]              # Primary diagonal\n        total += mat[i][n - 1 - i]      # Secondary diagonal\n        \n    # If n is odd, center element was added twice\n    if n % 2 != 0:\n        total -= mat[n // 2][n // 2]\n        \n    return total\n\n# Example execution\ngrid = [\n    [1, 2, 3],\n    [4, 5, 6],\n    [7, 8, 9]\n]\nprint("Diagonal Sum:", diagonal_sum(grid))  # 1+5+9 + 3+7 = 25`,
        sampleInput: '[[1, 2, 3], [4, 5, 6], [7, 8, 9]]',
        sampleOutput: 'Diagonal Sum: 25',
        timeComplexity: 'O(N) single pass',
        spaceComplexity: 'O(1)',
        tipOrTrick: 'Do not use a nested O(N^2) loop to sum diagonals! A single loop with `(i, i)` and `(i, n - 1 - i)` takes O(N) time.'
      },
      {
        id: 'bp-t5-2',
        title: 'In-Place Square Matrix Transpose',
        difficulty: 'Easy',
        concept: 'Reflecting Elements Across Main Diagonal',
        problemStatement: 'Given an N x N square matrix, transpose it in-place such that row `i` becomes column `i` without creating a new matrix.',
        logicSteps: [
          'Loop row `i` from 0 to N-1.',
          'Loop col `j` from `i + 1` to N-1 (strictly above diagonal).',
          'Swap `matrix[i][j]` with `matrix[j][i]`.',
          'Notice that elements on the diagonal `matrix[i][i]` stay in place.'
        ],
        code: `def transpose_in_place(matrix: list[list[int]]) -> None:\n    n = len(matrix)\n    for i in range(n):\n        for j in range(i + 1, n):\n            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]\n\n# Example execution\ngrid = [\n    [1, 2, 3],\n    [4, 5, 6],\n    [7, 8, 9]\n]\ntranspose_in_place(grid)\nfor row in grid:\n    print(row)`,
        sampleInput: '[[1, 2, 3], [4, 5, 6], [7, 8, 9]]',
        sampleOutput: '[1, 4, 7]\n[2, 5, 8]\n[3, 6, 9]',
        timeComplexity: 'O(N^2)',
        spaceComplexity: 'O(1) strictly in-place',
        tipOrTrick: 'If your inner loop starts at 0 instead of `i + 1`, you will swap elements twice, ending up with the original matrix unchanged!'
      },
      {
        id: 'bp-t5-3',
        title: 'Rotate Matrix 90 Degrees Clockwise',
        difficulty: 'Medium',
        concept: 'Two-Step Geometric Transformation: Transpose Then Reverse Rows',
        problemStatement: 'Rotate an N x N 2D matrix 90 degrees clockwise in-place.',
        logicSteps: [
          'Mathematical derivation: A 90° clockwise rotation moves `(r, c)` to `(c, n - 1 - r)`.',
          'Step 1: Transpose the matrix in-place (`swap(matrix[i][j], matrix[j][i])`). This transforms `(r, c)` to `(c, r)`.',
          'Step 2: Reverse each individual row in-place. This transforms `(c, r)` to `(c, n - 1 - r)`.',
          'The result is a 90° clockwise rotated matrix with zero extra auxiliary memory!'
        ],
        code: `def rotate_matrix_90_clockwise(mat: list[list[int]]) -> None:\n    n = len(mat)\n    # Step 1: Transpose in-place\n    for i in range(n):\n        for j in range(i + 1, n):\n            mat[i][j], mat[j][i] = mat[j][i], mat[i][j]\n            \n    # Step 2: Reverse each row\n    for row in mat:\n        row.reverse()\n\n# Example execution\ngrid = [\n    [1, 2, 3],\n    [4, 5, 6],\n    [7, 8, 9]\n]\nrotate_matrix_90_clockwise(grid)\nfor row in grid:\n    print(row)`,
        sampleInput: '[[1, 2, 3], [4, 5, 6], [7, 8, 9]]',
        sampleOutput: '[7, 4, 1]\n[8, 5, 2]\n[9, 6, 3]',
        timeComplexity: 'O(N^2)',
        spaceComplexity: 'O(1)',
        tipOrTrick: 'To rotate 90° COUNTER-clockwise, simply reverse each row FIRST, then transpose!'
      },
      {
        id: 'bp-t5-4',
        title: 'Boundary Elements Clockwise Perimeter Traversal',
        difficulty: 'Easy',
        concept: 'Edge Coordinates Sequencing (Top, Right, Bottom, Left)',
        problemStatement: 'Print all perimeter/boundary elements of an R x C matrix in clockwise order.',
        logicSteps: [
          'Top edge: `(0, c)` from `c = 0` to C-1.',
          'Right edge: `(r, C-1)` from `r = 1` to R-1.',
          'Bottom edge: `(R-1, c)` from `c = C-2` down to 0 (if R > 1).',
          'Left edge: `(r, 0)` from `r = R-2` down to 1 (if C > 1).'
        ],
        code: `def boundary_traversal(mat: list[list[int]]) -> list[int]:\n    if not mat or not mat[0]:\n        return []\n    R, C = len(mat), len(mat[0])\n    res = []\n    \n    # 1. Top row\n    for c in range(C):\n        res.append(mat[0][c])\n    # 2. Right column\n    for r in range(1, R):\n        res.append(mat[r][C - 1])\n    # 3. Bottom row (if R > 1)\n    if R > 1:\n        for c in range(C - 2, -1, -1):\n            res.append(mat[R - 1][c])\n    # 4. Left column (if C > 1)\n    if C > 1:\n        for r in range(R - 2, 0, -1):\n            res.append(mat[r][0])\n            \n    return res\n\n# Example execution\ngrid = [\n    [1,  2,  3,  4],\n    [5,  6,  7,  8],\n    [9, 10, 11, 12]\n]\nprint("Boundary:", boundary_traversal(grid))`,
        sampleInput: '3x4 matrix',
        sampleOutput: 'Boundary: [1, 2, 3, 4, 8, 12, 11, 10, 9, 5]',
        timeComplexity: 'O(R + C)',
        spaceComplexity: 'O(R + C)',
        tipOrTrick: 'Always include the guards `if R > 1` and `if C > 1` to avoid double-printing elements on single-row or single-column matrices.'
      },
      {
        id: 'bp-t5-5',
        title: 'Verify Identity Matrix',
        difficulty: 'Beginner',
        concept: 'Identity Condition: mat[i][j] == 1 if i == j else 0',
        problemStatement: 'Check if an N x N matrix is an identity matrix (1s on main diagonal and 0s everywhere else).',
        logicSteps: [
          'Check if matrix is square: `len(mat) == len(mat[0])`.',
          'Iterate row `r` and col `c`.',
          'If `r == c` and `mat[r][c] != 1`, return False.',
          'If `r != c` and `mat[r][c] != 0`, return False.',
          'If loop completes with zero violations, return True.'
        ],
        code: `def is_identity_matrix(mat: list[list[int]]) -> bool:\n    n = len(mat)\n    for r in range(n):\n        if len(mat[r]) != n:\n            return False\n        for c in range(n):\n            expected = 1 if r == c else 0\n            if mat[r][c] != expected:\n                return False\n    return True\n\n# Example execution\nprint(is_identity_matrix([[1, 0], [0, 1]]))       # True\nprint(is_identity_matrix([[1, 0], [1, 1]]))       # False`,
        sampleInput: '[[1, 0], [0, 1]]',
        sampleOutput: 'True',
        timeComplexity: 'O(N^2)',
        spaceComplexity: 'O(1)',
        tipOrTrick: 'Setting `expected = 1 if r == c else 0` simplifies branch logic into a single comparison.'
      }
    ],
    tipsAndTricks: [
      {
        title: 'Geometric Rotation Formulas',
        category: 'Interview Secret',
        explanation: 'Remember the two-step rotation rules: 90° Clockwise = Transpose + Reverse Rows. 180° = Reverse rows + Reverse columns. 270° Clockwise = Transpose + Reverse columns.',
        codeSnippet: `# 90 Clockwise:\nfor i in range(n):\n    for j in range(i+1, n): m[i][j], m[j][i] = m[j][i], m[i][j]\nfor row in m: row.reverse()`
      },
      {
        title: 'Single-Pass Diagonal Traversal',
        category: 'Performance Trick',
        explanation: 'Both main and secondary diagonals can be visited in a single loop using `mat[i][i]` and `mat[i][n - 1 - i]`.',
        codeSnippet: `main_diag = [mat[i][i] for i in range(n)]\nanti_diag = [mat[i][n - 1 - i] for i in range(n)]`
      },
      {
        title: 'Handling Non-Square Matrix Transposition',
        category: 'Edge Case Guard',
        explanation: 'In-place transposition only works for square (N x N) matrices. For rectangular (R x C) matrices, you must allocate a new C x R matrix or use `zip(*mat)`.',
        codeSnippet: `rect_transposed = [list(col) for col in zip(*mat)]`
      }
    ]
  },

  // ==========================================
  // DAY 6: STRINGS
  // ==========================================
  T6: {
    basicPrograms: [
      {
        id: 'bp-t6-1',
        title: 'Count Vowels, Consonants, Digits & Specials',
        difficulty: 'Beginner',
        concept: 'Character Classification using ASCII & Predicates',
        problemStatement: 'Count the number of vowels, consonants, digits, and special characters/spaces in a string.',
        logicSteps: [
          'Define `vowels = set("aeiouAEIOU")`.',
          'Initialize counters: `v_count = c_count = d_count = s_count = 0`.',
          'Loop through each character `ch`:',
          'If `ch.isalpha()`: check if `ch in vowels` (vowel) or not (consonant).',
          'Else if `ch.isdigit()`: increment digits counter.',
          'Else: increment special characters counter.'
        ],
        code: `def analyze_string(s: str) -> dict[str, int]:\n    vowels = set("aeiouAEIOU")\n    counts = {"vowels": 0, "consonants": 0, "digits": 0, "specials": 0}\n    \n    for ch in s:\n        if ch.isalpha():\n            if ch in vowels:\n                counts["vowels"] += 1\n            else:\n                counts["consonants"] += 1\n        elif ch.isdigit():\n            counts["digits"] += 1\n        else:\n            counts["specials"] += 1\n            \n    return counts\n\n# Example execution\nprint(analyze_string("Python 3.12 is Awesome!"))`,
        sampleInput: '"Python 3.12 is Awesome!"',
        sampleOutput: "{'vowels': 7, 'consonants': 9, 'digits': 3, 'specials': 4}",
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        tipOrTrick: 'Using a `set` for vowels provides O(1) membership lookup instead of scanning a string repeatedly.'
      },
      {
        id: 'bp-t6-2',
        title: 'Case Inversion Using ASCII Math without .swapcase()',
        difficulty: 'Easy',
        concept: 'ASCII Code Offsets: ord() and chr() Math',
        problemStatement: 'Invert the case of each alphabetic character (upper to lower, lower to upper) using character codes.',
        logicSteps: [
          'In ASCII: "A" is 65 and "a" is 97. Difference is exactly 32.',
          'If "A" <= ch <= "Z": lowercase version is chr(ord(ch) + 32).',
          'If "a" <= ch <= "z": uppercase version is chr(ord(ch) - 32).',
          'Non-alphabetic characters remain unchanged.',
          'Accumulate into a list and join with `"".join()`.'
        ],
        code: `def invert_case_ascii(s: str) -> str:\n    result = []\n    for ch in s:\n        code = ord(ch)\n        if 65 <= code <= 90:    # Uppercase A-Z\n            result.append(chr(code + 32))\n        elif 97 <= code <= 122: # Lowercase a-z\n            result.append(chr(code - 32))\n        else:\n            result.append(ch)\n    return "".join(result)\n\n# Example execution\nprint(invert_case_ascii("Hello World 123!"))`,
        sampleInput: '"Hello World 123!"',
        sampleOutput: '"hELLO wORLD 123!"',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(N)',
        tipOrTrick: 'Understanding `ord()` and `chr()` is essential for cipher algorithms, hash functions, and bit manipulation questions.'
      },
      {
        id: 'bp-t6-3',
        title: 'Valid Palindrome (Alphanumeric Only, Case-Insensitive)',
        difficulty: 'Easy',
        concept: 'Two-Pointer Filtering on Immutable Sequences',
        problemStatement: 'Verify if a string is a palindrome, considering only alphanumeric characters and ignoring cases.',
        logicSteps: [
          'Filter and normalize: `clean_chars = [ch.lower() for ch in s if ch.isalnum()]`.',
          'Two-pointer check: compare `clean_chars[left]` with `clean_chars[right]`.',
          'If any pair mismatches, return False; if pointers cross, return True.'
        ],
        code: `def is_palindrome_clean(s: str) -> bool:\n    left = 0\n    right = len(s) - 1\n    \n    while left < right:\n        # Skip non-alphanumeric from left\n        while left < right and not s[left].isalnum():\n            left += 1\n        # Skip non-alphanumeric from right\n        while left < right and not s[right].isalnum():\n            right -= 1\n            \n        if s[left].lower() != s[right].lower():\n            return False\n            \n        left += 1\n        right -= 1\n        \n    return True\n\n# Example execution\nprint(is_palindrome_clean("A man, a plan, a canal: Panama"))  # True\nprint(is_palindrome_clean("race a car"))                      # False`,
        sampleInput: '"A man, a plan, a canal: Panama"',
        sampleOutput: 'True',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1) in-place pointers',
        tipOrTrick: 'By skipping non-alphanumeric characters directly with two pointers, we achieve O(1) extra space without creating a copy!'
      },
      {
        id: 'bp-t6-4',
        title: 'Character Frequency Map & First Non-Repeating Character',
        difficulty: 'Easy',
        concept: 'Two-Pass Frequency Counting with Hash Map',
        problemStatement: 'Find the first non-repeating character in a string. Return its index or -1 if all repeat.',
        logicSteps: [
          'Pass 1: Build a frequency map `{ch: count}` by iterating through string.',
          'Pass 2: Iterate through the string again with index `i`.',
          'The first character with `freq[ch] == 1` is our answer! Return its index.',
          'If no such character exists, return -1.'
        ],
        code: `def first_unique_char(s: str) -> int:\n    freq = {}\n    for ch in s:\n        freq[ch] = freq.get(ch, 0) + 1\n        \n    for idx, ch in enumerate(s):\n        if freq[ch] == 1:\n            return idx\n            \n    return -1\n\n# Example execution\nprint(first_unique_char("leetcode"))      # 0 ('l')\nprint(first_unique_char("loveleetcode"))  # 2 ('v')\nprint(first_unique_char("aabb"))          # -1`,
        sampleInput: '"loveleetcode"',
        sampleOutput: "2 (character 'v')",
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1) bounded by alphabet size',
        tipOrTrick: 'Use `dict.get(ch, 0) + 1` to gracefully increment dictionary frequencies without checking `if ch in dict`.'
      },
      {
        id: 'bp-t6-5',
        title: 'Remove All Vowels from a String',
        difficulty: 'Beginner',
        concept: 'List Comprehension Filtering & Joining',
        problemStatement: 'Given a string, return a new string with all vowels (both lowercase and uppercase) removed.',
        logicSteps: [
          'Define `vowels = set("aeiouAEIOU")`.',
          'Use list comprehension: `[ch for ch in s if ch not in vowels]`.',
          'Join the list back into a string: `"".join(...)`.',
          'Notice this runs in O(N) time without O(N^2) repeated string reallocations.'
        ],
        code: `def remove_vowels(s: str) -> str:\n    vowels = set("aeiouAEIOU")\n    return "".join(ch for ch in s if ch not in vowels)\n\n# Example execution\nprint(remove_vowels("Python Programming With DSA"))`,
        sampleInput: '"Python Programming With DSA"',
        sampleOutput: '"Pythn Prgrmmng Wth DS"',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(N)',
        tipOrTrick: 'Never use `s = s.replace(v, "")` in a loop over vowels. That creates 10 separate intermediate string copies!'
      }
    ],
    tipsAndTricks: [
      {
        title: 'The O(N^2) String += Concatenation Trap',
        category: 'Performance Trick',
        explanation: 'Because Python strings are immutable, `s += ch` inside a loop creates a brand-new string on every single iteration! Always append to a list and call `"".join()`.',
        codeSnippet: `# SLOW: O(N^2)\n# res = ""\n# for ch in data: res += ch\n\n# FAST: O(N)\nres = "".join(list_of_chars)`
      },
      {
        title: 'Instant Reverse with Slicing',
        category: 'Pythonic Shortcut',
        explanation: '`s[::-1]` reverses any string using optimized C-level memory copying.',
        codeSnippet: `is_palindrome = (s == s[::-1])`
      },
      {
        title: 'Character Classification Methods',
        category: 'Logic Building',
        explanation: 'Know Python built-in string methods: `.isalnum()` (letters or digits), `.isalpha()` (letters only), `.isdigit()` (digits 0-9), `.isspace()` (tabs/spaces/newlines).',
        codeSnippet: `if ch.isalnum():  # Clean alphanumeric check`
      }
    ]
  },

  // ==========================================
  // DAY 7: STRINGS (ADVANCED PARSING)
  // ==========================================
  T7: {
    basicPrograms: [
      {
        id: 'bp-t7-1',
        title: 'Reverse Words in a Sentence While Preserving Word Positions',
        difficulty: 'Easy',
        concept: 'Sentence Splitting, Element Slicing & Rejoining',
        problemStatement: 'Given a sentence, reverse each individual word in place while keeping the original word sequence unchanged.',
        logicSteps: [
          'Split the sentence into words: `words = sentence.split(" ")`.',
          'Reverse each word using slice `w[::-1]`.',
          'Join reversed words back with a space: `" ".join(reversed_words)`.'
        ],
        code: `def reverse_individual_words(sentence: str) -> str:\n    words = sentence.split(" ")\n    reversed_words = [w[::-1] for w in words]\n    return " ".join(reversed_words)\n\n# Example execution\nprint(reverse_individual_words("Python is super fun"))`,
        sampleInput: '"Python is super fun"',
        sampleOutput: '"nohtyP si repus nuf"',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(N)',
        tipOrTrick: 'Notice `s.split(" ")` preserves consecutive spaces whereas `s.split()` collapses multiple whitespace characters.'
      },
      {
        id: 'bp-t7-2',
        title: 'Find Longest Word in a Sentence (Stripping Punctuation)',
        difficulty: 'Easy',
        concept: 'Word Length Tracking & Punctuation Cleaning',
        problemStatement: 'Find the longest word in a sentence. If there is a tie, return the first one encountered.',
        logicSteps: [
          'Split sentence into raw words using `.split()`.',
          'For each word, strip punctuation characters like `.,!?;:`.',
          'Track `longest_word = ""` and update whenever `len(clean_word) > len(longest_word)`.',
          'Using strictly greater `>` guarantees first occurrence in case of a tie.'
        ],
        code: `def find_longest_word(sentence: str) -> str:\n    punctuations = ".,!?;:'\\""\n    words = sentence.split()\n    longest = ""\n    \n    for raw_word in words:\n        clean_word = raw_word.strip(punctuations)\n        if len(clean_word) > len(longest):\n            longest = clean_word\n            \n    return longest\n\n# Example execution\nprint(find_longest_word("Understanding recursion, algorithms, and data structures is vital."))`,
        sampleInput: '"Understanding recursion, algorithms, and data structures is vital."',
        sampleOutput: '"Understanding"',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(N)',
        tipOrTrick: '`word.strip(".,!?;:")` strips punctuation from outer boundaries of words without touching internal apostrophes.'
      },
      {
        id: 'bp-t7-3',
        title: 'Normalize and Collapse Irregular Spacing',
        difficulty: 'Beginner',
        concept: 'Python .split() Whitespace Collapsing',
        problemStatement: 'Clean a sentence containing irregular multiple spaces, tabs, and leading/trailing whitespace into clean single spaces.',
        logicSteps: [
          'Calling `.split()` without arguments automatically splits on ANY contiguous whitespace (spaces, tabs, newlines) and discards empty tokens.',
          'Join the extracted tokens with `" ".join()`.',
          'This single line solves messy spacing problems reliably.'
        ],
        code: `def normalize_spaces(text: str) -> str:\n    # split() with no arguments splits on arbitrary whitespace runs\n    return " ".join(text.split())\n\n# Example execution\nmessy = "   Python    has   too   many    spaces!   "\nprint(f"'{normalize_spaces(messy)}'")`,
        sampleInput: '"   Python    has   too   many    spaces!   "',
        sampleOutput: "'Python has too many spaces!'",
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(N)',
        tipOrTrick: '`text.split()` (no parameter) is fundamentally different from `text.split(" ")`. The former collapses arbitrary whitespace runs.'
      },
      {
        id: 'bp-t7-4',
        title: 'Word Frequency Histogram in a Text Paragraph',
        difficulty: 'Easy',
        concept: 'Tokenization & Dictionary Frequency Map',
        problemStatement: 'Count the frequency of each word in a paragraph, ignoring punctuation and case.',
        logicSteps: [
          'Convert the entire text to lowercase: `text.lower()`.',
          'Replace punctuation with spaces or strip them from tokens.',
          'Count tokens in a dictionary using `freq[w] = freq.get(w, 0) + 1`.',
          'Return the dictionary sorted by frequency descending.'
        ],
        code: `def word_frequency(text: str) -> dict[str, int]:\n    # Normalize to lowercase and remove common punctuation\n    clean_text = "".join(ch.lower() if ch.isalnum() or ch.isspace() else " " for ch in text)\n    words = clean_text.split()\n    \n    freq = {}\n    for w in words:\n        freq[w] = freq.get(w, 0) + 1\n        \n    return freq\n\n# Example execution\npara = "Code, code, code! Python is great. Python is fast."\nprint(word_frequency(para))`,
        sampleInput: '"Code, code, code! Python is great. Python is fast."',
        sampleOutput: "{'code': 3, 'python': 2, 'is': 2, 'great': 1, 'fast': 1}",
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(Unique words)',
        tipOrTrick: 'Replacing punctuation with spaces avoids accidentally gluing two words together like `"great.Python"`.'
      },
      {
        id: 'bp-t7-5',
        title: 'Custom Title-Case Formatter from Scratch',
        difficulty: 'Easy',
        concept: 'Word-Boundary Capitalization without .title() Flaws',
        problemStatement: 'Capitalize the first letter of each word and lowercase the rest, handling apostrophes correctly (e.g. "don\'t" shouldn\'t become "Don\'T").',
        logicSteps: [
          'Python built-in `.title()` capitalizes letters after apostrophes (turning "don\'t" into "Don\'T").',
          'To do it right: split words, take `word[0].upper() + word[1:].lower()`, and rejoin with spaces.'
        ],
        code: `def custom_title_case(sentence: str) -> str:\n    words = sentence.split()\n    titled_words = []\n    for w in words:\n        if len(w) > 0:\n            titled_words.append(w[0].upper() + w[1:].lower())\n        else:\n            titled_words.append(w)\n    return " ".join(titled_words)\n\n# Example execution\nprint(custom_title_case("they're learning python dsa with kapil"))`,
        sampleInput: '"they\'re learning python dsa with kapil"',
        sampleOutput: '"They\'re Learning Python Dsa With Kapil"',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(N)',
        tipOrTrick: 'Interviewers often ask to implement `.title()` manually to test string slicing `w[0].upper() + w[1:].lower()`.'
      }
    ],
    tipsAndTricks: [
      {
        title: 'The Secret of .split() with No Arguments',
        category: 'Pythonic Shortcut',
        explanation: '`" a \\t b \\n c ".split()` automatically handles all whitespace types and cleans out blank items without needing `.strip()`.',
        codeSnippet: `words = line.split()  # Strips and splits on all whitespace runs`
      },
      {
        title: 'Sorting Words by Length',
        category: 'Logic Building',
        explanation: 'Use Python `key=len` to sort lists of words by character length in a single readable line.',
        codeSnippet: `sorted_words = sorted(words, key=len, reverse=True)`
      },
      {
        title: 'Punctuation Removal with str.translate',
        category: 'Performance Trick',
        explanation: 'For high-speed punctuation stripping, `str.maketrans` and `.translate()` run entirely in C-code at 10x the speed of regex.',
        codeSnippet: `import string\nclean = text.translate(str.maketrans("", "", string.punctuation))`
      }
    ]
  },

  // ==========================================
  // DAY 8: STRINGS (ALGORITHMS & CIPHERS)
  // ==========================================
  T8: {
    basicPrograms: [
      {
        id: 'bp-t8-1',
        title: 'Run-Length Encoding (RLE) String Compression',
        difficulty: 'Easy',
        concept: 'Consecutive Character Run Counting & Lookahead',
        problemStatement: 'Compress a string using Run-Length Encoding. For example, "aaabbc" becomes "a3b2c1".',
        logicSteps: [
          'If string is empty, return "".',
          'Maintain `current_char = s[0]` and `run_length = 1`.',
          'Iterate `i` from 1 to `len(s) - 1`.',
          'If `s[i] == current_char`, increment `run_length += 1`.',
          'Else, append `current_char + str(run_length)` to result, reset `current_char = s[i]`, and set `run_length = 1`.',
          'After the loop ends, do not forget to append the final character run!'
        ],
        code: `def run_length_encode(s: str) -> str:\n    if not s:\n        return ""\n        \n    compressed = []\n    count = 1\n    \n    for i in range(1, len(s)):\n        if s[i] == s[i - 1]:\n            count += 1\n        else:\n            compressed.append(f"{s[i - 1]}{count}")\n            count = 1\n            \n    # Append last run\n    compressed.append(f"{s[-1]}{count}")\n    return "".join(compressed)\n\n# Example execution\nprint(run_length_encode("aaabbccccd"))`,
        sampleInput: '"aaabbccccd"',
        sampleOutput: '"a3b2c4d1"',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(N)',
        tipOrTrick: 'The classic trap in RLE is forgetting to append the last run after the loop terminates!'
      },
      {
        id: 'bp-t8-2',
        title: 'Caesar Cipher Encryption with Shift Wrap-Around',
        difficulty: 'Easy',
        concept: 'Modular Arithmetic Wrap: (code - base + shift) % 26 + base',
        problemStatement: 'Encrypt a message by shifting every alphabetic letter forward by K positions in the alphabet, wrapping Z back to A. Non-letters remain unchanged.',
        logicSteps: [
          'Normalize shift: `k = k % 26` so large shifts wrap smoothly.',
          'For uppercase: base is `ord("A")`. New char is `chr((ord(ch) - ord("A") + k) % 26 + ord("A"))`.',
          'For lowercase: base is `ord("a")`. New char is `chr((ord(ch) - ord("a") + k) % 26 + ord("a"))`.',
          'Preserve all spaces and punctuation unchanged.'
        ],
        code: `def caesar_cipher(text: str, shift: int) -> str:\n    shift = shift % 26\n    result = []\n    \n    for ch in text:\n        if 'A' <= ch <= 'Z':\n            new_code = (ord(ch) - ord('A') + shift) % 26 + ord('A')\n            result.append(chr(new_code))\n        elif 'a' <= ch <= 'z':\n            new_code = (ord(ch) - ord('a') + shift) % 26 + ord('a')\n            result.append(chr(new_code))\n        else:\n            result.append(ch)\n            \n    return "".join(result)\n\n# Example execution\nprint(caesar_cipher("Hello, World!", 3))`,
        sampleInput: 'text = "Hello, World!", shift = 3',
        sampleOutput: '"Khoor, Zruog!"',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(N)',
        tipOrTrick: 'Always compute `shift = shift % 26` at the beginning so shifts like 29 wrap automatically to 3.'
      },
      {
        id: 'bp-t8-3',
        title: 'Check If Two Strings Are Anagrams',
        difficulty: 'Easy',
        concept: 'Frequency Counter Comparison in O(N) Time',
        problemStatement: 'Determine if two strings are anagrams of each other (contain the exact same letters with equal frequencies).',
        logicSteps: [
          'If `len(s1) != len(s2)`, they cannot be anagrams; return False immediately.',
          'Build frequency map for `s1`.',
          'Decrement frequency map for each character in `s2`. If a character is missing or count drops below 0, return False.',
          'Alternatively, in Python: `collections.Counter(s1) == collections.Counter(s2)`.'
        ],
        code: `def are_anagrams(s1: str, s2: str) -> bool:\n    if len(s1) != len(s2):\n        return False\n        \n    counts = {}\n    for ch in s1:\n        counts[ch] = counts.get(ch, 0) + 1\n        \n    for ch in s2:\n        if ch not in counts or counts[ch] == 0:\n            return False\n        counts[ch] -= 1\n        \n    return True\n\n# Example execution\nprint(are_anagrams("listen", "silent"))  # True\nprint(are_anagrams("rat", "car"))        # False`,
        sampleInput: '"listen" and "silent"',
        sampleOutput: 'True',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1) (maximum 26 characters)',
        tipOrTrick: 'Frequency counting is O(N) time and beats `sorted(s1) == sorted(s2)` which takes O(N log N).'
      },
      {
        id: 'bp-t8-4',
        title: 'Balanced Parentheses & Brackets Validator',
        difficulty: 'Easy',
        concept: 'Stack (LIFO) Matching Pair Verification',
        problemStatement: 'Check if a string containing parentheses `()`, brackets `[]`, and braces `{}` is properly closed and balanced.',
        logicSteps: [
          'Maintain a `stack = []`.',
          'Create a map of closing to opening brackets: `{")": "(", "}": "{", "]": "["}`.',
          'For each character: if opening bracket, push to stack.',
          'If closing bracket: check if stack is non-empty and `stack.pop() == matching_opening`. If not, return False.',
          'At the end, return `len(stack) == 0` (stack must be empty).'
        ],
        code: `def is_balanced_brackets(s: str) -> bool:\n    stack = []\n    matching = {')': '(', '}': '{', ']': '['}\n    \n    for ch in s:\n        if ch in matching.values():\n            stack.append(ch)\n        elif ch in matching:\n            if not stack or stack.pop() != matching[ch]:\n                return False\n                \n    return len(stack) == 0\n\n# Example execution\nprint(is_balanced_brackets("{[()]}"))   # True\nprint(is_balanced_brackets("{[(])}"))   # False`,
        sampleInput: '"[{()}]" and "{[(])}"',
        sampleOutput: 'True and False',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(N)',
        tipOrTrick: 'Testing `not stack` before calling `.pop()` guards against `IndexError: pop from empty list` when a closing bracket appears first.'
      },
      {
        id: 'bp-t8-5',
        title: 'Deduplicate Consecutive Repeating Characters',
        difficulty: 'Beginner',
        concept: 'Two-Pointer Running Comparison',
        problemStatement: 'Remove consecutive duplicate letters so that no two adjacent characters are identical (e.g. "aaabbcaad" -> "abcad").',
        logicSteps: [
          'If string is empty, return "".',
          'Initialize result list with the first character `[s[0]]`.',
          'Iterate `ch` from index 1: if `ch != result[-1]`, append `ch`.',
          'Join list back to string.'
        ],
        code: `def remove_consecutive_duplicates(s: str) -> str:\n    if not s:\n        return ""\n    result = [s[0]]\n    for ch in s[1:]:\n        if ch != result[-1]:\n            result.append(ch)\n    return "".join(result)\n\n# Example execution\nprint(remove_consecutive_duplicates("aaabbccbaaa"))`,
        sampleInput: '"aaabbccbaaa"',
        sampleOutput: '"abcba"',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(N)',
        tipOrTrick: 'Checking `result[-1]` checks the last confirmed character in O(1) time without managing index offsets.'
      }
    ],
    tipsAndTricks: [
      {
        title: 'Alphabet Wrap Arithmetic',
        category: 'Logic Building',
        explanation: 'Any cyclic shift over 26 letters follows: `(current_index + shift) % 26`. This automatically wraps 25+1 back to 0.',
        codeSnippet: `wrapped_idx = (idx + shift) % 26`
      },
      {
        title: 'Counter Equality in One Line',
        category: 'Pythonic Shortcut',
        explanation: '`collections.Counter` automatically tallies character frequencies and compares dictionaries by key-value equality.',
        codeSnippet: `from collections import Counter\nis_anagram = (Counter(s1) == Counter(s2))`
      },
      {
        title: 'Stack Underflow Defense',
        category: 'Edge Case Guard',
        explanation: 'Always verify `if stack:` before invoking `stack.pop()`. A string starting with `")"` will immediately crash without this guard.',
        codeSnippet: `if not stack or stack.pop() != expected:\n    return False`
      }
    ]
  },

  // ==========================================
  // DAY 9: FUNCTIONS
  // ==========================================
  T9: {
    basicPrograms: [
      {
        id: 'bp-t9-1',
        title: 'Optimized Prime Number Checker',
        difficulty: 'Easy',
        concept: 'Mathematical Primality Bound: Check up to sqrt(N)',
        problemStatement: 'Write a pure function `is_prime(n)` that determines whether an integer is prime in O(sqrt(N)) time.',
        logicSteps: [
          'Numbers <= 1 are not prime.',
          '2 and 3 are prime.',
          'Even numbers > 2 and multiples of 3 can be rejected immediately.',
          'All primes greater than 3 take the form `6k ± 1`. Test divisors `i` up to `int(math.isqrt(n))` with step 6.'
        ],
        code: `import math\n\ndef is_prime(n: int) -> bool:\n    if n <= 1:\n        return False\n    if n <= 3:\n        return True\n    if n % 2 == 0 or n % 3 == 0:\n        return False\n        \n    # Check up to sqrt(n)\n    limit = math.isqrt(n)\n    for i in range(5, limit + 1, 6):\n        if n % i == 0 or n % (i + 2) == 0:\n            return False\n            \n    return True\n\n# Example execution\nprint(is_prime(29))  # True\nprint(is_prime(100)) # False`,
        sampleInput: '29 and 100',
        sampleOutput: 'True and False',
        timeComplexity: 'O(sqrt(N))',
        spaceComplexity: 'O(1)',
        tipOrTrick: 'Using `math.isqrt(n)` computes the exact integer square root faster and avoids floating point precision issues.'
      },
      {
        id: 'bp-t9-2',
        title: 'Leaders in an Array (Elements Greater Than All to Their Right)',
        difficulty: 'Easy',
        concept: 'Reverse Right-to-Left Traversal with Running Maximum',
        problemStatement: 'An element is a Leader if it is strictly greater than all elements to its right. The rightmost element is always a leader. Find all leaders in O(N) time.',
        logicSteps: [
          'If array is empty, return [].',
          'The last element is always a leader. Set `max_so_far = arr[-1]`.',
          'Traverse the array backwards from index `len(arr) - 2` down to 0.',
          'If `arr[i] > max_so_far`: add `arr[i]` to leaders list and update `max_so_far = arr[i]`.',
          'Reverse the leaders list at the end to restore original order.'
        ],
        code: `def find_leaders(arr: list[int]) -> list[int]:\n    if not arr:\n        return []\n        \n    leaders = [arr[-1]]\n    max_from_right = arr[-1]\n    \n    for i in range(len(arr) - 2, -1, -1):\n        if arr[i] > max_from_right:\n            leaders.append(arr[i])\n            max_from_right = arr[i]\n            \n    leaders.reverse()  # Restore left-to-right order\n    return leaders\n\n# Example execution\nprint(find_leaders([16, 17, 4, 3, 5, 2]))`,
        sampleInput: '[16, 17, 4, 3, 5, 2]',
        sampleOutput: '[17, 5, 2]',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1) auxiliary space',
        tipOrTrick: 'Traversing from right to left turns an O(N^2) comparison into an O(N) single-pass algorithm!'
      },
      {
        id: 'bp-t9-3',
        title: 'Modular Password Strength Validator',
        difficulty: 'Easy',
        concept: 'Pure Predicate Decompositions & Tuple Multi-Returns',
        problemStatement: 'Validate a password against standard enterprise criteria: at least 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special character.',
        logicSteps: [
          'Break verification into independent boolean flags:',
          'Has length >= 8, has upper (`any(c.isupper() for c in pwd)`), has lower, has digit, has special.',
          'Collect failed criteria in an error list.',
          'Return `(len(errors) == 0, errors)`.'
        ],
        code: `def validate_password(password: str) -> tuple[bool, list[str]]:\n    errors = []\n    special_chars = set("!@#$%^&*()-_=+[]{}|;:,.<>?")\n    \n    if len(password) < 8:\n        errors.append("Must be at least 8 characters long")\n    if not any(c.isupper() for c in password):\n        errors.append("Must contain at least one uppercase letter")\n    if not any(c.islower() for c in password):\n        errors.append("Must contain at least one lowercase letter")\n    if not any(c.isdigit() for c in password):\n        errors.append("Must contain at least one digit")\n    if not any(c in special_chars for c in password):\n        errors.append("Must contain at least one special character")\n        \n    is_valid = len(errors) == 0\n    return is_valid, errors\n\n# Example execution\nok, issues = validate_password("Kapil@2026")\nprint("Valid?", ok, "| Issues:", issues)`,
        sampleInput: '"Kapil@2026"',
        sampleOutput: 'Valid? True | Issues: []',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        tipOrTrick: 'Using `any()` with a generator expression terminates immediately on the first matching character (short-circuit evaluation).'
      },
      {
        id: 'bp-t9-4',
        title: 'Array Summary Statistics with Default Arguments',
        difficulty: 'Beginner',
        concept: 'Tuple Multi-Return & Optional Parameter Handling',
        problemStatement: 'Write a function `calculate_stats(arr, precision=2)` that returns a dictionary with count, mean, min, max, and sample variance.',
        logicSteps: [
          'Validate input: if empty, raise ValueError.',
          'Compute total using `sum()`, length using `len()`, mean = total / n.',
          'Compute variance: sum of squared differences from mean divided by (n - 1).',
          'Round all float results to `precision`.'
        ],
        code: `def calculate_stats(arr: list[float], precision: int = 2) -> dict:\n    if not arr:\n        raise ValueError("List cannot be empty")\n        \n    n = len(arr)\n    total = sum(arr)\n    mean = total / n\n    minimum = min(arr)\n    maximum = max(arr)\n    \n    variance = sum((x - mean) ** 2 for x in arr) / (n - 1) if n > 1 else 0.0\n    \n    return {\n        "count": n,\n        "mean": round(mean, precision),\n        "min": minimum,\n        "max": maximum,\n        "variance": round(variance, precision)\n    }\n\n# Example execution\nprint(calculate_stats([10.5, 20.2, 30.1, 40.8, 50.4]))`,
        sampleInput: '[10.5, 20.2, 30.1, 40.8, 50.4]',
        sampleOutput: "{'count': 5, 'mean': 30.4, 'min': 10.5, 'max': 50.4, 'variance': 255.43}",
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        tipOrTrick: 'Notice how default parameter `precision: int = 2` lets callers invoke `calculate_stats(nums)` without specifying precision every time.'
      },
      {
        id: 'bp-t9-5',
        title: 'Decimal to Binary and Binary to Decimal Converters',
        difficulty: 'Easy',
        concept: 'Pure Base-Conversion Logic using Repeated Division and Powers of 2',
        problemStatement: 'Implement `to_binary(n)` and `to_decimal(bin_str)` without using built-in `bin()` or `int(s, 2)`.',
        logicSteps: [
          'Decimal to Binary: repeatedly divide `n` by 2, collect remainder `n % 2`, update `n = n // 2`, reverse remainders.',
          'Binary to Decimal: iterate through bits from right to left, add `bit * (2 ** power)`.'
        ],
        code: `def decimal_to_binary(n: int) -> str:\n    if n == 0:\n        return "0"\n    bits = []\n    while n > 0:\n        bits.append(str(n % 2))\n        n //= 2\n    bits.reverse()\n    return "".join(bits)\n\ndef binary_to_decimal(b_str: str) -> int:\n    decimal = 0\n    for bit in b_str:\n        decimal = (decimal * 2) + int(bit)\n    return decimal\n\n# Example execution\nb = decimal_to_binary(42)\nprint("42 in binary:", b)         # 101010\nprint("101010 in decimal:", binary_to_decimal(b))  # 42`,
        sampleInput: '42',
        sampleOutput: '42 in binary: 101010\n101010 in decimal: 42',
        timeComplexity: 'O(log N)',
        spaceComplexity: 'O(log N)',
        tipOrTrick: 'Horner\'s rule `decimal = (decimal * 2) + bit` avoids calculating expensive `2 ** power` explicitly!'
      }
    ],
    tipsAndTricks: [
      {
        title: 'The Mutable Default Argument Bug',
        category: 'Edge Case Guard',
        explanation: 'NEVER use a mutable default argument like `def fn(arr=[])`. Python creates the list ONCE when the module loads, so all calls share that same list!',
        codeSnippet: `# DANGEROUS:\n# def add_item(x, lst=[]): lst.append(x); return lst\n\n# SAFE:\ndef add_item(x, lst=None):\n    if lst is None: lst = []\n    lst.append(x)\n    return lst`
      },
      {
        title: 'Type Hints & Return Annotation',
        category: 'Pythonic Shortcut',
        explanation: 'Document function signatures with type hints `def f(x: int) -> bool:` for autocomplete, linting, and self-documenting code.',
        codeSnippet: `def is_even(num: int) -> bool:\n    return num % 2 == 0`
      },
      {
        title: 'Early Return Guard Clauses',
        category: 'Logic Building',
        explanation: 'Instead of deeply nesting `if...else` blocks, check invalid conditions first and return early.',
        codeSnippet: `def process(user):\n    if not user: return None\n    if not user.is_active: return None\n    return user.compute()`
      }
    ]
  },

  // ==========================================
  // DAY 10: RECURSION
  // ==========================================
  T10: {
    basicPrograms: [
      {
        id: 'bp-t10-1',
        title: 'Recursive Factorial with Call Stack Trace',
        difficulty: 'Beginner',
        concept: 'Base Case vs Recursive Step: n * factorial(n - 1)',
        problemStatement: 'Compute N! (N factorial) recursively, with defensive handling for N < 0.',
        logicSteps: [
          'Identify Base Case: 0! = 1 and 1! = 1. If `n <= 1`, return 1.',
          'Identify Recursive Step: For `n > 1`, `factorial(n) = n * factorial(n - 1)`.',
          'Guard against invalid input: If `n < 0`, raise ValueError.'
        ],
        code: `def factorial(n: int) -> int:\n    if n < 0:\n        raise ValueError("Factorial undefined for negative numbers")\n    # 1. Base Case\n    if n <= 1:\n        return 1\n    # 2. Recursive Step\n    return n * factorial(n - 1)\n\n# Example execution\nprint("5! =", factorial(5))  # 120`,
        sampleInput: 'n = 5',
        sampleOutput: '5! = 120',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(N) stack frames',
        tipOrTrick: 'Every recursive function MUST have at least one base case where no recursive call is made; otherwise it will crash with RecursionError.'
      },
      {
        id: 'bp-t10-2',
        title: 'Recursive Sum of Digits of an Integer',
        difficulty: 'Easy',
        concept: 'Last Digit Extraction + Recursive Floor Division',
        problemStatement: 'Compute the sum of digits of a non-negative integer recursively (e.g. 1234 -> 1 + 2 + 3 + 4 = 10).',
        logicSteps: [
          'Base Case: When `n < 10`, the sum is simply `n`.',
          'Extract last digit using modulo: `n % 10`.',
          'Remove last digit using integer division: `n // 10`.',
          'Recursive relation: `sum_digits(n) = (n % 10) + sum_digits(n // 10)`.'
        ],
        code: `def sum_of_digits(n: int) -> int:\n    n = abs(n)  # Handle negative signs gracefully\n    # Base case: single digit\n    if n < 10:\n        return n\n    # Recursive step: last digit + sum of remaining digits\n    return (n % 10) + sum_of_digits(n // 10)\n\n# Example execution\nprint("Sum of digits(9876):", sum_of_digits(9876))`,
        sampleInput: '9876',
        sampleOutput: 'Sum of digits(9876): 30',
        timeComplexity: 'O(Number of digits) = O(log10 N)',
        spaceComplexity: 'O(log10 N) call stack',
        tipOrTrick: 'Modulo `% 10` extracts the rightmost digit, while `// 10` chops it off. This recursive pair works for any integer decomposition.'
      },
      {
        id: 'bp-t10-3',
        title: 'Recursive Fibonacci with Call Visualization',
        difficulty: 'Easy',
        concept: 'Multiple Recursive Branches: fib(n-1) + fib(n-2)',
        problemStatement: 'Compute the N-th Fibonacci number recursively, understanding the binary recursion tree.',
        logicSteps: [
          'Base Cases: `fib(0) = 0`, `fib(1) = 1`.',
          'Recursive Step: For `n >= 2`, `fib(n) = fib(n - 1) + fib(n - 2)`.',
          'Notice how each call spawns 2 child recursive calls, creating a binary tree of depth N.'
        ],
        code: `def fibonacci(n: int) -> int:\n    if n < 0:\n        raise ValueError("Index must be non-negative")\n    # Base cases\n    if n == 0:\n        return 0\n    if n == 1:\n        return 1\n        \n    # Recursive step\n    return fibonacci(n - 1) + fibonacci(n - 2)\n\n# Example execution\nfor i in range(8):\n    print(f"fib({i}) = {fibonacci(i)}")`,
        sampleInput: 'n = 7',
        sampleOutput: 'fib(0)=0, fib(1)=1, fib(2)=1, fib(3)=2, fib(4)=3, fib(5)=5, fib(6)=8, fib(7)=13',
        timeComplexity: 'O(2^N) naive, reducible to O(N) with memoization',
        spaceComplexity: 'O(N) maximum stack depth',
        tipOrTrick: 'Naive Fibonacci has O(2^N) complexity due to redundant calls; adding `@functools.lru_cache(None)` reduces it to O(N) instant execution!'
      },
      {
        id: 'bp-t10-4',
        title: 'Recursive String Reversal',
        difficulty: 'Easy',
        concept: 'Divide & Conquer String Shrinking: reverse(s[1:]) + s[0]',
        problemStatement: 'Reverse a string using recursion without loops or built-in `[::-1]`.',
        logicSteps: [
          'Base Case: An empty string `""` or single character string has reverse equal to itself.',
          'Take first character `s[0]`.',
          'Recursively reverse the substring `s[1:]`.',
          'Attach `s[0]` to the end: `reverse(s[1:]) + s[0]`.'
        ],
        code: `def reverse_string_recursive(s: str) -> str:\n    # Base case\n    if len(s) <= 1:\n        return s\n    # Recursive step: reverse rest of string, then append first char\n    return reverse_string_recursive(s[1:]) + s[0]\n\n# Example execution\nprint(reverse_string_recursive("recursion"))`,
        sampleInput: '"recursion"',
        sampleOutput: '"noisrucer"',
        timeComplexity: 'O(N^2) due to slicing and string concatenation',
        spaceComplexity: 'O(N) stack depth',
        tipOrTrick: 'To make recursive string operations O(N), pass index pointers `(s, left, right)` into a helper function instead of slicing.'
      },
      {
        id: 'bp-t10-5',
        title: 'Euclidean Algorithm for Greatest Common Divisor (GCD)',
        difficulty: 'Easy',
        concept: 'Euclidean Invariant: gcd(a, b) = gcd(b, a % b)',
        problemStatement: 'Find the greatest common divisor of two integers `a` and `b` using the recursive Euclidean algorithm.',
        logicSteps: [
          'Mathematical Invariant: `gcd(a, b)` is the exact same as `gcd(b, a % b)`.',
          'Base Case: When `b == 0`, the remainder is zero, so `a` is the GCD!',
          'Recursive Step: `gcd(b, a % b)`.'
        ],
        code: `def gcd(a: int, b: int) -> int:\n    # Base case: when remainder becomes 0\n    if b == 0:\n        return a\n    # Recursive step\n    return gcd(b, a % b)\n\n# Example execution\nprint("GCD(48, 18):", gcd(48, 18))  # 6\nprint("GCD(101, 10):", gcd(101, 10)) # 1`,
        sampleInput: 'a = 48, b = 18',
        sampleOutput: 'GCD(48, 18): 6',
        timeComplexity: 'O(log(min(a, b))) logarithmic steps',
        spaceComplexity: 'O(log(min(a, b))) call stack',
        tipOrTrick: 'The Euclidean algorithm is one of the oldest and fastest algorithms in computer science, finishing in logarithmic steps even for huge numbers!'
      }
    ],
    tipsAndTricks: [
      {
        title: 'The Three Golden Rules of Recursion',
        category: 'Logic Building',
        explanation: '1. Identify the simplest base case where answer is known without further calls. 2. Ensure every recursive call strictly moves closer to the base case. 3. Trust the inductive leap: assume the subproblem call works correctly and combine results.',
        codeSnippet: `def solve(n):\n    if n <= 1: return 1         # 1. Base Case\n    return combine(n, solve(n - 1)) # 2. Progress & 3. Combine`
      },
      {
        title: 'Instant Memoization with @lru_cache',
        category: 'Pythonic Shortcut',
        explanation: 'Transform exponential O(2^N) recursion into linear O(N) by caching previous subproblem results with Python\'s built-in decorator.',
        codeSnippet: `from functools import lru_cache\n\n@lru_cache(maxsize=None)\ndef fib(n):\n    if n <= 1: return n\n    return fib(n-1) + fib(n-2)`
      },
      {
        title: 'Recursion Depth Limits in Python',
        category: 'Edge Case Guard',
        explanation: 'Python defaults to a maximum recursion depth of 1000 frames to prevent C-level stack overflow. Check or increase it if needed.',
        codeSnippet: `import sys\nprint(sys.getrecursionlimit())  # Typically 1000\n# sys.setrecursionlimit(5000)   # Increase if necessary`
      },
      {
        title: 'Visualizing Recursion Depth',
        category: 'Interview Secret',
        explanation: 'When debugging, add a `depth: int = 0` parameter and print messages indented with `"  " * depth` to see the call tree expand and collapse.',
        codeSnippet: `def trace(n, depth=0):\n    print("  " * depth + f"Enter({n})")\n    # ... logic ...\n    print("  " * depth + f"Exit({n})")`
      }
    ]
  }
};
