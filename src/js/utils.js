/* 
=======================================
  Utility Functions
  Felipe Diaz Website
=======================================
*/

/**
 * Utility functions for common tasks
 */

// DOM ready utility
export const onReady = (fn) => {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fn, { once: true });
  } else {
    fn();
  }
};

// Media query helper
export const isDesktop = () => window.matchMedia("(min-width: 821px)").matches;

// Set current year in footer
export const setCurrentYear = () => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
};
