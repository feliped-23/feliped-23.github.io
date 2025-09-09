/* 
=======================================
  About Page Interactive Features
  Felipe Diaz Website
=======================================
*/

/**
 * Initialize all about page specific features
 */
export function initAboutPageFeatures() {
  // Only run if we're on the about page
  if (!document.querySelector('.about-block')) {
    return;
  }

  initTravelMapModal();
  initHobbiesGridEffects();
  initSmoothScrolling();
  initImageLazyLoading();
  initScrollProgress();
  initBooksPanel();
}

/**
 * Initialize travel map modal functionality
 */
function initTravelMapModal() {
  const travelMap = document.querySelector('.travel-map');
  if (!travelMap) return;

  travelMap.addEventListener('click', () => {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'travel-map-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <button class="modal-close" aria-label="Close modal">&times;</button>
        <img src="${travelMap.src}" alt="Full size travel map" />
      </div>
    `;

    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
      .travel-map-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        padding: 2rem;
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      
      .travel-map-modal.show {
        opacity: 1;
      }
      
      .modal-content {
        position: relative;
        max-width: 90vw;
        max-height: 90vh;
        background: white;
        border-radius: var(--radius);
        overflow: hidden;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      }
      
      .modal-content img {
        width: 100%;
        height: auto;
        display: block;
      }
      
      .modal-close {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: rgba(0, 0, 0, 0.7);
        color: white;
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        font-size: 1.5rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.3s ease;
      }
      
      .modal-close:hover {
        background: rgba(0, 0, 0, 0.9);
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(modal);

    // Show modal with animation
    requestAnimationFrame(() => {
      modal.classList.add('show');
    });

    // Close modal functionality
    const closeModal = () => {
      modal.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(modal);
        document.head.removeChild(style);
      }, 300);
    };

    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    // Close on escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closeModal();
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);
  });
}

/**
 * Initialize hobbies grid interactive effects
 */
function initHobbiesGridEffects() {
  const hobbyItems = document.querySelectorAll('.hobby-item');
  if (!hobbyItems.length) return;

  hobbyItems.forEach(item => {
    // Add keyboard accessibility
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', `View ${item.dataset.activity} activity`);

    // Handle keyboard interaction
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        item.click();
      }
    });

    // Add click handler for future functionality
    item.addEventListener('click', () => {
      // Future: Could open a modal with more details about the activity
      console.log(`Clicked on ${item.dataset.activity}`);
    });
  });
}

/**
 * Initialize smooth scrolling for navigation
 */
function initSmoothScrolling() {
  // Add smooth scroll behavior to all internal links
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    });
  });
}

/**
 * Initialize lazy loading for images
 */
function initImageLazyLoading() {
  const images = document.querySelectorAll('img[src]');
  
  // Simple intersection observer for fade-in effect
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '50px'
  });

  images.forEach(img => {
    // Set initial state for animation
    img.style.opacity = '0';
    img.style.transform = 'translateY(20px)';
    img.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    
    observer.observe(img);
  });
}

/**
 * Initialize scroll progress indicator
 */
function initScrollProgress() {
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  progressBar.innerHTML = '<div class="scroll-progress-bar"></div>';
  
  const style = document.createElement('style');
  style.textContent = `
    .scroll-progress {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: rgba(0, 0, 0, 0.1);
      z-index: 1000;
    }
    
    .scroll-progress-bar {
      height: 100%;
      background: linear-gradient(90deg, var(--accent), var(--accent-2));
      width: 0%;
      transition: width 0.1s ease;
    }
  `;

  document.head.appendChild(style);
  document.body.appendChild(progressBar);

  const progressBarFill = progressBar.querySelector('.scroll-progress-bar');

  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    
    progressBarFill.style.width = `${scrollPercent}%`;
  });
}

/**
 * Initialize books panel functionality
 */
function initBooksPanel() {
  const booksPanel = document.querySelector('.books-panel');
  if (!booksPanel) return;

  // Add keyboard accessibility
  booksPanel.setAttribute('tabindex', '0');
  booksPanel.setAttribute('role', 'button');
  booksPanel.setAttribute('aria-label', 'View books and podcasts collection');

  // Handle click
  booksPanel.addEventListener('click', () => {
    // Future: Navigate to books/podcasts page
    console.log('Books panel clicked - navigate to collection page');
    // For now, just show an alert
    alert('This will soon navigate to my books and podcasts collection page!');
  });

  // Handle keyboard interaction
  booksPanel.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      booksPanel.click();
    }
  });

  // Add hover effects for individual book covers
  const bookCovers = booksPanel.querySelectorAll('.book-cover');
  bookCovers.forEach(cover => {
    cover.addEventListener('mouseenter', () => {
      cover.style.transform = 'scale(1.1) rotate(2deg)';
    });
    
    cover.addEventListener('mouseleave', () => {
      cover.style.transform = 'scale(1.05)';
    });
  });
}
