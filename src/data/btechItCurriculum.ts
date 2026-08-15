import { Course, CareerTrack, StudentProfile } from '../types/curriculum';
import { CAREER_SKILL_MAPS } from './careerSkillMaps';

/**
 * B.Tech Information Technology Curriculum Dataset
 * Quad-Aligned Academic Standard:
 * 1. NUC Computing CCMAS (National Universities Commission Core Curriculum and Minimum Academic Standards)
 * 2. Federal University of Technology, Minna (FUT Minna) - School of ICT (SICT), Department of Information Technology
 * 3. IEEE/ACM IT2017 Curriculum Guidelines for Information Technology Degree Programs
 * 4. ACM/IEEE CS2023 International Computing Curricula
 *
 * Full NUC CCMAS Data Model Hierarchy:
 * COURSE
 *  ├── Course Code
 *  ├── Course Title
 *  ├── Credit Units
 *  ├── Level
 *  ├── Semester
 *  ├── Core/Elective
 *  ├── Prerequisites
 *  ├── Lecture Hours (LH)
 *  ├── Practical Hours (PH)
 *  ├── Learning Outcomes (Bloom's taxonomy outcomes)
 *  ├── Competencies (Cognitive, Technical, Soft)
 *  └── Skills (Knowledge, Practical, Soft, Tools)
 */

export const BTECH_IT_COURSES: Course[] = [
  // ==========================================
  // --- 100 LEVEL / SEMESTER 1 (HARMATTAN) ---
  // ==========================================
  {
    id: 'CS101',
    code: 'MTH 111',
    name: 'Elementary Mathematics I: Algebra & Linear Systems',
    title: 'Elementary Mathematics I: Algebra & Linear Systems',
    semester: 1,
    academicLevel: '100L',
    level: '100L',
    credits: 3,
    type: 'Core',
    courseType: 'Core',
    domain: 'Math & Foundational CS',
    prerequisites: [],
    lectureHours: 3,
    practicalHours: 0,
    learningOutcomes: [
      'Formulate and solve systems of linear equations using Gaussian elimination and matrix inverse methods',
      'Compute matrix determinants, eigenvalues, and eigenvectors for vector transformations',
      'Apply mathematical induction and binomial theorem to algorithmic recurrence proofs',
      'Evaluate coordinate geometry transformations for graphics and spatial data structures'
    ],
    competencies: {
      cognitive: ['Linear Algebraic Reasoning', 'Matrix Transformation Theory', 'Formal Induction Proofs'],
      technical: ['Matrix Inversion Computation', 'Coordinate Systems Modeling'],
      soft: ['Analytical Rigor', 'Structured Problem Decomposition']
    },
    skills: {
      knowledge: ['Linear Algebra', 'Calculus', 'Matrix Decomposition', 'Coordinate Geometry'],
      practical: ['Systems of Linear Equations', 'Eigenvalue Calculation', 'Vector Space Mapping'],
      soft: ['Critical Thinking', 'Mathematical Communication'],
      tools: ['Scientific Notation', 'Linear Equation Solvers']
    },
    skillsAcquired: ['Linear Algebra', 'Calculus', 'Matrix Decomposition', 'Eigenvalues', 'Coordinate Geometry'],
    syllabus: ['Sets & Binary Operations', 'Matrices & Determinants', 'Systems of Linear Equations', 'Eigenvalues & Coordinate Geometry', 'Mathematical Induction'],
    description: 'Foundational mathematical formulation covering linear algebra, vector spaces, matrix decomposition, and algebraic methods essential for computing algorithms.',
    difficulty: 3,
    workloadHours: 5,
    bloomLevel: 'Apply',
    nucCcmasCode: 'CCMAS-MTH101',
    futMinnaCode: 'MTH 111',
    ieeeAcmStandard: 'IEEE/ACM IT2017 (Mathematical Foundations)',
    acmKnowledgeArea: 'Mathematical Foundations & Discrete Structures'
  },
  {
    id: 'CS102',
    code: 'COS 101',
    name: 'Introduction to Computing Sciences & Problem Solving',
    title: 'Introduction to Computing Sciences & Problem Solving',
    semester: 1,
    academicLevel: '100L',
    level: '100L',
    credits: 3,
    type: 'Core',
    courseType: 'Core',
    domain: 'Software Engineering',
    prerequisites: [],
    lectureHours: 2,
    practicalHours: 3,
    learningOutcomes: [
      'Design structured algorithmic workflows using pseudocode and standard flowcharts',
      'Implement procedural programs in C utilizing control structures, arrays, and functions',
      'Manage computer memory allocation using pointers, dynamic references, and stack/heap allocation',
      'Debug syntax, runtime, and logic errors using GNU Compiler Collection (GCC) and terminal debuggers'
    ],
    competencies: {
      cognitive: ['Algorithmic Logic Design', 'Memory Architecture Mental Model', 'Procedural Abstraction'],
      technical: ['C Programming & Compilation', 'Pointer Arithmetic', 'Dynamic Memory Management (malloc/free)'],
      soft: ['Systematic Debugging Persistence', 'Code Documentation Standards']
    },
    skills: {
      knowledge: ['Computing History', 'Von Neumann Architecture', 'Data Types & Control Flow'],
      practical: ['C Programming', 'Algorithmic Thinking', 'Memory Management', 'Structured Programming'],
      soft: ['Logical Reasoning', 'Technical Problem Solving'],
      tools: ['GCC Compiler', 'Linux Terminal', 'GDB Debugger', 'VS Code']
    },
    skillsAcquired: ['C Programming', 'Algorithmic Thinking', 'Memory Management', 'Control Structures', 'Structured Programming'],
    syllabus: ['History & Foundations of Computing', 'Algorithm Design & Flowcharting', 'Procedural Logic & Control Structures', 'Pointers & Dynamic Memory in C', 'Modular Programming'],
    description: 'NUC CCMAS foundational computing course introducing algorithmic problem-solving, structured programming in C, low-level memory concepts, and software logic.',
    difficulty: 3,
    workloadHours: 6,
    bloomLevel: 'Apply',
    nucCcmasCode: 'CCMAS-COS101',
    futMinnaCode: 'IFT 111 / COS 101',
    ieeeAcmStandard: 'IEEE/ACM IT2017 (PF - Programming Fundamentals)',
    acmKnowledgeArea: 'Programming Fundamentals (PF)'
  },
  {
    id: 'CS103',
    code: 'PHY 113',
    name: 'General Physics I: Mechanics & Thermal Physics',
    title: 'General Physics I: Mechanics & Thermal Physics',
    semester: 1,
    academicLevel: '100L',
    level: '100L',
    credits: 3,
    type: 'Core',
    courseType: 'Core',
    domain: 'Hardware & Embedded',
    prerequisites: [],
    lectureHours: 2,
    practicalHours: 3,
    learningOutcomes: [
      'Analyze physical forces, kinematics, and energy conservation equations in hardware systems',
      'Explain semiconductor physics principles governing transistor switches and integrated circuits',
      'Conduct laboratory experiments with electronic measurement transducers and sensors',
      'Quantify thermal dissipation limits in microprocessor packaging and computing hardware'
    ],
    competencies: {
      cognitive: ['Physical Transducer Physics', 'Semiconductor Energy Band Theory', 'Thermal Dissipation Models'],
      technical: ['Oscilloscope Operation', 'Sensor Signal Calibration', 'Physical Measurements'],
      soft: ['Laboratory Safety Protocol', 'Experimental Data Reporting']
    },
    skills: {
      knowledge: ['Newtonian Mechanics', 'Thermodynamics', 'Semiconductor Basics'],
      practical: ['Applied Mechanics', 'Circuit Theory', 'Sensor Physics', 'Transducer Calibration'],
      soft: ['Empirical Verification', 'Lab Teamwork'],
      tools: ['Multimeter', 'Oscilloscope', 'Vernier Calipers']
    },
    skillsAcquired: ['Applied Mechanics', 'Semiconductors', 'Optoelectronics', 'Circuit Theory', 'Sensor Physics'],
    syllabus: ['Vectors & Kinematics', 'Newtonian Mechanics & Gravitation', 'Work, Energy & Momentum', 'Thermodynamics & Heat Transfer', 'Physical Principles of Transducers'],
    description: 'Physical principles of mechanics, motion, semiconductors, and electronic transducers underpinning microprocessor and computing hardware engineering.',
    difficulty: 3,
    workloadHours: 4,
    bloomLevel: 'Understand',
    nucCcmasCode: 'CCMAS-PHY101',
    futMinnaCode: 'PHY 113',
    ieeeAcmStandard: 'IEEE/ACM IT2017 (Physical Foundations)',
    acmKnowledgeArea: 'Physical Sciences & Electronics'
  },
  {
    id: 'CS104',
    code: 'GST 111',
    name: 'Communication in English & Academic Writing',
    title: 'Communication in English & Academic Writing',
    semester: 1,
    academicLevel: '100L',
    level: '100L',
    credits: 2,
    type: 'Humanities',
    courseType: 'Humanities',
    domain: 'Software Engineering',
    prerequisites: [],
    lectureHours: 2,
    practicalHours: 0,
    learningOutcomes: [
      'Write clear, concise technical and academic reports adhering to standard citation formats',
      'Deliver structured oral presentations explaining complex technical concepts to non-technical stakeholders',
      'Analyze academic prose for logical fallacies, coherence, and grammatical accuracy',
      'Synthesize library and digital research sources into cohesive technical briefs'
    ],
    competencies: {
      cognitive: ['Discourse Analysis', 'Logical Argumentation', 'Syntactic Evaluation'],
      technical: ['Technical Documentation', 'Formal Citation Formatting (IEEE/APA)'],
      soft: ['Professional Written Communication', 'Oral Presentation Confidence', 'Active Listening']
    },
    skills: {
      knowledge: ['Academic Discourse', 'Grammar & Syntax Rules', 'Research Methodologies'],
      practical: ['Technical Writing', 'Report Structuring', 'Oral Presentation'],
      soft: ['Clarity of Expression', 'Interpersonal Empathy', 'Executive Summarization'],
      tools: ['LaTeX Basics', 'Grammar Checkers', 'Reference Management Tools']
    },
    skillsAcquired: ['Technical Writing', 'Academic Discourse', 'Grammar & Syntax', 'Presentation Skills'],
    syllabus: ['Study Skills & Library Use', 'Reading Comprehension', 'Sentence Structure & Mechanics', 'Technical Reports & Scientific Writing'],
    description: 'Mandatory NUC General Studies curriculum imparting professional technical communication, logical argument formulation, and academic writing proficiency.',
    difficulty: 1,
    workloadHours: 3,
    bloomLevel: 'Understand',
    nucCcmasCode: 'CCMAS-GST111',
    futMinnaCode: 'GST 111',
    ieeeAcmStandard: 'IEEE/ACM IT2017 (SP - Social and Professional Issues)',
    acmKnowledgeArea: 'Social & Professional Issues (SP)'
  },

  // =======================================
  // --- 100 LEVEL / SEMESTER 2 (RAIN) ---
  // =======================================
  {
    id: 'CS201',
    code: 'STA 121',
    name: 'Probability & Applied Statistics for Computing',
    title: 'Probability & Applied Statistics for Computing',
    semester: 2,
    academicLevel: '100L',
    level: '100L',
    credits: 3,
    type: 'Core',
    courseType: 'Core',
    domain: 'Math & Foundational CS',
    prerequisites: ['CS101'],
    lectureHours: 3,
    practicalHours: 0,
    learningOutcomes: [
      'Calculate discrete and continuous probability distributions (Binomial, Poisson, Gaussian, Exponential)',
      'Apply Bayes theorem to probabilistic decision-making and conditional probability estimation',
      'Conduct statistical hypothesis testing (t-test, chi-square, ANOVA) and confidence interval analysis',
      'Formulate linear regression models and evaluate correlation coefficients on empirical data'
    ],
    competencies: {
      cognitive: ['Probabilistic Modeling', 'Inferential Statistical Reasoning', 'Bayesian Decision Theory'],
      technical: ['Hypothesis Testing Formulation', 'Regression Analysis Execution'],
      soft: ['Data Skepticism', 'Evidence-Based Reasoning']
    },
    skills: {
      knowledge: ['Probability Axioms', 'Random Variables', 'Sampling Distributions', 'Central Limit Theorem'],
      practical: ['Probability Theory', 'Hypothesis Testing', 'Bayesian Inference', 'Statistical Modeling'],
      soft: ['Quantitative Thinking', 'Data Interpretation'],
      tools: ['R Programming Basics', 'Excel Statistical Toolpak', 'SciPy Stats']
    },
    skillsAcquired: ['Probability Theory', 'Hypothesis Testing', 'Random Variables', 'Bayesian Inference', 'Statistical Modeling'],
    syllabus: ['Probability Laws & Bayes Theorem', 'Discrete & Continuous Probability Distributions', 'Sampling Theory & Central Limit Theorem', 'Hypothesis Testing & Regression Analysis'],
    description: 'Probability models, statistical inference, and distributions crucial for machine learning, data science, queueing networks, and probabilistic computing.',
    difficulty: 4,
    workloadHours: 6,
    bloomLevel: 'Analyze',
    nucCcmasCode: 'CCMAS-STA102',
    futMinnaCode: 'STA 121',
    ieeeAcmStandard: 'IEEE/ACM CS2023 (Probability & Stochastic Processes)',
    acmKnowledgeArea: 'Mathematical Foundations & Data Science'
  },
  {
    id: 'CS202',
    code: 'IFT 121',
    name: 'Fundamentals of Information Technology & Web Systems',
    title: 'Fundamentals of Information Technology & Web Systems',
    semester: 2,
    academicLevel: '100L',
    level: '100L',
    credits: 3,
    type: 'Core',
    courseType: 'Core',
    domain: 'Software Engineering',
    prerequisites: ['CS102'],
    lectureHours: 2,
    practicalHours: 3,
    learningOutcomes: [
      'Construct semantic HTML5 documents structured with modern CSS3 Flexbox and Grid layouts',
      'Develop interactive client-side web applications using JavaScript DOM manipulation and event handlers',
      'Explain client-server network interaction protocols including HTTP/HTTPS, DNS, and REST requests',
      'Implement responsive, mobile-first layouts compliant with WCAG web accessibility standards'
    ],
    competencies: {
      cognitive: ['Web Architecture Understanding', 'Client-Server Separation Model', 'DOM Tree Mental Model'],
      technical: ['Responsive Web Design', 'Vanilla JavaScript Programming', 'HTTP Request Lifecycle Debugging'],
      soft: ['User Experience Empathy', 'Visual Interface Attention to Detail']
    },
    skills: {
      knowledge: ['Web Protocols', 'Browser Engine Architecture', 'Semantic Web Standards'],
      practical: ['HTML5 & CSS3', 'JavaScript Basics', 'Web Architecture', 'Client-Server Communication', 'UI Basics'],
      soft: ['Accessibility Consciousness', 'UI Design Thinking'],
      tools: ['Chrome DevTools', 'VS Code', 'Git', 'CSS Grid/Flexbox']
    },
    skillsAcquired: ['HTML5 & CSS3', 'JavaScript Basics', 'Web Architecture', 'Client-Server Communication', 'UI Basics'],
    syllabus: ['Evolution of IT & Digital Systems', 'Web Protocols (HTTP/HTTPS, DNS)', 'HTML5, Semantic Markup & CSS3 Layouts', 'Client-Side JavaScript & DOM API', 'Responsive Web Design'],
    description: 'FUT Minna IT Department core course covering fundamental IT architecture, internet technologies, modern web standards, and digital communication.',
    difficulty: 3,
    workloadHours: 6,
    bloomLevel: 'Apply',
    nucCcmasCode: 'CCMAS-IFT102',
    futMinnaCode: 'IFT 121',
    ieeeAcmStandard: 'IEEE/ACM IT2017 (IT-FND & WEB - Information Technology Foundations)',
    acmKnowledgeArea: 'IT Foundations (IT-FND)'
  },
  {
    id: 'CS203',
    code: 'CPT 122',
    name: 'Digital Logic & Computer Organization',
    title: 'Digital Logic & Computer Organization',
    semester: 2,
    academicLevel: '100L',
    level: '100L',
    credits: 3,
    type: 'Core',
    courseType: 'Core',
    domain: 'Hardware & Embedded',
    prerequisites: [],
    lectureHours: 2,
    practicalHours: 3,
    learningOutcomes: [
      'Simplify Boolean algebraic expressions using Karnaugh Maps (K-Maps) and Quine-McCluskey methods',
      'Design combinational digital logic circuits (Adders, Subtractors, Encoders, Multiplexers)',
      'Construct sequential circuits incorporating D/JK flip-flops, synchronous counters, and shift registers',
      'Model basic Arithmetic Logic Unit (ALU) and central register file architecture'
    ],
    competencies: {
      cognitive: ['Boolean Optimization', 'State Machine Modeling', 'Instruction Execution Cycle Theory'],
      technical: ['Logic Circuit Simulation', 'Breadboard Circuit Prototyping', 'Schematic Capture'],
      soft: ['Precision Troubleshooting', 'Schematic Documentation']
    },
    skills: {
      knowledge: ['Number Systems', 'Combinational Logic', 'Sequential Logic', 'ALU Architecture'],
      practical: ['Digital Circuits', 'Boolean Algebra', 'Logic Gates', 'Circuit Prototyping'],
      soft: ['Diagnostic Thinking', 'Lab Accuracy'],
      tools: ['Logisim', 'Proteus / Multisim', 'Digital Breadboards', 'TTL 7400 ICs']
    },
    skillsAcquired: ['Digital Circuits', 'Boolean Algebra', 'Logic Gates', 'Combinational Circuits', 'Sequential Logic'],
    syllabus: ['Number Systems & Binary Arithmetic', 'Boolean Algebra & Logic Simplification (K-Maps)', 'Combinational Logic (Adders, Multiplexers, Decoders)', 'Sequential Circuits (Flip-Flops, Registers, Counters)', 'Memory Elements & Basic ALU'],
    description: 'Hardware foundations of digital systems, Boolean optimization, combinational and sequential circuit design, and ALU building blocks.',
    difficulty: 3,
    workloadHours: 5,
    bloomLevel: 'Apply',
    nucCcmasCode: 'CCMAS-COS102',
    futMinnaCode: 'CPT 122 / IFT 122',
    ieeeAcmStandard: 'IEEE/ACM IT2017 (PT - Platform Technologies & Hardware)',
    acmKnowledgeArea: 'Platform Technologies (PT)'
  },
  {
    id: 'CS204',
    code: 'GST 112',
    name: 'Nigerian Peoples, Culture & Social Transformation',
    title: 'Nigerian Peoples, Culture & Social Transformation',
    semester: 2,
    academicLevel: '100L',
    level: '100L',
    credits: 2,
    type: 'Humanities',
    courseType: 'Humanities',
    domain: 'Software Engineering',
    prerequisites: [],
    lectureHours: 2,
    practicalHours: 0,
    learningOutcomes: [
      'Explain the cultural, ethnic, and institutional diversity shaping Nigerian socio-economic growth',
      'Analyze the historical transformation and technological evolution of Nigerian society',
      'Evaluate ethical citizenship responsibilities in the context of emerging digital economies',
      'Propose tech-driven solutions addressing societal challenges in health, agriculture, and governance'
    ],
    competencies: {
      cognitive: ['Socio-Cultural Contextualization', 'National Development Policy Analysis'],
      technical: ['Socio-Technical Impact Assessment'],
      soft: ['Cultural Intelligence', 'Social Responsibility', 'Civic Leadership']
    },
    skills: {
      knowledge: ['Nigerian History', 'Indigenous Knowledge Systems', 'Constitutional Frameworks'],
      practical: ['Cultural Intelligence', 'Civic Ethics', 'Social Responsibility'],
      soft: ['Empathy', 'Cross-Cultural Communication', 'Ethical Citizenship'],
      tools: ['Civic Research Portals', 'Case Study Frameworks']
    },
    skillsAcquired: ['Cultural Intelligence', 'National Development', 'Civic Ethics', 'Social Responsibility'],
    syllabus: ['Cultural Diversity & Indigenous Knowledge Systems', 'Evolution of Nigerian State', 'Social Structure & Norms', 'Technological Innovation in National Growth'],
    description: 'National Universities Commission general benchmark course analyzing historical, cultural, and socio-economic systems of Nigeria.',
    difficulty: 1,
    workloadHours: 2,
    bloomLevel: 'Understand',
    nucCcmasCode: 'CCMAS-GST112',
    futMinnaCode: 'GST 112',
    ieeeAcmStandard: 'IEEE/ACM IT2017 (SP - Professional & Civic Responsibility)',
    acmKnowledgeArea: 'Social & Professional Issues (SP)'
  },

  // ==========================================
  // --- 200 LEVEL / SEMESTER 3 (HARMATTAN) ---
  // ==========================================
  {
    id: 'CS301',
    code: 'MTH 211',
    name: 'Discrete Mathematical Structures for Computing',
    title: 'Discrete Mathematical Structures for Computing',
    semester: 3,
    academicLevel: '200L',
    level: '200L',
    credits: 3,
    type: 'Core',
    courseType: 'Core',
    domain: 'Math & Foundational CS',
    prerequisites: ['CS101'],
    lectureHours: 3,
    practicalHours: 0,
    learningOutcomes: [
      'Construct formal mathematical proofs using propositional and predicate logic',
      'Apply set theory, relations, and equivalence classes to relational database formulations',
      'Model complex network topologies and scheduling dependencies using graph and tree theory',
      'Calculate combinatorial permutations, combinations, and recurrence relations for complexity bounds'
    ],
    competencies: {
      cognitive: ['Formal Mathematical Logic', 'Graph Theoretical Modeling', 'Combinatorial Analysis'],
      technical: ['Graph Traversal Mathematical Formulation', 'Relational Algebra Proofs'],
      soft: ['Rigorous Logical Deduction', 'Abstract Conceptual Thinking']
    },
    skills: {
      knowledge: ['Predicate Logic', 'Set Theory & Relations', 'Graph Theory', 'Combinatorics'],
      practical: ['Discrete Structures', 'Graph Theory', 'Predicate Logic', 'Combinatorics', 'Recurrence Relations'],
      soft: ['Formal Reasoning', 'Algorithmic Proof Strategy'],
      tools: ['Proof Assistants Basics', 'Graph Visualizers']
    },
    skillsAcquired: ['Discrete Structures', 'Graph Theory', 'Predicate Logic', 'Combinatorics', 'Recurrence Relations'],
    syllabus: ['Propositional & Predicate Logic', 'Set Theory, Relations & Functions', 'Combinatorics & Pigeonhole Principle', 'Graph Theory (Trees, Paths, Cycles, Planarity)', 'Recurrence Relations & Generating Functions'],
    description: 'Mathematical structures underpinning theoretical computer science: formal logic, graph theory, combinatorics, and discrete mathematical proof techniques.',
    difficulty: 4,
    workloadHours: 6,
    bloomLevel: 'Analyze',
    nucCcmasCode: 'CCMAS-COS201',
    futMinnaCode: 'MTH 211',
    ieeeAcmStandard: 'IEEE/ACM CS2023 (Discrete Structures - DS)',
    acmKnowledgeArea: 'Discrete Structures (DS)'
  },
  {
    id: 'CS302',
    code: 'IFT 211',
    name: 'Data Structures & Algorithms',
    title: 'Data Structures & Algorithms',
    semester: 3,
    academicLevel: '200L',
    level: '200L',
    credits: 3,
    type: 'Core',
    courseType: 'Core',
    domain: 'Math & Foundational CS',
    prerequisites: ['CS102'],
    lectureHours: 2,
    practicalHours: 3,
    learningOutcomes: [
      'Implement linear and non-linear data structures (Linked Lists, Stacks, Queues, Binary Trees, Hash Tables, Heaps)',
      'Analyze worst-case, average-case, and amortized algorithm complexity using Big-O, Big-Omega, and Big-Theta notation',
      'Design efficient sorting and searching algorithms (Quicksort, Mergesort, Binary Search, Dijkstra, A*)',
      'Solve optimization problems using dynamic programming, greedy strategies, and divide-and-conquer paradigms'
    ],
    competencies: {
      cognitive: ['Asymptotic Complexity Analysis', 'Algorithmic Optimization Paradigms', 'Spatial-Temporal Trade-off Analysis'],
      technical: ['Custom Data Structure Implementation', 'Tree & Graph Traversal Coding', 'Dynamic Programming Implementation'],
      soft: ['Algorithmic Problem-Solving Discipline', 'Code Efficiency Optimization']
    },
    skills: {
      knowledge: ['Asymptotic Notation', 'Data Structure Internals', 'Algorithm Design Techniques'],
      practical: ['Data Structures', 'Dynamic Programming', 'Algorithm Design', 'Complexity Analysis', 'Tree Traversal'],
      soft: ['Algorithmic Rigor', 'Optimization Mindset'],
      tools: ['C++/Java/Python Profilers', 'LeetCode / Codeforces Benchmark Suites']
    },
    skillsAcquired: ['Data Structures', 'Dynamic Programming', 'Algorithm Design', 'Complexity Analysis', 'Tree Traversal'],
    syllabus: ['Asymptotic Notation & Complexity Analysis', 'Linear Data Structures (Arrays, Linked Lists, Stacks, Queues)', 'Trees, Binary Search Trees & AVL Balancing', 'Graph Representations & Search (BFS, DFS, Shortest Paths)', 'Dynamic Programming & Greedy Algorithms'],
    description: 'Core computing science curriculum covering foundational linear/non-linear structures, Big-O complexity analysis, and algorithmic optimization techniques.',
    difficulty: 4,
    workloadHours: 8,
    bloomLevel: 'Apply',
    nucCcmasCode: 'CCMAS-COS202',
    futMinnaCode: 'IFT 211 / COS 201',
    ieeeAcmStandard: 'IEEE/ACM CS2023 (AL - Algorithms and Complexity)',
    acmKnowledgeArea: 'Algorithms & Complexity (AL)'
  },
  {
    id: 'CS303',
    code: 'IFT 212',
    name: 'Object-Oriented Programming in Java & C++',
    title: 'Object-Oriented Programming in Java & C++',
    semester: 3,
    academicLevel: '200L',
    level: '200L',
    credits: 3,
    type: 'Core',
    courseType: 'Core',
    domain: 'Software Engineering',
    prerequisites: ['CS102'],
    lectureHours: 2,
    practicalHours: 3,
    learningOutcomes: [
      'Apply the four pillars of OOP (Encapsulation, Inheritance, Polymorphism, Abstraction) in Java and C++',
      'Implement enterprise design patterns (Factory, Singleton, Observer, Strategy) to solve software architecture problems',
      'Manage multi-threaded concurrency, thread synchronization, and race conditions safely',
      'Build robust applications handling runtime exceptions, file streams, and generic collections'
    ],
    competencies: {
      cognitive: ['Object-Oriented Modeling', 'Design Pattern Selection', 'Polymorphic Architecture'],
      technical: ['Java 17+ / C++ OOP Implementation', 'Multithreading & Concurrency', 'Unit Testing (JUnit)'],
      soft: ['Clean Code Craftsmanship', 'Modular Software Architecture']
    },
    skills: {
      knowledge: ['OOP Principles', 'JVM Architecture & Memory Model', 'Design Patterns', 'Generic Types'],
      practical: ['Java', 'Design Patterns', 'Encapsulation', 'Polymorphism', 'Multi-threading'],
      soft: ['Code Modularity', 'Refactoring Discipline'],
      tools: ['IntelliJ IDEA', 'JUnit 5', 'Maven / Gradle', 'Java VisualVM']
    },
    skillsAcquired: ['Java', 'Design Patterns', 'Encapsulation', 'Polymorphism', 'Multi-threading'],
    syllabus: ['OOP Principles: Abstraction, Encapsulation, Inheritance, Polymorphism', 'Java Class Architecture & Memory Model', 'Exception Handling & Input/Output Streams', 'Generics & Collection Framework', 'Multi-threading, Concurrency & Design Patterns'],
    description: 'Enterprise object-oriented software engineering covering encapsulation, polymorphism, generics, multi-threading, design patterns, and JVM architecture.',
    difficulty: 3,
    workloadHours: 7,
    bloomLevel: 'Apply',
    nucCcmasCode: 'CCMAS-IFT201',
    futMinnaCode: 'IFT 212 / CPT 211',
    ieeeAcmStandard: 'IEEE/ACM IT2017 (SDF - Software Development Fundamentals)',
    acmKnowledgeArea: 'Software Development Fundamentals (SDF)'
  },
  {
    id: 'CS304',
    code: 'ENT 211',
    name: 'Entrepreneurship & Innovation in IT Ventures',
    title: 'Entrepreneurship & Innovation in IT Ventures',
    semester: 3,
    academicLevel: '200L',
    level: '200L',
    credits: 2,
    type: 'Humanities',
    courseType: 'Humanities',
    domain: 'Software Engineering',
    prerequisites: [],
    lectureHours: 2,
    practicalHours: 0,
    learningOutcomes: [
      'Develop viable Business Model Canvases (BMC) for tech startups within the African digital ecosystem',
      'Conduct financial forecasting, unit economics analysis, and venture pitch deck preparation',
      'Evaluate intellectual property rights (patents, copyrights, trademarks) in software development',
      'Formulate go-to-market strategies and product-market fit validation frameworks'
    ],
    competencies: {
      cognitive: ['Venture Opportunity Recognition', 'Business Model Structuring', 'Unit Economics Valuation'],
      technical: ['Pitch Deck Creation', 'Financial Modeling Spreadsheets'],
      soft: ['Entrepreneurial Resilience', 'Venture Pitching & Persuasion', 'Commercial Acumen']
    },
    skills: {
      knowledge: ['Lean Startup Methodology', 'Intellectual Property Law', 'Venture Capital & Funding'],
      practical: ['Business Model Canvas', 'Tech Venturing', 'Product-Market Fit', 'Financial Modeling'],
      soft: ['Commercial Acumen', 'Pitching', 'Stakeholder Negotiation'],
      tools: ['Business Model Canvas', 'Pitch Platforms', 'Financial Spreadsheets']
    },
    skillsAcquired: ['Business Model Canvas', 'Tech Venturing', 'Product-Market Fit', 'Financial Modeling', 'Pitching'],
    syllabus: ['Concepts of Entrepreneurship & Innovation', 'Opportunity Identification in Nigerian Tech Ecosystem', 'Business Model Canvas & Product-Market Fit', 'Venture Financing, Bootstrapping & Angel Funding', 'Intellectual Property Protection for Tech Ventures'],
    description: 'NUC entrepreneurship curriculum preparing computing undergraduates to ideate, finance, validate, and launch high-impact digital ventures in Nigeria.',
    difficulty: 2,
    workloadHours: 3,
    bloomLevel: 'Understand',
    nucCcmasCode: 'CCMAS-ENT211',
    futMinnaCode: 'ENT 211',
    ieeeAcmStandard: 'IEEE/ACM IT2017 (SP - Social and Professional Issues)',
    acmKnowledgeArea: 'Social & Professional Issues (SP)'
  },

  // =======================================
  // --- 200 LEVEL / SEMESTER 4 (RAIN) ---
  // =======================================
  {
    id: 'CS401',
    code: 'IFT 221',
    name: 'Computer Systems Architecture & Assembly Programming',
    title: 'Computer Systems Architecture & Assembly Programming',
    semester: 4,
    academicLevel: '200L',
    level: '200L',
    credits: 3,
    type: 'Core',
    courseType: 'Core',
    domain: 'Hardware & Embedded',
    prerequisites: ['CS203'],
    lectureHours: 2,
    practicalHours: 3,
    learningOutcomes: [
      'Write assembly language programs (x86/ARM/MIPS) utilizing registers, stack frames, and interrupts',
      'Explain instruction pipeline stages, branch prediction, and pipeline hazard resolution techniques',
      'Analyze memory hierarchy performance, cache mapping policies (L1/L2/L3), and cache hit/miss rates',
      'Evaluate RISC vs CISC architectural trade-offs in modern mobile and server processors'
    ],
    competencies: {
      cognitive: ['Microarchitectural Reasoning', 'Instruction Set Architecture (ISA) Modeling', 'Memory Hierarchy Analysis'],
      technical: ['Assembly Language Coding', 'Cache Performance Profiling', 'Interrupt Handling Setup'],
      soft: ['Low-Level Hardware Intuition', 'Optimization Precision']
    },
    skills: {
      knowledge: ['Von Neumann vs Harvard Architecture', 'Instruction Set Architecture', 'Pipelining & Hazards', 'Cache Memory Mapping'],
      practical: ['Assembly Language', 'Microarchitecture', 'Instruction Sets (RISC/CISC)', 'Pipelining', 'Cache Hierarchies'],
      soft: ['Low-Level Logic', 'Hardware-Software Interfacing'],
      tools: ['NASM / MARS MIPS Simulator', 'QEMU', 'GDB Machine Code Inspection']
    },
    skillsAcquired: ['Assembly Language', 'Microarchitecture', 'Instruction Sets (RISC/CISC)', 'Pipelining', 'Cache Hierarchies'],
    syllabus: ['Instruction Set Architectures (ISA) - RISC vs CISC', 'Assembly Language Programming (x86 / ARM)', 'Instruction Pipelining & Hazard Mitigation', 'Memory Hierarchy, Cache Mapping & Virtual Memory', 'I/O Interfacing, Interrupts & Direct Memory Access (DMA)'],
    description: 'Hardware-software interface curriculum covering ISA design, assembly programming, CPU pipelining, multi-level cache hierarchies, and memory management units.',
    difficulty: 4,
    workloadHours: 7,
    bloomLevel: 'Analyze',
    nucCcmasCode: 'CCMAS-COS203',
    futMinnaCode: 'IFT 221 / CPT 221',
    ieeeAcmStandard: 'IEEE/ACM CS2023 (AR - Architecture and Organization)',
    acmKnowledgeArea: 'Architecture & Organization (AR)'
  },
  {
    id: 'CS402',
    code: 'IFT 222',
    name: 'Operating Systems Principles & Concurrency',
    title: 'Operating Systems Principles & Concurrency',
    semester: 4,
    academicLevel: '200L',
    level: '200L',
    credits: 3,
    type: 'Core',
    courseType: 'Core',
    domain: 'Cloud & Systems',
    prerequisites: ['CS302'],
    lectureHours: 2,
    practicalHours: 3,
    learningOutcomes: [
      'Model process scheduling algorithms (Round Robin, Multilevel Feedback Queues, CFS) and context switching',
      'Resolve deadlock and race conditions using semaphores, mutex locks, monitors, and Banker\'s algorithm',
      'Explain virtual memory paging, segmentation, TLB caching, and page replacement policies (LRU, Clock)',
      'Program Linux system calls for process creation (fork/exec), IPC pipes, and POSIX thread management'
    ],
    competencies: {
      cognitive: ['Concurrency Control Models', 'Kernel Architecture Mental Model', 'Memory Virtualization Theory'],
      technical: ['POSIX System Call Programming (C/Linux)', 'Process Synchronization Coding', 'Thread Concurrency Management'],
      soft: ['Systems-Level Analytical Thinking', 'Concurrency Hazard Awareness']
    },
    skills: {
      knowledge: ['Process Control Blocks', 'Deadlock Characterization', 'Virtual Memory & Paging', 'File System Layouts'],
      practical: ['Process Management', 'Memory Paging', 'Concurrency Control', 'Deadlock Mitigation', 'Kernel Structures'],
      soft: ['Multi-Threaded Thinking', 'Systems Reliability Mindset'],
      tools: ['Linux POSIX APIs', 'Valgrind / Helgrind', 'Strace / GDB', 'Bash Shell']
    },
    skillsAcquired: ['Process Management', 'Memory Paging', 'Concurrency Control', 'Deadlock Mitigation', 'Kernel Structures'],
    syllabus: ['OS Architecture, Kernel Modes & System Calls', 'Process Lifecycle, Context Switching & CPU Scheduling', 'Inter-Process Communication (IPC) & Synchronization', 'Deadlocks: Prevention, Detection & Recovery', 'Virtual Memory, Page Replacement & Storage Systems'],
    description: 'System-level core exploring kernel architecture, process scheduling, concurrency primitives, virtual memory paging, and storage file systems.',
    difficulty: 4,
    workloadHours: 7,
    bloomLevel: 'Apply',
    nucCcmasCode: 'CCMAS-IFT202',
    futMinnaCode: 'IFT 222 / CPT 222',
    ieeeAcmStandard: 'IEEE/ACM IT2017 (PT & SYS - System Architecture)',
    acmKnowledgeArea: 'System Architecture & OS (SYS)'
  },
  {
    id: 'CS403',
    code: 'IFT 223',
    name: 'Computer Networks & Data Communications',
    title: 'Computer Networks & Data Communications',
    semester: 4,
    academicLevel: '200L',
    level: '200L',
    credits: 3,
    type: 'Core',
    courseType: 'Core',
    domain: 'Cybersecurity & Networks',
    prerequisites: ['CS102'],
    lectureHours: 2,
    practicalHours: 3,
    learningOutcomes: [
      'Map OSI 7-Layer and TCP/IP 4-Layer protocols from physical transmission to application layer',
      'Calculate IPv4/IPv6 VLSM subnetting schemes and routing tables (OSPF, BGP, RIP)',
      'Analyze network traffic packets, handshake sequences, and retransmissions using Wireshark',
      'Build socket-based network applications implementing client-server TCP/UDP communication'
    ],
    competencies: {
      cognitive: ['Layered Protocol Architecture', 'Routing & Switching Theory', 'Network Reliability Mechanisms'],
      technical: ['Packet Capture & Inspection (Wireshark)', 'Subnet Allocation Calculations', 'Socket Programming (Python/C)'],
      soft: ['Structured Troubleshooting Methodology', 'Network Topology Visualization']
    },
    skills: {
      knowledge: ['OSI & TCP/IP Reference Models', 'Subnetting & CIDR', 'Routing Protocols', 'Transport Layer Reliability'],
      practical: ['TCP/IP Stack', 'Routing Protocols (OSPF/BGP)', 'Subnetting & CIDR', 'Packet Analysis', 'Socket Programming'],
      soft: ['Diagnostic Logic', 'Network Topology Planning'],
      tools: ['Wireshark', 'Cisco Packet Tracer', 'GNS3', 'Python Socket API', 'Nmap']
    },
    skillsAcquired: ['TCP/IP Stack', 'Routing Protocols (OSPF/BGP)', 'Subnetting & CIDR', 'Packet Analysis', 'Socket Programming'],
    syllabus: ['OSI 7-Layer & TCP/IP Reference Models', 'Physical & Data Link Layers (Ethernet, MAC, Error Control)', 'Network Layer: IPv4/IPv6 Addressing, Subnetting & Routing (OSPF, BGP)', 'Transport Layer: TCP Congestion Control & UDP Protocols', 'Application Layer Protocols: DNS, HTTP, SSH, DHCP'],
    description: 'Comprehensive network engineering addressing OSI/TCP models, packet switching, CIDR subnetting, dynamic routing protocols, and traffic analysis.',
    difficulty: 3,
    workloadHours: 6,
    bloomLevel: 'Apply',
    nucCcmasCode: 'CCMAS-IFT204',
    futMinnaCode: 'IFT 223',
    ieeeAcmStandard: 'IEEE/ACM IT2017 (NET - Networking)',
    acmKnowledgeArea: 'Networking (NET)'
  },
  {
    id: 'CS404',
    code: 'IFT 224',
    name: 'Database Design & Relational Modeling',
    title: 'Database Design & Relational Modeling',
    semester: 4,
    academicLevel: '200L',
    level: '200L',
    credits: 3,
    type: 'Core',
    courseType: 'Core',
    domain: 'Software Engineering',
    prerequisites: ['CS102'],
    lectureHours: 2,
    practicalHours: 3,
    learningOutcomes: [
      'Design Entity-Relationship Diagrams (ERD) normalized from 1NF through BCNF to eliminate data anomalies',
      'Execute complex SQL queries incorporating multi-table joins, subqueries, aggregations, and window functions',
      'Implement ACID transactions with appropriate isolation levels and concurrency locking mechanisms',
      'Optimize relational database performance using B-Tree indexing and query execution plan analysis (EXPLAIN)'
    ],
    competencies: {
      cognitive: ['Relational Schema Normalization', 'Transactional ACID Guarantees', 'Query Optimization Theory'],
      technical: ['Advanced SQL Query Writing', 'Relational Schema Migration', 'Index Architecture & Tuning'],
      soft: ['Data Integrity Discipline', 'Schema Design Clarity']
    },
    skills: {
      knowledge: ['Relational Algebra', 'Functional Dependencies', 'Normalization (1NF-BCNF)', 'ACID Transactions'],
      practical: ['SQL', 'Relational Schema Design', 'Query Optimization', 'Normalization (1NF to BCNF)', 'ACID Transactions'],
      soft: ['Data Rigor', 'Structured Modeling'],
      tools: ['PostgreSQL', 'MySQL Workbench', 'DBeaver', 'Prisma ORM']
    },
    skillsAcquired: ['SQL', 'Relational Schema Design', 'Query Optimization', 'Normalization (1NF to BCNF)', 'ACID Transactions'],
    syllabus: ['Database Models & Relational Algebra Foundations', 'Conceptual Modeling: Entity-Relationship Diagrams (ERD)', 'Normalization Theory: 1NF, 2NF, 3NF & Boyce-Codd (BCNF)', 'Structured Query Language (SQL) - DDL, DML & Advanced Joins', 'Transaction Management, ACID Properties & Concurrency Locking'],
    description: 'Relational database architecture, conceptual ER modeling, rigorous normalization theory, SQL query optimization, and transaction safety.',
    difficulty: 3,
    workloadHours: 6,
    bloomLevel: 'Apply',
    nucCcmasCode: 'CCMAS-IFT203',
    futMinnaCode: 'IFT 224 / CPT 223',
    ieeeAcmStandard: 'IEEE/ACM IT2017 (IM - Information Management)',
    acmKnowledgeArea: 'Information Management (IM)'
  },

  // ==========================================
  // --- 300 LEVEL / SEMESTER 5 (HARMATTAN) ---
  // ==========================================
  {
    id: 'CS501',
    code: 'IFT 311',
    name: 'Software Engineering Principles & Agile Methodologies',
    title: 'Software Engineering Principles & Agile Methodologies',
    semester: 5,
    academicLevel: '300L',
    level: '300L',
    credits: 3,
    type: 'Core',
    courseType: 'Core',
    domain: 'Software Engineering',
    prerequisites: ['CS303'],
    lectureHours: 2,
    practicalHours: 3,
    learningOutcomes: [
      'Lead Agile Scrum sprints, backlog grooming, and sprint retrospectives in team development environments',
      'Model software systems using UML diagrams (Class, Sequence, Activity, Statechart) and C4 architectural models',
      'Implement Automated Test-Driven Development (TDD) incorporating unit, integration, and regression suites',
      'Manage team codebases with Git branching strategies, pull request reviews, and semantic versioning'
    ],
    competencies: {
      cognitive: ['Software Lifecycle Modeling', 'Architectural Decomposition', 'Quality Assurance Frameworks'],
      technical: ['Agile Project Execution (Jira/GitHub Projects)', 'UML Modeling', 'CI/CD Test Automation'],
      soft: ['Cross-Functional Team Collaboration', 'Peer Code Review Empathy', 'Project Delivery Discipline']
    },
    skills: {
      knowledge: ['SDLC Models', 'Agile & Scrum Frameworks', 'Software Quality Metrics', 'Clean Architecture'],
      practical: ['Agile Development', 'Software Architecture', 'UML Modeling', 'Test-Driven Development', 'CI/CD Pipelines'],
      soft: ['Sprint Management', 'Constructive Code Review', 'Client Requirement Negotiation'],
      tools: ['Jira / Linear', 'GitHub Actions', 'Lucidchart / PlantUML', 'Jest / JUnit', 'SonarQube']
    },
    skillsAcquired: ['Agile Development', 'Software Architecture', 'UML Modeling', 'Test-Driven Development', 'CI/CD Pipelines'],
    syllabus: ['Software Development Life Cycle (SDLC) & Agile/Scrum Frameworks', 'Requirements Engineering & UML Modeling', 'Architectural Patterns (MVC, Microservices, Event-Driven)', 'Software Testing, Quality Assurance & TDD', 'Continuous Integration & Continuous Deployment (CI/CD)'],
    description: 'NUC CCMAS 300L core covering enterprise SDLC, Agile Scrum, requirements analysis, UML modeling, automated testing, and CI/CD pipelines.',
    difficulty: 3,
    workloadHours: 6,
    bloomLevel: 'Apply',
    nucCcmasCode: 'CCMAS-IFT303',
    futMinnaCode: 'IFT 311',
    ieeeAcmStandard: 'IEEE/ACM IT2017 (SE - Software Engineering)',
    acmKnowledgeArea: 'Software Engineering (SE)'
  },
  {
    id: 'CS502',
    code: 'IFT 312',
    name: 'Web Applications Architecture & Full-Stack Development',
    title: 'Web Applications Architecture & Full-Stack Development',
    semester: 5,
    academicLevel: '300L',
    level: '300L',
    credits: 3,
    type: 'Core',
    courseType: 'Core',
    domain: 'Software Engineering',
    prerequisites: ['CS202', 'CS404'],
    lectureHours: 2,
    practicalHours: 3,
    learningOutcomes: [
      'Architect single-page applications (SPA) using React, state managers, and component hierarchies',
      'Build secure RESTful and GraphQL backend microservices in Node.js/Express with JWT/OAuth2 authentication',
      'Implement asynchronous data fetching, optimistic UI rendering, and server-side caching (Redis)',
      'Deploy full-stack web applications to cloud containers with SSL certificates and environment security'
    ],
    competencies: {
      cognitive: ['Full-Stack System Integration', 'Asynchronous Execution Flow', 'Security Defense-in-Depth for Web'],
      technical: ['React/TypeScript Frontend Development', 'Node.js Express Backend Engineering', 'JWT Authentication Implementation'],
      soft: ['User-Centric Architecture Thinking', 'Rapid Prototyping']
    },
    skills: {
      knowledge: ['SPA Architecture', 'REST/GraphQL Standards', 'Session vs Token Auth', 'Web Security (CORS/CSRF/XSS)'],
      practical: ['React', 'TypeScript', 'Node.js Express', 'REST APIs', 'JWT Authentication'],
      soft: ['Developer Experience (DevEx)', 'UI/UX Polish'],
      tools: ['React', 'TypeScript', 'Node.js / Express', 'Tailwind CSS', 'Postman', 'Vite']
    },
    skillsAcquired: ['React', 'TypeScript', 'Node.js Express', 'REST APIs', 'JWT Authentication'],
    syllabus: ['Modern Frontend Frameworks: React Component Lifecycle & State', 'Asynchronous JavaScript & RESTful API Consumption', 'Server-Side Development with Node.js, Express & Middleware', 'Authentication Protocols (JWT, OAuth2, Session Security)', 'End-to-End Full-Stack Integration & Cloud Deployment'],
    description: 'Full-stack engineering covering React reactive frontends, Node.js backend microservices, REST APIs, and containerized deployment.',
    difficulty: 3,
    workloadHours: 7,
    bloomLevel: 'Create',
    nucCcmasCode: 'CCMAS-IFT305',
    futMinnaCode: 'IFT 312',
    ieeeAcmStandard: 'IEEE/ACM IT2017 (WEB - Web Systems and Technologies)',
    acmKnowledgeArea: 'Web Systems & Technologies (WEB)'
  },
  {
    id: 'CS503',
    code: 'IFT 313',
    name: 'Information Security & Cryptography Fundamentals',
    title: 'Information Security & Cryptography Fundamentals',
    semester: 5,
    academicLevel: '300L',
    level: '300L',
    credits: 3,
    type: 'Core',
    courseType: 'Core',
    domain: 'Cybersecurity & Networks',
    prerequisites: ['CS403'],
    lectureHours: 2,
    practicalHours: 3,
    learningOutcomes: [
      'Implement symmetric (AES) and asymmetric (RSA/ECC) cryptographic encryption and decryption algorithms',
      'Explain digital certificates, Public Key Infrastructure (PKI), and TLS 1.3 cryptographic handshake protocols',
      'Perform threat modeling using STRIDE and MITRE ATT&CK vulnerability classification frameworks',
      'Enforce Nigerian Data Protection Regulation (NDPR) and international privacy compliance in data storage'
    ],
    competencies: {
      cognitive: ['Cryptographic Mathematical Theory', 'Threat Vector Modeling', 'Regulatory Compliance Reasoning'],
      technical: ['OpenSSL Certificate Generation', 'Cryptographic Hashing Implementation', 'Security Audit Execution'],
      soft: ['Security Mindset & Vigilance', 'Ethical Vulnerability Disclosure']
    },
    skills: {
      knowledge: ['Symmetric/Asymmetric Ciphers', 'PKI & Digital Signatures', 'CIA Triad', 'NDPR & GDPR Regulations'],
      practical: ['AES/RSA Encryption', 'Public Key Infrastructure', 'Threat Modeling', 'Security Compliance', 'Digital Signatures'],
      soft: ['Ethical Discretion', 'Risk Communication'],
      tools: ['OpenSSL', 'GnuPG', 'Wireshark', 'Burp Suite Community', 'Hashcat Basics']
    },
    skillsAcquired: ['AES/RSA Encryption', 'Public Key Infrastructure', 'Threat Modeling', 'Security Compliance', 'Digital Signatures'],
    syllabus: ['CIA Triad, Security Architecture & Threat Vectors', 'Symmetric Cryptography (DES, AES, Block Ciphers)', 'Asymmetric Cryptography (RSA, ECC, Diffie-Hellman Key Exchange)', 'Digital Signatures, Certificates & Public Key Infrastructure (PKI)', 'Security Governance, NDPR & International Compliance Standards'],
    description: 'Security fundamentals, cryptographic algorithms (AES, RSA, ECC), PKI, authentication mechanisms, and regulatory data compliance (NDPR).',
    difficulty: 4,
    workloadHours: 6,
    bloomLevel: 'Analyze',
    nucCcmasCode: 'CCMAS-IFT304',
    futMinnaCode: 'IFT 313',
    ieeeAcmStandard: 'IEEE/ACM IT2017 (SEC - Cybersecurity & Information Assurance)',
    acmKnowledgeArea: 'Cybersecurity & Information Assurance (SEC)'
  },

  // 300L ELECTIVES
  {
    id: 'EL511',
    code: 'IFT 315',
    name: 'Introduction to Artificial Intelligence & Machine Learning',
    title: 'Introduction to Artificial Intelligence & Machine Learning',
    semester: 5,
    academicLevel: '300L',
    level: '300L',
    credits: 3,
    type: 'Elective',
    courseType: 'Elective',
    domain: 'AI & Data Science',
    prerequisites: ['CS201', 'CS302'],
    lectureHours: 2,
    practicalHours: 3,
    learningOutcomes: [
      'Implement supervised learning algorithms (Linear/Logistic Regression, Decision Trees, Random Forests, SVMs)',
      'Develop unsupervised clustering models (K-Means, Hierarchical Clustering, PCA dimensionality reduction)',
      'Evaluate model performance using Confusion Matrices, Precision, Recall, F1-Score, and ROC-AUC metrics',
      'Build end-to-end Python ML pipelines utilizing scikit-learn, NumPy, and Pandas on real-world datasets'
    ],
    competencies: {
      cognitive: ['Statistical Learning Theory', 'Bias-Variance Trade-off Analysis', 'Dimensionality Reduction Intuition'],
      technical: ['Scikit-Learn ML Pipeline Building', 'Hyperparameter Grid Search Tuning', 'Feature Matrix Preprocessing'],
      soft: ['Scientific Experimentation Rigor', 'Model Evaluation Transparency']
    },
    skills: {
      knowledge: ['Supervised vs Unsupervised Learning', 'Loss Functions & Gradient Descent', 'Cross-Validation Techniques'],
      practical: ['Python', 'Supervised Learning', 'Model Evaluation', 'Unsupervised Clustering', 'NumPy & Pandas'],
      soft: ['Empirical Reasoning', 'Data Integrity'],
      tools: ['Python', 'Scikit-Learn', 'NumPy', 'Pandas', 'Jupyter Notebooks', 'Matplotlib/Seaborn']
    },
    skillsAcquired: ['Python', 'Supervised Learning', 'Model Evaluation', 'Unsupervised Clustering', 'NumPy & Pandas'],
    syllabus: ['Foundations of Artificial Intelligence & State-Space Search', 'Supervised Learning: Regression, Decision Trees & SVMs', 'Unsupervised Learning: K-Means, Hierarchical Clustering & PCA', 'Model Evaluation, Cross-Validation & Hyperparameter Tuning', 'Machine Learning Pipeline Implementation in Python'],
    description: 'Elective covering mathematical foundations of ML, supervised/unsupervised algorithms, scikit-learn pipelines, and predictive model evaluation.',
    difficulty: 4,
    workloadHours: 8,
    bloomLevel: 'Apply',
    nucCcmasCode: 'CCMAS-IFT307',
    futMinnaCode: 'IFT 315',
    ieeeAcmStandard: 'IEEE/ACM CS2023 (IS - Intelligent Systems)',
    acmKnowledgeArea: 'Intelligent Systems (IS)'
  },
  {
    id: 'EL512',
    code: 'IFT 317',
    name: 'Cloud Infrastructure & Platform Technologies',
    title: 'Cloud Infrastructure & Platform Technologies',
    semester: 5,
    academicLevel: '300L',
    level: '300L',
    credits: 3,
    type: 'Elective',
    courseType: 'Elective',
    domain: 'Cloud & Systems',
    prerequisites: ['CS402', 'CS403'],
    lectureHours: 2,
    practicalHours: 3,
    learningOutcomes: [
      'Design fault-tolerant cloud architectures spanning multiple availability zones and VPC networks',
      'Containerize distributed applications using Docker multi-stage builds and container registries',
      'Configure auto-scaling serverless functions (AWS Lambda/Cloud Functions) and API gateways',
      'Calculate total cost of ownership (TCO) and cloud cost optimization strategies for computing workloads'
    ],
    competencies: {
      cognitive: ['Cloud Service Models (IaaS/PaaS/FaaS)', 'Elasticity & High Availability Modeling', 'Cloud Shared Responsibility Framework'],
      technical: ['Docker Multi-Stage Containerization', 'VPC Subnetting & Security Group Setup', 'Serverless Function Deployment'],
      soft: ['Cloud Economics Reasoning', 'Infrastructure Reliability Mindset']
    },
    skills: {
      knowledge: ['Cloud Architecture Patterns', 'Virtualization vs Containerization', 'Serverless Compute Paradigms'],
      practical: ['Cloud Infrastructure', 'Docker Containers', 'AWS / Cloud Architecture', 'Serverless Functions', 'VPC Networking'],
      soft: ['Architectural Planning', 'Operational Efficiency'],
      tools: ['Docker', 'AWS Console / CLI', 'Google Cloud Platform', 'Terraform Basics', 'Nginx']
    },
    skillsAcquired: ['Cloud Infrastructure', 'Docker Containers', 'AWS / Cloud Architecture', 'Serverless Functions', 'VPC Networking'],
    syllabus: ['Cloud Service Models: IaaS, PaaS, SaaS & FaaS', 'Virtualization Technologies & Hypervisors vs Containers', 'Cloud Networking: VPCs, Subnets, Gateways & Load Balancers', 'Serverless Computing & Cloud Storage Architecture', 'Cloud Security, IAM Policies & Cost Optimization'],
    description: 'Cloud architecture elective addressing AWS/GCP paradigms, Docker containers, multi-region high availability, and serverless compute.',
    difficulty: 3,
    workloadHours: 7,
    bloomLevel: 'Apply',
    nucCcmasCode: 'CCMAS-IFT308',
    futMinnaCode: 'IFT 317',
    ieeeAcmStandard: 'IEEE/ACM IT2017 (PT - Platform Technologies)',
    acmKnowledgeArea: 'Platform Technologies (PT)'
  },
  {
    id: 'EL513',
    code: 'IFT 319',
    name: 'Ethical Hacking & Penetration Testing Methodologies',
    title: 'Ethical Hacking & Penetration Testing Methodologies',
    semester: 5,
    academicLevel: '300L',
    level: '300L',
    credits: 3,
    type: 'Elective',
    courseType: 'Elective',
    domain: 'Cybersecurity & Networks',
    prerequisites: ['CS403', 'CS503'],
    lectureHours: 2,
    practicalHours: 3,
    learningOutcomes: [
      'Execute systematic penetration tests following PTES (Penetration Testing Execution Standard) stages',
      'Discover and exploit web application vulnerabilities (SQLi, XSS, SSRF, CSRF, IDOR) using Burp Suite',
      'Perform network reconnaissance and vulnerability scanning using Nmap, Nessus, and Metasploit',
      'Author formal penetration test reports outlining remediation steps and executive risk assessments'
    ],
    competencies: {
      cognitive: ['Offensive Threat Vector Analysis', 'Vulnerability Chaining Logic', 'Risk Remediation Prioritization'],
      technical: ['Vulnerability Exploitation in Sandboxes', 'Burp Suite Proxy Interception', 'Metasploit Payload Generation'],
      soft: ['Strict Ethical Adherence', 'Executive Risk Communication', 'Responsible Vulnerability Reporting']
    },
    skills: {
      knowledge: ['PTES Methodology', 'OWASP Top 10 Flaws', 'Exploit Payload Mechanics', 'Legal Rules of Engagement'],
      practical: ['Penetration Testing', 'Vulnerability Assessment', 'Web Application Security', 'Exploit Analysis', 'Security Reporting'],
      soft: ['Ethical Hacking Integrity', 'Defensive Mindset', 'Precision Documentation'],
      tools: ['Kali Linux', 'Burp Suite', 'Metasploit Framework', 'Nmap', 'SQLmap', 'OWASP ZAP']
    },
    skillsAcquired: ['Penetration Testing', 'Vulnerability Assessment', 'Web Application Security', 'Exploit Analysis', 'Security Reporting'],
    syllabus: ['Ethical Hacking Scope, Legal Frameworks & PTES Methodology', 'Reconnaissance & Footprinting (OSINT, Nmap Scans)', 'Vulnerability Analysis & Web Application Exploitation (OWASP Top 10)', 'System Hacking, Privilege Escalation & Lateral Movement', 'Penetration Test Report Writing & Remediation Verification'],
    description: 'Offensive cybersecurity lab elective focusing on Kali Linux, Burp Suite, OWASP Top 10 testing, privilege escalation, and formal vulnerability audits.',
    difficulty: 4,
    workloadHours: 8,
    bloomLevel: 'Analyze',
    nucCcmasCode: 'CCMAS-IFT309',
    futMinnaCode: 'IFT 319',
    ieeeAcmStandard: 'IEEE/ACM IT2017 (SEC - Information Assurance)',
    acmKnowledgeArea: 'Cybersecurity & Information Assurance (SEC)'
  },

  // =======================================
  // --- 300 LEVEL / SEMESTER 6 (RAIN) ---
  // =======================================
  {
    id: 'CS601',
    code: 'IFT 321',
    name: 'IT Project Management & Professional Ethics',
    title: 'IT Project Management & Professional Ethics',
    semester: 6,
    academicLevel: '300L',
    level: '300L',
    credits: 2,
    type: 'Core',
    courseType: 'Core',
    domain: 'Software Engineering',
    prerequisites: ['CS501'],
    lectureHours: 2,
    practicalHours: 0,
    learningOutcomes: [
      'Apply PMBOK and Agile project management methodologies to budget, schedule, and scope IT projects',
      'Formulate risk management matrices, mitigation plans, and critical path method (CPM/PERT) schedules',
      'Evaluate professional computing ethics, ACM/IEEE codes of conduct, and legal compliance in software engineering',
      'Draft formal technical project charters, Service Level Agreements (SLA), and statement of work (SOW) documents'
    ],
    competencies: {
      cognitive: ['Critical Path Scheduling Analysis', 'Risk Management Modeling', 'Ethical Decision Dilemma Resolution'],
      technical: ['Gantt & Pert Chart Planning', 'Project Budget Estimation', 'SLA Document Formulation'],
      soft: ['Professional Ethical Integrity', 'Stakeholder Leadership', 'Negotiation & Conflict Resolution']
    },
    skills: {
      knowledge: ['PMBOK Knowledge Areas', 'ACM/IEEE Ethics Codes', 'Critical Path Method (CPM)', 'Risk Assessment Frameworks'],
      practical: ['Project Management', 'Risk Analysis', 'Professional Ethics', 'Critical Path Scheduling', 'Resource Allocation'],
      soft: ['Ethical Leadership', 'Project Governance', 'Clear Stakeholder Communication'],
      tools: ['Microsoft Project / Jira', 'Trello / Notion', 'Risk Matrix Templates', 'PERT Calculator']
    },
    skillsAcquired: ['Project Management', 'Risk Analysis', 'Professional Ethics', 'Critical Path Scheduling', 'Resource Allocation'],
    syllabus: ['Project Lifecycle & PMBOK Management Knowledge Areas', 'Scope Definition, Work Breakdown Structures (WBS) & CPM/PERT', 'Risk Identification, Qualitative/Quantitative Analysis & Mitigation', 'ACM/IEEE Codes of Ethics & Legal Responsibilities', 'Intellectual Property, Licensing, NDAs & Contracts in Tech'],
    description: 'Mandatory NUC professional ethics course covering PMBOK methodologies, risk management, scheduling, and ACM/IEEE professional conduct codes.',
    difficulty: 2,
    workloadHours: 4,
    bloomLevel: 'Understand',
    nucCcmasCode: 'CCMAS-IFT306',
    futMinnaCode: 'IFT 321',
    ieeeAcmStandard: 'IEEE/ACM IT2017 (SP - Social and Professional Issues)',
    acmKnowledgeArea: 'Social & Professional Issues (SP)'
  },
  {
    id: 'EL611',
    code: 'IFT 323',
    name: 'Deep Learning & Neural Network Architectures',
    title: 'Deep Learning & Neural Network Architectures',
    semester: 6,
    academicLevel: '300L',
    level: '300L',
    credits: 3,
    type: 'Elective',
    courseType: 'Elective',
    domain: 'AI & Data Science',
    prerequisites: ['EL511'],
    lectureHours: 2,
    practicalHours: 3,
    learningOutcomes: [
      'Implement multi-layer perceptrons (MLP) with backpropagation and custom loss functions in PyTorch',
      'Design Convolutional Neural Networks (CNNs) for image classification and feature extraction (ResNet, VGG)',
      'Construct Recurrent Neural Networks (RNNs, LSTMs, GRUs) and attention mechanisms for sequential data',
      'Optimize deep networks using dropout, batch normalization, AdamW optimization, and learning rate schedules'
    ],
    competencies: {
      cognitive: ['Deep Representation Learning', 'Gradient Flow Dynamics & Vanishing Gradient Theory', 'Spatial/Temporal Tensor Operations'],
      technical: ['PyTorch 2.x Deep Learning Implementation', 'CUDA GPU Acceleration Setup', 'TensorBoard Metric Profiling'],
      soft: ['Experimental Scientific Rigor', 'Model Interpretability Ethics']
    },
    skills: {
      knowledge: ['Backpropagation Mathematics', 'Convolution Operations', 'Attention Mechanisms', 'Optimization Algorithms'],
      practical: ['PyTorch', 'Convolutional Networks (CNN)', 'Recurrent Networks (RNN)', 'Model Fine-Tuning', 'GPU Training'],
      soft: ['Deep Analytical Inquiry', 'Empirical Research Mindset'],
      tools: ['PyTorch', 'TorchVision', 'TensorBoard', 'Google Colab / Kaggle GPUs', 'Hugging Face Datasets']
    },
    skillsAcquired: ['PyTorch', 'Convolutional Networks (CNN)', 'Recurrent Networks (RNN)', 'Model Fine-Tuning', 'GPU Training'],
    syllabus: ['Neural Network Foundations: Forward/Backpropagation & Activation Functions', 'Optimization Strategies: SGD, AdamW, Batch Normalization & Dropout', 'Convolutional Neural Networks (CNN) for Computer Vision', 'Sequential Models: RNNs, LSTMs, GRUs & Self-Attention', 'Deep Generative Models & Transfer Learning in PyTorch'],
    description: 'Advanced AI elective covering deep neural architectures, backpropagation mathematics, CNNs, LSTMs, and PyTorch GPU training pipelines.',
    difficulty: 5,
    workloadHours: 9,
    bloomLevel: 'Create',
    nucCcmasCode: 'CCMAS-IFT310',
    futMinnaCode: 'IFT 323',
    ieeeAcmStandard: 'IEEE/ACM CS2023 (IS - Machine Learning)',
    acmKnowledgeArea: 'Intelligent Systems (IS)'
  },
  {
    id: 'EL612',
    code: 'IFT 325',
    name: 'DevOps Automation, CI/CD & Kubernetes Orchestration',
    title: 'DevOps Automation, CI/CD & Kubernetes Orchestration',
    semester: 6,
    academicLevel: '300L',
    level: '300L',
    credits: 3,
    type: 'Elective',
    courseType: 'Elective',
    domain: 'Cloud & Systems',
    prerequisites: ['EL512'],
    lectureHours: 2,
    practicalHours: 3,
    learningOutcomes: [
      'Construct automated CI/CD deployment pipelines utilizing GitHub Actions with automated linting and testing',
      'Deploy, scale, and manage containerized microservices using Kubernetes Pods, Deployments, and Ingress',
      'Provision reproducible cloud infrastructure using Terraform Infrastructure as Code (IaC)',
      'Implement production observability stacks utilizing Prometheus metric scrapers and Grafana dashboards'
    ],
    competencies: {
      cognitive: ['Immutable Infrastructure Architecture', 'Declarative State Reconciliation Theory', 'Site Reliability & SLO Modeling'],
      technical: ['Kubernetes Cluster Administration (kubectl/Helm)', 'GitHub Actions Workflow Scripting', 'Terraform HCL Coding'],
      soft: ['Systems Reliability Mindfulness', 'Automate-Everything Work Ethic']
    },
    skills: {
      knowledge: ['Continuous Integration Paradigms', 'Kubernetes Control Plane Architecture', 'IaC State Management', 'Observability Triad'],
      practical: ['Docker Containers', 'Kubernetes Orchestration', 'GitHub Actions CI/CD', 'Terraform IaC', 'Monitoring & Grafana'],
      soft: ['Operational Excellence', 'Incident Preparedness'],
      tools: ['Kubernetes (k8s)', 'Helm', 'Terraform', 'GitHub Actions', 'Prometheus', 'Grafana', 'Docker Compose']
    },
    skillsAcquired: ['Docker Containers', 'Kubernetes Orchestration', 'GitHub Actions CI/CD', 'Terraform IaC', 'Monitoring & Grafana'],
    syllabus: ['DevOps Culture, SRE Principles & Continuous Delivery', 'Automated Pipeline Engineering with GitHub Actions', 'Container Orchestration with Kubernetes (Pods, Services, Ingress, Helm)', 'Infrastructure as Code (IaC) with HashiCorp Terraform', 'Production Observability: Metrics, Logging (Prometheus, Grafana) & Alerting'],
    description: 'DevOps specialization elective covering automated CI/CD pipelines, Kubernetes microservice orchestration, Terraform IaC, and SRE observability.',
    difficulty: 4,
    workloadHours: 8,
    bloomLevel: 'Create',
    nucCcmasCode: 'CCMAS-IFT312',
    futMinnaCode: 'IFT 325',
    ieeeAcmStandard: 'IEEE/ACM IT2017 (PT - Platform Technologies)',
    acmKnowledgeArea: 'Platform Technologies (PT)'
  },
  {
    id: 'EL613',
    code: 'IFT 327',
    name: 'Digital Forensics & Incident Response Engineering',
    title: 'Digital Forensics & Incident Response Engineering',
    semester: 6,
    academicLevel: '300L',
    level: '300L',
    credits: 3,
    type: 'Elective',
    courseType: 'Elective',
    domain: 'Cybersecurity & Networks',
    prerequisites: ['CS503', 'EL513'],
    lectureHours: 2,
    practicalHours: 3,
    learningOutcomes: [
      'Acquire bit-stream forensic disk and RAM images while preserving strict legal Chain of Custody',
      'Extract and analyze forensic artifacts (Windows Registry, MFT, shellbags, browser history, event logs)',
      'Perform memory forensics to identify injected DLLs, rootkits, and anomalous network connections using Volatility',
      'Draft expert witness forensic reports admissible in Nigerian legal proceedings under the Cybercrimes Act'
    ],
    competencies: {
      cognitive: ['Forensic Evidence Admissibility Standards', 'Malware Persistence Mechanism Analysis', 'Attack Timeline Reconstruction'],
      technical: ['Bit-Stream Disk Imaging (FTK/dd)', 'Memory Dump Analysis (Volatility)', 'Forensic Artifact Extraction (Autopsy)'],
      soft: ['Legal Integrity & Chain of Custody Discipline', 'High-Detail Investigative Tenacity']
    },
    skills: {
      knowledge: ['Digital Evidence Preservation Law', 'File System Structures (NTFS/EXT4)', 'Volatile vs Non-Volatile Artifacts', 'Cybercrimes Act 2015'],
      practical: ['Digital Forensics', 'Evidence Acquisition', 'Memory Analysis', 'Incident Containment', 'Forensic Reporting'],
      soft: ['Investigative Ethics', 'Courtroom Documentation Clarity'],
      tools: ['Autopsy', 'FTK Imager', 'Volatility Framework', 'Wireshark', 'SANS SIFT Workstation']
    },
    skillsAcquired: ['Digital Forensics', 'Evidence Acquisition', 'Memory Analysis', 'Incident Containment', 'Forensic Reporting'],
    syllabus: ['Digital Forensics Foundations, Chain of Custody & Evidence Admissibility', 'Disk Imaging, File System Analysis (NTFS, FAT, ext4) & Data Carving', 'Windows & Linux Operating System Artifact Forensics', 'Memory Forensics & Volatile Evidence Extraction with Volatility', 'Incident Containment, Threat Eradication & Forensic Case Reporting'],
    description: 'Cybersecurity elective covering evidence acquisition, NTFS file carving, Volatility memory analysis, and cyber incident investigations.',
    difficulty: 4,
    workloadHours: 8,
    bloomLevel: 'Evaluate',
    nucCcmasCode: 'CCMAS-IFT314',
    futMinnaCode: 'IFT 327',
    ieeeAcmStandard: 'IEEE/ACM IT2017 (SEC - Cybersecurity & Information Assurance)',
    acmKnowledgeArea: 'Cybersecurity & Information Assurance (SEC)'
  },
  {
    id: 'EL614',
    code: 'IFT 329',
    name: 'Big Data Processing & Distributed Databases',
    title: 'Big Data Processing & Distributed Databases',
    semester: 6,
    academicLevel: '300L',
    level: '300L',
    credits: 3,
    type: 'Elective',
    courseType: 'Elective',
    domain: 'Software Engineering',
    prerequisites: ['CS404'],
    lectureHours: 2,
    practicalHours: 3,
    learningOutcomes: [
      'Design distributed data processing jobs using Apache Spark (PySpark) DataFrames and Spark SQL',
      'Compare NoSQL data storage paradigms (Document, Key-Value, Column-Family, Graph) and CAP theorem trade-offs',
      'Implement real-time streaming data ingestion pipelines using Apache Kafka topics and consumer groups',
      'Architect data lakehouse schemas utilizing columnar storage formats (Parquet, ORC) and partition pruning'
    ],
    competencies: {
      cognitive: ['Distributed Data Partitioning & Sharding', 'CAP & PACELC Theorem Evaluation', 'Stream vs Batch Processing Paradigms'],
      technical: ['PySpark Distributed Data Processing', 'NoSQL Database Schema Design (MongoDB/Cassandra)', 'Kafka Stream Consumer Setup'],
      soft: ['Big Data Scalability Vision', 'Data Consistency Prioritization']
    },
    skills: {
      knowledge: ['HDFS & Distributed Storage', 'CAP Theorem', 'MapReduce & Spark DAGs', 'Columnar vs Row Storage'],
      practical: ['Apache Spark', 'NoSQL Databases (MongoDB, Cassandra)', 'Distributed Storage & CAP Theorem', 'PySpark DataFrames', 'ETL Pipelines'],
      soft: ['Distributed Systems Thinking', 'Data Reliability Focus'],
      tools: ['Apache Spark / PySpark', 'MongoDB', 'Apache Cassandra', 'Apache Kafka', 'Parquet / S3']
    },
    skillsAcquired: ['Apache Spark', 'NoSQL Databases (MongoDB, Cassandra)', 'Distributed Storage & CAP Theorem', 'PySpark DataFrames', 'ETL Pipelines'],
    syllabus: ['Big Data Characteristics (5Vs) & Distributed Storage Architecture', 'Distributed Compute Engines: MapReduce & Apache Spark Core', 'NoSQL Database Paradigms (Document, Columnar, Key-Value, Graph)', 'Real-Time Streaming Pipelines with Apache Kafka & Spark Streaming', 'Data Lake Architecture, Columnar Formats (Parquet) & Data Warehousing'],
    description: 'Data engineering elective covering Apache Spark distributed computing, NoSQL databases (MongoDB, Cassandra), Kafka streaming, and data lake architecture.',
    difficulty: 4,
    workloadHours: 8,
    bloomLevel: 'Apply',
    nucCcmasCode: 'CCMAS-IFT316',
    futMinnaCode: 'IFT 329',
    ieeeAcmStandard: 'IEEE/ACM IT2017 (IM - Information Management)',
    acmKnowledgeArea: 'Information Management (IM)'
  },

  // ==========================================
  // --- 400 LEVEL / SEMESTER 7 (HARMATTAN) ---
  // ==========================================
  {
    id: 'CS701',
    code: 'IFT 411',
    name: 'Research Methodology & Technical Seminar',
    title: 'Research Methodology & Technical Seminar',
    semester: 7,
    academicLevel: '400L',
    level: '400L',
    credits: 2,
    type: 'Core',
    courseType: 'Core',
    domain: 'Software Engineering',
    prerequisites: ['CS501', 'CS601'],
    lectureHours: 2,
    practicalHours: 0,
    learningOutcomes: [
      'Formulate rigorous academic research questions and empirical methodologies for computing investigations',
      'Conduct comprehensive literature reviews synthesizing peer-reviewed IEEE/ACM publications',
      'Design quantitative and qualitative experimental validation frameworks for software and hardware prototypes',
      'Present research findings before department faculty panels in technical seminar defense format'
    ],
    competencies: {
      cognitive: ['Scientific Literature Synthesis', 'Empirical Research Design', 'Methodological Rigor Evaluation'],
      technical: ['Academic Paper Authoring (LaTeX)', 'Reference Management & Citations'],
      soft: ['Scholarly Defense Presentation', 'Critical Peer Review Assessment']
    },
    skills: {
      knowledge: ['Scientific Method in Computing', 'Research Ethics', 'Bibliometric Analysis', 'Quantitative vs Qualitative Methods'],
      practical: ['Research Methodology', 'Literature Review Synthesis', 'Academic Writing', 'Technical Presentation', 'Experimental Design'],
      soft: ['Scholarly Communication', 'Defending Technical Ideas', 'Intellectual Honesty'],
      tools: ['LaTeX / Overleaf', 'Zotero / Mendeley', 'Google Scholar / IEEE Xplore', 'Statistical Analysis Tools']
    },
    skillsAcquired: ['Research Methodology', 'Literature Review Synthesis', 'Academic Writing', 'Technical Presentation', 'Experimental Design'],
    syllabus: ['Scientific Method, Research Problem Formulation & Hypothesis Generation', 'Literature Review Methodologies & Systematic Mapping Studies', 'Quantitative & Qualitative Research Designs in Information Technology', 'Academic Paper Writing, LaTeX Typesetting & Peer-Review Standards', 'Technical Seminar Presentation, Defense & Scholarly Communication'],
    description: 'Mandatory 400L research seminar course preparing B.Tech students for final year capstone thesis through literature reviews, methodology, and defense.',
    difficulty: 3,
    workloadHours: 5,
    bloomLevel: 'Evaluate',
    nucCcmasCode: 'CCMAS-IFT401',
    futMinnaCode: 'IFT 411',
    ieeeAcmStandard: 'IEEE/ACM CS2023 (SP - Professional Communication)',
    acmKnowledgeArea: 'Social & Professional Issues (SP)'
  },

  // 400L ELECTIVES
  {
    id: 'EL711',
    code: 'IFT 413',
    name: 'Natural Language Processing & Large Language Models',
    title: 'Natural Language Processing & Large Language Models',
    semester: 7,
    academicLevel: '400L',
    level: '400L',
    credits: 3,
    type: 'Elective',
    courseType: 'Elective',
    domain: 'AI & Data Science',
    prerequisites: ['EL611'],
    lectureHours: 2,
    practicalHours: 3,
    learningOutcomes: [
      'Implement Transformer self-attention architectures and multi-head attention mechanisms from scratch',
      'Fine-tune Large Language Models (LLMs) using Parameter-Efficient Fine-Tuning (PEFT, LoRA, QLoRA)',
      'Construct Retrieval-Augmented Generation (RAG) systems incorporating vector databases (FAISS, Pinecone)',
      'Evaluate language models for hallucination, bias, semantic coherence, and tokenization efficiency'
    ],
    competencies: {
      cognitive: ['Self-Attention Mathematical Formulation', 'Latent Embedding Space Geometry', 'PEFT Model Adaptation Theory'],
      technical: ['Hugging Face Transformer Pipelines', 'RAG Vector Database Integration', 'LoRA Fine-Tuning Execution'],
      soft: ['AI Alignment & Safety Ethics', 'Linguistic Cultural Inclusivity']
    },
    skills: {
      knowledge: ['Transformer Architecture', 'Tokenization Algorithms (BPE/WordPiece)', 'Vector Embeddings', 'RAG Frameworks'],
      practical: ['Transformers & LLMs', 'NLP Pipelines', 'Vector Databases & Embeddings', 'Model Fine-Tuning (LoRA)', 'Prompt Engineering'],
      soft: ['AI Ethics Awareness', 'Generative AI Critical Thinking'],
      tools: ['Hugging Face Transformers', 'PyTorch', 'LangChain / LlamaIndex', 'FAISS / ChromaDB', 'vLLM / Ollama']
    },
    skillsAcquired: ['Transformers & LLMs', 'NLP Pipelines', 'Vector Databases & Embeddings', 'Model Fine-Tuning (LoRA)', 'Prompt Engineering'],
    syllabus: ['Text Preprocessing, Tokenization (BPE) & Word Embeddings (Word2Vec, GloVe)', 'Transformer Architecture: Scaled Dot-Product Attention & Positional Encodings', 'Pre-trained LLMs: BERT, GPT, T5, LLaMA & Decoder-Only Models', 'Parameter-Efficient Fine-Tuning (PEFT, LoRA) & Instruction Tuning', 'Retrieval-Augmented Generation (RAG), Vector Databases & AI Safety'],
    description: 'Cutting-edge AI elective covering Transformer self-attention, LLM fine-tuning with LoRA, vector databases, and RAG architectures.',
    difficulty: 5,
    workloadHours: 9,
    bloomLevel: 'Create',
    nucCcmasCode: 'CCMAS-IFT403',
    futMinnaCode: 'IFT 413',
    ieeeAcmStandard: 'IEEE/ACM CS2023 (IS - NLP & Generative AI)',
    acmKnowledgeArea: 'Intelligent Systems (IS)'
  },
  {
    id: 'EL712',
    code: 'IFT 415',
    name: 'Enterprise Cloud Architecture & Microservices Engineering',
    title: 'Enterprise Cloud Architecture & Microservices Engineering',
    semester: 7,
    academicLevel: '400L',
    level: '400L',
    credits: 3,
    type: 'Elective',
    courseType: 'Elective',
    domain: 'Cloud & Systems',
    prerequisites: ['EL612'],
    lectureHours: 2,
    practicalHours: 3,
    learningOutcomes: [
      'Decompose enterprise monolithic architectures into decoupled microservices using Domain-Driven Design (DDD)',
      'Implement asynchronous inter-service communication using gRPC, Protocol Buffers, and message brokers (RabbitMQ/Kafka)',
      'Design zero-trust cloud security architectures with Service Mesh (Istio), mutual TLS (mTLS), and API Gateways',
      'Implement distributed transaction patterns (Saga pattern, Outbox pattern) ensuring eventual consistency'
    ],
    competencies: {
      cognitive: ['Domain-Driven Design (DDD)', 'Distributed Consistency Models (Saga Pattern)', 'Zero-Trust Cloud Topology Formulation'],
      technical: ['gRPC & Protobuf Service Implementation', 'Istio Service Mesh Configuration', 'API Gateway Rate-Limiting & Auth'],
      soft: ['Enterprise Architectural Vision', 'Fault-Tolerant System Design Mindset']
    },
    skills: {
      knowledge: ['Domain-Driven Design Bounded Contexts', 'Microservices vs Monoliths', 'Service Mesh Architecture', 'Distributed Transactions'],
      practical: ['Microservices Architecture', 'gRPC & Protocol Buffers', 'Event-Driven Systems', 'API Gateways', 'Service Mesh (Istio)'],
      soft: ['Enterprise Systems Thinking', 'High-Stakes Architecture Decision Making'],
      tools: ['gRPC / Protobuf', 'Docker & Kubernetes', 'Istio Service Mesh', 'Kong / Envoy API Gateway', 'RabbitMQ']
    },
    skillsAcquired: ['Microservices Architecture', 'gRPC & Protocol Buffers', 'Event-Driven Systems', 'API Gateways', 'Service Mesh (Istio)'],
    syllabus: ['Monolith to Microservices Migration & Domain-Driven Design (DDD)', 'Inter-Service Communication: gRPC, Protocol Buffers & REST Trade-offs', 'Event-Driven Architecture & Message Brokers (Kafka, RabbitMQ)', 'Service Mesh (Istio), Traffic Management, mTLS & Ingress Routing', 'Distributed Transactions: 2PC, Saga Pattern & CQRS/Event Sourcing'],
    description: 'Enterprise systems elective covering Domain-Driven Design, gRPC microservices, Istio Service Mesh, event-driven architectures, and Saga patterns.',
    difficulty: 5,
    workloadHours: 8,
    bloomLevel: 'Create',
    nucCcmasCode: 'CCMAS-IFT405',
    futMinnaCode: 'IFT 415',
    ieeeAcmStandard: 'IEEE/ACM IT2017 (SIA - System Integration and Architecture)',
    acmKnowledgeArea: 'System Integration & Architecture (SIA)'
  },
  {
    id: 'EL713',
    code: 'IFT 417',
    name: 'Cloud Security, Zero Trust & Cyber Defense Operations',
    title: 'Cloud Security, Zero Trust & Cyber Defense Operations',
    semester: 7,
    academicLevel: '400L',
    level: '400L',
    credits: 3,
    type: 'Elective',
    courseType: 'Elective',
    domain: 'Cybersecurity & Networks',
    prerequisites: ['CS503', 'EL613'],
    lectureHours: 2,
    practicalHours: 3,
    learningOutcomes: [
      'Implement Zero Trust Architecture (ZTA) principles: verify explicitly, least privilege access, assume breach',
      'Configure Security Information and Event Management (SIEM) rules for threat hunting in real-time logs',
      'Audit cloud infrastructure for misconfigurations using Cloud Security Posture Management (CSPM) tools',
      'Automate incident response playbooks using Security Orchestration, Automation, and Response (SOAR)'
    ],
    competencies: {
      cognitive: ['Zero-Trust Architectural Philosophy', 'Cloud Threat Matrix Analysis (MITRE Cloud Matrix)', 'SOC Operational Governance'],
      technical: ['SIEM Alert Rule Formulation (Wazuh/Splunk)', 'Cloud IAM Least-Privilege Policy Writing', 'Automated Threat Playbook Scripting'],
      soft: ['Security Operations Composure', 'High-Urgency Threat Prioritization']
    },
    skills: {
      knowledge: ['NIST Zero Trust Architecture (SP 800-207)', 'Cloud Security Posture Management', 'SIEM & SOC Operations', 'IAM RBAC/ABAC'],
      practical: ['Zero Trust Architecture', 'SIEM & SOC Operations', 'Cloud IAM Security', 'Threat Hunting', 'Incident Playbooks'],
      soft: ['Security Resilience', 'Operational Discipline'],
      tools: ['Wazuh SIEM', 'Splunk Free', 'AWS IAM / GuardDuty', 'Prowler / ScoutSuite', 'Suricata IDS']
    },
    skillsAcquired: ['Zero Trust Architecture', 'SIEM & SOC Operations', 'Cloud IAM Security', 'Threat Hunting', 'Incident Playbooks'],
    syllabus: ['Zero Trust Architecture (ZTA) Foundations & NIST SP 800-207 Standards', 'Cloud Identity & Access Management (IAM), RBAC & ABAC Policies', 'Security Operations Center (SOC) Workflows & SIEM Log Correlation', 'Cloud Security Posture Management (CSPM) & Vulnerability Scanning', 'Threat Hunting, MITRE ATT&CK Matrix & Automated SOAR Playbooks'],
    description: 'Advanced defense elective focusing on Zero Trust architectures, Cloud IAM, SIEM threat monitoring, and Security Operations Center (SOC) management.',
    difficulty: 4,
    workloadHours: 8,
    bloomLevel: 'Evaluate',
    nucCcmasCode: 'CCMAS-IFT407',
    futMinnaCode: 'IFT 417',
    ieeeAcmStandard: 'IEEE/ACM IT2017 (SEC - Cybersecurity & Information Assurance)',
    acmKnowledgeArea: 'Cybersecurity & Information Assurance (SEC)'
  },

  // =======================================
  // --- 400 LEVEL / SEMESTER 8 (RAIN) ---
  // =======================================
  {
    id: 'CS405',
    code: 'IFT 499',
    name: 'Students Industrial Work Experience Scheme (SIWES II - 6 Months)',
    title: 'Students Industrial Work Experience Scheme (SIWES II - 6 Months)',
    semester: 8,
    academicLevel: '400L',
    level: '400L',
    credits: 6,
    type: 'Core',
    courseType: 'Core',
    domain: 'Software Engineering',
    prerequisites: ['CS501', 'CS502'],
    lectureHours: 0,
    practicalHours: 40,
    learningOutcomes: [
      'Apply theoretical academic computing knowledge to solve real-world industrial software, cloud, and network engineering problems',
      'Demonstrate workplace professionalism, communication, punctuality, and collaborative teamwork in production environments',
      'Document daily and weekly engineering operations in standard Industrial Training Logbooks',
      'Author and defend a comprehensive 50-page Industrial Training technical report before a university grading panel'
    ],
    competencies: {
      cognitive: ['Industrial Workflow Understanding', 'Production System Complexity Appraisal'],
      technical: ['Production Software Development / IT Support', 'Enterprise Tooling Proficiency', 'Logbook Documentation'],
      soft: ['Workplace Professionalism', 'Corporate Teamwork & Punctuality', 'Adaptive Problem Solving Under Deadlines']
    },
    skills: {
      knowledge: ['Industrial Best Practices', 'Production Workflows', 'Corporate Culture & Governance', 'Client SLA Adherence'],
      practical: ['Industrial IT Experience', 'Production Software Engineering', 'Enterprise Network Operations', 'Technical Logbook Documentation', 'Oral Defense'],
      soft: ['Corporate Professionalism', 'Team Collaboration', 'Work Ethic & Reliability', 'Client Interaction'],
      tools: ['Enterprise Tech Stack', 'Industrial Logbooks', 'Corporate Communication Suites (Slack/Teams)']
    },
    skillsAcquired: ['Industrial IT Experience', 'Production Software Engineering', 'Enterprise Network Operations', 'Technical Logbook Documentation', 'Oral Defense'],
    syllabus: [
      '6-Month Supervised Industrial Work Attachment at Accredited IT Enterprise/Firm',
      'Weekly Logbook Entry, Supervisor Mentorship & Technical Progress Tracking',
      'On-Site Institutional Supervision by Department Academic Assessors',
      'Comprehensive Industrial Attachment Technical Report Preparation',
      'Final Institutional SIWES Technical Presentation & Oral Defense Panel'
    ],
    description: 'Mandatory 6-month statutory industrial training required by NUC and FUT Minna Senate for practical industry immersion and degree clearance.',
    difficulty: 3,
    workloadHours: 40,
    bloomLevel: 'Apply',
    nucCcmasCode: 'CCMAS-SIW400',
    futMinnaCode: 'IFT 499',
    ieeeAcmStandard: 'IEEE/ACM IT2017 (Industrial Internship & Practicum)',
    acmKnowledgeArea: 'Professional Practice & Industrial Experience',
    isSiwesCourse: true,
    universityRequirement: {
      isCompulsory: true,
      category: 'SIWES Industrial Training',
      prescribedBy: 'Industrial Training Fund (ITF), NUC CCMAS & University Senate',
      graduationClearanceCritical: true,
      rationale: 'Statutory 24-week full-time industrial placement. Non-negotiable prerequisite for graduation and professional registration.'
    },
    industryRecommendation: {
      isCareerRecommended: true,
      relevanceScore: 100,
      targetTracks: ['ai_ml_engineer', 'fullstack_architect', 'cloud_devops_engineer', 'cybersecurity_specialist', 'data_engineer'],
      careerDemandLevel: 'Critical',
      alignedJobRoles: ['Graduate Software Engineer', 'Cloud Trainee', 'Cybersecurity Analyst Intern', 'Data Engineering Intern'],
      inDemandSkillsTaught: ['Production Software Development', 'Corporate Workplace Operations', 'Enterprise IT Infrastructure'],
      employabilityRationale: 'Direct bridge between academic theory and high-demand corporate technology engineering.'
    },
    siwesStructure: {
      isRequired: true,
      eligibleLevel: '400L',
      eligibleSemester: 8,
      prerequisites: ['CS501', 'CS502'],
      duration: '6 Months (24 Calendar Weeks) Continuous Full-Time Attachment',
      durationWeeks: 24,
      creditUnits: 6,
      academicStandingRequirement: {
        minCgpa: 1.50,
        minEarnedCredits: 90,
        standingCategory: 'Good Academic Standing',
        disallowProbation: true,
        policyDescription: 'Candidates must be in Good Academic Standing (Cumulative Grade Point Average >= 1.50 on 5.0 scale) and have completed foundational 100L-300L departmental core courses without active academic probation.'
      },
      completionStatus: 'ELIGIBLE_AWAITING_PLACEMENT',
      regulatoryBodies: [
        'Industrial Training Fund (ITF) Nigeria',
        'National Universities Commission (NUC)',
        'Directorate of SIWES & University Senate'
      ],
      statutoryRationale: 'SIWES is an institutionalized statutory programme established by the Federal Government of Nigeria and ITF to bridge the gap between academic theory and practical enterprise competency.'
    }
  },

  // ==========================================
  // --- 500 LEVEL / SEMESTER 9 (HARMATTAN) ---
  // ==========================================
  {
    id: 'CS504',
    code: 'IFT 599',
    name: 'Final Year Capstone Research Project & Dissertation I',
    title: 'Final Year Capstone Research Project & Dissertation I',
    semester: 9,
    academicLevel: '500L',
    level: '500L',
    credits: 6,
    type: 'Project',
    courseType: 'Project',
    domain: 'Software Engineering',
    prerequisites: ['CS701'],
    lectureHours: 0,
    practicalHours: 12,
    learningOutcomes: [
      'Formulate and execute a novel, research-grade Information Technology engineering project addressing a significant technical problem',
      'Architect, implement, and rigorously test a full-stack, AI, cloud, or cybersecurity production prototype system',
      'Evaluate prototype performance against state-of-the-art benchmarks using empirical and statistical metrics',
      'Author and orally defend a scholarly B.Tech undergraduate dissertation before external and departmental examiners'
    ],
    competencies: {
      cognitive: ['Novel System Architecture Formulation', 'Empirical Benchmark Evaluation', 'Independent Scholarly Inquiry'],
      technical: ['End-to-End Prototype Engineering', 'Empirical Data Collection & Benchmarking', 'Dissertation Typesetting (LaTeX)'],
      soft: ['Self-Directed Project Leadership', 'Academic Defense Composure', 'Scientific Integrity']
    },
    skills: {
      knowledge: ['System Engineering Lifecycle', 'Academic Research Frameworks', 'Dissertation Structure', 'Benchmark Methodologies'],
      practical: ['Capstone System Engineering', 'Empirical Research Defense', 'Full-Stack / AI Architecture', 'Dissertation Authoring', 'Benchmark Evaluation'],
      soft: ['Independent Leadership', 'Oral Defense Composure', 'Intellectual Rigor'],
      tools: ['Target Domain Stack (PyTorch / React / AWS / Kubernetes)', 'LaTeX / Overleaf', 'Git Repository & CI', 'Benchmarking Suites']
    },
    skillsAcquired: ['Capstone System Engineering', 'Empirical Research Defense', 'Full-Stack / AI Architecture', 'Dissertation Authoring', 'Benchmark Evaluation'],
    syllabus: ['Capstone Project Proposal Formulation, Approval & Faculty Supervisor Allocation', 'System Requirements Specification (SRS) & Detailed Architectural Design', 'Prototype Implementation, Laboratory Testing & Empirical Benchmarking', 'Interim Chapter 1-3 Defense (Introduction, Literature Review, Methodology)', 'Comprehensive Undergraduate Dissertation Writing & Final Oral Defense'],
    description: 'Mandatory 6-unit B.Tech capstone thesis requiring students to formulate, implement, benchmark, and defend an original computing research prototype.',
    difficulty: 5,
    workloadHours: 15,
    bloomLevel: 'Create',
    nucCcmasCode: 'CCMAS-PRJ500',
    futMinnaCode: 'IFT 599',
    ieeeAcmStandard: 'IEEE/ACM CS2023 (Capstone & Integrative Experience)',
    acmKnowledgeArea: 'Capstone & Integrative Experience'
  },
  {
    id: 'EL811',
    code: 'IFT 511',
    name: 'Advanced Computer Vision & Multimodal Generative AI',
    title: 'Advanced Computer Vision & Multimodal Generative AI',
    semester: 9,
    academicLevel: '500L',
    level: '500L',
    credits: 3,
    type: 'Elective',
    courseType: 'Elective',
    domain: 'AI & Data Science',
    prerequisites: ['EL611', 'EL711'],
    lectureHours: 2,
    practicalHours: 3,
    learningOutcomes: [
      'Implement real-time object detection and instance segmentation models (YOLOv8, Mask R-CNN) in PyTorch',
      'Train Diffusion Models (DDPM, Stable Diffusion) and Vision Transformers (ViT) for generative image synthesis',
      'Construct multimodal AI pipelines processing simultaneous text, audio, and visual inputs (CLIP, LLaVA)',
      'Deploy optimized edge vision models on mobile/embedded GPUs using TensorRT and ONNX Runtime'
    ],
    competencies: {
      cognitive: ['Diffusion Mathematical Formulations', 'Vision Transformer Patch Projection Theory', 'Multimodal Cross-Attention Alignment'],
      technical: ['YOLO / ViT Computer Vision Implementation', 'Stable Diffusion Fine-Tuning (ControlNet)', 'TensorRT Model Quantization'],
      soft: ['Deep Tech Innovation Tenacity', 'Ethical Synthetic Media Governance']
    },
    skills: {
      knowledge: ['Vision Transformers', 'Diffusion Probabilistic Models', 'Contrastive Learning (CLIP)', 'Model Quantization (FP16/INT8)'],
      practical: ['Computer Vision (YOLO/ViT)', 'Diffusion Models', 'Multimodal AI', 'PyTorch 2.0', 'Edge AI Deployment'],
      soft: ['Creative Engineering', 'Safety Analysis'],
      tools: ['PyTorch 2.x', 'TorchVision', 'Diffusers Library', 'ONNX Runtime / TensorRT', 'OpenCV']
    },
    skillsAcquired: ['Computer Vision (YOLO/ViT)', 'Diffusion Models', 'Multimodal AI', 'PyTorch 2.0', 'Edge AI Deployment'],
    syllabus: ['Advanced Object Detection & Segmentation (YOLOv8, Mask R-CNN, DETR)', 'Vision Transformers (ViT) & Self-Supervised Learning (DINO)', 'Diffusion Models (DDPM, Score-Based Models) & Generative Image Synthesis', 'Multimodal Vision-Language Models (CLIP, BLIP, LLaVA)', 'Edge AI Optimization: Quantization, Pruning, ONNX & TensorRT'],
    description: '500L research elective covering Vision Transformers, YOLOv8 object detection, Diffusion generative models, and multimodal foundation models.',
    difficulty: 5,
    workloadHours: 9,
    bloomLevel: 'Create',
    nucCcmasCode: 'CCMAS-IFT501',
    futMinnaCode: 'IFT 511',
    ieeeAcmStandard: 'IEEE/ACM CS2023 (IS - Computer Vision & Generative AI)',
    acmKnowledgeArea: 'Intelligent Systems (IS)'
  },
  {
    id: 'EL812',
    code: 'IFT 513',
    name: 'Distributed Systems, Consensus Protocols & Blockchain',
    title: 'Distributed Systems, Consensus Protocols & Blockchain',
    semester: 9,
    academicLevel: '500L',
    level: '500L',
    credits: 3,
    type: 'Elective',
    courseType: 'Elective',
    domain: 'Software Engineering',
    prerequisites: ['CS402', 'EL712'],
    lectureHours: 2,
    practicalHours: 3,
    learningOutcomes: [
      'Implement distributed consensus algorithms (Raft, Paxos, PBFT) in asynchronous network environments',
      'Author and formally verify smart contracts in Solidity with reentrancy protection and gas optimization',
      'Explain distributed hash tables (Kademlia/Chord) and peer-to-peer networking topologies',
      'Evaluate decentralization, scalability, and security trade-offs (Blockchain Trilemma) in Web3 systems'
    ],
    competencies: {
      cognitive: ['Byzantine Fault Tolerance Theory', 'State Machine Replication Logic', 'Smart Contract Formal Verification'],
      technical: ['Raft Consensus Algorithm Coding (Go/Node)', 'Solidity Smart Contract Development', 'EVM Gas Profiling'],
      soft: ['Decentralized Governance Reasoning', 'Security First Mindset']
    },
    skills: {
      knowledge: ['Byzantine Agreement', 'Raft / Paxos Consensus', 'Merkle Trees & Cryptographic Hashes', 'Smart Contract Security'],
      practical: ['Distributed Consensus (Raft/Paxos)', 'Blockchain Engineering', 'Solidity Smart Contracts', 'P2P Networks', 'Gas Optimization'],
      soft: ['Distributed Systems Auditing', 'Rigor in Unreliable Environments'],
      tools: ['Solidity', 'Hardhat / Foundry', 'Ethers.js / Web3.js', 'Go / Node.js', 'IPFS']
    },
    skillsAcquired: ['Distributed Consensus (Raft/Paxos)', 'Blockchain Engineering', 'Solidity Smart Contracts', 'P2P Networks', 'Gas Optimization'],
    syllabus: ['Distributed Systems Foundations: Time, Clocks (Lamport, Vector) & State Replication', 'Consensus Algorithms: Paxos, Raft & Byzantine Fault Tolerance (BFT)', 'Blockchain Architecture: Merkle Trees, Proof-of-Work vs Proof-of-Stake', 'Smart Contract Engineering with Solidity & EVM Internals', 'Smart Contract Security Auditing, DeFi Protocols & Web3 Scalability (Layer 2s)'],
    description: 'Advanced systems elective exploring Raft consensus algorithms, Byzantine fault tolerance, EVM smart contracts, and Web3 architectures.',
    difficulty: 5,
    workloadHours: 9,
    bloomLevel: 'Create',
    nucCcmasCode: 'CCMAS-IFT503',
    futMinnaCode: 'IFT 513',
    ieeeAcmStandard: 'IEEE/ACM CS2023 (SEC & AR - Distributed Systems)',
    acmKnowledgeArea: 'Distributed Systems & Security'
  }
];

export const CAREER_TRACKS: CareerTrack[] = [
  {
    id: 'ai_ml_engineer',
    title: 'AI, Machine Learning & Intelligent Systems',
    targetRole: 'Machine Learning Engineer / AI Systems Researcher',
    description: 'Specializes in mathematical modeling, deep neural architectures, computer vision, natural language processing, and LLMs aligned with NUC CCMAS and IEEE/ACM CS2023 guidelines.',
    keySkills: [
      'Linear Algebra',
      'Python',
      'Supervised Learning',
      'PyTorch',
      'Convolutional Networks (CNN)',
      'Transformers & LLMs',
      'NLP Pipelines'
    ],
    recommendedElectiveIds: ['EL511', 'EL611', 'EL711', 'EL811'],
    iconName: 'BrainCircuit',
    averageSalaryUSD: '$125,000 - $185,000 (₦85M - ₦140M Equiv.)',
    industryDemand: 'Critical',
    acmSpecializationArea: 'ACM/IEEE CS2023 - Intelligent Systems & Machine Learning Track',
    skillMap: CAREER_SKILL_MAPS['ai_ml_engineer']
  },
  {
    id: 'fullstack_architect',
    title: 'Full Stack & Enterprise Software Architect',
    targetRole: 'Senior Full Stack Engineer / Enterprise Solutions Architect',
    description: 'Architects enterprise web systems, reactive frontend frameworks, asynchronous REST/gRPC backend microservices, relational databases, and enterprise service bus integrations adhering to NUC CCMAS & IEEE/ACM SIA standards.',
    keySkills: [
      'Java',
      'SQL',
      'Agile Development',
      'React',
      'TypeScript',
      'Node.js Express',
      'Enterprise Integration'
    ],
    recommendedElectiveIds: ['CS503', 'CS601', 'EL614', 'EL712', 'EL812'],
    iconName: 'Layout',
    averageSalaryUSD: '$110,000 - $165,000 (₦75M - ₦125M Equiv.)',
    industryDemand: 'High',
    acmSpecializationArea: 'ACM/IEEE IT2017 - System Integration & Architecture (SIA)',
    skillMap: CAREER_SKILL_MAPS['fullstack_architect']
  },
  {
    id: 'cloud_devops_engineer',
    title: 'Cloud Solutions Architect & DevOps Engineer',
    targetRole: 'Site Reliability Engineer (SRE) / Cloud Infrastructure Architect',
    description: 'Designs automated continuous deployment pipelines (CI/CD), Docker containers, Kubernetes orchestration, Infrastructure as Code with Terraform, and zero-trust cloud architectures.',
    keySkills: [
      'Process Management',
      'TCP/IP Stack',
      'Cloud Infrastructure',
      'Docker Containers',
      'Kubernetes Orchestration',
      'GitHub Actions CI/CD',
      'AWS Lambda / Cloud Functions'
    ],
    recommendedElectiveIds: ['EL512', 'EL612', 'EL712'],
    iconName: 'CloudServer',
    averageSalaryUSD: '$120,000 - $175,000 (₦80M - ₦135M Equiv.)',
    industryDemand: 'Critical',
    acmSpecializationArea: 'ACM/IEEE IT2017 - Platform Technologies & Cloud Infrastructure',
    skillMap: CAREER_SKILL_MAPS['cloud_devops_engineer']
  },
  {
    id: 'cybersecurity_specialist',
    title: 'Cybersecurity & Defense Engineer',
    targetRole: 'Information Security Officer / Security Analyst & Ethical Hacker',
    description: 'Secures enterprise networks and applications, implements cryptographic protocols, performs penetration testing, conducts digital forensic investigations, and enforces national NDPR/Cybercrime Act compliance.',
    keySkills: [
      'TCP/IP Stack',
      'AES/RSA Encryption',
      'Public Key Infrastructure',
      'Penetration Testing',
      'Vulnerability Assessment',
      'Digital Forensics'
    ],
    recommendedElectiveIds: ['EL513', 'EL613', 'EL713'],
    iconName: 'ShieldAlert',
    averageSalaryUSD: '$115,000 - $170,000 (₦78M - ₦130M Equiv.)',
    industryDemand: 'High',
    acmSpecializationArea: 'ACM/IEEE IT2017 - Cybersecurity & Information Assurance (SEC)',
    skillMap: CAREER_SKILL_MAPS['cybersecurity_specialist']
  },
  {
    id: 'data_engineer',
    title: 'Big Data & Analytics Systems Engineer',
    targetRole: 'Data Engineer / Analytics Pipeline Architect',
    description: 'Builds enterprise data warehouses, real-time distributed streaming ETL pipelines with Kafka and Spark, and manages distributed databases for predictive enterprise analytics.',
    keySkills: [
      'SQL',
      'Python',
      'NumPy & Pandas',
      'Apache Spark',
      'NoSQL Databases (MongoDB, Cassandra)',
      'Distributed Storage & CAP Theorem'
    ],
    recommendedElectiveIds: ['CS404', 'EL614'],
    iconName: 'Database',
    averageSalaryUSD: '$115,000 - $160,000 (₦75M - ₦120M Equiv.)',
    industryDemand: 'High',
    acmSpecializationArea: 'ACM/IEEE IT2017 - Information Management (IM)',
    skillMap: CAREER_SKILL_MAPS['data_engineer']
  }
];

export const INITIAL_STUDENT_PROFILE: StudentProfile = {
  name: 'Farooq Shekoni',
  rollNumber: '2021/1/84729IT',
  institution: 'Federal University of Technology, Minna (FUT Minna)',
  faculty: 'School of Information and Communications Technology (SICT)',
  department: 'Department of Information Technology',
  program: 'B.Tech (Hons) Information Technology',
  academicLevel: '300L',
  currentSemester: 5,
  targetCareerTrackId: 'ai_ml_engineer',
  completedCourseIds: [
    'CS101', 'CS102', 'CS103', 'CS104',
    'CS201', 'CS202', 'CS203', 'CS204',
    'CS301', 'CS302', 'CS303', 'CS304',
    'CS401', 'CS402', 'CS403', 'CS404'
  ],
  grades: {
    'CS101': 'A',
    'CS102': 'A+',
    'CS103': 'B',
    'CS104': 'A',
    'CS201': 'A',
    'CS202': 'A+',
    'CS203': 'B',
    'CS204': 'A',
    'CS301': 'A',
    'CS302': 'A+',
    'CS303': 'A',
    'CS304': 'B',
    'CS401': 'A',
    'CS402': 'B',
    'CS403': 'A',
    'CS404': 'A+'
  },
  skillLevels: {
    'Linear Algebra': 80,
    'Calculus': 75,
    'Probability Theory': 85,
    'Python': 90,
    'Data Structures': 95,
    'Dynamic Programming': 80,
    'Java': 85,
    'SQL': 80,
    'NumPy & Pandas': 85,
    'Process Management': 70,
    'TCP/IP Stack': 60,
    'Supervised Learning': 50,
    'Docker Containers': 40
  },
  competencyLevels: {
    'Linear Algebra & Optimization Theory': 80,
    'Probabilistic Reasoning & Bayesian Inference': 80,
    'Neural Network Implementation & Tuning': 45,
    'Data Preprocessing & Feature Engineering': 60,
    'Ethical AI & Bias Mitigation': 65
  },
  weeklyStudyHoursBudget: 35,
  preferredPace: 'Balanced' as const,
  interests: ['Machine Learning', 'Computer Vision', 'Scalable Systems', 'Cloud Pipelines', 'Nigerian Tech Ecosystem']
};
