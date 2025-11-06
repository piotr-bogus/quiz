// src/resource/scripts/quiz.js
// Profesjonalny, wydajny, czysty JS (ES6+), z wstrzykniętymi stylami i domyślnym ukryciem .answer-card
(() => {
  "use strict";

  const QUESTIONS_JSON = "src/resource/data/questions.json";
  const FEEDBACK_MS = 2000;

  const descriptionCard = document.querySelector(".description-card");
  const titleCard = document.querySelector(".title-card");
  const inputEl = document.querySelector(".inp-card");
  const answerCard = document.querySelector(".answer-card");

  if (!descriptionCard || !titleCard || !inputEl || !answerCard) {
    console.error("quiz.js: Brakuje wymaganego elementu DOM (description-card, title-card, inp-card, answer-card).");
    return;
  }

  // --- WSTRZYKUJEMY STYLE DLA .answer-card ---
  const styleTag = document.createElement("style");
  styleTag.textContent = `
    .answer-card {
      display: none;
      text-align: center;
      padding: 8px 16px;
      border-radius: 999px;
      font-size: 16px;
    }

    .answer-card.correct {
      background-color: #50C87830;
      color: #50C878;
      display: block;
    }

    .answer-card.incorrect {
      background-color: #ED433730;
      color: #ED4337;
      display: block;
    }
  `;
  document.head.appendChild(styleTag);

  // --- STAN QUIZU ---
  let questions = [];
  let order = [];
  let currentIdx = 0;
  let correctCount = 0;
  let total = 0;
  let acceptingInput = true;

  const shuffleInPlace = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const setText = (el, text) => {
    el.textContent = text;
  };

  const redirectToResult = (score, totalQuestions) => {
    const url = new URL(window.location.origin + "/wynik.html");
    url.searchParams.set("score", String(score));
    url.searchParams.set("total", String(totalQuestions));
    window.location.href = url.toString();
  };

  const showQuestion = (indexInOrder) => {
    const qIndex = order[indexInOrder];
    const q = questions[qIndex];
    if (!q) return;

    setText(descriptionCard, `Pytanie ${indexInOrder + 1} z ${total}`);
    setText(titleCard, q.question);
    inputEl.value = "";

    // Ukryj answer-card do czasu nowej odpowiedzi
    answerCard.style.display = "none";
    answerCard.className = "answer-card";
    answerCard.textContent = "";

    inputEl.focus();
    acceptingInput = true;
  };

  const handleAnswer = async () => {
    if (!acceptingInput) return;
    acceptingInput = false;

    const userAnswer = inputEl.value.trim();
    const qIndex = order[currentIdx];
    const q = questions[qIndex];
    const isCorrect = userAnswer && userAnswer === q.answer;

    if (isCorrect) correctCount++;

    // Pokaż answer-card
    answerCard.className = `answer-card ${isCorrect ? "correct" : "incorrect"}`;
    answerCard.textContent = isCorrect ? "Poprawna odpowiedź" : `Poprawna odpowiedź: ${q.answer}`;
    answerCard.style.display = "block";

    await new Promise((r) => setTimeout(r, FEEDBACK_MS));

    currentIdx++;
    if (currentIdx < total) {
      showQuestion(currentIdx);
    } else {
      redirectToResult(correctCount, total);
    }
  };

  const loadQuestions = async () => {
    try {
      const resp = await fetch(QUESTIONS_JSON, { cache: "no-store" });
      if (!resp.ok) throw new Error(`fetch error: ${resp.status}`);
      const data = await resp.json();
      if (!Array.isArray(data) || data.length === 0) throw new Error("Brak pytań w pliku JSON.");

      questions = data.filter((q) => q && typeof q.question === "string" && typeof q.answer === "string");
      total = questions.length;
      order = shuffleInPlace(Array.from({ length: total }, (_, i) => i));
      currentIdx = 0;
      correctCount = 0;

      showQuestion(0);
    } catch (e) {
      console.error("Błąd ładowania pytań:", e);
      setText(descriptionCard, "Błąd ładowania pytań.");
      setText(titleCard, "");
    }
  };

  inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAnswer();
    }
  });

  document.addEventListener("DOMContentLoaded", loadQuestions);
})();
