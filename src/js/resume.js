/* =============================================================================
   resume.js — renders the category deck, skill bento, and modals from
   resume-data.js, and drives tab switching, deep-linked modals, keyboard,
   and touch swipe. Self-contained (does not load main.js).
   Depends on globals from resume-data.js: EXPERIENCES, CATEGORIES, SKILLS.
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const track     = document.querySelector('.deck__track');
  const navList   = document.querySelector('.cat-nav__list');
  const deck      = document.querySelector('.deck');
  const modal     = document.querySelector('.exp-modal');
  const sheet     = modal.querySelector('.exp-modal__sheet');
  const backdrop  = modal.querySelector('.exp-modal__backdrop');
  const arrowPrev = document.querySelector('.deck__arrow--prev');
  const arrowNext = document.querySelector('.deck__arrow--next');
  const byModalId = new Map(EXPERIENCES.map(e => [e.modalId, e]));

  /* ------------------------------------------------------------- rendering */
  const esc = (s) => String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

  function cardHTML(exp) {
    const kws = exp.keywords.map(k => `<span class="rcard__kw">${esc(k)}</span>`).join('');
    const mod = exp.category === 'certificates' ? ' rcard--cert' : '';
    return `
      <a class="rcard${mod}" href="#${exp.modalId}" data-modal="${exp.modalId}"
         aria-label="${esc(exp.title)} — open details">
        <span class="rcard__inner">
          <span class="rcard__face rcard__front">
            <img class="rcard__img" src="${exp.heroImg}" alt="${esc(exp.title)}" loading="lazy">
            <span class="rcard__scrim"></span>
            <span class="rcard__front-body">
              <span class="rcard__org">${esc(exp.org)}</span>
              <span class="rcard__keywords">${kws}</span>
              <span class="rcard__hint">Tap to open &#8599;</span>
            </span>
          </span>
          <span class="rcard__face rcard__back">
            <span>
              <span class="rcard__type">${esc(exp.typeLabel)}</span>
              <span class="rcard__title">${esc(exp.title)}</span>
              <span class="rcard__period">${esc(exp.period)}</span>
            </span>
            <span class="rcard__summary">${esc(exp.summary)}</span>
            <span class="rcard__open">Open full experience &#8599;</span>
          </span>
        </span>
      </a>`;
  }

  function skillsHTML() {
    const tiles = SKILLS.groups.map((g, i) => {
      const chips = g.items.map(it => `<span class="chip">${esc(it)}</span>`).join('');
      return `<div class="tile${g.isLanguages ? ' tile--lang' : ''}" style="--i:${i}">
                <span class="tile__title">${esc(g.title)}</span>
                <div class="tile__chips">${chips}</div>
              </div>`;
    }).join('');
    return `<div class="skills">
      <div class="skills__head">
        <span class="skills__eyebrow">The toolkit behind the work</span>
      </div>
      <div class="skills__grid">${tiles}</div>
    </div>`;
  }

  CATEGORIES.forEach((cat) => {
    const panel = document.createElement('div');
    panel.className = 'deck__panel';
    panel.dataset.cat = cat.id;
    if (cat.id === 'skills') {
      panel.innerHTML = skillsHTML();
    } else {
      const items = EXPERIENCES.filter(e => e.category === cat.id);
      const rowClass = cat.id === 'certificates' ? 'card-row card-row--cert-grid' : 'card-row';
      panel.innerHTML = `<div class="${rowClass}">${items.map(cardHTML).join('')}</div>`;
    }
    track.appendChild(panel);
  });

  /* Tabs + sliding indicator */
  const indicator = document.createElement('span');
  indicator.className = 'cat-nav__indicator';
  navList.appendChild(indicator);

  const tabs = CATEGORIES.map((cat, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'cat-nav__tab';
    btn.setAttribute('aria-label', cat.label);
    btn.innerHTML = `<span class="cat-nav__label">${esc(cat.label)}</span>` +
                    `<span class="cat-nav__short">${esc(cat.short)}</span>`;
    btn.addEventListener('click', () => setActive(i));
    navList.appendChild(btn);
    return btn;
  });

  /* ------------------------------------------------------ deck navigation */
  let active = 0;
  let skillsRevealed = false;

  function moveIndicator() {
    const tab = tabs[active];
    if (!tab) return;
    indicator.style.width = tab.offsetWidth + 'px';
    indicator.style.transform = `translateX(${tab.offsetLeft}px)`;
  }

  function revealSkills() {
    if (skillsRevealed) return;
    const el = track.querySelector('.deck__panel[data-cat="skills"] .skills');
    if (el) { el.classList.add('is-revealed'); skillsRevealed = true; }
  }

  function setActive(i) {
    active = Math.max(0, Math.min(CATEGORIES.length - 1, i));
    track.style.setProperty('--active', active);
    tabs.forEach((t, idx) => t.classList.toggle('is-active', idx === active));
    arrowPrev.classList.toggle('is-hidden', active === 0);
    arrowNext.classList.toggle('is-hidden', active === CATEGORIES.length - 1);
    moveIndicator();
    if (CATEGORIES[active].id === 'skills') revealSkills();
  }

  /* ------------------------------------------------------------- modals */
  let modalOpen = false;
  let openedViaClick = false;
  let lastFocus = null;

  function docBtnHTML(d) {
    const primary = (d.kind === 'pdf' || d.kind === 'link');
    const cls = primary ? 'btn btn--small' : 'btn btn--ghost btn--small';
    const icon = d.kind === 'video' ? '&#9654;' : '&#8599;';
    return `<a class="${cls}" href="${d.href}" target="_blank" rel="noopener">${esc(d.label)} ${icon}</a>`;
  }

  function modalHTML(exp) {
    const meta = [exp.org, exp.period, exp.location]
      .filter(Boolean).map(m => `<span>${esc(m)}</span>`).join('');

    const highlights = (exp.highlights && exp.highlights.length) ? `
      <div class="exp-modal__section">
        <h3 class="exp-modal__section-title">Highlights</h3>
        <ul class="exp-modal__highlights">
          ${exp.highlights.map(h => `<li>${esc(h)}</li>`).join('')}
        </ul>
      </div>` : '';

    const tools = (exp.tools && exp.tools.length) ? `
      <div class="exp-modal__section">
        <h3 class="exp-modal__section-title">Tools &amp; Tech</h3>
        <div class="exp-modal__chips">
          ${exp.tools.map(t => `<span class="chip">${esc(t)}</span>`).join('')}
        </div>
      </div>` : '';

    const docs = (exp.docs && exp.docs.length)
      ? `<div class="exp-modal__docs">${exp.docs.map(docBtnHTML).join('')}</div>` : '';

    const gallery = (exp.gallery && exp.gallery.length) ? `
      <div class="exp-modal__section">
        <h3 class="exp-modal__section-title">Gallery</h3>
        <div class="exp-modal__gallery">
          ${exp.gallery.map(im => `<a href="${im.src}" target="_blank" rel="noopener">
             <img src="${im.src}" alt="${esc(im.alt)}" loading="lazy"></a>`).join('')}
        </div>
      </div>` : '';

    return `
      <button class="exp-modal__close" type="button" aria-label="Close">&times;</button>
      <div class="exp-modal__hero">
        <img class="exp-modal__hero-img" src="${exp.heroImg}" alt="${esc(exp.title)}">
        <div class="exp-modal__hero-scrim"></div>
        <div class="exp-modal__hero-info">
          <span class="exp-modal__badge">${esc(exp.typeLabel)}</span>
          <h2 class="exp-modal__title">${esc(exp.title)}</h2>
          <div class="exp-modal__meta">${meta}</div>
        </div>
      </div>
      <div class="exp-modal__body">
        <p class="exp-modal__summary">${esc(exp.summary)}</p>
        ${highlights}
        ${tools}
        ${docs}
        ${gallery}
      </div>`;
  }

  function openModal(exp) {
    sheet.innerHTML = modalHTML(exp);
    sheet.querySelector('.exp-modal__close').addEventListener('click', closeModal);
    if (!modalOpen) lastFocus = document.activeElement;
    modalOpen = true;
    modal.classList.add('is-open');
    document.body.classList.add('is-modal-open');
    modal.scrollTop = 0;
    requestAnimationFrame(() => sheet.querySelector('.exp-modal__close')?.focus());
  }

  function closeModalUI() {
    if (!modalOpen) return;
    modalOpen = false;
    modal.classList.remove('is-open');
    document.body.classList.remove('is-modal-open');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function closeModal() {
    if (!modalOpen) return;
    if (openedViaClick && history.length > 1) {
      history.back();               // pops the hash → hashchange → syncModal
    } else {
      history.replaceState(null, '', location.pathname + location.search);
      closeModalUI();
    }
    openedViaClick = false;
  }

  function syncModal() {
    const id = location.hash.replace(/^#/, '');
    const exp = byModalId.get(id);
    if (exp) {
      const ci = CATEGORIES.findIndex(c => c.id === exp.category);
      if (ci >= 0) setActive(ci);
      openModal(exp);
    } else {
      closeModalUI();
    }
  }

  /* ------------------------------------------------------------- events */
  // Flag click-opened modals so the ✕ / Esc restore the pre-modal URL cleanly.
  track.addEventListener('click', (e) => {
    if (e.target.closest('.rcard')) openedViaClick = true;
  });

  backdrop.addEventListener('click', closeModal);

  arrowPrev.addEventListener('click', () => setActive(active - 1));
  arrowNext.addEventListener('click', () => setActive(active + 1));

  // Wheel/trackpad scroll advances one category per gesture (desktop).
  let wheelLock = false;
  deck.addEventListener('wheel', (e) => {
    if (modalOpen) return;                       // let the modal scroll
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (Math.abs(delta) < 8) return;
    e.preventDefault();
    if (wheelLock) return;
    wheelLock = true;
    setActive(active + (delta > 0 ? 1 : -1));
    setTimeout(() => { wheelLock = false; }, 600);
  }, { passive: false });

  document.addEventListener('keydown', (e) => {
    if (modalOpen) {
      if (e.key === 'Escape') closeModal();
      return;
    }
    if (e.key === 'ArrowRight') setActive(active + 1);
    else if (e.key === 'ArrowLeft') setActive(active - 1);
  });

  // Basic focus trap inside the modal
  modal.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab' || !modalOpen) return;
    const f = modal.querySelectorAll('a[href], button');
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  // Touch swipe between categories (axis-locked so it won't fight vertical scroll)
  let tsx = 0, tsy = 0, tracking = false;
  deck.addEventListener('touchstart', (e) => {
    const t = e.touches[0]; tsx = t.clientX; tsy = t.clientY; tracking = true;
  }, { passive: true });
  deck.addEventListener('touchend', (e) => {
    if (!tracking || modalOpen) { tracking = false; return; }
    tracking = false;
    const t = e.changedTouches[0];
    const dx = t.clientX - tsx, dy = t.clientY - tsy;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      setActive(active + (dx < 0 ? 1 : -1));
    }
  }, { passive: true });

  window.addEventListener('resize', moveIndicator);
  window.addEventListener('load', moveIndicator);
  window.addEventListener('hashchange', syncModal);
  // Re-measure once webfont has swapped in (tab widths change).
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(moveIndicator);
  }

  /* ------------------------------------------------------------- init */
  setActive(0);
  syncModal(); // open a deep-linked modal if the URL already has a hash
});
