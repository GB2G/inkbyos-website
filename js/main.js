/* InkbyOs — interactions
   - Sticky header state
   - Mobile hamburger / overlay menu
   - Scroll reveals
   - The continuous "thread": one line that draws down the whole landing page
   - Subtle hero parallax
   - Booking-form progressive enhancement
   Everything degrades gracefully and respects prefers-reduced-motion. */
(function () {
  'use strict';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ============================================================= Header state */
  var header = document.querySelector('.site-header');
  function headerState() {
    if (!header) return;
    if (window.scrollY > 24) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }

  /* ============================================================= Mobile menu */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.nav');
  if (toggle && nav) {
    var setMenu = function (open) {
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      nav.classList.toggle('open', open);
      document.body.classList.toggle('menu-open', open);
    };
    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });
    // Close on link click or Escape
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setMenu(false);
    });
    // Reset menu state if resized up to desktop
    window.addEventListener('resize', function () {
      if (window.innerWidth > 820) setMenu(false);
    });
  }

  /* ============================================================= Scroll reveals */
  var reveals = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ============================================================= The thread */
  var thread = document.querySelector('.thread');
  var threadPath = thread && thread.querySelector('.thread-path');
  var threadTip = thread && thread.querySelector('.thread-tip');
  var threadLen = 0;

  function buildThread() {
    if (!thread || !threadPath) return;
    var W = document.documentElement.clientWidth;
    var H = document.documentElement.scrollHeight;
    thread.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    thread.setAttribute('preserveAspectRatio', 'none');
    thread.style.height = H + 'px';

    // Collect anchor points: start below hero, then weave through sections.
    var pts = [];
    var hero = document.querySelector('.hero');
    var heroBottom = hero ? hero.offsetTop + hero.offsetHeight : 0;
    pts.push({ x: W * 0.5, y: heroBottom - 30 });

    var plan = [
      { sel: '#ethos', x: 0.16 },
      { sel: '#about', x: 0.84 },
      { sel: '#work',  x: 0.22 },
      { sel: '.cta-band', x: 0.72 }
    ];
    plan.forEach(function (p) {
      var el = document.querySelector(p.sel);
      if (!el) return;
      var top = el.getBoundingClientRect().top + window.scrollY;
      pts.push({ x: W * p.x, y: top + el.offsetHeight * 0.5 });
    });
    var footer = document.querySelector('.site-footer');
    if (footer) {
      var ft = footer.getBoundingClientRect().top + window.scrollY;
      pts.push({ x: W * 0.5, y: ft + 60 });
    }

    // Smooth cubic path with vertical control handles (flowing S-curves).
    var d = 'M ' + pts[0].x.toFixed(1) + ' ' + pts[0].y.toFixed(1);
    for (var i = 0; i < pts.length - 1; i++) {
      var p0 = pts[i], p1 = pts[i + 1];
      var dy = (p1.y - p0.y) * 0.5;
      d += ' C ' + p0.x.toFixed(1) + ' ' + (p0.y + dy).toFixed(1) +
           ', ' + p1.x.toFixed(1) + ' ' + (p1.y - dy).toFixed(1) +
           ', ' + p1.x.toFixed(1) + ' ' + p1.y.toFixed(1);
    }
    threadPath.setAttribute('d', d);
    threadLen = threadPath.getTotalLength();
    threadPath.style.strokeDasharray = threadLen;
    if (reduceMotion) { threadPath.style.strokeDashoffset = 0; }
    updateThread();
  }

  function updateThread() {
    if (!threadLen || reduceMotion) return;
    var H = document.documentElement.scrollHeight;
    var vh = window.innerHeight;
    // Draw the thread down to a point ~62% into the viewport — the tip leads
    // the reader as they scroll.
    var drawnY = window.scrollY + vh * 0.62;
    var frac = Math.max(0, Math.min(1, drawnY / H));
    var drawn = threadLen * frac;
    threadPath.style.strokeDashoffset = (threadLen - drawn).toFixed(1);
    if (threadTip) {
      if (drawn > 4 && frac < 0.995) {
        var pt = threadPath.getPointAtLength(drawn);
        threadTip.setAttribute('cx', pt.x.toFixed(1));
        threadTip.setAttribute('cy', pt.y.toFixed(1));
        threadTip.style.opacity = '1';
      } else {
        threadTip.style.opacity = '0';
      }
    }
  }

  /* ============================================================= Hero parallax */
  var heroImg = document.querySelector('.hero-media img');
  var heroInner = document.querySelector('.hero-inner');
  function heroParallax() {
    if (reduceMotion || !heroImg) return;
    var y = window.scrollY;
    var vh = window.innerHeight;
    if (y < vh * 1.1) {
      heroImg.style.transform = 'translate3d(0,' + (y * 0.16).toFixed(1) + 'px,0) scale(1.04)';
      if (heroInner) {
        heroInner.style.transform = 'translate3d(0,' + (y * 0.05).toFixed(1) + 'px,0)';
        heroInner.style.opacity = Math.max(0, 1 - y / (vh * 0.75)).toFixed(3);
      }
    }
  }

  /* ============================================================= Scroll loop */
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      headerState();
      updateThread();
      heroParallax();
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ============================================================= Init / resize */
  var resizeTimer;
  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(buildThread, 150);
  }
  window.addEventListener('resize', onResize);
  window.addEventListener('load', buildThread);
  if (document.readyState === 'complete') buildThread();

  headerState();
  buildThread();
  heroParallax();

  /* ============================================================= Booking form */
  var form = document.querySelector('form.book');
  if (form) {
    var msg = form.querySelector('.form-msg');
    form.addEventListener('submit', function (ev) {
      var action = form.getAttribute('action') || '';
      var usesPlaceholder = action.indexOf('YOUR_FORM_ID') !== -1 || action === '';
      if (usesPlaceholder) {
        ev.preventDefault();
        var data = new FormData(form);
        var lines = [];
        data.forEach(function (val, key) {
          if (String(val).trim() !== '') lines.push(key + ': ' + val);
        });
        var subject = 'Tattoo booking enquiry — ' + (data.get('first_name') || '') + ' ' + (data.get('last_name') || '');
        var body = encodeURIComponent(lines.join('\n'));
        if (msg) { msg.hidden = false; msg.textContent = 'Opening your email app…'; }
        window.location.href = 'mailto:inkbyos@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + body;
      }
    });
  }

  /* Footer year */
  var y = document.querySelector('[data-year]');
  if (y) y.textContent = new Date().getFullYear();
})();
