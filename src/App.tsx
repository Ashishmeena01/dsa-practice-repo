import { useEffect, useMemo, useRef, useState, type CSSProperties, type FormEvent } from 'react'
import { ArrowDown, ArrowDownUp, ArrowRight, ArrowUp, Bookmark, Check, CircleDot, CircleHelp, ExternalLink, Flame, LayoutDashboard, ListChecks, Moon, Orbit, Plus, Search, SlidersHorizontal, Sparkles, Sun, Target, Trash2, X } from 'lucide-react'
import './simple.css'
import CanvasCom from './components/CanvasCom'

type Difficulty = 'Easy' | 'Medium' | 'Hard'
type Problem = { id: number; title: string; topic: string; difficulty: Difficulty; slug: string; note: string }
type Progress = Record<number, 'solved' | 'attempted'>
const starterProblems: Problem[] = [
  {id:1,title:'Two Sum',topic:'Arrays & Hashing',difficulty:'Easy',slug:'two-sum',note:'Hash map · complement lookup'},
  {id:217,title:'Contains Duplicate',topic:'Arrays & Hashing',difficulty:'Easy',slug:'contains-duplicate',note:'Set · duplicate detection'},
  {id:242,title:'Valid Anagram',topic:'Arrays & Hashing',difficulty:'Easy',slug:'valid-anagram',note:'Frequency counting'},
  {id:49,title:'Group Anagrams',topic:'Arrays & Hashing',difficulty:'Medium',slug:'group-anagrams',note:'Hashing · canonical keys'},
  {id:238,title:'Product of Array Except Self',topic:'Arrays & Hashing',difficulty:'Medium',slug:'product-of-array-except-self',note:'Prefix and suffix products'},
  {id:128,title:'Longest Consecutive Sequence',topic:'Arrays & Hashing',difficulty:'Medium',slug:'longest-consecutive-sequence',note:'Set · linear scan'},
  {id:125,title:'Valid Palindrome',topic:'Two Pointers',difficulty:'Easy',slug:'valid-palindrome',note:'Two pointers · string cleanup'},
  {id:167,title:'Two Sum II - Input Array Is Sorted',topic:'Two Pointers',difficulty:'Medium',slug:'two-sum-ii-input-array-is-sorted',note:'Sorted input · inward pointers'},
  {id:15,title:'3Sum',topic:'Two Pointers',difficulty:'Medium',slug:'3sum',note:'Sorting · duplicate handling'},
  {id:11,title:'Container With Most Water',topic:'Two Pointers',difficulty:'Medium',slug:'container-with-most-water',note:'Greedy pointer movement'},
  {id:121,title:'Best Time to Buy and Sell Stock',topic:'Sliding Window',difficulty:'Easy',slug:'best-time-to-buy-and-sell-stock',note:'Track minimum so far'},
  {id:3,title:'Longest Substring Without Repeating Characters',topic:'Sliding Window',difficulty:'Medium',slug:'longest-substring-without-repeating-characters',note:'Variable window · last seen index'},
  {id:424,title:'Longest Repeating Character Replacement',topic:'Sliding Window',difficulty:'Medium',slug:'longest-repeating-character-replacement',note:'Window invariant · frequency counts'},
  {id:239,title:'Sliding Window Maximum',topic:'Sliding Window',difficulty:'Hard',slug:'sliding-window-maximum',note:'Monotonic deque'},
  {id:20,title:'Valid Parentheses',topic:'Stacks & Queues',difficulty:'Easy',slug:'valid-parentheses',note:'Stack · matching pairs'},
  {id:155,title:'Min Stack',topic:'Stacks & Queues',difficulty:'Medium',slug:'min-stack',note:'Stack with cached minimum'},
  {id:739,title:'Daily Temperatures',topic:'Stacks & Queues',difficulty:'Medium',slug:'daily-temperatures',note:'Monotonic stack'},
  {id:206,title:'Reverse Linked List',topic:'Linked Lists',difficulty:'Easy',slug:'reverse-linked-list',note:'Pointer rewiring · iterative'},
  {id:21,title:'Merge Two Sorted Lists',topic:'Linked Lists',difficulty:'Easy',slug:'merge-two-sorted-lists',note:'Dummy head · merge'},
  {id:141,title:'Linked List Cycle',topic:'Linked Lists',difficulty:'Easy',slug:'linked-list-cycle',note:'Floyd slow and fast pointers'},
  {id:19,title:'Remove Nth Node From End of List',topic:'Linked Lists',difficulty:'Medium',slug:'remove-nth-node-from-end-of-list',note:'Two pointers · sentinel node'},
  {id:226,title:'Invert Binary Tree',topic:'Trees',difficulty:'Easy',slug:'invert-binary-tree',note:'DFS · recursive traversal'},
  {id:104,title:'Maximum Depth of Binary Tree',topic:'Trees',difficulty:'Easy',slug:'maximum-depth-of-binary-tree',note:'DFS · height'},
  {id:102,title:'Binary Tree Level Order Traversal',topic:'Trees',difficulty:'Medium',slug:'binary-tree-level-order-traversal',note:'BFS · queue'},
  {id:98,title:'Validate Binary Search Tree',topic:'Trees',difficulty:'Medium',slug:'validate-binary-search-tree',note:'DFS · value bounds'},
  {id:230,title:'Kth Smallest Element in a BST',topic:'Trees',difficulty:'Medium',slug:'kth-smallest-element-in-a-bst',note:'Inorder traversal'},
  {id:703,title:'Kth Largest Element in a Stream',topic:'Heaps & Priority Queue',difficulty:'Easy',slug:'kth-largest-element-in-a-stream',note:'Min heap of size k'},
  {id:215,title:'Kth Largest Element in an Array',topic:'Heaps & Priority Queue',difficulty:'Medium',slug:'kth-largest-element-in-an-array',note:'Heap or quickselect'},
  {id:56,title:'Merge Intervals',topic:'Sorting & Intervals',difficulty:'Medium',slug:'merge-intervals',note:'Sort by start · sweep'},
  {id:704,title:'Binary Search',topic:'Binary Search',difficulty:'Easy',slug:'binary-search',note:'Inclusive bounds · halve search'},
  {id:33,title:'Search in Rotated Sorted Array',topic:'Binary Search',difficulty:'Medium',slug:'search-in-rotated-sorted-array',note:'Identify sorted half'},
  {id:912,title:'Sort an Array',topic:'Sorting & Searching',difficulty:'Medium',slug:'sort-an-array',note:'Implement merge sort or heap sort'},
  {id:17,title:'Letter Combinations of a Phone Number',topic:'Recursion & Backtracking',difficulty:'Medium',slug:'letter-combinations-of-a-phone-number',note:'Build choices with recursive backtracking'},
  {id:78,title:'Subsets',topic:'Recursion & Backtracking',difficulty:'Medium',slug:'subsets',note:'Decision tree · include or exclude'},
  {id:39,title:'Combination Sum',topic:'Recursion & Backtracking',difficulty:'Medium',slug:'combination-sum',note:'Backtracking · reuse candidates'},
  {id:208,title:'Implement Trie (Prefix Tree)',topic:'Tries',difficulty:'Medium',slug:'implement-trie-prefix-tree',note:'Prefix tree · insert and search'},
  {id:55,title:'Jump Game',topic:'Greedy',difficulty:'Medium',slug:'jump-game',note:'Track the farthest reachable index'},
  {id:200,title:'Number of Islands',topic:'Graphs',difficulty:'Medium',slug:'number-of-islands',note:'Grid DFS/BFS · visited set'},
  {id:133,title:'Clone Graph',topic:'Graphs',difficulty:'Medium',slug:'clone-graph',note:'DFS · original-to-copy map'},
  {id:207,title:'Course Schedule',topic:'Graphs',difficulty:'Medium',slug:'course-schedule',note:'Topological sort · cycle check'},
  {id:70,title:'Climbing Stairs',topic:'Dynamic Programming',difficulty:'Easy',slug:'climbing-stairs',note:'1D DP · overlapping subproblems'},
  {id:198,title:'House Robber',topic:'Dynamic Programming',difficulty:'Medium',slug:'house-robber',note:'Take or skip recurrence'},
  {id:322,title:'Coin Change',topic:'Dynamic Programming',difficulty:'Medium',slug:'coin-change',note:'Unbounded knapsack'},
  {id:300,title:'Longest Increasing Subsequence',topic:'Dynamic Programming',difficulty:'Medium',slug:'longest-increasing-subsequence',note:'DP · binary search optimization'},
  {id:136,title:'Single Number',topic:'Bit Manipulation',difficulty:'Easy',slug:'single-number',note:'XOR properties'},
  {id:191,title:'Number of 1 Bits',topic:'Bit Manipulation',difficulty:'Easy',slug:'number-of-1-bits',note:'Brian Kernighan bit trick'},
  {id:190,title:'Reverse Bits',topic:'Bit Manipulation',difficulty:'Easy',slug:'reverse-bits',note:'Shift and mask'},
]

// The original app's curated starter set is kept alongside the Cohort 3.0
// syllabus items below. Each syllabus entry uses its syllabus number as id so
// progress remains easy to identify against the source document.
const syllabusRows: Array<[number, string, string, Difficulty, string]> = [
  [1,'Sum of two integers','Programming Basics','Easy','Input → Process → Output'],[2,'Print message with values and sum','Programming Basics','Easy','Expression Evaluation'],[3,'Accept two integers and print sum','Programming Basics','Easy','Input → Process → Output'],[4,'Accept name, age and print formatted output','Programming Basics','Easy','Input → Output Formatting'],[5,'Increment & Decrement operator practice','Programming Basics','Easy','Variable Manipulation'],[6,'Swap two numbers (with & without 3rd variable)','Programming Basics','Easy','Swap Pattern'],[7,'Rectangle area & perimeter calculation','Programming Basics','Easy','Formula Based'],[8,'Compound Interest','Programming Basics','Easy','Mathematical Simulation'],[9,"Triangle area using Heron's formula",'Programming Basics','Medium','Formula + Multi-step Calculation'],
  [10,'Greatest between two numbers','Control Flow','Easy','Comparison'],[11,'Gender-based greeting message','Control Flow','Easy','Conditional Mapping'],[12,'Handle wrong gender input + validation','Control Flow','Easy','Input Validation'],[13,'Check even or odd','Control Flow','Easy','Modulo Check'],[14,'Voter eligibility check (+ years left)','Control Flow','Medium','Conditional + Calculation'],[15,'Day name from number (1–7)','Control Flow','Easy','Mapping / Conditional'],[16,'Greatest among three numbers','Control Flow','Easy','Nested Comparison'],[17,'Leap year check','Control Flow','Easy','Mathematical Condition'],[18,'Shop discount calculation','Control Flow','Medium','Conditional + Formula'],[19,'Electricity bill calculation','Control Flow','Medium','Slab Based Calculation'],
  [20,'Print "Hello World" n times','Loops & Switch','Easy','Iteration'],[21,'Print natural numbers up to n','Loops & Switch','Easy','Iteration'],[22,'Print n to 1 (reverse loop)','Loops & Switch','Easy','Reverse Iteration'],[23,'Multiplication table of a number','Loops & Switch','Easy','Iteration + Formula'],[24,'Sum up to n terms','Loops & Switch','Easy','Accumulation'],[25,'Sum of even & odd numbers separately','Loops & Switch','Easy','Conditional + Accumulation'],[26,'Print all factors of a number','Loops & Switch','Medium','Factor Pattern'],[27,'Sum of all factors','Loops & Switch','Medium','Factor + Accumulation'],[28,'Prime number check','Loops & Switch','Medium','Factor Pattern'],[29,'Power of a number (a^b)','Loops & Switch','Medium','Repeated Multiplication'],[30,'Print each digit of a number','Loops & Switch','Medium','Digit Extraction'],[31,'Sum of digits','Loops & Switch','Medium','Digit Extraction + Accumulation'],[32,'Reverse a number','Loops & Switch','Medium','Digit Manipulation'],[33,'Palindrome number check','Loops & Switch','Medium','Digit Manipulation'],[34,'Strong number check','Loops & Switch','Medium','Digit + Factorial'],[35,'Automorphic number','Loops & Switch','Medium','Mathematical Pattern'],[36,'Print "Hello" until wrong input (do-while)','Loops & Switch','Easy','Sentinel Loop'],[37,'Menu-driven calculator (do-while)','Loops & Switch','Medium','Menu Loop'],[38,'Print weekday using switch','Loops & Switch','Easy','Mapping (Switch)'],[39,'Check vowel/consonant using switch','Loops & Switch','Easy','Character Mapping'],[40,'Project - Guess Game','Loops & Switch','Medium','Simulation + Loop'],[41,'Right Triangle - Star Pattern','Loops & Switch','Easy','Nested Loop Pattern'],[42,'Right Triangle - Number Pattern','Loops & Switch','Easy','Nested Loop Pattern'],[43,'Right Triangle - Alphabet Pattern','Loops & Switch','Easy','Nested Loop Pattern'],[44,'Inverted Right Triangle Pattern','Loops & Switch','Medium','Nested Loop Pattern'],[45,'Mirrored Right Triangle Pattern','Loops & Switch','Medium','Nested Loop Pattern'],[46,'Triangle Pattern','Loops & Switch','Medium','Nested Loop Pattern'],[47,'V Pattern','Loops & Switch','Medium','Pattern Logic'],[48,'X Pattern','Loops & Switch','Medium','Pattern Logic'],
  [49,'Sum & average of array elements','Arrays Level 1','Easy','Traversal + Accumulation'],[50,'Find greatest element','Arrays Level 1','Easy','Max Tracking'],[51,'Find second greatest element','Arrays Level 1','Medium','Max Tracking'],[52,'Check if array is sorted','Arrays Level 1','Easy','Traversal + Comparison'],[53,'Reverse copy of array','Arrays Level 1','Easy','Traversal + Reverse'],[54,'Left rotation by 1','Arrays Level 1','Easy','Rotation'],[55,'Left rotation by K','Arrays Level 1','Medium','Rotation'],[56,'Reverse array without extra space','Arrays Level 1','Easy','Two Pointer'],[57,'Move negatives to left, positives to right','Arrays Level 1','Medium','Partition / Two Pointer'],[58,'Count subarrays with given sum','Arrays Level 1','Medium','Prefix Sum'],
  [59,'Bubble Sort','Sorting','Easy','Comparison + Swapping'],[60,'Insertion Sort','Sorting','Easy','Insertion + Shifting'],[61,'Selection Sort','Sorting','Easy','Selection + Swapping'],[62,'Matrix Diagonal Sum','Matrix','Easy','Traversal'],[63,'Transpose Matrix','Matrix','Easy','Index Transformation'],[64,'Flipping an Image','Matrix','Easy','Two Pointer (Row-wise)'],[65,'Rotate Image','Matrix','Medium','Transpose + Reverse'],[66,'Search a 2D Matrix','Matrix','Medium','Binary Search'],[67,'Set Matrix Zeroes','Matrix','Medium','Marking / In-place'],[68,'Design Private Cab Service','OOPS','Medium','Object Modeling'],[69,'Design Railway Ticket Class','OOPS','Easy','Class Design'],
  [70,'Print each character of string','String','Easy','Traversal'],[71,'Reverse a string','String','Easy','Two Pointer'],[72,'Palindrome using method (Two Pointer)','String','Easy','Two Pointer'],[73,'Count vowels and consonants','String','Easy','Character Classification'],[74,'Toggle each alphabet','String','Medium','Character Manipulation'],[75,'Count strings with given prefix','String','Medium','Prefix Matching'],[76,'Capitalize first & last character of each word','String','Medium','String Manipulation'],[77,'Maximum number of words in sentences','String','Easy','String Parsing'],[78,'Frequency of each character','String','Medium','Hashing'],[79,'Check anagram strings','String','Medium','Hashing / Sorting'],[80,'Sort words in a sentence','String','Medium','Sorting + Parsing'],[81,'Rotate string','String','Medium','String Manipulation'],[82,'Print unique elements in array','Collections','Easy','HashSet'],[83,'Frequency of elements in array','Collections','Easy','HashMap (Hashing)'],[84,'Jewels and Stones','Collections','Easy','Hashing'],[85,'Check if sentence is pangram','Collections','Easy','HashSet'],[86,'First letter to appear twice','Collections','Easy','Hashing'],[87,'Sum of unique elements','Collections','Easy','HashSet + Traversal'],[88,'Sort the People','Collections','Medium','HashMap + Sorting'],[89,'Most Frequent Even Element','Collections','Medium','HashMap + Frequency'],
  [90,'Print name N times','Recursion','Easy','Recursion (Linear)'],[91,'Print 1 to N','Recursion','Easy','Recursion (Forward)'],[92,'Print N to 1','Recursion','Easy','Recursion (Backward)'],[93,'Sum of first N numbers','Recursion','Easy','Recursion (Accumulation)'],[94,'Factorial of a number','Recursion','Easy','Recursion (Multiplicative)'],[95,'Reverse an array','Recursion','Easy','Recursion + Two Pointer'],[96,'Check palindrome string','Recursion','Easy','Recursion + Two Pointer'],[97,'Fibonacci number','Recursion','Easy','Recursion (Tree)'],[98,'GCD / HCF of two numbers','Mathematics','Easy','Euclidean Algorithm'],[99,'GCD of array','Mathematics','Medium','GCD Reduction'],[100,'LCM of two numbers','Mathematics','Easy','GCD + Formula'],[101,'Count digits of a number','Mathematics','Easy','Logarithmic Trick'],[102,'Median of data','Mathematics','Easy','Sorting / Logic'],[103,'Palindromic number','Mathematics','Easy','Digit Manipulation'],[104,'Factors of a number','Mathematics','Easy','Factor Pattern (√n)'],[105,'Prime number check','Mathematics','Easy','Factor Pattern (√n)'],[106,'Count primes (Sieve of Eratosthenes)','Mathematics','Medium','Sieve Technique'],[107,'Kth factor of n','Mathematics','Medium','Factor Traversal'],[108,'Square root (Integer)','Mathematics','Medium','Binary Search'],[109,'Power (x^n)','Mathematics','Medium','Fast Exponentiation'],[110,'Power of Two','Mathematics','Easy','Bit Manipulation'],
  [111,'Max Consecutive Ones','Arrays Level 2','Easy','Sliding Window'],[112,'Merge Sorted Array','Arrays Level 2','Easy','Two Pointer'],[113,'Remove Duplicates from Sorted Array','Arrays Level 2','Easy','Two Pointer'],[114,'Duplicate Zeros','Arrays Level 2','Easy','Simulation'],[115,'Valid Mountain Array','Arrays Level 2','Easy','Traversal'],[116,'Replace Elements with Greatest on Right','Arrays Level 2','Easy','Reverse Traversal'],[117,'Squares of a Sorted Array','Arrays Level 2','Easy','Two Pointer'],[118,'Move Zeroes','Arrays Level 2','Easy','Two Pointer'],[119,'Sort Array By Parity','Arrays Level 2','Easy','Partition / Two Pointer'],[120,'Fibonacci Number','Arrays Level 2','Easy','DP / Iteration'],[121,'Two Sum','Arrays Level 2','Easy','Hashing'],[122,'Running Sum of 1D Array','Arrays Level 2','Easy','Prefix Sum'],[123,'Find Pivot Index','Arrays Level 2','Easy','Prefix Sum'],[124,'Product of Array Except Self','Arrays Level 2','Medium','Prefix + Suffix'],[125,'Maximum Subarray (Kadane’s Algo)','Arrays Level 2','Medium','Kadane'],[126,'Majority Element (Boyer Moore)','Arrays Level 2','Medium','Voting Algorithm'],[127,'3Sum','Arrays Level 2','Medium','Sorting + Two Pointer'],[128,'Best Time to Buy & Sell Stock','Arrays Level 2','Easy','Kadane / Greedy'],[129,'Best Time to Buy & Sell Stock II','Arrays Level 2','Medium','Greedy'],[130,'Trapping Rain Water','Arrays Level 2','Hard','Two Pointer'],[131,'Container With Most Water','Arrays Level 2','Medium','Two Pointer'],[132,'Missing Number','Sorting Algorithms','Easy','Cyclic Sort'],[133,'Find All Numbers Disappeared in an Array','Sorting Algorithms','Easy','Cyclic Sort'],[134,'Set Mismatch','Sorting Algorithms','Easy','Cyclic Sort'],[135,'Find All Duplicates in an Array','Sorting Algorithms','Medium','Cyclic Sort'],[136,'Find the Duplicate Number','Sorting Algorithms','Medium','Cycle Detection'],[137,'First Missing Positive','Sorting Algorithms','Hard','Cyclic Sort'],
  [138,'Binary Search on descending array','Binary Search','Easy','Binary Search'],[139,'Order Agnostic Binary Search','Binary Search','Easy','Binary Search'],[140,'Guess Number Higher or Lower','Binary Search','Easy','Binary Search'],[141,'Search Insert Position','Binary Search','Easy','Binary Search'],[142,'Ceiling of a number','Binary Search','Easy','Binary Search'],[143,'Floor of a number','Binary Search','Easy','Binary Search'],[144,'Smallest letter greater than target','Binary Search','Easy','Binary Search'],[145,'Valid Perfect Square','Binary Search','Easy','Binary Search'],[146,'First Bad Version','Binary Search','Easy','Binary Search'],[147,'First and Last Position in Sorted Array','Binary Search','Medium','Binary Search'],[148,'Count of element in sorted array','Binary Search','Medium','Binary Search'],[149,'Peak in Mountain / Bitonic array','Binary Search','Medium','Binary Search'],[150,'Search in Mountain / Bitonic array','Binary Search','Medium','Binary Search'],[151,'Minimum in Rotated Sorted Array','Binary Search','Medium','Binary Search'],[152,'Search in Rotated Sorted Array','Binary Search','Medium','Binary Search'],[153,'Search in Infinite Sorted Array','Binary Search','Medium','Binary Search'],[154,'Book Allocation Problem','Binary Search','Hard','Binary Search on Answer'],[155,'Capacity to Ship Packages','Binary Search','Hard','Binary Search on Answer'],[156,'Minimum Days to Make Bouquets','Binary Search','Hard','Binary Search on Answer'],[157,'Smallest Divisor Given Threshold','Binary Search','Hard','Binary Search on Answer'],[158,'Koko Eating Bananas','Binary Search','Hard','Binary Search on Answer'],[159,'Split Array Largest Sum','Binary Search','Hard','Binary Search on Answer'],[160,'Aggressive Cows','Binary Search','Hard','Binary Search on Answer'],
  [161,'Intersection of Two Arrays','Hashing','Easy','HashSet'],[162,'Intersection of Two Arrays II','Hashing','Easy','HashMap'],[163,'Subarray Sum Equals K (Positive)','Hashing','Easy','Sliding Window'],[164,'Subarray Sum Equals K','Hashing','Medium','Prefix Sum + HashMap'],[165,'Subarray with 0 Sum','Hashing','Medium','Prefix Sum + HashSet'],[166,'Longest Subarray with Sum K','Hashing','Medium','Prefix Sum + HashMap'],[167,'Contiguous Array','Hashing','Medium','Prefix Sum + HashMap'],[168,'Longest Consecutive Sequence','Hashing','Medium','HashSet'],[169,'Count distinct elements in every window','Hashing','Medium','Sliding Window + HashMap'],[170,'Insert Delete GetRandom O(1)','Hashing','Hard','HashMap + Design'],
  [171,'Design Linked List','Linked List','Easy','Implementation'],[172,'Middle of Linked List','Linked List','Easy','Two Pointer (Tortoise & Hare)'],[173,'Merge Two Sorted Lists','Linked List','Easy','Two Pointer'],[174,'Linked List Cycle','Linked List','Easy','Cycle Detection (Floyd’s)'],[175,'Linked List Cycle II','Linked List','Medium','Cycle Detection'],[176,'Reverse Linked List','Linked List','Easy','Iterative / Recursion'],[177,'Convert Binary LL to Integer','Linked List','Easy','Traversal'],[178,'Merge K Sorted Lists','Linked List','Hard','Heap / Divide & Conquer'],[179,'Remove Duplicates from Sorted List','Linked List','Easy','Traversal'],[180,'Remove Duplicates II','Linked List','Medium','Traversal'],[181,'Intersection of Two Linked Lists','Linked List','Easy','Two Pointer'],[182,'Remove Linked List Elements','Linked List','Easy','Traversal'],[183,'Palindrome Linked List','Linked List','Easy','Two Pointer'],[184,'Delete Node in Linked List','Linked List','Easy','Pointer Manipulation'],[185,'Reverse Nodes in K Group','Linked List','Hard','Linked List Manipulation'],[186,'Swap Nodes in Pairs','Linked List','Medium','Pointer Manipulation'],[187,'Remove Nth Node From End','Linked List','Medium','Two Pointer'],[188,'Add Two Numbers','Linked List','Medium','Simulation'],[189,'Copy List with Random Pointer','Linked List','Hard','HashMap / Cloning'],[190,'Flattening a Linked List','Linked List','Hard','Recursion / Divide & Conquer'],
  [191,'Implement Queue using Stacks','Stack & Queue','Easy','Simulation'],[192,'Implement Stack using Queues','Stack & Queue','Easy','Simulation'],[193,'Infix to Postfix Conversion','Stack & Queue','Medium','Stack (Expression)'],[194,'Prefix to Infix Conversion','Stack & Queue','Medium','Stack (Expression)'],[195,'Prefix to Postfix Conversion','Stack & Queue','Medium','Stack (Expression)'],[196,'Postfix to Prefix Conversion','Stack & Queue','Medium','Stack (Expression)'],[197,'Postfix to Infix Conversion','Stack & Queue','Easy','Stack (Expression)'],[198,'Infix to Prefix Conversion','Stack & Queue','Medium','Stack (Expression)'],[199,'Next Larger Element','Stack & Queue','Easy','Monotonic Stack'],[200,'Smaller on Left','Stack & Queue','Easy','Monotonic Stack'],[201,'Next Greater Element I','Stack & Queue','Easy','Monotonic Stack'],[202,'Smallest number on left','Stack & Queue','Easy','Monotonic Stack'],[203,'Next Smaller Element','Stack & Queue','Easy','Monotonic Stack'],[204,'Backspace String Compare','Stack & Queue','Medium','Stack / Two Pointer'],[205,'Stock Span Problem','Stack & Queue','Medium','Monotonic Stack'],[206,'Online Stock Span','Stack & Queue','Medium','Monotonic Stack'],[207,'Min Stack','Stack & Queue','Medium','Stack Design'],[208,'Largest Rectangle in Histogram','Stack & Queue','Hard','Monotonic Stack'],[209,'Maximal Rectangle','Stack & Queue','Hard','Stack + Matrix'],[210,'Celebrity Problem','Stack & Queue','Medium','Stack / Two Pointer'],[211,'LRU Cache','Stack & Queue','Hard','HashMap + DLL'],[212,'LFU Cache','Stack & Queue','Hard','HashMap + Design'],[213,'Introduction to Bits and Tricks','Number System','Easy','Bit Basics'],[214,'Check if i-th bit is set or not','Number System','Easy','Bit Masking'],[215,'Check if number is odd or not','Number System','Easy','Bit Check'],[216,'Check if number is power of 2','Number System','Easy','Bit Trick'],[217,'Count number of set bits','Number System','Easy','Bit Counting'],[218,'Set/Unset rightmost unset bit','Number System','Easy','Bit Manipulation'],[219,'Swap two numbers','Number System','Easy','XOR Trick'],[220,'Divide two numbers without * and /','Number System','Medium','Bit Manipulation'],[221,'Minimum bit flips to convert number','Number System','Medium','XOR'],[222,'Single Number - I','Number System','Medium','XOR'],[223,'Power Set (Bit Manipulation)','Number System','Medium','Bit Masking'],[224,'XOR of numbers in a range','Number System','Medium','Pattern + XOR'],[226,'Single Number - III','Number System','Medium','XOR + Bit Masking'],
  [227,'Assign Cookies','Greedy','Easy','Greedy + Sorting'],[228,'Fractional Knapsack','Greedy','Medium','Greedy (Ratio Based)'],[229,'Lemonade Change','Greedy','Easy','Greedy (Simulation)'],[230,'Valid Parenthesis Checker','Greedy','Hard','Stack (Validation)'],[231,'N Meetings in One Room','Greedy','Medium','Greedy (Activity Selection)'],[232,'Jump Game I','Greedy','Easy','Greedy'],[233,'Jump Game II','Greedy','Medium','Greedy'],[234,'Minimum Platforms','Greedy','Medium','Greedy + Sorting'],[235,'Job Sequencing Problem','Greedy','Medium','Greedy + Heap'],[236,'Candy','Greedy','Hard','Greedy'],[237,'Shortest Job First','Greedy','Medium','Greedy (Scheduling)'],[238,'LRU Page Replacement','Greedy','Medium','Greedy / Simulation'],[239,'Insert Interval','Greedy','Medium','Greedy + Intervals'],[240,'Merge Intervals','Greedy','Medium','Greedy + Sorting'],
  [241,'K-th Symbol in Grammar','Recursion & Backtracking','Medium','Recursion'],[242,'Tower of Hanoi','Recursion & Backtracking','Medium','Recursion'],[243,'Josephus Problem','Recursion & Backtracking','Medium','Recursion'],[244,'Find Winner of Circular Game','Recursion & Backtracking','Medium','Simulation / Recursion'],[245,'Sort List / Stack (Recursive)','Recursion & Backtracking','Medium','Recursion'],[246,'Power Set','Recursion & Backtracking','Medium','Backtracking'],[247,'Subsets','Recursion & Backtracking','Medium','Backtracking'],[248,'Permutations','Recursion & Backtracking','Medium','Backtracking'],[249,'Subsets II','Recursion & Backtracking','Medium','Backtracking'],[250,'Letter Combinations of Phone Number','Recursion & Backtracking','Medium','Backtracking'],[251,'Combination Sum','Recursion & Backtracking','Medium','Backtracking'],[252,'Combination Sum III','Recursion & Backtracking','Medium','Backtracking'],[253,'Rat in a Maze','Recursion & Backtracking','Medium','Backtracking'],[254,'Sudoku Solver','Recursion & Backtracking','Hard','Backtracking'],[255,'N-Queens','Recursion & Backtracking','Hard','Backtracking'],[256,'Word Search','Recursion & Backtracking','Medium','Backtracking'],[257,'Permutation Sequence','Recursion & Backtracking','Hard','Backtracking + Math'],
  [258,'Inorder Traversal','Binary Tree','Easy','DFS'],[259,'Preorder Traversal','Binary Tree','Easy','DFS'],[260,'Postorder Traversal','Binary Tree','Easy','DFS'],[261,'Maximum Depth of Binary Tree','Binary Tree','Easy','DFS'],[262,'Level Order Traversal','Binary Tree','Easy','BFS'],[263,'Level Order Traversal II','Binary Tree','Easy','BFS'],[264,'Symmetric Tree','Binary Tree','Easy','DFS'],[265,'Path Sum','Binary Tree','Easy','DFS'],[266,'Populate Next Right Pointers','Binary Tree','Medium','BFS'],[267,'Diameter of Binary Tree','Binary Tree','Medium','DFS'],[268,'Balanced Binary Tree','Binary Tree','Easy','DFS'],[269,'Same Tree','Binary Tree','Easy','DFS'],[270,'Zigzag Level Order Traversal','Binary Tree','Medium','BFS'],[271,'Left View of Binary Tree','Binary Tree','Medium','BFS/DFS'],[272,'Right View of Binary Tree','Binary Tree','Medium','BFS/DFS'],[273,'Top View of Binary Tree','Binary Tree','Medium','BFS + Map'],[274,'Bottom View of Binary Tree','Binary Tree','Medium','BFS + Map'],[275,'Vertical Order Traversal','Binary Tree','Hard','BFS + Map'],[276,'Sum of Longest Bloodline','Binary Tree','Medium','DFS'],[277,'Lowest Common Ancestor','Binary Tree','Medium','DFS'],[278,'Path Sum II','Binary Tree','Medium','DFS + Backtracking'],[279,'Path Sum III','Binary Tree','Medium','Prefix Sum + DFS'],[280,'Construct Tree (Preorder + Inorder)','Binary Tree','Medium','Recursion'],[281,'Burning Tree','Binary Tree','Hard','BFS + Mapping'],[282,'Morris Traversal','Binary Tree','Hard','Threaded Tree'],
  [283,'Validate Binary Search Tree','Binary Search Tree','Medium','DFS (Bounds Check)'],[284,'Search in BST','Binary Search Tree','Easy','BST Traversal'],[285,'Kth Smallest in BST','Binary Search Tree','Medium','Inorder Traversal'],[286,'Floor and Ceil in BST','Binary Search Tree','Medium','BST Traversal'],[287,'Delete Node in BST','Binary Search Tree','Medium','BST Manipulation'],[288,'Predecessor and Successor','Binary Search Tree','Medium','BST Traversal'],[289,'Lowest Common Ancestor in BST','Binary Search Tree','Easy','BST Property'],[290,'Two Sum IV (BST)','Binary Search Tree','Easy','Hashing / Inorder'],[291,'Convert Sorted Array to BST','Binary Search Tree','Easy','Divide & Conquer'],[292,'Last Stone Weight','Binary Heap','Easy','Max Heap'],[293,'Kth Largest Element in Array','Binary Heap','Medium','Heap'],[294,'K Closest Points to Origin','Binary Heap','Medium','Heap'],[295,'Top K Frequent Elements','Binary Heap','Medium','Heap + Hashing'],[296,'Top K Frequent Words','Binary Heap','Medium','Heap + Sorting'],[297,'Sort Characters By Frequency','Binary Heap','Medium','Heap + Hashing'],
  [298,'Max Sum Subarray of size K','Sliding Window','Easy','Fixed Window'],[299,'Maximum Points You Can Obtain','Sliding Window','Medium','Sliding Window'],[300,'Count Occurrence of Anagram','Sliding Window','Medium','Sliding Window + Hashing'],[301,'Largest Subarray with Sum K','Sliding Window','Medium','Variable Window'],[302,'Pick Toys','Sliding Window','Medium','Variable Window'],[303,'Longest Substring Without Repeating Characters','Sliding Window','Medium','Sliding Window + Hashing'],[304,'Minimum Window Substring','Sliding Window','Hard','Sliding Window + Hashing'],
  [305,'BFS Traversal','Graph','Easy','BFS'],[306,'DFS Traversal','Graph','Easy','DFS'],[307,'Cycle Detection (Undirected)','Graph','Medium','BFS/DFS'],[308,'Cycle Detection (Directed)','Graph','Medium','DFS'],[309,'Topological Sort (DFS)','Graph','Medium','DFS'],[310,"Kahn's Algorithm",'Graph','Medium','BFS'],[311,'Topological Sort (Kahn’s)','Graph','Medium','BFS'],[312,'Cycle Detection (Kahn’s)','Graph','Medium','BFS'],[313,'Keys and Rooms','Graph','Medium','DFS'],[314,'All Paths from Source to Target','Graph','Medium','DFS'],[315,'Number of Islands','Graph','Medium','DFS/BFS'],[316,'Dijkstra Algorithm','Graph','Medium','Shortest Path'],[317,'Bellman Ford Algorithm','Graph','Medium','Shortest Path'],[318,'Prim’s Algorithm','Graph','Medium','MST'],[319,'Kruskal Algorithm','Graph','Medium','MST'],[320,'Floyd Warshall Algorithm','Graph','Hard','All-Pairs Shortest Path'],[321,'Find City with Smallest Neighbors','Graph','Medium','Graph + Shortest Path'],[322,'Flood Fill','Graph','Easy','BFS/DFS'],[323,'Clone Graph','Graph','Medium','DFS/BFS'],[324,'Number of Provinces','Graph','Medium','DFS/BFS'],[325,'Course Schedule','Graph','Medium','Topological Sort'],[326,'Cheapest Flights Within K Stops','Graph','Hard','BFS / Dijkstra'],
  [327,'Fibonacci Number','Dynamic Programming','Easy','DP (1D)'],[328,'Climbing Stairs','Dynamic Programming','Easy','DP (1D)'],[329,'Min Cost Climbing Stairs','Dynamic Programming','Easy','DP (1D)'],[330,'Jump Game','Dynamic Programming','Medium','Greedy / DP'],[331,'0/1 Knapsack','Dynamic Programming','Medium','DP (Knapsack)'],[332,'Subset Sum Problem','Dynamic Programming','Medium','DP (Subset)'],[333,'Partition Equal Subset Sum','Dynamic Programming','Medium','DP (Subset)'],[334,'Perfect Sum Problem','Dynamic Programming','Medium','DP (Count Subsets)'],[335,'Unbounded Knapsack','Dynamic Programming','Medium','DP (Knapsack)'],[336,'Rod Cutting','Dynamic Programming','Medium','DP (Unbounded Knapsack)'],[337,'Coin Change II','Dynamic Programming','Medium','DP (Count Ways)'],[338,'Coin Change','Dynamic Programming','Medium','DP (Min Coins)'],[339,'Longest Common Subsequence','Dynamic Programming','Medium','DP (Strings)'],[340,'Longest Common Substring','Dynamic Programming','Medium','DP (Strings)'],[341,'Print Longest Common Subsequence','Dynamic Programming','Medium','DP (Reconstruction)'],[342,'Shortest Common Supersequence','Dynamic Programming','Medium','DP (Strings)'],[343,'Print Shortest Common Supersequence','Dynamic Programming','Medium','DP (Reconstruction)'],[344,'Longest Palindromic Subsequence','Dynamic Programming','Medium','DP (Strings)'],[345,'Minimum Deletions to Make String Palindrome','Dynamic Programming','Medium','DP (Strings)'],[346,'Matrix Chain Multiplication','Dynamic Programming','Hard','DP (Partition)'],[347,'Palindrome Partitioning','Dynamic Programming','Hard','DP (Partition)'],[348,'Longest Palindromic Substring','Dynamic Programming','Medium','DP / Expand'],[349,'Egg Dropping Puzzle','Dynamic Programming','Hard','DP (Partition)'],[350,'Scramble String','Dynamic Programming','Hard','DP (Strings)'],
  [351,'Implement Trie (Prefix Tree)','Trie','Medium','Trie'],[352,'Longest Common Prefix','Trie','Easy','Trie / String'],[353,'Word Break','Trie','Medium','Trie + DP'],[354,'Word Search II','Trie','Hard','Trie + Backtracking'],[355,'Maximum XOR of Two Numbers in Array','Trie','Medium','Trie (Bit Manipulation)'],
]
const syllabusProblems: Problem[] = syllabusRows.map(([id,title,topic,difficulty,note]) => ({id,title,topic,difficulty,slug:title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,''),note:`Cohort 3.0 · ${note}`}))
const problems: Problem[] = [...syllabusProblems, ...starterProblems.filter(p => !syllabusProblems.some(s => s.id === p.id))]
const topics = ['All topics', ...Array.from(new Set(problems.map(p => p.topic))), 'My list']
const tabs = ['All problems', 'To do', 'Solved', 'Bookmarked'] as const
function readStoredValue<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key)
    return value === null ? fallback : JSON.parse(value) as T
  } catch {
    return fallback
  }
}
function writeStoredValue(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage can be unavailable or full; keep the current session usable.
  }
}
function removeStoredValue(key: string): void {
  try { localStorage.removeItem(key) } catch { /* Storage can be disabled in the browser. */ }
}
function loadProgress(): Progress {
  const stored = readStoredValue<unknown>('dsa-path-progress-v1', {})
  if (!stored || typeof stored !== 'object' || Array.isArray(stored)) return {}
  return Object.fromEntries(Object.entries(stored).filter(([, value]) => value === 'solved' || value === 'attempted')) as Progress
}
function loadBookmarks(): number[] {
  const stored = readStoredValue<unknown>('dsa-path-bookmarks-v1', [])
  return Array.isArray(stored) ? [...new Set(stored.filter((id): id is number => Number.isSafeInteger(id) && id > 0))] : []
}
function loadCustomProblems(): Problem[] {
  const stored = readStoredValue<unknown>('dsa-path-custom-problems-v1', [])
  if (!Array.isArray(stored)) return []
  return stored.filter((item): item is Problem => !!item && typeof item === 'object'
    && Number.isSafeInteger(item.id) && typeof item.title === 'string' && typeof item.topic === 'string'
    && ['Easy', 'Medium', 'Hard'].includes(item.difficulty) && typeof item.slug === 'string' && typeof item.note === 'string')
}

function App() {
  const [darkTheme, setDarkTheme] = useState(() => localStorage.getItem('dsa-path-theme') === 'dark')
  const [progress, setProgress] = useState<Progress>(loadProgress)
  const [bookmarks, setBookmarks] = useState<number[]>(loadBookmarks)
  const [topic, setTopic] = useState('All topics')
  const [tab, setTab] = useState<(typeof tabs)[number]>('All problems')
  const [query, setQuery] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [showScrollNav, setShowScrollNav] = useState(false)
  const scrollNavHovered = useRef(false)
  const scrollNavTimer = useRef<number | undefined>(undefined)
  const [difficulty, setDifficulty] = useState('Any difficulty')
  const [filters, setFilters] = useState(false)
  const [reverse, setReverse] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const [custom, setCustom] = useState<Problem[]>(loadCustomProblems)
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  useEffect(() => { writeStoredValue('dsa-path-theme', darkTheme ? 'dark' : 'light') }, [darkTheme])
  useEffect(() => {
    const handleSearchShortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        searchInputRef.current?.focus()
      }
      if (event.key === 'Escape' && document.activeElement === searchInputRef.current) {
        searchInputRef.current?.blur()
      }
    }
    window.addEventListener('keydown', handleSearchShortcut)
    return () => window.removeEventListener('keydown', handleSearchShortcut)
  }, [])
  useEffect(() => {
    if (!addOpen) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setAddOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [addOpen])
  useEffect(() => {
    const clearHideTimer = () => {
      if (scrollNavTimer.current !== undefined) window.clearTimeout(scrollNavTimer.current)
    }
    const hideAfterPause = () => {
      clearHideTimer()
      scrollNavTimer.current = window.setTimeout(() => {
        if (!scrollNavHovered.current) setShowScrollNav(false)
      }, 1400)
    }
    const handleScroll = () => {
      const heading = document.getElementById('problem-list')
      const table = document.querySelector('.table-wrap')
      if (!heading || !table) return
      const headingBounds = heading.getBoundingClientRect()
      const tableBounds = table.getBoundingClientRect()
      const problemListIsVisible = headingBounds.top < window.innerHeight && tableBounds.bottom > 0
      if (!problemListIsVisible) {
        clearHideTimer()
        setShowScrollNav(false)
        return
      }
      setShowScrollNav(true)
      hideAfterPause()
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearHideTimer()
    }
  }, [])
  const all = [...problems, ...custom]
  const solved = Object.values(progress).filter(v => v === 'solved').length
  const attempted = Object.values(progress).filter(v => v === 'attempted').length
  const filtered = useMemo(() => {
    const matches = all.filter(p => {
    const s = progress[p.id]
    const matchingTab = tab === 'All problems' || (tab === 'To do' && !s) || (tab === 'Solved' && s === 'solved') || (tab === 'Bookmarked' && bookmarks.includes(p.id))
    return matchingTab && (topic === 'All topics' || p.topic === topic) && (difficulty === 'Any difficulty' || p.difficulty === difficulty) && `${p.title} ${p.topic} ${p.note}`.toLowerCase().includes(query.toLowerCase())
    })
    return reverse ? matches.reverse() : matches
  }, [all, progress, bookmarks, tab, topic, difficulty, query, reverse])
  const save = (next: Progress) => { setProgress(next); writeStoredValue('dsa-path-progress-v1', next) }
  const toggle = (id: number, status: 'solved' | 'attempted') => { const next = {...progress}; if (next[id] === status) delete next[id]; else next[id] = status; save(next) }
  const toggleBookmark = (id: number) => { const next = bookmarks.includes(id) ? bookmarks.filter(value => value !== id) : [...bookmarks, id]; setBookmarks(next); writeStoredValue('dsa-path-bookmarks-v1', next) }
  const current = problems.find(p => !progress[p.id]) || problems[0]
  const link = (p: Problem) => {
    const customProblem = custom.find(c => c.id === p.id && c.title === p.title)
    if (customProblem) return customProblem.slug

    const hasVerifiedSlug = starterProblems.some(item => item.id === p.id && item.slug === p.slug && item.title === p.title)
    if (hasVerifiedSlug) return `https://leetcode.com/problems/${p.slug}/`

    return `https://leetcode.com/problemset/all/?search=${encodeURIComponent(p.title)}`
  }
  const add = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const cleanTitle = title.trim()
    const cleanUrl = url.trim()
    if (!cleanTitle || !cleanUrl) return
    const next = [...custom, { id: Date.now(), title: cleanTitle, topic: topic === 'All topics' ? 'My list' : topic, difficulty: 'Medium' as const, slug: cleanUrl, note: 'Added by you' }]
    setCustom(next)
    writeStoredValue('dsa-path-custom-problems-v1', next)
    setTitle('')
    setUrl('')
    setAddOpen(false)
  }
  const clear = () => {
    if (!confirm('Clear all saved progress and custom problems?')) return
    save({})
    setBookmarks([])
    removeStoredValue('dsa-path-bookmarks-v1')
    setCustom([])
    removeStoredValue('dsa-path-custom-problems-v1')
  }
  const jumpTo = (position: 'top' | 'middle' | 'bottom') => {
    const heading = document.getElementById('problem-list')
    const rows = document.querySelectorAll<HTMLElement>('.problem-row')
    const destination = position === 'top'
      ? heading
      : position === 'middle'
        ? rows[Math.floor((rows.length - 1) / 2)]
        : document.querySelector<HTMLElement>('.table-bottom')
    const block = position === 'top' ? 'start' : position === 'middle' ? 'center' : 'end'
    destination?.scrollIntoView({ behavior: 'smooth', block })
  }
  const keepScrollNavOpen = () => {
    scrollNavHovered.current = true
    if (scrollNavTimer.current !== undefined) window.clearTimeout(scrollNavTimer.current)
  }
  const releaseScrollNav = () => {
    scrollNavHovered.current = false
    scrollNavTimer.current = window.setTimeout(() => setShowScrollNav(false), 450)
  }

  return <main className={`app-shell ${darkTheme ? 'theme-dark' : ''}`}>
    <aside className="sidebar"><a className="brand" href="#home" aria-label="Orbital DSA mission control"><span className="brand-mark"><Orbit size={21}/></span><span className="brand-copy"><span className="brand-name">ORBITAL</span><span className="brand-light">DSA MISSION CONTROL</span></span></a>
      <div className="sidebar-label">WORKSPACE</div><button className="nav-item selected"><LayoutDashboard size={17}/>Dashboard</button><button className="nav-item" onClick={()=>document.getElementById('problem-list')?.scrollIntoView({behavior:'smooth'})}><ListChecks size={17}/>Problem list<span className="nav-count">{problems.length}</span></button>
      <div className="sidebar-label topic-label">STUDY BY TOPIC</div><div className="topic-nav">{topics.map(t=><button key={t} className={`topic-item ${topic===t?'topic-active':''}`} onClick={()=>{setTopic(t);setTab('All problems')}}><span className="topic-dot"/>{t}<span className="topic-count">{t==='All topics'?problems.length:problems.filter(p=>p.topic===t).length}</span></button>)}</div>
      <div className="sidebar-bottom"><div className="syllabus-card"><div className="syllabus-icon"><Target size={17}/></div><strong>Your syllabus, in motion.</strong><p>Small steps, consistent practice. Progress stays saved on this device.</p><a href="https://leetcode.com/studyplan/top-interview-150/" target="_blank" rel="noreferrer">Explore LeetCode plans <ArrowRight size={14}/></a></div><div className="profile"><div className="avatar">A</div><div><strong>My learning plan</strong><span>Personal workspace</span></div><button className="clear-progress" title="Clear saved progress" aria-label="Clear saved progress" onClick={clear}><Trash2 size={16}/></button></div></div>
    </aside>
    <section className="main-area" id="home"><header className="topbar"><div className="breadcrumb">Workspace <span>/</span> <b>Overview</b></div><div className="top-actions"><div className="today-pill"><span className="live-dot"/>YOUR PRACTICE SPACE</div><button className="theme-toggle" onClick={()=>setDarkTheme(value=>!value)} aria-label={`Switch to ${darkTheme ? 'light' : 'dark'} theme`} title={`Switch to ${darkTheme ? 'light' : 'dark'} theme`}>{darkTheme?<Sun size={18}/>:<Moon size={18}/>}<span>{darkTheme?'Light mode':'Dark mode'}</span></button><button className="help-button" title="Progress is saved locally in this browser"><CircleHelp size={18}/></button></div></header>
        <div className="content"><div className="welcome-row"><div><div className="eyebrow"><span className="eyebrow-line"/> YOUR DSA ROADMAP</div><h1>Practice</h1><p className="intro">A focused practice list, matched to core DSA topics. Pick a problem, learn the pattern, keep moving.</p></div><button className="add-button" onClick={()=>setAddOpen(true)}><Plus size={17}/>Add a problem</button></div>
        <div className="stats-grid"><div className="stat-card progress-card"><div className="stat-copy"><span className="stat-label">ROADMAP PROGRESS</span><strong>{solved}<small> / {problems.length}</small></strong><span className="stat-foot">problems completed</span></div><div className="progress-ring" style={{'--progress':`${Math.round(solved/problems.length*100)}%`} as CSSProperties}><div><b>{Math.round(solved/problems.length*100)}%</b><span>done</span></div></div></div>
        <div className="stat-card"><div className="stat-icon icon-green"><Check size={18}/></div><span className="stat-label">SOLVED</span><strong>{solved}</strong><span className="stat-foot">Keep that momentum going</span><div className="tiny-bars">{Array.from({length:12},(_,i)=><i key={i} className={i<Math.min(solved,12)?'bar-on':''}/>)}</div></div>
        <div className="stat-card"><div className="stat-icon icon-amber"><Flame size={18}/></div><span className="stat-label">IN PROGRESS</span><strong>{attempted}</strong><span className="stat-foot">Problems you’ve started</span><button className="stat-link" onClick={()=>setTab('To do')}>Back to practice <ArrowRight size={14}/></button></div>
        <div className="stat-card"><div className="stat-icon icon-lilac"><Bookmark size={18}/></div><span className="stat-label">SAVED FOR LATER</span><strong>{bookmarks.length}</strong><span className="stat-foot">Your personal shortlist</span><button className="stat-link" onClick={()=>setTab('Bookmarked')}>View bookmarks <ArrowRight size={14}/></button></div></div>
        <div className="focus-card"><div className="focus-deco deco-one"/><div className="focus-deco deco-two"/><div className="focus-content"><div className="focus-tag"><Sparkles size={13}/> PICK UP WHERE YOU LEFT OFF</div><h2>{current.title}</h2><p>{current.note}. A great next step in <b>{current.topic}</b>.</p><div className="focus-meta"><span className={`difficulty-dot ${current.difficulty.toLowerCase()}-dot`}/>{current.difficulty}<span className="meta-divider"/>#{current.id}<span className="meta-divider"/>{current.topic}</div><a href={link(current)} target="_blank" rel="noreferrer" className="focus-button">Solve on LeetCode <ExternalLink size={14}/></a></div><div className="focus-graphic orbital-showcase"><CanvasCom/></div><div className="focus-index">01 <span>/ 04</span></div></div>
        <div className="list-heading" id="problem-list"><div><div className="eyebrow"><span className="eyebrow-line"/> THE PRACTICE SET</div><h2>All problems</h2><p>Work through patterns one problem at a time.</p></div><div className="list-total"><b>{filtered.length}</b> problems <span>in view</span></div></div>
        <div className="list-toolbar"><div className="tabs">{tabs.map(t=><button key={t} onClick={()=>setTab(t)} className={`tab ${tab===t?'active-tab':''}`}>{t}{t==='Solved'&&solved>0&&<span className="tab-badge">{solved}</span>}</button>)}</div><div className="tools"><label className="search-box"><Search size={16}/><input ref={searchInputRef} aria-label="Search problems" placeholder="Find a problem..." value={query} onChange={e=>setQuery(e.target.value)}/>{query?<button aria-label="Clear search" onClick={()=>setQuery('')}><X size={14}/></button>:<kbd className="search-shortcut">Ctrl K</kbd>}</label><button className={`filter-button ${filters?'filter-on':''}`} onClick={()=>setFilters(!filters)}><SlidersHorizontal size={15}/>Filter{difficulty!=='Any difficulty'&&<span className="filter-indicator"/>}</button><button className="sort-button" onClick={()=>setReverse(!reverse)} title="Reverse problem order"><ArrowDownUp size={15}/></button></div></div>
        {filters&&<div className="filter-panel"><label>Difficulty<select value={difficulty} onChange={e=>setDifficulty(e.target.value)}><option>Any difficulty</option><option>Easy</option><option>Medium</option><option>Hard</option></select></label><label>Topic<select value={topic} onChange={e=>setTopic(e.target.value)}>{topics.map(t=><option key={t}>{t}</option>)}</select></label><button onClick={()=>{setDifficulty('Any difficulty');setTopic('All topics')}}>Reset filters</button></div>}
        <div className="table-wrap"><div className="table-head"><span>PROBLEM</span><span>TOPIC</span><span>DIFFICULTY</span><span>STATUS</span><span/></div>{filtered.length===0?<div className="empty-state"><div className="empty-icon"><Search size={20}/></div><strong>No problems found</strong><p>Try another search or reset your filters.</p></div>:filtered.map((p,i)=>{const s=progress[p.id];const saved=bookmarks.includes(p.id);return <div className="problem-row" key={p.id}><div className="problem-title-cell"><span className={`row-number ${s==='solved'?'row-done':''}`}>{s==='solved'?<Check size={14}/>:String(i+1).padStart(2,'0')}</span><div><a href={link(p)} target="_blank" rel="noreferrer" className="problem-link">{p.title}<ExternalLink size={12}/></a><small>{p.note}</small></div></div><span className="topic-chip">{p.topic}</span><span className={`difficulty ${p.difficulty.toLowerCase()}`}><i/>{p.difficulty}</span><button className={`status-pill ${s||'not-started'}`} onClick={()=>toggle(p.id,s==='solved'?'solved':s==='attempted'?'solved':'attempted')} title="Click to move from to do, to in progress, to solved">{s==='solved'?<><Check size={12}/>Solved</>:s==='attempted'?<><span className="status-dot"/>In progress</>:'To do'}</button><div className="row-actions"><button title={saved?'Remove bookmark':'Save for later'} aria-label="Toggle bookmark" onClick={()=>toggleBookmark(p.id)} className={saved?'bookmark-active':''}><Bookmark size={15}/></button><a href={link(p)} target="_blank" rel="noreferrer" title="Open problem" aria-label="Open problem"><ArrowRight size={15}/></a></div></div>})}<div className="table-bottom">Showing <b>{filtered.length}</b> practice problems <span>·</span> Progress saves automatically on this device</div></div>
        <footer className="page-footer"><span>Made for steady progress, one pattern at a time.</span><span>Links open on the problem platform <ExternalLink size={12}/></span></footer>
      </div>
    </section>
    {addOpen&&<div className="modal-backdrop" onClick={e=>{if(e.target===e.currentTarget)setAddOpen(false)}}><form className="add-modal" role="dialog" aria-modal="true" aria-labelledby="add-problem-title" onSubmit={add}><button className="modal-close" type="button" onClick={()=>setAddOpen(false)} aria-label="Close"><X size={18}/></button><div className="eyebrow"><span className="eyebrow-line"/> PERSONALIZE YOUR PLAN</div><h2 id="add-problem-title">Add your own problem</h2><p>Save a problem from any practice platform to your list.</p><label>Problem name<input autoFocus required value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. Find the Duplicate Number"/></label><label>Problem URL<input required type="url" value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://..."/></label><button className="modal-submit"><Plus size={16}/>Add to my plan</button></form></div>}
    <nav className={`scroll-jump ${showScrollNav ? 'scroll-jump-visible' : ''}`} aria-label="Jump through problem list" aria-hidden={!showScrollNav} inert={!showScrollNav} onMouseEnter={keepScrollNavOpen} onMouseLeave={releaseScrollNav}>
      <button type="button" aria-label="Jump to top of problems" onClick={()=>jumpTo('top')}><ArrowUp size={18}/><span className="scroll-jump-label">Top</span></button>
      <button type="button" aria-label="Jump to middle of problems" onClick={()=>jumpTo('middle')}><CircleDot size={17}/><span className="scroll-jump-label">Middle</span></button>
      <button type="button" aria-label="Jump to bottom of problems" onClick={()=>jumpTo('bottom')}><ArrowDown size={18}/><span className="scroll-jump-label">Bottom</span></button>
    </nav>
  </main>
}
export default App
