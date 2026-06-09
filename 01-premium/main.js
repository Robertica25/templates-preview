/* ═══════════════════════════════════════════════════════════════════
   01-premium · Dark Mode Luxury — interacțiuni (Vanilla JS)
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(pointer: fine)').matches;

  /* Header scroll */
  var header = $('#header');
  var onScroll = function () { if (header) header.classList.toggle('scrolled', window.scrollY > 12); };
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });

  /* Mobile nav */
  var burger = $('#burger'), nav = $('#navLinks');
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', String(open));
    });
    $$('#navLinks a').forEach(function (a) {
      a.addEventListener('click', function () { nav.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); });
    });
  }

  /* Scroll reveal */
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
    $$('.reveal').forEach(function (el) { io.observe(el); });
  } else {
    $$('.reveal').forEach(function (el) { el.classList.add('in'); });
  }

  /* Butoane magnetice */
  if (fine && !reduceMotion) {
    $$('.magnetic').forEach(function (el) {
      var s = 0.35;
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - (r.left + r.width / 2)) * s;
        var y = (e.clientY - (r.top + r.height / 2)) * s;
        el.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)';
      });
      el.addEventListener('mouseleave', function () { el.style.transform = ''; });
    });
  }

  /* Contoare animate */
  function animateCount(el) {
    var raw = el.getAttribute('data-count') || el.textContent;
    var num = parseFloat(raw.replace(/[^0-9.]/g, ''));
    if (isNaN(num)) return;
    var suffix = raw.replace(/[0-9.,\s]/g, '');
    if (reduceMotion) { el.textContent = raw; return; }
    var dur = 1400, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = num * eased;
      el.textContent = (num % 1 === 0 ? Math.round(val) : val.toFixed(1)) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { animateCount(en.target); cio.unobserve(en.target); } });
    }, { threshold: 0.6 });
    $$('[data-count]').forEach(function (el) { cio.observe(el); });
  }

  /* FAQ — single open (accordion) */
  var details = $$('.qa');
  details.forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (d.open) details.forEach(function (o) { if (o !== d) o.open = false; });
    });
  });

  /* Formular async (Web3Forms) */
  var form = $('#cform'), status = $('#fstatus');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (form.botcheck && form.botcheck.value) return;
      var key = form.access_key ? form.access_key.value : '';
      if (key.indexOf('INLOCUIESTE') === 0) {
        status.textContent = 'Demo: setează cheia Web3Forms pentru a primi mesaje.'; status.className = 'fstatus err'; return;
      }
      var btn = form.querySelector('button[type=submit]'); var label = btn.innerHTML;
      btn.disabled = true; btn.style.opacity = '.7'; status.textContent = 'Se trimite…'; status.className = 'fstatus';
      fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        .then(function (r) { return r.json(); })
        .then(function (d) {
          if (d.success) { status.textContent = 'Mulțumim! Te contactăm în curând.'; status.className = 'fstatus ok'; form.reset(); }
          else { status.textContent = 'A apărut o eroare. Scrie-ne direct pe email.'; status.className = 'fstatus err'; }
        })
        .catch(function () { status.textContent = 'Conexiune eșuată. Încearcă din nou.'; status.className = 'fstatus err'; })
        .finally(function () { btn.disabled = false; btn.style.opacity = ''; btn.innerHTML = label; });
    });
  }

  /* An curent */
  var y = $('#year'); if (y) y.textContent = new Date().getFullYear();
})();
