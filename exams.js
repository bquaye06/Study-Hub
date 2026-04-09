(function () {
  const examMount = document.getElementById('examBank');
  const examSearch = document.getElementById('examSearch');
  const examSectionFilter = document.getElementById('examSectionFilter');
  const examClearFilters = document.getElementById('examClearFilters');
  const examCount = document.getElementById('examCount');
  const examRevisedCount = document.getElementById('examRevisedCount');
  const examNoResults = document.getElementById('examNoResults');
  const examMockCount = document.getElementById('examMockCount');
  const examMockMinutes = document.getElementById('examMockMinutes');
  const examMockStart = document.getElementById('examMockStart');
  const examMockSubmit = document.getElementById('examMockSubmit');
  const examMockSave = document.getElementById('examMockSave');
  const examMockReset = document.getElementById('examMockReset');
  const examMockStatus = document.getElementById('examMockStatus');
  const examMockTimer = document.getElementById('examMockTimer');
  const examMockNote = document.getElementById('examMockNote');
  const examMockBank = document.getElementById('examMockBank');
  const examBestScoreLine = document.getElementById('examBestScoreLine');
  const examHistory = document.getElementById('examHistory');

  if (!examMount) {
    return;
  }

  const REVISED_KEY = 'ce274-exam-revised';
  const EXAM_HISTORY_KEY = 'ce274-exam-history';

  const SECTION_DEFS = [
    { id: 'exam-pdf-objectives', title: 'PDF Objectives' },
    { id: 'exam-pdf-short', title: 'PDF Short Answers' },
    { id: 'exam-pdf-true-false', title: 'PDF True/False' },
    { id: 'exam-practice-basics', title: 'Practice Basics' },
    { id: 'exam-practice-arithmetic', title: 'Practice Arithmetic' },
    { id: 'exam-practice-control', title: 'Practice Control Flow' },
    { id: 'exam-practice-strings', title: 'Practice Strings' },
    { id: 'exam-practice-arrays', title: 'Practice Arrays & Collections' },
    { id: 'exam-practice-oop', title: 'Practice OOP' },
    { id: 'exam-practice-exceptions', title: 'Practice Exceptions' },
    { id: 'exam-practice-methods', title: 'Practice Methods' }
  ];

  function isPlainObject(value) {
    return Object.prototype.toString.call(value) === '[object Object]';
  }

  function stableStringify(value) {
    if (Array.isArray(value)) {
      return `[${value.map((item) => stableStringify(item)).join(',')}]`;
    }
    if (isPlainObject(value)) {
      const keys = Object.keys(value).sort();
      const entries = keys.map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`);
      return `{${entries.join(',')}}`;
    }
    return JSON.stringify(value);
  }

  function areEquivalent(actual, expected) {
    if (typeof actual === 'number' && typeof expected === 'number') {
      return Number.isFinite(actual) && Number.isFinite(expected) && Math.abs(actual - expected) < 1e-9;
    }

    if (typeof actual === 'string' && typeof expected === 'string') {
      return actual.trim().toLowerCase() === expected.trim().toLowerCase();
    }

    if (Array.isArray(actual) || Array.isArray(expected) || isPlainObject(actual) || isPlainObject(expected)) {
      return stableStringify(actual) === stableStringify(expected);
    }

    return actual === expected;
  }

  const PDF_EXAM_ITEMS = [
    { sectionId: 'exam-pdf-objectives', q: 'What is the main method signature in Java?', a: 'public static void main(String[] args)' },
    { sectionId: 'exam-pdf-objectives', q: 'What is the output of a program that prints Hello, World!', a: 'Hello, World!' },
    { sectionId: 'exam-pdf-objectives', q: 'Choose the correct variable declaration in Java.', a: 'All of the listed declarations are valid in the question.' },
    { sectionId: 'exam-pdf-objectives', q: 'Which data type can store decimal values?', a: 'double' },
    { sectionId: 'exam-pdf-objectives', q: 'What is the default value of an uninitialized int variable?', a: '0' },
    { sectionId: 'exam-pdf-objectives', q: 'What is the output of System.out.println(5 + "5")?', a: '55' },
    { sectionId: 'exam-pdf-objectives', q: 'Which of the following is NOT a Java keyword?', a: 'define' },
    { sectionId: 'exam-pdf-objectives', q: 'Which tool is used to take input from the user in Java?', a: 'Scanner' },
    { sectionId: 'exam-pdf-objectives', q: 'Which loop is best suited for a known number of repetitions?', a: 'for loop' },
    { sectionId: 'exam-pdf-objectives', q: 'What is the output of integer division 5 / 2?', a: '2' },
    { sectionId: 'exam-pdf-objectives', q: 'What is the correct way to declare an array in Java?', a: 'int[] arr = new int[5];' },
    { sectionId: 'exam-pdf-objectives', q: 'Which is a valid if condition in Java?', a: 'if (x == 5)' },
    { sectionId: 'exam-pdf-objectives', q: 'How do you create a constant variable in Java?', a: 'final int x = 10;' },
    { sectionId: 'exam-pdf-objectives', q: 'What is the correct way to write a comment in Java?', a: 'Use // for single-line comments and /* ... */ for block comments.' },
    { sectionId: 'exam-pdf-objectives', q: 'What will System.out.println(3 == 3.0) output?', a: 'true' },
    { sectionId: 'exam-pdf-objectives', q: 'Which OOP principles are used in Java?', a: 'Encapsulation, Inheritance, Polymorphism, and Abstraction' },
    { sectionId: 'exam-pdf-objectives', q: 'Which access modifier makes a variable accessible only within the same class?', a: 'private' },
    { sectionId: 'exam-pdf-objectives', q: 'Which method converts a String to an int?', a: 'Integer.parseInt()' },
    { sectionId: 'exam-pdf-objectives', q: 'What is the output of 10 % 3?', a: '1' },
    { sectionId: 'exam-pdf-objectives', q: 'Which statement correctly creates an instance of a class?', a: 'ClassName obj = new ClassName();' },
    { sectionId: 'exam-pdf-objectives', q: 'How can a method return multiple values in Java?', a: 'Using an array, object, List, or Map' },
    { sectionId: 'exam-pdf-objectives', q: 'What happens if break is omitted in a switch statement?', a: 'Fall-through occurs' },
    { sectionId: 'exam-pdf-objectives', q: 'What will be the output of Math.max(10, 20)?', a: '20' },
    { sectionId: 'exam-pdf-objectives', q: 'How do you define a constructor in Java?', a: 'Same name as the class and no return type' },
    { sectionId: 'exam-pdf-objectives', q: 'What is the default value of a boolean variable?', a: 'false' },
    { sectionId: 'exam-pdf-objectives', q: 'Which keyword is used to inherit a class?', a: 'extends' },
    { sectionId: 'exam-pdf-objectives', q: 'What is the return type of main()? ', a: 'void' },
    { sectionId: 'exam-pdf-objectives', q: 'How do you compare two strings in Java?', a: 'Use equals() or compareTo()' },
    { sectionId: 'exam-pdf-objectives', q: 'What does the ternary expression 5 > 3 ? "Yes" : "No" print?', a: 'Yes' },
    { sectionId: 'exam-pdf-objectives', q: 'Which statement about Java is true?', a: 'Java is platform-independent' },
    { sectionId: 'exam-pdf-objectives', q: 'Which is a correct char declaration?', a: "char ch = 'A';" },
    { sectionId: 'exam-pdf-objectives', q: 'What will x += 5 do when x is 10?', a: 'Set x to 15' },
    { sectionId: 'exam-pdf-objectives', q: 'Which of these correctly defines a method in Java?', a: 'public void myMethod() {}' },
    { sectionId: 'exam-pdf-objectives', q: 'Which of the following is NOT a primitive data type?', a: 'String' },
    { sectionId: 'exam-pdf-objectives', q: 'What will System.out.println(10 == 10.0) output?', a: 'true' },
    { sectionId: 'exam-pdf-objectives', q: 'Which keyword is used to create an interface?', a: 'interface' },
    { sectionId: 'exam-pdf-objectives', q: 'What happens if you divide an integer by zero?', a: 'Runtime exception' },
    { sectionId: 'exam-pdf-objectives', q: 'Which operator compares two values in Java?', a: '==' },
    { sectionId: 'exam-pdf-objectives', q: 'Given i = 1, what are i and j after int j = --i?', a: 'i = 0 and j = 0' },
    { sectionId: 'exam-pdf-objectives', q: 'What will System.out.println(s1 == s2) print for two separate but equal Strings?', a: 'false' },

    { sectionId: 'exam-pdf-short', q: 'Rewrite the code to assign the maximum value to maxValue using Math.max.', a: 'int maxValue = Math.max(20, Math.max(15, 50));' },
    { sectionId: 'exam-pdf-short', q: 'Write Java code to find the intersection of sets A and B and store it in B.', a: 'B.retainAll(A);' },
    { sectionId: 'exam-pdf-short', q: 'Write Java code that subtracts set B from set A.', a: 'A.removeAll(B);' },
    { sectionId: 'exam-pdf-short', q: 'Write Java code that finds the union of set A and set B.', a: 'A.addAll(B);' },
    { sectionId: 'exam-pdf-short', q: 'The finally block in exception handling only executes when the exception occurs. True or false?', a: 'False' },
    { sectionId: 'exam-pdf-short', q: 'Given int x = 89, what is the output of the first boolean expression in Section B?', a: 'false' },
    { sectionId: 'exam-pdf-short', q: 'Given int x = 89, what is the output of the second boolean expression in Section B?', a: 'true' },
    { sectionId: 'exam-pdf-short', q: 'Fill in the blank: the ______ block contains statements that may cause an exception.', a: 'try' },
    { sectionId: 'exam-pdf-short', q: 'Explain the difference between while and do-while loops.', a: 'while checks the condition before the loop body; do-while executes the body first and checks afterward.' },
    { sectionId: 'exam-pdf-short', q: 'Explain the difference between a single-dimensional array and an ArrayList.', a: 'An array has a fixed size; an ArrayList grows and shrinks dynamically.' },

    { sectionId: 'exam-pdf-true-false', q: 'True or False: The Java main method return type is void.', a: 'true' },
    { sectionId: 'exam-pdf-true-false', q: 'True or False: Java is platform-independent because compiled bytecode runs on the JVM.', a: 'true' },
    { sectionId: 'exam-pdf-true-false', q: 'True or False: String is a primitive data type in Java.', a: 'false' },
    { sectionId: 'exam-pdf-true-false', q: 'True or False: The default value of an uninitialized boolean variable is false.', a: 'true' },
    { sectionId: 'exam-pdf-true-false', q: 'True or False: Integer division 5 / 2 produces 2.5 in Java.', a: 'false' },
    { sectionId: 'exam-pdf-true-false', q: 'True or False: The finally block executes only when an exception is thrown.', a: 'false' },
    { sectionId: 'exam-pdf-true-false', q: 'True or False: The keyword extends is used for class inheritance in Java.', a: 'true' },
    { sectionId: 'exam-pdf-true-false', q: 'True or False: Omitting break in a switch case can cause fall-through.', a: 'true' },
    { sectionId: 'exam-pdf-true-false', q: 'True or False: Scanner is commonly used to read user input in Java.', a: 'true' },
    { sectionId: 'exam-pdf-true-false', q: 'True or False: Comparing two strings with == always checks content equality in Java.', a: 'false' },
    { sectionId: 'exam-pdf-true-false', q: 'True or False: The remainder of 10 % 3 is 1.', a: 'true' },
    { sectionId: 'exam-pdf-true-false', q: 'True or False: Dividing an int by zero throws a runtime exception in Java.', a: 'true' }
  ];

  function makeBasicsPractice() {
    const classNames = ['Box', 'Student', 'Course', 'Result', 'Printer'];
    const variableNames = ['value', 'score', 'count', 'flag', 'name'];
    const items = [];
    for (let i = 0; i < 30; i += 1) {
      const group = i % 10;
      const className = classNames[i % classNames.length];
      const variableName = variableNames[i % variableNames.length];
      switch (group) {
        case 0:
          items.push({ sectionId: 'exam-practice-basics', q: `Which keyword begins the definition of class ${className}?`, a: 'class' });
          break;
        case 1:
          items.push({ sectionId: 'exam-practice-basics', q: `Which keyword creates a new object of ${className}?`, a: 'new' });
          break;
        case 2:
          items.push({ sectionId: 'exam-practice-basics', q: `Which keyword makes ${variableName} a constant?`, a: 'final' });
          break;
        case 3:
          items.push({ sectionId: 'exam-practice-basics', q: `Which access modifier keeps ${variableName} visible only inside one class?`, a: 'private' });
          break;
        case 4:
          items.push({ sectionId: 'exam-practice-basics', q: `Which keyword lets one class inherit from another?`, a: 'extends' });
          break;
        case 5:
          items.push({ sectionId: 'exam-practice-basics', q: `Which keyword is used to implement an interface?`, a: 'implements' });
          break;
        case 6:
          items.push({ sectionId: 'exam-practice-basics', q: `Which data type stores only true or false?`, a: 'boolean' });
          break;
        case 7:
          items.push({ sectionId: 'exam-practice-basics', q: `Which data type stores a single character?`, a: 'char' });
          break;
        case 8:
          items.push({ sectionId: 'exam-practice-basics', q: `Which package is commonly imported to use Scanner?`, a: 'java.util' });
          break;
        default:
          items.push({ sectionId: 'exam-practice-basics', q: `What is the required entry-point method for a Java program?`, a: 'public static void main(String[] args)' });
          break;
      }
    }
    return items;
  }

  function makeArithmeticPractice() {
    const pairs = [
      [3, 4], [8, 2], [9, 5], [12, 3], [7, 7], [15, 6], [20, 4], [11, 2], [18, 9], [14, 7]
    ];
    const items = [];
    for (let i = 0; i < 30; i += 1) {
      const [a, b] = pairs[i % pairs.length];
      switch (i % 10) {
        case 0:
          items.push({ sectionId: 'exam-practice-arithmetic', q: `What is the output of ${a} + ${b}?`, a: String(a + b) });
          break;
        case 1:
          items.push({ sectionId: 'exam-practice-arithmetic', q: `What is the output of ${a} - ${b}?`, a: String(a - b) });
          break;
        case 2:
          items.push({ sectionId: 'exam-practice-arithmetic', q: `What is the output of ${a} * ${b}?`, a: String(a * b) });
          break;
        case 3:
          items.push({ sectionId: 'exam-practice-arithmetic', q: `What is the output of integer division ${a} / ${b}?`, a: String(Math.trunc(a / b)) });
          break;
        case 4:
          items.push({ sectionId: 'exam-practice-arithmetic', q: `What is the output of ${a} % ${b}?`, a: String(a % b) });
          break;
        case 5:
          items.push({ sectionId: 'exam-practice-arithmetic', q: `What is the output of System.out.println("CE" + ${a})?`, a: `CE${a}` });
          break;
        case 6:
          items.push({ sectionId: 'exam-practice-arithmetic', q: `What is the output of ${a} > ${b}?`, a: String(a > b) });
          break;
        case 7:
          items.push({ sectionId: 'exam-practice-arithmetic', q: `What is the output of Math.max(${a}, ${b})?`, a: String(Math.max(a, b)) });
          break;
        case 8:
          items.push({ sectionId: 'exam-practice-arithmetic', q: `If x = ${a}, what is the value of ++x?`, a: String(a + 1) });
          break;
        default:
          items.push({ sectionId: 'exam-practice-arithmetic', q: `What does the ternary expression ${a} > ${b} ? "A" : "B" return?`, a: a > b ? 'A' : 'B' });
          break;
      }
    }
    return items;
  }

  function makeControlPractice() {
    const values = [2, 5, 8, 11, 14, 17, 20, 23, 26, 29];
    const items = [];
    for (let i = 0; i < 30; i += 1) {
      const x = values[i % values.length];
      switch (i % 10) {
        case 0:
          items.push({ sectionId: 'exam-practice-control', q: 'Which loop should you use when the number of repetitions is known in advance?', a: 'for loop' });
          break;
        case 1:
          items.push({ sectionId: 'exam-practice-control', q: `If x = ${x}, what is the result of x > 10 ?`, a: String(x > 10) });
          break;
        case 2:
          items.push({ sectionId: 'exam-practice-control', q: 'Which selection structure is best when one variable can take many discrete values?', a: 'switch' });
          break;
        case 3:
          items.push({ sectionId: 'exam-practice-control', q: 'Which loop executes its body at least once?', a: 'do-while' });
          break;
        case 4:
          items.push({ sectionId: 'exam-practice-control', q: 'What does break do inside a loop?', a: 'It exits the nearest loop immediately.' });
          break;
        case 5:
          items.push({ sectionId: 'exam-practice-control', q: 'What does continue do inside a loop?', a: 'It skips the current iteration and moves to the next one.' });
          break;
        case 6:
          items.push({ sectionId: 'exam-practice-control', q: `What is the output of ${x} % 2 == 0?`, a: String(x % 2 === 0) });
          break;
        case 7:
          items.push({ sectionId: 'exam-practice-control', q: 'What kind of loop is appropriate for reading input until a sentinel value is entered?', a: 'sentinel-controlled loop' });
          break;
        case 8:
          items.push({ sectionId: 'exam-practice-control', q: `If x = ${x}, what is the output of the ternary x > 10 ? "big" : "small"?`, a: x > 10 ? 'big' : 'small' });
          break;
        default:
          items.push({ sectionId: 'exam-practice-control', q: 'What is the difference between while and do-while?', a: 'while checks the condition first; do-while checks after running the loop body.' });
          break;
      }
    }
    return items;
  }

  function makeStringsPractice() {
    const names = ['Java', 'Python', 'Binary', 'Campus', 'Student', 'Lecture', 'Course', 'Object', 'String', 'Array'];
    const items = [];
    for (let i = 0; i < 30; i += 1) {
      const word = names[i % names.length];
      switch (i % 10) {
        case 0:
          items.push({ sectionId: 'exam-practice-strings', q: `Which method checks whether two String values have the same content?`, a: 'equals()' });
          break;
        case 1:
          items.push({ sectionId: 'exam-practice-strings', q: `What is the output of System.out.println("${word}" + 2025)?`, a: `${word}2025` });
          break;
        case 2:
          items.push({ sectionId: 'exam-practice-strings', q: `What is the result of "${word}".substring(1, 3)?`, a: word.substring(1, 3) });
          break;
        case 3:
          items.push({ sectionId: 'exam-practice-strings', q: `What is the length of the String "${word}"?`, a: String(word.length) });
          break;
        case 4:
          items.push({ sectionId: 'exam-practice-strings', q: `What is the character at index 0 in "${word}"?`, a: word[0] });
          break;
        case 5:
          items.push({ sectionId: 'exam-practice-strings', q: `How do you convert the String "123" to an int?`, a: 'Integer.parseInt("123")' });
          break;
        case 6:
          items.push({ sectionId: 'exam-practice-strings', q: `What does "${word}".toUpperCase() return?`, a: word.toUpperCase() });
          break;
        case 7:
          items.push({ sectionId: 'exam-practice-strings', q: `What is the result of "${word}".indexOf("${word[0]}")?`, a: '0' });
          break;
        case 8:
          items.push({ sectionId: 'exam-practice-strings', q: `Which method ignores case when comparing Strings?`, a: 'equalsIgnoreCase()' });
          break;
        default:
          items.push({ sectionId: 'exam-practice-strings', q: `What is the difference between a char and a String?`, a: 'char stores one character; String stores a sequence of characters.' });
          break;
      }
    }
    return items;
  }

  function makeCollectionsPractice() {
    const sizes = [3, 5, 7, 9, 11, 13, 15, 17, 19, 21];
    const items = [];
    for (let i = 0; i < 30; i += 1) {
      const n = sizes[i % sizes.length];
      switch (i % 10) {
        case 0:
          items.push({ sectionId: 'exam-practice-arrays', q: `How do you declare an int array with ${n} elements?`, a: `int[] arr = new int[${n}];` });
          break;
        case 1:
          items.push({ sectionId: 'exam-practice-arrays', q: 'What is the main difference between an array and an ArrayList?', a: 'Arrays have fixed size; ArrayLists can grow and shrink dynamically.' });
          break;
        case 2:
          items.push({ sectionId: 'exam-practice-arrays', q: 'Which collection is best when duplicate values must not be stored?', a: 'Set' });
          break;
        case 3:
          items.push({ sectionId: 'exam-practice-arrays', q: 'Which collection stores key-value pairs?', a: 'HashMap' });
          break;
        case 4:
          items.push({ sectionId: 'exam-practice-arrays', q: `How many elements are in a ${n} x 2 two-dimensional array?`, a: String(n * 2) });
          break;
        case 5:
          items.push({ sectionId: 'exam-practice-arrays', q: 'What method adds an element to an ArrayList?', a: 'add()' });
          break;
        case 6:
          items.push({ sectionId: 'exam-practice-arrays', q: 'What method removes all matching elements from a Set or Collection?', a: 'removeAll()' });
          break;
        case 7:
          items.push({ sectionId: 'exam-practice-arrays', q: 'What method keeps only the common elements between two collections?', a: 'retainAll()' });
          break;
        case 8:
          items.push({ sectionId: 'exam-practice-arrays', q: 'How do you access the first element of an array?', a: 'arr[0]' });
          break;
        default:
          items.push({ sectionId: 'exam-practice-arrays', q: 'Which loop is commonly used to traverse an array?', a: 'for loop' });
          break;
      }
    }
    return items;
  }

  function makeOopPractice() {
    const classNames = ['Box', 'Student', 'Course', 'Result', 'Shape', 'BankAccount', 'Vehicle', 'Product', 'Car', 'Book'];
    const items = [];
    for (let i = 0; i < 30; i += 1) {
      const className = classNames[i % classNames.length];
      switch (i % 10) {
        case 0:
          items.push({ sectionId: 'exam-practice-oop', q: `What is a class in Java?`, a: 'A blueprint for creating objects.' });
          break;
        case 1:
          items.push({ sectionId: 'exam-practice-oop', q: `What is an object created from class ${className}?`, a: 'An instance of that class.' });
          break;
        case 2:
          items.push({ sectionId: 'exam-practice-oop', q: `What is the purpose of a constructor in class ${className}?`, a: 'To initialize object state when an object is created.' });
          break;
        case 3:
          items.push({ sectionId: 'exam-practice-oop', q: 'What does this refer to?', a: 'The current object instance.' });
          break;
        case 4:
          items.push({ sectionId: 'exam-practice-oop', q: 'What keyword makes a member belong to the class instead of an object?', a: 'static' });
          break;
        case 5:
          items.push({ sectionId: 'exam-practice-oop', q: 'What is encapsulation?', a: 'Hiding data fields and exposing controlled access through methods.' });
          break;
        case 6:
          items.push({ sectionId: 'exam-practice-oop', q: 'What keyword is used to call a superclass constructor?', a: 'super' });
          break;
        case 7:
          items.push({ sectionId: 'exam-practice-oop', q: 'What is method overloading?', a: 'Using the same method name with different parameter lists.' });
          break;
        case 8:
          items.push({ sectionId: 'exam-practice-oop', q: 'What access modifier makes a field visible only within the class?', a: 'private' });
          break;
        default:
          items.push({ sectionId: 'exam-practice-oop', q: `Which keyword is used to inherit class ${className} from another class?`, a: 'extends' });
          break;
      }
    }
    return items;
  }

  function makeExceptionsPractice() {
    const values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const items = [];
    for (let i = 0; i < 30; i += 1) {
      const n = values[i % values.length];
      switch (i % 10) {
        case 0:
          items.push({ sectionId: 'exam-practice-exceptions', q: 'Why do programmers use exception handling?', a: 'To handle runtime problems gracefully and keep the program stable.' });
          break;
        case 1:
          items.push({ sectionId: 'exam-practice-exceptions', q: 'Which block contains code that may throw an exception?', a: 'try' });
          break;
        case 2:
          items.push({ sectionId: 'exam-practice-exceptions', q: 'Which block executes whether an exception occurs or not?', a: 'finally' });
          break;
        case 3:
          items.push({ sectionId: 'exam-practice-exceptions', q: 'What exception often occurs when Scanner receives the wrong input type?', a: 'InputMismatchException' });
          break;
        case 4:
          items.push({ sectionId: 'exam-practice-exceptions', q: `What happens when you divide ${n} by zero in Java?`, a: 'A runtime exception occurs.' });
          break;
        case 5:
          items.push({ sectionId: 'exam-practice-exceptions', q: 'Which class represents file and directory paths?', a: 'File' });
          break;
        case 6:
          items.push({ sectionId: 'exam-practice-exceptions', q: 'Which class is commonly used to write text to a file?', a: 'PrintWriter' });
          break;
        case 7:
          items.push({ sectionId: 'exam-practice-exceptions', q: 'What does a catch block do?', a: 'It handles a thrown exception.' });
          break;
        case 8:
          items.push({ sectionId: 'exam-practice-exceptions', q: 'What keyword can be used to declare that a method may throw an exception?', a: 'throws' });
          break;
        default:
          items.push({ sectionId: 'exam-practice-exceptions', q: 'What is the purpose of allowing a user to re-enter a value after an exception?', a: 'To make the program more robust and user-friendly.' });
          break;
      }
    }
    return items;
  }

  function makeMethodsPractice() {
    const values = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    const items = [];
    for (let i = 0; i < 30; i += 1) {
      const n = values[i % values.length];
      switch (i % 10) {
        case 0:
          items.push({ sectionId: 'exam-practice-methods', q: 'What is a method in Java?', a: 'A reusable block of code that performs a task.' });
          break;
        case 1:
          items.push({ sectionId: 'exam-practice-methods', q: 'What does a void method return?', a: 'It returns no value.' });
          break;
        case 2:
          items.push({ sectionId: 'exam-practice-methods', q: `What is the output of Math.max(${n}, ${n + 5})?`, a: String(Math.max(n, n + 5)) });
          break;
        case 3:
          items.push({ sectionId: 'exam-practice-methods', q: 'What is method overloading?', a: 'Using the same method name with different parameter lists.' });
          break;
        case 4:
          items.push({ sectionId: 'exam-practice-methods', q: 'Can a method return multiple values directly in Java?', a: 'No, but it can return an array, object, List, or Map.' });
          break;
        case 5:
          items.push({ sectionId: 'exam-practice-methods', q: `What is the result of a range sum method that sums 1 to ${n}?`, a: String((n * (n + 1)) / 2) });
          break;
        case 6:
          items.push({ sectionId: 'exam-practice-methods', q: 'What is recursion?', a: 'A method calling itself.' });
          break;
        case 7:
          items.push({ sectionId: 'exam-practice-methods', q: 'What is the return type of the main method?', a: 'void' });
          break;
        case 8:
          items.push({ sectionId: 'exam-practice-methods', q: 'What does the parameter list of a method specify?', a: 'The data the method expects as input.' });
          break;
        default:
          items.push({ sectionId: 'exam-practice-methods', q: 'Why is method decomposition useful?', a: 'It reduces repetition and makes code easier to read and maintain.' });
          break;
      }
    }
    return items;
  }

  const PRACTICE_ITEMS = [
    ...makeBasicsPractice(),
    ...makeArithmeticPractice(),
    ...makeControlPractice(),
    ...makeStringsPractice(),
    ...makeCollectionsPractice(),
    ...makeOopPractice(),
    ...makeExceptionsPractice(),
    ...makeMethodsPractice()
  ];

  const MOCK_ITEM_POOL = [...PDF_EXAM_ITEMS];

  const allItems = [...PDF_EXAM_ITEMS, ...PRACTICE_ITEMS];
  const answerPool = Array.from(new Set(allItems.map((item) => item.a).filter(Boolean)));

  const revisedSet = loadRevisedState();
  let examHistoryItems = loadExamHistory();
  let currentMock = null;
  let mockTimerId = null;

  function loadRevisedState() {
    const raw = localStorage.getItem(REVISED_KEY);
    if (!raw) {
      return new Set();
    }

    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return new Set(parsed.map((value) => String(value)));
      }
    } catch {
      return new Set();
    }

    return new Set();
  }

  function saveRevisedState(set) {
    localStorage.setItem(REVISED_KEY, JSON.stringify(Array.from(set)));
  }

  function loadExamHistory() {
    const raw = localStorage.getItem(EXAM_HISTORY_KEY);
    if (!raw) {
      return [];
    }

    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch {
      return [];
    }

    return [];
  }

  function saveExamHistory() {
    localStorage.setItem(EXAM_HISTORY_KEY, JSON.stringify(examHistoryItems));
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  function formatAnswer(answer) {
    return escapeHtml(answer).replaceAll('\n', '<br>');
  }

  function formatSampleInput(inputObj) {
    return Object.entries(inputObj || {})
      .map(([key, value]) => `${key} = ${typeof value === 'string' ? `"${value}"` : JSON.stringify(value)}`)
      .join(', ');
  }

  function runSnippetInWorker(snippet, sampleInput, resultVar, timeoutMs = 1200) {
    const safeVar = String(resultVar || '').trim();
    if (!/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(safeVar)) {
      return Promise.resolve({ ok: false, error: 'Invalid result variable name.' });
    }

    const workerCode = `
      self.onmessage = function (event) {
        try {
          const data = event.data || {};
          const snippet = String(data.snippet || '');
          const sampleInput = data.sampleInput || {};
          const resultVar = String(data.resultVar || '').trim();
          const keys = Object.keys(sampleInput);
          const values = keys.map(function (k) { return sampleInput[k]; });
          const wrapped = '\"use strict\";\\n' + snippet + '\\n; if (typeof ' + resultVar + ' === \"undefined\") { throw new Error(\"Define result in variable: ' + resultVar + '\"); } return ' + resultVar + ';';
          const fn = new Function(...keys, wrapped);
          const result = fn(...values);
          self.postMessage({ ok: true, result: result });
        } catch (error) {
          self.postMessage({ ok: false, error: error && error.message ? error.message : String(error) });
        }
      };
    `;

    return new Promise((resolve) => {
      const blob = new Blob([workerCode], { type: 'application/javascript' });
      const url = URL.createObjectURL(blob);
      const worker = new Worker(url);
      let completed = false;

      const stop = (payload) => {
        if (completed) return;
        completed = true;
        worker.terminate();
        URL.revokeObjectURL(url);
        resolve(payload);
      };

      const timer = setTimeout(() => {
        stop({ ok: false, error: 'Execution timed out.' });
      }, timeoutMs);

      worker.onmessage = (event) => {
        clearTimeout(timer);
        stop(event.data || { ok: false, error: 'No result returned.' });
      };

      worker.onerror = (event) => {
        clearTimeout(timer);
        stop({ ok: false, error: event.message || 'Execution error.' });
      };

      worker.postMessage({ snippet, sampleInput, resultVar: safeVar });
    });
  }

  async function evaluateMockCodeQuestion(item, index) {
    if (!currentMock || item.type !== 'code') return false;

    const card = examMockBank?.querySelector(`.mock-item[data-item-index="${index}"]`);
    if (!card) return false;

    const input = card.querySelector('.mock-answer-field');
    const feedback = card.querySelector('.mock-feedback');
    const status = card.querySelector('.mock-feedback-status');
    const outputLine = card.querySelector('.mock-code-output');
    const snippet = input ? input.value : '';

    if (!snippet || !snippet.trim()) {
      currentMock.codeResults[index] = false;
      if (feedback) feedback.hidden = false;
      if (status) status.textContent = 'Wrong: no code submitted.';
      if (outputLine) outputLine.textContent = 'Output: not evaluated.';
      card.classList.remove('correct', 'wrong');
      card.classList.add('wrong');
      return false;
    }

    const execution = await runSnippetInWorker(snippet, item.sampleInput, item.resultVar);
    if (!execution || !execution.ok) {
      currentMock.codeResults[index] = false;
      if (feedback) feedback.hidden = false;
      if (status) status.textContent = `Wrong: ${execution && execution.error ? execution.error : 'Unable to run code.'}`;
      if (outputLine) outputLine.textContent = 'Output: not evaluated.';
      card.classList.remove('correct', 'wrong');
      card.classList.add('wrong');
      return false;
    }

    const passed = areEquivalent(execution.result, item.expected);
    currentMock.codeResults[index] = passed;

    if (feedback) feedback.hidden = false;
    if (status) {
      status.textContent = passed
        ? 'Correct'
        : `Wrong: expected ${JSON.stringify(item.expected)}, got ${JSON.stringify(execution.result)}.`;
    }
    if (outputLine) {
      outputLine.textContent = `Output: ${JSON.stringify(execution.result)}`;
    }

    card.classList.remove('correct', 'wrong');
    card.classList.add(passed ? 'correct' : 'wrong');
    return passed;
  }

  function isMockItemCorrect(item, index) {
    if (!currentMock) return false;
    if (item.type === 'code') {
      return currentMock.codeResults[index] === true;
    }
    return currentMock.selectedAnswers[index] === item.a;
  }

  function formatDate(timestamp) {
    return new Date(timestamp).toLocaleString();
  }

  function renderExamHistory() {
    if (!examBestScoreLine || !examHistory) return;

    if (examHistoryItems.length === 0) {
      examBestScoreLine.textContent = 'No past paper attempts yet.';
      examHistory.innerHTML = '<li class="tool-note">No past paper attempts yet.</li>';
      return;
    }

    const best = examHistoryItems.reduce((acc, item) => {
      if (!acc) return item;
      if (item.pct > acc.pct) return item;
      if (item.pct === acc.pct && item.score > acc.score) return item;
      return acc;
    }, null);

    examBestScoreLine.textContent = `${best.score}/${best.total} (${best.pct}%) on ${formatDate(best.timestamp)}.`;

    examHistory.innerHTML = examHistoryItems.slice(0, 10).map((item) => {
      return `<li>${item.score}/${item.total} (${item.pct}%) | ${formatDate(item.timestamp)}</li>`;
    }).join('');
  }

  function setMockStatus(message) {
    if (examMockStatus) {
      examMockStatus.textContent = message;
    }
  }

  function setMockTimerText(message) {
    if (examMockTimer) {
      examMockTimer.textContent = message;
    }
  }

  function clearMockTimer() {
    if (mockTimerId) {
      clearInterval(mockTimerId);
      mockTimerId = null;
    }
  }

  function shuffle(items) {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function normalizeTokenSet(text) {
    return new Set(
      String(text)
        .toLowerCase()
        .replace(/[^a-z0-9()_]+/g, ' ')
        .split(' ')
        .map((t) => t.trim())
        .filter((t) => t.length > 1)
    );
  }

  function pickKeywordDistractors(correctAnswer) {
    const keywordPool = [
      'public', 'private', 'protected', 'static', 'final', 'class', 'interface', 'extends', 'implements',
      'Scanner', 'PrintWriter', 'try', 'catch', 'finally', 'while', 'do-while', 'for', 'switch',
      'Integer.parseInt()', 'equals()', 'compareTo()', 'HashMap', 'ArrayList', 'Set'
    ];
    return shuffle(keywordPool.filter((k) => k !== correctAnswer)).slice(0, 4);
  }

  function numericDistractors(correctAnswer) {
    const n = Number(correctAnswer);
    if (!Number.isFinite(n)) return [];
    const vals = new Set([n - 1, n + 1, n - 2, n + 2, n + 10, n - 10]);
    vals.delete(n);
    return Array.from(vals).map((x) => String(x));
  }

  function booleanDistractors(correctAnswer) {
    const lc = String(correctAnswer).toLowerCase();
    if (lc !== 'true' && lc !== 'false') return [];
    return lc === 'true'
      ? ['false', 'Compilation error', 'Runtime exception', 'No output']
      : ['true', 'Compilation error', 'Runtime exception', 'No output'];
  }

  function syntaxDistractors(correctAnswer) {
    const s = String(correctAnswer);
    if (!/[();={}\[\]]/.test(s) && !/\b(public|private|class|new|int|String|char|void)\b/.test(s)) {
      return [];
    }
    const variants = new Set();
    if (s.includes('main')) {
      variants.add('public void main(String[] args)');
      variants.add('public static void Main(String[] args)');
      variants.add('public static void main()');
      variants.add('private static void main(String[] args)');
    }
    if (s.includes('parseInt')) {
      variants.add('String.toInt("123")');
      variants.add('Integer.toString("123")');
      variants.add('parseInteger("123")');
      variants.add('convertToInt("123")');
    }
    if (s.includes('arr') || s.includes('int[') || s.includes('new int')) {
      variants.add('int arr = new int[5];');
      variants.add('int arr = [5];');
      variants.add('array<int> arr = new array<int>[5];');
      variants.add('int arr(5);');
    }
    if (variants.size < 4) {
      variants.add(`${s};`);
      variants.add(s.replace(/;/g, ''));
      variants.add(s.replace(/public/g, 'private'));
      variants.add(s.replace(/static/g, ''));
    }
    return Array.from(variants).filter((v) => v !== s);
  }

  function semanticDistractors(correctAnswer) {
    const correctTokens = normalizeTokenSet(correctAnswer);
    const candidates = answerPool
      .filter((answer) => answer !== correctAnswer)
      .map((answer) => {
        const tokens = normalizeTokenSet(answer);
        let overlap = 0;
        correctTokens.forEach((token) => {
          if (tokens.has(token)) overlap += 1;
        });
        return { answer, overlap };
      })
      .filter((x) => x.overlap > 0)
      .sort((a, b) => b.overlap - a.overlap)
      .slice(0, 20)
      .map((x) => x.answer);
    return candidates;
  }

  function buildMockChoices(correctAnswer) {
    const collected = new Set();

    [
      ...numericDistractors(correctAnswer),
      ...booleanDistractors(correctAnswer),
      ...syntaxDistractors(correctAnswer),
      ...semanticDistractors(correctAnswer),
      ...pickKeywordDistractors(correctAnswer)
    ].forEach((option) => {
      if (option && option !== correctAnswer) {
        collected.add(option);
      }
    });

    const distractors = shuffle(Array.from(collected)).slice(0, 4);
    return shuffle([correctAnswer, ...distractors]);
  }

  function renderMockBank(items, revealed = false) {
    if (!examMockBank) return;

    const html = items.map((item, index) => {
      if (item.type === 'code') {
        return `
          <article class="mock-item" data-item-index="${index}" data-section-id="${item.sectionId}" data-item-type="code">
            <p><strong>Q${index + 1}.</strong> ${escapeHtml(item.q)}</p>
            <p class="tool-note"><strong>Sample Input:</strong> ${escapeHtml(formatSampleInput(item.sampleInput || {}))}</p>
            <p class="tool-note"><strong>Expected Output:</strong> ${escapeHtml(JSON.stringify(item.expected))}</p>
            <p class="tool-note"><strong>Required result variable:</strong> ${escapeHtml(item.resultVar || '')}</p>
            <textarea class="mock-answer-field" placeholder="Write your code here..."></textarea>
            <div class="quiz-actions">
              <button type="button" class="utility-btn mock-code-check">Check Code</button>
            </div>
            <div class="mock-feedback" hidden>
              <p class="mock-feedback-status"></p>
              <p class="mock-code-output">Output: --</p>
              <p><strong>Java model snippet:</strong> <span class="mock-correct-answer">${formatAnswer(item.a)}</span></p>
            </div>
          </article>
        `;
      }

      const options = item.options || buildMockChoices(item.a);
      return `
        <article class="mock-item" data-item-index="${index}" data-section-id="${item.sectionId}" data-item-type="mcq">
          <p><strong>Q${index + 1}.</strong> ${escapeHtml(item.q)}</p>
          <div class="mock-options">
            ${options.map((option, optionIndex) => `
              <label class="mock-option">
                <input type="radio" name="mock-choice-${index}" value="${escapeHtml(option)}" class="mock-choice-input">
                <span class="mock-option-tag">${String.fromCharCode(65 + optionIndex)}</span>
                <span>${escapeHtml(option)}</span>
              </label>
            `).join('')}
          </div>
          <div class="mock-feedback" hidden>
            <p class="mock-feedback-status"></p>
            <p><strong>Correct answer:</strong> <span class="mock-correct-answer">${formatAnswer(item.a)}</span></p>
          </div>
          <div class="mock-score-line" hidden>
            <span class="mock-done-indicator">Selected</span>
          </div>
        </article>
      `;
    }).join('');

    examMockBank.innerHTML = html;
    examMockBank.hidden = false;
    attachMockChoiceListeners();
    attachMockCodeListeners();
  }

  function attachMockChoiceListeners() {
    const items = Array.from(examMockBank?.querySelectorAll('.mock-item[data-item-type="mcq"]') || []);
    items.forEach((item) => {
      const itemIndex = Number(item.dataset.itemIndex);
      const choiceInputs = Array.from(item.querySelectorAll('.mock-choice-input'));
      choiceInputs.forEach((input) => {
        input.addEventListener('change', () => {
          if (!currentMock || currentMock.selectedAnswers[itemIndex] !== null) {
            return;
          }

          const selectedAnswer = input.value;
          const currentItem = currentMock?.items[itemIndex];
          if (!currentItem) return;

          currentMock.selectedAnswers[itemIndex] = selectedAnswer;
          const feedback = item.querySelector('.mock-feedback');
          const status = item.querySelector('.mock-feedback-status');
          const isCorrect = selectedAnswer === currentItem.a;

          item.classList.remove('correct', 'wrong');
          item.classList.add(isCorrect ? 'correct' : 'wrong');

          if (feedback) feedback.hidden = false;
          if (status) {
            status.textContent = isCorrect ? 'Correct' : 'Wrong';
          }

          const doneLine = item.querySelector('.mock-score-line');
          if (doneLine) doneLine.hidden = false;

          const allOptionLabels = Array.from(item.querySelectorAll('.mock-option'));
          allOptionLabels.forEach((label) => {
            label.classList.remove('selected');
          });
          const selectedLabel = input.closest('.mock-option');
          if (selectedLabel) {
            selectedLabel.classList.add('selected');
          }

          choiceInputs.forEach((choiceInput) => {
            choiceInput.disabled = true;
          });
        });
      });
    });
  }

  function attachMockCodeListeners() {
    const items = Array.from(examMockBank?.querySelectorAll('.mock-item[data-item-type="code"]') || []);
    items.forEach((item) => {
      const itemIndex = Number(item.dataset.itemIndex);
      const checkButton = item.querySelector('.mock-code-check');
      if (!checkButton) return;

      checkButton.addEventListener('click', async () => {
        const currentItem = currentMock?.items[itemIndex];
        if (!currentItem || currentItem.type !== 'code') return;
        checkButton.disabled = true;
        await evaluateMockCodeQuestion(currentItem, itemIndex);
        checkButton.disabled = false;
      });
    });
  }

  function updateMockControls(submitted) {
    if (examMockSubmit) examMockSubmit.disabled = !currentMock || submitted;
    if (examMockSave) examMockSave.disabled = !currentMock || !submitted;
    if (examMockStart) examMockStart.disabled = !!currentMock && !submitted;
  }

  async function finishMockTest(autoSubmitted = false) {
    if (!currentMock) return;

    clearMockTimer();
    currentMock.submitted = true;
    updateMockControls(true);

    for (let i = 0; i < currentMock.items.length; i += 1) {
      const item = currentMock.items[i];
      if (item.type === 'code') {
        await evaluateMockCodeQuestion(item, i);
      }
    }

    const items = Array.from(examMockBank?.querySelectorAll('.mock-item') || []);
    items.forEach((item, index) => {
      const itemType = item.dataset.itemType;
      if (itemType === 'code') {
        const input = item.querySelector('.mock-answer-field');
        const checkButton = item.querySelector('.mock-code-check');
        if (input) input.disabled = true;
        if (checkButton) checkButton.disabled = true;
        return;
      }

      const inputs = Array.from(item.querySelectorAll('.mock-choice-input'));
      inputs.forEach((input) => {
        input.disabled = true;
      });
      const selected = currentMock.selectedAnswers[index];
      const feedback = item.querySelector('.mock-feedback');
      const status = item.querySelector('.mock-feedback-status');
      const currentItem = currentMock.items[index];
      if (!currentItem) return;

      const isCorrect = selected === currentItem.a;
      if (selected) {
        item.classList.remove('correct', 'wrong');
        item.classList.add(isCorrect ? 'correct' : 'wrong');
        if (feedback) feedback.hidden = false;
        if (status) status.textContent = isCorrect ? 'Correct' : 'Wrong';
      }
    });

    const count = currentMock.items.length;
    setMockStatus(`${autoSubmitted ? 'Time up. ' : ''}Mock finished. MCQ and code responses were evaluated. Save your score.`);
    setMockTimerText('Time left: 00:00');
    if (examMockNote) {
      examMockNote.textContent = 'MCQ answers are checked on selection. Code answers are checked via Check Code or automatically on submit.';
    }

    return count;
  }

  function saveMockScore() {
    if (!currentMock || !currentMock.submitted || !examMockBank) return;

    const total = currentMock.items.length;
    const score = currentMock.items.reduce((sum, item, index) => {
      return sum + (isMockItemCorrect(item, index) ? 1 : 0);
    }, 0);
    const pct = total === 0 ? 0 : Math.round((score / total) * 100);

    examHistoryItems.unshift({
      timestamp: Date.now(),
      score,
      total,
      pct
    });
    examHistoryItems = examHistoryItems.slice(0, 20);
    saveExamHistory();
    renderExamHistory();

    setMockStatus(`Saved score: ${score}/${total} (${pct}%).`);
    if (examMockNote) {
      examMockNote.textContent = 'Past paper score saved. Start a new mock test anytime.';
    }
    currentMock = null;
    updateMockControls(false);
    if (examMockStart) examMockStart.disabled = false;
  }

  function resetMockTest() {
    clearMockTimer();
    currentMock = null;
    if (examMockBank) {
      examMockBank.hidden = true;
      examMockBank.innerHTML = '';
    }
    if (examMockNote) {
      examMockNote.textContent = 'Choose one option per question. Selections are locked until reset.';
    }
    setMockStatus('Mock test reset.');
    setMockTimerText('Time left: --:--');
    updateMockControls(false);
  }

  function startMockTest() {
    const requestedCount = Number(examMockCount?.value || MOCK_ITEM_POOL.length);
    const minutes = Number(examMockMinutes?.value || 20);
    const count = Math.min(requestedCount, MOCK_ITEM_POOL.length);
    const items = shuffle(MOCK_ITEM_POOL).slice(0, count);

    clearMockTimer();
    currentMock = {
      items,
      selectedAnswers: Array(count).fill(null),
      codeResults: Array(count).fill(false),
      submitted: false,
      endsAt: Date.now() + minutes * 60 * 1000
    };

    renderMockBank(items, false);
    updateMockControls(false);
    if (examMockSubmit) examMockSubmit.disabled = false;
    if (examMockSave) examMockSave.disabled = true;

    setMockStatus(`Mock test started with ${count} questions.`);
    if (examMockNote) {
      examMockNote.textContent = 'MCQ answers are checked on selection and then locked.';
    }

    const tick = () => {
      if (!currentMock) return;
      const remainingMs = Math.max(0, currentMock.endsAt - Date.now());
      const minutesLeft = Math.floor(remainingMs / 60000);
      const secondsLeft = Math.floor((remainingMs % 60000) / 1000);
      setMockTimerText(`Time left: ${String(minutesLeft).padStart(2, '0')}:${String(secondsLeft).padStart(2, '0')}`);
      if (remainingMs === 0) {
        finishMockTest(true);
      }
    };

    tick();
    mockTimerId = setInterval(tick, 1000);
  }

  function renderBank() {
    let index = 1;
    const html = SECTION_DEFS.map((section) => {
      const items = allItems.filter((item) => item.sectionId === section.id);
      const cards = items.map((item, itemIndex) => {
        const globalIndex = index - 1;
        const checked = revisedSet.has(String(globalIndex)) ? 'checked' : '';
        const searchText = `${section.title} ${item.q} ${item.a}`.toLowerCase();
        const sourceLabel = section.id.startsWith('exam-pdf') ? 'Past paper question' : 'Practice question';
        const isCode = item.type === 'code';
        const answerLabel = isCode ? 'Java model snippet' : 'Answer';
        const codeMeta = isCode
          ? `<p class="tool-note"><strong>Sample Input:</strong> ${escapeHtml(formatSampleInput(item.sampleInput || {}))}</p>
             <p class="tool-note"><strong>Expected Output:</strong> ${escapeHtml(JSON.stringify(item.expected))}</p>
             <p class="tool-note"><strong>Required result variable:</strong> ${escapeHtml(item.resultVar || '')}</p>`
          : '';
        const markup = `
          <div class="question-item" data-question-index="${globalIndex}" data-search-text="${searchText}">
            <p><strong>Q${index}.</strong> ${escapeHtml(item.q)}<br><strong>${answerLabel}:</strong> <span class="exam-answer">${formatAnswer(item.a)}</span></p>
            ${codeMeta}
            <p class="tool-note">${sourceLabel}</p>
            <label class="revise-line">
              <input type="checkbox" class="exam-revise-checkbox" data-question-index="${globalIndex}" ${checked}>
              Mark as revised
            </label>
          </div>
        `;
        index += 1;
        return markup;
      }).join('');

      return `
        <article id="${section.id}" class="card qa">
          <h3>${section.title}</h3>
          ${cards}
        </article>
      `;
    }).join('');

    examMount.innerHTML = html;
    bindRevisedCheckboxes();
    applyFilters();
    updateRevisedCount();
  }

  function bindRevisedCheckboxes() {
    const checkboxes = Array.from(document.querySelectorAll('.exam-revise-checkbox'));
    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener('change', () => {
        const idx = checkbox.dataset.questionIndex;
        if (!idx) return;
        if (checkbox.checked) {
          revisedSet.add(idx);
        } else {
          revisedSet.delete(idx);
        }
        saveRevisedState(revisedSet);
        updateRevisedCount();
      });
    });
  }

  function updateRevisedCount() {
    if (examRevisedCount) {
      examRevisedCount.textContent = `Revised progress: ${revisedSet.size} / ${allItems.length}`;
    }
  }

  function applyFilters() {
    const searchValue = (examSearch?.value || '').trim().toLowerCase();
    const selectedSection = examSectionFilter?.value || 'all';
    let visibleCount = 0;

    SECTION_DEFS.forEach((section) => {
      const article = document.getElementById(section.id);
      if (!article) return;

      const sectionMatches = selectedSection === 'all' || selectedSection === section.id;
      article.hidden = !sectionMatches;
      if (!sectionMatches) return;

      const items = Array.from(article.querySelectorAll('.question-item'));
      let visibleInSection = 0;
      items.forEach((item) => {
        const text = item.dataset.searchText || '';
        const visible = !searchValue || text.includes(searchValue);
        item.hidden = !visible;
        if (visible) {
          visibleInSection += 1;
          visibleCount += 1;
        }
      });

      article.hidden = visibleInSection === 0;
    });

    if (examCount) {
      examCount.textContent = `Showing ${visibleCount} of ${allItems.length} exam questions.`;
    }
    if (examNoResults) {
      examNoResults.hidden = visibleCount !== 0;
    }
  }

  if (examSearch) {
    examSearch.addEventListener('input', applyFilters);
  }

  if (examSectionFilter) {
    examSectionFilter.addEventListener('change', applyFilters);
  }

  if (examClearFilters) {
    examClearFilters.addEventListener('click', () => {
      if (examSearch) examSearch.value = '';
      if (examSectionFilter) examSectionFilter.value = 'all';
      applyFilters();
    });
  }

  if (examMockStart) {
    examMockStart.addEventListener('click', startMockTest);
  }

  if (examMockSubmit) {
    examMockSubmit.addEventListener('click', () => finishMockTest(false));
  }

  if (examMockSave) {
    examMockSave.addEventListener('click', saveMockScore);
  }

  if (examMockReset) {
    examMockReset.addEventListener('click', resetMockTest);
  }

  renderBank();
  renderExamHistory();
})();
