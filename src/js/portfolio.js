/* 
=======================================
  Portfolio View Switcher & PDF Viewer
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
  setView('type'); // default
  
  // Initialize PDF viewers (desktop iframe, mobile PDF.js)
  initPDFViewers();
};

/**
 * Initialize PDF viewers - desktop iframe, mobile PDF.js
 */
const initPDFViewers = () => {
  const desktopPDF = document.querySelector('.pdf-desktop');
  const mobilePDF = document.querySelector('.pdf-mobile');
  
  if (!desktopPDF || !mobilePDF) return;

  const togglePDFViewers = () => {
    const isMobile = window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      // Show mobile PDF.js viewer
      desktopPDF.style.display = 'none';
      mobilePDF.style.display = 'block';
      
      // Initialize PDF.js only on mobile
      if (!mobilePDF.dataset.initialized) {
        initPDFViewer();
        mobilePDF.dataset.initialized = 'true';
      }
    } else {
      // Show desktop iframe viewer
      desktopPDF.style.display = 'block';
      mobilePDF.style.display = 'none';
    }
  };
  
  // Initial setup
  togglePDFViewers();
  
  // Handle orientation changes and resize
  const handleResize = () => {
    setTimeout(togglePDFViewers, 100);
  };
  
  window.addEventListener('orientationchange', handleResize);
  window.addEventListener('resize', handleResize);
};

/**
 * Initialize PDF.js viewer for mobile
 */
const initPDFViewer = () => {
  const canvas = document.getElementById('pdf-canvas');
  const loadingDiv = document.getElementById('pdf-loading');
  const prevBtn = document.getElementById('prev-page');
  const nextBtn = document.getElementById('next-page');
  const currentPageSpan = document.getElementById('current-page');
  const totalPagesSpan = document.getElementById('total-pages');
  
  if (!canvas || !loadingDiv || !prevBtn || !nextBtn) return;

  let pdfDoc = null;
  let currentPage = 1;
  let pageRendering = false;
  let pageNumPending = null;
  let scale = 1.5;
  let canvasContext = canvas.getContext('2d');

  // Configure PDF.js worker
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

  // Load the PDF
  const pdfUrl = 'assets/FelipeDiaz_Resume.pdf';
  
  pdfjsLib.getDocument(pdfUrl).promise.then(function(pdfDoc_) {
    pdfDoc = pdfDoc_;
    totalPagesSpan.textContent = pdfDoc.numPages;
    
    // Render the first page
    renderPage(currentPage);
    
    // Hide loading indicator
    loadingDiv.style.display = 'none';
  }).catch(function(error) {
    console.error('Error loading PDF:', error);
    loadingDiv.textContent = 'Error loading PDF. Please try the fallback link below.';
  });

  /**
   * Render a page
   */
  function renderPage(num) {
    pageRendering = true;
    
    pdfDoc.getPage(num).then(function(page) {
      const viewport = page.getViewport({ scale: scale });
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: canvasContext,
        viewport: viewport
      };

      const renderTask = page.render(renderContext);
      
      renderTask.promise.then(function() {
        pageRendering = false;
        if (pageNumPending !== null) {
          renderPage(pageNumPending);
          pageNumPending = null;
        }
      });
    });

    currentPageSpan.textContent = num;
  }

  /**
   * Queue a page rendering
   */
  function queueRenderPage(num) {
    if (pageRendering) {
      pageNumPending = num;
    } else {
      renderPage(num);
    }
  }

  /**
   * Go to previous page
   */
  function onPrevPage() {
    if (currentPage <= 1) return;
    currentPage--;
    queueRenderPage(currentPage);
    updateButtons();
  }

  /**
   * Go to next page
   */
  function onNextPage() {
    if (currentPage >= pdfDoc.numPages) return;
    currentPage++;
    queueRenderPage(currentPage);
    updateButtons();
  }

  /**
   * Update button states
   */
  function updateButtons() {
    prevBtn.disabled = currentPage <= 1;
    nextBtn.disabled = currentPage >= pdfDoc.numPages;
  }

  // Event listeners
  prevBtn.addEventListener('click', onPrevPage);
  nextBtn.addEventListener('click', onNextPage);

  // Add swipe functionality for mobile
  initSwipeGestures();

  // Handle window resize
  window.addEventListener('resize', function() {
    if (pdfDoc) {
      renderPage(currentPage);
    }
  });

  // Handle orientation change
  window.addEventListener('orientationchange', function() {
    setTimeout(function() {
      if (pdfDoc) {
        renderPage(currentPage);
      }
    }, 100);
  });

  /**
   * Initialize swipe gestures for mobile navigation
   */
  function initSwipeGestures() {
    const canvasContainer = document.querySelector('.pdf-canvas-container');
    if (!canvasContainer) return;

    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;
    let isSwipeGesture = false;

    // Touch start
    canvasContainer.addEventListener('touchstart', function(e) {
      const touch = e.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      isSwipeGesture = true;
    }, { passive: true });

    // Touch move
    canvasContainer.addEventListener('touchmove', function(e) {
      if (!isSwipeGesture) return;
      
      const touch = e.touches[0];
      endX = touch.clientX;
      endY = touch.clientY;
      
      // Calculate swipe distance
      const deltaX = endX - startX;
      const deltaY = endY - startY;
      
      // If horizontal swipe is more significant than vertical, prevent default scrolling
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        e.preventDefault();
      }
    }, { passive: false });

    // Touch end
    canvasContainer.addEventListener('touchend', function(e) {
      if (!isSwipeGesture) return;
      
      const deltaX = endX - startX;
      const deltaY = endY - startY;
      const minSwipeDistance = 50; // Minimum distance for a swipe
      const maxVerticalDistance = 100; // Maximum vertical movement to consider it a horizontal swipe
      
      // Check if it's a horizontal swipe
      if (Math.abs(deltaX) > minSwipeDistance && Math.abs(deltaY) < maxVerticalDistance) {
        if (deltaX > 0) {
          // Swipe right - go to previous page
          onPrevPage();
        } else {
          // Swipe left - go to next page
          onNextPage();
        }
      }
      
      isSwipeGesture = false;
    }, { passive: true });

    // Add visual feedback for swipe gestures
    canvasContainer.style.cursor = 'grab';
    canvasContainer.addEventListener('touchstart', function() {
      canvasContainer.style.cursor = 'grabbing';
    });
    canvasContainer.addEventListener('touchend', function() {
      canvasContainer.style.cursor = 'grab';
    });

    // Add swipe animation feedback
    canvasContainer.addEventListener('touchstart', function() {
      canvasContainer.style.transform = 'scale(0.98)';
    });
    canvasContainer.addEventListener('touchend', function() {
      canvasContainer.style.transform = 'scale(1)';
    });
  }
};
