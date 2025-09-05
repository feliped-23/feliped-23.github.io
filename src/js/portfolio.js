/* 
=======================================
  Portfolio View Switcher
  Felipe Diaz Website
=======================================
*/

/**
 * Build "Type" view from timeline + toggle views
 */
export const initPortfolioViews = () => {
  const btns = Array.from(document.querySelectorAll('.view-switch [data-view]'));
  const viewChrono = document.getElementById('view-chrono');
  const viewType = document.getElementById('view-type');
  if (!btns.length || !viewChrono || !viewType) return;

  // Build the Type view by cloning timeline cards into groups
  const groups = {
    work:  viewType.querySelector('[data-group="work"] .type-grid'),
    education: viewType.querySelector('[data-group="education"] .type-grid'),
    projects: viewType.querySelector('[data-group="projects"] .type-grid'),
    certs: viewType.querySelector('[data-group="certs"] .type-grid')
  };

  // Grab all items from the timeline
  const items = Array.from(viewChrono.querySelectorAll('.tl-item'));
  items.forEach(item => {
    const cat = item.getAttribute('data-cat');
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
            // Direct modal open
            const openModal = (m) => { 
              m.classList.add('open'); 
              m.setAttribute('aria-hidden','false'); 
              document.body.classList.add('no-scroll'); 
            };
            openModal(modal);
          }
        });
      });
    }
  };

  btns.forEach(b => b.addEventListener('click', () => setView(b.getAttribute('data-view'))));
  setView('chrono'); // default
};
