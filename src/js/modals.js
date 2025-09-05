/* 
=======================================
  Modal Component
  Felipe Diaz Website
=======================================
*/

/**
 * Modal functionality for project details
 */
export const initModals = () => {
  const modals = document.querySelectorAll(".modal");
  const CLOSE_SELECTOR = "[data-close-modal]";
  let lastFocused = null;

  const openModal = (modal) => {
    if (!modal) return;
    lastFocused = document.activeElement;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
    const closeBtn = modal.querySelector(".modal__close") || modal.querySelector(CLOSE_SELECTOR);
    if (closeBtn) closeBtn.focus();
  };

  const closeModal = (modal) => {
    if (!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
    if (lastFocused && document.contains(lastFocused)) lastFocused.focus();
  };

  // Whole-card click (only if the card is marked clickable and has a target)
  document.querySelectorAll(".tl-card.is-clickable").forEach(card => {
    card.addEventListener("click", (e) => {
      // ignore clicks on links/buttons inside the card
      const t = e.target;
      if (t.closest("a,button")) return;
      const sel = card.getAttribute("data-modal-target");
      if (!sel) return;
      const modal = document.querySelector(sel);
      openModal(modal);
    });
  });

  // Any element with data-modal-target still works (fallback)
  document.querySelectorAll("[data-modal-target]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const sel = btn.getAttribute("data-modal-target");
      if (!sel) return;
      const modal = document.querySelector(sel);
      openModal(modal);
      e.stopPropagation();
    });
  });

  // Close clicks
  document.addEventListener("click", (e) => {
    const el = e.target;
    if (!(el instanceof Element)) return;
    if (el.matches(CLOSE_SELECTOR)) {
      closeModal(el.closest(".modal"));
    }
  });

  // ESC key to close
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.querySelectorAll(".modal.open").forEach(m => closeModal(m));
    }
  });

  // Backdrop click to close
  document.querySelectorAll(".modal__backdrop").forEach(bg => {
    bg.addEventListener("click", () => closeModal(bg.closest(".modal")));
  });

  // Smooth scroll for "Jump to Resume"
  document.querySelectorAll('a[href="#resume-pdf"]').forEach(a => {
    a.addEventListener("click", (e) => {
      const target = document.getElementById("resume-pdf");
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
};
