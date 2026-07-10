/* InkbyOs — interactions
   Kept deliberately small: one orchestrated moment (the drawing line),
   quiet scroll reveals, sticky-header state, progressive form enhancement. */
(function () {
  'use strict';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Sticky header state ---- */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      if (window.scrollY > 24) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---- Reveal on scroll ---- */
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

  /* ---- The signature line: draw on load ---- */
  var paths = document.querySelectorAll('.draw-line path');
  paths.forEach(function (p) {
    if (reduceMotion) return;
    var len = p.getTotalLength();
    p.style.strokeDasharray = len;
    p.style.strokeDashoffset = len;
    p.style.transition = 'stroke-dashoffset 2.4s cubic-bezier(0.22,1,0.36,1) 0.25s';
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { p.style.strokeDashoffset = '0'; });
    });
  });

  /* ---- Booking form: progressive enhancement ---- */
  var form = document.querySelector('form.book');
  if (form) {
    var msg = form.querySelector('.form-msg');
    form.addEventListener('submit', function (ev) {
      // If no real endpoint is configured, fall back to a mailto: draft
      // so the form is functional the moment the site is live.
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
      // Otherwise let the real form endpoint handle the POST natively.
    });
  }

  /* ---- Footer year ---- */
  var y = document.querySelector('[data-year]');
  if (y) y.textContent = new Date().getFullYear();
})();
