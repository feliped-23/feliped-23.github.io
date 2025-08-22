/**
 * Felipe Diaz — Global client-side scripts
 * Move all inline <script> blocks into this single file.
 * Include on every page: <script src="script.js" defer></script>
 *
 * Sections:
 * 1) Utilities (ready, mq helpers)
 * 2) Footer year
 * 3) Mobile nav toggle
 * 4) Reveal-on-scroll animations
 * 5) Dropdown (desktop: CSS hover; mobile: click-toggle)
 * 6) Resume project modals (open/close/ESC/backdrop)
 * 7) Contact form → mailto: handler
 */

// ========== 1) Utilities ==========
const onReady = (fn) => {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fn, { once: true });
  } else {
    fn();
  }
};
const isDesktop = () => window.matchMedia("(min-width: 821px)").matches;

// ========== 2) Footer year ==========
onReady(() => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

// ========== 3) Mobile nav toggle ==========
onReady(() => {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!expanded));
    nav.classList.toggle("open");
    document.body.classList.toggle("no-scroll", !expanded);
  });
});

// ========== 4) Reveal-on-scroll animations ==========
onReady(() => {
  if (!("IntersectionObserver" in window)) {
    // Fallback: reveal everything if IO isn't supported
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("in"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  document
    .querySelectorAll(".reveal, .section-panel, .exp-card, .card")
    .forEach((el) => io.observe(el));
});

// ========== 5) Dropdown (mobile click-toggle) ==========
// Your CSS already shows the dropdown on hover for desktop.
// This script adds a tap/click toggle for mobile widths.
onReady(() => {
  const dropdownLis = Array.from(document.querySelectorAll(".dropdown"));
  if (!dropdownLis.length) return;

  const anchorFor = (li) => li.querySelector(":scope > a");
  const closeAll = () => {
    dropdownLis.forEach((li) => {
      li.classList.remove("open");
      const a = anchorFor(li);
      if (a) a.setAttribute("aria-expanded", "false");
    });
  };

  // Toggle on click (only mobile)
  dropdownLis.forEach((li) => {
    const a = anchorFor(li);
    if (!a) return;
    a.addEventListener("click", (e) => {
      if (isDesktop()) return; // desktop uses hover via CSS
      e.preventDefault();
      const isOpen = li.classList.toggle("open");
      a.setAttribute("aria-expanded", String(isOpen));
    });
  });

  // Close when clicking outside (mobile)
  document.addEventListener("click", (e) => {
    if (isDesktop()) return;
    const clickedInside = dropdownLis.some((li) => li.contains(e.target));
    if (!clickedInside) closeAll();
  });

  // Keep state sane when resizing between mobile/desktop
  window.addEventListener("resize", () => {
    if (isDesktop()) closeAll();
  });

  // Extra safety: when pointer leaves dropdown on desktop, ensure closed
  dropdownLis.forEach((li) => {
    li.addEventListener("mouseleave", () => {
      if (isDesktop()) closeAll();
    });
  });
});

// ========== 6) Resume project modals ==========
// Only runs on pages that include elements with [data-modal-target] / .modal
onReady(() => {
  const openButtons = document.querySelectorAll("[data-modal-target]");
  const modals = document.querySelectorAll(".modal");
  if (!openButtons.length && !modals.length) return;

  const CLOSE_SELECTOR = "[data-close-modal]";
  let lastFocused = null;

  const openModal = (modal) => {
    if (!modal) return;
    lastFocused = document.activeElement;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
    const closeBtn =
      modal.querySelector(".modal__close") || modal.querySelector(CLOSE_SELECTOR);
    closeBtn && closeBtn.focus();
  };

  const closeModal = (modal) => {
    if (!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
    if (lastFocused && document.contains(lastFocused)) {
      lastFocused.focus();
    }
  };

  // Open buttons
  openButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const sel = btn.getAttribute("data-modal-target");
      const modal = document.querySelector(sel);
      openModal(modal);
    });
  });

  // Close clicks
  document.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;
    if (target.matches(CLOSE_SELECTOR)) {
      const modal = target.closest(".modal");
      closeModal(modal);
    }
  });

  // ESC key closes any open modal
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.querySelectorAll(".modal.open").forEach((m) => closeModal(m));
    }
  });

  // Backdrop click
  document.querySelectorAll(".modal__backdrop").forEach((bg) => {
    bg.addEventListener("click", () => {
      const modal = bg.closest(".modal");
      closeModal(modal);
    });
  });
});

// ========== 7) Contact form → mailto: (no backend) ==========
// Only runs on the Contact page where #contactForm exists
onReady(() => {
  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = (document.getElementById("name")?.value || "").trim();
    const fromEmail = (document.getElementById("email")?.value || "").trim();
    const subject = (document.getElementById("subject")?.value || "").trim();
    const message = (document.getElementById("message")?.value || "").trim();

    const to = "felipeandres2304@gmail.com"; // Change if needed
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${fromEmail}\n\n${message}`);
    const mailto = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${body}`;
    window.location.href = mailto;
  });
});
