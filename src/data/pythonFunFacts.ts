import { PythonFunFact } from '../types';

export const PYTHON_FUN_FACTS: PythonFunFact[] = [
  {
    id: 'fact-monty-python',
    title: 'Named After Monty Python, Not Snakes!',
    category: 'History & Origin',
    tagline: 'Guido van Rossum was inspired by British comedy sketches.',
    description:
      'When creator Guido van Rossum began implementing Python during Christmas week in December 1989 at CWI in Amsterdam, he was reading published scripts from "Monty Python\'s Flying Circus". Needing a short, unique, and slightly irreverent name, he chose Python! This is why Python documentation frequently uses "spam", "eggs", and "lumberjack" rather than generic "foo" and "bar".',
    codeSnippet: `# Traditional Python examples honor Monty Python sketches:
def breakfast_order(dish, spam_count=3):
    return f"{dish} served with {spam_count} portions of SPAM!"

print(breakfast_order("Sunny Eggs"))
# Output: Sunny Eggs served with 3 portions of SPAM!`,
    explanation:
      'The Python community culture is steeped in British comedy lore rather than reptilian mythology. Even Python package index PyPI was informally dubbed the "Cheese Shop" after another famous Monty Python sketch!',
    interactiveQuestion: {
      question: 'Why did creator Guido van Rossum name the programming language "Python"?',
      options: [
        'He owned a beloved pet Burmese Python while living in Amsterdam',
        'After the 1970s British comedy troupe "Monty Python\'s Flying Circus"',
        'It was a Dutch acronym for "Processing Yield for Theoretical High-Order Notation"',
        'Inspired by the mythological serpent Delphyne from Apollo legends'
      ],
      correctIndex: 1,
      explanation:
        'Correct! Guido was reading published scripts of BBC\'s Monty Python\'s Flying Circus and wanted a snappy, memorable name.'
    },
    rewardPoints: 25
  },
  {
    id: 'fact-zen-of-python',
    title: 'The Zen of Python (import this)',
    category: 'Easter Egg',
    tagline: 'Nineteen timeless engineering aphorisms baked into the compiler.',
    description:
      'Typing "import this" inside any Python interpreter prints "The Zen of Python" by longtime core developer Tim Peters. It contains 19 guiding philosophies including "Beautiful is better than ugly", "Explicit is better than implicit", "Simple is better than complex", and "Readability counts". The 20th aphorism was intentionally never written!',
    codeSnippet: `import this

# The source code in this.py is actually ROT13 encoded!
# print("".join([this.d.get(c, c) for c in this.s]))`,
    explanation:
      'The Zen of Python is immortalized as PEP 20. Whenever developers debate design choices for Python Enhancement Proposals (PEPs), they cite these aphorisms to preserve Python\'s elegant readability.',
    interactiveQuestion: {
      question: 'What happens when you run `import this` in a Python terminal?',
      options: [
        'It imports the JavaScript-style `this` keyword context',
        'It displays the 19 guiding aphorisms known as "The Zen of Python"',
        'It throws an unresolved ModuleNotFoundError',
        'It launches the official Python software foundation homepage'
      ],
      correctIndex: 1,
      explanation:
        'Exactly! Tim Peters penned 19 aphorisms (leaving the 20th blank for Guido) summarizing Pythonic software architecture.'
    },
    rewardPoints: 25
  },
  {
    id: 'fact-antigravity',
    title: 'Flying with Antigravity (import antigravity)',
    category: 'Easter Egg',
    tagline: 'XKCD Comic #353 is permanently part of the Python Standard Library.',
    description:
      'In 2008, popular webcomic XKCD published comic #353 where a character floats into the sky because Python code makes programming feel effortless. Python developers loved it so much that they added an official `antigravity` module in Python 3. Running `import antigravity` opens your default web browser directly to that comic!',
    codeSnippet: `import antigravity

# In Python 3, this module uses the 'webbrowser' library
# to immediately navigate to: https://xkcd.com/353/`,
    explanation:
      'The module source code in `Lib/antigravity.py` is literally just 10 lines of code that calls `webbrowser.open("https://xkcd.com/353/")`. It also includes a hidden geohashing algorithm function implementation in the standard library!',
    interactiveQuestion: {
      question: 'What is the primary action of Python\'s built-in `antigravity` module?',
      options: [
        'It reverses the sorting order of global symbol tables',
        'It opens your default browser to the famous XKCD #353 "Python" webcomic',
        'It calculates gravitational pull for space flight telemetry',
        'It simulates UI elements floating off the screen'
      ],
      correctIndex: 1,
      explanation:
        'Spot on! It is a tribute to XKCD #353 where the programmer exclaimed: "I wrote 20 lines of code, that\'s what! Everything is so clean!"'
    },
    rewardPoints: 25
  },
  {
    id: 'fact-braces-not-a-chance',
    title: 'Curly Braces? "Not a Chance!"',
    category: 'Easter Egg',
    tagline: 'Python developers made it syntactically impossible to add C-style braces.',
    description:
      'Programmers accustomed to C, C++, or Java often wished Python supported curly braces `{}` instead of meaningful whitespace indentation. To settle the debate once and for all, the core developers added an easter egg to the `__future__` module: executing `from __future__ import braces` raises an explicit syntax error saying "not a chance"!',
    codeSnippet: `try:
    from __future__ import braces
except SyntaxError as e:
    print(f"Interpreter response: {e}")
    # Prints: Interpreter response: not a chance`,
    explanation:
      'The Python philosophy mandates that indentation is not mere decorative styling—it is an unambiguous syntax rule that ensures code looks the same to the human eye as it behaves for the interpreter.',
    interactiveQuestion: {
      question: 'What error message is triggered by `from __future__ import braces`?',
      options: [
        'FeatureWarning: Scheduled for Python 4.0',
        'SyntaxError: not a chance',
        'ImportError: No module named braces',
        'IndentationError: unexpected curly bracket'
      ],
      correctIndex: 1,
      explanation:
        'Correct! The compiler explicitly responds with `SyntaxError: not a chance` to confirm Python will never adopt curly braces for block scoping.'
    },
    rewardPoints: 25
  },
  {
    id: 'fact-tuple-comma',
    title: 'The Comma Creates the Tuple, Not Parentheses!',
    category: 'Syntax Magic',
    tagline: 'Parentheses are merely for grouping; the comma is the true constructor.',
    description:
      'Almost every beginner believes parentheses define a tuple in Python. In reality, it is the humble comma `,` that creates the tuple! Writing `x = 42,` creates a 1-element tuple `(42,)`. Parentheses are only required for the empty tuple `()` or when resolving syntactic ambiguity in function calls.',
    codeSnippet: `# Comma creates the tuple:
single_item = 42,
print(type(single_item))  # <class 'tuple'>
print(single_item)        # (42,)

# Parentheses without comma are just mathematical grouping:
not_a_tuple = (42)
print(type(not_a_tuple))  # <class 'int'>`,
    explanation:
      'Understanding this distinction prevents one of Python\'s most common bugs: accidentally leaving a trailing comma at the end of a line in a dictionary or variable assignment turns your scalar into a 1-element tuple!',
    interactiveQuestion: {
      question: 'In Python, what is the type of `value = (42)` without a trailing comma?',
      options: [
        'tuple',
        'int',
        'generator',
        'syntax error'
      ],
      correctIndex: 1,
      explanation:
        'Right! `(42)` is just the integer 42 inside arithmetic parentheses. To make it a tuple, you must write `(42,)` with a comma.'
    },
    rewardPoints: 30
  },
  {
    id: 'fact-small-integer-caching',
    title: 'Integer Caching: The -5 to 256 Memory Pool',
    category: 'Python Quirk',
    tagline: 'Small integers share identity because CPython pre-allocates them at boot.',
    description:
      'CPython maintains an internal global array of integer objects for values between -5 and 256 inclusive. When you create an integer in this range, Python points directly to the pre-existing singleton in memory instead of allocating a new object. Consequently, `a = 256; b = 256; a is b` is True!',
    codeSnippet: `a = 256
b = 256
print(a is b)  # True (Exact same object in memory)

# Outside the pre-allocated range:
x = 257
y = 257
print(x is y)  # False in standard REPL! (Two distinct objects)
print(x == y)  # True (Values match, but distinct IDs)`,
    explanation:
      'This optimization saves substantial memory allocations and CPU cache invalidations because integers like 0, 1, 10, and 255 occur constantly in loops, index calculations, and byte operations.',
    interactiveQuestion: {
      question: 'What range of integers does CPython pre-cache into a singleton memory array?',
      options: [
        '0 to 100',
        '-5 to 256',
        '-128 to 127',
        'All 32-bit positive integers'
      ],
      correctIndex: 1,
      explanation:
        'Correct! -5 to 256 are pre-allocated by CPython. Values outside this window receive newly allocated heap objects.'
    },
    rewardPoints: 30
  },
  {
    id: 'fact-for-else-construct',
    title: 'Loops in Python Have an "else" Clause!',
    category: 'Syntax Magic',
    tagline: 'The else block runs only when no "break" statement interrupts the loop.',
    description:
      'Python supports an `else` block after `for` and `while` loops. Many developers find the name counter-intuitive, but it serves a crucial purpose: the `else` block executes ONLY when the loop finishes naturally through exhaustion, without hitting a `break` statement! Think of it as "else if no break".',
    codeSnippet: `def check_prime(n):
    for i in range(2, int(n**0.5) + 1):
        if n % i == 0:
            print(f"{n} is composite (divisible by {i})")
            break
    else:
        # Runs ONLY if the loop ran to completion without break!
        print(f"{n} is prime!")

check_prime(17) # Output: 17 is prime!`,
    explanation:
      'Without loop-else, developers typically must declare auxiliary flags like `found = False` before loops and check `if not found:` afterward. Python\'s loop-else eliminates the boilerplate entirely.',
    interactiveQuestion: {
      question: 'When does a Python loop\'s `else` clause execute?',
      options: [
        'When the loop throws an unhandled exception',
        'When the loop terminates naturally without encountering a `break`',
        'Only if the iterable collection was empty (0 iterations)',
        'During every single step of the loop'
      ],
      correctIndex: 1,
      explanation:
        'Spot on! The `else` block triggers only when the loop completes all iterations without early termination by `break`.'
    },
    rewardPoints: 30
  },
  {
    id: 'fact-black-hole-imaging',
    title: 'Python Photographed the First Black Hole',
    category: 'Real-World',
    tagline: 'NumPy, SciPy, and Astropy unified petabytes of radio telescope data.',
    description:
      'In April 2019, humanity saw the first direct photograph of a supermassive black hole (M87*, 55 million light-years away). The Event Horizon Telescope collected 5 petabytes of data on 1,000 hard drives from 8 observatories across the globe. Dr. Katie Bouman and the imaging team processed and reconstructed the image using Python\'s scientific stack!',
    codeSnippet: `# The EHT imaging algorithms (e.g. eht-imaging library)
# relied on Python, NumPy, SciPy, and Matplotlib:
import numpy as np

# Petabytes of interferometry data combined into synthetic aperture
print("M87* Black Hole: 55 million light-years imaged via Python")`,
    explanation:
      'Because Python provides high-level algorithmic ergonomics with C-accelerated numeric crunching via NumPy and BLAS/LAPACK, it has become the default language of astrophysics, particle physics at CERN, and genomics.',
    interactiveQuestion: {
      question: 'Which open-source Python libraries formed the core imaging pipeline for the Event Horizon Telescope\'s black hole photo?',
      options: [
        'Django, Flask, and Jinja',
        'NumPy, SciPy, Matplotlib, and Astropy',
        'Pygame, Turtle, and Arcade',
        'FastAPI, SQLAlchemy, and Celery'
      ],
      correctIndex: 1,
      explanation:
        'Correct! Scientific Python (NumPy, SciPy, Astropy) was instrumental in synchronizing atomic clocks and synthesizing the radio telescope apertures.'
    },
    rewardPoints: 30
  },
  {
    id: 'fact-walrus-operator',
    title: 'The Walrus Operator (:=) and Its Adorable Name',
    category: 'Syntax Magic',
    tagline: 'Named because := looks like two eyes and two tusks of a walrus.',
    description:
      'Introduced in Python 3.8 (PEP 572), assignment expressions use the operator `:=`. Because the colon `:` looks like eyes and the equals sign `=` looks like whiskers/tusks sideways, the community affectionately coined it the "Walrus Operator". It allows assigning values to variables inside expressions like `while (line := file.readline()):`.',
    codeSnippet: `data = ["Python", "Algorithms", "DSA", "Fortune500"]

# Assign length and evaluate in a single line:
if (count := len(data)) >= 4:
    print(f"Full curriculum unlocked with {count} enterprise tracks!")`,
    explanation:
      'Before PEP 572, you had to either repeat expressions (calling an expensive function twice) or declare intermediate variables on separate lines before the condition.',
    interactiveQuestion: {
      question: 'What does the Walrus operator `:=` allow you to do in Python 3.8+?',
      options: [
        'Compare two objects for strict byte equality',
        'Assign a value to a variable directly within an expression',
        'Instantiate a new generator comprehension',
        'Force garbage collection on cyclic references'
      ],
      correctIndex: 1,
      explanation:
        'Exactly! `:=` enables inline assignment expressions, reducing redundant function evaluations.'
    },
    rewardPoints: 25
  },
  {
    id: 'fact-chained-comparisons',
    title: 'Mathematical Chained Comparisons (1 < x < 10)',
    category: 'Syntax Magic',
    tagline: 'Python parses 1 < x < 10 with mathematical fidelity and single evaluation.',
    description:
      'In languages like C or JavaScript, `1 < x < 10` executes as `(1 < x) < 10`. Since `(1 < x)` evaluates to `true` or `1`, `1 < 10` is always true regardless of `x`! In Python, chained comparisons work like real mathematics: `1 < x < 10` translates to `1 < x and x < 10`, and `x` is evaluated only once.',
    codeSnippet: `x = 5

# Clean mathematical range check:
if 1 <= x <= 10:
    print(f"{x} is neatly inside [1, 10]!")

# You can even chain multiple different operators:
print(1 < 5 == 5 < 10)  # True! Evaluates 1 < 5 and 5 == 5 and 5 < 10`,
    explanation:
      'Chained comparisons not only look intuitive and clean, but they also prevent side effects because middle expressions are evaluated strictly once.',
    interactiveQuestion: {
      question: 'How does Python evaluate the expression `1 < x < 10`?',
      options: [
        'It converts `(1 < x)` to a boolean and checks `bool < 10`',
        'It evaluates `1 < x and x < 10`, evaluating `x` only once',
        'It raises a SyntaxError requiring explicit `and` operators',
        'It converts the numbers to a range generator'
      ],
      correctIndex: 1,
      explanation:
        'Correct! Python evaluates it as a mathematical chain `1 < x and x < 10`, evaluating the middle operand only once.'
    },
    rewardPoints: 25
  }
];
