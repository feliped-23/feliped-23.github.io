/* 
=======================================
  Animation Controller
  Felipe Diaz Website
=======================================
*/

/**
 * Reveal-on-scroll animations using Intersection Observer
 */
export const initRevealAnimations = () => {
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
};
