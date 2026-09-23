// Viktorina — page logic

const ROUND_SECONDS = 15;
const VOTES_NEEDED = 5;
const APPROVE_LEVEL = 3;
const LEVEL_THRESHOLDS = [0, 10, 30, 60, 100]; // litai needed for levels 1–5
const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const $ = (selector) => document.querySelector(selector);

/* ---------- Storage (may be blocked, so every call is guarded) ---------- */
const store = {
  get(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value === null ? fallback : JSON.parse(value);
    } catch (e) {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      /* ignore */
    }
  },
};

/* ---------- Theme toggle ---------- */
function initTheme() {
  const root = document.documentElement;
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)");

  $("#theme-toggle").addEventListener("click", () => {
    const current = root.dataset.theme || (systemDark.matches ? "dark" : "light");
    const next = current === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
      localStorage.setItem("viktorina-theme", next);
    } catch (e) {
      /* ignore */
    }
  });
}

/* ---------- Clock ---------- */
function initClock() {
  const clock = $("#clock");
  const pad = (n) => String(n).padStart(2, "0");
  const tick = () => {
    const now = new Date();
    clock.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  };
  tick();
  setInterval(tick, 1000);
}

/* ---------- Ticker: duplicate items so the loop is seamless ---------- */
function initTicker() {
  const track = $("#ticker");
  [...track.children].forEach((item) => {
    const copy = item.cloneNode(true);
    copy.setAttribute("aria-hidden", "true");
    track.appendChild(copy);
  });
}

/* ---------- Button ripple ---------- */
function initRipple() {
  document.addEventListener("pointerdown", (event) => {
    const button = event.target.closest(".btn");
    if (!button || REDUCED_MOTION) return;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const ripple = document.createElement("span");
    ripple.className = "ripple";
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
    button.appendChild(ripple);
    ripple.addEventListener("animationend", () => ripple.remove());
  });
}

/* ---------- Count-up numbers ---------- */
function animateNumber(element, to, { from = 0, suffix = "", duration = 1200 } = {}) {
  if (REDUCED_MOTION) {
    element.textContent = `${to}${suffix}`;
    return;
  }
  const start = performance.now();
  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = `${Math.round(from + (to - from) * eased)}${suffix}`;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/* ---------- Reveal on scroll ---------- */
function initReveal() {
  const items = document.querySelectorAll(".reveal");
  const counters = document.querySelectorAll("[data-count]");

  if (!("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("is-visible"));
    counters.forEach((c) => (c.textContent = `${c.dataset.count}${c.dataset.suffix || ""}`));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        entry.target.querySelectorAll("[data-count]").forEach((counter) => {
          animateNumber(counter, Number(counter.dataset.count), { suffix: counter.dataset.suffix || "" });
        });
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15 }
  );

  items.forEach((item, i) => {
    item.style.transitionDelay = `${(i % 5) * 70}ms`;
    observer.observe(item);
  });
}

/* ---------- Player ---------- */
const player = {
  balance: store.get("viktorina-balance", 0),
  nickname: store.get("viktorina-nick", null) || generateNickname(),
};

function levelFor(balance) {
  let level = 1;
  LEVEL_THRESHOLDS.forEach((threshold, i) => {
    if (balance >= threshold) level = i + 1;
  });
  return level;
}

function renderPlayer(previousBalance = player.balance) {
  const level = levelFor(player.balance);
  animateNumber($("#player-balance"), player.balance, { from: previousBalance, duration: 600 });
  $("#player-level").textContent = level;
  $("#player-nick").textContent = player.nickname;

  const bar = $("#level-bar");
  const hint = $("#level-hint");
  if (level >= LEVEL_THRESHOLDS.length) {
    bar.style.transform = "scaleX(1)";
    hint.textContent = "Pasiektas aukščiausias lygis!";
  } else {
    const low = LEVEL_THRESHOLDS[level - 1];
    const high = LEVEL_THRESHOLDS[level];
    bar.style.transform = `scaleX(${(player.balance - low) / (high - low)})`;
    hint.textContent = `Iki ${level + 1} lygio: ${high - player.balance} Lt`;
  }
  renderQueue();
}

function addLitai(amount) {
  const previous = player.balance;
  player.balance += amount;
  store.set("viktorina-balance", player.balance);
  renderPlayer(previous);
}

function initPlayer() {
  store.set("viktorina-nick", player.nickname);
  renderPlayer(0);

  $("#nick-button").addEventListener("click", () => {
    player.nickname = generateNickname();
    store.set("viktorina-nick", player.nickname);
    $("#player-nick").textContent = player.nickname;
  });

  $("#password-button").addEventListener("click", () => {
    $("#password").textContent = `Siūlomas slaptažodis: ${generatePassword()}`;
  });
}

/* ---------- Quiz ---------- */
const quiz = {
  pool: [],
  order: [],
  index: -1,
  round: 0,
  value: 1,
  streak: 0,
  deadline: 0,
  frame: 0,
  locked: false,
};

function normalize(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildPool() {
  quiz.pool = [...QUESTIONS, ...store.get("viktorina-approved", [])];
  const stat = $("#stat-questions");
  stat.dataset.count = quiz.pool.length;
  if (stat.closest(".is-visible")) stat.textContent = quiz.pool.length;
}

function nextQuestion() {
  if (quiz.index + 1 >= quiz.order.length) {
    quiz.order = shuffle(quiz.pool);
    quiz.index = -1;
  }
  quiz.index += 1;
  quiz.round += 1;
  quiz.value = Math.floor(Math.random() * 5) + 1;
  quiz.locked = false;

  const question = $("#quiz-question");
  question.textContent = quiz.order[quiz.index].question;
  question.classList.remove("is-in");
  void question.offsetWidth; // restart the animation
  question.classList.add("is-in");

  const coin = $("#quiz-value");
  coin.textContent = `${quiz.value} Lt`;
  coin.classList.remove("is-bump");
  void coin.offsetWidth;
  coin.classList.add("is-bump");

  $("#quiz-progress").textContent = `Klausimas ${String(quiz.round).padStart(2, "0")}`;
  $("#quiz-feedback").textContent = "";
  $("#quiz-feedback").className = "quiz__feedback";
  $("#quiz-answer").value = "";

  startTimer();
}

function startTimer() {
  cancelAnimationFrame(quiz.frame);
  quiz.deadline = performance.now() + ROUND_SECONDS * 1000;
  const bar = $("#timer-bar");
  const text = $("#timer-text");

  const step = (now) => {
    const left = Math.max(quiz.deadline - now, 0);
    const ratio = left / (ROUND_SECONDS * 1000);
    bar.style.transform = `scaleX(${ratio})`;
    bar.classList.toggle("is-low", ratio < 0.3);
    text.textContent = Math.ceil(left / 1000);
    if (left > 0) {
      quiz.frame = requestAnimationFrame(step);
    } else {
      finishRound(false, "Laikas baigėsi!");
    }
  };
  quiz.frame = requestAnimationFrame(step);
}

function finishRound(correct, message) {
  if (quiz.locked) return;
  quiz.locked = true;
  cancelAnimationFrame(quiz.frame);

  const feedback = $("#quiz-feedback");
  const answer = quiz.order[quiz.index].answers[0];

  if (correct) {
    quiz.streak += 1;
    addLitai(quiz.value);
    feedback.textContent = `Teisingai! +${quiz.value} Lt`;
    feedback.classList.add("is-ok");
  } else {
    quiz.streak = 0;
    feedback.textContent = `${message} Teisingas atsakymas: ${answer}.`;
    feedback.classList.add("is-bad");
  }
  $("#quiz-streak").textContent = quiz.streak;
  setTimeout(nextQuestion, correct ? 1400 : 2600);
}

function initQuiz() {
  buildPool();
  quiz.order = shuffle(quiz.pool);

  $("#quiz-form").addEventListener("submit", (event) => {
    event.preventDefault();
    if (quiz.locked) return;
    const input = $("#quiz-answer");
    const guess = normalize(input.value);
    if (!guess) return;

    const correct = quiz.order[quiz.index].answers.some((a) => normalize(a) === guess);
    if (correct) {
      finishRound(true);
    } else {
      input.classList.remove("is-shake");
      void input.offsetWidth;
      input.classList.add("is-shake");
      finishRound(false, "Neteisingai.");
    }
  });

  $("#quiz-skip").addEventListener("click", () => {
    cancelAnimationFrame(quiz.frame);
    quiz.streak = 0;
    $("#quiz-streak").textContent = 0;
    nextQuestion();
  });

  nextQuestion();
}

/* ---------- Question queue ---------- */
let queue = store.get("viktorina-queue", []);

function saveQueue() {
  store.set("viktorina-queue", queue);
}

function renderQueue() {
  const list = $("#queue-list");
  const level = levelFor(player.balance);
  list.textContent = "";

  queue.forEach((item) => {
    const li = document.createElement("li");
    li.className = "queue__item";

    const text = document.createElement("p");
    text.textContent = item.question;

    const meta = document.createElement("span");
    meta.className = "queue__meta mono muted";
    meta.textContent = `Balsai: ${item.votes}/${VOTES_NEEDED}`;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "btn btn--small";

    if (item.votes < VOTES_NEEDED) {
      button.classList.add("btn--ghost");
      button.textContent = "+1 balsas";
      button.addEventListener("click", () => {
        item.votes += 1;
        saveQueue();
        renderQueue();
      });
    } else if (level >= APPROVE_LEVEL) {
      button.classList.add("btn--primary");
      button.textContent = "Patvirtinti";
      button.addEventListener("click", () => approve(item));
    } else {
      button.classList.add("btn--ghost");
      button.textContent = `Tvirtina nuo L${APPROVE_LEVEL}`;
      button.disabled = true;
    }

    li.append(text, meta, button);
    list.appendChild(li);
  });

  $("#queue-count").textContent = queue.length;
  $("#queue-empty").hidden = queue.length > 0;
}

function approve(item) {
  queue = queue.filter((q) => q !== item);
  saveQueue();

  const approved = store.get("viktorina-approved", []);
  approved.push({ question: item.question, answers: [item.answer] });
  store.set("viktorina-approved", approved);

  buildPool();
  quiz.order.push({ question: item.question, answers: [item.answer] });
  addLitai(1);
}

function initQueue() {
  const form = $("#new-question-form");
  const question = $("#nq-question");
  const answer = $("#nq-answer");
  const error = $("#nq-error");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    let text = question.value.trim().replace(/\s+/g, " ");
    const reply = answer.value.trim().replace(/\s+/g, " ");

    if (text.length < 8) {
      error.textContent = "Klausimas per trumpas — parašyk bent 8 simbolius.";
      question.focus();
      return;
    }
    if (!reply) {
      error.textContent = "Neįrašytas atsakymas.";
      answer.focus();
      return;
    }

    if (!text.endsWith("?")) text += "?";
    text = text.charAt(0).toUpperCase() + text.slice(1);

    error.textContent = "";
    queue.push({ question: text, answer: reply, votes: 0 });
    saveQueue();
    form.reset();
    addLitai(10); // reward for a neatly written question
  });

  renderQueue();
}

/* ---------- Chat ---------- */
const HOST_REPLIES = [
  "Gera mintis!",
  "Nepamiršk — už įrašytą klausimą gausi 10 Lt.",
  "Tavo serija auga, taip ir toliau!",
  "Pabandyk dar vieną klausimą.",
  "Nuo 3 lygio galėsi tvirtinti kitų klausimus.",
];

function addMessage(text, mine) {
  const list = $("#chat-list");
  const now = new Date();
  const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  const li = document.createElement("li");
  li.className = mine ? "msg msg--me" : "msg";

  const avatar = document.createElement("img");
  avatar.className = "avatar";
  avatar.src = mine ? "images/avatar-alex-doe.svg" : "images/avatar-quizmaster.svg";
  avatar.alt = mine ? "Alex Doe avataras" : "Viktorinos vedėjo avataras";
  avatar.width = 36;
  avatar.height = 36;

  const bubble = document.createElement("div");
  bubble.className = "msg__bubble";
  const p = document.createElement("p");
  p.textContent = text;
  const stamp = document.createElement("span");
  stamp.className = "msg__time mono";
  stamp.textContent = time;
  bubble.append(p, stamp);

  li.append(avatar, bubble);
  list.appendChild(li);
  list.scrollTop = list.scrollHeight;
}

function initChat() {
  $("#chat-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const input = $("#chat-input");
    const text = input.value.trim();
    if (!text) return;
    addMessage(text, true);
    input.value = "";
    setTimeout(() => addMessage(pick(HOST_REPLIES), false), 900);
  });
}

/* ---------- Start ---------- */
initTheme();
initClock();
initTicker();
initRipple();
initPlayer();
initQuiz();
initQueue();
initChat();
initReveal();
