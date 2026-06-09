/* ═══ 02-landing · SaaS minimalist — interacțiuni (Vanilla JS) ═══ */
(function () {
  'use strict';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var header = $('#header');
  var onScroll = function () { if (header) header.classList.toggle('scrolled', window.scrollY > 8); };
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });

  var burger = $('#burger'), nav = $('#navLinks');
  if (burger && nav) {
    burger.addEventListener('click', function () { var o = nav.classList.toggle('open'); burger.setAttribute('aria-expanded', String(o)); });
    $$('#navLinks a').forEach(function (a) { a.addEventListener('click', function () { nav.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }); });
  }

  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    $$('.reveal').forEach(function (el) { io.observe(el); });
  } else { $$('.reveal').forEach(function (el) { el.classList.add('in'); }); }

  /* Contoare (doar valori numerice) */
  function countUp(el) {
    var raw = el.getAttribute('data-count') || el.textContent;
    var num = parseFloat(raw.replace(/[^0-9.]/g, ''));
    if (isNaN(num) || reduce) { el.textContent = raw; return; }
    var suffix = raw.replace(/[0-9.,\s]/g, ''), start = null, dur = 1300;
    function step(ts) { if (!start) start = ts; var p = Math.min((ts - start) / dur, 1); var e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(num * e) + suffix; if (p < 1) requestAnimationFrame(step); }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { countUp(e.target); cio.unobserve(e.target); } }); }, { threshold: 0.6 });
    $$('[data-count]').forEach(function (el) { cio.observe(el); });
  }

  /* FAQ single-open */
  var qa = $$('.qa');
  qa.forEach(function (d) { d.addEventListener('toggle', function () { if (d.open) qa.forEach(function (o) { if (o !== d) o.open = false; }); }); });

  /* Form async */
  var form = $('#cform'), status = $('#fstatus');
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (form.botcheck && form.botcheck.value) return;
    var key = form.access_key ? form.access_key.value : '';
    if (key.indexOf('INLOCUIESTE') === 0) { status.textContent = 'Demo: setează cheia Web3Forms.'; status.className = 'fstatus err'; return; }
    var btn = form.querySelector('button[type=submit]'), label = btn.innerHTML;
    btn.disabled = true; btn.style.opacity = '.7'; status.textContent = 'Se trimite…'; status.className = 'fstatus';
    fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
      .then(function (r) { return r.json(); })
      .then(function (d) { if (d.success) { status.textContent = 'Mulțumim! Te contactăm rapid.'; status.className = 'fstatus ok'; form.reset(); } else { status.textContent = 'Eroare. Sună-ne direct.'; status.className = 'fstatus err'; } })
      .catch(function () { status.textContent = 'Conexiune eșuată. Încearcă din nou.'; status.className = 'fstatus err'; })
      .finally(function () { btn.disabled = false; btn.style.opacity = ''; btn.innerHTML = label; });
  });
})();
