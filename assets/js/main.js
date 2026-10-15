/* Clarendon Advisory: menu toggle plus minimal scroll motion. */
(function () {
  'use strict';
  var root = document.documentElement;

  // Mobile menu (below 1200px). Tapping a link closes it.
  var header = document.querySelector('[data-header]');
  var toggle = document.querySelector('[data-menu-toggle]');
  var nav = document.querySelector('[data-nav]');
  function setOpen(open) {
    header.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  toggle.addEventListener('click', function () { setOpen(!header.classList.contains('is-open')); });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
  window.addEventListener('resize', function () { if (window.innerWidth >= 1200) setOpen(false); });

  if (!root.classList.contains('motion')) return;
  root.classList.add('motion-ready');

  function all(sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); }
  function show(el) { el.classList.add('is-in'); }

  // Fade-up reveals and line draws
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      show(e.target);
      io.unobserve(e.target);
    });
  }, { threshold: 0, rootMargin: '0px 0px -8% 0px' });
  all('[data-reveal], [data-draw]').forEach(function (el) { io.observe(el); });

  // Service cards get their quicker hover transition back once revealed
  all('.service').forEach(function (card) {
    card.addEventListener('transitionend', function done(e) {
      if (e.propertyName !== 'opacity' || !card.classList.contains('is-in')) return;
      card.classList.add('is-done');
      card.removeEventListener('transitionend', done);
    });
  });

  // "When to involve" rows fade in one by one
  var itemIo = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      show(e.target);
      itemIo.unobserve(e.target);
    });
  }, { threshold: 0, rootMargin: '0px 0px -18% 0px' });
  all('[data-item]').forEach(function (el) { itemIo.observe(el); });

  // Offset gold frames slide into place after their photo
  var frIo = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      show(e.target);
      frIo.unobserve(e.target);
    });
  }, { threshold: 0.2 });
  all('[data-frame]').forEach(function (el) { frIo.observe(el); });

  // Photographs: curtain wipe. Checked on scroll because a fully clipped
  // element is not reliably reported by IntersectionObserver.
  var pics = all('[data-photo]');
  function revealPics() {
    var vh = window.innerHeight;
    pics = pics.filter(function (p) {
      if (p.getBoundingClientRect().top < vh * 0.9) { show(p); return false; }
      return true;
    });
    if (!pics.length) window.removeEventListener('scroll', revealPics);
  }
  window.addEventListener('scroll', revealPics, { passive: true });
  setTimeout(revealPics, 100);

  // Hero: gentle parallax on the photograph, content eases back as you leave
  var hero = document.getElementById('top');
  var heroImg = document.querySelector('[data-hero-img]');
  var heroContent = document.querySelector('[data-hero-content]');
  if (hero && heroImg && heroContent) {
    heroImg.style.willChange = 'transform';
    var ticking = false;
    var onScroll = function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        ticking = false;
        var h = hero.offsetHeight;
        if (window.scrollY > h + 100) return;
        var y = Math.min(window.scrollY, h);
        heroImg.style.transform = 'translateY(' + (y * 0.28) + 'px) scale(' + (1 + y / h * 0.06) + ')';
        heroContent.style.transform = 'translateY(' + (y * 0.12) + 'px)';
        heroContent.style.opacity = String(1 - y / h * 0.9);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
})();
