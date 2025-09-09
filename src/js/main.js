/* 
=======================================
  Main JavaScript Entry Point
  Felipe Diaz Website
=======================================
*/

import { onReady, setCurrentYear } from './utils.js';
import { initNavigation } from './navigation.js';
import { initRevealAnimations } from './animations.js';
import { initModals } from './modals.js';
import { initPortfolioViews } from './portfolio.js';
import { initBlogFilters } from './blog.js';
import { initContactForm } from './contact.js';
import { initAboutPageFeatures } from './about.js';

/**
 * Initialize all website functionality
 */
onReady(() => {
  // Core functionality (runs on every page)
  setCurrentYear();
  initNavigation();
  initRevealAnimations();
  initModals();
  
  // Page-specific functionality
  initPortfolioViews(); // Only runs if portfolio elements exist
  initBlogFilters();    // Only runs if blog elements exist
  initContactForm();    // Only runs if contact form exists
  initAboutPageFeatures(); // Only runs if about page elements exist
});
