// src/resource/scripts/wynik.js
// Dynamiczne wstawianie wyniku do wynik.html z animowanym kołowym wskaźnikiem postępu

(() => {
  "use strict";

  const params = new URLSearchParams(window.location.search);
  const score = parseInt(params.get("score"), 10);
  const total = parseInt(params.get("total"), 10);

  const descriptionCard = document.querySelector(".description-card");
  const valueSpan = document.querySelector(".value");
  const circularProgress = document.querySelector(".circular-progress");

  if (isNaN(score) || isNaN(total) || !descriptionCard || !valueSpan || !circularProgress) return;

  const percent = Math.round((score / total) * 100);

  // Zaktualizuj tekst opisu i procentu
  descriptionCard.textContent = `Odpowiedziałeś poprawnie na ${score} z ${total} pytań`;
  valueSpan.textContent = `${percent}%`;

  // --- WSTRZYKNIĘCIE STYLI DLA OBWÓDKI ---
  const baseStyle = "";

  const styleTag = document.createElement("style");
  styleTag.textContent = baseStyle;
  document.head.appendChild(styleTag);

  // --- ANIMACJA WYPEŁNIENIA PROGRESU ---
  let current = 0;
  const duration = 1000; // 1 sekunda animacji
  const start = performance.now();

  const animate = (timestamp) => {
    const progress = Math.min((timestamp - start) / duration, 1);
    current = percent * progress;
    circularProgress.style.background = `conic-gradient(var(--accent-color, var(--color-1)) ${current * 3.6}deg, var(--background-1) 0deg)`;
    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      circularProgress.style.background = `conic-gradient(var(--accent-color, var(--color-1)) ${percent * 3.6}deg, var(--background-1) 0deg)`;
    }
  };

  requestAnimationFrame(animate);
})();
