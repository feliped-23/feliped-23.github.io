document.addEventListener('DOMContentLoaded', () => {
  /* ======================================================================
     1. Sticky Navigation Highlight (Intersection Observer)
     ====================================================================== */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.3 // Trigger when 30% of the section is visible
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => {
    sectionObserver.observe(section);
  });

  /* ======================================================================
     2. Typing Animation (Hero Section)
     ====================================================================== */
  const words = ["Mechanical Engineer", "Futurist", "3D Printing Expert", "Clean Tech Enthusiast", "Agentic Workflow Builder"];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typeTarget = document.querySelector('.typewriter');

  function typeEffect() {
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
      typeTarget.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typeTarget.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }

    let typeSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentWord.length) {
      isDeleting = true;
      typeSpeed = 1500; // Pause before deleting
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typeSpeed = 500; // Pause before typing new word
    }

    setTimeout(typeEffect, typeSpeed);
  }

  if (typeTarget) {
    setTimeout(typeEffect, 1000); // Start after 1s
  }

  /* ======================================================================
     3. Scroll Reveals (Staggered Grid & General)
     ====================================================================== */
  // Respect prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion) {
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          
          // If it's a staggered grid item, manage the delays (set in CSS usually, but we can do it via inline style)
          if (entry.target.classList.contains('stagger-item')) {
            const index = Array.from(entry.target.parentNode.children).indexOf(entry.target);
            entry.target.style.transitionDelay = `${index * 50}ms`;
          }

          observer.unobserve(entry.target); // Only reveal once
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -50px 0px', // Trigger slightly before it comes into view
      threshold: 0.1
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // If reduced motion, show everything immediately
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
  }

  /* ======================================================================
     4. Magnetic Button Effect (Desktop Only)
     ====================================================================== */
  const magneticButtons = document.querySelectorAll('.btn:not(.btn--ghost)');
  
  if (window.matchMedia('(pointer: fine)').matches && !prefersReducedMotion) {
    magneticButtons.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        // Conservative translation delta per motion-design-standards.md
        const xVal = x * 0.1;
        const yVal = y * 0.1;

        btn.style.transform = `translate(${xVal}px, ${yVal}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0px, 0px)';
      });
    });
  }

  /* ======================================================================
     5. Gallery Detail Panel
     ====================================================================== */
  const galleryPanels = document.querySelectorAll('.gallery-panel');
  const galleryDetailItems = document.querySelectorAll('.gallery-detail__item');

  if (galleryPanels.length && galleryDetailItems.length) {
    const showDetail = (index) => {
      galleryDetailItems.forEach(item => item.classList.remove('is-active'));
      galleryDetailItems[index]?.classList.add('is-active');
    };
    const hideDetail = () => {
      galleryDetailItems.forEach(item => item.classList.remove('is-active'));
    };

    // Desktop: hover-in per panel, hover-out on strip exit
    if (window.matchMedia('(hover: hover)').matches) {
      galleryPanels.forEach((panel, i) => {
        panel.addEventListener('mouseenter', () => showDetail(i));
      });
      document.querySelector('.gallery-strip')
        ?.addEventListener('mouseleave', hideDetail);
    }

    // Mobile: IntersectionObserver — show detail for the card in view
    if (window.matchMedia('(max-width: 768px)').matches) {
      const strip = document.querySelector('.gallery-strip');
      if (strip) {
        const mobileObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              showDetail(Array.from(galleryPanels).indexOf(entry.target));
            }
          });
        }, { root: strip, threshold: 0.6 });
        galleryPanels.forEach(p => mobileObserver.observe(p));
      }
    }
  }
});
