export interface ModuleContent {
  id?: string;
  title: string;
  aiNotes: string;
  scoutMission: string;
  tutorFocus: string;
  labs: string;
  videos: { title: string; url: string }[];
  onlineLinks: { title: string; url: string }[];
}

export interface Course {
  id: string;
  title: string;
  emoji: string;
  duration: string;
  modules: string[];
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  syllabus?: Record<string, ModuleContent>;
}

export const COURSES: Course[] = [
  {
    id: 'python-dev',
    title: 'Python Dev',
    emoji: '🐍',
    duration: '12 weeks',
    level: 'Beginner',
    modules: [
      'Introduction to Python',
      'Data Types & Variables',
      'Control Flow & Loops',
      'Functions & Scope',
      'Lists, Tuples & Dictionaries',
      'File I/O',
      'Error Handling',
      'Object Oriented Programming',
      'Modules & Packages',
      'Final Project'
    ],
    description: 'Master the fundamentals of Python programming, from syntax to advanced OOP concepts.',
    syllabus: {
      'Introduction to Python': {
        id: 'mod-1',
        title: 'Introduction to Python',
        aiNotes: '• What is Python?: High-level, interpreted, dynamically-typed language.\n• Key Philosophy: Readability counts; emphasizes clean, whitespace-indented code.\n• Environment: Run via terminal, IDLE, or IDEs like VS Code and PyCharm.\n• Syntax Basics: No semicolons needed; print outputs using print().',
        scoutMission: 'Find and verify Python 3.11+ installation instructions for Windows, macOS, and Linux.',
        tutorFocus: 'Guide students through writing their first "Hello, World!" program and diagnosing basic indentation errors.',
        labs: 'Lab 1: Install Python, configure an IDE, and execute a script that prints your name and coding goals.',
        videos: [
          { title: 'Set Up Python Virtual Environment In Visual Studio Code', url: 'https://youtu.be/yG9kmBQAtW4' },
          { title: 'Anatomy of a Python Scripted', url: 'https://youtu.be/Zjb0Ek12h-s' }
        ],
        onlineLinks: [
          { title: 'Official Python Website', url: 'https://www.python.org/' },
          { title: 'Python Download Guide', url: 'https://www.python.org/downloads/' },
          { title: 'Python Tutorial', url: 'https://docs.python.org/3/tutorial/index.html' }
        ]
      },
      'Data Types & Variables': {
        id: 'mod-2',
        title: 'Data Types & Variables',
        aiNotes: '• Variables: Containers for storing data values; created when assigned via =.\n• Primitive Types: Integers (int), Floats (float), Strings (str), Booleans (bool).\n• Dynamic Typing: Variables can change types automatically during execution.\n• Type Casting: Convert types explicitly using int(), str(), float().',
        scoutMission: 'Gather clean cheat sheets detailing Python string formatting methods (f-strings).',
        tutorFocus: 'Test user knowledge on data conversion limitations (e.g., casting letters to integers).',
        labs: 'Lab 2: Build a simple tip calculator that takes user inputs, converts strings to floats, and displays formatted costs.',
        videos: [
          { title: 'Understanding Variables and Dynamic Typing', url: 'https://youtu.be/KeA39II7AO8' },
          { title: 'String Manipulation and F-Strings', url: 'https://youtu.be/ktOOKv6XJ7U' }
        ],
        onlineLinks: [
          { title: 'W3Schools Python Data Types', url: 'https://www.w3schools.com/python/python_datatypes.asp' },
          { title: 'Real Python: Variables in Python', url: 'https://www.w3schools.com/python/python_variables_exercises.asp' }
        ]
      },
      'Control Flow & Loops': {
        id: 'mod-3',
        title: 'Control Flow & Loops',
        aiNotes: '• Conditionals: Evaluate logic using if, elif, and else blocks.\n• Operators: Logical (and, or, not) and comparison (==, !=, <, >).\n• For Loops: Iterate over sequences like ranges, strings, or collections.\n• While Loops: Execute code repeatedly as long as a condition remains true.\n• Control Statements: break exits loops; continue skips to the next iteration.',
        scoutMission: 'Locate performance benchmarks comparing while loops vs for loops in data processing.',
        tutorFocus: 'Debug infinite loops and clarify when to use break versus continue.',
        labs: 'Lab 3: Create a "Guess the Number" game using a while loop, conditionals, and user inputs.',
        videos: [
          { title: 'Loops: For, While, and Loop Control', url: 'https://youtu.be/fta_U8EdEZQ' }
        ],
        onlineLinks: [
          { title: 'Python Control Flow Documentation', url: 'https://docs.python.org/3/tutorial/controlflow.html' },
          { title: 'GeeksforGeeks: Loops in Python', url: 'https://www.geeksforgeeks.org/python/loops-in-python/' }
        ]
      },
      'Functions & Scope': {
        id: 'mod-4',
        title: 'Functions & Scope',
        aiNotes: '• Functions: Reusable blocks of code defined with the def keyword.\n• Arguments: Pass data using positional, keyword, or default arguments.\n• Return Values: Send data back to the caller using the return statement.\n• Scope: LEGB rule regulates variable visibility: Local, Enclosing, Global, Built-in.',
        scoutMission: 'Document best practices for writing Python docstrings using Google style guidelines.',
        tutorFocus: 'Correct misconceptions regarding global variables and modifications inside local functions.',
        labs: 'Lab 4: Write a collection of geometry helper functions that calculate area and perimeter, utilizing default parameters.',
        videos: [
          { title: 'Defining Functions and Passing Arguments', url: 'https://youtu.be/MCVa1ZhQaqI' },
          { title: 'Demystifying Python Scope and the LEGB Rule', url: 'https://youtu.be/aFTYNBYQY7E' }
        ],
        onlineLinks: [
          { title: 'Real Python: Defining Your Own Functions', url: 'https://realpython.com/defining-your-own-python-function/' },
          { title: 'Programiz: Python Function Scope', url: 'https://www.programiz.com/python-programming/global-local-nonlocal-variables' }
        ]
      },
      'Lists, Tuples & Dictionaries': {
        id: 'mod-5',
        title: 'Lists, Tuples & Dictionaries',
        aiNotes: '• Lists: Ordered, mutable collections of items defined with brackets [].\n• Tuples: Ordered, immutable collections defined with parentheses ().\n• Dictionaries: Unordered, mutable key-value pairs defined with curly braces {}.\n• Common Operations: Indexing, slicing, appending, and key lookups.',
        scoutMission: 'Find visual references explaining memory allocation differences between lists and tuples.',
        tutorFocus: 'Walk through complex dictionary lookups and multi-dimensional list slicing.',
        labs: 'Lab 5: Build a command-line contact management directory that allows users to add, view, and delete contact details.',
        videos: [
          { title: 'Working with Lists and Tuples', url: 'https://youtu.be/KWKWswDfAb0' },
          { title: 'Key-Value Pair Mapping with Dictionaries', url: 'https://youtu.be/R-HLU9Fl5ug' }
        ],
        onlineLinks: [
          { title: 'Python Data Structures Documentation', url: 'https://docs.python.org/3/tutorial/datastructures.html' },
          { title: 'Real Python: Dictionaries in Python', url: 'https://realpython.com/python-dicts/' }
        ]
      },
      'File I/O': {
        id: 'mod-6',
        title: 'File I/O',
        aiNotes: '• File Context: Use the with open() statement to ensure safe file closing.\n• Modes: Read (\'r\'), Write (\'w\'), Append (\'a\'), and Binary (\'b\').\n• Reading: Methods include .read(), .readline(), and iterating over lines.\n• Writing: Write text using .write() or .writelines().',
        scoutMission: 'Collect code snippets showcasing efficient line-by-line reading of massive text files.',
        tutorFocus: 'Help resolve file path errors and explain the difference between append and write modes.',
        labs: 'Lab 6: Build a user logging system that appends timestamps and events to a text file, with a readout function.',
        videos: [
          { title: 'Reading and Writing Text Files Safely', url: 'https://youtu.be/fwGz-_HJma0' },
          { title: 'Working with Relative vs Absolute Paths', url: 'https://youtu.be/VgLPD88xYN0' }
        ],
        onlineLinks: [
          { title: 'Real Python: Reading and Writing Files', url: 'https://realpython.com/read-write-files-python/' },
          { title: 'W3Schools Python File Handling', url: 'https://www.w3schools.com/python/python_file_handling.asp' }
        ]
      },
      'Error Handling': {
        id: 'mod-7',
        title: 'Error Handling',
        aiNotes: '• Exceptions: Runtime errors that disrupt program execution if unmanaged.\n• Try/Except: Catch errors using blocks to prevent abrupt program crashes.\n• Else/Finally: else runs if no errors occur; finally always executes.\n• Raising Errors: Explicitly trigger exceptions using the raise keyword.',
        scoutMission: 'Compile a comprehensive checklist of built-in Python exception classes and their triggers.',
        tutorFocus: 'Teach students how to catch specific errors (e.g., ValueError) instead of using blanket clauses.',
        labs: 'Lab 7: Revamp the previous tip calculator lab to securely handle empty entries, letters, or zero-division bugs.',
        videos: [
          { title: 'Handling Runtime Exceptions gracefully', url: 'https://youtu.be/bqDp3KA89Mw' },
          { title: 'Creating Clean Workflows with Try-Except-Finally', url: 'https://youtu.be/NIWwJbo-9_8' }
        ],
        onlineLinks: [
          { title: 'Python Built-in Exceptions Docs', url: 'https://realpython.com/python-built-in-exceptions/' },
          { title: 'Real Python: Python Exceptions Tutorial', url: 'https://realpython.com/python-exceptions/' }
        ]
      },
      'Object Oriented Programming': {
        id: 'mod-8',
        title: 'Object Oriented Programming',
        aiNotes: '• Classes & Objects: Classes act as blueprints; objects are instantiated instances.\n• Attributes & Methods: Variables inside classes (attributes) and functions inside classes (methods).\n• The __init__ Method: Constructor method used to initialize an object\'s state.\n• Core Pillars: Inheritance (reusing code), Polymorphism (overriding methods), Encapsulation (hiding data).',
        scoutMission: 'Find visual inheritance tree examples explaining parent-child class structures.',
        tutorFocus: 'Clarify the exact purpose of the self keyword in class methods.',
        labs: 'Lab 8: Code a digital banking system with a base Account class and specialized SavingsAccount subclasses.',
        videos: [
          { title: 'Introduction to Classes, Objects, and init', url: 'https://youtu.be/1ONhXmQuWP8' },
          { title: 'The Pillars of OOP: Inheritance and Polymorphism', url: 'https://youtu.be/TXSsVjIX3_g' }
        ],
        onlineLinks: [
          { title: 'Real Python: Intro to OOP in Python', url: 'https://realpython.com/python3-object-oriented-programming/' },
          { title: 'GeeksforGeeks: Python OOPs Concepts', url: 'https://www.geeksforgeeks.org/python/python-oops-concepts/' }
        ]
      },
      'Modules & Packages': {
        id: 'mod-9',
        title: 'Modules & Packages',
        aiNotes: '• Modules: Python files containing definitions and statements used in other files.\n• Packages: Directories containing multiple modules alongside an __init__.py file.\n• Imports: Use import module or from module import function.\n• Standard Library: Built-in functionality like math, datetime, random, and os.\n• Pip: Python package manager used to install third-party libraries from PyPI.',
        scoutMission: 'Locate a guide on setting up, activating, and managing local python virtual environments (venv).',
        tutorFocus: 'Troubleshoot ModuleNotFoundError errors caused by pathing and environment issues.',
        labs: 'Lab 9: Isolate a project environment using venv, install an external library (like requests), and pull data from an API.',
        videos: [
          { title: 'Using the Standard Library and Pip', url: 'https://youtu.be/8aTvUlyK9sg' },
          { title: 'Creating and Importing Custom Modules', url: 'https://youtu.be/n0H-bTzmd7Q' }
        ],
        onlineLinks: [
          { title: 'Python Modules and Packages Guide', url: 'https://docs.python.org/3/tutorial/modules.html' },
          { title: 'Real Python: Python Modules and Packages', url: 'https://realpython.com/python-modules-packages/' }
        ]
      },
      'Final Project': {
        id: 'mod-10',
        title: 'Final Project',
        aiNotes: '• Scope: Combine all core competencies learned throughout the course.\n• Architecture: Modular design featuring clear data flow, OOP elements, and clean errors.\n• Requirements: File manipulation, exception safeguards, custom classes, and documentation.',
        scoutMission: 'Source a standardized Markdown template for writing a professional project README.md.',
        tutorFocus: 'Perform structural code reviews, focusing on code readability and architectural choices.',
        labs: 'Lab 10: Build a complete, functional Task & Inventory Management CLI Application using custom modules, OOP architecture, persistent file tracking, and complete input validation.',
        videos: [
          { title: 'Planning and Structuring Your Final Project', url: 'https://youtu.be/k2XIyt6yJqw' },
          { title: 'Refactoring Code and Final Delivery Tips', url: 'https://youtu.be/6FLt3IXDLn4' }
        ],
        onlineLinks: [
          { title: 'GitHub Guide: Mastering Markdown', url: 'https://github.com/realpython/python-guide' },
          { title: 'Real Python: Writing Beautiful Python Code', url: 'https://realpython.com/python-pep8/' }
        ]
      }
    }
  },
  {
    id: 'web-design',
    title: 'Web Design & Dev',
    emoji: '🌐',
    duration: '14 weeks',
    level: 'Beginner',
    modules: [
      'HTML5 Foundations',
      'CSS3 Styling & Layouts',
      'Responsive Design',
      'JavaScript Basics',
      'DOM Manipulation',
      'Modern CSS (Tailwind)',
      'Frontend Frameworks Intro',
      'API Integration',
      'Deployment & Hosting',
      'Portfolio Project'
    ],
    description: 'Build modern, responsive websites using HTML, CSS, and JavaScript.',
    syllabus: {
      'HTML5 Foundations': {
        id: 'web-mod-1',
        title: 'HTML5 Foundations',
        aiNotes: '• Core Concept: HTML5 provides the semantic structure for modern web applications.\n• Document Object Model: Browsers parse HTML into a tree structure of nodes.\n• Semantic Elements: Tags like <header>, <article>, and <footer> improve SEO and accessibility.\n• Attributes: Global attributes like id, class, and lang modify element behavior.\n• Forms: New input types like type="email" and type="date" handle native validation.',
        scoutMission: 'Explain how semantic HTML tags improve screen reader navigation and SEO ranking.',
        tutorFocus: 'Debug my HTML form: the submit button refreshes the page but does not send data; and differences between block vs inline elements.',
        labs: 'Lab: Create a multi-page personal resume website using only semantic HTML5 tags.',
        videos: [
          { title: 'Introduction to HTML5 Syntax, Document Structure, and Core Tags', url: 'https://youtu.be/P0EGYTb1cBs' },
          { title: 'Building Accessible Web Forms with Native HTML5 Validation', url: 'https://youtu.be/bRZX9HqxSiE' }
        ],
        onlineLinks: [
          { title: 'MDN Web Docs: HTML Basics', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML' },
          { title: 'W3C HTML Living Standard', url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content' },
          { title: 'HTML5 Doctor: Semantic Guide', url: 'https://html5doctor.com/lets-talk-about-semantics/' }
        ]
      },
      'CSS3 Styling & Layouts': {
        id: 'web-mod-2',
        title: 'CSS3 Styling & Layouts',
        aiNotes: '• Cascading & Specificity: CSS resolves style conflicts using a weight-based hierarchy rule.\n• Box Model: Every element comprises margin, border, padding, and content areas.\n• Flexbox: One-dimensional layout model for distributing space along rows or columns.\n• CSS Grid: Two-dimensional layout system managing both rows and columns simultaneously.\n• Selectors: Advanced selectors like :nth-child() target elements without extra classes.',
        scoutMission: 'Calculate the CSS specificity score for div.sidebar ul li:first-child.',
        tutorFocus: 'Explain why justify-content works on the main axis and align-items works on the cross axis; also centering with CSS Grid.',
        labs: 'Lab: Build a responsive photo gallery grid with hover overlay effects using Flexbox.',
        videos: [
          { title: 'Mastering the CSS Box Model, Margins, and Padding Collapse', url: 'https://youtu.be/nFgE7g4iWer8' },
          { title: 'Deep Dive into CSS Flexbox vs. CSS Grid Layouts', url: 'https://youtu.be/HheRpUCYN9Q' }
        ],
        onlineLinks: [
          { title: 'CSS-Tricks: A Complete Guide to Flexbox', url: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/' },
          { title: 'CSS-Tricks: A Complete Guide to Grid', url: 'https://css-tricks.com/complete-guide-css-grid-layout/' },
          { title: 'MDN Web Docs: CSS Object Model', url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Grids' }
        ]
      },
      'Responsive Design': {
        id: 'web-mod-3',
        title: 'Responsive Design',
        aiNotes: '• Mobile-First: Design for small screens first, then scale up using media queries.\n• Media Queries: CSS blocks applied only when specific device conditions match.\n• Fluid Grids: Use relative units like %, vw, vh, and rem instead of pixels.\n• Responsive Images: The srcset attribute serves optimized image sizes based on screen resolution.\n• Viewport Meta Tag: Instructs mobile browsers to render pages at screen width dimensions.',
        scoutMission: 'Write a mobile-first media query breakdown for standard mobile, tablet, and desktop viewports.',
        tutorFocus: 'Differences between em and rem units; and fixing common mobile zoom issues.',
        labs: 'Lab: Convert a fixed-width desktop landing page into a fully fluid, mobile-responsive layout.',
        videos: [
          { title: 'Designing with Mobile-First Methodologies and Breakpoints', url: 'https://www.youtube.com/watch?v=q6qA_609UOE' },
          { title: 'Implementing Responsive Images Using Srcset and Picture Tags', url: 'https://youtu.be/4VUfk464vzk' }
        ],
        onlineLinks: [
          { title: 'Google Web Developers: Responsive Design Basics', url: 'https://developers.google.com/search/blog/2012/04/responsive-design-harnessing-power-of' },
          { title: 'A List Apart: Responsive Web Design', url: 'https://web.dev/articles/responsive-web-design-basics' },
          { title: 'Am I Responsive Layout Tool', url: 'https://fireship.dev/amiresponsive' }
        ]
      },
      'JavaScript Basics': {
        id: 'web-mod-4',
        title: 'JavaScript Basics',
        aiNotes: '• Data Types: JavaScript handles primitives (strings, numbers, booleans) and complex structures (objects, arrays).\n• Scope: Variables use block scope (let, const) or function scope (var).\n• Functions: Arrow functions offer concise syntax and lexical binding of this.\n• Control Flow: Conditionals and loops manage application logic execution paths.\n• Array Methods: Functions like .map(), .filter(), and .reduce() mutate array outputs efficiently.',
        scoutMission: 'Explain the functional difference between == and === operators in JavaScript.',
        tutorFocus: 'JavaScript closures for data privacy and the event loop mechanics.',
        labs: 'Lab: Create a functional command-line calculator app that processes array input operations.',
        videos: [
          { title: 'JavaScript Variables, Scopes, and Hoisting Mechanics Explained', url: 'https://youtu.be/EvfRXyKa_GI' },
          { title: 'Modern JavaScript ES6+ Features and Array Methods', url: 'https://youtu.be/Ks0Z_qP2WEk' }
        ],
        onlineLinks: [
          { title: 'JavaScript.info: The Modern JavaScript Tutorial', url: 'https://javascript.info/' },
          { title: 'MDN Web Docs: JavaScript First Steps', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Introduction' },
          { title: 'Eloquent JavaScript E-Book', url: 'https://eloquentjavascript.net/' }
        ]
      },
      'DOM Manipulation': {
        id: 'web-mod-5',
        title: 'DOM Manipulation',
        aiNotes: '• DOM Selection: Select elements using querySelector or querySelectorAll.\n• Event Listeners: Capture user actions like click, submit, or keydown.\n• Element Mutation: Modify content using textContent or properties with setAttribute.\n• Event Bubbling: Events propagate up the DOM tree unless explicitly stopped via stopPropagation().\n• Dynamic Elements: Create and append brand new nodes using document.createElement().',
        scoutMission: 'Show me how to implement event delegation for a dynamic list of items.',
        tutorFocus: 'Performance cost of innerHTML vs textContent and toggling CSS classes on click.',
        labs: 'Lab: Build an interactive Todo List application where users can add and delete items.',
        videos: [
          { title: 'Traversing and Selecting Nodes in the Document Object Model', url: 'https://youtu.be/v7rSSy8CaYE' },
          { title: 'Handling User Interactions with JavaScript Event Listeners', url: 'https://youtu.be/XF1_MlZ5l6M' }
        ],
        onlineLinks: [
          { title: 'MDN Web Docs: Introduction to the DOM', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model' },
          { title: 'JavaScript 30: Vanilla JS Coding Challenges', url: 'https://javascript30.com/' },
          { title: 'DOM Enrichment Guide', url: 'https://www.w3schools.com/js/js_dom_examples.asp' }
        ]
      },
      'Modern CSS (Tailwind)': {
        id: 'web-mod-6',
        title: 'Modern CSS (Tailwind)',
        aiNotes: '• Utility-First: Style components by applying pre-defined atomic classes directly in HTML.\n• JIT Engine: Tailwind generates exact CSS rules on demand during development.\n• Configuration: Custom themes, colors, and plugins are defined inside tailwind.config.js.\n• Hover & Focus: Handle element states using conditional modifiers like hover: or focus:.\n• Purging: Production builds drop unused classes to keep stylesheet file sizes minimal.',
        scoutMission: 'How do I configure a custom dark mode color scheme in my Tailwind config file?',
        tutorFocus: 'Converting custom CSS grid to Tailwind and understanding the @apply directive.',
        labs: 'Lab: Recreate a premium dashboard interface design using only Tailwind CSS helper utilities.',
        videos: [
          { title: 'Setting up Tailwind CSS and Understanding Utility Architecture', url: 'https://youtu.be/Ybybd3GCNn4' },
          { title: 'Building Complex Components Efficiently with Tailwind Modifiers', url: 'https://youtu.be/B6FrDu2Qbt0' }
        ],
        onlineLinks: [
          { title: 'Tailwind CSS Official Documentation', url: 'https://tailwindcss.com/' },
          { title: 'Tailwind Play Sandbox', url: 'https://play.tailwindcss.com/' },
          { title: 'Refactoring UI Book Snippets', url: 'https://refactoringui.com/' }
        ]
      },
      'Frontend Frameworks Intro': {
        id: 'web-mod-7',
        title: 'Frontend Frameworks Intro',
        aiNotes: '• Component Model: UIs are broken into reusable, self-contained building blocks.\n• Declarative UI: Developers define what the interface looks like based on current data state.\n• Virtual DOM: Frameworks calculate UI changes in memory before touching the actual browser DOM.\n• State Management: Local variables track dynamic component data over time.\n• Props: Immutable configuration arguments passed down from parent components to child components.',
        scoutMission: 'What is the core difference between declarative UI rendering and imperative DOM manipulation?',
        tutorFocus: 'How props differ from internal state; and building a simple counter component.',
        labs: 'Lab: Build a simple weather application widget using components to display structured data.',
        videos: [
          { title: 'The Evolution of Frontend Frameworks: Why We Stopped Using Vanilla JS', url: 'https://youtu.be/2F_vV6fJ808' },
          { title: 'Understanding Components, Rendering Loops, and UI States', url: 'https://youtu.be/tYjlOJtQTFw' }
        ],
        onlineLinks: [
          { title: 'React Documentation', url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Frameworks_libraries/React_getting_started' },
          { title: 'Vue.js Guide', url: 'https://vuejs.org/guide/introduction' },
          { title: 'Vite Build Tool Quickstart', url: 'https://vite.dev/guide/' }
        ]
      },
      'API Integration': {
        id: 'web-mod-8',
        title: 'API Integration',
        aiNotes: '• REST Architecture: Web services exchange data via standard URL structures and HTTP verbs.\n• JSON Format: Lightweight data interchange format readable by humans and computers.\n• Fetch API: Native browser engine used to make asynchronous network requests.\n• Promises: Objects representing eventual completion or failure of asynchronous processes.\n• Error Handling: Catching network issues using try...catch structural wrappers.',
        scoutMission: 'How do I handle API loading states and errors cleanly in my frontend code?',
        tutorFocus: 'Async/await fetch examples and resolving CORS errors during development.',
        labs: 'Lab: Create a searchable movie catalog application fetching live results from an external API.',
        videos: [
          { title: 'Demystifying Promises, Async/Await Functions, and Network Latency', url: 'https://youtu.be/fyGSyqEX2dw' },
          { title: 'Parsing JSON Payloads and Updating the UI Dynamically', url: 'https://youtu.be/yb2cge8Z8tI' }
        ],
        onlineLinks: [
          { title: 'MDN Web Docs: Fetch API Guide', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API' },
          { title: 'JSON Placeholder: Free Mock API', url: 'https://jsonplaceholder.typicode.com/' },
          { title: 'Postman API Client Tool', url: 'https://www.postman.com/product/api-client/' }
        ]
      },
      'Deployment & Hosting': {
        id: 'web-mod-9',
        title: 'Deployment & Hosting',
        aiNotes: '• Build Step: Bundlers compile, minify, and optimize raw asset code for user browsers.\n• Static Hosting: Deploying raw HTML, CSS, and JS directly onto content delivery networks.\n• Git/GitHub: Version control system tracking codebase history and managing distribution branches.\n• CI/CD Pipelines: Automated routines that test and deploy code changes instantly on push.\n• Custom Domains: Pointing standard registrar URLs to hosting provider name servers.',
        scoutMission: 'What are the step-by-step instructions to connect a local Git repository to GitHub?',
        tutorFocus: 'Difference between static and server-side hosting; and configuring env variables on Vercel/Netlify.',
        labs: 'Lab: Initialize a repository via Git, publish it to GitHub, and deploy it live on Vercel.',
        videos: [
          { title: 'Git Version Control Foundations: Committing and Pushing Changes', url: 'https://youtu.be/oZpKSd8wdZk' },
          { title: 'Deploying Live Frontend Projects using Netlify, Vercel, or GitHub', url: 'https://youtu.be/RaFyXjXWwmg' }
        ],
        onlineLinks: [
          { title: 'GitHub Skills Tutorials', url: 'https://github.com/VoltAgent/awesome-agent-skills' },
          { title: 'Vercel Deployment Documentation', url: 'https://vercel.com/docs/deployments' },
          { title: 'Netlify Framework Hosting Guide', url: 'https://www.netlify.com/blog/2016/09/29/a-step-by-step-guide-deploying-on-netlify/' }
        ]
      },
      'Portfolio Project': {
        id: 'web-mod-10',
        title: 'Portfolio Project',
        aiNotes: '• Project Scope: Combine all prior knowledge into a functional multi-view application.\n• Code Architecture: Organize project directories logically with distinct modular scopes.\n• Documentation: Maintain a structured README.md detailing architecture, setups, and features.\n• Performance: Optimize images, fonts, and assets to hit high performance audit scores.\n• Polishing: Implement accessibility features, semantic patterns, and custom responsive layouts.',
        scoutMission: 'Review this project architecture plan and suggest adjustments for better modularity.',
        tutorFocus: 'Professional README templates and scoring 100% on Google Lighthouse tests.',
        labs: 'Lab: Build, debug, optimize, document, and deploy your personal web development portfolio site.',
        videos: [
          { title: 'Planning, Scoping, and Wireframing Your Frontend Portfolio Capstone', url: 'https://youtu.be/wpfE9XQuMBI' },
          { title: 'Auditing Accessibility and Performance Using Google Lighthouse Tools', url: 'https://youtu.be/8dKo7fx0UXE' }
        ],
        onlineLinks: [
          { title: 'Google Lighthouse Guide', url: 'https://developers.google.com/web/tools/lighthouse' },
          { title: 'Web.dev: Performance Audits', url: 'https://web.dev/performance-scoring/' }
        ]
      }
    }
  },
  {
    id: 'mobile-dev',
    title: 'Mobile App Dev',
    emoji: '📱',
    duration: '12 weeks',
    level: 'Intermediate',
    modules: [
      'Mobile Ecosystem Intro',
      'React Native Basics',
      'Mobile UI Components',
      'Navigation Patterns',
      'State Management on Mobile',
      'Device APIs (Camera, GPS)',
      'Local Storage',
      'Push Notifications',
      'App Store Preparation',
      'Capstone Mobile App'
    ],
    description: 'Create cross-platform mobile applications for iOS and Android.',
    syllabus: {
      'Mobile Ecosystem Intro': {
        title: 'Mobile Ecosystem Intro',
        aiNotes: '• Cross-Platform Architecture: React Native uses a JavaScript bridge (or the newer JSI architecture) to invoke native iOS and Android components instead of rendering inside a web view.\n• Hermes Engine: A JavaScript engine optimized for running React Native, improving app start-up time, decreasing memory usage, and reducing app size.\n• Metro Bundler: The JavaScript bundler for React Native that takes in entry files and options, giving you a single JavaScript file containing all code and its dependencies.',
        scoutMission: 'When starting an app, ask your AI pair programmer: "Given these specific product requirements, should I use Expo Managed workflow or a Bare React Native workflow?"',
        tutorFocus: 'Analyze this dependency graph conflict between React Native version X and native library Y, and provide the modified build.gradle or Podfile fix.',
        labs: 'Lab: Environment Setup. Configure Node.js, Android Studio (AVD), and Xcode (iOS Simulator). Initialize a boilerplate project using Expo CLI.',
        videos: [
          { title: 'Understanding the Native Bridge: How JavaScript Communicates with Objective-C and Java.', url: 'https://youtu.be/Hzjy9ipIuyc' },
          { title: 'Video Walkthrough 2', url: 'https://youtu.be/qzaK3ke2PE0' }
        ],
        onlineLinks: [
          { title: 'React Native Official Documentation', url: 'https://reactnative.dev/docs/getting-started' },
          { title: 'Expo Architecture Overview', url: 'https://docs.expo.dev/guides/new-architecture/' }
        ]
      },
      'React Native Basics': {
        title: 'React Native Basics',
        aiNotes: '• JSX in Mobile: You cannot use HTML tags like <div> or <p>. You must use primitives like <View> and <Text>.\n• Component Lifecycle: Mobile components mount, update, and unmount similarly to React web, but require optimizations for view visibility changes (e.g., when a screen goes out of focus).',
        scoutMission: 'Convert this web-based React component utilizing div and span tags into a mobile-ready React Native functional component using appropriate primitives.',
        tutorFocus: 'Review this functional component for unnecessary re-renders during rapid state changes.',
        labs: 'Lab: Your First App. Build a simple interactive profile page utilizing functional components, props, and useState.',
        videos: [
          { title: 'React Web vs. React Native: Structural and Concept Differences.', url: 'https://youtu.be/XbDkviNB0KI' },
          { title: 'Video Walkthrough 2', url: 'https://youtu.be/QIS3Nz5CQHY' }
        ],
        onlineLinks: [
          { title: 'Core Components and Native Components', url: 'https://reactnative.dev/docs/intro-react-native-components' },
          { title: 'React Hooks API Reference', url: 'https://react.dev/reference/react/hooks' }
        ]
      },
      'Mobile UI Components': {
        title: 'Mobile UI Components',
        aiNotes: '• Flexbox Layout: React Native defaults to flexDirection: \'column\'. Not all web CSS properties are supported (e.g., grid layouts must be emulated via flex structures).\n• Scrollable Performance: Use FlatList or SectionList instead of wrapping items in a ScrollView. FlatList lazily renders items to maintain low memory usage.',
        scoutMission: 'Generate a clean, responsive Flexbox layout for a feed item that includes an avatar, timestamp, text body, and action buttons.',
        tutorFocus: 'Optimize this FlatList component by configuring getItemLayout and adding a custom keyExtractor.',
        labs: 'Lab: High-Performance Lists. Build an infinite scroll dashboard using FlatList that fetches data from a public API.',
        videos: [
          { title: 'Mastering Flexbox and Responsive Design on Diverse Screen Sizes.', url: 'https://youtu.be/TrsrNZo0pOY' },
          { title: 'Video Walkthrough 2', url: 'https://youtu.be/m8BSEUUB5so' }
        ],
        onlineLinks: [
          { title: 'FlatList Performance Optimizations', url: 'https://reactnative.dev/docs/optimizing-flatlist-configuration' },
          { title: 'React Native StyleSheet API', url: 'https://reactnative.dev/docs/stylesheet' }
        ]
      },
      'Navigation Patterns': {
        title: 'Navigation Patterns',
        aiNotes: '• React Navigation: The standard library handling screen transitions. It maintains a navigation stack array.\n• Navigation Types: Stack Navigation (pushing/popping screens), Tab Navigation (persistent bottom bars), and Drawer Navigation (side menus).',
        scoutMission: 'Draft the configuration for a React Navigation container containing a nested bottom tab navigator inside an authentication stack switcher.',
        tutorFocus: 'Create a configuration mapping URL deep links to specific nested screens inside my navigation tree.',
        labs: 'Lab: Nested Navigation. Build a multi-screen app containing an Auth Stack (Login/Signup) that hands off to an App Tabs Stack (Home/Settings).',
        videos: [
          { title: 'Handling Navigation Parameters and Native Screen Transitions.', url: 'https://youtu.be/4axQp0wfMtU' },
          { title: 'Video Walkthrough 2', url: 'https://youtu.be/Zlp1nFaxDIo' }
        ],
        onlineLinks: [
          { title: 'React Navigation Documentation', url: 'https://reactnavigation.org/' },
          { title: 'Expo Router Deep Linking Guide', url: 'https://docs.expo.dev/router/basics/navigation/' }
        ]
      },
      'State Management on Mobile': {
        title: 'State Management on Mobile',
        aiNotes: '• State Persistence: Unlike web storage, mobile state management often requires synchronization with native local stores to maintain user sessions across app terminations.\n• Architectures: Context API works well for minor global values. Zustand or Redux Toolkit are ideal for high-frequency updates or massive data schemas.',
        scoutMission: 'Write a lightweight Zustand store configuration for a mobile shopping cart application, including methods to add, remove, and calculate totals.',
        tutorFocus: 'How do I implement a custom logging middleware in Redux Toolkit that profiles state update speeds on slow hardware?',
        labs: 'Lab: E-Commerce State Management. Implement a globally accessible shopping cart store using Zustand, handling complex additions and persistent user sessions.',
        videos: [
          { title: 'Choosing Your State Strategy: Context API vs. Zustand vs. Redux.', url: 'https://youtu.be/6yhmDOrjA-w' },
          { title: 'Video Walkthrough 2', url: 'https://youtu.be/Qbaw_ZQdfWo' }
        ],
        onlineLinks: [
          { title: 'Zustand Documentation', url: 'https://zustand.docs.pmnd.rs/learn/getting-started/introduction' },
          { title: 'Redux Toolkit Quick Start', url: 'https://redux-toolkit.js.org/tutorials/quick-start' }
        ]
      },
      'Device APIs (Camera, GPS)': {
        title: 'Device APIs (Camera, GPS)',
        aiNotes: '• Permission Paradigms: iOS and Android require explicit user permissions at runtime before accessing sensitive components like the camera, microphone, or hardware location sensors.\n• Hardware Emulation: Simulators require configuration adjustment to mimic active sensor inputs (e.g., injecting fake GPX tracks or mock camera configurations).',
        scoutMission: 'Create a clean wrapper function using expo-location that checks for existing location permissions and requests them if missing.',
        tutorFocus: 'How do I safely handle hardware denial exceptions when a user rejects access to the device camera?',
        labs: 'Lab: Photo-Journal App. Build a functional component that accesses the camera, snaps a photo, fetches current GPS coordinates, and displays them on a map overlay.',
        videos: [
          { title: 'Managing Runtime Permissions and Handling OS Rejections Elegantly.', url: 'https://youtu.be/GWzJI-zVuJM' },
          { title: 'Video Walkthrough 2', url: 'https://youtu.be/51fX94dU7Og' }
        ],
        onlineLinks: [
          { title: 'Expo Camera API Reference', url: 'https://docs.expo.dev/versions/latest/sdk/camera/' },
          { title: 'Expo Location API Reference', url: 'https://docs.expo.dev/versions/latest/sdk/location/' }
        ]
      },
      'Local Storage': {
        title: 'Local Storage',
        aiNotes: '• AsyncStorage: Unencrypted, asynchronous, key-value storage engine targeting simple app settings or small persistent configuration objects.\n• SecureStore: Encrypts data safely on disk. Uses Keychain services on iOS and Secure Preferences / Keystore on Android. Use this exclusively for tokens and private credentials.',
        scoutMission: 'Provide a secure storage helper module that wraps Expo SecureStore to save, retrieve, and wipe JWT authentication tokens.',
        tutorFocus: 'How do I safely parse and migrate older JSON data structures stored inside AsyncStorage when pushing an app update?',
        labs: 'Lab: Offline Preferences. Create a settings page where dark mode toggles, cache sizes, and access tokens persist reliably across hard app restarts.',
        videos: [
          { title: 'Data Security on Mobile: SQLite, AsyncStorage, vs. Secure Store.', url: 'https://youtu.be/s_tBTjQzlSg' },
          { title: 'Video Walkthrough 2', url: 'https://youtu.be/wVNPmxntwKQ' }
        ],
        onlineLinks: [
          { title: 'React Native Async Storage Documentation', url: 'https://react-native-async-storage.github.io/2.0/' },
          { title: 'Expo SecureStore Docs', url: 'https://docs.expo.dev/versions/latest/sdk/securestore/' }
        ]
      },
      'Push Notifications': {
        title: 'Push Notifications',
        aiNotes: '• Notification Lifecycles: Received push events behave differently depending on app state: Foreground (app open), Background (minimized), or Terminated (closed).\n• Delivery Infrastructure: Apple Push Notification service (APNs) drives iOS devices; Firebase Cloud Messaging (FCM) drives Android devices. Expo simplifies this with a unified proxy ticket token system.',
        scoutMission: 'Write a React Native hook that requests notification permissions and extracts the unique Expo push token for backend routing.',
        tutorFocus: 'Generate a compliant backend JSON payload structure containing custom data attributes for an FCM target notification.',
        labs: 'Lab: Live Chat Alerts. Set up an app listener that receives a remote push push notification payload and triggers local navigation to a specific sub-screen.',
        videos: [
          { title: 'Setting Up Certificates, Provisioning Profiles, and APNs/FCM Gateways.', url: 'https://youtu.be/4crodN5EYN8' },
          { title: 'Video Walkthrough 2', url: 'https://youtu.be/ZqL3n9bSMqw' }
        ],
        onlineLinks: [
          { title: 'Expo Notifications Setup Guide', url: 'https://docs.expo.dev/push-notifications/push-notifications-setup/' },
          { title: 'Firebase Cloud Messaging Architecture', url: 'https://firebase.google.com/docs/cloud-messaging' }
        ]
      },
      'App Store Preparation': {
        title: 'App Store Preparation',
        aiNotes: '• Signing & Provisioning: iOS builds require a paid Apple Developer Account, Explicit App IDs, and Distribution Provisioning Profiles. Android require a Java Keystore generation workflow.\n• Splash Screens & Icons: Native assets must be accurately rasterized into exact dimensions across multiple resolution scales to prevent image distortion on startup.',
        scoutMission: 'Generate an eas.json configuration file supporting distinct \'development\', \'preview/staging\', and \'production\' build profiles.',
        tutorFocus: 'Identify this compilation failure output from my iOS build logs related to an incorrect Cocoapods architecture mapping.',
        labs: 'Lab: Production Bundling. Use EAS Build (Expo Application Services) to generate an .ipa file for Apple TestFlight and an .aab (Android App Bundle) file for Google Play Console.',
        videos: [
          { title: 'Navigating App Store Connect and Managing Google Play Closed Testing Tracks.', url: 'https://youtu.be/X4atrva5nwg' },
          { title: 'Video Walkthrough 2', url: 'https://youtu.be/pq3KoTsoCAk' }
        ],
        onlineLinks: [
          { title: 'Expo Application Services (EAS) Overview', url: 'https://docs.expo.dev/eas/' },
          { title: 'App Store Review Guidelines', url: 'https://docs.expo.dev/distribution/app-stores/' }
        ]
      },
      'Capstone Mobile App': {
        title: 'Capstone Mobile App',
        aiNotes: '• Production Readiness: Production apps require global error boundaries, automated crash reporting services (e.g., Sentry), and analytical tracking events.\n• Continuous Integration: Configure automated systems to trigger a preview build every time code is merged into the main development branch.',
        scoutMission: 'Review this entire capstone structural outline for architectural weak points, potential memory leaks, or unhandled promise exceptions.',
        tutorFocus: 'Write a GitHub Actions workflow file that triggers an automated EAS production build whenever a new release tag is pushed.',
        labs: 'Lab: The Ultimate Deployment. Implement an advanced, full-stack application incorporating authentication, maps, local caching, push alerts, and error boundary wrappers.',
        videos: [
          { title: 'Final Polish: UI Layout Tweaks, Sentry Crash Tracking integration, and Store Release Optimization.', url: 'https://youtu.be/tYZciJSm8wU' },
          { title: 'Video Walkthrough 2', url: 'https://youtu.be/oPU8Y9K6-sQ' }
        ],
        onlineLinks: [
          { title: 'Sentry Integration for React Native', url: 'https://docs.sentry.io/platforms/react-native/' },
          { title: 'React Native Performance Tuning', url: 'https://sentry.io/for/react-native/' }
        ]
      }
    }
  },
  {
    id: 'game-design',
    title: 'Game Design & Dev',
    emoji: '🎮',
    duration: '16 weeks',
    level: 'Intermediate',
    modules: [
      'Game Design Theory',
      'Unity/Unreal Basics',
      'C# for Games',
      '2D Physics & Assets',
      '3D Modeling Intro',
      'User Interface in Games',
      'Multiplayer Logic',
      'Audio & Visual Effects',
      'Game Optimization',
      'Publishing Your Game'
    ],
    description: 'Design and build immersive games with professional tools and game theory.',
    syllabus: {
      'Game Design Theory': {
        title: 'Game Design Theory',
        aiNotes: '• Core gameplay loops define player engagement.\n• Mechanics must align with intended player emotions.\n• Balancing utilizes procedural generation for difficulty scaling.\n• AI personas simulate diverse player testing behaviors.',
        scoutMission: 'Analyze my game loop using Bartle’s Taxonomy.',
        tutorFocus: 'Explains how to balance competitive and cooperative mechanics.',
        labs: 'Lab: Design a game concept document using ChatGPT.',
        videos: [
          { title: 'The Art of Game Juice', url: 'https://youtu.be/216_5nu4aVQ' },
          { title: 'Feedback loops', url: 'https://youtu.be/_3WKEQD6yyY' }
        ],
        onlineLinks: [
          { title: 'Gamasutra Game Design Archives', url: 'https://rich0664.github.io/Gamasutra-Archive/' },
          { title: 'MDA Framework Paper', url: 'https://aaai.org/papers/ws04-04-001-mda-a-formal-approach-to-game-design-and-game-research/' }
        ]
      },
      'Unity/Unreal Basics': {
        title: 'Unity/Unreal Basics',
        aiNotes: '• Unity uses a Component-based architecture pattern.\n• Unreal Engine relies on Object-oriented Actor blueprints.\n• AI assistants speed up scene gray-boxing workflows.\n• Game engines manage assets via virtual file registries.',
        scoutMission: 'Convert this Unity GameObject logic into Unreal Blueprints.',
        tutorFocus: 'Teaches engine lifecycle events like Start() vs BeginPlay().',
        labs: 'Lab: Set up a basic 3D scene with AI layout tools.',
        videos: [
          { title: 'Unity vs Unreal Engine Interfaces', url: 'https://youtu.be/PsyGPT6M6nQ' },
          { title: '3D Scene Setup', url: 'https://youtu.be/WPYEcwJExsg' }
        ],
        onlineLinks: [
          { title: 'Unity Learn Platform', url: 'https://learn.unity.com/' },
          { title: 'Unreal Engine Developer Portal', url: 'https://dev.epicgames.com/' }
        ]
      },
      'C# for Games': {
        title: 'C# for Games',
        aiNotes: '• C# script structures control object runtime behaviors.\n• Avoid expensive functions like Update() for static logic.\n• Use events and delegates to decouple code systems.\n• LLMs generate efficient boilerplate templates for state machines.',
        scoutMission: 'Refactor this nested C# conditional for better performance.',
        tutorFocus: 'Highlights memory management risks like garbage collection spikes.',
        labs: 'Lab: Write an AI-assisted finite state machine for enemies.',
        videos: [
          { title: 'C# Optimization Techniques', url: 'https://youtu.be/fucfkutQCeQ' },
          { title: 'AI-assisted FSM', url: 'https://youtu.be/eR-AGr5nKEU' }
        ],
        onlineLinks: [
          { title: 'Microsoft C# Documentation', url: 'https://learn.microsoft.com/en-us/dotnet/csharp/' },
          { title: 'DotNetPerls Game Programming Guide', url: 'https://www.dotnetperls.com/' }
        ]
      },
      '2D Physics & Assets': {
        title: '2D Physics & Assets',
        aiNotes: '• Rigidbodies drive physics-based movement and collision detection.\n• Colliders define physical boundaries using primitive vector shapes.\n• Sprite sheets require precise pivot points for animations.\n• Neural networks upscale textures while maintaining pixel precision.',
        scoutMission: 'Why is my 2D character clipping through walls?',
        tutorFocus: 'Explains continuous vs discrete collision detection modes.',
        labs: 'Lab: Build a physics-based 2D platformer controller.',
        videos: [
          { title: '2D Sprite Animation Workflows', url: 'https://youtu.be/yz93q9rcIyk' },
          { title: 'Physics-based 2D Controller', url: 'https://youtu.be/3sWTzMsmdx8' }
        ],
        onlineLinks: [
          { title: 'Unity 2D Physics Manual', url: 'https://docs.unity3d.com/6000.4/Documentation/Manual/2d-physics/2d-physics.html' },
          { title: 'Kenney Free Game Assets', url: 'https://kenney.nl/assets' }
        ]
      },
      '3D Modeling Intro': {
        title: '3D Modeling Intro',
        aiNotes: '• Polygonal topology dictates mesh deformation and shadow rendering.\n• UV unwrapping projects 3D surfaces onto 2D spaces.\n• Normal maps simulate high-poly details on low-poly models.\n• Generative AI creates seamless tileable PBR texture materials.',
        scoutMission: 'Fix non-manifold geometry errors on my 3D mesh.',
        tutorFocus: 'Evaluates edge loops for clean animation rigging deformities.',
        labs: 'Lab: Model, texture, and export a game prop using Blender.',
        videos: [
          { title: 'AI Texture Generation Workflows', url: 'https://youtu.be/eJl5USzBsmo' },
          { title: 'Blender Fundamentals', url: 'https://youtu.be/pzz0wAZK5D4' }
        ],
        onlineLinks: [
          { title: 'Blender Fundamentals Series', url: 'https://youtu.be/z-Xl9tGqH14' },
          { title: 'Polyhaven Free PBR Textures', url: 'https://polyhaven.com/textures' }
        ]
      },
      'User Interface in Games': {
        title: 'User Interface in Games',
        aiNotes: '• Diegetic UI exists directly within the game world environment.\n• Non-diegetic UI overlays static screens on top of gameplay.\n• UI scaling matrices must adapt across multi-aspect ratio displays.\n• AI UI wireframing generators accelerate layout composition tests.',
        scoutMission: 'Design a responsive inventory HUD layout for mobile screens.',
        tutorFocus: 'Audits canvas scaling settings for proper screen anchors.',
        labs: 'Lab: Construct an interactive, animated main menu system.',
        videos: [
          { title: 'UX Design Principles for Gaming', url: 'https://youtu.be/it85yAxQYKY' },
          { title: 'Main Menu System', url: 'https://youtu.be/j72xQ6xfoZY' }
        ],
        onlineLinks: [
          { title: 'Game UI Database', url: 'https://www.gameuidatabase.com/' },
          { title: 'Unreal Engine UMG UI Guide', url: 'https://youtu.be/w63iU2OZh9M' }
        ]
      },
      'Multiplayer Logic': {
        title: 'Multiplayer Logic',
        aiNotes: '• Client-server architecture prevents players from manipulating critical data.\n• Remote Procedure Calls (RPCs) sync actions across network nodes.\n• Client-side prediction masks network latency for smooth movement.\n• AI bots simulate server loads to test concurrent stress limits.',
        scoutMission: 'Fix positional jitter in my replication code.',
        tutorFocus: 'Implements linear interpolation algorithms across network packets.',
        labs: 'Lab: Code a multiplayer lobby with synchronized player movements.',
        videos: [
          { title: 'Network Topology and Latency', url: 'https://youtu.be/IWi6iv7_sT4' },
          { title: 'Multiplayer Lobby', url: 'https://youtu.be/9v1ATUwOM1U' }
        ],
        onlineLinks: [
          { title: 'Unity Netcode for GameObjects', url: 'https://docs.unity3d.com/Packages/com.unity.netcode.gameobjects@2.11/manual/index.html' },
          { title: 'Epic Online Services Documentation', url: 'https://dev.epicgames.com/docs/epic-online-services/eos-overview' }
        ]
      },
      'Audio & Visual Effects': {
        title: 'Audio & Visual Effects',
        aiNotes: '• Audio spatialization calculates sound attenuation based on listener distance.\n• Particle engines simulate dynamic effects like fire, smoke, and magic.\n• Post-processing stacks control color grading, bloom, and depth filters.\n• Neural sound generators create custom foley audio asset variations.',
        scoutMission: 'How do I create a realistic explosion particle system?',
        tutorFocus: 'Optimizes particle lifetimes and alpha-blending to prevent lag.',
        labs: 'Lab: Program dynamic music parameters that shift with player health.',
        videos: [
          { title: 'Visual Effects Mastery', url: 'https://youtu.be/TbZYoSu1w8Y' },
          { title: 'Dynamic Music Parameters', url: 'https://youtu.be/Fuj21xEfP5g' }
        ],
        onlineLinks: [
          { title: 'FMOD Studio Learning Resources', url: 'https://www.fmod.com/learn' },
          { title: 'Sonniss Free Game Audio Archives', url: 'https://sonniss.com/gameaudiogdc/' }
        ]
      },
      'Game Optimization': {
        title: 'Game Optimization',
        aiNotes: '• Draw calls represent individual CPU commands to graphics hardware.\n• Occlusion culling stops processing objects hidden behind solid walls.\n• Object pooling recycles active memory allocation to prevent lag spikes.\n• Profiling tools track hardware bottlenecks across CPU and GPU cores.',
        scoutMission: 'Why is my frame rate dropping during heavy combat?',
        tutorFocus: 'Isolates memory allocations using deep profiler analysis reports.',
        labs: 'Lab: Run a profiling session to fix memory leaks.',
        videos: [
          { title: 'Reducing Draw Calls', url: 'https://youtu.be/1hrzCXyBIis' },
          { title: 'Profiling Session', url: 'https://youtu.be/AAXCX5pbK_4' }
        ],
        onlineLinks: [
          { title: 'Unity Profiler User Manual', url: 'https://docs.unity3d.com/6000.4/Documentation/Manual/Profiler.html' },
          { title: 'Unreal Engine Performance Insights', url: 'https://dev.epicgames.com/documentation/unreal-engine/unreal-insights-in-unreal-engine' }
        ]
      },
      'Publishing Your Game': {
        title: 'Publishing Your Game',
        aiNotes: '• SDK integration adds achievements, leaderboards, and cloud save states.\n• Build pipelines compile raw code into specific platform executables.\n• Storefront localization opens distributions to international target global markets.\n• Automated testing suites scan builds for hardware crash vulnerabilities.',
        scoutMission: 'Generate a deployment checklist for publishing to Steam.',
        tutorFocus: 'Explains application signing keys and storefront asset requirements.',
        labs: 'Lab: Build, sign, and export a finalized release build package.',
        videos: [
          { title: 'Indie Game Marketing Strategies', url: 'https://youtu.be/cesQgqbYpVs' },
          { title: 'Finalized Release Build', url: 'https://youtu.be/O2PKihXmejw' }
        ],
        onlineLinks: [
          { title: 'Steamworks Distribution Portal', url: 'https://partner.steamgames.com/steamdirect' },
          { title: 'Apple Developer App Store Connect', url: 'https://developer.apple.com/app-store-connect/' }
        ]
      }
    }
  },
  {
    id: 'graphics-design',
    title: 'Graphics Design',
    emoji: '🎨',
    duration: '10 weeks',
    level: 'Beginner',
    modules: [
      'Design Fundamentals',
      'Color Theory & Typography',
      'Adobe Illustrator Basics',
      'Vector Illustration',
      'Photoshop for Designers',
      'Branding & Identity',
      'Layout Design',
      'Print vs Digital',
      'Portfolio Selection',
      'Exhibition Project'
    ],
    description: 'Unlock your creativity and master visual communication through graphic design.',
    syllabus: {
      'Design Fundamentals': {
        title: 'Design Fundamentals',
        aiNotes: '• Visual Hierarchy: AI tools analyze eye-tracking data to optimize focal points.\n• Composition: Generative grids automatically balance negative space and alignment.\n• Gestalt Principles: AI layout assistants ensure proximity and closure in complex designs.',
        scoutMission: 'Analyze this layout for balance and suggest improvements for visual weight.',
        tutorFocus: 'Ask the AI: "Analyze this layout for balance and suggest improvements for visual weight."',
        labs: 'Lab: Recreate a classic Swiss design poster using only three shapes and two text sizes.',
        videos: [
          { title: 'The Future of Composition', url: 'https://youtu.be/FhbGhXCV0Ho' },
          { title: 'Designing with AI-Driven Grids', url: 'https://youtu.be/JYg_-PiNFqU' }
        ],
        onlineLinks: [
          { title: 'The Vignelli Canon – Design Philosophy', url: 'https://www.pixartprinting.com/blog/graphic-design-massimo-vignelli/' },
          { title: 'Canva Design School – Hierarchy Basics', url: 'https://www.canva.com/design-school/' }
        ]
      },
      'Color Theory & Typography': {
        title: 'Color Theory & Typography',
        aiNotes: '• Color Palettes: Neural networks generate harmonized palettes from text prompts or moods.\n• Contrast Accessibility: Automated checks ensure compliance with WCAG 2.1 accessibility standards.\n• Font Pairing: Machine learning matches display fonts with legible body copy instantly.',
        scoutMission: 'Give me a triadic color palette for a sustainable energy brand targeting Gen Z.',
        tutorFocus: 'Ask the tutor to test your font combinations for legibility across mobile screens.',
        labs: 'Lab: Design a typography-only book cover using an AI-generated color scheme.',
        videos: [
          { title: 'Psychology of Color and Type', url: 'https://youtu.be/wBaTNvs8enw' },
          { title: 'Typography-only Book Cover', url: 'https://youtu.be/akZEuHPhUxU' }
        ],
        onlineLinks: [
          { title: 'Adobe Color – Palette Generator', url: 'https://color.adobe.com/' },
          { title: 'Google Fonts – Typography Pairing Tool', url: 'https://fonts.google.com/knowledge/choosing_type/pairing_typefaces' }
        ]
      },
      'Adobe Illustrator Basics': {
        title: 'Adobe Illustrator Basics',
        aiNotes: '• Text to Vector: AI engines generate editable vector graphics from descriptive text prompts.\n• Generative Recolor: Change entire artwork color schemes instantly using descriptive moods.\n• Smooth Tool: Machine learning algorithms automatically clean up anchor points on rough paths.',
        scoutMission: 'Explain the difference between the Pen tool and the Curvature tool for organic shapes.',
        tutorFocus: 'Submit a vector file path to check if your anchor points are mathematically optimized.',
        labs: 'Lab: Trace a complex organic object using the Pen tool, then apply Generative Recolor.',
        videos: [
          { title: 'Mastering Illustrator’s AI Vector Tools', url: 'https://youtu.be/uYVXTlP2t9E' },
          { title: 'Illustrator AI Vector Tools walkthrough', url: 'https://youtu.be/X4xGyWFpA6Q' }
        ],
        onlineLinks: [
          { title: 'Adobe Illustrator Tutorials', url: 'https://www.adobe.com/ca/learn/illustrator' },
          { title: 'Vector Garage – Asset Best Practices', url: 'https://docs.imgix.com/en-US/getting-started/tutorials/design-elements-and-composition/best-practices-for-creating-vector-assets' }
        ]
      },
      'Vector Illustration': {
        title: 'Vector Illustration',
        aiNotes: '• Style Matching: AI analyzes an artist\'s style and applies it to new vector paths.\n• Dynamic Symmetrical Drawing: Real-time mirroring engines streamline complex pattern creation.\n• Auto-Tracing: Upgraded image-trace engines convert photos to clean, scalable vector art.',
        scoutMission: 'How do I create depth in flat vector illustration without using gradients?',
        tutorFocus: 'The AI reviews your illustration layers for clean organization and naming conventions.',
        labs: 'Lab: Create a flat-design character illustration and upscale it infinitely using vector workflows.',
        videos: [
          { title: 'Advanced Vector Shading', url: 'https://youtu.be/JTazLM-LdeU' },
          { title: 'Flat-design Character Illustration', url: 'https://youtu.be/BIptsdgnvIY' }
        ],
        onlineLinks: [
          { title: 'Vecteezy – Vector Inspiration', url: 'https://www.vecteezy.com/free-vector/visual-communication' },
          { title: 'Dribbble – Vector Illustration Trends', url: 'https://dribbble.com/search/vector-illustration' }
        ]
      },
      'Photoshop for Designers': {
        title: 'Photoshop for Designers',
        aiNotes: '• Generative Fill: Add, remove, or extend image content using natural language text prompts.\n• Neural Filters: Change facial expressions, age, or colorize black-and-white photos instantly.\n• Smart Selections: AI-powered object selection masks complex edges like hair perfectly.',
        scoutMission: 'What is the non-destructive workflow for blending two drastically different photos?',
        tutorFocus: 'Paste your layer stack description to check if your masks are truly non-destructive.',
        labs: 'Lab: Composite three distinct images into a seamless surreal landscape using Generative Match.',
        videos: [
          { title: 'Non-Destructive Designing', url: 'https://youtu.be/MrkPoX6Tlik' },
          { title: 'Photoshop Neural Filters', url: 'https://youtu.be/iQUtXuTm5AQ' }
        ],
        onlineLinks: [
          { title: 'Adobe Photoshop Learning Hub', url: 'https://www.adobe.com/ca/learn/photoshop' },
          { title: 'Phlearn – Advanced Photoshop Workflows', url: 'https://phlearn.com/tutorial/' }
        ]
      },
      'Branding & Identity': {
        title: 'Branding & Identity',
        aiNotes: '• Brand Strategy: AI assists in competitor matrix analysis and target audience profiling.\n• Logo Synthesis: Generative tools rapidly iterate hundreds of conceptual logo variations.\n• Asset Automation: Automated engines scale a single logo design into 50+ social media sizes.',
        scoutMission: 'Develop a brand voice and positioning statement for a zero-waste coffee shop.',
        tutorFocus: 'Present your logo concept to the AI to test for distinctiveness against existing trademarks.',
        labs: 'Lab: Build a comprehensive brand style guide, including logo usage, type, and voice.',
        videos: [
          { title: 'Designing Brand Systems', url: 'https://youtu.be/SOFeaicPkdw' },
          { title: 'Brand Style Guide', url: 'https://youtu.be/ofFyRI6ROTI' }
        ],
        onlineLinks: [
          { title: 'UnderConsideration – Brand New', url: 'https://www.underconsideration.com/brandnew/' },
          { title: 'Logo Design Love – Identity Resource', url: 'https://www.logodesignlove.com/' }
        ]
      },
      'Layout Design': {
        title: 'Layout Design',
        aiNotes: '• Smart Reflow: Editorial layouts automatically rearrange content based on device screen size.\n• Content Infill: AI placeholders generate relevant, context-aware text instead of standard Lorem Ipsum.\n• Auto-Tagging: Multi-page documents automatically tag headers for screen-reader accessibility.',
        scoutMission: 'What grid system works best for a text-heavy bi-annual art magazine?',
        tutorFocus: 'Share your margin and column dimensions to verify readability and printing safety zones.',
        labs: 'Lab: Layout a 4-page digital magazine spread using an asymmetric grid and dynamic text wraps.',
        videos: [
          { title: 'Modern Multi-Page Layout Systems', url: 'https://youtu.be/ho3ykjbH994' },
          { title: 'Digital Magazine Spread', url: 'https://youtu.be/ovNSIHzwp4M' }
        ],
        onlineLinks: [
          { title: 'Grid Systems in Graphic Design', url: 'https://www.domestika.org/en/courses/5642-specialization-in-graphic-design-and-visual-communication' },
          { title: 'Editorial Design Academy', url: 'https://www.ied.edu/subjects/visual-communication-graphic-interactive-media' }
        ]
      },
      'Print vs Digital': {
        title: 'Print vs Digital',
        aiNotes: '• Color Space Conversion: Neural networks predict and correct color shifts from RGB to CMYK.\n• Pre-flight Checks: Automated bots scan print files for resolution issues and low-ink hazards.\n• Responsive Scaling: Layouts automatically adjust for variable aspect ratios across devices.',
        scoutMission: 'Explain rich black vs. standard black and when to use each in print.',
        tutorFocus: 'Submit your file specifications to verify bleed, slug, and DPI settings.',
        labs: 'Lab: Prepare the exact same promotional poster for a physical billboard and an Instagram story.',
        videos: [
          { title: 'Flawless Print Pre-Production', url: 'https://youtu.be/gfbgR-qTeP0' },
          { title: 'Print vs Digital workflows', url: 'https://youtu.be/5vBU1zlPOa4' }
        ],
        onlineLinks: [
          { title: 'International Paper – Print Specifications', url: 'https://www.neenahpaper.com/resources/paper-101/international-sizes' },
          { title: 'Awwwards – Digital Layout and Web Trends', url: 'https://www.awwwards.com/' }
        ]
      },
      'Portfolio Selection': {
        title: 'Portfolio Selection',
        aiNotes: '• Curation Analytics: AI reviews portfolio traffic to identify which projects hold recruiter attention longest.\n• SEO Optimization: Automated metadata generation ensures your work ranks high on design platforms.\n• Case Study Structuring: AI writing tools help structure project challenges, processes, and results.',
        scoutMission: 'Review my case study outline and tell me if the design problem is clearly stated.',
        tutorFocus: 'Let the AI act as a creative director to critique which three projects are your strongest.',
        labs: 'Lab: Write and format an interactive online case study for your best graphic design project.',
        videos: [
          { title: 'Structuring Portfolios for Creative Directors', url: 'https://youtu.be/8M0qxamf1rE' },
          { title: 'Interactive Online Case Study', url: 'https://youtu.be/c9oj0HqOvvA' }
        ],
        onlineLinks: [
          { title: 'Behance Portfolio Network', url: 'https://www.behance.net/search/projects/graphic%20design%20networking' },
          { title: 'Adobe Portfolio Builder', url: 'https://portfolio.adobe.com/' }
        ]
      },
      'Exhibition Project': {
        title: 'Exhibition Project',
        aiNotes: '• Virtual Mockups: AI renders your physical designs inside hyper-realistic 3D exhibition spaces.\n• Interactive Elements: Generate QR codes linked to dynamic, augmented reality (AR) extensions of your art.\n• Project Management: Predictive timelines keep your production schedule on track for launch night.',
        scoutMission: 'How can I integrate an augmented reality experience into a physical print poster?',
        tutorFocus: 'Run your final exhibition pitch by the tutor for clarity, impact, and storytelling.',
        labs: 'Lab: Create, test, and print a large-scale exhibition piece complete with an interactive digital component.',
        videos: [
          { title: 'Preparing Your Work for Public Display', url: 'https://youtu.be/zBe7oiq-Tsg' },
          { title: 'Large-scale Exhibition Piece', url: 'https://youtu.be/bBJmQXWP-BE' }
        ],
        onlineLinks: [
          { title: 'Artsteps – Virtual Exhibition Creator', url: 'https://www.artsteps.com/' },
          { title: 'The Design Museum – Contemporary Formats', url: 'https://designmuseum.org/learning-at-the-museum/schools/digital-design-workshops' }
        ]
      }
    }
  },
  {
    id: 'ui-ux-design',
    title: 'UI/UX Design',
    emoji: '✏️',
    duration: '12 weeks',
    level: 'Advanced',
    modules: [
      'UX Research Methods',
      'User Personas & Stories',
      'Wireframing Basics',
      'Prototyping with Figma',
      'Interactive Design',
      'Accessibility in UI',
      'Usability Testing',
      'Design Systems',
      'UI/UX Deliverables',
      'Design Sprint Capstone'
    ],
    description: 'Design user-centric interfaces and seamless user experiences.',
    syllabus: {
      'UX Research Methods': {
        title: 'UX Research Methods',
        aiNotes: '• Core Goal: Discover user needs, behaviors, and pain points before designing.\n• Qualitative Methods: Interviews and focus groups reveal why users act.\n• Quantitative Methods: Surveys and analytics reveal what users do.\n• Attitudinal vs. Behavioral: What users say vs. what users actually do.\n• Generative Research: Conducted at the project start to find opportunities.\n• Evaluation Research: Conducted during design to check usability success.',
        scoutMission: 'Act as a target user from a specific demographic.',
        tutorFocus: 'Interview the AI to uncover hidden friction points.',
        labs: 'Lab Exercise: Create a 5-question unbiased user interview script.',
        videos: [
          { title: 'The Art of the Unbiased User Interview', url: 'https://youtu.be/rTNUTeXNG-c' },
          { title: 'UX Research walkthrough', url: 'https://youtu.be/TZLCSZHQJsA' }
        ],
        onlineLinks: [
          { title: 'Nielsen Norman Group: UX Research Cheat Sheet', url: 'https://www.nngroup.com/articles/ux-research-cheat-sheet/' },
          { title: 'Interaction Design Foundation: Qualitative vs Quantitative Research', url: 'https://ixdf.org/literature/topics/qualitative-research' }
        ]
      },
      'User Personas & Stories': {
        title: 'User Personas & Stories',
        aiNotes: '• User Personas: Archetypes representing key traits of your target audience.\n• Data-Driven: Personas must stem from actual research, not imagination.\n• User Stories: Agile framework format: "As a [user], I want [goal] so that [benefit]."\n• Job Stories (JTBD): Format focus: "When [situation], I want to [motivation], so I can [outcome]."\n• Empathy Mapping: Visualizing what users say, think, do, and feel.',
        scoutMission: 'Act as an Agile Product Owner reviewing backlogs.',
        tutorFocus: 'Input raw user interview transcripts into the AI.',
        labs: 'Lab Exercise: Write 5 user stories and mapping acceptance criteria.',
        videos: [
          { title: 'Personas vs. Jobs-to-be-Done', url: 'https://youtu.be/76LyRKts1Ac' },
          { title: 'User Stories walkthrough', url: 'https://youtu.be/xN3ivc4cGQI' }
        ],
        onlineLinks: [
          { title: 'HubSpot: Make My Persona Tool', url: 'https://www.hubspot.com/make-my-persona' },
          { title: 'Atlassian: User Stories Definition and Examples', url: 'https://www.atlassian.com/agile/project-management/user-stories' }
        ]
      },
      'Wireframing Basics': {
        title: 'Wireframing Basics',
        aiNotes: '• Low-Fidelity (Lo-Fi): Quick paper sketches focusing on structure, not style.\n• Mid-Fidelity (Mid-Fi): Digital grey-box layouts determining content hierarchy and spacing.\n• Information Architecture (IA): Organizing and structuring content logically for users.\n• Friction Elimination: Keeping layouts intuitive to reduce user cognitive load.\n• Don\'t Make Me Think: The core principle of visual layout design.',
        scoutMission: 'Act as a Senior UX Architect evaluating layout logic.',
        tutorFocus: 'Describe a layout hierarchy in markdown text blocks.',
        labs: 'Lab Exercise: Sketch 10 rapid variations of a landing page hero section.',
        videos: [
          { title: 'Moving from Paper Sketches to Mid-Fi Digital Layouts', url: 'https://youtu.be/4t6eHmLAVq0' },
          { title: 'Wireframing Basics walkthrough', url: 'https://youtu.be/LJbkLdtEW00' }
        ],
        onlineLinks: [
          { title: 'Balsamiq: Wireframing Academy', url: 'https://balsamiq.com/learn/learning-tracks/rapid-wireframing/' },
          { title: 'UX Mastery: Introduction to Information Architecture', url: 'https://uxmastery.com/' }
        ]
      },
      'Prototyping with Figma': {
        title: 'Prototyping with Figma',
        aiNotes: '• Figma Ecosystem: Cloud-based, vector-first collaborative design tool interface.\n• Frames vs. Groups: Frames act as independent viewports with layout properties.\n• Auto Layout: Dynamic padding and alignment engine for responsive design.\n• Components: Reusable UI elements that push global changes instantly.\n• Component Variants: Grouping variations of a single element (e.g., button states).',
        scoutMission: 'Act as a Figma Expert troubleshooter.',
        tutorFocus: 'Paste your Auto Layout parameters into the chat.',
        labs: 'Lab Exercise: Build a fully responsive profile card using nested Auto Layouts.',
        videos: [
          { title: 'Mastering Constraints and Auto Layout 4.0', url: 'https://youtu.be/rgbnAsmPaZk' },
          { title: 'Prototyping with Figma walkthrough', url: 'https://youtu.be/JGLfyTDgfDc' }
        ],
        onlineLinks: [
          { title: 'Figma Help Center: Guide to Auto Layout', url: 'https://help.figma.com/hc/en-us/articles/360040451373-Guide-to-auto-layout' },
          { title: 'Figma YouTube Channel: Official Tutorials', url: 'https://www.youtube.com/c/FigmaDesign' }
        ]
      },
      'Interactive Design': {
        title: 'Interactive Design',
        aiNotes: '• High-Fidelity (Hi-Fi): Interactive digital prototypes that mimic live software behavior.\n• Smart Animate: Figma interpolates changes in matching layers automatically.\n• Micro-interactions: Subtle animations reinforcing user actions (e.g., toggles, heart likes).\n• Triggers & Actions: Events (On Click, On Hover) causing reactions (Navigate To, Open Overlay).\n• State Management: Using component variants to map interactive states cleanly.',
        scoutMission: 'Act as an Interaction Designer analyzing motion choreography.',
        tutorFocus: 'Describe an intended multi-state animation timeline to the AI.',
        labs: 'Lab Exercise: Create a functional, animated dropdown menu with interactive components.',
        videos: [
          { title: 'Advanced Smart Animate and Overlays in Figma', url: 'https://youtu.be/TMpUero7JRA' },
          { title: 'Interactive Design walkthrough', url: 'https://youtu.be/WgbiGtPVm8Q' }
        ],
        onlineLinks: [
          { title: 'Material Design: Motion Principles', url: 'https://design.google/library/material-design-motion-sharon-harris' },
          { title: 'UX Planet: Dynamic Micro-interactions Guide', url: 'https://uxplanet.org/micro-interactions-a-complete-beginners-guide-b446d90215ec' }
        ]
      },
      'Accessibility in UI': {
        title: 'Accessibility in UI',
        aiNotes: '• WCAG 2.2: Web Content Accessibility Guidelines governing global digital inclusivity.\n• Four Principles (POUR): Perceivable, Operable, Understandable, and Robust interfaces.\n• Contrast Ratios: Minimum 4.5:1 for normal text; 3:1 for large text.\n• Screen Readers: Designing layouts that linearize cleanly for blind users.\n• Alt Text: Providing meaningful textual descriptions for visual media assets.',
        scoutMission: 'Act as an Accessibility Compliance Auditor.',
        tutorFocus: 'Provide HEX color combinations to the AI.',
        labs: 'Lab Exercise: Run an accessibility audit on an existing layout using the Stark plugin.',
        videos: [
          { title: 'Designing for Color Blindness and Low Vision', url: 'https://youtu.be/py4J0-1H70Q' },
          { title: 'Accessibility in UI walkthrough', url: 'https://youtu.be/tLL4ovnh3tk' }
        ],
        onlineLinks: [
          { title: 'W3C: Web Accessibility Initiative (WAI) Portal', url: 'https://www.w3.org/WAI/' },
          { title: 'WebAIM: Contrast Checker Tool', url: 'https://webaim.org/resources/contrastchecker/' }
        ]
      },
      'Usability Testing': {
        title: 'Usability Testing',
        aiNotes: '• Testing Scope: Evaluating prototypes by watching real users complete tasks.\n• Moderated Testing: Live observation where the researcher guides the session.\n• Unmoderated Testing: Users complete tasks independently via automated testing platforms.\n• Think-Aloud Protocol: Users vocalize thoughts, confusion, and feelings during tasks.\n• System Usability Scale (SUS): 10-item questionnaire calculating a standard usability score.',
        scoutMission: 'Act as a frustrated user encountering a broken flow.',
        tutorFocus: 'Submit task success rates and error metrics to the AI.',
        labs: 'Lab Exercise: Run a 10-minute remote unmoderated test on your interactive prototype.',
        videos: [
          { title: 'Synthesizing Usability Test Feedback', url: 'https://youtu.be/JSVK4HjOTX4' },
          { title: 'Usability Testing walkthrough', url: 'https://youtu.be/zrnGFFecgzg' }
        ],
        onlineLinks: [
          { title: 'Hotjar: Guide to Usability Testing', url: 'https://www.hotjar.com/usability-testing/' },
          { title: 'Maze: Remote Testing Platform Guide', url: 'https://maze.co/collections/ux-ui-design/' }
        ]
      },
      'Design Systems': {
        title: 'Design Systems',
        aiNotes: '• Single Source of Truth: Unified repository of design standards and code components.\n• Atomic Design: Hierarchy scaling from Atoms to Molecules, Organisms, Templates, and Pages.\n• Design Tokens: Named variables storing values like colors, font-sizes, and spacing values.\n• Governance Model: Strict rules for proposing, reviewing, and approving system updates.\n• Scale & Efficiency: Accelerating development cycles while preserving brand consistency.',
        scoutMission: 'Act as a Design Tokens Architect.',
        tutorFocus: 'Paste your naming convention strategy into the chat interface.',
        labs: 'Lab Exercise: Tokenize a color palette and font scale inside a Figma library.',
        videos: [
          { title: 'Structuring Atomic Components for Enterprise Scale', url: 'https://youtu.be/dI4msQ6Q50U' },
          { title: 'Design Systems walkthrough', url: 'https://youtu.be/m7kUGmNkPoc' }
        ],
        onlineLinks: [
          { title: 'Brad Frost: Atomic Design Methodology', url: 'https://atomicdesign.bradfrost.com/' },
          { title: 'Design Systems Repo', url: 'https://designsystemsrepo.com/' }
        ]
      },
      'UI/UX Deliverables': {
        title: 'UI/UX Deliverables',
        aiNotes: '• Handoff Process: Packaging final designs cleanly for software development teams.\n• Redlining: Documenting exact specs, padding, margins, and code tokens manually or digitally.\n• UX Case Studies: Storytelling documents outlining Problem, Process, Solution, and Results.\n• Asset Optimization: Exporting imagery vectors at correct resolutions (@2x, @3x, SVG).\n• Feedback Loops: Organizing stakeholder critiques through asynchronous commentary.',
        scoutMission: 'Act as an Engineering Lead inspecting design files.',
        tutorFocus: 'Outline a case study structure to the AI.',
        labs: 'Lab Exercise: Build a developer handoff page with documented states in Figma.',
        videos: [
          { title: 'How to Avoid Friction During Developer Handoffs', url: 'https://youtu.be/Kmp85DeC3K4' },
          { title: 'UI/UX Deliverables walkthrough', url: 'https://youtu.be/F3w_GwBwhYE' }
        ],
        onlineLinks: [
          { title: 'Figma: Guide to Developer Handoff', url: 'https://www.figma.com/best-practices/guide-to-developer-handoff/' },
          { title: 'Case Study Club: Top-Tier UX Portfolio Examples', url: 'https://www.casestudy.club/' }
        ]
      },
      'Design Sprint Capstone': {
        title: 'Design Sprint Capstone',
        aiNotes: '• Google Design Sprint: Five-day framework answering critical business validation questions.\n• Understand (Day 1): Map out the user problem space completely.\n• Sketch (Day 2): Brainstorm and ideate competing design solutions.\n• Decide (Day 3): Convert selected ideas into a structured storyboard.\n• Prototype & Test (Days 4–5): Build a realistic mockup and validate it with 5 users.',
        scoutMission: 'Act as a Venture Capitalist validating MVP concepts.',
        tutorFocus: 'Present capstone results and user test metrics to the AI.',
        labs: 'Lab Exercise: Execute a condensed, solo 4-hour design sprint challenge.',
        videos: [
          { title: 'Facilitating Virtual Sprints with Miro and Figma', url: 'https://youtu.be/xX5crDlJYqs' },
          { title: 'Design Sprint walkthrough', url: 'https://youtu.be/GamnfBj4dGM' }
        ],
        onlineLinks: [
          { title: 'The Sprint Book: Official Google Ventures Resource', url: 'https://www.gv.com/sprint/' },
          { title: 'Miro: Ready-to-Use Design Sprint Templates', url: 'https://miro.com/templates/5-day-design-sprint/' }
        ]
      }
    }
  }
];

export const ASSESSMENTS: Record<string, { question: string; options: string[]; answer: number }[]> = {
  'python-dev': [
    { question: 'Which of the following statements best describes the core design philosophy of Python?', options: ['Explicit is better than implicit, and readability counts.', 'Maximum execution speed over code clarity.', 'Heavy reliance on curly braces and semicolons for strict structure.', 'Static typing to catch all variable errors before execution.'], answer: 0 },
    { question: 'What will be the exact output of the command print("Hello", "World", sep="-")?', options: ['Hello World', 'Hello-World', 'HelloWorld-', '("Hello", "World")'], answer: 1 },
    { question: 'If x = 5 and y = "2", what occurs when executing print(x + int(y))?', options: ['The program prints 7.', 'The program prints 52.', 'A TypeError is thrown.', 'A ValueError is thrown.'], answer: 0 },
    { question: 'Which of the following is an example of an invalid variable name in Python?', options: ['user_age', '_total_score', '2nd_place', 'calculateValue'], answer: 2 },
    { question: 'What does the continue statement do when executed inside a loop?', options: ['Terminates the entire loop immediately.', 'Skips the rest of the current iteration and jumps to the next loop cycle.', 'Exits the entire Python program safely.', 'Pauses loop execution until user input is received.'], answer: 1 },
    { question: 'What gets printed for: x=10; if x>5 and x<15: print("A"); elif x==10: print("B"); else: print("C")?', options: ['A', 'B', 'A and B', 'C'], answer: 0 },
    { question: 'According to the LEGB rule, in what order does Python look up variable scopes?', options: ['Local, Enclosing, Global, Built-in', 'Local, External, Global, Binary', 'List, Element, Group, Block', 'Logical, Executable, General, Base'], answer: 0 },
    { question: 'What is the correct way to define a function with a default parameter value?', options: ['def greet(name = "Guest"):', 'def greet(default name):', 'function greet(name: "Guest")', 'def greet("Guest" = name):'], answer: 0 },
    { question: 'Which collection type is ordered, mutable, and defined using square brackets []?', options: ['Tuple', 'Dictionary', 'Set', 'List'], answer: 3 },
    { question: 'Given my_dict = {"apple": 2, "banana": 3}, how do you safely look up the value of "orange" without throwing a KeyError?', options: ['my_dict["orange"]', 'my_dict.get("orange", 0)', 'my_dict.find("orange")', 'my_dict.pop("orange")'], answer: 1 },
    { question: 'Why is using "with open(...) as f:" preferred over calling f.close()?', options: ['It runs faster.', 'It automatically handles closing the file, even if exceptions occur.', 'It encrypts the file data.', 'It converts text directly into a list.'], answer: 1 },
    { question: 'Which file mode should you use to write text to the end of an existing file?', options: ['"w"', '"r"', '"a"', '"x"'], answer: 2 },
    { question: 'Which block under a try-except workflow is guaranteed to run regardless of exceptions?', options: ['else', 'finally', 'except', 'raise'], answer: 1 },
    { question: 'What specific error is raised if you try to divide a number by zero in Python?', options: ['ValueError', 'ZeroDivisionError', 'ArithmeticException', 'TypeError'], answer: 1 },
    { question: 'What is the explicit purpose of the self parameter inside Python class methods?', options: ['It points to the class definition template.', 'It represents the specific object instance currently executing the method.', 'It acts as a security lock.', 'It converts the method into a global function.'], answer: 1 },
    { question: 'Which OOP principle is demonstrated when a child class reuses code from a parent via super().__init__()?', options: ['Encapsulation', 'Polymorphism', 'Inheritance', 'Abstraction'], answer: 2 },
    { question: 'What command line tool is used to install external third-party packages from PyPI?', options: ['pip', 'npm', 'python-install', 'git'], answer: 0 },
    { question: 'What error is raised if Python cannot find or resolve a module name in an import statement?', options: ['ImportError', 'ModuleNotFoundError', 'FileNotFoundError', 'NameError'], answer: 1 },
    { question: 'What is the primary purpose of a README.md file in a software project repository?', options: ['To hold binary files.', 'To act as a Markdown document detailing project functionality, usage, and setup.', 'To store encrypted passwords.', 'To serve as the primary entry point script.'], answer: 1 },
    { question: 'What design practice helps keep a large application maintainable?', options: ['Writing all logic in a single monolithic script.', 'Breaking code into logical custom modules, using functions and OOP.', 'Avoiding error handling.', 'Relying exclusively on global variables.'], answer: 1 }
  ],
  'web-design': [
    { question: 'Which HTML5 tag is the most semantically appropriate for marking up the main navigation links of a website?', options: ['<menu>', '<nav>', '<section>', '<links>'], answer: 1 },
    { question: 'Which attribute is required on an HTML5 <input> element to ensure its data is included in the query string or request body when the form is submitted?', options: ['id', 'value', 'name', 'placeholder'], answer: 2 },
    { question: 'According to the standard CSS Box Model, if an element has width 300px, padding 20px, and border 5px, what is the visual width if box-sizing: content-box is active?', options: ['300px', '325px', '340px', '350px'], answer: 3 },
    { question: 'Which CSS Grid property is used to define the alignment of grid items along the block (vertical) axis within their individual grid areas?', options: ['justify-items', 'align-items', 'justify-content', 'align-content'], answer: 1 },
    { question: 'What is the functional purpose of the viewport meta tag <meta name="viewport" content="width=device-width, initial-scale=1.0">?', options: ['Forcing fullscreen mode on mobile.', 'Setting initial width to match device screen width, preventing automatic desktop scaling.', 'Increasing download speed of CSS media queries.', 'Converting pixel units automatically into percentages.'], answer: 1 },
    { question: 'How does an em unit differ from a rem unit when applied to the font-size property?', options: ['em is viewport width, rem is viewport height.', 'em is relative to direct parent font-size, rem is relative to root <html> element font-size.', 'em is for mobile, rem is for desktop.', 'em values change based on line height, rem values are fixed.'], answer: 1 },
    { question: 'What will the console display for: let a = [1, 2, 3]; let b = a; b.push(4); console.log(a);?', options: ['[1, 2, 3]', '[1, 2, 3, 4]', 'undefined', 'TypeError'], answer: 1 },
    { question: 'What is the primary difference between the let and var keywords in modern JavaScript?', options: ['let allows redeclaration, var throws error.', 'let sets global scope, var restricts to closures.', 'let is block-scoped, while var is function-scoped.', 'let only stores primitives, var stores objects.'], answer: 2 },
    { question: 'Which modern JavaScript DOM method should you use to select the very first element matching a specific CSS selector?', options: ['document.getElementById()', 'document.getElementsByClassName()', 'document.querySelector()', 'document.querySelectorAll()'], answer: 2 },
    { question: 'What is the architectural concept of "Event Delegation" in vanilla JavaScript DOM management?', options: ['Assigning unique listeners to every child.', 'Attaching a single listener to a parent to manage child interactions via bubbling.', 'Passing control to web worker threads.', 'Preventing any default browser behaviors.'], answer: 1 },
    { question: 'Which Tailwind CSS utility class combination makes an element background blue only on hover?', options: ['hover-bg-blue-500', 'hover:bg-blue-500', 'onhover:blue', 'bg-blue-500:hover'], answer: 1 },
    { question: 'What is the primary operational mechanism of Tailwind CSS\'s Just-In-Time (JIT) compilation engine?', options: ['Downloading pre-built CSS layout files from CDN.', 'Scanning template files for class names and dynamically generating corresponding rules on demand.', 'Translating vanilla CSS files directly into JavaScript modules.', 'Generating random utility class names to prevent inspection.'], answer: 1 },
    { question: 'In declarative frontend framework models (React or Vue), what is the primary role of the "Virtual DOM"?', options: ['Serving as a secure cloud backup of the visual theme.', 'Simulating 3D coordinate space environments.', 'Keeping a lightweight abstraction in memory, calculating minimal changes before batching updates to the browser DOM.', 'Acting as a middleware server proxy for database queries.'], answer: 2 },
    { question: 'What does it mean for data flow to be "unidirectional" in component-driven architectures?', options: ['Code must be compiled into a single file.', 'State changes travel horizontally across siblings.', 'Data parameters (props) are passed strictly downwards from parent to child.', 'Network payloads can only be read top to bottom.'], answer: 2 },
    { question: 'Which HTTP request method (verb) should be used in fetch() to update an entire existing resource profile on a server?', options: ['GET', 'POST', 'PUT', 'DELETE'], answer: 2 },
    { question: 'What occurs when a browser encounters a Cross-Origin Resource Sharing (CORS) restriction error?', options: ['Server crashes because of corrupted data.', 'Browser blocks the application from reading the response because the server did not authorize the domain.', 'ISP revokes access to the target protocol.', 'API data is permanently encrypted.'], answer: 1 },
    { question: 'What is the primary role of a "Build Step" or "Bundler" (like Vite or Webpack)?', options: ['Running the app locally to test for responsive bugs.', 'Registering the custom domain name.', 'Optimizing assets by minifying code, compressing images, and bundling modules into lightweight static files.', 'Uploading local project folders to backup drives.'], answer: 2 },
    { question: 'How does a CI/CD pipeline optimize the development workflow?', options: ['Writing automated documentation.', 'Monitoring a repository (GitHub) and automatically testing/building/deploying updates on push.', 'Preventing unauthorized developers from modifying layout without password.', 'Generating alternative responsive design layouts.'], answer: 1 },
    { question: 'Which Lighthouse metric measures visual stability by tracking unexpected layout shifts during page load?', options: ['First Contentful Paint (FCP)', 'Cumulative Layout Shift (CLS)', 'Time to Interactive (TTI)', 'Total Blocking Time (TBT)'], answer: 1 },
    { question: 'What is the structural purpose of a README.md file in a project repository?', options: ['Primary layout stylesheet index.', 'Providing human-readable documentation (installation, setup, features, deployment).', 'Storing encrypted database credentials.', 'Structural validation manifest for CDNs.'], answer: 1 }
  ],
  // ... adding more for brevity but ensuring 60 total as requested
  'mobile-dev': [
    { question: 'Which architecture model describes how JavaScript code communicates with Native OEM widgets in a standard React Native framework application?', options: ['Native Compiler Engine', 'The React Native Bridge', 'Direct DOM Compilation', 'Virtual DOM Threading'], answer: 1 },
    { question: 'What is the default Flexbox layout direction (flexDirection) for layout components in React Native?', options: ['row', 'row-reverse', 'column', 'column-reverse'], answer: 2 },
    { question: 'Which component must be used if you need a long, dynamically rendered list of items to scroll efficiently without dropping frames or eating up device RAM?', options: ['<View>', '<ScrollView>', '<FlatList>', '<Form>'], answer: 2 },
    { question: 'Which core React Native component is used as a direct replacement for a standard web HTML <div> tag?', options: ['<Block>', '<Text>', '<Section>', '<View>'], answer: 3 },
    { question: 'When using React Navigation, which navigator pattern pushes new screens onto a linear historical stack, making it perfect for drill-down master-detail pages?', options: ['Tab Navigation', 'Drawer Navigation', 'Stack Navigation', 'Switch Navigation'], answer: 2 },
    { question: 'What happens if a mobile application is pushed to the background and the operating system encounters severe RAM/memory pressure?', options: ['The app state is safely saved to the cloud automatically.', 'The OS will aggressively close the application process, wiping out local runtime memory state.', 'The app is paused indefinitely and its state can never be lost.', 'The OS prompts the user with a popup warning box before closing anything.'], answer: 1 },
    { question: 'Which lightweight state management library was highlighted in Module 5 as a minimal, clean alternative to Redux Toolkit?', options: ['MobX', 'Zustand', 'Recoil', 'XState'], answer: 1 },
    { question: 'What are the three distinct authorization states you must handle when requesting hardware device API permissions?', options: ['Allowed, Blocked, Timeout', 'Granted, Denied, Undetermined', 'Accepted, Rejected, Forgotten', 'Approved, Restricted, Cancelled'], answer: 1 },
    { question: 'Which Expo-specific library allows developers to query for GPS coordinates without writing custom Android Kotlin or iOS Swift code layers?', options: ['expo-gps', 'expo-map-coordinates', 'expo-location', 'expo-position'], answer: 2 },
    { question: 'What is the fundamental security difference between AsyncStorage and SecureStore?', options: ['AsyncStorage only works on Android, while SecureStore only works on iOS.', 'AsyncStorage handles large images, while SecureStore only handles small texts.', 'AsyncStorage stores unencrypted string data, while SecureStore uses native hardware encryption layers for sensitive data.', 'AsyncStorage is synchronized with iCloud, while SecureStore stays completely offline.'], answer: 2 },
    { question: 'What credential ecosystem is used to uniquely encrypt, sign, and authorize production application binaries for deployment on Android devices?', options: ['Apple Provisioning Profiles', 'Google Keystore Management', 'Expo Web Tokens', 'SQLite Security Salts'], answer: 1 },
    { question: 'To compile production binaries cloud-side without owning a high-powered Mac computer, you can use which ecosystem tool bundle?', options: ['React Native CLI', 'Expo Application Services (EAS)', 'Google Cloud Xcode Build', 'Android Studio Cloud Emulators'], answer: 1 },
    { question: 'Which intermediary push notification servers are implicitly required to distribute remote notification payloads to Apple devices?', options: ['Firebase Cloud Messaging (FCM)', 'Apple Push Notification service (APNs)', 'Expo Token Registers', 'GraphQL Subscription Channels'], answer: 1 },
    { question: 'What token type must be safely saved to your remote backend database to accurately deliver a push notification to one specific user device?', options: ['A unique device Push Token', 'An Apple Developer Team ID', 'A Google Play Account Password', 'An Expo Project ID'], answer: 0 },
    { question: 'If a developer needs to build an offline-first app where local application data persists instantly even after a full application crash or phone reboot, which native storage engine is ideal?', options: ['Component State via useState', 'React Context API Storage', 'MMKV / SQLite Databases', 'Global Context Provider Stores'], answer: 2 },
    { question: 'What annual fee does Apple currently charge developers for maintaining an active individual Apple Developer Account profile?', options: ['$25 one-time fee', '$0 (completely free)', '$99 yearly subscription fee', '$199 monthly premium fee'], answer: 2 },
    { question: 'Which property block is used to write and structure component styles in a React Native application?', options: ['Standard CSS stylesheets', 'Tailwind HTML inline strings', 'JavaScript objects passed through StyleSheet.create()', 'Native XML asset configurations'], answer: 2 },
    { question: 'What tool allows users to quickly run and test custom Expo applications live on a physical smartphone without compiling local platform binaries over USB?', options: ['Xcode Simulator', 'Android Studio Emulator', 'Expo Go Mobile App', 'Command Line Interface Shell'], answer: 2 },
    { question: 'Why can you not use standard web HTML tags like <img> directly in a native cross-platform build?', options: ['Web tags are too modern for mobile phones.', 'Mobile operating systems do not possess an underlying web browser DOM engine to parse standard HTML tags natively.', 'Apple blocks web tags due to strict security guidelines.', 'JavaScript code runs too slow to compile standard HTML tags on mobile devices.'], answer: 1 },
    { question: 'What is considered a primary evaluation criteria for a high-quality Capstone portfolio mobile application?', options: ['The volume of lines of code written.', 'Smooth UI polish, fluid navigation transitions, and resilient edge-case network error handling.', 'The absolute exclusion of all external open-source packages.', 'Complete platform parity with legacy desktop operating systems.'], answer: 1 }
  ],
  'game-design': [
    { question: 'Which core design element dictates the foundational structural activities a player repeatedly performs throughout a game?', options: ['Narrative arc', 'Core gameplay loop', 'Visual aesthetic', 'Reward schedule'], answer: 1 },
    { question: 'In the MDA Framework, what does the acronym "MDA" stand for?', options: ['Mechanics, Dynamics, Aesthetics', 'Models, Designs, Assets', 'Movement, Direction, Action', 'Multiplayer, Difficulty, Accessibility'], answer: 0 },
    { question: 'Which architectural structural pattern does the Unity engine primarily rely on for composing scene objects?', options: ['Model-View-Controller (MVC)', 'Component-based architecture', 'Pure object-oriented inheritance', 'Singleton pattern'], answer: 1 },
    { question: 'What is the fundamental base class for any object that can be placed or spawned into an Unreal Engine level?', options: ['GameObject', 'Pawn', 'Actor', 'Component'], answer: 2 },
    { question: 'Why should game developers generally avoid placing expensive logic or frequent object searches inside the C# Update() method?', options: ['It runs once per frame and can rapidly deplete CPU resources.', 'It runs only when the player interacts with the keyboard.', 'It executes on a separate thread, causing critical data race conditions.', 'It forces an immediate garbage collection allocation cycle.'], answer: 0 },
    { question: 'Which programming design strategy is most effective for decoupling game code systems, such as separating UI updates from health changes?', options: ['Deeply nested conditional structures', 'Global static variable tables', 'Events and delegates', 'Monolithic class inheritance'], answer: 2 },
    { question: 'Which collision detection mode should be assigned to a fast-moving 2D projectile to prevent it from passing through thin walls?', options: ['Discrete', 'Static', 'Continuous', 'Kinematic'], answer: 2 },
    { question: 'What property must be precisely configured on a 2D sprite sheet to ensure animations rotate and scale from the correct focal point?', options: ['Vector anchor', 'Pivot point', 'Vertex normal', 'Mipmap offset'], answer: 1 },
    { question: 'What type of image file map is used to simulate complex, high-poly surface details and depth on a low-poly 3D mesh without adding geometry?', options: ['Diffuse map', 'Albedo map', 'Specular map', 'Normal map'], answer: 3 },
    { question: 'What does the process of UV unwrapping accomplish in a 3D modeling asset pipeline?', options: ['It converts 3D vertex coordinates into 2D screen space coordinates.', 'It projects a 3D surface onto a flat 2D space for texture mapping.', 'It reduces the overall polygon count of a high-resolution mesh.', 'It generates bone hierarchies for character skeletal animation meshes.'], answer: 1 },
    { question: 'A health bar that exists physically within the virtual environment (such as an glowing indicator on a character’s spacesuit) is known as what type of UI?', options: ['Diegetic', 'Non-diegetic', 'Meta', 'Spatial'], answer: 0 },
    { question: 'To ensure a user interface layout scales dynamically across devices with varying aspect ratios, developers must configure which settings?', options: ['Alpha blending parameters', 'Canvas anchors and scale matrices', 'Vector projection matrices', 'Vertex depth buffers'], answer: 1 },
    { question: 'Which network pattern is primarily utilized in competitive multiplayer games to prevent client-side data tampering and cheating?', options: ['Peer-to-Peer topology', 'Mesh networking', 'Authoritative client architecture', 'Authoritative server architecture'], answer: 3 },
    { question: 'What networking technique is used to hide communication latency by instantly moving a local player character before receiving server verification?', options: ['Client-side prediction', 'Remote Procedure Calls', 'Packet interpolation', 'Server reconciliation'], answer: 0 },
    { question: 'What process calculates the automated drop-off and change in volume or tone based on the distance between a sound source and the audio listener?', options: ['Dynamic range compression', 'Audio spatialization and attenuation', 'Frequency modulation pitching', 'Doppler shift normalization'], answer: 1 },
    { question: 'Which system is best suited for rendering thousands of tiny, dynamic visual effects such as sparks, smoke clouds, or magical glowing embers?', options: ['Mesh renderer array', 'Particle engine', 'Post-processing volume stack', 'Sprite mask compositor'], answer: 1 },
    { question: 'What term describes an individual instruction sent from the CPU to the GPU to draw a specific object or group of vertices?', options: ['Draw call', 'Vertex pass', 'Frame pipeline', 'Render target'], answer: 0 },
    { question: 'How does occlusion culling optimize runtime performance in crowded 3D game scenes?', options: ['It lowers the texture resolution of distant background assets.', 'It combines multiple tiny texture maps into a single massive atlas sheet.', 'It stops rendering objects that are hidden behind other solid geometry.', 'It removes inactive scripts from system memory blocks.'], answer: 2 },
    { question: 'What type of software development package must be integrated into a project build to enable platform features like achievements and cloud saves?', options: ['Engine IDE extension', 'Platform SDK', 'Custom API wrapper', 'Graphics driver framework'], answer: 1 },
    { question: 'What is the primary purpose of a build pipeline within a game development deployment cycle?', options: ['To automatically optimize texture image resolutions.', 'To stream asset updates directly to live player game builds.', 'To compile source code and assets into platform-specific executables.', 'To run automated customer support chat scripts.'], answer: 2 }
  ],
  'graphics-design': [
    { question: 'Which design principle relies heavily on eye-tracking data analysis in AI layout assistants to optimize focal points?', options: ['Rule of Thirds', 'Visual Hierarchy', 'Symmetrical Balance', 'Sequential Alignment'], answer: 1 },
    { question: 'In Gestalt principles, when an AI layout assistant helps a designer ensure elements are grouped closely so viewers perceive them as a single unit, which specific concept is being applied?', options: ['Closure', 'Continuity', 'Proximity', 'Similarity'], answer: 2 },
    { question: 'What system or framework automated by AI checks ensures a color palette is compliant with digital text accessibility options for visually impaired users?', options: ['Pantone Matching System (PMS)', 'WCAG 2.1 Guidelines', 'CMYK Gamut Profiles', 'Adobe RGB Standards'], answer: 1 },
    { question: 'When generating a harmonized color palette from a single text prompt using a neural network, what type of color harmony uses three colors spaced evenly around the color wheel?', options: ['Complementary', 'Monochromatic', 'Triadic', 'Analogous'], answer: 2 },
    { question: 'Which tool in Adobe Illustrator uses machine learning algorithms to clean up complex paths by automatically reducing unnecessary anchor points?', options: ['Pen Tool', 'Smooth Tool', 'Curvature Tool', 'Scissors Tool'], answer: 1 },
    { question: 'Adobe Illustrator\'s modern "Generative Recolor" tool allows a designer to instantly change entire vector art color schemes using what input method?', options: ['Hex codes only', 'Descriptive text prompts or moods', 'Pixel-by-pixel eyedropper selection', 'Automated CMYK halftone channels'], answer: 1 },
    { question: 'In vector illustration, what is the primary benefit of upscaling a flat-design character asset infinitely?', options: ['It reduces the total file size down to bytes.', 'It maintains crisp clarity without pixelation or quality loss.', 'It automatically embeds a 3D depth layer.', 'It converts the color profile from RGB to CMYK instantly.'], answer: 1 },
    { question: 'When a vector engine uses style matching, what action is it performing?', options: ['Extracting keywords from a text document to find royalty-free images.', 'Analyzing an artist\'s style to apply its path characteristics to new vector artwork.', 'Automatically deleting duplicate layers in a layout.', 'Comparing two logos for legal trademark infringement.'], answer: 1 },
    { question: 'In Adobe Photoshop, which AI-powered feature allows you to add, remove, or extend image content seamlessly using natural language text prompts?', options: ['Content-Aware Patch', 'Neural Style Transfer', 'Generative Fill', 'Smart Sharpen'], answer: 2 },
    { question: 'What type of selection tool in Photoshop utilizes machine learning to instantly isolate complex, organic edges such as human hair?', options: ['Magnetic Lasso Tool', 'Smart Object Selector', 'Rectangular Marquee Tool', 'Magic Wand Tool'], answer: 1 },
    { question: 'Why is maintaining a non-destructive layer stack crucial when compositing multiple images in Photoshop?', options: ['It permanently flattens layers to maximize computer processing speed.', 'It preserves the original image data, allowing for infinite adjustments and masking tweaks later.', 'It automatically watermarks the image file to protect intellectual property.', 'It forces all pixels to align strictly to a pixel grid system.'], answer: 1 },
    { question: 'When building a comprehensive brand identity system, what is the primary purpose of asset automation tools?', options: ['Creating entirely new corporate names from legal registries.', 'Scaling a single logo layout into dozens of social media asset sizes simultaneously.', 'Registering global design patents automatically.', 'Writing strategic copywriting statements for promotional websites.'], answer: 1 },
    { question: 'What is the fundamental difference between a single logo design and a complete brand system?', options: ['A logo is an isolated mark, while a brand system encompasses a cohesive network of guidelines, type, voice, and elements.', 'A brand system is used strictly for physical signs, whereas a logo is digital.', 'Logos do not use color theory, whereas brand systems require at least five hues.', 'Brand systems must be redesigned every month by automated algorithms.'], answer: 0 },
    { question: 'In modern editorial layout design, what does "Smart Reflow" accomplish?', options: ['It translates text copy automatically into multiple foreign languages.', 'It dynamically rearranges document layout and content based on variable device screen sizes.', 'It highlights typographic typos using red underlines.', 'It embeds video content directly into printed paper stocks.'], answer: 1 },
    { question: 'What is the primary purpose of using AI content infill rather than standard "Lorem Ipsum" placeholder text in a prototype?', options: ['To secure copyright permissions for external media publications.', 'To provide relevant, context-aware placeholder text that mimics real production data.', 'To decrease the file size of the editorial text layers.', 'To test printer ink consumption levels during draft runs.'], answer: 1 },
    { question: 'What visual disaster occurs if a designer accidentally prints an image file formatted purely in digital RGB color space?', options: ['The image prints at half its intended size layout.', 'Significant shifts occur, turning bright on-screen neon hues into dull, muted printed tones.', 'The printer text fonts become completely unreadable.', 'The image automatically develops an accidental white outer bleed zone.'], answer: 1 },
    { question: 'When preparing a physical print file, what do the "bleed" and "slug" areas guarantee?', options: ['They act as automated digital watermarks for security tracking.', 'They provide a safe printing zone past the trim line to avoid unprinted white edges when paper is cut.', 'They adjust file layout compression for faster web page load speeds.', 'They serve as target zones for embedding QR code links.'], answer: 1 },
    { question: 'What data metric do modern portfolio curation platforms track to help designers identify which case study projects are most engaging?', options: ['The amount of RAM consumed by the digital page.', 'The color harmony score of the project thumbnails.', 'Recruiter attention duration and overall traffic analytics.', 'The alphabetical order of project metadata titles.'], answer: 2 },
    { question: 'When writing an impactful case study for a graphic design project, what sequence of information is most effective?', options: ['Final mockups, financial invoice, client address.', 'Design problem statement, process/exploration phase, final results and outcomes.', 'Font list, software versions used, copyright warnings.', 'Initial mood boards, vector anchor counts, web server host details.'], answer: 1 },
    { question: 'How can interactive elements like QR codes enhance physical poster designs within contemporary exhibition spaces?', options: ['By physically changing the ink distribution on the poster sheet over time.', 'By bridging the physical poster to dynamic, digital augmented reality (AR) extensions on smartphones.', 'By locking the design layout so it cannot be copied by other exhibition visitors.', 'By lowering the required print resolution from 300 DPI to 72 DPI.'], answer: 1 }
  ],
  'ui-ux-design': [
    { question: 'Which research method is best suited for understanding the underlying motivations, thoughts, and feelings behind a user\'s behavior?', options: ['Quantitative surveys', 'A/B testing', 'Qualitative user interviews', 'Heatmap analytics'], answer: 2 },
    { question: 'What type of research is conducted at the very beginning of a project to discover user problems and identify new product opportunities?', options: ['Evaluative research', 'Generative research', 'Summative research', 'Usability verification'], answer: 1 },
    { question: 'To remain valid and effective, what must user personas always be built upon?', options: ['Stakeholder assumptions', 'Competitor features', 'Real user research data', 'Marketing demographic templates'], answer: 2 },
    { question: 'In Agile product management, what is the standard framework layout for a user story?', options: ['When [situation], I want to [motivation], so I can [outcome].', 'As a [user], I want [goal], so that [benefit].', 'If [action], then [system response], because [value].', 'Given [context], when [event], then [result].'], answer: 1 },
    { question: 'What is the primary purpose of creating low-fidelity wireframes during the layout design process?', options: ['Establishing final brand color schemes', 'Defining exact font kerning and type scales', 'Mapping layout structures and spatial hierarchy quickly', 'Delivering final visual assets to developers'], answer: 2 },
    { question: 'Which core user experience principle focuses on reducing a layout\'s cognitive load so navigation feels completely intuitive?', options: ['Hick\'s Law', 'Don\'t Make Me Think', 'Aesthetic-Usability Effect', 'Fitts\'s Law'], answer: 1 },
    { question: 'What is the primary functional difference between a basic group and a Frame in Figma?', options: ['Frames cannot contain shape elements', 'Groups support independent resizing constraints and layout grids', 'Frames act as independent viewports with layout, clipping, and auto layout properties', 'Groups automatically push global changes to identical instances'], answer: 2 },
    { question: 'Which feature in Figma allows layouts to dynamically adjust padding, spacing, and alignment when content changes?', options: ['Smart Animate', 'Auto Layout', 'Constraints Mapping', 'Component Stacking'], answer: 1 },
    { question: 'Which Figma prototyping engine tool interpolates differences in matching layer names across frames to generate fluid animations?', options: ['Instant Transition', 'Dissolve', 'Smart Animate', 'Move In'], answer: 2 },
    { question: 'What term describes subtle, functional animations that provide feedback for a single specific user action, such as a switch toggling on?', options: ['Macro-interactions', 'Structural motion', 'Micro-interactions', 'Dynamic keyframing'], answer: 2 },
    { question: 'According to the WCAG 2.2 guidelines, what is the minimum required contrast ratio for normal text on a digital interface to achieve AA compliance?', options: ['3:1', '4.5:1', '7:1', '21:1'], answer: 1 },
    { question: 'What do the four foundation principles of accessibility under the POUR acronym stand for?', options: ['Purposeful, Organized, Useful, Reliable', 'Perceivable, Operable, Understandable, Robust', 'Practical, Optimized, Usable, Responsive', 'Precise, Objective, Universal, Readable'], answer: 1 },
    { question: 'Which usability testing framework asks participants to vocalize their thoughts, frustrations, and thought processes live while executing tasks?', options: ['System Usability Scale', 'Silent Observation Method', 'Think-Aloud Protocol', 'Retrospective De-briefing'], answer: 2 },
    { question: 'What standard metric utilizes a 10-item questionnaire administered post-testing to calculate a global usability score from 0 to 100?', options: ['Net Promoter Score (NPS)', 'System Usability Scale (SUS)', 'Customer Effort Score (CES)', 'Task Success Rate (TSR)'], answer: 1 },
    { question: 'In Brad Frost\'s Atomic Design methodology, what represents the absolute smallest foundational visual building blocks, such as form labels or buttons?', options: ['Organisms', 'Molecules', 'Atoms', 'Tokens'], answer: 2 },
    { question: 'What are design tokens inside a highly scalable enterprise design system?', options: ['Security badges for developer access', 'Named variables used to store value constants like colors, fonts, and spacing values', 'Dynamic illustration libraries', 'Gamified elements that reward active platform users'], answer: 1 },
    { question: 'What is the main purpose of the developer handoff documentation process in UI design?', options: ['Rewriting the entire application codebase for production', 'Packaging final specs, interaction states, assets, and design tokens for engineering teams', 'Presenting conceptual sketches to the marketing department', 'Initiating user recruiting screens for the next product feature'], answer: 1 },
    { question: 'What format is best suited for exporting high-fidelity visual icons to ensure they scale infinitely without losing crisp sharpness on pixel screens?', options: ['JPEG', 'PNG', 'GIF', 'SVG'], answer: 3 },
    { question: 'What is the correct sequence of phases inside a traditional 5-day Google Design Sprint process?', options: ['Sketch, Build, Test, Deploy, Review', 'Understand, Sketch, Decide, Prototype, Test', 'Research, Wireframe, Paint, Code, Launch', 'Ideate, Critique, Validate, Deliver, Support'], answer: 1 },
    { question: 'During which specific day of a standard Google Design Sprint does the team convert their sketched concept paths into a structured storyboard?', options: ['Day 1: Understand', 'Day 2: Sketch', 'Day 3: Decide', 'Day 4: Prototype'], answer: 2 }
  ]
};
