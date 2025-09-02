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


// ========== 6) Modals + card click-to-open + anchors ==========
onReady(() => {
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

  // ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.querySelectorAll(".modal.open").forEach(m => closeModal(m));
    }
  });

  // Backdrop click
  document.querySelectorAll(".modal__backdrop").forEach(bg => {
    bg.addEventListener("click", () => closeModal(bg.closest(".modal")));
  });

  // Smooth scroll for “Jump to Resume”
  document.querySelectorAll('a[href="#resume-pdf"]').forEach(a => {
    a.addEventListener("click", (e) => {
      const target = document.getElementById("resume-pdf");
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
});

// ========== 6b) Build "Type" view from timeline + toggle views ==========
onReady(() => {
  const btns = Array.from(document.querySelectorAll('.view-switch [data-view]'));
  const viewChrono = document.getElementById('view-chrono');
  const viewType = document.getElementById('view-type');
  if (!btns.length || !viewChrono || !viewType) return;

  // Build the Type view by cloning timeline cards into groups, no duplication needed in HTML
  const groups = {
    work:  viewType.querySelector('[data-group="work"] .type-grid'),
    education: viewType.querySelector('[data-group="education"] .type-grid'),
    projects: viewType.querySelector('[data-group="projects"] .type-grid'),
    certs: viewType.querySelector('[data-group="certs"] .type-grid')
  };

  // Grab all items from the timeline
  const items = Array.from(viewChrono.querySelectorAll('.tl-item'));
  items.forEach(item => {
    const cat = item.getAttribute('data-cat'); // "work" | "education" | "projects" | "certs"
    if (!cat || !groups[cat]) return;
    const card = item.querySelector('.tl-card');
    if (!card) return;
    const clone = card.cloneNode(true);
    // Remove hover-only timeline affordances; keep clickability if modal exists
    clone.classList.remove('tl--image-left','tl--image-right');
    groups[cat].appendChild(clone);
  });

  const setView = (mode) => {
    const chrono = (mode === 'chrono');
    viewChrono.hidden = !chrono;
    viewType.hidden = chrono;
    btns.forEach(b => {
      const active = b.getAttribute('data-view') === mode;
      b.classList.toggle('is-active', active);
      b.setAttribute('aria-pressed', String(active));
    });
    // When switching into Type view, ensure click handlers exist on clones too
    if (!chrono) {
      viewType.querySelectorAll('.tl-card.is-clickable').forEach(card => {
        if (card.__bound) return; // guard
        card.__bound = true;
        card.addEventListener('click', (e) => {
          if (e.target.closest('a,button')) return;
          const sel = card.getAttribute('data-modal-target');
          if (!sel) return;
          const modal = document.querySelector(sel);
          if (modal) {
            e.preventDefault();
            const evt = new Event('click'); // trigger open using same handler above
            // fallback: open directly
            document.querySelectorAll(`[data-modal-target="${sel}"]`)[0]?.dispatchEvent(evt);
            if (!document.querySelector(`[data-modal-target="${sel}"]`)) {
              // open directly if no original button exists
              const open = new Event('noop'); // no-op
              modal.dispatchEvent(open);
              // direct open
              const openModal = (m)=>{ m.classList.add('open'); m.setAttribute('aria-hidden','false'); document.body.classList.add('no-scroll'); };
              openModal(modal);
            }
          }
        });
      });
    }
  };

  btns.forEach(b => b.addEventListener('click', () => setView(b.getAttribute('data-view'))));
  setView('chrono'); // default
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

// ========== BLOG: Tag Filters + Clickable Cards ==========
onReady(() => {
  const grid   = document.getElementById("blogGrid");
  const tagUi  = document.getElementById("tagControls");
  const clear  = document.getElementById("clearFilters");
  const status = document.getElementById("activeFilterText");
  if (!grid || !tagUi || !clear || !status) return;

  const cards = Array.from(grid.querySelectorAll(".post-card"));
  const selected = new Set();

  const cardTags = (card) =>
    (card.getAttribute("data-tags") || "")
      .split(",")
      .map(s => s.trim())
      .filter(Boolean);

  const updateStatusText = () => {
    if (!selected.size) { status.textContent = "Showing all posts"; return; }
    status.textContent = `Filtering by: ${Array.from(selected).join(", ")}`;
  };

  const applyFilter = () => {
    cards.forEach(card => {
      const tags = cardTags(card);
      const show = Array.from(selected).every(t => tags.includes(t));
      card.hidden = !show;
    });
    clear.hidden = selected.size === 0;
    updateStatusText();
  };

  tagUi.addEventListener("click", (e) => {
    const btn = e.target.closest(".tag-btn");
    if (!btn) return;
    const tag = btn.dataset.tag;
    if (!tag) return;
    const active = selected.has(tag);
    if (active) {
      selected.delete(tag);
      btn.classList.remove("is-active");
      btn.setAttribute("aria-pressed", "false");
    } else {
      selected.add(tag);
      btn.classList.add("is-active");
      btn.setAttribute("aria-pressed", "true");
    }
    applyFilter();
  });

  clear.addEventListener("click", () => {
    selected.clear();
    tagUi.querySelectorAll(".tag-btn").forEach(b => {
      b.classList.remove("is-active");
      b.setAttribute("aria-pressed", "false");
    });
    applyFilter();
  });

  // Make whole card clickable
  const go = (card) => {
    const href = card.getAttribute("data-href") || "";
    if (href) window.location.href = href;
  };
  cards.forEach(card => {
    card.addEventListener("click", (e) => {
      if (e.target.closest("a,button")) return;
      go(card);
    });
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        go(card);
      }
    });
  });

  applyFilter();
});


