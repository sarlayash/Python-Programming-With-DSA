export interface DebuggingTestCase {
  input: string;
  expectedOutput: string;
  description: string;
  isHidden?: boolean;
}

export interface DebuggingChallenge {
  id: string;
  title: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  rewardPoints: number;
  errorType: string;
  bugSummary: string;
  symptoms: string;
  buggyCode: string;
  fixedSolution: string;
  hints: string[];
  explanation: string;
  testCases: DebuggingTestCase[];
}

export const DEBUGGING_CHALLENGES: DebuggingChallenge[] = [
  {
    id: 'debug-1',
    title: 'Challenge 1: The Mutable Default Argument Trap',
    category: 'Function Arguments & Memory State',
    difficulty: 'Easy',
    rewardPoints: 50,
    errorType: 'State Bleed Across Invocations',
    bugSummary: 'A customer shopping cart accumulator modifies a default list argument. In Python, default arguments are evaluated only once at function definition time, not on every function call. Subsequent calls without passing a new cart unintentionally reuse the previous customer\'s cart in memory.',
    symptoms: 'Subsequent calls without an explicit cart contain items added in earlier calls.',
    buggyCode: `import sys

# BUGGY FUNCTION: Default argument 'cart=[]' is created ONCE at definition time.
# Every subsequent call mutates the exact same list object in memory!
def add_item_to_cart(item_name, price, cart=[]):
    cart.append({"item": item_name, "price": price})
    return cart

def main():
    # Read transactions from standard input
    input_data = sys.stdin.read().splitlines()
    if not input_data:
        return

    # Call 1 without cart argument (Customer 1)
    line1 = input_data[0].strip().split()
    cart1 = add_item_to_cart(line1[0], int(line1[1]))
    print(f"Customer 1 items: {len(cart1)}")

    # Call 2 without cart argument (Customer 2 - should have fresh empty cart!)
    if len(input_data) > 1:
        line2 = input_data[1].strip().split()
        cart2 = add_item_to_cart(line2[0], int(line2[1]))
        print(f"Customer 2 items: {len(cart2)}")
        
        # Calculate total price for customer 2
        total2 = sum(item["price"] for item in cart2)
        print(f"Customer 2 total: {total2}")

if __name__ == "__main__":
    main()
`,
    fixedSolution: `import sys

# FIXED FUNCTION: Use None as default sentinel, allocate a fresh list on each invocation.
def add_item_to_cart(item_name, price, cart=None):
    if cart is None:
        cart = []
    cart.append({"item": item_name, "price": price})
    return cart

def main():
    input_data = sys.stdin.read().splitlines()
    if not input_data:
        return

    # Call 1 without cart argument (Customer 1)
    line1 = input_data[0].strip().split()
    cart1 = add_item_to_cart(line1[0], int(line1[1]))
    print(f"Customer 1 items: {len(cart1)}")

    # Call 2 without cart argument (Customer 2 gets a fresh cart)
    if len(input_data) > 1:
        line2 = input_data[1].strip().split()
        cart2 = add_item_to_cart(line2[0], int(line2[1]))
        print(f"Customer 2 items: {len(cart2)}")
        
        total2 = sum(item["price"] for item in cart2)
        print(f"Customer 2 total: {total2}")

if __name__ == "__main__":
    main()
`,
    hints: [
      'In Python, default parameter values like `cart=[]` are evaluated ONCE when the `def` statement is parsed, not whenever the function is called.',
      'To provide a fresh mutable default, use the idiomatic Python sentinel pattern: `cart=None`, and inside the function check: `if cart is None: cart = []`.'
    ],
    explanation: 'Python evaluates default parameter values when the function is defined, not at runtime. When you provide a mutable object like a list `[]` or dict `{}` as default, all calls that omit the argument share the same object. The standard fix is using `None` as the default and creating a new list inside the function body.',
    testCases: [
      {
        input: 'Laptop 1200\nMouse 25',
        expectedOutput: 'Customer 1 items: 1\nCustomer 2 items: 1\nCustomer 2 total: 25',
        description: 'Two separate customers must each receive an isolated cart of size 1'
      },
      {
        input: 'Keyboard 75\nHeadphones 150',
        expectedOutput: 'Customer 1 items: 1\nCustomer 2 items: 1\nCustomer 2 total: 150',
        description: 'Verifies price calculation isolates customer 2 without residual state'
      }
    ]
  },
  {
    id: 'debug-2',
    title: 'Challenge 2: Off-By-One in Binary Search',
    category: 'Searching & Pointer Boundaries',
    difficulty: 'Easy',
    rewardPoints: 60,
    errorType: 'Loop Boundary & Deadlock',
    bugSummary: 'A binary search function fails to find targets located at the last index, returns -1 improperly on single-element lists, or enters infinite loops due to improper pointer boundary adjustments.',
    symptoms: 'Fails to match elements at index len(arr)-1 and may hang on certain searches.',
    buggyCode: `import sys

# BUGGY FUNCTION:
# 1. 'left < right' terminates too early before checking when left == right
# 2. 'right = mid' can create infinite loop or skips the target
def binary_search(nums, target):
    left = 0
    right = len(nums) - 1

    # Bug: terminating when left == right misses single element or boundary element!
    while left < right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid  # Bug: should be mid - 1 to narrow space properly

    return -1

def main():
    lines = [line.strip() for line in sys.stdin.read().splitlines() if line.strip()]
    if len(lines) < 2:
        return
    nums = [int(x) for x in lines[0].split()]
    target = int(lines[1])

    result = binary_search(nums, target)
    print(f"Target Index: {result}")

if __name__ == "__main__":
    main()
`,
    fixedSolution: `import sys

# FIXED FUNCTION:
# 1. Use 'while left <= right:' so single-element boundaries are inspected
# 2. Update 'right = mid - 1' when target is smaller than middle
def binary_search(nums, target):
    left = 0
    right = len(nums) - 1

    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1

    return -1

def main():
    lines = [line.strip() for line in sys.stdin.read().splitlines() if line.strip()]
    if len(lines) < 2:
        return
    nums = [int(x) for x in lines[0].split()]
    target = int(lines[1])

    result = binary_search(nums, target)
    print(f"Target Index: {result}")

if __name__ == "__main__":
    main()
`,
    hints: [
      'Look closely at the while loop condition. If `left == right`, the element at that index hasn\'t been checked yet!',
      'When narrowing the upper half, if `nums[mid] > target`, `mid` itself is not the target, so `right` should be adjusted to `mid - 1`.'
    ],
    explanation: 'Classic binary search requires `while left <= right:` when `right` is initialized to `len(nums) - 1`. If `left < right` is used, the loop terminates while one candidate element remains uninspected. Furthermore, setting `right = mid - 1` guarantees that the search interval shrinks on every iteration, preventing infinite cycles.',
    testCases: [
      {
        input: '1 3 5 7 9 11 15\n15',
        expectedOutput: 'Target Index: 6',
        description: 'Searching for the last element in the array'
      },
      {
        input: '10 20 30 40 50\n10',
        expectedOutput: 'Target Index: 0',
        description: 'Searching for the first element in the array'
      },
      {
        input: '42\n42',
        expectedOutput: 'Target Index: 0',
        description: 'Single element array target search'
      },
      {
        input: '2 4 6 8 10\n5',
        expectedOutput: 'Target Index: -1',
        description: 'Missing target in sorted array'
      }
    ]
  },
  {
    id: 'debug-3',
    title: 'Challenge 3: Broken Two-Pointer Palindrome',
    category: 'Strings, Two Pointers & Edge Cases',
    difficulty: 'Medium',
    rewardPoints: 70,
    errorType: 'IndexError & Unchecked Boundary',
    bugSummary: 'A two-pointer palindrome validator skips spaces and punctuation. However, the inner skipping loops increment pointers without ensuring `left < right`, causing `IndexError: string index out of range` on strings composed primarily of punctuation or whitespace, and case sensitivity is handled inconsistently.',
    symptoms: 'Crashes with IndexError on inputs with punctuation, spaces, or empty strings.',
    buggyCode: `import sys

# BUGGY FUNCTION:
# Inner while loops advance left and right without verifying left < right boundary!
# Also fails to convert characters to lowercase before comparison.
def is_valid_palindrome(s):
    left = 0
    right = len(s) - 1

    while left < right:
        # Bug: inner loop can increment 'left' beyond string length if string has all punctuation!
        while not s[left].isalnum():
            left += 1

        # Bug: inner loop can decrement 'right' below zero!
        while not s[right].isalnum():
            right -= 1

        # Bug: Case-sensitive comparison will fail on "Panama" vs "panama"
        if s[left] != s[right]:
            return False

        left += 1
        right -= 1

    return True

def main():
    lines = sys.stdin.read().splitlines()
    for raw_line in lines:
        line = raw_line.strip()
        if not line:
            continue
        result = is_valid_palindrome(line)
        print(f"Result: {result}")

if __name__ == "__main__":
    main()
`,
    fixedSolution: `import sys

# FIXED FUNCTION:
# 1. Guard inner while loops with 'left < right'
# 2. Compare characters using '.lower()'
def is_valid_palindrome(s):
    left = 0
    right = len(s) - 1

    while left < right:
        while left < right and not s[left].isalnum():
            left += 1

        while left < right and not s[right].isalnum():
            right -= 1

        if s[left].lower() != s[right].lower():
            return False

        left += 1
        right -= 1

    return True

def main():
    lines = sys.stdin.read().splitlines()
    for raw_line in lines:
        line = raw_line.strip()
        if not line:
            continue
        result = is_valid_palindrome(line)
        print(f"Result: {result}")

if __name__ == "__main__":
    main()
`,
    hints: [
      'Notice what happens if `s` contains only punctuation like `"???"`. The inner `while not s[left].isalnum(): left += 1` will keep incrementing until it crashes past `len(s)`!',
      'Add `left < right and` to both inner while loop conditions, and remember to call `.lower()` on both characters during comparison.'
    ],
    explanation: 'Whenever you use two pointers with inner while loops to skip characters, you must always re-verify the bounds `left < right` inside the inner condition. Without this guard, strings composed entirely of non-alphanumeric characters cause the pointer to read out-of-bounds.',
    testCases: [
      {
        input: 'A man, a plan, a canal: Panama\nrace a car',
        expectedOutput: 'Result: True\nResult: False',
        description: 'Standard alphanumeric phrases with spaces and punctuation'
      },
      {
        input: '.,?\nWas it a car or a cat I saw?',
        expectedOutput: 'Result: True\nResult: True',
        description: 'Edge case with only punctuation followed by mixed-case sentence'
      }
    ]
  },
  {
    id: 'debug-4',
    title: 'Challenge 4: Matrix Shallow Copy Reference Mutation',
    category: '2D Arrays & Reference Semantics',
    difficulty: 'Medium',
    rewardPoints: 80,
    errorType: 'Aliasing & Shared Row References',
    bugSummary: 'A 2D matrix initialization using list multiplication `[[0] * cols] * rows` duplicates the pointer to the same inner list across every row. Updating cell `matrix[0][0] = val` unintentionally overwrites column 0 for EVERY row in the grid.',
    symptoms: 'Modifying a single cell in one row mysteriously modifies the corresponding column in all other rows.',
    buggyCode: `import sys

# BUGGY FUNCTION:
# '[[0] * cols] * rows' duplicates the reference to the SAME inner list!
def update_matrix_cell(rows, cols, target_r, target_c, new_val):
    # Bug: All rows point to the exact same list in memory!
    matrix = [[0] * cols] * rows

    # Modifying one cell here actually mutates all rows!
    matrix[target_r][target_c] = new_val
    return matrix

def main():
    lines = [l.strip() for l in sys.stdin.read().splitlines() if l.strip()]
    if not lines:
        return
    
    parts = [int(x) for x in lines[0].split()]
    rows, cols, r, c, val = parts[0], parts[1], parts[2], parts[3], parts[4]

    res = update_matrix_cell(rows, cols, r, c, val)
    for row in res:
        print(" ".join(str(x) for x in row))

if __name__ == "__main__":
    main()
`,
    fixedSolution: `import sys

# FIXED FUNCTION:
# Use list comprehension to allocate an independent list for every row!
def update_matrix_cell(rows, cols, target_r, target_c, new_val):
    matrix = [[0] * cols for _ in range(rows)]
    matrix[target_r][target_c] = new_val
    return matrix

def main():
    lines = [l.strip() for l in sys.stdin.read().splitlines() if l.strip()]
    if not lines:
        return
    
    parts = [int(x) for x in lines[0].split()]
    rows, cols, r, c, val = parts[0], parts[1], parts[2], parts[3], parts[4]

    res = update_matrix_cell(rows, cols, r, c, val)
    for row in res:
        print(" ".join(str(x) for x in row))

if __name__ == "__main__":
    main()
`,
    hints: [
      'In Python, `[obj] * n` creates a list with `n` copies of the REFERENCE to `obj`. If `obj` is mutable (like a list), modifying one row mutates all `n` rows.',
      'Replace the outer `* rows` with a list comprehension: `[[0] * cols for _ in range(rows)]` so each row is a newly constructed, independent list.'
    ],
    explanation: 'List multiplication `[item] * n` is shallow. When `item` is a mutable inner list `[0] * cols`, the resulting outer list holds `rows` references pointing to the exact same list in heap memory. Using list comprehension `[[0] * cols for _ in range(rows)]` evaluates the inner expression repeatedly, allocating `rows` distinct lists.',
    testCases: [
      {
        input: '3 3 0 0 7',
        expectedOutput: '7 0 0\n0 0 0\n0 0 0',
        description: 'Only row 0, col 0 must be 7. Other rows must remain 0'
      },
      {
        input: '2 4 1 2 99',
        expectedOutput: '0 0 0 0\n0 0 99 0',
        description: 'Non-square grid update at row 1, col 2'
      }
    ]
  },
  {
    id: 'debug-5',
    title: 'Challenge 5: Fast & Slow Pointer Cycle Detection',
    category: 'Linked List Simulation & Pointer Safety',
    difficulty: 'Hard',
    rewardPoints: 90,
    errorType: 'Unchecked Pointer & Premature Termination',
    bugSummary: 'Floyd\'s Cycle-Finding Algorithm (Tortoise and Hare) simulated on an array of next-pointers crashes with an IndexError when the chain reaches the end (-1), or gives false positives because slow and fast start at the same node.',
    symptoms: 'Crashes on acyclic graphs when fast attempts to read next_arr[-1] or beyond bounds.',
    buggyCode: `import sys

# BUGGY FUNCTION:
# 1. 'fast = slow = start_node' immediately checks 'slow == fast', causing false positives
# 2. Advances fast two steps without verifying that next_arr[fast] != -1!
def detect_cycle(next_ptrs, start_node):
    if not next_ptrs or start_node < 0 or start_node >= len(next_ptrs):
        return False

    slow = start_node
    fast = start_node

    # Bug: If fast is at a node whose next is -1, next_ptrs[fast] is -1,
    # and next_ptrs[-1] accesses the last element instead of stopping!
    while fast != -1 and fast < len(next_ptrs):
        # Bug: Checking equality at beginning immediately returns True!
        if slow == fast and slow != start_node:
            return True

        slow = next_ptrs[slow]
        # Bug: If next_ptrs[fast] is -1, next_ptrs[-1] gives the WRONG node (Python negative indexing)!
        fast = next_ptrs[next_ptrs[fast]]

    return False

def main():
    lines = [l.strip() for l in sys.stdin.read().splitlines() if l.strip()]
    if len(lines) < 2:
        return
    
    next_ptrs = [int(x) for x in lines[0].split()]
    start_node = int(lines[1])

    has_cycle = detect_cycle(next_ptrs, start_node)
    print(f"Cycle Detected: {has_cycle}")

if __name__ == "__main__":
    main()
`,
    fixedSolution: `import sys

# FIXED FUNCTION:
# Advance pointers first, and guard fast != -1, fast < len, and next_ptrs[fast] != -1
def detect_cycle(next_ptrs, start_node):
    if not next_ptrs or start_node < 0 or start_node >= len(next_ptrs):
        return False

    slow = start_node
    fast = start_node

    while fast != -1 and fast < len(next_ptrs) and next_ptrs[fast] != -1 and next_ptrs[fast] < len(next_ptrs):
        slow = next_ptrs[slow]
        fast = next_ptrs[next_ptrs[fast]]

        if slow != -1 and slow == fast:
            return True

    return False

def main():
    lines = [l.strip() for l in sys.stdin.read().splitlines() if l.strip()]
    if len(lines) < 2:
        return
    
    next_ptrs = [int(x) for x in lines[0].split()]
    start_node = int(lines[1])

    has_cycle = detect_cycle(next_ptrs, start_node)
    print(f"Cycle Detected: {has_cycle}")

if __name__ == "__main__":
    main()
`,
    hints: [
      'In Python, negative indexing `next_ptrs[-1]` does NOT cause an index error—it accesses the LAST element of the list! If -1 represents NULL, accessing `next_ptrs[-1]` corrupts the algorithm.',
      'Check `next_ptrs[fast] != -1 and next_ptrs[fast] < len(next_ptrs)` BEFORE advancing `fast = next_ptrs[next_ptrs[fast]]`.'
    ],
    explanation: 'Python lists support negative indexing, so reading index `-1` retrieves the last element instead of raising an error. When `-1` represents a null pointer in simulated pointer structures, you must explicitly guard against accessing `next_ptrs[-1]`. Furthermore, slow and fast should be advanced before comparing for convergence.',
    testCases: [
      {
        input: '1 2 3 1\n0',
        expectedOutput: 'Cycle Detected: True',
        description: 'Node 0 -> 1 -> 2 -> 3 -> 1 forms a cycle'
      },
      {
        input: '1 2 -1\n0',
        expectedOutput: 'Cycle Detected: False',
        description: 'Linear acyclic list terminating at node 2 (-1)'
      },
      {
        input: '-1\n0',
        expectedOutput: 'Cycle Detected: False',
        description: 'Single node immediately pointing to null (-1)'
      }
    ]
  }
];
