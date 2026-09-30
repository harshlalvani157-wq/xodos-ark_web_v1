import { LiquidGlass } from './vendor/liquidglass.js';

/* XoDos-Ark — progressive enhancement and liquid glass integration */
(function () {
  'use strict';

  var els = document.querySelectorAll('.rv');
  if (!('IntersectionObserver' in window)) {
    for (var i = 0; i < els.length; i++) els[i].classList.add('in');
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
  }

  var toggle = document.getElementById('navToggle');
  var menu = document.getElementById('navMenu');
  if (toggle && menu) {
    function closeMenu() {
      menu.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    menu.addEventListener('click', function (event) {
      if (event.target.closest('a')) closeMenu();
    });
    document.addEventListener('click', function (event) {
      if (!menu.contains(event.target) && !toggle.contains(event.target)) closeMenu();
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeMenu();
    });
  }

  // The library requires glass elements to be direct children of their root.
  // Initialize one instance per existing page group without changing layout.
  var groups = [
    { root: document.querySelector('.hero'), selector: '.badge' },
    { root: document.querySelector('nav'), selector: '.nav-inner' },
    { root: document.querySelector('.cards'), selector: '.card' },
    { root: document.querySelector('.steps'), selector: '.step' },
    { root: document.querySelector('#download'), selector: '.dl-card' },
    { root: document.querySelector('footer .wrap'), selector: '.glass' }
  ];

  groups.forEach(function (group) {
    if (!group.root) return;
    var glassElements = group.root.querySelectorAll(':scope > ' + group.selector);
    if (!glassElements.length) return;

    // The reference renderer samples sibling content inside its root. The
    // original page keeps its purple background outside these roots, so add a
    // visual scene sibling for the shader to sample instead of a blank canvas.
    var scene = document.createElement('div');
    scene.className = 'liquid-scene';
    scene.setAttribute('aria-hidden', 'true');
    group.root.insertBefore(scene, group.root.firstChild);
    group.root.classList.add('liquid-glass-root');

    glassElements.forEach(function (element) {
      var pill = element.classList.contains('badge');
      element.dataset.config = JSON.stringify({
        // Regular LiquidGlass look from the reference demo. Frosted mode
        // uses blurAmount: 0.25; dark mode uses brightness: -0.3.
        blurAmount: 0,
        refraction: 0.69,
        chromAberration: 0.05,
        edgeHighlight: 0.05,
        fresnel: 1,
        cornerRadius: pill ? 999 : 24,
        zRadius: pill ? 24 : 34,
        shadowOpacity: 0.3,
        shadowSpread: 10,
        brightness: 0,
        tintStrength: 0,
        saturation: 0
      });
      element.classList.add('liquid-glass-ready');
    });

    LiquidGlass.init({ root: group.root, glassElements: glassElements })
      .then(function () { group.root.classList.add('liquid-glass-active'); })
      .catch(function (error) {
        console.warn('LiquidGlass unavailable; using CSS glass fallback.', error);
      });
  });
}());
