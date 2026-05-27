/* ═══════════════════════════════════════════
   MANTOOR GROUP — MAIN JS v2
   ═══════════════════════════════════════════ */
'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initHeroCarousel();
  initNavbar();
  initMobileMenu();
  initScrollReveal();
  initCounters();
  initTestimonialsSlider();
  initVillaTypesSlider();
  initContactForm();
  initFloatingCTA();
  initSmoothScroll();
  initParallax();
  initRipple();
  initLocationAccordion();
});

/* ═══════════════════════════════════════════
   1. HERO CAROUSEL
   ═══════════════════════════════════════════ */
function initHeroCarousel() {
  const carousel = document.querySelector('.hero-carousel');
  if (!carousel) return;

  const slides   = Array.from(carousel.querySelectorAll('.hc-slide'));
  const dotsWrap = carousel.querySelector('.hc-dots');
  const prevBtn  = carousel.querySelector('.hc-prev');
  const nextBtn  = carousel.querySelector('.hc-next');
  const total    = slides.length;
  let current    = 0;
  let timer;

  // Swap desktop / mobile images based on viewport width
  function setSlideImages() {
    const isMobile = window.innerWidth < 768;
    slides.forEach(slide => {
      const src = isMobile ? slide.dataset.mobile : slide.dataset.desktop;
      const img = slide.querySelector('.hc-slide-img');
      if (src && img) img.src = src;
    });
  }
  setSlideImages();

  // Debounced resize handler
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(setSlideImages, 150);
  }, { passive: true });

  // Build dots dynamically
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'hc-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.addEventListener('click', () => { goTo(i); resetTimer(); });
    dotsWrap.appendChild(dot);
  });

  const dots = Array.from(dotsWrap.querySelectorAll('.hc-dot'));

  function goTo(idx) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (idx + total) % total;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startTimer() { timer = setInterval(next, 5000); }
  function resetTimer()  { clearInterval(timer); startTimer(); }

  prevBtn.addEventListener('click', () => { prev(); resetTimer(); });
  nextBtn.addEventListener('click', () => { next(); resetTimer(); });

  // Pause auto-play on hover
  carousel.addEventListener('mouseenter', () => clearInterval(timer));
  carousel.addEventListener('mouseleave', startTimer);

  // Swipe support for touch devices
  let touchStartX = 0;
  carousel.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  carousel.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? next() : prev(); resetTimer(); }
  });

  startTimer();
}

/* ═══════════════════════════════════════════
   2. NAVBAR — shrink on scroll
   ═══════════════════════════════════════════ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  // Always show cream navbar — no transparent blended state
  navbar.classList.add('scrolled');
  const update = () => navbar.classList.toggle('scrolled', window.scrollY >= 0);
  window.addEventListener('scroll', update, { passive: true });
}

/* ═══════════════════════════════════════════
   3. MOBILE MENU
   ═══════════════════════════════════════════ */
function initMobileMenu() {
  const btn     = document.getElementById('hamburgerBtn');
  const menu    = document.getElementById('mobileMenu');
  const overlay = document.getElementById('mobileOverlay');
  const close   = document.getElementById('mobileClose');
  if (!btn) return;

  const open  = () => { menu.classList.add('active'); overlay.classList.add('active'); btn.classList.add('active'); document.body.style.overflow = 'hidden'; };
  const shut  = () => { menu.classList.remove('active'); overlay.classList.remove('active'); btn.classList.remove('active'); document.body.style.overflow = ''; };

  btn.addEventListener('click', open);
  close.addEventListener('click', shut);
  overlay.addEventListener('click', shut);
  document.querySelectorAll('.mobile-link').forEach(l => l.addEventListener('click', shut));
  document.addEventListener('keydown', e => e.key === 'Escape' && shut());

  // Sub-dropdowns
  document.querySelectorAll('.mobile-dropdown-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
      const sub = toggle.nextElementSibling;
      const was = sub.classList.contains('open');
      document.querySelectorAll('.mobile-dropdown.open').forEach(d => d.classList.remove('open'));
      document.querySelectorAll('.mobile-dropdown-toggle.open').forEach(t => t.classList.remove('open'));
      if (!was) { sub.classList.add('open'); toggle.classList.add('open'); }
    });
  });
}

/* ═══════════════════════════════════════════
   4. SCROLL REVEAL — staggered + types
   ═══════════════════════════════════════════ */
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      // Stagger siblings within same parent
      const siblings = Array.from(
        entry.target.parentElement.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale')
      );
      const idx = siblings.indexOf(entry.target);
      const delay = Math.min(idx * 90, 450);

      setTimeout(() => entry.target.classList.add('visible'), delay);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.10, rootMargin: '0px 0px -50px 0px' });

  els.forEach(el => observer.observe(el));
}

/* ═══════════════════════════════════════════
   5. COUNTER ANIMATION
   ═══════════════════════════════════════════ */
function initCounters() {
  const counters = document.querySelectorAll('[data-target]');
  if (!counters.length) return;

  const easeOut = t => 1 - Math.pow(1 - t, 4);

  const animate = el => {
    const target   = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const start    = performance.now();
    const tick = now => {
      const p = Math.min((now - start) / duration, 1);
      el.textContent = Math.round(easeOut(p) * target).toLocaleString('en-IN');
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { animate(e.target); obs.unobserve(e.target); } });
  }, { threshold: 0.5 });

  counters.forEach(c => obs.observe(c));
}

/* ═══════════════════════════════════════════
   6. TESTIMONIALS — always-2-up slider
   ═══════════════════════════════════════════ */
function initTestimonialsSlider() {
  const track   = document.getElementById('testimonialsTrack');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dotsWrap = document.getElementById('sliderDots');
  if (!track) return;

  const cards        = Array.from(track.children);
  const TOTAL        = cards.length;          // 5
  const PER_PAGE     = () => window.innerWidth <= 900 ? 1 : 2;
  let   current      = 0;
  let   autoTimer    = null;
  let   touchStartX  = 0;

  // How many "pages" of slides
  const pages = () => Math.ceil(TOTAL / PER_PAGE());

  /* ── Build dot buttons ── */
  const buildDots = () => {
    dotsWrap.innerHTML = '';
    for (let i = 0; i < pages(); i++) {
      const d = document.createElement('button');
      d.className = 'slider-dot' + (i === current ? ' active' : '');
      d.setAttribute('aria-label', `Go to slide group ${i + 1}`);
      d.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(d);
    }
  };

  const updateDots = () => {
    dotsWrap.querySelectorAll('.slider-dot').forEach((d, i) =>
      d.classList.toggle('active', i === current)
    );
  };

  /* ── Move to page ── */
  const goTo = idx => {
    current = Math.max(0, Math.min(idx, pages() - 1));
    const pp   = PER_PAGE();
    const vpW  = track.parentElement.offsetWidth;
    const cardW = pp === 1 ? vpW : Math.floor((vpW - 24) / 2);
    // Set card widths explicitly in pixels — avoids CSS % resolution ambiguity on mobile
    cards.forEach(card => {
      card.style.flexBasis = cardW + 'px';
      card.style.minWidth  = cardW + 'px';
    });
    const offset = current * (cardW + 24) * pp;
    track.style.transform = `translateX(-${offset}px)`;
    updateDots();
  };

  const next = () => goTo(current < pages() - 1 ? current + 1 : 0);
  const prev = () => goTo(current > 0 ? current - 1 : pages() - 1);

  /* ── Autoplay ── */
  const startAuto = () => { clearInterval(autoTimer); autoTimer = setInterval(next, 4500); };
  const stopAuto  = () => clearInterval(autoTimer);

  prevBtn.addEventListener('click', () => { prev(); startAuto(); });
  nextBtn.addEventListener('click', () => { next(); startAuto(); });

  /* ── Touch swipe ── */
  track.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; stopAuto(); }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 48) diff > 0 ? next() : prev();
    startAuto();
  });

  /* ── Pause on hover ── */
  track.addEventListener('mouseenter', stopAuto);
  track.addEventListener('mouseleave', startAuto);

  /* ── Keyboard ── */
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') { prev(); startAuto(); }
    if (e.key === 'ArrowRight') { next(); startAuto(); }
  });

  /* ── Recalc on resize ── */
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      buildDots();
      goTo(Math.min(current, pages() - 1));
    }, 150);
  });

  buildDots();
  goTo(0);
  startAuto();
}

/* ═══════════════════════════════════════════
   7. CONTACT FORM — validate + submit
   ═══════════════════════════════════════════ */
function initContactForm() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  const validate = () => {
    let ok = true;
    const fields = [
      { id: 'name',  errId: 'nameError',  check: v => v.trim().length >= 2, msg: 'Please enter your full name.' },
      { id: 'phone', errId: 'phoneError', check: v => v.replace(/\D/g,'').length >= 10, msg: 'Please enter a valid 10-digit number.' },
      { id: 'email', errId: 'emailError', check: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()), msg: 'Please enter a valid email.' },
    ];
    fields.forEach(({ id, errId, check, msg }) => {
      const el  = document.getElementById(id);
      const err = document.getElementById(errId);
      if (!el || !err) return;
      el.classList.remove('error');
      err.textContent = '';
      err.classList.remove('visible');
      if (!check(el.value)) {
        el.classList.add('error');
        err.textContent = msg;
        err.classList.add('visible');
        ok = false;
      }
    });
    return ok;
  };

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!validate()) return;
    const btn = form.querySelector('.form-submit');
    btn.disabled = true;
    btn.querySelector('span').textContent = 'Sending…';

    // Collect form data and open mailto to info@mantoorgroup.com
    const name  = (document.getElementById('name')?.value  || '').trim();
    const phone = (document.getElementById('phone')?.value || '').trim();
    const email = (document.getElementById('email')?.value || '').trim();
    const config = (document.getElementById('config')?.value || '');
    const project = document.title.replace(' | Mantoor Group', '');
    const bodyLines = [
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Email: ${email}`,
      config ? `Configuration: ${config}` : '',
      `Project: ${project}`,
    ].filter(Boolean).join('\n');
    const subject = encodeURIComponent(`New Enquiry — ${project}`);
    const body    = encodeURIComponent(bodyLines);
    window.open(`mailto:info@mantoorgroup.com?subject=${subject}&body=${body}`);

    setTimeout(() => {
      form.style.display = 'none';
      success.classList.add('visible');
      success.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 1100);
  });

  ['name','phone','email'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('blur', () => el.value && validate());
  });
}

/* ═══════════════════════════════════════════
   8. FLOATING CTA — show after scroll
   ═══════════════════════════════════════════ */
function initFloatingCTA() {
  const bar = document.getElementById('floatingCta');
  if (!bar) return;
  let visible = false;
  const update = () => {
    const show = window.scrollY > 360;
    if (show !== visible) { visible = show; bar.classList.toggle('visible', visible); }
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ═══════════════════════════════════════════
   9. SMOOTH SCROLL — anchor links
   ═══════════════════════════════════════════ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 80;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH, behavior: 'smooth' });
    });
  });
}

/* ═══════════════════════════════════════════
   10. PARALLAX — subtle hero bg shift
   ═══════════════════════════════════════════ */
function initParallax() {
  const bg = document.getElementById('heroBg');
  if (!bg || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < window.innerHeight) bg.style.transform = `scale(1) translateY(${y * 0.25}px)`;
  }, { passive: true });
}

/* ═══════════════════════════════════════════
   11. VILLA TYPES SLIDER
   ═══════════════════════════════════════════ */
function initVillaTypesSlider() {
  const track    = document.getElementById('villaTrack');
  const prevBtn  = document.getElementById('villaPrev');
  const nextBtn  = document.getElementById('villaNext');
  const dotsWrap = document.getElementById('villaDots');
  // Guard ALL elements — a missing one would throw TypeError and crash
  // the rest of DOMContentLoaded (including the accordion)
  if (!track || !prevBtn || !nextBtn || !dotsWrap) return;

  const cards   = Array.from(track.children);
  const TOTAL   = cards.length;
  const perPage = () => window.innerWidth <= 640 ? 1 : 2;
  let current   = 0;
  let autoTimer = null;

  const pages = () => Math.ceil(TOTAL / perPage());

  /* Set flex-basis (not just width) in pixels.
     CSS flex-basis: calc(50% - 8px) doesn't resolve when the flex
     container (track) has no explicit width. Inline flexBasis overrides it. */
  const applyWidths = () => {
    const pp    = perPage();
    const gap   = 16;
    const vpW   = track.parentElement.offsetWidth;
    const cardW = pp === 1 ? vpW : Math.floor((vpW - gap) / 2);
    cards.forEach(card => {
      card.style.flexBasis = cardW + 'px';
      card.style.minWidth  = cardW + 'px';
    });
    return { cardW, gap, pp };
  };

  const buildDots = () => {
    dotsWrap.innerHTML = '';
    for (let i = 0; i < pages(); i++) {
      const d = document.createElement('button');
      d.setAttribute('type', 'button');
      d.className = 'villa-dot' + (i === current ? ' active' : '');
      d.setAttribute('aria-label', 'Villa type ' + (i + 1));
      d.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(d);
    }
  };

  const updateDots = () => {
    dotsWrap.querySelectorAll('.villa-dot').forEach((d, i) =>
      d.classList.toggle('active', i === current)
    );
  };

  const goTo = idx => {
    current = Math.max(0, Math.min(idx, pages() - 1));
    const { cardW, gap, pp } = applyWidths();
    // Each page contains `pp` cards; offset by pages * (cardW + gap) * pp
    const offset = current * pp * (cardW + gap);
    track.style.transform = 'translateX(-' + offset + 'px)';
    updateDots();
  };

  const next = () => goTo(current < pages() - 1 ? current + 1 : 0);
  const prev = () => goTo(current > 0 ? current - 1 : pages() - 1);

  const startAuto = () => { clearInterval(autoTimer); autoTimer = setInterval(next, 3500); };
  const stopAuto  = () => clearInterval(autoTimer);

  prevBtn.addEventListener('click', () => { prev(); startAuto(); });
  nextBtn.addEventListener('click', () => { next(); startAuto(); });
  track.addEventListener('mouseenter', stopAuto);
  track.addEventListener('mouseleave', startAuto);

  let touchX = 0;
  track.addEventListener('touchstart', e => { touchX = e.changedTouches[0].clientX; stopAuto(); }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
    startAuto();
  }, { passive: true });

  let resizeT;
  window.addEventListener('resize', () => {
    clearTimeout(resizeT);
    resizeT = setTimeout(() => { buildDots(); goTo(Math.min(current, pages() - 1)); }, 150);
  });

  buildDots();
  goTo(0);
  startAuto();
}

/* ═══════════════════════════════════════════
   12. LOCATION ACCORDION
   ═══════════════════════════════════════════ */
function initLocationAccordion() {
  const items = document.querySelectorAll('.loc-acc-item');
  if (!items.length) return;

  const setBody = (item, open) => {
    item.classList.toggle('open', open);
    const body = item.querySelector('.loc-acc-body');
    if (body) body.style.display = open ? 'block' : 'none';
  };

  // Apply initial state from HTML (first item has class "open")
  items.forEach(item => setBody(item, item.classList.contains('open')));

  items.forEach(item => {
    const toggle = item.querySelector('.loc-acc-toggle');
    if (!toggle) return;
    toggle.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // Close all
      items.forEach(i => setBody(i, false));
      // Toggle: open only if it was previously closed
      if (!isOpen) setBody(item, true);
    });
  });
}

/* ═══════════════════════════════════════════
   12. RIPPLE — click effect on buttons
   ═══════════════════════════════════════════ */
function initRipple() {
  const style = document.createElement('style');
  style.textContent = '@keyframes rippleAnim { to { transform: scale(3.5); opacity: 0; } }';
  document.head.appendChild(style);

  document.addEventListener('click', e => {
    const btn = e.target.closest('.btn-primary, .btn-gold, .btn-outline, .btn-outline-white, .slider-btn');
    if (!btn) return;
    const ripple = document.createElement('span');
    const rect   = btn.getBoundingClientRect();
    const size   = Math.max(rect.width, rect.height);
    Object.assign(ripple.style, {
      position: 'absolute',
      width: size + 'px', height: size + 'px',
      left: (e.clientX - rect.left - size / 2) + 'px',
      top:  (e.clientY - rect.top  - size / 2) + 'px',
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.22)',
      transform: 'scale(0)',
      pointerEvents: 'none',
      animation: 'rippleAnim 0.55s ease-out forwards',
    });
    if (getComputedStyle(btn).position === 'static') btn.style.position = 'relative';
    btn.style.overflow = 'hidden';
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
}
