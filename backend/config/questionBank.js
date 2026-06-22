const questionBank = [

  // ═══════════════════════════════════════
  // DSA — CODING PROBLEMS WITH LEETCODE
  // ═══════════════════════════════════════

  { id: "dsa_code_1", topic: "DSA", type: "coding", difficulty: "hard",
    question: "Kadane's Algorithm — Maximum Sum Subarray. What is the time complexity of the optimal solution?",
    description: "Given array [-2,1,-3,4,-1,2,1,-5,4], find the contiguous subarray with the largest sum. The answer is [4,-1,2,1] with sum 6.",
    options: ["O(n²) — check all subarrays", "O(n log n) — divide and conquer", "O(n) — single pass tracking current and max sum", "O(log n) — binary search"],
    answer: 2, leetcode: "https://leetcode.com/problems/maximum-subarray/",
    hint: "Track currentSum and maxSum. If currentSum < 0, reset to 0." },

  { id: "dsa_code_2", topic: "DSA", type: "coding", difficulty: "hard",
    question: "Trapping Rain Water — Which approach achieves O(n) time AND O(1) space?",
    description: "Given elevation map [0,1,0,2,1,0,1,3,2,1,2,1], compute how much water it traps. Expected output: 6 units.",
    options: ["Brute force — for each bar find left and right max O(n²)", "Prefix and suffix max arrays O(n) time O(n) space", "Two pointer from both ends O(n) time O(1) space", "Stack based approach O(n) time O(n) space"],
    answer: 2, leetcode: "https://leetcode.com/problems/trapping-rain-water/",
    hint: "Two pointers from both ends. Move pointer with smaller height inward." },

  { id: "dsa_code_3", topic: "DSA", type: "coding", difficulty: "hard",
    question: "Merge K Sorted Lists — What is the time complexity using a min-heap of size k?",
    description: "You have k=3 sorted linked lists: [1,4,5], [1,3,4], [2,6]. Merge into one sorted list: [1,1,2,3,4,4,5,6].",
    options: ["O(nk) — merge one by one", "O(n log k) — min-heap of size k", "O(n log n) — collect all and sort", "O(k²) — compare all heads"],
    answer: 1, leetcode: "https://leetcode.com/problems/merge-k-sorted-lists/",
    hint: "Push first element of each list into min-heap. Extract min, push next from same list." },

  { id: "dsa_code_4", topic: "DSA", type: "coding", difficulty: "hard",
    question: "Word Ladder — Shortest transformation sequence. Which algorithm guarantees shortest path?",
    description: "beginWord=hit, endWord=cog, wordList=[hot,dot,dog,lot,log,cog]. Answer: hit→hot→dot→dog→cog = 5 steps.",
    options: ["DFS — explore all paths", "BFS — level by level exploration guarantees shortest", "Dijkstra — weighted shortest path", "DP — store subproblem results"],
    answer: 1, leetcode: "https://leetcode.com/problems/word-ladder/",
    hint: "BFS treats words as nodes. Edge exists between words differing by exactly 1 character." },

  { id: "dsa_code_5", topic: "DSA", type: "coding", difficulty: "hard",
    question: "Largest Rectangle in Histogram — Optimal approach and complexity?",
    description: "heights=[2,1,5,6,2,3]. Largest rectangle has area 10 (bars of height 5 and 6). Find the approach.",
    options: ["Brute force — check every pair O(n²)", "Stack based — monotonic stack O(n)", "Divide and conquer O(n log n)", "Sliding window O(n)"],
    answer: 1, leetcode: "https://leetcode.com/problems/largest-rectangle-in-histogram/",
    hint: "Maintain a monotonic increasing stack of indices. Pop when current bar is shorter." },

  { id: "dsa_code_6", topic: "DSA", type: "coding", difficulty: "hard",
    question: "LRU Cache — Which data structure combination gives O(1) for both get and put?",
    description: "Design LRU cache with capacity 2. Operations: put(1,1), put(2,2), get(1)→1, put(3,3) evicts key 2, get(2)→-1.",
    options: ["Array + Binary Search — O(log n) get", "HashMap only — O(1) get but O(n) eviction", "HashMap + Doubly Linked List — O(1) both", "BST + HashMap — O(log n) both"],
    answer: 2, leetcode: "https://leetcode.com/problems/lru-cache/",
    hint: "HashMap for O(1) lookup. DLL for O(1) move-to-front and evict-from-back." },

  { id: "dsa_code_7", topic: "DSA", type: "coding", difficulty: "hard",
    question: "Median of Two Sorted Arrays — Required time complexity per the problem constraint?",
    description: "nums1=[1,3], nums2=[2]. Median=2.0. nums1=[1,2], nums2=[3,4]. Median=2.5. Must be better than O(m+n).",
    options: ["O(m+n) — merge and find middle", "O(log(m+n)) — binary search on partition", "O(log m * log n) — binary search both", "O(1) — direct formula"],
    answer: 1, leetcode: "https://leetcode.com/problems/median-of-two-sorted-arrays/",
    hint: "Binary search on smaller array. Find partition where left half ≤ right half across both arrays." },

  { id: "dsa_code_8", topic: "DSA", type: "coding", difficulty: "hard",
    question: "Course Schedule — Detect if all courses can be finished. This is essentially:",
    description: "n=2, prerequisites=[[1,0]]. Can finish? Yes. n=2, prerequisites=[[1,0],[0,1]]. Can finish? No — cycle exists.",
    options: ["Shortest path problem — Dijkstra", "Cycle detection in directed graph — Topological sort", "Minimum spanning tree — Prim's", "Connected components — Union Find"],
    answer: 1, leetcode: "https://leetcode.com/problems/course-schedule/",
    hint: "Build directed graph. Use DFS with 3 states: unvisited, processing, done. Cycle = impossible." },

  { id: "dsa_code_9", topic: "DSA", type: "coding", difficulty: "hard",
    question: "Find Minimum in Rotated Sorted Array — Optimal time complexity?",
    description: "Array [3,4,5,1,2] was sorted then rotated. Minimum is 1 at index 3. Must solve in O(log n).",
    options: ["O(n) — linear scan from left", "O(log n) — binary search on rotation point", "O(n log n) — sort the array", "O(1) — always at index 0"],
    answer: 1, leetcode: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/",
    hint: "Compare mid with right. If mid > right, minimum is in right half. Else in left half." },

  { id: "dsa_code_10", topic: "DSA", type: "coding", difficulty: "hard",
    question: "Number of Islands — Most efficient approach for large grids?",
    description: "Grid: [['1','1','0','0'],['1','1','0','0'],['0','0','1','0'],['0','0','0','1']]. Answer: 3 islands.",
    options: ["BFS or DFS — O(m*n) mark visited cells", "Binary search on rows O(m log n)", "DP bottom-up O(m*n) extra space", "Sorting based O(m*n log(m*n))"],
    answer: 0, leetcode: "https://leetcode.com/problems/number-of-islands/",
    hint: "For each unvisited 1, run DFS/BFS marking all connected 1s as visited. Count DFS calls." },

  { id: "dsa_code_11", topic: "DSA", type: "coding", difficulty: "hard",
    question: "3Sum — Find all unique triplets summing to zero. How to avoid duplicates efficiently?",
    description: "nums=[-1,0,1,2,-1,-4]. Output: [[-1,-1,2],[-1,0,1]]. Must not return duplicate triplets.",
    options: ["HashSet to store all pairs O(n²) space", "Sort + two pointers + skip duplicates O(n²) time O(1) space", "Three nested loops O(n³)", "Divide and conquer O(n² log n)"],
    answer: 1, leetcode: "https://leetcode.com/problems/3sum/",
    hint: "Sort array. For each i, use two pointers l=i+1 and r=end. Skip duplicates by checking prev value." },

  { id: "dsa_code_12", topic: "DSA", type: "coding", difficulty: "hard",
    question: "Longest Palindromic Substring — What is the optimal time complexity?",
    description: "s='babad' → output 'bab' or 'aba'. s='cbbd' → output 'bb'. Find longest palindromic substring.",
    options: ["O(n³) — check all substrings", "O(n²) — expand around center for each character", "O(n) — Manacher's algorithm", "Both B and C are valid optimal approaches"],
    answer: 3, leetcode: "https://leetcode.com/problems/longest-palindromic-substring/",
    hint: "Expand around center: for each char, expand odd and even length palindromes." },

  { id: "dsa_code_13", topic: "DSA", type: "coding", difficulty: "hard",
    question: "Binary Tree Maximum Path Sum — The path does NOT need to pass through root. What DP state to track?",
    description: "Tree: [-10,9,20,null,null,15,7]. Max path sum = 42 (path: 15→20→7). Node values can be negative.",
    options: ["Maximum sum path from root to any leaf", "Maximum sum of any path between any two nodes", "Maximum sum of left subtree only", "Maximum depth of the tree"],
    answer: 1, leetcode: "https://leetcode.com/problems/binary-tree-maximum-path-sum/",
    hint: "At each node, track max gain from left and right child. Update global max with left+node+right." },

  { id: "dsa_code_14", topic: "DSA", type: "coding", difficulty: "hard",
    question: "Sliding Window Maximum — Find max in every window of size k. Optimal approach?",
    description: "nums=[1,3,-1,-3,5,3,6,7], k=3. Output=[3,3,5,5,6,7]. Find maximum in each sliding window.",
    options: ["Brute force — scan each window O(nk)", "Max heap of size k — O(n log k)", "Monotonic deque — O(n) time O(k) space", "Segment tree — O(n log n)"],
    answer: 2, leetcode: "https://leetcode.com/problems/sliding-window-maximum/",
    hint: "Maintain deque of indices in decreasing order of values. Front is always the current window max." },

  { id: "dsa_code_15", topic: "DSA", type: "coding", difficulty: "hard",
    question: "Word Search II — Find all words from dictionary in 2D board. Optimal approach?",
    description: "Given board and words=['oath','pea','eat','rain'], find all words that exist in the board using adjacent cells.",
    options: ["BFS for each word separately O(words * m * n * 4^L)", "DFS for each word separately", "Trie + DFS — build trie of words then single DFS pass", "Dynamic programming on board"],
    answer: 2, leetcode: "https://leetcode.com/problems/word-search-ii/",
    hint: "Build Trie from word list. DFS on board — at each cell traverse Trie simultaneously." },

  { id: "dsa_code_16", topic: "DSA", type: "coding", difficulty: "hard",
    question: "Jump Game II — Minimum jumps to reach last index. Optimal approach?",
    description: "nums=[2,3,1,1,4]. Minimum jumps to reach last index = 2. Jump from index 0→1→4.",
    options: ["DP — O(n²) track min jumps to each index", "Greedy — O(n) track current range and farthest reach", "BFS — O(n) level by level", "Both B and C are O(n) greedy approaches"],
    answer: 3, leetcode: "https://leetcode.com/problems/jump-game-ii/",
    hint: "Greedy: track current jump end and farthest reachable. When you reach end, increment jumps." },

  { id: "dsa_code_17", topic: "DSA", type: "coding", difficulty: "hard",
    question: "Decode Ways — Number of ways to decode a string of digits. Approach?",
    description: "s='226' → 3 ways: [2,2,6], [22,6], [2,26]. s='06' → 0 ways. Count valid decodings.",
    options: ["Recursion without memoization O(2^n)", "DP — O(n) time O(n) space tracking valid decodings", "BFS on string O(n²)", "Greedy — always take longest valid code"],
    answer: 1, leetcode: "https://leetcode.com/problems/decode-ways/",
    hint: "dp[i] = ways to decode s[0..i]. Check single digit (s[i]) and two digit (s[i-1..i]) validity." },

  { id: "dsa_code_18", topic: "DSA", type: "coding", difficulty: "hard",
    question: "Minimum Window Substring — Find smallest window in s containing all chars of t. Complexity?",
    description: "s='ADOBECODEBANC', t='ABC'. Output='BANC'. Find minimum window substring.",
    options: ["O(n²) — check all substrings", "O(n) — sliding window with two pointers and frequency map", "O(n log n) — sorted approach", "O(n * |t|) — for each position check t"],
    answer: 1, leetcode: "https://leetcode.com/problems/minimum-window-substring/",
    hint: "Expand right pointer until window contains all chars. Then shrink left pointer to minimize." },

  { id: "dsa_code_19", topic: "DSA", type: "coding", difficulty: "hard",
    question: "Coin Change — Minimum coins to make amount. This is a classic:",
    description: "coins=[1,5,11], amount=15. Output: 3 (use three 5s). coins=[1,5,11], amount=15 with greedy gives wrong answer (11+1+1+1+1=5 coins).",
    options: ["Greedy always works for coin change", "DP — bottom up O(amount * coins) time", "BFS — level = number of coins used", "Both B and C are valid optimal approaches"],
    answer: 3, leetcode: "https://leetcode.com/problems/coin-change/",
    hint: "dp[i] = min coins to make amount i. dp[i] = min(dp[i], dp[i-coin]+1) for each coin." },

  { id: "dsa_code_20", topic: "DSA", type: "coding", difficulty: "hard",
    question: "Pacific Atlantic Water Flow — Water flows to both oceans. Best approach?",
    description: "Given m×n matrix of heights, find cells from which water can flow to both Pacific (top/left) and Atlantic (bottom/right) oceans.",
    options: ["For each cell run DFS to check both oceans O(m²n²)", "Reverse DFS/BFS from ocean borders inward O(mn)", "DP from corners O(mn)", "Binary search on heights O(mn log(max height))"],
    answer: 1, leetcode: "https://leetcode.com/problems/pacific-atlantic-water-flow/",
    hint: "Run BFS from Pacific borders and Atlantic borders separately. Answer is intersection of reachable cells." },

  // ═══════════════════════════════════════
  // DSA — ALGORITHM MCQs
  // ═══════════════════════════════════════

  { id: "dsa_mcq_1", topic: "DSA", type: "MCQ", difficulty: "medium",
    question: "What is the time complexity of building a heap from n elements?",
    options: ["O(n log n)", "O(n)", "O(log n)", "O(n²)"],
    answer: 1, hint: "Heapify from bottom up. Most nodes are near the leaves and require O(1) work." },

  { id: "dsa_mcq_2", topic: "DSA", type: "MCQ", difficulty: "medium",
    question: "In a hash table with chaining, what is average case time for search?",
    options: ["O(n)", "O(log n)", "O(1)", "O(n/k) where k is number of buckets"],
    answer: 2, hint: "With good hash function and load factor < 1, average chain length is O(1)." },

  { id: "dsa_mcq_3", topic: "DSA", type: "MCQ", difficulty: "hard",
    question: "Which algorithm finds shortest path in graph with negative edges but no negative cycles?",
    options: ["Dijkstra", "BFS", "Bellman-Ford", "Floyd-Warshall for single source"],
    answer: 2, hint: "Dijkstra fails with negative edges. Bellman-Ford relaxes all edges V-1 times." },

  { id: "dsa_mcq_4", topic: "DSA", type: "MCQ", difficulty: "hard",
    question: "What is the space complexity of DFS on a graph with V vertices and E edges?",
    options: ["O(V + E)", "O(V)", "O(E)", "O(V²)"],
    answer: 1, hint: "DFS stack depth is O(V) in worst case. Visited array is O(V). Adjacency list is O(V+E)." },

  { id: "dsa_mcq_5", topic: "DSA", type: "MCQ", difficulty: "medium",
    question: "Which data structure is best for implementing a priority queue?",
    options: ["Array", "Linked List", "Binary Heap", "Stack"],
    answer: 2, hint: "Binary heap gives O(log n) insert and O(log n) extract-min/max." },

  { id: "dsa_mcq_6", topic: "DSA", type: "MCQ", difficulty: "hard",
    question: "What is the recurrence for merge sort and its solution by Master Theorem?",
    options: ["T(n) = T(n/2) + O(n) → O(n log n)", "T(n) = 2T(n/2) + O(n) → O(n log n)", "T(n) = 2T(n/2) + O(1) → O(n)", "T(n) = T(n-1) + O(n) → O(n²)"],
    answer: 1, hint: "Merge sort splits into 2 halves (2T(n/2)) and merges in O(n). Case 2 of Master Theorem." },

  { id: "dsa_mcq_7", topic: "DSA", type: "MCQ", difficulty: "hard",
    question: "In which case does quicksort perform worst and what is the complexity?",
    options: ["Random input — O(n log n)", "Already sorted array with last element as pivot — O(n²)", "Reverse sorted array with median pivot — O(n²)", "All equal elements with random pivot — O(n log n)"],
    answer: 1, hint: "Choosing first/last element as pivot on sorted array creates maximally unbalanced partitions." },

  { id: "dsa_mcq_8", topic: "DSA", type: "MCQ", difficulty: "medium",
    question: "What is amortized time complexity of push and pop in a dynamic array?",
    options: ["O(n) worst case makes amortized O(n)", "O(1) amortized for both", "O(log n) amortized", "O(n) amortized for push"],
    answer: 1, hint: "Doubling strategy: occasional O(n) resize costs are spread across n operations = O(1) amortized." },

  { id: "dsa_mcq_9", topic: "DSA", type: "MCQ", difficulty: "hard",
    question: "What is the key property of a B-Tree that makes it suitable for databases?",
    options: ["O(1) search time", "All leaves at same level — minimizes disk reads", "Binary search in O(log n)", "In-memory storage only"],
    answer: 1, hint: "B-Trees are balanced with high branching factor. Each node = one disk block = minimal I/O." },

  { id: "dsa_mcq_10", topic: "DSA", type: "MCQ", difficulty: "hard",
    question: "Floyd-Warshall algorithm finds all-pairs shortest paths. What is its complexity?",
    options: ["O(V² log V)", "O(V³)", "O(V² + E)", "O(VE log V)"],
    answer: 1, hint: "Three nested loops over V vertices each. dp[i][j][k] = shortest path using first k vertices." },

  // ═══════════════════════════════════════
  // DBMS — MCQs + Analysis
  // ═══════════════════════════════════════

  { id: "dbms_1", topic: "DBMS", type: "MCQ", difficulty: "easy",
    question: "What does ACID stand for in database transactions?",
    options: ["Atomic Consistent Isolated Durable", "Array Cache Index Data", "Abstract Class Interface Design", "Async Concurrent Isolated Dependent"],
    answer: 0, hint: "ACID ensures reliable transaction processing in databases." },

  { id: "dbms_2", topic: "DBMS", type: "MCQ", difficulty: "medium",
    question: "Which normal form removes transitive functional dependencies?",
    options: ["1NF — eliminates repeating groups", "2NF — eliminates partial dependencies", "3NF — eliminates transitive dependencies", "BCNF — stronger version of 3NF"],
    answer: 2, hint: "3NF: non-prime attribute should not depend on another non-prime attribute." },

  { id: "dbms_3", topic: "DBMS", type: "MCQ", difficulty: "hard",
    question: "What is the difference between clustered and non-clustered index?",
    options: ["No difference in performance", "Clustered index sorts physical data — only one per table. Non-clustered creates separate structure — multiple allowed", "Non-clustered is always faster", "Clustered index only works on primary keys"],
    answer: 1, hint: "Clustered index determines physical order of data. Like a phone book sorted by last name." },

  { id: "dbms_4", topic: "DBMS", type: "MCQ", difficulty: "hard",
    question: "In two-phase locking, what is the difference between growing and shrinking phase?",
    options: ["Growing: acquire and release locks. Shrinking: only acquire", "Growing: only acquire locks. Shrinking: only release locks", "Both phases allow acquire and release", "Growing: read locks only. Shrinking: write locks only"],
    answer: 1, hint: "2PL guarantees serializability. Once you release a lock (shrinking phase) you cannot acquire new ones." },

  { id: "dbms_5", topic: "DBMS", type: "MCQ", difficulty: "medium",
    question: "What is a phantom read in database transactions?",
    options: ["Reading deleted data", "Reading uncommitted data from another transaction", "A transaction re-executes a query and finds new rows added by another committed transaction", "Reading the same row twice with different values"],
    answer: 2, hint: "Phantom reads prevented only at SERIALIZABLE isolation level." },

  { id: "dbms_6", topic: "DBMS", type: "MCQ", difficulty: "hard",
    question: "What is the difference between UNION and UNION ALL in SQL?",
    options: ["No difference", "UNION removes duplicates — slower. UNION ALL keeps all rows — faster", "UNION ALL removes duplicates", "UNION works on different schemas only"],
    answer: 1, hint: "UNION performs sort/hash to remove duplicates. UNION ALL just concatenates result sets." },

  { id: "dbms_7", topic: "DBMS", type: "MCQ", difficulty: "hard",
    question: "What is the purpose of MVCC (Multi-Version Concurrency Control)?",
    options: ["To speed up write operations", "Allow reads without blocking writes by maintaining multiple versions of data", "To enforce ACID properties", "To implement foreign key constraints"],
    answer: 1, hint: "PostgreSQL uses MVCC. Each transaction sees a snapshot. Writers don't block readers." },

  { id: "dbms_8", topic: "DBMS", type: "MCQ", difficulty: "medium",
    question: "What is the output of this SQL: SELECT COUNT(*) FROM employees WHERE salary > 50000 GROUP BY department HAVING COUNT(*) > 2?",
    options: ["Count of all employees with salary > 50000", "Departments where more than 2 employees earn > 50000 with their counts", "All employees grouped by department", "Syntax error"],
    answer: 1, hint: "WHERE filters rows before grouping. HAVING filters groups after grouping." },

  // ═══════════════════════════════════════
  // OS — MCQs + Analysis
  // ═══════════════════════════════════════

  { id: "os_1", topic: "OS", type: "MCQ", difficulty: "medium",
    question: "What are the four necessary conditions for deadlock (Coffman conditions)?",
    options: ["Mutual exclusion, preemption, circular wait, hold and wait", "Mutual exclusion, no preemption, circular wait, hold and wait", "Starvation, aging, circular wait, no preemption", "Race condition, mutex, semaphore, monitor"],
    answer: 1, hint: "ALL four must hold simultaneously for deadlock. Remove any one to prevent deadlock." },

  { id: "os_2", topic: "OS", type: "MCQ", difficulty: "hard",
    question: "What is the difference between a mutex and a semaphore?",
    options: ["No difference — both are the same", "Mutex is binary and owned by the thread that locks it. Semaphore is a counter and has no ownership", "Semaphore is always binary", "Mutex allows multiple threads simultaneously"],
    answer: 1, hint: "Mutex: only the locking thread can unlock. Semaphore: any thread can signal." },

  { id: "os_3", topic: "OS", type: "MCQ", difficulty: "hard",
    question: "In page replacement, which algorithm suffers from Belady's anomaly?",
    options: ["LRU — Least Recently Used", "Optimal — replace page not needed longest", "FIFO — First In First Out", "LFU — Least Frequently Used"],
    answer: 2, hint: "Belady's anomaly: adding more frames can increase page faults. Only FIFO suffers from this." },

  { id: "os_4", topic: "OS", type: "MCQ", difficulty: "hard",
    question: "What is the difference between preemptive and non-preemptive scheduling?",
    options: ["No practical difference", "Preemptive: OS can interrupt running process. Non-preemptive: process runs until it voluntarily yields", "Non-preemptive is always better", "Preemptive only works in single-core systems"],
    answer: 1, hint: "Linux uses preemptive scheduling. Windows server editions often use non-preemptive for fairness." },

  { id: "os_5", topic: "OS", type: "MCQ", difficulty: "medium",
    question: "What is thrashing in an OS and how is it detected?",
    options: ["CPU overheating — detected by temperature sensors", "Excessive paging — process spends more time in page faults than actual execution. Detected by low CPU utilization with high disk I/O", "Memory leak — detected by monitoring heap size", "Too many processes — detected by process count"],
    answer: 1, hint: "Working Set Model or Page Fault Frequency algorithm helps control thrashing." },

  { id: "os_6", topic: "OS", type: "MCQ", difficulty: "hard",
    question: "What is the key difference between process and thread in terms of memory?",
    options: ["No memory difference", "Processes share all memory. Threads have separate memory", "Threads share code, data, heap but have separate stack and registers. Processes have completely separate memory space", "Processes share stack. Threads have separate heap"],
    answer: 2, hint: "Context switch between threads is faster than processes because no memory mapping change needed." },

  // ═══════════════════════════════════════
  // SYSTEM DESIGN — MCQs + Analysis
  // ═══════════════════════════════════════

  { id: "sd_1", topic: "System Design", type: "MCQ", difficulty: "medium",
    question: "What does the CAP theorem state?",
    options: ["A distributed system can guarantee all three: Consistency, Availability, Partition tolerance", "A distributed system can guarantee at most two of: Consistency, Availability, Partition tolerance", "CAP only applies to SQL databases", "Consistency and Availability can always coexist"],
    answer: 1, hint: "In practice partition tolerance is mandatory. So choose between Consistency (CP) or Availability (AP)." },

  { id: "sd_2", topic: "System Design", type: "MCQ", difficulty: "hard",
    question: "What is consistent hashing and why is it used in distributed systems?",
    options: ["A password hashing algorithm", "A way to distribute data across nodes where adding/removing nodes only remaps k/n keys instead of all keys", "A consensus algorithm like Raft", "An encryption technique for distributed databases"],
    answer: 1, hint: "Used in Cassandra, DynamoDB, CDNs. Virtual nodes improve load distribution." },

  { id: "sd_3", topic: "System Design", type: "MCQ", difficulty: "hard",
    question: "What is the difference between horizontal and vertical scaling?",
    options: ["No practical difference", "Vertical: add more power to existing machine (scale up). Horizontal: add more machines (scale out). Horizontal has no theoretical limit", "Horizontal scaling is always more expensive", "Vertical scaling is preferred for stateless services"],
    answer: 1, hint: "Horizontal scaling preferred for web servers (stateless). Vertical for databases (stateful) up to a limit." },

  { id: "sd_4", topic: "System Design", type: "MCQ", difficulty: "hard",
    question: "What is the difference between SQL and NoSQL databases? When to choose each?",
    options: ["NoSQL is always faster than SQL", "SQL: structured data, ACID, complex queries. NoSQL: flexible schema, horizontal scaling, high write throughput. Choose based on use case", "SQL cannot scale horizontally", "NoSQL supports ACID transactions just like SQL"],
    answer: 1, hint: "Use SQL for banking, ERP. Use NoSQL for social media feeds, real-time analytics, IoT data." },

  { id: "sd_5", topic: "System Design", type: "MCQ", difficulty: "hard",
    question: "What is database sharding and what problems does it introduce?",
    options: ["Sharding is same as replication", "Sharding horizontally partitions data across multiple databases. Introduces: cross-shard queries complexity, rebalancing difficulty, no cross-shard transactions", "Sharding only works with NoSQL", "Sharding eliminates the need for indexing"],
    answer: 1, hint: "Shard key choice is critical. Hot shards cause uneven load. Resharding is expensive." },

  { id: "sd_6", topic: "System Design", type: "MCQ", difficulty: "medium",
    question: "What is the purpose of a message queue like Kafka or RabbitMQ in system design?",
    options: ["To store data permanently like a database", "To enable async communication, decouple services, handle traffic spikes, and ensure at-least-once delivery", "To replace REST APIs", "Only used for logging purposes"],
    answer: 1, hint: "Producers publish messages. Consumers process at their own pace. Enables fan-out and retry patterns." },

  { id: "sd_7", topic: "System Design", type: "MCQ", difficulty: "hard",
    question: "What is the difference between write-through and write-back caching strategies?",
    options: ["No performance difference", "Write-through: write to cache and DB simultaneously — consistent but slower. Write-back: write to cache first, sync to DB later — faster but risk of data loss", "Write-back is always safer", "Write-through only works with Redis"],
    answer: 1, hint: "Write-through: strong consistency. Write-back: higher performance but needs cache persistence." },

  { id: "sd_8", topic: "System Design", type: "MCQ", difficulty: "hard",
    question: "How does a CDN (Content Delivery Network) improve performance?",
    options: ["By compressing all files by 90%", "By caching static content at edge servers geographically close to users — reducing latency and origin server load", "By speeding up database queries", "By increasing server RAM"],
    answer: 1, hint: "CDN reduces RTT from 200ms to 5ms for static assets. Origin server only serves cache misses." },
];

module.exports = questionBank;
