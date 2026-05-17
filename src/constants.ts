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
    description: 'Create cross-platform mobile applications for iOS and Android.'
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
    description: 'Design and build immersive games with professional tools and game theory.'
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
    description: 'Unlock your creativity and master visual communication through graphic design.'
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
    description: 'Design user-centric interfaces and seamless user experiences.'
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
    { question: 'Which language is React Native primarily written in?', options: ['Java', 'Swift', 'JavaScript', 'C++'], answer: 2 },
    { question: 'What is the main component for displaying text in React Native?', options: ['<Label>', '<Text>', '<P>', '<String>'], answer: 1 },
    { question: 'How do you layout elements in React Native?', options: ['CSS Grid', 'Float', 'Flexbox', 'Tables'], answer: 2 },
    { question: 'What is "props" short for in React?', options: ['Properies', 'Proposals', 'Properties', 'Pros'], answer: 2 },
    { question: 'Which hook is used for side effects?', options: ['useState', 'useContext', 'useEffect', 'useMemo'], answer: 2 },
    { question: 'What command starts a React Native project?', options: ['npx react-native init', 'npm start mobile', 'react-init', 'expo start'], answer: 0 },
    { question: 'Which component is used for scrollable lists?', options: ['<ScrollView>', '<ListView>', '<FlatList>', '<List>'], answer: 2 },
    { question: 'How do you handle touch events?', options: ['onClick', 'onPress', 'onTouch', 'handleTap'], answer: 1 },
    { question: 'What is the purpose of "AsyncStorage"?', options: ['Cloud storage', 'Local persistent storage', 'Temporary cache', 'Database connection'], answer: 1 },
    { question: 'What does "expo" provide?', options: ['A browser', 'A development toolset', 'A server', 'A code editor'], answer: 1 }
  ],
  'game-design': [
    { question: 'What is the primary language used in Unity?', options: ['Python', 'C++', 'C#', 'Java'], answer: 2 },
    { question: 'What does "FPS" stand for in gaming?', options: ['Fast Processing Speed', 'Frames Per Second', 'First Person Script', 'File Path System'], answer: 1 },
    { question: 'Which component handles physics in Unity?', options: ['Rigidbody', 'Collider', 'PhysicsBody', 'Weight'], answer: 0 },
    { question: 'What is a "Sprite" in 2D games?', options: ['A drink', 'A 2D graphic object', 'A script', 'A game level'], answer: 1 },
    { question: 'What is "Game Loop" responsible for?', options: ['Saving games', 'Updating game state and rendering', 'Loading screen', 'Multiplayer connection'], answer: 1 },
    { question: 'What is "Collision Detection"?', options: ['Finding game updates', 'Detecting when two objects touch', 'Handling input', 'Loading assets'], answer: 1 },
    { question: 'What does "AI" in games usually refer to?', options: ['Actual Intelligence', 'Artificial Intelligence', 'Asset Instruction', 'Applied Interface'], answer: 1 },
    { question: 'What is "Shading"?', options: ['Making game harder', 'Calculating color of pixels', 'Hiding code', 'Drawing shapes'], answer: 1 },
    { question: 'Which tool is famous for 3D modeling?', options: ['Photoshop', 'Blender', 'Word', 'Excel'], answer: 1 },
    { question: 'What is "Prefab" in Unity?', options: ['Pre-fabricated building', 'A reusable game object template', 'A type of code', 'A sound file'], answer: 1 }
  ],
  'graphics-design': [
    { question: 'Which color mode is used for print?', options: ['RGB', 'CMYK', 'HSB', 'HEX'], answer: 1 },
    { question: 'What tool creates vector graphics?', options: ['Photoshop', 'MS Paint', 'Illustrator', 'Lightroom'], answer: 2 },
    { question: 'What is "Kerning"?', options: ['Space between lines', 'Space between specific characters', 'Text alignment', 'Font size'], answer: 1 },
    { question: 'Which format is best for logos to be resized?', options: ['JPG', 'PNG', 'SVG', 'GIF'], answer: 2 },
    { question: 'What is a "Gradient"?', options: ['A type of font', 'A smooth transition between colors', 'A grid system', 'A border style'], answer: 1 },
    { question: 'What does "DPI" stand for?', options: ['Dots Per Inch', 'Digital Point Index', 'Display Pixel Intensity', 'Data Per Image'], answer: 0 },
    { question: 'What is "Sans-serif"?', options: ['Font with small feet', 'Font without small feet', 'Bold font', 'Italic font'], answer: 1 },
    { question: 'What is "Opacity"?', options: ['Brightness', 'Transparency level', 'Contrast', 'Hue'], answer: 1 },
    { question: 'Which tool is best for photo editing?', options: ['Illustrator', 'Photoshop', 'InDesign', 'Flash'], answer: 1 },
    { question: 'What is "White Space"?', options: ['Space for text', 'Empty space to give layout room', 'Background color', 'Margin'], answer: 1 }
  ],
  'ui-ux-design': [
    { question: 'What does "UX" stand for?', options: ['User Example', 'User Experience', 'User Extension', 'User Exchange'], answer: 1 },
    { question: 'What is a "Wireframe"?', options: ['A low-fidelity visual guide', 'A final design screen', 'A type of code', 'A research paper'], answer: 0 },
    { question: 'Which tool is most popular for UI design today?', options: ['Photoshop', 'Figma', 'Word', 'Dreamweaver'], answer: 1 },
    { question: 'What is "A/B Testing"?', options: ['Alphabetical testing', 'Comparing two versions of a design', 'Testing on mobile and web', 'Testing with two people'], answer: 1 },
    { question: 'What is a "User Persona"?', options: ['A real person', 'A fictional character representing a user type', 'A design tool', 'An API'], answer: 1 },
    { question: 'What is "Accessibility"?', options: ['Speed of the app', 'Design for people with disabilities', 'Internet connection', 'Login ease'], answer: 1 },
    { question: 'What is "Hierarchy" in UI?', options: ['Order of developers', 'Arrangement of elements to show importance', 'File structure', 'Database tables'], answer: 1 },
    { question: 'What is a "Design System"?', options: ['A collection of reusable components', 'A way to code', 'A marketing plan', 'A hardware setup'], answer: 0 },
    { question: 'What is "Prototyping"?', options: ['Final coding', 'Creating interactive versions of design', 'Researching users', 'Drawing icons'], answer: 1 },
    { question: 'What is the "Golden Ratio" used for?', options: ['Math only', 'Aesthetics and balance in design', 'Pricing', 'Coding speed'], answer: 1 }
  ]
};
