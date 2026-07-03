// Loaded as a CLASSIC script (not type="module") so it also works when
// index.html is opened directly via file:// — module scripts are CORS-blocked
// under file://, but a classic script's dynamic import() of an https URL is not.
(async () => {
try {
  const { default: createGlobe } = await import('https://esm.sh/cobe@0.6.3');

  const canvas = document.getElementById('about-globe');
  if (!canvas) throw new Error('canvas not found');
  const wrapper = canvas.parentElement;

  const CITIES = [
    { name: 'Bogotá',           location: [4.7110,    -74.0721], duration: '5 yrs' },
    { name: 'Aberdeen',         location: [57.1497,    -2.0943], duration: '3 yrs' },
    { name: 'Buenos Aires',     location: [-34.6037,  -58.3816], duration: '3 yrs' },
    { name: 'Madrid',           location: [40.4168,    -3.7038], duration: '1 yr' },
    { name: 'Luanda',           location: [-8.8147,    13.2302], duration: '3 yrs' },
    { name: 'Ho Chi Minh City', location: [10.8231,   106.6297], duration: '3 yrs' },
    { name: 'Vancouver',        location: [49.2827,  -123.1207], duration: '5 yrs' },
    { name: 'Sydney',           location: [-33.8688,  151.2093], duration: '6 mo'  },
  ];

  // Fixed globe tilt — no vertical drag in this implementation
  const THETA = 0.2;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  let phi = 0;
  let isDragging = false, dragStartX = 0, dragStartPhi = 0;
  let globeReady = false;
  let globe = null;

  // Build per-city label elements inside the wrapper
  const labelsContainer = document.createElement('div');
  labelsContainer.className = 'about__city-labels';
  labelsContainer.setAttribute('aria-hidden', 'true');
  wrapper.appendChild(labelsContainer);

  const labelEls = CITIES.map(city => {
    const el = document.createElement('div');
    el.className = 'about__city-label';
    el.innerHTML = `<span class="about__city-name">${city.name}</span><span class="about__city-duration">${city.duration}</span><span class="about__city-label-caret"></span>`;
    labelsContainer.appendChild(el);
    return el;
  });

  // Project each city marker to 2D canvas space and show/hide its label
  function updateLabels(currentPhi) {
    const R = canvas.offsetWidth / 2;
    if (R === 0) return;

    const cy = Math.cos(currentPhi), sy = Math.sin(currentPhi);
    const cx = Math.cos(THETA),      sx = Math.sin(THETA);

    CITIES.forEach((city, i) => {
      const label = labelEls[i];
      const latR = city.location[0] * Math.PI / 180;
      const lngR = city.location[1] * Math.PI / 180;

      // Cobe's coordinate system
      const p0 =  Math.cos(latR) * Math.cos(lngR);
      const p1 =  Math.sin(latR);
      const p2 = -Math.cos(latR) * Math.sin(lngR);

      // Cobe's exact combined rotation: Rφ (Y) then Rθ (X)
      const rx =  cy * p0 + sy * p2;
      const ry =  sy * sx * p0 + cx * p1 - cy * sx * p2;
      const rz = -sy * cx * p0 + sx * p1 + cy * cx * p2;

      if (rz > 0) {
        label.style.left = (R + rx * R * 0.8) + 'px';
        label.style.top  = (R - ry * R * 0.8) + 'px';
        label.classList.add('is-visible');
      } else {
        label.classList.remove('is-visible');
      }
    });
  }

  function initGlobe() {
    if (globe) return;
    const w = wrapper.offsetWidth;
    if (w === 0) return;

    globe = createGlobe(canvas, {
      devicePixelRatio: dpr,
      width:  w * dpr,
      height: w * dpr,
      phi: 0,
      theta: THETA,
      dark: 0,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor:   [1.0,  1.0,  0.94],
      markerColor: [1.0,  0.48, 0.12],   // orange
      glowColor:   [0.992, 0.965, 0.929],
      markers: CITIES.map(c => ({ location: c.location, size: 0.05 })),
      onRender(state) {
        if (!isDragging && !prefersReducedMotion) phi += 0.003;
        state.phi = phi;
        updateLabels(phi);
        if (!globeReady) {
          globeReady = true;
          wrapper.classList.add('globe-ready');
        }
      },
    });
  }

  initGlobe();
  if (!globe) {
    const ro = new ResizeObserver(() => {
      initGlobe();
      if (globe) ro.disconnect();
    });
    ro.observe(wrapper);
  }

  // Drag to rotate — positive deltaX increases phi (drag right = globe rotates right)
  canvas.addEventListener('pointerdown', e => {
    isDragging   = true;
    dragStartX   = e.clientX;
    dragStartPhi = phi;
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener('pointermove', e => {
    if (!isDragging) return;
    phi = dragStartPhi + (e.clientX - dragStartX) / 300;
  });
  canvas.addEventListener('pointerup',     () => { isDragging = false; });
  canvas.addEventListener('pointercancel', () => { isDragging = false; });

} catch (err) {
  console.warn('[about-globe] Globe unavailable:', err);
}
})();
