/* 
=======================================
  Navigation Component
  Felipe Diaz Website
=======================================
*/

/**
 * Mobile navigation toggle functionality
 */
export const initNavigation = () => {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");
  if (!toggle || !nav) return;

  let open = false;
  
  const setState = (next) => {
    open = !!next;
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('nav-open', open);
  };

  // Toggle on button click
  toggle.addEventListener('click', () => {
    setState(!open);
  }, { passive: true });

  // Close on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && open) setState(false);
  });

  // Close when clicking a link
  nav.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (a) setState(false);
  });
};
