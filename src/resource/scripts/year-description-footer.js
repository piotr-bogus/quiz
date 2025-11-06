"use strict";

(async () => {
  async function init() {
    try {
      if (document.readyState === "loading") {
        await new Promise((resolve) => {
          document.addEventListener("DOMContentLoaded", resolve, { once: true });
        });
      }

      const el = document.querySelector(".year-description-footer");

      if (!el) return;

      const year = String(new Date().getFullYear());

      el.textContent = year;
    } catch (error) {
      console.error("footer-year: nie udało się ustawić roku", error);
    }
  }

  await init();
})();
