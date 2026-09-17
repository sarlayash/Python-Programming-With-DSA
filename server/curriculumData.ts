import { DayCurriculum, Problem, Badge } from '../src/types';
import { DAY_PROGRAMS_AND_TIPS } from '../src/data/curriculumProgramsData';

const BASE_CURRICULUM: DayCurriculum[] = [
  {
    code: 'T1',
    dayNumber: 1,
    title: 'Pattern Programming',
    subtitle: 'Nested Loops & Spatial Logic',
    learningObjectives: [
      'Master 2D coordinate thinking using nested loops',
      'Understand symmetry, indentation, and ASCII formatting',
      'Optimize row-by-row character generation'
    ],
    notes: `# Day 1: Pattern Programming with Python

Pattern printing trains coordinate logic and mathematical bounds.
In Python, string repetition \`"*" * n\` and formatting \`print(..., end="")\` offer clean primitives.

### Core Patterns:
1. **Pyramids & Diamonds**: Break problem into upper halves and lower halves.
2. **Hollow Figures**: Test if current coordinate is on boundary: \`row == 0 or row == n-1 or col == 0 or col == m-1\`.
3. **Number Pyramids**: Manage internal counters or arithmetic progressions.`,
    interviewTips: [
      'Always clarify whether single space separation is expected between stars or digits.',
      'Explain space complexity: printing line-by-line is O(1) auxiliary space.'
    ],
    commonErrors: [
      {
        error: 'Trailing whitespace mismatch',
        fix: 'Use .rstrip() or carefully control spaces between characters.',
        explanation: 'Automated judges check exact character equality including ends of lines.'
      },
      {
        error: 'Off-by-one in range() upper bound',
        fix: 'Remember range(1, n+1) includes n, whereas range(n) ends at n-1.',
        explanation: 'A very common source of missing the last row or column.'
      }
    ],
    debuggingStrategies: [
      'Print coordinates (i, j) on each step to trace coordinate grids.',
      'Trace on paper with n=3 before coding arbitrary n.'
    ],
    practicalExamples: [
      {
        title: 'Hollow Square Boundary Condition',
        code: `def print_hollow_square(n):\n    for i in range(n):\n        if i == 0 or i == n - 1:\n            print("*" * n)\n        else:\n            print("*" + " " * (n - 2) + "*")`,
        explanation: 'Tests whether the row index is an edge.'
      }
    ],
    inClassProblemIds: ['p-56', 'p-57', 'p-58'],
    postClassProblemIds: ['p-59', 'p-60'],
    completionCriteria: { minSolved: 2, description: 'Solve at least 2 pattern problems to unlock Badge' },
    isPublished: true
  },
  {
    code: 'T2',
    dayNumber: 2,
    title: 'Arrays (1D)',
    subtitle: 'List Traversals, Searching & Insertions',
    learningObjectives: [
      'Understand contiguous memory representation and list index operations',
      'Perform single-pass frequency counting and linear scanning',
      'Handle edge cases like empty lists, single elements, and duplicates'
    ],
    notes: `# Day 2: 1D Arrays & Sequences
Lists in Python are dynamic arrays with amortized O(1) append.
Common algorithms include frequency maps, two pointers, and prefix sums.`,
    interviewTips: [
      'In Python, list slicing creates a copy: O(k) time and space.',
      'Use dict / Counter when looking for occurrences or frequencies.'
    ],
    commonErrors: [
      {
        error: 'Modifying a list while iterating over it',
        fix: 'Iterate over a copy list[:] or use list comprehension.',
        explanation: 'Mutating indices while looping skips elements.'
      }
    ],
    debuggingStrategies: ['Check zero-based indexing and negative index behavior.'],
    practicalExamples: [
      {
        title: 'Find Second Occurrence',
        code: `def second_occurrence(arr, target):\n    count = 0\n    for idx, val in enumerate(arr):\n        if val == target:\n            count += 1\n            if count == 2:\n                return idx\n    return -1`,
        explanation: 'Scans linearly and stops immediately on the 2nd match.'
      }
    ],
    inClassProblemIds: ['p-61', 'p-62', 'p-63', 'p-lc-two-sum', 'p-hr-birthday-candles', 'p-gfg-missing-number'],
    postClassProblemIds: ['p-64', 'p-65'],
    completionCriteria: { minSolved: 2, description: 'Complete 2 array problems' },
    isPublished: true
  },
  {
    code: 'T3',
    dayNumber: 3,
    title: 'Arrays 1D (Advanced)',
    subtitle: 'Two Pointers & Median Calculations',
    learningObjectives: [
      'Master two-pointer technique for in-place array transformations',
      'Calculate statistics like medians on filtered subsets',
      'Optimize time complexity from O(N^2) to O(N)'
    ],
    notes: `# Day 3: Advanced 1D Arrays
Two pointers allow reversing arrays in-place in O(N) time and O(1) space.`,
    interviewTips: [
      'When calculating median, always check if array length is even or odd.'
    ],
    commonErrors: [
      {
        error: 'Integer division vs float division',
        fix: 'Use // for floor index or format floats with round() when requested.',
        explanation: 'Python 3 / returns float.'
      }
    ],
    debuggingStrategies: ['Test with odd length, even length, and all-negative arrays.'],
    practicalExamples: [],
    inClassProblemIds: ['p-66', 'p-67', 'p-68', 'p-lc-container-water', 'p-gfg-kadane-max-subarray', 'p-hr-ice-cream-parlor'],
    postClassProblemIds: ['p-69', 'p-70', 'p-lc-trapping-rain', 'p-gfg-min-platforms', 'p-hr-array-manipulation'],
    completionCriteria: { minSolved: 2, description: 'Solve 2 problems' },
    isPublished: true
  },
  {
    code: 'T4',
    dayNumber: 4,
    title: 'Arrays (2D)',
    subtitle: 'Matrix Traversals & Snake Patterns',
    learningObjectives: [
      'Represent grids and matrices in row-major order',
      'Implement alternating snake pattern traversals',
      'Inspect row and column bounds without IndexError'
    ],
    notes: `# Day 4: 2D Matrices
Matrix traversal is foundational for graph BFS/DFS and dynamic programming.`,
    interviewTips: ['Be ready to discuss row-major vs column-major cache locality.'],
    commonErrors: [
      {
        error: 'Creating 2D list with [[0]*m]*n shallow copies',
        fix: 'Use [[0 for _ in range(m)] for _ in range(n)].',
        explanation: 'Multiplying lists creates duplicate references to the same row.'
      }
    ],
    debuggingStrategies: ['Print matrices in grid format with tab separation.'],
    practicalExamples: [],
    inClassProblemIds: ['p-71', 'p-72', 'p-73'],
    postClassProblemIds: ['p-74', 'p-75'],
    completionCriteria: { minSolved: 2, description: 'Solve 2 matrix problems' },
    isPublished: true
  },
  {
    code: 'T5',
    dayNumber: 5,
    title: 'Arrays 2D (Advanced)',
    subtitle: 'Matrix Transformations & Diagonal Math',
    learningObjectives: [
      'Calculate main and anti-diagonals',
      'In-place matrix rotation and reflections',
      'Grid sum aggregations'
    ],
    notes: `# Day 5: 2D Advanced Transformations
Rotate 90 degrees clockwise: Transpose matrix then reverse each row.`,
    interviewTips: ['Discuss auxiliary memory overhead when transposing in-place.'],
    commonErrors: [],
    debuggingStrategies: [],
    practicalExamples: [],
    inClassProblemIds: ['p-76', 'p-77', 'p-78'],
    postClassProblemIds: ['p-79', 'p-80'],
    completionCriteria: { minSolved: 2, description: 'Solve 2 problems' },
    isPublished: true
  },
  {
    code: 'T6',
    dayNumber: 6,
    title: 'Strings',
    subtitle: 'Character Frequencies & Encoding',
    learningObjectives: [
      'Manipulate immutable string objects',
      'Count upper/lower case characters and custom alphabets',
      'Build encoded representations in O(N)'
    ],
    notes: `# Day 6: String Fundamentals
Strings in Python are immutable sequences of Unicode codepoints.`,
    interviewTips: ['Building strings via += in a loop is O(N^2); use "".join(list) for O(N).'],
    commonErrors: [],
    debuggingStrategies: [],
    practicalExamples: [],
    inClassProblemIds: ['p-81', 'p-82', 'p-83'],
    postClassProblemIds: ['p-81-2', 'p-82-2'],
    completionCriteria: { minSolved: 2, description: 'Solve 2 problems' },
    isPublished: true
  },
  {
    code: 'T7',
    dayNumber: 7,
    title: 'Strings (Advanced)',
    subtitle: 'Sentence Parsing & Validation',
    learningObjectives: [
      'Split, strip, and parse sentences with irregular whitespace',
      'Validate seat allocations and character constraints',
      'Track frequency thresholds across large texts'
    ],
    notes: `# Day 7: Advanced String Parsing`,
    interviewTips: ['Check punctuation handling and case insensitivity.'],
    commonErrors: [],
    debuggingStrategies: [],
    practicalExamples: [],
    inClassProblemIds: ['p-84', 'p-85', 'p-86'],
    postClassProblemIds: ['p-83-2', 'p-84-2'],
    completionCriteria: { minSolved: 2, description: 'Solve 2 problems' },
    isPublished: true
  },
  {
    code: 'T8',
    dayNumber: 8,
    title: 'Strings (Algorithms)',
    subtitle: 'Compression & Ciphers',
    learningObjectives: [
      'Implement Run-Length Encoding (RLE)',
      'Apply modular arithmetic in Caesar Ciphers',
      'Check anagrams and permuted access codes'
    ],
    notes: `# Day 8: String Algorithms & Ciphers`,
    interviewTips: ['Handle both uppercase and lowercase shift wrap-arounds cleanly.'],
    commonErrors: [],
    debuggingStrategies: [],
    practicalExamples: [],
    inClassProblemIds: ['p-87', 'p-88', 'p-89'],
    postClassProblemIds: ['p-85-2', 'p-86-2'],
    completionCriteria: { minSolved: 2, description: 'Solve 2 problems' },
    isPublished: true
  },
  {
    code: 'T9',
    dayNumber: 9,
    title: 'Functions',
    subtitle: 'Modularity, Scope & Algorithmic Logic',
    learningObjectives: [
      'Design pure functions with clear inputs and outputs',
      'Implement Leaders in an Array in single pass O(N)',
      'Validate passwords with regex and functional criteria'
    ],
    notes: `# Day 9: Functions & Functional Decomposition`,
    interviewTips: ['Keep functions side-effect free whenever possible.'],
    commonErrors: [],
    debuggingStrategies: [],
    practicalExamples: [],
    inClassProblemIds: ['p-91', 'p-92', 'p-93'],
    postClassProblemIds: ['p-94', 'p-95', 'p-96'],
    completionCriteria: { minSolved: 2, description: 'Solve 2 problems' },
    isPublished: true
  },
  {
    code: 'T10',
    dayNumber: 10,
    title: 'Recursion',
    subtitle: 'Base Cases, Call Stacks & Divide & Conquer',
    learningObjectives: [
      'Identify base case vs recursive step',
      'Compute Euclidean GCD and bit manipulations recursively',
      'Analyze stack frame consumption and recursion limits'
    ],
    notes: `# Day 10: Recursion & Mathematical Foundations`,
    interviewTips: ['Always state the base case first when explaining recursion to an interviewer.'],
    commonErrors: [
      {
        error: 'RecursionError: maximum recursion depth exceeded',
        fix: 'Ensure base case is reached for all valid inputs.',
        explanation: 'Missing or unreachable base case causes stack overflow.'
      }
    ],
    debuggingStrategies: ['Add print indentation that scales with depth.'],
    practicalExamples: [],
    inClassProblemIds: ['p-101', 'p-102', 'p-103'],
    postClassProblemIds: ['p-104', 'p-105', 'p-106'],
    completionCriteria: { minSolved: 2, description: 'Solve 2 problems to finish the course' },
    isPublished: true
  }
];

export const INITIAL_CURRICULUM: DayCurriculum[] = BASE_CURRICULUM.map(day => ({
  ...day,
  basicPrograms: DAY_PROGRAMS_AND_TIPS[day.code]?.basicPrograms || [],
  tipsAndTricks: DAY_PROGRAMS_AND_TIPS[day.code]?.tipsAndTricks || []
}));

export const INITIAL_PROBLEMS: Problem[] = [
  // --- T1 Pattern Programming ---
  {
    id: 'p-56',
    topicCode: 'T1',
    questionNumber: 56,
    title: 'Designing a Diamond Pattern of Lights',
    type: 'inclass',
    difficulty: 'Medium',
    statement: 'A festival lighting designer needs to arrange LED lights in a diamond shape of size N (where N represents the number of rows in the upper half including the center line). Write a program that takes an integer N and prints a diamond of asterisks (*).',
    inputFormat: 'A single integer N (1 <= N <= 20).',
    outputFormat: 'Print 2*N - 1 lines forming the diamond pattern.',
    constraints: ['1 <= N <= 20'],
    examples: [
      {
        input: '3',
        output: '  *\n ***\n*****\n ***\n  *',
        explanation: 'N=3 yields 5 total rows. Top row has 2 spaces and 1 star, center has 5 stars.'
      }
    ],
    starterCode: `def print_diamond(n: int):\n    # TODO: Print the diamond pattern of size n\n    pass\n\nif __name__ == '__main__':\n    import sys\n    val = int(sys.stdin.read().strip())\n    print_diamond(val)`,
    hints: [
      'Think of the diamond in two parts: upper half (rows 1 to n) and lower half (rows n-1 down to 1).',
      'For row i (1 to n), the number of leading spaces is (n - i) and stars is (2 * i - 1).'
    ],
    fullSolution: `def print_diamond(n: int):\n    for i in range(1, n + 1):\n        print(' ' * (n - i) + '*' * (2 * i - 1))\n    for i in range(n - 1, 0, -1):\n        print(' ' * (n - i) + '*' * (2 * i - 1))\n\nif __name__ == '__main__':\n    import sys\n    s = sys.stdin.read().strip()\n    if s:\n        print_diamond(int(s))`,
    explanation: 'Upper pyramid prints rows 1..n with (n-i) spaces followed by (2*i-1) stars. The lower inverted pyramid runs i from n-1 down to 1 with identical formula.',
    timeComplexity: 'O(N^2)',
    spaceComplexity: 'O(1) auxiliary space',
    learningTakeaway: 'Symmetric shapes can always be cleanly decomposed into mirroring ranges.',
    testCases: [
      { input: '3', expectedOutput: '  *\n ***\n*****\n ***\n  *', isHidden: false },
      { input: '1', expectedOutput: '*', isHidden: false },
      { input: '4', expectedOutput: '   *\n  ***\n *****\n*******\n *****\n  ***\n   *', isHidden: true },
      { input: '2', expectedOutput: ' *\n***\n *', isHidden: true }
    ]
  },
  {
    id: 'p-57',
    topicCode: 'T1',
    questionNumber: 57,
    title: 'Designing an Artistic Hourglass Sand Timer Display',
    type: 'inclass',
    difficulty: 'Medium',
    statement: 'A decorative digital display needs an hourglass sand timer representation of size N. Print an inverted pyramid followed by an upright pyramid with total 2*N - 1 lines.',
    inputFormat: 'Integer N (1 <= N <= 15).',
    outputFormat: 'Print the hourglass pattern with stars.',
    constraints: ['1 <= N <= 15'],
    examples: [
      {
        input: '3',
        output: '*****\n ***\n  *\n ***\n*****',
        explanation: 'Top line has 5 stars, middle has 1, bottom has 5.'
      }
    ],
    starterCode: `def print_hourglass(n: int):\n    # Write logic here\n    pass\n\nif __name__ == '__main__':\n    import sys\n    s = sys.stdin.read().strip()\n    if s:\n        print_hourglass(int(s))`,
    hints: [
      'Start with an inverted pyramid where i goes from n down to 1.',
      'Then print the lower pyramid where i goes from 2 up to n.'
    ],
    fullSolution: `def print_hourglass(n: int):\n    for i in range(n, 0, -1):\n        print(' ' * (n - i) + '*' * (2 * i - 1))\n    for i in range(2, n + 1):\n        print(' ' * (n - i) + '*' * (2 * i - 1))\n\nif __name__ == '__main__':\n    import sys\n    s = sys.stdin.read().strip()\n    if s:\n        print_hourglass(int(s))`,
    explanation: 'First loop prints decreasing widths from n down to 1, second loop starts from 2 up to n to avoid duplicating the single center star.',
    timeComplexity: 'O(N^2)',
    spaceComplexity: 'O(1)',
    learningTakeaway: 'Avoid duplicating the center nexus row by adjusting loop boundary from 2 to N.',
    testCases: [
      { input: '3', expectedOutput: '*****\n ***\n  *\n ***\n*****', isHidden: false },
      { input: '2', expectedOutput: '***\n *\n***', isHidden: false },
      { input: '1', expectedOutput: '*', isHidden: true }
    ]
  },
  {
    id: 'p-58',
    topicCode: 'T1',
    questionNumber: 58,
    title: 'Designing a Hollow Square Frame for an Art Exhibit',
    type: 'inclass',
    difficulty: 'Easy',
    statement: 'Print a hollow square frame of dimension N with asterisks on the border and spaces inside.',
    inputFormat: 'A single integer N (1 <= N <= 25).',
    outputFormat: 'N lines of N characters each.',
    constraints: ['1 <= N <= 25'],
    examples: [
      {
        input: '4',
        output: '****\n*  *\n*  *\n****',
        explanation: 'A 4x4 square with border stars and 2 hollow internal spaces.'
      }
    ],
    starterCode: `def print_hollow_square(n: int):\n    # Your solution here\n    pass\n\nif __name__ == '__main__':\n    import sys\n    s = sys.stdin.read().strip()\n    if s:\n        print_hollow_square(int(s))`,
    hints: [
      'Check if current row is first (0) or last (n-1). If so, print all stars.',
      'Otherwise, print a star, (n-2) spaces, and another star.'
    ],
    fullSolution: `def print_hollow_square(n: int):\n    if n == 1:\n        print('*')\n        return\n    for i in range(n):\n        if i == 0 or i == n - 1:\n            print('*' * n)\n        else:\n            print('*' + ' ' * (n - 2) + '*')\n\nif __name__ == '__main__':\n    import sys\n    s = sys.stdin.read().strip()\n    if s:\n        print_hollow_square(int(s))`,
    explanation: 'Special-case n=1 to avoid negative space repetition; otherwise first and last row are solid stars.',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    learningTakeaway: 'Always verify edge cases where N=1.',
    testCases: [
      { input: '4', expectedOutput: '****\n*  *\n*  *\n****', isHidden: false },
      { input: '1', expectedOutput: '*', isHidden: false },
      { input: '3', expectedOutput: '***\n* *\n***', isHidden: true }
    ]
  },
  {
    id: 'p-59',
    topicCode: 'T1',
    questionNumber: 59,
    title: 'Number Pyramid Pattern with Increasing Digits',
    type: 'postclass',
    difficulty: 'Medium',
    statement: 'Construct a number pyramid of height N where row i (1-indexed) contains digits 1 through i.',
    inputFormat: 'Integer N (1 <= N <= 9).',
    outputFormat: 'N lines of space-separated digits in pyramid alignment.',
    constraints: ['1 <= N <= 9'],
    examples: [
      {
        input: '3',
        output: '  1\n 1 2\n1 2 3',
        explanation: 'Leading spaces center the increasing sequence.'
      }
    ],
    starterCode: `def number_pyramid(n: int):\n    # TODO\n    pass\n\nif __name__ == '__main__':\n    import sys\n    s = sys.stdin.read().strip()\n    if s:\n        number_pyramid(int(s))`,
    hints: ['Row i has (n - i) leading spaces and numbers from 1 to i joined by spaces.'],
    fullSolution: `def number_pyramid(n: int):\n    for i in range(1, n + 1):\n        spaces = ' ' * (n - i)\n        nums = ' '.join(str(x) for x in range(1, i + 1))\n        print(spaces + nums)\n\nif __name__ == '__main__':\n    import sys\n    s = sys.stdin.read().strip()\n    if s:\n        number_pyramid(int(s))`,
    explanation: 'Use python string join on generator comprehension to insert spaces cleanly between numbers.',
    timeComplexity: 'O(N^2)',
    spaceComplexity: 'O(N)',
    learningTakeaway: 'str.join avoids trailing spaces cleanly.',
    testCases: [
      { input: '3', expectedOutput: '  1\n 1 2\n1 2 3', isHidden: false },
      { input: '1', expectedOutput: '1', isHidden: false }
    ]
  },
  {
    id: 'p-60',
    topicCode: 'T1',
    questionNumber: 60,
    title: 'Decremental Pyramid Pattern',
    type: 'postclass',
    difficulty: 'Easy',
    statement: 'Given integer N, print a right-aligned triangle where each row starts at N and decrements.',
    inputFormat: 'Integer N.',
    outputFormat: 'N lines.',
    constraints: ['1 <= N <= 10'],
    examples: [
      {
        input: '3',
        output: '3\n3 2\n3 2 1',
        explanation: 'Row 1: 3, Row 2: 3 2, Row 3: 3 2 1'
      }
    ],
    starterCode: `def decremental_pyramid(n: int):\n    pass\n\nif __name__ == '__main__':\n    import sys\n    s = sys.stdin.read().strip()\n    if s:\n        decremental_pyramid(int(s))`,
    hints: ['For row i (from 1 to n), generate numbers from n down to n - i + 1.'],
    fullSolution: `def decremental_pyramid(n: int):\n    for i in range(1, n + 1):\n        print(' '.join(str(n - j) for j in range(i)))\n\nif __name__ == '__main__':\n    import sys\n    s = sys.stdin.read().strip()\n    if s:\n        decremental_pyramid(int(s))`,
    explanation: 'Generates i numbers starting from n decreasing by 1.',
    timeComplexity: 'O(N^2)',
    spaceComplexity: 'O(N)',
    learningTakeaway: 'Nested arithmetic sequences form the basis of tabular indices.',
    testCases: [
      { input: '3', expectedOutput: '3\n3 2\n3 2 1', isHidden: false },
      { input: '2', expectedOutput: '2\n2 1', isHidden: false }
    ]
  },

  // --- T2 Arrays (1D) ---
  {
    id: 'p-61',
    topicCode: 'T2',
    questionNumber: 61,
    title: 'Insertion of New Product IDs',
    type: 'inclass',
    difficulty: 'Easy',
    statement: 'A warehouse system receives a list of sorted product IDs and a new ID. Insert the new ID at the correct position so the list remains sorted, and print the resulting space-separated list.',
    inputFormat: 'Line 1: Space-separated integers (current IDs)\\nLine 2: New integer ID',
    outputFormat: 'Space-separated integers.',
    constraints: ['1 <= len(IDs) <= 1000', '-10^5 <= ID <= 10^5'],
    examples: [
      {
        input: '10 20 30 50\n40',
        output: '10 20 30 40 50',
        explanation: '40 is inserted between 30 and 50.'
      }
    ],
    starterCode: `def insert_product(ids: list, new_id: int):\n    # TODO\n    pass\n\nif __name__ == '__main__':\n    import sys\n    lines = sys.stdin.read().strip().split('\\n')\n    if len(lines) >= 2:\n        arr = list(map(int, lines[0].split()))\n        val = int(lines[1].strip())\n        res = insert_product(arr, val)\n        print(' '.join(map(str, res)))`,
    hints: ['You can iterate and find the first element > new_id, or use bisect.', 'In Python, arr.append(new_id) followed by arr.sort() is O(N log N), but bisect_left is O(log N) search.'],
    fullSolution: `import bisect\n\ndef insert_product(ids: list, new_id: int):\n    pos = bisect.bisect_left(ids, new_id)\n    ids.insert(pos, new_id)\n    return ids\n\nif __name__ == '__main__':\n    import sys\n    lines = [l.strip() for l in sys.stdin.read().strip().split('\\n') if l.strip()]\n    if len(lines) >= 2:\n        arr = list(map(int, lines[0].split()))\n        val = int(lines[1])\n        print(' '.join(map(str, insert_product(arr, val))))`,
    explanation: 'Uses binary search to find insertion point and inserts into array.',
    timeComplexity: 'O(N) due to array shifting',
    spaceComplexity: 'O(1)',
    learningTakeaway: 'Binary search finds index in O(log N) while shifting elements requires O(N).',
    testCases: [
      { input: '10 20 30 50\n40', expectedOutput: '10 20 30 40 50', isHidden: false },
      { input: '1 2 3\n0', expectedOutput: '0 1 2 3', isHidden: false },
      { input: '5 15\n25', expectedOutput: '5 15 25', isHidden: true }
    ]
  },
  {
    id: 'p-62',
    topicCode: 'T2',
    questionNumber: 62,
    title: 'Second Occurrence',
    type: 'inclass',
    difficulty: 'Easy',
    statement: 'Given an array of integers and a target integer K, return the 0-based index of the 2nd occurrence of K in the array. If K occurs fewer than 2 times, output -1.',
    inputFormat: 'Line 1: Space-separated integers\\nLine 2: Target integer K',
    outputFormat: 'A single integer index, or -1.',
    constraints: ['1 <= len(arr) <= 10^5'],
    examples: [
      {
        input: '1 4 2 4 5\n4',
        output: '3',
        explanation: '4 appears at index 1 and index 3. Second occurrence is at index 3.'
      }
    ],
    starterCode: `def find_second_occurrence(arr: list, k: int) -> int:\n    pass\n\nif __name__ == '__main__':\n    import sys\n    lines = [l.strip() for l in sys.stdin.read().split('\\n') if l.strip()]\n    if len(lines) >= 2:\n        arr = list(map(int, lines[0].split()))\n        k = int(lines[1])\n        print(find_second_occurrence(arr, k))`,
    hints: ['Maintain a counter variable of matches.', 'Return the index the moment counter equals 2.'],
    fullSolution: `def find_second_occurrence(arr: list, k: int) -> int:\n    found = 0\n    for idx, num in enumerate(arr):\n        if num == k:\n            found += 1\n            if found == 2:\n                return idx\n    return -1\n\nif __name__ == '__main__':\n    import sys\n    lines = [l.strip() for l in sys.stdin.read().split('\\n') if l.strip()]\n    if len(lines) >= 2:\n        arr = list(map(int, lines[0].split()))\n        k = int(lines[1])\n        print(find_second_occurrence(arr, k))`,
    explanation: 'Linear scan counting occurrences; terminates as soon as second match is found.',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    learningTakeaway: 'Early exits optimize average-case runtime.',
    testCases: [
      { input: '1 4 2 4 5\n4', expectedOutput: '3', isHidden: false },
      { input: '1 2 3\n5', expectedOutput: '-1', isHidden: false },
      { input: '4 4 4\n4', expectedOutput: '1', isHidden: true }
    ]
  },
  {
    id: 'p-63',
    topicCode: 'T2',
    questionNumber: 63,
    title: 'Dinner Dishes',
    type: 'inclass',
    difficulty: 'Medium',
    statement: 'A kitchen has a stack of dishes with heights given in an array. A dish is considered "unobstructed" if all dishes to its right have strictly smaller heights. Find and print the heights of all unobstructed dishes from left to right.',
    inputFormat: 'Space-separated integers.',
    outputFormat: 'Space-separated integers.',
    constraints: ['1 <= len(arr) <= 10^5'],
    examples: [
      {
        input: '16 17 4 3 5 2',
        output: '17 5 2',
        explanation: '17 > all to its right. 5 > 2. 2 is the rightmost so unobstructed.'
      }
    ],
    starterCode: `def unobstructed_dishes(arr: list):\n    pass\n\nif __name__ == '__main__':\n    import sys\n    s = sys.stdin.read().strip()\n    if s:\n        arr = list(map(int, s.split()))\n        print(' '.join(map(str, unobstructed_dishes(arr))))`,
    hints: ['Traversing from right to left while keeping track of the running maximum takes O(N) time.', 'Remember to reverse the collected leaders back to left-to-right order.'],
    fullSolution: `def unobstructed_dishes(arr: list):\n    if not arr:\n        return []\n    res = []\n    max_right = float('-inf')\n    for x in reversed(arr):\n        if x > max_right:\n            res.append(x)\n            max_right = x\n    res.reverse()\n    return res\n\nif __name__ == '__main__':\n    import sys\n    s = sys.stdin.read().strip()\n    if s:\n        arr = list(map(int, s.split()))\n        print(' '.join(map(str, unobstructed_dishes(arr))))`,
    explanation: 'Reverse linear scan tracking current maximum is standard Leaders algorithm.',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(N)',
    learningTakeaway: 'Right-to-left traversal transforms O(N^2) checks into an O(N) pass.',
    testCases: [
      { input: '16 17 4 3 5 2', expectedOutput: '17 5 2', isHidden: false },
      { input: '1 2 3 4', expectedOutput: '4', isHidden: false },
      { input: '4 3 2 1', expectedOutput: '4 3 2 1', isHidden: true }
    ]
  },
  {
    id: 'p-64',
    topicCode: 'T2',
    questionNumber: 64,
    title: "Nick's check",
    type: 'postclass',
    difficulty: 'Easy',
    statement: 'Nick wants to check if an array is strictly non-decreasing. Return "YES" if every element is >= the previous element, otherwise "NO".',
    inputFormat: 'Space-separated integers.',
    outputFormat: '"YES" or "NO"',
    constraints: ['1 <= len(arr) <= 10^5'],
    examples: [
      { input: '1 2 2 4', output: 'YES', explanation: 'Sorted non-decreasingly.' },
      { input: '1 3 2', output: 'NO', explanation: '3 > 2 breaks condition.' }
    ],
    starterCode: `def is_non_decreasing(arr: list) -> str:\n    pass\n\nif __name__ == '__main__':\n    import sys\n    s = sys.stdin.read().strip()\n    if s:\n        print(is_non_decreasing(list(map(int, s.split()))))`,
    hints: ['Check if arr[i] > arr[i+1] for any i.'],
    fullSolution: `def is_non_decreasing(arr: list) -> str:\n    for i in range(len(arr) - 1):\n        if arr[i] > arr[i + 1]:\n            return 'NO'\n    return 'YES'\n\nif __name__ == '__main__':\n    import sys\n    s = sys.stdin.read().strip()\n    if s:\n        print(is_non_decreasing(list(map(int, s.split()))))`,
    explanation: 'Simple pairwise verification.',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    learningTakeaway: 'Early termination on first invariant violation.',
    testCases: [
      { input: '1 2 2 4', expectedOutput: 'YES', isHidden: false },
      { input: '1 3 2', expectedOutput: 'NO', isHidden: false }
    ]
  },
  {
    id: 'p-65',
    topicCode: 'T2',
    questionNumber: 65,
    title: 'The lost Digit',
    type: 'postclass',
    difficulty: 'Easy',
    statement: 'Given an array containing N distinct numbers taken from 0, 1, 2, ..., N, find the one number that is missing.',
    inputFormat: 'Space-separated integers.',
    outputFormat: 'The missing integer.',
    constraints: ['0 <= N <= 10^5'],
    examples: [
      { input: '3 0 1', output: '2', explanation: 'N=3. Missing number from 0..3 is 2.' }
    ],
    starterCode: `def find_lost_digit(arr: list) -> int:\n    pass\n\nif __name__ == '__main__':\n    import sys\n    s = sys.stdin.read().strip()\n    if s:\n        print(find_lost_digit(list(map(int, s.split()))))`,
    hints: ['Sum of numbers from 0 to N is N*(N+1)//2. Subtract sum of array.'],
    fullSolution: `def find_lost_digit(arr: list) -> int:\n    n = len(arr)\n    expected_sum = n * (n + 1) // 2\n    return expected_sum - sum(arr)\n\nif __name__ == '__main__':\n    import sys\n    s = sys.stdin.read().strip()\n    if s:\n        print(find_lost_digit(list(map(int, s.split()))))`,
    explanation: "Gauss's summation formula gives O(N) time and O(1) space without extra sets.",
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    learningTakeaway: 'Arithmetic series summation eliminates the need for hash sets.',
    testCases: [
      { input: '3 0 1', expectedOutput: '2', isHidden: false },
      { input: '0 1', expectedOutput: '2', isHidden: false }
    ]
  },

  // --- T3 Arrays 1D ---
  {
    id: 'p-66',
    topicCode: 'T3',
    questionNumber: 66,
    title: "Alice's Magical shoes",
    type: 'inclass',
    difficulty: 'Medium',
    statement: "Alice has shoes that allow her to jump across stepping stones. She can jump between stones i and j if abs(stone[i] - stone[j]) <= K. Given stones heights and K, count how many valid pairs (i, j) exist with i < j.",
    inputFormat: 'Line 1: Space-separated stone heights\\nLine 2: Integer K',
    outputFormat: 'Total valid pairs.',
    constraints: ['1 <= len(stones) <= 1000'],
    examples: [
      { input: '1 3 5 2\n2', output: '4', explanation: 'Pairs: (1,3), (1,2), (3,5), (3,2).' }
    ],
    starterCode: `def magical_pairs(stones: list, k: int) -> int:\n    pass\n\nif __name__ == '__main__':\n    import sys\n    lines = [l.strip() for l in sys.stdin.read().split('\\n') if l.strip()]\n    if len(lines) >= 2:\n        stones = list(map(int, lines[0].split()))\n        k = int(lines[1])\n        print(magical_pairs(stones, k))`,
    hints: ['Check each pair (i, j) with i < j and see if abs(diff) <= k.'],
    fullSolution: `def magical_pairs(stones: list, k: int) -> int:\n    count = 0\n    n = len(stones)\n    for i in range(n):\n        for j in range(i + 1, n):\n            if abs(stones[i] - stones[j]) <= k:\n                count += 1\n    return count\n\nif __name__ == '__main__':\n    import sys\n    lines = [l.strip() for l in sys.stdin.read().split('\\n') if l.strip()]\n    if len(lines) >= 2:\n        print(magical_pairs(list(map(int, lines[0].split())), int(lines[1])))`,
    explanation: 'Pairwise difference comparison.',
    timeComplexity: 'O(N^2)',
    spaceComplexity: 'O(1)',
    learningTakeaway: 'Understand brute-force pair generation as baseline.',
    testCases: [
      { input: '1 3 5 2\n2', expectedOutput: '4', isHidden: false },
      { input: '10 20\n5', expectedOutput: '0', isHidden: false }
    ]
  },
  {
    id: 'p-67',
    topicCode: 'T3',
    questionNumber: 67,
    title: 'Data Recovery - Reversing the Sensor Log',
    type: 'inclass',
    difficulty: 'Easy',
    statement: 'A deep-sea sensor logged measurements in reverse order due to a buffer glitch. Reverse the list in-place and output the restored readings.',
    inputFormat: 'Space-separated integers.',
    outputFormat: 'Space-separated integers in reversed order.',
    constraints: ['1 <= len(arr) <= 10^5'],
    examples: [
      { input: '10 20 30 40', output: '40 30 20 10', explanation: 'List inverted.' }
    ],
    starterCode: `def reverse_sensor_log(arr: list) -> list:\n    # Reverse in-place\n    pass\n\nif __name__ == '__main__':\n    import sys\n    s = sys.stdin.read().strip()\n    if s:\n        print(' '.join(map(str, reverse_sensor_log(list(map(int, s.split()))))))`,
    hints: ['Use two pointers left=0 and right=len(arr)-1 and swap until left >= right.'],
    fullSolution: `def reverse_sensor_log(arr: list) -> list:\n    left, right = 0, len(arr) - 1\n    while left < right:\n        arr[left], arr[right] = arr[right], arr[left]\n        left += 1\n        right -= 1\n    return arr\n\nif __name__ == '__main__':\n    import sys\n    s = sys.stdin.read().strip()\n    if s:\n        print(' '.join(map(str, reverse_sensor_log(list(map(int, s.split()))))))`,
    explanation: 'Classic two-pointer swap achieving O(N) time and O(1) auxiliary space.',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    learningTakeaway: 'Two-pointer approach modifies memory in-place without memory allocation.',
    testCases: [
      { input: '10 20 30 40', expectedOutput: '40 30 20 10', isHidden: false },
      { input: '5', expectedOutput: '5', isHidden: false }
    ]
  },
  {
    id: 'p-68',
    topicCode: 'T3',
    questionNumber: 68,
    title: 'Playing with Numbers',
    type: 'inclass',
    difficulty: 'Easy',
    statement: 'Given an array of integers, segregate all even integers to the front and odd integers to the back while maintaining their relative order.',
    inputFormat: 'Space-separated integers.',
    outputFormat: 'Space-separated integers.',
    constraints: ['1 <= len(arr) <= 10^4'],
    examples: [
      { input: '1 2 3 4 5 6', output: '2 4 6 1 3 5', explanation: 'Evens: 2, 4, 6. Odds: 1, 3, 5.' }
    ],
    starterCode: `def segregate_even_odd(arr: list) -> list:\n    pass\n\nif __name__ == '__main__':\n    import sys\n    s = sys.stdin.read().strip()\n    if s:\n        print(' '.join(map(str, segregate_even_odd(list(map(int, s.split()))))))`,
    hints: ['Collect evens in one list and odds in another, then concatenate.'],
    fullSolution: `def segregate_even_odd(arr: list) -> list:\n    evens = [x for x in arr if x % 2 == 0]\n    odds = [x for x in arr if x % 2 != 0]\n    return evens + odds\n\nif __name__ == '__main__':\n    import sys\n    s = sys.stdin.read().strip()\n    if s:\n        print(' '.join(map(str, segregate_even_odd(list(map(int, s.split()))))))`,
    explanation: 'Stable segregation via two linear filters.',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(N)',
    learningTakeaway: 'List comprehensions provide clear and expressive partitioning.',
    testCases: [
      { input: '1 2 3 4 5 6', expectedOutput: '2 4 6 1 3 5', isHidden: false },
      { input: '2 4', expectedOutput: '2 4', isHidden: false }
    ]
  },
  {
    id: 'p-69',
    topicCode: 'T3',
    questionNumber: 69,
    title: 'Unsold Products',
    type: 'postclass',
    difficulty: 'Easy',
    statement: 'A store has a list of manufactured product IDs and another list of sold product IDs. Print the sorted list of unsold product IDs.',
    inputFormat: 'Line 1: Space-separated manufactured IDs\\nLine 2: Space-separated sold IDs',
    outputFormat: 'Space-separated sorted unsold IDs.',
    constraints: ['1 <= len(IDs) <= 10^4'],
    examples: [
      { input: '101 102 103 104\n102 104', output: '101 103', explanation: '101 and 103 remain unsold.' }
    ],
    starterCode: `def unsold_products(manufactured: list, sold: list) -> list:\n    pass\n\nif __name__ == '__main__':\n    import sys\n    lines = [l.strip() for l in sys.stdin.read().split('\\n') if l.strip()]\n    if len(lines) >= 2:\n        m = list(map(int, lines[0].split()))\n        s = list(map(int, lines[1].split()))\n        print(' '.join(map(str, unsold_products(m, s))))`,
    hints: ['Use set subtraction: set(manufactured) - set(sold).'],
    fullSolution: `def unsold_products(manufactured: list, sold: list) -> list:\n    sold_set = set(sold)\n    unsold = [x for x in manufactured if x not in sold_set]\n    return sorted(unsold)\n\nif __name__ == '__main__':\n    import sys\n    lines = [l.strip() for l in sys.stdin.read().split('\\n') if l.strip()]\n    if len(lines) >= 2:\n        m = list(map(int, lines[0].split()))\n        s = list(map(int, lines[1].split()))\n        print(' '.join(map(str, unsold_products(m, s))))`,
    explanation: 'Set lookup in O(1) followed by sorting.',
    timeComplexity: 'O(N log N)',
    spaceComplexity: 'O(N)',
    learningTakeaway: 'Hash sets make membership tests instantaneous.',
    testCases: [
      { input: '101 102 103 104\n102 104', expectedOutput: '101 103', isHidden: false }
    ]
  },
  {
    id: 'p-70',
    topicCode: 'T3',
    questionNumber: 70,
    title: 'Finding the Median of Positive Product IDs',
    type: 'postclass',
    difficulty: 'Medium',
    statement: 'Given an array containing positive, zero, and negative values, filter only the strictly positive values (> 0), sort them, and print their median formatted to 1 decimal place.',
    inputFormat: 'Space-separated integers.',
    outputFormat: 'Float formatted to 1 decimal place (e.g. 15.0 or 12.5).',
    constraints: ['At least 1 positive number exists.'],
    examples: [
      { input: '-5 10 20 0 30', output: '20.0', explanation: 'Positives: [10, 20, 30]. Median is 20.0.' }
    ],
    starterCode: `def positive_median(arr: list) -> float:\n    pass\n\nif __name__ == '__main__':\n    import sys\n    s = sys.stdin.read().strip()\n    if s:\n        print(f'{positive_median(list(map(int, s.split()))):.1f}')`,
    hints: ['Filter x > 0 and sort.', 'If length n is odd: arr[n//2]. If even: (arr[n//2 - 1] + arr[n//2]) / 2.0.'],
    fullSolution: `def positive_median(arr: list) -> float:\n    pos = sorted([x for x in arr if x > 0])\n    n = len(pos)\n    if n % 2 == 1:\n        return float(pos[n // 2])\n    else:\n        return (pos[n // 2 - 1] + pos[n // 2]) / 2.0\n\nif __name__ == '__main__':\n    import sys\n    s = sys.stdin.read().strip()\n    if s:\n        print(f'{positive_median(list(map(int, s.split()))):.1f}')`,
    explanation: 'Standard median on sorted positive slice.',
    timeComplexity: 'O(N log N)',
    spaceComplexity: 'O(N)',
    learningTakeaway: 'Always handle odd vs even median indexing carefully.',
    testCases: [
      { input: '-5 10 20 0 30', expectedOutput: '20.0', isHidden: false },
      { input: '10 20 30 40', expectedOutput: '25.0', isHidden: false }
    ]
  },

  // --- T4 Arrays (2D) ---
  {
    id: 'p-71',
    topicCode: 'T4',
    questionNumber: 71,
    title: 'Merging Attendance Records',
    type: 'inclass',
    difficulty: 'Easy',
    statement: 'Given an R x C matrix of binary attendance (1 for present, 0 for absent), count the total number of present attendances.',
    inputFormat: 'Line 1: R and C\\nNext R lines: C space-separated 0s or 1s',
    outputFormat: 'Total present count.',
    constraints: ['1 <= R, C <= 100'],
    examples: [
      { input: '2 3\n1 0 1\n1 1 0', output: '4', explanation: 'Total 4 ones.' }
    ],
    starterCode: `def count_attendance(matrix: list) -> int:\n    pass\n\nif __name__ == '__main__':\n    import sys\n    lines = [l.strip() for l in sys.stdin.read().split('\\n') if l.strip()]\n    if lines:\n        r, c = map(int, lines[0].split())\n        mat = [list(map(int, lines[i+1].split())) for i in range(r)]\n        print(count_attendance(mat))`,
    hints: ['Sum the sum of each row.'],
    fullSolution: `def count_attendance(matrix: list) -> int:\n    return sum(sum(row) for row in matrix)\n\nif __name__ == '__main__':\n    import sys\n    lines = [l.strip() for l in sys.stdin.read().split('\\n') if l.strip()]\n    if lines:\n        r, c = map(int, lines[0].split())\n        mat = [list(map(int, lines[i+1].split())) for i in range(r)]\n        print(count_attendance(mat))`,
    explanation: 'Aggregates 2D matrix sum.',
    timeComplexity: 'O(R*C)',
    spaceComplexity: 'O(1)',
    learningTakeaway: '2D grid reductions in Python.',
    testCases: [
      { input: '2 3\n1 0 1\n1 1 0', expectedOutput: '4', isHidden: false }
    ]
  },
  {
    id: 'p-72',
    topicCode: 'T4',
    questionNumber: 72,
    title: "Irene's Audience Arrangement Checker",
    type: 'inclass',
    difficulty: 'Medium',
    statement: "Check whether each row in an R x C audience seat grid has strictly increasing seat heights from left to right. Output 'YES' if all rows do, else 'NO'.",
    inputFormat: 'Line 1: R C\\nNext R lines: C integers',
    outputFormat: "'YES' or 'NO'",
    constraints: ['1 <= R, C <= 50'],
    examples: [
      { input: '2 3\n1 3 5\n2 4 8', output: 'YES', explanation: 'Both rows strictly increasing.' }
    ],
    starterCode: `def check_audience(matrix: list) -> str:\n    pass\n\nif __name__ == '__main__':\n    import sys\n    lines = [l.strip() for l in sys.stdin.read().split('\\n') if l.strip()]\n    if lines:\n        r, c = map(int, lines[0].split())\n        mat = [list(map(int, lines[i+1].split())) for i in range(r)]\n        print(check_audience(mat))`,
    hints: ['Check row[j] >= row[j+1]; if true, immediately return NO.'],
    fullSolution: `def check_audience(matrix: list) -> str:\n    for row in matrix:\n        for j in range(len(row) - 1):\n            if row[j] >= row[j + 1]:\n                return 'NO'\n    return 'YES'\n\nif __name__ == '__main__':\n    import sys\n    lines = [l.strip() for l in sys.stdin.read().split('\\n') if l.strip()]\n    if lines:\n        r, c = map(int, lines[0].split())\n        mat = [list(map(int, lines[i+1].split())) for i in range(r)]\n        print(check_audience(mat))`,
    explanation: 'Verifies strict monotonicity across all rows.',
    timeComplexity: 'O(R*C)',
    spaceComplexity: 'O(1)',
    learningTakeaway: 'Early return on first row failing monotonic constraint.',
    testCases: [
      { input: '2 3\n1 3 5\n2 4 8', expectedOutput: 'YES', isHidden: false },
      { input: '1 3\n1 2 2', expectedOutput: 'NO', isHidden: false }
    ]
  },
  {
    id: 'p-73',
    topicCode: 'T4',
    questionNumber: 73,
    title: 'Robotic Warehouse Navigation - Snake Pattern Traversal',
    type: 'inclass',
    difficulty: 'Medium',
    statement: 'A warehouse rover traverses an R x C grid in snake fashion: left-to-right on even rows (0, 2, ...), and right-to-left on odd rows (1, 3, ...). Output the visited numbers in single line.',
    inputFormat: 'Line 1: R C\\nNext R lines: C integers',
    outputFormat: 'Space-separated integers.',
    constraints: ['1 <= R, C <= 50'],
    examples: [
      { input: '3 3\n1 2 3\n4 5 6\n7 8 9', output: '1 2 3 6 5 4 7 8 9', explanation: 'Row 0: 1 2 3, Row 1 reversed: 6 5 4, Row 2: 7 8 9.' }
    ],
    starterCode: `def snake_traversal(matrix: list) -> list:\n    pass\n\nif __name__ == '__main__':\n    import sys\n    lines = [l.strip() for l in sys.stdin.read().split('\\n') if l.strip()]\n    if lines:\n        r, c = map(int, lines[0].split())\n        mat = [list(map(int, lines[i+1].split())) for i in range(r)]\n        print(' '.join(map(str, snake_traversal(mat))))`,
    hints: ['If row_idx % 2 == 1, reverse the row before extending results.'],
    fullSolution: `def snake_traversal(matrix: list) -> list:\n    res = []\n    for idx, row in enumerate(matrix):\n        if idx % 2 == 0:\n            res.extend(row)\n        else:\n            res.extend(reversed(row))\n    return res\n\nif __name__ == '__main__':\n    import sys\n    lines = [l.strip() for l in sys.stdin.read().split('\\n') if l.strip()]\n    if lines:\n        r, c = map(int, lines[0].split())\n        mat = [list(map(int, lines[i+1].split())) for i in range(r)]\n        print(' '.join(map(str, snake_traversal(mat))))`,
    explanation: 'Snake pattern alternating direction on odd row indices.',
    timeComplexity: 'O(R*C)',
    spaceComplexity: 'O(R*C)',
    learningTakeaway: 'Alternating loop direction using modulo parity.',
    testCases: [
      { input: '3 3\n1 2 3\n4 5 6\n7 8 9', expectedOutput: '1 2 3 6 5 4 7 8 9', isHidden: false }
    ]
  },
  {
    id: 'p-74',
    topicCode: 'T4',
    questionNumber: 74,
    title: 'Identifying Maximum Defect Levels in Production Batches',
    type: 'postclass',
    difficulty: 'Easy',
    statement: 'Given an R x C matrix of defect counts, output the maximum defect count across the entire facility.',
    inputFormat: 'Line 1: R C\\nNext R lines: C integers',
    outputFormat: 'Single maximum integer.',
    constraints: ['1 <= R, C <= 50'],
    examples: [{ input: '2 2\n3 9\n12 4', output: '12', explanation: 'Max is 12.' }],
    starterCode: `def max_defect(mat: list) -> int:\n    pass\n\nif __name__ == '__main__':\n    import sys\n    lines = [l.strip() for l in sys.stdin.read().split('\\n') if l.strip()]\n    if lines:\n        r, c = map(int, lines[0].split())\n        mat = [list(map(int, lines[i+1].split())) for i in range(r)]\n        print(max_defect(mat))`,
    hints: ['Find max(max(row) for row in mat).'],
    fullSolution: `def max_defect(mat: list) -> int:\n    return max(max(row) for row in mat)\n\nif __name__ == '__main__':\n    import sys\n    lines = [l.strip() for l in sys.stdin.read().split('\\n') if l.strip()]\n    if lines:\n        r, c = map(int, lines[0].split())\n        mat = [list(map(int, lines[i+1].split())) for i in range(r)]\n        print(max_defect(mat))`,
    explanation: 'Matrix global maximum.',
    timeComplexity: 'O(R*C)',
    spaceComplexity: 'O(1)',
    learningTakeaway: 'Max reduction over nested iterables.',
    testCases: [{ input: '2 2\n3 9\n12 4', expectedOutput: '12', isHidden: false }]
  },
  {
    id: 'p-75',
    topicCode: 'T4',
    questionNumber: 75,
    title: 'Counting Sorted Production Lines',
    type: 'postclass',
    difficulty: 'Easy',
    statement: 'Count how many rows in an R x C matrix are sorted in non-decreasing order.',
    inputFormat: 'Line 1: R C\\nNext R lines: C integers',
    outputFormat: 'Count of sorted rows.',
    constraints: ['1 <= R, C <= 50'],
    examples: [{ input: '2 3\n1 2 3\n3 2 1', output: '1', explanation: 'Row 0 is sorted.' }],
    starterCode: `def count_sorted_rows(mat: list) -> int:\n    pass\n\nif __name__ == '__main__':\n    import sys\n    lines = [l.strip() for l in sys.stdin.read().split('\\n') if l.strip()]\n    if lines:\n        r, c = map(int, lines[0].split())\n        mat = [list(map(int, lines[i+1].split())) for i in range(r)]\n        print(count_sorted_rows(mat))`,
    hints: ['Check row == sorted(row).'],
    fullSolution: `def count_sorted_rows(mat: list) -> int:\n    return sum(1 for row in mat if row == sorted(row))\n\nif __name__ == '__main__':\n    import sys\n    lines = [l.strip() for l in sys.stdin.read().split('\\n') if l.strip()]\n    if lines:\n        r, c = map(int, lines[0].split())\n        mat = [list(map(int, lines[i+1].split())) for i in range(r)]\n        print(count_sorted_rows(mat))`,
    explanation: 'Evaluates each row against sorted counterpart.',
    timeComplexity: 'O(R * C log C)',
    spaceComplexity: 'O(C)',
    learningTakeaway: 'Row-level predicate filtering.',
    testCases: [{ input: '2 3\n1 2 3\n3 2 1', expectedOutput: '1', isHidden: false }]
  },

  // --- T9 Functions ---
  {
    id: 'p-91',
    topicCode: 'T9',
    questionNumber: 91,
    title: 'Perfect Number Detection for Vault Security',
    type: 'inclass',
    difficulty: 'Easy',
    statement: 'A vault key is valid if it is a Perfect Number (a positive integer that equals the sum of its positive proper divisors excluding itself). Print "YES" if N is perfect, else "NO".',
    inputFormat: 'Single integer N.',
    outputFormat: '"YES" or "NO"',
    constraints: ['1 <= N <= 10^6'],
    examples: [
      { input: '6', output: 'YES', explanation: 'Divisors of 6 are 1, 2, 3. 1+2+3 = 6.' },
      { input: '10', output: 'NO', explanation: '1+2+5 = 8 != 10.' }
    ],
    starterCode: `def is_perfect(n: int) -> str:\n    pass\n\nif __name__ == '__main__':\n    import sys\n    s = sys.stdin.read().strip()\n    if s:\n        print(is_perfect(int(s)))`,
    hints: ['Find divisors up to sqrt(N) to optimize to O(sqrt(N)).'],
    fullSolution: `def is_perfect(n: int) -> str:\n    if n <= 1:\n        return 'NO'\n    total = 1\n    for i in range(2, int(n**0.5) + 1):\n        if n % i == 0:\n            total += i\n            if i * i != n:\n                total += n // i\n    return 'YES' if total == n else 'NO'\n\nif __name__ == '__main__':\n    import sys\n    s = sys.stdin.read().strip()\n    if s:\n        print(is_perfect(int(s)))`,
    explanation: 'O(sqrt(N)) divisor enumeration.',
    timeComplexity: 'O(sqrt(N))',
    spaceComplexity: 'O(1)',
    learningTakeaway: 'Divisor symmetry up to square root of N.',
    testCases: [
      { input: '6', expectedOutput: 'YES', isHidden: false },
      { input: '28', expectedOutput: 'YES', isHidden: false },
      { input: '10', expectedOutput: 'NO', isHidden: true }
    ]
  },
  {
    id: 'p-93',
    topicCode: 'T9',
    questionNumber: 93,
    title: 'Finding the Leaders in Sales Data',
    type: 'inclass',
    difficulty: 'Medium',
    statement: 'A sales figure is a "Leader" if it is strictly greater than all elements to its right. Print all leader sales figures in their original order.',
    inputFormat: 'Space-separated integers.',
    outputFormat: 'Space-separated integers.',
    constraints: ['1 <= len(arr) <= 10^5'],
    examples: [
      { input: '16 17 4 3 5 2', output: '17 5 2', explanation: 'Leaders are 17, 5, 2.' }
    ],
    starterCode: `def find_leaders(arr: list) -> list:\n    pass\n\nif __name__ == '__main__':\n    import sys\n    s = sys.stdin.read().strip()\n    if s:\n        print(' '.join(map(str, find_leaders(list(map(int, s.split()))))))`,
    hints: ['Scan from right to left tracking max seen so far.'],
    fullSolution: `def find_leaders(arr: list) -> list:\n    res = []\n    cur_max = float('-inf')\n    for x in reversed(arr):\n        if x > cur_max:\n            res.append(x)\n            cur_max = x\n    res.reverse()\n    return res\n\nif __name__ == '__main__':\n    import sys\n    s = sys.stdin.read().strip()\n    if s:\n        print(' '.join(map(str, find_leaders(list(map(int, s.split()))))))`,
    explanation: 'Reverse scan in O(N).',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(N)',
    learningTakeaway: 'Standard leader algorithm in linear time.',
    testCases: [{ input: '16 17 4 3 5 2', expectedOutput: '17 5 2', isHidden: false }]
  },

  // --- T10 Recursion ---
  {
    id: 'p-101',
    topicCode: 'T10',
    questionNumber: 101,
    title: 'Calculating Factorials for the Space Expedition',
    type: 'inclass',
    difficulty: 'Easy',
    statement: 'Write a recursive function to calculate N! (factorial of N).',
    inputFormat: 'Single non-negative integer N.',
    outputFormat: 'Value of N!',
    constraints: ['0 <= N <= 20'],
    examples: [
      { input: '5', output: '120', explanation: '5! = 5*4*3*2*1 = 120.' },
      { input: '0', output: '1', explanation: '0! = 1.' }
    ],
    starterCode: `def factorial(n: int) -> int:\n    # Base case and recursive call\n    pass\n\nif __name__ == '__main__':\n    import sys\n    s = sys.stdin.read().strip()\n    if s:\n        print(factorial(int(s)))`,
    hints: ['Base case: if n <= 1 return 1.', 'Recursive step: return n * factorial(n - 1).'],
    fullSolution: `def factorial(n: int) -> int:\n    if n <= 1:\n        return 1\n    return n * factorial(n - 1)\n\nif __name__ == '__main__':\n    import sys\n    s = sys.stdin.read().strip()\n    if s:\n        print(factorial(int(s)))`,
    explanation: 'Fundamental recursion baseline.',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(N) call stack',
    learningTakeaway: 'Recursion requires an unambiguous terminating base case.',
    testCases: [
      { input: '5', expectedOutput: '120', isHidden: false },
      { input: '0', expectedOutput: '1', isHidden: false },
      { input: '6', expectedOutput: '720', isHidden: true }
    ]
  },
  {
    id: 'p-102',
    topicCode: 'T10',
    questionNumber: 102,
    title: 'Calculating the Total Revenue of Orders',
    type: 'inclass',
    difficulty: 'Easy',
    statement: 'Given an array of order revenues, calculate their sum recursively without using sum() or loops.',
    inputFormat: 'Space-separated integers.',
    outputFormat: 'Total sum.',
    constraints: ['0 <= len(arr) <= 1000'],
    examples: [{ input: '10 20 30', output: '60', explanation: '10+20+30=60.' }],
    starterCode: `def recursive_sum(arr: list, idx: int = 0) -> int:\n    pass\n\nif __name__ == '__main__':\n    import sys\n    s = sys.stdin.read().strip()\n    if s:\n        print(recursive_sum(list(map(int, s.split()))))\n    else:\n        print(0)`,
    hints: ['Base case: idx == len(arr) returns 0.'],
    fullSolution: `def recursive_sum(arr: list, idx: int = 0) -> int:\n    if idx == len(arr):\n        return 0\n    return arr[idx] + recursive_sum(arr, idx + 1)\n\nif __name__ == '__main__':\n    import sys\n    s = sys.stdin.read().strip()\n    if s:\n        print(recursive_sum(list(map(int, s.split()))))\n    else:\n        print(0)`,
    explanation: 'Recursively walks indices to sum values.',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(N)',
    learningTakeaway: 'Index-based recursion avoids costly slice copies.',
    testCases: [
      { input: '10 20 30', expectedOutput: '60', isHidden: false },
      { input: '100', expectedOutput: '100', isHidden: false }
    ]
  },
  {
    id: 'p-103',
    topicCode: 'T10',
    questionNumber: 103,
    title: 'The Fibonacci Sequence for Future Engineers',
    type: 'inclass',
    difficulty: 'Easy',
    statement: 'Compute the N-th Fibonacci number where F(0)=0, F(1)=1, and F(N) = F(N-1) + F(N-2).',
    inputFormat: 'Integer N.',
    outputFormat: 'F(N)',
    constraints: ['0 <= N <= 30'],
    examples: [
      { input: '6', output: '8', explanation: '0, 1, 1, 2, 3, 5, 8.' }
    ],
    starterCode: `def fibonacci(n: int) -> int:\n    pass\n\nif __name__ == '__main__':\n    import sys\n    s = sys.stdin.read().strip()\n    if s:\n        print(fibonacci(int(s)))`,
    hints: ['Use memoization or iterative / recursion with memo dict.'],
    fullSolution: `def fibonacci(n: int, memo = {}) -> int:\n    if n in memo:\n        return memo[n]\n    if n <= 0:\n        return 0\n    if n == 1:\n        return 1\n    memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo)\n    return memo[n]\n\nif __name__ == '__main__':\n    import sys\n    s = sys.stdin.read().strip()\n    if s:\n        print(fibonacci(int(s)))`,
    explanation: 'Memoized recursion eliminates exponential branching.',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(N)',
    learningTakeaway: 'Memoization transforms O(2^N) recursion into linear O(N).',
    testCases: [
      { input: '6', expectedOutput: '8', isHidden: false },
      { input: '0', expectedOutput: '0', isHidden: false },
      { input: '10', expectedOutput: '55', isHidden: true }
    ]
  },
  // --- LeetCode, GeeksforGeeks & HackerRank Curated Problems ---
  // 1. Easy: Two Sum (LeetCode #1)
  {
    id: 'p-lc-two-sum',
    topicCode: 'T2',
    questionNumber: 104,
    title: 'Two Sum (LeetCode #1)',
    type: 'inclass',
    difficulty: 'Easy',
    platform: 'LeetCode',
    platformProblemId: 'LC-1',
    statement: 'Given an array of integers nums and an integer target, return the 0-based indices of the two numbers such that they add up to target.\n\nYou may assume that each input has exactly one valid solution, and you may not use the same element twice. Print the indices separated by a space in ascending order.',
    inputFormat: 'First integer N (array length), followed by N space-separated integers for nums, followed by integer target.',
    outputFormat: 'Print two space-separated indices (e.g. "0 1").',
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Exactly one valid answer exists.'
    ],
    examples: [
      {
        input: '4 2 7 11 15 9',
        output: '0 1',
        explanation: 'nums[0] + nums[1] = 2 + 7 = 9, so indices 0 and 1 are returned.'
      },
      {
        input: '3 3 2 4 6',
        output: '1 2',
        explanation: 'nums[1] + nums[2] = 2 + 4 = 6, so indices 1 and 2 are returned.'
      }
    ],
    starterCode: `def two_sum(nums: list[int], target: int) -> list[int]:\n    # TODO: Return indices of the two numbers that add up to target\n    pass\n\nif __name__ == '__main__':\n    import sys\n    tokens = list(map(int, sys.stdin.read().split()))\n    if tokens:\n        n = tokens[0]\n        nums = tokens[1:1 + n]\n        target = tokens[1 + n]\n        res = two_sum(nums, target)\n        print(f"{res[0]} {res[1]}")`,
    hints: [
      'A brute-force double loop checks every pair in O(N^2) time. Can we do better with a hash map?',
      'Store each number and its index in a hash map as you iterate. Check if (target - current_number) has already been seen.'
    ],
    fullSolution: `def two_sum(nums: list[int], target: int) -> list[int]:\n    seen = {}\n    for i, num in enumerate(nums):\n        diff = target - num\n        if diff in seen:\n            return [seen[diff], i]\n        seen[num] = i\n    return []\n\nif __name__ == '__main__':\n    import sys\n    tokens = list(map(int, sys.stdin.read().split()))\n    if tokens:\n        n = tokens[0]\n        nums = tokens[1:1 + n]\n        target = tokens[1 + n]\n        res = two_sum(nums, target)\n        print(f"{res[0]} {res[1]}")`,
    explanation: 'We iterate through the array once while maintaining a dictionary mapping value -> index. For each element, we compute the complement (target - num). If the complement is already in the dictionary, we return its index and the current index. This reduces time complexity from O(N^2) to O(N).',
    timeComplexity: 'O(N) single-pass lookup',
    spaceComplexity: 'O(N) hash map storage',
    learningTakeaway: 'Hash maps trade linear auxiliary space to convert nested search loops from quadratic O(N^2) to linear O(N) time.',
    testCases: [
      { input: '4 2 7 11 15 9', expectedOutput: '0 1', isHidden: false },
      { input: '3 3 2 4 6', expectedOutput: '1 2', isHidden: false },
      { input: '2 3 3 6', expectedOutput: '0 1', isHidden: true },
      { input: '5 1 5 10 20 25 35', expectedOutput: '2 4', isHidden: true }
    ]
  },
  // 2. Easy: Birthday Cake Candles (HackerRank)
  {
    id: 'p-hr-birthday-candles',
    topicCode: 'T2',
    questionNumber: 105,
    title: 'Birthday Cake Candles (HackerRank)',
    type: 'inclass',
    difficulty: 'Easy',
    platform: 'HackerRank',
    platformProblemId: 'HR-CANDLES',
    statement: 'You are in charge of the cake for a child\'s birthday. You have decided the cake will have one candle for each year of their total age. They will only be able to blow out the tallest of the candles. Count how many candles are tallest.',
    inputFormat: 'First integer N (number of candles), followed by N space-separated integers representing candle heights.',
    outputFormat: 'Print a single integer representing the number of candles that are tallest.',
    constraints: [
      '1 <= N <= 10^5',
      '1 <= candles[i] <= 10^7'
    ],
    examples: [
      {
        input: '4 3 2 1 3',
        output: '2',
        explanation: 'Candle heights are [3, 2, 1, 3]. The tallest candles are 3, and there are 2 of them.'
      },
      {
        input: '4 4 4 1 3',
        output: '2',
        explanation: 'Maximum height is 4, appearing 2 times.'
      }
    ],
    starterCode: `def birthday_cake_candles(candles: list[int]) -> int:\n    # TODO: Return count of tallest candles\n    pass\n\nif __name__ == '__main__':\n    import sys\n    tokens = list(map(int, sys.stdin.read().split()))\n    if tokens:\n        n = tokens[0]\n        candles = tokens[1:1 + n]\n        print(birthday_cake_candles(candles))`,
    hints: [
      'First identify the maximum value across the candle array.',
      'Count the number of occurrences of that maximum value in a single traversal.'
    ],
    fullSolution: `def birthday_cake_candles(candles: list[int]) -> int:\n    if not candles:\n        return 0\n    max_height = max(candles)\n    return candles.count(max_height)\n\nif __name__ == '__main__':\n    import sys\n    tokens = list(map(int, sys.stdin.read().split()))\n    if tokens:\n        n = tokens[0]\n        candles = tokens[1:1 + n]\n        print(birthday_cake_candles(candles))`,
    explanation: 'We locate the maximum candle height in O(N) time and then tally all elements matching that maximum value. Alternatively, a single loop tracking running max and count achieves the same in one pass.',
    timeComplexity: 'O(N) linear scan',
    spaceComplexity: 'O(1) auxiliary space',
    learningTakeaway: 'Aggregating peak frequencies in an array only requires finding the supremum and counting its occurrences.',
    testCases: [
      { input: '4 3 2 1 3', expectedOutput: '2', isHidden: false },
      { input: '4 4 4 1 3', expectedOutput: '2', isHidden: false },
      { input: '5 1 2 3 4 5', expectedOutput: '1', isHidden: true },
      { input: '6 9 9 9 9 9 9', expectedOutput: '6', isHidden: true }
    ]
  },
  // 3. Easy: Missing Number in Array (GeeksforGeeks)
  {
    id: 'p-gfg-missing-number',
    topicCode: 'T2',
    questionNumber: 106,
    title: 'Missing Number in Array (GeeksforGeeks)',
    type: 'inclass',
    difficulty: 'Easy',
    platform: 'GeeksforGeeks',
    platformProblemId: 'GFG-MISSING',
    statement: 'Given an array of size N-1 containing distinct integers in the range of 1 to N. Find the one missing integer from the array in O(N) time and O(1) space.',
    inputFormat: 'First integer N, followed by N-1 space-separated integers representing the array.',
    outputFormat: 'Print the missing integer.',
    constraints: [
      '2 <= N <= 10^5',
      '1 <= arr[i] <= N',
      'All integers in arr are distinct.'
    ],
    examples: [
      {
        input: '5 1 2 3 5',
        output: '4',
        explanation: 'From 1 to 5, the missing element is 4.'
      },
      {
        input: '2 1',
        output: '2',
        explanation: 'From 1 to 2, 1 is given so 2 is missing.'
      }
    ],
    starterCode: `def find_missing_number(n: int, arr: list[int]) -> int:\n    # TODO: Find missing integer between 1 and n\n    pass\n\nif __name__ == '__main__':\n    import sys\n    tokens = list(map(int, sys.stdin.read().split()))\n    if tokens:\n        n = tokens[0]\n        arr = tokens[1:]\n        print(find_missing_number(n, arr))`,
    hints: [
      'What is the formula for the sum of the first N natural numbers?',
      'Gauss summation formula: Sum = N * (N + 1) // 2. Subtract the sum of the array from this total.'
    ],
    fullSolution: `def find_missing_number(n: int, arr: list[int]) -> int:\n    expected_sum = n * (n + 1) // 2\n    actual_sum = sum(arr)\n    return expected_sum - actual_sum\n\nif __name__ == '__main__':\n    import sys\n    tokens = list(map(int, sys.stdin.read().split()))\n    if tokens:\n        n = tokens[0]\n        arr = tokens[1:]\n        print(find_missing_number(n, arr))`,
    explanation: 'The sum of all integers from 1 to N is given by the formula N * (N + 1) // 2. Since exactly one integer is missing, the difference between expected sum and the sum of given elements yields the missing number in O(N) time and O(1) space.',
    timeComplexity: 'O(N) arithmetic sum',
    spaceComplexity: 'O(1) constant auxiliary space',
    learningTakeaway: 'Mathematical properties like arithmetic series summation solve missing-element queries without sorting or extra memory allocation.',
    testCases: [
      { input: '5 1 2 3 5', expectedOutput: '4', isHidden: false },
      { input: '2 1', expectedOutput: '2', isHidden: false },
      { input: '10 1 2 3 4 5 6 7 8 10', expectedOutput: '9', isHidden: true },
      { input: '4 1 2 4', expectedOutput: '3', isHidden: true }
    ]
  },
  // 4. Medium: Container With Most Water (LeetCode #11)
  {
    id: 'p-lc-container-water',
    topicCode: 'T3',
    questionNumber: 107,
    title: 'Container With Most Water (LeetCode #11)',
    type: 'inclass',
    difficulty: 'Medium',
    platform: 'LeetCode',
    platformProblemId: 'LC-11',
    statement: 'You are given an integer array height of length N. There are N vertical lines drawn such that the two endpoints of the i-th line are (i, 0) and (i, height[i]).\n\nFind two lines that together with the x-axis form a container, such that the container contains the most water. Return the maximum amount of water a container can store.',
    inputFormat: 'First integer N, followed by N space-separated integers representing vertical bar heights.',
    outputFormat: 'Print a single integer representing the maximum water volume.',
    constraints: [
      '2 <= N <= 10^5',
      '0 <= height[i] <= 10^4'
    ],
    examples: [
      {
        input: '9 1 8 6 2 5 4 8 3 7',
        output: '49',
        explanation: 'Lines at index 1 (height 8) and index 8 (height 7) form area min(8, 7) * (8 - 1) = 7 * 7 = 49.'
      },
      {
        input: '2 1 1',
        output: '1',
        explanation: 'Area is min(1, 1) * 1 = 1.'
      }
    ],
    starterCode: `def max_area(height: list[int]) -> int:\n    # TODO: Return maximum water volume using two pointers\n    pass\n\nif __name__ == '__main__':\n    import sys\n    tokens = list(map(int, sys.stdin.read().split()))\n    if tokens:\n        n = tokens[0]\n        heights = tokens[1:1 + n]\n        print(max_area(heights))`,
    hints: [
      'The area is bounded by the shorter line: Area = min(height[left], height[right]) * (right - left).',
      'Start with pointers at both ends (maximum width). Always advance the pointer pointing to the shorter vertical line.'
    ],
    fullSolution: `def max_area(height: list[int]) -> int:\n    left = 0\n    right = len(height) - 1\n    max_water = 0\n    while left < right:\n        h = min(height[left], height[right])\n        max_water = max(max_water, h * (right - left))\n        if height[left] < height[right]:\n            left += 1\n        else:\n            right -= 1\n    return max_water\n\nif __name__ == '__main__':\n    import sys\n    tokens = list(map(int, sys.stdin.read().split()))\n    if tokens:\n        n = tokens[0]\n        heights = tokens[1:1 + n]\n        print(max_area(heights))`,
    explanation: 'We place two pointers at opposite extremes of the array. The width decreases at each step. To maximize area, we must seek a taller boundary, which means we must move the pointer corresponding to the shorter bar inward. This guarantees inspecting all potential maximum configurations in linear time.',
    timeComplexity: 'O(N) two-pointer traversal',
    spaceComplexity: 'O(1) in-place auxiliary space',
    learningTakeaway: 'Greedy inward elimination with two pointers eliminates unviable search spaces without checking all O(N^2) pairs.',
    testCases: [
      { input: '9 1 8 6 2 5 4 8 3 7', expectedOutput: '49', isHidden: false },
      { input: '2 1 1', expectedOutput: '1', isHidden: false },
      { input: '5 4 3 2 1 4', expectedOutput: '16', isHidden: true },
      { input: '4 1 2 4 3', expectedOutput: '4', isHidden: true }
    ]
  },
  // 5. Medium: Kadane's Algorithm - Maximum Subarray Sum (GeeksforGeeks)
  {
    id: 'p-gfg-kadane-max-subarray',
    topicCode: 'T3',
    questionNumber: 108,
    title: 'Kadane\'s Algorithm: Maximum Subarray Sum (GeeksforGeeks)',
    type: 'inclass',
    difficulty: 'Medium',
    platform: 'GeeksforGeeks',
    platformProblemId: 'GFG-KADANE',
    statement: 'Given an array arr[] of N integers. Find the contiguous sub-array (containing at least one number) which has the maximum sum and return its sum.',
    inputFormat: 'First integer N, followed by N space-separated integers representing the array elements.',
    outputFormat: 'Print a single integer representing the maximum contiguous subarray sum.',
    constraints: [
      '1 <= N <= 10^5',
      '-10^7 <= arr[i] <= 10^7'
    ],
    examples: [
      {
        input: '5 1 2 3 -2 5',
        output: '9',
        explanation: 'Subarray [1, 2, 3, -2, 5] has the maximum sum 9.'
      },
      {
        input: '4 -1 -2 -3 -4',
        output: '-1',
        explanation: 'All numbers are negative; the largest single element is -1.'
      }
    ],
    starterCode: `def max_subarray_sum(arr: list[int]) -> int:\n    # TODO: Implement Kadane\'s algorithm\n    pass\n\nif __name__ == '__main__':\n    import sys\n    tokens = list(map(int, sys.stdin.read().split()))\n    if tokens:\n        n = tokens[0]\n        arr = tokens[1:1 + n]\n        print(max_subarray_sum(arr))`,
    hints: [
      'At each position i, decide whether to append arr[i] to the existing running subarray or start fresh from arr[i].',
      'Recurrence relation: current_max = max(arr[i], current_max + arr[i]). Update overall max_so_far accordingly.'
    ],
    fullSolution: `def max_subarray_sum(arr: list[int]) -> int:\n    if not arr:\n        return 0\n    max_so_far = arr[0]\n    current_max = arr[0]\n    for x in arr[1:]:\n        current_max = max(x, current_max + x)\n        max_so_far = max(max_so_far, current_max)\n    return max_so_far\n\nif __name__ == '__main__':\n    import sys\n    tokens = list(map(int, sys.stdin.read().split()))\n    if tokens:\n        n = tokens[0]\n        arr = tokens[1:1 + n]\n        print(max_subarray_sum(arr))`,
    explanation: 'Kadane\'s algorithm scans the array while maintaining two scalar variables: current_max (maximum subarray sum ending at the current index) and max_so_far (global maximum found so far). If the accumulated sum becomes negative, starting fresh at the next element is strictly superior.',
    timeComplexity: 'O(N) single-pass dynamic programming',
    spaceComplexity: 'O(1) auxiliary variables',
    learningTakeaway: 'Local optimal choice (extend existing sum vs restart) delivers the global maximum in linear time without keeping an array of sub-solutions.',
    testCases: [
      { input: '5 1 2 3 -2 5', expectedOutput: '9', isHidden: false },
      { input: '4 -1 -2 -3 -4', expectedOutput: '-1', isHidden: false },
      { input: '8 -2 -3 4 -1 -2 1 5 -3', expectedOutput: '7', isHidden: true },
      { input: '3 5 4 7', expectedOutput: '16', isHidden: true }
    ]
  },
  // 6. Medium: Ice Cream Parlor (HackerRank)
  {
    id: 'p-hr-ice-cream-parlor',
    topicCode: 'T3',
    questionNumber: 109,
    title: 'Ice Cream Parlor (HackerRank)',
    type: 'inclass',
    difficulty: 'Medium',
    platform: 'HackerRank',
    platformProblemId: 'HR-ICECREAM',
    statement: 'Two friends like to pool their money each time they visit the ice cream parlor. They always pick two distinct flavors such that their total cost equals their pooled money M.\n\nGiven the list of prices for the flavors, find the 1-based indices of the two flavors they will buy and print them in ascending order.',
    inputFormat: 'First integer M (pooled money), second integer N (flavors count), followed by N space-separated integers for flavor prices.',
    outputFormat: 'Print two space-separated 1-based indices in ascending order (e.g. "1 4").',
    constraints: [
      '1 <= M <= 10^4',
      '2 <= N <= 10^4',
      '1 <= cost[i] <= 10^4',
      'A unique solution is guaranteed.'
    ],
    examples: [
      {
        input: '4 5 1 4 5 3 2',
        output: '1 4',
        explanation: 'Flavors 1 and 4 have costs 1 and 3, which add up to M=4.'
      },
      {
        input: '4 4 2 2 4 3',
        output: '1 2',
        explanation: 'Flavors 1 and 2 each cost 2, which add up to M=4.'
      }
    ],
    starterCode: `def ice_cream_parlor(m: int, cost: list[int]) -> tuple[int, int]:\n    # TODO: Return 1-based indices of the two flavors summing to m\n    pass\n\nif __name__ == '__main__':\n    import sys\n    tokens = list(map(int, sys.stdin.read().split()))\n    if tokens:\n        m = tokens[0]\n        n = tokens[1]\n        cost = tokens[2:2 + n]\n        res = ice_cream_parlor(m, cost)\n        print(f"{res[0]} {res[1]}")`,
    hints: [
      'Remember that the output requires 1-based indices.',
      'Use a dictionary mapping flavor price to its 1-based index to achieve O(N) lookup.'
    ],
    fullSolution: `def ice_cream_parlor(m: int, cost: list[int]) -> tuple[int, int]:\n    seen = {}\n    for i, price in enumerate(cost):\n        need = m - price\n        if need in seen:\n            return (seen[need], i + 1)\n        seen[price] = i + 1\n    return (0, 0)\n\nif __name__ == '__main__':\n    import sys\n    tokens = list(map(int, sys.stdin.read().split()))\n    if tokens:\n        m = tokens[0]\n        n = tokens[1]\n        cost = tokens[2:2 + n]\n        res = ice_cream_parlor(m, cost)\n        print(f"{res[0]} {res[1]}")`,
    explanation: 'We iterate through the array once. For each flavor with cost C, we check if complement (M - C) exists in our hash map. Since we process from left to right, seen[need] is strictly less than the current index (i + 1), naturally satisfying the ascending order constraint.',
    timeComplexity: 'O(N) hash search',
    spaceComplexity: 'O(N) hash storage',
    learningTakeaway: 'Hash-based complement matching translates directly to commercial matching algorithms and point-of-sale pooling calculations.',
    testCases: [
      { input: '4 5 1 4 5 3 2', expectedOutput: '1 4', isHidden: false },
      { input: '4 4 2 2 4 3', expectedOutput: '1 2', isHidden: false },
      { input: '8 4 1 3 4 5', expectedOutput: '2 4', isHidden: true },
      { input: '9 3 1 2 7', expectedOutput: '2 3', isHidden: true }
    ]
  },
  // 7. Hard: Trapping Rain Water (LeetCode #42)
  {
    id: 'p-lc-trapping-rain',
    topicCode: 'T3',
    questionNumber: 110,
    title: 'Trapping Rain Water (LeetCode #42)',
    type: 'postclass',
    difficulty: 'Hard',
    platform: 'LeetCode',
    platformProblemId: 'LC-42',
    statement: 'Given N non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
    inputFormat: 'First integer N, followed by N space-separated integers representing bar heights.',
    outputFormat: 'Print a single integer indicating total units of trapped rain water.',
    constraints: [
      '1 <= N <= 2 * 10^4',
      '0 <= height[i] <= 10^5'
    ],
    examples: [
      {
        input: '12 0 1 0 2 1 0 1 3 2 1 2 1',
        output: '6',
        explanation: 'Elevation map [0,1,0,2,1,0,1,3,2,1,2,1] traps 6 units of rainwater in troughs.'
      },
      {
        input: '6 4 2 0 3 2 5',
        output: '9',
        explanation: 'Water trapped between boundary bars 4 and 5 equals 9 units.'
      }
    ],
    starterCode: `def trap_rain_water(height: list[int]) -> int:\n    # TODO: Calculate total trapped rain water\n    pass\n\nif __name__ == '__main__':\n    import sys\n    tokens = list(map(int, sys.stdin.read().split()))\n    if tokens:\n        n = tokens[0]\n        height = tokens[1:1 + n]\n        print(trap_rain_water(height))`,
    hints: [
      'The water trapped above any bar i is min(max_left, max_right) - height[i].',
      'Instead of precomputing prefix and suffix maximums with O(N) space, maintain left and right pointers with left_max and right_max to solve in O(1) auxiliary space.'
    ],
    fullSolution: `def trap_rain_water(height: list[int]) -> int:\n    n = len(height)\n    if n <= 2:\n        return 0\n    left, right = 0, n - 1\n    left_max, right_max = 0, 0\n    water = 0\n    while left < right:\n        if height[left] < height[right]:\n            if height[left] >= left_max:\n                left_max = height[left]\n            else:\n                water += left_max - height[left]\n            left += 1\n        else:\n            if height[right] >= right_max:\n                right_max = height[right]\n            else:\n                water += right_max - height[right]\n            right -= 1\n    return water\n\nif __name__ == '__main__':\n    import sys\n    tokens = list(map(int, sys.stdin.read().split()))\n    if tokens:\n        n = tokens[0]\n        height = tokens[1:1 + n]\n        print(trap_rain_water(height))`,
    explanation: 'We use two pointers from both sides. When height[left] < height[right], we know the water level at left is governed solely by left_max because right is bounded by a bar at least as tall. If height[left] < left_max, it traps (left_max - height[left]) units. Symmetrically, if height[right] <= height[left], right_max dictates water trapped on the right.',
    timeComplexity: 'O(N) single two-pointer pass',
    spaceComplexity: 'O(1) constant auxiliary space',
    learningTakeaway: 'When the bottleneck of a formula is min(A, B), advancing the pointer at whichever side is currently smaller decouples interdependent state.',
    testCases: [
      { input: '12 0 1 0 2 1 0 1 3 2 1 2 1', expectedOutput: '6', isHidden: false },
      { input: '6 4 2 0 3 2 5', expectedOutput: '9', isHidden: false },
      { input: '4 3 0 0 3', expectedOutput: '6', isHidden: true },
      { input: '5 1 2 3 4 5', expectedOutput: '0', isHidden: true }
    ]
  },
  // 8. Hard: Minimum Platforms for Railway Station (GeeksforGeeks)
  {
    id: 'p-gfg-min-platforms',
    topicCode: 'T3',
    questionNumber: 111,
    title: 'Minimum Platforms for Railway Station (GeeksforGeeks)',
    type: 'postclass',
    difficulty: 'Hard',
    platform: 'GeeksforGeeks',
    platformProblemId: 'GFG-PLATFORMS',
    statement: 'Given arrival and departure times of all trains that reach a railway station, the task is to find the minimum number of platforms required for the railway station so that no train is kept waiting.\n\nAll trains arrive and depart on the same day. Arrival and departure times are represented in 24-hour military format (e.g. 900 for 09:00, 1930 for 19:30). If arrival and departure times coincide, the departure happens after arrival.',
    inputFormat: 'First integer N (number of trains), followed by N arrival times, followed by N departure times.',
    outputFormat: 'Print a single integer representing the minimum number of platforms required.',
    constraints: [
      '1 <= N <= 5 * 10^4',
      '0 <= arrival[i] <= departure[i] <= 2359'
    ],
    examples: [
      {
        input: '6 900 940 950 1100 1500 1800 910 1200 1120 1130 1900 2000',
        output: '3',
        explanation: 'At time 950-1100, up to 3 trains occupy the station concurrently. 3 platforms are needed.'
      },
      {
        input: '3 900 1100 1235 1000 1200 1240',
        output: '1',
        explanation: 'No two train schedules overlap; 1 platform suffices.'
      }
    ],
    starterCode: `def min_platforms(arr: list[int], dep: list[int]) -> int:\n    # TODO: Find minimum platforms required using sorting and two pointers\n    pass\n\nif __name__ == '__main__':\n    import sys\n    tokens = list(map(int, sys.stdin.read().split()))\n    if tokens:\n        n = tokens[0]\n        arr = tokens[1:1 + n]\n        dep = tokens[1 + n:1 + 2 * n]\n        print(min_platforms(arr, dep))`,
    hints: [
      'We do not need to keep track of which train occupies which platform. We only care about the simultaneous train count over time.',
      'Sort arrival times and departure times independently. Use two pointers to simulate arrivals incrementing platforms and departures releasing platforms.'
    ],
    fullSolution: `def min_platforms(arr: list[int], dep: list[int]) -> int:\n    arr.sort()\n    dep.sort()\n    n = len(arr)\n    plat_needed = 0\n    max_plat = 0\n    i = 0\n    j = 0\n    while i < n and j < n:\n        if arr[i] <= dep[j]:\n            plat_needed += 1\n            max_plat = max(max_plat, plat_needed)\n            i += 1\n        else:\n            plat_needed -= 1\n            j += 1\n    return max_plat\n\nif __name__ == '__main__':\n    import sys\n    tokens = list(map(int, sys.stdin.read().split()))\n    if tokens:\n        n = tokens[0]\n        arr = tokens[1:1 + n]\n        dep = tokens[1 + n:1 + 2 * n]\n        print(min_platforms(arr, dep))`,
    explanation: 'By sorting arrivals and departures separately, we can treat the timeline as an event stream. Whenever a train arrives before the earliest departing train leaves (arr[i] <= dep[j]), an extra platform is occupied. Otherwise, a train departs, freeing a platform. The maximum platforms occupied at any single instant is the minimum capacity required.',
    timeComplexity: 'O(N log N) sorting both arrays',
    spaceComplexity: 'O(1) auxiliary space (if sorted in-place)',
    learningTakeaway: 'Interval overlap problems can be reduced from O(N^2) interval comparisons to O(N log N) event point sweeps.',
    testCases: [
      { input: '6 900 940 950 1100 1500 1800 910 1200 1120 1130 1900 2000', expectedOutput: '3', isHidden: false },
      { input: '3 900 1100 1235 1000 1200 1240', expectedOutput: '1', isHidden: false },
      { input: '4 50 100 150 200 60 120 180 250', expectedOutput: '1', isHidden: true },
      { input: '4 100 105 110 115 150 150 150 150', expectedOutput: '4', isHidden: true }
    ]
  },
  // 9. Hard: Array Manipulation (HackerRank)
  {
    id: 'p-hr-array-manipulation',
    topicCode: 'T3',
    questionNumber: 112,
    title: 'Array Manipulation (HackerRank)',
    type: 'postclass',
    difficulty: 'Hard',
    platform: 'HackerRank',
    platformProblemId: 'HR-MANIP',
    statement: 'Starting with a 1-indexed array of zeros of size N and a list of M operations, for each operation add a value K to all array elements between 1-based indices A and B inclusive.\n\nAfter all operations have been applied, return the maximum value in the array. A naive approach of updating every index in the range will time out with O(N * M) time. An optimal difference-array prefix sum achieves O(N + M).',
    inputFormat: 'First line has two integers N and M. Followed by M triplets of integers A, B, and K.',
    outputFormat: 'Print the maximum value in the array after all operations.',
    constraints: [
      '3 <= N <= 10^7',
      '1 <= M <= 2 * 10^5',
      '1 <= A <= B <= N',
      '0 <= K <= 10^9'
    ],
    examples: [
      {
        input: '5 3 1 2 100 2 5 100 3 4 100',
        output: '200',
        explanation: 'After operations, array values are [100, 200, 200, 200, 100]. Maximum value is 200.'
      },
      {
        input: '4 3 2 3 603 1 1 286 4 4 882',
        output: '882',
        explanation: 'Max element is 882 at index 4.'
      }
    ],
    starterCode: `def array_manipulation(n: int, queries: list[tuple[int, int, int]]) -> int:\n    # TODO: Compute maximum array value in O(N + M) time using difference array\n    pass\n\nif __name__ == '__main__':\n    import sys\n    tokens = list(map(int, sys.stdin.read().split()))\n    if tokens:\n        n = tokens[0]\n        m = tokens[1]\n        queries = []\n        idx = 2\n        for _ in range(m):\n            queries.append((tokens[idx], tokens[idx + 1], tokens[idx + 2]))\n            idx += 3\n        print(array_manipulation(n, queries))`,
    hints: [
      'Adding K to range [A, B] is equivalent to adding +K at index A and -K at index B + 1 in a difference array.',
      'After recording all operations in O(M) time, compute the prefix sums of the difference array in a single O(N) sweep.'
    ],
    fullSolution: `def array_manipulation(n: int, queries: list[tuple[int, int, int]]) -> int:\n    diff = [0] * (n + 2)\n    for a, b, k in queries:\n        diff[a] += k\n        diff[b + 1] -= k\n    max_val = 0\n    curr = 0\n    for i in range(1, n + 1):\n        curr += diff[i]\n        if curr > max_val:\n            max_val = curr\n    return max_val\n\nif __name__ == '__main__':\n    import sys\n    tokens = list(map(int, sys.stdin.read().split()))\n    if tokens:\n        n = tokens[0]\n        m = tokens[1]\n        queries = []\n        idx = 2\n        for _ in range(m):\n            queries.append((tokens[idx], tokens[idx + 1], tokens[idx + 2]))\n            idx += 3\n        print(array_manipulation(n, queries))`,
    explanation: 'Instead of adding K to every element in [A, B], we record delta changes at boundaries: diff[A] += K and diff[B + 1] -= K in O(1) per query. Once all queries are applied, the actual values are the prefix sums of diff. We track the running prefix sum and retain the maximum in O(N + M) total time.',
    timeComplexity: 'O(N + M) prefix sum difference sweep',
    spaceComplexity: 'O(N) difference array',
    learningTakeaway: 'Difference arrays transform batch range updates into constant O(1) boundary writes followed by a single linear prefix sweep.',
    testCases: [
      { input: '5 3 1 2 100 2 5 100 3 4 100', expectedOutput: '200', isHidden: false },
      { input: '4 3 2 3 603 1 1 286 4 4 882', expectedOutput: '882', isHidden: false },
      { input: '10 3 1 5 3 4 8 7 6 9 1', expectedOutput: '10', isHidden: true },
      { input: '5 1 1 5 50', expectedOutput: '50', isHidden: true }
    ]
  }
];

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'badge-t1',
    name: 'Pattern Architect',
    description: 'Mastered 2D coordinate patterns, pyramids, and geometric ASCII formatting.',
    topicCode: 'T1',
    icon: 'Sparkles',
    earningCriteria: 'Solve at least 2 pattern problems in Day 1',
    badgeDesignColor: '#0f172a',
    issuedCount: 142
  },
  {
    id: 'badge-t2',
    name: 'Array Vanguard',
    description: 'Demonstrated mastery over 1D sequences, binary search insertions, and frequency counts.',
    topicCode: 'T2',
    icon: 'Layers',
    earningCriteria: 'Solve at least 2 problems in Day 2',
    badgeDesignColor: '#1e293b',
    issuedCount: 128
  },
  {
    id: 'badge-t3',
    name: 'Sequence Strategist',
    description: 'Solved advanced two-pointer problems and calculated resilient medians.',
    topicCode: 'T3',
    icon: 'Zap',
    earningCriteria: 'Solve 2 problems in Day 3',
    badgeDesignColor: '#334155',
    issuedCount: 110
  },
  {
    id: 'badge-t4',
    name: 'Matrix Navigator',
    description: 'Conquered 2D grid traversals and warehouse snake navigation patterns.',
    topicCode: 'T4',
    icon: 'Grid',
    earningCriteria: 'Solve 2 problems in Day 4',
    badgeDesignColor: '#0f172a',
    issuedCount: 95
  },
  {
    id: 'badge-t5',
    name: 'Matrix Transformer',
    description: 'Mastered in-place matrix rotations, reflections, and diagonal mathematics.',
    topicCode: 'T5',
    icon: 'Compass',
    earningCriteria: 'Solve 2 problems in Day 5',
    badgeDesignColor: '#1e293b',
    issuedCount: 92
  },
  {
    id: 'badge-t6',
    name: 'String Alchemist',
    description: 'Demonstrated mastery in string manipulation, character frequencies, and encoding.',
    topicCode: 'T6',
    icon: 'FileText',
    earningCriteria: 'Solve 2 problems in Day 6',
    badgeDesignColor: '#334155',
    issuedCount: 89
  },
  {
    id: 'badge-t7',
    name: 'Substring Specialist',
    description: 'Conquered palindromic substrings, window bounds, and substring searches.',
    topicCode: 'T7',
    icon: 'Search',
    earningCriteria: 'Solve 2 problems in Day 7',
    badgeDesignColor: '#0f172a',
    issuedCount: 85
  },
  {
    id: 'badge-t8',
    name: 'Dictionary Specialist',
    description: 'Mastered hash map lookups, frequency hashing, and anagram grouping in O(1).',
    topicCode: 'T8',
    icon: 'Database',
    earningCriteria: 'Solve 2 problems in Day 8',
    badgeDesignColor: '#1e293b',
    issuedCount: 82
  },
  {
    id: 'badge-t9',
    name: 'Modular Engineer',
    description: 'Designed decoupled pure functions and single-pass leaders algorithms.',
    topicCode: 'T9',
    icon: 'Cpu',
    earningCriteria: 'Solve 2 problems in Day 9',
    badgeDesignColor: '#1e293b',
    issuedCount: 88
  },
  {
    id: 'badge-t10',
    name: 'Recursion Master',
    description: 'Unlocked recursive depth, call stack tracing, and mathematical induction.',
    topicCode: 'T10',
    icon: 'Award',
    earningCriteria: 'Solve 2 problems in Day 10',
    badgeDesignColor: '#b45309',
    issuedCount: 76
  }
];
