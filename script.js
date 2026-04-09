const tabLinks = Array.from(document.querySelectorAll('.tab-link'));
const panels = Array.from(document.querySelectorAll('.tab-panel'));
const themeToggle = document.getElementById('themeToggle');
const pdfButtons = Array.from(document.querySelectorAll('.pdf-btn'));
const questionBankMount = document.getElementById('questionBank');
const questionSearch = document.getElementById('questionSearch');
const sectionFilter = document.getElementById('sectionFilter');
const clearFilters = document.getElementById('clearFilters');
const questionCount = document.getElementById('questionCount');
const revisedCount = document.getElementById('revisedCount');
const noResults = document.getElementById('noResults');
const startQuiz = document.getElementById('startQuiz');
const exportReviewPdf = document.getElementById('exportReviewPdf');
const quizCount = document.getElementById('quizCount');
const quizMinutes = document.getElementById('quizMinutes');
const quizStatus = document.getElementById('quizStatus');
const quizPanel = document.getElementById('quizPanel');
const quizTimer = document.getElementById('quizTimer');
const quizQuestion = document.getElementById('quizQuestion');
const nextQuizQuestion = document.getElementById('nextQuizQuestion');
const submitQuiz = document.getElementById('submitQuiz');
const quizReview = document.getElementById('quizReview');
const retryWrong = document.getElementById('retryWrong');
const retryHint = document.getElementById('retryHint');
const bestScoreLine = document.getElementById('bestScoreLine');
const quizHistory = document.getElementById('quizHistory');
const analyticsPanel = document.getElementById('analyticsPanel');

const REVISED_KEY = 'ce274-revised-questions';
const QUIZ_HISTORY_KEY = 'ce274-quiz-history';
const QUIZ_ANALYTICS_KEY = 'ce274-quiz-analytics';

let revisedSet = new Set();
let currentQuiz = null;
let quizIntervalId = null;
let lastWrongItems = [];
let historyItems = [];
let analyticsItems = {};

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

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

const QUESTION_SECTIONS = [
  { id: 'q-fundamentals', title: 'Fundamentals' },
  { id: 'q-elementary', title: 'Elementary Programming' },
  { id: 'q-math-strings', title: 'Math, Characters, and Strings' },
  { id: 'q-control', title: 'Selections and Loops' },
  { id: 'q-exceptions', title: 'Exceptions and I/O' },
  { id: 'q-ds', title: 'Data Structures' },
  { id: 'q-oop', title: 'OOP and Methods' },
  { id: 'q-app', title: 'Application Development' }
];

const QUESTIONS = [
  // Fundamentals - Tricky type system questions
  { sec: 'q-fundamentals', q: 'What will System.out.println(5 + "5"); output?', a: '55' },
  { sec: 'q-fundamentals', q: 'What is the output of System.out.println(3 == 3.0);?', a: 'true' },
  { sec: 'q-fundamentals', q: 'What will System.out.println(10 % 3); output?', a: '1' },
  { sec: 'q-fundamentals', q: 'Which of these is NOT a Java keyword? answer: define', a: 'define' },
  { sec: 'q-fundamentals', q: 'What will be the output of int a = 5; int b = 2; System.out.println(a / b);?', a: '2' },
  { sec: 'q-fundamentals', q: 'What is the default value of an uninitialized int variable in Java?', a: '0' },
  { sec: 'q-fundamentals', q: 'Which data type stores decimal values in Java?', a: 'double' },

  // Elementary - Pre/post increment and assignment operators
  { sec: 'q-elementary', q: 'Given i = 1; running int j = --i; what are final values of i and j?', a: 'i will be 0 and j will be 0' },
  { sec: 'q-elementary', q: 'What will int x = 10; x += 5; System.out.println(x); output?', a: '15' },
  { sec: 'q-elementary', q: 'Which statement correctly creates an instance? answer: ClassName obj = new ClassName();', a: 'ClassName obj = new ClassName();' },
  { sec: 'q-elementary', q: 'How do you define a constructor in Java?', a: 'Same name as class, no return type' },
  { sec: 'q-elementary', q: 'What statement correctly declares a char variable: char ch = \'A\';?', a: 'char ch = \'A\';' },
  { sec: 'q-elementary', q: 'What is operator precedence in Java?', a: 'Rules that determine evaluation order, like multiplication before addition.' },
  { sec: 'q-elementary', q: 'Why can integer division cause wrong answers?', a: 'Because int/int truncates decimals, e.g., 5/2 becomes 2.' },

  // Math & Strings - Edge cases with type conversion
  { sec: 'q-math-strings', q: 'What method converts a string into an integer in Java?', a: 'Integer.parseInt()' },
  { sec: 'q-math-strings', q: 'How do you compare two strings in Java correctly?', a: 'Use equals() or equalsIgnoreCase(), not ==' },
  { sec: 'q-math-strings', q: 'What will System.out.println(10 == 10.0); output?', a: 'true' },
  { sec: 'q-math-strings', q: 'What does string == compare in Java for two strings?', a: 'Memory references, not content' },
  { sec: 'q-math-strings', q: 'Explain: String s1 = "Hello"; String s2 = "Hello"; s1 == s2 returns what? answer: true (string literal pooling)', a: 'true due to string literal pooling in memory' },
  { sec: 'q-math-strings', q: 'Can you compare int and double with ==?', a: 'Yes, they are automatically compared by value' },
  { sec: 'q-math-strings', q: 'What is the correct way to declare a char variable?', a: 'char ch = \'A\'; (using single quotes)' },

  // Control Flow - Switch and conditional issues
  { sec: 'q-control', q: 'What happens if break is omitted in a switch statement?', a: 'Fall-through occurs to the next case' },
  { sec: 'q-control', q: 'What will System.out.println(5 > 3 ? "Yes" : "No"); output?', a: 'Yes' },
  { sec: 'q-control', q: 'Which if condition is valid: if (x == 5)?', a: 'if (x == 5)' },
  { sec: 'q-control', q: 'What is the difference between = and == in conditions?', a: '= is assignment; == is comparison. Using = in if causes errors or unexpected behavior.' },
  { sec: 'q-control', q: 'Difference between while and do-while?', a: 'while checks condition first; do-while executes body at least once.' },
  { sec: 'q-control', q: 'Which loop is best for a known number of iterations?', a: 'for loop' },
  { sec: 'q-control', q: 'What does continue do in a loop?', a: 'It skips current loop iteration and proceeds to next iteration.' },

  // Exceptions - Finally block and throw handling
  { sec: 'q-exceptions', q: 'Does the finally block execute if no exception occurs?', a: 'True' },
  { sec: 'q-exceptions', q: 'What will happen if we divide an integer by zero in Java?', a: 'Runtime exception (ArithmeticException)' },
  { sec: 'q-exceptions', q: 'What is the try block used for in exception handling?', a: 'Contains statements that may cause an exception' },
  { sec: 'q-exceptions', q: 'When does a finally block execute?', a: 'Always, whether exception occurs or not' },
  { sec: 'q-exceptions', q: 'What exception occurs with Scanner receiving unexpected data type?', a: 'InputMismatchException' },
  { sec: 'q-exceptions', q: 'Can you catch multiple exception types in one catch block?', a: 'Yes, using | operator in Java 7+' },
  { sec: 'q-exceptions', q: 'What is the role of throw keyword?', a: 'Explicitly throws an exception to be handled by caller' },

  // Data Structures - Collections and array operations
  { sec: 'q-ds', q: 'What is the correct array declaration: int[] arr = new int[5];?', a: 'int[] arr = new int[5];' },
  { sec: 'q-ds', q: 'How do you access the first element of an array?', a: 'arr[0]' },
  { sec: 'q-ds', q: 'What is advantage of ArrayList over array?', a: 'It resizes dynamically and provides insertion/removal methods' },
  { sec: 'q-ds', q: 'When should Set be used?', a: 'When duplicate values must be automatically eliminated' },
  { sec: 'q-ds', q: 'What is a multidimensional array used for?', a: 'Storing data in tables/matrices with multiple rows and columns' },
  { sec: 'q-ds', q: 'How do you find intersection of two sets A and B in Java?', a: 'Use A.retainAll(B);' },
  { sec: 'q-ds', q: 'How do you find union of two sets A and B?', a: 'Use A.addAll(B);' },

  // OOP - Inheritance, access modifiers, and method concepts
  { sec: 'q-oop', q: 'Which access modifier makes a variable accessible only within the same class?', a: 'private' },
  { sec: 'q-oop', q: 'Which keyword is used to inherit a class?', a: 'extends' },
  { sec: 'q-oop', q: 'What are the four OOP principles? answer: Encapsulation, Inheritance, Polymorphism, Abstraction', a: 'Encapsulation, Inheritance, Polymorphism, Abstraction' },
  { sec: 'q-oop', q: 'How do you create a constant variable in Java?', a: 'final int x = 10;' },
  { sec: 'q-oop', q: 'What is method overloading?', a: 'Same method name with different parameter lists in one class' },
  { sec: 'q-oop', q: 'Difference between static and instance method?', a: 'Static belongs to class; instance belongs to object and can access instance state' },
  { sec: 'q-oop', q: 'Can a method return multiple values?', a: 'Yes, using array, object, List, or Map' },

  // Application & Complex Logic - Operators and boolean logic
  { sec: 'q-app', q: 'What is the return type of the main() method?', a: 'void' },
  { sec: 'q-app', q: 'What is the correct main method signature?', a: 'public static void main(String[] args)' },
  { sec: 'q-app', q: 'Which operators are used for comparison?', a: '== (equal), != (not equal), < > <= >=' },
  { sec: 'q-app', q: 'What outputs true/false in Java?', a: 'Comparison operators and boolean expressions' },
  { sec: 'q-app', q: 'What will Math.max(10, 20); return?', a: '20' },
  { sec: 'q-app', q: 'What keyword creates an interface?', a: 'interface' },
  { sec: 'q-app', q: 'What is the purpose of a constructor?', a: 'Initialize object state during creation' },

  // TRUE/FALSE QUESTIONS - From actual exam
  { sec: 'q-fundamentals', q: 'True or False: The remainder of 10 % 3 is 1.', a: 'true' },
  { sec: 'q-fundamentals', q: 'True or False: Java is platform-independent because it compiles to bytecode.', a: 'true' },
  { sec: 'q-elementary', q: 'True or False: The == operator compares string content in Java.', a: 'false' },
  { sec: 'q-elementary', q: 'True or False: A constructor must have a return type specified.', a: 'false' },
  { sec: 'q-elementary', q: 'True or False: Static variables are shared among all instances of a class.', a: 'true' },
  { sec: 'q-math-strings', q: 'True or False: The expression 5 == 5.0 evaluates to true in Java.', a: 'true' },
  { sec: 'q-math-strings', q: 'True or False: Integer.parseInt() converts an int to a String.', a: 'false' },
  { sec: 'q-math-strings', q: 'True or False: Single quotes are used to declare String variables in Java.', a: 'false' },
  { sec: 'q-control', q: 'True or False: In a while loop, the condition is checked before each iteration.', a: 'true' },
  { sec: 'q-control', q: 'True or False: A do-while loop executes the body at least once.', a: 'true' },
  { sec: 'q-control', q: 'True or False: The break statement exits the nearest loop or switch.', a: 'true' },
  { sec: 'q-control', q: 'True or False: Using = instead of == in an if condition is valid syntax.', a: 'true' },
  { sec: 'q-exceptions', q: 'True or False: The finally block only executes if an exception occurs.', a: 'false' },
  { sec: 'q-exceptions', q: 'True or False: Dividing an integer by zero results in Infinity.', a: 'false' },
  { sec: 'q-exceptions', q: 'True or False: The try block contains statements that may cause an exception.', a: 'true' },
  { sec: 'q-ds', q: 'True or False: An ArrayList resizes dynamically unlike a regular array.', a: 'true' },
  { sec: 'q-ds', q: 'True or False: Sets automatically eliminate duplicate values.', a: 'true' },
  { sec: 'q-ds', q: 'True or False: Multidimensional arrays can store different data types in each element.', a: 'false' },
  { sec: 'q-oop', q: 'True or False: The extends keyword is used to inherit a class.', a: 'true' },
  { sec: 'q-oop', q: 'True or False: Private variables are accessible from outside the class.', a: 'false' },
  { sec: 'q-oop', q: 'True or False: A static method can access instance variables directly.', a: 'false' },
  { sec: 'q-app', q: 'True or False: The main() method must be public and static.', a: 'true' },
  { sec: 'q-app', q: 'True or False: Java supports multiple inheritance through classes.', a: 'false' },
  { sec: 'q-app', q: 'True or False: Encapsulation hides internal implementation details of a class.', a: 'true' }
];

function shuffleArray(items) {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function createDefaultAnalytics() {
  const out = {};
  for (const section of QUESTION_SECTIONS) {
    out[section.id] = { attempted: 0, correct: 0 };
  }
  return out;
}

function loadQuizMetrics() {
  const rawHistory = localStorage.getItem(QUIZ_HISTORY_KEY);
  if (rawHistory) {
    try {
      const parsed = JSON.parse(rawHistory);
      if (Array.isArray(parsed)) {
        historyItems = parsed;
      }
    } catch {
      historyItems = [];
    }
  }

  const rawAnalytics = localStorage.getItem(QUIZ_ANALYTICS_KEY);
  if (rawAnalytics) {
    try {
      const parsed = JSON.parse(rawAnalytics);
      if (parsed && typeof parsed === 'object') {
        analyticsItems = parsed;
      }
    } catch {
      analyticsItems = createDefaultAnalytics();
    }
  }

  if (!analyticsItems || Object.keys(analyticsItems).length === 0) {
    analyticsItems = createDefaultAnalytics();
  }
}

function saveQuizMetrics() {
  localStorage.setItem(QUIZ_HISTORY_KEY, JSON.stringify(historyItems));
  localStorage.setItem(QUIZ_ANALYTICS_KEY, JSON.stringify(analyticsItems));
}

function formatAttemptDate(ts) {
  const date = new Date(ts);
  return date.toLocaleString();
}

function renderHistoryPanel() {
  if (!bestScoreLine || !quizHistory) return;

  if (historyItems.length === 0) {
    bestScoreLine.textContent = 'No attempts yet.';
    quizHistory.innerHTML = '<li class="tool-note">No quiz attempts yet.</li>';
    return;
  }

  const best = historyItems.reduce((acc, item) => {
    if (!acc) return item;
    if (item.pct > acc.pct) return item;
    if (item.pct === acc.pct && item.score > acc.score) return item;
    return acc;
  }, null);

  bestScoreLine.textContent = `${best.score}/${best.total} (${best.pct}%) on ${formatAttemptDate(best.timestamp)}.`;

  const listMarkup = historyItems.slice(0, 10).map((item) => {
    const mode = item.mode === 'retry' ? 'retry' : 'normal';
    return `<li>${item.score}/${item.total} (${item.pct}%) | ${mode} | ${formatAttemptDate(item.timestamp)}</li>`;
  }).join('');
  quizHistory.innerHTML = listMarkup;
}

function renderAnalyticsPanel() {
  if (!analyticsPanel) return;

  const rows = QUESTION_SECTIONS.map((section) => {
    const metric = analyticsItems[section.id] || { attempted: 0, correct: 0 };
    const pct = metric.attempted === 0 ? 0 : Math.round((metric.correct / metric.attempted) * 100);
    return {
      title: section.title,
      attempted: metric.attempted,
      correct: metric.correct,
      pct
    };
  });

  const hasData = rows.some((row) => row.attempted > 0);
  if (!hasData) {
    analyticsPanel.innerHTML = '<p class="tool-note">No analytics yet. Complete a quiz to populate this panel.</p>';
    return;
  }

  analyticsPanel.innerHTML = rows.map((row) => {
    const width = Math.max(0, Math.min(100, row.pct));
    return `
      <div class="analytics-item">
        <strong>${escapeHtml(row.title)}</strong>
        <div class="bar-wrap"><div class="bar-fill" style="width: ${width}%;"></div></div>
        <span class="bar-meta">${row.correct}/${row.attempted} correct (${row.pct}%)</span>
      </div>
    `;
  }).join('');
}

function exportReviewToPdfWindow() {
  if (!quizReview || quizReview.hidden || !quizReview.innerHTML.trim()) {
    if (quizStatus) {
      quizStatus.textContent = 'No review available yet. Complete and submit a quiz first.';
    }
    return;
  }

  const win = window.open('', '_blank');
  if (!win) {
    if (quizStatus) {
      quizStatus.textContent = 'Unable to open export window. Please allow pop-ups and try again.';
    }
    return;
  }

  const summary = quizStatus ? quizStatus.textContent : 'Quiz Review';
  const html = `
    <!doctype html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>CE 277 Quiz Review Export</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 24px; color: #111; }
        h1 { margin-bottom: 6px; }
        p { margin: 6px 0; }
        .review-item { border: 1px solid #bbb; border-radius: 8px; padding: 10px; margin: 10px 0; }
        .review-item.correct { border-left: 5px solid #2f9e44; }
        .review-item.wrong { border-left: 5px solid #d9480f; }
        .review-tag { color: #444; font-weight: 700; }
      </style>
    </head>
    <body>
      <h1>CE 277 Quiz Review</h1>
      <p>${escapeHtml(summary)}</p>
      <div>${quizReview.innerHTML}</div>
      <script>window.onload = function () { window.print(); };</script>
    </body>
    </html>
  `;

  win.document.open();
  win.document.write(html);
  win.document.close();
}

function activateTab(tabId, updateHash = true) {
  const targetPanel = document.getElementById(tabId);
  if (!targetPanel) return;

  panels.forEach((panel) => panel.classList.toggle('active', panel.id === tabId));
  tabLinks.forEach((link) => {
    const isActive = link.dataset.tab === tabId;
    link.classList.toggle('active', isActive);
    link.setAttribute('aria-current', isActive ? 'page' : 'false');
  });

  if (updateHash) {
    history.replaceState(null, '', `#${tabId}`);
  }
}

function renderQuestionBank() {
  if (!questionBankMount) return;

  let qNumber = 1;
  const chunks = QUESTION_SECTIONS.map((section) => {
    const sectionItems = QUESTIONS.filter((item) => item.sec === section.id);
    const items = sectionItems
      .map((item) => {
        const idx = qNumber - 1;
        const checked = revisedSet.has(String(idx)) ? 'checked' : '';
        const searchText = `${section.title} ${item.q} ${item.a}`.toLowerCase();
        const markup = `
          <div class="question-item" data-question-index="${idx}" data-search-text="${searchText}">
            <p><strong>Q${qNumber}.</strong> ${item.q}<br><strong>A.</strong> ${item.a}</p>
            <label class="revise-line">
              <input type="checkbox" class="revise-checkbox" data-question-index="${idx}" ${checked}>
              Mark as revised
            </label>
          </div>
        `;
        qNumber += 1;
        return markup;
      })
      .join('');

    return `
      <article id="${section.id}" class="card qa">
        <h3>${section.title}</h3>
        ${items}
      </article>
    `;
  });

  questionBankMount.innerHTML = chunks.join('');
  attachRevisedListeners();
  applyQuestionFilters();
}

function attachRevisedListeners() {
  const checkboxes = Array.from(document.querySelectorAll('.revise-checkbox'));
  for (const checkbox of checkboxes) {
    checkbox.addEventListener('change', () => {
      const idx = checkbox.dataset.questionIndex;
      if (!idx) return;
      if (checkbox.checked) {
        revisedSet.add(idx);
      } else {
        revisedSet.delete(idx);
      }
      localStorage.setItem(REVISED_KEY, JSON.stringify(Array.from(revisedSet)));
      updateRevisedCount();
    });
  }
}

function updateRevisedCount() {
  if (!revisedCount) return;
  revisedCount.textContent = `Revised progress: ${revisedSet.size} / ${QUESTIONS.length}`;
}

function applyQuestionFilters() {
  const searchValue = (questionSearch?.value || '').trim().toLowerCase();
  const selectedSection = sectionFilter?.value || 'all';
  const allItems = Array.from(document.querySelectorAll('.question-item'));
  let visibleCount = 0;

  for (const section of QUESTION_SECTIONS) {
    const article = document.getElementById(section.id);
    if (!article) continue;

    const sectionHidden = selectedSection !== 'all' && selectedSection !== section.id;
    article.hidden = sectionHidden;
    if (sectionHidden) continue;

    const sectionItems = Array.from(article.querySelectorAll('.question-item'));
    let visibleInSection = 0;

    for (const item of sectionItems) {
      const text = item.dataset.searchText || '';
      const visible = !searchValue || text.includes(searchValue);
      item.hidden = !visible;
      if (visible) {
        visibleInSection += 1;
        visibleCount += 1;
      }
    }

    article.hidden = visibleInSection === 0;
  }

  if (questionCount) {
    questionCount.textContent = `Showing ${visibleCount} of ${QUESTIONS.length} questions.`;
  }
  if (noResults) {
    noResults.hidden = visibleCount !== 0;
  }
}

function loadRevisedState() {
  const saved = localStorage.getItem(REVISED_KEY);
  if (!saved) return;
  try {
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed)) {
      revisedSet = new Set(parsed.map((x) => String(x)));
    }
  } catch {
    revisedSet = new Set();
  }
}

function isTrueFalseQuestion(item) {
  const questionText = String(item?.q || '').trim();
  const answerText = String(item?.a || '').trim();
  return /^true\s+or\s+false:/i.test(questionText) || /^(true|false)$/i.test(answerText);
}

function normalizeTokenSet(text) {
  return new Set(
    String(text)
      .toLowerCase()
      .replace(/[^a-z0-9()_]+/g, ' ')
      .split(' ')
      .map((token) => token.trim())
      .filter((token) => token.length > 1)
  );
}

function pickKeywordDistractors(correctAnswer) {
  const keywordPool = [
    'public', 'private', 'protected', 'static', 'final', 'class', 'interface', 'extends', 'implements',
    'Scanner', 'PrintWriter', 'try', 'catch', 'finally', 'while', 'do-while', 'for', 'switch',
    'Integer.parseInt()', 'equals()', 'compareTo()', 'HashMap', 'ArrayList', 'Set'
  ];
  return shuffleArray(keywordPool.filter((keyword) => keyword !== correctAnswer)).slice(0, 4);
}

function numericDistractors(correctAnswer) {
  const n = Number(correctAnswer);
  if (!Number.isFinite(n)) return [];
  const values = new Set([n - 1, n + 1, n - 2, n + 2, n + 10, n - 10]);
  values.delete(n);
  return Array.from(values).map((value) => String(value));
}

function booleanDistractors(correctAnswer) {
  const lowered = String(correctAnswer).toLowerCase();
  if (lowered !== 'true' && lowered !== 'false') return [];
  return lowered === 'true'
    ? ['false', 'Compilation error', 'Runtime exception', 'No output']
    : ['true', 'Compilation error', 'Runtime exception', 'No output'];
}

function syntaxDistractors(correctAnswer) {
  const answer = String(correctAnswer);
  if (!/[();={}\[\]]/.test(answer) && !/\b(public|private|class|new|int|String|char|void)\b/.test(answer)) {
    return [];
  }

  const variants = new Set();

  if (answer.includes('main')) {
    variants.add('public void main(String[] args)');
    variants.add('public static void Main(String[] args)');
    variants.add('public static void main()');
    variants.add('private static void main(String[] args)');
  }

  if (answer.includes('parseInt')) {
    variants.add('String.toInt("123")');
    variants.add('Integer.toString("123")');
    variants.add('parseInteger("123")');
    variants.add('convertToInt("123")');
  }

  if (answer.includes('arr') || answer.includes('int[') || answer.includes('new int')) {
    variants.add('int arr = new int[5];');
    variants.add('int arr = [5];');
    variants.add('array<int> arr = new array<int>[5];');
    variants.add('int arr(5);');
  }

  if (variants.size < 4) {
    variants.add(`${answer};`);
    variants.add(answer.replace(/;/g, ''));
    variants.add(answer.replace(/public/g, 'private'));
    variants.add(answer.replace(/static/g, ''));
  }

  return Array.from(variants).filter((variant) => variant !== answer);
}

function semanticDistractors(correctAnswer, pool) {
  const correctTokens = normalizeTokenSet(correctAnswer);
  return pool
    .filter((answer) => answer !== correctAnswer)
    .map((answer) => {
      const tokens = normalizeTokenSet(answer);
      let overlap = 0;
      correctTokens.forEach((token) => {
        if (tokens.has(token)) overlap += 1;
      });
      return { answer, overlap };
    })
    .filter((entry) => entry.overlap > 0)
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, 20)
    .map((entry) => entry.answer);
}

function buildQuizOptions(item) {
  if (isTrueFalseQuestion(item)) {
    return shuffleArray(['True', 'False']);
  }

  const answerPool = Array.from(new Set(QUESTIONS.map((question) => question.a)));
  const collected = new Set();

  [
    ...numericDistractors(item.a),
    ...booleanDistractors(item.a),
    ...syntaxDistractors(item.a),
    ...semanticDistractors(item.a, answerPool),
    ...pickKeywordDistractors(item.a)
  ].forEach((option) => {
    if (option && option !== item.a) {
      collected.add(option);
    }
  });

  const distractors = shuffleArray(Array.from(collected)).slice(0, 4);
  return shuffleArray([item.a, ...distractors]);
}

function buildQuizQuestionView(item, displayNumber, totalQuestions) {
  const isLocked = currentQuiz && Array.isArray(currentQuiz.lockedAnswers)
    ? currentQuiz.lockedAnswers[currentQuiz.index] === true
    : false;

  const options = buildQuizOptions(item);

  const optionMarkup = options
    .map((opt, idx) => {
      const checked = currentQuiz.answers[currentQuiz.index] === opt ? 'checked' : '';
      const disabled = isLocked ? 'disabled' : '';
      return `
        <label class="quiz-option">
          <input type="radio" name="quizOption" value="${idx}" ${checked} ${disabled}>
          <span class="mock-option-tag">${String.fromCharCode(65 + idx)}</span>
          <span>${opt}</span>
        </label>
      `;
    })
    .join('');

  currentQuiz.optionMap[currentQuiz.index] = options;

  return `
    <p><strong>Question ${displayNumber} of ${totalQuestions}</strong></p>
    <p>${item.q}</p>
    <div>${optionMarkup}</div>
  `;
}

function getSectionTitle(sectionId) {
  const found = QUESTION_SECTIONS.find((section) => section.id === sectionId);
  return found ? found.title : 'General';
}

function buildQuizReviewMarkup(items, answers) {
  const cards = items.map((item, idx) => {
    const selected = answers[idx] || 'No answer selected';
    const isTrueFalse = isTrueFalseQuestion(item);
    const isCorrect = isTrueFalse
      ? String(selected).toLowerCase() === String(item.a).toLowerCase()
      : selected === item.a;
    const statusClass = isCorrect ? 'correct' : 'wrong';
    const statusText = isCorrect ? 'Correct' : 'Needs review';
    const sectionTitle = getSectionTitle(item.sec);
    const guidance = isCorrect
      ? 'Good answer. Keep this concept in your quick-recall list.'
      : `Focus on ${sectionTitle}: revisit this concept and compare with the model answer.`;

    return `
      <article class="review-item ${statusClass}">
        <p class="review-tag">${statusText} | ${escapeHtml(sectionTitle)}</p>
        <p><strong>Q${idx + 1}.</strong> ${escapeHtml(item.q)}</p>
        <p><strong>Your answer:</strong> ${escapeHtml(selected)}</p>
        <p><strong>Correct answer:</strong> ${escapeHtml(item.a)}</p>
        <p><strong>Explanation:</strong> ${escapeHtml(guidance)}</p>
      </article>
    `;
  });

  return cards.join('');
}

function renderQuizStep() {
  if (!currentQuiz || !quizQuestion) return;
  const item = currentQuiz.items[currentQuiz.index];
  quizQuestion.innerHTML = buildQuizQuestionView(item, currentQuiz.index + 1, currentQuiz.items.length);

  const applySelectedState = () => {
    const labels = Array.from(quizQuestion.querySelectorAll('.quiz-option'));
    for (const label of labels) {
      const input = label.querySelector('input[name="quizOption"]');
      if (input && input.checked) {
        label.classList.add('selected');
      } else {
        label.classList.remove('selected');
      }
    }
  };

  const radios = Array.from(quizQuestion.querySelectorAll('input[name="quizOption"]'));
  applySelectedState();
  for (const radio of radios) {
    radio.addEventListener('change', () => {
      if (currentQuiz.lockedAnswers[currentQuiz.index]) {
        return;
      }

      const optionIndex = Number(radio.value);
      const chosen = currentQuiz.optionMap[currentQuiz.index][optionIndex];
      currentQuiz.answers[currentQuiz.index] = chosen;
      currentQuiz.lockedAnswers[currentQuiz.index] = true;

      for (const input of radios) {
        input.disabled = true;
      }

      applySelectedState();
    });
  }
}

function updateQuizTimer() {
  if (!currentQuiz || !quizTimer) return;
  const now = Date.now();
  const remainingMs = Math.max(0, currentQuiz.endsAt - now);
  const minutes = Math.floor(remainingMs / 60000);
  const seconds = Math.floor((remainingMs % 60000) / 1000);
  quizTimer.textContent = `Time left: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  if (remainingMs === 0) {
    finishQuiz(true);
  }
}

function finishQuiz(timeout = false) {
  if (!currentQuiz) return;
  const completedQuiz = {
    items: currentQuiz.items,
    answers: [...currentQuiz.answers]
  };

  if (quizIntervalId) {
    clearInterval(quizIntervalId);
    quizIntervalId = null;
  }

  let score = 0;
  lastWrongItems = [];
  completedQuiz.items.forEach((item, idx) => {
    const isCorrect = completedQuiz.answers[idx] === item.a;
    if (isCorrect) {
      score += 1;
      return;
    }
    lastWrongItems.push(item);
  });

  const attemptRecord = {
    timestamp: Date.now(),
    score,
    total: completedQuiz.items.length,
    pct: Math.round((score / completedQuiz.items.length) * 100),
    mode: currentQuiz && currentQuiz.mode ? currentQuiz.mode : 'normal'
  };
  historyItems.unshift(attemptRecord);
  historyItems = historyItems.slice(0, 30);

  for (let i = 0; i < completedQuiz.items.length; i += 1) {
    const item = completedQuiz.items[i];
    const metric = analyticsItems[item.sec] || { attempted: 0, correct: 0 };
    metric.attempted += 1;
    if (completedQuiz.answers[i] === item.a) {
      metric.correct += 1;
    }
    analyticsItems[item.sec] = metric;
  }
  saveQuizMetrics();
  renderHistoryPanel();
  renderAnalyticsPanel();

  const pct = Math.round((score / completedQuiz.items.length) * 100);
  if (quizStatus) {
    quizStatus.textContent = `${timeout ? 'Time up. ' : ''}Score: ${score}/${completedQuiz.items.length} (${pct}%). Review details are shown below.`;
  }

  if (retryWrong) {
    retryWrong.disabled = lastWrongItems.length === 0;
  }
  if (retryHint) {
    retryHint.textContent = lastWrongItems.length === 0
      ? 'Excellent. No wrong questions to retry from this attempt.'
      : `Retry set ready: ${lastWrongItems.length} question(s).`;
  }

  if (quizQuestion) {
    quizQuestion.innerHTML = '<p>Quiz complete. Start another attempt anytime.</p>';
  }

  if (quizReview) {
    quizReview.hidden = false;
    quizReview.innerHTML = buildQuizReviewMarkup(completedQuiz.items, completedQuiz.answers);
  }

  currentQuiz = null;
}

function beginQuiz() {
  beginQuizWithItems(null);
}

function beginQuizWithItems(overrideItems) {
  const requestedCount = Number(quizCount?.value || 15);
  const minutes = Number(quizMinutes?.value || 10);
  const baseItems = Array.isArray(overrideItems) && overrideItems.length > 0 ? overrideItems : QUESTIONS;
  const count = Math.min(requestedCount, baseItems.length);
  const selected = shuffleArray(baseItems).slice(0, count);

  currentQuiz = {
    items: selected,
    index: 0,
    answers: Array(count).fill(null),
    lockedAnswers: Array(count).fill(false),
    optionMap: {},
    endsAt: Date.now() + minutes * 60 * 1000,
    mode: baseItems !== QUESTIONS ? 'retry' : 'normal'
  };

  if (quizPanel) {
    quizPanel.hidden = false;
  }

  if (quizReview) {
    quizReview.hidden = true;
    quizReview.innerHTML = '';
  }

  if (retryWrong) {
    retryWrong.disabled = true;
  }
  if (retryHint) {
    retryHint.textContent = 'After submission, this button retries only incorrect/unanswered questions.';
  }

  if (quizStatus) {
    const retryLabel = baseItems !== QUESTIONS ? ' (retry mode)' : '';
    quizStatus.textContent = `Quiz started: ${count} questions in ${minutes} minutes${retryLabel}.`;
  }

  renderQuizStep();
  updateQuizTimer();

  if (quizIntervalId) {
    clearInterval(quizIntervalId);
  }
  quizIntervalId = setInterval(updateQuizTimer, 1000);
}

function applyTheme(theme) {
  document.body.setAttribute('data-theme', theme);
  if (themeToggle) {
    themeToggle.textContent = theme === 'dark' ? 'Switch to Light' : 'Switch to Dark';
  }
}

function initTheme() {
  const savedTheme = localStorage.getItem('ce274-theme');
  const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  applyTheme(savedTheme || preferred);
}

function exportTabToPdf(tabId) {
  if (!panels.some((panel) => panel.id === tabId)) return;
  activateTab(tabId, false);
  document.body.classList.add('printing');
  window.print();
}

for (const link of tabLinks) {
  link.addEventListener('click', (event) => {
    const tabId = link.dataset.tab;
    if (!tabId) return;
    event.preventDefault();
    activateTab(tabId);
  });
}

for (const button of pdfButtons) {
  button.addEventListener('click', () => {
    const tabId = button.dataset.export;
    if (!tabId) return;
    exportTabToPdf(tabId);
  });
}

if (questionSearch) {
  questionSearch.addEventListener('input', applyQuestionFilters);
}

if (sectionFilter) {
  sectionFilter.addEventListener('change', applyQuestionFilters);
}

if (clearFilters) {
  clearFilters.addEventListener('click', () => {
    if (questionSearch) questionSearch.value = '';
    if (sectionFilter) sectionFilter.value = 'all';
    applyQuestionFilters();
  });
}

if (startQuiz) {
  startQuiz.addEventListener('click', beginQuiz);
}

if (exportReviewPdf) {
  exportReviewPdf.addEventListener('click', exportReviewToPdfWindow);
}

if (nextQuizQuestion) {
  nextQuizQuestion.addEventListener('click', () => {
    if (!currentQuiz) return;
    if (currentQuiz.index < currentQuiz.items.length - 1) {
      currentQuiz.index += 1;
      renderQuizStep();
      return;
    }
    finishQuiz(false);
  });
}

if (submitQuiz) {
  submitQuiz.addEventListener('click', () => finishQuiz(false));
}

if (retryWrong) {
  retryWrong.addEventListener('click', () => {
    if (lastWrongItems.length === 0) return;
    beginQuizWithItems(lastWrongItems);
  });
}

window.addEventListener('afterprint', () => {
  document.body.classList.remove('printing');
});

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = document.body.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem('ce274-theme', next);
    applyTheme(next);
  });
}

loadRevisedState();
loadQuizMetrics();
renderQuestionBank();
updateRevisedCount();
renderHistoryPanel();
renderAnalyticsPanel();
initTheme();

window.addEventListener('hashchange', () => {
  const hash = window.location.hash.replace('#', '');
  if (hash && panels.some((panel) => panel.id === hash)) {
    activateTab(hash, false);
  }
});

const initialHash = window.location.hash.replace('#', '');
if (initialHash && panels.some((panel) => panel.id === initialHash)) {
  activateTab(initialHash, false);
} else {
  activateTab('cram', false);
}
