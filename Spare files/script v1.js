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

// ========== 5) Dropdown (mobile: arrow-only toggle; link navigates) ==========
onReady(() => {
  const dropdownLis = Array.from(document.querySelectorAll(".dropdown"));
  if (!dropdownLis.length) return;

  const isMobile = () => !isDesktop(); // you already have isDesktop()

  const closeAll = () => {
    dropdownLis.forEach((li) => {
      li.classList.remove("open");
      const link   = li.querySelector(":scope > a");
      const toggle = li.querySelector(":scope > .submenu-toggle");
      if (link)   link.setAttribute("aria-expanded", "false");
      if (toggle) toggle.setAttribute("aria-expanded", "false");
    });
  };

  dropdownLis.forEach((li) => {
    const link   = li.querySelector(":scope > a");                 // "Research"
    const toggle = li.querySelector(":scope > .submenu-toggle");   // chevron
    const menu   = li.querySelector(":scope > .dropdown-menu");    // submenu

    if (!toggle || !menu) return;

    // 1) Arrow toggles submenu (MOBILE ONLY)
    toggle.addEventListener("click", (e) => {
      if (!isMobile()) return; // desktop hover handles it
      e.preventDefault();
      e.stopPropagation();
      const isOpen = li.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      if (link) link.setAttribute("aria-expanded", String(isOpen));
    });

    // 2) Link should NAVIGATE normally (no preventDefault!)
    if (link) {
      link.addEventListener("click", (e) => {
        // On mobile, let it navigate to blog.html; do nothing here.
        // If you previously had code preventing default, it's gone now.
      });
    }
  });

  // 3) Click outside closes any open submenu (mobile)
  document.addEventListener("click", (e) => {
    if (!isMobile()) return;
    const inside = dropdownLis.some((li) => li.contains(e.target));
    if (!inside) closeAll();
  });

  // 4) On resize back to desktop, reset mobile-open state
  window.addEventListener("resize", () => {
    if (!isMobile()) closeAll();
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


    // Smooth scroll for “Jump to Resume” buttons (anchors to #resume-pdf)
  document.querySelectorAll('a[href="#resume-pdf"]').forEach(a => {
    a.addEventListener("click", (e) => {
      const target = document.getElementById("resume-pdf");
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
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

// ========== 8) Portfolio layout toggle + card click + type view builder ==========
onReady(() => {
  const timeline = document.getElementById("timeline-list");
  const viewChrono = document.getElementById("view-chrono");
  const viewType   = document.getElementById("view-type");
  const btnChrono  = document.getElementById("btn-chrono");
  const btnType    = document.getElementById("btn-type");

  if (!timeline || !viewChrono || !viewType || !btnChrono || !btnType) return;

  // 1) Make entire .tl-card clickable when it has a modal target
  document.querySelectorAll(".tl-card").forEach(card => {
    const modalSel = card.getAttribute("data-modal-target");
    if (!modalSel) return; // nothing to open
    card.classList.add("is-clickable");
    card.addEventListener("click", (e) => {
      // ignore clicks on nested links/buttons so they keep their native behavior
      const insideAction = e.target.closest("a,button,[data-modal-target]");
      if (insideAction && insideAction !== card) return;

      const modal = document.querySelector(modalSel);
      if (!modal) return;
      // Reuse your existing modal open logic:
      const openBtn = document.createElement("button");
      openBtn.setAttribute("data-modal-target", modalSel);
      document.body.appendChild(openBtn);
      openBtn.click();
      openBtn.remove();
    });
  });

  // 2) Build "Type" view by cloning items from Timeline
  const buckets = {
    work:      document.getElementById("group-work"),
    education: document.getElementById("group-education"),
    project:   document.getElementById("group-project"),
    course:    document.getElementById("group-course")
  };

  const items = Array.from(timeline.querySelectorAll(".tl-item"));
  items.forEach(li => {
    const type = (li.getAttribute("data-type") || "").toLowerCase();
    const target = buckets[type];
    if (!target) return;
    // Clone the card only (keeps markup/images/detail button or data-modal-target)
    const card = li.querySelector(".tl-card");
    if (!card) return;
    const clone = card.cloneNode(true);
    target.appendChild(clone);
  });

  // 3) Toggle views
  const setView = (mode) => {
    const isChrono = mode === "chrono";
    viewChrono.hidden = !isChrono;
    viewType.hidden   =  isChrono;

    btnChrono.classList.toggle("is-active", isChrono);
    btnType.classList.toggle("is-active", !isChrono);
    btnChrono.setAttribute("aria-pressed", String(isChrono));
    btnType.setAttribute("aria-pressed", String(!isChrono));
  };

  btnChrono.addEventListener("click", () => setView("chrono"));
  btnType.addEventListener("click", () => setView("type"));

  // default: Chronological
  setView("chrono");
});


