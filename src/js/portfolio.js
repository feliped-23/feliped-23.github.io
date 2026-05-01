/*
=======================================
  Portfolio View Switcher & PDF Viewer
  Felipe Diaz Website
=======================================
*/

/**
 * Build the "Type" (category) view from timeline cards, then wire view switching.
 *
 * Architecture notes:
 * - Cards are cloned once from #view-chrono into the category grids. No click
 *   handlers are attached here — modals.js uses document-level event delegation
 *   which covers both original and cloned cards automatically.
 * - The default view is driven entirely by which section lacks `hidden` in the HTML.
 *   To change the default, edit resume.html — no JS change needed.
 */
export const initPortfolioViews = () => {
  const btns       = Array.from(document.querySelectorAll('.view-switch [data-view]'));
  const viewChrono = document.getElementById('view-chrono');
  const viewType   = document.getElementById('view-type');
  if (!btns.length || !viewChrono || !viewType) return;

  buildTypeView(viewChrono, viewType);

  btns.forEach(btn =>
    btn.addEventListener('click', () =>
      activateView(btn.dataset.view, btns, viewChrono, viewType)
    )
  );

  // Read initial state from HTML: whichever section is NOT hidden is the default
  const initialMode = viewChrono.hidden ? 'type' : 'chrono';
  activateView(initialMode, btns, viewChrono, viewType);

  initPDFViewers();
};

/**
 * Populate the type-view category grids by cloning cards from the timeline.
 * Called once on init.
 */
function buildTypeView(viewChrono, viewType) {
  const groups = {
    work:      viewType.querySelector('[data-group="work"] .type-grid'),
    education: viewType.querySelector('[data-group="education"] .type-grid'),
    projects:  viewType.querySelector('[data-group="projects"] .type-grid'),
    certs:     viewType.querySelector('[data-group="certs"] .type-grid'),
  };

  viewChrono.querySelectorAll('.tl-item').forEach(item => {
    const cat  = item.dataset.cat;
    const grid = groups[cat];
    if (!grid) return;

    const card = item.querySelector('.tl-card');
    if (!card) return;

    const clone = card.cloneNode(true);
    clone.classList.remove('tl--image-left', 'tl--image-right');

    // Inject date label below the title so it shows in the category card
    const timeEl = item.querySelector('.tl-time');
    if (timeEl) {
      const timeClone = timeEl.cloneNode(true);
      timeClone.classList.add('tl-time--card');
      clone.querySelector('h2')?.after(timeClone);
    }

    grid.appendChild(clone);
  });
}

/**
 * Show the requested view and sync button states.
 * @param {'chrono'|'type'} mode
 */
function activateView(mode, btns, viewChrono, viewType) {
  const showChrono = (mode === 'chrono');
  viewChrono.hidden = !showChrono;
  viewType.hidden   =  showChrono;

  btns.forEach(btn => {
    const active = btn.dataset.view === mode;
    btn.classList.toggle('is-active', active);
    btn.setAttribute('aria-pressed', String(active));
  });
}

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
  const pdfUrl = 'assets/resume/FelipeDiaz_Resume.pdf';

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

  function queueRenderPage(num) {
    if (pageRendering) {
      pageNumPending = num;
    } else {
      renderPage(num);
    }
  }

  function onPrevPage() {
    if (currentPage <= 1) return;
    currentPage--;
    queueRenderPage(currentPage);
    updateButtons();
  }

  function onNextPage() {
    if (currentPage >= pdfDoc.numPages) return;
    currentPage++;
    queueRenderPage(currentPage);
    updateButtons();
  }

  function updateButtons() {
    prevBtn.disabled = currentPage <= 1;
    nextBtn.disabled = currentPage >= pdfDoc.numPages;
  }

  prevBtn.addEventListener('click', onPrevPage);
  nextBtn.addEventListener('click', onNextPage);

  initSwipeGestures();

  window.addEventListener('resize', function() {
    if (pdfDoc) renderPage(currentPage);
  });

  window.addEventListener('orientationchange', function() {
    setTimeout(function() {
      if (pdfDoc) renderPage(currentPage);
    }, 100);
  });

  function initSwipeGestures() {
    const canvasContainer = document.querySelector('.pdf-canvas-container');
    if (!canvasContainer) return;

    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;
    let isSwipeGesture = false;

    canvasContainer.addEventListener('touchstart', function(e) {
      const touch = e.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      isSwipeGesture = true;
    }, { passive: true });

    canvasContainer.addEventListener('touchmove', function(e) {
      if (!isSwipeGesture) return;
      const touch = e.touches[0];
      endX = touch.clientX;
      endY = touch.clientY;
      const deltaX = endX - startX;
      const deltaY = endY - startY;
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        e.preventDefault();
      }
    }, { passive: false });

    canvasContainer.addEventListener('touchend', function(e) {
      if (!isSwipeGesture) return;
      const deltaX = endX - startX;
      const deltaY = endY - startY;
      const minSwipeDistance = 50;
      const maxVerticalDistance = 100;
      if (Math.abs(deltaX) > minSwipeDistance && Math.abs(deltaY) < maxVerticalDistance) {
        if (deltaX > 0) {
          onPrevPage();
        } else {
          onNextPage();
        }
      }
      isSwipeGesture = false;
    }, { passive: true });

    canvasContainer.style.cursor = 'grab';
    canvasContainer.addEventListener('touchstart', function() {
      canvasContainer.style.cursor = 'grabbing';
    });
    canvasContainer.addEventListener('touchend', function() {
      canvasContainer.style.cursor = 'grab';
    });

    canvasContainer.addEventListener('touchstart', function() {
      canvasContainer.style.transform = 'scale(0.98)';
    });
    canvasContainer.addEventListener('touchend', function() {
      canvasContainer.style.transform = 'scale(1)';
    });
  }
};
