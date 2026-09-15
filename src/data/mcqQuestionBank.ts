import { MCQQuestion } from '../types';

export const MCQ_QUESTION_BANK: MCQQuestion[] = [
  // ==========================================
  // TOPIC T1: PATTERN PROGRAMMING
  // ==========================================
  {
    id: 'mcq-t1-01',
    topicCode: 'T1',
    topicName: 'Pattern Programming',
    difficulty: 'Easy',
    question: 'In a nested loop printing an N x N grid of coordinates, what condition identifies elements on the secondary (anti-) diagonal?',
    codeSnippet: `for i in range(N):
    for j in range(N):
        if ???:
            print("*", end=" ")
        else:
            print(" ", end=" ")
    print()`,
    options: [
      { id: 'A', text: 'i == j' },
      { id: 'B', text: 'i + j == N - 1' },
      { id: 'C', text: 'i + j == N' },
      { id: 'D', text: 'i - j == 1' }
    ],
    correctOptionId: 'B',
    explanation: 'In zero-indexed N x N matrices, the secondary diagonal cells satisfy the invariant row_index + col_index == N - 1 (e.g. for N=5: (0,4), (1,3), (2,2), (3,1), (4,0)). Option A identifies the primary main diagonal.',
  },
  {
    id: 'mcq-t1-02',
    topicCode: 'T1',
    topicName: 'Pattern Programming',
    difficulty: 'Medium',
    question: 'What is the output of the following Python pattern code when N = 4?',
    codeSnippet: `N = 4
for i in range(1, N + 1):
    print(" " * (N - i) + "*" * (2 * i - 1))`,
    options: [
      { id: 'A', text: 'A right-angled triangle aligned to the right' },
      { id: 'B', text: 'A symmetric centered pyramid of height 4 with base 7 stars' },
      { id: 'C', text: 'An inverted pyramid of height 4' },
      { id: 'D', text: 'A rectangle of 4 rows and 7 columns' }
    ],
    correctOptionId: 'B',
    explanation: 'Row i has (N - i) leading spaces and (2*i - 1) stars (1, 3, 5, 7 stars). The spaces center the odd number of stars, forming a classic symmetrical full pyramid of height 4 and base width 7.',
  },
  {
    id: 'mcq-t1-03',
    topicCode: 'T1',
    topicName: 'Pattern Programming',
    difficulty: 'Medium',
    question: 'In Floyd\'s Triangle, what is the total number of integers printed for N rows?',
    codeSnippet: `num = 1
for i in range(1, N + 1):
    for j in range(i):
        print(num, end=" ")
        num += 1
    print()`,
    options: [
      { id: 'A', text: 'N * N' },
      { id: 'B', text: 'N * (N + 1) // 2' },
      { id: 'C', text: '2 ** N' },
      { id: 'D', text: 'N * (N - 1) // 2' }
    ],
    correctOptionId: 'B',
    explanation: 'Row i prints i numbers. The sum of printed numbers for N rows is 1 + 2 + 3 + ... + N, which equals the triangular number formula N * (N + 1) // 2.',
  },
  {
    id: 'mcq-t1-04',
    topicCode: 'T1',
    topicName: 'Pattern Programming',
    difficulty: 'Hard',
    question: 'To render a hollow diamond pattern of size 2*N - 1, which condition determines if star `*` should be placed at row `i` and column `j`?',
    options: [
      { id: 'A', text: 'abs(i - mid) + abs(j - mid) == mid' },
      { id: 'B', text: 'abs(i - mid) + abs(j - mid) <= mid' },
      { id: 'C', text: 'i == mid or j == mid' },
      { id: 'D', text: 'abs(i - j) == mid' }
    ],
    correctOptionId: 'A',
    explanation: 'The Manhattan distance from the center (mid, mid) to any point (i, j) on the outer perimeter of a diamond is constant and exactly equal to mid: |i - mid| + |j - mid| == mid. The `<=` condition would fill the entire solid diamond.',
  },
  {
    id: 'mcq-t1-05',
    topicCode: 'T1',
    topicName: 'Pattern Programming',
    difficulty: 'Easy',
    question: 'What is the time complexity of printing an N x N checkered board pattern with alternating 1s and 0s?',
    options: [
      { id: 'A', text: 'O(N)' },
      { id: 'B', text: 'O(N log N)' },
      { id: 'C', text: 'O(N^2)' },
      { id: 'D', text: 'O(2^N)' }
    ],
    correctOptionId: 'C',
    explanation: 'Printing an N x N matrix visits every cell once using two nested loops from 0 to N-1, requiring exactly N * N iterations, which is O(N^2) time complexity.',
  },

  // ==========================================
  // TOPIC T2: 1D ARRAYS
  // ==========================================
  {
    id: 'mcq-t2-01',
    topicCode: 'T2',
    topicName: '1D Arrays',
    difficulty: 'Easy',
    question: 'What is the time complexity of inserting an element at index 0 in a standard Python list of length N?',
    options: [
      { id: 'A', text: 'O(1)' },
      { id: 'B', text: 'O(log N)' },
      { id: 'C', text: 'O(N)' },
      { id: 'D', text: 'O(N^2)' }
    ],
    correctOptionId: 'C',
    explanation: 'Python lists are contiguous dynamic arrays. Inserting at index 0 requires shifting all existing N elements one position to the right in memory, making it O(N). Appending at the end is amortized O(1).',
  },
  {
    id: 'mcq-t2-02',
    topicCode: 'T2',
    topicName: '1D Arrays',
    difficulty: 'Medium',
    question: 'What does `nums[:: -1]` do, and what is its space complexity?',
    codeSnippet: `nums = [10, 20, 30, 40, 50]
reversed_nums = nums[::-1]`,
    options: [
      { id: 'A', text: 'Reverses nums in-place with O(1) auxiliary space' },
      { id: 'B', text: 'Creates a new shallow copy of reversed elements with O(N) space' },
      { id: 'C', text: 'Sorts nums in descending order with O(log N) space' },
      { id: 'D', text: 'Returns an iterator over reversed elements with O(1) space' }
    ],
    correctOptionId: 'B',
    explanation: 'Slicing `nums[::-1]` constructs a brand new list in memory containing the reversed elements, requiring O(N) time and O(N) auxiliary space. To reverse in-place with O(1) space, use `nums.reverse()` or two pointers.',
  },
  {
    id: 'mcq-t2-03',
    topicCode: 'T2',
    topicName: '1D Arrays',
    difficulty: 'Medium',
    question: 'In the Move Zeroes problem, what is the best auxiliary space complexity to shift all 0s to the end while preserving the relative order of non-zero elements?',
    options: [
      { id: 'A', text: 'O(N) auxiliary space' },
      { id: 'B', text: 'O(log N) auxiliary space' },
      { id: 'C', text: 'O(1) auxiliary space using two pointers' },
      { id: 'D', text: 'Cannot be done without sorting' }
    ],
    correctOptionId: 'C',
    explanation: 'Using the two-pointer technique (a read pointer scanning the array and a write pointer tracking the position of the next non-zero), we can overwrite in-place with O(N) time and strictly O(1) auxiliary space.',
  },
  {
    id: 'mcq-t2-04',
    topicCode: 'T2',
    topicName: '1D Arrays',
    difficulty: 'Hard',
    question: 'What will be printed by the following code manipulating list references?',
    codeSnippet: `a = [1, 2, 3]
b = a
b.append(4)
a = a + [5]
b.append(6)
print(a, b)`,
    options: [
      { id: 'A', text: '[1, 2, 3, 4, 5, 6] [1, 2, 3, 4, 5, 6]' },
      { id: 'B', text: '[1, 2, 3, 4, 5] [1, 2, 3, 4, 6]' },
      { id: 'C', text: '[1, 2, 3, 5] [1, 2, 3, 4, 6]' },
      { id: 'D', text: '[1, 2, 3, 4, 6] [1, 2, 3, 4, 5]' }
    ],
    correctOptionId: 'B',
    explanation: '`b = a` aliases the same list. `b.append(4)` modifies it to `[1, 2, 3, 4]`. Then `a = a + [5]` creates a BRAND NEW list object assigned to `a` (`[1, 2, 3, 4, 5]`). `b` still points to the original list, so `b.append(6)` modifies `b` to `[1, 2, 3, 4, 6]`.',
  },

  // ==========================================
  // TOPIC T3: TWO POINTERS
  // ==========================================
  {
    id: 'mcq-t3-01',
    topicCode: 'T3',
    topicName: 'Two Pointers',
    difficulty: 'Easy',
    question: 'When solving the Two-Sum problem on a SORTED array using two pointers (left at 0, right at N-1), what action is taken if `nums[left] + nums[right] < target`?',
    options: [
      { id: 'A', text: 'Decrement right pointer: right -= 1' },
      { id: 'B', text: 'Increment left pointer: left += 1' },
      { id: 'C', text: 'Increment both pointers: left += 1, right += 1' },
      { id: 'D', text: 'Reset left to 0' }
    ],
    correctOptionId: 'B',
    explanation: 'Since the array is sorted in ascending order, if the current sum is strictly less than target, decrementing right would only reduce the sum further. Therefore, we must increment `left += 1` to increase the sum toward target.',
  },
  {
    id: 'mcq-t3-02',
    topicCode: 'T3',
    topicName: 'Two Pointers',
    difficulty: 'Medium',
    question: 'What is the time complexity of reversing an array in-place using two converging pointers?',
    options: [
      { id: 'A', text: 'O(N^2)' },
      { id: 'B', text: 'O(N log N)' },
      { id: 'C', text: 'O(N)' },
      { id: 'D', text: 'O(1)' }
    ],
    correctOptionId: 'C',
    explanation: 'Left starts at 0 and right at N-1. In each step, elements are swapped and pointers move toward each other. The loop executes N // 2 times, each taking O(1) work. Hence the time complexity is strictly O(N).',
  },
  {
    id: 'mcq-t3-03',
    topicCode: 'T3',
    topicName: 'Two Pointers',
    difficulty: 'Hard',
    question: 'In the Dutch National Flag algorithm (sorting array of 0s, 1s, and 2s in one pass), why does `high` decrement without advancing `mid` when `nums[mid] == 2`?',
    codeSnippet: `if nums[mid] == 2:
    nums[mid], nums[high] = nums[high], nums[mid]
    high -= 1`,
    options: [
      { id: 'A', text: 'Because mid has reached the end of the array' },
      { id: 'B', text: 'Because the element swapped from `high` into `mid` is unexamined and could be 0, 1, or 2' },
      { id: 'C', text: 'To avoid an infinite while loop' },
      { id: 'D', text: 'Because Python does not allow mid to advance after high decrements' }
    ],
    correctOptionId: 'B',
    explanation: 'When swapping `nums[mid]` with `nums[high]`, the element brought into index `mid` came from the unexamined region. It might be a 0 that needs to be moved to the front. Advancing `mid` immediately would skip verifying this swapped element.',
  },

  // ==========================================
  // TOPIC T4: 2D MATRICES
  // ==========================================
  {
    id: 'mcq-t4-01',
    topicCode: 'T4',
    topicName: '2D Matrices',
    difficulty: 'Easy',
    question: 'Which of the following creates an independent 3x3 matrix filled with zeros without shallow copy row aliasing bugs in Python?',
    options: [
      { id: 'A', text: 'matrix = [[0] * 3] * 3' },
      { id: 'B', text: 'matrix = [[0 for _ in range(3)] for _ in range(3)]' },
      { id: 'C', text: 'matrix = [[0, 0, 0]] * 3' },
      { id: 'D', text: 'matrix = [0] * 9' }
    ],
    correctOptionId: 'B',
    explanation: 'Option A and C repeat references to the EXACT SAME inner list 3 times, causing modifying `matrix[0][0] = 1` to mutate all 3 rows simultaneously. Option B executes the inner list comprehension 3 separate times, allocating 3 distinct rows.',
  },
  {
    id: 'mcq-t4-02',
    topicCode: 'T4',
    topicName: '2D Matrices',
    difficulty: 'Medium',
    question: 'What Pythonic idiom transposes an M x N matrix in one line?',
    codeSnippet: `matrix = [[1, 2, 3], [4, 5, 6]]
transposed = ???`,
    options: [
      { id: 'A', text: 'list(map(list, zip(*matrix)))' },
      { id: 'B', text: 'matrix.transpose()' },
      { id: 'C', text: '[matrix[i][j] for i in range(len(matrix))]' },
      { id: 'D', text: 'zip(matrix)' }
    ],
    correctOptionId: 'A',
    explanation: '`*matrix` unpacks the rows as arguments into `zip()`. `zip()` groups the i-th elements from each row together into columns. `map(list, ...)` converts the zipped tuples back into mutable lists, producing the transposed matrix.',
  },
  {
    id: 'mcq-t4-03',
    topicCode: 'T4',
    topicName: '2D Matrices',
    difficulty: 'Medium',
    question: 'To check if a square matrix is symmetric (equal to its transpose), how many comparisons are required in the optimal check?',
    options: [
      { id: 'A', text: 'N * N comparisons' },
      { id: 'B', text: 'N * (N - 1) // 2 comparisons' },
      { id: 'C', text: '2 * N comparisons' },
      { id: 'D', text: 'N comparisons' }
    ],
    correctOptionId: 'B',
    explanation: 'Diagonal elements `matrix[i][i]` are always equal to themselves. Symmetrical pairs `(i, j)` and `(j, i)` only need to be checked once for all pairs where `i < j`. The number of such pairs above the diagonal is N * (N - 1) // 2.',
  },

  // ==========================================
  // TOPIC T5: MATRIX ROTATION & SPIRALS
  // ==========================================
  {
    id: 'mcq-t5-01',
    topicCode: 'T5',
    topicName: 'Matrix Rotation & Spirals',
    difficulty: 'Medium',
    question: 'How do you rotate an N x N matrix 90 degrees CLOCKWISE in-place with O(1) auxiliary space?',
    options: [
      { id: 'A', text: 'Reverse each row, then transpose the matrix' },
      { id: 'B', text: 'Transpose the matrix, then reverse each row' },
      { id: 'C', text: 'Reverse the matrix vertically, then reverse each column' },
      { id: 'D', text: 'Shift every element by N positions' }
    ],
    correctOptionId: 'B',
    explanation: 'Transposing swaps `matrix[i][j]` with `matrix[j][i]`. Then reversing each row horizontally transforms index `(j, i)` into `(j, N - 1 - i)`, which is the exact mathematical definition of a 90-degree clockwise rotation.',
  },
  {
    id: 'mcq-t5-02',
    topicCode: 'T5',
    topicName: 'Matrix Rotation & Spirals',
    difficulty: 'Hard',
    question: 'During spiral order traversal of an M x N matrix, what boundary condition check is required before traversing the bottom row and left column in each layer?',
    options: [
      { id: 'A', text: 'Check if top <= bottom and left <= right' },
      { id: 'B', text: 'Check if top == bottom' },
      { id: 'C', text: 'Check if M == N' },
      { id: 'D', text: 'No check is needed if while loop condition is top <= bottom and left <= right' }
    ],
    correctOptionId: 'A',
    explanation: 'In non-square matrices (e.g. 1x3 or 3x1), after top advances `top += 1`, top may exceed bottom. Without checking `if top <= bottom` before traversing the bottom row right-to-left, duplicate visits occur.',
  },

  // ==========================================
  // TOPIC T6: STRINGS & CHARACTER CODES
  // ==========================================
  {
    id: 'mcq-t6-01',
    topicCode: 'T6',
    topicName: 'Strings & Character Codes',
    difficulty: 'Easy',
    question: 'Why does Python throw `TypeError: \'str\' object does not support item assignment` on `s[0] = \'A\'`?',
    options: [
      { id: 'A', text: 'Strings are immutable in Python; individual characters cannot be modified in place' },
      { id: 'B', text: 'Single quotes are invalid for characters in Python' },
      { id: 'C', text: 'Zero indexing is not supported for strings' },
      { id: 'D', text: 'Strings must first be converted to a tuple' }
    ],
    correctOptionId: 'A',
    explanation: 'In Python, strings (`str`) are strictly immutable primitive sequences. Any modification requires constructing a new string (e.g. `s = "A" + s[1:]`) or converting to a mutable `list(s)` first.',
  },
  {
    id: 'mcq-t6-02',
    topicCode: 'T6',
    topicName: 'Strings & Character Codes',
    difficulty: 'Medium',
    question: 'What does `ord(\'a\') - ord(\'A\')` evaluate to in Python?',
    options: [
      { id: 'A', text: '0' },
      { id: 'B', text: '26' },
      { id: 'C', text: '32' },
      { id: 'D', text: '48' }
    ],
    correctOptionId: 'C',
    explanation: 'In standard ASCII/Unicode, lowercase letters start at 97 (\'a\') and uppercase letters start at 65 (\'A\'). 97 - 65 = 32. This constant difference of 32 (or 1 << 5 bit) is widely used in character casing operations.',
  },
  {
    id: 'mcq-t6-03',
    topicCode: 'T6',
    topicName: 'Strings & Character Codes',
    difficulty: 'Medium',
    question: 'What is the time complexity of concatenating a character to a string inside a loop of length N (`s += ch`) in Python without optimization?',
    options: [
      { id: 'A', text: 'O(N)' },
      { id: 'B', text: 'O(N^2)' },
      { id: 'C', text: 'O(1)' },
      { id: 'D', text: 'O(N log N)' }
    ],
    correctOptionId: 'B',
    explanation: 'Because strings are immutable, each `s += ch` operation creates a new string and copies all previous characters over (1 + 2 + 3 + ... + N = O(N^2) work). The recommended Pythonic idiom is appending to a list and calling `"".join(chars)` in O(N).',
  },

  // ==========================================
  // TOPIC T7: SUBSTRINGS & SLIDING WINDOW
  // ==========================================
  {
    id: 'mcq-t7-01',
    topicCode: 'T7',
    topicName: 'Substrings & Sliding Window',
    difficulty: 'Easy',
    question: 'For a string of length N, what is the total number of non-empty contiguous substrings?',
    options: [
      { id: 'A', text: '2^N' },
      { id: 'B', text: 'N * (N + 1) // 2' },
      { id: 'C', text: 'N^2' },
      { id: 'D', text: 'N!' }
    ],
    correctOptionId: 'B',
    explanation: 'A substring is defined by a start index `i` and end index `j` with 0 <= i <= j < N. There are N substrings of length 1, N-1 of length 2, ..., down to 1 of length N. The sum is N * (N + 1) // 2. Subsequences, by contrast, count 2^N.',
  },
  {
    id: 'mcq-t7-02',
    topicCode: 'T7',
    topicName: 'Substrings & Sliding Window',
    difficulty: 'Medium',
    question: 'What is the primary advantage of the Sliding Window technique over brute force nested loops for subarray/substring problems?',
    options: [
      { id: 'A', text: 'It reduces time complexity from O(N^2) or O(N*K) to O(N)' },
      { id: 'B', text: 'It sorts the input in O(1) time' },
      { id: 'C', text: 'It eliminates the need for any memory' },
      { id: 'D', text: 'It allows recursive backtracking' }
    ],
    correctOptionId: 'A',
    explanation: 'Sliding Window reuses the computation from the previous window by subtracting the exiting element and adding the entering element, avoiding redundant sum or frequency recalculations and reducing runtime to linear O(N).',
  },
  {
    id: 'mcq-t7-03',
    topicCode: 'T7',
    topicName: 'Substrings & Sliding Window',
    difficulty: 'Hard',
    question: 'In "Longest Substring Without Repeating Characters", when character `s[right]` is seen at index `last_seen[s[right]]`, how should the `left` window boundary move?',
    codeSnippet: `if s[right] in last_seen:
    left = ???
last_seen[s[right]] = right`,
    options: [
      { id: 'A', text: 'left = last_seen[s[right]] + 1' },
      { id: 'B', text: 'left = max(left, last_seen[s[right]] + 1)' },
      { id: 'C', text: 'left = right' },
      { id: 'D', text: 'left += 1' }
    ],
    correctOptionId: 'B',
    explanation: 'Using `max(left, last_seen[s[right]] + 1)` prevents the left pointer from erroneously jumping backwards if the duplicate character occurred before the current left boundary of the window.',
  },

  // ==========================================
  // TOPIC T8: DICTIONARIES & ANAGRAMS
  // ==========================================
  {
    id: 'mcq-t8-01',
    topicCode: 'T8',
    topicName: 'Dictionaries & Anagrams',
    difficulty: 'Easy',
    question: 'What is the average time complexity of key lookup in a Python dictionary (`dict`)?',
    options: [
      { id: 'A', text: 'O(N)' },
      { id: 'B', text: 'O(log N)' },
      { id: 'C', text: 'O(1)' },
      { id: 'D', text: 'O(N^2)' }
    ],
    correctOptionId: 'C',
    explanation: 'Python dictionaries are implemented as high-performance hash tables with compact contiguous array storage. Average lookup, insertion, and deletion run in O(1) amortized time.',
  },
  {
    id: 'mcq-t8-02',
    topicCode: 'T8',
    topicName: 'Dictionaries & Anagrams',
    difficulty: 'Medium',
    question: 'Which of the following can be used as a key in a Python dictionary?',
    options: [
      { id: 'A', text: '[1, 2, 3] (list)' },
      { id: 'B', text: '{1, 2, 3} (set)' },
      { id: 'C', text: '(1, 2, 3) (tuple of hashable items)' },
      { id: 'D', text: '{"a": 1} (dict)' }
    ],
    correctOptionId: 'C',
    explanation: 'Dictionary keys in Python must be hashable and immutable. Lists, sets, and dictionaries are mutable and unhashable, raising `TypeError: unhashable type`. A tuple containing immutable items is hashable and valid.',
  },
  {
    id: 'mcq-t8-03',
    topicCode: 'T8',
    topicName: 'Dictionaries & Anagrams',
    difficulty: 'Hard',
    question: 'When grouping anagrams, which key representation provides O(L) time per word of length L without sorting?',
    options: [
      { id: 'A', text: '"".join(sorted(word))' },
      { id: 'B', text: 'tuple of character frequencies: tuple(count[ch] for ch in alphabet)' },
      { id: 'C', text: 'len(word)' },
      { id: 'D', text: 'sum(ord(ch) for ch in word)' }
    ],
    correctOptionId: 'B',
    explanation: 'Sorting takes O(L log L) time per word. A 26-element tuple representing character frequency counts takes strictly O(L) time to compute and is hashable as a dictionary key, achieving optimal linear time.',
  },

  // ==========================================
  // TOPIC T9: MODULAR FUNCTIONS & STACKS
  // ==========================================
  {
    id: 'mcq-t9-01',
    topicCode: 'T9',
    topicName: 'Modular Functions & Stacks',
    difficulty: 'Easy',
    question: 'Which data structure principle defines a Stack, and what are Python\'s native list operations for it?',
    options: [
      { id: 'A', text: 'FIFO (First-In, First-Out) using .insert(0) and .pop()' },
      { id: 'B', text: 'LIFO (Last-In, First-Out) using .append() and .pop()' },
      { id: 'C', text: 'Priority based using .sort()' },
      { id: 'D', text: 'Round Robin using itertools.cycle' }
    ],
    correctOptionId: 'B',
    explanation: 'A Stack follows Last-In, First-Out (LIFO). Python\'s `list.append()` pushes an item onto the top in O(1) time, and `list.pop()` removes and returns the top item in O(1) time.',
  },
  {
    id: 'mcq-t9-02',
    topicCode: 'T9',
    topicName: 'Modular Functions & Stacks',
    difficulty: 'Medium',
    question: 'What is the danger of using a mutable default argument in a Python function?',
    codeSnippet: `def add_item(item, basket=[]):
    basket.append(item)
    return basket`,
    options: [
      { id: 'A', text: 'It causes a syntax error on compile' },
      { id: 'B', text: 'The default list is created only ONCE when the function is defined, so calls share and mutate the same list' },
      { id: 'C', text: 'The list is deleted from memory after the first return' },
      { id: 'D', text: 'Python converts basket into an immutable tuple' }
    ],
    correctOptionId: 'B',
    explanation: 'Default arguments in Python are evaluated once at module load/function definition time. Every invocation that omits `basket` shares the identical object in memory. The standard fix is `def add_item(item, basket=None): if basket is None: basket = []`.',
  },
  {
    id: 'mcq-t9-03',
    topicCode: 'T9',
    topicName: 'Modular Functions & Stacks',
    difficulty: 'Hard',
    question: 'In the Leaders in Array problem (an element is a leader if it is greater than all elements to its right), what is the optimal single-pass approach?',
    options: [
      { id: 'A', text: 'Sort the array in descending order' },
      { id: 'B', text: 'Traverse right-to-left while maintaining the maximum element seen so far' },
      { id: 'C', text: 'Traverse left-to-right using nested while loops' },
      { id: 'D', text: 'Use binary search for each index' }
    ],
    correctOptionId: 'B',
    explanation: 'Traversing from right to left allows checking the leader condition in O(1) by comparing with `max_from_right`. If `arr[i] > max_from_right`, it is a leader, and `max_from_right = arr[i]`. Total time is O(N) with O(1) extra space.',
  },

  // ==========================================
  // TOPIC T10: RECURSION & DIVIDE-AND-CONQUER
  // ==========================================
  {
    id: 'mcq-t10-01',
    topicCode: 'T10',
    topicName: 'Recursion & Divide-and-Conquer',
    difficulty: 'Easy',
    question: 'What error is raised in Python if a recursive function fails to hit a base case?',
    options: [
      { id: 'A', text: 'MemoryError' },
      { id: 'B', text: 'RecursionError: maximum recursion depth exceeded' },
      { id: 'C', text: 'OverflowError' },
      { id: 'D', text: 'SystemExit' }
    ],
    correctOptionId: 'B',
    explanation: 'Python maintains a call stack depth guard (default 1000 frames) to protect system memory. Exceeding it without hitting a base case triggers `RecursionError: maximum recursion depth exceeded`.',
  },
  {
    id: 'mcq-t10-02',
    topicCode: 'T10',
    topicName: 'Recursion & Divide-and-Conquer',
    difficulty: 'Medium',
    question: 'What is the time complexity of the naive recursive Fibonacci implementation without memoization?',
    codeSnippet: `def fib(n):
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)`,
    options: [
      { id: 'A', text: 'O(N)' },
      { id: 'B', text: 'O(N log N)' },
      { id: 'C', text: 'O(2^N)' },
      { id: 'D', text: 'O(N^2)' }
    ],
    correctOptionId: 'C',
    explanation: 'Each call to `fib(n)` branches into two recursive sub-calls `fib(n-1)` and `fib(n-2)`, forming a binary recursion tree of depth N. The number of nodes is roughly 2^N, leading to exponential O(2^N) time. Memoization or iteration reduces this to O(N).',
  },
  {
    id: 'mcq-t10-03',
    topicCode: 'T10',
    topicName: 'Recursion & Divide-and-Conquer',
    difficulty: 'Hard',
    question: 'What is the auxiliary call stack space complexity of Binary Search implemented recursively on an array of size N?',
    options: [
      { id: 'A', text: 'O(1)' },
      { id: 'B', text: 'O(log N)' },
      { id: 'C', text: 'O(N)' },
      { id: 'D', text: 'O(N log N)' }
    ],
    correctOptionId: 'B',
    explanation: 'At each step, binary search halves the search interval (N, N/2, N/4, ... 1). The maximum depth of the recursive call stack is log2(N), requiring O(log N) auxiliary space for stack frames. Iterative binary search achieves O(1) auxiliary space.',
  },

  // ==========================================
  // BONUS / MIXED DSA LOGIC BUILDERS
  // ==========================================
  {
    id: 'mcq-mixed-01',
    topicCode: 'T8',
    topicName: 'Hashing & Logic',
    difficulty: 'Medium',
    question: 'What does `dict.get(key, default)` return if `key` does NOT exist in the dictionary?',
    options: [
      { id: 'A', text: 'Raises a KeyError exception' },
      { id: 'B', text: 'Returns the specified default value without modifying the dictionary' },
      { id: 'C', text: 'Inserts key with default value into the dictionary' },
      { id: 'D', text: 'Returns False' }
    ],
    correctOptionId: 'B',
    explanation: 'Unlike `dict[key]` which raises `KeyError`, `.get(key, default)` gracefully returns `default` (or `None` if default is omitted) without raising an error and without modifying the dictionary.',
  },
  {
    id: 'mcq-mixed-02',
    topicCode: 'T2',
    topicName: 'Algorithms & Complexity',
    difficulty: 'Hard',
    question: 'Given an array of size N containing numbers from 1 to N with exactly one missing, which O(N) time and O(1) space method avoids integer overflow in systems with fixed 32-bit integers?',
    options: [
      { id: 'A', text: 'Sorting the array with QuickSort' },
      { id: 'B', text: 'XOR all numbers from 1 to N and all elements in the array' },
      { id: 'C', text: 'Creating a boolean presence array' },
      { id: 'D', text: 'Multiplying all numbers together' }
    ],
    correctOptionId: 'B',
    explanation: 'XORing has the properties `X ^ X = 0` and `X ^ 0 = X`. XORing all array elements with all integers from 1 to N cancels out all duplicates, leaving only the missing number, completely avoiding arithmetic overflow.',
  },
  {
    id: 'mcq-mixed-03',
    topicCode: 'T3',
    topicName: 'Two Pointers',
    difficulty: 'Medium',
    question: 'In "Valid Palindrome" ignoring non-alphanumeric characters, what is the best two-pointer movement?',
    options: [
      { id: 'A', text: 'Convert entire string with regex first, then reverse' },
      { id: 'B', text: 'Move left and right pointers inward, skipping non-alphanumeric characters using `.isalnum()`, and compare lowercase chars' },
      { id: 'C', text: 'Split into words and compare word lengths' },
      { id: 'D', text: 'Check string length and return True if even' }
    ],
    correctOptionId: 'B',
    explanation: 'Checking in-place with two pointers skipping `.isalnum()` takes O(N) time and O(1) extra space because no intermediate cleaned string copies are created.',
  }
];

export interface WheelSegmentConfig {
  id: string;
  label: string;
  topicCode: string;
  subLabel: string;
  color: string;
  textColor: string;
}

export const WHEEL_SEGMENTS: WheelSegmentConfig[] = [
  { id: 'seg-t1', label: 'T1: Patterns', topicCode: 'T1', subLabel: 'Coordinate Geometry', color: '#f59e0b', textColor: '#ffffff' },
  { id: 'seg-t2', label: 'T2: 1D Arrays', topicCode: 'T2', subLabel: 'In-Place Traversal', color: '#0ea5e9', textColor: '#ffffff' },
  { id: 'seg-t3', label: 'T3: Two Pointers', topicCode: 'T3', subLabel: 'Convergence Logic', color: '#10b981', textColor: '#ffffff' },
  { id: 'seg-t4', label: 'T4: 2D Matrices', topicCode: 'T4', subLabel: 'Rows & Transpose', color: '#8b5cf6', textColor: '#ffffff' },
  { id: 'seg-t5', label: 'T5: Matrix Spirals', topicCode: 'T5', subLabel: 'Clockwise & Rotations', color: '#ec4899', textColor: '#ffffff' },
  { id: 'seg-t6', label: 'T6: Strings', topicCode: 'T6', subLabel: 'ASCII & Casing', color: '#059669', textColor: '#ffffff' },
  { id: 'seg-t7', label: 'T7: Substrings', topicCode: 'T7', subLabel: 'Sliding Windows', color: '#d97706', textColor: '#ffffff' },
  { id: 'seg-t8', label: 'T8: Dictionaries', topicCode: 'T8', subLabel: 'Hashing & Anagrams', color: '#6366f1', textColor: '#ffffff' },
  { id: 'seg-t9', label: 'T9: Stacks & Leaders', topicCode: 'T9', subLabel: 'LIFO & Modularity', color: '#0284c7', textColor: '#ffffff' },
  { id: 'seg-t10', label: 'T10: Recursion', topicCode: 'T10', subLabel: 'Divide & Conquer', color: '#b45309', textColor: '#ffffff' },
  { id: 'seg-daily', label: '⚡ Daily Blitz', topicCode: 'DAILY', subLabel: 'Today\'s Special Pick', color: '#ea580c', textColor: '#ffffff' },
  { id: 'seg-mixed', label: '🌟 Mega DSA', topicCode: 'MIXED', subLabel: 'All Modules Mixed', color: '#0f172a', textColor: '#fbbf24' },
];

/**
 * Returns a deterministic daily challenge for any given calendar date.
 * Guarantees a new curated challenge every day!
 */
export function getDailyChallengeForDate(dateStr?: string): {
  date: string;
  dayIndex: number;
  topicCode: string;
  topicName: string;
  title: string;
  description: string;
  targetScore: number;
} {
  const d = dateStr ? new Date(dateStr) : new Date();
  const year = d.getFullYear();
  const start = new Date(year, 0, 0);
  const diff = d.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);

  const topicCodes = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'MIXED'];
  const topicNames: Record<string, string> = {
    T1: 'Pattern Programming & Coordinate Logic',
    T2: '1D Arrays & In-Place Mutability',
    T3: 'Two Pointers & Convergence Algorithms',
    T4: '2D Matrices & Transposition Techniques',
    T5: 'Matrix Rotations & Spiral State Machines',
    T6: 'Strings, Character Codes & Immutability',
    T7: 'Substrings & Sliding Window Optimizations',
    T8: 'Hash Maps, Dictionaries & Anagram Grouping',
    T9: 'Modular Architecture & Stack LIFO Invariants',
    T10: 'Recursion, Call Stacks & Divide-and-Conquer',
    MIXED: 'Comprehensive DSA Grandmaster Challenge'
  };

  const selectedCode = topicCodes[dayOfYear % topicCodes.length];
  const topicName = topicNames[selectedCode];
  const formattedDate = d.toISOString().slice(0, 10);

  const titles = [
    `Daily DSA Showdown #${dayOfYear}: ${topicName}`,
    `Morning Sprint #${dayOfYear}: Master ${selectedCode}`,
    `Kapil's Daily Logic Drill #${dayOfYear}: ${selectedCode}`,
    `Enterprise Placement Qualifier #${dayOfYear}`
  ];

  return {
    date: formattedDate,
    dayIndex: dayOfYear,
    topicCode: selectedCode,
    topicName,
    title: titles[dayOfYear % titles.length],
    description: `Complete today's official 10-question challenge on ${topicName}. Score 80% or higher to unlock today's verifiable Badge and official Certificate of Achievement!`,
    targetScore: 8 // 8 out of 10 = 80%
  };
}

/**
 * Samples 10 random MCQs for a given topicCode (or mixed if 'MIXED' or 'DAILY').
 */
export function getRandom10MCQs(topicCode: string): MCQQuestion[] {
  let pool: MCQQuestion[] = [];

  if (topicCode === 'MIXED' || topicCode === 'DAILY') {
    pool = [...MCQ_QUESTION_BANK];
  } else {
    pool = MCQ_QUESTION_BANK.filter(q => q.topicCode === topicCode);
    // If not enough questions in single topic, backfill from other topics so we always have 10
    if (pool.length < 10) {
      const rest = MCQ_QUESTION_BANK.filter(q => q.topicCode !== topicCode);
      pool = [...pool, ...rest];
    }
  }

  // Fisher-Yates shuffle
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, 10);
}
