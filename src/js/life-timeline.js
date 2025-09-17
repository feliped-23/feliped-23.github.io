/* 
=======================================
  Life Timeline JavaScript
  Felipe Diaz Website - Interactive Timeline
=======================================
*/

class LifeTimeline {
  constructor(container) {
    this.container = container;
    this.timeline = container.querySelector('.life-timeline');
    this.prevBtn = container.querySelector('.timeline-nav-prev');
    this.nextBtn = container.querySelector('.timeline-nav-next');
    this.events = container.querySelectorAll('.event-item');
    this.locations = container.querySelectorAll('.timeline-location');
    
    this.scrollAmount = 0.8; // Scroll 80% of visible width
    
    this.init();
  }
  
  init() {
    // Navigation controls
    this.setupNavigation();
    
    // Position events dynamically first
    this.positionEvents();
    
    // Event interactions (after positioning)
    this.setupEventInteractions();
    
    // Intersection observer for animations
    this.setupAnimations();
    
    // Keyboard navigation
    this.setupKeyboardNav();
    
    // Touch/swipe support
    this.setupTouchSupport();
    
    // Handle window resize for responsive positioning
    this.setupResizeHandler();
    
    // Initial button state
    this.updateNavButtons();
  }
  
  setupNavigation() {
    if (this.prevBtn && this.nextBtn) {
      this.prevBtn.addEventListener('click', () => this.scrollPrev());
      this.nextBtn.addEventListener('click', () => this.scrollNext());
      
      // Update button states on scroll
      this.timeline.addEventListener('scroll', () => this.updateNavButtons());
    }
  }
  
  setupEventInteractions() {
    // Re-select events to ensure we have the latest DOM elements
    this.events = this.container.querySelectorAll('.event-item');
    
    this.events.forEach(event => {
      // Handle both click and touch events for better mobile support
      const eventClickHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.handleEventClick(e.currentTarget);
      };
      
      event.addEventListener('click', eventClickHandler);
      event.addEventListener('touchend', eventClickHandler);
      
      // Add hover effects for better UX (desktop only)
      event.addEventListener('mouseenter', () => this.highlightEvent(event));
      event.addEventListener('mouseleave', () => this.unhighlightEvent(event));
    });
    
    // Location interactions
    this.locations.forEach(location => {
      const flag = location.querySelector('.location-flag');
      if (flag) {
        const locationClickHandler = (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.focusOnLocation(location);
        };
        
        flag.addEventListener('click', locationClickHandler);
        flag.addEventListener('touchend', locationClickHandler);
      }
    });
  }
  
  setupAnimations() {
    // Create intersection observer for scroll-triggered animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '50px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);
    
    // Re-select events to ensure we have the latest DOM elements
    this.events = this.container.querySelectorAll('.event-item');
    
    // Observe timeline elements
    this.locations.forEach(location => observer.observe(location));
    this.events.forEach(event => observer.observe(event));
  }
  
  setupKeyboardNav() {
    this.timeline.setAttribute('tabindex', '0');
    this.timeline.addEventListener('keydown', (e) => {
      switch(e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          this.scrollPrev();
          break;
        case 'ArrowRight':
          e.preventDefault();
          this.scrollNext();
          break;
        case 'Home':
          e.preventDefault();
          this.scrollToStart();
          break;
        case 'End':
          e.preventDefault();
          this.scrollToEnd();
          break;
      }
    });
  }
  
  setupTouchSupport() {
    let startX = 0;
    let startY = 0;
    let isScrolling = false;
    
    this.timeline.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      isScrolling = false;
    }, { passive: true });
    
    this.timeline.addEventListener('touchmove', (e) => {
      if (isScrolling) return;
      
      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const diffX = Math.abs(currentX - startX);
      const diffY = Math.abs(currentY - startY);
      
      // If horizontal swipe is more prominent, prevent vertical scroll
      if (diffX > diffY && diffX > 10) {
        isScrolling = true;
      }
    }, { passive: true });
  }
  
  scrollPrev() {
    const scrollAmount = this.timeline.clientWidth * this.scrollAmount;
    this.timeline.scrollBy({ 
      left: -scrollAmount, 
      behavior: 'smooth' 
    });
  }
  
  scrollNext() {
    const scrollAmount = this.timeline.clientWidth * this.scrollAmount;
    this.timeline.scrollBy({ 
      left: scrollAmount, 
      behavior: 'smooth' 
    });
  }
  
  scrollToStart() {
    this.timeline.scrollTo({ 
      left: 0, 
      behavior: 'smooth' 
    });
  }
  
  scrollToEnd() {
    this.timeline.scrollTo({ 
      left: this.timeline.scrollWidth, 
      behavior: 'smooth' 
    });
  }
  
  updateNavButtons() {
    if (!this.prevBtn || !this.nextBtn) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = this.timeline;
    
    // Update previous button
    this.prevBtn.disabled = scrollLeft <= 5; // Small threshold for floating point precision
    
    // Update next button
    this.nextBtn.disabled = scrollLeft >= scrollWidth - clientWidth - 5;
    
    // Update button opacity for visual feedback
    this.prevBtn.style.opacity = this.prevBtn.disabled ? '0.4' : '1';
    this.nextBtn.style.opacity = this.nextBtn.disabled ? '0.4' : '1';
  }
  
  focusOnLocation(location) {
    const locationRect = location.getBoundingClientRect();
    const timelineRect = this.timeline.getBoundingClientRect();
    const scrollOffset = locationRect.left - timelineRect.left - (timelineRect.width / 2) + (locationRect.width / 2);
    
    this.timeline.scrollBy({
      left: scrollOffset,
      behavior: 'smooth'
    });
    
    // Add temporary highlight
    location.classList.add('location-focused');
    setTimeout(() => {
      location.classList.remove('location-focused');
    }, 2000);
  }
  
  handleEventClick(eventElement) {
    const eventData = this.extractEventData(eventElement);
    this.showEventModal(eventData);
  }
  
  extractEventData(eventElement) {
    const img = eventElement.querySelector('.event-image');
    const title = eventElement.querySelector('h4');
    const description = eventElement.querySelector('p');
    const year = eventElement.querySelector('.event-year');
    
    return {
      image: img ? img.src : null,
      imageAlt: img ? img.alt : '',
      title: title ? title.textContent : '',
      description: description ? description.textContent : '',
      year: year ? year.textContent : ''
    };
  }
  
  showEventModal(eventData) {
    // Create modal backdrop
    const modal = document.createElement('div');
    modal.className = 'life-event-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'modal-title');
    
    // Create modal content
    const modalContent = `
      <div class="modal-content">
        <div class="modal-header">
          <h3 id="modal-title">${eventData.title}</h3>
          <button class="modal-close" aria-label="Close modal">×</button>
        </div>
        <div class="modal-body">
          ${eventData.image ? `<img src="${eventData.image}" alt="${eventData.imageAlt}" class="modal-image">` : ''}
          <div class="modal-text">
            <div class="modal-year">${eventData.year}</div>
            <p class="modal-description">${eventData.description}</p>
          </div>
        </div>
      </div>
    `;
    
    modal.innerHTML = modalContent;
    
    // Add event listeners with proper mobile touch handling
    const closeBtn = modal.querySelector('.modal-close');
    const modalContentEl = modal.querySelector('.modal-content');
    
    // Close button - handle both click and touch events
    const closeModalHandler = (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.closeModal(modal);
    };
    
    closeBtn.addEventListener('click', closeModalHandler);
    closeBtn.addEventListener('touchend', closeModalHandler);
    
    // Backdrop click to close - prevent event bubbling from modal content
    const backdropClickHandler = (e) => {
      if (e.target === modal) {
        this.closeModal(modal);
      }
    };
    
    modal.addEventListener('click', backdropClickHandler);
    modal.addEventListener('touchend', backdropClickHandler);
    
    // Prevent modal content clicks from closing the modal
    modalContentEl.addEventListener('click', (e) => {
      e.stopPropagation();
    });
    
    modalContentEl.addEventListener('touchend', (e) => {
      e.stopPropagation();
    });
    
    // Keyboard support
    modal.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeModal(modal);
      }
    });
    
    // Add to DOM
    document.body.appendChild(modal);
    document.body.classList.add('no-scroll');
    
    // Focus management
    closeBtn.focus();
    
    // Animation
    requestAnimationFrame(() => {
      modal.classList.add('modal-visible');
    });
  }
  
  closeModal(modal) {
    modal.classList.add('modal-closing');
    document.body.classList.remove('no-scroll');
    
    setTimeout(() => {
      if (modal.parentNode) {
        modal.parentNode.removeChild(modal);
      }
    }, 300);
  }
  
  highlightEvent(event) {
    event.style.transform = 'translateY(-4px) scale(1.02)';
    event.style.zIndex = '10';
  }
  
  unhighlightEvent(event) {
    event.style.transform = '';
    event.style.zIndex = '';
  }
  
  positionEvents() {
    // Re-select events to ensure we have the latest DOM elements
    this.events = this.container.querySelectorAll('.event-item');
    
    // Calculate timeline constants
    const startYear = 2002;
    const pixelsPerYear = this.getPixelsPerYear();
    
    this.events.forEach(event => {
      const yearValue = this.extractYearFromClass(event);
      if (yearValue !== null) {
        // Find the parent location to get its start year
        const parentLocation = event.closest('.timeline-location');
        if (parentLocation) {
          const locationStartYear = parseInt(parentLocation.dataset.startYear);
          const locationEndYear = parseInt(parentLocation.dataset.endYear);
          
          // Position relative to the location's start year
          const relativeYear = yearValue - locationStartYear;
          const position = relativeYear * pixelsPerYear;
          
          // Ensure the position is within the location bounds
          const maxPosition = (locationEndYear - locationStartYear) * pixelsPerYear;
          const clampedPosition = Math.max(0, Math.min(position, maxPosition));
          
          event.style.setProperty('--event-position', `${clampedPosition}px`);
          event.style.left = 'var(--event-position)';
        }
      } else {
        // If no year class, position at the start of the location (fallback)
        const parentLocation = event.closest('.timeline-location');
        if (parentLocation) {
          event.style.setProperty('--event-position', '0px');
          event.style.left = 'var(--event-position)';
        }
      }
    });
  }
  
  extractYearFromClass(eventElement) {
    // Extract year from class names like "event-year-2023.5" or "event-year-2018.8"
    const classList = Array.from(eventElement.classList);
    const yearClass = classList.find(cls => cls.startsWith('event-year-'));
    
    if (yearClass) {
      const yearString = yearClass.replace('event-year-', '');
      const year = parseFloat(yearString);
      return isNaN(year) ? null : year;
    }
    
    return null;
  }
  
  calculatePosition(yearValue, startYear, pixelsPerYear) {
    const yearsFromStart = yearValue - startYear;
    return yearsFromStart * pixelsPerYear;
  }
  
  getPixelsPerYear() {
    // Get pixels per year based on screen size
    const isMobile = window.innerWidth <= 768;
    const isSmallMobile = window.innerWidth <= 480;
    
    if (isSmallMobile) {
      return 120; // 120px per year for small mobile
    } else if (isMobile) {
      return 150; // 150px per year for mobile
    } else {
      return 300; // 300px per year for desktop
    }
  }
  
  setupResizeHandler() {
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.positionEvents();
        this.setupEventInteractions(); // Re-setup interactions after resize
      }, 100); // Debounce resize events
    });
  }
  
  // Public method to add new events dynamically
  addEvent(locationIndex, eventData, position = 'bottom', yearValue = null) {
    const location = this.locations[locationIndex];
    if (!location) return;
    
    const eventsContainer = location.querySelector(`.life-events-${position}`);
    if (!eventsContainer) return;
    
    const eventElement = this.createEventElement(eventData, yearValue);
    eventsContainer.appendChild(eventElement);
    
    // Add interaction
    eventElement.addEventListener('click', (e) => this.handleEventClick(e.currentTarget));
    
    // Position the new event
    if (yearValue !== null) {
      const pixelsPerYear = this.getPixelsPerYear();
      const locationStartYear = parseInt(location.dataset.startYear);
      const locationEndYear = parseInt(location.dataset.endYear);
      
      // Position relative to the location's start year
      const relativeYear = yearValue - locationStartYear;
      const position = relativeYear * pixelsPerYear;
      
      // Ensure the position is within the location bounds
      const maxPosition = (locationEndYear - locationStartYear) * pixelsPerYear;
      const clampedPosition = Math.max(0, Math.min(position, maxPosition));
      
      eventElement.style.setProperty('--event-position', `${clampedPosition}px`);
      eventElement.style.left = 'var(--event-position)';
    }
  }
  
  createEventElement(eventData, yearValue = null) {
    const eventElement = document.createElement('div');
    eventElement.className = 'event-item event-positioned';
    
    // Add year class for positioning if yearValue is provided
    if (yearValue !== null) {
      eventElement.classList.add(`event-year-${yearValue}`);
    }
    
    eventElement.innerHTML = `
      <div class="event-flip-card">
        <div class="event-flip-front">
          ${eventData.image ? `<img src="${eventData.image}" alt="${eventData.imageAlt}" class="event-image">` : ''}
        </div>
        <div class="event-flip-back">
          <div class="event-year">${eventData.year}</div>
          <h4 class="event-title">${eventData.title}</h4>
          <p class="event-description">${eventData.description}</p>
        </div>
      </div>
    `;
    
    return eventElement;
  }
}

// Event Modal Styles (injected dynamically)
const modalStyles = `
  .life-event-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  .life-event-modal.modal-visible {
    opacity: 1;
  }
  
  .life-event-modal.modal-closing {
    opacity: 0;
  }
  
  .modal-content {
    background: var(--card);
    border-radius: var(--radius-lg);
    max-width: 600px;
    max-height: 80vh;
    overflow-y: auto;
    position: relative;
    transform: translateY(50px);
    transition: transform 0.3s ease;
    margin: 1rem;
    box-shadow: 0 25px 60px rgba(0, 0, 0, 0.3);
  }
  
  .modal-visible .modal-content {
    transform: translateY(0);
  }
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem 1.5rem 0;
    border-bottom: 1px solid var(--border);
    margin-bottom: 1.5rem;
  }
  
  .modal-header h3 {
    margin: 0;
    font-size: 1.4rem;
    font-weight: 700;
    color: var(--text);
  }
  
  .modal-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: var(--muted);
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
    user-select: none;
    position: relative;
  }
  
  .modal-close:hover,
  .modal-close:active {
    background: var(--bg-elev);
    color: var(--text);
    transform: scale(1.05);
  }
  
  .modal-close:focus {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }
  
  .modal-body {
    padding: 0 1.5rem 1.5rem;
  }
  
  .modal-image {
    width: 100%;
    max-height: 300px;
    object-fit: cover;
    border-radius: var(--radius);
    margin-bottom: 1rem;
    border: 1px solid var(--border);
  }
  
  .modal-year {
    color: var(--accent);
    font-weight: 700;
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
  }
  
  .modal-description {
    color: var(--text);
    line-height: 1.6;
    margin: 0;
    font-size: 1rem;
  }
  
  .location-focused .location-flag {
    animation: pulse-highlight 1s ease-in-out;
  }
  
  @keyframes pulse-highlight {
    0%, 100% { 
      transform: scale(1); 
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }
    50% { 
      transform: scale(1.1); 
      box-shadow: 0 12px 35px rgba(180, 113, 73, 0.4);
    }
  }
  
  /* Mobile-specific modal improvements */
  @media (max-width: 768px) {
    .life-event-modal {
      padding: 1rem;
    }
    
    .modal-content {
      max-width: 100%;
      max-height: 90vh;
      margin: 0;
      border-radius: var(--radius);
    }
    
    .modal-header {
      padding: 1rem 1rem 0;
      margin-bottom: 1rem;
    }
    
    .modal-header h3 {
      font-size: 1.2rem;
    }
    
    .modal-close {
      width: 40px;
      height: 40px;
      font-size: 1.6rem;
    }
    
    .modal-body {
      padding: 0 1rem 1rem;
    }
    
    .modal-image {
      max-height: 250px;
    }
  }
  
  @media (max-width: 480px) {
    .life-event-modal {
      padding: 0.5rem;
    }
    
    .modal-content {
      max-height: 95vh;
    }
    
    .modal-header {
      padding: 0.75rem 0.75rem 0;
      margin-bottom: 0.75rem;
    }
    
    .modal-header h3 {
      font-size: 1.1rem;
    }
    
    .modal-close {
      width: 42px;
      height: 42px;
      font-size: 1.7rem;
    }
    
    .modal-body {
      padding: 0 0.75rem 0.75rem;
    }
    
    .modal-image {
      max-height: 200px;
    }
  }
`;

// Inject modal styles
if (!document.getElementById('life-timeline-modal-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'life-timeline-modal-styles';
  styleSheet.textContent = modalStyles;
  document.head.appendChild(styleSheet);
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const timelineContainers = document.querySelectorAll('.life-timeline-container');
  timelineContainers.forEach(container => {
    new LifeTimeline(container);
  });
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LifeTimeline;
}