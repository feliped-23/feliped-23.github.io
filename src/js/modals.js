/*
=======================================
  Modal Component
  Felipe Diaz Website
=======================================
*/

/**
 * Modal functionality for project details.
 * Supports URL hash deep linking: resume.html#exp-miru-modal opens that modal directly.
 */
export const initModals = () => {
  const CLOSE_SELECTOR = "[data-close-modal]";
  let lastFocused = null;
  let _suppressHashUpdate = false;

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

  // Hash-aware wrappers — update the URL when opening/closing modals
  const openModalWithHash = (modal) => {
    if (!modal) return;
    openModal(modal);
    if (!_suppressHashUpdate && modal.id) {
      history.pushState(null, '', '#' + modal.id);
    }
  };

  const closeModalWithHash = (modal) => {
    if (!modal) return;
    closeModal(modal);
    if (!_suppressHashUpdate) {
      history.pushState(null, '', location.pathname + location.search);
    }
  };

  // Whole-card click — uses event delegation so cloned cards in the type view are covered
  document.addEventListener('click', (e) => {
    const card = e.target.closest('.tl-card.is-clickable');
    if (!card) return;
    if (e.target.closest('a, button')) return;
    const sel = card.getAttribute('data-modal-target');
    if (!sel) return;
    openModalWithHash(document.querySelector(sel));
  });

  // Any element with data-modal-target (explicit trigger buttons)
  document.querySelectorAll("[data-modal-target]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const sel = btn.getAttribute("data-modal-target");
      if (!sel) return;
      openModalWithHash(document.querySelector(sel));
      e.stopPropagation();
    });
  });

  // Close clicks (delegated — covers dynamically added close buttons too)
  document.addEventListener("click", (e) => {
    const el = e.target;
    if (!(el instanceof Element)) return;
    if (el.matches(CLOSE_SELECTOR)) {
      closeModalWithHash(el.closest(".modal"));
    }
  });

  // ESC key to close
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.querySelectorAll(".modal.open").forEach(m => closeModalWithHash(m));
    }
  });

  // Backdrop click to close
  document.querySelectorAll(".modal__backdrop").forEach(bg => {
    bg.addEventListener("click", () => closeModalWithHash(bg.closest(".modal")));
  });

  // Browser back/forward navigation
  window.addEventListener('popstate', () => {
    _suppressHashUpdate = true;
    document.querySelectorAll('.modal.open').forEach(m => closeModal(m));
    const hash = window.location.hash;
    if (hash) {
      const target = document.querySelector(hash);
      if (target && target.classList.contains('modal')) openModal(target);
    }
    _suppressHashUpdate = false;
  });

  // On page load, open modal if the URL already contains a matching hash
  const initialHash = window.location.hash;
  if (initialHash) {
    const target = document.querySelector(initialHash);
    if (target && target.classList.contains('modal')) {
      _suppressHashUpdate = true;
      openModal(target);
      _suppressHashUpdate = false;
    }
  }

  // Smooth scroll for "Jump to Resume" link
  document.querySelectorAll('a[href="#resume-pdf"]').forEach(a => {
    a.addEventListener("click", (e) => {
      const target = document.getElementById("resume-pdf");
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
};
