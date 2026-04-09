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
  { sec: 'q-fundamentals', q: 'What makes Java platform-independent?', a: 'Java compiles to bytecode that runs on any machine with a compatible JVM.' },
  { sec: 'q-fundamentals', q: 'What is the main purpose of JDK?', a: 'It provides development tools like javac and java for compiling and running programs.' },
  { sec: 'q-fundamentals', q: 'Difference between source code and bytecode?', a: 'Source code is human-written .java text; bytecode is compiled .class instructions for JVM.' },
  { sec: 'q-fundamentals', q: 'Name two Java IDEs used in class.', a: 'Examples are Eclipse and IntelliJ IDEA.' },
  { sec: 'q-fundamentals', q: 'What is a compiler error?', a: 'A syntax/type issue detected before execution by the compiler.' },
  { sec: 'q-fundamentals', q: 'What is a runtime error?', a: 'An error that occurs while the program executes, such as divide-by-zero.' },
  { sec: 'q-fundamentals', q: 'What does API stand for in Java context?', a: 'Application Programming Interface, a set of ready-made classes and methods.' },

  { sec: 'q-elementary', q: 'What are local variables?', a: 'Variables declared inside methods and accessible only within that method block.' },
  { sec: 'q-elementary', q: 'What are instance variables?', a: 'Fields declared in a class, outside methods, belonging to each object instance.' },
  { sec: 'q-elementary', q: 'What are static variables?', a: 'Class-level fields shared by all objects of that class.' },
  { sec: 'q-elementary', q: 'Why can integer division cause wrong answers?', a: 'Because int/int truncates decimals, e.g., 5/2 becomes 2.' },
  { sec: 'q-elementary', q: 'When should you use double instead of int?', a: 'When values may contain fractional parts or need decimal precision.' },
  { sec: 'q-elementary', q: 'How do you read integer input from keyboard?', a: 'Use Scanner and call nextInt().' },
  { sec: 'q-elementary', q: 'What is operator precedence?', a: 'Rules that determine evaluation order, like multiplication before addition.' },

  { sec: 'q-math-strings', q: 'Why convert degrees to radians for trig in Java?', a: 'Math.sin/cos/tan expect radians, not degrees.' },
  { sec: 'q-math-strings', q: 'How can you convert degrees to radians?', a: 'Use Math.toRadians(degrees).' },
  { sec: 'q-math-strings', q: 'What does char represent?', a: 'A single 16-bit Unicode character value.' },
  { sec: 'q-math-strings', q: 'How is a String different from char?', a: 'String stores a sequence of characters, while char stores one character.' },
  { sec: 'q-math-strings', q: 'Correct way to compare String content?', a: 'Use equals() or equalsIgnoreCase(), not ==.' },
  { sec: 'q-math-strings', q: 'How do you get part of a string?', a: 'Use substring(start, end) or substring(start).' },
  { sec: 'q-math-strings', q: 'How convert String to int?', a: 'Use Integer.parseInt(text).' },

  { sec: 'q-control', q: 'When is if-else preferred?', a: 'For range-based or complex boolean conditions.' },
  { sec: 'q-control', q: 'When is switch preferred?', a: 'When choosing among many discrete cases of one expression.' },
  { sec: 'q-control', q: 'Difference between while and do-while?', a: 'while checks condition first; do-while executes body at least once.' },
  { sec: 'q-control', q: 'When should for loop be used?', a: 'When iteration count or index progression is known.' },
  { sec: 'q-control', q: 'What does break do in loop or switch?', a: 'It exits the nearest loop/switch immediately.' },
  { sec: 'q-control', q: 'What does continue do?', a: 'It skips current loop iteration and proceeds to next iteration.' },
  { sec: 'q-control', q: 'What is a sentinel-controlled loop?', a: 'A loop that ends when a special stop value is entered.' },

  { sec: 'q-exceptions', q: 'Why use exception handling?', a: 'To prevent crashes and handle abnormal cases safely.' },
  { sec: 'q-exceptions', q: 'What is try-catch used for?', a: 'Wrapping risky code and handling specific exceptions if they occur.' },
  { sec: 'q-exceptions', q: 'What does finally block do?', a: 'Runs cleanup code whether exception occurs or not.' },
  { sec: 'q-exceptions', q: 'What is InputMismatchException?', a: 'Thrown when Scanner receives data of unexpected type.' },
  { sec: 'q-exceptions', q: 'Why ask user to re-enter values after exception?', a: 'It improves robustness and keeps program flow usable.' },
  { sec: 'q-exceptions', q: 'Role of File class in Java I/O?', a: 'Represents file/directory paths and metadata operations.' },
  { sec: 'q-exceptions', q: 'Difference between Scanner and PrintWriter for files?', a: 'Scanner reads input; PrintWriter writes formatted text output.' },

  { sec: 'q-ds', q: 'What is an array?', a: 'A fixed-size indexed structure storing same-type values.' },
  { sec: 'q-ds', q: 'How is ArrayList better than array in some cases?', a: 'It resizes dynamically and provides insertion/removal methods.' },
  { sec: 'q-ds', q: 'When should Set be used?', a: 'When duplicate values must be automatically eliminated.' },
  { sec: 'q-ds', q: 'What is a HashMap?', a: 'A key-value collection optimized for fast average lookup.' },
  { sec: 'q-ds', q: 'How do you traverse an array?', a: 'Use for loop or enhanced for loop over elements.' },
  { sec: 'q-ds', q: 'What is a multidimensional array?', a: 'An array whose elements are arrays, useful for tables/matrices.' },
  { sec: 'q-ds', q: 'Map one practical use of HashMap in CE 277.', a: 'Store student ID as key and score/object as value.' },

  { sec: 'q-oop', q: 'What is a class?', a: 'A blueprint defining fields and methods for objects.' },
  { sec: 'q-oop', q: 'What is an object?', a: 'A runtime instance created from a class blueprint.' },
  { sec: 'q-oop', q: 'Purpose of constructors?', a: 'Initialize object state during creation.' },
  { sec: 'q-oop', q: 'What is encapsulation?', a: 'Hiding data fields and exposing controlled access via methods.' },
  { sec: 'q-oop', q: 'What does this keyword refer to?', a: 'The current object instance.' },
  { sec: 'q-oop', q: 'Difference between static and instance method?', a: 'Static belongs to class; instance belongs to object and can access instance state.' },
  { sec: 'q-oop', q: 'What is method overloading?', a: 'Same method name with different parameter lists in one class.' },

  { sec: 'q-app', q: 'What is Java Swing?', a: 'A Java GUI toolkit for building desktop interfaces.' },
  { sec: 'q-app', q: 'What is JavaFX in relation to Swing?', a: 'Another Java UI framework, often more modern in architecture and styling.' },
  { sec: 'q-app', q: 'What is event handling?', a: 'Running specific code when user actions like clicks occur.' },
  { sec: 'q-app', q: 'What is an event handler?', a: 'A method/listener attached to a component event.' },
  { sec: 'q-app', q: 'Why package as runnable JAR?', a: 'To distribute and execute the application more easily.' },
  { sec: 'q-app', q: 'What is a common GUI workflow in IDE?', a: 'Design components, set properties, connect handlers, then test and package.' },
  { sec: 'q-app', q: 'One capstone feature combining CE 277 topics?', a: 'GUI form input validated by exceptions and stored in ArrayList/HashMap-backed classes.' }
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

function buildQuizQuestionView(item, displayNumber, totalQuestions) {
  const isLocked = currentQuiz && Array.isArray(currentQuiz.lockedAnswers)
    ? currentQuiz.lockedAnswers[currentQuiz.index] === true
    : false;

  const options = shuffleArray([
    item.a,
    ...shuffleArray(QUESTIONS.filter((q) => q.a !== item.a)).slice(0, 3).map((q) => q.a)
  ]);

  const optionMarkup = options
    .map((opt, idx) => {
      const checked = currentQuiz.answers[currentQuiz.index] === opt ? 'checked' : '';
      const disabled = isLocked ? 'disabled' : '';
      return `
        <label class="quiz-option">
          <input type="radio" name="quizOption" value="${idx}" ${checked} ${disabled}>
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
    const isCorrect = selected === item.a;
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
