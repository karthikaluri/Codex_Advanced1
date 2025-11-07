const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Problem = require('./models/Problem');

dotenv.config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    await Problem.deleteMany({});

    const problems = [
      // 🟢 JavaScript
      {
        title: "Sum of Two Numbers (JS)",
        description: "Write a function that returns the sum of two numbers.",
        difficulty: "Easy",
        language: "javascript",
        starterCode: "function add(a, b) {\n  // Write your code here\n}",
        solution: "function add(a, b) { return a + b; }",
      },
      {
        title: "Reverse a String (JS)",
        description: "Given a string s, return it reversed.",
        difficulty: "Medium",
        language: "javascript",
        starterCode: "function reverseString(s) {\n  // Write your code here\n}",
        solution: "function reverseString(s) { return s.split('').reverse().join(''); }",
      },
      {
        title: "Fibonacci Sequence (JS)",
        description: "Return the nth Fibonacci number using recursion.",
        difficulty: "Hard",
        language: "javascript",
        starterCode: "function fibonacci(n) {\n  // Write your code here\n}",
        solution: "function fibonacci(n) { if (n<=1) return n; return fibonacci(n-1)+fibonacci(n-2); }",
      },

      // 🟣 Python
      {
        title: "Palindrome Check (Python)",
        description: "Check whether a given string is a palindrome.",
        difficulty: "Easy",
        language: "python",
        starterCode: "def is_palindrome(s):\n    # Write your code here",
        solution: "def is_palindrome(s):\n    s = ''.join(c.lower() for c in s if c.isalnum())\n    return s == s[::-1]",
      },
      {
        title: "Factorial (Python)",
        description: "Return the factorial of a given number n.",
        difficulty: "Medium",
        language: "python",
        starterCode: "def factorial(n):\n    # Write your code here",
        solution: "def factorial(n):\n    if n == 0:\n        return 1\n    return n * factorial(n-1)",
      },
      {
        title: "Two Sum (Python)",
        description: "Given an array of integers, find indices of two numbers that add up to target.",
        difficulty: "Hard",
        language: "python",
        starterCode: "def two_sum(nums, target):\n    # Write your code here",
        solution: "def two_sum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        diff = target - num\n        if diff in seen:\n            return [seen[diff], i]\n        seen[num] = i",
      },

      // 🔵 C++
      {
        title: "Sum of Array (C++)",
        description: "Find the sum of all elements in an array.",
        difficulty: "Easy",
        language: "cpp",
        starterCode: "#include <iostream>\n#include <vector>\nusing namespace std;\nint arraySum(vector<int> arr) {\n    // Write your code here\n}",
        solution: "#include <iostream>\n#include <vector>\nusing namespace std;\nint arraySum(vector<int> arr) {\n    int sum = 0;\n    for (int x : arr) sum += x;\n    return sum;\n}",
      },
      {
        title: "Find Maximum (C++)",
        description: "Return the maximum number in a vector.",
        difficulty: "Medium",
        language: "cpp",
        starterCode: "#include <iostream>\n#include <vector>\nusing namespace std;\nint findMax(vector<int> arr) {\n    // Write your code here\n}",
        solution: "#include <iostream>\n#include <vector>\nusing namespace std;\nint findMax(vector<int> arr) {\n    int mx = arr[0];\n    for (int x : arr) mx = max(mx, x);\n    return mx;\n}",
      },
      {
        title: "N-Queens Problem (C++)",
        description: "Solve the N-Queens problem and print all valid arrangements.",
        difficulty: "Hard",
        language: "cpp",
        starterCode: "#include <iostream>\nusing namespace std;\nvoid solveNQueens(int n) {\n    // Write your code here\n}",
        solution: "// N-Queens backtracking solution omitted for brevity (standard implementation).",
      },

      // 🟠 Java
      {
        title: "Even or Odd (Java)",
        description: "Determine if a number is even or odd.",
        difficulty: "Easy",
        language: "java",
        starterCode: "class Main {\n  public static boolean isEven(int n) {\n    // Write your code here\n  }\n}",
        solution: "class Main {\n  public static boolean isEven(int n) {\n    return n % 2 == 0;\n  }\n}",
      },
      {
        title: "Reverse Integer (Java)",
        description: "Reverse digits of an integer.",
        difficulty: "Medium",
        language: "java",
        starterCode: "class Main {\n  public static int reverse(int n) {\n    // Write your code here\n  }\n}",
        solution: "class Main {\n  public static int reverse(int n) {\n    int rev = 0;\n    while (n != 0) {\n      rev = rev * 10 + n % 10;\n      n /= 10;\n    }\n    return rev;\n  }\n}",
      },
      {
        title: "Longest Substring Without Repeating Characters (Java)",
        description: "Find the length of the longest substring without repeating characters.",
        difficulty: "Hard",
        language: "java",
        starterCode: "class Main {\n  public static int lengthOfLongestSubstring(String s) {\n    // Write your code here\n  }\n}",
        solution: "import java.util.*;\nclass Main {\n  public static int lengthOfLongestSubstring(String s) {\n    Set<Character> set = new HashSet<>();\n    int l = 0, ans = 0;\n    for (int r = 0; r < s.length(); r++) {\n      while (set.contains(s.charAt(r))) set.remove(s.charAt(l++));\n      set.add(s.charAt(r));\n      ans = Math.max(ans, r - l + 1);\n    }\n    return ans;\n  }\n}",
      },
    ];

    await Problem.insertMany(problems);
    console.log("✅ Database seeded with 12 problems in 4 languages!");
    process.exit();
  })
  .catch(err => console.error(err));
