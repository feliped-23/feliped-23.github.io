/* ======================================================================
   About page globe — auto-touring version.

   Behaviour:
   - The globe slowly rotates to face each city in order.
   - When it arrives, it HOLDS for a fixed time: the city's label grows +
     turns accent, and that city's photo cross-fades into a fixed panel
     beside the globe.
   - Then it moves on to the next city. Every city gets the same hold time.
   - Dragging interrupts the tour; it resumes ~4s after you let go.

   Coordinate math (target phi) is derived from the same COBE rotation the
   sibling landing-page globe uses (see src/js/about-globe.js): a city is
   centre-facing (rx = 0, rz maximal) when  phi = -PI/2 - lngRadians.
   Loaded as a CLASSIC script (not type="module") so it also works when the
   page is opened directly via file:// — module scripts are CORS-blocked under
   file://, but a classic script's dynamic import() of an https URL is not.
   ====================================================================== */
(async () => {
try {
  const { default: createGlobe } = await import('https://esm.sh/cobe@0.6.3');

  const canvas = document.getElementById('about-globe');
  if (!canvas) throw new Error('canvas not found');
  const wrapper = canvas.parentElement;

  // Each city carries the photo + caption shown while the globe holds on it.
  const CITIES = [
    { name: 'Bogotá',           location: [4.7110,    -74.0721], duration: '2002–2005 · 5 yrs',
      image: 'content/about me/assets/familia.jpg',        caption: 'Born in Colombia — where it all began.' },
    { name: 'Aberdeen',         location: [57.1497,    -2.0943], duration: '2005–2008 · 3 yrs',
      image: 'content/about me/assets/scotland_fam.jpg',   caption: 'First move abroad — Scotland, age 3.' },
    { name: 'Buenos Aires',     location: [-34.6037,  -58.3816], duration: '2008–2011 · 3 yrs',
      image: 'content/about me/assets/image_soon.png',     caption: 'Argentina — the football years.' },
    { name: 'Madrid',           location: [40.4168,    -3.7038], duration: '2011–2012 · 1 yr',
      image: 'content/about me/assets/image_soon.png',     caption: 'A year in Spain.' },
    { name: 'Luanda',           location: [-8.8147,    13.2302], duration: '2012–2015 · 3 yrs',
      image: 'content/about me/assets/afa.jpg',            caption: 'Angola — training at the football academy.' },
    { name: 'Ho Chi Minh City', location: [10.8231,   106.6297], duration: '2015–2018 · 3 yrs',
      image: 'content/about me/assets/MRISA_JR.jpeg',      caption: 'Vietnam — teenage years across Southeast Asia.' },
    { name: 'Vancouver',        location: [49.2827,  -123.1207], duration: '2021–present · 5 yrs',
      image: 'content/about me/assets/grad_w_parents.jpeg', caption: 'Canada — engineering at UBC.' },
    { name: 'Sydney',           location: [-33.8688,  151.2093], duration: '2024–2025 · 6 mo',
      image: 'content/about me/assets/sydney_skyline.jpg', caption: 'Australia — study exchange down under.' },
  ];

  // Fixed globe tilt — matches the landing-page globe.
  const THETA = 0.2;

  // Tour timing.
  const HOLD_FRAMES          = 135;   // ~2.25s at 60fps (0.5s shorter than before) — same for every city
  const APPROACH_RATE        = 0.045; // ease-toward factor per frame during the automatic tour
  const MANUAL_APPROACH_RATE = 0.18;  // much snappier rotation when the user clicks an arrow
  const ARRIVE_EPS           = 0.02;  // "close enough" to be considered arrived
  const RESUME_MS            = 4000;  // resume auto-tour this long after a manual arrow click

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  let phi = 0;
  let manualMode = false;           // true while the user is stepping with arrows
  let approachRate = APPROACH_RATE; // current spin speed (bumped up for manual clicks)
  let resumeTimer = null;
  let globeReady = false;
  let globe = null;

  // Tour state machine.
  let state = 'spinning';           // 'spinning' | 'holding'
  let currentIndex = 0;
  let holdFrames = 0;
  let targetPhi = computeTargetPhi(CITIES[0]);

  // Centre-facing phi for a city (see header comment for derivation).
  function computeTargetPhi(city) {
    const lngR = city.location[1] * Math.PI / 180;
    return -Math.PI / 2 - lngR;
  }

  // Wrap an angle to [-PI, PI] so we always rotate the short way.
  function normalizeAngle(a) {
    while (a >  Math.PI) a -= 2 * Math.PI;
    while (a < -Math.PI) a += 2 * Math.PI;
    return a;
  }

  /* ---- Floating city labels (over the canvas) ---- */
  const labelsContainer = document.createElement('div');
  labelsContainer.className = 'about__city-labels';
  labelsContainer.setAttribute('aria-hidden', 'true');
  wrapper.appendChild(labelsContainer);

  const labelEls = CITIES.map(city => {
    const el = document.createElement('div');
    el.className = 'about__city-label';
    el.innerHTML =
      `<span class="about__city-name">${city.name}</span>` +
      `<span class="about__city-duration">${city.duration.split(' · ')[1] || city.duration}</span>` +
      `<span class="about__city-label-caret"></span>`;
    labelsContainer.appendChild(el);
    return el;
  });

  /* ---- Image panel (fixed beside the globe) ---- */
  const panel = document.getElementById('globe-tour-panel');
  const panelImgA = panel?.querySelector('.globe-tour__img--a');
  const panelImgB = panel?.querySelector('.globe-tour__img--b');
  const panelName = panel?.querySelector('.globe-tour__city');
  const panelDur  = panel?.querySelector('.globe-tour__years');
  const panelCap  = panel?.querySelector('.globe-tour__caption');
  let activeImgIsA = true;

  // Cross-fade the panel photo + swap the caption text.
  function showCityImage(i) {
    const city = CITIES[i];
    if (!panel) return;

    const incoming = activeImgIsA ? panelImgB : panelImgA;
    const outgoing = activeImgIsA ? panelImgA : panelImgB;
    if (incoming) {
      incoming.src = city.image;
      incoming.alt = `${city.name} — ${city.caption}`;
      incoming.classList.add('is-visible');
    }
    if (outgoing) outgoing.classList.remove('is-visible');
    activeImgIsA = !activeImgIsA;

    if (panelName) panelName.textContent = city.name;
    if (panelDur)  panelDur.textContent  = city.duration.split(' · ')[0];
    if (panelCap)  panelCap.textContent  = city.caption;
    panel.classList.add('is-active');
  }

  // Project each city marker to 2D canvas space; grow the active one.
  function updateLabels(currentPhi) {
    const R = canvas.offsetWidth / 2;
    if (R === 0) return;

    const cy = Math.cos(currentPhi), sy = Math.sin(currentPhi);
    const cx = Math.cos(THETA),      sx = Math.sin(THETA);

    CITIES.forEach((city, i) => {
      const label = labelEls[i];
      const latR = city.location[0] * Math.PI / 180;
      const lngR = city.location[1] * Math.PI / 180;

      const p0 =  Math.cos(latR) * Math.cos(lngR);
      const p1 =  Math.sin(latR);
      const p2 = -Math.cos(latR) * Math.sin(lngR);

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

      // Highlight only the city currently being toured & held on.
      label.classList.toggle('is-active', i === currentIndex && state === 'holding');
    });
  }

  // Jump the tour to a specific city. `manual` = triggered by an arrow click,
  // which pauses auto-advance and schedules a resume after RESUME_MS.
  function goTo(index, manual) {
    currentIndex = ((index % CITIES.length) + CITIES.length) % CITIES.length;

    if (prefersReducedMotion) {
      // No rotation animation — snap straight to the city and show it.
      phi = computeTargetPhi(CITIES[currentIndex]);
      targetPhi = phi;
      state = 'holding';
      holdFrames = HOLD_FRAMES;
      showCityImage(currentIndex);
      return;
    }

    // Keep targetPhi on the same winding as phi so we never spin the long way.
    targetPhi = phi + normalizeAngle(computeTargetPhi(CITIES[currentIndex]) - phi);
    state = 'spinning';
    // Snap quickly on a manual click; keep the gentle pace for the auto-tour.
    approachRate = manual ? MANUAL_APPROACH_RATE : APPROACH_RATE;

    if (manual) {
      manualMode = true;
      if (resumeTimer) clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => { manualMode = false; }, RESUME_MS);
    }
  }

  // Advance the tour one frame.
  function stepTour() {
    if (prefersReducedMotion) return;

    if (state === 'spinning') {
      const diff = normalizeAngle(targetPhi - phi);
      if (Math.abs(diff) < ARRIVE_EPS) {
        phi = targetPhi;
        state = 'holding';
        holdFrames = HOLD_FRAMES;
        showCityImage(currentIndex);
      } else {
        phi += diff * approachRate;
      }
    } else { // holding
      if (manualMode) return;   // user is in control — wait for the next arrow click
      holdFrames--;
      if (holdFrames <= 0) goTo(currentIndex + 1, false);
    }
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
      onRender(stateObj) {
        stepTour();
        stateObj.phi = phi;
        updateLabels(phi);
        if (!globeReady) {
          globeReady = true;
          wrapper.classList.add('globe-ready');
          // Prime the panel with the first city immediately.
          if (state === 'holding') showCityImage(currentIndex);
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

  /* ---- Arrow controls — the ONLY way to move the globe here (no mouse drag) ---- */
  const prevBtn = document.getElementById('globe-prev');
  const nextBtn = document.getElementById('globe-next');
  prevBtn?.addEventListener('click', () => goTo(currentIndex - 1, true));
  nextBtn?.addEventListener('click', () => goTo(currentIndex + 1, true));

  // If reduced motion is on, don't auto-tour — park on the first city and
  // show its image with no movement (arrows still work via goTo's snap path).
  if (prefersReducedMotion) {
    phi = targetPhi;
    state = 'holding';
    holdFrames = HOLD_FRAMES;
    showCityImage(currentIndex);
  }

} catch (err) {
  console.warn('[about-page-globe] Globe unavailable:', err);
}
})();
